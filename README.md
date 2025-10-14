# New MCP Server

Bu MCP sunucusu, new_mcp reposunu klonlama, bağımlılıkları yükleme ve geliştirme sunucusunu başlatma işlemlerini otomatikleştirir.

## Test Yöntemleri

### 1. MCP Inspector ile Test (Önerilen)

```bash
npx @modelcontextprotocol/inspector npx ts-node src/server.ts
```

Bu komut bir web arayüzü açacak ve MCP sunucunuzu test edebilirsiniz.

### 2. Test Script ile Test

```bash
node test-mcp.js
```

Bu basit bir stdio test script'idir ve sunucunuzun temel işlevlerini test eder.

### 3. Claude Desktop ile Kullanım

Claude Desktop config dosyanızı düzenleyin:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "new_mcp": {
      "command": "npx",
      "args": [
        "ts-node",
        "/Users/tahaenescinli/Desktop/NEW MCP/src/server.ts"
      ]
    }
  }
}
```

Claude Desktop'ı yeniden başlatın ve MCP sunucunuz kullanıma hazır olacak.

## Mevcut Tool

- **setup-new_mcp**: new_mcp reposunu klonlar, bağımlılıkları yükler ve geliştirme sunucusunu başlatır.

## Geliştirme

```bash
# Bağımlılıkları yükle
npm install

# Sunucuyu çalıştır
npx ts-node src/server.ts

# Test et
node test-mcp.js
```

## Notlar

- Sunucu stdio üzerinden çalışır
- MCP protokol versiyonu: 2024-11-05
- TypeScript ile yazılmıştır
