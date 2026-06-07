import { popularItemsList } from "@/lib/landing-marketing";

export function PopularItemsSection({
  buttonLabel,
  giftOpen,
  onToggleGift,
}: {
  buttonLabel: string;
  giftOpen: boolean;
  onToggleGift: () => void;
}) {
  return (
    <section className="mb-5 rounded-2xl border border-green-100 bg-surface p-5">
      <h2 className="text-lg font-bold text-gray-900">Что чаще всего берут отдыхающие</h2>
      <ul className="mt-3 space-y-2">
        {popularItemsList.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-gray-800">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onToggleGift}
        aria-expanded={giftOpen}
        aria-controls="gift-instructions"
        className={`mt-5 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-base font-semibold transition ${
          giftOpen
            ? "bg-white text-primary border-2 border-primary/40"
            : "bg-accent text-gray-900 shadow-md shadow-amber-200/50 ring-2 ring-amber-300/60 hover:brightness-105"
        }`}
      >
        {giftOpen ? "Свернуть инструкцию" : buttonLabel}
      </button>
    </section>
  );
}
