"use client";

import { AdminImageUpload } from "@/components/admin/image-upload";
import type { ProductSectionProps } from "./section-types";
import type { ProductFormValues } from "./types";

export function BasicInfoSection({
  values, setValues, parentCategories, subcategories, collectionSearch,
  setCollectionSearch, visibleCollections,
}: ProductSectionProps & {
  parentCategories: Array<{ id: string; name: string; parentId?: string | null }>;
  subcategories: Array<{ id: string; name: string; parentId?: string | null }>;
  collectionSearch: string;
  setCollectionSearch: React.Dispatch<React.SetStateAction<string>>;
  visibleCollections: Array<{ id: string; title: string }>;
  categories: Array<{ id: string; name: string; parentId?: string | null }>;
}) {
  return (
    <>
      <div className="space-y-4">
        <input value={values.title} onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder="Product Title" required />
        <input value={values.handle} onChange={(e) => setValues((v) => ({ ...v, handle: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder="Handle (auto-generated)" required />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input type="number" min={0} step="0.01" value={values.price} onChange={(e) => setValues((v) => ({ ...v, price: Number(e.target.value) }))} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder="Price" required />
          <input type="number" min={0} step="0.01" value={values.compareAtPrice ?? ""} onChange={(e) => setValues((v) => ({ ...v, compareAtPrice: e.target.value ? Number(e.target.value) : null }))} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder="Compare at Price" />
        </div>
        <div className="space-y-4 rounded-xl border border-orange-200 bg-orange-50/60 p-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Product Discounts</h3>
            <p className="mt-1 text-xs text-gray-600">The best eligible percentage is applied automatically. Discounts do not stack.</p>
          </div>
          <label className="block text-sm font-semibold text-gray-800">
            General discount (%)
            <input type="number" min={0} max={100} step="0.01" value={values.generalDiscountPercent} onChange={(e) => setValues((v) => ({ ...v, generalDiscountPercent: Math.min(100, Math.max(0, Number(e.target.value))) }))} className="mt-1.5 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-normal focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder="e.g. 10" />
          </label>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div><p className="text-sm font-semibold text-gray-800">Wholesale quantity discounts</p><p className="text-xs text-gray-500">Example: 5 items = 15%, 10 items = 20%</p></div>
              <button type="button" onClick={() => setValues((v) => ({ ...v, wholesaleDiscounts: [...v.wholesaleDiscounts, { minQuantity: 5, discountPercent: 10 }] }))} className="shrink-0 rounded-lg bg-[#f6a45d] px-3 py-2 text-xs font-bold text-white hover:bg-[#e86f0c]">Add tier</button>
            </div>
            {values.wholesaleDiscounts.map((tier, index) => (
              <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <input aria-label={`Wholesale tier ${index + 1} minimum quantity`} type="number" min={2} step={1} value={tier.minQuantity} onChange={(e) => setValues((v) => ({ ...v, wholesaleDiscounts: v.wholesaleDiscounts.map((item, itemIndex) => itemIndex === index ? { ...item, minQuantity: Math.max(2, Number(e.target.value)) } : item) }))} className="min-w-0 rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Quantity" />
                <input aria-label={`Wholesale tier ${index + 1} discount percentage`} type="number" min={0.01} max={100} step="0.01" value={tier.discountPercent} onChange={(e) => setValues((v) => ({ ...v, wholesaleDiscounts: v.wholesaleDiscounts.map((item, itemIndex) => itemIndex === index ? { ...item, discountPercent: Math.min(100, Math.max(0.01, Number(e.target.value))) } : item) }))} className="min-w-0 rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Discount %" />
                <button type="button" aria-label={`Remove wholesale tier ${index + 1}`} onClick={() => setValues((v) => ({ ...v, wholesaleDiscounts: v.wholesaleDiscounts.filter((_, itemIndex) => itemIndex !== index) }))} className="rounded-lg border border-red-200 px-3 text-sm font-bold text-red-600 hover:bg-red-50">Remove</button>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input type="number" min={0} step="1" value={values.inventory} onChange={(e) => setValues((v) => ({ ...v, inventory: Number(e.target.value) }))} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder="Inventory Quantity" />
          <input value={values.sku ?? ""} onChange={(e) => setValues((v) => ({ ...v, sku: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder="SKU" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <select value={values.categoryId} onChange={(e) => setValues((v) => ({ ...v, categoryId: e.target.value, subcategoryId: "" }))} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50">
            <option value="">Select Category</option>
            {parentCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={values.subcategoryId} onChange={(e) => setValues((v) => ({ ...v, subcategoryId: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50">
            <option value="">Select Subcategory</option>
            {subcategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <label className="block text-sm font-semibold text-gray-800">
          Short Description
          <textarea value={values.description ?? ""} onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))} rows={4} className="mt-1.5 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm font-normal transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder="Write a short paragraph shown beside the product name" />
        </label>
        <label className="block text-sm font-semibold text-gray-800">
          Detailed Description (HTML)
          <textarea value={values.descriptionHtml ?? ""} onChange={(e) => setValues((v) => ({ ...v, descriptionHtml: e.target.value }))} rows={6} className="mt-1.5 w-full resize-y rounded-lg border border-gray-300 px-4 py-3 font-mono text-sm font-normal transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder="Add the detailed product description using HTML" />
        </label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input value={values.productType ?? ""} onChange={(e) => setValues((v) => ({ ...v, productType: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder="Product Type" />
          <input value={values.vendor ?? ""} onChange={(e) => setValues((v) => ({ ...v, vendor: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder="Vendor" />
        </div>
        <label className="block text-sm font-semibold text-gray-800">Product display order<input type="number" min={1} step={1} value={values.displayOrder} onChange={(e) => setValues((v) => ({ ...v, displayOrder: Math.max(1, Number(e.target.value)) }))} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder="1 appears first, 2 appears second" /><span className="mt-1 block text-xs font-normal text-gray-500">Lower numbers appear first. Products with the same number use newest first.</span></label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <select value={values.status} onChange={(e) => setValues((v) => ({ ...v, status: e.target.value as ProductFormValues["status"] }))} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50">
            <option value="ACTIVE">Active</option><option value="DRAFT">Draft</option><option value="ARCHIVED">Archived</option>
          </select>
          <label className="flex items-center gap-3 rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-800"><input type="checkbox" checked={values.availableForSale} onChange={(e) => setValues((v) => ({ ...v, availableForSale: e.target.checked }))} /> Available for sale</label>
        </div>
      </div>

      <div className="space-y-4">
        <AdminImageUpload label="Featured Image" folder="auerviamaison/products" usedIn="product" value={values.featuredImage} onChange={(url) => setValues((v) => ({ ...v, featuredImage: url }))} />
        <AdminImageUpload label="Product Images" folder="auerviamaison/products" usedIn="product" mode="multiple" values={values.images} onChangeMany={(urls) => setValues((v) => ({ ...v, images: urls }))} />
        <div className="rounded-xl border border-[#C6A24A]/20 bg-[#fcf5e8]/60 p-4">
          <p className="mb-3 text-sm font-semibold text-[#0a0a0a]">Collections</p>
          <input value={collectionSearch} onChange={(e) => setCollectionSearch(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder="Search collections..." />
          <div className="mt-3 max-h-40 space-y-2 overflow-auto">
            {visibleCollections.map((collection) => (
              <label key={collection.id} className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-white/50">
                <input type="checkbox" checked={values.collectionIds.includes(collection.id)} onChange={(e) => setValues((v) => ({ ...v, collectionIds: e.target.checked ? [...v.collectionIds, collection.id] : v.collectionIds.filter((id) => id !== collection.id) }))} className="rounded border-gray-300 text-[#f6a45d] focus:ring-[#f6a45d]" />
                <span className="text-sm text-[#0a0a0a]">{collection.title}</span>
              </label>
            ))}
          </div>
        </div>
        <input value={values.tags.join(", ")} onChange={(e) => setValues((v) => ({ ...v, tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder="Tags (comma-separated)" />
        <input value={values.seoTitle ?? ""} onChange={(e) => setValues((v) => ({ ...v, seoTitle: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder="SEO Title" />
        <textarea value={values.seoDescription ?? ""} onChange={(e) => setValues((v) => ({ ...v, seoDescription: e.target.value }))} rows={3} className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/50" placeholder="SEO Description" />
        <input value={values.focusKeyword ?? ""} onChange={(e) => setValues((v) => ({ ...v, focusKeyword: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm" placeholder="Focus keyword" />
        <input value={values.canonicalUrl ?? ""} onChange={(e) => setValues((v) => ({ ...v, canonicalUrl: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm" placeholder="Canonical URL" />
        <input value={values.openGraphImage ?? ""} onChange={(e) => setValues((v) => ({ ...v, openGraphImage: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm" placeholder="Open Graph image URL" />
        <input value={values.imageAlt ?? ""} onChange={(e) => setValues((v) => ({ ...v, imageAlt: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm" placeholder="Featured image alt text" />
        <select value={values.robots ?? "index,follow"} onChange={(e) => setValues((v) => ({ ...v, robots: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"><option value="index,follow">Index, follow</option><option value="noindex,follow">Noindex, follow</option><option value="noindex,nofollow">Noindex, nofollow</option></select>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#C6A24A]/20 bg-[#fcf5e8]/60 p-4 transition-colors hover:bg-[#fcf5e8]">
          <input type="checkbox" checked={values.isFeatured} onChange={(e) => setValues((v) => ({ ...v, isFeatured: e.target.checked }))} className="h-5 w-5 rounded border-gray-300 text-[#f6a45d] focus:ring-[#f6a45d]" />
          <div><p className="text-sm font-medium text-[#0a0a0a]">Mark as Featured Product</p><p className="text-xs text-[#5A5E55]">Featured products appear on the homepage</p></div>
        </label>
      </div>
    </>
  );
}
