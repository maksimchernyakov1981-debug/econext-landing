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
      <div className="sheet-top-bar" aria-hidden="true" />
      <header className="sheet-header">
        {isMain ? (
          <p className="brand-badge">{offerQrPrintTexts.printBrandLabel}</p>
        ) : (
          <p className="brand-badge collaboration">{collaboration}</p>
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
          <li key={item}>
            <span className="category-pill">{item}</span>
          </li>
        ))}
      </ul>

      <div className="scan-ribbon">
        <p className="scan-label">{offerQrPrintTexts.printScanLabel}</p>
      </div>

      <div className="qr-wrap">
        <div className="qr-frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrImageUrl} alt={qrAlt} className="qr-img" />
        </div>
      </div>

      <div className="contact-card">
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
        <span className="pdf-hint">PDF: Печать → «Сохранить как PDF»</span>
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
          background: linear-gradient(160deg, #e0f2fe 0%, #ecfdf5 45%, #fef9c3 100%);
        }
        .toolbar {
          display: flex;
          gap: 0.75rem 1rem;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }
        .print-btn {
          background: linear-gradient(135deg, #047857 0%, #0d9488 100%);
          color: white;
          padding: 0.75rem 1.25rem;
          border-radius: 0.75rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(4, 120, 87, 0.35);
        }
        .back-link {
          color: #047857;
          text-decoration: underline;
          font-weight: 600;
        }
        .url-preview {
          font-size: 0.75rem;
          color: #6b7280;
          word-break: break-all;
        }
        .pdf-hint {
          font-size: 0.72rem;
          color: #0d9488;
          font-weight: 600;
        }
        .sheet {
          position: relative;
          overflow: hidden;
          background: linear-gradient(165deg, #fffbeb 0%, #ffffff 38%, #f0fdf9 100%);
          margin: 0 auto;
          padding: 10mm 9mm 8mm;
          box-shadow:
            0 12px 40px rgba(13, 148, 136, 0.15),
            0 0 0 1px rgba(13, 148, 136, 0.12);
          display: flex;
          flex-direction: column;
          align-items: stretch;
          text-align: center;
          font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
          color: #0f172a;
          border-radius: 3mm;
          box-sizing: border-box;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .sheet::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 100% 0%, rgba(254, 243, 199, 0.55) 0%, transparent 42%),
            radial-gradient(circle at 0% 100%, rgba(204, 251, 241, 0.45) 0%, transparent 40%);
          pointer-events: none;
        }
        .sheet > * {
          position: relative;
          z-index: 1;
        }
        .sheet-top-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3.5mm;
          background: linear-gradient(90deg, #0d9488 0%, #14b8a6 35%, #f59e0b 70%, #0ea5e9 100%);
          z-index: 2;
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
          padding: 7mm 5.5mm 6mm;
        }
        .a6-duo-page .sheet-a6-second {
          box-shadow:
            0 12px 40px rgba(13, 148, 136, 0.12),
            0 0 0 1px rgba(13, 148, 136, 0.12),
            inset 0 0 0 1px rgba(255, 255, 255, 0.6);
        }
        .sheet-a8 {
          width: 52mm;
          max-width: 100%;
          font-size: 0.68rem;
          padding: 5mm 3.5mm 4mm;
        }
        .sheet-header {
          margin-bottom: 0.2rem;
          padding-top: 1mm;
        }
        .brand-badge {
          display: inline-block;
          margin: 0 auto 0.4rem;
          padding: 0.28rem 0.65rem;
          font-size: 0.68em;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #065f46;
          background: linear-gradient(135deg, #ccfbf1 0%, #fef3c7 100%);
          border: 1px solid #5eead4;
          border-radius: 999px;
        }
        .sheet-a6 .brand-badge {
          font-size: 0.6em;
          padding: 0.22rem 0.5rem;
        }
        .sheet-a8 .brand-badge {
          font-size: 0.54em;
        }
        .headline {
          margin: 0;
          line-height: 1.08;
          padding: 0.5rem 0.4rem;
          background: linear-gradient(135deg, #e0f2fe 0%, #fef9c3 55%, #ecfdf5 100%);
          border-radius: 2.5mm;
          border: 1.5px solid #7dd3fc;
          box-shadow: 0 3px 10px rgba(14, 165, 233, 0.12);
        }
        .sheet-a6 .headline {
          padding: 0.35rem 0.28rem;
        }
        .sheet-a8 .headline {
          padding: 0.25rem 0.2rem;
        }
        .headline-line {
          display: block;
          font-size: 1.78em;
          font-weight: 900;
          color: #0c4a6e;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
        }
        .sheet-a6 .headline-line {
          font-size: 1.18em;
        }
        .sheet-a8 .headline-line {
          font-size: 0.92em;
        }
        .subheadline {
          margin: 0.42rem 0 0.28rem;
          font-size: 0.9em;
          font-weight: 700;
          color: #334155;
          line-height: 1.3;
        }
        .sheet-a6 .subheadline {
          font-size: 0.78em;
        }
        .sheet-a8 .subheadline {
          font-size: 0.7em;
        }
        .teaser {
          display: inline-block;
          margin: 0.1rem auto 0;
          padding: 0.32rem 0.55rem;
          font-size: 0.84em;
          font-weight: 700;
          font-style: italic;
          color: #92400e;
          line-height: 1.35;
          background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%);
          border: 1px solid #fcd34d;
          border-radius: 999px;
          box-shadow: 0 2px 6px rgba(245, 158, 11, 0.15);
        }
        .sheet-a6 .teaser {
          font-size: 0.72em;
          padding: 0.26rem 0.45rem;
        }
        .sheet-a8 .teaser {
          font-size: 0.62em;
        }
        .extra-line {
          margin: 0.28rem 0 0;
          font-size: 0.78em;
          color: #64748b;
          line-height: 1.35;
        }
        .categories {
          list-style: none;
          padding: 0.35rem 0 0.45rem;
          margin: 0.28rem auto 0.4rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.28rem 0.5rem;
          max-width: 96%;
        }
        .categories li {
          display: flex;
          justify-content: center;
        }
        .category-pill {
          display: inline-block;
          width: 100%;
          padding: 0.2rem 0.35rem;
          font-size: 0.8em;
          font-weight: 600;
          color: #1e3a2f;
          line-height: 1.2;
          background: rgba(236, 253, 245, 0.9);
          border: 1px solid #a7f3d0;
          border-radius: 2mm;
        }
        .sheet-a6 .category-pill {
          font-size: 0.68em;
          padding: 0.16rem 0.28rem;
        }
        .sheet-a8 .category-pill {
          font-size: 0.58em;
        }
        .scan-ribbon {
          margin: 0.15rem 0 0.3rem;
        }
        .scan-label {
          display: inline-block;
          margin: 0;
          padding: 0.35rem 0.75rem;
          font-size: 0.88em;
          font-weight: 800;
          letter-spacing: 0.07em;
          color: #ffffff;
          line-height: 1.25;
          background: linear-gradient(135deg, #047857 0%, #0d9488 100%);
          border-radius: 2mm;
          box-shadow: 0 3px 8px rgba(4, 120, 87, 0.25);
        }
        .sheet-a6 .scan-label {
          font-size: 0.68em;
          padding: 0.28rem 0.5rem;
          letter-spacing: 0.04em;
        }
        .sheet-a8 .scan-label {
          font-size: 0.56em;
        }
        .qr-wrap {
          margin: 0.05rem auto 0.3rem;
          align-self: center;
        }
        .qr-frame {
          padding: 2.5mm;
          background: #ffffff;
          border-radius: 3mm;
          border: 2px solid #14b8a6;
          box-shadow:
            0 4px 16px rgba(13, 148, 136, 0.18),
            inset 0 0 0 2px #ffffff,
            inset 0 0 0 3px #99f6e4;
        }
        .sheet-a8 .qr-frame {
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
        .contact-card {
          margin-top: 0.05rem;
          padding: 0.4rem 0.5rem;
          background: linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 100%);
          border: 1px solid #86efac;
          border-radius: 2.5mm;
        }
        .sheet-a8 .contact-card {
          padding: 0.28rem 0.35rem;
        }
        .below-qr {
          margin: 0;
          font-size: 0.92em;
          font-weight: 800;
          color: #15803d;
        }
        .sheet-a6 .below-qr {
          font-size: 0.8em;
        }
        .sheet-a8 .below-qr {
          font-size: 0.68em;
        }
        .address-line,
        .phone-line {
          margin: 0.1rem 0 0;
          font-size: 0.86em;
          font-weight: 700;
          color: #166534;
        }
        .sheet-a6 .address-line,
        .sheet-a6 .phone-line {
          font-size: 0.74em;
        }
        .sheet-a8 .address-line,
        .sheet-a8 .phone-line {
          font-size: 0.62em;
        }
        .gift-hint {
          margin: 0.18rem 0 0;
          font-size: 0.76em;
          font-weight: 600;
          color: #64748b;
        }
        .sheet-a6 .gift-hint {
          font-size: 0.66em;
        }
        .sheet-a8 .gift-hint {
          font-size: 0.56em;
        }
        .sheet-footer {
          margin-top: auto;
          padding-top: 0.35rem;
        }
        .footer-text {
          font-size: 0.68em;
          color: #64748b;
          margin: 0;
          font-weight: 600;
          letter-spacing: 0.02em;
        }
        .sheet-a6 .footer-text {
          font-size: 0.6em;
        }
        .sheet-a8 .footer-text {
          font-size: 0.52em;
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
            border-radius: 2mm;
            border: 1px solid #99f6e4 !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
            break-after: avoid !important;
            break-inside: avoid !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .headline,
          .teaser,
          .scan-label,
          .brand-badge,
          .category-pill,
          .contact-card,
          .sheet-top-bar,
          .qr-frame {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .sheet-a4 {
            padding: 7mm 8mm 6mm !important;
            font-size: 10pt;
          }
          .sheet-a4 .headline-line {
            font-size: 1.6em !important;
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
            padding: 5mm 4.5mm 4.5mm !important;
            overflow: hidden !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .sheet-a6 .headline-line {
            font-size: 1.1em !important;
          }
          .a6-duo-page .sheet-a6 .headline-line {
            font-size: 1em !important;
          }
          .sheet-a8 {
            padding: 4mm 3mm 3.5mm !important;
          }
          .sheet-a8 .headline-line {
            font-size: 0.88em !important;
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
            margin: 4mm;
          }
        }
      `}</style>
    </div>
  );
}
