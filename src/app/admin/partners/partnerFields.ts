import { PARTNER_TYPE_OPTIONS } from "@/lib/partner-print";

/** Поля карточки партнёра: только своё место и ссылки на UDS / Telegram / MAX. */
export const partnerFields = [
  { name: "name", label: "Название организации" },
  { name: "slug", label: "Slug (латиница, для ссылки /gift/slug)" },
  {
    name: "partnerType",
    label: "Тип места (для текста на листовке)",
    type: "select" as const,
    options: [...PARTNER_TYPE_OPTIONS],
  },
  { name: "contactName", label: "Контактное лицо (только для админки)" },
  { name: "comment", label: "Комментарий", type: "textarea" as const },
  { name: "udsLink", label: "UDS — ссылка для гостей этого места" },
  { name: "telegramBotLink", label: "Telegram-бот — для гостей этого места" },
  { name: "maxBotLink", label: "MAX-бот — для гостей этого места" },
  {
    name: "customQrText",
    label: "Маршрут от вашего места (внизу листовки, у адреса)",
    type: "textarea" as const,
  },
  { name: "isActive", label: "Активен", type: "checkbox" as const },
];
