"use client";

import { useCallback, useEffect, useState } from "react";

export function ZoomableImage({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string | null;
}) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl overflow-hidden bg-gray-100 block text-left"
        aria-label="Увеличить изображение"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full h-auto object-contain max-h-[50vh]"
          loading="lazy"
          decoding="async"
        />
        <p className="text-xs text-center text-primary py-2">Нажмите, чтобы увеличить</p>
      </button>
      {caption && <p className="text-sm text-muted mt-2 text-center">{caption}</p>}

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <button
            type="button"
            className="absolute top-3 right-3 z-10 min-h-[44px] min-w-[44px] rounded-full bg-white/20 text-white text-2xl"
            onClick={close}
            aria-label="Закрыть"
          >
            ×
          </button>
          <div
            className="flex-1 flex items-center justify-center p-4 overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-[85vh] w-auto h-auto object-contain"
            />
          </div>
          {caption && (
            <p className="text-white text-center text-sm px-4 pb-6 shrink-0">{caption}</p>
          )}
        </div>
      )}
    </>
  );
}
