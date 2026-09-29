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

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 401 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const validated = blogSchema.parse(body);
    if (validated.publishedAt) validated.publishedAt = new Date(validated.publishedAt);
    if (validated.scheduledAt) validated.scheduledAt = new Date(validated.scheduledAt);
    if (validated.contentRevisedAt) validated.contentRevisedAt = new Date(validated.contentRevisedAt);
    if (validated.status === "published" && !validated.publishedAt) validated.publishedAt = new Date();
    const authorProfile = await prisma.author.upsert({ where: { slug: authorSlug(validated.author) }, update: { name: validated.author, role: validated.authorRole, bio: validated.authorBio, image: validated.authorImage }, create: { name: validated.author, slug: authorSlug(validated.author), role: validated.authorRole, bio: validated.authorBio, image: validated.authorImage } });
    const post = await prisma.blogPost.update({ where: { id }, data: { ...validated, authorId: authorProfile.id } });
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/blog-sitemap.xml");
    return NextResponse.json(post);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const post = await prisma.blogPost.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/blog-sitemap.xml");
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
