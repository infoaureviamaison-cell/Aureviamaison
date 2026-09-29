import { prisma } from "@/lib/prisma";
import { HeroSlide } from "@/types/hero";
import staticHeroSlides from "../../data/hero-slides.json";

type HeroSlideInput = Omit<HeroSlide, "id" | "order"> & { order?: number };
type HeroSlideUpdate = Partial<Omit<HeroSlide, "id">>;

function toHeroSlide(slide: any): HeroSlide {
  return {
    id: slide.id,
    imageUrl: slide.imageUrl,
    mobileImageUrl: slide.mobileImageUrl ?? undefined,
    imageAlt: slide.imageAlt,
    eyebrow: slide.eyebrow,
    title: slide.title,
    titleHighlight: slide.titleHighlight,
    description: slide.description,
    ctaPrimaryLabel: slide.ctaPrimaryLabel ?? undefined,
    ctaPrimaryHref: slide.ctaPrimaryHref ?? undefined,
    ctaSecondaryLabel: slide.ctaSecondaryLabel ?? undefined,
    ctaSecondaryHref: slide.ctaSecondaryHref ?? undefined,
    isActive: slide.isActive,
    order: slide.order,
  };
}

export function getStaticHeroSlides(): HeroSlide[] {
  return staticHeroSlides
    .filter((slide) => slide.isActive)
    .sort((a, b) => a.order - b.order)
    .map(toHeroSlide);
}

export async function getActiveHeroSlides(): Promise<HeroSlide[]> {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    return slides.length > 0 ? slides.map(toHeroSlide) : getStaticHeroSlides();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.warn(`Using static hero slides: ${message}`);
    return getStaticHeroSlides();
  }
}

export async function getAllHeroSlides(): Promise<HeroSlide[]> {
  const slides = await prisma.heroSlide.findMany({
    orderBy: { order: "asc" },
  });
  return slides.map(toHeroSlide);
}

export async function createHeroSlide(slide: HeroSlideInput): Promise<HeroSlide> {
  const slideCount = await prisma.heroSlide.count();
  const requestedOrder = slide.order ?? slideCount + 1;
  const order = Math.min(Math.max(requestedOrder, 1), slideCount + 1);
  const { order: _requestedOrder, ...data } = slide;

  const created = await prisma.$transaction(async (tx) => {
    await tx.heroSlide.updateMany({
      where: { order: { gte: order } },
      data: { order: { increment: 1 } },
    });
    return tx.heroSlide.create({ data: { ...data, order } });
  });
  return toHeroSlide(created);
}

export async function updateHeroSlide(
  id: string,
  data: HeroSlideUpdate,
): Promise<HeroSlide | null> {
  try {
    const current = await prisma.heroSlide.findUnique({ where: { id } });
    if (!current) return null;

    const { order: requestedOrder, ...slideData } = data;
    const updated = await prisma.$transaction(async (tx) => {
      if (requestedOrder !== undefined && requestedOrder !== current.order) {
        const slideCount = await tx.heroSlide.count();
        const order = Math.min(Math.max(requestedOrder, 1), slideCount);

        if (order < current.order) {
          await tx.heroSlide.updateMany({
            where: { id: { not: id }, order: { gte: order, lt: current.order } },
            data: { order: { increment: 1 } },
          });
        } else {
          await tx.heroSlide.updateMany({
            where: { id: { not: id }, order: { gt: current.order, lte: order } },
            data: { order: { decrement: 1 } },
          });
        }

        return tx.heroSlide.update({ where: { id }, data: { ...slideData, order } });
      }

      return tx.heroSlide.update({ where: { id }, data: slideData });
    });
    return toHeroSlide(updated);
  } catch (error: any) {
    if (error?.code === "P2025") return null;
    throw error;
  }
}

export async function deleteHeroSlide(id: string): Promise<boolean> {
  try {
    await prisma.heroSlide.delete({ where: { id } });
    return true;
  } catch (error: any) {
    if (error?.code === "P2025") return false;
    throw error;
  }
}

export async function reorderHeroSlides(orderedIds: string[]): Promise<HeroSlide[]> {
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.heroSlide.update({
        where: { id },
        data: { order: index + 1 },
      }),
    ),
  );
  return getAllHeroSlides();
}
