import { requireAdmin } from "@/lib/auth";
import { getAdminPartners } from "@/lib/admin-data";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatsView } from "./StatsView";

export default async function StatsPage() {
  await requireAdmin();
  const partners = await getAdminPartners();
  return (
    <AdminShell title="Статистика">
      <StatsView partners={partners.map((p) => ({ id: p.id, name: p.name }))} />
    </AdminShell>
  );
}
