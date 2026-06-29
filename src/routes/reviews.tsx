import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "@/components/sections/PageLayout";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { Reviews } from "@/components/sections/Reviews";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { buildMeta } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/jsonld";

const TITLE = "Reviews | Algonquin Barber Shop";
const DESCRIPTION =
  "Read what customers say about Algonquin Barber Shop — 4.8 stars across 115+ Google reviews for skin fades, beard work, kid's cuts and friendly service.";

export const Route = createFileRoute("/reviews")({
  head: () => {
    const base = buildMeta({ title: TITLE, description: DESCRIPTION, path: "/reviews" });
    return {
      ...base,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Reviews", path: "/reviews" },
            ]),
          ),
        },
      ],
    };
  },
  component: ReviewsPage,
});

function ReviewsPage() {
  return (
    <PageLayout>
      <Breadcrumbs
        items={[{ name: "Home", to: "/" }, { name: "Reviews", to: "/reviews" }]}
      />
      <Reviews />
      <FinalCTA />
    </PageLayout>
  );
}
