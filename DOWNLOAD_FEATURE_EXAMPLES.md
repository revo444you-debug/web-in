# Download Feature - Examples

## 1. User Profile Download

### Scenario: User ingin backup data profil mereka

**Steps:**
1. Login sebagai user biasa
2. Navigate ke `/dashboard/profile`
3. Klik "Download JSON"

**Result:**
File: `my-profile-2026-03-05.json`
```json
{
  "email": "user@example.com",
  "role": "USER",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "profile": {
    "nama": "John Doe",
    "nim": "123456789",
    "prodi": "Informatika",
    "angkatan": "2023",
    "nomorTelepon": "081234567890",
    "fotoProfil": "https://..."
  }
}
```

### Alternative: TXT Format
Klik "Download TXT" untuk format yang mudah dibaca:

File: `my-profile-2026-03-05.txt`
```
PROFIL PENGGUNA
================

Email: user@example.com
Role: USER
Tanggal Daftar: 15/01/2024 10:30:00

INFORMASI PROFIL
================

Nama: John Doe
NIM: 123456789
Prodi: Informatika
Angkatan: 2023
Nomor Telepon: 081234567890
Foto Profil: https://...

Exported at: 05/03/2026 14:30:00
```

## 2. Admin Export All Users

### Scenario: Admin ingin backup semua data user

**Steps:**
1. Login sebagai ADMIN
2. Navigate ke `/dashboard/users`
3. Klik "Export CSV"

**Result:**
File: `users-export-2026-03-05.csv`
```csv
ID,Email,Role,Created At,Nama,NIM,Prodi,Angkatan,Nomor Telepon
1,admin@example.com,ADMIN,2024-01-01T00:00:00.000Z,Admin User,100000,Informatika,2020,081111111111
2,user1@example.com,USER,2024-01-15T10:30:00.000Z,John Doe,123456789,Informatika,2023,081234567890
3,user2@example.com,USER,2024-02-01T08:00:00.000Z,Jane Smith,987654321,Sistem Informasi,2023,081987654321
```

**Use Case:**
- Import ke Excel untuk analisis
- Backup sebelum maintenance
- Generate mailing list
- Create reports

## 3. System Report Download

### Scenario: Admin ingin laporan statistik bulanan

**Steps:**
1. Login sebagai ADMIN
2. Navigate ke `/dashboard` (home)
3. Scroll ke "System Report"
4. Klik "Download System Report"

**Result:**
File: `system-report-2026-03-05.json`
```json
{
  "generatedAt": "2026-03-05T14:30:00.000Z",
  "generatedBy": "admin@example.com",
  "statistics": {
    "users": {
      "total": 150,
      "admins": 3,
      "regularUsers": 147
    },
    "profiles": {
      "total": 142,
      "withPhoto": 98,
      "withoutPhoto": 44,
      "completionRate": "94.67%"
    }
  },
  "distributions": {
    "byProdi": [
      { "prodi": "Informatika", "count": 75 },
      { "prodi": "Sistem Informasi", "count": 45 },
      { "prodi": "Teknik Komputer", "count": 22 }
    ],
    "byAngkatan": [
      { "angkatan": "2023", "count": 50 },
      { "angkatan": "2022", "count": 48 },
      { "angkatan": "2021", "count": 35 },
      { "angkatan": "2020", "count": 9 }
    ]
  }
}
```

**Use Case:**
- Monthly reporting
- Trend analysis
- Capacity planning
- Stakeholder presentations

## 4. Programmatic Access

### Using JavaScript Fetch

```javascript
// Download user profile
async function downloadMyProfile(format = 'json') {
  const response = await fetch(`/api/export/profile?format=${format}`);
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `my-profile.${format}`;
  a.click();
}

// Admin: Download all users
async function downloadAllUsers(format = 'csv') {
  const response = await fetch(`/api/export/users?format=${format}`);
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `users-export.${format}`;
  a.click();
}

// Admin: Download system report
async function downloadSystemReport() {
  const response = await fetch('/api/export/report');
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'system-report.json';
  a.click();
}
```

### Using curl

```bash
# Download profile (requires auth cookie)
curl -X GET "http://localhost:3000/api/export/profile?format=json" \
  -H "Cookie: session=..." \
  -o my-profile.json

# Admin: Download users CSV
curl -X GET "http://localhost:3000/api/export/users?format=csv" \
  -H "Cookie: session=..." \
  -o users-export.csv

# Admin: Download system report
curl -X GET "http://localhost:3000/api/export/report" \
  -H "Cookie: session=..." \
  -o system-report.json
```

## 5. Integration Examples

### Excel Analysis
1. Download CSV dari User Management
2. Open di Excel/Google Sheets
3. Create pivot tables
4. Generate charts

### Backup Automation
```bash
#!/bin/bash
# backup-script.sh

DATE=$(date +%Y-%m-%d)
BACKUP_DIR="./backups/$DATE"

mkdir -p $BACKUP_DIR

# Download users backup
curl -X GET "http://localhost:3000/api/export/users?format=json" \
  -H "Cookie: session=$ADMIN_SESSION" \
  -o "$BACKUP_DIR/users.json"

# Download system report
curl -X GET "http://localhost:3000/api/export/report" \
  -H "Cookie: session=$ADMIN_SESSION" \
  -o "$BACKUP_DIR/report.json"

echo "Backup completed: $BACKUP_DIR"
```

### Data Migration
```javascript
// Export from old system
const oldData = await fetch('/api/export/users?format=json');
const users = await oldData.json();

// Transform and import to new system
const transformed = users.map(transformUser);
await importToNewSystem(transformed);
```

## Tips & Best Practices

1. **Regular Backups**: Download users export weekly
2. **Before Updates**: Always backup before system updates
3. **Audit Trail**: Keep system reports monthly
4. **Data Analysis**: Use CSV for spreadsheet analysis
5. **Automation**: Script regular downloads for backup

## Security Notes

- All endpoints require authentication
- Admin endpoints check role authorization
- No passwords in exports
- Photo URLs only (not binary data)
- Session-based access control
