import { requireAdmin } from "@/lib/auth";
import { getAdminSettings } from "@/lib/admin-data";
import { AdminShell } from "@/components/admin/AdminShell";
import { RecordForm } from "@/components/admin/RecordForm";
import { updateCatalog } from "../actions";

const fields = [
  { name: "title", label: "Заголовок" },
  { name: "description", label: "Описание", type: "textarea" as const },
  { name: "telegramCatalogText", label: "Текст Telegram" },
  { name: "maxCatalogText", label: "Текст MAX" },
  { name: "udsCatalogText", label: "Текст UDS" },
  { name: "udsAppText", label: "Текст приложение UDS" },
  { name: "telegramCatalogUrl", label: "Ссылка Telegram-бот ассортимент", type: "url" as const },
  { name: "maxCatalogUrl", label: "Ссылка MAX-бот ассортимент", type: "url" as const },
  { name: "udsCatalogUrl", label: "Ссылка UDS ассортимент", type: "url" as const },
  { name: "udsAppDownloadUrl", label: "Ссылка скачать UDS", type: "url" as const },
  { name: "isActive", label: "Активен", type: "checkbox" as const },
];

export default async function CatalogPage() {
  await requireAdmin();
  const { catalog: row } = await getAdminSettings();
  return (
    <AdminShell title="Ассортимент">
      <RecordForm fields={fields} initial={row as unknown as Record<string, unknown>} action={updateCatalog} />
    </AdminShell>
  );
}
