"use client";

import { trackEvent } from "./track";

type Variant = "primary" | "accent" | "secondary" | "outline";

const styles: Record<Variant, string> = {
  accent:
    "bg-accent text-gray-900 shadow-md shadow-amber-200/50 hover:brightness-105 ring-2 ring-amber-300/60",
  primary: "bg-primary text-white shadow-md shadow-green-900/15 hover:bg-[#156b3f]",
  secondary: "bg-white text-primary border-2 border-primary/30 hover:bg-surface",
  outline:
    "bg-white text-gray-800 border border-gray-200 hover:border-primary/40 hover:bg-surface",
};

export function TrackedLinkBtn({
  href,
  label,
  eventType,
  partnerId,
  variant = "primary",
  badge,
  hint,
}: {
  href: string;
  label: string;
  eventType: string;
  partnerId: number | null;
  variant?: Variant;
  badge?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent(eventType, partnerId)}
        className={`relative flex min-h-[52px] items-center justify-center gap-2 rounded-2xl font-semibold text-base px-4 py-3 w-full transition ${styles[variant]}`}
      >
        {badge && (
          <span className="absolute -top-2 left-3 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow">
            {badge}
          </span>
        )}
        <span>{label}</span>
      </a>
      {hint && <p className="text-xs text-muted text-center px-1">{hint}</p>}
    </div>
  );
}
