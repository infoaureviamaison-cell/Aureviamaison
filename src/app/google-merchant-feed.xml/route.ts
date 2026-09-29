import { prisma } from "@/lib/prisma";
import { effectiveUnitPrice } from "@/lib/product-pricing";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

function escapeXml(value: unknown) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function strings(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function record(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
}

export async function GET() {
  const shippingCost = Number(process.env.MERCHANT_SHIPPING_COST_PKR);
  const shippingConfigured = Number.isFinite(shippingCost) && shippingCost >= 0;
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE", availableForSale: true, robots: { not: { startsWith: "noindex" } } },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true, handle: true, title: true, description: true, seoDescription: true,
      featuredImage: true, images: true, inventory: true, price: true, compareAtPrice: true,
      generalDiscountPercent: true, wholesaleDiscounts: true, vendor: true, productType: true,
      sku: true, condition: true, customAttributes: true,
      variations: { where: { active: true }, orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }] },
    },
  });

  const items = products.flatMap((product) => {
    const productImages = [product.featuredImage, ...strings(product.images)].filter((item): item is string => Boolean(item));
    const units = product.variations.length ? product.variations : [{
      id: product.id, name: "", price: product.price, compareAtPrice: product.compareAtPrice,
      sku: product.sku, stock: product.inventory, images: product.images, condition: product.condition,
      customAttributes: product.customAttributes,
    }];
    return units.map((unit) => {
      const custom = { ...record(product.customAttributes), ...record(unit.customAttributes) };
      const images = [...strings(unit.images), ...productImages];
      const image = images[0];
      if (!image || unit.price <= 0) return "";
      const pricing = effectiveUnitPrice(unit.price, 1, product.generalDiscountPercent, product.wholesaleDiscounts);
      const title = unit.name ? `${product.title} - ${unit.name}` : product.title;
      const gtin = custom.gtin || custom.GTIN || custom.ean || custom.upc;
      const mpn = custom.mpn || custom.MPN || unit.sku || product.sku;
      const googleCategory = custom.google_product_category || custom.googleProductCategory;
      return `<item><g:id>${escapeXml(unit.id)}</g:id>${product.variations.length ? `<g:item_group_id>${escapeXml(product.id)}</g:item_group_id>` : ""}<title>${escapeXml(title)}</title><description>${escapeXml(product.seoDescription || product.description || title)}</description><link>${escapeXml(absoluteUrl(`/products/${product.handle}`))}</link><g:image_link>${escapeXml(absoluteUrl(image))}</g:image_link><g:availability>${unit.stock > 0 ? "in_stock" : "out_of_stock"}</g:availability><g:price>${pricing.unitPrice.toFixed(2)} PKR</g:price><g:brand>${escapeXml(product.vendor || "OrganoCity")}</g:brand>${unit.sku || product.sku ? `<g:sku>${escapeXml(unit.sku || product.sku)}</g:sku>` : ""}${mpn ? `<g:mpn>${escapeXml(mpn)}</g:mpn>` : ""}${gtin ? `<g:gtin>${escapeXml(gtin)}</g:gtin>` : "<g:identifier_exists>false</g:identifier_exists>"}${googleCategory ? `<g:google_product_category>${escapeXml(googleCategory)}</g:google_product_category>` : ""}<g:product_type>${escapeXml(product.productType || "Natural wellness products")}</g:product_type><g:condition>${escapeXml((unit.condition || product.condition || "new").toLowerCase())}</g:condition>${shippingConfigured ? `<g:shipping><g:country>PK</g:country><g:service>Standard delivery</g:service><g:price>${shippingCost.toFixed(2)} PKR</g:price></g:shipping>` : ""}</item>`;
    });
  }).filter(Boolean).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss xmlns:g="http://base.google.com/ns/1.0" version="2.0"><channel><title>Auerviamaison Product Feed</title><link>${absoluteUrl("/")}</link><description>Auerviamaison products available in Pakistan</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
}
