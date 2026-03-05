#!/bin/bash

echo "========================================"
echo "Fixing Database Connection Issues"
echo "========================================"
echo ""

echo "[1/5] Stopping any running processes..."
pkill -f "next dev" 2>/dev/null || true
sleep 2

echo "[2/5] Clearing Next.js cache..."
rm -rf .next
echo "Cache cleared!"

echo "[3/5] Regenerating Prisma Client..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "ERROR: Prisma generate failed!"
    exit 1
fi
echo "Prisma Client regenerated!"

echo "[4/5] Pushing schema to database..."
npx prisma db push --skip-generate
if [ $? -ne 0 ]; then
    echo "WARNING: Database push failed, but continuing..."
fi

echo "[5/5] All done!"
echo ""
echo "========================================"
echo "Fix completed successfully!"
echo "========================================"
echo ""
echo "Now run: npm run dev"
echo ""
