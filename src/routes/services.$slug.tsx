import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check, Clock, Phone } from "lucide-react";
import { PageLayout } from "@/components/sections/PageLayout";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { BookButton } from "@/components/sections/BookButton";
import { SERVICES, getServiceBySlug, SHOP } from "@/lib/shop-data";
import { buildMeta } from "@/lib/seo";
import { serviceJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = getServiceBySlug(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    const service = loaderData?.service;
    if (!service) return {};
    const title = `${service.name} (${service.price}) | Algonquin Barber Shop`;
    const description = `${service.tagline} ${service.name} at Algonquin Barber Shop in Algonquin, IL — ${service.duration}, ${service.price}. Book online with Booksy.`;
    const base = buildMeta({
      title,
      description,
      path: `/services/${service.slug}`,
    });
    return {
      ...base,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(serviceJsonLd(service)),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
              { name: service.name, path: `/services/${service.slug}` },
            ]),
          ),
        },
      ],
    };
  },
  component: ServiceDetail,
  notFoundComponent: () => (
    <PageLayout>
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="font-display text-3xl text-espresso">Service not found</h1>
        <p className="mt-3 text-coffee">
          That service doesn't exist. Browse our full menu instead.
        </p>
        <Link
          to="/services"
          className="mt-6 inline-flex items-center gap-2 font-condensed text-sm uppercase tracking-[0.18em] text-leather hover:text-brass"
        >
          View all services <ArrowRight size={15} />
        </Link>
      </div>
    </PageLayout>
  ),
});

function ServiceDetail() {
  const { service } = Route.useLoaderData();
  const related = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 4);

  return (
    <PageLayout>
      <Breadcrumbs
        items={[
          { name: "Home", to: "/" },
          { name: "Services", to: "/services" },
          { name: service.name, to: `/services/${service.slug}` },
        ]}
      />

      <article className="bg-cream px-5 py-16">
        <div className="mx-auto max-w-3xl">
          <p className="mb-2.5 font-condensed text-sm font-semibold uppercase tracking-[0.28em] text-leather">
            Barbering Service
          </p>
          <h1 className="font-display text-[clamp(2rem,5vw,3rem)] text-espresso">
            {service.name}
          </h1>
          <p className="mt-3 text-lg text-coffee">{service.tagline}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-brass/40 bg-paper px-4 py-2 font-display text-lg font-bold text-leather">
              {service.price}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brass/40 bg-paper px-4 py-2 font-condensed text-sm text-coffee">
              <Clock size={15} className="text-brass" /> {service.duration}
            </span>
          </div>

          <div className="mt-8 space-y-5 text-coffee">
            {service.blurb.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-brass/30 bg-paper p-6">
            <h2 className="font-display text-xl text-leather">What's Included</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {service.includes.map((inc) => (
                <li key={inc} className="flex items-center gap-2 text-coffee">
                  <Check size={16} className="shrink-0 text-brass" /> {inc}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <BookButton>Book {service.name}</BookButton>
            <a
              href={SHOP.phoneHref}
              className="inline-flex items-center gap-2 rounded-md border border-brass/40 px-5 py-2.5 font-condensed text-sm uppercase tracking-[0.12em] text-leather hover:bg-paper"
            >
              <Phone size={16} /> Call or Text
            </a>
          </div>
        </div>
      </article>

      {/* Related services */}
      <section className="bg-paper px-5 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl text-espresso">Other Services</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {related.map((s) => (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group flex items-baseline justify-between gap-3 rounded-lg border border-brass/30 bg-cream px-4 py-3 transition-shadow hover:shadow-md"
              >
                <span className="font-condensed text-base text-coffee group-hover:text-leather">
                  {s.name}
                </span>
                <span className="font-display font-bold text-leather">
                  {s.price}
                </span>
              </Link>
            ))}
          </div>
          <Link
            to="/services"
            className="mt-6 inline-flex items-center gap-2 font-condensed text-sm uppercase tracking-[0.18em] text-leather hover:text-brass"
          >
            See all services <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
