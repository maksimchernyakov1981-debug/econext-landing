# EcoNext Landing — контекст для AI (новый чат)

Читай этот файл первым, если контекст чата потерян.

## Проект

- **Репозиторий:** https://github.com/maksimchernyakov1981-debug/econext-landing
- **Прод:** https://econext-landing.vercel.app
- **Админка:** https://econext-landing.vercel.app/admin
- **Стек:** Next.js 15, Prisma, SQLite локально, Vercel Blob на проде

## Локальная разработка

```bash
cd "d:\Боты все\Лендинг бот мой для юга"
# .env: ADMIN_LOGIN, ADMIN_PASSWORD, SESSION_SECRET (32+ символа)
DATABASE_URL="file:./prod.db"   # путь относительно prisma/schema.prisma
npm install
npx prisma db push
npm run dev   # http://localhost:3000
```

БД по умолчанию: `prisma/prod.db` (в git, попадает в Vercel build).

## Деплой на Vercel

1. `git add … && git commit -m "…" && git push origin main`
2. Vercel сам собирает из GitHub (`npm run vercel-build`: prisma + seed + next build)
3. **Настройки на проде живут в Blob** (`econext-settings.json`), не только в SQLite

### Синхронизация текстов/настроек на прод

После правок текстов оффера или если лендинг показывает старые данные:

```bash
npm run sync:production-offer   # только тексты оффера (hero, кнопки, QR)
```

Универсально: зайти в `/admin` → сохранить нужный раздел → «Применить на сайте».

Скрипт `scripts/sync-production-offer.ts` логинится через `/api/auth/login` и вызывает `/api/admin/apply-offer-texts`.

### Переменные Vercel (обязательные)

| Переменная | Значение |
|------------|----------|
| `DATABASE_URL` | `file:/tmp/econext.db` |
| `BASE_URL` | `https://ваш-домен.vercel.app` (для OG-превью в Telegram!) |
| `UPLOAD_MAX_SIZE_MB` | `50` (видео) |
| `ADMIN_LOGIN` / `ADMIN_PASSWORD` | как в локальном `.env` |
| `SESSION_SECRET` | минимум 32 символа |
| `BLOB_READ_WRITE_TOKEN` | из Vercel Storage → Blob |

## Архитектура данных

| Что | Где |
|-----|-----|
| Тексты лендинга, кнопки, карты, график, партнёры | `LandingSettings`, `ButtonSettings`, … + **Blob JSON** |
| Партнёрские override | `Partner.customHero*` / `customGiftText` |
| Медиа (фото/видео точки) | `/admin/media` → `MediaAsset` (типы `store_photo`, `store_video`) + Blob JSON + файлы в `uploads/` |
| Зашитые в коде строки | `DiscountBlock.tsx`, шаги, подсказки VPN |

**Важно:** на Vercel `useVercelSettingsBackup()` читает из Blob. Любое сохранение в админке должно вызывать `afterAdminSave()` → `persistAndVerifySnapshot()`.

## Ключевые файлы

| Задача | Файлы |
|--------|-------|
| Лендинг UI | `src/components/landing/LandingAccordion.tsx` |
| Тексты оффера (константы) | `src/lib/offer-texts.ts` |
| Blob snapshot | `src/lib/settings-backup.ts` |
| Админ actions | `src/app/admin/actions.ts` |
| Загрузка файлов | `src/app/api/upload/route.ts`, `src/lib/upload-storage.ts` |
| Seed | `prisma/seed.ts` |

## Текущий оффер (маркетинг)

- **Подарок** только на точке при покупке **от 1500 ₽** (салфетка для оптики или сетка для посуды)
- **Скидки дома** через приложение UDS, Telegram, MAX
- Без слов «гость отеля» — «Для вас от [partner_name]»

## Частые проблемы

1. **Старые тексты на проде** → `npm run sync:production-offer` или сохранить в `/admin/landing`
2. **Пустой график / ошибка админки** → `scheduleDays` в Blob должен быть массивом; см. `normalizeSnapshot` в `settings-backup.ts`
3. **Медиа пропадает на Vercel** → должно быть в `mediaAssets` внутри Blob snapshot
4. **Vercel CLI без логина** → деплой только через `git push`

## Команды

```bash
npm run dev
npm run db:update-offer      # локальная БД
npm run sync:production-offer # прод Blob + тексты оффера
npm run vercel-build         # как на Vercel
npx tsx scripts/diag-production-media.ts  # диагностика медиа на проде
```

## Автономная работа агента

Пользователь просит: **агент сам выполняет всё от начала до конца**, без «нажмите Run».

| Что настроено | Где |
|---------------|-----|
| Правило «делай сам» (глобально) | `C:\Users\user\.cursor\rules\autonomous-agent.mdc` |
| Allowlist команд (глобально) | `C:\Users\user\.cursor\permissions.json` |
| Правило + allowlist (этот проект) | `.cursor/rules/`, `.cursor/permissions.json` |
| Инструкция для агента | `AGENTS.md` |

**Один раз в Cursor:** Settings → Agents → Run Mode → **Run Everything** (или Auto-review / Allowlist).

Типовой цикл агента: правка → `npm run build` → `git commit` → `git push` → проверка `econext-landing.vercel.app` или diag-скрипт.

**Деплой сразу** после задачи — если пользователь не попросил оставить изменения только локально.
