"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Play } from "@esmate/shadcn/pkgs/lucide-react";
import { VIDEO_PLATFORM_LABELS, type PublicVideo, type VideoPlatformValue } from "@/lib/video-utils";

const THEMES: Record<VideoPlatformValue | "DEFAULT", { active: string; hover: string; label: string }> = {
  DEFAULT: { active: "border-[#ea580c] ring-[#ea580c]", hover: "hover:border-[#C6A24A]", label: "text-gray-500" },
  YOUTUBE: { active: "border-red-600 ring-red-600", hover: "hover:border-red-400", label: "text-red-600" },
  TIKTOK: { active: "border-cyan-400 ring-pink-500", hover: "hover:border-cyan-400", label: "text-pink-500" },
  FACEBOOK: { active: "border-blue-600 ring-blue-600", hover: "hover:border-blue-400", label: "text-blue-600" },
  INSTAGRAM: { active: "border-fuchsia-500 ring-orange-400", hover: "hover:border-fuchsia-400", label: "text-fuchsia-600" },
};

export function SharedVideoPlayer({
  videos,
  theme = "DEFAULT",
  singleAtATime = false,
}: {
  videos: PublicVideo[];
  theme?: VideoPlatformValue | "DEFAULT";
  singleAtATime?: boolean;
}) {
  const [selectedId, setSelectedId] = useState(videos[0]?.id ?? "");
  const touchStartX = useRef<number | null>(null);
  const selected = videos.find((video) => video.id === selectedId) ?? videos[0];
  if (!selected) return null;
  const styles = THEMES[theme];
  const selectedIndex = Math.max(0, videos.findIndex((video) => video.id === selected.id));
  const selectRelative = (offset: number) => {
    const nextIndex = (selectedIndex + offset + videos.length) % videos.length;
    setSelectedId(videos[nextIndex].id);
  };

  if (singleAtATime) {
    return (
      <div
        className="mx-auto min-w-0 max-w-5xl"
        onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null) return;
          const distance = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
          touchStartX.current = null;
          if (Math.abs(distance) < 50 || videos.length <= 1) return;
          selectRelative(distance < 0 ? 1 : -1);
        }}
      >
        <VideoPanel video={selected} />
        {videos.length > 1 ? (
          <div className="mt-5 flex items-center justify-center gap-4" aria-label="Video carousel controls">
            <button type="button" onClick={() => selectRelative(-1)} aria-label="Previous video" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#C6A24A]/35 bg-white text-gray-800 transition hover:bg-[#fcf5e8]">
              <ChevronLeft aria-hidden="true" className="h-5 w-5" />
            </button>
            <span className="min-w-20 text-center text-sm font-semibold text-gray-600" aria-live="polite">
              {selectedIndex + 1} / {videos.length}
            </span>
            <button type="button" onClick={() => selectRelative(1)} aria-label="Next video" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#C6A24A]/35 bg-white text-gray-800 transition hover:bg-[#fcf5e8]">
              <ChevronRight aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="grid min-w-0 gap-5 overflow-hidden lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)]">
      <VideoPanel video={selected} />

      <aside className="min-w-0 overflow-hidden">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-700">Suggested videos</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 lg:max-h-[520px] lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto lg:pr-1">
          {videos.map((video) => (
            <button
              key={video.id}
              type="button"
              onClick={() => setSelectedId(video.id)}
              className={`flex w-[270px] shrink-0 items-center gap-3 overflow-hidden rounded-xl border bg-white p-2 text-left transition lg:w-full ${video.id === selected.id ? `${styles.active} ring-1` : `border-gray-200 ${styles.hover}`}`}
            >
              <span className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-black ${video.format === "VERTICAL" ? "h-24 w-[54px]" : "h-[72px] w-32"}`}>
                {video.thumbnail ? <Image src={video.thumbnail} alt={`${video.title} video thumbnail`} fill sizes="128px" className="object-contain" loading="lazy" /> : <Play className="h-7 w-7 text-white" />}
              </span>
              <span className="min-w-0">
                <span className="line-clamp-2 text-sm font-bold leading-snug text-gray-950">{video.title}</span>
                <span className={`mt-1 block text-xs font-semibold ${styles.label}`}>{VIDEO_PLATFORM_LABELS[video.platform]}</span>
              </span>
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}

function VideoPanel({ video }: { video: PublicVideo }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-[#C6A24A]/20 bg-white shadow-sm">
      <div className="flex aspect-video w-full items-center justify-center overflow-hidden bg-[#090909]">
        <div className={video.format === "VERTICAL" ? "h-full max-w-full aspect-[9/16]" : "h-full w-full"}>
          {video.embedUrl ? (
            <iframe
              key={video.id}
              src={video.embedUrl}
              title={video.title}
              className="h-full w-full border-0"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center text-white">
              <p className="text-sm font-semibold">This video cannot be embedded.</p>
              <a href={video.videoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-950">
                Open on {VIDEO_PLATFORM_LABELS[video.platform]} <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2 p-4 sm:p-5">
        <h3 className="font-serif text-xl font-bold leading-tight text-gray-950">{video.title}</h3>
        {video.description ? <p className="line-clamp-2 text-sm leading-relaxed text-gray-600">{video.description}</p> : null}
      </div>
    </div>
  );
}
