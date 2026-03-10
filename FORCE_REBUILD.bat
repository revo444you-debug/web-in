@echo off
echo ========================================
echo FORCE REBUILD - Clear All Cache
echo ========================================
echo.

echo [1/6] Stopping Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 3 /nobreak >nul

echo [2/6] Deleting .next cache...
if exist .next rmdir /s /q .next
echo Done!

echo [3/6] Deleting TypeScript cache...
if exist tsconfig.tsbuildinfo del /f /q tsconfig.tsbuildinfo
if exist node_modules\.cache rmdir /s /q node_modules\.cache
echo Done!

echo [4/6] Deleting Prisma generated files...
if exist node_modules\.prisma rmdir /s /q node_modules\.prisma
echo Done!

echo [5/6] Regenerating Prisma Client...
call npx prisma generate
if errorlevel 1 (
    echo WARNING: Prisma generate failed, but continuing...
)

echo [6/6] Starting server...
echo.
echo ========================================
echo Starting npm run dev...
echo ========================================
echo.
call npm run dev
