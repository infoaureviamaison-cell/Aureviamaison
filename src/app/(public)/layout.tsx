import { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ChatIntegrations } from "@/components/integrations/chat-integrations";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/seo";

const businessSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Auerviamaison",
    url: SITE_URL,
    logo: `${SITE_URL}/logo/auerviamaison.png`,
    sameAs: ["https://www.instagram.com/auerviamaison", "https://www.facebook.com/auerviamaison"],
  },
  {
    "@context": "https://schema.org",
    "@type": ["OnlineStore", "LocalBusiness", "Store"],
    "@id": `${SITE_URL}/#localbusiness`,
    name: "Auerviamaison",
    url: SITE_URL,
    image: `${SITE_URL}/logo/auerviamaison.png`,
    priceRange: "PKR",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Model Town",
      addressLocality: "Lahore",
      addressRegion: "Punjab",
      addressCountry: "PK",
    },
    areaServed: { "@type": "Country", name: "Pakistan" },
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
  },
];

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="public-site flex min-h-screen flex-col">
      <a href="#main-content" className="sr-only z-[100] rounded bg-white px-4 py-2 text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to main content</a>
      <JsonLd data={businessSchemas} />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-grow bg-white pb-16 outline-none md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
      <ChatIntegrations />
    </div>
  );
}

