// Centralized SEO config + helpers.
// Set VITE_SITE_URL per-deployment to point canonical/OG tags at that
// deployment's own domain (e.g. "https://corelinkdev.com/demo/barbershop").
// Falls back to the default hosted URL when the env var is not set.
export const BASE_URL = import.meta.env.VITE_SITE_URL ?? "https://barber-cozy-glow.lovable.app";

export const SITE_NAME = "Algonquin Barber Shop";

export function absoluteUrl(path: string): string {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${BASE_URL}${path === "/" ? "" : path}`;
}

type MetaEntry = Record<string, string>;

/**
 * Build a consistent head() payload: title, description, canonical link,
 * and Open Graph + Twitter tags that self-reference the page URL.
 */
export function buildMeta(opts: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): { meta: MetaEntry[]; links: { rel: string; href: string }[] } {
  const url = absoluteUrl(opts.path);
  const type = opts.type ?? "website";
  return {
    meta: [
      { title: opts.title },
      { name: "description", content: opts.description },
      { property: "og:title", content: opts.title },
      { property: "og:description", content: opts.description },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      { property: "og:site_name", content: SITE_NAME },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: opts.title },
      { name: "twitter:description", content: opts.description },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
