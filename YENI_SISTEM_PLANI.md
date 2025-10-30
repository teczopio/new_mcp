# Zopio MCP - Akıllı Asistan Dönüşüm Planı

## 🎯 Hedef

Mevcut "çat diye uygulama kuran" sistemden → **Akıllı karar veren, kullanıcıyı yönlendiren asistan**'a dönüşüm.

## 📋 Yeni Sistem Akışı

### 1. KULLANICI PROFİLLEME (Profiling)
```
Kullanıcı: "güzellik salonu randevu sistemi istiyorum"
                    ↓
MCP Analiz Eder:
- Teknik terimler var mı? → YOK → Beginner olabilir
- Backend/Frontend deneyimi? → BELLİ DEĞİL
- Güven skoru: %40 (düşük)
                    ↓
MCP Sorar:
"Daha önce web uygulaması geliştirdiniz mi?"
"API ve veritabanı konularında deneyiminiz var mı?"
"Bütçeniz nedir? ($50/ay, $200/ay, $500+/ay)"
"Projeyi ne kadar sürede tamamlamak istiyorsunuz?"
```

**Çıktı:** UserProfile objesi
```typescript
{
  technicalLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert',
  hasBackendExperience: boolean,
  hasFrontendExperience: boolean,
  budget: 'low' | 'medium' | 'high',
  timeline: 'urgent' | 'normal' | 'flexible',
  confidence: number // 0-100
}
```

### 2. GEREKSİNİM TOPLAMA (Requirements)
```
MCP: "Projenizi detaylı anlatır mısınız?"
                    ↓
Kullanıcı: "Müşteriler randevu alabilsin, ödeme yapsın, 
            admin panelinde randevuları görebileyim"
                    ↓
MCP Analiz Eder:
- Proje türü: appointment-system ✓
- Özellikler: randevu, ödeme, admin panel ✓
- Kullanıcı rolleri: müşteri, admin ✓
- Karmaşıklık: medium
- Netlik skoru: %75 (yeterli)
```

**Eğer netlik < %60:**
```
MCP Sorar:
"Sistemde hangi kullanıcı rolleri olacak?"
"Ödeme sistemi hangi sağlayıcı ile olacak?"
"Email bildirimleri gerekli mi?"
```

**Çıktı:** ProjectRequirement objesi
```typescript
{
  projectName: string,
  projectType: 'appointment-system' | 'e-commerce' | ...,
  features: string[],
  userRoles: UserRole[],
  estimatedComplexity: 'simple' | 'medium' | 'complex',
  clarityScore: number
}
```

### 3. FRAMEWORK KARAR MOTORU (Decision)
```
MCP Düşünür:
- Kullanıcı: beginner, budget: low
- Proje: appointment-system, medium complexity
- Özellikler: randevu, ödeme, email
                    ↓
KARAR:
✅ Zopio Core (zorunlu)
✅ PostgreSQL (zorunlu)
✅ Authentication (zorunlu)
✅ Basehub CMS (önerilen) → $29/ay
✅ Resend Email (önerilen) → $20/ay
✅ Stripe Payment (önerilen) → %2.9 + $0.30/işlem
⚠️ Arcjet Security (opsiyonel) → $50/ay (beginner için gerekli değil)
```

**Çıktı:** FrameworkDecision objesi
```typescript
{
  components: ZopioComponent[],
  reasoning: string, // Neden bu bileşenler seçildi
  estimatedCost: {
    monthly: 69, // $29 + $20 + $20 (hosting)
    setup: 0,
    breakdown: CostBreakdown[]
  },
  requiredServices: ServiceRequirement[],
  alternatives: Alternative[] // Daha ucuz seçenekler
}
```

### 4. MALİYET DANIŞMANLIĞI (Cost Review)
```
MCP Sunar:
"## 💰 Sizin İçin Hazırladığım Çözüm

### Aylık Maliyet: $69

**Zorunlu:**
- Vercel Hosting: $20/ay
- Supabase Database: $25/ay

**Önerilen:**
- Basehub CMS: $29/ay
  Alternatifler: Strapi (ücretsiz, self-host), Contentful ($300/ay)
  
- Resend Email: $20/ay
  Alternatifler: SendGrid ($15/ay), AWS SES ($0.10/1000 email)

**Opsiyonel:**
- Arcjet Security: $50/ay (şimdilik gerekli değil)

Bu sizin için uygun mu?"
                    ↓
Kullanıcı: "Çok pahalı, daha ucuz olur mu?"
                    ↓
MCP: "## 💡 Alternatif Çözüm

### Aylık Maliyet: $30

- Railway Hosting: $5/ay (Vercel yerine)
- Neon Database: $0-25/ay (Supabase yerine)
- Strapi CMS: Ücretsiz (self-host)
- AWS SES: $0.10/1000 email

**Ödünler:**
- Daha az özellik
- Daha düşük limitler
- Daha fazla teknik bilgi gerekir

Devam edelim mi?"
```

### 5. SERVİS KURULUM REHBERLİĞİ (Setup Guidance)
```
Kullanıcı: "Tamam, başlayalım"
                    ↓
MCP: "Harika! Şimdi gerekli hesapları açmanız gerekiyor:

## 1. Basehub CMS
1. basehub.com adresine gidin
2. Ücretsiz hesap açın
3. Yeni proje oluşturun
4. Settings > API > Token oluşturun
5. Token'ı bana verin (bshb_pk_ ile başlar)

## 2. Resend Email
1. resend.com adresine gidin
2. Hesap açın ($20/ay plan seçin)
3. API Keys > Create API Key
4. Token'ı bana verin (re_ ile başlar)
5. Domain doğrulaması yapın

## 3. Stripe Payment
1. stripe.com adresine gidin
2. Hesap açın (test modu ücretsiz)
3. Developers > API keys
4. Secret key'i bana verin

Hazır olduğunuzda token'ları paylaşın."
                    ↓
Kullanıcı: "BASEHUB_TOKEN=bshb_pk_xxx
           RESEND_TOKEN=re_xxx
           STRIPE_SECRET_KEY=sk_test_xxx"
                    ↓
MCP: "✅ Token'lar alındı ve doğrulandı!
      ✅ Zopio framework klonlanıyor...
      ✅ Bağımlılıklar yükleniyor...
      ✅ Environment variables ayarlanıyor...
      ✅ Database schema oluşturuluyor...
      ✅ Proje dosyaları oluşturuluyor...
      ✅ Sunucular başlatılıyor...
      
      🎉 Projeniz hazır!
      🌐 http://localhost:3001/en/guzellik-salonu"
```

## 🔧 Teknik Mimari

### Modüller

1. **user-profiler.ts**
   - `analyzeInitialMessage()`
   - `generateProfilingQuestions()`
   - `isProfileComplete()`

2. **requirement-gatherer.ts**
   - `extractRequirements()`
   - `generateClarificationQuestions()`
   - `isRequirementComplete()`

3. **framework-decision-engine.ts**
   - `makeDecision()`
   - `calculateCost()`
   - `generateAlternatives()`
   - `generateReasoning()`

4. **conversation-manager.ts**
   - `processMessage()`
   - `handleProfiling()`
   - `handleRequirements()`
   - `handleDecision()`
   - `handleCostReview()`
   - `handleInstallation()`

5. **service-validator.ts**
   - `validateApiKey()`
   - `checkServiceAvailability()`
   - `testConnection()`

### Yeni MCP Tools

```typescript
// Eski (KALDIRILACAK):
- create-complete-application → Çat diye kuruyordu ❌

// Yeni:
- start-conversation → Konuşmayı başlat
- continue-conversation → Kullanıcı cevabını işle
- show-decision → Framework kararını göster
- validate-api-keys → API keylerini doğrula
- install-with-config → Onaylanmış config ile kur
```

## 📊 Konuşma Durumu (State)

```typescript
interface ConversationState {
  stage: 'profiling' | 'requirements' | 'clarification' | 
         'decision' | 'cost-review' | 'installation',
  userProfile?: UserProfile,
  projectRequirement?: ProjectRequirement,
  frameworkDecision?: FrameworkDecision,
  questionsAsked: string[],
  answersReceived: Record<string, any>,
  currentQuestion?: string
}
```

## 🎬 Örnek Senaryo

```
[1] Kullanıcı: "randevu sistemi yapabilir misin"
    MCP: Profilleme başlıyor...
    → "Daha önce web uygulaması geliştirdiniz mi?"

[2] Kullanıcı: "hayır, ilk defa"
    MCP: technicalLevel = 'beginner'
    → "Bütçeniz nedir?"

[3] Kullanıcı: "ayda 50 dolar civarı"
    MCP: budget = 'low'
    → "Projenizi detaylı anlatır mısınız?"

[4] Kullanıcı: "kuaför randevu sistemi, müşteriler randevu alsın"
    MCP: Gereksinim analizi...
    → projectType = 'appointment-system'
    → features = ['randevu']
    → clarityScore = 45% (düşük)
    → "Ödeme sistemi olacak mı?"

[5] Kullanıcı: "evet, kredi kartı ile"
    MCP: features += 'ödeme'
    → "Email bildirimleri gerekli mi?"

[6] Kullanıcı: "evet"
    MCP: features += 'email'
    → clarityScore = 75% (yeterli)
    → Framework karar motoru çalışıyor...

[7] MCP: "## Sizin İçin Çözüm
         Aylık: $69
         - Vercel: $20
         - Supabase: $25
         - Basehub: $29
         - Resend: $20
         
         Uygun mu?"

[8] Kullanıcı: "çok pahalı"
    MCP: Alternatifler gösteriliyor...
    → "Railway + Neon + Strapi = $30/ay
       Ödünler: Daha az özellik, daha fazla teknik bilgi
       Devam edelim mi?"

[9] Kullanıcı: "tamam bu olsun"
    MCP: "Harika! Şu hesapları açın:
         1. basehub.com
         2. resend.com
         API keylerini bekliyorum..."

[10] Kullanıcı: "BASEHUB_TOKEN=bshb_pk_xxx..."
     MCP: ✅ Kurulum başlıyor...
     → Zopio klonlanıyor
     → Dosyalar oluşturuluyor
     → Sunucular başlatılıyor
     → 🎉 Hazır!
```

## ✅ Başarı Kriterleri

1. ✅ Kullanıcı profili %70+ güvenle belirleniyor
2. ✅ Proje gereksinimleri %60+ netlikle anlaşılıyor
3. ✅ Framework kararı gerekçeli sunuluyor
4. ✅ Maliyet detaylı açıklanıyor
5. ✅ Alternatifler sunuluyor
6. ✅ API key kurulum rehberi veriliyor
7. ✅ Kurulum adım adım ilerliyor
8. ✅ Hata durumunda geri dönüş var

## 🚀 Sonraki Adımlar

1. `intelligent-assistant.ts` modüllerini oluştur
2. `server.ts`'yi yeni tool'larla güncelle
3. Konuşma state management ekle
4. API key validation sistemi kur
5. Test senaryoları yaz
6. Dokümantasyon güncelle
