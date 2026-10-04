import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@esmate/shadcn/pkgs/lucide-react";
import type { PromoBanner } from "./promo-banner-types";

export function PromoBannerCard({ banner }: { banner: PromoBanner }) {
  return (
    <article
      className="group relative min-h-[132px] overflow-hidden rounded-2xl sm:min-h-[170px] lg:min-h-[190px]"
      style={{ background: `linear-gradient(115deg, ${banner.backgroundStart}, ${banner.backgroundEnd})` }}
    >
      <div className="pointer-events-none absolute -left-12 -top-16 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
      <div className="pointer-events-none absolute bottom-[-45%] right-[18%] h-40 w-40 rounded-full border-[20px] border-white/10" />

      <div className="relative z-10 flex h-full min-h-[132px] w-[62%] flex-col items-start justify-center px-3 py-4 text-white sm:min-h-[170px] sm:px-5 lg:min-h-[190px] lg:px-7">
        <p className="line-clamp-1 text-[0.45rem] font-bold uppercase tracking-[0.12em] text-white/85 sm:text-[0.6rem] lg:text-[0.68rem]">
          {banner.eyebrow}
        </p>
        <div className="mt-1 flex items-end gap-1.5 sm:mt-2 sm:gap-2">
          <span className="text-xl font-black leading-none tracking-[-0.06em] sm:text-3xl lg:text-4xl">
            {banner.discountPercent}%
          </span>
          <span className="pb-0.5 text-[0.5rem] font-extrabold uppercase leading-none tracking-[0.1em] sm:pb-1 sm:text-[0.65rem]">
            Off
          </span>
        </div>
        <h3 className="mt-1 line-clamp-1 font-serif text-[0.72rem] font-bold leading-tight sm:mt-2 sm:text-base lg:text-lg">
          {banner.title}
        </h3>
        {banner.description ? (
          <p className="mt-1 hidden line-clamp-1 text-xs text-white/85 sm:block lg:text-sm">
            {banner.description}
          </p>
        ) : null}
        <Link
          href={banner.ctaHref || "/products"}
          className="mt-2 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[0.48rem] font-extrabold text-[#bd2452] shadow-sm transition duration-300 hover:gap-2 hover:bg-[#fff4f7] sm:mt-3 sm:px-4 sm:py-2 sm:text-xs"
        >
          {banner.ctaLabel || "Shop now"}
          <ArrowRight aria-hidden="true" className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
        </Link>
      </div>

      <div className="absolute bottom-0 right-0 top-0 w-[46%]">
        <Image
          src={banner.image}
          alt={banner.imageAlt || banner.title}
          fill
          sizes="(max-width: 640px) 46vw, (max-width: 1280px) 23vw, 290px"
          className="object-contain object-bottom transition-transform duration-1000 ease-out group-hover:scale-[1.06]"
        />
      </div>
    </article>
  );
}
