import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";

const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  handle: z.string().min(1, "Handle is required"),
  description: z.string().optional(),
  descriptionHtml: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  compareAtPrice: z.number().optional(),
  generalDiscountPercent: z.number().min(0).max(100).default(0),
  wholesaleDiscounts: z.array(z.object({
    minQuantity: z.number().int().min(2),
    discountPercent: z.number().min(0.01).max(100),
  })).default([]),
  sku: z.string().optional(),
  inventory: z.number().int().min(0, "Inventory must be non-negative"),
  availableForSale: z.boolean().default(true),
  status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]).default("ACTIVE"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  canonicalUrl: z.string().optional(),
  robots: z.enum(["index,follow", "noindex,follow", "noindex,nofollow"]).default("index,follow"),
  openGraphImage: z.string().optional(),
  imageAlt: z.string().optional(),
  focusKeyword: z.string().optional(),
  images: z.array(z.string()).min(1, "At least one image is required"),
  featuredImage: z.string().optional(),
  productType: z.string().optional(),
  categoryId: z.string().optional(),
  subcategoryId: z.string().optional(),
  vendor: z.string().default("Auerviamaison"),
  tags: z.array(z.string()).default([]),
  collectionIds: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  displayOrder: z.number().int().min(1).default(9999),
  details: z.array(z.object({
    id: z.string(),
    title: z.string().default(""),
    description: z.string().optional(),
    image: z.string().optional(),
    videoUrl: z.string().optional(),
  })).default([]),
  packagingSizes: z.array(z.string()).default([]),
  netWeight: z.string().optional(),
  origin: z.string().optional(),
  shelfLife: z.string().optional(),
  faqs: z.array(z.object({
    id: z.string(),
    question: z.string(),
    answer: z.string(),
  })).default([]),
  wholesaleQuoteEnabled: z.boolean().default(false),
  color: z.string().optional(), size: z.string().optional(), storage: z.string().optional(), ram: z.string().optional(),
  processor: z.string().optional(), condition: z.string().optional(),
  specifications: z.record(z.string(), z.string()).default({}), customAttributes: z.record(z.string(), z.string()).default({}),
  variants: z.array(z.object({
    id: z.string(), name: z.string().min(1), description: z.string().optional(), price: z.number().min(0), compareAtPrice: z.number().nullable().optional(),
    sku: z.string().optional(), stock: z.number().int().min(0), images: z.array(z.string()).default([]), color: z.string().optional(), size: z.string().optional(),
    storage: z.string().optional(), ram: z.string().optional(), processor: z.string().optional(), condition: z.string().optional(),
    specifications: z.record(z.string(), z.string()).default({}), customAttributes: z.record(z.string(), z.string()).default({}), active: z.boolean(), isDefault: z.boolean(),
  })).default([]),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    
    const product = await prisma.product.findUnique({
      where: { id },
      include: { variations: { orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }] } },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const { variations, ...productData } = product;
    return NextResponse.json({ ...productData, variants: variations });
  } catch (error: unknown) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch product" },
      { status: 401 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    
    const body = await request.json();
    const validated = productSchema.parse(body);
    const { details, variants, ...productData } = validated;

    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...productData,
        categoryId: productData.categoryId || null,
        subcategoryId: productData.subcategoryId || null,
        details: details,
        variations: {
          deleteMany: { id: { notIn: variants.map((variant) => variant.id) } },
          upsert: variants.map(({ id, ...variant }) => ({
            where: { id },
            create: { id, ...variant, value: variant.name },
            update: { ...variant, value: variant.name },
          })),
        },
      },
    });
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${product.handle}`);
    revalidatePath("/products-sitemap.xml");
    revalidatePath("/google-merchant-feed.xml");

    return NextResponse.json(product);
  } catch (error: unknown) {
    console.error("Error updating product:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: (error as Error).message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    
    const product = await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${product.handle}`);
    revalidatePath("/products-sitemap.xml");
    revalidatePath("/google-merchant-feed.xml");

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
