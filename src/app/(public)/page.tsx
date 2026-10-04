import { prisma } from "@/lib/prisma";
import { serializeVideo } from "@/lib/video-utils";
import { HomeHeroSection } from "./_components/HomeHeroSection";
import { HomeContentSections } from "./_components/HomeContentSections";
import { createSeoMetadata } from "@/lib/seo";
import { DEFAULT_PROMO_BANNERS, parsePromoBanners } from "@/components/features/home/promo-banner-types";

export const revalidate = 300;

async function safeHomeQuery<T>(
  label: string,
  query: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await query();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.warn(`Using fallback for home page ${label}: ${message}`);
    return fallback;
  }
}

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.auerviamaison.com/#website",
  name: "Auerviamaison",
  url: "https://www.auerviamaison.com",
  publisher: { "@id": "https://www.auerviamaison.com/#organization" },
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.auerviamaison.com/products?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

function parseStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

export const metadata = createSeoMetadata({
  title: "Auerviamaison | Beauty, Makeup & Lifestyle Essentials",
  description: "Discover premium skincare, makeup, fragrance, watches, accessories and beauty essentials for everyday confidence at Auerviamaison.",
  path: "/",
  keywords: ["beauty store Pakistan", "premium skincare Pakistan", "makeup products Pakistan", "fragrance Pakistan", "beauty accessories Pakistan", "smartwatch Pakistan"],
});

export default async function Page() {
   const [categories, featuredCollections, featuredBlogs, homeVideos, homepageReels, certificates, promoBannerSection] = await Promise.all([
     safeHomeQuery(
       "categories",
       () => prisma.category.findMany({
         orderBy: [{ order: "asc" }, { name: "asc" }],
         select: { id: true, name: true, slug: true, description: true, image: true, parentId: true, order: true },
       }),
       [],
     ),
    safeHomeQuery(
      "featured collections",
      () => prisma.collection.findMany({
        where: {
          OR: [
            { isFeatured: true },
            { handle: { in: ["new-arrivals", "best-sellers"] } },
          ],
        },
        orderBy: [
          { isFeatured: "desc" },
          { updatedAt: "desc" },
        ],
        take: 20,
        select: { id: true, handle: true, title: true, image: true, isFeatured: true, productHandles: true },
      }),
      [],
    ),
    safeHomeQuery(
      "featured blogs",
      () => prisma.blogPost.findMany({
        where: {
          isFeatured: true,
          isIndexable: true,
          OR: [
            { status: "published", publishedAt: { lte: new Date() } },
            { status: "scheduled", scheduledAt: { lte: new Date() } },
          ],
        },
        orderBy: { publishedAt: "desc" },
        take: 20,
        select: { id: true, title: true, slug: true, excerpt: true, featuredImage: true, publishedAt: true, content: true },
      }),
      [],
    ),
    safeHomeQuery(
      "home videos",
      () => prisma.video.findMany({
        where: { active: true, placement: "HOMEPAGE" },
        orderBy: [{ featured: "desc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
        take: 8,
      }),
      [],
    ),
    safeHomeQuery(
      "homepage reels",
      () => prisma.video.findMany({
        where: { active: true, placement: "HOMEPAGE_REELS", platform: "TIKTOK" },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
        take: 24,
      }),
      [],
    ),
    safeHomeQuery(
      "certificate organizations",
      () => prisma.certificate.findMany({
        where: { active: true, organizationLogo: { not: "" } },
        orderBy: [{ featured: "desc" }, { displayOrder: "asc" }],
        select: { id: true, title: true, organizationName: true, organizationLogo: true },
      }),
      [],
    ),
    safeHomeQuery(
      "promotional banners",
      () => prisma.homepageSection.findUnique({
        where: { sectionKey: "promo-banners" },
        select: { content: true, isActive: true },
      }),
      null,
    ),

  ]);

const homeCollections = featuredCollections.map((collection) => ({
  ...collection,
  productHandles: parseStringArray(collection.productHandles),
}));

const collectionProductHandles = homeCollections
  .filter((collection) => ["new-arrivals", "best-sellers"].includes(collection.handle))
  .flatMap((collection) => collection.productHandles);

const [recentProducts, collectionProducts] = await Promise.all([
  safeHomeQuery(
    "all products",
    () => prisma.product.findMany({
      where: { status: "ACTIVE" },
      orderBy: { updatedAt: "desc" },
      take: 40,
      select: { id: true, handle: true, title: true, price: true, compareAtPrice: true, featuredImage: true, images: true, tags: true, categoryId: true, subcategoryId: true, isFeatured: true, displayOrder: true, createdAt: true, updatedAt: true },
    }),
    [],
  ),
  collectionProductHandles.length
    ? safeHomeQuery(
        "home collection products",
        () => prisma.product.findMany({
          where: {
            status: "ACTIVE",
            handle: { in: collectionProductHandles },
          },
          select: { id: true, handle: true, title: true, price: true, compareAtPrice: true, featuredImage: true, images: true, tags: true, categoryId: true, subcategoryId: true, isFeatured: true, displayOrder: true, createdAt: true, updatedAt: true },
        }),
        [],
      )
    : Promise.resolve([]),
]);

const allProducts = Array.from(
  new Map([...collectionProducts, ...recentProducts].map((product) => [product.handle, product])).values(),
);

const homepageJsonLd = [
  websiteJsonLd,
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Featured Auerviamaison products",
    numberOfItems: allProducts.length,
    itemListElement: allProducts.slice(0, 20).map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.title,
      url: `https://www.auerviamaison.com/products/${product.handle}`,
    })),
  },
];

return (
       <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd).replace(/</g, "\\u003c") }}
          />
        <div className="flex flex-col bg-gray-50">
          <HomeHeroSection />

          <HomeContentSections
            categories={categories}
            promoBanners={promoBannerSection ? (promoBannerSection.isActive ? parsePromoBanners(promoBannerSection.content) : []) : DEFAULT_PROMO_BANNERS}
            products={allProducts}
            collections={homeCollections}
            featuredBlogs={featuredBlogs}
            homeVideos={homeVideos.map(serializeVideo)}
            homepageReels={homepageReels.map(serializeVideo)}
            certificates={certificates}
          />
      </div>
    </>
  );
}
