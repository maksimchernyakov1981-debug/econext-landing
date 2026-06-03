import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { AdminShell } from "@/components/admin/AdminShell";
import { getStatsSummary, getTopPartners } from "@/lib/stats";
import { getLandingContext } from "@/lib/landing-data";
import { env } from "@/lib/env";

export default async function AdminPage() {
  const session = await requireAdmin();
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoginForm />
      </div>
    );
  }

  const [stats, top, ctx] = await Promise.all([
    getStatsSummary("today"),
    getTopPartners(7),
    getLandingContext(null),
  ]);

  const warnPassword = env.adminPassword() === "change_me";

  return (
    <AdminShell title="Пульт управления">
      {warnPassword && (
        <p className="mb-4 p-3 bg-amber-100 text-amber-900 rounded-xl text-sm">
          Смените ADMIN_PASSWORD в .env для production
        </p>
      )}

      <section className="grid grid-cols-2 gap-3 mb-6">
        <Stat label="Открытий" value={stats.page_open} />
        <Stat label="UDS" value={stats.click_uds} />
        <Stat label="Маршрут" value={stats.click_route} />
        <Stat label="Telegram" value={stats.click_telegram} />
        <Stat label="MAX" value={stats.click_max} />
      </section>

      <section className="mb-6 p-4 bg-white rounded-2xl border">
        <h2 className="font-semibold mb-2">Сейчас на лендинге</h2>
        <p className="text-sm">{ctx.workStatus.title}</p>
        <p className="text-sm text-muted">{ctx.workStatus.todaySchedule}</p>
        <p className="text-sm mt-1">{ctx.workStatus.address}</p>
      </section>

      <section className="mb-6">
        <h2 className="font-semibold mb-3">Быстрые разделы</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            { href: "/admin/partners", label: "Партнёры / гостиницы" },
            { href: "/admin/landing", label: "Тексты лендинга" },
            { href: "/admin/buttons", label: "Кнопки и ссылки" },
            { href: "/admin/maps", label: "Карты и схема" },
            { href: "/admin/schedule", label: "График работы" },
            { href: "/admin/catalog", label: "Ассортимент" },
            { href: "/admin/qr", label: "QR-карточка" },
            { href: "/admin/contacts", label: "Контакты" },
            { href: "/admin/special-days", label: "Особые дни" },
            { href: "/admin/stats", label: "Статистика" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-3 bg-white border rounded-xl hover:border-primary text-primary font-medium"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="font-semibold mb-2">Топ партнёров (7 дней)</h2>
        <ul className="space-y-1 text-sm">
          {top.map((t) => (
            <li key={t.partner?.id}>
              {t.partner?.name ?? "—"}: {t.count}
            </li>
          ))}
          {top.length === 0 && <li className="text-muted">Нет данных</li>}
        </ul>
      </section>

      <Link href="/" className="text-primary underline text-sm" target="_blank">
        Открыть универсальный лендинг
      </Link>
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl p-3 border text-center">
      <div className="text-2xl font-bold text-primary">{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}
