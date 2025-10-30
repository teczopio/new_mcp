# 🎓 Zopio MCP Server - Best Practices & Hata Önleme Rehberi

## 📋 Genel Bakış

Bu dokümantasyon, Zopio MCP Server'ın her proje için minimum hata ile çalışmasını sağlamak için oluşturulmuştur.

## 🏗️ Zopio Framework Yapısı

### Dizin Yapısı
```
zopio/
├── apps/
│   └── web/
│       ├── app/
│       │   ├── [locale]/          # Locale-based routing
│       │   │   ├── (home)/        # Ana sayfa
│       │   │   ├── blog/
│       │   │   ├── contact/
│       │   │   └── [proje-adi]/   # Yeni projeler buraya
│       │   └── api/               # API routes
│       └── .env.local             # Environment variables
├── packages/
│   └── database/
│       └── prisma/
│           └── schema.prisma      # Database schema
└── .env.example                   # Example env file
```

### Kritik Kurallar

#### 1. ✅ Routing Yapısı
- **DOĞRU:** `/apps/web/app/[locale]/proje-adi/page.tsx`
- **YANLIŞ:** `/apps/web/app/proje-adi/page.tsx` (404 hatası)
- **YANLIŞ:** `/apps/web/app/page.tsx` (Zopio middleware ile çakışır)

#### 2. ✅ Design System Token'ları
Hardcoded renkler kullanma! Zopio design system token'larını kullan:

**YANLIŞ:**
```tsx
<div className="bg-white text-gray-600 border-gray-300">
  <button className="bg-blue-600 text-white">
```

**DOĞRU:**
```tsx
<div className="bg-card text-muted-foreground border-border">
  <button className="bg-primary text-primary-foreground">
```

**Token Listesi:**
- `bg-background` - Ana arka plan
- `bg-card` - Kart arka planı
- `bg-muted` - Soluk arka plan
- `text-foreground` - Ana metin
- `text-muted-foreground` - Soluk metin
- `border-border` - Kenarlık
- `bg-primary` - Birincil renk
- `text-primary-foreground` - Birincil metin
- `bg-destructive` - Hata/silme rengi

#### 3. ✅ Environment Variables

**Zorunlu Değişkenler:**
```env
# Database
DATABASE_URL="postgresql://localhost:5432/proje-adi"

# Basehub CMS (bshb_pk_ ile başlamalı!)
BASEHUB_TOKEN="bshb_pk_example_token_12345"

# Next.js URLs (hepsi gerekli!)
NEXT_PUBLIC_APP_URL="http://localhost:3001"
NEXT_PUBLIC_WEB_URL="http://localhost:3001"
NEXT_PUBLIC_API_URL="http://localhost:3002"
NEXT_PUBLIC_DOCS_URL="http://localhost:3003"

# Arcjet (ajkey_ ile başlamalı!)
ARCJET_KEY="ajkey_example_12345"

# Sentry
SENTRY_DSN="https://example@sentry.io/12345"
SENTRY_ORG="example-org"
SENTRY_PROJECT="proje-adi"

# Resend (re_ ile başlamalı!)
RESEND_TOKEN="re_example_token_12345"
RESEND_FROM="noreply@example.com"
```

**Dosya Konumları:**
- `apps/web/.env.local` - Geliştirme ortamı
- `.env.example` - Örnek dosya (root'ta)

#### 4. ✅ Prisma Schema

**DOĞRU Yapılandırma:**
```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../generated/client"  // Zopio yapısı
}

datasource db {
  provider     = "postgresql"       // SQLite değil!
  url          = env("DATABASE_URL")
  relationMode = "prisma"           // Zopio gereksinimi
}
```

**YANLIŞ:**
```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]  // ❌ Deprecated!
}

datasource db {
  provider = "sqlite"  // ❌ Zopio PostgreSQL kullanır
}
```

#### 5. ✅ Component Yapısı

**SPDX License Header Ekle:**
```tsx
/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import React from 'react';
```

**'use client' Direktifi:**
- State kullanan component'lerde zorunlu
- Event handler'lar (onClick, onChange) için gerekli
- `useState`, `useEffect` kullanan component'lerde

## 🚨 Yaygın Hatalar ve Çözümleri

### Hata 1: 404 Not Found
**Sebep:** Sayfa root'ta oluşturulmuş
**Çözüm:** `/[locale]/proje-adi/` altına taşı

### Hata 2: Environment Variable Hatası
**Sebep:** Token formatı yanlış veya eksik değişken
**Çözüm:** 
- `BASEHUB_TOKEN` → `bshb_pk_` ile başlamalı
- `ARCJET_KEY` → `ajkey_` ile başlamalı
- `RESEND_TOKEN` → `re_` ile başlamalı
- Tüm `NEXT_PUBLIC_*` değişkenleri gerekli

### Hata 3: Prisma Deprecated Warning
**Sebep:** `previewFeatures = ["driverAdapters"]`
**Çözüm:** Bu satırı kaldır, artık gerekli değil

### Hata 4: Design System Çakışması
**Sebep:** Hardcoded renkler (bg-white, text-gray-600)
**Çözüm:** Design system token'larını kullan

### Hata 5: Turbopack Panic
**Sebep:** Root'ta page.tsx çakışması
**Çözüm:** Root'taki page.tsx'i sil, locale altına taşı

## 📝 Checklist - Yeni Proje Oluştururken

- [ ] Proje `/[locale]/proje-adi/` altında mı?
- [ ] `apps/web/.env.local` oluşturuldu mu?
- [ ] `.env.example` root'ta oluşturuldu mu?
- [ ] Tüm token'lar doğru formatta mı? (bshb_pk_, ajkey_, re_)
- [ ] Design system token'ları kullanıldı mı?
- [ ] Prisma schema Zopio yapısına uygun mu?
- [ ] SPDX license header eklendi mi?
- [ ] Component'ler 'use client' direktifi ile başlıyor mu?

## 🎯 Başarı Kriterleri

Bir proje başarılı sayılır eğer:

1. ✅ `pnpm run dev --filter web` hatasız çalışıyor
2. ✅ `http://localhost:3001/en/proje-adi` açılıyor
3. ✅ Hiçbir environment variable hatası yok
4. ✅ Hiçbir Prisma deprecated uyarısı yok
5. ✅ Dark/Light mode çalışıyor (design system sayesinde)
6. ✅ Responsive tasarım çalışıyor

## 🔧 Hata Ayıklama Komutları

```bash
# Port temizle
lsof -ti:3001 | xargs kill -9

# Bağımlılıkları yeniden yükle
pnpm install

# Prisma client'ı yeniden oluştur
pnpm prisma generate

# Development server'ı başlat
pnpm run dev --filter web
```

## 📚 Ek Kaynaklar

- Zopio Repository: https://github.com/zopiolabs/zopio
- Next.js 15 Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
- Tailwind CSS: https://tailwindcss.com/docs

---

**Son Güncelleme:** 2025-10-30
**Versiyon:** 1.0.0
