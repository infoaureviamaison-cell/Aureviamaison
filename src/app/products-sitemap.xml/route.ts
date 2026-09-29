import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await prisma.product.findMany({ where: { status: "ACTIVE", robots: { not: { startsWith: "noindex" } } }, orderBy: { updatedAt: "desc" }, select: { handle: true, updatedAt: true, featuredImage: true } });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${products.map((product) => `<url><loc>${absoluteUrl(`/products/${product.handle}`)}</loc><lastmod>${product.updatedAt.toISOString()}</lastmod><changefreq>weekly</changefreq>${product.featuredImage ? `<image:image><image:loc>${absoluteUrl(product.featuredImage)}</image:loc></image:image>` : ""}</url>`).join("")}</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, s-maxage=900, stale-while-revalidate=86400" } });
}
