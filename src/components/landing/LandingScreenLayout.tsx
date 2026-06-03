import Link from "next/link";

export function LandingScreenLayout({
  title,
  backLabel,
  backHref,
  children,
}: {
  title: string;
  backLabel: string;
  backHref: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen max-w-lg mx-auto flex flex-col bg-white">
      <header className="sticky top-0 z-20 bg-white border-b border-green-100 px-4 py-3">
        <Link
          href={backHref}
          className="text-primary font-medium text-sm mb-2 min-h-[44px] flex items-center"
        >
          {backLabel}
        </Link>
        <h1 className="text-lg font-bold text-gray-900 leading-snug">{title}</h1>
      </header>
      <main className="flex-1 px-4 py-4 pb-8 overflow-y-auto">{children}</main>
    </div>
  );
}
