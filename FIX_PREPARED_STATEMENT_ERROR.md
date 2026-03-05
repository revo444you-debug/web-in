# Fix: Prepared Statement Error

## Error Message
```
ConnectorError(ConnectorError { user_facing_error: None, kind: QueryError(PostgresError { 
  code: "26000", 
  message: "prepared statement \"s12\" does not exist", 
  severity: "ERROR", 
  detail: None, 
  column: None, 
  hint: None 
}), transient: false })
```

## Penyebab

Error ini terjadi karena:

1. **PgBouncer Connection Pooling**: Supabase menggunakan PgBouncer untuk connection pooling
2. **Prepared Statements**: Prisma mencoba menggunakan prepared statements yang tidak kompatibel dengan PgBouncer dalam mode transaction pooling
3. **Connection Limit**: Terlalu banyak connection atau parameter yang salah

## Solusi

### 1. Update DATABASE_URL

**SEBELUM:**
```env
DATABASE_URL='postgresql://...@...pooler.supabase.com:6543/postgres'
```

**SESUDAH:**
```env
DATABASE_URL='postgresql://...@...pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1'
```

**Parameter penting:**
- `pgbouncer=true` - Memberitahu Prisma bahwa menggunakan PgBouncer
- `connection_limit=1` - Membatasi connection pool (untuk serverless/edge)

### 2. Regenerate Prisma Client

```bash
# Stop server (Ctrl+C)

# Regenerate Prisma Client
npx prisma generate

# Restart server
npm run dev
```

### 3. Clear Next.js Cache

```bash
# Stop server

# Remove cache
rm -rf .next

# Restart
npm run dev
```

## Penjelasan Parameter

### pgbouncer=true
- Memberitahu Prisma untuk tidak menggunakan prepared statements
- Kompatibel dengan PgBouncer transaction pooling
- Sedikit lebih lambat tapi lebih stabil

### connection_limit=1
- Membatasi jumlah connection per instance
- Penting untuk serverless/edge functions
- Mencegah connection pool exhaustion

### Removed Parameters

**TIDAK PERLU LAGI:**
- `prepared_statements=false` - Sudah handled oleh `pgbouncer=true`
- `pool_timeout=10` - Default sudah cukup
- `connection_limit=5` - Terlalu banyak untuk serverless

## Verifikasi

### 1. Cek .env file

```bash
cat .env | grep DATABASE_URL
```

**Expected:**
```
DATABASE_URL='postgresql://...?pgbouncer=true&connection_limit=1'
```

### 2. Test Connection

```bash
npx prisma db pull
```

**Expected:** No errors

### 3. Test Query

Buka aplikasi dan coba akses dashboard.

**Expected:** Tidak ada error "prepared statement does not exist"

## Troubleshooting

### Masih Error Setelah Fix?

**1. Restart Lengkap**
```bash
# Stop server
# Close terminal
# Open new terminal
npm run dev
```

**2. Clear Everything**
```bash
rm -rf .next node_modules
npm install
npx prisma generate
npm run dev
```

**3. Cek Prisma Version**
```bash
npx prisma --version
```

Pastikan menggunakan Prisma 6.x atau lebih baru.

**4. Test Direct Connection**

Temporary test dengan DIRECT_URL:
```env
# Backup DATABASE_URL
# DATABASE_URL='...:6543/...'

# Use DIRECT_URL temporarily
DATABASE_URL='postgresql://...:5432/postgres'
```

Jika berhasil dengan DIRECT_URL, masalahnya memang di PgBouncer config.

### Error Lain yang Mungkin Muncul

**"Can't reach database server"**
- Cek internet connection
- Cek Supabase project status
- Cek credentials di .env

**"Too many connections"**
- Restart server
- Tunggu beberapa menit
- Connections akan auto-close

**"Timed out fetching connection"**
- Increase timeout di Prisma client
- Atau gunakan DIRECT_URL

## Best Practices

### Development
```env
# Use pooler with pgbouncer
DATABASE_URL='...pooler.supabase.com:6543/...?pgbouncer=true&connection_limit=1'
```

### Production (Serverless)
```env
# Same as development
DATABASE_URL='...pooler.supabase.com:6543/...?pgbouncer=true&connection_limit=1'
```

### Production (Long-running server)
```env
# Can use direct connection
DATABASE_URL='...supabase.com:5432/...?connection_limit=10'
```

### Migrations
```env
# Always use DIRECT_URL for migrations
DIRECT_URL='...supabase.com:5432/postgres'
```

## Referensi

- [Prisma with Supabase](https://www.prisma.io/docs/guides/database/supabase)
- [PgBouncer Configuration](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [Prisma Connection Management](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)

## Summary

✅ Update DATABASE_URL dengan `pgbouncer=true&connection_limit=1`
✅ Regenerate Prisma Client
✅ Restart server
✅ Test aplikasi

Error "prepared statement does not exist" seharusnya sudah hilang!
