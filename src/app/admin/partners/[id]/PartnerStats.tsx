import { getPartnerStats, type StatsPeriod } from "@/lib/stats";

const LABELS: Record<string, string> = {
  page_open: "Открытия лендинга",
  click_discount: "Клики «скидка»",
  click_uds: "Клики UDS",
  click_telegram: "Клики Telegram",
  click_max: "Клики MAX",
  click_catalog: "Клики ассортимент",
  click_catalog_telegram: "Ассортимент Telegram",
  click_catalog_max: "Ассортимент MAX",
  click_catalog_uds: "Ассортимент UDS",
  click_catalog_uds_app: "Скачать UDS",
  click_catalog_website: "Ассортимент — сайт",
  click_route: "Клики маршрут",
  click_yandex_maps: "Яндекс Карты",
  click_yandex_navigator: "Яндекс Навигатор",
  click_2gis: "2ГИС",
  click_google_maps: "Google Maps",
  click_schedule: "Клики график",
};

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
            {period === "today"
              ? "Сегодня"
              : period === "7d"
                ? "7 дней"
                : period === "30d"
                  ? "30 дней"
                  : "Всё время"}
          </h3>
          <ul className="text-sm space-y-1">
            {Object.entries(stats)
              .filter(([, n]) => n > 0)
              .map(([key, n]) => (
                <li key={key} className="flex justify-between gap-2">
                  <span>{LABELS[key] ?? key}</span>
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
