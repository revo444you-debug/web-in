# Setup Real-time Updates dengan Supabase

## Status: ✅ Implementasi Selesai

Real-time messaging sudah diimplementasikan menggunakan Supabase Realtime. Tidak ada lagi polling API yang boros resource.

## Langkah Setup

### 1. Install Dependencies

```bash
npm install
```

Package `@supabase/supabase-js` sudah ditambahkan ke `package.json`.

### 2. Dapatkan Supabase Anon Key

1. Buka Supabase Dashboard: https://supabase.com/dashboard/project/xlvohdfwyhifaqqpstzo/settings/api
2. Copy **anon/public key** (bukan service_role key!)
3. Paste ke file `.env`:

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Enable Realtime di Supabase

1. Buka: https://supabase.com/dashboard/project/xlvohdfwyhifaqqpstzo/database/replication
2. Enable Realtime untuk tabel:
   - ✅ `messages`
   - ✅ `contacts`

### 4. Jalankan Development Server

```bash
npm run dev
```

## Cara Kerja

### Sebelum (Polling - BOROS):
- Contacts di-refresh setiap 5 detik
- Messages di-refresh setiap 3 detik
- Banyak request API yang tidak perlu

### Sekarang (Real-time - EFISIEN):
- ✅ Contacts update otomatis saat ada perubahan
- ✅ Messages muncul instant saat diterima
- ✅ Label changes sync real-time
- ✅ Seperti WhatsApp asli!

## File yang Diubah

1. **package.json** - Tambah `@supabase/supabase-js`
2. **lib/supabase.ts** - Supabase client config
3. **hooks/useRealtimeContacts.ts** - Real-time contacts hook
4. **hooks/useRealtimeMessages.ts** - Real-time messages hook
5. **app/dashboard/messages/page.tsx** - Ganti polling dengan hooks
6. **.env** - Tambah `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Testing

1. Buka 2 browser tabs dengan Messages page
2. Kirim pesan dari tab 1
3. Tab 2 akan update otomatis tanpa refresh!

## Troubleshooting

### Messages tidak update real-time?

1. Cek console browser untuk error
2. Pastikan `NEXT_PUBLIC_SUPABASE_ANON_KEY` sudah diisi
3. Pastikan Realtime enabled di Supabase dashboard
4. Restart dev server setelah update `.env`

### Connection error?

Cek di browser console:
```
✅ Good: "Realtime connection established"
❌ Bad: "Failed to connect to Realtime"
```

Jika error, cek:
- Anon key benar?
- Project ref benar di `lib/supabase.ts`?
- Internet connection OK?

## Next Steps

Setelah real-time works:
- [ ] Update Board page untuk real-time drag & drop
- [ ] Add typing indicators
- [ ] Add online/offline status
- [ ] Add message delivery status (sent/delivered/read)
