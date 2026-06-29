import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "@/components/sections/PageLayout";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { About } from "@/components/sections/About";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { buildMeta } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/jsonld";

const TITLE = "About Us | Algonquin Barber Shop";
const DESCRIPTION =
  "Meet Algonquin Barber Shop — a true neighborhood shop open since 2017. Experienced barbers, skin fades, scissor cuts, beard shaping and straight-razor shaves in a warm, family-welcoming chair.";

export const Route = createFileRoute("/about")({
  head: () => {
    const base = buildMeta({ title: TITLE, description: DESCRIPTION, path: "/about" });
    return {
      ...base,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "About", path: "/about" },
            ]),
          ),
        },
      ],
    };
  },
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageLayout>
      <Breadcrumbs items={[{ name: "Home", to: "/" }, { name: "About", to: "/about" }]} />
      <About />
      <FinalCTA />
    </PageLayout>
  );
}
