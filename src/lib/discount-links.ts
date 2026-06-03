import type { ContactSettings, Partner } from "@prisma/client";
import { resolveLink } from "./links";

export function resolveDiscountLinks(
  partner: Partner | null,
  contacts: ContactSettings
) {
  return {
    uds: resolveLink(partner?.udsLink, contacts.udsUrl),
    telegram: resolveLink(partner?.telegramBotLink, contacts.telegramBotUrl),
    max: resolveLink(partner?.maxBotLink, contacts.maxBotUrl),
  };
}
