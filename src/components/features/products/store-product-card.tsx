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
    <article className="group flex min-w-0 max-w-[550px] flex-col overflow-hidden rounded-[30px] border border-[#efe3d0] bg-[#f7f0eb] shadow-[0_18px_40px_rgba(87,63,43,0.12)] transition duration-300 hover:-translate-y-0.5">
      <div className="relative h-[520px] overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(240,200,170,0.7),_rgba(246,222,207,0.3)_38%,_rgba(221,185,154,0.3)_60%,_rgba(248,241,231,0.75)_100%)] px-4 pb-2 pt-4 sm:px-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.9),transparent_18%),radial-gradient(circle_at_78%_22%,rgba(239,178,182,0.35),transparent_15%),radial-gradient(circle_at_52%_82%,rgba(204,171,152,0.4),transparent_25%)]" />

        <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-[18px] border border-[#f3ecd7] bg-[#f6efe7]/90 px-3 py-2 shadow-[0_8px_18px_rgba(90,58,40,0.12)] backdrop-blur-sm sm:left-5 sm:top-5 sm:gap-3 sm:px-4 sm:py-3">
          <div className="min-w-0">
            <div className="whitespace-nowrap text-lg font-bold leading-none text-[#1d1a1a] sm:text-[2.05rem]">
              {formatPrice(price.amount)}
            </div>
            {discount !== null && compareAtPrice ? (
              <div className="mt-1 whitespace-nowrap text-[10px] font-medium leading-tight text-[#8c7c6d] line-through sm:text-xs">
                {formatPrice(compareAtPrice.amount)}
              </div>
            ) : null}
          </div>
        </div>

        {discount !== null ? (
          <div className="absolute right-4 top-4 z-20 inline-flex items-center rounded-[18px] bg-[#ff4b6d] px-4 py-2.5 text-sm font-bold text-white shadow-[0_10px_22px_rgba(255,75,109,0.35)] sm:right-5 sm:top-5 sm:text-xl">
            -{discount}% OFF
          </div>
        ) : null}

        <Link
          href={productPath}
          aria-label={`View ${title}`}
          className="group/image absolute inset-0 z-10 block"
        >
          <Image
            src={firstImage}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="z-10 object-contain p-5 drop-shadow-[0_26px_35px_rgba(143,82,84,0.36)] transition-transform duration-500 ease-out group-hover/image:scale-[1.02]"
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
              className="z-10 object-contain p-5 opacity-0 drop-shadow-[0_26px_35px_rgba(143,82,84,0.36)] transition-transform duration-500 ease-out group-hover/image:scale-[1.02] group-hover/image:opacity-100"
              onError={() =>
                setFailedImages((current) =>
                  current.includes(hoverImage) ? current : [...current, hoverImage],
                )
              }
            />
          ) : null}
        </Link>

        <div className="absolute right-4 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-4 sm:right-5">
          <button
            type="button"
            className="flex h-14 w-14 items-center justify-center rounded-full border-[5px] border-white bg-[#3ccf7a] text-white shadow-[0_8px_18px_rgba(60,207,122,0.22)] transition-transform hover:scale-105"
            aria-label={`Order ${title} on WhatsApp`}
            onClick={() => {
              window.open(whatsappUrl, "_blank", "noopener,noreferrer");
              trackContact("WhatsApp product order");
            }}
          >
            <FaWhatsapp className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={loading || !effectiveVariantId}
            aria-label={loading ? `Adding ${title} to cart` : `Add ${title} to cart`}
            className="flex h-14 w-14 items-center justify-center rounded-full border-[5px] border-white bg-white text-[#ff4b6d] shadow-[0_8px_18px_rgba(0,0,0,0.08)] transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ShoppingCart aria-hidden="true" className="h-6 w-6" />
          </button>
          <button
            type="button"
            className="flex h-14 w-14 items-center justify-center rounded-full border-[5px] border-white bg-white text-[#ff4b6d] shadow-[0_8px_18px_rgba(0,0,0,0.08)] transition-transform hover:scale-105"
            aria-label={`Save ${title}`}
          >
            <span className="text-2xl leading-none">♡</span>
          </button>
        </div>
      </div>

      <div className="flex items-end justify-between gap-4 px-5 pb-5 pt-4 sm:px-6">
        <div className="min-w-0 flex-1">
          <Link href={productPath} className="group/title block">
            <h3 className="line-clamp-2 text-[2.2rem] font-black leading-[1.05] tracking-[-0.04em] text-[#0f0f0f] transition-colors group-hover/title:text-[#d34c65]">
              {title}
            </h3>
          </Link>

          <div className="mt-3">
            <ProductRating
              rating={visibleReviewStats.averageRating}
              totalReviews={visibleReviewStats.totalReviews}
            />
          </div>

          <div className="mt-3 text-xl font-medium text-[#2c2c2c]">
            Eau de Parfum • 100 ml
          </div>
        </div>

        <Link
          href={productPath}
          aria-label={`View ${title}`}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f7dfe4] text-3xl font-medium text-[#ff4b6d] shadow-[0_8px_20px_rgba(255,75,109,0.16)] transition-transform hover:scale-105"
        >
          <span aria-hidden="true">›</span>
        </Link>
      </div>
    </article>
  );
}
