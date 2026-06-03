import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { RecordForm } from "@/components/admin/RecordForm";
import { updateButtons } from "../actions";

const fields = Object.keys({
  backButtonText: "",
  discountButtonText: "",
  catalogButtonText: "",
  routeButtonText: "",
  scheduleButtonText: "",
  udsButtonText: "",
  telegramButtonText: "",
  maxButtonText: "",
  catalogTelegramButtonText: "",
  catalogMaxButtonText: "",
  catalogUdsButtonText: "",
  catalogUdsAppButtonText: "",
  yandexMapsButtonText: "",
  yandexNavigatorButtonText: "",
  twoGisButtonText: "",
  googleMapsButtonText: "",
}).map((name) => ({ name, label: name }));

export default async function ButtonsPage() {
  await requireAdmin();
  const row = await prisma.buttonSettings.findFirstOrThrow({ where: { id: 1 } });
  return (
    <AdminShell title="Кнопки">
      <RecordForm fields={fields} initial={row as unknown as Record<string, unknown>} action={updateButtons} />
    </AdminShell>
  );
}
