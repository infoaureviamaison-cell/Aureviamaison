import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";

const collectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  handle: z.string().min(1, "Handle is required"),
  description: z.string().optional(),
  descriptionHtml: z.string().optional(),
  image: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  canonicalUrl: z.string().optional(),
  robots: z.enum(["index,follow", "noindex,follow", "noindex,nofollow"]).default("index,follow"),
  openGraphImage: z.string().optional(),
  imageAlt: z.string().optional(),
  focusKeyword: z.string().optional(),
  productHandles: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
});

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const collection = await prisma.collection.findUnique({ where: { id } });
    if (!collection) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(collection);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 401 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const validated = collectionSchema.parse(body);
    const collection = await prisma.collection.update({ where: { id }, data: validated });
    revalidatePath("/");
    revalidatePath("/collections");
    revalidatePath(`/collections/${collection.handle}`);
    revalidatePath("/collections-sitemap.xml");
    return NextResponse.json(collection);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const collection = await prisma.collection.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/collections");
    revalidatePath(`/collections/${collection.handle}`);
    revalidatePath("/collections-sitemap.xml");
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
