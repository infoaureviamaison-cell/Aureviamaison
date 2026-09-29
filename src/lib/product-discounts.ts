export type WholesaleDiscountTier = {
  minQuantity: number;
  discountPercent: number;
};

export function normalizeWholesaleDiscounts(value: unknown): WholesaleDiscountTier[] {
  if (!Array.isArray(value)) return [];

  const tiers = value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const candidate = item as Record<string, unknown>;
      const minQuantity = Math.floor(Number(candidate.minQuantity));
      const discountPercent = Number(candidate.discountPercent);
      if (!Number.isFinite(minQuantity) || minQuantity < 2) return null;
      if (!Number.isFinite(discountPercent) || discountPercent <= 0 || discountPercent > 100) return null;
      return { minQuantity, discountPercent };
    })
    .filter((tier): tier is WholesaleDiscountTier => tier !== null)
    .sort((a, b) => a.minQuantity - b.minQuantity);

  return Array.from(new Map(tiers.map((tier) => [tier.minQuantity, tier])).values());
}

export function getApplicableDiscountPercent(
  quantity: number,
  generalDiscountPercent: number | null | undefined,
  wholesaleDiscounts: unknown,
) {
  const general = Math.min(100, Math.max(0, Number(generalDiscountPercent) || 0));
  const eligibleWholesale = normalizeWholesaleDiscounts(wholesaleDiscounts)
    .filter((tier) => quantity >= tier.minQuantity)
    .reduce((highest, tier) => Math.max(highest, tier.discountPercent), 0);

  return Math.max(general, eligibleWholesale);
}

export function calculateDiscountedUnitPrice(
  basePrice: number,
  quantity: number,
  generalDiscountPercent: number | null | undefined,
  wholesaleDiscounts: unknown,
) {
  const discountPercent = getApplicableDiscountPercent(
    quantity,
    generalDiscountPercent,
    wholesaleDiscounts,
  );
  const unitPrice = Math.round(basePrice * (1 - discountPercent / 100) * 100) / 100;
  return { basePrice, unitPrice, discountPercent };
}
