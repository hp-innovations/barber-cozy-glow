import { Star } from "lucide-react";
import { REVIEWS } from "@/lib/shop-data";
import { BookButton } from "./BookButton";
import { SectionHeading } from "./About";

export function Reviews() {
  return (
    <section id="reviews" className="bg-espresso px-5 py-20 text-cream">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="What Our Customers Say"
          title="4.8 Stars & Counting"
          dark
        />

        <div className="grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure
              key={r.quote}
              className="rounded-xl border border-brass/30 bg-cream/5 p-7"
            >
              <div className="mb-3 flex text-brass-bright">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <blockquote className="mb-4 italic text-cream/90">
                "{r.quote}"
              </blockquote>
              <figcaption className="font-condensed text-sm uppercase tracking-[0.1em] text-brass-bright">
                — {r.who}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-10 text-center">
          <BookButton>Join Our Happy Regulars</BookButton>
        </div>
      </div>
    </section>
  );
}
