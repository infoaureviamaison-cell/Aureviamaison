import { calculateDiscountedUnitPrice } from "@/lib/product-discounts";

export type PricingVariant = {
  id: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  active: boolean;
  sku?: string | null;
};

export type PricingProduct = {
  id: string;
  price: number;
  compareAtPrice?: number | null;
  inventory: number;
  availableForSale: boolean;
  generalDiscountPercent?: number | null;
  wholesaleDiscounts?: unknown;
  variations?: PricingVariant[];
};

export function effectiveUnitPrice(
  basePrice: number,
  quantity: number,
  generalDiscountPercent?: number | null,
  wholesaleDiscounts?: unknown,
) {
  return calculateDiscountedUnitPrice(
    basePrice,
    quantity,
    generalDiscountPercent,
    wholesaleDiscounts,
  );
}

export function resolveProductPricing(product: PricingProduct, quantity = 1) {
  const activeVariants = (product.variations ?? []).filter((variant) => variant.active);
  const units = activeVariants.length
    ? activeVariants.map((variant) => ({
        id: variant.id,
        sku: variant.sku,
        stock: variant.stock,
        available: product.availableForSale && variant.stock > 0,
        compareAtPrice: variant.compareAtPrice,
        ...effectiveUnitPrice(variant.price, quantity, product.generalDiscountPercent, product.wholesaleDiscounts),
      }))
    : [{
        id: product.id,
        sku: null,
        stock: product.inventory,
        available: product.availableForSale && product.inventory > 0,
        compareAtPrice: product.compareAtPrice,
        ...effectiveUnitPrice(product.price, quantity, product.generalDiscountPercent, product.wholesaleDiscounts),
      }];

  const availableUnits = units.filter((unit) => unit.available);
  const pricedUnits = availableUnits.length ? availableUnits : units;
  const minimumUnitPrice = pricedUnits.length
    ? Math.min(...pricedUnits.map((unit) => unit.unitPrice))
    : effectiveUnitPrice(product.price, quantity, product.generalDiscountPercent, product.wholesaleDiscounts).unitPrice;

  return {
    units,
    minimumUnitPrice,
    totalStock: units.reduce((total, unit) => total + Math.max(0, unit.stock), 0),
    available: availableUnits.length > 0,
  };
}
