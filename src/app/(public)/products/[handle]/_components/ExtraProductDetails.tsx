"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Maximize2, X } from "@esmate/shadcn/pkgs/lucide-react";

type ExtraProductDetail = {
  id: string;
  title: string;
  description?: string;
  image?: string;
  videoUrl?: string;
};

function getYouTubeId(value?: string) {
  if (!value) return null;

  try {
    const url = new URL(value.trim());
    let videoId: string | null = null;
    if (url.hostname === "youtu.be") videoId = url.pathname.split("/").filter(Boolean)[0] || null;
    if (url.hostname.endsWith("youtube.com")) {
      if (url.pathname === "/watch") videoId = url.searchParams.get("v");
      const parts = url.pathname.split("/").filter(Boolean);
      if (["embed", "shorts", "live"].includes(parts[0])) videoId = parts[1] || null;
    }
    return videoId && /^[A-Za-z0-9_-]{6,20}$/.test(videoId) ? videoId : null;
  } catch {
    return null;
  }
}

function AutoplayYouTubeVideo({ videoId, title }: { videoId: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldPlay, setShouldPlay] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || shouldPlay) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldPlay(true);
          observer.disconnect();
        }
      },
      { threshold: 0.45 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [shouldPlay]);

  return (
    <div ref={containerRef} className="relative aspect-video min-h-[220px] overflow-hidden bg-black sm:min-h-[280px]">
      {shouldPlay ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&rel=0`}
          title={title || "Product video"}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <Image
          src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
          alt={title || "Product video"}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      )}
    </div>
  );
}

export function ExtraProductDetails({ details }: { details: ExtraProductDetail[] }) {
  const [fullImage, setFullImage] = useState<{ url: string; alt: string } | null>(null);
  const visibleDetails = details.filter((detail) => detail.title?.trim() || detail.description?.trim() || detail.image?.trim() || getYouTubeId(detail.videoUrl));

  useEffect(() => {
    if (!fullImage) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFullImage(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [fullImage]);

  if (!visibleDetails.length) {
    return null;
  }

  return (
    <>
    <section className="overflow-hidden rounded-2xl border border-orange-200/80 bg-[linear-gradient(135deg,rgba(255,247,237,0.96),rgba(255,255,255,0.9))] p-4 shadow-sm sm:p-6">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-700">Product Highlights</p>
        <h2 className="mt-2 font-serif text-3xl font-extrabold leading-tight text-gray-950 sm:text-4xl">
          Extra Product Details
        </h2>
      </div>

      <div className="mt-6 space-y-4">
        {visibleDetails.map((detail, index) => {
          const mediaOnRight = index % 2 === 0;
          const videoId = getYouTubeId(detail.videoUrl);
          const hasMedia = Boolean(videoId || detail.image);

          return (
            <article
              key={detail.id}
              className="grid overflow-hidden rounded-2xl bg-white/80 shadow-[0_14px_36px_rgba(26,19,8,0.07)] ring-1 ring-orange-100/90 lg:grid-cols-2"
            >
              {videoId ? (
                <div className={mediaOnRight ? "lg:order-2" : "lg:order-1"}>
                  <AutoplayYouTubeVideo videoId={videoId} title={detail.title || "Product video"} />
                </div>
              ) : detail.image ? (
                <div className={`relative min-h-[220px] bg-orange-50 sm:min-h-[280px] ${mediaOnRight ? "lg:order-2" : "lg:order-1"}`}>
                  <Image
                    src={detail.image}
                    alt={detail.title || "Product detail"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <button
                    type="button"
                    onClick={() => setFullImage({ url: detail.image!, alt: detail.title || "Product detail" })}
                    className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-2 rounded-full bg-black/75 px-3 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-sm transition hover:bg-black focus:outline-none focus:ring-2 focus:ring-orange-400"
                    aria-label={`View full image for ${detail.title || "product detail"}`}
                  >
                    <Maximize2 className="h-4 w-4" />
                    View full image
                  </button>
                </div>
              ) : null}
              <div className={`flex flex-col justify-center p-5 sm:p-7 lg:p-8 ${!hasMedia ? "lg:col-span-2" : mediaOnRight ? "lg:order-1" : "lg:order-2"}`}>
                <span className="mb-3 inline-flex w-fit rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
                  Detail {index + 1}
                </span>
                {detail.title?.trim() ? <h3 className="font-serif text-2xl font-extrabold leading-tight text-gray-950 sm:text-3xl">{detail.title}</h3> : null}
                {detail.description ? (
                  <div className="mt-4 whitespace-pre-line text-sm font-medium leading-7 text-gray-700 sm:text-base">
                    {detail.description}
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
    {fullImage ? (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-3 backdrop-blur-sm sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-label="Full product detail image"
        onClick={() => setFullImage(null)}
      >
        <button
          type="button"
          onClick={() => setFullImage(null)}
          className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-950 shadow-lg transition hover:bg-orange-50"
          aria-label="Close full image"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="relative h-full w-full" onClick={(event) => event.stopPropagation()}>
          <Image src={fullImage.url} alt={fullImage.alt} fill sizes="100vw" className="rounded-xl object-contain shadow-2xl" />
        </div>
      </div>
    ) : null}
    </>
  );
}
