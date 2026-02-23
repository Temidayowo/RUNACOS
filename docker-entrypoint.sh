#!/bin/sh
set -e

echo "==> Running Prisma db push (sync schema to SQLite)..."
node ./node_modules/prisma/build/index.js db push --skip-generate

echo "==> Running database seed (idempotent upserts)..."
node prisma/seed.js

echo "==> Starting Next.js server..."
exec node server.js
