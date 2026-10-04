"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "@esmate/shadcn/pkgs/lucide-react";
import { buildVideoEmbedUrl, detectVideoPlatform } from "@/lib/video-utils";
import type { AdminVideo } from "../../videos/_components/types";

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#0a0a0a] outline-none focus:border-[#C6A24A] focus:ring-2 focus:ring-[#C6A24A]/20";

type ReelDraft = {
  title: string;
  videoUrl: string;
  displayOrder: number;
  active: boolean;
};

const emptyDraft = (): ReelDraft => ({
  title: "",
  videoUrl: "",
  displayOrder: 0,
  active: true,
});

export default function HomepageReelsAdminPage() {
  const [reels, setReels] = useState<AdminVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<ReelDraft>(emptyDraft());
  const [showForm, setShowForm] = useState(false);

  const fetchReels = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/videos?placement=HOMEPAGE_REELS");
    const data = await res.json();
    setReels(data.videos || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchReels();
  }, [fetchReels]);

  const previewEmbed = draft.videoUrl.trim()
    ? buildVideoEmbedUrl("TIKTOK", draft.videoUrl)
    : null;

  async function saveReel(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const platform = detectVideoPlatform(draft.videoUrl);
    if (platform !== "TIKTOK") {
      setError("Paste a valid TikTok video URL (e.g. https://www.tiktok.com/@user/video/...).");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draft.title.trim() || "Homepage reel",
          videoUrl: draft.videoUrl.trim(),
          platform: "TIKTOK",
          placement: "HOMEPAGE_REELS",
          format: "VERTICAL",
          active: draft.active,
          displayOrder: draft.displayOrder,
          featured: false,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Unable to save reel");
      setDraft(emptyDraft());
      setShowForm(false);
      void fetchReels();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save reel");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(reel: AdminVideo) {
    const res = await fetch(`/api/admin/videos/${reel.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...reel, active: !reel.active }),
    });
    if (res.ok) void fetchReels();
  }

  async function deleteReel(id: string) {
    if (!confirm("Remove this reel from the homepage?")) return;
    const res = await fetch(`/api/admin/videos/${id}`, { method: "DELETE" });
    if (res.ok) void fetchReels();
  }

  return (
    <div className="p-4 md:p-8">
      <Link
        href="/admin/homepage/section-management"
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#5A5E55] hover:text-[#EA580C]"
      >
        <ArrowLeft className="h-4 w-4" />
        Homepage sections
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#0a0a0a] md:text-2xl">Homepage reels</h1>
          <p className="mt-1 max-w-2xl text-sm text-[#5A5E55]">
            Add TikTok videos for the horizontal reels row on the homepage. Only the video is shown to visitors — titles and descriptions are for admin reference until you enable them on the storefront.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowForm((open) => !open);
            setError("");
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-[#1a1308] px-4 py-2 text-sm font-bold text-white hover:bg-[#2a2118]"
        >
          <Plus className="h-4 w-4" />
          Add reel
        </button>
      </div>

      {showForm ? (
        <form onSubmit={saveReel} className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          {error ? (
            <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</div>
          ) : null}
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
            <div className="space-y-4">
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-gray-800">Admin label (not shown on homepage)</span>
                <input
                  className={inputClass}
                  value={draft.title}
                  onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                  placeholder="e.g. Spring glow routine"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-gray-800">TikTok video URL</span>
                <input
                  className={inputClass}
                  value={draft.videoUrl}
                  onChange={(e) => setDraft((d) => ({ ...d, videoUrl: e.target.value }))}
                  placeholder="https://www.tiktok.com/@.../video/..."
                  required
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-sm font-semibold text-gray-800">Display order</span>
                  <input
                    type="number"
                    className={inputClass}
                    value={draft.displayOrder}
                    onChange={(e) => setDraft((d) => ({ ...d, displayOrder: Number(e.target.value) || 0 }))}
                  />
                </label>
                <label className="flex items-end gap-2 pb-2 text-sm font-semibold text-gray-800">
                  <input
                    type="checkbox"
                    checked={draft.active}
                    onChange={(e) => setDraft((d) => ({ ...d, active: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  Show on homepage
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#EA580C] px-4 py-2 text-sm font-bold text-white hover:bg-[#c2410c] disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save reel"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setDraft(emptyDraft());
                    setError("");
                  }}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
            <div className="mx-auto w-[180px]">
              <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">Preview</p>
              <div className="aspect-[9/16] overflow-hidden rounded-2xl border border-gray-200 bg-black">
                {previewEmbed ? (
                  <iframe
                    src={previewEmbed}
                    title="Reel preview"
                    className="h-full w-full border-0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-4 text-center text-xs text-white/70">
                    Enter a TikTok URL to preview
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      ) : null}

      <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <p className="p-6 text-sm text-gray-500">Loading reels…</p>
        ) : reels.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">No homepage reels yet. Add a TikTok video to fill the reels row.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {reels.map((reel) => (
              <li key={reel.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[#0a0a0a]">{reel.title}</p>
                  <p className="truncate text-xs text-gray-500">{reel.videoUrl}</p>
                  <p className="mt-1 text-xs text-gray-400">Order: {reel.displayOrder}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void toggleActive(reel)}
                    className={`rounded-full px-3 py-1 text-xs font-bold ${reel.active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}
                  >
                    {reel.active ? "Active" : "Hidden"}
                  </button>
                  <Link
                    href={`/admin/videos/${reel.id}/edit`}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => void deleteReel(reel.id)}
                    aria-label={`Delete ${reel.title}`}
                    className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
