import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "@/components/sections/PageLayout";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { Services } from "@/components/sections/Services";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { buildMeta } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/jsonld";

const TITLE = "Services & Pricing | Algonquin Barber Shop";
const DESCRIPTION =
  "Full service menu & honest pricing at Algonquin Barber Shop — haircuts, skin fades, beard trims, head shaves, kid's cuts and more. Book online with Booksy.";

export const Route = createFileRoute("/services")({
  head: () => {
    const base = buildMeta({ title: TITLE, description: DESCRIPTION, path: "/services" });
    return {
      ...base,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
            ]),
          ),
        },
      ],
    };
  },
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <PageLayout>
      <Breadcrumbs
        items={[{ name: "Home", to: "/" }, { name: "Services", to: "/services" }]}
      />
      <Services />
      <FinalCTA />
    </PageLayout>
  );
}
