import { ProductsFiltered } from "@/components/features/products/products-filtered";

type CategoryFilter = {
  id: string;
  name: string;
  slug: string;
  order: number;
  subcategories: Array<{
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    order: number;
  }>;
};

type ProductListItem = {
  id: string;
  handle: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  featuredImage: string | null;
  images: unknown;
  tags: unknown;
};

type ProductsPageContentProps = {
  categories: CategoryFilter[];
  products: ProductListItem[];
  page: number;
  totalPages: number;
  total: number;
  query: Record<string, string | undefined>;
};

function ProductsSeoSection() {
  return (
    <section className="mt-16 border-t border-[#C6A24A]/20 pt-12">
      <h2 className="text-2xl font-bold text-[#0a0a0a]">
        Premium Products, Natural Wellness Products & Natural Wellness Products
      </h2>

      <p className="mt-4 max-w-4xl text-[#5A5E55]">
        Auerviamaison specializes in authentic beauty and lifestyle products,
        responsibly sourced and minimally processed to retain their natural
        mineral composition. Our range includes edible products for cooking,
        bath and wellness salt, decorative and functional products lamps, and
        premium-grade Natural Wellness Products known for its traditional use in vitality and
        strength.
      </p>

      <p className="mt-4 max-w-4xl text-[#5A5E55]">
        Each product is selected with quality, purity, and sustainability in
        mind. We work closely with trusted suppliers to ensure our customers
        receive genuine Premium products suitable for daily use, wellness
        routines, and natural living.
      </p>
    </section>
  );
}

export function ProductsPageContent({
  categories,
  products, page, totalPages, total, query,
}: ProductsPageContentProps) {
  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <ProductsFiltered
          categories={categories}
          products={products}
          page={page}
          totalPages={totalPages}
          total={total}
          query={query}
        />

        <ProductsSeoSection />
      </div>
    </main>
  );
}
