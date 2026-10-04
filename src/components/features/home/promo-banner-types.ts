export type PromoBanner = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  discountPercent: number;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  imageAlt: string;
  backgroundStart: string;
  backgroundEnd: string;
  isActive: boolean;
};

export const DEFAULT_PROMO_BANNERS: PromoBanner[] = [
  {
    id: "glow-event",
    eyebrow: "Limited time beauty event",
    title: "Glow essentials",
    description: "Skincare and makeup favorites for an effortless glow.",
    discountPercent: 30,
    ctaLabel: "Shop the sale",
    ctaHref: "/category/skincare",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Pink beauty and makeup essentials",
    backgroundStart: "#f31669",
    backgroundEnd: "#ff6c9d",
    isActive: true,
  },
  {
    id: "signature-scents",
    eyebrow: "Signature scent edit",
    title: "Fine fragrances",
    description: "Memorable scents selected for every mood and moment.",
    discountPercent: 25,
    ctaLabel: "Explore scents",
    ctaHref: "/category/fragrances",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Luxury perfume bottle",
    backgroundStart: "#6d28d9",
    backgroundEnd: "#a855f7",
    isActive: true,
  },
  {
    id: "hair-care",
    eyebrow: "Healthy hair favorites",
    title: "Shine and repair",
    description: "Nourishing care for smooth, polished everyday hair.",
    discountPercent: 20,
    ctaLabel: "Shop hair care",
    ctaHref: "/category/hair-care",
    image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Premium hair care products",
    backgroundStart: "#ea580c",
    backgroundEnd: "#fb923c",
    isActive: true,
  },
  {
    id: "beauty-tools",
    eyebrow: "Upgrade your routine",
    title: "Beauty tools",
    description: "Polished tools and accessories for a flawless finish.",
    discountPercent: 15,
    ctaLabel: "Discover tools",
    ctaHref: "/category/beauty-accessories",
    image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Beauty brushes and accessories",
    backgroundStart: "#be185d",
    backgroundEnd: "#f472b6",
    isActive: true,
  },
];

export function parsePromoBanners(value: unknown): PromoBanner[] {
  if (!Array.isArray(value)) return [];

  return value.filter((item): item is PromoBanner => {
    if (!item || typeof item !== "object") return false;
    const banner = item as Partial<PromoBanner>;
    return (
      typeof banner.id === "string" &&
      typeof banner.title === "string" &&
      typeof banner.image === "string" &&
      typeof banner.ctaHref === "string"
    );
  });
}
