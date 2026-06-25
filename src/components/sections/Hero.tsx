import { Phone, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookButton } from "./BookButton";
import { SHOP } from "@/lib/shop-data";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-espresso px-5 py-24 text-center text-cream md:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect width='60' height='60' fill='%232c1d12'/%3E%3Cpath d='M0 0h30v30H0zM30 30h30v30H30z' fill='%23332113'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="relative mx-auto max-w-3xl">
        <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-brass bg-brass/15 px-4 py-1.5 text-sm">
          <span className="flex text-brass-bright">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={15} fill="currentColor" strokeWidth={0} />
            ))}
          </span>
          <span>
            <b className="text-brass-bright">{SHOP.rating}</b> from 115+ Google
            reviews
          </span>
        </span>

        <h1 className="font-display text-[clamp(2.4rem,6vw,4.4rem)] font-black drop-shadow-md">
          A Classic Cut
          <br />
          <em className="italic text-brass-bright">A Warm Welcome.</em>
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-lg text-cream/80">
          Skilled fades, sharp beard work and hot-lather neck shaves in a
          friendly, family-welcoming chair — right here in Algonquin since 2017.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <BookButton />
          <Button asChild size="lg" className="bg-cream text-espresso hover:bg-white border-0 shadow-lg shadow-black/20">
            <a href={SHOP.phoneHref}>
              <Phone /> Call or Text {SHOP.phone}
            </a>
          </Button>
        </div>

        <p className="mt-8 font-condensed text-xs uppercase tracking-[0.3em] text-brass">
          Haircuts · Beard Trims · Skin Fades · Straight-Razor Shaves · Kid's
          Cuts
        </p>
      </div>
    </section>
  );
}
