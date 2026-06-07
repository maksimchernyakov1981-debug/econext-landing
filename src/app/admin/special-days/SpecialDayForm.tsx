"use client";

import { RecordForm } from "@/components/admin/RecordForm";
import { SPECIAL_DAY_STATUS_OPTIONS } from "@/lib/special-day-status";
import { saveSpecialDay, deleteSpecialDay } from "../actions";

const fields = [
  { name: "date", label: "Дата (YYYY-MM-DD)", type: "date" as const },
  {
    name: "status",
    label: "Статус",
    type: "select" as const,
    options: SPECIAL_DAY_STATUS_OPTIONS,
  },
  { name: "title", label: "Название" },
  { name: "description", label: "Описание", type: "textarea" as const },
  { name: "locationName", label: "Место" },
  { name: "address", label: "Адрес", type: "textarea" as const },
  { name: "landmark", label: "Ориентир" },
  { name: "openTime1", label: "Открытие 1" },
  { name: "closeTime1", label: "Закрытие 1" },
  { name: "openTime2", label: "Открытие 2" },
  { name: "closeTime2", label: "Закрытие 2" },
  { name: "yandexMapsUrl", label: "Яндекс Карты" },
  { name: "yandexNavigatorUrl", label: "Яндекс Навигатор" },
  { name: "twoGisUrl", label: "2ГIS" },
  { name: "googleMapsUrl", label: "Google Maps" },
  { name: "schemeImageUrl", label: "URL схемы" },
  { name: "schemeImageCaption", label: "Подпись схемы" },
  { name: "isActive", label: "Активен", type: "checkbox" as const },
];

export function SpecialDayForm() {
  return (
    <RecordForm
      fields={fields}
      initial={{ isActive: true, status: "main_point" }}
      action={(data) => saveSpecialDay(null, data)}
      submitLabel="Добавить особый день"
    />
  );
}
