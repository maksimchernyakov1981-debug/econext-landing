export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function NotFound() {
  const landing = await prisma.landingSettings.findFirst({ where: { id: 1 } });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-xl font-bold text-primary">
        {landing?.notFoundTitle ?? "Не найдено"}
      </h1>
      <p className="mt-2 text-muted">
        {landing?.notFoundDescription ?? ""}
      </p>
      <Link href="/" className="mt-6 text-primary font-medium underline">
        На главную EcoNext
      </Link>
    </div>
  );
}
