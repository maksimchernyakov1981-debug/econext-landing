# Деплой EcoNext (SQLite)

Проект использует **SQLite** (`file:./prisma/dev.db`).

## Важно

| Платформа | SQLite |
|-----------|--------|
| **Локально** | ✅ |
| **Render** (с диском) | ✅ рекомендуется |
| **Vercel** | ⚠️ данные не сохраняются между запросами — **не рекомендуется** |

Для продакшена с QR в гостиницах лучше **Render**: [render.com](https://render.com) → Blueprint → репозиторий → `render.yaml`.

---

## Локально

```env
DATABASE_URL="file:./prisma/dev.db"
```

```bash
npx prisma db push
npx prisma db seed
npm run dev
```

---

## Render (рекомендуется)

1. Подключите GitHub-репозиторий
2. **Environment Variables:**
   - `DATABASE_URL` = `file:./prisma/dev.db`
   - `BASE_URL` = URL вашего сервиса на Render
   - `ADMIN_LOGIN`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `IP_HASH_SALT`, `APP_TIMEZONE`
3. Диск в `render.yaml` уже настроен на папку `prisma`

---

## Vercel (только если очень нужно)

Сборка пройдёт, если в Variables:

```
DATABASE_URL=file:./prisma/dev.db
```

Но база и загрузки **не будут постоянными**. Для MVP в отелях используйте Render.
