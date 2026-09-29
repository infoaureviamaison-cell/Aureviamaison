"use client";

import { useEffect, useState } from "react";
import type { MediaItem } from "./types";

export function useMedia() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => { void fetchMedia(); }, []);

  async function fetchMedia() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (res.ok && data.media) setMedia(data.media);
      else setError(data.error || "Failed to load Cloudinary media");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load Cloudinary media");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", files[0]);
    try {
      const res = await fetch("/api/admin/media", { method: "POST", body: formData });
      const data = await res.json();
      if (data.media) setMedia((items) => [data.media, ...items]);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function deleteMedia(id: string) {
    if (!confirm("Permanently delete this image from Cloudinary? This cannot be undone.")) return;
    setError("");
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) setMedia((items) => items.filter((m) => m.id !== id));
      else setError(data.error || "Cloudinary deletion failed");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Cloudinary deletion failed");
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  return { media, loading, uploading, copied, error, handleUpload, deleteMedia, copyUrl, fetchMedia };
}
