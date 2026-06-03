"use client";

const VISIT_KEY = "visit_sid";

export function getVisitSessionId(): string {
  if (typeof document === "undefined") return "";
  let id = document.cookie
    .split("; ")
    .find((r) => r.startsWith(`${VISIT_KEY}=`))
    ?.split("=")[1];
  if (!id) {
    id = crypto.randomUUID();
    document.cookie = `${VISIT_KEY}=${id}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
  }
  return id;
}

export async function trackEvent(
  eventType: string,
  partnerId: number | null
) {
  const sessionId = getVisitSessionId();
  await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventType, partnerId, sessionId }),
  });
}
