# Stripe Embedded Checkout (in-page modal)

Replace the current iframe approach (which Stripe blocks) with Stripe's official **Embedded Checkout** — the card form renders directly inside a modal on your site. No new tab, no leaving your brand. We'll use your existing Stripe **Price** for the gift card.

## How it works
1. A small secure backend endpoint creates a Stripe Checkout Session (embedded mode) using your Price ID and your secret key, and returns a `client_secret`.
2. The "Buy a Gift Card" button opens a modal. Stripe.js (loaded from a `<script>` tag — no npm packages) mounts the official payment form inside that modal using the `client_secret`.
3. After payment, the customer sees Stripe's confirmation right inside the modal and stays on your site.

## What I need from you (during build)
- **Stripe Price ID** — looks like `price_xxxxxxxxxxxx` (found in Stripe Dashboard → Products → your gift card → Pricing).
- **Stripe Secret key** — `sk_live_...` (Dashboard → Developers → API keys). I'll prompt you to paste it into a secure secret store; it's never put in the code or sent to the browser.

## Implementation steps

1. **Enable the backend** (Lovable Cloud) so we can run server code and store the secret key securely.

2. **Store the secret key** as `STRIPE_SECRET_KEY` via the secure secrets prompt.

3. **Create a server endpoint** (`src/routes/api/create-checkout-session.ts`) that:
   - Calls Stripe's REST API (`/v1/checkout/sessions`) with `ui_mode=embedded`, your Price ID, `mode=payment`, and a `return_url`.
   - Returns `{ clientSecret }` to the browser.
   - Uses `STRIPE_SECRET_KEY` from the server environment (calls Stripe over HTTPS with `fetch` — no Stripe SDK / npm package needed).

4. **Add a checkout return route** (`src/routes/checkout-return.tsx`) that confirms the session status and shows a success/processing message.

5. **Rewrite `GiftCardButton.tsx`** to:
   - Keep the existing outline button + `Gift` icon and the dark-backdrop centered modal (full-screen on mobile, ~520×700 on desktop) with the close (X) button.
   - On open: load `https://js.stripe.com/v3/` (once), call the new endpoint for a `client_secret`, then `stripe.initEmbeddedCheckout({ clientSecret })` and `.mount()` into a div inside the modal.
   - Clean up / `destroy()` the embedded instance when the modal closes.
   - Show a loading spinner while the form initializes.

6. Leave the two existing button placements (Services section + footer CTA) and all current styles/layout untouched.

## Technical notes
- Publishable key (`pk_live_...`, already known) is safe in client code; the secret key stays server-only.
- No Stripe npm packages are installed — Stripe.js comes from the script tag and the backend talks to Stripe's REST API via `fetch`.
- The endpoint validates input and only ever uses the fixed Price ID server-side, so the amount can't be tampered with from the browser.
