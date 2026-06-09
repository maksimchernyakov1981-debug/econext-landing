import { requireAdmin } from "@/lib/auth";
import { getAdminSettings } from "@/lib/admin-data";
import { AdminShell } from "@/components/admin/AdminShell";
import { RecordForm } from "@/components/admin/RecordForm";
import { updateQr } from "../actions";

const fields = [
  { name: "title", label: "Заголовок" },
  { name: "description", label: "Описание", type: "textarea" as const },
  { name: "benefitsText", label: "Преимущества", type: "textarea" as const },
  { name: "footerText", label: "Текст под QR", type: "textarea" as const },
  { name: "scheduleText", label: "Текст про график" },
  { name: "giftText", label: "Текст про подарок (от 1500 ₽ на точке)" },
  { name: "printA4Title", label: "Заголовок листа A4 ([partner_name])" },
  { name: "printA6Title", label: "Заголовок листа A6" },
  { name: "printFooterHint", label: "Подпись внизу листа печати", type: "textarea" as const },
];

export default async function QrPage() {
  await requireAdmin();
  const { qr: row } = await getAdminSettings();
  return (
    <AdminShell title="QR и печать">
      <p className="text-sm text-muted mb-4">
        Листовки A4/A6: заголовок «Что привезти с моря», категории подарков и QR — для каждого
        партнёра свой QR. Подпись места зависит от типа в карточке партнёра (гостиница, кафе,
        магазин…). Доп. строка — в поле «Доп. строка на листовке».
      </p>
      <RecordForm fields={fields} initial={row as unknown as Record<string, unknown>} action={updateQr} />
    </AdminShell>
  );
}
