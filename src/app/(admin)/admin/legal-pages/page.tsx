"use client";

import { useEffect, useState } from "react";
import {
  legalPageDefaults,
  legalPageSlugs,
  type LegalPageSlug,
} from "@/components/legal/legal-page-content";
import type { LegalPageData } from "@/components/legal/legal-page-layout";

type LegalPagesState = Record<LegalPageSlug, LegalPageData>;

export default function AdminLegalPagesPage() {
  const [pages, setPages] = useState<LegalPagesState>(legalPageDefaults);
  const [activeSlug, setActiveSlug] = useState<LegalPageSlug>("terms");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/legal-pages")
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load legal pages.");
        return response.json() as Promise<{ pages: LegalPagesState }>;
      })
      .then((data) => setPages(data.pages))
      .catch((error: Error) => setMessage(error.message))
      .finally(() => setLoading(false));
  }, []);

  const page = pages[activeSlug];
  const updatePage = (updates: Partial<LegalPageData>) => {
    setPages((current) => ({ ...current, [activeSlug]: { ...current[activeSlug], ...updates } }));
  };

  async function saveAll() {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/legal-pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pages),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Unable to save legal pages.");
      setMessage("All legal pages were saved and public caches were refreshed.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save legal pages.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8">Loading legal pages…</div>;

  return (
    <div className="mx-auto max-w-6xl p-4 py-8 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0a0a0a]">Legal Page Management</h1>
          <p className="mt-2 text-sm text-gray-600">Edit all public legal pages from one screen. Saving updates content and SEO descriptions.</p>
        </div>
        <button type="button" disabled={saving} onClick={saveAll} className="rounded-lg bg-[#C6A24A] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">
          {saving ? "Saving…" : "Save all legal pages"}
        </button>
      </div>

      {message ? <p role="status" className="mt-5 rounded-lg border border-[#C6A24A]/30 bg-white p-3 text-sm">{message}</p> : null}

      <div className="mt-8 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Legal pages">
        {legalPageSlugs.map((slug) => (
          <button
            key={slug}
            type="button"
            role="tab"
            aria-selected={activeSlug === slug}
            onClick={() => setActiveSlug(slug)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${activeSlug === slug ? "bg-[#1a1308] text-white" : "border border-[#C6A24A]/30 bg-white text-gray-700"}`}
          >
            {pages[slug].title}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-6 rounded-2xl border border-[#C6A24A]/25 bg-white p-5 shadow-sm sm:p-7">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-semibold text-gray-800">
            Page title
            <input value={page.title} onChange={(event) => updatePage({ title: event.target.value })} className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal" />
          </label>
          <label className="text-sm font-semibold text-gray-800">
            Last updated label
            <input value={page.lastUpdated} onChange={(event) => updatePage({ lastUpdated: event.target.value })} className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal" />
          </label>
        </div>
        <label className="block text-sm font-semibold text-gray-800">
          Meta description and hero description
          <textarea rows={3} value={page.description} onChange={(event) => updatePage({ description: event.target.value })} className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal" />
        </label>

        <div className="space-y-5">
          {page.sections.map((section, index) => (
            <fieldset key={`${section.id}-${index}`} className="rounded-xl border border-gray-200 p-4">
              <legend className="px-2 text-sm font-bold text-[#8a5b00]">Section {index + 1}</legend>
              <div className="grid gap-4 md:grid-cols-[1fr_14rem]">
                <label className="text-sm font-semibold">
                  Heading
                  <input
                    value={section.title}
                    onChange={(event) => updatePage({ sections: page.sections.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item) })}
                    className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal"
                  />
                </label>
                <label className="text-sm font-semibold">
                  Anchor ID
                  <input
                    value={section.id}
                    onChange={(event) => updatePage({ sections: page.sections.map((item, itemIndex) => itemIndex === index ? { ...item, id: event.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-") } : item) })}
                    className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal"
                  />
                </label>
              </div>
              <label className="mt-4 block text-sm font-semibold">
                Content
                <textarea
                  rows={7}
                  value={section.body}
                  onChange={(event) => updatePage({ sections: page.sections.map((item, itemIndex) => itemIndex === index ? { ...item, body: event.target.value } : item) })}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal leading-6"
                />
              </label>
              {page.sections.length > 1 ? (
                <button type="button" onClick={() => updatePage({ sections: page.sections.filter((_, itemIndex) => itemIndex !== index) })} className="mt-3 text-sm font-semibold text-red-700">
                  Remove section
                </button>
              ) : null}
            </fieldset>
          ))}
        </div>

        <button
          type="button"
          onClick={() => updatePage({ sections: [...page.sections, { id: `section-${page.sections.length + 1}`, title: "New section", body: "Add approved legal content here." }] })}
          className="rounded-lg border border-[#C6A24A]/40 px-4 py-2 text-sm font-semibold text-[#8a5b00]"
        >
          Add section
        </button>
      </div>
    </div>
  );
}
