# Архив: предложения по улучшению ТЗ

**Статус:** интегрировано в [TZ-EcoNext-Landing.md](./TZ-EcoNext-Landing.md) **версия 1.2** (2026-06-03).

**v1.2 дополнительно:** §15 «Управление ссылками» — все URL только из админки/БД.

Этот файл сохранён как история обсуждения. Для разработки использовать **только** основное ТЗ v1.1.

---

## Что перенесено в основное ТЗ

| # | Тема |
|---|------|
| 1 | `APP_TIMEZONE`, календарный «сегодня» |
| 2 | `SpecialDay.date` → `String` YYYY-MM-DD |
| 3 | `public/uploads`, лимиты, форматы |
| 4 | Cookie `admin_session`, middleware, «Выйти» |
| 5 | 404 / редирект неактивного партнёра |
| 6 | Универсальный `/` и статистика без партнёра |
| 7 | Алгоритм `break`, unit-тесты |
| 8 | `[next_open_time]`, `[close_time]` |
| 9 | Singleton `id = 1` |
| 10 | API routes |
| 11 | Debounce `page_open`, `visit_sid`, rate limit, боты |
| 12 | Индексы Prisma, `@@unique([dayOfWeek])` |
| 13 | Валидация slug |
| 14 | Приоритет текстов партнёра |
| 15 | Схема только в MapSettings / SpecialDay |
| 16 | `formatFullSchedule()` |
| 17 | `click_discount` один раз за сессию |
| 18 | `.env.example` |
| 19–22 | UX админки (превью, toast, modal, mobile) |
| 23–24 | Пароль production, privacy footer, `ipHash` |
| 25+ | Техдолг в §30 основного ТЗ |

---

## Приоритеты (выполнено в v1.1)

- **P0** — timezone, date, uploads, session, partner 404 → в основном ТЗ  
- **P1** — API, slug, break, template vars → в основном ТЗ  
- **P2** — debounce, preview, schedule grouping → в основном ТЗ  
- **P3** — PDF, Postgres, Excel → §30 «Позже»
