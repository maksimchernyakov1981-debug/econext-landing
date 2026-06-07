"use client";

import { useRouter } from "next/navigation";
import type { Partner } from "@prisma/client";
import { RecordForm } from "@/components/admin/RecordForm";
import { savePartner, deletePartner } from "../../actions";
import { partnerFields } from "../partnerFields";

export function PartnerEditor({
  partner,
  landingUrl,
  qrUrl,
}: {
  partner: Partner;
  landingUrl: string;
  qrUrl: string;
}) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <p className="text-sm bg-green-50 border border-green-100 rounded-xl p-3">
        <strong>Ссылка лендинга:</strong>{" "}
        <a href={landingUrl} target="_blank" rel="noreferrer" className="text-primary underline break-all">
          {landingUrl}
        </a>
      </p>
      <p className="text-xs text-muted">
        Ссылка и QR ведут на боевой сайт (Vercel), не на localhost. Telegram / MAX / UDS — только для
        этого партнёра. Телефон, сайт, каналы — в разделе Контакты.
      </p>
      <div className="flex flex-wrap gap-2 text-sm">
        <button
          type="button"
          className="px-3 py-2 bg-gray-100 rounded-lg"
          onClick={() => {
            navigator.clipboard.writeText(landingUrl);
            alert("Скопировано");
          }}
        >
          Скопировать ссылку
        </button>
        <a href={qrUrl} className="px-3 py-2 bg-primary text-white rounded-lg">
          Скачать QR PNG
        </a>
        <a
          href={`/admin/partners/${partner.id}/print?format=a4`}
          target="_blank"
          rel="noreferrer"
          className="px-3 py-2 border rounded-lg"
        >
          Печать A4
        </a>
        <a
          href={`/admin/partners/${partner.id}/print?format=a6`}
          target="_blank"
          rel="noreferrer"
          className="px-3 py-2 border rounded-lg"
        >
          Печать A6
        </a>
        <a
          href={landingUrl}
          target="_blank"
          rel="noreferrer"
          className="px-3 py-2 border rounded-lg"
        >
          Открыть лендинг
        </a>
      </div>

      <RecordForm
        fields={partnerFields}
        initial={partner as unknown as Record<string, unknown>}
        action={(data) => savePartner(partner.id, data)}
      />

      <button
        type="button"
        className="text-red-600 text-sm underline"
        onClick={async () => {
          if (!confirm("Удалить партнёра?")) return;
          await deletePartner(partner.id);
          router.push("/admin/partners");
        }}
      >
        Удалить партнёра
      </button>
    </div>
  );
}
