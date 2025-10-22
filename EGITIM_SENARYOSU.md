# 🎓 Zopio Framework - Yeni Başlayanlar İçin Kapsamlı Eğitim Senaryosu

## 📚 İçindekiler
1. [Zopio Framework Nedir?](#zopio-framework-nedir)
2. [Uygulamalar ve Kullanım Alanları](#uygulamalar-ve-kullanım-alanları)
3. [Packages (Paketler) ve Entegrasyonlar](#packages-paketler-ve-entegrasyonlar)
4. [Pratik Senaryo: Email Gönderme Uygulaması](#pratik-senaryo-email-gönderme-uygulaması)
5. [Adım Adım Uygulama Geliştirme](#adım-adım-uygulama-geliştirme)
6. [Sık Sorulan Sorular](#sık-sorulan-sorular)

---

## 🎯 Zopio Framework Nedir?

### Basit Açıklama
Zopio, web uygulamaları geliştirmek için hazır araçlar sunan bir **framework** (çerçeve)'dür. 

**Günlük hayattan örnek:**
- Lego setini düşünün. Zopio, size hazır Lego parçaları veren bir set gibidir.
- Her parça (uygulama/paket) belirli bir işi yapar.
- Siz bu parçaları birleştirerek istediğiniz yapıyı oluşturursunuz.

### Ne İşe Yarar?
- ✅ Sıfırdan kod yazmak yerine hazır yapıları kullanırsınız
- ✅ Zaman kazanırsınız (günler yerine saatler)
- ✅ Profesyonel standartlarda uygulamalar geliştirirsiniz
- ✅ Karmaşık işlemleri basit komutlarla yaparsınız

---

## 🏗️ Uygulamalar ve Kullanım Alanları

Zopio Framework 5 ana uygulama içerir. Her biri farklı bir iş için tasarlanmıştır:

### 1. 📖 STORYBOOK - Tasarım Kütüphanesi
**Ne İşe Yarar?**
- UI bileşenlerinizi (buton, form, kart vb.) görsel olarak test edersiniz
- Tasarımcılarla iş birliği yaparsınız
- Bileşenlerin farklı durumlarını gösterirsiniz

**Günlük Hayattan Örnek:**
- Bir mobilya kataloğu gibidir
- Her mobilyayı (bileşeni) farklı açılardan görebilirsiniz
- Müşteriye (ekip arkadaşlarına) göstermek için kullanırsınız

**Ne Zaman Kullanılır?**
- ✅ Yeni bir buton tasarımı yapıyorsunuz
- ✅ Ekip arkadaşlarınıza bileşenleri göstermek istiyorsunuz
- ✅ Tasarım sistemini dokümante ediyorsunuz

**Port:** 3000 (Tarayıcıda `http://localhost:3000` adresinden erişilir)

---

### 2. 🌐 WEB - Web Uygulaması
**Ne İşe Yarar?**
- Kullanıcıların göreceği web sitesini oluşturursunuz
- Sayfa tasarımları, formlar, menüler burada yapılır
- Frontend (ön yüz) geliştirme yaparsınız

**Günlük Hayattan Örnek:**
- Bir mağazanın vitrin kısmı gibidir
- Müşteriler (kullanıcılar) buradan alışveriş yapar
- Görsel tasarım ve kullanıcı deneyimi burada önemlidir

**Ne Zaman Kullanılır?**
- ✅ Kullanıcı arayüzü tasarlıyorsunuz
- ✅ Sayfa düzenleri oluşturuyorsunuz
- ✅ Formlar, butonlar, menüler ekliyorsunuz

**Port:** 3000

---

### 3. 🔌 API - Backend Servisleri
**Ne İşe Yarar?**
- Veritabanı işlemleri yaparsınız
- Kullanıcı girişi, veri kaydetme gibi işlemleri yönetirsiniz
- Web uygulamasının "beyin" kısmıdır

**Günlük Hayattan Örnek:**
- Bir mağazanın deposu ve muhasebe bölümü gibidir
- Ürünler (veriler) burada saklanır ve yönetilir
- Vitrin (WEB) ile depo (API) sürekli haberleşir

**Ne Zaman Kullanılır?**
- ✅ Veritabanı işlemleri yapıyorsunuz
- ✅ Kullanıcı girişi/kaydı oluşturuyorsunuz
- ✅ Veri işleme ve hesaplama yapıyorsunuz

**Port:** 3001

---

### 4. 📧 MAIL - Email Servisleri
**Ne İşe Yarar?**
- Otomatik email gönderimi yaparsınız
- Kullanıcılara bildirim emaili atarsınız
- Email şablonları oluşturursunuz

**Günlük Hayattan Örnek:**
- Bir şirketin posta servisi gibidir
- Müşterilere (kullanıcılara) otomatik mektuplar (emailler) gönderir
- Fatura, hoşgeldin mesajı, şifre sıfırlama gibi

**Ne Zaman Kullanılır?**
- ✅ Kullanıcıya hoşgeldin emaili göndermek istiyorsunuz
- ✅ Şifre sıfırlama linki yollamak istiyorsunuz
- ✅ Sipariş onayı bildirimi göndermek istiyorsunuz

**Port:** 3004

---

### 5. 🎨 STUDIO - Geliştirme Ortamı
**Ne İşe Yarar?**
- Tüm uygulamaları bir arada yönetirsiniz
- Kod yazma, test etme, hata ayıklama yaparsınız
- Geliştirme sürecini kolaylaştırır

**Günlük Hayattan Örnek:**
- Bir fabrika kontrol merkezi gibidir
- Tüm bölümleri (uygulamaları) buradan izlersiniz
- Sorunları buradan tespit eder ve çözersiniz

**Ne Zaman Kullanılır?**
- ✅ Tüm projeyi bir arada görmek istiyorsunuz
- ✅ Hata ayıklama yapıyorsunuz
- ✅ Performans izleme yapıyorsunuz

**Port:** 3002

---

## 📦 Packages (Paketler) ve Entegrasyonlar

Zopio Framework içinde hazır paketler vardır. Bu paketler, sık kullanılan işlevleri kolayca kullanmanızı sağlar.

### 1. 📧 Email Paketi
**İçinde Neler Var?**
- Email gönderme fonksiyonları
- Email şablonları (hoşgeldin, şifre sıfırlama vb.)
- Email doğrulama araçları

**Nasıl Kullanılır?**
```typescript
// Örnek: Hoşgeldin emaili gönderme
import { sendWelcomeEmail } from '@zopio/email';

await sendWelcomeEmail({
  to: 'kullanici@email.com',
  name: 'Ahmet Yılmaz'
});
```

**Ne Zaman Kullanılır?**
- Yeni kullanıcı kaydolduğunda
- Şifre sıfırlama isteğinde
- Sipariş onayında

---

### 2. 🔐 Auth Paketi (Kimlik Doğrulama)
**İçinde Neler Var?**
- Kullanıcı girişi/kaydı
- Şifre şifreleme
- Oturum yönetimi
- Token (jeton) oluşturma

**Nasıl Kullanılır?**
```typescript
// Örnek: Kullanıcı girişi
import { login } from '@zopio/auth';

const result = await login({
  email: 'kullanici@email.com',
  password: 'gizli123'
});
```

**Ne Zaman Kullanılır?**
- Kullanıcı giriş sistemi yapıyorsunuz
- Şifre güvenliği sağlıyorsunuz
- Oturum yönetimi yapıyorsunuz

---

### 3. 💾 Database Paketi (Veritabanı)
**İçinde Neler Var?**
- Veritabanı bağlantısı
- Veri kaydetme/okuma/güncelleme/silme
- Sorgu yapma araçları

**Nasıl Kullanılır?**
```typescript
// Örnek: Kullanıcı kaydetme
import { db } from '@zopio/database';

await db.users.create({
  name: 'Ahmet Yılmaz',
  email: 'ahmet@email.com'
});
```

**Ne Zaman Kullanılır?**
- Kullanıcı bilgilerini kaydetmek istiyorsunuz
- Ürün listesi oluşturuyorsunuz
- Veri sorgulama yapıyorsunuz

---

### 4. 🎨 UI Paketi (Kullanıcı Arayüzü)
**İçinde Neler Var?**
- Hazır butonlar
- Formlar
- Kartlar, tablolar
- Menüler

**Nasıl Kullanılır?**
```typescript
// Örnek: Buton kullanma
import { Button } from '@zopio/ui';

<Button variant="primary" onClick={handleClick}>
  Tıkla
</Button>
```

**Ne Zaman Kullanılır?**
- Hızlı arayüz oluşturmak istiyorsunuz
- Tutarlı tasarım istiyorsunuz
- Zaman kazanmak istiyorsunuz

---

### 5. 📊 Analytics Paketi (Analitik)
**İçinde Neler Var?**
- Kullanıcı davranışı izleme
- Sayfa görüntüleme sayacı
- Olay (event) takibi

**Nasıl Kullanılır?**
```typescript
// Örnek: Sayfa görüntüleme kaydetme
import { trackPageView } from '@zopio/analytics';

trackPageView('/anasayfa');
```

**Ne Zaman Kullanılır?**
- Kullanıcı davranışlarını anlamak istiyorsunuz
- Hangi sayfaların popüler olduğunu görmek istiyorsunuz
- Performans metrikleri topluyorsunuz

---

## 🎬 Pratik Senaryo: Email Gönderme Uygulaması

Şimdi görseldeki akışa göre gerçek bir senaryo üzerinden gidelim.

### 📋 Senaryo: Kullanıcı İsteği
**Kullanıcı der ki:**
> "Websiteme bir iletişim formu eklemek istiyorum. Form doldurulduğunda bana email gelsin."

### 🔄 Adım Adım İşlem Akışı

#### **ADIM 1: Uygulama İsteği Sorulur**
**MCP'ye Sorulacak:**
```
"Ben bir iletişim formu oluşturmak istiyorum. Hangi uygulamaları kullanmalıyım?"
```

**MCP'nin Cevabı:**
```
Bu iş için şu uygulamaları kullanmalısınız:
1. WEB - İletişim formunu oluşturmak için
2. API - Form verilerini işlemek için
3. MAIL - Email göndermek için
```

---

#### **ADIM 2: Örnek Tasarım Sorulur**
**MCP'ye Sorulacak:**
```
"İletişim formu nasıl görünmeli? Örnek gösterir misin?"
```

**MCP'nin Yapacağı:**
1. STORYBOOK uygulamasını önerir
2. Hazır form bileşenlerini gösterir
3. Örnek tasarım kodu verir

---

#### **ADIM 3: Geliştirici Seçim Yapar**

**İki Seçenek:**

##### **A) Geliştiricinin Elinde Tasarım VARSA:**
```
"Tamam, tasarımım hazır. Windsurf'e yapıştırıyorum."
```
→ Windsurf'te tasarım oluşturulur
→ Kod yazılır

##### **B) Geliştiricinin Elinde Tasarım YOKSA:**
```
"Tasarımım yok, sen oluştur."
```
→ Windsurf'e soru sorulur
→ Windsurf örnek tasarım oluşturur

---

#### **ADIM 4: Windsurf Örnek Tasarım Oluşturur**

**Windsurf şu kodu oluşturur:**

```typescript
// components/ContactForm.tsx
import { Button, Input, Textarea } from '@zopio/ui';
import { useState } from 'react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // API'ye veri gönder
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      alert('Mesajınız gönderildi!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        placeholder="Adınız"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
      
      <Input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
      />
      
      <Textarea
        placeholder="Mesajınız"
        value={formData.message}
        onChange={(e) => setFormData({...formData, message: e.target.value})}
      />
      
      <Button type="submit">Gönder</Button>
    </form>
  );
}
```

---

#### **ADIM 5: Windsurf Tasarımı Uygular**

**Windsurf şunları yapar:**
1. ✅ Form bileşenini oluşturur
2. ✅ Gerekli paketleri import eder
3. ✅ Stil dosyalarını ekler
4. ✅ API endpoint'ini hazırlar

---

#### **ADIM 6: Windsurf Tasarım İçin Gerekenleri Sorar ve Yapar**

**Windsurf sorar:**
```
"Email gönderimi için şunlar gerekli:
1. Email sağlayıcısı (Gmail, SendGrid vb.)
2. Gönderen email adresi
3. Alıcı email adresi

Hangi email servisini kullanmak istersiniz?"
```

**Geliştirici cevaplar:**
```
"Gmail kullanacağım. Gönderen: info@sirketim.com, Alıcı: ben@sirketim.com"
```

**Windsurf şu kodu ekler:**

```typescript
// api/contact.ts
import { sendEmail } from '@zopio/email';

export async function POST(request: Request) {
  const { name, email, message } = await request.json();
  
  // Email gönder
  await sendEmail({
    from: 'info@sirketim.com',
    to: 'ben@sirketim.com',
    subject: `Yeni İletişim: ${name}`,
    html: `
      <h2>Yeni İletişim Formu</h2>
      <p><strong>İsim:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mesaj:</strong> ${message}</p>
    `
  });
  
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
```

---

#### **ADIM 7: Eklenmesi Gereken Paketleri ve Mantığını Açıklar**

**Windsurf açıklar:**

```
✅ Eklenen Paketler:
1. @zopio/ui - Form bileşenleri için
2. @zopio/email - Email gönderimi için

✅ Mantık:
1. Kullanıcı formu doldurur
2. Form verileri API'ye gönderilir (/api/contact)
3. API email paketini kullanarak email gönderir
4. Başarılı mesajı gösterilir

✅ Gerekli Ayarlar:
- .env dosyasına email ayarları eklenecek:
  EMAIL_HOST=smtp.gmail.com
  EMAIL_PORT=587
  EMAIL_USER=info@sirketim.com
  EMAIL_PASS=uygulama_sifresi
```

---

## 🚀 Adım Adım Uygulama Geliştirme

### Başlangıç Seviyesi: İlk Projenizi Oluşturun

#### **Adım 1: MCP'yi Başlatın**
```bash
# Windsurf IDE'yi açın
# Cascade panelinde MCP otomatik bağlanır
```

#### **Adım 2: Projenizi Tanımlayın**
**MCP'ye söyleyin:**
```
"Merhaba! Ben yazılımla amatör olarak ilgileniyorum. 
Basit bir blog sitesi yapmak istiyorum ama nereden başlayacağımı bilmiyorum. 
Bana yol gösterir misin?"
```

#### **Adım 3: MCP'nin Önerileri**
**MCP size şunu önerir:**
```
✅ Blog sitesi için şunlar gerekli:

1. WEB Uygulaması - Blog yazılarını göstermek için
2. API Uygulaması - Blog yazılarını kaydetmek için
3. Database Paketi - Yazıları saklamak için
4. UI Paketi - Güzel görünüm için

Başlamak için önce WEB uygulamasını kuralım mı?
```

#### **Adım 4: Uygulamayı Kurun**
**MCP'ye söyleyin:**
```
"Evet, WEB uygulamasını kur"
```

**MCP yapar:**
```bash
# Zopio'yu klonlar
# WEB uygulamasını başlatır
# http://localhost:3000 adresinde açar
```

#### **Adım 5: İlk Sayfanızı Oluşturun**
**MCP'ye söyleyin:**
```
"Blog anasayfası nasıl olmalı? Örnek göster"
```

**MCP şu kodu oluşturur:**
```typescript
// pages/index.tsx
import { Card, Button } from '@zopio/ui';

export default function BlogHome() {
  const posts = [
    {
      id: 1,
      title: 'İlk Blog Yazım',
      excerpt: 'Merhaba dünya!',
      date: '2024-01-01'
    }
  ];

  return (
    <div>
      <h1>Blog Siteme Hoşgeldiniz</h1>
      
      {posts.map(post => (
        <Card key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
          <small>{post.date}</small>
          <Button>Devamını Oku</Button>
        </Card>
      ))}
    </div>
  );
}
```

---

## ❓ Sık Sorulan Sorular

### **S1: "Hangi uygulamayı ne zaman kullanmalıyım?"**

**Cevap:**
- **WEB** → Kullanıcının göreceği her şey için
- **API** → Veri kaydetme/okuma işlemleri için
- **MAIL** → Email göndermek için
- **STORYBOOK** → Tasarım bileşenlerini test etmek için
- **STUDIO** → Tüm projeyi yönetmek için

---

### **S2: "Paket nedir? Nasıl kullanılır?"**

**Cevap:**
Paket, hazır kod parçalarıdır. Sıfırdan yazmak yerine kullanırsınız.

**Örnek:**
```typescript
// Paketsiz (zor yol):
function sendEmail(to, subject, message) {
  // 100 satır kod...
}

// Paketli (kolay yol):
import { sendEmail } from '@zopio/email';
sendEmail({ to, subject, message });
```

---

### **S3: "Birden fazla uygulama aynı anda çalışabilir mi?"**

**Cevap:**
Evet! Örneğin:
- WEB (Port 3000) → Kullanıcı arayüzü
- API (Port 3001) → Veri işlemleri
- MAIL (Port 3004) → Email servisi

Hepsi birlikte çalışır ve birbirleriyle haberleşir.

---

### **S4: "Hata aldığımda ne yapmalıyım?"**

**Cevap:**
1. Hatayı MCP'ye gösterin:
   ```
   "Şu hatayı aldım: [hata mesajı]"
   ```
2. MCP size çözüm önerir
3. Çözümü uygularsınız

---

### **S5: "Projem büyüdükçe ne yapmalıyım?"**

**Cevap:**
1. Küçük başlayın (sadece WEB)
2. İhtiyaç oldukça ekleyin (API, MAIL vb.)
3. STUDIO ile tüm projeyi yönetin

---

## 🎓 Öğrenme Yol Haritası

### **Seviye 1: Başlangıç (1. Hafta)**
- ✅ WEB uygulamasını kurun
- ✅ Basit bir sayfa oluşturun
- ✅ UI paketinden buton ekleyin

### **Seviye 2: Orta (2-3. Hafta)**
- ✅ API uygulamasını ekleyin
- ✅ Form oluşturun
- ✅ Veri kaydetmeyi öğrenin

### **Seviye 3: İleri (4-6. Hafta)**
- ✅ MAIL uygulamasını ekleyin
- ✅ Email gönderimi yapın
- ✅ Tüm uygulamaları entegre edin

### **Seviye 4: Uzman (2-3. Ay)**
- ✅ STUDIO ile proje yönetimi
- ✅ Özel paketler oluşturun
- ✅ Performans optimizasyonu

---

## 🎯 Sonuç

Zopio Framework, yazılım geliştirmeyi **Lego oynamak kadar kolay** hale getirir:

1. **Uygulamalar** → Farklı işler için farklı araçlar
2. **Paketler** → Hazır kod parçaları
3. **MCP** → Size yol gösteren asistan
4. **Windsurf** → Kod yazan yardımcınız

**Unutmayın:**
- Küçük adımlarla ilerleyin
- MCP'ye soru sormaktan çekinmeyin
- Hata yapmak normaldir, MCP size yardım eder
- Pratik yaparak öğrenirsiniz

---

## 📞 Yardım

**MCP'ye her zaman sorabilirsiniz:**
```
"Bu kodu anlamadım, açıklar mısın?"
"Şu işlemi nasıl yaparım?"
"Hangi paketi kullanmalıyım?"
"Örnek gösterir misin?"
```

**MCP size her zaman yardımcı olacaktır!** 🚀
