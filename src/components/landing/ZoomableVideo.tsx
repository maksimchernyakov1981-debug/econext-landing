"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function ZoomableVideo({
  src,
  caption,
  hint = "Нажмите для просмотра на весь экран",
}: {
  src: string;
  caption?: string | null;
  hint?: string;
}) {
  const [open, setOpen] = useState(false);
  const previewRef = useRef<HTMLVideoElement>(null);
  const fullscreenRef = useRef<HTMLVideoElement>(null);

  const close = useCallback(() => {
    previewRef.current?.pause();
    fullscreenRef.current?.pause();
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    fullscreenRef.current?.play().catch(() => {});
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const enterNativeFullscreen = async () => {
    const el = fullscreenRef.current;
    if (!el) return;
    try {
      if (el.requestFullscreen) await el.requestFullscreen();
      else if ("webkitEnterFullscreen" in el) {
        (el as HTMLVideoElement & { webkitEnterFullscreen: () => void }).webkitEnterFullscreen();
      }
    } catch {
      /* браузер может отклонить без жеста пользователя */
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full block text-left relative rounded-2xl overflow-hidden bg-black"
        aria-label="Открыть видео на весь экран"
      >
        <video
          ref={previewRef}
          src={src}
          muted
          playsInline
          preload="metadata"
          className="w-full max-h-[280px] object-cover pointer-events-none"
        />
        <div className="absolute inset-0 flex items-end justify-center pb-2 bg-gradient-to-t from-black/50 to-transparent pointer-events-none">
          <span className="text-xs text-white/90 px-3 py-1 rounded-full bg-black/40">
            {hint}
          </span>
        </div>
      </button>
      {caption && <p className="text-sm text-muted mt-2 text-center">{caption}</p>}

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black flex flex-col"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between p-3">
            <button
              type="button"
              className="min-h-[40px] px-4 rounded-full bg-white/15 text-white text-sm"
              onClick={(e) => {
                e.stopPropagation();
                void enterNativeFullscreen();
              }}
            >
              ⛶ На весь экран
            </button>
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
            className="flex-1 flex items-center justify-center p-4 pt-16 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              ref={fullscreenRef}
              src={src}
              controls
              playsInline
              className="w-full max-h-[80vh] object-contain"
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
