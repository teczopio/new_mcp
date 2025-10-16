# Zopio MCP Server

Zopio framework'ünü otomatik olarak masaüstünüze klonlayan, bağımlılıkları yükleyen ve geliştirme sunucusunu başlatan MCP sunucusu.

## 🎯 Özellikler

- ✅ **Cross-platform**: macOS, Linux ve Windows 11 desteği
- 🚀 **Otomatik kurulum**: Tek tıkla Zopio'yu masaüstüne klonlar ve başlatır
- 📦 **Bağımlılık yönetimi**: pnpm install otomatik çalışır
- 🔄 **Sunucu kontrolü**: Başlatma ve durdurma işlemleri
- 📊 **Durum takibi**: Kurulum ve sunucu durumunu kontrol edin
- 👋 **Karşılama mesajı**: Cascade başladığında otomatik talimatlar gösterilir

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

### 1. Terminal CLI ile Test (Önerilen)

```bash
npm run cli
```

CLI başlatıldığında şu çıktıyı göreceksiniz:

```text
🔌 MCP Sunucusuna bağlanılıyor...

✅ Sunucuya bağlandı!

📋 Mevcut Tool'lar:
  • setup-zopio: Zopio framework'ünü masaüstüne klonlar, bağımlılıkları yükler ve geliştirme sunucusunu başlatır.
  • stop-zopio: Çalışan Zopio geliştirme sunucusunu durdurur.
  • check-zopio-status: Zopio kurulumunun ve sunucunun durumunu kontrol eder.


📖 Komutlar:
  setup [clone]  - Zopio'yu kur (clone: true/false)
  stop          - Zopio sunucusunu durdur
  status        - Zopio durumunu kontrol et
  help          - Bu yardım mesajını göster
  exit          - Çıkış
```

### 2. MCP Inspector ile Test

```bash
npx @modelcontextprotocol/inspector npx ts-node src/server.ts
```

Web arayüzünde:
1. "setup-zopio" tool'unu seçin
2. `shouldClone: true` parametresi ile çalıştırın
3. Zopio masaüstünüze klonlanacak ve başlatılacak

### 3. Claude Desktop ile Kullanım

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

### 4. Windsurf IDE ile Kullanım

**macOS/Linux:** `~/Library/Application Support/Windsurf/User/settings.json`  
**Windows:** `%APPDATA%\Windsurf\User\settings.json`

`settings.json` dosyasına ekleyin:

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

Windsurf'ü yeniden başlatın. **Cascade açıldığı anda** Zopio MCP sunucusu otomatik olarak bağlanacak ve karşılama mesajını göreceksiniz:

```text
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
```

**Cascade'de Kullanım:**
- ✅ Cascade açıldığında yukarıdaki karşılama mesajı **otomatik olarak** görünür
- ✅ Doğrudan Türkçe komutlar verebilirsiniz:
  - "Zopio'yu kur"
  - "Zopio durumunu kontrol et"
  - "Zopio sunucusunu durdur"

## 📋 Gereksinimler

- Node.js 18+
- Git
- npm

## 🚀 Kurulum

```bash
# Bağımlılıkları yükle
pnpm install

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
