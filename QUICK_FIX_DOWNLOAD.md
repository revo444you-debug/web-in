# Quick Fix - Download Error

## Error: "Gagal mendownload file. Silakan coba lagi."

### ⚡ Quick Fix (5 menit)

```bash
# 1. Stop server (Ctrl+C di terminal)

# 2. Regenerate Prisma
npx prisma generate

# 3. Push database schema
npx prisma db push

# 4. Restart server
npm run dev

# 5. Refresh browser (Ctrl+F5)

# 6. Login kembali

# 7. Coba download lagi
```

### ✅ Checklist Cepat

- [ ] Server running? (`npm run dev`)
- [ ] Sudah login?
- [ ] Database connected? (cek terminal untuk error)
- [ ] Browser console ada error? (F12)
- [ ] Popup blocker disabled?

### 🔍 Test Cepat

Buka di browser (setelah login):

```
http://localhost:3000/api/export/profile?format=json
```

**Jika berhasil:** File akan download atau JSON muncul
**Jika gagal:** Lihat error message

### 🚨 Jika Masih Error

1. **Cek Console Browser (F12)**
   - Lihat error message
   - Screenshot dan cari di DOWNLOAD_TROUBLESHOOTING.md

2. **Cek Server Terminal**
   - Ada error merah?
   - Copy error dan cari solusi

3. **Test Database**
   ```bash
   npx prisma studio
   ```
   - Cek ada user?
   - Cek ada profile?

### 💡 Common Issues

**"Unauthorized"**
→ Login kembali

**"User not found"**
→ Cek database ada user

**"Failed to generate report"**
→ Cek database connection

**Tidak ada error tapi tidak download**
→ Cek popup blocker browser

### 📚 Dokumentasi Lengkap

Lihat: [DOWNLOAD_TROUBLESHOOTING.md](./DOWNLOAD_TROUBLESHOOTING.md)
