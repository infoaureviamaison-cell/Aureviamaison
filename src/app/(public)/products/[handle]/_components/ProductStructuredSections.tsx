"use client";

import Link from "next/link";
import {
  ChevronDown,
  MessageCircle,
  PackageCheck,
} from "@esmate/shadcn/pkgs/lucide-react";

export function ProductInformationGrid({
  packagingSizes,
  netWeight,
  origin,
  shelfLife,
  selectedPackagingSize,
  onSelectPackagingSize,
}: {
  packagingSizes: string[];
  netWeight?: string | null;
  origin?: string | null;
  shelfLife?: string | null;
  selectedPackagingSize?: string;
  onSelectPackagingSize: (size: string) => void;
}) {
  const information = [
    ["Net weight", netWeight],
    ["Origin", origin],
    ["Shelf life", shelfLife],
  ].filter((item): item is [string, string] => Boolean(item[1]?.trim()));

  if (!packagingSizes.length && !information.length) return null;

  return (
    <section className="rounded-2xl border border-[#C6A24A]/25 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
        At a glance
      </p>
      <h2 className="mt-2 font-serif text-2xl font-extrabold text-gray-950 sm:text-3xl">
        Structured Product Information
      </h2>
      {information.length ? (
        <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {information.map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-orange-100 bg-[#fcf5e8]/55 p-4"
            >
              <dt className="text-xs font-bold uppercase tracking-wider text-[#8a5b00]">
                {label}
              </dt>
              <dd className="mt-1.5 text-sm font-semibold text-gray-900">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
      {packagingSizes.length ? (
        <div className="mt-5">
          <h3 className="text-sm font-bold text-gray-900">
            Available packaging sizes
          </h3>
          <div
            className="mt-2 flex flex-wrap gap-2"
            role="group"
            aria-label="Available packaging sizes"
          >
            {packagingSizes.map((size) => (
              <button
                type="button"
                key={size}
                aria-pressed={selectedPackagingSize === size}
                onClick={() => onSelectPackagingSize(size)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${selectedPackagingSize === size ? "border-[#b57910] bg-[#C6A24A]/20 text-[#704600]" : "border-[#C6A24A]/25 bg-white text-gray-700 hover:border-[#C6A24A]"}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function ProductSpecifications({
  specifications,
}: {
  specifications: Record<string, string>;
}) {
  const rows = Object.entries(specifications).filter(
    ([label, value]) => label.trim() && value.trim(),
  );
  if (!rows.length) return null;

  return (
    <section className="rounded-2xl border border-[#C6A24A]/25 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
        Product data
      </p>
      <h2 className="mt-2 font-serif text-2xl font-extrabold text-gray-950 sm:text-3xl">
        Specifications
      </h2>
      <dl className="mt-5 overflow-hidden rounded-xl border border-gray-200">
        {rows.map(([label, value], index) => (
          <div
            key={label}
            className={`grid gap-1 px-4 py-3 sm:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] sm:gap-5 ${index % 2 ? "bg-[#fcf5e8]/55" : "bg-white"}`}
          >
            <dt className="text-sm font-semibold text-gray-900">{label}</dt>
            <dd className="text-sm text-gray-700">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ProductFaqs({
  faqs,
  embedded = false,
}: {
  faqs: Array<{ id: string; question: string; answer: string }>;
  embedded?: boolean;
}) {
  if (!faqs.length) return null;

  return (
    <section
      className={
        embedded
          ? "min-w-0"
          : "rounded-2xl border border-[#C6A24A]/25 bg-white p-5 shadow-sm sm:p-6"
      }
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
        Helpful answers
      </p>
      <h2 className="mt-2 font-serif text-2xl font-extrabold text-gray-950 sm:text-3xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-5 space-y-3">
        {faqs.map((faq) => (
          <details
            key={faq.id}
            className="group rounded-xl border border-[#C6A24A]/20 bg-[#fcf5e8]/35 open:bg-white"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-sm font-semibold text-gray-900 marker:hidden">
              {faq.question}
              <ChevronDown
                className="h-4 w-4 shrink-0 text-[#b57910] transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <p className="border-t border-[#C6A24A]/15 px-4 py-4 text-sm leading-7 text-gray-700">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function WholesaleQuoteSection({
  productName,
  productId,
  sku,
  selectedOption,
  productUrl,
  whatsappNumber,
  discountTiers,
  embedded = false,
}: {
  productName: string;
  productId: string;
  sku?: string | null;
  selectedOption?: string;
  productUrl: string;
  whatsappNumber: string;
  discountTiers?: Array<{ minQuantity: number; discountPercent: number }>;
  embedded?: boolean;
}) {
  const message = [
    `Assalamualaikum, I would like to request wholesale pricing for ${productName}.`,
    `Product ID: ${productId}`,
    sku ? `SKU: ${sku}` : "",
    selectedOption ? `Selected option: ${selectedOption}` : "",
    productUrl ? `Product URL: ${productUrl}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <section
      className={`overflow-hidden bg-[linear-gradient(135deg,#1a1308,#39280e)] p-5 text-white sm:p-6 ${embedded ? "h-full rounded-xl" : "rounded-2xl border border-[#C6A24A]/35 shadow-lg sm:p-8"}`}
    >
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#C6A24A]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#f6d985]">
            <PackageCheck className="h-4 w-4" /> Bulk &amp; business supply
          </span>
          <h2 className="mt-4 font-serif text-2xl font-extrabold sm:text-3xl">
            Request a Wholesale Quote
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
            Tell us your required quantity and delivery location. Our team will
            respond with availability, packaging options, and wholesale pricing.
          </p>
          {discountTiers?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {discountTiers.map((tier) => (
                <span
                  key={tier.minQuantity}
                  className="rounded-full border border-[#f6d985]/30 bg-[#C6A24A]/15 px-3 py-1.5 text-xs font-bold text-[#f6d985]"
                >
                  {tier.discountPercent}% off on {tier.minQuantity}+ items
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
          <Link
            href="/wholesale"
            className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-bold text-[#1a1308] hover:bg-[#fcf5e8]"
          >
            View Wholesale Program
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#f6a45d] px-5 py-3 text-sm font-bold text-[#1a1308] hover:bg-[#ffb66f]"
          >
            <MessageCircle className="h-4 w-4" /> Request on WhatsApp
          </a>
          <Link
            href={`/contact?subject=${encodeURIComponent(`Wholesale quote: ${productName}`)}`}
            className="inline-flex items-center justify-center rounded-lg border border-white/25 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Use Contact Form
          </Link>
        </div>
      </div>
    </section>
  );
}
