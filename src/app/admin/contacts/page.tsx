import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { RecordForm } from "@/components/admin/RecordForm";
import { getAdminSettings } from "@/lib/admin-data";
import { updateContacts } from "../actions";

const fields = [
  { name: "phone", label: "Телефон" },
  { name: "udsUrl", label: "Наше приложение (скидка)" },
  { name: "telegramBotUrl", label: "Telegram-бот (скидка)" },
  { name: "maxBotUrl", label: "MAX-бот (скидка)" },
  { name: "telegramChannelUrl", label: "Telegram-канал" },
  { name: "maxChannelUrl", label: "MAX-канал" },
  { name: "whatsappUrl", label: "WhatsApp" },
  { name: "websiteUrl", label: "Сайт" },
  { name: "udsAppDownloadUrl", label: "Скачать наше приложение" },
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
        Общие ссылки приложение / Telegram / MAX для главного лендинга и как запасной вариант, если у
        партнёра свои ссылки не заданы. Домен сайта — в разделе <strong>Сайт</strong>. Можно вводить{" "}
        <code className="text-xs">t.me/бот</code> — https:// добавится сам.
      </p>
      <RecordForm fields={fields} initial={row as unknown as Record<string, unknown>} action={updateContacts} />
    </AdminShell>
  );
}
