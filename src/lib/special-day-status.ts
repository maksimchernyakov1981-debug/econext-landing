/** Русские подписи статусов особого дня (значения в БД — на английском) */
export const SPECIAL_DAY_STATUS_LABELS: Record<string, string> = {
  main_point: "Основная точка",
  sanatorium: "На санатории",
  closed: "Закрыто",
  moving: "Переезд",
  custom_location: "Другое место",
};

export function specialDayStatusLabel(status: string): string {
  return SPECIAL_DAY_STATUS_LABELS[status] ?? status;
}

export const SPECIAL_DAY_STATUS_OPTIONS = Object.entries(SPECIAL_DAY_STATUS_LABELS).map(
  ([value, label]) => ({ value, label })
);
