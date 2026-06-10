"use client";

import { replaceTemplateVars } from "@/lib/templates";
import { TrackedLinkBtn } from "./TrackedLinkBtn";
import type { LandingViewProps } from "./types";

function StepCard({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white/90 border border-amber-100 p-4 space-y-3">
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
          {step}
        </span>
        <h3 className="font-semibold text-gray-900 leading-snug pt-1">{title}</h3>
      </div>
      <div className="pl-11 space-y-3">{children}</div>
    </div>
  );
}

export function DiscountBlock({
  data,
  partnerId,
  udsUrl,
  maxUrl,
  telegramUrl,
  ctx,
  address,
  landmark,
}: {
  data: LandingViewProps;
  partnerId: number | null;
  udsUrl: string | null;
  maxUrl: string | null;
  telegramUrl: string | null;
  ctx: Record<string, string>;
  address: string;
  landmark?: string | null;
}) {
  const p = data.partner;
  const hasAny = udsUrl || maxUrl || telegramUrl;
  const hasAlternatives = maxUrl && (udsUrl || telegramUrl);

  return (
    <section
      id="gift-instructions"
      className="rounded-3xl overflow-hidden border-2 border-accent/40 bg-gradient-to-b from-amber-50 via-white to-surface shadow-lg shadow-amber-100/80 mb-4 scroll-mt-4"
    >
      <div className="bg-accent/90 px-4 py-2 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-900/80">
          Инструкция
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

        <div className="space-y-3">
          <StepCard step={1} title="Подключитесь — займёт минуту">
            <p className="text-sm text-muted -mt-1">
              Выберите удобный способ: MAX, Telegram или UDS.
            </p>
            <div className="flex flex-col gap-3">
              {maxUrl && (
                <TrackedLinkBtn
                  href={maxUrl}
                  label={data.buttons.maxButtonText.replace(/^💬\s*/, "") || "Подключиться в MAX"}
                  eventType="click_max"
                  partnerId={partnerId}
                  variant="accent"
                  badge="Рекомендуем"
                  hint="Без VPN — подарок на точке, скидки дома в боте"
                />
              )}
              {(udsUrl || telegramUrl) && (
                <div className="flex flex-col gap-3">
                  {udsUrl && (
                    <TrackedLinkBtn
                      href={udsUrl}
                      label={
                        data.buttons.udsButtonText.replace(/^📱\s*/, "") ||
                        "Подключиться в приложении"
                      }
                      eventType="click_uds"
                      partnerId={partnerId}
                      variant={maxUrl ? "secondary" : "primary"}
                      hint="Карта лояльности — подарок при визите, скидки в приложении"
                    />
                  )}
                  {telegramUrl && (
                    <TrackedLinkBtn
                      href={telegramUrl}
                      label={
                        data.buttons.telegramButtonText.replace(/^💬\s*/, "") ||
                        "Подключиться в Telegram"
                      }
                      eventType="click_telegram"
                      partnerId={partnerId}
                      variant="secondary"
                      hint="Бот EcoNext — подарок на точке, заказы домой со скидкой"
                    />
                  )}
                </div>
              )}
              {!hasAny && (
                <p className="text-sm text-center text-gray-600 bg-white rounded-xl p-4 border border-dashed border-gray-200">
                  Подарок скоро будет доступен. Позвоните нам — подскажем, как подключиться и
                  забрать подарок на точке.
                </p>
              )}
            </div>
            {hasAlternatives && (
              <p className="text-xs text-center text-muted">
                Нет MAX? Подойдут Telegram или приложение — подарок тот же.
              </p>
            )}
          </StepCard>

          <StepCard step={2} title="Приходите в EcoNext">
            <p className="text-sm text-gray-800 -mt-1">{address}</p>
            {landmark && <p className="text-sm text-muted">Ориентир: {landmark}</p>}
          </StepCard>

          <StepCard step={3} title="Выберите подарок">
            <p className="text-sm text-gray-700 -mt-1">
              Салфетка для оптики или сетка для мытья посуды без моющих — на выбор.
            </p>
          </StepCard>
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
