# Alternative Realtime Setup - Polling dengan Optimasi

Karena Supabase Realtime `postgres_changes` butuh setup kompleks dan kadang tidak stabil, kita bisa pakai approach hybrid:

## Option 1: Smart Polling (Recommended untuk Development)

Polling tapi lebih pintar:
- Polling interval lebih lama (10-15 detik) untuk contacts
- Polling interval sedang (5 detik) untuk messages di chat aktif
- Stop polling saat tab tidak aktif (Page Visibility API)
- Optimistic updates untuk messages yang dikirim

## Option 2: Broadcast Channel (Realtime tanpa Database)

Pakai Supabase Broadcast untuk notify antar tabs:
- Tab 1 kirim message → broadcast event
- Tab 2 terima broadcast → fetch new messages
- Tidak butuh postgres_changes setup

## Option 3: Webhook + Server-Sent Events (SSE)

Setup webhook dari n8n yang trigger SSE endpoint:
- n8n webhook terima message baru
- n8n hit endpoint `/api/sse/notify`
- SSE push update ke semua connected clients

## Option 4: Supabase Realtime dengan Database Triggers

Ini yang paling proper tapi butuh setup:

### Step 1: Enable Realtime di Dashboard
1. Buka: https://supabase.com/dashboard/project/xlvohdfwyhifaqqpstzo/realtime/inspector
2. Klik "Write a policy" atau "Set up realtime for me"

### Step 2: Jalankan SQL untuk Realtime
```sql
-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE contacts;

-- Set replica identity
ALTER TABLE messages REPLICA IDENTITY FULL;
ALTER TABLE contacts REPLICA IDENTITY FULL;

-- Disable RLS (development only!)
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
```

### Step 3: Test Connection
Buka: http://localhost:3000/test-realtime

## Recommendation

Untuk sekarang, pakai **Smart Polling** (Option 1) karena:
- ✅ Paling reliable
- ✅ Tidak butuh setup kompleks
- ✅ Works di semua environment
- ✅ Mudah di-debug

Nanti kalau production, baru setup Realtime yang proper atau pakai Webhook + SSE.

## Test Broadcast

Untuk test apakah Supabase Realtime connection works:
```
http://localhost:3000/test-broadcast
```

Jika broadcast works, berarti connection OK, tinggal setup postgres_changes.
Jika broadcast juga error, berarti ada masalah dengan Supabase project settings.
