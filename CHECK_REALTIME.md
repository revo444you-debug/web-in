# Checklist Realtime Supabase

## 1. Enable Realtime di Supabase Dashboard

### Langkah-langkah:

1. **Buka Database Replication Settings:**
   ```
   https://supabase.com/dashboard/project/xlvohdfwyhifaqqpstzo/database/replication
   ```

2. **Enable Realtime untuk tabel:**
   - Cari tabel `messages` → Klik toggle untuk enable
   - Cari tabel `contacts` → Klik toggle untuk enable

3. **Pastikan status "Realtime enabled" muncul**

## 2. Cek di Browser Console

Buka browser console (F12) dan lihat apakah ada error:

### Yang HARUS muncul:
```
✅ Supabase Realtime connected
✅ Subscribed to channel: messages:xxx
✅ Subscribed to channel: contacts-updates
```

### Jika ada error seperti ini:
```
❌ Error: Realtime is disabled for this project
❌ Error: Table not found
❌ Error: Insufficient privileges
```

## 3. Test Realtime Connection

Buka 2 browser tabs:
- Tab 1: Messages page
- Tab 2: Messages page

Kirim pesan dari Tab 1, lihat apakah Tab 2 update otomatis.

## 4. Cek Row Level Security (RLS)

Jika Realtime enabled tapi tidak ada update, kemungkinan RLS block:

### Solusi Sementara (Development Only):
1. Buka: https://supabase.com/dashboard/project/xlvohdfwyhifaqqpstzo/auth/policies
2. Untuk tabel `messages` dan `contacts`:
   - Disable RLS sementara untuk testing
   - ATAU buat policy yang allow SELECT untuk anon role

### SQL untuk disable RLS (jalankan di SQL Editor):
```sql
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
```

## 5. Cek Network Tab

Di browser DevTools → Network tab:
- Cari connection ke `wss://` (WebSocket)
- Pastikan status: `101 Switching Protocols`
- Jika status 403/401 → masalah auth/RLS

## Troubleshooting Umum

### Error: "Realtime is disabled"
→ Enable di Database Replication settings

### Error: "Insufficient privileges"
→ Disable RLS atau buat policy yang benar

### Tidak ada error tapi tidak update
→ Cek apakah channel name benar di console log

### Connection timeout
→ Cek firewall/antivirus yang block WebSocket
