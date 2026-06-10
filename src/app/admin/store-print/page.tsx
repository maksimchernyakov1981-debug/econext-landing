import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function StorePrintPage() {
  await requireAdmin();

  return (
    <AdminShell title="Листовка для точки">
      <section className="p-4 bg-white border rounded-xl space-y-3">
        <h2 className="font-semibold">Витрина в павильоне EcoNext</h2>
        <p className="text-sm text-muted">
          Тот же текст, что на листовках для гостиниц, но <strong>без QR, адреса и телефона</strong> —
          для размещения прямо на торговой точке. Тексты обновляются вместе с{" "}
          <code className="text-xs">offer-texts.ts</code> при деплое.
        </p>
        <div className="flex flex-wrap gap-2 text-sm">
          <a
            href="/admin/store-print/print?format=a4"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 bg-primary text-white rounded-lg"
          >
            Печать A4
          </a>
          <a
            href="/admin/store-print/print?format=a6"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 border rounded-lg"
          >
            Печать A6 ×2
          </a>
        </div>
      </section>

      <p className="text-sm text-muted mt-4">
        Листовки для гостиниц и кафе — в разделе{" "}
        <a href="/admin/partners" className="text-primary underline">
          Партнёры
        </a>
        . Универсальный QR на лендинг — в разделе{" "}
        <a href="/admin/qr" className="text-primary underline">
          QR
        </a>
        .
      </p>
    </AdminShell>
  );
}
