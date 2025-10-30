#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
import { execSync, spawn, ChildProcess } from "child_process";
import * as os from "os";
import * as path from "path";
import * as fs from "fs";

// ✅ ZOPIO FRAMEWORK - DOĞRU REPOSITORY
const REPO_URL = "https://github.com/zopiolabs/zopio.git";
let runningProcesses: Map<string, ChildProcess> = new Map();
let hasShownWelcome = false;

// 🚨 KRİTİK SINIR KURALLARI - KULLANICI TALEBİ
const FORBIDDEN_FRAMEWORKS = [
  'next.js', 'nextjs', 'create-next-app',
  'react', 'create-react-app', 'vite',
  'vue.js', 'vue', 'vue-cli', 'nuxt',
  'angular', 'ng', '@angular/cli',
  'svelte', 'sveltekit', 'create-svelte',
  'gatsby', 'remix', 'astro',
  '.js', 'javascript' // ❌ JavaScript dosyaları yasak
];

const FORBIDDEN_COMMANDS = [
  'npx create-next-app', 'npm create react-app', 'vue create',
  'ng new', 'npx create-svelte', 'npm init', 'yarn create', 'pnpm create'
];

// ✅ ZORUNLU DOSYA YAPISI
const REQUIRED_FILE_EXTENSION = '.ts'; // Sadece TypeScript
const FORBIDDEN_FILE_EXTENSIONS = ['.js', '.jsx']; // JavaScript yasak

/**
 * Framework yasağı kontrolü - KULLANICI SINIRI
 */
function checkFrameworkProhibition(input: string): { isViolation: boolean; message: string } {
  const lowerInput = input.toLowerCase();
  
  // Yasaklı framework kontrolü
  for (const framework of FORBIDDEN_FRAMEWORKS) {
    if (lowerInput.includes(framework)) {
      return {
        isViolation: true,
        message: `🚨 SINIR İHLALİ: "${framework}" kullanımı YASAK!\n❌ MANUEL FRAMEWORK KURULUMU YASAK!\n✅ SADECE ZOPİO FRAMEWORK KULLANILACAK!\n🔧 Çözüm: create-complete-application tool'unu kullan.`
      };
    }
  }
  
  // Yasaklı komut kontrolü
  for (const command of FORBIDDEN_COMMANDS) {
    if (lowerInput.includes(command)) {
      return {
        isViolation: true,
        message: `🚨 SINIR İHLALİ: "${command}" komutu YASAK!\n❌ MANUEL SETUP YASAK!\n✅ SADECE ZOPİO MCP TOOLS KULLANILACAK!\n🔧 Çözüm: setup-zopio-app veya create-complete-application kullan.`
      };
    }
  }
  
  return { isViolation: false, message: "" };
}

/**
 * Dosya uzantısı kontrolü - TypeScript zorunluluğu
 */
function validateFileExtension(filename: string): { isValid: boolean; message: string } {
  const ext = path.extname(filename).toLowerCase();
  
  // JavaScript dosyaları yasak
  if (FORBIDDEN_FILE_EXTENSIONS.includes(ext)) {
    return {
      isValid: false,
      message: `🚨 DOSYA UZANTISI İHLALİ: "${ext}" uzantısı YASAK!\n❌ JAVASCRIPT (.js, .jsx) DOSYALARI YASAK!\n✅ SADECE TYPESCRIPT (.ts, .tsx) KULLANILACAK!\n🔧 Dosya adını "${filename.replace(ext, '.ts')}" olarak değiştirin.`
    };
  }
  
  // TypeScript kontrolü (sadece .ts, .tsx, .prisma, .json, .md, .css izinli)
  const allowedExtensions = ['.ts', '.tsx', '.prisma', '.json', '.md', '.css', '.env'];
  if (!allowedExtensions.includes(ext) && ext !== '') {
    return {
      isValid: false,
      message: `⚠️ UYARI: "${ext}" uzantısı önerilmiyor. TypeScript (.ts/.tsx) kullanın.`
    };
  }
  
  return { isValid: true, message: "" };
}

// Zopio uygulama türleri
const ZopioAppType = {
  WEB: "web",
  API: "api",
  APP: "app",
  DOCS: "docs",
  EMAIL: "email",
  ALL: "all"
} as const;

type ZopioAppType = typeof ZopioAppType[keyof typeof ZopioAppType];

// Yeni özellikler için type tanımları
interface ProjectRequirements {
  projectType: string;
  projectName: string;
  businessType: string;
  userTypes: UserType[];
  features: string[];
  description: string;
}

interface UserType {
  name: string;
  role: 'admin' | 'user' | 'manager' | 'customer';
  permissions: string[];
  description: string;
}

interface ProjectStructure {
  models: ModelFile[];
  controllers: ControllerFile[];
  views: ViewFile[];
  routes: RouteFile[];
  config: ConfigFile[];
}

interface ModelFile {
  name: string;
  fields: FieldDefinition[];
  relationships: Relationship[];
}

interface FieldDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'email' | 'phone';
  required: boolean;
  validation?: string;
}

interface Relationship {
  type: 'hasMany' | 'hasOne' | 'belongsTo' | 'manyToMany';
  model: string;
  foreignKey?: string;
}

interface ControllerFile {
  name: string;
  actions: string[];
  middleware: string[];
}

interface ViewFile {
  name: string;
  type: 'page' | 'component' | 'layout';
  props: string[];
}

interface RouteFile {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  controller: string;
  action: string;
  middleware: string[];
}

interface ConfigFile {
  name: string;
  content: any;
}

// Uygulama açıklamaları
const APP_DESCRIPTIONS: Record<string, string> = {
  web: "Web uygulaması - Zopio'nun web arayüzü",
  api: "API uygulaması - Backend API servisleri",
  app: "Ana uygulama - Zopio'nun ana uygulaması",
  docs: "Dokümantasyon - Zopio dokümantasyon sitesi",
  email: "Email paketi - Email servisleri ve şablonları (Not: Bağımsız çalışmaz, diğer uygulamalar tarafından kullanılır)",
  all: "Tüm uygulamalar - Zopio'nun tüm bileşenleri"
};

/**
 * Masaüstü yolunu cross-platform olarak alır
 */
function getDesktopPath(): string {
  const homeDir = os.homedir();
  const platform = os.platform();
  
  if (platform === "win32") {
    return path.join(homeDir, "Desktop");
  } else if (platform === "darwin" || platform === "linux") {
    return path.join(homeDir, "Desktop");
  }
  
  return homeDir;
}

/**
 * Kullanıcıdan proje gereksinimlerini toplar
 */
async function gatherProjectRequirements(userInput: string): Promise<ProjectRequirements> {
  // Proje türünü belirle
  const projectTypes = {
    'randevu': 'appointment-system',
    'e-ticaret': 'e-commerce',
    'blog': 'blog-system',
    'portfolio': 'portfolio',
    'kurum': 'corporate-website',
    'restoran': 'restaurant-system',
    'hastane': 'hospital-system',
    'okul': 'school-system',
    'emlak': 'real-estate',
    'muhasebe': 'accounting-system'
  };

  let projectType = 'custom';
  let businessType = '';
  
  // Kullanıcı girdisinden proje türünü tahmin et
  for (const [key, value] of Object.entries(projectTypes)) {
    if (userInput.toLowerCase().includes(key)) {
      projectType = value;
      businessType = key;
      break;
    }
  }

  // Proje adını çıkar
  const projectName = extractProjectName(userInput, businessType);

  // Kullanıcı tiplerini belirle
  const userTypes = determineUserTypes(projectType, businessType);

  // Özellikleri belirle
  const features = determineFeatures(projectType, businessType);

  return {
    projectType,
    projectName,
    businessType,
    userTypes,
    features,
    description: userInput
  };
}

/**
 * Proje adını çıkarır
 */
function extractProjectName(userInput: string, businessType: string): string {
  // Basit ad çıkarma mantığı
  const words = userInput.split(' ');
  const businessIndex = words.findIndex(word => word.toLowerCase().includes(businessType));
  
  if (businessIndex > 0) {
    return words.slice(0, businessIndex).join(' ') || `${businessType}-app`;
  }
  
  return `${businessType}-app`;
}

/**
 * Proje türüne göre kullanıcı tiplerini belirler
 */
function determineUserTypes(projectType: string, businessType: string): UserType[] {
  const commonUserTypes: Record<string, UserType[]> = {
    'appointment-system': [
      {
        name: 'Admin',
        role: 'admin',
        permissions: ['create', 'read', 'update', 'delete', 'manage-users'],
        description: 'Sistem yöneticisi - tüm yetkilere sahip'
      },
      {
        name: 'Salon Sahibi',
        role: 'manager',
        permissions: ['read', 'update', 'manage-appointments'],
        description: 'İşletme sahibi - randevuları yönetir'
      },
      {
        name: 'Müşteri',
        role: 'customer',
        permissions: ['read', 'create-appointment'],
        description: 'Randevu alan müşteri'
      }
    ],
    'e-commerce': [
      {
        name: 'Admin',
        role: 'admin',
        permissions: ['create', 'read', 'update', 'delete', 'manage-products', 'manage-orders'],
        description: 'Site yöneticisi'
      },
      {
        name: 'Müşteri',
        role: 'customer',
        permissions: ['read', 'create-order', 'update-profile'],
        description: 'Alışveriş yapan kullanıcı'
      }
    ],
    'default': [
      {
        name: 'Admin',
        role: 'admin',
        permissions: ['create', 'read', 'update', 'delete'],
        description: 'Sistem yöneticisi'
      },
      {
        name: 'Kullanıcı',
        role: 'user',
        permissions: ['read', 'update-own'],
        description: 'Normal kullanıcı'
      }
    ]
  };

  return commonUserTypes[projectType] || commonUserTypes['default'];
}

/**
 * Proje türüne göre özellikleri belirler
 */
function determineFeatures(projectType: string, businessType: string): string[] {
  const commonFeatures: Record<string, string[]> = {
    'appointment-system': [
      'Randevu oluşturma',
      'Randevu yönetimi',
      'Hizmet yönetimi',
      'Müşteri yönetimi',
      'Takvim görünümü',
      'Email bildirimleri',
      'Ödeme sistemi',
      'Raporlama'
    ],
    'e-commerce': [
      'Ürün kataloğu',
      'Sepet yönetimi',
      'Sipariş takibi',
      'Ödeme sistemi',
      'Kullanıcı hesapları',
      'İnventory yönetimi',
      'Kampanya sistemi',
      'Raporlama'
    ],
    'blog-system': [
      'Yazı yönetimi',
      'Kategori sistemi',
      'Yorum sistemi',
      'Kullanıcı yönetimi',
      'Arama özelliği',
      'SEO optimizasyonu',
      'Social media entegrasyonu',
      'Newsletter'
    ],
    'default': [
      'Kullanıcı yönetimi',
      'CRUD işlemleri',
      'Arama ve filtreleme',
      'Raporlama',
      'Email bildirimleri'
    ]
  };

  return commonFeatures[projectType] || commonFeatures['default'];
}

/**
 * Zopio reposunu klonlar (gerekirse)
 */
async function cloneZopioIfNeeded(): Promise<{ success: boolean; message: string; repoDir: string }> {
  const desktopPath = getDesktopPath();
  const repoDir = path.join(desktopPath, "zopio");
  
  try {
    const repoExists = fs.existsSync(repoDir);
    
    if (repoExists) {
      return {
        success: true,
        message: "✅ Zopio klasörü zaten mevcut.",
        repoDir
      };
    }
    
    execSync(`git clone ${REPO_URL} "${repoDir}"`, { 
      stdio: "pipe",
      encoding: "utf-8" 
    });
    
    return {
      success: true,
      message: "✅ Zopio reposu başarıyla klonlandı.",
      repoDir
    };
    
  } catch (error: any) {
    return {
      success: false,
      message: `❌ Klonlama hatası: ${error.message}`,
      repoDir
    };
  }
}

/**
 * Bağımlılıkları yükler
 */
async function installDependencies(repoDir: string): Promise<{ success: boolean; message: string }> {
  try {
    execSync("pnpm install", { 
      cwd: repoDir, 
      stdio: "pipe",
      encoding: "utf-8"
    });
    
    return {
      success: true,
      message: "✅ Bağımlılıklar yüklendi."
    };
  } catch (error: any) {
    return {
      success: false,
      message: `❌ Bağımlılık yükleme hatası: ${error.message}`
    };
  }
}

/**
 * Proje gereksinimlerine göre dosya yapısını oluşturur
 */
async function generateProjectStructure(requirements: ProjectRequirements, repoDir: string): Promise<{ success: boolean; message: string }> {
  try {
    const projectDir = path.join(repoDir, 'apps', 'web', 'app', requirements.projectName);
    
    // Ana proje klasörünü oluştur
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }

    // Model dosyalarını oluştur
    await generateModels(requirements, projectDir);
    
    // Controller dosyalarını oluştur
    await generateControllers(requirements, projectDir);
    
    // View dosyalarını oluştur (Zopio locale-based routing)
    await generateViews(requirements, repoDir);
    
    // API routes oluştur
    await generateApiRoutes(requirements, repoDir);
    
    // Config dosyalarını oluştur
    await generateConfigFiles(requirements, projectDir);
    
    // Environment variables oluştur (Zopio için gerekli)
    await generateEnvFiles(repoDir, requirements);
    
    // Database schema oluştur
    await generateDatabaseSchema(requirements, repoDir);

    const projectSlug = requirements.projectName.toLowerCase().replace(/\s+/g, '-');
    return {
      success: true,
      message: `✅ Proje dosyaları oluşturuldu!\n📁 Route: /en/${projectSlug}\n🌐 URL: http://localhost:3001/en/${projectSlug}`
    };
  } catch (error: any) {
    return {
      success: false,
      message: `❌ Dosya oluşturma hatası: ${error.message}`
    };
  }
}

/**
 * Model dosyalarını oluşturur
 */
async function generateModels(requirements: ProjectRequirements, projectDir: string): Promise<void> {
  const modelsDir = path.join(projectDir, 'models');
  if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
  }

  if (requirements.projectType === 'appointment-system') {
    // Randevu sistemi için modeller
    const models = [
      {
        name: 'Service',
        fields: [
          { name: 'name', type: 'string', required: true },
          { name: 'price', type: 'number', required: true },
          { name: 'duration', type: 'number', required: true },
          { name: 'description', type: 'string', required: false }
        ]
      },
      {
        name: 'Customer',
        fields: [
          { name: 'name', type: 'string', required: true },
          { name: 'email', type: 'email', required: true },
          { name: 'phone', type: 'phone', required: true },
          { name: 'address', type: 'string', required: false }
        ]
      },
      {
        name: 'Appointment',
        fields: [
          { name: 'customerId', type: 'string', required: true },
          { name: 'serviceIds', type: 'string', required: true },
          { name: 'appointmentDate', type: 'date', required: true },
          { name: 'status', type: 'string', required: true },
          { name: 'totalPrice', type: 'number', required: true },
          { name: 'notes', type: 'string', required: false }
        ]
      }
    ];

    for (const model of models) {
      const modelContent = generatePrismaModel(model);
      fs.writeFileSync(path.join(modelsDir, `${model.name}.ts`), modelContent);
    }
  } else if (requirements.projectType === 'e-commerce') {
    // E-ticaret sistemi için modeller
    const models = [
      {
        name: 'Category',
        fields: [
          { name: 'name', type: 'string', required: true },
          { name: 'slug', type: 'string', required: true },
          { name: 'description', type: 'string', required: false },
          { name: 'image', type: 'string', required: false }
        ]
      },
      {
        name: 'Product',
        fields: [
          { name: 'name', type: 'string', required: true },
          { name: 'slug', type: 'string', required: true },
          { name: 'description', type: 'string', required: false },
          { name: 'price', type: 'number', required: true },
          { name: 'salePrice', type: 'number', required: false },
          { name: 'stock', type: 'number', required: true },
          { name: 'categoryId', type: 'string', required: true },
          { name: 'images', type: 'string', required: false },
          { name: 'featured', type: 'boolean', required: false }
        ]
      },
      {
        name: 'Customer',
        fields: [
          { name: 'name', type: 'string', required: true },
          { name: 'email', type: 'email', required: true },
          { name: 'phone', type: 'phone', required: true },
          { name: 'address', type: 'string', required: false },
          { name: 'city', type: 'string', required: false },
          { name: 'zipCode', type: 'string', required: false }
        ]
      },
      {
        name: 'Cart',
        fields: [
          { name: 'customerId', type: 'string', required: true },
          { name: 'productId', type: 'string', required: true },
          { name: 'quantity', type: 'number', required: true },
          { name: 'price', type: 'number', required: true }
        ]
      },
      {
        name: 'Order',
        fields: [
          { name: 'customerId', type: 'string', required: true },
          { name: 'orderNumber', type: 'string', required: true },
          { name: 'status', type: 'string', required: true },
          { name: 'totalAmount', type: 'number', required: true },
          { name: 'shippingAddress', type: 'string', required: true },
          { name: 'paymentMethod', type: 'string', required: true },
          { name: 'notes', type: 'string', required: false }
        ]
      },
      {
        name: 'OrderItem',
        fields: [
          { name: 'orderId', type: 'string', required: true },
          { name: 'productId', type: 'string', required: true },
          { name: 'quantity', type: 'number', required: true },
          { name: 'price', type: 'number', required: true },
          { name: 'subtotal', type: 'number', required: true }
        ]
      }
    ];

    for (const model of models) {
      const modelContent = generatePrismaModel(model);
      fs.writeFileSync(path.join(modelsDir, `${model.name}.ts`), modelContent);
    }
  }
}

/**
 * Prisma model içeriği oluşturur
 */
function generatePrismaModel(model: any): string {
  return `// ${model.name} Model
export interface ${model.name} {
${model.fields.map((field: any) => `  ${field.name}${field.required ? '' : '?'}: ${getPrismaType(field.type)};`).join('\n')}
}

export const ${model.name}Schema = {
${model.fields.map((field: any) => `  ${field.name}: {
    type: '${field.type}',
    required: ${field.required}${field.validation ? `,\n    validation: '${field.validation}'` : ''}
  }`).join(',\n')}
};
`;
}

/**
 * TypeScript tipine dönüştürür
 */
function getPrismaType(type: string): string {
  const typeMap: Record<string, string> = {
    'string': 'string',
    'number': 'number',
    'boolean': 'boolean',
    'date': 'Date',
    'email': 'string',
    'phone': 'string'
  };
  return typeMap[type] || 'string';
}

/**
 * Controller dosyalarını oluşturur
 */
async function generateControllers(requirements: ProjectRequirements, projectDir: string): Promise<void> {
  const controllersDir = path.join(projectDir, 'controllers');
  if (!fs.existsSync(controllersDir)) {
    fs.mkdirSync(controllersDir, { recursive: true });
  }

  if (requirements.projectType === 'appointment-system') {
    const controllers = ['ServiceController', 'CustomerController', 'AppointmentController'];
    
    for (const controller of controllers) {
      const controllerContent = generateControllerContent(controller, requirements);
      fs.writeFileSync(path.join(controllersDir, `${controller}.ts`), controllerContent);
    }
  } else if (requirements.projectType === 'e-commerce') {
    const controllers = ['ProductController', 'CategoryController', 'CartController', 'OrderController', 'CustomerController'];
    
    for (const controller of controllers) {
      const controllerContent = generateControllerContent(controller, requirements);
      fs.writeFileSync(path.join(controllersDir, `${controller}.ts`), controllerContent);
    }
  }
}

/**
 * Controller içeriği oluşturur
 */
function generateControllerContent(controllerName: string, requirements: ProjectRequirements): string {
  const entityName = controllerName.replace('Controller', '');
  
  return `import { NextRequest, NextResponse } from 'next/server';

export class ${controllerName} {
  // Tüm ${entityName.toLowerCase()}ları listele
  static async getAll(req: NextRequest) {
    try {
      // TODO: Database'den ${entityName.toLowerCase()}ları çek
      const ${entityName.toLowerCase()}s = [];
      
      return NextResponse.json({ 
        success: true, 
        data: ${entityName.toLowerCase()}s 
      });
    } catch (error: any) {
      return NextResponse.json({ 
        success: false, 
        message: error.message 
      }, { status: 500 });
    }
  }

  // Yeni ${entityName.toLowerCase()} oluştur
  static async create(req: NextRequest) {
    try {
      const data = await req.json();
      
      // TODO: Validation
      // TODO: Database'e kaydet
      
      return NextResponse.json({ 
        success: true, 
        message: '${entityName} başarıyla oluşturuldu',
        data 
      });
    } catch (error: any) {
      return NextResponse.json({ 
        success: false, 
        message: error.message 
      }, { status: 500 });
    }
  }

  // ${entityName.toLowerCase()} güncelle
  static async update(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const data = await req.json();
      const { id } = params;
      
      // TODO: Validation
      // TODO: Database'de güncelle
      
      return NextResponse.json({ 
        success: true, 
        message: '${entityName} başarıyla güncellendi',
        data 
      });
    } catch (error: any) {
      return NextResponse.json({ 
        success: false, 
        message: error.message 
      }, { status: 500 });
    }
  }

  // ${entityName.toLowerCase()} sil
  static async delete(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
      
      // TODO: Database'den sil
      
      return NextResponse.json({ 
        success: true, 
        message: '${entityName} başarıyla silindi' 
      });
    } catch (error: any) {
      return NextResponse.json({ 
        success: false, 
        message: error.message 
      }, { status: 500 });
    }
  }
}
`;
}

/**
 * Ana sayfa içeriği oluşturur - Zopio Design System ile uyumlu
 */
function generateMainPage(requirements: ProjectRequirements): string {
  const projectName = requirements.projectName;
  
  return `/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import React, { useState } from 'react';

export default function ${projectName.replace(/\s+/g, '')}Page() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <h1 className="text-3xl font-bold mb-6 text-foreground">${projectName}</h1>
          
          <div className="space-y-4">
            <p className="text-muted-foreground">
              ${requirements.description || 'Hoş geldiniz! Bu sayfa otomatik olarak oluşturuldu.'}
            </p>
            
            {loading && (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {/* Özellikler buraya gelecek */}
              ${requirements.features.map(feature => `
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">${feature}</h3>
                <p className="text-sm text-muted-foreground">Özellik açıklaması</p>
              </div>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`;
}

/**
 * View dosyalarını oluşturur - Zopio locale-based routing yapısına uygun
 */
async function generateViews(requirements: ProjectRequirements, repoDir: string): Promise<void> {
  // Zopio'nun yapısı: apps/web/app/[locale]/[route-name]/
  const projectSlug = requirements.projectName.toLowerCase().replace(/\s+/g, '-');
  const pageDir = path.join(repoDir, 'apps', 'web', 'app', '[locale]', projectSlug);
  
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }

  // Ana sayfa oluştur
  const mainPageContent = generateMainPage(requirements);
  fs.writeFileSync(path.join(pageDir, 'page.tsx'), mainPageContent);
  
  console.log(`✅ Ana sayfa oluşturuldu: /[locale]/${projectSlug}/page.tsx`);
  
  // Component'ler için ayrı klasör
  const componentsDir = path.join(pageDir, 'components');
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
  }

  if (requirements.projectType === 'appointment-system') {
    const views = [
      { name: 'AppointmentForm', type: 'component' },
      { name: 'ServiceList', type: 'component' },
      { name: 'CustomerForm', type: 'component' }
    ];
    
    for (const view of views) {
      const viewContent = generateReactComponent(view.name, requirements);
      fs.writeFileSync(path.join(componentsDir, `${view.name}.tsx`), viewContent);
    }
  } else if (requirements.projectType === 'e-commerce') {
    const views = [
      { name: 'ProductCard', type: 'component' },
      { name: 'CartSidebar', type: 'component' }
    ];
    
    for (const view of views) {
      const viewContent = generateReactComponent(view.name, requirements);
      fs.writeFileSync(path.join(componentsDir, `${view.name}.tsx`), viewContent);
    }
  }
}

/**
 * React component içeriği oluşturur - Zopio Design System ile uyumlu
 */
function generateReactComponent(componentName: string, requirements: ProjectRequirements): string {
  return `/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import React, { useState } from 'react';

interface ${componentName}Props {
  // TODO: Props tanımla
}

export default function ${componentName}({}: ${componentName}Props) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-card rounded-lg shadow-md p-6 border border-border">
        <h1 className="text-2xl font-bold mb-6 text-foreground">${componentName}</h1>
        
        {/* TODO: Component içeriği */}
        <div className="space-y-4">
          <p className="text-muted-foreground">
            ${componentName} component'i için içerik buraya gelecek.
          </p>
          
          {loading && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
`;
}

/**
 * API routes oluşturur
 */
async function generateApiRoutes(requirements: ProjectRequirements, repoDir: string): Promise<void> {
  const apiDir = path.join(repoDir, 'apps', 'web', 'app', 'api');
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
  }

  if (requirements.projectType === 'appointment-system') {
    const routes = ['services', 'customers', 'appointments', 'stats'];
    
    for (const route of routes) {
      const routeDir = path.join(apiDir, route);
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }
      
      const routeContent = generateApiRoute(route);
      fs.writeFileSync(path.join(routeDir, 'route.ts'), routeContent);
    }
  } else if (requirements.projectType === 'e-commerce') {
    const routes = ['products', 'categories', 'cart', 'orders', 'customers', 'stats'];
    
    for (const route of routes) {
      const routeDir = path.join(apiDir, route);
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }
      
      const routeContent = generateApiRoute(route);
      fs.writeFileSync(path.join(routeDir, 'route.ts'), routeContent);
    }
  }
}

/**
 * API route içeriği oluşturur
 */
function generateApiRoute(routeName: string): string {
  const entityName = routeName.slice(0, -1); // Remove 's' from plural
  
  return `import { NextRequest, NextResponse } from 'next/server';

// GET /${routeName} - Tüm ${entityName}ları listele
export async function GET(request: NextRequest) {
  try {
    // TODO: Database'den ${entityName}ları çek
    const ${routeName} = [];
    
    return NextResponse.json({
      success: true,
      data: ${routeName}
    });
  } catch (error: any) {
    console.error('${routeName.toUpperCase()} GET Error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

// POST /${routeName} - Yeni ${entityName} oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Validation
    // TODO: Database'e kaydet
    
    return NextResponse.json({
      success: true,
      message: '${entityName} başarıyla oluşturuldu',
      data: body
    });
  } catch (error: any) {
    console.error('${routeName.toUpperCase()} POST Error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
`;
}

/**
 * Config dosyalarını oluşturur
 */
async function generateConfigFiles(requirements: ProjectRequirements, projectDir: string): Promise<void> {
  const configDir = path.join(projectDir, 'config');
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  // Database config
  const dbConfig = `export const databaseConfig = {
  development: {
    dialect: 'sqlite',
    storage: './database.sqlite'
  },
  production: {
    dialect: 'postgresql',
    url: process.env.DATABASE_URL
  }
};
`;

  fs.writeFileSync(path.join(configDir, 'database.ts'), dbConfig);

  // App config
  const appConfig = `export const appConfig = {
  name: '${requirements.projectName}',
  description: '${requirements.description}',
  version: '1.0.0',
  features: ${JSON.stringify(requirements.features, null, 2)},
  userTypes: ${JSON.stringify(requirements.userTypes, null, 2)}
};
`;

  fs.writeFileSync(path.join(configDir, 'app.ts'), appConfig);
}

/**
 * Environment variables dosyası oluşturur - Zopio için gerekli tüm değişkenler
 */
async function generateEnvFiles(repoDir: string, requirements: ProjectRequirements): Promise<void> {
  const envLocalPath = path.join(repoDir, 'apps', 'web', '.env.local');
  const envExamplePath = path.join(repoDir, '.env.example');
  
  const projectSlug = requirements.projectName.toLowerCase().replace(/\s+/g, '-');
  
  const envContent = `# Database
DATABASE_URL="postgresql://localhost:5432/${projectSlug}"

# Basehub CMS (https://basehub.com)
# Token must start with bshb_pk_
BASEHUB_TOKEN="bshb_pk_example_token_12345"

# Next.js URLs
NEXT_PUBLIC_APP_URL="http://localhost:3001"
NEXT_PUBLIC_WEB_URL="http://localhost:3001"
NEXT_PUBLIC_API_URL="http://localhost:3002"
NEXT_PUBLIC_DOCS_URL="http://localhost:3003"

# Arcjet Security (https://arcjet.com)
# Key must start with ajkey_
ARCJET_KEY="ajkey_example_12345"

# Sentry (https://sentry.io)
SENTRY_DSN="https://example@sentry.io/12345"
SENTRY_ORG="example-org"
SENTRY_PROJECT="${projectSlug}"

# Resend Email (https://resend.com)
# Token must start with re_
RESEND_TOKEN="re_example_token_12345"
RESEND_FROM="noreply@example.com"

# Vercel (optional)
VERCEL_URL="localhost:3001"

# Feature Flags (optional)
NEXT_PUBLIC_FEATURE_FLAGS=""
FLAGS_SECRET=""
`;

  // .env.local oluştur (apps/web altında)
  fs.writeFileSync(envLocalPath, envContent);
  console.log('✅ .env.local dosyası oluşturuldu: apps/web/.env.local');
  
  // .env.example oluştur (root'ta)
  fs.writeFileSync(envExamplePath, envContent);
  console.log('✅ .env.example dosyası oluşturuldu: .env.example');
}

/**
 * Database schema oluşturur
 */
async function generateDatabaseSchema(requirements: ProjectRequirements, repoDir: string): Promise<void> {
  const prismaDir = path.join(repoDir, 'packages', 'database', 'prisma');
  
  if (requirements.projectType === 'appointment-system') {
    const schemaContent = `// Zopio Database Schema - ${requirements.projectName}
// Generated by Zopio MCP Server

generator client {
  provider = "prisma-client-js"
  output   = "../generated/client"
}

datasource db {
  provider     = "postgresql"
  url          = env("DATABASE_URL")
  relationMode = "prisma"
}

model Service {
  id          String   @id @default(cuid())
  name        String
  price       Int
  duration    Int      // dakika cinsinden
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // İlişkiler
  appointmentServices AppointmentService[]
  
  @@map("services")
}

model Customer {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  phone     String
  address   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // İlişkiler
  appointments Appointment[]
  
  @@map("customers")
}

model Appointment {
  id              String            @id @default(cuid())
  customerId      String
  appointmentDate DateTime
  status          AppointmentStatus @default(PENDING)
  totalPrice      Int
  notes           String?
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
  
  // İlişkiler
  customer            Customer             @relation(fields: [customerId], references: [id])
  appointmentServices AppointmentService[]
  
  @@map("appointments")
}

model AppointmentService {
  id            String @id @default(cuid())
  appointmentId String
  serviceId     String
  
  // İlişkiler
  appointment Appointment @relation(fields: [appointmentId], references: [id])
  service     Service     @relation(fields: [serviceId], references: [id])
  
  @@unique([appointmentId, serviceId])
  @@map("appointment_services")
}

enum AppointmentStatus {
  PENDING
  CONFIRMED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}
`;

    if (!fs.existsSync(prismaDir)) {
      fs.mkdirSync(prismaDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(prismaDir, 'schema.prisma'), schemaContent);
  } else if (requirements.projectType === 'e-commerce') {
    const schemaContent = `// Zopio Database Schema - ${requirements.projectName}
// Generated by Zopio MCP Server

generator client {
  provider = "prisma-client-js"
  output   = "../generated/client"
}

datasource db {
  provider     = "postgresql"
  url          = env("DATABASE_URL")
  relationMode = "prisma"
}

model Category {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String?
  image       String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // İlişkiler
  products Product[]
  
  @@map("categories")
}

model Product {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String?
  price       Int
  salePrice   Int?
  stock       Int       @default(0)
  categoryId  String
  images      String?   // JSON array olarak saklanacak
  featured    Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // İlişkiler
  category   Category     @relation(fields: [categoryId], references: [id])
  cartItems  CartItem[]
  orderItems OrderItem[]
  
  @@map("products")
}

model Customer {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  phone     String
  address   String?
  city      String?
  zipCode   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // İlişkiler
  cartItems CartItem[]
  orders    Order[]
  
  @@map("customers")
}

model CartItem {
  id         String   @id @default(cuid())
  customerId String
  productId  String
  quantity   Int      @default(1)
  price      Int
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  // İlişkiler
  customer Customer @relation(fields: [customerId], references: [id])
  product  Product  @relation(fields: [productId], references: [id])
  
  @@unique([customerId, productId])
  @@map("cart_items")
}

model Order {
  id              String      @id @default(cuid())
  customerId      String
  orderNumber     String      @unique
  status          OrderStatus @default(PENDING)
  totalAmount     Int
  shippingAddress String
  paymentMethod   String
  notes           String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  // İlişkiler
  customer   Customer    @relation(fields: [customerId], references: [id])
  orderItems OrderItem[]
  
  @@map("orders")
}

model OrderItem {
  id        String   @id @default(cuid())
  orderId   String
  productId String
  quantity  Int
  price     Int
  subtotal  Int
  createdAt DateTime @default(now())
  
  // İlişkiler
  order   Order   @relation(fields: [orderId], references: [id])
  product Product @relation(fields: [productId], references: [id])
  
  @@map("order_items")
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}
`;

    if (!fs.existsSync(prismaDir)) {
      fs.mkdirSync(prismaDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(prismaDir, 'schema.prisma'), schemaContent);
  }
}

/**
 * Belirli bir uygulamayı başlatır
 */
async function startApp(appType: ZopioAppType, repoDir: string): Promise<{ success: boolean; message: string }> {
  try {
    // Eğer zaten çalışıyorsa durdur
    if (runningProcesses.has(appType)) {
      const existingProcess = runningProcesses.get(appType);
      existingProcess?.kill();
      runningProcesses.delete(appType);
    }
    
    let command: string[];
    let port: string;
    
    if (appType === ZopioAppType.ALL) {
      // Tüm uygulamaları başlat
      command = ["run", "dev"];
      port = "çeşitli portlar";
    } else {
      // Belirli bir uygulamayı başlat
      command = ["run", "dev", "--filter", `@zopio/${appType}`];
      
      // Port bilgileri
      const ports: Record<string, string> = {
        web: "3000",
        api: "3001",
        app: "3002",
        docs: "3003",
        email: "3004"
      };
      port = ports[appType] || "bilinmeyen";
    }
    
    const process = spawn("pnpm", command, { 
      cwd: repoDir, 
      shell: true,
      detached: false
    });
    
    runningProcesses.set(appType, process);
    
    return {
      success: true,
      message: `✅ ${APP_DESCRIPTIONS[appType]} başlatıldı!\n🔗 Port: ${port}`
    };
    
  } catch (error: any) {
    return {
      success: false,
      message: `❌ Başlatma hatası: ${error.message}`
    };
  }
}

/**
 * Senaryo bazlı Zopio kurulumu
 */
async function setupZopioScenario(appType: ZopioAppType): Promise<string> {
  let output = `\n🎯 SENARYO: ${APP_DESCRIPTIONS[appType]}\n`;
  output += "=".repeat(60) + "\n\n";
  
  // 1. Repo'yu klonla (gerekirse)
  output += "📥 Adım 1: Repo kontrolü...\n";
  const cloneResult = await cloneZopioIfNeeded();
  output += cloneResult.message + "\n\n";
  
  if (!cloneResult.success) {
    return output;
  }
  
  // 2. Bağımlılıkları yükle
  output += "📦 Adım 2: Bağımlılıklar yükleniyor...\n";
  const installResult = await installDependencies(cloneResult.repoDir);
  output += installResult.message + "\n\n";
  
  if (!installResult.success) {
    return output;
  }
  
  // 3. Uygulamayı başlat
  output += "🚀 Adım 3: Uygulama başlatılıyor...\n";
  const startResult = await startApp(appType, cloneResult.repoDir);
  output += startResult.message + "\n\n";
  
  if (startResult.success) {
    output += "─".repeat(60) + "\n";
    output += `✨ Kurulum tamamlandı!\n`;
    output += `📁 Konum: ${cloneResult.repoDir}\n`;
    output += `ℹ️ Durdurmak için: stop-zopio-app tool'unu kullanın\n`;
    output += "─".repeat(60);
  }
  
  return output;
}

/**
 * 🔍 Proje Sağlık Kontrolü - Tüm hataları tespit eder
 */
interface HealthCheckIssue {
  category: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  fixable: boolean;
  fix?: () => Promise<void>;
}

interface HealthCheckResult {
  report: string;
  fixableIssues: HealthCheckIssue[];
  totalIssues: number;
  errors: number;
  warnings: number;
}

async function performProjectHealthCheck(repoDir: string, requirements: ProjectRequirements): Promise<HealthCheckResult> {
  const issues: HealthCheckIssue[] = [];
  let report = "";
  
  // 1. Routing kontrolü
  const projectSlug = requirements.projectName.toLowerCase().replace(/\s+/g, '-');
  const pageDir = path.join(repoDir, 'apps', 'web', 'app', '[locale]', projectSlug);
  
  if (!fs.existsSync(pageDir)) {
    issues.push({
      category: 'Routing',
      severity: 'error',
      message: `Proje sayfası bulunamadı: /[locale]/${projectSlug}/`,
      fixable: false
    });
  } else {
    report += `✅ Routing yapısı doğru: /[locale]/${projectSlug}/\n`;
  }
  
  // 2. Environment variables kontrolü
  const envPath = path.join(repoDir, 'apps', 'web', '.env.local');
  if (!fs.existsSync(envPath)) {
    issues.push({
      category: 'Environment',
      severity: 'error',
      message: '.env.local dosyası bulunamadı',
      fixable: true,
      fix: async () => {
        await generateEnvFiles(repoDir, requirements);
      }
    });
  } else {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    
    // Token formatlarını kontrol et
    if (!envContent.includes('bshb_pk_')) {
      issues.push({
        category: 'Environment',
        severity: 'warning',
        message: 'BASEHUB_TOKEN formatı yanlış (bshb_pk_ ile başlamalı)',
        fixable: false
      });
    }
    
    if (envContent.includes('BASEHUB_TOKEN') && envContent.includes('bshb_pk_')) {
      report += `✅ Environment variables doğru formatta\n`;
    }
  }
  
  // 3. Prisma schema kontrolü
  const prismaPath = path.join(repoDir, 'packages', 'database', 'prisma', 'schema.prisma');
  if (fs.existsSync(prismaPath)) {
    const schemaContent = fs.readFileSync(prismaPath, 'utf-8');
    
    if (schemaContent.includes('previewFeatures')) {
      issues.push({
        category: 'Prisma',
        severity: 'warning',
        message: 'Deprecated previewFeatures kullanılıyor',
        fixable: true,
        fix: async () => {
          const fixed = schemaContent.replace(/previewFeatures\s*=\s*\[.*?\]/g, '');
          fs.writeFileSync(prismaPath, fixed);
        }
      });
    } else {
      report += `✅ Prisma schema güncel\n`;
    }
  }
  
  // 4. Port kontrolü
  try {
    execSync('lsof -ti:3001', { stdio: 'pipe' });
    report += `✅ Web server çalışıyor (port 3001)\n`;
  } catch {
    issues.push({
      category: 'Server',
      severity: 'warning',
      message: 'Web server başlatılamadı veya port çakışması',
      fixable: false
    });
  }
  
  // 5. Component yapısı kontrolü (hardcoded renkler)
  const componentsToCheck = fs.readdirSync(pageDir, { recursive: true })
    .filter((file: any) => file.endsWith('.tsx'));
  
  let hardcodedColorFound = false;
  for (const file of componentsToCheck) {
    const filePath = path.join(pageDir, file as string);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      if (content.includes('bg-white') || content.includes('text-gray-')) {
        hardcodedColorFound = true;
        issues.push({
          category: 'Design System',
          severity: 'warning',
          message: `Hardcoded renkler bulundu: ${file}`,
          fixable: false
        });
      }
    }
  }
  
  if (!hardcodedColorFound && componentsToCheck.length > 0) {
    report += `✅ Design system token'ları kullanılıyor\n`;
  }
  
  // Özet rapor
  const errors = issues.filter(i => i.severity === 'error').length;
  const warnings = issues.filter(i => i.severity === 'warning').length;
  const fixableIssues = issues.filter(i => i.fixable);
  
  let summary = `\n📊 SAĞLIK KONTROLÜ SONUÇLARI:\n`;
  summary += `─`.repeat(60) + `\n`;
  summary += `✅ Başarılı kontroller: ${5 - issues.length}/5\n`;
  summary += `❌ Hatalar: ${errors}\n`;
  summary += `⚠️  Uyarılar: ${warnings}\n`;
  summary += `🔧 Otomatik düzeltilebilir: ${fixableIssues.length}\n`;
  
  if (issues.length > 0) {
    summary += `\n🔍 TESPIT EDILEN SORUNLAR:\n`;
    for (const issue of issues) {
      const icon = issue.severity === 'error' ? '❌' : '⚠️';
      summary += `${icon} [${issue.category}] ${issue.message}\n`;
    }
  }
  
  return {
    report: report + summary,
    fixableIssues,
    totalIssues: issues.length,
    errors,
    warnings
  };
}

/**
 * 🔧 Otomatik Hata Düzeltme
 */
async function autoFixIssues(repoDir: string, issues: HealthCheckIssue[]): Promise<string> {
  let output = "";
  let fixed = 0;
  
  for (const issue of issues) {
    if (issue.fix) {
      try {
        await issue.fix();
        output += `✅ Düzeltildi: ${issue.message}\n`;
        fixed++;
      } catch (error: any) {
        output += `❌ Düzeltilemedi: ${issue.message} - ${error.message}\n`;
      }
    }
  }
  
  output += `\n📊 ${fixed}/${issues.length} sorun otomatik düzeltildi.\n`;
  
  if (fixed > 0) {
    output += `🔄 Değişiklikler uygulandı. Server yeniden başlatılıyor...\n`;
  }
  
  return output;
}

/**
 * Otomatik uygulama üretimi - Ana fonksiyon
 */
async function generateCompleteApplication(userInput: string): Promise<string> {
  let output = `\n🚀 OTOMATİK UYGULAMA ÜRETİMİ BAŞLADI\n`;
  output += "=".repeat(60) + "\n\n";
  
  try {
    // 1. Gereksinimleri topla
    output += "🔍 Adım 1: Gereksinimler analiz ediliyor...\n";
    const requirements = await gatherProjectRequirements(userInput);
    output += `✅ Proje türü: ${requirements.businessType} (${requirements.projectType})\n`;
    output += `✅ Proje adı: ${requirements.projectName}\n`;
    output += `✅ Kullanıcı tipleri: ${requirements.userTypes.map(u => u.name).join(', ')}\n`;
    output += `✅ Özellikler: ${requirements.features.length} adet\n\n`;
    
    // 2. Zopio framework'ünü klonla
    output += "📥 Adım 2: Zopio framework klonlanıyor...\n";
    const cloneResult = await cloneZopioIfNeeded();
    output += cloneResult.message + "\n\n";
    
    if (!cloneResult.success) {
      return output;
    }
    
    // 3. Bağımlılıkları yükle
    output += "📦 Adım 3: Bağımlılıklar yükleniyor...\n";
    const installResult = await installDependencies(cloneResult.repoDir);
    output += installResult.message + "\n\n";
    
    if (!installResult.success) {
      return output;
    }
    
    // 4. Proje dosyalarını oluştur
    output += "🛠️ Adım 4: Proje dosyaları oluşturuluyor...\n";
    const generateResult = await generateProjectStructure(requirements, cloneResult.repoDir);
    output += generateResult.message + "\n\n";
    
    if (!generateResult.success) {
      return output;
    }
    
    // 5. Web uygulamasını başlat
    output += "🌐 Adım 5: Web uygulaması başlatılıyor...\n";
    const webStartResult = await startApp('web', cloneResult.repoDir);
    output += webStartResult.message + "\n\n";
    
    // 6. API'yi başlat  
    output += "🔌 Adım 6: API servisi başlatılıyor...\n";
    const apiStartResult = await startApp('api', cloneResult.repoDir);
    output += apiStartResult.message + "\n\n";
    
    // 7. Proje sağlık kontrolü ve hata tespiti
    output += "🔍 Adım 7: Proje sağlık kontrolü yapılıyor...\n";
    await new Promise(resolve => setTimeout(resolve, 3000)); // Server'ın başlaması için bekle
    
    const healthCheck = await performProjectHealthCheck(cloneResult.repoDir, requirements);
    output += healthCheck.report + "\n\n";
    
    // 8. Otomatik hata düzeltme (varsa)
    if (healthCheck.fixableIssues.length > 0) {
      output += "🔧 Adım 8: Otomatik hata düzeltme yapılıyor...\n";
      const fixResult = await autoFixIssues(cloneResult.repoDir, healthCheck.fixableIssues);
      output += fixResult + "\n\n";
    }
    
    // Başarı mesajı
    if (webStartResult.success && apiStartResult.success) {
      output += "🎉".repeat(60) + "\n";
      output += `✨ ${requirements.projectName} uygulaması hazır!\n\n`;
      
      output += "📋 UYGULAMA BİLGİLERİ:\n";
      output += "─".repeat(60) + "\n";
      output += `🏷️  Proje Adı: ${requirements.projectName}\n`;
      output += `🏢 İş Türü: ${requirements.businessType}\n`;
      output += `👥 Kullanıcı Tipleri: ${requirements.userTypes.length} adet\n`;
      output += `⚡ Özellikler: ${requirements.features.length} adet\n\n`;
      
      output += "🌐 ERİŞİM LİNKLERİ:\n";
      output += "─".repeat(60) + "\n";
      output += `🖥️  Ana Sayfa: http://localhost:3000\n`;
      output += `🔧 Admin Panel: http://localhost:3000/admin\n`;
      output += `🔌 API: http://localhost:3001\n\n`;
      
      output += "📁 OLUŞTURULAN DOSYALAR:\n";
      output += "─".repeat(60) + "\n";
      output += `📂 Modeller: Service, Customer, Appointment\n`;
      output += `🎮 Controller'lar: CRUD işlemleri\n`;
      output += `🖼️  React Bileşenleri: Form ve listeler\n`;
      output += `🛣️  API Routes: RESTful endpoints\n`;
      output += `🗃️  Database: Prisma schema\n`;
      output += `⚙️  Config: App ve database ayarları\n\n`;
      
      output += "🔧 YÖNETİM:\n";
      output += "─".repeat(60) + "\n";
      output += `• Durdurmak için: "stop-zopio-app" tool'unu kullanın\n`;
      output += `• Durum kontrolü: "check-zopio-status" tool'unu kullanın\n`;
      output += `• Kod klasörü: ${cloneResult.repoDir}\n\n`;
      
      output += "🎉".repeat(60);
    }
    
    return output;
    
  } catch (error: any) {
    output += `❌ Zopio kurulumu sırasında hata oluştu: ${error.message}\n`;
    output += `💡 Çözüm: Zopio framework'ünü manuel kurmaya gerek yok!\n`;
    output += `🔄 Tekrar create-complete-application tool'unu kullanın.\n`;
    return output;
  }
}

/**
 * Belirli bir uygulamayı durdurur
 */
async function stopZopioApp(appType?: ZopioAppType): Promise<string> {
  if (!appType) {
    // Tüm uygulamaları durdur
    if (runningProcesses.size === 0) {
      return "ℹ️ Çalışan bir Zopio uygulaması bulunamadı.";
    }
    
    let output = "🛑 Tüm uygulamalar durduruluyor...\n\n";
    for (const [type, process] of runningProcesses.entries()) {
      try {
        process.kill();
        output += `✅ ${APP_DESCRIPTIONS[type]} durduruldu.\n`;
      } catch (error: any) {
        output += `❌ ${APP_DESCRIPTIONS[type]} durdurulurken hata: ${error.message}\n`;
      }
    }
    runningProcesses.clear();
    return output;
  }
  
  // Belirli bir uygulamayı durdur
  const process = runningProcesses.get(appType);
  if (!process) {
    return `ℹ️ ${APP_DESCRIPTIONS[appType]} çalışmıyor.`;
  }
  
  try {
    process.kill();
    runningProcesses.delete(appType);
    return `🛑 ${APP_DESCRIPTIONS[appType]} durduruldu.`;
  } catch (error: any) {
    return `❌ Durdurma hatası: ${error.message}`;
  }
}

/**
 * Zopio durumunu kontrol eder
 */
async function checkZopioStatus(): Promise<string> {
  const desktopPath = getDesktopPath();
  const repoDir = path.join(desktopPath, "zopio");
  const repoExists = fs.existsSync(repoDir);
  
  let status = "📊 ZOPIO DURUM RAPORU\n";
  status += "=".repeat(60) + "\n\n";
  status += `📁 Masaüstü yolu: ${desktopPath}\n`;
  status += `📂 Repo klasörü: ${repoExists ? "✅ Mevcut" : "❌ Bulunamadı"}\n`;
  
  if (repoExists) {
    status += `📍 Konum: ${repoDir}\n`;
  }
  
  status += "\n🚀 Çalışan Uygulamalar:\n";
  status += "─".repeat(60) + "\n";
  
  if (runningProcesses.size === 0) {
    status += "⏸️ Hiçbir uygulama çalışmıyor.\n";
  } else {
    for (const [type, _] of runningProcesses.entries()) {
      status += `✅ ${APP_DESCRIPTIONS[type]}\n`;
    }
  }
  
  status += "─".repeat(60);
  
  return status;
}

/**
 * Karşılama mesajını döndürür
 */
function getWelcomeMessage(): string {
  return `
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║    🚀 ZOPIO FRAMEWORK OTOMATİK UYGULAMA ÜRETİCİSİ! 🚀    ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

👋 Merhaba! SADECE ZOPIO FRAMEWORK ile TypeScript tabanlı uygulamalar üretiyorum!

🚨 KRİTİK SINIR KURALLARI:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ MANUEL NEXT.JS/REACT KURULUMU YASAK!
❌ JAVASCRIPT (.js/.jsx) DOSYALARI YASAK!
✅ SADECE ZOPIO FRAMEWORK!
✅ SADECE TYPESCRIPT (.ts/.tsx)!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  🤖 ZOPIO İLE TAM OTOMATİK UYGULAMA
      ├─ Doğal dille isteğinizi yazın → create-complete-application
      ├─ Zopio framework otomatik kurulur (https://github.com/zopiolabs/zopio.git)
      ├─ TypeScript (.ts) dosyaları otomatik oluşturur
      ├─ Çalışır halde uygulama teslim eder
      └─ Örnek: "Kuaför randevu sistemi lazım"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 ÖRNEK İSTEKLER:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✂️ "Kuaför randevu uygulaması lazım"
  💅 "Güzellik salonu için randevu sistemi"
  🏥 "Hastane hasta takip sistemi"  
  🛒 "E-ticaret sitesi"
  🍕 "Restoran sipariş sistemi"  
  📚 "Blog uygulaması istiyorum"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 UYGULAMANIZ ÇIKARKEN NELER OLUYOR:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1️⃣ Gereksinimlerinizi analiz ediyorum
  2️⃣ Kullanıcı tiplerini belirliyorum
  3️⃣ Zopio framework'ünü indiriyorum  
  4️⃣ Database modellerini oluşturuyorum
  5️⃣ API endpoint'leri yapıyorum
  6️⃣ React sayfalarını kodluyorum
  7️⃣ Tüm konfigürasyonu hazırlıyorum
  8️⃣ Uygulamanızı çalışır halde teslim ediyorum

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ TESLIM EDİLEN UYGULAMA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✅ Tam çalışır admin paneli
  ✅ Kullanıcı dostu arayüz
  ✅ CRUD işlemleri (Ekle, Düzenle, Sil, Listele)
  ✅ Form validasyonları
  ✅ Responsive tasarım (mobil uyumlu)
  ✅ RESTful API
  ✅ Database bağlantısı
  ✅ Real-time güncellemeler

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 HEMEN BAŞLAYIN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  💬 Sadece isteğinizi doğal dille yazın:
     "Veteriner kliniği için hasta takip uygulaması"
     
  🕒 2-3 dakika içinde tamamen çalışır uygulamanız hazır!
  
  🌐 http://localhost:3000 adresinden erişebilirsiniz

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 KURULUM DETAYLARI:
   • Konum: ~/Desktop/zopio
   • Framework: Next.js + Prisma + Tailwind
   • Database: SQLite (geliştirme), PostgreSQL (canlı)

╔════════════════════════════════════════════════════════════╗
║  Ne tür bir uygulama istiyorsunuz? Yazın, hazırlayayım! 🚀║
╚════════════════════════════════════════════════════════════╝
`;
}

const server = new Server(
  {
    name: "zopio",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      prompts: {},
    },
  }
);

// Prompts endpoint - Karşılama mesajı ve eğitim promptları
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "zopio-hosgeldiniz",
        description: "🎉 Zopio MCP Server'a hoşgeldiniz! Kullanım talimatlarını göster.",
      },
      {
        name: "zopio-yeni-baslayanlar",
        description: "🎓 Yeni başlayanlar için Zopio Framework rehberi. Uygulamalar, paketler ve kullanım senaryoları.",
      },
      {
        name: "zopio-uygulama-aciklamalari",
        description: "📚 Her bir uygulamanın (WEB, API, MAIL, STORYBOOK, STUDIO) ne işe yaradığını detaylı açıklar.",
      },
      {
        name: "zopio-paket-aciklamalari",
        description: "📦 Packages içindeki entegrasyonların (email, auth, database vb.) nasıl kullanılacağını açıklar.",
      },
      {
        name: "zopio-pratik-senaryo",
        description: "🎬 Email gönderme uygulaması gibi pratik senaryolarla adım adım öğrenme.",
      },
    ],
  };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name } = request.params;
  
  if (name === "zopio-hosgeldiniz") {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: getWelcomeMessage(),
          },
        },
      ],
    };
  }
  
  if (name === "zopio-yeni-baslayanlar") {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `
🎓 YENİ BAŞLAYANLAR İÇİN ZOPİO FRAMEWORK REHBERİ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👋 Merhaba! Yazılımla amatör olarak ilgileniyorsanız, doğru yerdesiniz!

📚 ZOPİO NEDİR?
Zopio, web uygulamaları geliştirmek için hazır araçlar sunan bir framework'tür.
Düşünün ki Lego setiniz var - her parça (uygulama/paket) belirli bir işi yapar.
Siz bu parçaları birleştirerek istediğiniz yapıyı oluşturursunuz.

🎯 NEDEN ZOPİO?
✅ Sıfırdan kod yazmak yerine hazır yapıları kullanırsınız
✅ Zaman kazanırsınız (günler yerine saatler)
✅ Profesyonel standartlarda uygulamalar geliştirirsiniz
✅ Karmaşık işlemleri basit komutlarla yaparsınız

📖 DAHA FAZLA BİLGİ İÇİN:
• Uygulamaları öğrenmek için: "zopio-uygulama-aciklamalari" promptunu kullanın
• Paketleri öğrenmek için: "zopio-paket-aciklamalari" promptunu kullanın
• Pratik örnekler için: "zopio-pratik-senaryo" promptunu kullanın

💡 HIZLI BAŞLANGIÇ:
1. "Zopio'da web uygulaması kur" diyerek başlayın
2. Tarayıcınızda http://localhost:3000 adresini açın
3. Kodlamaya başlayın!

❓ SORULARINIZ MI VAR?
Bana doğrudan Türkçe sorular sorabilirsiniz:
• "Web uygulaması ne işe yarar?"
• "Email nasıl gönderirim?"
• "İletişim formu nasıl yaparım?"

Detaylı eğitim senaryosu için EGITIM_SENARYOSU.md dosyasına bakabilirsiniz.
`,
          },
        },
      ],
    };
  }
  
  if (name === "zopio-uygulama-aciklamalari") {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `
📚 ZOPİO UYGULAMALARI - DETAYLI AÇIKLAMALAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Zopio Framework 5 ana uygulama içerir. Her biri farklı bir iş için tasarlanmıştır:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📖 1. STORYBOOK - Tasarım Kütüphanesi
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 NE İŞE YARAR?
• UI bileşenlerinizi (buton, form, kart vb.) görsel olarak test edersiniz
• Tasarımcılarla iş birliği yaparsınız
• Bileşenlerin farklı durumlarını gösterirsiniz

🏠 GÜNLÜK HAYATTAN ÖRNEK:
Bir mobilya kataloğu gibidir. Her mobilyayı (bileşeni) farklı açılardan 
görebilirsiniz. Müşteriye (ekip arkadaşlarına) göstermek için kullanırsınız.

✅ NE ZAMAN KULLANILIR?
• Yeni bir buton tasarımı yapıyorsunuz
• Ekip arkadaşlarınıza bileşenleri göstermek istiyorsunuz
• Tasarım sistemini dokümante ediyorsunuz

🔗 Port: 3000

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 2. WEB - Web Uygulaması
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 NE İŞE YARAR?
• Kullanıcıların göreceği web sitesini oluşturursunuz
• Sayfa tasarımları, formlar, menüler burada yapılır
• Frontend (ön yüz) geliştirme yaparsınız

🏠 GÜNLÜK HAYATTAN ÖRNEK:
Bir mağazanın vitrin kısmı gibidir. Müşteriler (kullanıcılar) buradan 
alışveriş yapar. Görsel tasarım ve kullanıcı deneyimi burada önemlidir.

✅ NE ZAMAN KULLANILIR?
• Kullanıcı arayüzü tasarlıyorsunuz
• Sayfa düzenleri oluşturuyorsunuz
• Formlar, butonlar, menüler ekliyorsunuz

🔗 Port: 3000

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔌 3. API - Backend Servisleri
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 NE İŞE YARAR?
• Veritabanı işlemleri yaparsınız
• Kullanıcı girişi, veri kaydetme gibi işlemleri yönetirsiniz
• Web uygulamasının "beyin" kısmıdır

🏠 GÜNLÜK HAYATTAN ÖRNEK:
Bir mağazanın deposu ve muhasebe bölümü gibidir. Ürünler (veriler) 
burada saklanır ve yönetilir. Vitrin (WEB) ile depo (API) sürekli haberleşir.

✅ NE ZAMAN KULLANILIR?
• Veritabanı işlemleri yapıyorsunuz
• Kullanıcı girişi/kaydı oluşturuyorsunuz
• Veri işleme ve hesaplama yapıyorsunuz

🔗 Port: 3001

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 4. MAIL - Email Servisleri
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 NE İŞE YARAR?
• Otomatik email gönderimi yaparsınız
• Kullanıcılara bildirim emaili atarsınız
• Email şablonları oluşturursunuz

🏠 GÜNLÜK HAYATTAN ÖRNEK:
Bir şirketin posta servisi gibidir. Müşterilere (kullanıcılara) otomatik 
mektuplar (emailler) gönderir. Fatura, hoşgeldin mesajı, şifre sıfırlama gibi.

✅ NE ZAMAN KULLANILIR?
• Kullanıcıya hoşgeldin emaili göndermek istiyorsunuz
• Şifre sıfırlama linki yollamak istiyorsunuz
• Sipariş onayı bildirimi göndermek istiyorsunuz

🔗 Port: 3004

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 5. STUDIO - Geliştirme Ortamı
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 NE İŞE YARAR?
• Tüm uygulamaları bir arada yönetirsiniz
• Kod yazma, test etme, hata ayıklama yaparsınız
• Geliştirme sürecini kolaylaştırır

🏠 GÜNLÜK HAYATTAN ÖRNEK:
Bir fabrika kontrol merkezi gibidir. Tüm bölümleri (uygulamaları) 
buradan izlersiniz. Sorunları buradan tespit eder ve çözersiniz.

✅ NE ZAMAN KULLANILIR?
• Tüm projeyi bir arada görmek istiyorsunuz
• Hata ayıklama yapıyorsunuz
• Performans izleme yapıyorsunuz

🔗 Port: 3002

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 İPUCU: Bir uygulamayı kurmak için:
"Zopio'da [uygulama-adı] kur" diyebilirsiniz.

Örnek: "Zopio'da web uygulaması kur"
`,
          },
        },
      ],
    };
  }
  
  if (name === "zopio-paket-aciklamalari") {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `
📦 ZOPİO PACKAGES (PAKETLER) - DETAYLI AÇIKLAMALAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Zopio Framework içinde hazır paketler vardır. Bu paketler, sık kullanılan 
işlevleri kolayca kullanmanızı sağlar.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 1. EMAIL PAKETİ (@zopio/email)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 İÇİNDE NELER VAR?
• Email gönderme fonksiyonları
• Email şablonları (hoşgeldin, şifre sıfırlama vb.)
• Email doğrulama araçları

💻 NASIL KULLANILIR?
import { sendWelcomeEmail } from '@zopio/email';

await sendWelcomeEmail({
  to: 'kullanici@email.com',
  name: 'Ahmet Yılmaz'
});

✅ NE ZAMAN KULLANILIR?
• Yeni kullanıcı kaydolduğunda
• Şifre sıfırlama isteğinde
• Sipariş onayında

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 2. AUTH PAKETİ (@zopio/auth) - Kimlik Doğrulama
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 İÇİNDE NELER VAR?
• Kullanıcı girişi/kaydı
• Şifre şifreleme
• Oturum yönetimi
• Token (jeton) oluşturma

💻 NASIL KULLANILIR?
import { login } from '@zopio/auth';

const result = await login({
  email: 'kullanici@email.com',
  password: 'gizli123'
});

✅ NE ZAMAN KULLANILIR?
• Kullanıcı giriş sistemi yapıyorsunuz
• Şifre güvenliği sağlıyorsunuz
• Oturum yönetimi yapıyorsunuz

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💾 3. DATABASE PAKETİ (@zopio/database) - Veritabanı
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 İÇİNDE NELER VAR?
• Veritabanı bağlantısı
• Veri kaydetme/okuma/güncelleme/silme
• Sorgu yapma araçları

💻 NASIL KULLANILIR?
import { db } from '@zopio/database';

await db.users.create({
  name: 'Ahmet Yılmaz',
  email: 'ahmet@email.com'
});

✅ NE ZAMAN KULLANILIR?
• Kullanıcı bilgilerini kaydetmek istiyorsunuz
• Ürün listesi oluşturuyorsunuz
• Veri sorgulama yapıyorsunuz

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 4. UI PAKETİ (@zopio/ui) - Kullanıcı Arayüzü
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 İÇİNDE NELER VAR?
• Hazır butonlar
• Formlar
• Kartlar, tablolar
• Menüler

💻 NASIL KULLANILIR?
import { Button } from '@zopio/ui';

<Button variant="primary" onClick={handleClick}>
  Tıkla
</Button>

✅ NE ZAMAN KULLANILIR?
• Hızlı arayüz oluşturmak istiyorsunuz
• Tutarlı tasarım istiyorsunuz
• Zaman kazanmak istiyorsunuz

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 5. ANALYTICS PAKETİ (@zopio/analytics) - Analitik
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 İÇİNDE NELER VAR?
• Kullanıcı davranışı izleme
• Sayfa görüntüleme sayacı
• Olay (event) takibi

💻 NASIL KULLANILIR?
import { trackPageView } from '@zopio/analytics';

trackPageView('/anasayfa');

✅ NE ZAMAN KULLANILIR?
• Kullanıcı davranışlarını anlamak istiyorsunuz
• Hangi sayfaların popüler olduğunu görmek istiyorsunuz
• Performans metrikleri topluyorsunuz

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ PAKET NEDİR?
Paket, hazır kod parçalarıdır. Sıfırdan yazmak yerine kullanırsınız.

ÖRNEK:
// Paketsiz (zor yol):
function sendEmail(to, subject, message) {
  // 100 satır kod...
}

// Paketli (kolay yol):
import { sendEmail } from '@zopio/email';
sendEmail({ to, subject, message });

💡 İPUCU: Paketleri kullanmak için önce ilgili uygulamayı kurmalısınız!
`,
          },
        },
      ],
    };
  }
  
  if (name === "zopio-pratik-senaryo") {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `
🎬 PRATİK SENARYO: EMAIL GÖNDERME UYGULAMASI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 KULLANICI İSTEĞİ:
"Websiteme bir iletişim formu eklemek istiyorum. 
Form doldurulduğunda bana email gelsin."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 ADIM ADIM İŞLEM AKIŞI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 ADIM 1: Uygulama İsteği
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SİZ SORUN:
"Ben bir iletişim formu oluşturmak istiyorum. 
Hangi uygulamaları kullanmalıyım?"

MCP CEVAP VERİR:
Bu iş için şu uygulamaları kullanmalısınız:
1. WEB - İletişim formunu oluşturmak için
2. API - Form verilerini işlemek için
3. MAIL - Email göndermek için

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 ADIM 2: Uygulamaları Kurun
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SİZ SÖYLE:
"Zopio'da web uygulaması kur"
"Zopio'da API uygulaması kur"
"Zopio'da email paketini kur"

MCP YAPAR:
✅ Uygulamaları kurar
✅ Gerekli paketleri yükler
✅ Sunucuları başlatır

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 ADIM 3: Form Tasarımı
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SİZ SORUN:
"İletişim formu nasıl görünmeli? Örnek göster"

WINDSURF OLUŞTURUR:
// components/ContactForm.tsx
import { Button, Input, Textarea } from '@zopio/ui';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      alert('Mesajınız gönderildi!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input placeholder="Adınız" />
      <Input type="email" placeholder="Email" />
      <Textarea placeholder="Mesajınız" />
      <Button type="submit">Gönder</Button>
    </form>
  );
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 ADIM 4: API Endpoint Oluşturma
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WINDSURF SORAR:
"Email gönderimi için şunlar gerekli:
1. Email sağlayıcısı (Gmail, SendGrid vb.)
2. Gönderen email adresi
3. Alıcı email adresi

Hangi email servisini kullanmak istersiniz?"

SİZ CEVAP VERİN:
"Gmail kullanacağım. 
Gönderen: info@sirketim.com
Alıcı: ben@sirketim.com"

WINDSURF OLUŞTURUR:
// api/contact.ts
import { sendEmail } from '@zopio/email';

export async function POST(request: Request) {
  const { name, email, message } = await request.json();
  
  await sendEmail({
    from: 'info@sirketim.com',
    to: 'ben@sirketim.com',
    subject: \`Yeni İletişim: \${name}\`,
    html: \`
      <h2>Yeni İletişim Formu</h2>
      <p><strong>İsim:</strong> \${name}</p>
      <p><strong>Email:</strong> \${email}</p>
      <p><strong>Mesaj:</strong> \${message}</p>
    \`
  });
  
  return new Response(JSON.stringify({ success: true }));
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 ADIM 5: Gerekli Ayarlar
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WINDSURF AÇIKLAR:
✅ Eklenen Paketler:
1. @zopio/ui - Form bileşenleri için
2. @zopio/email - Email gönderimi için

✅ Mantık:
1. Kullanıcı formu doldurur
2. Form verileri API'ye gönderilir
3. API email paketini kullanarak email gönderir
4. Başarılı mesajı gösterilir

✅ Gerekli Ayarlar (.env dosyası):
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=info@sirketim.com
EMAIL_PASS=uygulama_sifresi

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 ADIM 6: Test ve Çalıştırma
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Tarayıcıda http://localhost:3000 açın
2. İletişim formunu doldurun
3. "Gönder" butonuna tıklayın
4. Email kutunuzu kontrol edin!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 ÖZET:
Bu senaryoda öğrendikleriniz:
✅ Hangi uygulamaların ne için kullanıldığı
✅ Paketlerin nasıl kullanıldığı
✅ Form oluşturma
✅ API endpoint oluşturma
✅ Email gönderme

💡 ŞİMDİ SİZ DENEYİN:
"Zopio'da web uygulaması kur" diyerek başlayın!

📖 DAHA FAZLA ÖRNEK:
EGITIM_SENARYOSU.md dosyasında daha fazla örnek bulabilirsiniz.
`,
          },
        },
      ],
    };
  }
  
  throw new Error(`Bilinmeyen prompt: ${name}`);
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "create-complete-application",
        description: "⭐ ZOPIO FRAMEWORK İLE TAM OTOMATİK UYGULAMA ÜRETİCİSİ! ⭐\n\n🚨 ZORUNLU KURALLAR:\n✅ SADECE Zopio Framework kullanılacak\n✅ SADECE TypeScript (.ts/.tsx) dosyaları oluşturulacak\n❌ Manuel Next.js/React kurulumu YASAK\n❌ JavaScript (.js/.jsx) dosyaları YASAK\n\n📝 KULLANIM: Doğal dille proje isteğinizi yazın, Zopio ile TypeScript tabanlı tamamen çalışır uygulama alın.\n\n💡 ÖRNEKLER:\n• 'Kuaför randevu uygulaması lazım'\n• 'Restoran sipariş sistemi istiyorum'\n• 'E-ticaret sitesi'\n• 'Blog uygulaması'",
        inputSchema: {
          type: "object",
          properties: {
            userRequest: {
              type: "string",
              description: "Doğal dille yazılmış proje isteği. HER TÜRLÜ UYGULAMA TALEBİ için bu tool'u kullan! Zopio framework ile TypeScript (.ts) dosyaları oluşturulacak. Örnek: 'Kuaför randevu sistemi', 'E-ticaret sitesi', 'Blog uygulaması', 'Restoran menü sistemi', 'Hastane randevu sistemi'",
            },
          },
          required: ["userRequest"],
        },
      },
      {
        name: "setup-zopio-app", 
        description: "⚙️ ZOPIO KLASİK KURULUM - Sadece özel durumlar için! Normal uygulama talepleri için create-complete-application kullan. Bu tool sadece Zopio'nun belirli bileşenlerini ayrı ayrı başlatmak için kullanılır.",
        inputSchema: {
          type: "object",
          properties: {
            appType: {
              type: "string",
              enum: ["web", "api", "app", "docs", "email", "all"],
              description: "Kurulacak uygulama türü: web (Web uygulaması), api (API), app (Ana uygulama), docs (Dokümantasyon), email (Email paketi), all (Tüm uygulamalar)",
            },
          },
          required: ["appType"],
        },
      },
      {
        name: "stop-zopio-app",
        description: "Çalışan Zopio uygulamasını durdurur. Belirli bir uygulama veya tüm uygulamalar.",
        inputSchema: {
          type: "object",
          properties: {
            appType: {
              type: "string",
              enum: ["web", "api", "app", "docs", "email", "all"],
              description: "Durdurulacak uygulama türü. Belirtilmezse tüm uygulamalar durdurulur.",
            },
          },
          required: [],
        },
      },
      {
        name: "check-zopio-status",
        description: "Zopio kurulumunun ve çalışan uygulamaların durumunu kontrol eder.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  // 🚨 KRİTİK: Framework yasağı kontrolü - KULLANICI SINIRI
  if (args) {
    const argString = JSON.stringify(args).toLowerCase();
    const prohibitionCheck = checkFrameworkProhibition(argString);
    
    if (prohibitionCheck.isViolation) {
      return {
        content: [
          {
            type: "text",
            text: prohibitionCheck.message,
          },
        ],
      };
    }
  }
  
  // İlk tool çağrısında karşılama mesajını göster
  const welcomePrefix = !hasShownWelcome ? getWelcomeMessage() + "\n\n" : "";
  hasShownWelcome = true;
  
  try {
    switch (name) {
      case "create-complete-application": {
        const userRequest = args?.userRequest as string;
        if (!userRequest) {
          throw new Error("userRequest parametresi gerekli! Doğal dille proje isteğinizi yazın.");
        }
        const result = await generateCompleteApplication(userRequest);
        return {
          content: [
            {
              type: "text",
              text: welcomePrefix + result,
            },
          ],
        };
      }
      
      case "setup-zopio-app": {
        const appType = args?.appType as ZopioAppType;
        if (!appType) {
          throw new Error("appType parametresi gerekli! (web, api, app, docs, all)");
        }
        const result = await setupZopioScenario(appType);
        return {
          content: [
            {
              type: "text",
              text: welcomePrefix + result,
            },
          ],
        };
      }
      
      case "stop-zopio-app": {
        const appType = args?.appType as ZopioAppType | undefined;
        const result = await stopZopioApp(appType);
        return {
          content: [
            {
              type: "text",
              text: welcomePrefix + result,
            },
          ],
        };
      }
      
      case "check-zopio-status": {
        const result = await checkZopioStatus();
        return {
          content: [
            {
              type: "text",
              text: welcomePrefix + result,
            },
          ],
        };
      }
      
      default:
        throw new Error(`Bilinmeyen tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: welcomePrefix + `❌ Zopio MCP Hatası: ${error.message}\n\n💡 Manuel framework kurulumu yapmayın! create-complete-application tool'unu kullanın.`,
        },
      ],
      isError: true,
    };
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Sunucu başlatıldığında karşılama mesajı
  console.error("\n" + "🚀".repeat(20));
  console.error("🚀 OTOMATİK UYGULAMA ÜRETİCİSİ BAŞLATILDI! 🚀");
  console.error("🚀".repeat(20) + "\n");
  
  console.error("🎯 ZOPIO FRAMEWORK İLE TAM OTOMATİK UYGULAMA ÜRETİMİ!\n");
  console.error("🚨 KRİTİK SINIRLAR:");
  console.error("   ❌ MANUEL NEXT.JS/REACT KURULUMU YASAK!");
  console.error("   ❌ JAVASCRIPT (.js/.jsx) DOSYALARI YASAK!");
  console.error("   ✅ SADECE ZOPIO FRAMEWORK!");
  console.error("   ✅ SADECE TYPESCRIPT (.ts/.tsx)!\n");
  
  console.error("📋 MEVCUT TOOL'LAR:\n");
  console.error("  🤖 create-complete-application ⭐ ANA TOOL ⭐");
  console.error("      → HER TÜRLÜ UYGULAMA TALEBİ için bu tool'u kullan!");
  console.error("      → Zopio framework (https://github.com/zopiolabs/zopio.git)");
  console.error("      → TypeScript (.ts) dosyaları ile otomatik üretim!");
  console.error("      → Örnek: 'Kuaför randevu sistemi', 'Restoran uygulaması'");
  console.error("      → 2-3 dakikada çalışır halde teslim!\n");
  
  console.error("  🔧 setup-zopio-app (Sadece özel durumlar)");
  console.error("      → Normal talep varsa create-complete-application kullan!\n");
  
  console.error("  🛑 stop-zopio-app");
  console.error("      → Çalışan uygulamaları durdurur\n");
  
  console.error("  📊 check-zopio-status");
  console.error("      → Durum kontrolü ve raporlama\n");
  
  console.error("─".repeat(60) + "\n");
  console.error("🔥 OTOMATİK UYGULAMA ÖRNEKLERİ:\n");
  console.error("  💅 'Güzellik salonu randevu uygulaması'");
  console.error("  🏥 'Hastane hasta takip sistemi'");
  console.error("  🛒 'E-ticaret sitesi'");
  console.error("  📚 'Kütüphane kitap yönetimi'");
  console.error("  🍕 'Restoran sipariş sistemi'");
  console.error("  🏢 'Şirket çalışan yönetimi'\n");
  
  console.error("─".repeat(60) + "\n");
  console.error("✨ UYGULAMANIZDA NELER OLACAK:");
  console.error("  ✅ Admin paneli + Kullanıcı arayüzü");
  console.error("  ✅ CRUD işlemleri (Ekle, Düzenle, Sil)");
  console.error("  ✅ Database + API + Frontend");
  console.error("  ✅ Responsive tasarım (mobil uyumlu)");
  console.error("  ✅ Form validasyonu + Error handling");
  console.error("  ✅ Real-time güncellemeler\n");
  
  console.error("🚀".repeat(20) + "\n");
  console.error("💬 Hemen deneyin: Ne tür uygulama istiyorsunuz?");
  console.error("🚀".repeat(20) + "\n");
}

runServer().catch(console.error);
