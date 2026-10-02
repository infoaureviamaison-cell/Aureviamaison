"use client";

import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { ShoppingCart } from "@esmate/shadcn/pkgs/lucide-react";
import { useCart } from "@/lib/commerce";
import { toast } from "sonner";
import { useState, useEffect, useMemo } from "react";
import {
  addToCart as trackAddToCart,
  contact as trackContact,
} from "@/lib/pixel";

// ─── Types ───────────────────────────────────────────────────────────────────

type ProductCardProps = {
  handle: string;
  title: string;
  featuredImageUrl?: string | { url?: string } | null;
  imageUrls?: Array<string | { url?: string } | null>;
  price: { amount: string; currencyCode: string };
  compareAtPrice?: { amount: string; currencyCode: string } | null;
  tag?: string;
  variantId?: string;
  productId?: string;
};

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const FALLBACK_IMAGE = "/logo/auerviamaison.png";

function discountPercent(compare: string, current: string): number | null {
  const c = parseFloat(compare);
  const p = parseFloat(current);
  if (!c || !p || c <= p) return null;
  return Math.round(((c - p) / c) * 100);
}

function formatPrice(amount: string) {
  const n = parseFloat(amount);
  return `Rs. ${n.toLocaleString("en-PK")}`;
}

function normalizeImageUrl(value: unknown): string | null {
  if (typeof value === "string") {
    return value.trim() || null;
  }

  if (value && typeof value === "object") {
    const candidate = value as { url?: unknown; src?: unknown; image?: unknown };
    const resolved = candidate.url ?? candidate.src ?? candidate.image;
    if (typeof resolved === "string") {
      return resolved.trim() || null;
    }
  }

  return null;
}

function getProductMeta(title: string, tag?: string) {
  const normalizedTag = tag?.trim();
  if (normalizedTag && normalizedTag.length > 0) {
    return `${normalizedTag} • 100 ml`;
  }

  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("eau de parfum") || lowerTitle.includes("perfume")) {
    return "Eau de Parfum • 100 ml";
  }

  if (lowerTitle.includes("serum") || lowerTitle.includes("oil")) {
    return "Luxury Care • 100 ml";
  }

  return "Premium Beauty • 100 ml";
}

// ─── Main Component ───────────────────────────────────────────────────────────

function getDefaultReviewStats(seedText: string): ReviewStats {
  let seed = 0;

  for (let index = 0; index < seedText.length; index += 1) {
    seed = (seed * 31 + seedText.charCodeAt(index)) % 10000;
  }

  return {
    averageRating: 4.4 + (seed % 6) / 10,
    totalReviews: 18 + (seed % 84),
  };
}

function ProductRating({
  rating,
  totalReviews,
}: {
  rating: number;
  totalReviews: number;
}) {
  const activeStars = Math.round(rating);

  return (
    <div className="flex items-center gap-2">
      <span
        className="flex items-center gap-1 leading-none"
        aria-label={`${rating.toFixed(1)} out of 5 stars`}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={`text-xl ${index < activeStars ? "text-[#d9b158]" : "text-[#d9d9d9]"}`}
            aria-hidden="true"
          >
            ★
          </span>
        ))}
      </span>
      <span className="text-[1.05rem] font-bold text-[#111111]">
        {rating.toFixed(1)}
      </span>
      <span className="text-sm font-medium text-[#5a5e55]">
        ({totalReviews} reviews)
      </span>
    </div>
  );
}

export function StoreProductCard({
  handle,
  title,
  featuredImageUrl,
  imageUrls,
  price,
  compareAtPrice,
  tag,
  variantId,
  productId,
}: ProductCardProps) {
  const [loading, setLoading] = useState(false);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const { linesAdd } = useCart();

  const normalizedFeaturedImage = normalizeImageUrl(featuredImageUrl);
  const normalizedProductImages = useMemo(
    () => [normalizedFeaturedImage, ...(imageUrls || []).map(normalizeImageUrl)].filter((value): value is string => Boolean(value)),
    [featuredImageUrl, imageUrls],
  );

  const productImages = useMemo(() => {
    const urls = normalizedProductImages
      .filter((url, index, all) => all.indexOf(url) === index)
      .filter((url) => !failedImages.includes(url));

    return urls.length > 0 ? urls : [FALLBACK_IMAGE];
  }, [normalizedProductImages, failedImages]);

  const firstImage = productImages[0] || FALLBACK_IMAGE;
  const hoverImage = productImages[1] || null;

  const effectiveVariantId = variantId || productId;

  const discount = compareAtPrice
    ? discountPercent(compareAtPrice.amount, price.amount)
    : null;
  const defaultReviewStats = useMemo(
    () => getDefaultReviewStats(productId || handle || title),
    [handle, productId, title],
  );
  const visibleReviewStats =
    reviewStats && reviewStats.totalReviews > 0
      ? reviewStats
      : defaultReviewStats;

  const productPath = `/products/${handle}`;
  const productMeta = getProductMeta(title, tag);
  const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923171707418"}?text=${encodeURIComponent(
    `Hi, I want to order this product:\n\nProduct: ${title}\nPrice: ${formatPrice(price.amount)}\nLink: ${productPath}`,
  )}`;

  // ── Fetch review stats ──
  useEffect(() => {
    async function fetchReviewStats() {
      try {
        const res = await fetch(`/api/reviews?productHandle=${handle}&limit=1`);
        const data = await res.json();
        if (data.statistics) setReviewStats(data.statistics);
      } catch {
        // silently fail
      }
    }
    fetchReviewStats();
  }, [handle]);

  useEffect(() => {
    setFailedImages([]);
  }, [featuredImageUrl, imageUrls]);

  // ── Add to cart ──
  const handleAddToCart = async () => {
    if (!effectiveVariantId) return;
    setLoading(true);
    try {
      await linesAdd([
        {
          merchandiseId: effectiveVariantId,
          quantity: 1,
          title,
          price,
          imageUrl: normalizedFeaturedImage || FALLBACK_IMAGE,
        },
      ]);
      toast.success("Added to cart", { description: title });
      trackAddToCart({
        content_ids: [productId || effectiveVariantId],
        contents: [
          {
            id: productId || effectiveVariantId,
            quantity: 1,
            item_price: parseFloat(price.amount),
            variant: effectiveVariantId,
          },
        ],
        content_name: title,
        content_category: tag,
        content_type: "product",
        value: parseFloat(price.amount),
        currency: "PKR",
        num_items: 1,
      });
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="group flex w-full max-w-[420px] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_12px_28px_rgba(0,0,0,0.09)] transition duration-300 hover:-translate-y-0.5">
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-[24px] bg-[#f5f1ed]">
        <div className="absolute left-3 top-3 z-20 flex items-start gap-2 rounded-[14px] bg-[#f1ece6]/90 px-3 py-2 shadow-[0_6px_12px_rgba(62,43,34,0.12)]">
          <div>
            <div className="text-[1.4rem] font-black leading-none tracking-[-0.04em] text-[#1a1a1a]">
              {formatPrice(price.amount)}
            </div>
            {discount !== null && compareAtPrice ? (
              <div className="mt-0.5 text-[0.6rem] font-medium text-[#7b7a7e] line-through">
                {formatPrice(compareAtPrice.amount)}
              </div>
            ) : null}
          </div>
        </div>

        {discount !== null ? (
          <div className="absolute right-3 top-3 z-20 rounded-[12px] bg-[#ff4a65] px-2.5 py-1.5 text-sm font-bold text-white shadow-[0_6px_12px_rgba(255,74,101,0.35)]">
            -{discount}% OFF
          </div>
        ) : null}

        <div className="absolute right-3 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-2 sm:right-4 sm:gap-3">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-white bg-[#3dcf73] text-white shadow-[0_6px_10px_rgba(61,207,115,0.2)] transition-transform hover:scale-105 sm:h-12 sm:w-12"
            aria-label={`Order ${title} on WhatsApp`}
            onClick={() => {
              window.open(whatsappUrl, "_blank", "noopener,noreferrer");
              trackContact("WhatsApp product order");
            }}
          >
            <FaWhatsapp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={loading || !effectiveVariantId}
            aria-label={loading ? `Adding ${title} to cart` : `Add ${title} to cart`}
            className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-white bg-[#e5e5e5] text-black shadow-[0_6px_10px_rgba(0,0,0,0.08)] transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 sm:h-12 sm:w-12"
          >
            <ShoppingCart aria-hidden="true" className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-white bg-white text-[#ff4a65] shadow-[0_6px_10px_rgba(0,0,0,0.08)] transition-transform hover:scale-105 sm:h-12 sm:w-12"
            aria-label={`Save ${title}`}
          >
            <span className="text-lg leading-none">♥</span>
          </button>
        </div>

        <Link
          href={productPath}
          aria-label={`View ${title}`}
          className="group/image absolute inset-0 block"
        >
          <Image
            src={firstImage}
            alt={title}
            fill
            sizes="(max-width: 640px) 85vw, 260px"
            className="z-10 object-contain p-3 transition-transform duration-500 ease-out group-hover/image:scale-[1.02] sm:p-5"
            onError={() =>
              setFailedImages((current) =>
                current.includes(firstImage) ? current : [...current, firstImage],
              )
            }
          />
          {hoverImage ? (
            <Image
              src={hoverImage}
              alt={`${title} alternate view`}
              fill
              sizes="(max-width: 640px) 85vw, 260px"
              className="z-10 object-contain p-3 opacity-0 transition-transform duration-500 ease-out group-hover/image:scale-[1.02] group-hover/image:opacity-100 sm:p-5"
              onError={() =>
                setFailedImages((current) =>
                  current.includes(hoverImage) ? current : [...current, hoverImage],
                )
              }
            />
          ) : null}
        </Link>
      </div>

      <div className="flex items-center justify-between gap-3 px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
        <div className="min-w-0 flex-1">
          <Link href={productPath} className="group/title block">
            <h3 className="line-clamp-2 font-serif text-xl font-bold leading-tight tracking-[-0.025em] text-[#111827] transition-colors group-hover/title:text-[#d34c65] sm:text-2xl">
              {title}
            </h3>
          </Link>

          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
            <div className="flex items-center gap-0.5 text-lg leading-none sm:text-xl">
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={index}
                  className={index < Math.round(visibleReviewStats.averageRating) ? "text-[#d7b254]" : "text-[#d7d7d7]"}
                  aria-hidden="true"
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-base font-semibold text-[#0f0f0f] sm:text-lg">
              {visibleReviewStats.averageRating.toFixed(1)}
            </span>
            <span className="text-sm font-medium text-[#85878c] sm:text-base">
              ({visibleReviewStats.totalReviews} reviews)
            </span>
          </div>

          <div className="mt-3 text-sm font-medium text-[#85878c] sm:text-base">
            {productMeta}
          </div>
        </div>

        <Link
          href={productPath}
          aria-label={`View ${title}`}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fce4e7] text-3xl font-medium text-[#ff3154] transition-transform hover:scale-105 sm:h-14 sm:w-14"
        >
          <span aria-hidden="true">›</span>
        </Link>
      </div>
    </article>
  );
}
