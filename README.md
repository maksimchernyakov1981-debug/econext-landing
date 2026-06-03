# EcoNext QR-лендинг

Мобильный лендинг для гостиниц и партнёров EcoNext + админ-панель.

## Запуск локально

```bash
cp .env.example .env   # Windows: copy .env.example .env
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

Откройте:

- http://localhost:3000 — универсальный лендинг
- http://localhost:3000/gift/morskaya — лендинг «Гостиница Морская»
- http://localhost:3000/admin — админка (логин/пароль из `.env`)

## Стек

Next.js 15, TypeScript, Tailwind CSS, Prisma, SQLite, qrcode, iron-session.

## Админка

Все тексты, ссылки (UDS, Telegram, MAX, каналы, WhatsApp, сайт, карты), график, партнёры, схема, статистика — редактируются без изменения кода.

## Документация

- [docs/TZ-EcoNext-Landing.md](docs/TZ-EcoNext-Landing.md) — ТЗ v1.2
