import Link from "next/link";
import { ChevronRight, FileText, Mail } from "@esmate/shadcn/pkgs/lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";

export const legalPages = [
  { title: "Terms & Conditions", href: "/terms" },
  { title: "Privacy Policy", href: "/privacy" },
  { title: "Disclaimer", href: "/disclaimer" },
  { title: "Refund & Return Policy", href: "/refund-policy" },
  { title: "Shipping Policy", href: "/shipping-policy" },
] as const;

export type LegalSection = {
  id: string;
  title: string;
  body: string;
};

export type LegalPageData = {
  title: string;
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export function LegalPageLayout({
  data,
  path,
}: {
  data: LegalPageData;
  path: string;
}) {
  const { title, description, lastUpdated, sections } = data;
  const schemas = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Legal Pages", path: "/terms" },
      { name: title, path },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url: absoluteUrl(path),
      isPartOf: { "@id": `${absoluteUrl("/") }#website` },
      dateModified: "2026-07-25",
    },
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <header className="border-b border-[#C6A24A]/25 bg-gradient-to-br from-[#fff7df] via-[#f4f1e8] to-[#ffedd5] px-6 py-14 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="transition hover:text-[#b57910]">Home</Link>
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
            <Link href="/terms" className="transition hover:text-[#b57910]">Legal Pages</Link>
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
            <span aria-current="page" className="font-semibold text-[#8a5b00]">{title}</span>
          </nav>
          <div className="mt-8 flex max-w-3xl items-start gap-4">
            <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#C6A24A] shadow-sm sm:inline-flex">
              <FileText aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <h1 className="font-serif text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl">{title}</h1>
              <p className="mt-4 text-base leading-7 text-gray-700 sm:text-lg">{description}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="bg-white px-6 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-sm text-gray-500">Last updated</p>
            <p className="mt-1 font-semibold text-gray-900">{lastUpdated}</p>
            {sections.length >= 4 ? (
              <nav aria-label="Table of contents" className="mt-8">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#8a5b00]">On this page</h2>
                <ol className="mt-4 space-y-3 border-l border-[#C6A24A]/30 pl-4 text-sm">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a href={`#${section.id}`} className="text-gray-600 transition hover:text-[#b57910]">{section.title}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            ) : null}
          </aside>

          <article className="min-w-0">
            <div className="space-y-10">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-28">
                  <h2 className="font-serif text-2xl font-bold text-gray-950 sm:text-3xl">{section.title}</h2>
                  <div className="mt-4 space-y-4 text-base leading-7 text-gray-700">
                    {section.body.split(/\n{2,}/).map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <section className="mt-14 rounded-3xl border border-[#C6A24A]/25 bg-[#f4f1e8] p-7 sm:p-9">
              <Mail aria-hidden="true" className="h-7 w-7 text-[#C6A24A]" />
              <h2 className="mt-4 font-serif text-2xl font-bold text-gray-950">Questions about this policy?</h2>
              <p className="mt-3 text-gray-700">Contact Auerviamaison before ordering if you need clarification for a retail, gifting, or beauty purchase.</p>
              <Link href="/contact" className="mt-5 inline-flex rounded-full bg-[#ea580c] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#c2410c]">
                Contact Auerviamaison
              </Link>
            </section>

            <nav aria-label="Other legal pages" className="mt-12 border-t border-gray-200 pt-8">
              <h2 className="text-lg font-bold text-gray-950">Other legal pages</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {legalPages.filter((page) => page.href !== path).map((page) => (
                  <Link key={page.href} href={page.href} className="rounded-full border border-[#C6A24A]/30 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-[#C6A24A] hover:text-[#8a5b00]">
                    {page.title}
                  </Link>
                ))}
              </div>
            </nav>
          </article>
        </div>
      </main>
    </>
  );
}
