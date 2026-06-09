import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getAdminSettings } from "@/lib/admin-data";
import { AdminShell } from "@/components/admin/AdminShell";
import { RecordForm } from "@/components/admin/RecordForm";
import { mainLandingUrlAsync } from "@/lib/public-site-url";
import { updateQr } from "../actions";

const fields = [
  { name: "title", label: "Заголовок" },
  { name: "description", label: "Описание", type: "textarea" as const },
  { name: "benefitsText", label: "Преимущества", type: "textarea" as const },
  { name: "footerText", label: "Текст под QR", type: "textarea" as const },
  { name: "scheduleText", label: "Текст про график" },
  { name: "giftText", label: "Текст про подарок (от 1500 ₽ на точке)" },
  { name: "printFooterHint", label: "Подпись внизу листа печати", type: "textarea" as const },
];

export default async function QrPage() {
  await requireAdmin();
  const { qr: row } = await getAdminSettings();
  const mainUrl = await mainLandingUrlAsync();

  return (
    <AdminShell title="QR и печать">
      <section className="mb-6 p-4 bg-white border rounded-xl space-y-3">
        <h2 className="font-semibold">Универсальный лендинг (без партнёра)</h2>
        <p className="text-sm text-muted">
          QR ведёт на главную <code>/</code> — без названия гостиницы или кафе на листовке. Домен
          настраивается в разделе <Link href="/admin/site" className="text-primary underline">Сайт</Link>.
        </p>
        <p className="text-sm break-all">
          <a href={mainUrl} target="_blank" rel="noreferrer" className="text-primary underline">
            {mainUrl}
          </a>
        </p>
        <div className="flex flex-wrap gap-2 text-sm">
          <a href="/api/qr/main" download className="px-3 py-2 bg-primary text-white rounded-lg">
            Скачать QR PNG
          </a>
          <a
            href="/admin/qr/print?format=a6"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 border rounded-lg"
          >
            Печать A6
          </a>
          <a
            href="/admin/qr/print?format=a8"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 border rounded-lg"
          >
            Печать A8
          </a>
        </div>
      </section>

      <p className="text-sm text-muted mb-4">
        Тексты листовок для партнёров — в карточке каждой организации (раздел Партнёры). Там же
        скачать QR и печать A4/A6 с названием места.
      </p>
      <RecordForm fields={fields} initial={row as unknown as Record<string, unknown>} action={updateQr} />
    </AdminShell>
  );
}
