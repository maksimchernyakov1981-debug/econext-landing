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
  { name: "giftText", label: "Текст про подарок" },
];

export default async function QrPage() {
  await requireAdmin();
  const { qr: row } = await getAdminSettings();
  return (
    <AdminShell title="QR-карточка">
      <RecordForm fields={fields} initial={row as unknown as Record<string, unknown>} action={updateQr} />
    </AdminShell>
  );
}
