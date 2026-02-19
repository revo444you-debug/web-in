# Fix Access Token Expired

## Error
```
"The access token could not be decrypted"
Error code: 190 (OAuthException)
```

## Penyebab
Access token expired atau invalid. Temporary token dari Meta hanya berlaku 24 jam.

## Solusi 1: Generate Temporary Token Baru (Quick Fix)

### Langkah:
1. Buka Meta Developer Console:
   ```
   https://developers.facebook.com/apps/
   ```

2. Pilih app kamu → WhatsApp → API Setup

3. Di bagian "Temporary access token", klik "Generate"

4. Copy token baru

5. Update `.env`:
   ```env
   WABA_ACCESS_TOKEN=EAAT... (token baru)
   ```

6. Restart dev server:
   ```bash
   npm run dev
   ```

### Kekurangan:
- ❌ Token expire setiap 24 jam
- ❌ Harus generate ulang setiap hari
- ❌ Tidak cocok untuk production

## Solusi 2: Generate Permanent Token (Recommended)

### Langkah:

#### 1. Buat System User
1. Buka Business Settings:
   ```
   https://business.facebook.com/settings/system-users
   ```

2. Klik "Add" → Buat System User baru
   - Name: "WhatsApp CRM Bot"
   - Role: Admin

#### 2. Assign Assets
1. Klik System User yang baru dibuat
2. Klik "Add Assets"
3. Pilih "Apps" → Pilih WhatsApp app kamu
4. Enable "Manage App"

#### 3. Generate Token
1. Klik "Generate New Token"
2. Select App: Pilih WhatsApp app kamu
3. Permissions: Pilih:
   - `whatsapp_business_management`
   - `whatsapp_business_messaging`
4. Token Expiration: **Never** (permanent)
5. Generate Token
6. **COPY TOKEN SEKARANG** (tidak bisa dilihat lagi!)

#### 4. Update .env
```env
WABA_ACCESS_TOKEN=YOUR_PERMANENT_TOKEN_HERE
```

#### 5. Restart Server
```bash
npm run dev
```

### Keuntungan:
- ✅ Token permanent (tidak expire)
- ✅ Cocok untuk production
- ✅ Tidak perlu generate ulang

## Solusi 3: Pakai n8n untuk Send Message (Alternative)

Karena kamu sudah pakai n8n untuk webhook, bisa juga pakai n8n untuk send message:

### Setup:
1. Buat workflow n8n baru untuk send message
2. Trigger: Webhook
3. Action: WhatsApp Business Cloud → Send Message
4. Update API endpoint di app untuk hit n8n webhook

### Keuntungan:
- ✅ Token management di n8n
- ✅ Centralized WhatsApp integration
- ✅ Easier debugging

## Verification

Setelah update token, test dengan:

```bash
# Test send message
curl -X POST http://localhost:3000/api/messages/send \
  -H "Content-Type: application/json" \
  -d '{
    "contactId": "YOUR_CONTACT_ID",
    "type": "TEXT",
    "content": "Test message"
  }'
```

Atau langsung dari UI Messages page.

## Troubleshooting

### Error masih muncul setelah update token?
1. Pastikan token di-copy dengan benar (tidak ada spasi)
2. Restart dev server
3. Clear browser cache
4. Cek token di Meta dashboard masih valid

### Token expire terus?
- Pakai System User Token (Solusi 2)
- Atau pakai n8n (Solusi 3)

### Tidak bisa generate System User Token?
- Pastikan kamu Admin di Business Manager
- Pastikan app sudah di-assign ke Business Manager
