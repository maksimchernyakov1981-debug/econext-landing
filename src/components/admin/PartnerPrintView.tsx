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
        </div>

        <footer className="sheet-footer">
          <p className="footer-text">{footer}</p>
        </footer>
      </article>

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
          background: linear-gradient(180deg, #fffbeb 0%, #ffffff 30%, #f0fdf4 100%);
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
        .sheet-a6 {
          width: 105mm;
          max-width: 100%;
          font-size: 0.82rem;
          padding: 8mm 7mm;
        }
        .sheet-header {
          margin-bottom: 0.5rem;
        }
        .brand {
          font-size: 0.65em;
          font-weight: 800;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #0d9488;
          margin-bottom: 0.35rem;
        }
        .sheet-title {
          font-size: 1.55em;
          font-weight: 800;
          margin: 0;
          line-height: 1.12;
          color: #14532d;
        }
        .sheet-a6 .sheet-title {
          font-size: 1.15em;
        }
        .partner-line {
          font-weight: 700;
          margin: 0.4rem 0 0;
          color: #15803d;
          font-size: 1em;
        }
        .above-qr {
          font-size: 0.92em;
          line-height: 1.35;
          margin: 0.5rem 0 0.6rem;
          color: #374151;
          font-weight: 600;
        }
        .sheet-a6 .above-qr {
          font-size: 0.85em;
        }
        .qr-wrap {
          margin: 0.25rem auto 0.6rem;
          padding: 3mm;
          background: white;
          border-radius: 3mm;
          border: 2px solid #5eead4;
          display: inline-block;
          align-self: center;
        }
        .qr-img {
          width: 46mm;
          height: 46mm;
          object-fit: contain;
          display: block;
        }
        .sheet-a4 .qr-img {
          width: 54mm;
          height: 54mm;
        }
        .sheet-a6 .qr-img {
          width: 38mm;
          height: 38mm;
        }
        .below-qr {
          font-size: 0.85em;
          line-height: 1.35;
          margin: 0 0 0.75rem;
          color: #4b5563;
        }
        .sheet-a6 .below-qr {
          font-size: 0.78em;
        }
        .steps {
          list-style: none;
          padding: 0;
          margin: 0 0 0.75rem;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .steps li {
          display: flex;
          align-items: flex-start;
          gap: 0.45rem;
          font-size: 0.85em;
          line-height: 1.3;
        }
        .sheet-a6 .steps li {
          font-size: 0.76em;
        }
        .step-num {
          flex-shrink: 0;
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 999px;
          background: #0d9488;
          color: white;
          font-size: 0.72em;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .gift {
          background: #fef3c7;
          border: 1px solid #fcd34d;
          border-radius: 2mm;
          padding: 0.5rem 0.7rem;
          margin: 0 0 0.75rem;
          font-size: 0.88em;
          font-weight: 700;
          color: #92400e;
          line-height: 1.35;
        }
        .sheet-a6 .gift {
          font-size: 0.78em;
          padding: 0.4rem 0.55rem;
        }
        .location-block {
          margin-top: auto;
          padding-top: 0.25rem;
        }
        .location-line {
          font-size: 0.88em;
          font-weight: 700;
          color: #14532d;
          margin: 0;
        }
        .sheet-a6 .location-line {
          font-size: 0.78em;
        }
        .sheet-footer {
          padding-top: 0.5rem;
          margin-top: 0.35rem;
          border-top: 1px dashed #d1d5db;
        }
        .footer-text {
          font-size: 0.78em;
          color: #6b7280;
          margin: 0;
          font-weight: 500;
        }
        .sheet-a6 .footer-text {
          font-size: 0.68em;
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
            padding: 8mm 10mm !important;
            font-size: 10.5pt;
          }
          .sheet-a4 .sheet-title {
            font-size: 1.35em !important;
          }
          .sheet-a4 .qr-img {
            width: 48mm !important;
            height: 48mm !important;
          }
          .sheet-a4 .above-qr,
          .sheet-a4 .below-qr,
          .sheet-a4 .steps li,
          .sheet-a4 .gift,
          .sheet-a4 .location-line,
          .sheet-a4 .footer-text {
            font-size: 0.82em !important;
          }
          @page {
            size: ${format === "a4" ? "A4 portrait" : "A6 portrait"};
            margin: 5mm;
          }
        }
      `}</style>
    </div>
  );
}
