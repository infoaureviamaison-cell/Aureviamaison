import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@esmate/shadcn/pkgs/lucide-react";
import type { PromoBanner } from "./promo-banner-types";

export function PromoBannerCard({ banner }: { banner: PromoBanner }) {
  return (
    <article
      className="group relative min-h-[220px] overflow-hidden rounded-2xl sm:min-h-[290px] lg:min-h-[340px]"
      style={{ background: `linear-gradient(rgba(255,255,255,0.68), rgba(255,255,255,0.68)), linear-gradient(115deg, ${banner.backgroundStart}, ${banner.backgroundEnd})` }}
    >
      <div className="pointer-events-none absolute -left-12 -top-16 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
      <div className="pointer-events-none absolute bottom-[-45%] right-[18%] h-40 w-40 rounded-full border-[20px] border-white/10" />

      <div className="relative z-10 flex h-full min-h-[220px] w-[54%] flex-col items-start justify-center px-5 py-5 text-[#35232d] sm:min-h-[290px] sm:w-[58%] sm:px-8 lg:min-h-[340px] lg:w-[62%] lg:px-12">
        <p className="line-clamp-1 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#59424e] sm:text-xs lg:text-sm">
          {banner.eyebrow}
        </p>
        <div className="mt-1 flex items-end gap-1.5 sm:mt-2 sm:gap-2">
          <span className="text-3xl font-black leading-none tracking-[-0.06em] sm:text-5xl lg:text-6xl">
            {banner.discountPercent}%
          </span>
          <span className="pb-0.5 text-[0.65rem] font-extrabold uppercase leading-none tracking-[0.12em] sm:pb-1.5 sm:text-sm">
            Off
          </span>
        </div>
        <h3 className="mt-2 line-clamp-1 font-serif text-lg font-bold leading-tight sm:mt-3 sm:text-2xl lg:text-3xl">
          {banner.title}
        </h3>
        {banner.description ? (
          <p className="mt-2 hidden line-clamp-1 text-sm text-[#59424e] sm:block lg:text-base">
            {banner.description}
          </p>
        ) : null}
        <Link
          href={banner.ctaHref || "/products"}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[0.68rem] font-extrabold text-[#bd2452] shadow-sm transition duration-300 hover:gap-2.5 hover:bg-[#fff4f7] sm:mt-5 sm:px-6 sm:py-3 sm:text-sm"
        >
          {banner.ctaLabel || "Shop now"}
          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Link>
      </div>

      <div className="absolute right-3 top-1/2 aspect-[4/3] w-[42%] -translate-y-1/2 overflow-hidden rounded-2xl border border-white/30 bg-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_20px_rgba(91,19,48,0.16)] backdrop-blur-[2px] sm:right-4 sm:w-[39%] lg:right-5 lg:w-[34%]">
        <Image
          src={banner.image}
          alt={banner.imageAlt || banner.title}
          fill
          sizes="(max-width: 640px) 42vw, (max-width: 1024px) 39vw, 34vw"
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.06]"
        />
      </div>
    </article>
  );
}
