# 🚨 TypeScript Zorunluluğu ve Zopio Framework Kuralları

## ✅ ZORUNLU KURALLAR

### 1. Zopio Framework Kullanımı
- **Repository:** https://github.com/zopiolabs/zopio.git
- **Kurulum:** Otomatik olarak Desktop'a klonlanır
- **Konum:** `~/Desktop/zopio` (macOS/Linux) veya `%USERPROFILE%\Desktop\zopio` (Windows)

### 2. TypeScript Zorunluluğu
- ✅ **İZİN VERİLEN:** `.ts`, `.tsx`, `.prisma`, `.json`, `.md`, `.css`, `.env`
- ❌ **YASAK:** `.js`, `.jsx`
- **Sebep:** Tip güvenliği, daha az hata, daha iyi geliştirici deneyimi

### 3. Dosya Yapısı
```
zopio/
├── apps/
│   ├── web/           # Next.js web uygulaması (TypeScript)
│   │   ├── app/       # App Router (TypeScript)
│   │   ├── components/ # React bileşenleri (.tsx)
│   │   └── lib/       # Yardımcı fonksiyonlar (.ts)
│   ├── api/           # Backend API (TypeScript)
│   └── docs/          # Dokümantasyon
├── packages/
│   ├── database/      # Prisma ORM
│   ├── ui/            # UI bileşenleri (.tsx)
│   └── email/         # Email servisleri (.ts)
└── prisma/
    └── schema.prisma  # Database schema
```

## ❌ YASAKLI FRAMEWORKLER

### Manuel Kurulum Yasak
- Next.js (`npx create-next-app`)
- React (`npm create react-app`)
- Vue.js (`vue create`)
- Angular (`ng new`)
- Svelte (`npx create-svelte`)
- Gatsby, Remix, Astro
- Manuel HTML/CSS/JS setup

### Yasaklı Komutlar
```bash
# ❌ BUNLARI KULLANMA
npx create-next-app
npm create react-app
vue create
ng new
npx create-svelte
npm init
yarn create
pnpm create
```

## ✅ DOĞRU KULLANIM

### MCP Tool Kullanımı
```typescript
// ✅ DOĞRU: create-complete-application tool'unu kullan
{
  "tool": "create-complete-application",
  "userRequest": "Kuaför randevu uygulaması lazım"
}

// ❌ YANLIŞ: Manuel kurulum yapma
npx create-next-app kuafor-app
```

### Dosya Oluşturma
```typescript
// ✅ DOĞRU: TypeScript dosyası
// components/AppointmentForm.tsx
import React from 'react';

interface AppointmentFormProps {
  onSubmit: (data: FormData) => void;
}

export default function AppointmentForm({ onSubmit }: AppointmentFormProps) {
  // ...
}

// ❌ YANLIŞ: JavaScript dosyası
// components/AppointmentForm.jsx
import React from 'react';

export default function AppointmentForm({ onSubmit }) {
  // ...
}
```

## 🔒 KONTROL SİSTEMİ

### 1. Framework Kontrolü
MCP server her istekte `checkFrameworkProhibition()` fonksiyonunu çalıştırır:
- Yasaklı framework adları tespit edilir
- Yasaklı komutlar engellenir
- Kullanıcıya Zopio alternatifi önerilir

### 2. Dosya Uzantısı Kontrolü
`validateFileExtension()` fonksiyonu her dosya oluşturulurken çalışır:
- `.js` ve `.jsx` uzantıları reddedilir
- Sadece TypeScript ve desteklenen uzantılara izin verilir
- Hatalı uzantı kullanımında düzeltme önerisi sunulur

## 📝 ÖRNEK SENARYOLAR

### Senaryo 1: Kuaför Randevu Uygulaması
```typescript
// Kullanıcı isteği
"Kuaför randevu uygulaması lazım"

// MCP Server yapacakları:
1. ✅ Zopio framework'ü klonlar (https://github.com/zopiolabs/zopio.git)
2. ✅ TypeScript dosyaları oluşturur:
   - models/Service.ts
   - models/Customer.ts
   - models/Appointment.ts
   - controllers/AppointmentController.ts
   - components/AppointmentForm.tsx
   - app/api/appointments/route.ts
3. ✅ Prisma schema oluşturur
4. ✅ Web ve API sunucularını başlatır
5. ✅ http://localhost:3000 adresinde çalışır uygulama teslim eder

// ❌ YAPILMAYACAKLAR:
- Manuel Next.js kurulumu
- JavaScript (.js) dosyaları
- create-next-app kullanımı
```

### Senaryo 2: E-ticaret Sitesi
```typescript
// Kullanıcı isteği
"E-ticaret sitesi istiyorum"

// MCP Server yapacakları:
1. ✅ Zopio framework'ü kullanır
2. ✅ TypeScript ile:
   - models/Product.ts
   - models/Order.ts
   - models/Cart.ts
   - components/ProductList.tsx
   - components/ShoppingCart.tsx
   - app/api/products/route.ts
3. ✅ Tam çalışır e-ticaret sistemi teslim eder

// ❌ YAPILMAYACAKLAR:
- Vite ile React kurulumu
- JavaScript dosyaları
- Manuel framework setup
```

## 🎯 BAŞARI KRİTERLERİ

### Teslim Edilen Uygulama Özellikleri
- ✅ Tam çalışır CRUD işlemleri
- ✅ TypeScript tip güvenliği
- ✅ Responsive tasarım
- ✅ Form validasyonları
- ✅ Error handling
- ✅ RESTful API endpoints
- ✅ Database entegrasyonu (Prisma)
- ✅ Real-time güncellemeler
- ✅ Modern UI/UX (Tailwind CSS)

### Teknik Stack
- **Framework:** Zopio (Next.js 14 tabanlı)
- **Dil:** TypeScript (100%)
- **Database:** Prisma ORM + SQLite/PostgreSQL
- **Styling:** Tailwind CSS
- **UI:** React Server Components + Client Components
- **API:** Next.js App Router API Routes

## 🔧 HATA AYIKLAMA

### Hata: "Framework yasağı ihlali"
```
🚨 SINIR İHLALİ: "next.js" kullanımı YASAK!
❌ MANUEL FRAMEWORK KURULUMU YASAK!
✅ SADECE ZOPİO FRAMEWORK KULLANILACAK!
🔧 Çözüm: create-complete-application tool'unu kullan.
```

**Çözüm:** Manuel framework kurulumu yapmayın, `create-complete-application` tool'unu kullanın.

### Hata: "JavaScript dosyası yasağı"
```
🚨 DOSYA UZANTISI İHLALİ: ".js" uzantısı YASAK!
❌ JAVASCRIPT (.js, .jsx) DOSYALARI YASAK!
✅ SADECE TYPESCRIPT (.ts, .tsx) KULLANILACAK!
🔧 Dosya adını "component.ts" olarak değiştirin.
```

**Çözüm:** Dosya uzantısını `.ts` veya `.tsx` olarak değiştirin.

## 📚 EK KAYNAKLAR

- **Zopio Repository:** https://github.com/zopiolabs/zopio.git
- **TypeScript Dokümantasyonu:** https://www.typescriptlang.org/docs/
- **Next.js App Router:** https://nextjs.org/docs/app
- **Prisma ORM:** https://www.prisma.io/docs/

## 🎓 ÖĞRENME YOLU

1. **Başlangıç:** `create-complete-application` tool'unu kullanarak ilk uygulamanızı oluşturun
2. **İnceleme:** Oluşturulan TypeScript dosyalarını inceleyin
3. **Özelleştirme:** Zopio framework yapısını öğrenin
4. **Geliştirme:** Kendi özelliklerinizi ekleyin

## ⚡ HIZLI BAŞLANGIÇ

```bash
# 1. MCP Server'ı başlatın (otomatik)
# 2. Windsurf'te şunu yazın:
"Kuaför randevu uygulaması lazım"

# 3. 2-3 dakika bekleyin
# 4. http://localhost:3000 adresini açın
# 5. Uygulamanız hazır!
```

---

**Son Güncelleme:** 30 Ekim 2025  
**Versiyon:** 1.0.0  
**Durum:** ✅ Aktif ve Zorunlu
