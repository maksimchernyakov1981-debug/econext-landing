#!/bin/sh
# Fallback for Vercel build when DATABASE_URL is not set yet (generate only)
if [ -z "$DATABASE_URL" ]; then
  export DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build?schema=public"
fi
npx prisma generate
