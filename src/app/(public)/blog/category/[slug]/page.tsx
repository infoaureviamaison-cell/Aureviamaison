import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_PAGE_SIZE, publishedBlogWhere } from "@/lib/blog";
import { prisma } from "@/lib/prisma";
import { createSeoMetadata } from "@/lib/seo";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";

export const revalidate = 900;

export async function generateMetadata({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> }): Promise<Metadata> {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const category = await prisma.category.findUnique({ where: { slug }, select: { name: true, description: true, seoTitle: true, seoDescription: true, id: true } });
  if (!category) return createSeoMetadata({ title: "Blog Category Not Found", description: "This category is unavailable.", path: `/blog/category/${slug}`, noIndex: true });
  const count = await prisma.blogPost.count({ where: { ...publishedBlogWhere(), categoryId: category.id } });
  const page = Math.max(1, Number(query.page) || 1);
  return createSeoMetadata({
    title: page > 1 ? `${category.seoTitle || category.name} Articles – Page ${page}` : category.seoTitle || `${category.name} Guides`,
    description: category.seoDescription || category.description || `Helpful ${category.name} guides from Auerviamaison.`,
    path: page > 1 ? `/blog/category/${slug}?page=${page}` : `/blog/category/${slug}`,
    noIndex: count === 0,
  });
}

export default async function BlogCategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> }) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const page = Math.max(1, Number(query.page) || 1);
  const category = await prisma.category.findUnique({ where: { slug }, select: { id: true, name: true, description: true } });
  if (!category) notFound();
  const posts = await prisma.blogPost.findMany({ where: { ...publishedBlogWhere(), categoryId: category.id }, orderBy: { publishedAt: "desc" }, skip: (page - 1) * BLOG_PAGE_SIZE, take: BLOG_PAGE_SIZE, select: { title: true, slug: true, excerpt: true } });
  return <main className="mx-auto max-w-5xl px-4 py-12"><JsonLd data={[breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: category.name, path: `/blog/category/${slug}` }]), { "@context": "https://schema.org", "@type": "CollectionPage", name: `${category.name} guides`, description: category.description || `Original guides about ${category.name}.`, url: absoluteUrl(`/blog/category/${slug}`), mainEntity: { "@type": "ItemList", itemListElement: posts.map((post, index) => ({ "@type": "ListItem", position: index + 1, name: post.title, url: absoluteUrl(`/blog/${post.slug}`) })) } }]} /><nav aria-label="Breadcrumb" className="text-sm"><Link href="/">Home</Link> / <Link href="/blog">Blog</Link> / {category.name}</nav><h1 className="mt-8 text-4xl font-bold">{category.name} guides</h1><p className="mt-4 max-w-3xl text-muted-foreground">{category.description || `Original guides, buying advice, and useful information about ${category.name}.`}</p><div className="mt-10 grid gap-6 sm:grid-cols-2">{posts.map((post) => <article key={post.slug} className="rounded-xl border p-6"><h2 className="text-xl font-semibold"><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>{post.excerpt && <p className="mt-3 text-muted-foreground">{post.excerpt}</p>}</article>)}</div>{posts.length === 0 && <p className="mt-10">No published articles are available in this category yet.</p>}</main>;
}
