import { MessageSquareQuote } from "@esmate/shadcn/pkgs/lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";

const sampleReviews = [
  {
    audience: "Sample retail buyer",
    quote: "The ordering experience was straightforward, and the product information helped me choose the right salt grade.",
  },
  {
    audience: "Sample wholesale buyer",
    quote: "Clear communication about grading, packaging, and quantities made it easier to prepare our quotation request.",
  },
  {
    audience: "Sample international buyer",
    quote: "The available product formats and export information gave our team a useful starting point for discussing supply.",
  },
];

export function CustomerVoicesSection() {
  return (
    <section className="bg-gray-100 px-6 py-10 lg:px-4 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Customer Voices"
          title="What Buyers May Value"
          description="Sample review layouts shown for demonstration. These are not verified customer testimonials."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {sampleReviews.map((review) => (
            <article key={review.audience} className="rounded-3xl border border-[#C6A24A]/20 bg-white p-7 shadow-sm">
              <MessageSquareQuote aria-hidden="true" className="h-7 w-7 text-[#C6A24A]" />
              <p className="mt-5 text-sm leading-7 text-gray-700">&ldquo;{review.quote}&rdquo;</p>
              <p className="mt-5 text-xs font-bold uppercase tracking-wider text-[#ea580c]">{review.audience}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-gray-500">
          Demo content only — replace with approved reviews before presenting this section as customer feedback.
        </p>
      </div>
    </section>
  );
}
