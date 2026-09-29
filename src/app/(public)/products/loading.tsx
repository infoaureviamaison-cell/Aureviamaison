export default function ProductsLoading() {
  return <div className="mx-auto max-w-7xl px-4 py-8" role="status" aria-label="Loading products"><div className="h-12 animate-pulse rounded-xl bg-gray-200" /><div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <div key={index} className="aspect-[3/4] animate-pulse rounded-xl bg-gray-200" />)}</div><span className="sr-only">Loading products…</span></div>;
}
