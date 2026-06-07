"use client";

import type { Partner, QrCardSettings } from "@prisma/client";
import { offerQrDbTexts, offerQrPrintTexts } from "@/lib/offer-texts";

function tpl(text: string, partnerName: string) {
  return text.replace(/\[partner_name\]/g, partnerName);
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
  const title = tpl(
    (isA6 ? offerQrDbTexts.printA6Title : offerQrDbTexts.printA4Title) ||
      qr.title,
    partner.name
  );
  const partnerLine = tpl(offerQrPrintTexts.printPartnerLine, partner.name);
  const lead =
    partner.customQrText?.trim() ||
    offerQrPrintTexts.printLead;
  const gift =
    partner.customGiftText?.trim() ||
    offerQrPrintTexts.printGiftLine ||
    qr.giftText ||
    "";
  const steps = offerQrPrintTexts.printSteps;
  const bonus = offerQrPrintTexts.printBonusLine;
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
      </div>

      <article className={`sheet sheet-${format}`}>
        <header className="sheet-header">
          <div className="brand">EcoNext</div>
          <h1 className="sheet-title">{title}</h1>
          <p className="partner-line">{partnerLine}</p>
        </header>

        <div className="qr-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrImageUrl} alt={`QR ${partner.slug}`} className="qr-img" />
          <p className="scan-hint">Наведите камеру телефона</p>
        </div>

        <p className="lead">{lead}</p>

        <ol className="steps">
          {steps.map((step, i) => (
            <li key={step}>
              <span className="step-num">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        {gift && <p className="gift">{gift}</p>}
        <p className="bonus">{bonus}</p>

        <footer className="sheet-footer">
          <p className="url">{landingUrl.replace(/^https?:\/\//, "")}</p>
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
        .sheet {
          background: linear-gradient(180deg, #fffbeb 0%, #ffffff 35%, #f0fdf4 100%);
          margin: 0 auto;
          padding: 14mm 12mm;
          box-shadow: 0 8px 32px rgba(22, 101, 52, 0.12);
          display: flex;
          flex-direction: column;
          align-items: stretch;
          text-align: center;
          font-family: system-ui, -apple-system, sans-serif;
          color: #111827;
          border: 2px solid #bbf7d0;
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
          padding: 8mm 7mm;
        }
        .sheet-header {
          margin-bottom: 0.75rem;
        }
        .brand {
          font-size: 0.75em;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #166534;
          margin-bottom: 0.35rem;
        }
        .sheet-title {
          font-size: 1.45em;
          font-weight: 800;
          margin: 0;
          line-height: 1.2;
          color: #14532d;
        }
        .sheet-a6 .sheet-title {
          font-size: 1.15em;
        }
        .partner-line {
          font-weight: 700;
          margin: 0.5rem 0 0;
          color: #15803d;
          font-size: 1.05em;
        }
        .qr-wrap {
          margin: 1rem auto;
          padding: 4mm;
          background: white;
          border-radius: 3mm;
          border: 2px solid #86efac;
          display: inline-block;
          align-self: center;
        }
        .qr-img {
          width: 48mm;
          height: 48mm;
          object-fit: contain;
          display: block;
        }
        .sheet-a4 .qr-img {
          width: 58mm;
          height: 58mm;
        }
        .sheet-a6 .qr-img {
          width: 36mm;
          height: 36mm;
        }
        .scan-hint {
          font-size: 0.72em;
          color: #6b7280;
          margin: 0.35rem 0 0;
        }
        .lead {
          font-size: 0.95em;
          line-height: 1.45;
          margin: 0.5rem 0 1rem;
          color: #374151;
          font-weight: 500;
        }
        .sheet-a6 .lead {
          font-size: 0.85em;
          margin-bottom: 0.65rem;
        }
        .steps {
          list-style: none;
          padding: 0;
          margin: 0 0 1rem;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .steps li {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 0.88em;
          line-height: 1.35;
        }
        .sheet-a6 .steps li {
          font-size: 0.78em;
        }
        .step-num {
          flex-shrink: 0;
          width: 1.35rem;
          height: 1.35rem;
          border-radius: 999px;
          background: #166534;
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
          padding: 0.55rem 0.75rem;
          margin: 0 0 0.5rem;
          font-size: 0.88em;
          font-weight: 600;
          color: #92400e;
          line-height: 1.4;
        }
        .sheet-a6 .gift {
          font-size: 0.78em;
          padding: 0.4rem 0.55rem;
        }
        .bonus {
          font-size: 0.85em;
          color: #4b5563;
          margin: 0 0 1rem;
          line-height: 1.4;
        }
        .sheet-a6 .bonus {
          font-size: 0.75em;
        }
        .sheet-footer {
          margin-top: auto;
          padding-top: 0.75rem;
          border-top: 1px dashed #d1d5db;
        }
        .url {
          font-size: 0.68em;
          word-break: break-all;
          color: #9ca3af;
          margin: 0 0 0.35rem;
        }
        .footer-text {
          font-size: 0.78em;
          color: #6b7280;
          margin: 0;
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
