import Image from "next/image";
import { Button } from "@esmate/shadcn/components/ui/button";
import { Skeleton } from "@esmate/shadcn/components/ui/skeleton";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
} from "@esmate/shadcn/pkgs/lucide-react";
import { useRef } from "react";

type GalleryImage = {
  id: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

type ProductGallerySectionProps = {
  title: string;
  images: GalleryImage[];
  currentImage: GalleryImage | null;
  onSelectImage: (image: GalleryImage) => void;
  onToggleWishlist: () => void;
  wishlistActive: boolean;
  highestDiscount: { discountPercent: number; minQuantity: number } | null;
};

export function ProductGallerySection({
  title,
  images,
  currentImage,
  onSelectImage,
  onToggleWishlist,
  wishlistActive,
  highestDiscount,
}: ProductGallerySectionProps) {
  const dragStartX = useRef<number | null>(null);
  const currentIndex = currentImage
    ? images.findIndex((image) => image.id === currentImage.id)
    : 0;

  const moveImage = (direction: -1 | 1) => {
    if (images.length < 2) return;
    const nextIndex =
      (Math.max(0, currentIndex) + direction + images.length) % images.length;
    onSelectImage(images[nextIndex]);
  };

  return (
    <div className="h-full min-w-0 space-y-4 rounded-2xl border border-orange-100/80 bg-white/45 p-2 sm:p-4">
      <div
        className="group/gallery relative mx-auto aspect-square w-full touch-pan-y overflow-hidden rounded-xl border border-[#C6A24A]/20 bg-[#f4f1e8] shadow-md"
        onTouchStart={(event) => {
          dragStartX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (dragStartX.current === null) return;
          const distance = (event.changedTouches[0]?.clientX ?? dragStartX.current) - dragStartX.current;
          dragStartX.current = null;
          if (Math.abs(distance) >= 40) moveImage(distance < 0 ? 1 : -1);
        }}
        onTouchCancel={() => {
          dragStartX.current = null;
        }}
      >
        <div className="absolute inset-0 bg-[#f4f1e8]" />
        {currentImage ? (
          <>
            <Image
              key={currentImage.id}
              src={currentImage.url}
              alt={currentImage.altText || title}
              fill
              priority
              className="animate-[fadeIn_350ms_ease-out] object-contain p-1.5 transition-transform duration-700 ease-out group-hover/gallery:scale-[1.04] sm:p-2"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/10 via-transparent to-black/5" />
          </>
        ) : (
          <Skeleton className="h-full w-full" />
        )}

        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                moveImage(-1);
              }}
              className="absolute left-2 top-1/2 z-20 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-gray-800 shadow-sm backdrop-blur-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              aria-label="View previous product image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                moveImage(1);
              }}
              className="absolute right-2 top-1/2 z-20 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-gray-800 shadow-sm backdrop-blur-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              aria-label="View next product image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}

        <Button
          size="icon"
          variant="secondary"
          className="absolute right-3 top-3 h-8 w-8 bg-white/90 shadow-md backdrop-blur-sm hover:bg-white"
          onClick={onToggleWishlist}
        >
          <Heart
            className={`h-4 w-4 ${wishlistActive ? "fill-[#C6A24A] text-[#C6A24A]" : "text-[#0a0a0a]"}`}
          />
        </Button>

        {highestDiscount ? (
          <div className="absolute left-3 top-3 z-10 -rotate-2 rounded-2xl border-2 border-white/80 bg-[linear-gradient(135deg,#f97316,#dc2626)] px-3 py-2 text-center text-white shadow-[0_10px_24px_rgba(220,38,38,0.3)] sm:px-4">
            <div className="text-xl font-black leading-none sm:text-2xl">
              {highestDiscount.discountPercent}% OFF
            </div>
            <div className="mt-1 text-[9px] font-bold uppercase tracking-wider text-white/90 sm:text-[10px]">
              {highestDiscount.minQuantity > 1
                ? `For ${highestDiscount.minQuantity}+ items`
                : "For 1 item"}
            </div>
          </div>
        ) : null}
      </div>

      <div className="w-full overflow-x-auto px-0.5">
        <div className="flex w-max min-w-full max-w-md justify-start gap-2 pb-2 sm:mx-auto">
          {images.map((img) => (
            <button
              type="button"
              key={img.id}
              onClick={() => onSelectImage(img)}
              className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 bg-[#f4f1e8] sm:h-16 sm:w-16 ${
                img.id === currentImage?.id
                  ? "border-[#f6a45d] ring-2 ring-[#f6a45d] ring-offset-1"
                  : "border-transparent hover:border-[#f6a45d]/40"
              }`}
            >
              <Image
                src={img.url}
                alt={img.altText || `${title} thumbnail`}
                fill
                className="object-cover"
                sizes="64px"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
