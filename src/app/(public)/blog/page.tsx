import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { publishedBlogWhere, BLOG_PAGE_SIZE } from "@/lib/blog";
import { createSeoMetadata } from "@/lib/seo";
import { BlogPageContent } from "../blogs/_components/blog-page-content";

export const revalidate = 900;

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ page?: string }> }): Promise<Metadata> {
  const page = Math.max(1, Number((await searchParams).page) || 1);
  return createSeoMetadata({
    title: page > 1 ? `Natural Wellness Guides – Page ${page}` : "Natural Wellness & Himalayan Product Guides",
    description: "Practical guides about Himalayan Shilajit, pink salt, natural honey, herbal wellness products, and wholesale sourcing from Pakistan.",
    path: page > 1 ? `/blog?page=${page}` : "/blog",
    keywords: ["Himalayan wellness blog", "Shilajit guides", "pink salt guides"],
  });
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const [articles, count] = await Promise.all([
    prisma.blogPost.findMany({
      where: publishedBlogWhere(),
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * BLOG_PAGE_SIZE,
      take: BLOG_PAGE_SIZE,
      select: { id: true, title: true, slug: true, excerpt: true, featuredImage: true, featuredImageAlt: true, publishedAt: true },
    }),
    prisma.blogPost.count({ where: publishedBlogWhere() }),
  ]);
  return <BlogPageContent articles={articles} page={page} pages={Math.max(1, Math.ceil(count / BLOG_PAGE_SIZE))} />;
}
