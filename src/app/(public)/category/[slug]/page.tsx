import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StoreProductCard } from "@/components/features/products/store-product-card-wrapper";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, breadcrumbSchema, createSeoMetadata } from "@/lib/seo";

const FALLBACK_IMAGE = "/logo/auerviamaison.svg";

export const revalidate = 60;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);
  const sort = query.sort;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return createSeoMetadata({ title: "Category Not Found", description: "This category is not available.", path: `/category/${slug}`, noIndex: true });
  return createSeoMetadata({
    title: category.seoTitle || `${category.name} Pakistan`,
    description: category.seoDescription || category.description || `Buy ${category.name} in Pakistan from Auerviamaison with expert local support and nationwide delivery.`,
    path: page > 1 || sort ? `/category/${slug}?${new URLSearchParams({ ...(page > 1 ? { page: String(page) } : {}), ...(sort ? { sort } : {}) }).toString()}` : category.canonicalUrl || `/category/${slug}`,
    image: category.openGraphImage || category.image,
    keywords: [category.focusKeyword, category.name, `${category.name} Pakistan`, `Buy ${category.name} Pakistan`, "Natural Products Pakistan"].filter((item): item is string => Boolean(item)),
    noIndex: category.robots?.startsWith("noindex"),
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);
  const pageSize = 24;
  const sort = ["newest", "price-asc", "price-desc", "name"].includes(query.sort || "") ? query.sort! : "newest";
  const orderBy = sort === "price-asc" ? { price: "asc" as const } : sort === "price-desc" ? { price: "desc" as const } : sort === "name" ? { title: "asc" as const } : { updatedAt: "desc" as const };
  const category = await prisma.category.findUnique({
    where: { slug },
    select: { id: true, name: true, description: true, parentId: true },
  });
  if (!category) notFound();

  const productWhere = { status: "ACTIVE", OR: [{ categoryId: category.id }, { subcategoryId: category.id }] };
  const [subcategories, categoryProducts, productCount, relatedCategories] = await Promise.all([
    prisma.category.findMany({
      where: { parentId: category.id },
      orderBy: { order: "asc" },
      select: { id: true, name: true, slug: true },
    }),
    prisma.product.findMany({
      where: productWhere,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: { id: true, handle: true, title: true, price: true, compareAtPrice: true, featuredImage: true, images: true, tags: true },
    }),
    prisma.product.count({ where: productWhere }),
    prisma.category.findMany({
      where: { id: { not: category.id }, parentId: category.parentId },
      orderBy: { order: "asc" },
      take: 8,
      select: { id: true, name: true, slug: true },
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(productCount / pageSize));

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-8 lg:px-8">
      <JsonLd data={[
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Products", path: "/products" }, { name: category.name, path: `/category/${slug}` }]),
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${category.name} Pakistan`,
          description: category.description || `Shop ${category.name} in Pakistan.`,
          url: absoluteUrl(`/category/${slug}`),
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: categoryProducts.length,
            itemListElement: categoryProducts.map((product, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: absoluteUrl(`/products/${product.handle}`),
              name: product.title,
            })),
          },
        },
      ]} />
      <nav aria-label="Breadcrumb" className="text-sm text-[#5A5E55]">
        <Link href="/">Home</Link> <span aria-hidden="true">/</span> <Link href="/products">Products</Link> <span aria-hidden="true">/</span> {category.name}
      </nav>
      <header className="max-w-4xl">
        <h1 className="font-serif text-3xl font-bold text-[#0a0a0a] sm:text-4xl">{category.name}</h1>
        <p className="mt-3 leading-7 text-[#5A5E55]">{category.description || `Explore authentic ${category.name} products selected by Auerviamaison for quality, traceability, and reliable delivery across Pakistan.`}</p>
      </header>
      {subcategories.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-[#0a0a0a]">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {subcategories.map((sub) => (
              <Link key={sub.id} href={`/category/${sub.slug}`} className="rounded-full border border-[#C6A24A]/30 bg-white px-4 py-2 text-sm text-[#0a0a0a] hover:bg-[#fcf5e8]">
                {sub.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-[#0a0a0a]">{category.name} Products</h2>
          <form>
            <label className="text-sm font-medium text-[#0a0a0a]">Sort <select name="sort" defaultValue={sort} className="ml-2 rounded-lg border bg-white px-3 py-2" aria-label="Sort products"><option value="newest">Newest</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name">Name</option></select></label>
            <button className="ml-2 rounded-lg bg-[#1a1308] px-3 py-2 text-sm text-white" type="submit">Apply</button>
          </form>
        </div>
        {categoryProducts.length === 0 ? (
          <div className="rounded-xl border border-[#C6A24A]/20 bg-white p-8 text-sm text-[#5A5E55]">No products found in this category yet.</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categoryProducts.map((product) => {
              const productImageUrls = Array.isArray(product.images)
                ? product.images.filter((x): x is string => typeof x === "string")
                : [];
              const firstImage = productImageUrls[0] || null;
              const firstTag = Array.isArray(product.tags)
                ? product.tags.find((x): x is string => typeof x === "string")
                : undefined;
              return (
                <StoreProductCard
                  key={product.handle}
                  handle={product.handle}
                  title={product.title}
                  featuredImageUrl={product.featuredImage || firstImage || FALLBACK_IMAGE}
                  imageUrls={productImageUrls}
                  price={{ amount: Number(product.price || 0).toFixed(2), currencyCode: "PKR" }}
                  compareAtPrice={product.compareAtPrice ? { amount: Number(product.compareAtPrice).toFixed(2), currencyCode: "PKR" } : null}
                  tag={firstTag}
                  productId={product.id}
                />
              );
            })}
          </div>
        )}
      </section>

      {totalPages > 1 && <nav aria-label="Category pagination" className="flex items-center justify-center gap-4">{page > 1 && <Link href={`/category/${slug}?page=${page - 1}&sort=${sort}`}>← Previous</Link>}<span>Page {page} of {totalPages}</span>{page < totalPages && <Link href={`/category/${slug}?page=${page + 1}&sort=${sort}`}>Next →</Link>}</nav>}

      {relatedCategories.length > 0 && (
        <section className="border-t border-[#C6A24A]/20 pt-8">
          <h2 className="mb-4 text-xl font-semibold text-[#0a0a0a]">Related categories</h2>
          <div className="flex flex-wrap gap-3">{relatedCategories.map((item) => <Link key={item.id} href={`/category/${item.slug}`} className="rounded-full border border-[#C6A24A]/30 bg-white px-4 py-2">{item.name}</Link>)}</div>
        </section>
      )}
    </main>
  );
}
