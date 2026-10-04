"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "@esmate/shadcn/pkgs/lucide-react";
import { PromoBannerCard } from "./promo-banner-card";
import type { PromoBanner } from "./promo-banner-types";

export function PromoBannerSection({ banners }: { banners: PromoBanner[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ startX: 0, scrollLeft: 0, dragging: false, moved: false });
  const visibleBanners = banners.filter((banner) => banner.isActive !== false);
  if (visibleBanners.length === 0) return null;

  function scroll(direction: -1 | 1) {
    const slider = sliderRef.current;
    if (!slider) return;
    slider.scrollBy({ left: direction * slider.clientWidth * 0.52, behavior: "smooth" });
  }

  return (
    <section aria-label="Featured offers" className="relative mx-auto w-full max-w-7xl bg-white px-3 pb-10 pt-5 sm:px-6 sm:pb-14 lg:px-8">
      <div
        ref={sliderRef}
        className="scrollbar-hide flex cursor-grab snap-x snap-mandatory gap-2.5 overflow-x-auto overflow-y-hidden scroll-smooth touch-pan-y active:cursor-grabbing sm:gap-4 lg:gap-5"
        onPointerDown={(event) => {
          const slider = sliderRef.current;
          if (!slider) return;
          dragState.current = { startX: event.clientX, scrollLeft: slider.scrollLeft, dragging: true, moved: false };
          slider.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const slider = sliderRef.current;
          if (!slider || !dragState.current.dragging) return;
          const distance = event.clientX - dragState.current.startX;
          if (Math.abs(distance) > 5) dragState.current.moved = true;
          slider.scrollLeft = dragState.current.scrollLeft - distance;
        }}
        onPointerUp={(event) => {
          dragState.current.dragging = false;
          sliderRef.current?.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => { dragState.current.dragging = false; }}
        onClickCapture={(event) => {
          if (!dragState.current.moved) return;
          event.preventDefault();
          event.stopPropagation();
          dragState.current.moved = false;
        }}
      >
        {visibleBanners.map((banner) => (
          <div key={banner.id} className="w-[calc((100%_-_0.625rem)/2)] shrink-0 snap-start sm:w-[calc((100%_-_1rem)/2)] lg:w-[calc((100%_-_1.25rem)/2)]">
            <PromoBannerCard banner={banner} />
          </div>
        ))}
      </div>

      {visibleBanners.length > 2 ? (
        <>
          <button type="button" onClick={() => scroll(-1)} aria-label="Previous banners" className="absolute left-4 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/95 text-black shadow-md transition hover:scale-105 hover:text-[#f7194f] sm:left-7 sm:h-11 sm:w-11">
            <ChevronLeft aria-hidden="true" className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label="Next banners" className="absolute right-4 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/95 text-black shadow-md transition hover:scale-105 hover:text-[#f7194f] sm:right-7 sm:h-11 sm:w-11">
            <ChevronRight aria-hidden="true" className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </>
      ) : null}
    </section>
  );
}
