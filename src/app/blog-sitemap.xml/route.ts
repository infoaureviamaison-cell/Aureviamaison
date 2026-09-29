import { prisma } from "@/lib/prisma";
import { publishedBlogWhere } from "@/lib/blog";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 900;
export const dynamic = "force-dynamic";

export async function GET() {
  const posts = await prisma.blogPost.findMany({ where: publishedBlogWhere(), orderBy: { updatedAt: "desc" }, select: { slug: true, updatedAt: true, featuredImage: true } });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${posts.map((post) => `<url><loc>${absoluteUrl(`/blog/${post.slug}`)}</loc><lastmod>${post.updatedAt.toISOString()}</lastmod>${post.featuredImage ? `<image:image><image:loc>${absoluteUrl(post.featuredImage)}</image:loc></image:image>` : ""}</url>`).join("")}</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, s-maxage=900, stale-while-revalidate=86400" } });
}
