import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { RecordForm } from "@/components/admin/RecordForm";
import { getAdminSettings } from "@/lib/admin-data";
import { updateContacts } from "../actions";

const fields = [
  { name: "phone", label: "Телефон" },
  { name: "udsUrl", label: "UDS (скидка)", type: "url" as const },
  { name: "telegramBotUrl", label: "Telegram-бот (скидка)", type: "url" as const },
  { name: "maxBotUrl", label: "MAX-бот (скидка)", type: "url" as const },
  { name: "telegramChannelUrl", label: "Telegram-канал", type: "url" as const },
  { name: "maxChannelUrl", label: "MAX-канал", type: "url" as const },
  { name: "whatsappUrl", label: "WhatsApp", type: "url" as const },
  { name: "websiteUrl", label: "Сайт", type: "url" as const },
  { name: "udsAppDownloadUrl", label: "Скачать приложение UDS", type: "url" as const },
  { name: "contactButtonText", label: "Текст кнопки телефона" },
  { name: "telegramChannelButtonText", label: "Текст кнопки TG-канал" },
  { name: "maxChannelButtonText", label: "Текст кнопки MAX-канал" },
  { name: "whatsappButtonText", label: "Текст кнопки WhatsApp" },
  { name: "websiteButtonText", label: "Текст кнопки сайт" },
];

export default async function ContactsPage() {
  await requireAdmin();
  const { contacts: row } = await getAdminSettings();
  return (
    <AdminShell title="Контакты и ссылки">
      <p className="text-sm text-muted mb-4">
        Ссылки для кнопок «Скидка» на лендинге. Можно вводить{" "}
        <code className="text-xs">t.me/бот</code> — https:// добавится сам.{" "}
        <strong>Сначала «Сохранить»</strong> внизу (дождитесь «Сохранено в облако»), затем
        «Применить на сайте» в шапке.
      </p>
      <RecordForm fields={fields} initial={row as unknown as Record<string, unknown>} action={updateContacts} />
    </AdminShell>
  );
}
