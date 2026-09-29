"use client";

export default function PublicError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="mx-auto max-w-2xl px-4 py-20 text-center" role="alert">
      <h1 className="text-3xl font-bold">We could not load this page</h1>
      <p className="mt-3 text-[#5A5E55]">Please try again. If the problem continues, contact Auerviamaison support.</p>
      <button type="button" onClick={reset} className="mt-6 rounded-lg bg-[#1a1308] px-5 py-3 font-semibold text-white">Try again</button>
    </section>
  );
}
