"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const MIN_SCALE = 1;
const MAX_SCALE = 4;

function clampScale(value: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));
}

export function ZoomableImage({
  src,
  alt,
  caption,
  hint = "Нажмите, чтобы увеличить",
  previewClassName = "max-h-[50vh]",
}: {
  src: string;
  alt: string;
  caption?: string | null;
  hint?: string;
  previewClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const pinchStart = useRef<{ distance: number; scale: number } | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setScale(1);
    pinchStart.current = null;
  }, []);

  const zoomIn = useCallback(() => setScale((s) => clampScale(s + 0.5)), []);
  const zoomOut = useCallback(() => setScale((s) => clampScale(s - 0.5)), []);
  const resetZoom = useCallback(() => setScale(1), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, zoomIn, zoomOut]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 2) {
      pinchStart.current = null;
      return;
    }
    const [a, b] = [e.touches[0], e.touches[1]];
    const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    pinchStart.current = { distance, scale };
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length !== 2 || !pinchStart.current) return;
    const [a, b] = [e.touches[0], e.touches[1]];
    const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    const ratio = distance / pinchStart.current.distance;
    setScale(clampScale(pinchStart.current.scale * ratio));
  };

  const onTouchEnd = () => {
    pinchStart.current = null;
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale((s) => clampScale(s + (e.deltaY < 0 ? 0.15 : -0.15)));
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl overflow-hidden bg-gray-100 block text-left"
        aria-label="Открыть фото на весь экран"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className={`w-full h-auto object-contain ${previewClassName}`}
          loading="lazy"
          decoding="async"
        />
        <p className="text-xs text-center text-primary py-2">{hint}</p>
      </button>
      {caption && <p className="text-sm text-muted mt-2 text-center">{caption}</p>}

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between gap-2 p-3">
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="min-h-[40px] min-w-[40px] rounded-full bg-white/15 text-white text-xl"
                onClick={zoomOut}
                aria-label="Уменьшить"
              >
                −
              </button>
              <button
                type="button"
                className="min-h-[40px] px-3 rounded-full bg-white/15 text-white text-sm"
                onClick={resetZoom}
              >
                {Math.round(scale * 100)}%
              </button>
              <button
                type="button"
                className="min-h-[40px] min-w-[40px] rounded-full bg-white/15 text-white text-xl"
                onClick={zoomIn}
                aria-label="Увеличить"
              >
                +
              </button>
            </div>
            <button
              type="button"
              className="min-h-[44px] min-w-[44px] rounded-full bg-white/20 text-white text-2xl"
              onClick={close}
              aria-label="Закрыть"
            >
              ×
            </button>
          </div>

          <div
            className="flex-1 overflow-auto touch-pan-x touch-pan-y"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onWheel={onWheel}
          >
            <div className="min-h-full min-w-full flex items-center justify-center p-4 pt-16 pb-20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                className="max-w-none transition-transform duration-100 ease-out select-none"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "center center",
                  maxHeight: scale === 1 ? "85vh" : "none",
                  width: scale === 1 ? "auto" : "100%",
                  height: "auto",
                }}
                draggable={false}
                onDoubleClick={() => setScale((s) => (s > 1 ? 1 : 2))}
              />
            </div>
          </div>

          <p className="text-white/70 text-xs text-center px-4 pb-3 shrink-0">
            Щипок или колёсико — масштаб · двойной тап — увеличить
          </p>
          {caption && (
            <p className="text-white text-center text-sm px-4 pb-6 shrink-0">{caption}</p>
          )}
        </div>
      )}
    </>
  );
}
