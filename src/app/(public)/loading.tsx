export default function PublicLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-10 sm:px-6 lg:px-8" aria-label="Loading page" role="status">
      <div className="h-8 w-2/3 rounded bg-gray-200 sm:w-1/3" />
      <div className="mt-4 h-4 w-full max-w-2xl rounded bg-gray-200" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => <div key={index} className="overflow-hidden rounded-xl border bg-white"><div className="aspect-square bg-gray-200" /><div className="space-y-3 p-4"><div className="h-4 rounded bg-gray-200" /><div className="h-4 w-1/2 rounded bg-gray-200" /></div></div>)}
      </div>
      <span className="sr-only">Loading content…</span>
    </div>
  );
}
