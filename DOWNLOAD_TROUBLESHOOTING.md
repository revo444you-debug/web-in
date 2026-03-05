# Download Feature - Troubleshooting

## Error: "Gagal mendownload file"

### Kemungkinan Penyebab & Solusi

#### 1. Database Connection Error

**Gejala:**
- Error muncul saat klik download
- Console menunjukkan database error

**Solusi:**
```bash
# Cek koneksi database
npx prisma db push

# Regenerate Prisma Client
npx prisma generate

# Restart server
npm run dev
```

#### 2. Session Expired

**Gejala:**
- Error "Unauthorized"
- Redirect ke login

**Solusi:**
- Logout dan login kembali
- Clear browser cookies
- Refresh halaman

#### 3. Prisma GroupBy Error (untuk System Report)

**Gejala:**
- System Report gagal download
- Error di console tentang groupBy

**Solusi:**
Sudah diperbaiki di kode dengan try-catch. Jika masih error:

```bash
# Update Prisma
npm install @prisma/client@latest prisma@latest

# Regenerate
npx prisma generate

# Restart
npm run dev
```

#### 4. Empty Profile Data

**Gejala:**
- Download berhasil tapi file kosong atau minimal

**Solusi:**
- Isi profil terlebih dahulu di halaman Profile
- Pastikan data tersimpan di database

#### 5. Browser Blocking Download

**Gejala:**
- Tidak ada file yang terdownload
- Tidak ada error di console

**Solusi:**
- Cek popup blocker browser
- Allow downloads dari localhost:3000
- Coba browser lain

#### 6. CORS Error

**Gejala:**
- Error CORS di console
- Fetch failed

**Solusi:**
Seharusnya tidak terjadi karena same-origin. Jika terjadi:
- Pastikan mengakses dari localhost:3000
- Jangan gunakan IP address
- Restart server

## Debug Steps

### 1. Cek Console Browser

Buka Developer Tools (F12) → Console tab

**Yang harus dicek:**
- Error messages
- Network requests
- Response status codes

### 2. Cek Network Tab

Developer Tools → Network tab

**Saat klik download, cek:**
- Request URL benar?
- Status code (200 = OK, 401 = Unauthorized, 500 = Server Error)
- Response headers ada Content-Disposition?
- Response body ada data?

### 3. Test API Langsung

Buka browser tab baru, paste URL:

```
# Test profile export
http://localhost:3000/api/export/profile?format=json

# Test users export (admin only)
http://localhost:3000/api/export/users?format=json

# Test system report (admin only)
http://localhost:3000/api/export/report
```

**Expected:**
- File langsung download ATAU
- JSON muncul di browser

**Jika error:**
- Lihat error message
- Cek apakah sudah login
- Cek role untuk admin endpoints

### 4. Cek Server Logs

Terminal tempat `npm run dev` berjalan:

**Cari:**
- Error messages
- Stack traces
- Database errors

### 5. Cek Database

```bash
# Buka Prisma Studio
npx prisma studio

# Cek:
# - Ada user?
# - Ada profile?
# - Data terisi?
```

## Common Fixes

### Fix 1: Restart Everything

```bash
# Stop server (Ctrl+C)

# Clear Next.js cache
rm -rf .next

# Regenerate Prisma
npx prisma generate

# Restart
npm run dev
```

### Fix 2: Clear Browser Data

1. Open Developer Tools (F12)
2. Application tab
3. Clear storage
4. Refresh page
5. Login kembali

### Fix 3: Check Environment Variables

```bash
# Cek .env file
cat .env

# Pastikan ada:
# - DATABASE_URL
# - DIRECT_URL
# - SESSION_SECRET
```

### Fix 4: Database Schema Sync

```bash
# Push schema ke database
npx prisma db push

# Atau reset database (WARNING: hapus semua data)
npx prisma migrate reset
```

## Error Messages & Solutions

### "Unauthorized - Please login"
**Solusi:** Login kembali

### "Unauthorized - Admin access required"
**Solusi:** Butuh role ADMIN, login sebagai admin

### "User not found"
**Solusi:** User tidak ada di database, cek session

### "Failed to export profile"
**Solusi:** Cek server logs untuk detail error

### "Failed to generate report"
**Solusi:** 
- Cek database connection
- Cek apakah ada data di database
- Lihat server logs

### "File is empty"
**Solusi:**
- Cek apakah ada data di database
- Isi profil terlebih dahulu

## Testing Commands

### Test dengan curl

```bash
# Get session cookie first (after login in browser)
# Check browser DevTools → Application → Cookies

# Test profile export
curl -v "http://localhost:3000/api/export/profile?format=json" \
  -H "Cookie: session=YOUR_SESSION_COOKIE"

# Test users export (admin)
curl -v "http://localhost:3000/api/export/users?format=csv" \
  -H "Cookie: session=ADMIN_SESSION_COOKIE"

# Test system report (admin)
curl -v "http://localhost:3000/api/export/report" \
  -H "Cookie: session=ADMIN_SESSION_COOKIE"
```

### Test dengan JavaScript Console

Paste di browser console (F12):

```javascript
// Test profile download
fetch('/api/export/profile?format=json')
  .then(r => {
    console.log('Status:', r.status);
    console.log('Headers:', [...r.headers.entries()]);
    return r.text();
  })
  .then(data => console.log('Data:', data))
  .catch(err => console.error('Error:', err));
```

## Still Not Working?

### Collect Debug Info

1. Browser console errors (screenshot)
2. Network tab details (screenshot)
3. Server logs (copy text)
4. Database state (Prisma Studio screenshot)

### Check These Files

```bash
# API routes
ls -la app/api/export/*/route.ts

# Component
ls -la components/ui/download-button.tsx

# Environment
cat .env | grep -v "PASSWORD\|SECRET\|KEY"
```

### Last Resort

```bash
# Complete reset
rm -rf node_modules .next
npm install
npx prisma generate
npx prisma db push
npm run dev
```

## Prevention

### Regular Maintenance

1. Backup database weekly
2. Test download features after updates
3. Monitor server logs
4. Keep dependencies updated

### Best Practices

1. Always test in development first
2. Check browser console for errors
3. Verify data exists before download
4. Use proper error handling

## Contact Support

Jika masih bermasalah setelah semua langkah di atas:

1. Buat issue di repository
2. Sertakan:
   - Error message lengkap
   - Browser & version
   - Node.js version
   - Steps to reproduce
   - Screenshots
