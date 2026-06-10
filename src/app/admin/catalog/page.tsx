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
  { name: "udsCatalogText", label: "Текст — открыть приложение" },
  { name: "udsAppText", label: "Текст — скачать приложение" },
  { name: "telegramCatalogUrl", label: "Ссылка Telegram-бот ассортимент", type: "url" as const },
  { name: "maxCatalogUrl", label: "Ссылка MAX-бот ассортимент", type: "url" as const },
  { name: "udsCatalogUrl", label: "Ссылка — открыть приложение", type: "url" as const },
  { name: "udsAppDownloadUrl", label: "Ссылка — скачать приложение", type: "url" as const },
  { name: "isActive", label: "Активен", type: "checkbox" as const },
];

export default async function CatalogPage() {
  await requireAdmin();
  const { catalog: row } = await getAdminSettings();
  return (
    <AdminShell title="Ассортимент">
      <p className="text-sm text-muted mb-4">
        Если ссылки здесь пустые, на лендинге подставятся Telegram, MAX и сайт из раздела{" "}
        <strong>Контакты</strong>.
      </p>
      <RecordForm fields={fields} initial={row as unknown as Record<string, unknown>} action={updateCatalog} />
    </AdminShell>
  );
}
