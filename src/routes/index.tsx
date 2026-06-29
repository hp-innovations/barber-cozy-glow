import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, MapPin, Phone, Star } from "lucide-react";
import { PageLayout } from "@/components/sections/PageLayout";
import { Hero } from "@/components/sections/Hero";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { SectionHeading } from "@/components/sections/About";
import { BookButton } from "@/components/sections/BookButton";
import { SERVICES, REVIEWS, HOURS, SHOP, TRUST_BADGES } from "@/lib/shop-data";
import { buildMeta } from "@/lib/seo";
import { barberShopJsonLd } from "@/lib/jsonld";

const TITLE = "Algonquin Barber Shop | Classic Cuts in Algonquin, IL";
const DESCRIPTION =
  "Algonquin Barber Shop — 4.8-star classic barbering at 202 E Algonquin Rd. Skin fades, beard trims, hot-lather shaves & kid's cuts. Book online with Booksy.";

const POPULAR = SERVICES.filter((s) =>
  ["haircut", "skin-fade", "haircut-beard-combo", "kids-haircut"].includes(s.slug),
);

export const Route = createFileRoute("/")({
  head: () => {
    const base = buildMeta({ title: TITLE, description: DESCRIPTION, path: "/" });
    return {
      ...base,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(barberShopJsonLd()),
        },
      ],
    };
  },
  component: Index,
});

function Index() {
  return (
    <PageLayout>
      <Hero />

      {/* Popular services preview */}
      <section className="bg-paper px-5 py-20">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            eyebrow="The Menu"
            title="Popular Services"
            sub="A few of our most-booked services. Each one has its own page with the full details."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {POPULAR.map((s) => (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group rounded-xl border border-brass/30 bg-cream p-6 shadow-sm transition-shadow hover:shadow-lg hover:shadow-leather/10"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-xl text-leather">{s.name}</h3>
                  <span className="font-display text-lg font-bold text-leather">
                    {s.price}
                  </span>
                </div>
                <p className="mt-2 text-sm text-coffee">{s.tagline}</p>
                <span className="mt-4 inline-flex items-center gap-1 font-condensed text-sm uppercase tracking-[0.12em] text-brass group-hover:text-leather">
                  View details <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center gap-4">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 font-condensed text-sm uppercase tracking-[0.18em] text-leather hover:text-brass"
            >
              See all services & pricing <ArrowRight size={15} />
            </Link>
            <BookButton>Book Your Service</BookButton>
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="bg-cream px-5 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div>
            <p className="mb-2.5 font-condensed text-sm font-semibold uppercase tracking-[0.28em] text-leather">
              Our Chair, Your Style
            </p>
            <h2 className="font-display text-[clamp(1.9rem,4vw,2.7rem)] text-espresso">
              A True Neighborhood Barber Shop
            </h2>
            <p className="mt-5 text-coffee">
              Open since 2017, Algonquin Barber Shop pairs experienced barbers
              with a warm, family-welcoming chair. Skin fades, scissor cuts,
              beard shaping and hot-lather shaves — all done right.
            </p>
            <Link
              to="/about"
              className="mt-6 inline-flex items-center gap-2 font-condensed text-sm uppercase tracking-[0.18em] text-leather hover:text-brass"
            >
              Read our story <ArrowRight size={15} />
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {TRUST_BADGES.map((b) => (
              <span
                key={b}
                className="rounded-full border border-brass/40 bg-paper px-4 py-2 font-condensed text-sm tracking-wide text-coffee"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews teaser */}
      <section className="bg-espresso px-5 py-20 text-cream">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="What Our Customers Say"
            title="4.8 Stars & Counting"
            dark
          />
          <div className="grid gap-6 md:grid-cols-3">
            {REVIEWS.slice(0, 3).map((r) => (
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
            <Link
              to="/reviews"
              className="inline-flex items-center gap-2 font-condensed text-sm uppercase tracking-[0.18em] text-brass-bright hover:text-cream"
            >
              Read more reviews <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Visit teaser */}
      <section className="bg-cream px-5 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeading eyebrow="Find Us" title="Stop By the Shop" />
          <div className="grid gap-4 text-coffee sm:grid-cols-3">
            <p className="flex flex-col items-center gap-2">
              <MapPin className="text-brass" />
              {SHOP.addressLine1}
              <br />
              {SHOP.addressLine2}
            </p>
            <p className="flex flex-col items-center gap-2">
              <Phone className="text-brass" />
              <a href={SHOP.phoneHref} className="hover:text-leather">
                {SHOP.phone}
              </a>
            </p>
            <p className="flex flex-col items-center gap-2">
              <Calendar className="text-brass" />
              {HOURS.find((h) => !h.closed)?.day}–Sun
              <br />
              See full hours
            </p>
          </div>
          <div className="mt-8">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 font-condensed text-sm uppercase tracking-[0.18em] text-leather hover:text-brass"
            >
              Hours, map & directions <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <FinalCTA />
    </PageLayout>
  );
}
