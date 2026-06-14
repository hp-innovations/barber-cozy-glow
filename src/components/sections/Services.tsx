import { SERVICES, ALSO_OFFERED } from "@/lib/shop-data";
import { BookButton } from "./BookButton";
import { GiftCardButton } from "./GiftCardButton";
import { SectionHeading } from "./About";

export function Services() {
  return (
    <section id="services" className="bg-paper px-5 py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="The Menu"
          title="Services & Pricing"
          sub="Honest pricing for quality work. Reserve your time online in seconds with Booksy."
        />

        <div className="grid gap-x-12 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <div
              key={s.name}
              className="flex items-baseline justify-between gap-3 border-b border-dashed border-brass/40 py-4"
            >
              <div>
                <span className="font-condensed text-base tracking-wide text-coffee">
                  {s.name}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {s.duration}
                </span>
              </div>
              <span className="whitespace-nowrap font-display text-lg font-bold text-leather">
                {s.price}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-coffee">Also offered:</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2.5">
          {ALSO_OFFERED.map((x) => (
            <span
              key={x}
              className="rounded-md bg-cream px-3.5 py-1.5 text-sm text-coffee"
            >
              {x}
            </span>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3">
          <BookButton>Book Your Service</BookButton>
          <GiftCardButton />
        </div>
      </div>
    </section>
  );
}
