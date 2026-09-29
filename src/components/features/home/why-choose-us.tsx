import { Factory, PackageCheck, SearchCheck, ShieldCheck } from "@esmate/shadcn/pkgs/lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";

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
    <section className="bg-white px-6 py-10 lg:px-4 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="Why Choose Auerviamaison"
          description="Beauty essentials chosen for quality, confidence, and everyday rituals from morning to evening."
        />
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-3xl border border-[#C6A24A]/20 bg-white p-8 shadow-lg transition-all hover:border-[#f6a45d]">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#ffedd5] text-[#ea580c]">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-serif text-xl font-bold text-gray-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{item.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
