"use client";

import { replaceTemplateVars } from "@/lib/templates";
import { TrackedLinkBtn } from "./TrackedLinkBtn";
import type { LandingViewProps } from "./types";

export function DiscountBlock({
  data,
  partnerId,
  udsUrl,
  maxUrl,
  telegramUrl,
  ctx,
}: {
  data: LandingViewProps;
  partnerId: number | null;
  udsUrl: string | null;
  maxUrl: string | null;
  telegramUrl: string | null;
  ctx: Record<string, string>;
}) {
  const p = data.partner;
  const hasAny = udsUrl || maxUrl || telegramUrl;

  return (
    <section className="rounded-3xl overflow-hidden border-2 border-accent/40 bg-gradient-to-b from-amber-50 via-white to-surface shadow-lg shadow-amber-100/80 mb-4">
      <div className="bg-accent/90 px-4 py-2 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-900/80">
          Ваш подарок
        </p>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 leading-snug">
            {data.landing.discountBlockTitle}
          </h2>
          <p className="text-sm text-gray-700 mt-2 leading-relaxed">
            {replaceTemplateVars(
              p?.customGiftText || data.landing.discountBlockDescription,
              ctx
            )}
          </p>
        </div>

        <ol className="text-xs text-muted space-y-1 bg-white/80 rounded-xl px-3 py-2 border border-amber-100">
          <li>1. Нажмите удобный способ ниже</li>
          <li>2. Откройте бота или приложение</li>
          <li>3. Покажите код на точке EcoNext</li>
        </ol>

        <div className="flex flex-col gap-3">
          {maxUrl && (
            <TrackedLinkBtn
              href={maxUrl}
              label={data.buttons.maxButtonText.replace(/^💬\s*/, "") || "Получить в MAX"}
              eventType="click_max"
              partnerId={partnerId}
              variant="accent"
              badge="Рекомендуем"
              hint="Работает в России без VPN — самый простой способ"
            />
          )}
          {udsUrl && (
            <TrackedLinkBtn
              href={udsUrl}
              label={data.buttons.udsButtonText.replace(/^📱\s*/, "") || "Открыть UDS"}
              eventType="click_uds"
              partnerId={partnerId}
              variant="primary"
              hint="Нужно приложение UDS — бонусы и скидка в одном месте"
            />
          )}
          {telegramUrl && (
            <TrackedLinkBtn
              href={telegramUrl}
              label={
                data.buttons.telegramButtonText.replace(/^💬\s*/, "") || "Получить в Telegram"
              }
              eventType="click_telegram"
              partnerId={partnerId}
              variant="secondary"
              hint="Telegram-бот — может понадобиться VPN"
            />
          )}
          {!hasAny && (
            <p className="text-sm text-center text-gray-600 bg-white rounded-xl p-4 border border-dashed border-gray-200">
              Скидка скоро будет доступна. Позвоните нам — подскажем, как получить подарок.
            </p>
          )}
        </div>

        {data.landing.discountHint && (
          <p className="text-xs text-center text-muted border-t border-amber-100 pt-3">
            {data.landing.discountHint}
          </p>
        )}
      </div>
    </section>
  );
}
