# Деплой на Vercel (SQLite)

## Переменные в Vercel

**Settings → Environment Variables** (для Production, Preview, Development):

| Key | Value |
|-----|--------|
| `DATABASE_URL` | `file:/tmp/econext.db` |
| `BASE_URL` | `https://ВАШ-ПРОЕКТ.vercel.app` |
| `ADMIN_LOGIN` | `admin` |
| `ADMIN_PASSWORD` | ваш пароль |
| `SESSION_SECRET` | 32+ случайных символов |
| `IP_HASH_SALT` | любая строка |
| `APP_TIMEZONE` | `Europe/Moscow` |

Локально в `.env`:

```env
DATABASE_URL="file:./prisma/dev.db"
```

---

## Деплой

1. Код на GitHub: `maksimchernyakov1981-debug/econext-landing`
2. [vercel.com](https://vercel.com) → **Add Project** → импорт репозитория
3. Framework: **Next.js** (подхватится автоматически)
4. Добавьте переменные из таблицы выше
5. **Deploy**

После деплоя: **Deployments → Redeploy → Clear build cache** (если была старая ошибка).

---

## База на Vercel

При первом запуске сервер сам создаёт SQLite в `/tmp` и заполняет seed (если база пустая).

Партнёр по умолчанию: `/gift/morskaya`

---

## Ограничения Vercel + SQLite

| Что | Поведение |
|-----|-----------|
| Данные в БД | Могут **сброситься** после долгого простоя (cold start) |
| Загруженные картинки | Тоже во `/tmp` — **не вечные** |
| Статистика | Сохраняется, пока живёт инстанс |

Для стабильной работы в гостиницах позже лучше VPS или Render.  
Для теста и демо QR — **Vercel подходит**.

---

## Проверка

- `https://ваш-проект.vercel.app`
- `https://ваш-проект.vercel.app/gift/morskaya`
- `https://ваш-проект.vercel.app/admin`

---

## Если сборка падает

1. `DATABASE_URL` = `file:/tmp/econext.db` (не postgresql, не `file:./prisma/...` на Vercel)
2. Redeploy + **Clear build cache**
3. Пришлите полный лог Build
