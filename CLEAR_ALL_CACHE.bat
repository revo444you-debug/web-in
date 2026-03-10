@echo off
echo ========================================
echo CLEAR ALL CACHE - TypeScript + Next.js
echo ========================================
echo.

echo [1/5] Stopping Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/5] Deleting .next cache...
if exist .next rmdir /s /q .next
echo Done!

echo [3/5] Deleting TypeScript cache...
if exist tsconfig.tsbuildinfo del /f /q tsconfig.tsbuildinfo
if exist .tsbuildinfo del /f /q .tsbuildinfo
echo Done!

echo [4/5] Deleting node_modules cache...
if exist node_modules\.cache rmdir /s /q node_modules\.cache
echo Done!

echo [5/5] Starting server...
echo.
echo ========================================
call npm run dev
