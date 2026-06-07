import Link from "next/link";
import { LogoutButton } from "./LogoutButton";
import { PublishBar } from "./PublishBar";

const NAV = [
  { href: "/admin", label: "Пульт" },
  { href: "/admin/partners", label: "Партнёры" },
  { href: "/admin/landing", label: "Тексты" },
  { href: "/admin/buttons", label: "Кнопки" },
  { href: "/admin/maps", label: "Карты" },
  { href: "/admin/schedule", label: "График" },
  { href: "/admin/catalog", label: "Ассортимент" },
  { href: "/admin/qr", label: "QR" },
  { href: "/admin/media", label: "Фото/видео" },
  { href: "/admin/contacts", label: "Контакты" },
  { href: "/admin/special-days", label: "Особые дни" },
  { href: "/admin/stats", label: "Статистика" },
];

export function AdminShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white px-4 py-3 flex justify-between items-center sticky top-0 z-10">
        <span className="font-bold">EcoNext Admin</span>
        <LogoutButton />
      </header>
      <nav className="flex gap-2 overflow-x-auto px-3 py-2 bg-white border-b text-sm">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="whitespace-nowrap px-3 py-1 rounded-full bg-surface text-primary"
          >
            {n.label}
          </Link>
        ))}
      </nav>
      <main className="p-4 max-w-2xl mx-auto pb-12">
        {title && <h1 className="text-xl font-bold mb-4">{title}</h1>}
        <PublishBar />
        {children}
      </main>
    </div>
  );
}
