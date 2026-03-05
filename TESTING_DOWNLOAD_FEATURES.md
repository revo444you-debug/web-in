# Testing Download Features

## Manual Testing Checklist

### Setup
- [ ] Server running (`npm run dev`)
- [ ] Database connected
- [ ] At least 1 user exists
- [ ] At least 1 admin exists

### Test 1: User Profile Download (JSON)

**Prerequisites:**
- Login sebagai user biasa

**Steps:**
1. Navigate to `/dashboard/profile`
2. Locate "Download JSON" button
3. Click button
4. Verify file downloads

**Expected Result:**
- File name: `my-profile-YYYY-MM-DD.json`
- File contains: email, role, profile data
- No errors in console

**Verification:**
```bash
# Open downloaded file
cat my-profile-*.json | jq .
```

### Test 2: User Profile Download (TXT)

**Prerequisites:**
- Login sebagai user biasa

**Steps:**
1. Navigate to `/dashboard/profile`
2. Locate "Download TXT" button
3. Click button
4. Verify file downloads

**Expected Result:**
- File name: `my-profile-YYYY-MM-DD.txt`
- Human-readable format
- Contains all profile fields

**Verification:**
```bash
# View file
cat my-profile-*.txt
```

### Test 3: Admin Export Users (JSON)

**Prerequisites:**
- Login sebagai ADMIN

**Steps:**
1. Navigate to `/dashboard/users`
2. Locate "Export JSON" button
3. Click button
4. Verify file downloads

**Expected Result:**
- File name: `users-export-YYYY-MM-DD.json`
- Array of all users
- Includes profile data

**Verification:**
```bash
# Check file structure
cat users-export-*.json | jq 'length'
cat users-export-*.json | jq '.[0]'
```

### Test 4: Admin Export Users (CSV)

**Prerequisites:**
- Login sebagai ADMIN

**Steps:**
1. Navigate to `/dashboard/users`
2. Locate "Export CSV" button
3. Click button
4. Verify file downloads

**Expected Result:**
- File name: `users-export-YYYY-MM-DD.csv`
- CSV format with headers
- Can be opened in Excel

**Verification:**
```bash
# View CSV
head users-export-*.csv

# Count rows
wc -l users-export-*.csv
```

### Test 5: Admin System Report

**Prerequisites:**
- Login sebagai ADMIN

**Steps:**
1. Navigate to `/dashboard` (home page)
2. Scroll to "System Report" section
3. Locate "Download System Report" button
4. Click button
5. Verify file downloads

**Expected Result:**
- File name: `system-report-YYYY-MM-DD.json`
- Contains statistics object
- Contains distributions object

**Verification:**
```bash
# View report structure
cat system-report-*.json | jq '.statistics'
cat system-report-*.json | jq '.distributions'
```

### Test 6: Authorization Check

**Test 6.1: Non-admin tries to access admin endpoints**

**Steps:**
1. Login sebagai USER (not admin)
2. Try to access `/api/export/users?format=json`
3. Try to access `/api/export/report`

**Expected Result:**
- 401 Unauthorized error
- Error message: "Unauthorized"

**Verification:**
```bash
# Should return 401
curl -X GET "http://localhost:3000/api/export/users?format=json" \
  -H "Cookie: session=USER_SESSION"
```

**Test 6.2: Unauthenticated access**

**Steps:**
1. Logout or use incognito
2. Try to access any export endpoint

**Expected Result:**
- Redirect to login or 401 error

### Test 7: Different Formats

**Test all format variations:**

- [ ] `/api/export/profile?format=json`
- [ ] `/api/export/profile?format=txt`
- [ ] `/api/export/users?format=json`
- [ ] `/api/export/users?format=csv`
- [ ] `/api/export/report` (JSON only)

### Test 8: Edge Cases

**Test 8.1: Empty Profile**
- User with no profile data
- Should still download with empty/null values

**Test 8.2: No Users**
- Fresh database
- Should return empty array/file

**Test 8.3: Large Dataset**
- 100+ users
- Should handle without timeout

### Test 9: UI/UX

**Check UI elements:**
- [ ] Buttons visible and styled correctly
- [ ] Loading state shows during download
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Icons display correctly

### Test 10: Browser Compatibility

Test in different browsers:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## Automated Testing (Optional)

### Using Playwright

```typescript
// tests/download.spec.ts
import { test, expect } from '@playwright/test';

test('user can download profile JSON', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('input[name="email"]', 'user@example.com');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');

  // Navigate to profile
  await page.goto('/dashboard/profile');

  // Start download
  const downloadPromise = page.waitForEvent('download');
  await page.click('text=Download JSON');
  const download = await downloadPromise;

  // Verify filename
  expect(download.suggestedFilename()).toMatch(/my-profile-\d{4}-\d{2}-\d{2}\.json/);
});

test('admin can export users CSV', async ({ page }) => {
  // Login as admin
  await page.goto('/login');
  await page.fill('input[name="email"]', 'admin@example.com');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');

  // Navigate to users
  await page.goto('/dashboard/users');

  // Start download
  const downloadPromise = page.waitForEvent('download');
  await page.click('text=Export CSV');
  const download = await downloadPromise;

  // Verify filename
  expect(download.suggestedFilename()).toMatch(/users-export-\d{4}-\d{2}-\d{2}\.csv/);
});
```

## Performance Testing

### Load Test

```bash
# Test concurrent downloads
for i in {1..10}; do
  curl -X GET "http://localhost:3000/api/export/profile?format=json" \
    -H "Cookie: session=$SESSION" &
done
wait
```

### Large Dataset Test

```bash
# Create 1000 test users
node scripts/create-test-users.js 1000

# Try to export
curl -X GET "http://localhost:3000/api/export/users?format=csv" \
  -H "Cookie: session=$ADMIN_SESSION" \
  -o large-export.csv

# Check file size
ls -lh large-export.csv
```

## Troubleshooting Tests

### Download doesn't start
- Check browser console for errors
- Verify API endpoint returns 200
- Check Content-Disposition header

### File is empty
- Verify database has data
- Check API response in Network tab
- Look for server errors in logs

### Authorization fails
- Verify session cookie is set
- Check user role in database
- Verify middleware is working

## Test Results Template

```
Date: YYYY-MM-DD
Tester: [Name]
Environment: [Development/Production]

| Test | Status | Notes |
|------|--------|-------|
| User Profile JSON | ✅ | |
| User Profile TXT | ✅ | |
| Admin Users JSON | ✅ | |
| Admin Users CSV | ✅ | |
| Admin System Report | ✅ | |
| Authorization Check | ✅ | |
| Edge Cases | ✅ | |
| UI/UX | ✅ | |
| Browser Compatibility | ✅ | |

Issues Found: [None/List issues]
```

## Success Criteria

All tests should pass with:
- ✅ Files download successfully
- ✅ Correct file format
- ✅ Correct data content
- ✅ Proper authorization
- ✅ No console errors
- ✅ Good performance (<2s for normal datasets)
