import { getPartnerStats, type StatsPeriod } from "@/lib/stats";
import { eventLabel, STATS_PERIOD_LABELS } from "@/lib/event-labels";

export async function PartnerStats({ partnerId }: { partnerId: number }) {
  const periods: StatsPeriod[] = ["today", "7d", "30d", "all"];
  const summaries = await Promise.all(
    periods.map(async (p) => ({ period: p, stats: await getPartnerStats(partnerId, p) }))
  );

  return (
    <section className="p-4 bg-white rounded-2xl border space-y-4">
      <h2 className="font-semibold">Статистика партнёра</h2>
      {summaries.map(({ period, stats }) => (
        <div key={period}>
          <h3 className="text-sm font-medium text-muted mb-2">
            {STATS_PERIOD_LABELS[period]}
          </h3>
          <ul className="text-sm space-y-1">
            {Object.entries(stats)
              .filter(([, n]) => n > 0)
              .map(([key, n]) => (
                <li key={key} className="flex justify-between gap-2">
                  <span>{eventLabel(key)}</span>
                  <span className="font-medium">{n}</span>
                </li>
              ))}
            {Object.values(stats).every((n) => n === 0) && (
              <li className="text-muted">Нет событий</li>
            )}
          </ul>
        </div>
      ))}
    </section>
  );
}
