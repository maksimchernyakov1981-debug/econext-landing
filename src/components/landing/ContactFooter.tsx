import { telLink } from "@/lib/links";
import type { LandingViewProps } from "./types";

export function ContactFooter({
  data,
}: {
  data: LandingViewProps;
}) {
  return (
    <footer className="text-xs text-center text-muted mt-8">
      {data.landing.privacyFooterText}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {data.contacts.telegramChannelUrl && (
          <a
            className="text-primary underline"
            href={data.contacts.telegramChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {data.contacts.telegramChannelButtonText}
          </a>
        )}
        {data.contacts.maxChannelUrl && (
          <a
            className="text-primary underline"
            href={data.contacts.maxChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {data.contacts.maxChannelButtonText}
          </a>
        )}
        {data.contacts.whatsappUrl && (
          <a
            className="text-primary underline"
            href={data.contacts.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {data.contacts.whatsappButtonText}
          </a>
        )}
        {data.contacts.websiteUrl && (
          <a
            className="text-primary underline"
            href={data.contacts.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {data.contacts.websiteButtonText}
          </a>
        )}
        {telLink(data.contacts.phone) && (
          <a className="text-primary underline" href={telLink(data.contacts.phone)!}>
            {data.contacts.contactButtonText || data.contacts.phone}
          </a>
        )}
      </div>
    </footer>
  );
}
