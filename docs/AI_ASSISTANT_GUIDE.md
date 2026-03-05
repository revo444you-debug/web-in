# AI Assistant Guide

## Overview
Web ini dilengkapi dengan AI Assistant yang menggunakan Groq API dengan model Llama 3.3 70B untuk memberikan bantuan interaktif kepada pengguna.

## Fitur

### 1. Chat Interface
- Floating button di pojok kanan bawah dashboard
- Window chat yang dapat dibuka/tutup
- Riwayat percakapan tersimpan selama sesi
- Loading indicator saat AI sedang memproses

### 2. Teknologi
- **API**: Groq API (https://api.groq.com)
- **Model**: llama-3.3-70b-versatile
- **Framework**: Next.js 15 dengan App Router
- **UI**: Shadcn/ui components

## Setup

### 1. Environment Variables
Tambahkan API key Groq ke file `.env`:

```env
GROQ_API_KEY="your-groq-api-key-here"
```

### 2. API Route
File: `app/api/chat/route.ts`
- Endpoint: POST `/api/chat`
- Menerima array messages
- Mengembalikan response dari Groq API

### 3. Komponen UI
File: `components/ui/chat-assistant.tsx`
- Client component dengan state management
- Auto-scroll ke pesan terbaru
- Error handling

### 4. Integrasi
AI Assistant sudah terintegrasi di dashboard layout dan akan muncul di semua halaman dashboard.

## Penggunaan

1. Login ke dashboard
2. Klik tombol chat di pojok kanan bawah
3. Ketik pertanyaan atau pesan
4. Tekan Enter atau klik tombol Send
5. AI akan merespons dalam beberapa detik

## Kustomisasi

### Mengubah Model
Edit file `app/api/chat/route.ts`:

```typescript
model: 'llama-3.3-70b-versatile', // Ganti dengan model lain
```

Model yang tersedia:
- llama-3.3-70b-versatile
- llama-3.1-70b-versatile
- mixtral-8x7b-32768
- gemma2-9b-it

### Mengubah Parameter
```typescript
temperature: 0.7,  // Kreativitas (0-1)
max_tokens: 1024,  // Panjang maksimal response
```

### Mengubah Pesan Awal
Edit file `components/ui/chat-assistant.tsx`:

```typescript
const [messages, setMessages] = useState<Message[]>([
  {
    role: 'assistant',
    content: 'Pesan sambutan Anda di sini',
  },
]);
```

## Troubleshooting

### Error: Failed to get AI response
- Cek API key di `.env`
- Pastikan API key valid
- Cek koneksi internet

### Chat tidak muncul
- Pastikan sudah login ke dashboard
- Cek console browser untuk error
- Refresh halaman

### Response lambat
- Normal untuk model besar
- Pertimbangkan model yang lebih kecil untuk response lebih cepat

## Security Notes

- API key disimpan di server-side (`.env`)
- Tidak pernah terekspos ke client
- Request melalui API route Next.js
- Rate limiting dapat ditambahkan jika diperlukan

## Future Enhancements

Fitur yang bisa ditambahkan:
- [ ] Riwayat chat tersimpan di database
- [ ] Context awareness (akses data user)
- [ ] Streaming responses
- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Custom system prompts per role
- [ ] File upload untuk analisis
