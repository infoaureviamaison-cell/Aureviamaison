import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";
import { authorSlug } from "@/lib/blog";

const blogSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  featuredImage: z.string().optional(),
  featuredImageAlt: z.string().optional(),
  openGraphImage: z.string().optional(),
  categoryId: z.string().optional(),
  author: z.string().default("Admin"),
  authorRole: z.string().optional(),
  authorBio: z.string().optional(),
  authorImage: z.string().optional(),
  status: z.enum(["draft", "scheduled", "published"]).default("draft"),
  publishedAt: z.union([z.string(), z.date()]).optional(),
  scheduledAt: z.union([z.string(), z.date()]).optional(),
  contentRevisedAt: z.union([z.string(), z.date()]).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  canonicalUrl: z.string().optional(),
  focusKeyword: z.string().optional(),
  relatedKeywords: z.array(z.string()).default([]),
  relatedArticleIds: z.array(z.string()).default([]),
  relatedProductHandles: z.array(z.string()).default([]),
  isIndexable: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
});

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";
    const where: { status?: string } = {};
    if (status) where.status = status;
    const posts = await prisma.blogPost.findMany({ where, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ blogs: posts });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    return NextResponse.json({ error: (error as Error).message }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const validated = blogSchema.parse(body);
    if (validated.publishedAt) validated.publishedAt = new Date(validated.publishedAt);
    if (validated.scheduledAt) validated.scheduledAt = new Date(validated.scheduledAt);
    if (validated.contentRevisedAt) validated.contentRevisedAt = new Date(validated.contentRevisedAt);
    if (validated.status === "published" && !validated.publishedAt) validated.publishedAt = new Date();
    const authorProfile = await prisma.author.upsert({ where: { slug: authorSlug(validated.author) }, update: { name: validated.author, role: validated.authorRole, bio: validated.authorBio, image: validated.authorImage }, create: { name: validated.author, slug: authorSlug(validated.author), role: validated.authorRole, bio: validated.authorBio, image: validated.authorImage } });
    const post = await prisma.blogPost.create({ data: { ...validated, authorId: authorProfile.id } });
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/blog-sitemap.xml");
    return NextResponse.json({ blog: post }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
