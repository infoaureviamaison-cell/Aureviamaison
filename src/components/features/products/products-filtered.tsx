import Link from "next/link";
import { StoreProductCard } from "@/components/features/products/store-product-card-wrapper";

const FALLBACK_IMAGE = "/logo/auerviamaison.png";

type Category = { id: string; name: string; slug: string; order: number; subcategories: Array<{ id: string; name: string; slug: string; parentId: string | null; order: number }> };
type Product = { id: string; handle: string; title: string; price: number; compareAtPrice: number | null; featuredImage: string | null; images: unknown; tags: unknown };

export function ProductsFiltered({
  categories, products, page, totalPages, total, query,
}: {
  categories: Category[];
  products: Product[];
  page: number;
  totalPages: number;
  total: number;
  query: Record<string, string | undefined>;
}) {
  const pageHref = (nextPage: number) => {
    const params = new URLSearchParams(Object.entries(query).filter((entry): entry is [string, string] => Boolean(entry[1])));
    params.set("page", String(nextPage));
    return `/products?${params.toString()}`;
  };
  return (
    <section className="min-w-0 space-y-6">
      <form action="/products" className="flex flex-col gap-3 rounded-[26px] border border-black/10 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div className="flex-1">
          <input
            name="q"
            defaultValue={query.q}
            placeholder="Search products"
            aria-label="Search products"
            className="h-12 w-full rounded-full border border-black/10 bg-[#f9f9f9] px-4 text-sm text-black outline-none transition focus:border-[#f97316] focus:bg-white"
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <select name="category" defaultValue={query.category || ""} aria-label="Category" className="h-12 min-w-[150px] rounded-full border border-black/10 bg-[#f9f9f9] px-4 text-sm text-black outline-none transition focus:border-[#f97316] focus:bg-white"><option value="">All categories</option>{categories.map((category) => <option key={category.id} value={category.slug}>{category.name}</option>)}</select>
          <input name="min" type="number" min="0" defaultValue={query.min} placeholder="Min" aria-label="Minimum price" className="h-12 w-full min-w-[110px] rounded-full border border-black/10 bg-[#f9f9f9] px-4 text-sm text-black outline-none transition focus:border-[#f97316] focus:bg-white sm:w-[110px]" />
          <input name="max" type="number" min="0" defaultValue={query.max} placeholder="Max" aria-label="Maximum price" className="h-12 w-full min-w-[110px] rounded-full border border-black/10 bg-[#f9f9f9] px-4 text-sm text-black outline-none transition focus:border-[#f97316] focus:bg-white sm:w-[110px]" />
          <select name="sort" defaultValue={query.sort || "featured"} aria-label="Sort products" className="h-12 min-w-[150px] rounded-full border border-black/10 bg-[#f9f9f9] px-4 text-sm text-black outline-none transition focus:border-[#f97316] focus:bg-white"><option value="featured">Featured</option><option value="newest">Newest</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name">Name</option></select>
          <button type="submit" className="h-12 rounded-full bg-[#1a1308] px-5 text-sm font-semibold text-white transition hover:bg-[#2a1d10]">Apply</button>
        </div>
      </form>
      <p className="text-sm text-[#5A5E55]">{total} product{total === 1 ? "" : "s"} found</p>
      {products.length ? <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">{products.map((product) => {
        const images = Array.isArray(product.images) ? product.images.filter((item): item is string => typeof item === "string") : [];
        const tags = Array.isArray(product.tags) ? product.tags.filter((item): item is string => typeof item === "string") : [];
        return <StoreProductCard key={product.handle} handle={product.handle} title={product.title} featuredImageUrl={product.featuredImage || images[0] || FALLBACK_IMAGE} imageUrls={images} price={{ amount: product.price.toFixed(2), currencyCode: "PKR" }} compareAtPrice={product.compareAtPrice ? { amount: product.compareAtPrice.toFixed(2), currencyCode: "PKR" } : null} tag={tags[0]} productId={product.id} />;
      })}</div> : <div className="rounded-2xl border bg-white p-12 text-center"><h2 className="text-xl font-semibold">No products found</h2><p className="mt-2 text-[#5A5E55]">Try removing a filter or using a broader search.</p></div>}
      {totalPages > 1 && <nav aria-label="Product pagination" className="flex items-center justify-center gap-4">{page > 1 && <Link href={pageHref(page - 1)}>← Previous</Link>}<span>Page {page} of {totalPages}</span>{page < totalPages && <Link href={pageHref(page + 1)}>Next →</Link>}</nav>}
    </section>
  );
}
