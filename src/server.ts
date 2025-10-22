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
import os from "os";
import path from "path";
import fs from "fs";

const REPO_URL = "https://github.com/zopiolabs/zopio.git";
let runningProcesses: Map<string, ChildProcess> = new Map();
let hasShownWelcome = false;

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
║          🎉 ZOPIO MCP SERVER'A HOŞGELDİNİZ! 🎉           ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

👋 Merhaba! Zopio framework'ünü senaryo bazlı kurmak için buradayım.

📋 SENARYO BAZLI KURULUM:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  🌐 WEB UYGULAMASI
      ├─ Komut: "Zopio'da web uygulaması kur"
      ├─ Ne yapar: Sadece web uygulamasını kurar ve başlatır
      └─ Port: 3000

  🔌 API UYGULAMASI
      ├─ Komut: "Zopio'da API uygulaması kur"
      ├─ Ne yapar: Sadece API uygulamasını kurar ve başlatır
      └─ Port: 3001

  📱 ANA UYGULAMA
      ├─ Komut: "Zopio'da ana uygulamayı kur"
      ├─ Ne yapar: Sadece ana uygulamayı kurar ve başlatır
      └─ Port: 3002

  📚 DOKÜMANTASYON
      ├─ Komut: "Zopio'da dokümantasyonu kur"
      ├─ Ne yapar: Sadece dokümantasyon sitesini kurar ve başlatır
      └─ Port: 3003

  📧 EMAIL PAKETİ
      ├─ Komut: "Zopio'da email paketini kur"
      ├─ Ne yapar: Sadece email servislerini kurar ve başlatır
      └─ Port: 3004

  🎯 TÜM UYGULAMALAR
      ├─ Komut: "Zopio'nun tüm uygulamalarını kur"
      └─ Ne yapar: Tüm uygulamaları kurar ve başlatır

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛑 DURDURMA:
   • Belirli bir uygulamayı durdur: "Web uygulamasını durdur"
   • Tüm uygulamaları durdur: "Tüm uygulamaları durdur"

📊 DURUM KONTROL:
   • "Zopio durumunu kontrol et"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 KURULUM DETAYLARI:
   • Konum: ~/Desktop/zopio
   • Repo: https://github.com/zopiolabs/zopio.git
   • Paket yöneticisi: pnpm

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 İPUCU: Doğrudan Türkçe komutlar verebilirsiniz!
   Örnek: "Ben Zopio'da web uygulaması kurmak istiyorum"

╔════════════════════════════════════════════════════════════╗
║  Hazırsanız, istediğiniz senaryoyu seçin! 🚀              ║
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
        name: "setup-zopio-app",
        description: "Zopio'da belirli bir uygulamayı senaryo bazlı kurar ve başlatır. Web, API, Ana Uygulama, Dokümantasyon, Email veya Tümü.",
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
  
  // İlk tool çağrısında karşılama mesajını göster
  const welcomePrefix = !hasShownWelcome ? getWelcomeMessage() + "\n\n" : "";
  hasShownWelcome = true;
  
  try {
    switch (name) {
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
          text: welcomePrefix + `❌ Hata: ${error.message}`,
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
  console.error("\n" + "=".repeat(60));
  console.error("🚀 ZOPIO MCP SUNUCUSU BAŞLATILDI (SENARYO BAZLI)");
  console.error("=".repeat(60) + "\n");
  
  console.error("📋 MEVCUT TOOL'LAR:\n");
  console.error("  1️⃣  setup-zopio-app");
  console.error("      → Senaryo bazlı kurulum: web, api, app, docs veya all");
  console.error("      → Sadece seçilen uygulamayı kurar ve başlatır\n");
  
  console.error("  2️⃣  stop-zopio-app");
  console.error("      → Çalışan uygulamayı durdurur (belirli veya tümü)\n");
  
  console.error("  3️⃣  check-zopio-status");
  console.error("      → Kurulum ve çalışan uygulamaların durumunu gösterir\n");
  
  console.error("─".repeat(60) + "\n");
  console.error("🎯 SENARYO ÖRNEKLERİ:\n");
  console.error("  • 'Zopio'da web uygulaması kur'");
  console.error("  • 'Zopio'da API uygulaması kur'");
  console.error("  • 'Zopio'nun tüm uygulamalarını kur'");
  console.error("  • 'Web uygulamasını durdur'");
  console.error("  • 'Zopio durumunu kontrol et'\n");
  console.error("─".repeat(60) + "\n");
  console.error("💡 İPUCU: Sadece ihtiyacınız olan uygulamayı kurun!");
  console.error("   Artık tüm uygulamalar değil, seçtiğiniz uygulama kurulacak.\n");
  console.error("=".repeat(60) + "\n");
}

runServer().catch(console.error);
