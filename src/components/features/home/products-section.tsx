"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Droplets, FlaskConical, ShoppingBag, Sparkles, Watch } from "@esmate/shadcn/pkgs/lucide-react";
import { StoreProductCard } from "@/components/features/products/store-product-card-wrapper";

const FALLBACK_IMAGE = "/logo/auerviamaison.png";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image: string | null;
  parentId?: string | null;
  order?: number;
}

interface Product {
  id: string;
  handle: string;
  title: string;
  price: number | null;
  compareAtPrice: number | null;
  featuredImage: string | null;
  images: unknown;
  tags: unknown;
  categoryId: string | null;
  subcategoryId: string | null;
  isFeatured: boolean;
  displayOrder?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Collection {
  id: string;
  handle: string;
  title: string;
  image: string | null;
  isFeatured?: boolean;
  productHandles?: string[];
}

function ProductGrid({ products, title, bgColor = "white" }: { products: Product[]; title: string; bgColor?: string }) {
  if (!products.length) return null;

  const bgClass = bgColor === "gray-50" ? "bg-gray-50" : "bg-white";

  return (
    <section className={`mx-auto w-full max-w-7xl px-6 lg:px-8 py-16 ${bgClass}`}>
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h2 className="font-serif text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
          {title}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => {
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
    </section>
  );
}

export function CategoriesSection({ categories }: { categories: Category[] }) {
  const mainCategories = categories.filter((category) => !category.parentId);

  return (
    <section className="storefront-categories relative z-20 mt-6 bg-white lg:mx-auto lg:max-w-7xl">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5 lg:gap-6">
        {mainCategories.map((category) => {
          const normalizedName = category.name.toLowerCase();
          const CategoryIcon = normalizedName.includes("hair")
            ? Droplets
            : normalizedName.includes("fragrance") || normalizedName.includes("perfume")
              ? FlaskConical
              : normalizedName.includes("watch")
                ? Watch
                : normalizedName.includes("accessor")
                  ? ShoppingBag
                  : Sparkles;

          return (
            <Link
              key={category.id}
              href={`/category/${encodeURIComponent(category.slug)}`}
              className="category-card group flex min-w-0 flex-col overflow-hidden rounded-[22px] border border-[#f2e4e5] bg-white transition duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d34c65]/20"
            >
              <div className="relative aspect-square overflow-hidden bg-[#fff8f5]">
                <Image
                  src={category.image || FALLBACK_IMAGE}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <span className="relative z-10 -mt-7 ml-5 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-[#d34c65] text-white">
                <CategoryIcon aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="flex min-h-20 items-center justify-between gap-2 px-5 pb-5 pt-1">
                <span className="font-sans text-sm font-bold uppercase text-[#242126] sm:text-base">
                  {category.name}
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d34c65] text-white transition-colors group-hover:bg-[#bd3f58]">
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function FeaturedProductRow({
  category,
  products,
  productCard,
}: {
  category: Category;
  products: Product[];
  productCard: (product: Product) => React.ReactNode;
}) {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const isAutoScrollPaused = useRef(false);

  useEffect(() => {
    if (products.length <= 1) return;

    const interval = window.setInterval(() => {
      const row = rowRef.current;
      if (!row || isAutoScrollPaused.current || document.hidden) return;

      const firstCard = row.querySelector<HTMLElement>("[data-product-card]");
      const cardWidth = firstCard?.offsetWidth || 280;
      const gap = 24;
      const nextLeft = row.scrollLeft + cardWidth + gap;
      const atEnd = nextLeft >= row.scrollWidth - row.clientWidth - 4;

      row.scrollTo({
        left: atEnd ? 0 : nextLeft,
        behavior: "smooth",
      });
    }, 5000);

    return () => window.clearInterval(interval);
  }, [products.length]);

  if (!products.length) return null;

  return (
    <section>
      <div className="mx-auto mb-6 flex max-w-3xl flex-col items-center px-4 text-center sm:mb-8">
        <h3 className="font-serif text-2xl font-extrabold text-gray-950 sm:text-3xl lg:text-4xl">
          {category.name}
        </h3>
        {category.description && (
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600 sm:mt-3 sm:text-base">
            {category.description}
          </p>
        )}
        <Link
          href={`/category/${encodeURIComponent(category.slug)}`}
          className="group mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#d34c65] px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-[#bd3f58] sm:text-sm"
        >
          Shop Now
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
      <div
        ref={rowRef}
        onMouseEnter={() => {
          isAutoScrollPaused.current = true;
        }}
        onMouseLeave={() => {
          isAutoScrollPaused.current = false;
        }}
        onFocusCapture={() => {
          isAutoScrollPaused.current = true;
        }}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            isAutoScrollPaused.current = false;
          }
        }}
        className="scrollbar-hide flex gap-4 overflow-x-auto py-2 sm:gap-6"
      >
        {products.map((product) => (
          <div
            key={product.handle}
            data-product-card
            className="w-[17.5rem] shrink-0 sm:w-[18.5rem] lg:w-[19rem]"
          >
            {productCard(product)}
          </div>
        ))}
      </div>
    </section>
  );
}

function CollectionSlider({ collections }: { collections: Collection[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerPage = 3;

  const currentCollections = collections || [];
  const totalSlides = Math.ceil(currentCollections.length / itemsPerPage);
  const displayCollections = currentCollections.slice(
    currentSlide * itemsPerPage,
    (currentSlide + 1) * itemsPerPage
  );

  useEffect(() => {
    if (totalSlides <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  if (displayCollections.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div
        className="grid grid-cols-1 gap-6 sm:grid-cols-3 transition-opacity duration-1000 ease-in-out"
      >
        {displayCollections.map((collection, i) => (
          <Link
            key={`${collection.id}-${i}-${currentSlide}`}
            href="/products"
            className="group overflow-hidden rounded-2xl border border-[#C6A24A]/20 bg-white"
          >
            <div className="relative aspect-[16/10]">
              <Image
                src={collection.image || FALLBACK_IMAGE}
                alt={collection.title}
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-4 text-lg font-semibold text-[#0a0a0a]">{collection.title}</div>
          </Link>
        ))}
      </div>
      {totalSlides > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "w-6 bg-[#f6a45d]" : "w-2 bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductsSection({ categories, products, collections }: { categories: Category[]; products: Product[]; collections: Collection[] }) {
  const featuredProducts = products.filter(p => p.isFeatured);
  const productsByHandle = new Map(products.map((product) => [product.handle, product]));
  const mainCategories = categories
    .filter((category) => !category.parentId)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name));

  const subcategoryIdsByParentId = categories.reduce((map, category) => {
    if (!category.parentId) return map;
    const ids = map.get(category.parentId) || [];
    ids.push(category.id);
    map.set(category.parentId, ids);
    return map;
  }, new Map<string, string[]>());

  const featuredRows = mainCategories
    .map((category) => {
      const categoryIds = new Set([category.id, ...(subcategoryIdsByParentId.get(category.id) || [])]);
      const rowProducts = featuredProducts
        .filter(
          (product) =>
            (product.categoryId && categoryIds.has(product.categoryId)) ||
            (product.subcategoryId && categoryIds.has(product.subcategoryId)),
        )
        .sort(
          (a, b) =>
            (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999) ||
            a.title.localeCompare(b.title),
        );

      return { category, products: rowProducts };
    })
    .filter((row) => row.products.length > 0);

  const getCollectionProducts = (handle: string) => {
    const collection = collections.find((item) => item.handle === handle);
    const productHandles = collection?.productHandles || [];

    return productHandles
      .map((productHandle) => productsByHandle.get(productHandle))
      .filter((product): product is Product => Boolean(product))
      .slice(0, 8);
  };

  const newArrivals = getCollectionProducts("new-arrivals");
  const bestSellers = getCollectionProducts("best-sellers");

  const productCard = (product: Product) => {
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
  };

  return (
    <>
      {featuredRows.length > 0 && (
        <section className="bg-white mx-auto w-full max-w-7xl px-6 lg:px-8 py-16">
          <div className="space-y-12">
            {featuredRows.map((row) => (
              <FeaturedProductRow
                key={row.category.id}
                category={row.category}
                products={row.products}
                productCard={productCard}
              />
            ))}
          </div>
        </section>
      )}

      <ProductGrid products={newArrivals} title="New Arrivals" bgColor="white" />

      <ProductGrid products={bestSellers} title="Best Sellers" bgColor="gray-50" />

    </>
  );
}

export function CollectionsSection({ collections }: { collections: Collection[] }) {
  return (
    <section className="mx-auto w-full max-w-7xl bg-gray-50 px-6 py-16 lg:px-8">
      <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
        <span className="inline-flex rounded-full bg-[#ffedd5] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#ea580c]">
          Collections
        </span>
        <h2 className="font-serif text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
          Curated Collections
        </h2>
      </div>
      <CollectionSlider collections={collections.filter((collection) => collection.isFeatured !== false)} />
    </section>
  );
}
