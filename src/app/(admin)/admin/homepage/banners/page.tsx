"use client";

import { useEffect, useState } from "react";
import { AdminImageUpload } from "@/components/admin/image-upload";
import {
  DEFAULT_PROMO_BANNERS,
  parsePromoBanners,
  type PromoBanner,
} from "@/components/features/home/promo-banner-types";

const inputClass = "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-[#f6a45d] focus:ring-2 focus:ring-[#f6a45d]/30";

export default function PromoBannersAdminPage() {
  const [banners, setBanners] = useState<PromoBanner[]>(DEFAULT_PROMO_BANNERS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadBanners() {
      try {
        const response = await fetch("/api/admin/homepage-sections?key=promo-banners");
        const data = await response.json();
        const stored = parsePromoBanners(data.sections?.[0]?.content);
        if (stored.length) setBanners(stored);
      } finally {
        setLoading(false);
      }
    }
    void loadBanners();
  }, []);

  function updateBanner(id: string, changes: Partial<PromoBanner>) {
    setBanners((current) => current.map((banner) => banner.id === id ? { ...banner, ...changes } : banner));
  }

  function addBanner() {
    setBanners((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        eyebrow: "Limited time offer",
        title: "New promotion",
        description: "Add a short product description.",
        discountPercent: 20,
        ctaLabel: "Shop now",
        ctaHref: "/products",
        image: "/logo/auerviamaison.png",
        imageAlt: "Promotional product",
        backgroundStart: "#f31669",
        backgroundEnd: "#ff6c9d",
        isActive: true,
      },
    ]);
  }

  async function saveBanners(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/homepage-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionKey: "promo-banners",
          title: "Featured offers",
          subtitle: "Homepage promotional banners",
          content: banners,
          isActive: true,
          order: 2,
        }),
      });
      if (!response.ok) throw new Error("Unable to save banners");
      setMessage("Promotional banners saved successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save banners");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8 text-sm text-[#5A5E55]">Loading banners...</div>;

  return (
    <div className="max-w-6xl p-4 md:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0a0a0a]">Promotional Banners</h1>
          <p className="mt-1 text-sm text-[#5A5E55]">Upload transparent product artwork and manage the offer, CTA, colors, order, and visibility.</p>
        </div>
        <button type="button" onClick={addBanner} className="rounded-lg border border-[#f6a45d] px-4 py-2 text-sm font-bold text-[#d76f17] hover:bg-[#fff7ed]">+ Add banner</button>
      </div>

      {message ? <div className="mb-5 rounded-lg border border-[#C6A24A]/25 bg-[#fcf5e8] px-4 py-3 text-sm text-[#6d4a12]">{message}</div> : null}

      <form onSubmit={saveBanners} className="space-y-5">
        {banners.map((banner, index) => (
          <section key={banner.id} className="rounded-2xl border border-[#C6A24A]/20 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fff0e4] text-sm font-bold text-[#ea580c]">{index + 1}</span>
                <h2 className="font-semibold text-[#0a0a0a]">{banner.title || `Banner ${index + 1}`}</h2>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={banner.isActive} onChange={(event) => updateBanner(banner.id, { isActive: event.target.checked })} /> Active</label>
                <button type="button" onClick={() => setBanners((current) => current.filter((item) => item.id !== banner.id))} className="text-sm font-medium text-red-600 hover:underline">Remove</button>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Small heading" value={banner.eyebrow} onChange={(value) => updateBanner(banner.id, { eyebrow: value })} />
                <Field label="Banner title" value={banner.title} onChange={(value) => updateBanner(banner.id, { title: value })} />
                <Field label="Product details" value={banner.description} onChange={(value) => updateBanner(banner.id, { description: value })} />
                <Field label="Discount percent" type="number" value={String(banner.discountPercent)} onChange={(value) => updateBanner(banner.id, { discountPercent: Math.max(0, Math.min(100, Number(value) || 0)) })} />
                <Field label="CTA label" value={banner.ctaLabel} onChange={(value) => updateBanner(banner.id, { ctaLabel: value })} />
                <Field label="CTA link" value={banner.ctaHref} onChange={(value) => updateBanner(banner.id, { ctaHref: value })} />
                <Field label="Image alt text" value={banner.imageAlt} onChange={(value) => updateBanner(banner.id, { imageAlt: value })} />
                <div className="grid grid-cols-2 gap-3">
                  <ColorField label="Start color" value={banner.backgroundStart} onChange={(value) => updateBanner(banner.id, { backgroundStart: value })} />
                  <ColorField label="End color" value={banner.backgroundEnd} onChange={(value) => updateBanner(banner.id, { backgroundEnd: value })} />
                </div>
              </div>
              <AdminImageUpload label="Product image (transparent PNG/WebP recommended)" folder="auerviamaison/homepage/banners" usedIn="homepage promo banner" value={banner.image} onChange={(image) => updateBanner(banner.id, { image })} />
            </div>
          </section>
        ))}

        <div className="sticky bottom-4 flex justify-end">
          <button type="submit" disabled={saving || banners.length === 0} className="rounded-xl bg-[#f6a45d] px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-[#dc7d29] disabled:opacity-50">{saving ? "Saving..." : "Save banners"}</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label className="block text-sm font-medium text-[#0a0a0a]">{label}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} className={inputClass} /></label>;
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block text-xs font-medium text-[#0a0a0a]">{label}<div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-300 p-1.5"><input type="color" value={value} onChange={(event) => onChange(event.target.value)} className="h-8 w-9 cursor-pointer border-0 bg-transparent" /><input value={value} onChange={(event) => onChange(event.target.value)} className="min-w-0 flex-1 text-xs outline-none" /></div></label>;
}
