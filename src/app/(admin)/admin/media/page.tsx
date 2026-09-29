"use client";

import { FiRefreshCw, FiUpload } from "react-icons/fi";
import { MediaGrid } from "./_components/media-grid";
import { useMedia } from "./_components/use-media";

export default function MediaPage() {
  const state = useMedia();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#0a0a0a]">Cloudinary Media Library</h1>
      <p className="mb-6 mt-1 text-sm text-gray-500">All images in your connected Cloudinary account. Deleting here permanently removes the Cloudinary asset.</p>
      {state.error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.error}</div>}
      <div className="mb-6 flex gap-2">
        <input id="cloudinary-media-upload" type="file" onChange={state.handleUpload} accept="image/*" className="hidden" />
        <label htmlFor="cloudinary-media-upload" aria-disabled={state.uploading} className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#C6A24A] px-4 py-2 text-sm font-medium text-white hover:bg-[#b8923f]"><FiUpload className="h-4 w-4" />{state.uploading ? "Uploading..." : "Upload File"}</label>
        <button onClick={() => void state.fetchMedia()} disabled={state.loading} className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"><FiRefreshCw className="h-4 w-4" />Sync Cloudinary</button>
      </div>
      {state.loading ? <p>Loading...</p> : state.media.length === 0 ? <p className="text-gray-500">No media files yet</p> : <MediaGrid media={state.media} copied={state.copied} copyUrl={state.copyUrl} deleteMedia={state.deleteMedia} />}
    </div>
  );
}
