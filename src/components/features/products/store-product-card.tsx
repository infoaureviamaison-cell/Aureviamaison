"use client";

import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
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
  return `Rs.${n.toLocaleString("en-PK")}`;
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
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-black/20 hover:shadow-sm">
      {discount !== null && (
        <span className="absolute right-3 top-3 z-20 rounded-full border border-[#fed7aa] bg-[#fff7ed] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-[#f97316]">
          {discount}% OFF
        </span>
      )}

      <div className="absolute left-3 top-3 z-20 rounded-xl border border-black/5 bg-white/95 px-2.5 py-1.5 shadow-sm backdrop-blur-sm">
        <div className="text-sm font-medium leading-none text-black">
          {formatPrice(price.amount)}
        </div>
        {discount !== null &&
          compareAtPrice &&
          parseFloat(compareAtPrice.amount) > parseFloat(price.amount) && (
            <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px] font-normal leading-tight text-black/55">
              <span className="line-through">
                {formatPrice(compareAtPrice.amount)}
              </span>
            </div>
          )}
      </div>

      {/* ── Product image ──────────────────────────────────── */}
      <Link
        href={`/products/${handle}`}
        className="group/image relative block aspect-square w-full overflow-hidden border-b border-black/10 bg-[#f9f9f9]"
      >
        <div className="absolute inset-0 bg-[#f5f5f5]" />
        <Image
          src={firstImage}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="relative z-10 h-full w-full scale-100 object-cover opacity-100 transition-all duration-500 ease-out group-hover:scale-[1.05] md:group-hover/image:opacity-0"
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
            className="relative z-10 h-full w-full scale-100 object-cover opacity-0 transition-all duration-500 ease-out group-hover:scale-[1.05] md:group-hover/image:opacity-100"
            onError={() =>
              setFailedImages((current) =>
                current.includes(hoverImage) ? current : [...current, hoverImage],
              )
            }
          />
        ) : null}

        <button
          type="button"
          className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-2.5 py-1.5 text-[11px] font-medium text-white shadow-md transition hover:scale-[1.02]"
          aria-label={`Order ${title} on WhatsApp`}
          onClick={() => {
            window.open(whatsappUrl, "_blank", "noopener,noreferrer");
            trackContact("WhatsApp product order");
          }}
        >
          <FaWhatsapp className="h-3.5 w-3.5" />
          WhatsApp
        </button>
      </Link>

      {/* ── Card body ─────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5 px-4 pb-4 pt-2">
        <div className="flex items-center justify-between">
          <ProductRating
            rating={visibleReviewStats.averageRating}
            totalReviews={visibleReviewStats.totalReviews}
          />
        </div>

        <Link
          href={`/products/${handle}`}
          className="group/title block min-h-10"
        >
          <h3 className="line-clamp-2 text-base font-medium leading-tight tracking-[-0.01em] text-black transition-colors group-hover/title:text-[#f97316] sm:text-lg">
            {title}
          </h3>
        </Link>

        {/* Purchase actions */}
        <div className="mt-2 grid grid-cols-1 gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={loading || !effectiveVariantId}
            className="whitespace-nowrap rounded-md border border-[#f97316] bg-[#f97316] px-4 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-[#ea580c] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Adding…" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
