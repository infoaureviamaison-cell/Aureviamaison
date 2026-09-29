import { z } from "zod";

export const WHOLESALE_PAGE_KEY = "wholesale_page";

const contentSectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1).max(180),
  description: z.string().trim().min(1).max(3000),
  image: z.union([z.literal(""), z.string().url()]).default(""),
  youtubeUrl: z.union([z.literal(""), z.string().url()]).default(""),
}).refine((section) => section.image || section.youtubeUrl, {
  message: "Each section needs an image or YouTube URL",
});

export const wholesalePageSchema = z.object({
  heroTitle: z.string().trim().min(1).max(180),
  heroDescription: z.string().trim().min(1).max(1200),
  heroImage: z.union([z.literal(""), z.string().url()]).default(""),
  policyTitle: z.string().trim().min(1).max(180),
  policyContent: z.string().trim().min(1).max(6000),
  finalCtaTitle: z.string().trim().min(1).max(180),
  finalCtaDescription: z.string().trim().min(1).max(1200),
  sections: z.array(contentSectionSchema).max(30),
});

export type WholesalePageContent = z.infer<typeof wholesalePageSchema>;

export const defaultWholesalePage: WholesalePageContent = {
  heroTitle: "Wholesale With Auerviamaison",
  heroDescription: "Reliable bulk supply of beauty, personal care, and lifestyle essentials for retailers, distributors, and institutions.",
  heroImage: "",
  policyTitle: "Our Wholesale Policy",
  policyContent: "Wholesale pricing depends on product, quantity, packaging and delivery location. Minimum quantities are shown where available. Quotes remain subject to stock confirmation, payment terms and delivery arrangements. Please contact our team with your business details and required quantities for a confirmed offer.",
  finalCtaTitle: "Ready to discuss your wholesale order?",
  finalCtaDescription: "Share the products, quantities and delivery location you need. Our wholesale team will prepare the next steps.",
  sections: [],
};

export function parseWholesalePage(value: unknown): WholesalePageContent {
  const parsed = wholesalePageSchema.safeParse(value);
  return parsed.success ? parsed.data : defaultWholesalePage;
}

export function getYouTubeEmbedUrl(value: string) {
  if (!value) return null;
  try {
    const url = new URL(value);
    let id = url.hostname === "youtu.be" ? url.pathname.split("/").filter(Boolean)[0] : url.searchParams.get("v");
    const parts = url.pathname.split("/").filter(Boolean);
    if (url.hostname.includes("youtube.com") && ["embed", "shorts", "live"].includes(parts[0])) id = parts[1];
    return id && /^[A-Za-z0-9_-]{6,20}$/.test(id) ? `https://www.youtube.com/embed/${id}` : null;
  } catch {
    return null;
  }
}
