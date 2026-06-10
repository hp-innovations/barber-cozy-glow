# Algonquin Barber Shop — Single-Page Website Plan

A warm, vintage-cozy single-page site built into the existing TanStack Start project, using the espresso/cream/brass palette mapped into the project's design tokens. All copy, hours, services, and reviews come from your brief, with "Book Online" (Booksy) as the repeated primary CTA.

## Design tokens (src/styles.css)
Map your vintage palette into the project's semantic tokens (oklch) so it works with shadcn components and both light surfaces:
- `--background` → paper/cream, `--foreground` → ink
- `--primary` → brass/gold (CTAs), `--primary-foreground` → espresso
- `--secondary`/`--muted` → cream tones, `--accent` → leather
- Add custom tokens: `--espresso`, `--coffee`, `--leather`, `--brass-bright`
- Register a `--font-display` (Playfair Display) and `--font-condensed` (Oswald) plus body (Source Sans 3)
- Add Google Fonts `<link>` tags in `src/routes/__root.tsx` head (per stack rule — no CSS @import of remote fonts)
- Add a `barber-pole` keyframe animation via `@utility`

## Page structure (single route: src/routes/index.tsx)
Replace the placeholder index with a full landing page composed of small section components under `src/components/sections/`:

1. **Sticky Header / Nav** — animated barber-pole logo, brand name + "Est. 2017 · Algonquin, IL", anchor links (About, Services, Reviews, Visit), "Book Online" button. Mobile hamburger using a Sheet or simple state toggle.
2. **Hero** — 4.8★ trust badge above headline "A Classic Cut. A Warm Welcome.", lead paragraph, primary "Book Online" + secondary "Call or Text (847) 769-0998", service keyword strip. Dark espresso textured background.
3. **About** — founding story (verbatim owner quote), barbers Elaina & Isaac, "The Full Experience" card, trust badges (Great with Kids, Restroom On-Site, Walk-ins & Appointments, etc.).
4. **Services** — two-column price menu (Haircut $35, Skin Fade $35, Haircut & Beard $50, Head Shave $40, Kid's $30, Beard $15, Eyebrow $10, Ear Wax $10, Nose Wax $10, Hair Wash $7) with durations, plus "Also offered" tags, and a Book CTA.
5. **Reviews** — dark section, 6 review cards (verbatim quotes incl. attributed Oskar & Natalie), 4.8★ heading, Book CTA.
6. **Visit & Hours** — Location/contact block (address, phone, Booksy, Facebook) + embedded Google Map (no API key), and Hours list (Mon/Tue Closed, Wed 9–7, Thu 11–7, Fri 10–7, Sat 9–5, Sun 9–6) with holiday note.
7. **Final CTA banner** — "Ready for a Fresh Cut?" + Book Online Now.
8. **Footer** — pole logo, address/phone, social links, copyright.

All "Book Online" buttons link to `https://booksy.com/en-us/1683261_algonquin-barber-shop_barber-shop_18885_algonquin` (target=_blank). Phone uses `tel:` link.

## SEO (index.tsx head())
- Title: "Algonquin Barber Shop | Classic Cuts in Algonquin, IL" (<60 chars)
- Meta description from the brief (<160 chars)
- og:title / og:description / og:type, single H1, semantic landmarks, alt text, responsive viewport (already in root)
- LocalBusiness (BarberShop) JSON-LD with address, phone, hours, rating

## Components & styling notes
- Reuse shadcn `Button` (with a brass/`default` variant via tokens), `Card`, `Separator`, `Badge`, `Sheet` (mobile nav).
- Lucide icons (MapPin, Phone, Calendar, Clock, Star, Facebook) replacing the emoji from the spec.
- Fully responsive: grids collapse to single column on mobile, fluid `clamp()` headings.

## Technical notes
- No backend needed — static content, external Booksy link. Lovable Cloud not required.
- Wednesday open time uses 9 AM (per your more-authoritative source); easy single-line change if the shop confirms 11 AM.
- Hero background: CSS texture/gradient now; can swap in a generated/real interior photo later.

## Out of scope (per brief recommendations, can add later)
- Real interior photos, barber headshots, gallery
- "Our Team" bios section
