export type ProductStatus = "ACTIVE" | "DRAFT" | "ARCHIVED";

export type CategoryItem = { id: string; name: string; parentId?: string | null };
export type CollectionItem = { id: string; title: string };

export type ProductDetail = {
  id: string;
  title: string;
  description: string;
  image?: string;
  videoUrl?: string;
};

export type ProductFaq = {
  id: string;
  question: string;
  answer: string;
};

export type ProductAttributes = {
  color?: string;
  size?: string;
  storage?: string;
  ram?: string;
  processor?: string;
  condition?: string;
  specifications: Record<string, string>;
  customAttributes: Record<string, string>;
};

export type ProductVariantFormValue = ProductAttributes & {
  id: string;
  name: string;
  description?: string;
  price: number;
  compareAtPrice?: number | null;
  sku?: string;
  stock: number;
  images: string[];
  active: boolean;
  isDefault: boolean;
};

export type ProductFormValues = ProductAttributes & {
  title: string;
  handle: string;
  description?: string;
  descriptionHtml?: string;
  price: number;
  compareAtPrice?: number | null;
  generalDiscountPercent: number;
  wholesaleDiscounts: Array<{ minQuantity: number; discountPercent: number }>;
  sku?: string;
  inventory: number;
  availableForSale: boolean;
  status: ProductStatus;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  robots?: string;
  openGraphImage?: string;
  imageAlt?: string;
  focusKeyword?: string;
  images: string[];
  featuredImage?: string;
  productType?: string;
  categoryId?: string;
  subcategoryId?: string;
  vendor?: string;
  tags: string[];
  collectionIds: string[];
  isFeatured: boolean;
  displayOrder: number;
  details: ProductDetail[];
  packagingSizes: string[];
  netWeight?: string;
  origin?: string;
  shelfLife?: string;
  faqs: ProductFaq[];
  wholesaleQuoteEnabled: boolean;
  variants: ProductVariantFormValue[];
};
