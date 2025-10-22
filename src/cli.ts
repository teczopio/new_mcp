#!/usr/bin/env node
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import readline from "readline";
import { spawn } from "child_process";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let client: Client | null = null;

async function connectToServer() {
  console.log("🔌 MCP Sunucusuna bağlanılıyor...\n");
  
  const serverProcess = spawn("npx", ["ts-node", "src/server.ts"], {
    cwd: process.cwd(),
    stdio: ["pipe", "pipe", "inherit"],
  });

  const transport = new StdioClientTransport({
    command: "npx",
    args: ["ts-node", "src/server.ts"],
  });

  client = new Client(
    {
      name: "zopio-cli",
      version: "1.0.0",
    },
    {
      capabilities: {},
    }
  );

  await client.connect(transport);
  console.log("✅ Sunucuya bağlandı!\n");
  
  // Mevcut tool'ları listele
  const tools = await client.listTools();
  console.log("📋 Mevcut Tool'lar:");
  tools.tools.forEach((tool: any) => {
    console.log(`  • ${tool.name}: ${tool.description}`);
  });
  console.log("");
}

async function callTool(toolName: string, args: any = {}) {
  if (!client) {
    console.log("❌ Sunucuya bağlı değil!");
    return;
  }

  try {
    console.log(`\n🔧 Tool çağrılıyor: ${toolName}`);
    if (Object.keys(args).length > 0) {
      console.log(`📝 Parametreler: ${JSON.stringify(args, null, 2)}`);
    }
    console.log("");

    const result = await client.callTool({
      name: toolName,
      arguments: args,
    });

    console.log("📤 Sonuç:");
    console.log("─".repeat(50));
    (result.content as Array<{ type: string; text?: string }>).forEach((item) => {
      if (item.type === "text" && item.text) {
        console.log(item.text);
      }
    });
    console.log("─".repeat(50));
  } catch (error: any) {
    console.log(`❌ Hata: ${error.message}`);
  }
}

function showHelp() {
  console.log("\n📖 Komutlar:");
  console.log("  setup <app>   - Zopio uygulaması kur");
  console.log("                  app: web, api, app, docs, email, all");
  console.log("                  Örnek: setup web, setup email");
  console.log("  stop [app]    - Uygulamayı durdur (belirtilmezse tümü)");
  console.log("                  Örnek: stop web veya stop");
  console.log("  status        - Zopio durumunu kontrol et");
  console.log("  help          - Bu yardım mesajını göster");
  console.log("  exit          - Çıkış\n");
}

async function handleCommand(input: string) {
  const parts = input.trim().split(/\s+/);
  const command = parts[0].toLowerCase();

  switch (command) {
    case "setup":
      const appType = parts[1];
      if (!appType) {
        console.log("❌ Uygulama türü belirtmelisiniz!");
        console.log("Kullanım: setup <app>");
        console.log("Seçenekler: web, api, app, docs, email, all\n");
        break;
      }
      if (!["web", "api", "app", "docs", "email", "all"].includes(appType)) {
        console.log(`❌ Geçersiz uygulama türü: ${appType}`);
        console.log("Seçenekler: web, api, app, docs, email, all\n");
        break;
      }
      await callTool("setup-zopio-app", { appType });
      break;

    case "stop":
      const stopAppType = parts[1];
      if (stopAppType && !["web", "api", "app", "docs", "email", "all"].includes(stopAppType)) {
        console.log(`❌ Geçersiz uygulama türü: ${stopAppType}`);
        console.log("Seçenekler: web, api, app, docs, email, all\n");
        break;
      }
      await callTool("stop-zopio-app", stopAppType ? { appType: stopAppType } : {});
      break;

    case "status":
      await callTool("check-zopio-status");
      break;

    case "help":
      showHelp();
      break;

    case "exit":
      console.log("\n👋 Görüşmek üzere!\n");
      rl.close();
      process.exit(0);
      break;

    case "":
      break;

    default:
      console.log(`❌ Bilinmeyen komut: ${command}`);
      console.log("'help' yazarak mevcut komutları görebilirsiniz.\n");
  }
}

async function startCLI() {
  try {
    await connectToServer();
    showHelp();

    const prompt = () => {
      rl.question("zopio> ", async (input) => {
        await handleCommand(input);
        prompt();
      });
    };

    prompt();
  } catch (error: any) {
    console.error(`❌ Başlatma hatası: ${error.message}`);
    process.exit(1);
  }
}

startCLI();
