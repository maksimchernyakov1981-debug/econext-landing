# Техническое задание: EcoNext QR-лендинг

**Версия:** 1.2  
**Дата:** 2026-06-03  
**Статус:** MVP (уточнённое ТЗ)

---

## Содержание

1. [Суть проекта](#1-суть-проекта)
2. [Главная логика](#2-главная-логика)
3. [Технический стек](#3-технический-стек)
4. [Переменные окружения](#4-переменные-окружения)
5. [API](#5-api)
6. [Страницы проекта](#6-страницы-проекта)
7. [Авторизация в админке](#7-авторизация-в-админке)
8. [Универсальный лендинг `/`](#8-универсальный-лендинг-)
9. [Лендинг `/gift/[partnerSlug]`](#9-лендинг-giftpartnerslug)
10. [Поведение партнёра (404 / отключён)](#10-поведение-партнёра-404--отключён)
11. [Первый экран и приоритет текстов](#11-первый-экран-и-приоритет-текстов)
12. [График на сегодня](#12-график-на-сегодня)
13. [Адрес и схема](#13-адрес-и-схема)
14. [Главные кнопки и раскрывающиеся блоки](#14-главные-кнопки-и-раскрывающиеся-блоки)
15. [Управление ссылками (без хардкода)](#15-управление-ссылками-без-хардкода)
16. [Особые дни](#16-особые-дни)
17. [Часовой пояс и даты](#17-часовой-пояс-и-даты)
18. [Медиа и загрузки](#18-медиа-и-загрузки)
19. [Админ-панель](#19-админ-панель)
20. [Разделы админки](#20-разделы-админки)
21. [Prisma-модели](#21-prisma-модели)
22. [Singleton-настройки](#22-singleton-настройки)
23. [Функция графика `getTodayWorkStatus`](#23-функция-графика-gettodayworkstatus)
24. [Формат полного графика](#24-формат-полного-графика)
25. [Переменные в текстах](#25-переменные-в-текстах)
26. [События и статистика](#26-события-и-статистика)
27. [QR-коды](#27-qr-коды)
28. [Валидация slug](#28-валидация-slug)
29. [Seed-данные](#29-seed-данные)
30. [Дизайн](#30-дизайн)
31. [MVP и отложенное](#31-mvp-и-отложенное)
32. [Правила разработки](#32-правила-разработки)
33. [Итоговая схема продукта](#33-итоговая-схема-продукта)

---

## 1. Суть проекта

Web-приложение для **EcoNext**.

**Главная задача:** гость гостиницы сканирует QR-код, попадает на мобильный лендинг конкретной гостиницы и быстро может:

- получить скидку / бонусы;
- открыть UDS;
- открыть Telegram-бот EcoNext;
- открыть MAX-бот EcoNext;
- посмотреть ассортимент через Telegram / MAX / UDS;
- увидеть актуальный график работы;
- увидеть адрес точки;
- увидеть картинку-схему расположения торговой точки;
- построить маршрут (Яндекс Карты, Яндекс Навигатор, 2ГИС, Google Maps).

**Админ-панель:** владелец меняет все тексты, **все внешние ссылки** (UDS, боты, каналы, WhatsApp, сайт, карты, приложение UDS), график, адрес, фото, схему, QR и партнёров **без изменения кода**.

**Ссылки:** ни одна пользовательская ссылка (кнопка, `href`, deep link) не задаётся в коде компонентов — только в БД через админку (см. §15).

---

## 2. Главная логика

```
QR в гостинице
    ↓
Лендинг /gift/[partnerSlug]
    ↓
Пользователь видит: подарок, график, адрес, схему, кнопки UDS/TG/MAX, карты
    ↓
Переход в UDS / Telegram / MAX / карты
    ↓
В админке — статистика событий
```

**События для учёта:**

| Событие | Описание |
|---------|----------|
| `page_open` | Открытие лендинга |
| `click_discount` | Первое раскрытие блока скидки (см. §26) |
| `click_uds` | Клик UDS (скидка) |
| `click_telegram` | Клик Telegram (скидка) |
| `click_max` | Клик MAX (скидка) |
| `click_route` | Раскрытие / клик «Как добраться» |
| `click_yandex_maps` | Яндекс Карты |
| `click_yandex_navigator` | Яндекс Навигатор |
| `click_2gis` | 2ГИС |
| `click_google_maps` | Google Maps |
| `click_catalog` | Блок ассортимента (общий) |
| `click_catalog_telegram` | Ассортимент Telegram |
| `click_catalog_max` | Ассортимент MAX |
| `click_catalog_uds` | Ассортимент UDS |
| `click_catalog_uds_app` | Скачать UDS |
| `click_schedule` | Раскрытие полного графика |

---

## 3. Технический стек

| Компонент | Технология |
|-----------|------------|
| Framework | Next.js (App Router) |
| Язык | TypeScript |
| Стили | Tailwind CSS |
| ORM | Prisma |
| БД (MVP) | SQLite |
| QR | библиотека `qrcode` |
| Даты/время | `date-fns-tz` (или `Intl` + `APP_TIMEZONE`) |
| Сессия админки | `iron-session` или подписанный JWT в HTTP-only cookie |

**Требования:** mobile-first; основной трафик — телефон по QR.

**Архитектура лендинга:** Server Components для данных из БД; клиентские компоненты только для аккордеонов, трекинга событий и копирования ссылки.

---

## 4. Переменные окружения

Файл `.env.example` обязателен в репозитории:

```env
DATABASE_URL="file:./dev.db"

ADMIN_LOGIN="admin"
ADMIN_PASSWORD="change_me"

BASE_URL="http://localhost:3000"
APP_TIMEZONE="Europe/Moscow"

SESSION_SECRET="change-me-in-production"
IP_HASH_SALT="change-me"

UPLOAD_MAX_SIZE_MB=5
```

| Переменная | Назначение |
|------------|------------|
| `DATABASE_URL` | SQLite для MVP |
| `ADMIN_LOGIN` / `ADMIN_PASSWORD` | Вход в админку (MVP) |
| `BASE_URL` | Базовый URL для QR и ссылок партнёров |
| `APP_TIMEZONE` | Календарный «сегодня» и сравнение времени графика |
| `SESSION_SECRET` | Подпись cookie `admin_session` |
| `IP_HASH_SALT` | Соль для `ipHash` в `VisitEvent` |
| `UPLOAD_MAX_SIZE_MB` | Лимит загрузки изображений |

**Production:** при `ADMIN_PASSWORD=change_me` показывать предупреждение в админке; использовать длинный пароль. Позже — таблица `AdminUser` + bcrypt.

---

## 5. API

| Метод | Путь | Auth | Назначение |
|-------|------|------|------------|
| POST | `/api/auth/login` | — | Вход, установка `admin_session` |
| POST | `/api/auth/logout` | — | Выход, очистка cookie |
| POST | `/api/events` | — | Запись `VisitEvent` (rate limit) |
| GET | `/api/partners/[id]/qr` | admin | PNG QR-код |
| POST | `/api/upload` | admin | Загрузка изображения |

**Rate limit** на `POST /api/events`: не более 60 запросов/мин с одного IP.

---

## 6. Страницы проекта

| URL | Назначение |
|-----|------------|
| `/` | Универсальный лендинг EcoNext (без партнёра) |
| `/gift/[partnerSlug]` | Персональный лендинг гостиницы |
| `/admin` | Главная админ-панель (+ форма входа) |
| `/admin/partners` | Партнёры |
| `/admin/partners/new` | Добавить партнёра |
| `/admin/partners/[id]` | Редактировать партнёра |
| `/admin/landing` | Тексты лендинга |
| `/admin/buttons` | Тексты кнопок |
| `/admin/maps` | Адрес, карты, **схема прохода** |
| `/admin/schedule` | График работы |
| `/admin/catalog` | Блок «Ассортимент» |
| `/admin/qr` | QR-карточка |
| `/admin/media` | Logo, hero, фото (без схемы) |
| `/admin/contacts` | Контакты и ссылки |
| `/admin/special-days` | Особые дни |
| `/admin/stats` | Статистика |

---

## 7. Авторизация в админке

MVP: логин и пароль сверяются с `ADMIN_LOGIN` / `ADMIN_PASSWORD` из `.env`.

**Сессия:**

- после успешного входа — HTTP-only cookie `admin_session` (подпись через `SESSION_SECRET`);
- срок жизни: **7 дней**;
- кнопка **«Выйти»** на главной админки → `POST /api/auth/logout`;
- **middleware** на всех `/admin/*` (кроме страницы входа и `/api/auth/login`): без валидной сессии — форма входа.

**Форма входа:** Логин, Пароль, «Войти». После входа — пульт управления.

---

## 8. Универсальный лендинг `/`

- Те же UI-компоненты, что и `/gift/[slug]`, с `partner = null`.
- Строка «Специально для гостей: …» **не показывается**.
- Ссылки UDS / Telegram-бот / MAX-бот / каналы / WhatsApp / сайт — только из `ContactSettings` и `CatalogSettings` (§15), без полей партнёра.
- Блок ассортимента — из `CatalogSettings`.
- Событие `page_open` с `partnerId = null` (опционально query `?ref=` для метки источника).
- В статистике — фильтр **«Без партнёра»**.

---

## 9. Лендинг `/gift/[partnerSlug]`

Мобильный, быстрый, без товарного каталога на странице.

**Порядок блоков:**

1. Шапка EcoNext  
2. Оффер «Подарок гостям отеля»  
3. Название гостиницы / партнёра  
4. Статус работы на сегодня  
5. Адрес  
6. Ориентир  
7. Картинка-схема (если есть и активна)  
8. Главные кнопки (4 шт.)  
9. Раскрывающийся блок скидки  
10. Раскрывающийся блок ассортимента  
11. Раскрывающийся блок маршрута  
12. Раскрывающийся блок полного графика  
13. Футер: строка о статистике (редактируемая, см. §26)

Контакты (WhatsApp, сайт, каналы) — если заданы ссылки и включены в UI, только из БД (§15).

При открытии страницы — один `page_open` (с учётом debounce, §26).

---

## 10. Поведение партнёра (404 / отключён)

| Ситуация | Поведение |
|----------|-----------|
| `slug` не найден в БД | HTTP 404, страница «Партнёр не найден» (тексты из singleton-настроек или минимальный технический fallback только для этой служебной страницы) |
| `isActive = false` | **Редирект 302 на `/`** (без query); события не писать |
| Успешный лендинг | `page_open` с `partnerId` |

События **`page_open` и клики не записываются** для 404 и редиректа.

---

## 11. Первый экран и приоритет текстов

**Приоритет источников текста:**

| Блок | Приоритет 1 | Приоритет 2 |
|------|-------------|-------------|
| Hero (заголовок, подзаголовок, описание) | `Partner.customHeroTitle/Subtitle/Description` | `LandingSettings.hero*` |
| Строка для гостей | `LandingSettings.partnerLineTemplate` + `[partner_name]` | — |
| Текст подарка в блоке скидки | `Partner.customGiftText` | `LandingSettings.discountBlock*` |
| Текст QR-карточки (печать) | `Partner.customQrText` | `QrCardSettings` |

**Стартовые тексты (только в seed):**

- 🎁 Подарок гостям отеля  
- Получите скидку или бонусы EcoNext и посмотрите, как к нам добраться.  
- Полотенца, коврики и салфетки из микрофибры для моря, дома и подарков.  
- `Специально для гостей: [partner_name]` → пример: `Специально для гостей: Гостиница Морская`

---

## 12. График на сегодня

**Базовый график (seed), день = календарный день в `APP_TIMEZONE`:**

| День | Часы | note (seed) |
|------|------|-------------|
| Пн | 15:30–20:00 | работаем вечером |
| Вт | 10:00–14:00, 15:00–20:00 | перерыв 14:00–15:00 |
| Ср | 10:00–14:00, 15:00–20:00 | перерыв 14:00–15:00 |
| Чт | 10:00–14:00, 15:00–20:00 | перерыв 14:00–15:00 |
| Пт | 15:30–20:00 | работаем вечером |
| Сб | 15:30–20:00 | работаем вечером |
| Вс | 10:00–14:00, 15:00–20:00 | перерыв 14:00–15:00 |

**Статусы (заголовки и описания из `LandingSettings` + переменные §24):**

| status | Заголовок (пример) | Описание (шаблон) |
|--------|-------------------|-------------------|
| `open` | ✅ Сегодня работаем | `[today_schedule]` |
| `break` | ⏸ Сейчас перерыв | `Откроемся сегодня в [next_open_time]. Работаем до [close_time].` |
| `before_open` | ⏳ Сегодня откроемся в … | `[next_open_time]`, `[close_time]` |
| `closed` | ⛔ Сегодня уже закрыто | текст из `closedStatusText` |

Активный `SpecialDay` на сегодня перекрывает `WorkScheduleDay` (см. §15, §23).

---

## 13. Адрес и схема

**Адрес на первом экране** (не в глубине страницы):

```
[addressBlockTitle из LandingSettings]
[addressLabel]: [address]
[landmarkLabel]: [landmark]
```

**Источник:** активный `SpecialDay` на сегодня → иначе `MapSettings`.

**Схема прохода — единственный источник в MVP:**

| Контекст | Поле |
|----------|------|
| Обычный день | `MapSettings.mapSchemeImageUrl`, `mapSchemeCaption`, `mapSchemeIsActive` |
| Особый день | `SpecialDay.schemeImageUrl`, `schemeImageCaption` |

Загрузка и редактирование — только в **`/admin/maps`** (и поля особого дня в `/admin/special-days`).  
Раздел **`/admin/media`** — типы `logo`, `hero`, `store_photo`, `landmark_photo`, `qr_card_background` (**без** `map_scheme`).

- Нет URL или `mapSchemeIsActive = false` — блок изображения не рендерить.
- Стили: `width: 100%`, `border-radius`, `object-fit: contain` или `cover`.

---

## 14. Главные кнопки и раскрывающиеся блоки

**Порядок кнопок** (тексты из `ButtonSettings`):

1. 🎁 Получить скидку / бонусы  
2. 🛍 Посмотреть ассортимент  
3. 📍 Как к нам добраться  
4. 📅 График работы  

### Скидка / бонусы

Ссылки и кнопки — по §15 (приоритет партнёр → общие настройки → скрыть кнопку).  
Подсказка — `LandingSettings.discountHint`.

### Ассортимент

Без карточек товаров. Ссылки — `CatalogSettings` + при необходимости каналы из `ContactSettings` (§15). Пустая ссылка → кнопка скрыта.

### Маршрут

Адрес, ориентир, кнопки карт. Источник: `SpecialDay` → `MapSettings` (§15). Пустая URL → кнопка скрыта.

### Полный график

Строится из БД функцией `formatFullSchedule()` (§24). При `SpecialDay` сверху: «Важно на сегодня: [description]».

---

## 15. Управление ссылками (без хардкода)

### 15.1. Обязательное правило

**Запрещено** в коде лендинга и админки:

- константы вида `const TELEGRAM_URL = 'https://t.me/...'`;
- ссылки в JSX/TSX (`href="https://..."`), кроме внутренних маршрутов приложения (`/`, `/gift/...`, `/admin/...`);
- ссылки в конфигах фронтенда, кроме `BASE_URL` в `.env` (технический домен для QR, не кнопка на лендинге).

**Разрешено:**

- читать URL из Prisma и передавать в `href` динамически;
- стартовые URL **только** в `prisma/seed.ts` (или seed-скрипте);
- пустая ссылка в БД → **не рендерить** соответствующую кнопку/блок.

Единая функция разрешения ссылки (рекомендуется):

```ts
resolveLink({
  partnerValue?: string | null,
  globalValue?: string | null,
}): string | null
// partnerValue ?? globalValue ?? null
```

### 15.2. Реестр всех ссылок

| Назначение | Где редактировать в админке | Поля партнёра (приоритет 1) | Общие поля (приоритет 2) |
|------------|----------------------------|------------------------------|---------------------------|
| UDS — скидка / бонусы | `/admin/contacts`, `/admin/partners/[id]` | `udsLink` | `ContactSettings.udsUrl` |
| Telegram-бот — скидка | `/admin/contacts`, `/admin/partners/[id]` | `telegramBotLink` | `ContactSettings.telegramBotUrl` |
| MAX-бот — скидка | `/admin/contacts`, `/admin/partners/[id]` | `maxBotLink` | `ContactSettings.maxBotUrl` |
| UDS — ассортимент | `/admin/catalog` | — | `CatalogSettings.udsCatalogUrl` |
| Telegram — ассортимент | `/admin/catalog` | — | `CatalogSettings.telegramCatalogUrl` |
| MAX — ассортимент | `/admin/catalog` | — | `CatalogSettings.maxCatalogUrl` |
| Приложение UDS (скачать) | `/admin/catalog`, `/admin/contacts` | — | `CatalogSettings.udsAppDownloadUrl` или `ContactSettings.udsAppDownloadUrl` (одно значение в seed, дубли синхронизировать в форме или брать из `ContactSettings`) |
| Telegram-канал | `/admin/contacts` | `telegramChannelLink` | `ContactSettings.telegramChannelUrl` |
| MAX-канал | `/admin/contacts` | `maxChannelLink` | `ContactSettings.maxChannelUrl` |
| WhatsApp | `/admin/contacts` | — | `ContactSettings.whatsappUrl` |
| Сайт EcoNext | `/admin/contacts` | — | `ContactSettings.websiteUrl` |
| Телефон (звонок) | `/admin/contacts` | `phone` (партнёр — контакт гостиницы, не лендинг EcoNext) | `ContactSettings.phone` (`tel:` генерировать в коде из значения БД) |
| Яндекс Карты | `/admin/maps`, `/admin/special-days` | — | `MapSettings` / `SpecialDay` |
| Яндекс Навигатор | `/admin/maps`, `/admin/special-days` | — | `MapSettings` / `SpecialDay` |
| 2ГИС | `/admin/maps`, `/admin/special-days` | — | `MapSettings` / `SpecialDay` |
| Google Maps | `/admin/maps`, `/admin/special-days` | — | `MapSettings` / `SpecialDay` |

**Карты на лендинге:** для обычного дня — `MapSettings.*Url`; если сегодня активен `SpecialDay` с заполненными URL — берутся они (перекрывают `MapSettings`).

**QR лендинга партнёра:** `{BASE_URL}/gift/{slug}` — собирается из `.env` + `slug` из БД, не хардкод домена в компонентах.

### 15.3. Разделы админки для ссылок

| Раздел | Какие ссылки |
|--------|----------------|
| `/admin/contacts` | UDS, Telegram-бот, MAX-бот, Telegram-канал, MAX-канал, WhatsApp, сайт, телефон, приложение UDS (общее) |
| `/admin/catalog` | UDS / Telegram / MAX для ассортимента, скачивание приложения UDS |
| `/admin/maps` | Яндекс Карты, Яндекс Навигатор, 2ГИС, Google Maps |
| `/admin/special-days` | Те же 4 карты + адрес на особый день |
| `/admin/partners/[id]` | Индивидуальные UDS, Telegram-бот, MAX-бот, Telegram-канал, MAX-канал (опционально) |

В формах — поля типа `url` с подсказкой формата (`https://`, `tg://`, `tel:` для телефона). Валидация: непустое значение должно начинаться с `http://`, `https://`, `tg:` или `tel:`.

### 15.4. Отображение каналов на лендинге

Telegram-канал и MAX-канал — **отдельные** сущности от ботов. Если в ТЗ/UI предусмотрен блок контактов или футер с соцсетями:

- кнопки «Telegram-канал» / «MAX-канал» показывать только при непустом `telegramChannelUrl` / `maxChannelUrl` (с учётом override партнёра);
- тексты кнопок — из `ButtonSettings` или отдельных полей `ContactSettings` (например `telegramChannelButtonText`), **не** хардкод.

Если каналы в MVP не выводятся на лендинге — поля всё равно есть в админке и БД для будущего использования.

### 15.5. Приоритет для партнёрского лендинга

Для `/gift/[slug]`:

1. Индивидуальная ссылка партнёра (если поле заполнено).  
2. Общая ссылка из `ContactSettings` / `CatalogSettings` / `MapSettings`.  
3. Пусто → кнопку не показывать.

Исключение: **карты** на особый день — `SpecialDay` перекрывает `MapSettings` (см. §16).

---

## 16. Особые дни

**Статусы:** `main_point`, `sanatorium`, `closed`, `moving`, `custom_location`

**Поля:** `date` (YYYY-MM-DD), `status`, `title`, `description`, `locationName`, два интервала времени, адрес, ориентир, 4 ссылки карт, `schemeImageUrl`, `schemeImageCaption`, `isActive`.

**Перекрывает на эту дату:** график, адрес, карты, схему.

**Правила статуса `closed` у SpecialDay:** `getTodayWorkStatus()` сразу возвращает `closed`, интервалы времени не применяются.

---

## 17. Часовой пояс и даты

- **Рабочий день** = календарная дата в часовом поясе `APP_TIMEZONE` (по умолчанию `Europe/Moscow`).
- Все сравнения «сегодня», «сейчас», открыто/перерыв/закрыто — в этой зоне (`date-fns-tz`).
- **`SpecialDay.date`** — строка `YYYY-MM-DD` (не `DateTime`), чтобы избежать сдвига UTC в SQLite.
- Поиск особого дня: `date === todayLocalDate` AND `isActive === true`.

---

## 18. Медиа и загрузки

**Хранение (MVP):**

```
public/uploads/{type}/{uuid}.{ext}
```

`type`: `map_scheme` (только через сохранение URL в MapSettings/SpecialDay), `logo`, `hero`, `store_photo`, `landmark_photo`, `qr_card_background`.

**Ограничения:**

- форматы: `image/jpeg`, `image/png`, `image/webp`;
- размер: ≤ `UPLOAD_MAX_SIZE_MB` (по умолчанию 5 MB);
- только авторизованный admin через `POST /api/upload`.

После загрузки в админке «Карты и схема» сохранять относительный путь в `MapSettings.mapSchemeImageUrl`.

---

## 19. Админ-панель

Mobile-first: burger или нижняя навигация; формы в один столбец; `font-size` полей ввода ≥ 16px (без авто-zoom на iOS).

**Главная `/admin`:**

- статистика за сегодня: открытия, UDS, маршрут, Telegram, MAX;
- быстрые разделы (все пункты меню);
- превью: текущий `getTodayWorkStatus()` — статус, время, адрес;
- топ партнёров за 7 дней;
- ссылка **«Открыть универсальный лендинг»** → `/`.

**На `/admin/partners/[id]`:**

- «Открыть лендинг» → `/gift/[slug]` в новой вкладке;
- «Скопировать ссылку» → clipboard + toast «Скопировано»;
- «Скачать QR PNG».

**Удаление:**

- партнёр: по умолчанию **«Отключить»** (`isActive = false`); полное удаление — modal «Удалить?» (статистика остаётся в БД);
- особый день: modal «Удалить?».

---

## 20. Разделы админки

### Партнёры

CRUD, вкл/выкл, slug, индивидуальные ссылки и тексты, QR, статистика по партнёру.

**Поля:** `name`, `slug`, `partnerType`, `contactName`, `phone`, `comment`, `udsLink`, `telegramBotLink`, `maxBotLink`, `telegramChannelLink`, `maxChannelLink`, `customHeroTitle`, `customHeroSubtitle`, `customHeroDescription`, `customQrText`, `customGiftText`, `isActive`.

Индивидуальные ссылки партнёра перекрывают общие из `/admin/contacts` (§15).

### Контакты (`/admin/contacts`)

Все общие внешние ссылки EcoNext (редактируемые, без хардкода):

- `udsUrl` — UDS (скидка)
- `telegramBotUrl` — Telegram-бот (скидка)
- `maxBotUrl` — MAX-бот (скидка)
- `telegramChannelUrl` — Telegram-канал
- `maxChannelUrl` — MAX-канал
- `whatsappUrl` — WhatsApp
- `websiteUrl` — сайт
- `udsAppDownloadUrl` — скачать приложение UDS
- `phone` — телефон (`tel:` формируется в коде)
- тексты кнопок контактов (опционально)

### Каталог (`/admin/catalog`)

Ссылки ассортимента: `telegramCatalogUrl`, `maxCatalogUrl`, `udsCatalogUrl`, `udsAppDownloadUrl` (если пусто — fallback на `ContactSettings.udsAppDownloadUrl`).

### Карты (`/admin/maps`, особые дни)

`yandexMapsUrl`, `yandexNavigatorUrl`, `twoGisUrl`, `googleMapsUrl`.

URL лендинга: `{BASE_URL}/gift/{slug}`.

### Тексты лендинга

Все поля `LandingSettings`, включая шаблоны статусов с переменными §24. Подсказка в форме: список доступных `[переменных]`.

### Кнопки, карты, график, ассортимент, QR, медиа, контакты, особые дни, статистика

Поля соответствуют Prisma-моделям (§21). Формы singleton — одна кнопка «Сохранить». Все URL — по реестру §15.

**Статистика:** фильтры «сегодня / 7 дней / 30 дней / всё время», по партнёру (включая «Без партнёра»), по типу события; таблица метрик по партнёрам.

---

## 21. Prisma-модели

```prisma
model Partner {
  id                    Int      @id @default(autoincrement())
  name                  String
  slug                  String   @unique
  partnerType           String   @default("hotel")
  contactName           String?
  phone                 String?
  comment               String?
  udsLink               String?
  telegramBotLink       String?  // Telegram-бот (скидка)
  maxBotLink            String?  // MAX-бот (скидка)
  telegramChannelLink   String?  // Telegram-канал (опционально)
  maxChannelLink        String?  // MAX-канал (опционально)
  customHeroTitle       String?
  customHeroSubtitle    String?
  customHeroDescription String?
  customQrText          String?
  customGiftText        String?
  isActive              Boolean  @default(true)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  events                VisitEvent[]
}

model LandingSettings {
  id                        Int      @id @default(autoincrement())
  heroTitle                 String
  heroSubtitle              String
  heroDescription           String
  partnerLineTemplate       String
  addressBlockTitle         String
  addressLabel              String
  landmarkLabel             String
  schemeBlockTitle          String?
  schemeDefaultCaption      String?
  discountBlockTitle        String
  discountBlockDescription  String
  discountHint              String
  routeBlockTitle           String
  routeBlockDescription     String
  scheduleBlockTitle        String
  openStatusTitle           String
  breakStatusTitle          String
  beforeOpenStatusTitle     String
  closedStatusTitle         String
  openStatusText            String?
  breakStatusText           String?
  beforeOpenStatusText      String?
  closedStatusText          String?
  privacyFooterText         String?  // футер о статистике
  notFoundTitle             String?  // 404 партнёр
  notFoundDescription       String?
  createdAt                 DateTime @default(now())
  updatedAt                 DateTime @updatedAt
}

model ButtonSettings {
  id                          Int      @id @default(autoincrement())
  discountButtonText          String
  catalogButtonText           String
  routeButtonText             String
  scheduleButtonText          String
  udsButtonText               String
  telegramButtonText          String
  maxButtonText               String
  catalogTelegramButtonText   String
  catalogMaxButtonText        String
  catalogUdsButtonText        String
  catalogUdsAppButtonText     String
  yandexMapsButtonText        String
  yandexNavigatorButtonText   String
  twoGisButtonText            String
  googleMapsButtonText        String
  createdAt                   DateTime @default(now())
  updatedAt                   DateTime @updatedAt
}

model MapSettings {
  id                    Int      @id @default(autoincrement())
  storeName             String
  address               String
  landmark              String?
  yandexMapsUrl         String?
  yandexNavigatorUrl    String?
  twoGisUrl             String?
  googleMapsUrl         String?
  mapSchemeImageUrl     String?
  mapSchemeCaption      String?
  mapSchemeIsActive     Boolean  @default(true)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}

model CatalogSettings {
  id                    Int      @id @default(autoincrement())
  title                 String
  description           String
  telegramCatalogText   String?
  maxCatalogText        String?
  udsCatalogText        String?
  udsAppText            String?
  telegramCatalogUrl    String?
  maxCatalogUrl         String?
  udsCatalogUrl         String?
  udsAppDownloadUrl     String?
  isActive              Boolean  @default(true)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}

model QrCardSettings {
  id                    Int      @id @default(autoincrement())
  title                 String
  description           String
  benefitsText          String?
  footerText            String?
  scheduleText          String?
  giftText              String?
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}

model MediaAsset {
  id                    Int      @id @default(autoincrement())
  type                  String   // logo, hero, store_photo, landmark_photo, qr_card_background
  title                 String?
  url                   String
  altText               String?
  sortOrder             Int      @default(0)
  isActive              Boolean  @default(true)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}

model ContactSettings {
  id                      Int      @id @default(autoincrement())
  phone                   String?
  whatsappUrl             String?
  websiteUrl              String?
  udsUrl                  String?  // UDS — скидка / бонусы
  telegramBotUrl          String?  // Telegram-бот — скидка
  maxBotUrl               String?  // MAX-бот — скидка
  telegramChannelUrl      String?  // Telegram-канал
  maxChannelUrl           String?  // MAX-канал
  udsAppDownloadUrl       String?  // приложение UDS (общая ссылка)
  contactButtonText       String?
  telegramChannelButtonText String?
  maxChannelButtonText    String?
  whatsappButtonText      String?
  websiteButtonText       String?
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt
}

model WorkScheduleDay {
  id                    Int      @id @default(autoincrement())
  dayOfWeek             Int      // 1=Mon … 7=Sun
  isWorking             Boolean  @default(true)
  openTime1             String?
  closeTime1            String?
  openTime2             String?
  closeTime2            String?
  note                  String?
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  @@unique([dayOfWeek])
}

model SpecialDay {
  id                    Int      @id @default(autoincrement())
  date                  String   // YYYY-MM-DD
  status                String
  title                 String?
  description           String?
  locationName          String?
  address               String?
  landmark              String?
  openTime1             String?
  closeTime1            String?
  openTime2             String?
  closeTime2            String?
  yandexMapsUrl         String?
  yandexNavigatorUrl    String?
  twoGisUrl             String?
  googleMapsUrl         String?
  schemeImageUrl        String?
  schemeImageCaption    String?
  isActive              Boolean  @default(true)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  @@index([date, isActive])
}

model VisitEvent {
  id                    Int      @id @default(autoincrement())
  partnerId             Int?
  partner               Partner? @relation(fields: [partnerId], references: [id])
  eventType             String
  sessionId             String?  // visit_sid из cookie
  userAgent             String?
  ipHash                String?
  createdAt             DateTime @default(now())

  @@index([createdAt])
  @@index([partnerId, eventType, createdAt])
}
```

---

## 22. Singleton-настройки

Таблицы с **ровно одной записью** (`id = 1`), создаётся в seed:

- `LandingSettings`
- `ButtonSettings`
- `MapSettings`
- `CatalogSettings`
- `QrCardSettings`
- `ContactSettings`

Формы админки: редактирование без списка, кнопка «Сохранить».

**Не singleton:** `Partner`, `WorkScheduleDay` (7 записей), `SpecialDay`, `VisitEvent`, `MediaAsset` (0..n).

---

## 23. Функция графика `getTodayWorkStatus`

```ts
getTodayWorkStatus(context?: { partnerId?: number }): WorkStatusResult
```

**Алгоритм:**

1. `today =` локальная дата в `APP_TIMEZONE`; `now =` локальное время.
2. Найти `SpecialDay` где `date === today` AND `isActive`.
3. Если найден:
   - если `status === 'closed'` → вернуть `status: 'closed'` (интервалы игнорировать);
   - иначе взять интервалы, адрес, landmark, схему из `SpecialDay`.
4. Иначе взять `WorkScheduleDay` по `dayOfWeek` (1–7).
5. Если `isWorking === false` → `closed`.
6. Определить `status`:
   - `now < openTime1` → `before_open`;
   - `openTime1 ≤ now ≤ closeTime1` (или во 2-м интервале) → `open`;
   - `closeTime1 < now < openTime2` (при двух интервалах) → `break`;
   - `now > closeTime2` (или после единственного интервала) → `closed`.
7. Собрать `title` / `description` из `LandingSettings` через `replaceTemplateVars()`.
8. Вернуть:

```ts
{
  status: 'open' | 'break' | 'before_open' | 'closed',
  title: string,
  description: string,
  todaySchedule: string,  // напр. "10:00–14:00, 15:00–20:00"
  address: string,
  landmark: string | null,
  nextOpenTime?: string,  // для шаблонов
  closeTime?: string,
}
```

**Unit-тесты (обязательно в MVP):** границы 14:00, 14:59, 15:00; один интервал (понедельник); `SpecialDay` closed; выходной день.

---

## 24. Формат полного графика

Функция `formatFullSchedule(days: WorkScheduleDay[])`:

- группирует дни недели с **одинаковыми** `openTime1/closeTime1/openTime2/closeTime2` и `isWorking`;
- выводит, например: «Вторник, среда, четверг, воскресенье: 10:00–14:00, 15:00–20:00»;
- под группой — `note`, если есть (например «перерыв 14:00–15:00»);
- **не хардкодить** названия групп дней в компонентах.

При активном `SpecialDay` блок графика начинается с: `Важно на сегодня: [description]`.

---

## 25. Переменные в текстах

`replaceTemplateVars(text, context)`:

| Переменная | Источник |
|------------|----------|
| `[partner_name]` | `Partner.name` или пусто |
| `[store_name]` | `MapSettings.storeName` |
| `[address]` | актуальный адрес (SpecialDay → MapSettings) |
| `[landmark]` | актуальный ориентир |
| `[today_schedule]` | форматированное время на сегодня |
| `[work_status]` | `title` текущего статуса |
| `[next_open_time]` | ближайшее время открытия сегодня |
| `[close_time]` | время закрытия сегодня (последний интервал) |

**Правило:** пользовательские фразы на лендинге и в админ-превью — только из БД (исключение: seed и служебные fallback для 404, тоже хранимые в `LandingSettings.notFound*`).

**Пример seed для `breakStatusText`:**

```
Откроемся сегодня в [next_open_time]. Работаем до [close_time].
```

---

## 26. События и статистика

**Запись:** `POST /api/events` с телом `{ eventType, partnerId?, sessionId? }`.

**Cookie `visit_sid`:** UUID, max-age 30 дней, выставляется на лендинге при первом визите.

**Debounce `page_open`:** не более **1** события на пару `(partnerId | null, visit_sid)` за **30 минут**.

**`click_discount`:** при **первом** раскрытии аккордеона скидки — один раз на `visit_sid` (повторные toggle не пишут).

**Боты:** не записывать события, если `User-Agent` содержит `bot`, `crawler`, `spider` (регистронезависимо).

**IP:** хранить только `ipHash = SHA-256(ip + IP_HASH_SALT)` или не хранить; восстановление IP запрещено.

**Футер лендинга** (`LandingSettings.privacyFooterText`, seed):

```
Мы учитываем обезличенную статистику посещений для улучшения сервиса.
```

---

## 27. QR-коды

- URL: `{BASE_URL}/gift/{slug}`  
- `GET /api/partners/[id]/qr` → `image/png` (библиотека `qrcode`)  
- В админке партнёра: «Скопировать ссылку», «Скачать QR PNG»

**Позже:** SVG, карточки A6/A5 для печати.

---

## 28. Валидация slug

- символы: `a-z`, `0-9`, `-` (латиница, нижний регистр);
- длина: 3–50;
- уникальность в БД;
- при создании партнёра — автогенерация из `name` (транслитерация), с возможностью ручной правки;
- зарезервированные slug запретить: `admin`, `api`, `gift`, `new`, `edit`.

---

## 29. Seed-данные

### Partner

| Поле | Значение |
|------|----------|
| name | Гостиница Морская |
| slug | morskaya |
| partnerType | hotel |
| telegramBotLink | https://t.me/AssistentEcoNext_bot?start=hotel_morskaya |
| udsLink, maxBotLink, telegramChannelLink, maxChannelLink | пусто |
| isActive | true |

### LandingSettings (фрагмент)

- `heroTitle`: 🎁 Подарок гостям отеля  
- `heroSubtitle`: Получите скидку или бонусы EcoNext и посмотрите, как к нам добраться.  
- `heroDescription`: Полотенца, коврики и салфетки из микрофибры для моря, дома и подарков.  
- `partnerLineTemplate`: Специально для гостей: [partner_name]  
- `breakStatusText`: Откроемся сегодня в [next_open_time]. Работаем до [close_time].  
- `privacyFooterText`: Мы учитываем обезличенную статистику посещений для улучшения сервиса.  

(Остальные поля — по разделам 11–14, 20.)

### ButtonSettings, MapSettings, CatalogSettings, QrCardSettings, ContactSettings

Стартовые тексты и кнопки — как в исходном ТЗ; **все URL** (UDS, боты, каналы, WhatsApp, сайт, карты, приложение UDS) в seed — **пустые**, кроме `telegramBotLink` у демо-партнёра `morskaya`. После первого запуска ссылки задаются только в админке.

### WorkScheduleDay

7 записей (`dayOfWeek` 1–7) — график из §12.

### Команды

```bash
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

---

## 30. Дизайн

- Чистый, mobile-first, зелёно-белый.  
- Акцент подарка: жёлтый / золотой.  
- Кнопки: `min-height: 48px`, `border-radius: 14–20px`, `font-size: 16–18px`.  
- CSS-переменные в `globals.css`: `--color-primary`, `--color-accent`, `--color-muted`.

---

## 31. MVP и отложенное

### Обязательно в MVP

1. `/gift/[partnerSlug]` и `/`  
2. Админка со всеми разделами  
3. Сессия админки (cookie + middleware)  
4. Партнёры, QR PNG, slug-валидация  
5. Все тексты и **все внешние ссылки** из БД (§15), без URL в компонентах  
6. График + `getTodayWorkStatus` + особые дни + `APP_TIMEZONE`  
7. Схема через `MapSettings` / `SpecialDay`  
8. Загрузка изображений  
9. Статистика с debounce и фильтрами  
10. Mobile-first  

### Позже (README / техдолг)

| Тема | Действие |
|------|----------|
| SQLite → PostgreSQL | смена `DATABASE_URL` |
| AdminUser + bcrypt | замена env-пароля |
| A6/A5 PDF | `@react-pdf/renderer` + `QrCardSettings` |
| Excel / CSV | экспорт `VisitEvent` |
| Кэш настроек | `unstable_cache` ~60s |
| E2E | Playwright: `/gift/morskaya`, клик Telegram |
| UDS API, комиссии, ЛК гостиницы | вне MVP |

---

## 32. Правила разработки

1. **Нет хардкода текстов** в UI-компонентах лендинга.  
2. **Нет хардкода ссылок** — все URL по §15 (`resolveLink`, поля Prisma).  
3. Все данные — Prisma + seed (seed — единственное место стартовых URL).  
4. Singleton — всегда `id = 1`.  
5. Схема прохода — только `MapSettings` / `SpecialDay`, не `MediaAsset`.  
6. Локальный запуск: `.env` из `.env.example` (`BASE_URL` — не ссылка на кнопке).  
7. Тесты на `getTodayWorkStatus` — в MVP.  
8. Code review: поиск по репозиторию `https://t.me`, `t.me/`, `uds.app`, `2gis`, `yandex` в `app/` и `components/` — допустим только в seed, тестах-фикстурах и валидации URL.

---

## 33. Итоговая схема продукта

```
Гостиница получает QR ({BASE_URL}/gift/{slug})
    → Гость сканирует
    → Лендинг (партнёр или /)
    → Статус, адрес, схема, скидка, ассортимент, маршрут
    → UDS / Telegram / MAX / карты
    → VisitEvent в админке (/admin/stats)
```

---

## Краткий промпт для реализации

> Создай проект по ТЗ v1.2. Next.js App Router, TypeScript, Tailwind, Prisma, SQLite. Mobile-first QR-лендинг EcoNext: `/gift/[slug]` и `/`. Все ссылки (UDS, TG/MAX боты и каналы, WhatsApp, сайт, карты, приложение UDS) — только из БД и админки, `resolveLink`, без URL в компонентах. Админка: contacts, catalog, maps, partners. Seed: morskaya с telegramBotLink. Unit-тесты графика.

---

*Версия 1.2: реестр ссылок §15, поля ботов/каналов в Prisma, запрет хардкода URL в коде.*
