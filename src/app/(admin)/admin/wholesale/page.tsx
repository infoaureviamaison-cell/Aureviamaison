"use client";

import { AdminImageUpload } from "@/components/admin/image-upload";
import { defaultWholesalePage, type WholesalePageContent } from "@/lib/wholesale-page";
import { Plus, Trash2 } from "@esmate/shadcn/pkgs/lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminWholesalePage() {
  const [content, setContent] = useState<WholesalePageContent>(defaultWholesalePage);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/wholesale-page").then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load wholesale page");
      setContent(data.content);
    }).catch((error) => toast.error(error instanceof Error ? error.message : "Unable to load wholesale page")).finally(() => setLoading(false));
  }, []);

  const update = <Key extends keyof WholesalePageContent>(key: Key, value: WholesalePageContent[Key]) => setContent((current) => ({ ...current, [key]: value }));
  const updateSection = (id: string, values: Partial<WholesalePageContent["sections"][number]>) => update("sections", content.sections.map((section) => section.id === id ? { ...section, ...values } : section));

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/admin/wholesale-page", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.details?.[0]?.message || "Unable to save wholesale page");
      toast.success("Wholesale page saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save wholesale page");
    } finally { setSaving(false); }
  }

  if (loading) return <div className="p-8 text-sm text-[#5A5E55]">Loading wholesale page...</div>;

  return <form onSubmit={save} className="mx-auto max-w-5xl space-y-7 p-4 md:p-8">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl font-bold">Wholesale Page</h1><p className="mt-1 text-sm text-[#5A5E55]">Manage the public wholesale hero, policy and content sections.</p></div><button type="submit" disabled={saving} className="rounded-lg bg-[#C6A24A] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{saving ? "Saving..." : "Save Page"}</button></div>

    <AdminSection title="Hero Section"><Field label="Hero Title" value={content.heroTitle} onChange={(value) => update("heroTitle", value)} /><TextArea label="Hero Description" value={content.heroDescription} onChange={(value) => update("heroDescription", value)} /><AdminImageUpload label="Hero Image (optional)" folder="organocity/wholesale/hero" usedIn="wholesale hero" value={content.heroImage} onChange={(url) => update("heroImage", url)} /></AdminSection>
    <AdminSection title="Wholesale Policy"><Field label="Policy Title" value={content.policyTitle} onChange={(value) => update("policyTitle", value)} /><TextArea label="Policy Content" rows={7} value={content.policyContent} onChange={(value) => update("policyContent", value)} /></AdminSection>

    <section className="rounded-xl border border-[#C6A24A]/20 bg-white p-5"><div className="flex items-center justify-between"><div><h2 className="text-lg font-bold">Content Sections</h2><p className="text-sm text-[#5A5E55]">Add multiple image or YouTube sections.</p></div><button type="button" onClick={() => update("sections", [...content.sections, { id: crypto.randomUUID(), title: "", description: "", image: "", youtubeUrl: "" }])} className="inline-flex items-center gap-2 rounded-lg bg-[#1a1308] px-4 py-2 text-sm font-bold text-white"><Plus className="h-4 w-4" /> Add Section</button></div>
      <div className="mt-5 space-y-5">{content.sections.map((section, index) => <div key={section.id} className="rounded-xl bg-[#fcf5e8] p-4"><div className="mb-4 flex items-center justify-between"><h3 className="font-semibold">Section {index + 1}</h3><button type="button" onClick={() => update("sections", content.sections.filter((item) => item.id !== section.id))} className="rounded-md p-2 text-red-600 hover:bg-red-50" aria-label={`Remove section ${index + 1}`}><Trash2 className="h-4 w-4" /></button></div><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-4"><Field label="Title" value={section.title} onChange={(value) => updateSection(section.id, { title: value })} /><TextArea label="Description" value={section.description} onChange={(value) => updateSection(section.id, { description: value })} /><Field label="YouTube URL (use instead of image)" type="url" value={section.youtubeUrl} onChange={(value) => updateSection(section.id, { youtubeUrl: value })} /></div><AdminImageUpload label="Section Image" folder="organocity/wholesale/sections" usedIn="wholesale content" value={section.image} onChange={(url) => updateSection(section.id, { image: url })} /></div></div>)}</div>
    </section>
    <AdminSection title="Final Call to Action"><Field label="CTA Title" value={content.finalCtaTitle} onChange={(value) => update("finalCtaTitle", value)} /><TextArea label="CTA Description" value={content.finalCtaDescription} onChange={(value) => update("finalCtaDescription", value)} /></AdminSection>
  </form>;
}

function AdminSection({ title, children }: { title: string; children: React.ReactNode }) { return <section className="space-y-4 rounded-xl border border-[#C6A24A]/20 bg-white p-5"><h2 className="text-lg font-bold">{title}</h2>{children}</section>; }
function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) { return <label className="block text-sm font-medium">{label}<input required={type !== "url"} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" /></label>; }
function TextArea({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) { return <label className="block text-sm font-medium">{label}<textarea required rows={rows} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" /></label>; }
