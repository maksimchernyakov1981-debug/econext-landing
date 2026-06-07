import { requireAdmin } from "@/lib/auth";
import { getAdminMedia } from "@/lib/admin-data";
import { AdminShell } from "@/components/admin/AdminShell";
import { MediaAdmin } from "./MediaAdmin";

export default async function MediaPage() {
  await requireAdmin();
  const items = await getAdminMedia();

  return (
    <AdminShell title="Фото и видео точки">
      <MediaAdmin items={items} />
    </AdminShell>
  );
}
