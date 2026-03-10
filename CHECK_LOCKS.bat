@echo off
echo ========================================
echo Checking for processes locking Prisma files
echo ========================================
echo.

echo Checking Node.js processes...
tasklist | findstr node.exe
echo.

echo Checking file handles...
handle.exe "query_engine-windows.dll.node" 2>nul
echo.

echo ========================================
echo Killing all Node.js processes...
echo ========================================
taskkill /F /IM node.exe 2>nul
echo.

echo Waiting 5 seconds...
timeout /t 5 /nobreak >nul

echo ========================================
echo Done! Now try: npm run dev
echo ========================================
pause
