"use client";

import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { RecordForm } from "@/components/admin/RecordForm";
import { savePartner } from "../../actions";
import { partnerFields } from "../partnerFields";

export default function NewPartnerPage() {
  const router = useRouter();
  return (
    <AdminShell title="Новый партнёр">
      <p className="text-sm text-muted mb-4">
        Гостиница, кафе, магазин или другое место — после создания откроется страница со ссылкой{" "}
        <code>/gift/slug</code>, QR и печатью A4/A6. Телефон, сайт и каналы — общие, в разделе{" "}
        <strong>Контакты</strong>.
      </p>
      <RecordForm
        fields={partnerFields}
        initial={{ partnerType: "hotel", isActive: true }}
        action={async (data) => {
          const r = await savePartner(null, data);
          if (!r.error && "partnerId" in r && r.partnerId) {
            router.push(`/admin/partners/${r.partnerId}`);
          }
          return r;
        }}
        submitLabel="Создать партнёра"
      />
    </AdminShell>
  );
}
