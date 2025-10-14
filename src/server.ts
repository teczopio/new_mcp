#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { execSync, spawn } from "child_process";
import os from "os";
import path from "path";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const repoUrl = "https://github.com/teczopio/new_mcp.git";
const repoDir = path.join(process.cwd(), "new_mcp");

async function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function setupNewMcp() {
  const answer = await ask("new_mcp reposunu klonladınız mı, benim klonlayıp başlatmamı mı istersiniz? (e/h): ");
  if (answer.toLowerCase() === "h") {
    console.log("➡️ Repo klonlanıyor...");
    execSync(`git clone ${repoUrl}`, { stdio: "inherit" });
  }

  console.log("📦 Bağımlılıklar yükleniyor...");
  execSync("npm install", { cwd: repoDir, stdio: "inherit" });

  console.log("🚀 Geliştirme sunucusu başlatılıyor...");
  const devProcess = spawn("npm", ["run", "dev"], { cwd: repoDir, stdio: "inherit", shell: true });

  const stop = await ask("İşlemleriniz bittiğinde bana bilgi verirseniz geliştirme sunucularını kapatabilirim. (bitti yazın): ");
  if (stop.toLowerCase().includes("bitti")) {
    console.log("🛑 Sunucu kapatılıyor...");
    devProcess.kill();
  }

  rl.close();
}

const server = new Server(
  {
    name: "new_mcp",
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
        name: "setup-new_mcp",
        description: "new_mcp reposunu klonlar, bağımlılıkları yükler ve geliştirme sunucusunu başlatır.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "setup-new_mcp") {
    await setupNewMcp();
    return {
      content: [
        {
          type: "text",
          text: "new_mcp kurulumu tamamlandı.",
        },
      ],
    };
  }
  throw new Error(`Unknown tool: ${request.params.name}`);
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

runServer().catch(console.error);
