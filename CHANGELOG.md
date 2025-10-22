# 📝 Changelog

Zopio MCP Server için tüm önemli değişiklikler bu dosyada belgelenir.

---

## [1.1.0] - 2024-10-22

### 🎓 Yeni Başlayanlar İçin Eğitim Sistemi Eklendi

#### ✨ Yeni Özellikler

##### 1. Kapsamlı Eğitim Dokümantasyonu
- **EGITIM_SENARYOSU.md** - 500+ satır kapsamlı eğitim rehberi
  - Zopio Framework'ün detaylı açıklaması
  - 5 ana uygulamanın (STORYBOOK, WEB, API, MAIL, STUDIO) detaylı anlatımı
  - Günlük hayattan örneklerle kavram açıklamaları
  - Packages (paketler) ve entegrasyonların kullanımı
  - Pratik senaryo: Email gönderme uygulaması
  - Adım adım uygulama geliştirme rehberi
  - Sık sorulan sorular ve cevapları
  - Öğrenme yol haritası (Başlangıç → Uzman)

##### 2. Hızlı Başlangıç Rehberi
- **YENI_BASLAYANLAR_OZET.md** - Kısa ve öz başlangıç rehberi
  - İlk adımlar
  - Temel kavramlar
  - İlk proje: Basit web sitesi
  - Pratik senaryo: İletişim formu
  - Haftalık öğrenme planı
  - Motivasyon ve başarı ipuçları

##### 3. Etkileşimli Eğitim Promptları
- **4 yeni prompt eklendi** (src/server.ts):
  
  1. **zopio-yeni-baslayanlar**
     - Zopio Framework'e giriş
     - Temel kavramlar
     - Hızlı başlangıç adımları
     - Diğer kaynaklara yönlendirme
  
  2. **zopio-uygulama-aciklamalari**
     - Her uygulamanın detaylı açıklaması
     - Ne işe yarar?
     - Günlük hayattan örnekler
     - Ne zaman kullanılır?
     - Port bilgileri
  
  3. **zopio-paket-aciklamalari**
     - Email, Auth, Database, UI, Analytics paketleri
     - Her paketin içeriği
     - Kod örnekleri
     - Kullanım senaryoları
  
  4. **zopio-pratik-senaryo**
     - Email gönderme uygulaması senaryosu
     - Adım adım işlem akışı
     - Windsurf ile etkileşim
     - Tam kod örnekleri
     - Test ve çalıştırma talimatları

##### 4. Teknik Dokümantasyon
- **MCP_EGITIM_DOKUMANTASYONU.md** - Eğitim sistemi dokümantasyonu
  - Eklenen özelliklerin detaylı açıklaması
  - Kullanım senaryoları
  - MCP eğitim akış şeması
  - Dosya yapısı
  - Eğitim hedefleri ve seviyeler
  - Kullanım ipuçları
  - Teknik detaylar
  - Başarı metrikleri
  - Gelecek geliştirmeler

#### 📝 Güncellemeler

##### README.md
- Yeni başlayanlar için eğitim bölümü eklendi
- Eğitim promptlarının listesi
- Nasıl kullanılır? bölümü
- EGITIM_SENARYOSU.md dosyasına referans
- Özellikler listesi güncellendi:
  - "Yeni başlayanlar için eğitim" eklendi
  - "Etkileşimli promptlar" eklendi

##### src/server.ts
- ListPromptsRequestSchema handler'ı güncellendi
  - 4 yeni prompt tanımı eklendi
- GetPromptRequestSchema handler'ı genişletildi
  - Her prompt için detaylı içerik eklendi
  - Türkçe açıklamalar
  - Kod örnekleri
  - Kullanım talimatları

#### 🎯 Hedef Kitle

Bu güncelleme özellikle şu kullanıcılar için tasarlandı:
- ✅ Yazılım hakkında hiçbir şey bilmeyen geliştiriciler
- ✅ Zopio Framework'ü ilk kez kullananlar
- ✅ Adım adım rehberlik isteyen kullanıcılar
- ✅ Pratik örneklerle öğrenmek isteyenler

#### 📊 İstatistikler

- **Yeni Dosyalar:** 4
- **Güncellenen Dosyalar:** 2
- **Toplam Satır Eklendi:** ~1500+
- **Yeni Promptlar:** 4
- **Kod Örnekleri:** 15+
- **Pratik Senaryolar:** 2

#### 🔄 Kullanım Akışı

```
Geliştirici Windsurf'ü Açar
    ↓
MCP Otomatik Bağlanır
    ↓
"Ben amatörüm, yardım eder misin?" sorusu
    ↓
MCP: zopio-yeni-baslayanlar promptu
    ↓
Geliştirici: "Web uygulaması ne işe yarar?"
    ↓
MCP: zopio-uygulama-aciklamalari promptu
    ↓
Geliştirici: "Email nasıl gönderirim?"
    ↓
MCP: zopio-paket-aciklamalari promptu
    ↓
Geliştirici: "İletişim formu nasıl yaparım?"
    ↓
MCP: zopio-pratik-senaryo promptu
    ↓
Geliştirici: "Zopio'da web uygulaması kur"
    ↓
MCP: Uygulamayı kurar ve başlatır
    ↓
Windsurf: Kod yazma başlar
```

#### 💡 Öne Çıkan Özellikler

1. **Günlük Hayattan Örnekler**
   - Her kavram günlük hayattan bir örnekle açıklanmış
   - Örnek: API = Mağazanın deposu ve muhasebe bölümü

2. **Adım Adım Talimatlar**
   - Her işlem küçük adımlara bölünmüş
   - Her adımda ne yapılacağı açıkça belirtilmiş

3. **Kod Örnekleri**
   - Her paket için çalışan kod örnekleri
   - Kopyala-yapıştır yapılabilir

4. **Pratik Senaryolar**
   - Gerçek dünya problemleri
   - Email gönderme, form oluşturma gibi

5. **Öğrenme Yol Haritası**
   - Haftalık plan
   - Seviye seviye ilerleme
   - Her seviyede proje önerileri

#### 🎓 Eğitim Seviyeleri

**Seviye 1: Başlangıç (İlk Kullanım)**
- Zopio'nun ne olduğunu anlamak
- Temel kavramları öğrenmek

**Seviye 2: Uygulamaları Tanıma (1. Gün)**
- Her uygulamanın ne işe yaradığını öğrenmek
- Hangi uygulamanın ne zaman kullanılacağını bilmek

**Seviye 3: Paketleri Tanıma (2-3. Gün)**
- Paketlerin nasıl kullanılacağını öğrenmek
- Kod örnekleriyle pratik yapmak

**Seviye 4: Pratik Uygulama (1. Hafta)**
- İlk projeyi oluşturmak
- İletişim formu, email gönderme gibi

#### 🚀 Gelecek Planlar

**Kısa Vadeli (1-2 Hafta)**
- [ ] Video eğitim içerikleri
- [ ] Daha fazla pratik senaryo
- [ ] Interaktif quiz'ler

**Orta Vadeli (1-2 Ay)**
- [ ] Topluluk forumu
- [ ] Canlı destek
- [ ] Proje şablonları

**Uzun Vadeli (3-6 Ay)**
- [ ] Sertifika programı
- [ ] İleri seviye eğitimler
- [ ] Mentor sistemi

---

## [1.0.0] - 2024-10-20

### ✨ İlk Sürüm

#### Özellikler
- Senaryo bazlı kurulum sistemi
- 5 farklı uygulama desteği (web, api, app, docs, email)
- Otomatik repo klonlama
- Bağımlılık yönetimi (pnpm)
- Durum kontrol sistemi
- Türkçe komut desteği
- Cascade AI entegrasyonu

#### Tools
- `setup-zopio-app` - Uygulama kurulumu
- `stop-zopio-app` - Uygulama durdurma
- `check-zopio-status` - Durum kontrolü

#### Prompts
- `zopio-hosgeldiniz` - Karşılama mesajı

#### Dokümantasyon
- README.md
- SENARYO_KULLANIMI.md
- WINDSURF_SETUP.md

---

## Versiyon Notları

### Semantic Versioning
Bu proje [Semantic Versioning](https://semver.org/) kullanır:
- **MAJOR** (1.x.x): Geriye dönük uyumsuz değişiklikler
- **MINOR** (x.1.x): Geriye dönük uyumlu yeni özellikler
- **PATCH** (x.x.1): Geriye dönük uyumlu hata düzeltmeleri

### Değişiklik Kategorileri
- **✨ Yeni Özellikler**: Yeni eklenen özellikler
- **📝 Güncellemeler**: Mevcut özelliklerde yapılan iyileştirmeler
- **🐛 Hata Düzeltmeleri**: Düzeltilen hatalar
- **🔧 Teknik**: Teknik değişiklikler ve iyileştirmeler
- **📚 Dokümantasyon**: Dokümantasyon güncellemeleri
- **🎓 Eğitim**: Eğitim içeriği güncellemeleri

---

## Katkıda Bulunanlar

Bu sürüm için katkıda bulunan herkese teşekkürler! 🎉

---

**Not:** Detaylı değişiklikler için ilgili dosyalara bakabilirsiniz:
- `EGITIM_SENARYOSU.md` - Kapsamlı eğitim rehberi
- `YENI_BASLAYANLAR_OZET.md` - Hızlı başlangıç rehberi
- `MCP_EGITIM_DOKUMANTASYONU.md` - Teknik dokümantasyon
- `README.md` - Genel kullanım rehberi
