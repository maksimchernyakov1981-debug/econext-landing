"use client";

import { useEffect, useMemo, useState } from "react";
import { eventLabel, STATS_PERIOD_LABELS } from "@/lib/event-labels";

type Dashboard = {
  visitors: number;
  uniqueVisitors: number;
  clicks: number;
  ctr: number;
  topEvent: string | null;
  rows: { eventType: string; count: number }[];
  devices: { mobile: number; tablet: number; desktop: number };
};

const EMPTY: Dashboard = {
  visitors: 0,
  uniqueVisitors: 0,
  clicks: 0,
  ctr: 0,
  topEvent: null,
  rows: [],
  devices: { mobile: 0, tablet: 0, desktop: 0 },
};

export function StatsView({
  partners,
}: {
  partners: { id: number; name: string }[];
}) {
  const [period, setPeriod] = useState("7d");
  const [site, setSite] = useState("main");
  const [partnerId, setPartnerId] = useState("");
  const [dashboard, setDashboard] = useState<Dashboard>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams({ period });
    if (site) params.set("site", site);
    if (site !== "main" && partnerId) params.set("partnerId", partnerId);
    setLoading(true);
    setError("");
    fetch(`/api/stats?${params}`)
      .then((response) => {
        if (!response.ok) throw new Error("Не удалось загрузить статистику");
        return response.json();
      })
      .then(setDashboard)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [period, site, partnerId]);

  const maxCount = useMemo(
    () => Math.max(1, ...dashboard.rows.map((row) => row.count)),
    [dashboard.rows]
  );
  const deviceTotal = Object.values(dashboard.devices).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-600">
        Здесь видно, сколько людей открыли сайт и какие кнопки они нажимали. Данные
        обновляются после каждого нового действия.
      </p>

      <div className="grid grid-cols-3 gap-2">
        {[
          { value: "main", label: "Главный сайт" },
          { value: "landing", label: "Лендинг" },
          { value: "", label: "Все сайты" },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => {
              setSite(item.value);
              if (item.value === "main") setPartnerId("");
            }}
            className={`rounded-xl px-2 py-2 text-sm font-medium ${
              site === item.value ? "bg-primary text-white" : "bg-white border"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {(["today", "7d", "30d", "all"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setPeriod(item)}
            className={`px-3 py-1.5 rounded-full text-sm ${
              period === item ? "bg-primary text-white" : "bg-gray-200"
            }`}
          >
            {STATS_PERIOD_LABELS[item]}
          </button>
        ))}
      </div>

      {site !== "main" && (
        <select
          className="border rounded-xl px-3 py-2.5 w-full bg-white"
          value={partnerId}
          onChange={(event) => setPartnerId(event.target.value)}
        >
          <option value="">Все партнёры</option>
          <option value="null">Без партнёра</option>
          {partners.map((partner) => (
            <option key={partner.id} value={partner.id}>
              {partner.name}
            </option>
          ))}
        </select>
      )}

      {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className={`grid grid-cols-2 gap-3 ${loading ? "opacity-60" : ""}`}>
        <Metric label="Посетители" value={dashboard.uniqueVisitors} hint="уникальные открытия" />
        <Metric label="Все клики" value={dashboard.clicks} hint="нажатия на кнопки" />
        <Metric label="Конверсия" value={`${dashboard.ctr}%`} hint="посетителей нажали кнопку" />
        <Metric
          label="Лучшая кнопка"
          value={dashboard.topEvent ? eventLabel(dashboard.topEvent) : "—"}
          hint="чаще всего нажимают"
          compact
        />
      </div>

      <section className="rounded-2xl border bg-white p-4">
        <h2 className="font-bold mb-1">Нажатия по кнопкам</h2>
        <p className="text-xs text-gray-500 mb-4">Чем длиннее полоса, тем популярнее действие.</p>
        {dashboard.rows.length === 0 ? (
          <p className="py-5 text-sm text-gray-500 text-center">
            За выбранный период действий пока нет
          </p>
        ) : (
          <div className="space-y-4">
            {dashboard.rows.map((row) => (
              <div key={row.eventType}>
                <div className="flex items-start justify-between gap-3 text-sm mb-1.5">
                  <span>{eventLabel(row.eventType)}</span>
                  <strong className="shrink-0">{row.count}</strong>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.max(5, (row.count / maxCount) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {deviceTotal > 0 && (
        <section className="rounded-2xl border bg-white p-4">
          <h2 className="font-bold mb-3">С каких устройств заходят</h2>
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <Device label="Телефоны" count={dashboard.devices.mobile} />
            <Device label="Планшеты" count={dashboard.devices.tablet} />
            <Device label="Компьютеры" count={dashboard.devices.desktop} />
          </div>
        </section>
      )}

      <p className="text-xs text-gray-500">
        Посетители считаются без ФИО, телефона и других личных данных. Повторное открытие
        одним человеком в течение 30 минут не дублируется.
      </p>
    </div>
  );
}

function Metric({
  label,
  value,
  hint,
  compact = false,
}: {
  label: string;
  value: number | string;
  hint: string;
  compact?: boolean;
}) {
  return (
    <div className="min-h-28 rounded-2xl border bg-white p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`mt-1 font-bold text-primary ${compact ? "text-sm leading-snug" : "text-2xl"}`}>
        {value}
      </div>
      <div className="mt-2 text-xs text-gray-500">{hint}</div>
    </div>
  );
}

function Device({ label, count }: { label: string; count: number }) {
  return (
    <div className="rounded-xl bg-gray-50 px-2 py-3">
      <strong className="block text-lg text-primary">{count}</strong>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}
