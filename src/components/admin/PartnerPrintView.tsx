"use client";

import type { Partner, QrCardSettings } from "@prisma/client";
import { offerQrDbTexts, offerQrPrintTexts } from "@/lib/offer-texts";
import { formatPartnerPrintCollaboration } from "@/lib/partner-print";

export type PrintFormat = "a4" | "a6" | "a8";
export type PrintVariant = "partner" | "main" | "store";

export function PartnerPrintView({
  variant = "partner",
  partner,
  qr,
  landingUrl,
  qrImageUrl,
  format,
}: {
  variant?: PrintVariant;
  partner?: Partner;
  qr: QrCardSettings;
  landingUrl?: string;
  qrImageUrl?: string;
  format: PrintFormat;
}) {
  const isMain = variant === "main";
  const isStore = variant === "store";
  const isPartner = variant === "partner";
  const collaboration =
    isPartner && partner ? formatPartnerPrintCollaboration(partner.name) : null;
  const extraLine = isPartner ? partner?.customQrText?.trim() : undefined;
  const footerTagline =
    qr.printFooterHint?.trim() ||
    offerQrDbTexts.printFooterHint ||
    qr.footerText ||
    offerQrPrintTexts.printFooterLine;
  const backHref = isStore
    ? "/admin/store-print"
    : isMain
      ? "/admin/qr"
      : `/admin/partners/${partner!.id}`;
  const qrAlt = isMain ? "QR главная" : isPartner ? `QR ${partner!.slug}` : "QR";
  const showLeadBlock = !isStore;

  const isA6Duo = format === "a6";
  const pageSize = isA6Duo
    ? "A4 landscape"
    : format === "a4"
      ? "A4 portrait"
      : format === "a8"
        ? "A8 portrait"
        : "A6 portrait";
  const pageMargin = isA6Duo || isStore ? "0" : "4mm";

  const sheetHeader = (
    <header className="sheet-header">
      {isPartner ? (
        <p className="brand-badge collaboration">{collaboration}</p>
      ) : (
        <p className="brand-badge">{offerQrPrintTexts.printBrandLabel}</p>
      )}
      <h1 className="headline">
        <span className="headline-line">{offerQrPrintTexts.printHeadlineLine1}</span>
        <span className="headline-line">{offerQrPrintTexts.printHeadlineLine2}</span>
      </h1>
      <p className="subheadline">{offerQrPrintTexts.printSubheadline}</p>
    </header>
  );

  const sheetFooter = (
    <footer className="sheet-footer">
      <p className="footer-text footer-tagline">{footerTagline}</p>
    </footer>
  );

  const leadBlock = showLeadBlock ? (
    <>
      <div className="scan-ribbon">
        <p className="scan-label">{offerQrPrintTexts.printScanLabelLine1}</p>
        <p className="scan-label-sub">{offerQrPrintTexts.printScanLabelLine2}</p>
      </div>

      <div className="qr-wrap">
        <div className="qr-frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrImageUrl!} alt={qrAlt} className="qr-img" />
        </div>
      </div>

      <div className="contact-card">
        <p className="visit-intro">{offerQrPrintTexts.printVisitIntro}</p>
        {extraLine && <p className="partner-route-line">{extraLine}</p>}
        <p className="address-line">{offerQrPrintTexts.printAddressLine}</p>
        <p className="phone-line">{offerQrPrintTexts.printPhoneLine}</p>
      </div>
    </>
  ) : null;

  const sheetBody = isStore ? (
    <>
      <div className="sheet-top-bar" aria-hidden="true" />
      <div className="store-fill">
        <div className="store-block">{sheetHeader}</div>
        <div className="store-gap" aria-hidden="true" />
        <div className="store-block">
          <ul className="categories">
            {offerQrPrintTexts.printGiftCategories.map((item) => (
              <li key={item}>
                <span className="category-pill">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="store-gap" aria-hidden="true" />
        <div className="store-block">
          <p className="section-intro">{offerQrPrintTexts.printProductsIntro}</p>
          <ul className="highlights highlights-row">
            {offerQrPrintTexts.printProductHighlights.map((item) => (
              <li key={item}>
                <span className="highlight-pill">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="store-gap" aria-hidden="true" />
        <div className="store-block">
          <h2 className="headline sea-headline">
            <span className="headline-line">{offerQrPrintTexts.printSeaTitleLine1}</span>
            <span className="headline-line">{offerQrPrintTexts.printSeaTitleLine2}</span>
          </h2>
          <ul className="sea-products">
            {offerQrPrintTexts.printSeaProducts.map((item) => (
              <li key={item}>
                <span className="category-pill">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="store-gap" aria-hidden="true" />
        <div className="store-block store-block-cta">
          <p className="what-is-it what-is-it-store">{offerQrPrintTexts.printWhatIsIt}</p>
          <p className="store-invite">{offerQrPrintTexts.printStoreInvite}</p>
        </div>
        {sheetFooter}
      </div>
    </>
  ) : (
    <>
      <div className="sheet-top-bar" aria-hidden="true" />
      {sheetHeader}
      <ul className="categories">
        {offerQrPrintTexts.printGiftCategories.map((item) => (
          <li key={item}>
            <span className="category-pill">{item}</span>
          </li>
        ))}
      </ul>
      <p className="section-intro">{offerQrPrintTexts.printProductsIntro}</p>
      <ul className="highlights highlights-row">
        {offerQrPrintTexts.printProductHighlights.map((item) => (
          <li key={item}>
            <span className="highlight-pill">{item}</span>
          </li>
        ))}
      </ul>
      <h2 className="headline sea-headline">
        <span className="headline-line">{offerQrPrintTexts.printSeaTitleLine1}</span>
        <span className="headline-line">{offerQrPrintTexts.printSeaTitleLine2}</span>
      </h2>
      <ul className="sea-products">
        {offerQrPrintTexts.printSeaProducts.map((item) => (
          <li key={item}>
            <span className="category-pill">{item}</span>
          </li>
        ))}
      </ul>
      <p className="what-is-it">{offerQrPrintTexts.printWhatIsIt}</p>
      {leadBlock}
      {sheetFooter}
    </>
  );

  return (
    <div className={`print-root${isStore ? " print-root-store" : ""}`}>
      <div className="no-print toolbar">
        <button type="button" onClick={() => window.print()} className="print-btn">
          {isA6Duo ? "Печать A6 ×2 (альбом)" : `Печать ${format.toUpperCase()}`}
        </button>
        <a href={backHref} className="back-link">
          ← Назад
        </a>
        {landingUrl && (
          <span className="url-preview">{landingUrl.replace(/^https?:\/\//, "")}</span>
        )}
        <span className="pdf-hint">PDF: Печать → «Сохранить как PDF»</span>
      </div>

      {isA6Duo ? (
        <div className="a6-duo-page">
          <article className={`sheet sheet-a6${isStore ? " sheet-store" : ""}`}>{sheetBody}</article>
          <article className={`sheet sheet-a6 sheet-a6-second${isStore ? " sheet-store" : ""}`}>
            {sheetBody}
          </article>
        </div>
      ) : (
        <article className={`sheet sheet-${format}${isStore ? " sheet-store" : ""}`}>
          {sheetBody}
        </article>
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
          font-size: 0.95rem;
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
          height: 148mm;
          min-height: 148mm;
          max-height: 148mm;
          font-size: 0.94rem;
          padding: 5.5mm 4.5mm 4.5mm;
          box-sizing: border-box;
        }
        .sheet-a6:not(.sheet-store) .sheet-footer {
          margin-top: auto;
          flex-shrink: 0;
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
          font-size: 0.76rem;
          padding: 5mm 3.5mm 4mm;
        }
        .print-root-store {
          padding: 0;
          display: flex;
          justify-content: center;
        }
        .sheet-store {
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          max-width: 100%;
        }
        .store-fill {
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          min-height: 0;
          overflow: hidden;
        }
        .store-block {
          flex: 0 0 auto;
        }
        .store-gap {
          flex: 1 1 0;
          min-height: 0;
        }
        .store-block-cta {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .sheet-store.sheet-a4 {
          width: 210mm;
          height: 297mm;
          min-height: 297mm;
          max-height: 297mm;
          padding: 9mm 10mm 7mm;
          font-size: 1.35rem;
        }
        .sheet-store.sheet-a6 {
          width: 105mm;
          height: 148mm;
          min-height: 148mm;
          max-height: 148mm;
          padding: 4mm 4mm 3.5mm;
          font-size: 0.82rem;
        }
        .sheet-store .sheet-header {
          margin-bottom: 0;
        }
        .sheet-store .sheet-footer {
          margin-top: auto;
          flex: 0 0 auto;
          padding-top: 0.35rem;
        }
        .sheet-store.sheet-a6 .sheet-footer {
          padding-top: 0.2rem;
        }
        .sheet-store .brand-badge {
          font-size: 0.95em;
          padding: 0.35rem 0.75rem;
          margin-bottom: 0.35rem;
        }
        .sheet-store.sheet-a6 .brand-badge {
          font-size: 0.82em;
          padding: 0.22rem 0.5rem;
          margin-bottom: 0.2rem;
        }
        .sheet-store .headline {
          padding: 0.5rem 0.4rem;
          margin: 0;
        }
        .sheet-store.sheet-a6 .headline {
          padding: 0.28rem 0.24rem;
        }
        .sheet-store .headline-line {
          font-size: 2.35em;
          line-height: 1.04;
        }
        .sheet-store.sheet-a6 .headline-line {
          font-size: 1.38em;
        }
        .sheet-store .subheadline {
          font-size: 1.15em;
          margin: 0.3rem 0 0;
          line-height: 1.25;
        }
        .sheet-store.sheet-a6 .subheadline {
          font-size: 0.98em;
          margin: 0.18rem 0 0;
        }
        .sheet-store .section-intro {
          font-size: 1.05em;
          margin: 0 0 0.12rem;
        }
        .sheet-store.sheet-a6 .section-intro {
          font-size: 0.92em;
        }
        .sheet-store .categories,
        .sheet-store .sea-products {
          margin: 0;
          gap: 0.28rem 0.35rem;
        }
        .sheet-store.sheet-a6 .categories,
        .sheet-store.sheet-a6 .sea-products {
          gap: 0.14rem 0.2rem;
        }
        .sheet-store .category-pill {
          font-size: 1.08em;
          padding: 0.28rem 0.35rem;
          line-height: 1.15;
        }
        .sheet-store.sheet-a6 .category-pill {
          font-size: 0.92em;
          padding: 0.18rem 0.24rem;
        }
        .sheet-store .highlight-pill {
          font-size: 1.02em;
          padding: 0.22rem 0.4rem;
        }
        .sheet-store.sheet-a6 .highlight-pill {
          font-size: 0.86em;
          padding: 0.14rem 0.26rem;
        }
        .sheet-store .sea-headline {
          margin: 0;
        }
        .sheet-store .sea-headline .headline-line {
          font-size: 1.95em;
        }
        .sheet-store.sheet-a6 .sea-headline .headline-line {
          font-size: 1.22em;
        }
        .sheet-store .what-is-it-store {
          font-size: 1.12em;
          margin: 0;
          line-height: 1.2;
        }
        .sheet-store.sheet-a6 .what-is-it-store {
          font-size: 0.95em;
        }
        .store-invite {
          margin: 0;
          padding: 0.35rem 0.5rem;
          font-size: 1.05em;
          font-weight: 700;
          color: #0f766e;
          line-height: 1.25;
          background: linear-gradient(135deg, #ecfdf5 0%, #fef9c3 100%);
          border: 1px solid #5eead4;
          border-radius: 2.5mm;
        }
        .sheet-store .store-invite {
          font-size: 1.12em;
          padding: 0.38rem 0.5rem;
        }
        .sheet-store.sheet-a6 .store-invite {
          font-size: 0.95em;
          padding: 0.26rem 0.36rem;
        }
        .sheet-store .footer-tagline {
          font-size: 0.95em;
        }
        .sheet-store.sheet-a6 .footer-tagline {
          font-size: 0.82em;
        }
        .print-root-store .a6-duo-page {
          gap: 5mm;
          width: calc(210mm + 5mm);
          max-width: 100%;
        }
        @media screen {
          .sheet-a6:not(.sheet-store) {
            height: auto;
            min-height: 0;
            max-height: none;
            aspect-ratio: 105 / 148;
          }
          .sheet-store.sheet-a4 {
            height: auto;
            min-height: 0;
            max-height: none;
            aspect-ratio: 210 / 297;
          }
          .sheet-store.sheet-a6 {
            height: auto;
            min-height: 0;
            max-height: none;
            aspect-ratio: 105 / 148;
          }
          .sheet-store .store-gap {
            flex: 0 0 0.35rem;
            min-height: 0.35rem;
          }
          .sheet-store.sheet-a4 .store-gap {
            flex: 0 0 0.55rem;
            min-height: 0.55rem;
          }
        }
        .sheet-header {
          margin-bottom: 0.2rem;
          padding-top: 1mm;
        }
        .brand-badge {
          display: inline-block;
          margin: 0 auto 0.4rem;
          padding: 0.32rem 0.7rem;
          font-size: 0.82em;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #065f46;
          background: linear-gradient(135deg, #ccfbf1 0%, #fef3c7 100%);
          border: 1px solid #5eead4;
          border-radius: 999px;
        }
        .sheet-a6 .brand-badge {
          font-size: 0.76em;
          padding: 0.26rem 0.55rem;
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
          font-size: 2.05em;
          font-weight: 900;
          color: #0c4a6e;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
        }
        .sheet-a6 .headline-line {
          font-size: 1.45em;
        }
        .sheet-a8 .headline-line {
          font-size: 1.12em;
        }
        .subheadline {
          margin: 0.42rem 0 0.28rem;
          font-size: 1.06em;
          font-weight: 700;
          color: #334155;
          line-height: 1.3;
        }
        .sheet-a6 .subheadline {
          font-size: 0.96em;
        }
        .sheet-a8 .subheadline {
          font-size: 0.7em;
        }
        .partner-route-line {
          margin: 0.08rem 0 0.12rem;
          font-size: 0.9em;
          font-weight: 700;
          color: #0f766e;
          line-height: 1.3;
        }
        .sheet-a6 .partner-route-line {
          font-size: 0.82em;
        }
        .sheet-a8 .partner-route-line {
          font-size: 0.68em;
        }
        .categories,
        .sea-products {
          list-style: none;
          padding: 0;
          margin: 0.2rem auto 0.25rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.22rem 0.4rem;
          max-width: 96%;
        }
        .section-intro {
          margin: 0.12rem 0 0.18rem;
          font-size: 0.96em;
          font-weight: 700;
          color: #475569;
        }
        .sheet-a6 .section-intro {
          font-size: 0.86em;
        }
        .highlights {
          list-style: none;
          padding: 0;
          margin: 0 0 0.22rem;
          display: flex;
          align-items: center;
        }
        .highlights-row {
          flex-direction: row;
          flex-wrap: nowrap;
          justify-content: center;
          gap: 0.16rem 0.22rem;
          max-width: 100%;
        }
        .highlights-row li {
          flex: 0 1 auto;
          min-width: 0;
        }
        .highlight-pill {
          display: inline-block;
          padding: 0.22rem 0.46rem;
          font-size: 1.02em;
          font-weight: 700;
          color: #92400e;
          background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%);
          border: 1px solid #fcd34d;
          border-radius: 999px;
          white-space: nowrap;
          line-height: 1.12;
          letter-spacing: -0.01em;
        }
        .sheet-a6 .highlights-row {
          gap: 0.1rem 0.14rem;
        }
        .sheet-a6 .highlight-pill {
          font-size: 0.84em;
          padding: 0.16rem 0.28rem;
        }
        .sheet-a8 .highlight-pill {
          font-size: 0.68em;
          padding: 0.14rem 0.24rem;
        }
        .sea-headline {
          margin: 0.18rem 0 0.2rem;
          background: linear-gradient(135deg, #dbeafe 0%, #fef9c3 50%, #d1fae5 100%);
          border-color: #38bdf8;
          box-shadow: 0 3px 10px rgba(56, 189, 248, 0.14);
        }
        .sheet-a6 .sea-headline {
          padding: 0.32rem 0.24rem;
          margin: 0.14rem 0 0.16rem;
        }
        .sea-headline .headline-line {
          font-size: 1.72em;
        }
        .sheet-a6 .sea-headline .headline-line {
          font-size: 1.22em;
        }
        .sheet-a8 .sea-headline .headline-line {
          font-size: 0.95em;
        }
        .what-is-it {
          margin: 0.18rem 0 0.14rem;
          font-size: 1.02em;
          font-weight: 800;
          color: #7c3aed;
        }
        .sheet-a6 .what-is-it {
          font-size: 0.9em;
        }
        .categories {
          padding: 0.2rem 0 0.25rem;
        }
        .categories li {
          display: flex;
          justify-content: center;
        }
        .category-pill {
          display: inline-block;
          width: 100%;
          padding: 0.24rem 0.35rem;
          font-size: 0.94em;
          font-weight: 600;
          color: #1e3a2f;
          line-height: 1.2;
          background: rgba(236, 253, 245, 0.9);
          border: 1px solid #a7f3d0;
          border-radius: 2mm;
        }
        .sheet-a6 .category-pill {
          font-size: 0.84em;
          padding: 0.2rem 0.28rem;
        }
        .sheet-a8 .category-pill {
          font-size: 0.58em;
        }
        .scan-ribbon {
          margin: 0.1rem 0 0.2rem;
        }
        .scan-label,
        .scan-label-sub {
          display: block;
          margin: 0;
          padding: 0.3rem 0.6rem;
          font-size: 1.02em;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #ffffff;
          line-height: 1.2;
          background: linear-gradient(135deg, #047857 0%, #0d9488 100%);
        }
        .scan-label {
          border-radius: 2mm 2mm 0 0;
          padding-bottom: 0.15rem;
        }
        .scan-label-sub {
          font-size: 0.88em;
          letter-spacing: 0.03em;
          border-radius: 0 0 2mm 2mm;
          padding-top: 0.1rem;
          box-shadow: 0 3px 8px rgba(4, 120, 87, 0.2);
        }
        .sheet-a6 .scan-label {
          font-size: 0.86em;
          padding: 0.24rem 0.42rem 0.1rem;
        }
        .sheet-a6 .scan-label-sub {
          font-size: 0.76em;
          padding: 0.08rem 0.42rem 0.18rem;
        }
        .sheet-a8 .scan-label {
          font-size: 0.52em;
        }
        .sheet-a8 .scan-label-sub {
          font-size: 0.48em;
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
          width: 28mm;
          height: 28mm;
        }
        .sheet-a8 .qr-img {
          width: 26mm;
          height: 26mm;
        }
        .contact-card {
          margin-top: 0.05rem;
          padding: 0.3rem 0.45rem;
          background: linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 100%);
          border: 1px solid #86efac;
          border-radius: 2.5mm;
        }
        .sheet-a6 .contact-card {
          padding: 0.22rem 0.32rem;
        }
        .sheet-a8 .contact-card {
          padding: 0.28rem 0.35rem;
        }
        .visit-intro {
          margin: 0 0 0.1rem;
          font-size: 0.88em;
          font-weight: 700;
          color: #334155;
          line-height: 1.25;
        }
        .sheet-a6 .visit-intro {
          font-size: 0.8em;
        }
        .sheet-a8 .visit-intro {
          font-size: 0.68em;
        }
        .address-line,
        .phone-line {
          margin: 0.06rem 0 0;
          font-size: 0.96em;
          font-weight: 700;
          color: #166534;
        }
        .sheet-a6 .address-line,
        .sheet-a6 .phone-line {
          font-size: 0.86em;
        }
        .sheet-a8 .address-line,
        .sheet-a8 .phone-line {
          font-size: 0.58em;
        }
        .sheet-footer {
          margin-top: auto;
          padding-top: 0.25rem;
        }
        .footer-text {
          font-size: 0.72em;
          color: #0d9488;
          margin: 0;
          font-weight: 700;
          letter-spacing: 0.02em;
          line-height: 1.3;
        }
        .footer-tagline {
          font-size: 0.78em;
        }
        .sheet-a6 .footer-tagline {
          font-size: 0.7em;
        }
        .sheet-a8 .footer-tagline {
          font-size: 0.58em;
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
          .sea-headline,
          .scan-label,
          .scan-label-sub,
          .brand-badge,
          .category-pill,
          .highlight-pill,
          .contact-card,
          .sheet-top-bar,
          .qr-frame {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .sheet-a4 {
            padding: 7mm 8mm 6mm !important;
            font-size: 11.5pt;
          }
          .sheet-a4 .headline-line {
            font-size: 1.9em !important;
          }
          .sheet-a4 .sea-headline .headline-line {
            font-size: 1.65em !important;
          }
          .sheet-a4 .scan-label {
            font-size: 1em !important;
          }
          .sheet-a4 .scan-label-sub {
            font-size: 0.88em !important;
          }
          .sheet-a4 .highlight-pill {
            font-size: 1.05em !important;
          }
          .a6-duo-page {
            flex-direction: row !important;
            width: 297mm !important;
            min-height: 210mm !important;
            height: 210mm !important;
            gap: 5mm !important;
            justify-content: center !important;
            align-items: center !important;
            padding: 0 !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .a6-duo-page .sheet-a6 {
            width: 105mm !important;
            height: 148mm !important;
            min-height: 148mm !important;
            max-height: 148mm !important;
            box-sizing: border-box !important;
            margin: 0 !important;
            padding: 4mm 3.5mm 3.5mm !important;
            font-size: 8.2pt !important;
            overflow: hidden !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            display: flex !important;
            flex-direction: column !important;
          }
          .a6-duo-page .sheet-a6:not(.sheet-store) {
            padding: 3mm 3.2mm 2.8mm !important;
            font-size: 7.4pt !important;
          }
          .a6-duo-page .sheet-a6:not(.sheet-store) .headline {
            padding: 0.28rem 0.22rem !important;
          }
          .a6-duo-page .sheet-a6:not(.sheet-store) .headline-line {
            font-size: 1.08em !important;
          }
          .a6-duo-page .sheet-a6:not(.sheet-store) .subheadline {
            font-size: 0.88em !important;
            margin: 0.18rem 0 0.1rem !important;
          }
          .a6-duo-page .sheet-a6:not(.sheet-store) .categories,
          .a6-duo-page .sheet-a6:not(.sheet-store) .sea-products {
            gap: 0.1rem 0.14rem !important;
            margin: 0.08rem auto !important;
          }
          .a6-duo-page .sheet-a6:not(.sheet-store) .sea-headline {
            margin: 0.08rem 0 !important;
            padding: 0.22rem 0.2rem !important;
          }
          .a6-duo-page .sheet-a6:not(.sheet-store) .sea-headline .headline-line {
            font-size: 1em !important;
          }
          .a6-duo-page .sheet-a6:not(.sheet-store) .what-is-it {
            font-size: 0.82em !important;
            margin: 0.06rem 0 !important;
          }
          .a6-duo-page .sheet-a6:not(.sheet-store) .scan-label {
            font-size: 0.8em !important;
            padding: 0.14rem 0.3rem 0.05rem !important;
          }
          .a6-duo-page .sheet-a6:not(.sheet-store) .scan-label-sub {
            font-size: 0.7em !important;
            padding: 0.03rem 0.3rem 0.1rem !important;
          }
          .a6-duo-page .sheet-a6:not(.sheet-store) .qr-wrap {
            margin: 0 auto 0.12rem !important;
          }
          .a6-duo-page .sheet-a6:not(.sheet-store) .qr-frame {
            padding: 1.2mm !important;
          }
          .a6-duo-page .sheet-a6:not(.sheet-store) .qr-img {
            width: 19mm !important;
            height: 19mm !important;
          }
          .a6-duo-page .sheet-a6:not(.sheet-store) .contact-card {
            padding: 0.14rem 0.26rem !important;
          }
          .a6-duo-page .sheet-a6:not(.sheet-store) .visit-intro,
          .a6-duo-page .sheet-a6:not(.sheet-store) .partner-route-line {
            font-size: 0.74em !important;
            line-height: 1.18 !important;
          }
          .a6-duo-page .sheet-a6:not(.sheet-store) .address-line,
          .a6-duo-page .sheet-a6:not(.sheet-store) .phone-line {
            font-size: 0.76em !important;
          }
          .a6-duo-page .sheet-a6:not(.sheet-store) .sheet-footer {
            padding-top: 0.1rem !important;
          }
          .a6-duo-page .sheet-a6:not(.sheet-store) .footer-tagline {
            font-size: 0.62em !important;
          }
          .sheet-a6 .headline-line {
            font-size: 1.35em !important;
          }
          .a6-duo-page .sheet-a6 .headline-line {
            font-size: 1.2em !important;
          }
          .a6-duo-page .sheet-a6 .sea-headline .headline-line {
            font-size: 1.12em !important;
          }
          .a6-duo-page .sheet-a6 .scan-label {
            font-size: 0.9em !important;
          }
          .a6-duo-page .sheet-a6 .scan-label-sub {
            font-size: 0.8em !important;
          }
          .a6-duo-page .sheet-a6 .highlight-pill {
            font-size: 0.8em !important;
            padding: 0.14rem 0.24rem !important;
          }
          .a6-duo-page .sheet-a6 .highlights-row {
            gap: 0.08rem 0.1rem !important;
          }
          .a6-duo-page .sheet-a6 .qr-img {
            width: 24mm !important;
            height: 24mm !important;
          }
          .sheet-a8 {
            padding: 4mm 3mm 3.5mm !important;
          }
          .sheet-a8 .headline-line {
            font-size: 1em !important;
          }
          .sheet-a4 .qr-img {
            width: 46mm !important;
            height: 46mm !important;
          }
          .sheet-a8 .qr-img {
            width: 24mm !important;
            height: 24mm !important;
          }
          .print-root-store .sheet-a4.sheet-store {
            width: 210mm !important;
            height: 297mm !important;
            min-height: 297mm !important;
            max-height: 297mm !important;
            max-width: none !important;
            padding: 9mm 10mm 7mm !important;
            font-size: 19pt !important;
            margin: 0 !important;
            border-radius: 0 !important;
            border: none !important;
            overflow: hidden !important;
          }
          .print-root-store .sheet-a4.sheet-store .headline-line {
            font-size: 2.35em !important;
          }
          .print-root-store .sheet-a4.sheet-store .sea-headline .headline-line {
            font-size: 1.95em !important;
          }
          .print-root-store .sheet-a4.sheet-store .category-pill {
            font-size: 1.08em !important;
          }
          .print-root-store .sheet-a4.sheet-store .highlight-pill {
            font-size: 1.02em !important;
          }
          .print-root-store .sheet-a4.sheet-store .what-is-it-store {
            font-size: 1.12em !important;
          }
          .print-root-store .sheet-a4.sheet-store .store-invite {
            font-size: 1.12em !important;
          }
          .print-root-store .sheet-a4.sheet-store .footer-tagline {
            font-size: 0.95em !important;
          }
          .print-root-store .a6-duo-page {
            width: calc(210mm + 5mm) !important;
            min-height: 148mm !important;
            height: auto !important;
            gap: 5mm !important;
            justify-content: center !important;
            align-items: center !important;
          }
          .print-root-store .a6-duo-page .sheet-a6.sheet-store {
            width: 105mm !important;
            height: 148mm !important;
            min-height: 148mm !important;
            max-height: 148mm !important;
            padding: 4mm 4mm 3.5mm !important;
            font-size: 9pt !important;
            margin: 0 !important;
            border-radius: 0 !important;
            overflow: hidden !important;
          }
          .print-root-store .a6-duo-page .sheet-a6.sheet-store .headline-line {
            font-size: 1.38em !important;
          }
          .print-root-store .a6-duo-page .sheet-a6.sheet-store .sea-headline .headline-line {
            font-size: 1.22em !important;
          }
          .print-root-store .a6-duo-page .sheet-a6.sheet-store .category-pill {
            font-size: 0.92em !important;
          }
          .print-root-store .a6-duo-page .sheet-a6.sheet-store .highlight-pill {
            font-size: 0.86em !important;
          }
          .print-root-store .a6-duo-page .sheet-a6.sheet-store .what-is-it-store {
            font-size: 0.95em !important;
          }
          .print-root-store .a6-duo-page .sheet-a6.sheet-store .store-invite {
            font-size: 0.95em !important;
          }
          .print-root-store .a6-duo-page .sheet-a6.sheet-store .footer-tagline {
            font-size: 0.82em !important;
          }
          @page {
            size: ${pageSize};
            margin: ${pageMargin};
          }
        }
      `}</style>
    </div>
  );
}
