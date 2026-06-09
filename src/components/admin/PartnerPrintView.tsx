"use client";

import type { Partner, QrCardSettings } from "@prisma/client";
import { offerQrDbTexts, offerQrPrintTexts } from "@/lib/offer-texts";
import { formatPartnerPrintLocation } from "@/lib/partner-print";

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
  const partnerLocation = formatPartnerPrintLocation(partner.partnerType, partner.name);
  const extraLine = partner.customQrText?.trim();
  const footer =
    qr.printFooterHint?.trim() ||
    offerQrDbTexts.printFooterHint ||
    qr.footerText ||
    offerQrPrintTexts.printFooterLine;

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
          <h1 className="headline">
            <span className="headline-line">{offerQrPrintTexts.printHeadlineLine1}</span>
            <span className="headline-line">{offerQrPrintTexts.printHeadlineLine2}</span>
          </h1>
          <p className="subheadline">{offerQrPrintTexts.printSubheadline}</p>
          <p className="partner-location">{partnerLocation}</p>
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
          <img src={qrImageUrl} alt={`QR ${partner.slug}`} className="qr-img" />
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
        .sheet-a6 {
          width: 105mm;
          max-width: 100%;
          font-size: 0.82rem;
          padding: 8mm 7mm;
        }
        .sheet-header {
          margin-bottom: 0.35rem;
        }
        .brand {
          font-size: 0.6em;
          font-weight: 800;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #0d9488;
          margin-bottom: 0.5rem;
        }
        .headline {
          margin: 0;
          line-height: 1.08;
        }
        .headline-line {
          display: block;
          font-size: 1.45em;
          font-weight: 900;
          color: #0c4a6e;
          letter-spacing: 0.01em;
        }
        .sheet-a6 .headline-line {
          font-size: 1.05em;
        }
        .subheadline {
          margin: 0.55rem 0 0.35rem;
          font-size: 0.95em;
          font-weight: 600;
          color: #374151;
          line-height: 1.3;
        }
        .sheet-a6 .subheadline {
          font-size: 0.82em;
        }
        .partner-location {
          margin: 0.25rem 0 0;
          font-size: 0.88em;
          font-weight: 700;
          color: #15803d;
        }
        .sheet-a6 .partner-location {
          font-size: 0.78em;
        }
        .extra-line {
          margin: 0.35rem 0 0;
          font-size: 0.82em;
          color: #4b5563;
          line-height: 1.35;
        }
        .categories {
          list-style: none;
          padding: 0.5rem 0 0.65rem;
          margin: 0.35rem 0 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          border-top: 1px dashed #d1d5db;
          border-bottom: 1px dashed #d1d5db;
        }
        .categories li {
          font-size: 0.92em;
          font-weight: 600;
          color: #1f2937;
          line-height: 1.25;
        }
        .sheet-a6 .categories li {
          font-size: 0.8em;
        }
        .scan-label {
          margin: 0.5rem 0 0.4rem;
          font-size: 1em;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: #14532d;
        }
        .sheet-a6 .scan-label {
          font-size: 0.82em;
        }
        .qr-wrap {
          margin: 0.15rem auto 0.5rem;
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
        .sheet-footer {
          margin-top: auto;
          padding-top: 0.45rem;
          border-top: 1px dashed #d1d5db;
        }
        .footer-text {
          font-size: 0.75em;
          color: #6b7280;
          margin: 0;
          font-weight: 500;
        }
        .sheet-a6 .footer-text {
          font-size: 0.65em;
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
          .sheet-a4 .headline-line {
            font-size: 1.25em !important;
          }
          .sheet-a4 .qr-img {
            width: 48mm !important;
            height: 48mm !important;
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
