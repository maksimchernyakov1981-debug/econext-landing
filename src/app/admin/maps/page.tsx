import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminSettings } from "@/lib/admin-data";
import { normalizeMapRow } from "@/lib/settings-backup";
import { MapsForm } from "./MapsForm";

export default async function MapsPage() {
  await requireAdmin();
  const { map: row } = await getAdminSettings();
  return (
    <AdminShell title="Карты и схема">
      <MapsForm initial={normalizeMapRow(row)} />
    </AdminShell>
  );
}
