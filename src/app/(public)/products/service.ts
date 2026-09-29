import { getAllProducts, searchProducts as searchProductsInDb } from "@/lib/storefront";
import { invariant } from "@esmate/utils";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { resolveProductPricing } from "@/lib/product-pricing";

function getProductImage(product: { featuredImage: string | null; images: unknown }) {
  if (product.featuredImage) {
    return product.featuredImage;
  }

  if (Array.isArray(product.images)) {
    return product.images.find((image): image is string => typeof image === "string") || null;
  }

  return null;
}

export async function getProductList(cursor?: string) {
  const products = await getAllProducts(cursor, 100);
  invariant(products, "products are not available");
  return products;
}

export async function getAllProductsForFilter() {
  return prisma.product.findMany({
    where: { status: "ACTIVE" },
    orderBy: { updatedAt: "desc" },
    take: 100,
    select: {
      id: true,
      handle: true,
      title: true,
      price: true,
      compareAtPrice: true,
      featuredImage: true,
      images: true,
      tags: true,
      description: true,
      sku: true,
      productType: true,
      vendor: true,
      categoryId: true,
      subcategoryId: true,
      isFeatured: true,
    },
  });
}

export async function getProductsPage(params: {
  q?: string; category?: string; min?: number; max?: number; sort?: string; page: number; pageSize: number;
}) {
  const category = params.category ? await prisma.category.findUnique({ where: { slug: params.category }, select: { id: true, parentId: true } }) : null;
  const where: Prisma.ProductWhereInput = {
    status: "ACTIVE",
    AND: [
      ...(params.q ? [{ OR: [{ title: { contains: params.q, mode: "insensitive" as const } }, { description: { contains: params.q, mode: "insensitive" as const } }, { seoTitle: { contains: params.q, mode: "insensitive" as const } }] }] : []),
      ...(category?.parentId ? [{ subcategoryId: category.id }] : []),
    ],
    ...(params.min !== undefined || params.max !== undefined ? { price: { ...(params.min !== undefined ? { gte: params.min } : {}), ...(params.max !== undefined ? { lte: params.max } : {}) } } : {}),
  };
  if (category && !category.parentId) {
    const children = await prisma.category.findMany({ where: { parentId: category.id }, select: { id: true } });
    (where.AND as Prisma.ProductWhereInput[]).push({ OR: [{ categoryId: category.id }, { subcategoryId: { in: children.map((item) => item.id) } }] });
  }
  const orderBy: Prisma.ProductOrderByWithRelationInput[] = params.sort === "price-asc" ? [{ price: "asc" }] : params.sort === "price-desc" ? [{ price: "desc" }] : params.sort === "name" ? [{ title: "asc" }] : params.sort === "newest" ? [{ createdAt: "desc" }] : [{ isFeatured: "desc" }, { displayOrder: "asc" }, { updatedAt: "desc" }];
  const [rows, total] = await Promise.all([
    prisma.product.findMany({ where, orderBy, skip: (params.page - 1) * params.pageSize, take: params.pageSize, select: { id: true, handle: true, title: true, price: true, compareAtPrice: true, inventory: true, availableForSale: true, generalDiscountPercent: true, wholesaleDiscounts: true, featuredImage: true, images: true, tags: true, variations: { where: { active: true }, select: { id: true, price: true, compareAtPrice: true, stock: true, active: true, sku: true } } } }),
    prisma.product.count({ where }),
  ]);
  return {
    products: rows.map((product) => ({ ...product, price: resolveProductPricing(product).minimumUnitPrice })),
    total,
    totalPages: Math.max(1, Math.ceil(total / params.pageSize)),
  };
}

export async function searchProducts(query: string) {
  return searchProductsInDb(query);
}

export async function getCategoriesForFilters() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { order: "asc" },
    select: { id: true, name: true, slug: true, order: true },
  });

  const subcategories = await prisma.category.findMany({
    where: { parentId: { not: null } },
    orderBy: { order: "asc" },
    select: { id: true, name: true, slug: true, parentId: true, order: true },
  });

  return categories.map(cat => ({
    ...cat,
    subcategories: subcategories.filter(sub => sub.parentId === cat.id)
  }));
}

export async function getProductsByCategorySlug(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    select: { productIds: true },
  });

  const productIds = Array.isArray(category?.productIds)
    ? (category!.productIds as unknown[]).filter((x): x is string => typeof x === "string")
    : [];

  if (productIds.length === 0) {
    return [];
  }

  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, status: "ACTIVE" },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      handle: true,
      title: true,
      price: true,
      featuredImage: true,
      images: true,
      tags: true,
    },
    take: 60,
  });

  // Match the `searchProducts` return shape (ProductCardNode[])
  return products.map((p) => ({
    id: p.id,
    handle: p.handle,
    title: p.title,
    tags: Array.isArray(p.tags) ? (p.tags as unknown[]).filter((x): x is string => typeof x === "string") : [],
    featuredImage: {
      id: `${p.id}-featured`,
      url: getProductImage(p) ?? "https://placehold.co/400x300?text=Product",
      altText: null,
      width: 1200,
      height: 1200,
    },
    priceRange: {
      minVariantPrice: { amount: Number(p.price ?? 0).toFixed(2), currencyCode: "PKR" },
    },
  }));
}

export async function getProductsAdvanced(params: {
  q?: string;
  categorySlug?: string;
  subcategorySlug?: string;
  tag?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  const category = params.categorySlug
    ? await prisma.category.findUnique({ where: { slug: params.categorySlug }, select: { id: true } })
    : null;
  const subcategory = params.subcategorySlug
    ? await prisma.category.findUnique({ where: { slug: params.subcategorySlug }, select: { id: true } })
    : null;

  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      ...(params.q
        ? {
            OR: [
              { title: { contains: params.q, mode: "insensitive" } },
              { description: { contains: params.q, mode: "insensitive" } },
              { seoTitle: { contains: params.q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(category?.id ? { categoryId: category.id } : {}),
      ...(subcategory?.id ? { subcategoryId: subcategory.id } : {}),
      ...(typeof params.minPrice === "number" ? { price: { gte: params.minPrice } } : {}),
      ...(typeof params.maxPrice === "number" ? { price: { lte: params.maxPrice } } : {}),
    },
    orderBy: { updatedAt: "desc" },
    take: 100,
    select: {
      id: true,
      handle: true,
      title: true,
      price: true,
      compareAtPrice: true,
      featuredImage: true,
      images: true,
      tags: true,
    },
  });

  return products
    .filter((p) => {
      if (!params.tag) return true;
      const tags = Array.isArray(p.tags)
        ? (p.tags as unknown[]).filter((x): x is string => typeof x === "string")
        : [];
      return tags.some((t) => t.toLowerCase().includes(params.tag!.toLowerCase()));
    })
    .map((p) => ({
      id: p.id,
      handle: p.handle,
      title: p.title,
      tags: Array.isArray(p.tags)
        ? (p.tags as unknown[]).filter((x): x is string => typeof x === "string")
        : [],
      featuredImage: {
        id: `${p.id}-featured`,
        url: getProductImage(p) ?? "https://placehold.co/400x300?text=Product",
        altText: null,
        width: 1200,
        height: 1200,
      },
      priceRange: {
        minVariantPrice: { amount: Number(p.price ?? 0).toFixed(2), currencyCode: "PKR" },
      },
      compareAtPrice: p.compareAtPrice
        ? { amount: Number(p.compareAtPrice).toFixed(2), currencyCode: "PKR" }
        : null,
    }));
}

