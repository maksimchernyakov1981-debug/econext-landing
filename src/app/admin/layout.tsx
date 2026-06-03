import { ensureDbReady } from "@/lib/ensure-db";
import { ensureScheduleDaysExist } from "@/lib/ensure-schedule";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await ensureDbReady();
  try {
    await ensureScheduleDaysExist();
  } catch (e) {
    console.error("[admin layout] schedule seed", e);
  }
  return children;
}
