"use client";

import { useEffect, useState } from "react";
import { eventLabel, STATS_PERIOD_LABELS } from "@/lib/event-labels";

type Row = { eventType: string; count: number };

export function StatsView({
  partners,
}: {
  partners: { id: number; name: string }[];
}) {
  const [period, setPeriod] = useState("today");
  const [partnerId, setPartnerId] = useState("");
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    fetch(`/api/stats?period=${period}&partnerId=${partnerId}`)
      .then((r) => r.json())
      .then(setRows);
  }, [period, partnerId]);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {(["today", "7d", "30d", "all"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            className={`px-3 py-1 rounded-full text-sm ${period === p ? "bg-primary text-white" : "bg-gray-200"}`}
          >
            {STATS_PERIOD_LABELS[p]}
          </button>
        ))}
      </div>
      <select
        className="mb-4 border rounded-lg px-3 py-2 w-full"
        value={partnerId}
        onChange={(e) => setPartnerId(e.target.value)}
      >
        <option value="">Все партнёры</option>
        <option value="null">Без партнёра</option>
        {partners.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Событие</th>
            <th>Кол-во</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={2} className="py-4 text-muted text-center">
                Нет событий за выбранный период
              </td>
            </tr>
          )}
          {rows.map((r) => (
            <tr key={r.eventType} className="border-b">
              <td className="py-2">{eventLabel(r.eventType)}</td>
              <td>{r.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
