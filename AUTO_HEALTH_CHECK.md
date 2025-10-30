# 🔍 Otomatik Proje Sağlık Kontrolü Sistemi

## Genel Bakış

Zopio MCP Server artık her proje oluşturulduktan sonra otomatik olarak sağlık kontrolü yapar ve hataları tespit eder.

## Kontrol Edilen Alanlar

### 1. ✅ Routing Yapısı
- Proje sayfasının `/[locale]/proje-adi/` altında olup olmadığı
- Root'ta yanlış page.tsx olup olmadığı
- Locale klasörünün varlığı

### 2. ✅ Environment Variables
- `.env.local` dosyasının varlığı
- Token formatlarının doğruluğu:
  - `BASEHUB_TOKEN` → `bshb_pk_` ile başlamalı
  - `ARCJET_KEY` → `ajkey_` ile başlamalı
  - `RESEND_TOKEN` → `re_` ile başlamalı

### 3. ✅ Prisma Schema
- Deprecated `previewFeatures` kontrolü
- Provider ayarları (PostgreSQL)
- Output path kontrolü

### 4. ✅ Server Durumu
- Port 3001'de web server çalışıyor mu
- Port çakışması var mı

### 5. ✅ Design System
- Hardcoded renkler kullanılıyor mu
- Design system token'ları kullanılıyor mu

## Otomatik Düzeltme

Sistem tespit ettiği sorunları otomatik olarak düzeltebilir:

### Düzeltilebilir Sorunlar
- ✅ Eksik `.env.local` dosyası
- ✅ Deprecated Prisma `previewFeatures`
- ✅ Yanlış token formatları

### Manuel Düzeltme Gereken Sorunlar
- ⚠️ Routing yapısı hataları
- ⚠️ Hardcoded renkler
- ⚠️ Port çakışmaları

## Kullanım

Sistem otomatik olarak çalışır:

```bash
# create-complete-application çalıştırıldığında:
1. Proje oluşturulur
2. Server başlatılır
3. 3 saniye beklenir (server'ın başlaması için)
4. Otomatik sağlık kontrolü yapılır
5. Tespit edilen sorunlar raporlanır
6. Düzeltilebilir sorunlar otomatik düzeltilir
```

## Rapor Formatı

```
🔍 Adım 7: Proje sağlık kontrolü yapılıyor...

✅ Routing yapısı doğru: /[locale]/e-ticaret/
✅ Environment variables doğru formatta
✅ Prisma schema güncel
✅ Web server çalışıyor (port 3001)
✅ Design system token'ları kullanılıyor

📊 SAĞLIK KONTROLÜ SONUÇLARI:
────────────────────────────────────────────────────────────
✅ Başarılı kontroller: 5/5
❌ Hatalar: 0
⚠️  Uyarılar: 0
🔧 Otomatik düzeltilebilir: 0
```

## Hata Örneği

```
🔍 Adım 7: Proje sağlık kontrolü yapılıyor...

✅ Routing yapısı doğru: /[locale]/e-ticaret/
⚠️  Environment variables kontrolü

📊 SAĞLIK KONTROLÜ SONUÇLARI:
────────────────────────────────────────────────────────────
✅ Başarılı kontroller: 4/5
❌ Hatalar: 1
⚠️  Uyarılar: 0
🔧 Otomatik düzeltilebilir: 1

🔍 TESPIT EDILEN SORUNLAR:
❌ [Environment] .env.local dosyası bulunamadı

🔧 Adım 8: Otomatik hata düzeltme yapılıyor...
✅ Düzeltildi: .env.local dosyası bulunamadı

📊 1/1 sorun otomatik düzeltildi.
🔄 Değişiklikler uygulandı. Server yeniden başlatılıyor...
```

## Avantajlar

### 1. Erken Hata Tespiti
- Sorunlar proje tamamlanır tamamlanmaz tespit edilir
- Kullanıcı hataları görmeden düzeltilir

### 2. Otomatik Düzeltme
- Basit sorunlar otomatik düzeltilir
- Manuel müdahale gereken sorunlar raporlanır

### 3. Kalite Güvencesi
- Her proje standartlara uygun çıkar
- Best practices otomatik uygulanır

### 4. Zaman Tasarrufu
- Manuel kontrol gerekmez
- Hata ayıklama süresi azalır

## Teknik Detaylar

### performProjectHealthCheck()
```typescript
// 5 farklı kategori kontrol eder:
1. Routing yapısı
2. Environment variables
3. Prisma schema
4. Server durumu
5. Design system kullanımı

// Döndürür:
{
  report: string,              // Detaylı rapor
  fixableIssues: Issue[],      // Düzeltilebilir sorunlar
  totalIssues: number,         // Toplam sorun sayısı
  errors: number,              // Kritik hata sayısı
  warnings: number             // Uyarı sayısı
}
```

### autoFixIssues()
```typescript
// Düzeltilebilir sorunları otomatik düzeltir
// Her sorun için fix() fonksiyonu çalıştırılır
// Başarılı/başarısız düzeltmeler raporlanır
```

## Workflow

```
create-complete-application
         ↓
1. Proje oluştur
         ↓
2. Server başlat
         ↓
3. 3 saniye bekle
         ↓
4. Sağlık kontrolü yap
         ↓
5. Sorunları tespit et
         ↓
6. Otomatik düzelt (varsa)
         ↓
7. Rapor göster
         ↓
8. Proje hazır!
```

## Gelecek İyileştirmeler

- [ ] Frontend console error kontrolü
- [ ] API endpoint testleri
- [ ] Database bağlantı kontrolü
- [ ] Performance metrikleri
- [ ] Security scan
- [ ] Accessibility kontrolü

---

**Versiyon:** 1.0.0
**Son Güncelleme:** 2025-10-30
