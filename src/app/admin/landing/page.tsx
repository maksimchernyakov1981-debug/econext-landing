import { requireAdmin } from "@/lib/auth";
import { getAdminSettings } from "@/lib/admin-data";
import { AdminShell } from "@/components/admin/AdminShell";
import { RecordForm } from "@/components/admin/RecordForm";
import { updateLanding } from "../actions";

const fields = [
  { name: "heroTitle", label: "Заголовок", type: "textarea" as const },
  { name: "heroSubtitle", label: "Подзаголовок", type: "textarea" as const },
  { name: "heroDescription", label: "Описание", type: "textarea" as const },
  { name: "partnerLineTemplate", label: "Строка партнёра ([partner_name])" },
  { name: "addressBlockTitle", label: "Заголовок адреса" },
  { name: "addressLabel", label: "Подпись адрес" },
  { name: "landmarkLabel", label: "Подпись ориентир" },
  { name: "schemeBlockTitle", label: "Заголовок схемы" },
  { name: "schemeDefaultCaption", label: "Подпись схемы" },
  { name: "storeMediaBlockTitle", label: "Заголовок блока фото/видео точки" },
  { name: "discountBlockTitle", label: "Заголовок скидки" },
  { name: "discountBlockDescription", label: "Описание скидки", type: "textarea" as const },
  { name: "discountHint", label: "Подсказка UDS" },
  { name: "routeBlockTitle", label: "Заголовок маршрута" },
  { name: "routeBlockDescription", label: "Описание маршрута" },
  { name: "scheduleBlockTitle", label: "Заголовок графика" },
  { name: "scheduleSpecialDayPrefix", label: "Префикс особого дня (график)" },
  { name: "openStatusTitle", label: "Статус: открыто" },
  { name: "breakStatusTitle", label: "Статус: перерыв" },
  { name: "beforeOpenStatusTitle", label: "Статус: скоро откроемся" },
  { name: "closedStatusTitle", label: "Статус: закрыто" },
  { name: "openStatusText", label: "Текст открыто" },
  { name: "breakStatusText", label: "Текст перерыв ([next_open_time]…)" },
  { name: "beforeOpenStatusText", label: "Текст до открытия" },
  { name: "closedStatusText", label: "Текст закрыто", type: "textarea" as const },
  { name: "callPromptText", label: "Текст над кнопкой «Позвонить»", type: "textarea" as const },
  { name: "callButtonText", label: "Текст кнопки «Позвонить»" },
  { name: "privacyFooterText", label: "Футер privacy" },
  { name: "notFoundTitle", label: "404 заголовок" },
  { name: "notFoundDescription", label: "404 описание" },
];

export default async function LandingAdminPage() {
  await requireAdmin();
  const { landing: row } = await getAdminSettings();

  return (
    <AdminShell title="Тексты лендинга">
      <p className="text-sm text-muted mb-4">
        Переменные: [partner_name], [store_name], [address], [landmark], [today_schedule], [work_status], [next_open_time], [close_time]
      </p>
      <RecordForm fields={fields} initial={row as unknown as Record<string, unknown>} action={updateLanding} />
    </AdminShell>
  );
}
