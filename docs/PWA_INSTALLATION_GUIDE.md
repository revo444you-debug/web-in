# PWA Installation Guide

## Overview
Web ini sekarang adalah Progressive Web App (PWA) yang bisa diinstall di laptop, desktop, dan mobile device seperti aplikasi native.

## Fitur PWA

### ✨ Keunggulan
- 📱 Install seperti aplikasi native
- 🚀 Akses cepat dari desktop/home screen
- 📡 Bisa digunakan offline (limited)
- 🔔 Push notifications (optional)
- 💾 Cache untuk performa lebih baik
- 🎨 Full screen experience
- ⚡ Fast loading dengan service worker

### 🎯 Yang Bisa Dilakukan Offline
- Lihat halaman yang sudah pernah dibuka
- Akses UI yang sudah di-cache
- Melihat data yang tersimpan di cache

### ⚠️ Yang Butuh Internet
- Login/Logout
- Fetch data baru dari database
- Upload foto
- Chat dengan AI Assistant
- Download/Export data

## Cara Install

### 💻 Di Laptop/Desktop (Windows/Mac/Linux)

#### Google Chrome / Edge
1. Buka website di browser
2. Lihat icon install (➕) di address bar (kanan atas)
3. Klik icon install atau klik menu (⋮) → "Install Dashboard Template"
4. Klik "Install" di popup
5. Aplikasi akan terbuka di window terpisah
6. Shortcut otomatis dibuat di desktop/start menu

**Atau:**
1. Klik menu (⋮) di kanan atas
2. Pilih "Install Dashboard Template..."
3. Klik "Install"

#### Firefox
1. Buka website di browser
2. Klik icon (⋮) di address bar
3. Pilih "Install"
4. Aplikasi akan terbuka di window terpisah

#### Safari (Mac)
1. Buka website di Safari
2. Klik menu "File" → "Add to Dock"
3. Aplikasi akan muncul di Dock

### 📱 Di Mobile (Android/iOS)

#### Android (Chrome)
1. Buka website di Chrome
2. Tap menu (⋮) di kanan atas
3. Tap "Install app" atau "Add to Home screen"
4. Tap "Install"
5. Icon akan muncul di home screen

**Atau:**
- Banner install akan muncul otomatis
- Tap "Install" di banner

#### iOS (Safari)
1. Buka website di Safari
2. Tap tombol Share (⬆️) di bawah
3. Scroll dan tap "Add to Home Screen"
4. Edit nama jika perlu
5. Tap "Add"
6. Icon akan muncul di home screen

## Uninstall

### Windows
1. Buka aplikasi
2. Klik menu (⋮) di kanan atas
3. Pilih "Uninstall Dashboard Template"

**Atau:**
- Settings → Apps → Dashboard Template → Uninstall

### Mac
1. Buka Finder → Applications
2. Drag aplikasi ke Trash
3. Empty Trash

### Android
1. Long press icon di home screen
2. Tap "Uninstall" atau drag ke "Uninstall"

### iOS
1. Long press icon di home screen
2. Tap "Remove App"
3. Tap "Delete App"

## Verifikasi Install

### Cek Apakah Sudah Terinstall

**Di Browser:**
- Buka DevTools (F12)
- Tab "Application"
- Lihat "Service Workers" - harus ada registered
- Lihat "Manifest" - harus ada data

**Di Aplikasi:**
- Window title bar berbeda (tanpa browser UI)
- Full screen experience
- Icon di taskbar/dock

## Troubleshooting

### Install Button Tidak Muncul

**Penyebab:**
- Browser tidak support PWA
- Website tidak HTTPS (localhost OK)
- Sudah terinstall
- Manifest.json error

**Solusi:**
1. Gunakan Chrome/Edge/Firefox terbaru
2. Clear browser cache
3. Reload halaman (Ctrl+F5)
4. Cek console untuk error

### Service Worker Tidak Register

**Cek di DevTools:**
```
Application → Service Workers
```

**Jika error:**
1. Clear site data
2. Unregister service worker
3. Reload halaman
4. Check console untuk error detail

### Offline Mode Tidak Bekerja

**Cek:**
1. Service worker registered?
2. Cache populated?
3. Network tab - lihat request dari cache

**Fix:**
1. Reload halaman saat online
2. Navigate ke beberapa halaman
3. Test offline mode

### Icon Tidak Muncul

**Solusi:**
1. Generate icon dengan `scripts/generate-icons.html`
2. Save sebagai `icon-192.png` dan `icon-512.png`
3. Letakkan di folder `public/`
4. Clear cache dan reinstall

## Customization

### Mengubah Nama Aplikasi

Edit `public/manifest.json`:
```json
{
  "name": "Nama Aplikasi Anda",
  "short_name": "Nama Pendek"
}
```

### Mengubah Warna Tema

Edit `public/manifest.json`:
```json
{
  "theme_color": "#3b82f6",
  "background_color": "#ffffff"
}
```

### Mengubah Icon

1. Buat icon 192x192 dan 512x512 PNG
2. Simpan sebagai `icon-192.png` dan `icon-512.png`
3. Letakkan di folder `public/`
4. Update `manifest.json` jika perlu

### Menambah Shortcuts

Edit `public/manifest.json`:
```json
{
  "shortcuts": [
    {
      "name": "Dashboard",
      "url": "/dashboard",
      "icons": [{ "src": "/icon-192.png", "sizes": "192x192" }]
    }
  ]
}
```

## Best Practices

### Development
1. Test di berbagai browser
2. Test install/uninstall flow
3. Test offline functionality
4. Check service worker updates

### Production
1. Use HTTPS (required for PWA)
2. Optimize icons (compress PNG)
3. Test on real devices
4. Monitor service worker errors
5. Update cache version when deploying

### Cache Strategy
- Static assets: Cache first
- API calls: Network first
- Images: Cache first with fallback

## Advanced Features

### Push Notifications

Sudah ada handler di `sw.js`, tinggal implement:

```javascript
// Request permission
Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    // Subscribe to push
  }
});
```

### Background Sync

Sudah ada handler di `sw.js`:

```javascript
// Register sync
navigator.serviceWorker.ready.then(registration => {
  registration.sync.register('sync-data');
});
```

### Offline Data

Implement dengan IndexedDB atau localStorage:

```javascript
// Save data offline
localStorage.setItem('offline-data', JSON.stringify(data));

// Sync when online
window.addEventListener('online', () => {
  syncOfflineData();
});
```

## Testing

### Test Install Flow
1. Open in incognito/private mode
2. Wait for install prompt
3. Click install
4. Verify app opens

### Test Offline
1. Open DevTools
2. Network tab → Offline
3. Navigate pages
4. Check cached content

### Test Updates
1. Change cache version in sw.js
2. Deploy
3. Reload app
4. Verify new version loads

## Resources

- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Workbox](https://developers.google.com/web/tools/workbox) - Advanced PWA toolkit

## Support

### Browser Support
- ✅ Chrome 67+
- ✅ Edge 79+
- ✅ Firefox 44+
- ✅ Safari 11.1+
- ✅ Opera 54+

### Platform Support
- ✅ Windows 10+
- ✅ macOS 10.13+
- ✅ Linux (most distros)
- ✅ Android 5.0+
- ✅ iOS 11.3+

## FAQ

**Q: Apakah PWA sama dengan native app?**
A: Tidak sama, tapi pengalaman mirip. PWA lebih ringan dan tidak perlu app store.

**Q: Apakah bisa digunakan 100% offline?**
A: Tidak. Fitur yang butuh database/API tetap butuh internet.

**Q: Apakah aman?**
A: Ya, PWA menggunakan HTTPS dan same-origin policy.

**Q: Berapa storage yang digunakan?**
A: Tergantung cache, biasanya < 50MB.

**Q: Apakah auto-update?**
A: Ya, service worker akan update otomatis saat ada versi baru.
