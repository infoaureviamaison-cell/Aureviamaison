import { PrismaClient } from "@prisma/client";
import { DEFAULT_PROMO_BANNERS } from "../src/components/features/home/promo-banner-types.ts";

const prisma = new PrismaClient();

try {
  await prisma.homepageSection.upsert({
    where: { sectionKey: "promo-banners" },
    update: {
      title: "Featured offers",
      subtitle: "Homepage promotional banners",
      content: DEFAULT_PROMO_BANNERS,
      isActive: true,
      order: 2,
    },
    create: {
      sectionKey: "promo-banners",
      title: "Featured offers",
      subtitle: "Homepage promotional banners",
      content: DEFAULT_PROMO_BANNERS,
      isActive: true,
      order: 2,
    },
  });
  console.log(`Stored ${DEFAULT_PROMO_BANNERS.length} promotional banners.`);
} finally {
  await prisma.$disconnect();
}
