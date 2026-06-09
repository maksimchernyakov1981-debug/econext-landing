"use client";

import type { Partner, QrCardSettings } from "@prisma/client";
import { offerQrDbTexts, offerQrPrintTexts } from "@/lib/offer-texts";
import { formatPartnerPrintCollaboration } from "@/lib/partner-print";

export type PrintFormat = "a4" | "a6" | "a8";

export function PartnerPrintView({
  variant = "partner",
  partner,
  qr,
  landingUrl,
  qrImageUrl,
  format,
}: {
  variant?: "partner" | "main";
  partner?: Partner;
  qr: QrCardSettings;
  landingUrl: string;
  qrImageUrl: string;
  format: PrintFormat;
}) {
  const isMain = variant === "main";
  const collaboration =
    !isMain && partner ? formatPartnerPrintCollaboration(partner.name) : null;
  const extraLine = !isMain ? partner?.customQrText?.trim() : undefined;
  const footer =
    qr.printFooterHint?.trim() ||
    offerQrDbTexts.printFooterHint ||
    qr.footerText ||
    offerQrPrintTexts.printFooterLine;
  const backHref = isMain ? "/admin/qr" : `/admin/partners/${partner!.id}`;
  const qrAlt = isMain ? "QR главная" : `QR ${partner!.slug}`;

  const isA6Duo = format === "a6";
  const pageSize = isA6Duo
    ? "A4 landscape"
    : format === "a4"
      ? "A4 portrait"
      : format === "a8"
        ? "A8 portrait"
        : "A6 portrait";

  const sheetBody = (
    <>
      <header className="sheet-header">
        {isMain ? (
          <p className="brand">{offerQrPrintTexts.printBrandLabel}</p>
        ) : (
          <p className="collaboration">{collaboration}</p>
        )}
        <h1 className="headline">
          <span className="headline-line">{offerQrPrintTexts.printHeadlineLine1}</span>
          <span className="headline-line">{offerQrPrintTexts.printHeadlineLine2}</span>
        </h1>
        <p className="subheadline">{offerQrPrintTexts.printSubheadline}</p>
        <p className="teaser">{offerQrPrintTexts.printTeaserLine}</p>
        {extraLine && <p className="extra-line">{extraLine}</p>}
      </header>

      <ul className="categories">
        {offerQrPrintTexts.printGiftCategories.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <p className="scan-label">{offerQrPrintTexts.printScanLabel}</p>

      <div className="qr-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qrImageUrl} alt={qrAlt} className="qr-img" />
      </div>

      <div className="contact-block">
        <p className="below-qr">{offerQrPrintTexts.printBelowQrLine}</p>
        <p className="address-line">{offerQrPrintTexts.printAddressLine}</p>
        <p className="phone-line">{offerQrPrintTexts.printPhoneLine}</p>
        <p className="gift-hint">{offerQrPrintTexts.printGiftHint}</p>
      </div>

      <footer className="sheet-footer">
        <p className="footer-text">{footer}</p>
      </footer>
    </>
  );

  return (
    <div className="print-root">
      <div className="no-print toolbar">
        <button type="button" onClick={() => window.print()} className="print-btn">
          {isA6Duo ? "Печать A6 ×2 (альбом)" : `Печать ${format.toUpperCase()}`}
        </button>
        <a href={backHref} className="back-link">
          ← Назад
        </a>
        <span className="url-preview">{landingUrl.replace(/^https?:\/\//, "")}</span>
      </div>

      {isA6Duo ? (
        <div className="a6-duo-page">
          <article className="sheet sheet-a6">{sheetBody}</article>
          <article className="sheet sheet-a6 sheet-a6-second">{sheetBody}</article>
        </div>
      ) : (
        <article className={`sheet sheet-${format}`}>{sheetBody}</article>
      )}

      <style jsx global>{`
        .print-root {
          padding: 1rem;
          background: #ecfdf5;
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
        .url-preview {
          font-size: 0.75rem;
          color: #9ca3af;
          word-break: break-all;
        }
        .sheet {
          background: linear-gradient(180deg, #fffbeb 0%, #ffffff 28%, #f0fdf4 100%);
          margin: 0 auto;
          padding: 12mm 11mm;
          box-shadow: 0 8px 32px rgba(22, 101, 52, 0.12);
          display: flex;
          flex-direction: column;
          align-items: stretch;
          text-align: center;
          font-family: system-ui, -apple-system, sans-serif;
          color: #111827;
          border: 2px solid #99f6e4;
          border-radius: 4mm;
          box-sizing: border-box;
        }
        .sheet-a4 {
          width: 210mm;
          max-width: 100%;
        }
        .a6-duo-page {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 6mm;
          margin: 0 auto;
          width: min(297mm, 100%);
        }
        .sheet-a6 {
          width: 105mm;
          max-width: 100%;
          font-size: 0.8rem;
          padding: 7mm 6mm;
        }
        .a6-duo-page .sheet-a6-second {
          border-style: dashed;
        }
        .sheet-a8 {
          width: 52mm;
          max-width: 100%;
          font-size: 0.68rem;
          padding: 4mm 3.5mm;
        }
        .sheet-header {
          margin-bottom: 0.25rem;
        }
        .brand,
        .collaboration {
          margin: 0 0 0.45rem;
          font-size: 0.72em;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #0d9488;
        }
        .sheet-a6 .brand,
        .sheet-a6 .collaboration {
          font-size: 0.65em;
        }
        .sheet-a8 .brand,
        .sheet-a8 .collaboration {
          font-size: 0.58em;
          margin-bottom: 0.3rem;
        }
        .headline {
          margin: 0;
          line-height: 1.1;
          padding: 0.45rem 0.35rem;
          background: linear-gradient(135deg, #e0f2fe 0%, #fef9c3 100%);
          border-radius: 2.5mm;
          border: 1px solid #7dd3fc;
        }
        .sheet-a6 .headline {
          padding: 0.35rem 0.25rem;
        }
        .sheet-a8 .headline {
          padding: 0.25rem 0.2rem;
        }
        .headline-line {
          display: block;
          font-size: 1.85em;
          font-weight: 900;
          color: #0c4a6e;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }
        .sheet-a6 .headline-line {
          font-size: 1.22em;
        }
        .sheet-a8 .headline-line {
          font-size: 0.95em;
        }
        .subheadline {
          margin: 0.45rem 0 0.2rem;
          font-size: 0.92em;
          font-weight: 700;
          color: #374151;
          line-height: 1.3;
        }
        .sheet-a6 .subheadline {
          font-size: 0.8em;
        }
        .sheet-a8 .subheadline {
          font-size: 0.72em;
        }
        .teaser {
          margin: 0.15rem 0 0;
          font-size: 0.86em;
          font-weight: 600;
          font-style: italic;
          color: #b45309;
          line-height: 1.35;
        }
        .sheet-a6 .teaser {
          font-size: 0.74em;
        }
        .sheet-a8 .teaser {
          font-size: 0.65em;
        }
        .extra-line {
          margin: 0.3rem 0 0;
          font-size: 0.8em;
          color: #4b5563;
          line-height: 1.35;
        }
        .categories {
          list-style: none;
          padding: 0.4rem 0 0.5rem;
          margin: 0.3rem auto 0.45rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.28rem 1rem;
          text-align: center;
          justify-items: center;
          max-width: 92%;
          border-top: 1px dashed #d1d5db;
          border-bottom: 1px dashed #d1d5db;
        }
        .categories li {
          font-size: 0.84em;
          font-weight: 600;
          color: #1f2937;
          line-height: 1.2;
          width: 100%;
        }
        .sheet-a6 .categories {
          max-width: 100%;
          gap: 0.22rem 0.45rem;
        }
        .sheet-a6 .categories li {
          font-size: 0.72em;
        }
        .sheet-a8 .categories {
          gap: 0.15rem 0.3rem;
          padding: 0.25rem 0 0.35rem;
        }
        .sheet-a8 .categories li {
          font-size: 0.62em;
        }
        .scan-label {
          margin: 0.45rem 0 0.35rem;
          font-size: 0.92em;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #14532d;
          line-height: 1.25;
        }
        .sheet-a6 .scan-label {
          font-size: 0.72em;
          letter-spacing: 0.05em;
        }
        .sheet-a8 .scan-label {
          font-size: 0.58em;
          letter-spacing: 0.03em;
        }
        .qr-wrap {
          margin: 0.1rem auto 0.35rem;
          padding: 2.5mm;
          background: white;
          border-radius: 3mm;
          border: 2px solid #5eead4;
          display: inline-block;
          align-self: center;
        }
        .sheet-a8 .qr-wrap {
          padding: 1.5mm;
        }
        .qr-img {
          width: 44mm;
          height: 44mm;
          object-fit: contain;
          display: block;
        }
        .sheet-a4 .qr-img {
          width: 50mm;
          height: 50mm;
        }
        .sheet-a6 .qr-img {
          width: 34mm;
          height: 34mm;
        }
        .sheet-a8 .qr-img {
          width: 26mm;
          height: 26mm;
        }
        .contact-block {
          margin-top: 0.1rem;
        }
        .below-qr {
          margin: 0;
          font-size: 0.95em;
          font-weight: 800;
          color: #15803d;
        }
        .sheet-a6 .below-qr {
          font-size: 0.82em;
        }
        .sheet-a8 .below-qr {
          font-size: 0.7em;
        }
        .address-line,
        .phone-line {
          margin: 0.12rem 0 0;
          font-size: 0.88em;
          font-weight: 700;
          color: #14532d;
        }
        .sheet-a6 .address-line,
        .sheet-a6 .phone-line {
          font-size: 0.76em;
        }
        .sheet-a8 .address-line,
        .sheet-a8 .phone-line {
          font-size: 0.64em;
        }
        .gift-hint {
          margin: 0.2rem 0 0;
          font-size: 0.78em;
          font-weight: 600;
          color: #6b7280;
        }
        .sheet-a6 .gift-hint {
          font-size: 0.68em;
        }
        .sheet-a8 .gift-hint {
          font-size: 0.58em;
        }
        .sheet-footer {
          margin-top: auto;
          padding-top: 0.4rem;
          border-top: 1px dashed #d1d5db;
        }
        .footer-text {
          font-size: 0.72em;
          color: #6b7280;
          margin: 0;
          font-weight: 500;
        }
        .sheet-a6 .footer-text {
          font-size: 0.62em;
        }
        .sheet-a8 .footer-text {
          font-size: 0.55em;
        }
        @media print {
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
          }
          .no-print {
            display: none !important;
          }
          .print-root {
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
            min-height: 0 !important;
          }
          .sheet {
            box-shadow: none !important;
            margin: 0 auto !important;
            border-radius: 0;
            border-width: 1px;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
            break-after: avoid !important;
            break-inside: avoid !important;
          }
          .sheet-a4 {
            padding: 7mm 9mm !important;
            font-size: 10pt;
          }
          .sheet-a4 .headline-line {
            font-size: 1.65em !important;
          }
          .a6-duo-page {
            flex-direction: row !important;
            width: 297mm !important;
            min-height: 210mm !important;
            height: 210mm !important;
            gap: 2mm !important;
            justify-content: center !important;
            align-items: center !important;
            padding: 0 !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .a6-duo-page .sheet-a6 {
            width: 105mm !important;
            height: 148mm !important;
            max-height: 148mm !important;
            margin: 0 auto !important;
            padding: 5mm 4.5mm !important;
            overflow: hidden !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .a6-duo-page .sheet-a6-second {
            border-style: solid !important;
          }
          .sheet-a6 .headline-line {
            font-size: 1.15em !important;
          }
          .a6-duo-page .sheet-a6 .headline-line {
            font-size: 1.05em !important;
          }
          .sheet-a8 {
            padding: 3mm 2.5mm !important;
          }
          .sheet-a8 .headline-line {
            font-size: 0.9em !important;
          }
          .sheet-a4 .qr-img {
            width: 46mm !important;
            height: 46mm !important;
          }
          .sheet-a8 .qr-img {
            width: 24mm !important;
            height: 24mm !important;
          }
          @page {
            size: ${pageSize};
            margin: 5mm;
          }
        }
      `}</style>
    </div>
  );
}
