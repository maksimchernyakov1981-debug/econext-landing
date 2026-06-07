import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getAdminSpecialDays } from "@/lib/admin-data";
import { AdminShell } from "@/components/admin/AdminShell";
import { specialDayStatusLabel } from "@/lib/special-day-status";
import { SpecialDayForm } from "./SpecialDayForm";

export default async function SpecialDaysPage() {
  await requireAdmin();
  const days = await getAdminSpecialDays();

  return (
    <AdminShell title="Особые дни">
      <SpecialDayForm />
      <ul className="mt-8 space-y-3">
        {days.map((d) => (
          <li key={d.id} className="border rounded-xl p-4 bg-white">
            <div className="font-medium">{d.date}</div>
            <div className="text-sm text-muted">
              {specialDayStatusLabel(d.status)} — {d.title}
            </div>
            <Link href={`/admin/special-days?id=${d.id}`} className="text-primary text-sm underline">
              Редактировать (форма выше, загрузите id вручную через список)
            </Link>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
