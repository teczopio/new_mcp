# 🎬 Zopio Senaryo Bazlı Kurulum Rehberi

## 📋 Genel Bakış

Artık Zopio'yu kurarken **tüm uygulamaları** değil, **sadece ihtiyacınız olan uygulamayı** kurabilirsiniz!

## 🎯 Mevcut Senaryolar

### 1. Web Uygulaması 🌐
```bash
# CLI ile
zopio> setup web

# Cascade/Claude ile
"Ben Zopio'da web uygulaması kurmak istiyorum"
```
- **Port:** 3000
- **Ne kurar:** Sadece web arayüzü
- **Kullanım:** Frontend geliştirme için ideal

### 2. API Uygulaması 🔌
```bash
# CLI ile
zopio> setup api

# Cascade/Claude ile
"Zopio'da API uygulaması kur"
```
- **Port:** 3001
- **Ne kurar:** Sadece backend API servisleri
- **Kullanım:** Backend geliştirme için ideal

### 3. Ana Uygulama 📱
```bash
# CLI ile
zopio> setup app

# Cascade/Claude ile
"Zopio'da ana uygulamayı kur"
```
- **Port:** 3002
- **Ne kurar:** Zopio'nun ana uygulaması
- **Kullanım:** Full-stack geliştirme için ideal

### 4. Dokümantasyon 📚
```bash
# CLI ile
zopio> setup docs

# Cascade/Claude ile
"Zopio'da dokümantasyonu kur"
```
- **Port:** 3003
- **Ne kurar:** Dokümantasyon sitesi
- **Kullanım:** Dokümantasyon yazımı için ideal

### 5. Tüm Uygulamalar 🎯
```bash
# CLI ile
zopio> setup all

# Cascade/Claude ile
"Zopio'nun tüm uygulamalarını kur"
```
- **Port:** Çeşitli portlar
- **Ne kurar:** Tüm uygulamalar
- **Kullanım:** Tam ekosistem için ideal

## 🛑 Uygulamaları Durdurma

### Belirli Bir Uygulamayı Durdur
```bash
# CLI ile
zopio> stop web

# Cascade/Claude ile
"Web uygulamasını durdur"
```

### Tüm Uygulamaları Durdur
```bash
# CLI ile
zopio> stop

# Cascade/Claude ile
"Tüm uygulamaları durdur"
```

## 📊 Durum Kontrolü

```bash
# CLI ile
zopio> status

# Cascade/Claude ile
"Zopio durumunu kontrol et"
```

Bu komut size şunları gösterir:
- ✅ Repo kurulu mu?
- ✅ Hangi uygulamalar çalışıyor?
- ✅ Kurulum konumu

## 💡 Kullanım Örnekleri

### Örnek 1: Sadece Frontend Geliştirme
```bash
zopio> setup web
# Sadece web uygulaması kurulur ve çalışır
# Diğer uygulamalar kurulmaz, kaynak tasarrufu sağlanır
```

### Örnek 2: Backend + Frontend
```bash
zopio> setup api
zopio> setup web
# Hem API hem web uygulaması çalışır
# Docs ve app kurulmaz
```

### Örnek 3: Tam Geliştirme Ortamı
```bash
zopio> setup all
# Tüm uygulamalar kurulur ve çalışır
```

## 🔄 Senaryo Değiştirme

Bir senaryodan diğerine geçmek için:

```bash
# Mevcut uygulamayı durdur
zopio> stop web

# Yeni uygulamayı başlat
zopio> setup api
```

## ⚡ Avantajlar

1. **Kaynak Tasarrufu** - Sadece ihtiyacınız olanı çalıştırın
2. **Hızlı Başlangıç** - Gereksiz uygulamalar kurulmaz
3. **Odaklanma** - Sadece üzerinde çalıştığınız uygulamaya odaklanın
4. **Esneklik** - İstediğiniz zaman senaryo değiştirin

## 🎓 İpuçları

- İlk kurulumda repo otomatik klonlanır
- Bağımlılıklar otomatik yüklenir (pnpm)
- Her uygulama kendi portunda çalışır
- Aynı anda birden fazla uygulama çalıştırabilirsiniz
- `status` komutu ile her zaman durumu kontrol edebilirsiniz

## 🚀 Hızlı Başlangıç

```bash
# 1. CLI'yi başlat
npm run cli

# 2. İstediğiniz senaryoyu seç
zopio> setup web

# 3. Geliştirmeye başla!
# http://localhost:3000
```

---

**Not:** Bu senaryo sistemi sayesinde artık Zopio'yu daha verimli kullanabilirsiniz! 🎉
