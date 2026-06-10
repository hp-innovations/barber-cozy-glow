import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Reviews } from "@/components/sections/Reviews";
import { Visit } from "@/components/sections/Visit";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/sections/Footer";

const TITLE = "Algonquin Barber Shop | Classic Cuts in Algonquin, IL";
const DESCRIPTION =
  "Algonquin Barber Shop — 4.8-star classic barbering at 202 E Algonquin Rd. Skin fades, beard trims, hot-lather shaves & kid's cuts. Book online with Booksy.";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BarberShop",
  name: "Algonquin Barber Shop",
  description: DESCRIPTION,
  image: "https://www.google.com/maps?q=202+E+Algonquin+Rd,+Algonquin,+IL+60102",
  telephone: "+18477690998",
  url: "https://booksy.com/en-us/1683261_algonquin-barber-shop_barber-shop_18885_algonquin",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "202 E Algonquin Rd",
    addressLocality: "Algonquin",
    addressRegion: "IL",
    postalCode: "60102",
    addressCountry: "US",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "115",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Wednesday",
      opens: "09:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Thursday",
      opens: "11:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Friday",
      opens: "10:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "17:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "09:00",
      closes: "18:00",
    },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(JSON_LD),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Reviews />
        <Visit />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
