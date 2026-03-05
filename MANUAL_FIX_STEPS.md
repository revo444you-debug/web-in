# Manual Fix - Langkah Demi Langkah

## Masalah: PowerShell Script Disabled

Karena PowerShell script tidak bisa dijalankan, ikuti langkah manual ini:

---

## 🔧 Fix Database Error

### Step 1: Buka Command Prompt (CMD)
```
1. Tekan Windows + R
2. Ketik: cmd
3. Enter
4. Navigate ke folder project:
   cd D:\coding\template
```

### Step 2: Jalankan Command Satu Per Satu

**Di Command Prompt (CMD), jalankan:**

```cmd
REM 1. Clear Next.js cache
rmdir /s /q .next

REM 2. Regenerate Prisma Client
npx prisma generate

REM 3. Start server
npm run dev
```

**Copy paste satu per satu, tekan Enter setelah setiap command.**

---

## 📱 Test PWA Install

Setelah server running:

### Step 1: Buka Browser
```
1. Buka Chrome atau Edge
2. Go to: http://localhost:3000
3. Login ke dashboard
```

### Step 2: Install Aplikasi
```
1. Tunggu 3-5 detik
2. Lihat banner "Install Aplikasi" muncul di pojok kanan bawah
3. Klik tombol "Install"
```

**ATAU:**

```
1. Lihat icon ➕ di address bar (kanan atas)
2. Klik icon tersebut
3. Klik "Install"
```

---

## ✅ Verifikasi

### Cek Database Fix
- Dashboard bisa dibuka tanpa error ✅
- Tidak ada error "prepared statement" ✅

### Cek PWA
- Banner install muncul ✅
- Bisa klik install ✅
- Aplikasi terbuka di window terpisah ✅

---

## 🚨 Jika Masih Error

### Error: "prepared statement does not exist"

**Solusi 1: Gunakan Direct Connection**

1. Buka file `.env`
2. Ubah DATABASE_URL:

```env
# Comment yang lama
# DATABASE_URL='postgresql://...pooler.supabase.com:6543...'

# Gunakan direct connection
DATABASE_URL='postgresql://postgres.lnrrghaejoyguikjdmgs:T8N54W9c7MtsjC7e@aws-1-ap-south-1.pooler.supabase.com:5432/postgres'
```

3. Save file
4. Restart server (Ctrl+C, lalu `npm run dev`)

**Solusi 2: Clear Everything**

Di Command Prompt:
```cmd
rmdir /s /q .next
rmdir /s /q node_modules
npm install
npx prisma generate
npm run dev
```

### PWA Install Button Tidak Muncul

**Cek:**
1. Gunakan Chrome atau Edge (bukan Firefox/Safari)
2. Tunggu minimal 5 detik setelah halaman load
3. Refresh halaman (Ctrl+F5)
4. Cek DevTools (F12) → Console untuk error

**Manual Install:**
1. Klik menu (⋮) di Chrome
2. Pilih "Install Dashboard Template..."
3. Klik "Install"

---

## 📝 Command Reference

### Clear Cache
```cmd
rmdir /s /q .next
```

### Regenerate Prisma
```cmd
npx prisma generate
```

### Start Server
```cmd
npm run dev
```

### Stop Server
```
Tekan Ctrl+C di terminal
```

### Check Prisma Version
```cmd
npx prisma --version
```

---

## 🎯 Quick Commands (Copy Paste Semua)

**Buka Command Prompt, navigate ke project folder, lalu:**

```cmd
rmdir /s /q .next && npx prisma generate && npm run dev
```

**Atau satu per satu:**

```cmd
rmdir /s /q .next
```
(Enter, tunggu selesai)

```cmd
npx prisma generate
```
(Enter, tunggu selesai)

```cmd
npm run dev
```
(Enter, server akan start)

---

## 💡 Tips

1. **Selalu gunakan Command Prompt (CMD), bukan PowerShell**
2. **Jika npx tidak dikenali, install Node.js terbaru**
3. **Pastikan di folder project yang benar**
4. **Tunggu setiap command selesai sebelum jalankan yang berikutnya**

---

## ✅ Success Indicators

**Database OK:**
- Server start tanpa error
- Dashboard bisa dibuka
- Tidak ada error merah di console

**PWA OK:**
- Banner install muncul
- Icon ➕ ada di address bar
- Bisa install dan buka sebagai app

---

## 📞 Masih Bermasalah?

Screenshot error yang muncul dan jelaskan:
1. Error message apa yang muncul?
2. Di step mana error terjadi?
3. Browser apa yang digunakan?
4. Sudah coba command mana saja?
