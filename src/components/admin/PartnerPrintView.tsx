"use client";

import type { Partner, QrCardSettings } from "@prisma/client";

export function PartnerPrintView({
  partner,
  qr,
  landingUrl,
  qrImageUrl,
  format,
}: {
  partner: Partner;
  qr: QrCardSettings;
  landingUrl: string;
  qrImageUrl: string;
  format: "a4" | "a6";
}) {
  const title =
    (format === "a4" ? qr.printA4Title : qr.printA6Title) ||
    qr.title.replace("[partner_name]", partner.name);
  const gift =
    partner.customGiftText?.trim() || qr.giftText || "";
  const extra = partner.customQrText?.trim() || "";
  const footer =
    qr.printFooterHint?.trim() || qr.footerText || "";

  return (
    <div className="print-root">
      <div className="no-print toolbar">
        <button type="button" onClick={() => window.print()} className="print-btn">
          Печать {format.toUpperCase()}
        </button>
        <a href={`/admin/partners/${partner.id}`} className="back-link">
          ← Назад к партнёру
        </a>
      </div>

      <article className={`sheet sheet-${format}`}>
        <h1 className="sheet-title">{title.replace(/\[partner_name\]/g, partner.name)}</h1>
        <p className="partner-name">{partner.name}</p>
        <div className="qr-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrImageUrl} alt={`QR ${partner.slug}`} className="qr-img" />
        </div>
        <p className="url">{landingUrl}</p>
        {qr.description && (
          <p className="desc whitespace-pre-line">{qr.description}</p>
        )}
        {gift && <p className="gift whitespace-pre-line">{gift}</p>}
        {qr.benefitsText && (
          <p className="benefits whitespace-pre-line">{qr.benefitsText}</p>
        )}
        {qr.scheduleText && <p className="schedule">{qr.scheduleText}</p>}
        {extra && <p className="extra whitespace-pre-line">{extra}</p>}
        {footer && <p className="footer whitespace-pre-line">{footer}</p>}
      </article>

      <style jsx global>{`
        .print-root {
          padding: 1rem;
          background: #f3f4f6;
          min-height: 100vh;
        }
        .toolbar {
          display: flex;
          gap: 1rem;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }
        .print-btn {
          background: #166534;
          color: white;
          padding: 0.75rem 1.25rem;
          border-radius: 0.75rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
        }
        .back-link {
          color: #166534;
          text-decoration: underline;
        }
        .sheet {
          background: white;
          margin: 0 auto;
          padding: 12mm;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          font-family: system-ui, sans-serif;
          color: #111;
        }
        .sheet-a4 {
          width: 210mm;
          min-height: 297mm;
          max-width: 100%;
        }
        .sheet-a6 {
          width: 105mm;
          min-height: 148mm;
          max-width: 100%;
          font-size: 0.85rem;
        }
        .sheet-title {
          font-size: 1.35em;
          font-weight: 700;
          margin: 0 0 0.5rem;
        }
        .partner-name {
          font-weight: 600;
          margin: 0 0 1rem;
          color: #166534;
        }
        .qr-wrap {
          margin: 0.5rem 0 1rem;
        }
        .qr-img {
          width: 45mm;
          height: 45mm;
          object-fit: contain;
        }
        .sheet-a4 .qr-img {
          width: 55mm;
          height: 55mm;
        }
        .url {
          font-size: 0.75em;
          word-break: break-all;
          color: #444;
          margin-bottom: 1rem;
        }
        .desc,
        .gift,
        .benefits,
        .schedule,
        .extra,
        .footer {
          width: 100%;
          text-align: center;
          margin: 0.35rem 0;
          line-height: 1.4;
        }
        .footer {
          margin-top: auto;
          padding-top: 1rem;
          font-size: 0.9em;
          color: #555;
        }
        @media print {
          .no-print {
            display: none !important;
          }
          .print-root {
            padding: 0;
            background: white;
          }
          .sheet {
            box-shadow: none;
            margin: 0;
            page-break-after: always;
          }
          @page {
            size: ${format === "a4" ? "A4" : "A6"};
            margin: 8mm;
          }
        }
      `}</style>
    </div>
  );
}
