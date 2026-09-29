import ContactClient from "./contact-client";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Contact Auerviamaison",
  description: "Contact Auerviamaison for beauty, skincare, makeup, fragrance, accessories, and delivery support across Pakistan.",
  path: "/contact",
  keywords: ["Auerviamaison contact", "beauty store Pakistan", "skincare Pakistan", "makeup support Pakistan"],
});

export default function ContactPage() {
  return <ContactClient />;
}

