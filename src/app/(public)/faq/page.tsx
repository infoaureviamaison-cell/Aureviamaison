import { FaqPageContent } from "./_components/faq-page-content";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Product Buying FAQ Pakistan",
  description: "Answers about buying beauty, personal care, fragrance, and lifestyle products in Pakistan from Auerviamaison.",
  path: "/faq",
  keywords: ["Product FAQ Pakistan", "Buy Himalayan Pink Salt Online Pakistan", "Product warranty Pakistan"],
});

const faqItems = [
  ["What types of products do you sell?", "We stock Himalayan Shilajit, herbal products, salt lamps, and premium accessories from trusted natural product sources in Pakistan."],
  ["Are your products checked before sale?", "Yes. Products are checked for packaging integrity, labeling, presentation and the quality information supplied by our sourcing team before listing."],
  ["Do you offer warranty support?", "We provide warranty-backed support for eligible products and help with after-sales questions related to setup, repairs, and replacement concerns."],
  ["Do you deliver across Pakistan?", "Yes. We ship to customers across Pakistan and also assist with pickup and delivery coordination where available."],
  ["What kinds of products do you sell?", "Our range includes Himalayan salt products, salt lamps, Shilajit, herbal products and other natural wellness items."],
];

export default function FAQPage() {
  return (
    <>
      <JsonLd data={[
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }]),
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map(([question, answer]) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: { "@type": "Answer", text: answer },
          })),
        },
      ]} />
      <FaqPageContent />
    </>
  );
}

