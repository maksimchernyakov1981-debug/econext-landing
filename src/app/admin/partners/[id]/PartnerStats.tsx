import { getPartnerStats, type StatsPeriod } from "@/lib/stats";
import { eventLabel, STATS_PERIOD_LABELS } from "@/lib/event-labels";

const HIGHLIGHT_KEYS = ["page_open", "click_gift_cta", "click_discount", "click_route"] as const;

export async function PartnerStats({
  partnerId,
  partnerName,
}: {
  partnerId: number;
  partnerName: string;
}) {
  const periods: StatsPeriod[] = ["today", "7d", "30d", "all"];
  const summaries = await Promise.all(
    periods.map(async (p) => ({ period: p, stats: await getPartnerStats(partnerId, p) }))
  );
  const today = summaries.find((s) => s.period === "today")!.stats;
  const allTime = summaries.find((s) => s.period === "all")!.stats;

  return (
    <section className="p-4 bg-white rounded-2xl border space-y-4">
      <div>
        <h2 className="font-semibold">Статистика партнёра</h2>
        <p className="text-sm text-muted mt-1">
          Открытия и клики только по ссылке{" "}
          <code className="text-xs">/gift/…</code> для «{partnerName}»
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl bg-cyan-50 border border-cyan-100 p-3 text-center">
          <p className="text-2xl font-bold text-cyan-900">{today.page_open}</p>
          <p className="text-xs text-muted mt-1">Открытий сегодня</p>
        </div>
        <div className="rounded-xl bg-cyan-50/60 border border-cyan-100 p-3 text-center">
          <p className="text-2xl font-bold text-cyan-900">{allTime.page_open}</p>
          <p className="text-xs text-muted mt-1">Открытий всего</p>
        </div>
        <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 text-center">
          <p className="text-2xl font-bold text-amber-900">{today.click_gift_cta}</p>
          <p className="text-xs text-muted mt-1">Кнопка подарка сегодня</p>
        </div>
        <div className="rounded-xl bg-green-50 border border-green-100 p-3 text-center">
          <p className="text-2xl font-bold text-green-900">{today.click_route}</p>
          <p className="text-xs text-muted mt-1">Маршрут сегодня</p>
        </div>
      </div>

      {summaries.map(({ period, stats }) => {
        const entries = Object.entries(stats).filter(([, n]) => n > 0);
        const sorted = [
          ...HIGHLIGHT_KEYS.filter((k) => (stats[k] ?? 0) > 0).map((k) => [k, stats[k]] as const),
          ...entries.filter(([k]) => !HIGHLIGHT_KEYS.includes(k as (typeof HIGHLIGHT_KEYS)[number])),
        ];

        return (
          <div key={period}>
            <h3 className="text-sm font-medium text-muted mb-2">
              {STATS_PERIOD_LABELS[period]}
            </h3>
            <ul className="text-sm space-y-1">
              {sorted.map(([key, n]) => (
                <li key={key} className="flex justify-between gap-2">
                  <span>{eventLabel(key)}</span>
                  <span className="font-medium">{n}</span>
                </li>
              ))}
              {sorted.length === 0 && <li className="text-muted">Нет событий</li>}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
