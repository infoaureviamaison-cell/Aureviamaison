"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "@esmate/shadcn/pkgs/lucide-react";
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
    <section className={`mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16 ${bgClass}`}>
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-4 sm:mb-12 sm:mb-16">
        <h2 className="font-serif text-2xl font-extrabold text-gray-900 sm:text-3xl sm:text-4xl lg:text-5xl">
          {title}
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 sm:gap-6">
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
  const categoriesViewportRef = useRef<HTMLDivElement | null>(null);
  const categoryDrag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });

  const handleCategoryPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const viewport = categoriesViewportRef.current;
    if (!viewport) return;
    categoryDrag.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: viewport.scrollLeft,
      moved: false,
    };
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add("is-dragging");
  };

  const handleCategoryPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const viewport = categoriesViewportRef.current;
    if (!viewport || !categoryDrag.current.active) return;
    const distance = event.clientX - categoryDrag.current.startX;
    if (Math.abs(distance) > 4) categoryDrag.current.moved = true;
    viewport.scrollLeft = categoryDrag.current.scrollLeft - distance;
  };

  const handleCategoryPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const viewport = categoriesViewportRef.current;
    if (!viewport || !categoryDrag.current.active) return;
    categoryDrag.current.active = false;
    if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    viewport.classList.remove("is-dragging");
  };

  return (
    <section className="storefront-categories relative z-20 mt-6 bg-white lg:mx-auto lg:max-w-7xl sm:mt-9">

      <div
        ref={categoriesViewportRef}
        className="relative flex gap-6 overflow-x-auto overflow-y-hidden scrollbar-hide cursor-grab sm:gap-8"
        onPointerDown={handleCategoryPointerDown}
        onPointerMove={handleCategoryPointerMove}
        onPointerUp={handleCategoryPointerUp}
        onPointerCancel={handleCategoryPointerUp}
        onClickCapture={(event) => {
          if (categoryDrag.current.moved) {
            event.preventDefault();
            event.stopPropagation();
            categoryDrag.current.moved = false;
          }
        }}
      >
        <div className="category-marquee-track scrollbar-hide gap-6 px-2 sm:gap-8 sm:px-3 lg:gap-10 lg:px-4">
           {[...mainCategories, ...mainCategories].map((category, idx) => (
             <Link
               key={`${category.id}-${idx}`}
               href={`/category/${encodeURIComponent(category.slug)}`}
              className="category-card group relative h-[12rem] w-[9rem] flex-shrink-0 overflow-hidden rounded-[18px] bg-[#fffdf8] text-white sm:h-[14rem] sm:w-[10.5rem] md:h-[16rem] md:w-[12rem]"
             >
              <div className="absolute inset-0">
                <Image
                  src={category.image || FALLBACK_IMAGE}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 168px, 192px"
                  className="object-contain transition-transform duration-1000 ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/65" />
              </div>
              <span className="absolute bottom-4 left-4 right-12 line-clamp-2 text-left text-sm font-extrabold uppercase leading-tight text-white sm:bottom-5 sm:left-5 sm:right-14 sm:text-base sm:text-lg">{category.name}</span>
              <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#d84967] text-base text-white sm:bottom-4 sm:right-4 sm:h-9 sm:w-9 sm:text-lg" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
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
      <div className="mb-3 flex items-center gap-3 sm:mb-4 sm:gap-5">
        <h3 className="shrink-0 font-serif text-lg font-extrabold leading-none text-gray-950 sm:text-xl sm:text-2xl">
          {category.name}
        </h3>
        <span aria-hidden="true" className="h-px min-w-4 flex-1 bg-gradient-to-r from-[#d84967]/55 via-[#d6b89f]/45 to-transparent" />
        <Link
          href={`/category/${encodeURIComponent(category.slug)}`}
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#f8e6df] px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-wide text-[#b84650] transition hover:bg-[#d84967] hover:text-white sm:px-3.5 sm:py-2 sm:text-[0.65rem] sm:text-xs"
        >
          View all
          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-3.5 sm:w-3.5" />
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
        className="scrollbar-hide flex gap-3 overflow-x-auto py-1 sm:gap-4 sm:gap-6"
      >
        {products.map((product) => (
          <div
            key={product.handle}
            data-product-card
            className="w-[calc((100vw-2.75rem)/2)] shrink-0 sm:w-[14rem] lg:w-[16rem]"
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
  const totalSlides = currentCollections.length > itemsPerPage ? currentCollections.length : 1;
  const visibleCount = Math.min(itemsPerPage, currentCollections.length);
  const displayCollections = Array.from(
    { length: visibleCount },
    (_, offset) => currentCollections[(currentSlide + offset) % currentCollections.length],
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
        className="grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-3 sm:justify-items-center transition-opacity duration-1000 ease-in-out"
      >
        {displayCollections.map((collection) => (
          <Link
            key={collection.id}
            href="/products"
            className="group w-full max-w-[300px] overflow-hidden rounded-xl border border-[#C6A24A]/20 bg-white sm:max-w-[340px]"
          >
            <div className="relative aspect-[40/37]">
              <Image
                src={collection.image || FALLBACK_IMAGE}
                alt={collection.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 text-base font-semibold text-white">
                {collection.title}
              </div>
            </div>
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
        <section className="mx-auto w-full max-w-7xl bg-white px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="space-y-6 sm:space-y-7 sm:space-y-9">
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
    <section className="mx-auto w-full max-w-7xl bg-gray-50 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto mb-6 max-w-3xl space-y-3 text-center sm:mb-8">
        <span className="inline-flex rounded-full bg-[#ffedd5] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#ea580c] sm:px-4 sm:py-1.5 sm:text-xs">
          Collections
        </span>
        <h2 className="font-serif text-2xl font-extrabold text-gray-900 sm:text-3xl sm:text-4xl lg:text-5xl">
          Curated Collections
        </h2>
      </div>
      <CollectionSlider collections={collections.filter((collection) => collection.isFeatured !== false)} />
    </section>
  );
}
