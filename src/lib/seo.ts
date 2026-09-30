import type { Metadata } from "next";

export const SITE_NAME = "Auerviamaison";
export const SITE_URL = "https://www.auerviamaison.com";
export const DEFAULT_OG_IMAGE = "/logo/auerviamaison.png";

export const pakistanWellnessKeywords = [
  "Beauty store Pakistan",
  "Luxury skincare Pakistan",
  "Makeup products Pakistan",
  "Premium fragrance Pakistan",
  "Skincare routine Pakistan",
  "Beauty accessories Pakistan",
  "Smartwatch Pakistan",
  "Jewelry and accessories Pakistan",
  "Auerviamaison Pakistan",
  "Cosmetics online Pakistan",
  "Beauty gifts Pakistan",
  "Luxury lifestyle products Pakistan",
  "Fashion accessories Pakistan",
  "Personal care products Pakistan",
  "Premium beauty essentials Pakistan",
  "Modern lifestyle shopping Pakistan",
];

type SeoMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string | null;
  type?: "website" | "article";
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
};

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function createSeoMetadata({
  title,
  description,
  path,
  keywords = [],
  image = DEFAULT_OG_IMAGE,
  type = "website",
  noIndex = false,
  publishedTime,
  modifiedTime,
  authors,
}: SeoMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const images = image
    ? [{ url: absoluteUrl(image), width: 1200, height: 630, alt: title }]
    : undefined;

  return {
    title,
    description,
    keywords: [...new Set([...keywords, ...pakistanWellnessKeywords])],
    alternates: { canonical },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type,
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      images,
      ...(type === "article" ? { publishedTime, modifiedTime, authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images?.map((item) => item.url),
    },
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
