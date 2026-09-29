import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function GET() {
  const categories = await prisma.category.findMany({ where: { robots: { not: { startsWith: "noindex" } } }, orderBy: { updatedAt: "desc" }, select: { slug: true, updatedAt: true, image: true } });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${categories.map((category) => `<url><loc>${absoluteUrl(`/category/${category.slug}`)}</loc><lastmod>${category.updatedAt.toISOString()}</lastmod><changefreq>weekly</changefreq>${category.image ? `<image:image><image:loc>${absoluteUrl(category.image)}</image:loc></image:image>` : ""}</url>`).join("")}</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, s-maxage=900, stale-while-revalidate=86400" } });
}
