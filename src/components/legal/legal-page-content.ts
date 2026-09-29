import type { LegalPageData } from "./legal-page-layout";

export const legalPageSlugs = ["terms", "privacy", "disclaimer", "refund-policy", "shipping-policy"] as const;
export type LegalPageSlug = (typeof legalPageSlugs)[number];

export const legalPagePaths: Record<LegalPageSlug, string> = {
  terms: "/terms",
  privacy: "/privacy",
  disclaimer: "/disclaimer",
  "refund-policy": "/refund-policy",
  "shipping-policy": "/shipping-policy",
};

export const legalPageDefaults: Record<LegalPageSlug, LegalPageData> = {
  terms: {
    title: "Terms & Conditions",
    description: "Terms governing Auerviamaison online beauty product orders, gifting purchases, and customer service.",
    lastUpdated: "July 25, 2026",
    sections: [
      { id: "business", title: "About Auerviamaison", body: "Auerviamaison operates from Pakistan and sells beauty, personal care, and lifestyle essentials online. These terms apply to the use of this website and to orders accepted by Auerviamaison." },
      { id: "orders", title: "Orders and quotations", body: "Website listings are invitations to place an order. An order becomes binding only after Auerviamaison confirms availability, quantity, price, payment method, and delivery arrangements." },
      { id: "products", title: "Product information", body: "Product images, descriptions, and stock availability are provided for convenience. Colors, finishes, and packaging may vary slightly between batches and screens; final product details are confirmed at purchase time." },
      { id: "pricing", title: "Prices, taxes, and payment", body: "Prices are displayed in PKR unless otherwise stated. Taxes, shipping charges, banking fees, and destination charges may be additional where applicable and are confirmed during checkout or in writing." },
      { id: "acceptable-use", title: "Website use and intellectual property", body: "You may not misuse the website, attempt unauthorized access, or reproduce Auerviamaison branding, content, or imagery without permission or a lawful basis." },
      { id: "liability", title: "Responsibility and limitations", body: "To the extent permitted by law, Auerviamaison is not responsible for indirect losses, delays outside its reasonable control, or issues caused by third-party delivery providers or circumstances beyond its control." },
      { id: "law", title: "Applicable terms and updates", body: "Consumer rights and mandatory local laws continue to apply. These terms may be updated prospectively by publishing a revised version with a new update date." },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    description: "How Auerviamaison handles customer information for online orders, account requests, and support.",
    lastUpdated: "July 25, 2026",
    sections: [
      { id: "information", title: "Information we collect", body: "We may collect contact, order, payment-status, shipping, account, inquiry, and customer-support information you provide when using the website or placing an order. Payment processors may handle payment details directly." },
      { id: "uses", title: "How information is used", body: "Information may be used to process orders, coordinate shipping, prevent fraud, provide support, maintain records, improve the website, and meet legal obligations." },
      { id: "sharing", title: "When information is shared", body: "Relevant information may be shared with payment providers, shipping partners, hosting providers, professional advisers, and authorities where required by law. Auerviamaison does not sell personal information." },
      { id: "international", title: "International processing", body: "Information may be stored or processed in secure systems outside Pakistan when necessary to complete a delivery, payment, or support request." },
      { id: "retention", title: "Retention and security", body: "Information is retained only as long as needed for the purposes described, legal compliance, dispute resolution, or customer support. Reasonable security measures are used, but no online system is perfectly secure." },
      { id: "choices", title: "Your choices and requests", body: "You may ask to access, correct, or delete your data where applicable. Some records may need to be retained for legal, accounting, or fraud-prevention reasons." },
      { id: "cookies", title: "Cookies and analytics", body: "The website may use essential storage and analytics features where configured. We may add or update cookie usage in line with our platform settings and privacy practices." },
    ],
  },
  disclaimer: {
    title: "Disclaimer",
    description: "Important limitations concerning beauty product information, product variations, and third-party material.",
    lastUpdated: "July 25, 2026",
    sections: [
      { id: "general", title: "General information", body: "Website content is provided for general product and business information only. It is not a substitute for professional advice on skincare, cosmetic use, or medical conditions." },
      { id: "health", title: "Product guidance", body: "Beauty and personal-care products should be used according to their instructions and product safety information. If you have allergies, sensitive skin, or medical concerns, consult a qualified professional before use." },
      { id: "natural-variation", title: "Colour and finish variation", body: "Product finishes, packaging, and color tones may vary slightly from screen displays or between production batches. These variations are not necessarily defects." },
      { id: "third-parties", title: "Third-party information and links", body: "External links and third-party material are provided for convenience. Auerviamaison does not control or guarantee the availability, accuracy, or security of outside content." },
      { id: "availability", title: "Accuracy and availability", body: "We aim to keep information accurate, but availability, specifications, prices, and promotions may change. Please confirm details before placing a purchase order or making a commitment." },
    ],
  },
  "refund-policy": {
    title: "Refund & Return Policy",
    description: "Refund and return guidance for eligible Auerviamaison retail and gifting purchases.",
    lastUpdated: "July 25, 2026",
    sections: [
      { id: "contact", title: "Report a problem", body: "Contact Auerviamaison promptly after delivery if an item is damaged, incorrect, incomplete, or materially different from the confirmed order. Include the order reference and clear photos of the item and packaging." },
      { id: "eligibility", title: "Return eligibility", body: "Eligibility depends on the product condition, reason for return, and the terms of the confirmed order. Products should remain unused, unopened where relevant, and in original packaging unless inspection is required to identify a fault." },
      { id: "exceptions", title: "Products requiring special handling", body: "Personal-care and beauty products, opened goods, customized items, and products affected by hygiene or safety requirements may not be returnable for change of mind where permitted by law." },
      { id: "approval", title: "Return approval and shipping", body: "Do not send any product back until return instructions are confirmed. Return transport responsibility depends on the reason for the return and applicable consumer law." },
      { id: "resolution", title: "Refunds, replacement, or credit", body: "After assessment, an eligible claim may be resolved through replacement, repair, store credit, partial refund, or refund to the original payment method, depending on the nature of the issue." },
      { id: "b2b", title: "Bulk and gifting orders", body: "Bulk orders, gifting bundles, and customized requests may follow separate terms as specified in the accepted quotation or written agreement." },
    ],
  },
  "shipping-policy": {
    title: "Shipping Policy",
    description: "Shipping guidance for Auerviamaison product delivery and order processing across Pakistan.",
    lastUpdated: "July 25, 2026",
    sections: [
      { id: "destinations", title: "Shipping destinations", body: "Auerviamaison ships within Pakistan and may coordinate limited delivery support for selected destinations. Availability depends on the product, location, carrier, customs requirements, and order size." },
      { id: "processing", title: "Order processing", body: "Processing begins after payment and order details are confirmed. Some orders may require additional handling time for packaging, gifting, or stock verification." },
      { id: "costs", title: "Shipping costs", body: "Shipping is not assumed to be free. Costs depend on destination, weight, dimensions, service level, and order requirements. Additional fees may apply for premium delivery or special handling." },
      { id: "delivery", title: "Delivery estimates and tracking", body: "Any delivery estimate is not a guarantee and may be affected by carriers, public holidays, weather, courier delays, or incomplete customer information. Tracking is provided when the selected service includes it." },
      { id: "address", title: "Address and receipt", body: "Buyers must provide a complete and accurate delivery address and contact details. Inspect packages on arrival where practical and report visible damage as soon as possible." },
      { id: "risk", title: "Risk and delivery terms", body: "Risk transfers in line with the accepted order terms and applicable law. Customers should confirm any special delivery or handling terms before placing a bulk or custom order." },
    ],
  },
};
