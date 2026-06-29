import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "@/components/sections/PageLayout";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { Visit } from "@/components/sections/Visit";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { buildMeta } from "@/lib/seo";
import { barberShopJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";

const TITLE = "Visit & Hours | Algonquin Barber Shop";
const DESCRIPTION =
  "Find Algonquin Barber Shop at 202 E Algonquin Rd, Algonquin, IL 60102. Hours, directions, phone and online booking. Call or text (847) 769-0998.";

export const Route = createFileRoute("/contact")({
  head: () => {
    const base = buildMeta({ title: TITLE, description: DESCRIPTION, path: "/contact" });
    return {
      ...base,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(barberShopJsonLd()),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Contact", path: "/contact" },
            ]),
          ),
        },
      ],
    };
  },
  component: ContactPage,
});

function ContactPage() {
  return (
    <PageLayout>
      <Breadcrumbs
        items={[{ name: "Home", to: "/" }, { name: "Contact", to: "/contact" }]}
      />
      <Visit />
      <FinalCTA />
    </PageLayout>
  );
}
