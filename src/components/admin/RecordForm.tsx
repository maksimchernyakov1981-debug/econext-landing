"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "url" | "checkbox" | "number" | "date" | "select";
  options?: { value: string; label: string }[];
};

export function RecordForm({
  fields,
  initial,
  action,
  submitLabel = "Сохранить",
}: {
  fields: FieldDef[];
  initial: Record<string, unknown>;
  action: (data: Record<string, string>) => Promise<{
    ok?: boolean;
    error?: string;
    warning?: string;
    message?: string;
  }>;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [warn, setWarn] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");
    setErr("");
    setWarn("");
    const fd = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    for (const f of fields) {
      if (f.type === "checkbox") {
        data[f.name] = fd.get(f.name) ? "true" : "false";
      } else {
        data[f.name] = String(fd.get(f.name) ?? "");
      }
    }
    const res = await action(data);
    if (res.error) {
      setErr(res.error);
      setMsg("");
      return;
    }
    setMsg(res.message ?? "Сохранено");
    if (res.warning) setWarn(res.warning);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((f) => (
        <label key={f.name} className="block">
          <span className="text-sm font-medium text-gray-700">{f.label}</span>
          {f.type === "textarea" ? (
            <textarea
              name={f.name}
              defaultValue={String(initial[f.name] ?? "")}
              rows={3}
              className="mt-1 w-full border rounded-xl px-3 py-2 text-base"
            />
          ) : f.type === "checkbox" ? (
            <input
              type="checkbox"
              name={f.name}
              defaultChecked={Boolean(initial[f.name])}
              className="mt-2 ml-2"
            />
          ) : f.type === "select" ? (
            <select
              name={f.name}
              defaultValue={String(initial[f.name] ?? "")}
              className="mt-1 w-full border rounded-xl px-3 py-2 text-base"
            >
              {f.options?.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              name={f.name}
              type={
                f.type === "number"
                  ? "number"
                  : f.type === "date"
                    ? "date"
                    : f.type === "url"
                      ? "url"
                      : "text"
              }
              placeholder={f.type === "url" ? "https://t.me/..." : undefined}
              defaultValue={String(initial[f.name] ?? "")}
              className="mt-1 w-full border rounded-xl px-3 py-2 text-base"
            />
          )}
        </label>
      ))}
      {err && <p className="text-red-600 text-sm">{err}</p>}
      {warn && <p className="text-amber-800 text-sm">{warn}</p>}
      {msg && <p className="text-green-700 text-sm">{msg}</p>}
      <button
        type="submit"
        className="w-full min-h-[48px] bg-primary text-white rounded-xl font-medium"
      >
        {submitLabel}
      </button>
    </form>
  );
}
