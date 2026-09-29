import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/checkout", "/cart", "/api-test"],
    },
    sitemap: [
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/products-sitemap.xml`,
      `${SITE_URL}/categories-sitemap.xml`,
      `${SITE_URL}/collections-sitemap.xml`,
      `${SITE_URL}/blog-sitemap.xml`,
    ],
    host: SITE_URL,
  };
}
