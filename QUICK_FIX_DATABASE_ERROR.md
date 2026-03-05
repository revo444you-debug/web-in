# Quick Fix - Database Error "prepared statement does not exist"

## ⚡ Fix dalam 2 Menit

### Step 1: Update .env

Buka file `.env` dan ubah DATABASE_URL:

**DARI:**
```env
DATABASE_URL='postgresql://postgres.xxx:password@aws-1-ap-south-1.pooler.supabase.com:6543/postgres'
```

**JADI:**
```env
DATABASE_URL='postgresql://postgres.xxx:password@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1'
```

**Tambahkan di akhir URL:**
```
?pgbouncer=true&connection_limit=1
```

### Step 2: Regenerate & Restart

```bash
# Stop server (Ctrl+C)

# Regenerate Prisma
npx prisma generate

# Restart
npm run dev
```

### Step 3: Test

Refresh browser dan coba akses dashboard lagi.

## ✅ Selesai!

Error "prepared statement does not exist" seharusnya sudah hilang.

## 🔍 Jika Masih Error

### Clear Cache
```bash
# Stop server
rm -rf .next
npm run dev
```

### Full Reset
```bash
rm -rf .next node_modules
npm install
npx prisma generate
npm run dev
```

## 📚 Penjelasan Singkat

**Masalah:** Prisma prepared statements tidak kompatibel dengan PgBouncer
**Solusi:** Tambahkan `pgbouncer=true` di DATABASE_URL

## 📖 Dokumentasi Lengkap

Lihat: [FIX_PREPARED_STATEMENT_ERROR.md](./FIX_PREPARED_STATEMENT_ERROR.md)
