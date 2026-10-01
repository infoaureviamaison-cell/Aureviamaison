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
  featuredImageUrl: string;
  imageUrls?: string[];
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
    <div className="flex items-center gap-1.5">
      <span
        className="flex items-center gap-0.5 leading-none"
        aria-label={`${rating.toFixed(1)} out of 5 stars`}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={`text-sm ${index < activeStars ? "text-yellow-400" : "text-gray-300"}`}
            aria-hidden="true"
          >
            ★
          </span>
        ))}
      </span>
      <span className="text-xs font-medium text-[#0a0a0a]">
        {rating.toFixed(1)}
      </span>
      <span className="text-[11px] font-normal text-gray-400">
        ({totalReviews})
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

  const productImages = useMemo(() => {
    const urls = [featuredImageUrl, ...(imageUrls || [])]
      .filter(
        (url): url is string =>
          typeof url === "string" && url.trim().length > 0,
      )
      .filter((url, index, all) => all.indexOf(url) === index)
      .filter((url) => !failedImages.includes(url));

    return urls.length > 0 ? urls : [FALLBACK_IMAGE];
  }, [featuredImageUrl, imageUrls, failedImages]);

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
          imageUrl: featuredImageUrl,
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
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-[22px] border border-[#e4e6e9] bg-white transition duration-300 hover:-translate-y-0.5 hover:border-[#d7d9de]">
      <div className="relative aspect-[0.94] overflow-hidden bg-[#f1f2f4]">
        <Link
          href={productPath}
          aria-label={`View ${title}`}
          className="group/image absolute inset-0 block"
        >
          <Image
            src={firstImage}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="z-10 object-contain p-3 transition-transform duration-500 ease-out group-hover/image:scale-[1.03] md:group-hover/image:opacity-0"
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
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="z-10 object-contain p-3 opacity-0 transition-transform duration-500 ease-out group-hover/image:scale-[1.03] md:group-hover/image:opacity-100"
              onError={() =>
                setFailedImages((current) =>
                  current.includes(hoverImage) ? current : [...current, hoverImage],
                )
              }
            />
          ) : null}
        </Link>

        <div className="absolute left-3 top-3 z-20 flex max-w-[calc(100%-4rem)] items-center gap-2 rounded-2xl border border-white/80 bg-white/95 px-3 py-2.5 sm:left-5 sm:top-5 sm:gap-3 sm:px-4 sm:py-3">
          <div className="min-w-0">
            <div className="whitespace-nowrap text-sm font-bold leading-tight text-[#781b31] sm:text-lg">
              {formatPrice(price.amount)}
            </div>
            {discount !== null && compareAtPrice ? (
              <div className="mt-1 whitespace-nowrap text-[10px] font-medium leading-tight text-[#8b8f98] line-through sm:text-xs">
                {formatPrice(compareAtPrice.amount)}
              </div>
            ) : null}
          </div>
          {discount !== null ? (
            <span className="shrink-0 rounded-full bg-[#ffe8ed] px-2.5 py-1.5 text-[10px] font-bold text-[#d34c65] sm:px-3 sm:text-xs">
              {discount}% OFF
            </span>
          ) : null}
        </div>

        <div className="absolute right-3 top-3 z-20 flex flex-col gap-3 sm:right-5 sm:top-5">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-[#25D366] text-white transition-transform hover:scale-105 sm:h-14 sm:w-14"
            aria-label={`Order ${title} on WhatsApp`}
            onClick={() => {
              window.open(whatsappUrl, "_blank", "noopener,noreferrer");
              trackContact("WhatsApp product order");
            }}
          >
            <FaWhatsapp className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={loading || !effectiveVariantId}
            aria-label={loading ? `Adding ${title} to cart` : `Add ${title} to cart`}
            className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-white text-[#d34c65] transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 sm:h-14 sm:w-14"
          >
            <ShoppingCart aria-hidden="true" className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 px-4 pb-5 pt-4 sm:px-5">
        <ProductRating
          rating={visibleReviewStats.averageRating}
          totalReviews={visibleReviewStats.totalReviews}
        />
        <Link href={productPath} className="group/title block">
          <h3 className="line-clamp-2 text-lg font-bold leading-tight text-[#111827] transition-colors group-hover/title:text-[#d34c65] sm:text-xl">
            {title}
          </h3>
        </Link>
      </div>
    </article>
  );
}
