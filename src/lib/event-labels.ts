/** Русские подписи событий аналитики для админки */
export const EVENT_LABELS: Record<string, string> = {
  page_open: "Открытия лендинга",
  click_gift_cta: "Кнопка «Получить подарок»",
  click_discount: "Клики «скидка»",
  click_uds: "Подключение в приложении",
  click_telegram: "Подключение Telegram",
  click_max: "Подключение MAX",
  click_call: "Звонок",
  click_catalog: "Открытие ассортимента",
  click_catalog_telegram: "Ассортимент — Telegram",
  click_catalog_max: "Ассортимент — MAX",
  click_catalog_uds: "Ассортимент — приложение",
  click_catalog_uds_app: "Скачать наше приложение",
  click_catalog_website: "Ассортимент — сайт",
  click_route: "Открытие маршрута",
  click_yandex_maps: "Яндекс Карты",
  click_yandex_navigator: "Яндекс Навигатор",
  click_2gis: "2ГИС",
  click_google_maps: "Google Maps",
  click_schedule: "Открытие графика",
};

export function eventLabel(eventType: string): string {
  return EVENT_LABELS[eventType] ?? eventType;
}

export const STATS_PERIOD_LABELS: Record<string, string> = {
  today: "Сегодня",
  "7d": "7 дней",
  "30d": "30 дней",
  all: "Всё время",
};
