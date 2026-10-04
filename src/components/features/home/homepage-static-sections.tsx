import Link from "next/link";
import Image from "next/image";
import {
  Box,
  CheckCircle2,
  Gem,
  Globe2,
  Hand,
  PackageCheck,
  SearchCheck,
  ShieldCheck,
  Truck,
} from "@esmate/shadcn/pkgs/lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";

const trustItems = [
  { icon: Gem, text: "Authentic beauty essentials" },
  { icon: ShieldCheck, text: "Thoughtfully curated formulas" },
  { icon: Truck, text: "Nationwide delivery in Pakistan" },
  { icon: Box, text: "Gift-ready and premium packaging" },
  { icon: CheckCircle2, text: "Skin-safe, quality-approved picks" },
];

const processSteps = [
  { icon: SearchCheck, title: "Curated Edit", text: "We handpick beauty essentials designed to elevate daily routines, from skincare to statement accessories." },
  { icon: Hand, title: "Expert Selection", text: "Each product is reviewed for ingredients, quality, finish, and everyday wearability before it reaches our catalog." },
  { icon: Gem, title: "Beauty Focus", text: "Our collection balances glow-enhancing skincare, polished makeup, and elevated lifestyle pieces that feel premium." },
  { icon: PackageCheck, title: "Premium Presentation", text: "Our products are packed thoughtfully for gifting, gifting, and sleek unboxing experiences that match the brand." },
  { icon: Globe2, title: "Fast Access", text: "Shoppers across Pakistan can explore popular beauty picks with smooth order fulfillment and reliable delivery." },
  { icon: Truck, title: "Delivered with Care", text: "From checkout to doorstep, we aim for clean service, timely delivery, and a polished customer experience." },
];

export const homepageFaqItems = [
  {
    question: "What is Auerviamaison?",
    answer: <>Auerviamaison is a premium beauty and lifestyle store focused on skincare, makeup, fragrance, accessories, and modern personal styling essentials.</>,
    schemaAnswer: "Auerviamaison is a premium beauty and lifestyle store focused on skincare, makeup, fragrance, accessories, and modern personal styling essentials.",
  },
  {
    question: "Do you sell skincare and makeup?",
    answer: <>Yes. Our collection includes skincare, makeup essentials, beauty tools, fragrance, and fashion accessories selected for daily confidence and elevated routines.</>,
    schemaAnswer: "Yes. Our collection includes skincare, makeup essentials, beauty tools, fragrance, and fashion accessories selected for daily confidence and elevated routines.",
  },
  {
    question: "Do you offer watches and accessories?",
    answer: <>Yes. We carry refined timepieces, smart watches, grooming accessories, and everyday style pieces designed to blend function with modern aesthetics.</>,
    schemaAnswer: "Yes. We carry refined timepieces, smart watches, grooming accessories, and everyday style pieces designed to blend function with modern aesthetics.",
  },
  {
    question: "Do you ship across Pakistan?",
    answer: <>Yes. We provide delivery across Pakistan with secure checkout, careful packaging, and reliable support from order placement to doorstep arrival.</>,
    schemaAnswer: "Yes. We provide delivery across Pakistan with secure checkout, careful packaging, and reliable support from order placement to doorstep arrival.",
  },
  {
    question: "Are the products authentic?",
    answer: <>We curate trusted beauty and lifestyle brands with a focus on quality, safe ingredients, premium finishes, and a polished customer experience.</>,
    schemaAnswer: "We curate trusted beauty and lifestyle brands with a focus on quality, safe ingredients, premium finishes, and a polished customer experience.",
  },
  {
    question: "Can I buy beauty gifts or curated sets?",
    answer: <>Yes. You can explore limited-edition gift sets, beauty bundles, and complete looks designed for gifting, self-care, and seasonal refreshes.</>,
    schemaAnswer: "Yes. You can explore limited-edition gift sets, beauty bundles, and complete looks designed for gifting, self-care, and seasonal refreshes.",
  },
];

export function TrustStrip() {
  return (
    <section aria-label="Why shoppers choose Auerviamaison" className="border-y border-[#EA580C]/20 bg-[#fffaf5] px-3 py-4 sm:px-6 sm:py-5">
      <div className="mx-auto grid max-w-7xl grid-cols-6 gap-x-2 gap-y-4 sm:gap-x-5 lg:grid-cols-5 lg:gap-6">
        {trustItems.map(({ icon: Icon, text }) => (
          <div key={text} className="col-span-2 flex min-w-0 items-center justify-center gap-1.5 text-[10px] font-semibold leading-tight text-gray-800 [&:nth-child(n+4)]:col-span-3 sm:gap-2.5 sm:text-xs lg:col-span-1 lg:justify-start lg:gap-3 lg:text-sm lg:[&:nth-child(n+4)]:col-span-1">
            <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-[#EA580C] sm:h-5 sm:w-5" />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function OurProcessSection() {
  return (
    <section className="bg-gray-50 px-6 py-14 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="The beauty edit" title="How we curate every pick" description="At Auerviamaison, we blend clean beauty, elevated style, and everyday practicality. Every product in our curated collection is chosen to help customers feel polished, confident, and ready for modern life." />
        <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {processSteps.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className="rounded-3xl border border-[#EA580C]/20 bg-white p-7 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff1ea] text-[#EA580C]"><Icon aria-hidden="true" className="h-5 w-5" /></span>
                <span className="text-sm font-bold text-[#EA580C]">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-4 font-serif text-xl font-bold text-gray-950">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function IsThisYouSection() {
  const items = [
    "You want premium skincare and makeup that feel as good as they look.",
    "You are shopping for refined beauty gifts and personal care upgrades.",
    "You love modern accessories, watches, and everyday style essentials.",
    "You want a store that understands beauty, confidence, and lifestyle in one place.",
    "You value quality, easy shopping, and a polished product experience.",
  ];
  return (
    <section className="bg-gray-50 px-6 py-14 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-4xl">
        <p className="text-center text-sm font-bold uppercase tracking-wider text-[#EA580C]">Looking for your next beauty pick?</p>
        <ul className="mx-auto mt-8 max-w-3xl space-y-4">
          {items.map((item) => <li key={item} className="flex items-start gap-3 rounded-2xl bg-white p-4 text-gray-700 shadow-sm"><CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#EA580C]" /><span>{item}</span></li>)}
        </ul>
        <div className="mt-8 text-center">
          <p className="text-lg font-semibold text-gray-900">Then Auerviamaison is your new beauty destination.</p>
          <Link href="/products" className="mt-5 inline-flex rounded-full bg-[#EA580C] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#c2410c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EA580C]">Shop the collection</Link>
        </div>
      </div>
    </section>
  );
}

export function PinkSaltWellnessSection() {
  return (
    <section className="bg-white px-6 py-6 lg:px-8 lg:py-8">
      <div className="mx-auto grid max-w-7xl items-center gap-5 overflow-hidden rounded-3xl border border-[#e4d0a1] bg-gradient-to-br from-[#fffbef] via-[#fbf0d4] to-[#f3e2b8] p-5 shadow-sm md:grid-cols-2 md:p-6">
        <div>
          <span className="inline-flex rounded-full bg-[#fff1ea] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#EA580C]">
            Everyday confidence
          </span>
          <h2 className="mt-3 font-serif text-2xl font-extrabold text-gray-900 sm:text-3xl">
            Beauty essentials designed for real life
          </h2>
          <p className="mt-3 text-sm leading-6 text-gray-700">
            Beauty made easy, polished, and personal. Discover skincare, fragrance, and accessories chosen for everyday confidence.
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-5 text-gray-700">
            <li className="flex gap-3"><CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#EA580C]" />Skincare that supports a fresh, healthy-looking glow.</li>
            <li className="flex gap-3"><CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#EA580C]" />Makeup and fragrance choices that feel elevated and wearable.</li>
            <li className="flex gap-3"><CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#EA580C]" />Accessories and watches that complete a polished personal style.</li>
          </ul>
          <p className="mt-4 rounded-xl bg-white/80 px-3 py-2 text-sm leading-5 text-gray-600">
            Your routine. Your style. Essentials that feel like you.
          </p>
        </div>
        <div className="relative aspect-[2/1] max-h-[300px] overflow-hidden rounded-2xl">
          <Image
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80"
            alt="Beauty products and skincare essentials arranged for a premium routine"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export function HomepageFaqSection() {
  return (
    <section className="bg-white px-6 py-14 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-4xl">
        <SectionHeading eyebrow="Questions? We’ve got answers" title="Frequently Asked Questions" />
        <div className="mt-10 divide-y divide-gray-200 rounded-3xl border border-[#EA580C]/20 bg-white px-5 sm:px-8">
          {homepageFaqItems.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-gray-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EA580C]">
                {item.question}<span aria-hidden="true" className="text-xl text-[#EA580C] transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 [&_a]:font-semibold [&_a]:text-[#EA580C] [&_a]:underline">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
