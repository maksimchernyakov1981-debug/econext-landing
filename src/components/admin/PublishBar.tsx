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
    if (res.message && !res.warning) setMsg(res.message);
  }

  return (
    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm space-y-2">
      {isVercel && !blobConfigured && (
        <div className="text-amber-900 space-y-2">
          <p className="font-medium">Хранилище Blob не подключено</p>
          <ol className="list-decimal list-inside space-y-1 text-xs">
            <li>Откройте vercel.com → ваш проект <strong>econext-landing</strong></li>
            <li>Вкладка <strong>Storage</strong> → <strong>Create Database</strong> → <strong>Blob</strong></li>
            <li>Имя store (любое) → <strong>Create</strong></li>
            <li>
              <strong>Connect to Project</strong> → выберите econext-landing → Connect
            </li>
            <li>
              <strong>Settings → Environment Variables</strong> — должна появиться{" "}
              <code className="bg-amber-100 px-1 rounded">BLOB_READ_WRITE_TOKEN</code>
            </li>
            <li>
              <strong>Deployments → Redeploy</strong> (без этого токен не подхватится)
            </li>
          </ol>
          <p className="text-xs">
            После Connect: в каждом разделе нажмите <strong>Сохранить</strong> и дождитесь
            «Сохранено в облако». Затем «Применить на сайте».
          </p>
        </div>
      )}
      {blobConfigured && (
        <p className="text-green-800">
          Настройки хранятся в облаке. Сначала <strong>Сохранить</strong> в форме раздела, потом
          кнопка ниже.
        </p>
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
