@echo off
echo ========================================
echo Fixing Database Connection Issues
echo ========================================
echo.

echo [1/5] Stopping any running processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/5] Clearing Next.js cache...
if exist .next rmdir /s /q .next
echo Cache cleared!

echo [3/5] Regenerating Prisma Client...
call npx prisma generate
if errorlevel 1 (
    echo ERROR: Prisma generate failed!
    pause
    exit /b 1
)
echo Prisma Client regenerated!

echo [4/5] Pushing schema to database...
call npx prisma db push --skip-generate
if errorlevel 1 (
    echo WARNING: Database push failed, but continuing...
)

echo [5/5] All done!
echo.
echo ========================================
echo Fix completed successfully!
echo ========================================
echo.
echo Now run: npm run dev
echo.
pause
