import { ensureDbReady } from "@/lib/ensure-db";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await ensureDbReady();
  return children;
}
