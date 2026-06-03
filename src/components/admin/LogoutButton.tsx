"use client";

export function LogoutButton() {
  return (
    <button
      type="button"
      className="text-sm underline"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/admin";
      }}
    >
      Выйти
    </button>
  );
}
