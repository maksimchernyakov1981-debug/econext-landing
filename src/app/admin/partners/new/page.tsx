"use client";

import { useRouter } from "next/navigation";
import { RecordForm } from "@/components/admin/RecordForm";
import { savePartner } from "../../actions";

export default function NewPartnerPage() {
  const router = useRouter();
  return (
    <RecordForm
      fields={partnerFields}
      initial={{ partnerType: "hotel", isActive: true }}
      action={async (data) => {
        const r = await savePartner(null, data);
        if (r.ok) router.push("/admin/partners");
        return r;
      }}
      submitLabel="Создать"
    />
  );
}

import { partnerFields } from "../partnerFields";