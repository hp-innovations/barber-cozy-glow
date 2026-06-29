import { SHOP, HOURS, type Service } from "./shop-data";
import { absoluteUrl, BASE_URL } from "./seo";

const OPENING_HOURS = HOURS.filter((h) => !h.closed).map((h) => {
  const [opens, closes] = h.time
    .split("–")
    .map((t) => to24h(t.trim()));
  return {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: h.day,
    opens,
    closes,
  };
});

function to24h(t: string): string {
  // "9:00 AM" -> "09:00"
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return "09:00";
  let hour = parseInt(m[1], 10);
  const min = m[2];
  const ap = m[3].toUpperCase();
  if (ap === "PM" && hour !== 12) hour += 12;
  if (ap === "AM" && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${min}`;
}

/** Sitewide BarberShop / LocalBusiness structured data. */
export function barberShopJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "BarberShop",
    "@id": `${BASE_URL}/#business`,
    name: SHOP.name,
    image: absoluteUrl("/"),
    telephone: "+18477690998",
    url: BASE_URL,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: SHOP.addressLine1,
      addressLocality: "Algonquin",
      addressRegion: "IL",
      postalCode: "60102",
      addressCountry: "US",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: SHOP.rating,
      reviewCount: SHOP.reviewCount,
    },
    openingHoursSpecification: OPENING_HOURS,
    sameAs: [SHOP.facebookUrl, SHOP.booksyUrl],
  };
}

/** Per-service structured data. */
export function serviceJsonLd(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.tagline,
    serviceType: service.name,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: {
      "@type": "BarberShop",
      name: SHOP.name,
      "@id": `${BASE_URL}/#business`,
    },
    areaServed: { "@type": "City", name: "Algonquin, IL" },
    offers: {
      "@type": "Offer",
      price: service.price.replace("$", ""),
      priceCurrency: "USD",
      url: SHOP.booksyUrl,
      availability: "https://schema.org/InStock",
    },
  };
}

/** Breadcrumb structured data from a list of { name, path }. */
export function breadcrumbJsonLd(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}
