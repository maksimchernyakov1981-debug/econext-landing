import { replaceTemplateVars } from "@/lib/templates";
import { resolveLink } from "@/lib/links";
import { landingHomeHref } from "@/lib/landing-paths";
import { buildTemplateContext } from "../landing-template";
import { ContactFooter } from "../ContactFooter";
import { LandingScreenLayout } from "../LandingScreenLayout";
import { ScreenTracker } from "../ScreenTracker";
import { TrackedLinkBtn } from "../TrackedLinkBtn";
import type { LandingViewProps } from "../types";

export function DiscountScreen({
  data,
  partnerSlug,
  partnerId,
}: {
  data: LandingViewProps;
  partnerSlug: string | null;
  partnerId: number | null;
}) {
  const p = data.partner;
  const ctx = buildTemplateContext(data);
  const uds = resolveLink(p?.udsLink, data.contacts.udsUrl);
  const tg = resolveLink(p?.telegramBotLink, data.contacts.telegramBotUrl);
  const max = resolveLink(p?.maxBotLink, data.contacts.maxBotUrl);

  return (
    <LandingScreenLayout
      title={data.landing.discountBlockTitle}
      backLabel={data.buttons.backButtonText}
      backHref={landingHomeHref(partnerSlug)}
    >
      <ScreenTracker eventType="click_discount" partnerId={partnerId} />
      <p className="text-sm text-gray-700">
        {replaceTemplateVars(
          p?.customGiftText || data.landing.discountBlockDescription,
          ctx
        )}
      </p>
      <div className="flex flex-col gap-3 mt-6">
        {uds && (
          <TrackedLinkBtn
            href={uds}
            label={data.buttons.udsButtonText}
            eventType="click_uds"
            partnerId={partnerId}
          />
        )}
        {tg && (
          <TrackedLinkBtn
            href={tg}
            label={data.buttons.telegramButtonText}
            eventType="click_telegram"
            partnerId={partnerId}
          />
        )}
        {max && (
          <TrackedLinkBtn
            href={max}
            label={data.buttons.maxButtonText}
            eventType="click_max"
            partnerId={partnerId}
          />
        )}
      </div>
      <p className="text-xs text-muted mt-6">{data.landing.discountHint}</p>
      <ContactFooter data={data} />
    </LandingScreenLayout>
  );
}
