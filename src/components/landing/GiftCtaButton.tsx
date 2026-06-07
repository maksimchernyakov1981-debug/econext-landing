import { heroLocationHint } from "@/lib/offer-texts";

export function GiftCtaButton({
  giftOpen,
  onToggleGift,
  buttonLabel,
  showLocationHint = true,
}: {
  giftOpen: boolean;
  onToggleGift: () => void;
  buttonLabel: string;
  showLocationHint?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <button
        type="button"
        onClick={onToggleGift}
        aria-expanded={giftOpen}
        aria-controls="gift-instructions"
        className={`flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-base font-semibold transition ${
          giftOpen
            ? "bg-white text-primary border-2 border-primary/40"
            : "bg-accent text-gray-900 shadow-md shadow-amber-200/50 ring-2 ring-amber-300/60 hover:brightness-105"
        }`}
      >
        {giftOpen ? "Свернуть инструкцию" : buttonLabel}
      </button>
      {!giftOpen && showLocationHint && (
        <p className="text-xs text-center text-muted">{heroLocationHint}</p>
      )}
    </div>
  );
}
