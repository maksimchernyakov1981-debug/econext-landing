import { storeShowcaseCards } from "@/lib/landing-marketing";

export function ProductShowcaseSection() {
  return (
    <section className="mb-5">
      <h2 className="text-lg font-bold text-gray-900">Что можно посмотреть на точке</h2>
      <p className="mt-1 text-sm text-gray-600">
        Можно всё потрогать, сравнить и выбрать для себя, в дорогу или в подарок.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {storeShowcaseCards.map((card) => (
          <article
            key={card.title}
            className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-white to-cyan-50/40 p-4 shadow-sm"
          >
            <h3 className="font-semibold text-primary">{card.title}</h3>
            <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">{card.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
