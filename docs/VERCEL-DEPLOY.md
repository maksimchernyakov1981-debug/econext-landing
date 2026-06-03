# Деплой на Vercel

## Почему падала сборка

1. `prisma` был в devDependencies — на Vercel CLI иногда недоступен в `postinstall`.
2. **SQLite не работает на Vercel** (нет постоянного диска) — нужна PostgreSQL (Neon).

## Шаг 1. База Neon (бесплатно)

1. [neon.tech](https://neon.tech) → Sign up → Create project.
2. Скопируйте **Connection string** (PostgreSQL), например:
   ```
   postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

## Шаг 2. Переменные на Vercel

Project → **Settings** → **Environment Variables**:

| Key | Value |
|-----|--------|
| `DATABASE_URL` | строка подключения Neon |
| `BASE_URL` | `https://ваш-проект.vercel.app` |
| `ADMIN_LOGIN` | `admin` |
| `ADMIN_PASSWORD` | надёжный пароль |
| `SESSION_SECRET` | 32+ случайных символов |
| `IP_HASH_SALT` | случайная строка |
| `APP_TIMEZONE` | `Europe/Moscow` |

## Шаг 3. Redeploy

**Deployments** → последний деплой → **Redeploy** (с Clear cache).

## Шаг 4. Seed (один раз)

После успешного деплоя локально с Neon URL:

```bash
DATABASE_URL="postgresql://..." npx prisma db seed
```

Или через Neon SQL Editor — данные появятся после seed.

## Локальная разработка

В `.env` укажите ту же `DATABASE_URL` от Neon (или отдельную dev-базу).

```bash
npx prisma db push
npx prisma db seed
npm run dev
```

## Загрузка схем/фото на Vercel

Файлы в `public/uploads` на serverless **не сохраняются** между деплоями.  
Для продакшена позже: Cloudinary / S3. Для MVP можно задать URL схемы вручную в админке (внешняя ссылка на картинку).
