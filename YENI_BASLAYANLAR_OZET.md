# 🎓 Yeni Başlayanlar İçin Hızlı Başlangıç Rehberi

## 👋 Hoşgeldiniz!

Bu rehber, **hiç yazılım bilmeyen** geliştiriciler için hazırlanmıştır. Zopio Framework'ü kullanarak web uygulamaları geliştirmeyi öğreneceksiniz.

---

## 🚀 İlk Adımlar

### 1. Windsurf IDE'yi Açın
- Windsurf IDE'yi başlatın
- Cascade panelini açın (sağ tarafta)
- MCP otomatik olarak bağlanacak

### 2. İlk Sorunuzu Sorun
Cascade'de şunu yazın:
```
"Ben yazılımla amatör olarak ilgileniyorum, bana yol gösterir misin?"
```

MCP size yardımcı olmaya hazır!

---

## 📚 Temel Kavramlar

### Zopio Framework Nedir?
Zopio, web uygulamaları geliştirmek için **hazır araçlar** sunan bir sistemdir.

**Lego benzetmesi:**
- Zopio = Lego seti
- Uygulamalar = Lego parçaları
- Siz = Bu parçaları birleştiren kişi

### 5 Ana Uygulama

1. **STORYBOOK** 📖
   - Tasarım bileşenlerini gösterir
   - Buton, form gibi parçaları test edersiniz

2. **WEB** 🌐
   - Kullanıcıların göreceği web sitesi
   - Sayfa tasarımları burada yapılır

3. **API** 🔌
   - Veritabanı işlemleri
   - Kullanıcı girişi, veri kaydetme

4. **MAIL** 📧
   - Email gönderme servisi
   - Otomatik bildirimler

5. **STUDIO** 🎨
   - Tüm uygulamaları yönetme merkezi
   - Hata ayıklama ve izleme

---

## 💡 İlk Projeniz: Basit Web Sitesi

### Adım 1: Web Uygulamasını Kurun
Cascade'de yazın:
```
"Zopio'da web uygulaması kur"
```

MCP otomatik olarak:
- ✅ Zopio'yu indirir
- ✅ Gerekli paketleri yükler
- ✅ Web sunucusunu başlatır

### Adım 2: Tarayıcıda Açın
Tarayıcınızda şu adresi açın:
```
http://localhost:3000
```

### Adım 3: İlk Değişikliğinizi Yapın
Cascade'de sorun:
```
"Anasayfaya 'Merhaba Dünya' yazısı ekle"
```

Windsurf sizin için kodu yazacak!

---

## 🎯 Pratik Senaryo: İletişim Formu

### Ne Yapacağız?
Bir iletişim formu oluşturacağız. Form doldurulunca size email gelecek.

### Adım Adım

#### 1. Gerekli Uygulamaları Kurun
```
"Zopio'da web uygulaması kur"
"Zopio'da API uygulaması kur"
"Zopio'da email paketini kur"
```

#### 2. Form Tasarımı İsteyin
```
"İletişim formu oluştur. İsim, email ve mesaj alanları olsun"
```

#### 3. Email Ayarlarını Yapın
Windsurf size soracak:
- Hangi email servisini kullanacaksınız? → "Gmail"
- Gönderen email? → "info@sirketim.com"
- Alıcı email? → "ben@sirketim.com"

#### 4. Test Edin
- Tarayıcıda formu doldurun
- "Gönder" butonuna tıklayın
- Email kutunuzu kontrol edin!

---

## ❓ Sık Sorulan Sorular

### "Hangi uygulamayı ne zaman kullanmalıyım?"

| Uygulama | Ne Zaman Kullanılır |
|----------|---------------------|
| WEB | Kullanıcının göreceği her şey için |
| API | Veri kaydetme/okuma için |
| MAIL | Email göndermek için |
| STORYBOOK | Tasarım bileşenlerini test etmek için |
| STUDIO | Tüm projeyi yönetmek için |

### "Paket nedir?"

Paket = Hazır kod parçası

**Örnek:**
```javascript
// Paketsiz (100 satır kod yazmanız gerekir)
function emailGonder() { ... }

// Paketli (1 satır kod)
import { sendEmail } from '@zopio/email';
```

### "Hata aldığımda ne yapmalıyım?"

1. Hatayı kopyalayın
2. Cascade'de sorun: "Şu hatayı aldım: [hata mesajı]"
3. MCP size çözüm önerecek

---

## 🎓 Öğrenme Yol Haritası

### 1. Hafta: Temel Bilgiler
- ✅ Web uygulaması kurmak
- ✅ Basit sayfa oluşturmak
- ✅ Buton eklemek

**Proje:** Kişisel tanıtım sayfası

### 2-3. Hafta: Form ve Veri
- ✅ Form oluşturmak
- ✅ API kullanmak
- ✅ Veri kaydetmek

**Proje:** İletişim formu

### 4-6. Hafta: Email ve Entegrasyon
- ✅ Email göndermek
- ✅ Tüm uygulamaları birleştirmek

**Proje:** Tam fonksiyonel web sitesi

---

## 📖 Daha Fazla Bilgi

### Detaylı Eğitim
`EGITIM_SENARYOSU.md` dosyasında:
- Her uygulamanın detaylı açıklaması
- Günlük hayattan örnekler
- Kod örnekleri
- Pratik senaryolar

### Eğitim Promptları
Cascade'de kullanabileceğiniz promptlar:

1. `zopio-yeni-baslayanlar` - Genel giriş
2. `zopio-uygulama-aciklamalari` - Uygulamalar hakkında
3. `zopio-paket-aciklamalari` - Paketler hakkında
4. `zopio-pratik-senaryo` - Pratik örnekler

---

## 💪 Motivasyon

**Unutmayın:**
- ✅ Herkes bir yerden başlar
- ✅ Hata yapmak normaldir
- ✅ Pratik yaparak öğrenirsiniz
- ✅ MCP her zaman yardımcınızdır

**İlk projenizi yapmaya hazır mısınız?**

Cascade'de yazın:
```
"Zopio'da web uygulaması kur ve ilk projeme başla!"
```

---

## 🎉 Başarılar!

Artık Zopio Framework ile web uygulamaları geliştirmeye hazırsınız!

**Sorularınız için:**
- Cascade'de doğrudan soru sorun
- EGITIM_SENARYOSU.md dosyasına bakın
- README.md dosyasında daha fazla bilgi bulabilirsiniz

**İyi kodlamalar! 🚀**
