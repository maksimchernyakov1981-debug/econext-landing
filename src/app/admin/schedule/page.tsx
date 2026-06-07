import { requireAdmin } from "@/lib/auth";
import { getAdminSettings } from "@/lib/admin-data";
import { AdminShell } from "@/components/admin/AdminShell";
import { RecordForm } from "@/components/admin/RecordForm";
import { updateScheduleDay } from "../actions";

const DAY_NAMES = ["", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export default async function SchedulePage() {
  await requireAdmin();
  const { scheduleDays } = await getAdminSettings();
  const days = scheduleDays ?? [];

  return (
    <AdminShell title="График работы">
      {days.length === 0 && (
        <p className="text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
          Не удалось загрузить дни. Обновите страницу или нажмите «Сохранить» в любом разделе после
          деплоя.
        </p>
      )}
      <div className="space-y-8">
        {days.map((d) => (
          <section key={d.dayOfWeek} className="bg-white border rounded-xl p-4">
            <h2 className="font-semibold mb-3">{DAY_NAMES[d.dayOfWeek]}</h2>
            <RecordForm
              fields={[
                { name: "isWorking", label: "Рабочий день", type: "checkbox" },
                { name: "openTime1", label: "Открытие 1 (HH:MM)" },
                { name: "closeTime1", label: "Закрытие 1" },
                { name: "openTime2", label: "Открытие 2" },
                { name: "closeTime2", label: "Закрытие 2" },
                { name: "note", label: "Комментарий", type: "textarea" },
              ]}
              initial={d as unknown as Record<string, unknown>}
              action={(data) => updateScheduleDay(d.dayOfWeek, data)}
            />
          </section>
        ))}
      </div>
    </AdminShell>
  );
}
