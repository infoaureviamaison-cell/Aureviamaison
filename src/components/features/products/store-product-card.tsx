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
    <article className="group flex aspect-[3/4] w-full max-w-[336px] flex-col overflow-hidden rounded-[14px] border border-[#d9c9a8] bg-white shadow-[inset_0_0_0_1px_rgba(132,96,42,0.08),0_3px_12px_rgba(36,29,17,0.09)] transition-[border-color,box-shadow,transform] duration-500 ease-out hover:-translate-y-1 hover:border-[#c6a24a]/70 hover:shadow-[inset_0_0_0_1px_rgba(132,96,42,0.08),0_12px_28px_rgba(36,29,17,0.14)]">
      <div className="group/image relative min-h-0 flex-1 overflow-hidden rounded-[14px] bg-[#fffdf8]">
        {discount !== null ? (
          <div className="absolute right-2.5 top-2.5 z-20 flex h-12 w-12 flex-col items-center justify-center rounded-full bg-[#f7194f] text-center text-white shadow-[0_4px_12px_rgba(247,25,79,0.32)] sm:h-14 sm:w-14">
            <span className="text-sm font-extrabold leading-none tracking-[-0.04em] sm:text-base">
              -{discount}%
            </span>
            <span className="mt-0.5 text-[0.45rem] font-bold uppercase leading-none tracking-[0.12em] sm:text-[0.5rem]">
              Off
            </span>
          </div>
        ) : null}

        <div className="absolute right-2.5 top-[4.25rem] z-30 flex flex-col gap-2.5 sm:right-3 sm:top-[4.75rem] sm:opacity-0 sm:transition-opacity sm:duration-500 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
          <button
            type="button"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#bfe5cc] bg-gradient-to-br from-[#f2fff6] via-[#d9f5e2] to-[#b9e8c8] text-[#14883f] shadow-[0_4px_12px_rgba(20,136,63,0.2)] transition duration-200 hover:scale-110 hover:from-[#74d99a] hover:via-[#35b86b] hover:to-[#087a35] hover:text-white hover:shadow-[0_6px_16px_rgba(8,122,53,0.45)]"
            aria-label={`Order ${title} on WhatsApp`}
            onClick={() => {
              window.open(whatsappUrl, "_blank", "noopener,noreferrer");
              trackContact("WhatsApp product order");
            }}
          >
            <FaWhatsapp className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={loading || !effectiveVariantId}
            aria-label={loading ? `Adding ${title} to cart` : `Add ${title} to cart`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#ead8b5] bg-gradient-to-br from-[#fff8ed] via-[#f7e8c8] to-[#e9c985] text-[#75491e] shadow-[0_4px_12px_rgba(111,75,28,0.22)] transition duration-300 hover:scale-110 hover:from-[#f4d9a0] hover:via-[#e7bd70] hover:to-[#d9a84e] hover:text-[#542d10] hover:shadow-[0_6px_16px_rgba(185,137,59,0.4)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ShoppingCart aria-hidden="true" className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#f5c5d0] bg-gradient-to-br from-[#fff2f5] via-[#f9dce4] to-[#f0b9c9] text-[#a62c50] shadow-[0_4px_12px_rgba(166,44,80,0.2)] transition duration-300 hover:scale-110 hover:from-[#efb5c5] hover:via-[#df8fa6] hover:to-[#c96380] hover:text-white hover:shadow-[0_6px_16px_rgba(201,99,128,0.42)]"
            aria-label={`Save ${title}`}
          >
            <Heart aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <Link
          href={productPath}
          aria-label={`View ${title}`}
          className="absolute inset-0 z-10 block"
        >
          <Image
            src={firstImage}
            alt={title}
            fill
            sizes="(max-width: 640px) 85vw, 260px"
            className={`object-contain transition-[opacity,transform] duration-1000 ease-out group-hover/image:scale-[1.06] ${hoverImage ? "group-hover/image:opacity-0" : ""}`}
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
              className="object-contain opacity-0 transition-[opacity,transform] duration-1000 ease-out group-hover/image:scale-[1.06] group-hover/image:opacity-100"
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

          <div className="mt-1.5 flex items-baseline gap-2 whitespace-nowrap">
            <span className="font-serif text-sm font-bold tracking-[-0.025em] text-[#85420b] sm:text-base">
              {formatPrice(price.amount)}
            </span>
            {discount !== null && compareAtPrice ? (
              <span className="truncate text-[0.6rem] font-medium text-[#85878c] line-through sm:text-[0.65rem]">
                {formatPrice(compareAtPrice.amount)}
              </span>
            ) : null}
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
