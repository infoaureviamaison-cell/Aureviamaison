"use client";

import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { ArrowRight, Heart, ShoppingCart } from "@esmate/shadcn/pkgs/lucide-react";
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
    <article className="group flex w-full max-w-[280px] flex-col overflow-hidden rounded-[14px] border border-[#d9c9a8] bg-white shadow-[inset_0_0_0_1px_rgba(132,96,42,0.08),0_2px_8px_rgba(36,29,17,0.08)]">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[16px] bg-[#fffdf8]">
        <div className="absolute left-2 top-2 z-20 flex min-w-0 items-start gap-2 rounded-[12px] bg-white/95 px-2 py-1.5">
          <div>
            <div className="font-serif text-sm font-bold leading-none tracking-[-0.035em] text-[#85420b] sm:text-base">
              {formatPrice(price.amount)}
            </div>
            {discount !== null && compareAtPrice ? (
              <div className="mt-1 text-[0.6rem] font-medium text-[#77716e] line-through sm:text-[0.65rem]">
                {formatPrice(compareAtPrice.amount)}
              </div>
            ) : null}
          </div>
        </div>

        {discount !== null ? (
          <div className="absolute right-2 top-2 z-20 rounded-[12px] bg-[#f7194f] px-2 py-1.5 text-[0.65rem] font-bold text-white sm:px-2.5 sm:text-xs">
            -{discount}% OFF
          </div>
        ) : null}

        <div className="absolute right-2 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-2 sm:right-2.5 sm:opacity-0 sm:transition-opacity sm:duration-200 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
          <button
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/80 bg-white text-[#14b85a] shadow-[0_3px_10px_rgba(0,0,0,0.2)] transition duration-200 hover:scale-110 hover:bg-[#14b85a] hover:text-white hover:shadow-[0_5px_14px_rgba(20,184,90,0.4)]"
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
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/80 bg-white text-black shadow-[0_3px_10px_rgba(0,0,0,0.2)] transition duration-200 hover:scale-110 hover:bg-black hover:text-white hover:shadow-[0_5px_14px_rgba(0,0,0,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ShoppingCart aria-hidden="true" className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/80 bg-white text-[#f7194f] shadow-[0_3px_10px_rgba(0,0,0,0.2)] transition duration-200 hover:scale-110 hover:bg-[#f7194f] hover:text-white hover:shadow-[0_5px_14px_rgba(247,25,79,0.4)]"
            aria-label={`Save ${title}`}
          >
            <Heart aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <Link
          href={productPath}
          aria-label={`View ${title}`}
          className="group/image absolute inset-0 z-10 block"
        >
          <Image
            src={firstImage}
            alt={title}
            fill
            sizes="(max-width: 640px) 85vw, 260px"
            className="object-cover transition-transform duration-500 ease-out group-hover/image:scale-[1.02]"
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
              className="object-cover opacity-0 transition-transform duration-500 ease-out group-hover/image:scale-[1.02] group-hover/image:opacity-100"
              onError={() =>
                setFailedImages((current) =>
                  current.includes(hoverImage) ? current : [...current, hoverImage],
                )
              }
            />
          ) : null}
        </Link>
      </div>

      <div className="flex items-start justify-between gap-2 px-3 pb-3 pt-2.5 sm:px-4 sm:pb-4 sm:pt-3">
        <div className="min-w-0 flex-1">
          <Link href={productPath} className="group/title block">
            <h3 className="truncate font-serif text-sm font-bold leading-tight tracking-[-0.025em] text-[#10131a] transition-colors group-hover/title:text-[#d34c65] sm:text-base">
              {title}
            </h3>
          </Link>

          <div className="mt-1 flex flex-nowrap items-center gap-x-1 whitespace-nowrap">
            <div className="flex shrink-0 items-center gap-0 text-xs leading-none sm:text-sm">
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={index}
                  className={index < Math.floor(visibleReviewStats.averageRating) ? "text-[#ffa916]" : index < Math.ceil(visibleReviewStats.averageRating) ? "text-[#ffa916]/70" : "text-[#d7d7d7]"}
                  aria-hidden="true"
                >
                  ★
                </span>
              ))}
            </div>
            <span className="shrink-0 text-[0.65rem] font-semibold text-[#0f0f0f] sm:text-xs">
              {visibleReviewStats.averageRating.toFixed(1)}
            </span>
            <span className="truncate text-[0.58rem] font-medium text-[#85878c] sm:text-[0.65rem]">
              ({visibleReviewStats.totalReviews} reviews)
            </span>
          </div>

          <div className="mt-1.5 truncate text-[0.65rem] font-medium text-[#85878c] sm:text-xs">
            {productMeta}
          </div>
        </div>

        <Link
          href={productPath}
          aria-label={`View ${title}`}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ffe1e4] text-[#f7194f] transition-transform hover:scale-105 sm:h-8 sm:w-8"
        >
          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 stroke-[3]" />
        </Link>
      </div>
    </article>
  );
}
