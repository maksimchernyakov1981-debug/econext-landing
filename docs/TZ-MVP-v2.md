# EcoNext Landing — ТЗ MVP v2

Дата: 2026-06-03  
База: пользовательское ТЗ + текущий репозиторий `econext-landing`

---

## 1. Цель MVP

QR гостиницы → `/gift/[slug]` → лендинг с **раскрывающимися блоками** (скидка, ассортимент, маршрут, график).  
Все тексты и ссылки из БД. Админка `/admin` без ссылки с публичной страницы.

---

## 2. Статус реализации

| № | Требование | Статус | Где в проекте |
|---|------------|--------|----------------|
| 1 | Лендинг `/gift/[partnerSlug]` | ✅ | `src/app/gift/[partnerSlug]/page.tsx` |
| 2 | Раскрывающиеся блоки по 4 кнопкам | ✅ | `src/components/landing/LandingAccordion.tsx` |
| 3 | Скидка: UDS / TG / MAX, partner → global | ✅ | `resolveLink`, блок `discount` |
| 4 | Ассортимент: ссылки из `CatalogSettings` | ✅ | блок `catalog` |
| 5 | Маршрут: карты + SpecialDay override | ✅ | `getTodayWorkStatus.ts`, блок `route` |
| 6 | График из БД по дням недели | ✅ | `WorkScheduleDay`, `formatFullSchedule` |
| 7 | Первый экран: hero, статус, адрес, схема | ✅ | `LandingAccordion` |
| 8 | Схема: upload, active, caption | ✅ | `/admin/maps`, `MapSettings` |
| 9 | Админка `/admin` | ✅ | `src/app/admin/*` |
| 10 | Авторизация ADMIN_LOGIN / ADMIN_PASSWORD | ✅ | `.env`, `middleware.ts`, `api/auth/login` |
| 11 | Пульт: статистика + быстрые разделы | ✅ | `src/app/admin/page.tsx` |
| 12 | Партнёры: CRUD, QR PNG, ссылка | ✅ | `/admin/partners`, `api/partners/[id]/qr` |
| 13 | Контакты (общие ссылки) | ✅ | `/admin/contacts` |
| 14 | Ассортимент | ✅ | `/admin/catalog` |
| 15 | Карты и схема | ✅ | `/admin/maps` |
| 16 | График по дням | ✅ | `/admin/schedule` |
| 17 | Тексты лендинга + переменные | ✅ | `/admin/landing` |
| 18 | Тексты кнопок | ✅ | `/admin/buttons` |
| 19 | Особые дни | ✅ | `/admin/special-days` |
| 20 | Статистика + фильтры | ✅ | `/admin/stats`, `VisitEvent` |
| 21 | Prisma-модели + seed | ✅ | `prisma/schema.prisma`, `prisma/seed.ts` |
| 22 | События кликов | ✅ | `POST /api/events`, `track.ts` |
| 23 | Статистика по партнёру | ✅ | `PartnerStats.tsx` на `/admin/partners/[id]` |
| 24 | Универсальный лендинг `/` | ✅ | `src/app/page.tsx` (без партнёра) |

### Не в MVP (можно позже)

| Требование | Статус |
|------------|--------|
| PostgreSQL на Vercel (Neon/Supabase) | ⏳ SQLite + `/tmp` на Vercel |
| PDF QR A5/A6 | ❌ только PNG |
| Загрузка схемы в «Особые дни» | ⏳ поле URL, без upload-виджета |
| Таблица метрик «партнёр × все события» на `/admin/stats` | ⏳ список eventType |
| `telegramLink` в модели Partner | ❌ используется `telegramBotLink` (то же по смыслу) |

---

## 3. Поведение лендинга (актуальное)

### URL

- Партнёр: `https://домен/gift/morskaya`
- Универсальный: `https://домен/`
- **Не** отдельные страницы `/discount` — блоки раскрываются на месте.

### Кнопки → блоки

1. **Скидка** — заголовок/описание/подсказка из `LandingSettings`, кнопки UDS/TG/MAX.
2. **Ассортимент** — если `catalogSettings.isActive`, иначе блок не раскрывается с контентом.
3. **Маршрут** — адрес, ориентир, кнопки карт (скрыты без URL).
4. **График** — полный текст из `WorkScheduleDay` + префикс особого дня.

Повторный клик по кнопке **сворачивает** блок.

### Ссылки

```
partner.udsLink / telegramBotLink / maxBotLink
  ↓ если пусто
contactSettings.udsUrl / telegramBotUrl / maxBotUrl
  ↓ если пусто
кнопка не показывается
```

---

## 4. Админка

### Вход

```
https://ваш-домен.vercel.app/admin
```

Локально: `http://localhost:3000/admin`

Переменные Vercel / `.env`:

```env
ADMIN_LOGIN="admin"
ADMIN_PASSWORD="ваш_пароль"
SESSION_SECRET="минимум 32 символа"
BASE_URL="https://ваш-домен.vercel.app"
DATABASE_URL="file:/tmp/econext.db"   # на Vercel
```

На публичном лендинге **нет** ссылки на админку.

### Разделы

| URL | Назначение |
|-----|------------|
| `/admin` | Пульт, статистика за сегодня |
| `/admin/partners` | Гостиницы, QR, slug |
| `/admin/landing` | Тексты |
| `/admin/buttons` | Подписи кнопок |
| `/admin/maps` | Адрес, карты, схема |
| `/admin/schedule` | График Пн–Вс |
| `/admin/catalog` | Ассортимент |
| `/admin/qr` | Тексты QR-карточки |
| `/admin/contacts` | Общие ссылки |
| `/admin/special-days` | Переопределение дня |
| `/admin/stats` | События, фильтры |
| `/admin/media` | Доп. фото |

---

## 5. Seed (демо)

После `npx prisma db seed`:

- Партнёр **Гостиница Морская**, slug `morskaya`, Telegram-бот с `start=hotel_morskaya`
- График Пн–Вс по ТЗ
- Тексты и кнопки по умолчанию
- Карты/UDS URL — заполнить в `/admin/contacts` и `/admin/maps`

---

## 6. Деплой

1. `git push origin main`
2. Vercel собирает `npm run vercel-build` (создаёт `prod.db` + seed)
3. Проверка: `/gift/morskaya` — клик по кнопке **раскрывает** блок
4. Проверка: `/admin` — вход, раздел «Контакты», сохранить UDS URL

---

## 7. Отличия имён полей от текста ТЗ

| В ТЗ (текст) | В коде (Prisma) |
|--------------|-----------------|
| `telegramLink` | `telegramBotLink` |
| `contactSettings.telegramUrl` | `telegramBotUrl` |
| `contactSettings.maxUrl` | `maxBotUrl` |

Логика та же: партнёр → общие контакты → скрыть кнопку.

---

## 8. Чеклист приёмки MVP

- [ ] QR открывает `/gift/morskaya`
- [ ] 4 кнопки раскрывают блоки на той же странице
- [ ] UDS/TG/MAX ведут на ссылки из админки
- [ ] Карты ведут на URL из «Карты» или особого дня
- [ ] График показывает все дни недели из БД
- [ ] `/admin` — логин работает
- [ ] Партнёр: сохранить, скопировать ссылку, скачать QR
- [ ] Статистика: клик на лендинге → счётчик в `/admin/stats`
