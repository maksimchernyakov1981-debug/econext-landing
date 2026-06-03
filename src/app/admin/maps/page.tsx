import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { MapsForm } from "./MapsForm";

export default async function MapsPage() {
  await requireAdmin();
  const row = await prisma.mapSettings.findFirstOrThrow({ where: { id: 1 } });
  return (
    <AdminShell title="Карты и схема">
      <MapsForm initial={row} />
    </AdminShell>
  );
}
