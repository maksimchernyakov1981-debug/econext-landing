"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { publishChanges } from "@/app/admin/actions";

export function PublishBar() {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [blobConfigured, setBlobConfigured] = useState(false);
  const [isVercel, setIsVercel] = useState(false);

  useEffect(() => {
    fetch("/api/admin/config")
      .then((r) => r.json())
      .then((d) => {
        setBlobConfigured(Boolean(d.blobConfigured));
        setIsVercel(Boolean(d.isVercel));
      })
      .catch(() => {});
  }, []);

  async function handlePublish() {
    setLoading(true);
    setMsg("");
    setErr("");
    const res = await publishChanges();
    setLoading(false);
    if (res.error) {
      setErr(res.error);
      return;
    }
    router.refresh();
    setMsg(res.message ?? "Готово");
    if (res.warning) setErr(res.warning);
  }

  return (
    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm space-y-2">
      {isVercel && !blobConfigured && (
        <p className="text-amber-900">
          На Vercel без <strong>BLOB_READ_WRITE_TOKEN</strong> правки в SQLite могут
          пропадать после перезапуска. Vercel → Storage → Blob → Create Store →
          подключите к проекту → Redeploy.
        </p>
      )}
      {blobConfigured && (
        <p className="text-green-800">База сохраняется в Vercel Blob между перезапусками.</p>
      )}
      <button
        type="button"
        onClick={handlePublish}
        disabled={loading}
        className="w-full min-h-[44px] rounded-xl bg-primary text-white font-medium disabled:opacity-60"
      >
        {loading ? "Применяем…" : "Применить на сайте (обновить кэш)"}
      </button>
      {msg && <p className="text-green-700">{msg}</p>}
      {err && <p className="text-amber-800">{err}</p>}
    </div>
  );
}
