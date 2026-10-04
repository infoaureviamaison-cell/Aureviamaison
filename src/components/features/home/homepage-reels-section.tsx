"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "@esmate/shadcn/pkgs/lucide-react";
import type { PublicVideo } from "@/lib/video-utils";
import { SectionHeading } from "@/components/shared/section-heading";

function ReelEmbed({ video }: { video: PublicVideo }) {
  if (!video.embedUrl) {
    return (
      <div className="flex aspect-[9/16] w-full items-center justify-center rounded-2xl bg-gray-900 text-center text-xs text-white/80">
        Unavailable
      </div>
    );
  }

  return (
    <div className="aspect-[9/16] w-full overflow-hidden rounded-2xl border border-[#EA580C]/15 bg-black shadow-sm">
      <iframe
        src={video.embedUrl}
        title=""
        className="h-full w-full border-0"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

export function HomepageReelsSection({ reels }: { reels: PublicVideo[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ startX: 0, scrollLeft: 0, dragging: false, moved: false });

  const activeReels = reels.filter((reel) => reel.active && reel.embedUrl);
  if (!activeReels.length) return null;

  function scroll(direction: -1 | 1) {
    const slider = sliderRef.current;
    if (!slider) return;
    const firstCard = slider.querySelector<HTMLElement>("[data-reel-card]");
    const step = firstCard ? firstCard.offsetWidth + 12 : slider.clientWidth * 0.7;
    slider.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <section aria-label="TikTok reels" className="bg-white px-6 py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Reels" title="Auerviamaison on TikTok" />

        <div className="relative mt-6">
          <div
            ref={sliderRef}
            className="scrollbar-hide flex cursor-grab snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden scroll-smooth pb-1 pt-1 active:cursor-grabbing sm:gap-4"
            onPointerDown={(event) => {
              const slider = sliderRef.current;
              if (!slider) return;
              dragState.current = {
                startX: event.clientX,
                scrollLeft: slider.scrollLeft,
                dragging: true,
                moved: false,
              };
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
            onPointerCancel={() => {
              dragState.current.dragging = false;
            }}
          >
            {activeReels.map((reel) => (
              <div
                key={reel.id}
                data-reel-card
                className="w-[168px] shrink-0 snap-start sm:w-[200px] md:w-[220px]"
              >
                <ReelEmbed video={reel} />
              </div>
            ))}
          </div>

          {activeReels.length > 2 ? (
            <>
              <button
                type="button"
                onClick={() => scroll(-1)}
                aria-label="Previous reels"
                className="absolute -left-1 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/95 text-black shadow-md transition hover:scale-105 hover:text-[#EA580C] sm:-left-3 sm:h-10 sm:w-10"
              >
                <ChevronLeft aria-hidden="true" className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scroll(1)}
                aria-label="Next reels"
                className="absolute -right-1 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/95 text-black shadow-md transition hover:scale-105 hover:text-[#EA580C] sm:-right-3 sm:h-10 sm:w-10"
              >
                <ChevronRight aria-hidden="true" className="h-5 w-5" />
              </button>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
