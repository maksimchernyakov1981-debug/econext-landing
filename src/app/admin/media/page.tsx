import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { MediaForm } from "./MediaForm";

export default async function MediaPage() {
  await requireAdmin();
  const items = await prisma.mediaAsset.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <AdminShell title="Фото и изображения">
      <MediaForm />
      <ul className="mt-6 space-y-2 text-sm">
        {items.map((m) => (
          <li key={m.id} className="border rounded-lg p-2">
            {m.type}: {m.title ?? m.url} {m.isActive ? "✅" : "—"}
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
