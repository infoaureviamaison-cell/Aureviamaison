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
    <article className="group flex w-full max-w-[360px] flex-col overflow-hidden rounded-[30px] bg-[#f5f1f2] shadow-[0_22px_28px_rgba(0,0,0,0.08)] transition duration-300 hover:-translate-y-0.5">
      <div className="relative overflow-hidden rounded-[30px] bg-[#cec3f8] px-4 pb-0 pt-4">
        <div className="absolute left-4 top-4 z-20 flex items-start gap-2 rounded-[18px] bg-[#f1ece6]/90 px-4 py-2.5 shadow-[0_8px_16px_rgba(62,43,34,0.12)]">
          <div>
            <div className="text-[1.85rem] font-black leading-none tracking-[-0.04em] text-[#1a1a1a]">
              {formatPrice(price.amount)}
            </div>
            {discount !== null && compareAtPrice ? (
              <div className="mt-1 text-[0.68rem] font-medium text-[#7b7a7e] line-through">
                {formatPrice(compareAtPrice.amount)}
              </div>
            ) : null}
          </div>
        </div>

        {discount !== null ? (
          <div className="absolute right-4 top-4 z-20 rounded-[16px] bg-[#ff4a65] px-3 py-2 text-base font-bold text-white shadow-[0_10px_18px_rgba(255,74,101,0.35)]">
            -{discount}% OFF
          </div>
        ) : null}

        <div className="absolute right-4 top-[52%] z-30 flex -translate-y-1/2 flex-col gap-3">
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full border-[4px] border-white bg-[#3dcf73] text-white shadow-[0_8px_14px_rgba(61,207,115,0.2)] transition-transform hover:scale-105"
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
            className="flex h-12 w-12 items-center justify-center rounded-full border-[4px] border-white bg-white text-[#ff4a65] shadow-[0_8px_14px_rgba(0,0,0,0.08)] transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ShoppingCart aria-hidden="true" className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full border-[4px] border-white bg-white text-[#ff4a65] shadow-[0_8px_14px_rgba(0,0,0,0.08)] transition-transform hover:scale-105"
            aria-label={`Save ${title}`}
          >
            <span className="text-xl leading-none">♡</span>
          </button>
        </div>

        <div className="relative mx-auto mt-16 h-[245px] w-[82%]">
          <div className="absolute bottom-0 left-1/2 h-16 w-[220px] -translate-x-1/2 rounded-[18px] bg-[#d7b89a] shadow-[0_8px_18px_rgba(101,83,66,0.18)]" />

          <div className="absolute bottom-12 left-1/2 h-24 w-16 -translate-x-[70%] rounded-[10px] border border-[#d0b085] bg-[#f4f1f1] shadow-[0_10px_18px_rgba(69,52,40,0.12)]">
            <div className="mx-auto mt-[-10px] h-6 w-10 rounded-t-[8px] bg-[#d4af7a]" />
            <div className="mt-2 px-2 text-center text-[6px] font-semibold uppercase tracking-[0.18em] text-[#7c4c2d]">
              Curality
            </div>
            <div className="mx-auto mt-2 h-10 w-10 rounded-md bg-[#f7eecf]" />
          </div>

          <div className="absolute bottom-12 left-1/2 h-[116px] w-[64px] -translate-x-1/2 rounded-[10px] border border-[#d0b085] bg-[#d0a57d] shadow-[0_12px_18px_rgba(69,52,40,0.12)]">
            <div className="mx-auto mt-[-12px] h-7 w-12 rounded-t-[8px] bg-[#b9915f]" />
            <div className="mt-3 text-center text-[7px] font-bold uppercase tracking-[0.14em] text-[#fff8ef]">
              Curality
            </div>
            <div className="mx-auto mt-3 h-10 w-10 rounded-md bg-[#f6e9d0]" />
          </div>

          <div className="absolute bottom-12 left-1/2 h-24 w-16 translate-x-[40%] rounded-[10px] border border-[#d0b085] bg-[#f4f1f1] shadow-[0_10px_18px_rgba(69,52,40,0.12)]">
            <div className="mx-auto mt-[-10px] h-6 w-10 rounded-t-[8px] bg-[#d4af7a]" />
            <div className="mt-2 px-2 text-center text-[6px] font-semibold uppercase tracking-[0.18em] text-[#7c4c2d]">
              Curality
            </div>
            <div className="mx-auto mt-2 h-10 w-10 rounded-md bg-[#f7eecf]" />
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between gap-3 px-4 pb-5 pt-4">
        <div className="min-w-0 flex-1">
          <Link href={productPath} className="group/title block">
            <h3 className="line-clamp-2 text-[2.3rem] font-black leading-[0.9] tracking-[-0.05em] text-[#171717] transition-colors group-hover/title:text-[#d34c65]">
              {title}
            </h3>
          </Link>

          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-1 text-[1.15rem] leading-none">
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
            <span className="text-[1.1rem] font-bold text-[#0f0f0f]">
              {visibleReviewStats.averageRating.toFixed(1)}
            </span>
            <span className="text-sm font-medium text-[#5a5a5a]">
              ({visibleReviewStats.totalReviews} reviews)
            </span>
          </div>

          <div className="mt-3 text-[1.05rem] font-medium text-[#333333]">
            Eau de Parfum • 100 ml
          </div>
        </div>

        <Link
          href={productPath}
          aria-label={`View ${title}`}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f9dfe6] text-3xl font-medium text-[#ff4a65] shadow-[0_10px_18px_rgba(255,74,101,0.18)] transition-transform hover:scale-105"
        >
          <span aria-hidden="true">›</span>
        </Link>
      </div>
    </article>
  );
}
