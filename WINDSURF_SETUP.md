# Windsurf'te Zopio MCP Sunucusu Kurulumu

## ✅ Yapılan İşlemler

1. **Global Settings Güncellendi**
   - Dosya: `~/Library/Application Support/Windsurf/User/settings.json`
   - `mcpServers` anahtarı ile Zopio sunucusu eklendi

2. **Workspace Settings Oluşturuldu**
   - Dosya: `.windsurf/settings.json`
   - Proje özelinde MCP ayarları yapıldı

## 🔄 Windsurf'ü Yeniden Başlatma

1. **Windsurf'ü tamamen kapatın** (Cmd+Q)
2. **Windsurf'ü yeniden açın**
3. **Cascade'i açın** (Cmd+L veya chat ikonuna tıklayın)
4. **Sağ üstte "1 MCP" yazısına tıklayın**
5. **"zopio" sunucusunu listede görmelisiniz**

## 🎯 Beklenen Sonuç

MCP listesinde şunları görmelisiniz:
```
1 MCP
  • context7
  • zopio      ← YENİ!
```

## 🐛 Sorun Giderme

### Zopio Görünmüyorsa:

1. **Settings dosyasını kontrol edin:**
   ```bash
   cat ~/Library/Application\ Support/Windsurf/User/settings.json
   ```
   
   Şu satırları görmelisiniz:
   ```json
   {
     "mcpServers": {
       "zopio": {
         "command": "npx",
         "args": ["ts-node", "/Users/tahaenescinli/Desktop/NEW MCP/src/server.ts"]
       }
     }
   }
   ```

2. **Bağımlılıkları kontrol edin:**
   ```bash
   cd ~/Desktop/NEW\ MCP
   npm install
   ```

3. **Sunucuyu manuel test edin:**
   ```bash
   cd ~/Desktop/NEW\ MCP
   npx ts-node src/server.ts
   ```
   
   Karşılama mesajını görmelisiniz.

4. **Windsurf loglarını kontrol edin:**
   - Windsurf'te: View → Output → "MCP" seçin
   - Hata mesajlarını kontrol edin

## 📝 Kullanım

Zopio sunucusu yüklendikten sonra Cascade'de:
- "Zopio'yu kur"
- "Zopio durumunu kontrol et"
- "Zopio sunucusunu durdur"

gibi komutlar verebilirsiniz.
