import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { RecordForm } from "@/components/admin/RecordForm";
import { updateContacts } from "../actions";

const fields = [
  { name: "phone", label: "Телефон" },
  { name: "udsUrl", label: "UDS (скидка)" },
  { name: "telegramBotUrl", label: "Telegram-бот (скидка)" },
  { name: "maxBotUrl", label: "MAX-бот (скидка)" },
  { name: "telegramChannelUrl", label: "Telegram-канал" },
  { name: "maxChannelUrl", label: "MAX-канал" },
  { name: "whatsappUrl", label: "WhatsApp" },
  { name: "websiteUrl", label: "Сайт" },
  { name: "udsAppDownloadUrl", label: "Скачать приложение UDS" },
  { name: "contactButtonText", label: "Текст кнопки телефона" },
  { name: "telegramChannelButtonText", label: "Текст кнопки TG-канал" },
  { name: "maxChannelButtonText", label: "Текст кнопки MAX-канал" },
  { name: "whatsappButtonText", label: "Текст кнопки WhatsApp" },
  { name: "websiteButtonText", label: "Текст кнопки сайт" },
];

export default async function ContactsPage() {
  await requireAdmin();
  const row = await prisma.contactSettings.findFirstOrThrow({ where: { id: 1 } });
  return (
    <AdminShell title="Контакты и ссылки">
      <RecordForm fields={fields} initial={row as unknown as Record<string, unknown>} action={updateContacts} />
    </AdminShell>
  );
}
