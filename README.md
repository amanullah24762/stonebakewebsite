# Stone Bake Pizza

A complete responsive restaurant website built with Next.js App Router, TypeScript, React, Tailwind CSS v4, Framer Motion, and Lucide icons.

## Run

```sh
npm install
npm run dev
```

Visit http://localhost:3000. Production: `npm run build && npm start`.
Validation: `npm run typecheck` and `npm run lint`.

## Pages and features

Home, Menu, About, Offers, Gallery, Reviews, Contact, and Order. Search and category filtering, persistent cart with quantity controls, customer checkout, WhatsApp order handoff, contact form via WhatsApp, mobile navigation, accessible cart dialog, reduced-motion support, Next Image optimization, Google font optimization, page metadata, Open Graph, and restaurant structured data.

## Content to confirm before launch

Prices, portion sizes, deal contents, and promotions in `lib/menu.ts` are samples, clearly labeled in the UI. Customer testimonials are illustrative and labeled as such; replace them with verified reviews. All photography is illustrative Unsplash photography, including kitchen and interior shots; replace with the restaurant's own images. Opening hours and an exact street address were not supplied, so the site invites users to confirm them and uses a Google Maps search for the supplied location. No unverified social accounts have been invented; WhatsApp is the live social contact.

The phone is the supplied 0325-6120333. WhatsApp links use +923256120333. Orders are requests sent through WhatsApp, not backend transactions; customers must send the composed message and wait for restaurant confirmation. Delivery fees, availability, final prices and timings are confirmed by the restaurant. Cart data is local to the browser; personal checkout information is not persisted.

## Architecture and future backend

- `lib/menu.ts`: typed catalog, deals, currency and WhatsApp helpers; replace static exports with a database repository/API.
- `components/site-shell.tsx`: shared navigation, footer, cart provider, checkout and persistence.
- `components/sections.tsx`: reusable animated sections, menu cards and contact form.
- `app/page.tsx`: homepage composition.
- `app/[page]/page.tsx`: statically generated informational pages with page-specific metadata.
- `app/globals.css`: brand tokens, responsive visual system and Tailwind integration.

For an admin dashboard, add authenticated `/admin` routes and server-side menu/order repositories. Validate catalog prices, quantities and customer input on the server when implementing order persistence; never trust localStorage or client totals. WhatsApp is intentionally the only current submission mechanism. Add the final production domain to metadata and create sitemap/robots rules when deployment URL is known.

## Deployment

Deploy to a Node.js hosting provider supporting Next.js (Node 20.9+), or import this repository into Vercel. Google Fonts are downloaded during build. Food photographs are stored locally in `public/images` and optimized by Next.js; original Unsplash URLs are recorded in `public/images/sources.json`. Google Maps embeds need network access. No API keys are required for the present implementation.

Browser smoke test: start the dev server, then run `npm run test:smoke` (requires Google Chrome). It checks all routes, search, filtering, cart persistence, quantity totals, mobile navigation, and WhatsApp message composition without actually sending an order.
