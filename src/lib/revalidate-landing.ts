import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";

/** Сброс кэша страниц лендинга после правок в админке. */
export async function revalidateAllLanding() {
  revalidatePath("/", "layout");
  revalidatePath("/gift", "layout");

  const partners = await prisma.partner.findMany({
    select: { slug: true },
    where: { isActive: true },
  });
  for (const p of partners) {
    revalidatePath(`/gift/${p.slug}`);
  }
}
