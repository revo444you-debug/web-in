# AI Assistant - Quick Start

## Setup dalam 3 Langkah

### 1. Dapatkan API Key
```
1. Buka https://console.groq.com
2. Sign up / Login
3. Klik "API Keys" → "Create API Key"
4. Copy API key
```

### 2. Tambahkan ke .env
```env
GROQ_API_KEY="gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### 3. Restart Server
```bash
npm run dev
```

## Cara Menggunakan

1. Login ke dashboard
2. Klik ikon chat (💬) di pojok kanan bawah
3. Ketik pesan Anda
4. Tekan Enter atau klik Send
5. AI akan merespons dalam beberapa detik

## Tips

- Chat history tersimpan selama sesi
- Refresh halaman akan reset chat
- Klik X untuk menutup chat window
- Klik tombol chat lagi untuk membuka kembali

## Model yang Digunakan

Default: **Llama 3.3 70B Versatile**
- Cepat dan akurat
- Mendukung berbagai bahasa termasuk Indonesia
- Context window besar

## Troubleshooting Cepat

**Chat tidak muncul?**
- Pastikan sudah login
- Refresh halaman

**Error saat kirim pesan?**
- Cek API key di .env
- Pastikan API key valid
- Cek koneksi internet

**Response lambat?**
- Normal untuk model besar
- Tunggu beberapa detik

## Dokumentasi Lengkap

Lihat [AI_ASSISTANT_GUIDE.md](./AI_ASSISTANT_GUIDE.md) untuk:
- Kustomisasi model
- Mengubah parameter
- Security notes
- Advanced features
