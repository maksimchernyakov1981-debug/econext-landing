import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { PartnerEditor } from "./PartnerEditor";
import { env } from "@/lib/env";

export default async function EditPartnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const partner = await prisma.partner.findUnique({
    where: { id: Number(id) },
  });
  if (!partner) notFound();

  const base = env.baseUrl().replace(/\/$/, "");
  const landingUrl = `${base}/gift/${partner.slug}`;

  return (
    <AdminShell title={partner.name}>
      <PartnerEditor partner={partner} landingUrl={landingUrl} qrUrl={`/api/partners/${partner.id}/qr`} />
    </AdminShell>
  );
}
