"use client";

import { useState } from "react";

export function LoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        login: fd.get("login"),
        password: fd.get("password"),
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(
        typeof data.error === "string"
          ? data.error
          : "Неверный логин или пароль"
      );
      setLoading(false);
      return;
    }
    window.location.reload();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-sm mx-auto mt-12 space-y-4 p-6 bg-white rounded-2xl shadow">
      <h1 className="text-xl font-bold text-center text-primary">EcoNext Admin</h1>
      <input
        name="login"
        placeholder="Логин"
        className="w-full border rounded-xl px-4 py-3 text-base"
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Пароль"
        className="w-full border rounded-xl px-4 py-3 text-base"
        required
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full min-h-[48px] bg-primary text-white rounded-xl font-medium"
      >
        Войти
      </button>
      <p className="text-xs text-muted leading-relaxed">
        Логин и пароль берутся из переменных{" "}
        <strong>ADMIN_LOGIN</strong> и <strong>ADMIN_PASSWORD</strong> в Vercel
        (не ADMIN_USERNAME). После изменения переменных нажмите Redeploy.
      </p>
    </form>
  );
}
