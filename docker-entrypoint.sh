#!/bin/sh
set -e

echo "Waiting for database to be ready..."
# PostgreSQL'in hazır olmasını bekle
until npx prisma migrate deploy --preview-feature; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Database is up - executing migrations"
# Veritabanı şemasını oluştur
npx prisma migrate deploy

echo "Seeding database with dummy data..."
# Dummy verileri yükle
npx prisma db seed

echo "Starting application in development mode..."
# Uygulamayı geliştirme modunda başlat
npm run dev
