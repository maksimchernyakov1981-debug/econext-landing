import { PARTNER_TYPE_OPTIONS } from "@/lib/partner-print";

export const partnerFields = [
  { name: "name", label: "Название партнёра" },
  { name: "slug", label: "Slug (латиница, для ссылки /gift/slug)" },
  {
    name: "partnerType",
    label: "Тип места (для текста на листовке)",
    type: "select" as const,
    options: [...PARTNER_TYPE_OPTIONS],
  },
  { name: "contactName", label: "Контактное лицо (только для админки)" },
  { name: "comment", label: "Комментарий", type: "textarea" as const },
  { name: "udsLink", label: "UDS — только для этого партнёра" },
  { name: "telegramBotLink", label: "Telegram-бот — только для этого партнёра" },
  { name: "maxBotLink", label: "MAX-бот — только для этого партнёра" },
  { name: "customHeroTitle", label: "Заголовок hero (необязательно)" },
  { name: "customHeroSubtitle", label: "Подзаголовок hero" },
  { name: "customHeroDescription", label: "Описание hero", type: "textarea" as const },
  {
    name: "customGiftText",
    label: "Текст про подарок (лендинг и печать)",
    type: "textarea" as const,
  },
  {
    name: "customQrText",
    label: "Доп. строка на листовке (необязательно)",
    type: "textarea" as const,
  },
  { name: "isActive", label: "Активен", type: "checkbox" as const },
];
