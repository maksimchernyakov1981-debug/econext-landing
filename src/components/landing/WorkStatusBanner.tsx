import type { WorkStatusResult } from "@/lib/schedule/types";

const statusStyles: Record<
  WorkStatusResult["status"],
  { border: string; bg: string }
> = {
  open: { border: "border-green-200", bg: "bg-green-50/80" },
  break: { border: "border-amber-200", bg: "bg-amber-50/80" },
  before_open: { border: "border-amber-200", bg: "bg-amber-50/80" },
  closed: { border: "border-red-200", bg: "bg-red-50/60" },
};

export function WorkStatusBanner({ workStatus }: { workStatus: WorkStatusResult }) {
  const style = statusStyles[workStatus.status];

  return (
    <section
      className={`rounded-2xl border p-4 mb-4 ${style.border} ${style.bg}`}
    >
      <p className="font-bold text-gray-900">{workStatus.title}</p>
      {workStatus.description && (
        <p className="text-sm text-gray-700 mt-1">{workStatus.description}</p>
      )}
      {workStatus.specialNote && (
        <p className="text-sm text-amber-800 mt-2">{workStatus.specialNote}</p>
      )}
    </section>
  );
}
