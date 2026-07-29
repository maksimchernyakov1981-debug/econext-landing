import { requireAdmin } from "@/lib/auth";
import { getAdminSettings } from "@/lib/admin-data";
import { AdminShell } from "@/components/admin/AdminShell";
import { RecordForm } from "@/components/admin/RecordForm";
import { updateCatalog } from "../actions";

const fields = [
  { name: "title", label: "Заголовок" },
  { name: "description", label: "Описание", type: "textarea" as const },
  { name: "giftCategoryTitle", label: "Категории подарков — заголовок" },
  {
    name: "giftCategoryDescription",
    label: "Категории подарков — описание",
    type: "textarea" as const,
  },
  { name: "giftForHerTitle", label: "Категория 1 — название" },
  {
    name: "giftForHerItems",
    label: "Категория 1 — товары (каждый с новой строки)",
    type: "textarea" as const,
  },
  { name: "giftHomeTitle", label: "Категория 2 — название" },
  {
    name: "giftHomeItems",
    label: "Категория 2 — товары (каждый с новой строки)",
    type: "textarea" as const,
  },
  { name: "giftAutoTitle", label: "Категория 3 — название" },
  {
    name: "giftAutoItems",
    label: "Категория 3 — товары (каждый с новой строки)",
    type: "textarea" as const,
  },
  {
    name: "giftCategoryCtaText",
    label: "Категории подарков — текст кнопки",
  },
  { name: "telegramCatalogText", label: "Текст Telegram" },
  { name: "maxCatalogText", label: "Текст MAX" },
  { name: "vkCatalogText", label: "Текст VK" },
  { name: "udsCatalogText", label: "Текст — открыть приложение" },
  { name: "udsAppText", label: "Текст — скачать приложение" },
  { name: "telegramCatalogUrl", label: "Ссылка Telegram-бот ассортимент", type: "url" as const },
  { name: "maxCatalogUrl", label: "Ссылка MAX-бот ассортимент", type: "url" as const },
  { name: "vkCatalogUrl", label: "Ссылка VK-бот ассортимент", type: "url" as const },
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
        Если ссылки здесь пустые, на лендинге подставятся Telegram, MAX, VK и сайт из раздела{" "}
        <strong>Контакты</strong>. В списках категорий указывайте один товар на строку.
      </p>
      <RecordForm fields={fields} initial={row as unknown as Record<string, unknown>} action={updateCatalog} />
    </AdminShell>
  );
}
