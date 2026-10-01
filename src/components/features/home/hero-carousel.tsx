"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "@esmate/shadcn/pkgs/lucide-react";
import { HeroSlide } from "@/types/hero";

interface HeroCarouselProps {
  slides: HeroSlide[];
}

const AUTOPLAY_MS = 6000;

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentActive = active < slides.length ? active : 0;

  const goTo = useCallback(
    (index: number) => {
      if (slides.length === 0) return;

      setActive(((index % slides.length) + slides.length) % slides.length);
    },
    [slides.length],
  );

  const next = useCallback(() => {
    if (slides.length <= 1) return;

    setActive((current) => (current + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    if (slides.length <= 1) return;

    setActive((current) => (current - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const timer = window.setTimeout(next, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [active, isPaused, next, slides.length]);

  if (slides.length === 0) return null;

  return (
    <section
      aria-label="Featured collections"
      aria-roledescription="carousel"
      className="relative h-[min(560px,calc(100svh-72px))] w-full overflow-hidden bg-[#fff8f5]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      {slides.map((slide, index) => {
        const isActive = index === currentActive;
        const hasMobileImage = Boolean(slide.mobileImageUrl);

        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "z-0 opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.imageAlt}
              fill
              priority={index === 0}
              sizes="100vw"
              className={`hero-desktop-image object-contain ${
                hasMobileImage ? "has-mobile-hero-image" : ""
              }`}
            />
            {slide.mobileImageUrl && (
              <Image
                src={slide.mobileImageUrl}
                alt={slide.imageAlt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="hero-mobile-image object-contain"
              />
            )}
          </div>
        );
      })}

      <div aria-hidden="true" className="hero-copy-scrim absolute inset-0 z-1" />

      <div className="absolute inset-0 z-10">
        {slides.map((slide, index) => {
          const isActive = index === currentActive;

          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 flex items-center px-5 py-10 transition-all duration-700 ease-out sm:px-8 sm:py-12 md:px-12 lg:px-16 xl:px-20 max-md:items-end max-md:pb-20 ${
                isActive
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-5 opacity-0"
              }`}
            >
              <div className="w-full max-w-162.5 md:-translate-y-1">
                {slide.eyebrow && (
                  <div className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#34343a] sm:text-[11px]">
                    <span aria-hidden="true" className="h-px w-8 shrink-0 bg-[#c97a42] sm:w-9" />
                    <span>{slide.eyebrow}</span>
                    <span aria-hidden="true" className="h-px w-8 shrink-0 bg-[#c97a42] sm:w-9" />
                  </div>
                )}

                <h1 className="max-w-162.5 font-serif text-[2.75rem] font-semibold leading-[0.98] text-[#101014] sm:text-6xl lg:text-7xl">
                  <span>{slide.title}</span>
                  {slide.titleHighlight && (
                    <span
                      className="block bg-clip-text text-transparent"
                      style={{
                        backgroundImage: "linear-gradient(100deg, #c94560 0%, #d85852 55%, #cf812f 100%)",
                      }}
                    >
                      {slide.titleHighlight}
                    </span>
                  )}
                </h1>

                {slide.description && (
                  <p className="mt-4 max-w-127.5 text-[15px] font-normal leading-6 text-[#414047] sm:mt-4 sm:text-lg sm:leading-[1.55]">
                    {slide.description}
                  </p>
                )}

                {(slide.ctaPrimaryLabel || slide.ctaSecondaryLabel) && (
                  <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-7">
                    {slide.ctaPrimaryLabel && (
                      <Link
                        href={slide.ctaPrimaryHref || "#"}
                        tabIndex={isActive ? 0 : -1}
                        className="group inline-flex min-h-12 items-center justify-center gap-3 whitespace-nowrap rounded-full bg-[#d34c65] px-8 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#bd3f58] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d34c65]/30 sm:min-h-13 sm:min-w-52 sm:text-base"
                      >
                        {slide.ctaPrimaryLabel}
                        <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                    )}

                    {slide.ctaSecondaryLabel && (
                      <Link
                        href={slide.ctaSecondaryHref || "#"}
                        tabIndex={isActive ? 0 : -1}
                        className="inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-full border border-[#c85868]/50 bg-white/80 px-6 text-sm font-semibold text-[#a83f55] transition-colors duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d34c65]/25 sm:min-h-13 sm:px-7 sm:text-base"
                      >
                        {slide.ctaSecondaryLabel}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="group absolute left-4 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/75 text-[#a83f55] transition-colors duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d34c65]/25 sm:left-6"
          >
            <ChevronLeft className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="group absolute right-4 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/75 text-[#a83f55] transition-colors duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d34c65]/25 sm:right-6"
          >
            <ChevronRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </>
      )}

      {slides.length > 1 && (
        <div
          role="tablist"
          aria-label="Hero slides"
          className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 sm:bottom-6 sm:gap-2.5"
        >
          {slides.map((slide, index) => {
            const isActive = index === currentActive;

            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-label={`Go to slide ${index + 1}`}
                aria-selected={isActive}
                onClick={() => goTo(index)}
                className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d34c65]/25 ${
                  isActive
                    ? "w-8 bg-[#d34c65]"
                    : "w-2 bg-white/80 hover:bg-white"
                }`}
              />
            );
          })}
        </div>
      )}

      <style jsx global>{`
        .hero-copy-scrim {
          background: linear-gradient(90deg, rgba(255, 250, 248, 0.97) 0%, rgba(255, 250, 248, 0.88) 34%, rgba(255, 250, 248, 0.48) 52%, rgba(255, 250, 248, 0) 72%);
        }

        .hero-mobile-image {
          display: none;
        }

        @media (max-width: 767px) and (orientation: portrait) {
          .hero-desktop-image.has-mobile-hero-image {
            display: none;
          }

          .hero-mobile-image {
            display: block;
          }

          .hero-copy-scrim {
            background: linear-gradient(0deg, rgba(255, 250, 248, 0.98) 0%, rgba(255, 250, 248, 0.94) 35%, rgba(255, 250, 248, 0.52) 62%, rgba(255, 250, 248, 0.04) 100%);
          }
        }
      `}</style>
    </section>
  );
}
