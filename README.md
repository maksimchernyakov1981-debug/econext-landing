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

## Git и деплой

Локальный репозиторий уже инициализирован (ветка `main`, первый коммит).

### Загрузить на GitHub (2 минуты)

1. Откройте [github.com/new](https://github.com/new) → имя репозитория, например `econext-landing` → **Create repository** (без README).
2. В папке проекта выполните (подставьте свой логин):

```bash
git remote add origin https://github.com/ВАШ_ЛОГИН/econext-landing.git
git push -u origin main
```

Windows откроет окно входа в GitHub (Credential Manager).

### Деплой с GitHub

**Render** (подходит SQLite + загрузки): подключите репозиторий на [render.com](https://render.com) — в корне есть `render.yaml`.

**Vercel** — нужна облачная БД (Neon/Turso), SQLite не подходит.

После деплоя задайте в настройках сервиса:

- `BASE_URL` — ваш домен
- `ADMIN_PASSWORD`, `SESSION_SECRET`, `IP_HASH_SALT` — надёжные значения

