import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Factory, PackageCheck, SearchCheck, ShieldCheck, Sparkles } from "@esmate/shadcn/pkgs/lucide-react";

const highlights = [
  {
    icon: Factory,
    title: "Curated Beauty Essentials",
    text: "We handpick premium skincare, makeup, fragrance, and lifestyle picks so every order feels elevated and purposeful.",
  },
  {
    icon: SearchCheck,
    title: "Thoughtful Product Check",
    text: "Every item is reviewed for quality, finish, and everyday performance before it reaches our customers.",
  },
  {
    icon: PackageCheck,
    title: "Fast, Secure Delivery",
    text: "From gifting favorites to personal staples, we pack every order with care and ship it quickly across Pakistan.",
  },
  {
    icon: ShieldCheck,
    title: "Beauty You Can Trust",
    text: "We focus on authentic brands, reliable service, and products chosen to keep your daily routine simple and confident.",
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="overflow-hidden bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-stretch overflow-hidden rounded-3xl border border-[#eadfd7] bg-white lg:h-[380px] lg:grid-cols-2">
        <div className="relative flex flex-col justify-center bg-[radial-gradient(circle_at_top_left,#fff4ef_0%,#fffdfb_42%,#ffffff_100%)] px-5 py-6 sm:px-8 sm:py-7 lg:px-8 lg:py-5 xl:px-9">
          <div className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-[#f7d9cd]/45 blur-3xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e8c9b8] bg-white/80 px-3.5 py-1.5 text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#b85b43] shadow-sm">
              <Sparkles aria-hidden="true" className="h-4 w-4" />
              The Auerviamaison difference
            </span>
            <h2 className="mt-3 max-w-xl font-serif text-2xl font-black leading-[1.08] tracking-[-0.04em] text-[#241710] sm:text-3xl">
              Thoughtful beauty for your most <span className="text-[#c55461]">confident self.</span>
            </h2>
            <p className="mt-2 line-clamp-2 max-w-xl text-xs leading-5 text-[#6e625c] sm:text-sm">
              We make finding your next favorite feel effortless—with a considered edit of beauty, fragrance, and lifestyle essentials selected for real routines and everyday elegance.
            </p>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {highlights.map((item, index) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="group rounded-xl border border-[#eadfd7] bg-white/75 p-2.5 transition duration-300 hover:-translate-y-0.5 hover:border-[#dfad9a] hover:bg-white">
                    <div className="flex items-start gap-3.5">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#a94a52] transition-transform duration-300 group-hover:scale-105 ${index % 2 === 0 ? "bg-[#fbe2df]" : "bg-[#f5e8d3]"}`}>
                        <Icon aria-hidden="true" className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-serif text-[0.8rem] font-bold leading-snug text-[#241710] sm:text-sm">{item.title}</h3>
                        <p className="mt-0.5 line-clamp-1 text-[0.68rem] leading-4 text-[#746761]">{item.text}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Link href="/products" className="inline-flex items-center gap-2 rounded-full bg-[#c55461] px-5 py-2 text-sm font-bold text-white transition duration-300 hover:gap-3 hover:bg-[#aa3d4b]">
                Explore the collection
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link href="/about-us" className="text-sm font-bold text-[#5d4135] underline decoration-[#d9ad98] decoration-2 underline-offset-4 transition hover:text-[#c55461]">
                Our story
              </Link>
            </div>
          </div>
        </div>

        <div className="group relative min-h-[260px] overflow-hidden sm:min-h-[340px] lg:min-h-0">
          <Image
            src="/images/homepage/AM Beauty Vanity Showcase.png"
            alt="Woman at a vanity with Auerviamaison perfume, lipstick and skincare products"
            fill
            sizes="(max-width: 1024px) 100vw, 48vw"
            className="object-cover object-center transition-transform duration-[1400ms] ease-out group-hover:scale-[1.035]"
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#392219]/10 via-transparent to-transparent lg:from-[#392219]/20" />
          <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-white/45 bg-white/85 px-4 py-2 text-xs font-bold text-[#594036] shadow-lg backdrop-blur-md sm:right-6 sm:top-6">
            <ShieldCheck aria-hidden="true" className="h-4 w-4 text-[#c55461]" />
            Curated with care
          </div>
        </div>
      </div>
    </section>
  );
}
