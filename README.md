# Zopio MCP Server (Senaryo Bazlı)

Model Context Protocol (MCP) sunucusu ile Zopio framework'ünü senaryo bazlı yönetin!

## 🎯 Özellikler

- ✅ **Senaryo bazlı kurulum** - Sadece ihtiyacınız olan uygulamayı kurun
- ✅ **Yeni başlayanlar için eğitim** - Hiç bilmeyen geliştiriciler için kapsamlı rehber
- ✅ Zopio framework'ünü otomatik klonlama
- ✅ Bağımlılıkları otomatik yükleme (pnpm)
- ✅ Belirli uygulamaları başlatma (web, api, app, docs)
- ✅ Sunucu durumunu kontrol etme
- ✅ Türkçe komut desteği
- ✅ Cascade AI ile entegrasyon
- ✅ **Etkileşimli promptlar** - Uygulamalar ve paketler hakkında detaylı açıklamalar

## 🎬 Senaryolar

Artık tüm uygulamaları değil, sadece ihtiyacınız olanı kurabilirsiniz:

- **Web Uygulaması** - Sadece web arayüzünü çalıştırın (Port: 3000)
- **API Uygulaması** - Sadece backend API'yi çalıştırın (Port: 3001)
- **Ana Uygulama** - Sadece ana uygulamayı çalıştırın (Port: 3002)
- **Dokümantasyon** - Sadece dokümantasyon sitesini çalıştırın (Port: 3003)
- **Email Paketi** - Sadece email servislerini çalıştırın (Port: 3004)
- **Tüm Uygulamalar** - Hepsini birden çalıştırın

## 🛠️ Mevcut Tool'lar

### 1. **setup-zopio-app**

Zopio'da belirli bir uygulamayı senaryo bazlı kurar ve başlatır.

**Parametreler:**
- `appType` (string, **gerekli**):
  - `web`: Web uygulaması (Port: 3000)
  - `api`: API uygulaması (Port: 3001)
  - `app`: Ana uygulama (Port: 3002)
  - `docs`: Dokümantasyon (Port: 3003)
  - `email`: Email paketi (Port: 3004)
  - `all`: Tüm uygulamalar

### 2. **stop-zopio-app**

Çalışan Zopio uygulamasını durdurur.

**Parametreler:**
- `appType` (string, opsiyonel): Durdurulacak uygulama türü. Belirtilmezse tüm uygulamalar durdurulur.

### 3. **check-zopio-status**

Zopio kurulumunun ve çalışan uygulamaların durumunu kontrol eder.

## 🧪 Test Yöntemleri

### 1. Terminal CLI ile Test (Önerilen)

```bash
npm run cli
```

CLI başlatıldığında şu çıktıyı göreceksiniz:

```text
📖 Komutlar:
  setup <app>   - Zopio uygulaması kur
                  app: web, api, app, docs, all
                  Örnek: setup web
  stop [app]    - Uygulamayı durdur (belirtilmezse tümü)
                  Örnek: stop web veya stop
  status        - Zopio durumunu kontrol et
  help          - Bu yardım mesajını göster
  exit          - Çıkış
```

**Örnek Kullanım:**

```bash
zopio> setup web        # Sadece web uygulamasını kur
zopio> setup api        # Sadece API uygulamasını kur
zopio> setup email      # Sadece email paketini kur
zopio> setup all        # Tüm uygulamaları kur
zopio> status           # Durumu kontrol et
zopio> stop email       # Email paketini durdur
zopio> stop             # Tüm uygulamaları durdur
```

### 2. MCP Inspector ile Test

```bash
npx @modelcontextprotocol/inspector npx ts-node src/server.ts
```

Web arayüzünde:
1. "setup-zopio-app" tool'unu seçin
2. `appType` parametresini seçin (web, api, app, docs, email, all)
3. Seçilen uygulama masaüstünüze klonlanacak ve başlatılacak

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
> "Ben Zopio'da web uygulaması kurmak istiyorum"
> "Zopio'da API uygulaması kur"
> "Zopio'nun tüm uygulamalarını kur"

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

## 🎓 Yeni Başlayanlar İçin

**"Ben yazılımla amatör olarak ilgileniyorum, söylediklerinden pek bir şey anlamadım beni yönlendirir misin?"**

Windsurf'te Cascade'i açtığınızda, MCP otomatik olarak bağlanır ve size yardımcı olmaya hazır olur!

### 📚 Eğitim Promptları

MCP içinde kullanabileceğiniz eğitim promptları:

1. **zopio-yeni-baslayanlar** - Zopio Framework'e giriş, temel kavramlar
2. **zopio-uygulama-aciklamalari** - Her uygulamanın (WEB, API, MAIL vb.) ne işe yaradığı
3. **zopio-paket-aciklamalari** - Packages içindeki entegrasyonların nasıl kullanılacağı
4. **zopio-pratik-senaryo** - Email gönderme gibi gerçek senaryolarla öğrenme

### 💡 Nasıl Kullanılır?

Cascade'de doğrudan Türkçe sorular sorabilirsiniz:

```
"Ben yazılımla amatör olarak ilgileniyorum, bana yol gösterir misin?"
"Web uygulaması ne işe yarar?"
"Email nasıl gönderirim?"
"İletişim formu nasıl yaparım?"
```

### 📖 Detaylı Eğitim

Kapsamlı eğitim senaryosu için `EGITIM_SENARYOSU.md` dosyasına bakın. Bu dosyada:
- ✅ Her uygulamanın detaylı açıklaması
- ✅ Günlük hayattan örneklerle anlatım
- ✅ Paketlerin nasıl kullanılacağı
- ✅ Adım adım pratik senaryolar
- ✅ Sık sorulan sorular ve cevapları

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
