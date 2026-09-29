import { getProduct } from "@/lib/storefront";
import { invariant } from "@esmate/utils";
import { prisma } from "@/lib/prisma";

export async function getProductSingle(handle: string) {
  const product = await getProduct(handle);
  invariant(product, "product is not available");

  // Fetch extra product details from Prisma.
  const customData = await prisma.product.findUnique({
    where: { handle },
    select: {
      details: true,
      packagingSizes: true,
      netWeight: true,
      origin: true,
      shelfLife: true,
      specifications: true,
      faqs: true,
      wholesaleQuoteEnabled: true,
      sku: true,
    },
  });

  const details = Array.isArray(customData?.details) ? customData.details.filter((item): item is { id: string; title: string; description?: string; image?: string; videoUrl?: string } => item !== null && typeof item === "object" && !Array.isArray(item) && typeof item.id === "string") : [];
  const packagingSizes = Array.isArray(customData?.packagingSizes) ? customData.packagingSizes.filter((item): item is string => typeof item === "string" && Boolean(item.trim())) : [];
  const specifications = customData?.specifications && typeof customData.specifications === "object" && !Array.isArray(customData.specifications)
    ? Object.fromEntries(Object.entries(customData.specifications).filter((entry): entry is [string, string] => Boolean(entry[0].trim()) && typeof entry[1] === "string" && Boolean(entry[1].trim())))
    : {};
  const faqs = Array.isArray(customData?.faqs) ? customData.faqs.filter((item): item is { id: string; question: string; answer: string } => item !== null && typeof item === "object" && !Array.isArray(item) && typeof item.id === "string" && typeof item.question === "string" && Boolean(item.question.trim()) && typeof item.answer === "string" && Boolean(item.answer.trim())) : [];

  return {
    ...product,
    details,
    packagingSizes,
    netWeight: customData?.netWeight || null,
    origin: customData?.origin || null,
    shelfLife: customData?.shelfLife || null,
    specifications,
    faqs,
    wholesaleQuoteEnabled: customData?.wholesaleQuoteEnabled || false,
    sku: customData?.sku || null,
  };
}

