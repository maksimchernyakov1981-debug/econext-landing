import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatsView } from "./StatsView";

export default async function StatsPage() {
  await requireAdmin();
  const partners = await prisma.partner.findMany({ orderBy: { name: "asc" } });
  return (
    <AdminShell title="Статистика">
      <StatsView partners={partners.map((p) => ({ id: p.id, name: p.name }))} />
    </AdminShell>
  );
}
