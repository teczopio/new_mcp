# Zopio MCP Server

Zopio framework'ünü otomatik olarak masaüstünüze klonlayan, bağımlılıkları yükleyen ve geliştirme sunucusunu başlatan MCP sunucusu.

## 🎯 Özellikler

- ✅ **Cross-platform**: macOS, Linux ve Windows 11 desteği
- 🚀 **Otomatik kurulum**: Tek tıkla Zopio'yu masaüstüne klonlar ve başlatır
- 📦 **Bağımlılık yönetimi**: npm install otomatik çalışır
- 🔄 **Sunucu kontrolü**: Başlatma ve durdurma işlemleri
- 📊 **Durum takibi**: Kurulum ve sunucu durumunu kontrol edin

## 🛠️ Mevcut Tool'lar

### 1. **setup-zopio**
Zopio framework'ünü masaüstüne klonlar, bağımlılıkları yükler ve geliştirme sunucusunu başlatır.

**Parametreler:**
- `shouldClone` (boolean, default: true): 
  - `true`: Repoyu klonla ve başlat
  - `false`: Mevcut repoyu kullan ve başlat

### 2. **stop-zopio**
Çalışan Zopio geliştirme sunucusunu durdurur.

### 3. **check-zopio-status**
Zopio kurulumunun ve sunucunun durumunu kontrol eder.

## 🧪 Test Yöntemleri

### 1. MCP Inspector ile Test (Önerilen)

```bash
npx @modelcontextprotocol/inspector npx ts-node src/server.ts
```

Web arayüzünde:
1. "setup-zopio" tool'unu seçin
2. `shouldClone: true` parametresi ile çalıştırın
3. Zopio masaüstünüze klonlanacak ve başlatılacak

### 2. Claude Desktop ile Kullanım

**macOS/Linux:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "zopio": {
      "command": "npx",
      "args": [
        "ts-node",
        "/Users/KULLANICI_ADINIZ/Desktop/NEW MCP/src/server.ts"
      ]
    }
  }
}
```

Claude Desktop'ı yeniden başlatın ve şunu sorun:
> "Zopio'yu masaüstüme klonla ve başlat"

## 📋 Gereksinimler

- Node.js 18+
- Git
- npm

## 🚀 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Sunucuyu test et
npx @modelcontextprotocol/inspector npx ts-node src/server.ts
```

## 📝 Kullanım Senaryoları

### Senaryo 1: İlk Kurulum
```
Tool: setup-zopio
Parametre: shouldClone = true
Sonuç: Zopio masaüstüne klonlanır ve başlatılır
```

### Senaryo 2: Mevcut Repo ile Çalışma
```
Tool: setup-zopio
Parametre: shouldClone = false
Sonuç: Masaüstündeki mevcut Zopio klasörü kullanılır
```

### Senaryo 3: Sunucuyu Durdurma
```
Tool: stop-zopio
Sonuç: Çalışan geliştirme sunucusu durdurulur
```

## 🌍 Platform Desteği

| Platform | Masaüstü Yolu | Durum |
|----------|---------------|-------|
| macOS | `~/Desktop` | ✅ Test edildi |
| Linux | `~/Desktop` | ✅ Destekleniyor |
| Windows 11 | `%USERPROFILE%\Desktop` | ✅ Destekleniyor |

## 📄 Notlar

- Zopio reposu her zaman masaüstüne klonlanır
- Sunucu stdio üzerinden çalışır (MCP standardı)
- MCP protokol versiyonu: 2024-11-05
- TypeScript ile yazılmıştır
