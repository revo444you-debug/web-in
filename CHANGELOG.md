# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-03-05

### Added
- AI Assistant dengan Groq API (Llama 3.3 70B)
- Floating chat button di dashboard
- Real-time chat interface dengan AI
- API route untuk chat completions
- Dokumentasi AI Assistant (docs/AI_ASSISTANT_GUIDE.md)
- Environment variable untuk GROQ_API_KEY
- Download/Export fitur untuk data backup
- Export profile (JSON, TXT) untuk semua user
- Export users (JSON, CSV) untuk admin
- System report dengan statistik lengkap untuk admin
- DownloadButton component yang reusable
- Statistik dashboard untuk admin
- Dokumentasi Download & Export (docs/DOWNLOAD_EXPORT_GUIDE.md)
- Progressive Web App (PWA) support
- Service Worker untuk offline caching
- Install prompt component
- Web App Manifest
- PWA icons dan offline page
- Dokumentasi PWA (docs/PWA_INSTALLATION_GUIDE.md)

### Features
- Interactive chat window dengan auto-scroll
- Loading states dan error handling
- Responsive chat UI dengan shadcn/ui
- Session-based chat history
- Support untuk berbagai model Groq
- One-click download untuk berbagai format
- CSV export untuk spreadsheet analysis
- JSON export untuk backup dan import
- TXT export untuk human-readable format
- System statistics dan distribusi data
- Authorization check untuk admin-only features
- Install aplikasi di laptop/desktop/mobile
- Offline mode dengan service worker caching
- Fast loading dengan PWA optimization
- Full screen app experience
- Auto-update service worker

### Fixed
- Database prepared statement error dengan PgBouncer
- Connection pooling configuration
- Download error handling yang lebih baik
- Charset UTF-8 di export responses

## [1.0.0] - 2024-02-23

### Added
- Initial release
- Authentication system (Login & Register)
- Role-based access control (ADMIN & USER)
- Protected dashboard routes
- Session management with JWT
- Supabase PostgreSQL integration
- Prisma ORM setup
- Tailwind CSS styling
- shadcn/ui components
- Middleware for route protection
- Comprehensive documentation (README, SETUP)

### Features
- Email/password authentication
- Secure password hashing with bcryptjs
- Session-based authentication with jose
- Auto-redirect to login for protected routes
- User role management
- Clean and minimal UI
- Responsive design
- TypeScript support

### Documentation
- README.md - Overview and quick start
- SETUP.md - Detailed setup guide
- CONTRIBUTING.md - Contribution guidelines
- LICENSE - MIT License
