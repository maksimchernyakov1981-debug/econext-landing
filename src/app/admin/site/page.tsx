import { requireAdmin } from "@/lib/auth";
import { getAdminSettings } from "@/lib/admin-data";
import { AdminShell } from "@/components/admin/AdminShell";
import { RecordForm } from "@/components/admin/RecordForm";
import { resolvePublicSiteUrl } from "@/lib/public-site-url";
import { updateSite } from "../actions";

const fields = [
  {
    name: "publicSiteUrl",
    label: "Основной домен сайта",
    type: "url" as const,
  },
];

export default async function SitePage() {
  await requireAdmin();
  const { site } = await getAdminSettings();
  const activeUrl = await resolvePublicSiteUrl();

  return (
    <AdminShell title="Сайт и домен">
      <p className="text-sm text-muted mb-4">
        Публичный адрес для QR-кодов и ссылок. Укажите основной домен без слэша в конце, например{" "}
        <code className="text-xs">https://econext-landing.vercel.app</code>. Если поле пустое —
        используется <code className="text-xs">BASE_URL</code> из переменных окружения.
      </p>
      <p className="text-sm bg-green-50 border border-green-100 rounded-xl p-3 mb-4">
        <strong>Сейчас активен:</strong>{" "}
        <a href={activeUrl} target="_blank" rel="noreferrer" className="text-primary underline break-all">
          {activeUrl}
        </a>
      </p>
      <RecordForm
        fields={fields}
        initial={(site ?? { publicSiteUrl: "" }) as unknown as Record<string, unknown>}
        action={updateSite}
      />
    </AdminShell>
  );
}
