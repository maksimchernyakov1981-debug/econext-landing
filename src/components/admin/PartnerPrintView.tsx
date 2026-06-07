"use client";

import type { Partner, QrCardSettings } from "@prisma/client";
import { offerQrDbTexts, offerQrPrintTexts } from "@/lib/offer-texts";

function tpl(text: string, partnerName: string) {
  return text.replace(/\[partner_name\]/g, partnerName);
}

function partnerLine(partnerName: string) {
  const name = partnerName.trim();
  if (!name) return offerQrPrintTexts.printPartnerFallback;
  return tpl(offerQrPrintTexts.printPartnerLine, name);
}

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
  const isA6 = format === "a6";
  const title =
    (isA6 ? offerQrDbTexts.printA6Title : offerQrDbTexts.printA4Title) ||
    qr.title;
  const aboveQr =
    partner.customQrText?.trim() || offerQrPrintTexts.printAboveQr;
  const belowQr = offerQrPrintTexts.printBelowQr;
  const steps = offerQrPrintTexts.printSteps;
  const gift =
    partner.customGiftText?.trim() ||
    offerQrPrintTexts.printGiftLine ||
    qr.giftText ||
    "";
  const footer =
    qr.printFooterHint?.trim() ||
    offerQrDbTexts.printFooterHint ||
    qr.footerText ||
    "";

  return (
    <div className="print-root">
      <div className="no-print toolbar">
        <button type="button" onClick={() => window.print()} className="print-btn">
          Печать {format.toUpperCase()}
        </button>
        <a href={`/admin/partners/${partner.id}`} className="back-link">
          ← Назад к партнёру
        </a>
        <span className="url-preview">{landingUrl.replace(/^https?:\/\//, "")}</span>
      </div>

      <article className={`sheet sheet-${format}`}>
        <header className="sheet-header">
          <div className="brand">{offerQrPrintTexts.printBrandLabel}</div>
          <h1 className="sheet-title">{title}</h1>
          <p className="partner-line">{partnerLine(partner.name)}</p>
        </header>

        <p className="above-qr">{aboveQr}</p>

        <div className="qr-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrImageUrl} alt={`QR ${partner.slug}`} className="qr-img" />
        </div>

        <p className="below-qr">{belowQr}</p>

        <ol className="steps">
          {steps.map((step, i) => (
            <li key={step}>
              <span className="step-num">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        {gift && <p className="gift">{gift}</p>}

        <div className="location-block">
          <p className="location-line">{offerQrPrintTexts.printLocationLine}</p>
          <p className="oscar-note">{offerQrPrintTexts.printOscarNote}</p>
        </div>

        <footer className="sheet-footer">
          <p className="footer-text">{footer}</p>
        </footer>
      </article>

      <style jsx global>{`
        .print-root {
          padding: 1rem;
          background: #ecfdf5;
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
        .url-preview {
          font-size: 0.75rem;
          color: #9ca3af;
          word-break: break-all;
        }
        .sheet {
          background: linear-gradient(180deg, #fffbeb 0%, #ffffff 30%, #f0fdf4 100%);
          margin: 0 auto;
          padding: 16mm 14mm;
          box-shadow: 0 8px 32px rgba(22, 101, 52, 0.12);
          display: flex;
          flex-direction: column;
          align-items: stretch;
          text-align: center;
          font-family: system-ui, -apple-system, sans-serif;
          color: #111827;
          border: 2px solid #99f6e4;
          border-radius: 4mm;
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
          font-size: 0.82rem;
          padding: 9mm 8mm;
        }
        .sheet-header {
          margin-bottom: 1rem;
        }
        .brand {
          font-size: 0.7em;
          font-weight: 800;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #0d9488;
          margin-bottom: 0.5rem;
        }
        .sheet-title {
          font-size: 1.75em;
          font-weight: 800;
          margin: 0;
          line-height: 1.15;
          color: #14532d;
        }
        .sheet-a6 .sheet-title {
          font-size: 1.2em;
        }
        .partner-line {
          font-weight: 700;
          margin: 0.6rem 0 0;
          color: #15803d;
          font-size: 1.08em;
        }
        .above-qr {
          font-size: 1em;
          line-height: 1.45;
          margin: 0.75rem 0 1rem;
          color: #374151;
          font-weight: 600;
        }
        .sheet-a6 .above-qr {
          font-size: 0.88em;
        }
        .qr-wrap {
          margin: 0.5rem auto 1rem;
          padding: 5mm;
          background: white;
          border-radius: 3mm;
          border: 2px solid #5eead4;
          display: inline-block;
          align-self: center;
        }
        .qr-img {
          width: 52mm;
          height: 52mm;
          object-fit: contain;
          display: block;
        }
        .sheet-a4 .qr-img {
          width: 68mm;
          height: 68mm;
        }
        .sheet-a6 .qr-img {
          width: 42mm;
          height: 42mm;
        }
        .below-qr {
          font-size: 0.92em;
          line-height: 1.45;
          margin: 0 0 1.25rem;
          color: #4b5563;
        }
        .sheet-a6 .below-qr {
          font-size: 0.8em;
        }
        .steps {
          list-style: none;
          padding: 0;
          margin: 0 0 1.25rem;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }
        .steps li {
          display: flex;
          align-items: flex-start;
          gap: 0.55rem;
          font-size: 0.92em;
          line-height: 1.35;
        }
        .sheet-a6 .steps li {
          font-size: 0.8em;
        }
        .step-num {
          flex-shrink: 0;
          width: 1.4rem;
          height: 1.4rem;
          border-radius: 999px;
          background: #0d9488;
          color: white;
          font-size: 0.75em;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .gift {
          background: #fef3c7;
          border: 1px solid #fcd34d;
          border-radius: 2mm;
          padding: 0.65rem 0.85rem;
          margin: 0 0 1.25rem;
          font-size: 0.95em;
          font-weight: 700;
          color: #92400e;
          line-height: 1.4;
        }
        .sheet-a6 .gift {
          font-size: 0.82em;
          padding: 0.45rem 0.6rem;
        }
        .location-block {
          margin-top: auto;
          padding-top: 0.5rem;
        }
        .location-line {
          font-size: 0.95em;
          font-weight: 700;
          color: #14532d;
          margin: 0 0 0.35rem;
        }
        .sheet-a6 .location-line {
          font-size: 0.82em;
        }
        .oscar-note {
          font-size: 0.72em;
          color: #9ca3af;
          margin: 0 0 0.75rem;
        }
        .sheet-a6 .oscar-note {
          font-size: 0.65em;
        }
        .sheet-footer {
          padding-top: 0.75rem;
          border-top: 1px dashed #d1d5db;
        }
        .footer-text {
          font-size: 0.82em;
          color: #6b7280;
          margin: 0;
          font-weight: 500;
        }
        .sheet-a6 .footer-text {
          font-size: 0.72em;
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
            border-radius: 0;
            page-break-after: always;
          }
          @page {
            size: ${format === "a4" ? "A4" : "A6"};
            margin: 6mm;
          }
        }
      `}</style>
    </div>
  );
}
