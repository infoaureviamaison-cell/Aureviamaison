import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const BLOG_PAGE_SIZE = 9;

export function publishedBlogWhere(): Prisma.BlogPostWhereInput {
  const now = new Date();
  return {
    isIndexable: true,
    OR: [
      { status: "published", publishedAt: { lte: now } },
      { status: "scheduled", scheduledAt: { lte: now } },
    ],
  };
}

export const getPublishedPost = cache(async (slug: string) =>
  prisma.blogPost.findFirst({ where: { slug, ...publishedBlogWhere() } }),
);

export function authorSlug(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function cleanSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
