# SEO-Professional Multi-Page Rebuild

Turn the current single scrolling page into a properly structured, search-optimized website with real routes, one dedicated page per service, and full crawler support — built the way a senior web developer would.

## New site structure

```text
/                      Home (hero + condensed previews, links into deep pages)
/about                 The shop story, barbers, trust badges
/services              Services hub — all services as linked cards + pricing
/services/skin-fade    One full page per service (10 pages)
/services/haircut
/services/...          (every service from the menu)
/reviews               All customer reviews + rating summary
/contact               Visit, hours, map, phone, Booksy
/sitemap.xml           Auto-generated crawler sitemap
robots.txt             Crawler rules + sitemap link
```

Each service in the menu (Haircut, Skin Fade, Haircut & Beard Combo, Head Shave, Kid's Haircut, Beard Trim, Eyebrow Shaping, Ear Wax, Nose Wax, Hair Wash) becomes its own indexable page with a unique title, description, longer write-up, price, duration, and a "Book Online" CTA.

## What makes it SEO-professional

- **Real routes, not hash anchors** — every section becomes a server-rendered URL Google can index separately (today `/#services` is invisible to crawlers).
- **Unique metadata per page** — distinct `<title>`, meta description, canonical link, and Open Graph tags on every route, all self-referencing the correct URL.
- **Structured data (JSON-LD)** — `BarberShop` + `LocalBusiness` on the home page, a `Service` schema on each service page, and `BreadcrumbList` on deep pages so search engines understand the hierarchy and can show rich results.
- **Local SEO** — consistent NAP (name, address, phone), opening hours, geo data, and aggregate rating wired into structured data for Google's local/maps results.
- **Semantic HTML & accessibility** — single `<h1>` per page, logical heading order, descriptive link text, image alt attributes, and visible breadcrumbs.
- **Internal linking** — home links to each section, the services hub links to each service page, and each service page links back to the hub and to Contact, spreading link equity.
- **Crawler files** — dynamic `sitemap.xml` listing all routes and a `robots.txt` pointing to it.

## Technical implementation

1. **Shared SEO helper** (`src/lib/seo.ts`): a `BASE_URL` constant plus a `buildMeta()` helper so every route produces consistent title/description/canonical/OG tags. Centralizing the domain makes it trivial to point at your real domain later.
2. **Expand service data** (`src/lib/shop-data.ts`): add `slug`, `tagline`, and a paragraph of SEO copy to each service so each page has unique, substantial content (thin/duplicate pages hurt ranking).
3. **Route files** under `src/routes/`: `about.tsx`, `services.tsx` (hub), `services.$slug.tsx` (dynamic per-service page with `notFound()` for unknown slugs), `reviews.tsx`, `contact.tsx` — each with its own `head()` metadata and JSON-LD.
4. **Reuse existing section components** — the current `About`, `Services`, `Reviews`, and `Visit` UI move into their matching routes, so the look stays identical; only the structure changes.
5. **Rework the home page** (`index.tsx`) into a true landing page: hero + short teasers of each section, each linking to its full page.
6. **Navigation** — convert `Header.tsx` and `Footer.tsx` from `<a href="#...">` to TanStack `<Link to="...">` so navigation is client-routed and crawlable. Mobile menu updated to match.
7. **Root defaults** (`__root.tsx`): sitewide OG `site_name`, default `og:type`, and Organization JSON-LD; page-specific tags stay on leaf routes.
8. **Crawler files**: `src/routes/sitemap[.]xml.ts` (server route emitting all URLs) and `public/robots.txt`.
9. **Subpath-safe** — all internal navigation uses `<Link>`, which respects the existing `VITE_BASE_PATH=/barbershop` setup, so your VPS deployment keeps working.

## Notes

- Canonical/OG URLs default to the project's `lovable.app` domain via the `BASE_URL` constant. If you want them to use `corelinkdev.com/barbershop` instead, tell me and I'll set that as the base.
- The visual design, colors, fonts, and content stay the same — this is a structural/SEO upgrade, not a redesign.
- No `og:image` is added unless you want one generated (a missing image previews better than a generic placeholder).
- After building, I can run an SEO review scan to confirm everything passes.
