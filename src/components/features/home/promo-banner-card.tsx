import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@esmate/shadcn/pkgs/lucide-react";
import type { PromoBanner } from "./promo-banner-types";

export function PromoBannerCard({ banner }: { banner: PromoBanner }) {
  return (
    <article
      className="group relative grid h-[160px] grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] items-center gap-2 overflow-hidden rounded-2xl p-2.5 min-[400px]:h-[175px] min-[400px]:gap-3 min-[400px]:p-3 sm:h-auto sm:min-h-[250px] sm:gap-5 sm:p-4 lg:min-h-[280px] lg:gap-6 lg:px-6"
      style={{ background: `linear-gradient(rgba(255,255,255,0.68), rgba(255,255,255,0.68)), linear-gradient(115deg, ${banner.backgroundStart}, ${banner.backgroundEnd})` }}
    >
      <div className="pointer-events-none absolute -left-12 -top-16 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
      <div className="pointer-events-none absolute bottom-[-45%] right-[18%] h-40 w-40 rounded-full border-[20px] border-white/10" />

      <div className="relative z-10 flex min-w-0 flex-col items-start justify-center py-2 text-[#35232d]">
        <p className="line-clamp-1 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#59424e] sm:text-xs lg:text-sm">
          {banner.eyebrow}
        </p>
        <div className="mt-1 flex items-end gap-1.5 sm:mt-2 sm:gap-2">
          <span className="text-2xl font-black leading-none tracking-[-0.06em] min-[400px]:text-3xl sm:text-5xl lg:text-6xl">
            {banner.discountPercent}%
          </span>
          <span className="pb-0.5 text-[0.65rem] font-extrabold uppercase leading-none tracking-[0.12em] sm:pb-1.5 sm:text-sm">
            Off
          </span>
        </div>
        <h3 className="mt-1.5 line-clamp-1 max-w-full font-serif text-base font-bold leading-tight min-[400px]:text-lg sm:mt-2 sm:text-2xl lg:text-3xl">
          {banner.title}
        </h3>
        {banner.description ? (
          <p className="mt-1.5 hidden max-w-full truncate text-sm text-[#59424e] sm:block lg:text-base">
            {banner.description}
          </p>
        ) : null}
        <Link
          href={banner.ctaHref || "/products"}
          className="mt-2 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[0.62rem] font-extrabold text-[#bd2452] shadow-sm transition duration-300 hover:gap-2.5 hover:bg-[#fff4f7] min-[400px]:mt-3 min-[400px]:px-4 min-[400px]:py-2 min-[400px]:text-[0.68rem] sm:px-6 sm:py-2.5 sm:text-sm"
        >
          {banner.ctaLabel || "Shop now"}
          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Link>
      </div>

      <div className="relative h-[118px] w-full overflow-hidden rounded-xl border border-white/30 bg-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_20px_rgba(91,19,48,0.16)] backdrop-blur-[2px] min-[400px]:h-[132px] sm:h-auto sm:aspect-[2/1] sm:rounded-2xl lg:aspect-[2.2/1]">
        <Image
          src={banner.image}
          alt={banner.imageAlt || banner.title}
          fill
          sizes="(max-width: 1280px) 44vw, 550px"
          className="object-contain transition-transform duration-1000 ease-out group-hover:scale-[1.04] sm:object-cover"
        />
      </div>
    </article>
  );
}
