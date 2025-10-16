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
let runningProcess: ChildProcess | null = null;
let hasShownWelcome = false;

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
 * Zopio reposunu klonlar ve ayağa kaldırır
 */
async function setupZopio(shouldClone: boolean): Promise<string> {
  const desktopPath = getDesktopPath();
  const repoDir = path.join(desktopPath, "zopio");
  
  let output = "";
  
  try {
    // Repo zaten var mı kontrol et
    const repoExists = fs.existsSync(repoDir);
    
    if (shouldClone) {
      if (repoExists) {
        output += "⚠️ Zopio klasörü zaten mevcut. Mevcut klasör kullanılacak.\n\n";
      } else {
        output += "📥 Zopio reposu klonlanıyor...\n";
        execSync(`git clone ${REPO_URL} "${repoDir}"`, { 
          stdio: "pipe",
          encoding: "utf-8" 
        });
        output += "✅ Repo başarıyla klonlandı.\n\n";
      }
    } else {
      if (!repoExists) {
        return "❌ Hata: Zopio klasörü bulunamadı. Lütfen önce repoyu klonlayın veya 'shouldClone: true' parametresi ile çalıştırın.";
      }
      output += "✅ Mevcut Zopio klasörü kullanılıyor.\n\n";
    }
    
    // Bağımlılıkları yükle
    output += "📦 Bağımlılıklar yükleniyor...\n";
    const installOutput = execSync("pnpm install", { 
      cwd: repoDir, 
      stdio: "pipe",
      encoding: "utf-8"
    });
    output += "✅ Bağımlılıklar yüklendi.\n\n";
    
    // Geliştirme sunucusunu başlat
    output += "🚀 Geliştirme sunucusu başlatılıyor...\n";
    runningProcess = spawn("pnpm", ["run", "dev"], { 
      cwd: repoDir, 
      shell: true,
      detached: false
    });
    
    output += `✅ Zopio geliştirme sunucusu başlatıldı!\n`;
    output += `📁 Konum: ${repoDir}\n`;
    output += `🔗 Sunucu çalışıyor (genellikle http://localhost:3000)\n\n`;
    output += `ℹ️ Sunucuyu durdurmak için 'stop-zopio' tool'unu kullanın.`;
    
    return output;
    
  } catch (error: any) {
    return `❌ Hata oluştu: ${error.message}`;
  }
}

/**
 * Çalışan Zopio sunucusunu durdurur
 */
async function stopZopio(): Promise<string> {
  if (!runningProcess) {
    return "ℹ️ Çalışan bir Zopio sunucusu bulunamadı.";
  }
  
  try {
    runningProcess.kill();
    runningProcess = null;
    return "🛑 Zopio geliştirme sunucusu durduruldu.";
  } catch (error: any) {
    return `❌ Sunucu durdurulurken hata oluştu: ${error.message}`;
  }
}

/**
 * Zopio sunucusunun durumunu kontrol eder
 */
async function checkZopioStatus(): Promise<string> {
  const desktopPath = getDesktopPath();
  const repoDir = path.join(desktopPath, "zopio");
  const repoExists = fs.existsSync(repoDir);
  
  let status = "📊 Zopio Durumu:\n\n";
  status += `📁 Masaüstü yolu: ${desktopPath}\n`;
  status += `📂 Repo klasörü: ${repoExists ? "✅ Mevcut" : "❌ Bulunamadı"}\n`;
  status += `🚀 Sunucu durumu: ${runningProcess ? "✅ Çalışıyor" : "⏸️ Durdurulmuş"}\n`;
  
  if (repoExists) {
    status += `📍 Konum: ${repoDir}\n`;
  }
  
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

👋 Merhaba! Zopio framework'ünü yönetmek için buradayım.

📋 KULLANILABILIR KOMUTLAR:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1️⃣  ZOPIO'YU KUR
      ├─ Komut: "Zopio'yu kur" veya "setup zopio"
      ├─ Ne yapar: Zopio framework'ünü masaüstünüze klonlar
      ├─ Bağımlılıkları otomatik yükler (pnpm install)
      └─ Geliştirme sunucusunu başlatır (pnpm run dev)

  2️⃣  DURUM KONTROL ET
      ├─ Komut: "Zopio durumunu kontrol et" veya "status"
      ├─ Ne yapar: Kurulum durumunu gösterir
      └─ Sunucunun çalışıp çalışmadığını kontrol eder

  3️⃣  SUNUCUYU DURDUR
      ├─ Komut: "Zopio sunucusunu durdur" veya "stop zopio"
      └─ Ne yapar: Çalışan dev sunucusunu durdurur

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 HIZLI BAŞLANGIÇ:

   Zopio'yu ilk kez kuruyorsanız:
   → "Zopio'yu kur" yazın

   Zaten kurulu mu kontrol etmek için:
   → "Zopio durumunu kontrol et" yazın

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 KURULUM DETAYLARI:
   • Konum: ~/Desktop/zopio
   • Repo: https://github.com/zopiolabs/zopio.git
   • Paket yöneticisi: pnpm
   • Dev server: http://localhost:3000 (genellikle)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 İPUCU: Doğrudan Türkçe komutlar verebilirsiniz!
   Örnek: "Zopio'yu masaüstüme kur ve başlat"

╔════════════════════════════════════════════════════════════╗
║  Hazırsanız, "Zopio'yu kur" diyerek başlayalım! 🚀        ║
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

// Prompts endpoint - Karşılama mesajı
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "zopio-hosgeldiniz",
        description: "🎉 Zopio MCP Server'a hoşgeldiniz! Kullanım talimatlarını göster.",
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
            text: `╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          🎉 ZOPIO MCP SERVER'A HOŞGELDİNİZ! 🎉           ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

👋 Merhaba! Zopio framework'ünü yönetmek için buradayım.

📋 KULLANILABILIR KOMUTLAR:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1️⃣  ZOPIO'YU KUR
      ├─ Komut: "Zopio'yu kur" veya "setup zopio"
      ├─ Ne yapar: Zopio framework'ünü masaüstünüze klonlar
      ├─ Bağımlılıkları otomatik yükler (pnpm install)
      └─ Geliştirme sunucusunu başlatır (pnpm run dev)

  2️⃣  DURUM KONTROL ET
      ├─ Komut: "Zopio durumunu kontrol et" veya "status"
      ├─ Ne yapar: Kurulum durumunu gösterir
      └─ Sunucunun çalışıp çalışmadığını kontrol eder

  3️⃣  SUNUCUYU DURDUR
      ├─ Komut: "Zopio sunucusunu durdur" veya "stop zopio"
      └─ Ne yapar: Çalışan dev sunucusunu durdurur

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 HIZLI BAŞLANGIÇ:

   Zopio'yu ilk kez kuruyorsanız:
   → "Zopio'yu kur" yazın

   Zaten kurulu mu kontrol etmek için:
   → "Zopio durumunu kontrol et" yazın

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 KURULUM DETAYLARI:
   • Konum: ~/Desktop/zopio
   • Repo: https://github.com/zopiolabs/zopio.git
   • Paket yöneticisi: pnpm
   • Dev server: http://localhost:3000 (genellikle)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 İPUCU: Doğrudan Türkçe komutlar verebilirsiniz!
   Örnek: "Zopio'yu masaüstüme kur ve başlat"

╔════════════════════════════════════════════════════════════╗
║  Hazırsanız, "Zopio'yu kur" diyerek başlayalım! 🚀        ║
╚════════════════════════════════════════════════════════════╝`,
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
        name: "setup-zopio",
        description: "Zopio framework'ünü masaüstüne klonlar, bağımlılıkları yükler ve geliştirme sunucusunu başlatır.",
        inputSchema: {
          type: "object",
          properties: {
            shouldClone: {
              type: "boolean",
              description: "true: Repoyu klonla ve başlat, false: Mevcut repoyu kullan ve başlat",
              default: true,
            },
          },
          required: [],
        },
      },
      {
        name: "stop-zopio",
        description: "Çalışan Zopio geliştirme sunucusunu durdurur.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "check-zopio-status",
        description: "Zopio kurulumunun ve sunucunun durumunu kontrol eder.",
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
      case "setup-zopio": {
        const shouldClone = args?.shouldClone !== false; // default true
        const result = await setupZopio(shouldClone);
        return {
          content: [
            {
              type: "text",
              text: welcomePrefix + result,
            },
          ],
        };
      }
      
      case "stop-zopio": {
        const result = await stopZopio();
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
  console.error("🚀 ZOPIO MCP SUNUCUSU BAŞLATILDI");
  console.error("=".repeat(60) + "\n");
  
  console.error("📋 MEVCUT TOOL'LAR:\n");
  console.error("  1️⃣  setup-zopio");
  console.error("      → Zopio framework'ünü masaüstüne klonlar,");
  console.error("        bağımlılıkları yükler ve geliştirme sunucusunu başlatır.\n");
  
  console.error("  2️⃣  stop-zopio");
  console.error("      → Çalışan Zopio geliştirme sunucusunu durdurur.\n");
  
  console.error("  3️⃣  check-zopio-status");
  console.error("      → Zopio kurulumunun ve sunucunun durumunu kontrol eder.\n");
  
  console.error("─".repeat(60) + "\n");
  console.error("📖 KULLANIM TALİMATLARI:\n");
  console.error("  • setup [clone]    - Zopio'yu kur (clone: true/false)");
  console.error("  • stop             - Zopio sunucusunu durdur");
  console.error("  • status           - Zopio durumunu kontrol et");
  console.error("  • exit             - Çıkış\n");
  console.error("─".repeat(60) + "\n");
  console.error("💡 İPUCU: Cascade'de bu tool'ları doğrudan kullanabilirsiniz!");
  console.error("   Örnek: 'Zopio'yu kur' veya 'Zopio durumunu kontrol et'\n");
  console.error("=".repeat(60) + "\n");
}

runServer().catch(console.error);
