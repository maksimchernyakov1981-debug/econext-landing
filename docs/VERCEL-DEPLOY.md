# Деплой на Vercel — пошагово

## Почему была ошибка

1. **`npm install` / `prisma generate`** — нужен `DATABASE_URL` в формате **postgresql://** (не SQLite).
2. **`prisma db push` в сборке** — убран; таблицы создаются отдельно (см. шаг 4).

---

## Шаг 1. База Neon (бесплатно)

1. Откройте [console.neon.tech](https://console.neon.tech)
2. **New Project** → регион любой
3. На Dashboard скопируйте **Connection string** (PostgreSQL):
   ```
   postgresql://neondb_owner:ПАРОЛЬ@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require
   ```
4. Важно: строка начинается с **`postgresql://`**

---

## Шаг 2. Переменные на Vercel

Проект → **Settings** → **Environment Variables**

Добавьте **для Production, Preview и Development**:

| Key | Value |
|-----|--------|
| `DATABASE_URL` | вся строка из Neon |
| `BASE_URL` | `https://ИМЯ-ПРОЕКТА.vercel.app` (ваш URL Vercel) |
| `ADMIN_LOGIN` | `admin` |
| `ADMIN_PASSWORD` | придумайте пароль |
| `SESSION_SECRET` | 32+ случайных букв/цифр |
| `IP_HASH_SALT` | любая случайная строка |
| `APP_TIMEZONE` | `Europe/Moscow` |

**Сохраните** каждую переменную.

---

## Шаг 3. Пересборка

1. **Deployments**
2. три точки у последнего деплоя → **Redeploy**
3. Включите **Clear build cache**
4. **Redeploy**

Дождитесь статуса **Ready** (зелёный).

---

## Шаг 4. Создать таблицы и данные (один раз)

На **своём компьютере** в папке проекта:

```powershell
cd "d:\Боты все\Лендинг бот мой для юга"
```

Создайте файл `.env` (или откройте) и вставьте **тот же** `DATABASE_URL` из Neon:

```
DATABASE_URL="postgresql://..."
```

Затем:

```powershell
npx prisma db push
npx prisma db seed
```

Должно быть: `Seed completed`.

---

## Шаг 5. Проверка

- `https://ваш-проект.vercel.app` — лендинг
- `https://ваш-проект.vercel.app/gift/morskaya` — гостиница
- `https://ваш-проект.vercel.app/admin` — вход (admin + ваш пароль)

---

## Если снова ошибка при сборке

| Текст ошибки | Решение |
|--------------|---------|
| `npm install` exit code 1 | Redeploy с Clear cache; проверьте что в GitHub последний коммит |
| `postgresql://` protocol | В Vercel `DATABASE_URL` должен быть от Neon, не `file:./` |
| Repository not found | Проверьте репозиторий на GitHub |
| Build succeeded, сайт 500 | Не сделан шаг 4 (`db push` + `seed`) |

Пришлите **полный лог** Build Logs (красные строки внизу).

---

## Загрузка картинок на Vercel

Файлы в `public/uploads` **не сохраняются** на serverless.  
В админке **Карты** можно указать URL картинки с внешнего хостинга (Imgur, Cloudinary и т.д.).
