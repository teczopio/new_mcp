#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { execSync, spawn, ChildProcess } from "child_process";
import os from "os";
import path from "path";
import fs from "fs";

const REPO_URL = "https://github.com/zopiolabs/zopio.git";
let runningProcess: ChildProcess | null = null;

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
    const installOutput = execSync("npm install", { 
      cwd: repoDir, 
      stdio: "pipe",
      encoding: "utf-8"
    });
    output += "✅ Bağımlılıklar yüklendi.\n\n";
    
    // Geliştirme sunucusunu başlat
    output += "🚀 Geliştirme sunucusu başlatılıyor...\n";
    runningProcess = spawn("npm", ["run", "dev"], { 
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

const server = new Server(
  {
    name: "zopio",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

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
  
  try {
    switch (name) {
      case "setup-zopio": {
        const shouldClone = args?.shouldClone !== false; // default true
        const result = await setupZopio(shouldClone);
        return {
          content: [
            {
              type: "text",
              text: result,
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
              text: result,
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
              text: result,
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
          text: `❌ Hata: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

runServer().catch(console.error);
