import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { env } from "@/lib/env";

export default async function PartnersPage() {
  await requireAdmin();
  const partners = await prisma.partner.findMany({ orderBy: { name: "asc" } });
  const base = env.baseUrl().replace(/\/$/, "");

  return (
    <AdminShell title="Партнёры / гостиницы">
      <Link
        href="/admin/partners/new"
        className="inline-block mb-4 px-4 py-2 bg-primary text-white rounded-xl"
      >
        + Добавить
      </Link>
      <ul className="space-y-3">
        {partners.map((p) => (
          <li key={p.id} className="bg-white border rounded-xl p-4">
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-muted">/{p.slug}</div>
            <div className="text-xs mt-1">{p.isActive ? "✅ активен" : "⛔ отключён"}</div>
            <div className="flex flex-wrap gap-2 mt-2 text-sm">
              <Link href={`/admin/partners/${p.id}`} className="text-primary underline">
                Редактировать
              </Link>
              <a
                href={`${base}/gift/${p.slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline"
              >
                Лендинг
              </a>
            </div>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
