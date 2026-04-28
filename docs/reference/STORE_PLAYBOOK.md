# Store Playbook — Build Spec for the Multi-Tenant Storefront Engine

**Authoritative reference for evolving `paragu-ai-builder`'s `retail-local` vertical to professional / world-class standards.**

Synthesizes three research streams:
1. Deep audit of the two live retail tenants (`fun4me`, `viajero-comercio`)
2. Pro page anatomy (homepage / PLP / PDP / cart / checkout / account / search / static / popups / blog) — Baymard, NN/g, Shopify Polaris + ~25 best-in-class store dissections
3. Industry playbook — IA, faceted filtering, sort, search, trust, performance, a11y, mobile, conversion uplift, LATAM/MERCOSUR specifics, differentiators

Sources: Baymard Institute 2025 benchmarks (~16,000 manually scored UX elements across 180+ stores), NN/g, Algolia, Shopify research, Google Search Central, WCAG 2.2 / EAA. Exemplars dissected: Allbirds, Glossier, Warby Parker, Bombas, Casper, Gymshark, Aesop, Apple, Best Buy, B&H, Crutchfield, Wayfair, IKEA, West Elm, Williams-Sonoma, Goldbelly, Magic Spoon, Death Wish Coffee, Rapha, Patagonia, Lululemon, Outdoor Voices, Mejuri, Brooklinen, Faherty, REI, Grainger, McMaster-Carr, Etsy, Amazon, Mercado Libre, Falabella, Linio, Liverpool MX.

**Headline finding (Baymard):** 58% of desktop sites and 67% of mobile sites perform "mediocre or worse" on navigation alone. 76% of major sites have filter usability issues serious enough to cause abandonment. 95% fail to highlight the current top-level scope in mega-menus. The bar to be world-class is genuinely low — but the bar to be invisible to users (which is what good IA actually feels like) is high.

---

## Table of Contents

- [Part 1 — Tenant Deep-Analysis: fun4me & viajero-comercio](#part-1--tenant-deep-analysis-fun4me--viajero-comercio)
- [Part 2 — Pro Page Anatomy](#part-2--pro-page-anatomy)
- [Part 3 — Ecommerce Playbook (IA / Facets / Sort / Search / Trust / Perf / A11y / Mobile / Conversion / LATAM)](#part-3--ecommerce-playbook)
- [Part 4 — Amateur-vs-Pro: Top 15 Gaps](#part-4--amateur-vs-pro-top-15-gaps)
- [Part 5 — Prioritized Build-Spec for the Multi-Tenant Generator](#part-5--prioritized-build-spec-for-the-multi-tenant-generator)

---

# Part 1 — Tenant Deep-Analysis: fun4me & viajero-comercio

## 1.1 Side-by-side configuration

| Field | fun4me | viajero-comercio |
|---|---|---|
| Status | LIVE PRODUCTION (2026-04-21) | PRE-PRODUCTION |
| businessType | `sex_shop` | `viajero_comercio` |
| vertical | `retail-local` | `retail-local` |
| Public path | `/fun4me` | `/s/es/viajero-comercio` |
| Staging | `fun4me.sunstein.cloud` | n/a |
| Locale | `es-PY`, single locale | `es-PY`, single locale |
| Currency | PYG | PYG |
| Address | Herrera 875, Asunción | Av. Mariscal López 1234, Asunción |
| Hours | Mon–Fri 09–20, Sat 09–18, Sun closed | Mon–Fri 08–19, Sat 08–17, Sun 09–13 |
| Primary color | #9C27B0 purple | #1B5E20 dark green |
| Secondary | #E91E63 hot pink | #37474F charcoal |
| Accent | #FF4081 deep pink | #E65100 burnt orange |
| Typography | Poppins/Inter | Poppins/Inter |
| Payment provider | Pagopar (`PAGOPAR_*_FUN4ME`) | **Not declared** in site.json |
| Statement descriptor | `F4M COMERCIAL` (discrete) | n/a |
| Free shipping ≥ | Gs 200,000 | Gs 300,000 |
| National shipping | Enabled | **Disabled** (regional only) |
| Express shipping | Gs 50,000, 15:00 cutoff | Gs 30,000, no cutoff declared |
| Pickup | Yes (Herrera 875) | Yes (Mariscal López 1234) |
| Pages declared | 11 | 10 |
| Home sections | **16** | **10** |

## 1.2 Page composition

### fun4me — `home.json` (16 sections, in order)

1. `age-gate` (modal) — 18+ self-declaration, 30-day cookie, 24-month reverify
2. `promo-banner` (carousel)
3. `features` (three-col, alt bg)
4. `hero` (image, xl padding, light text)
5. `stats-counter` (inline, alt bg)
6. `trust-badges` (strip)
7. `trust-signals` (credentials)
8. `why-destination` (three-col)
9. `services` (cards) — product categories
10. `process-timeline` (horizontal)
11. `testimonials` (carousel)
12. `gallery` (grid)
13. `enhanced-faq` (searchable accordion)
14. `newsletter-signup`
15. `contact` (split)
16. `compliance-disclaimer-footer`

**11 declared pages**: home, blog, bundles, gift-cards, legal, loyalty, placer-plus, quienes-somos, reserva-en-tienda, size-guide, suscripciones.

### viajero-comercio — `home.json` (10 sections)

1. `promo-banner` (carousel)
2. `hero` (image, light text — Unsplash placeholder)
3. `stats-counter` (inline)
4. `features` (grid)
5. `commerce-catalog` (grid)
6. `blog-index` (grid) — "Tips y Consejos"
7. `gallery` (grid) — "Nuestros Productos"
8. `testimonials` (carousel)
9. `newsletter-signup`
10. `cta-banner` (gradient)

**`tienda.json` (5 sections)**: hero (minimal) → trust-badges → commerce-catalog → faq (accordion) → cta-banner.
**`productos.json` (3 sections)**: hero (minimal) → gallery → cta-banner.
**Nav (explicit)**: Home / Tienda / Productos / Blog / Ofertas / FAQ / Contacto.
**Blog categories**: camping, pesca, aventura, mantenimiento, consejos.

## 1.3 Feature matrix

| Feature | fun4me | viajero-comercio |
|---|---|---|
| Age gate (18+) | ✅ self-declared, 30d cookie, 24mo reverify | n/a |
| Product catalog | ✅ phase1 | ✅ |
| Wishlist | ✅ phase1 | ✅ |
| Reviews | ✅ phase2 | ✅ auto-moderated |
| Recently viewed | ❌ **gap** | ✅ |
| Bundles | ✅ phase1 | ❌ |
| Gift cards | ✅ phase1 | ❌ disabled |
| Subscriptions | ✅ phase3 | ❌ |
| Loyalty | ✅ phase3 | ❌ disabled |
| Referral | ✅ phase3 | ❌ disabled |
| Size guides | ✅ phase2 | ❌ |
| Discrete account names | ✅ phase2 | n/a |
| Discrete packaging | ✅ `neutral_no_logo` | n/a |
| Store pickup / reserve | ✅ phase4 | ✅ |
| Back-in-stock | ✅ | ✅ |
| Abandoned cart recovery | ✅ email + SMS via SendGrid | ✅ + WhatsApp reminder |
| WhatsApp click-to-chat | ✅ | ✅ |
| WhatsApp Business API | ❌ planned phase3 (360dialog) | ❌ |
| Live chat | ❌ planned phase3 | ❌ |
| Newsletter | ✅ SendGrid, opt-in required | ✅ provider not declared |
| Pagopar checkout | ✅ phase1 (creds pending) | ❌ unspecified |
| Invoicing / Timbrado | ❌ planned phase4 (Facture) | ❌ |
| Analytics | GA4 | not declared |
| **Search** | ❓ | ❓ |
| **Faceted filtering** | ❓ | ❓ |
| **Sorting** | ❓ | ❓ |
| **Related products / FBT** | ❌ | ❌ |
| **Breadcrumbs** | ❌ | ❌ |
| **Pagination** | ❓ | ❓ |
| **Quick view / quick add** | ❓ | ❓ |
| **Product comparison** | ❌ | ❌ |
| **Multi-language** | ❌ | ❌ (route prefix exists, unused) |
| **Guest-checkout flow** | ❓ undocumented | ❓ undocumented |
| **Order tracking page** | ❓ undocumented | ❓ undocumented |
| **Self-serve returns** | ❌ | ❌ |

## 1.4 fun4me-only specifics

**6 specialized email inboxes**: `general@`, `privacy@`, `returns@`, `legal@`, `compliance@`, `moderation@` — signals serious moderation ops for an adult vertical.

**Discretion stack** (regulatory-compliant adult retail):
- Packaging: `neutral_no_logo`
- Statement descriptor: `F4M COMERCIAL`
- Billing name: `Fun4Me Comercial`
- Invoice concept: `Articulo de salud y bienestar personal`

**Compliance disclaimer footer** explicitly the 16th section — regulatory necessity, unique to this vertical.

**Feature phasing (1–4)** declared, with explicit calendar; viajero-comercio has no phase declarations (binary on/off). Fun4me is more mature.

**Placeholder fields acknowledged in config**: custom domain, brand-partner logos (Satisfyer/LELO/We-Vibe), Pagopar merchant creds, RUC/Timbrado — all documented as pending.

## 1.5 Architectural oddities and risks

- **Route divergence**: `/fun4me` (path-only) vs `/s/es/viajero-comercio` (locale-prefixed). Two routing models for the same vertical → tech debt, inconsistent canonicalization, risk of duplicate-content SEO on whichever moves later.
- **Payment provider inconsistency**: fun4me declares Pagopar with per-tenant env vars; viajero-comercio declares no provider. Either inherited (undocumented) or broken.
- **fun4me lacks `recentlyViewed`**, but viajero-comercio has it. Pro stores ship it; this should be on by default for all retail tenants.
- **Newsletter opt-in divergence**: fun4me explicitly enforces opt-in; viajero-comercio undeclared → GDPR/CCPA/MERCOSUR-LGPD risk.
- **Self-declared age gate (24-month reverify window)**: weak by design. Fine for jurisdictional minimum but legal counsel should explicitly bless the cookie window.
- **Testimonials (curated)** vs **product reviews (UGC)** — both tenants treat them as separate sections, which is correct. Don't merge.

## 1.6 Common gaps across both tenants (build-spec backlog)

Both miss the **professional storefront floor**:
- **Search** (autocomplete, typo tolerance, synonyms, zero-result recovery)
- **Faceted filtering** (price, rating, availability, sale + per-vertical attributes)
- **Sorting** (relevance / bestseller / newest / price / rating / discount)
- **Breadcrumbs** with `BreadcrumbList` JSON-LD
- **Related products / FBT / "Complete the look"**
- **Recently-viewed rail across pages** (only viajero has it, only as a feature flag)
- **Sticky add-to-cart on PDP** (mobile + desktop)
- **Free-shipping progress bar** in cart and slide-out
- **Address autocomplete** (Google Places) at checkout
- **Express checkout buttons** in cart and PDP
- **Self-serve returns** with prepaid label
- **Order-tracking timeline** page (not "dump-to-courier-site")
- **Schema.org coverage** beyond `Store`: `Product`, `Offer`, `AggregateRating`, `BreadcrumbList`, `ItemList`, `FAQPage`, `Organization`, `WebSite` with `SearchAction`

Treat these as **engine-level upgrades**, not per-tenant. They land for both tenants the moment the section library and per-vertical config grow.

---

# Part 2 — Pro Page Anatomy

## 2.0 Cross-cutting foundations (every page)

Things mid-tier sites skip on at least one page; pros never do:

- **Persistent header**: logo (left), primary nav, search (always visible, never icon-only on desktop), account, wishlist, cart-with-count, currency/region switcher, free-shipping/promo announcement bar above.
- **Sticky utility on mobile**: bottom-nav (Home / Categorías / Buscar / Wishlist / Cart) OR sticky add-to-cart on PDP.
- **Footer** (4–6 columns): Shop, Help, Company, Legal, Connect + newsletter inline + payment-method icons + trust marks + locale/currency + social.
- **Breadcrumbs** on every page below homepage. `BreadcrumbList` JSON-LD always.
- **Skeleton loaders** instead of spinners; **optimistic UI** on add-to-cart.
- **Schema.org**: Product, Offer, AggregateRating, BreadcrumbList, Organization, FAQPage, Article, ItemList, Store/LocalBusiness.
- **Open Graph + Twitter cards** per page with product-specific images.
- **Accessibility**: focus rings ≥2px, ARIA on sliders/accordions, alt text on every product image, keyboard-navigable filters.
- **Performance**: LCP <2.5s, image CDN with AVIF/WebP + responsive srcset, lazy-load below-fold, preconnect to image CDN.

## 2.1 Homepage

A homepage is a **department-store window** — communicate brand positioning in 1 second, route traffic to PLP/collections, capture email. Not a feature dump.

**Above the fold**:
- Announcement bar — promo, free-shipping threshold, or shipping-cutoff countdown ("Pedí en 3h 12m para entrega miércoles").
- **Single hero** — one dominant image/video, one headline (value prop, not "Welcome to our store"), one primary CTA, optional secondary. Pros use ONE hero, not a 5-slide carousel. Baymard: rotating carousels see ~1% click rate on slides 2+.
- **Value-prop strip** — 3–4 icons: free shipping over X, free returns, warranty/guarantee, ethical/material claim.

**Mid-page (priority order)**:
- Featured categories / "Shop by" tiles (3–6, highest-CTR module on most homepages).
- Bestsellers / "Most loved" — 4–8 products with embedded social proof ("4.8 ★ · 2,341 reseñas").
- New arrivals — only if catalog refresh is frequent.
- Editorial / lookbook / "Shop the look" with image hotspots.
- Brand-story snippet, 1–2 sentences + "Nuestra historia" link. Not the founder's life story.
- Sale / promo block — only when there is one. Remove when not active.
- Press / "As seen in" logo strip.
- Testimonials / reviews carousel — pulled from real reviews, with names + photos.
- UGC / Instagram feed — shoppable if possible; strong for fashion/beauty/home, weak for B2B/electronics.
- Blog / editorial teaser — 3 latest posts. Only if blog is actively maintained.
- Newsletter capture inline (not just popup), with specific offer.

**What pros add that mid-tier omits**: locale-aware hero, returning-visitor personalization ("Welcome back" + recently-viewed strip), sticky free-shipping progress bar after first add-to-cart, LCP-optimized hero (preloaded, AVIF, no CLS).

**Exemplars**: Allbirds, Glossier, Warby Parker, Aesop, Patagonia, Casper, Brooklinen, Mejuri, Magic Spoon, Apple.

## 2.2 Category / Product Listing Page (PLP)

PLP is where conversion is won or lost — **42% of users sort/filter immediately on entry** (Baymard). Bad faceted nav kills sessions.

**Header zone**:
- Breadcrumbs (`Home › Mujer › Zapatos › Sneakers`).
- Category title + product count ("Sneakers — 142 productos").
- Optional category hero/banner.
- **Sub-category chips** ("Running · Lifestyle · Trail · Niños"), horizontally scrollable on mobile. Big UX win, mid-tier skips.
- Short SEO/intro copy above the grid (1–2 sentences) + long-form SEO copy collapsed at bottom.

**Filter rail (left desktop, drawer mobile)** — see [Part 3 §2](#32-faceted-filtering) for full prescription. In short: type-specific facets, multi-select, live counts, applied-filter chips, mobile bottom sheet with sticky "Mostrar X resultados".

**Sort + view controls**:
- Sort: Recommended / Bestselling / Newest / Price↑↓ / Top Rated. **Default = Recommended** (hybrid score). Never default to price-asc.
- View toggle: 2-up / 4-up grid on desktop; 1-up / 2-up mobile.
- Per-page selector (24/48/96), or Load More.

**Product card** — see [Part 3 §5](#35-product-card-anatomy) for the full anatomy.

**Pagination**:
- "Load more" + lazy-loaded next page (preserves back-button position, supports SEO via paginated URLs).
- Pure infinite scroll breaks the back button and footer access — only with a "View all" or paginated fallback.
- Numbered pagination at the bottom always present for SEO.

**No-results / empty state**:
- "No hay productos. Probá quitar [filtro]" with one-click filter removal.
- Suggested products / popular in this category.
- Search box.

**Bottom of page**:
- Long SEO copy (collapsed if long), internal links to related categories, FAQ block for the category.

**Pros add**: color swatches that swap card image inline · per-card size availability · "Recently viewed" rail at bottom of PLP · saved-filter / "Notify when back in stock" hooks per card · category-specific facets (not the same generic 5 across all categories).

**Exemplars**: Crutchfield (best-in-class facets), B&H, Wayfair, IKEA, REI, Lululemon, Faherty, Mejuri.

## 2.3 Product Detail Page (PDP)

The most content-dense page; pros stack ~15–20 distinct blocks.

**Above the fold (split layout — gallery left, info right on desktop)**:
- Breadcrumbs with category link back.
- **Gallery**: 5–10 images, hover zoom, click-for-lightbox, video thumbnail, 360° spin if applicable, AR view (Apple, IKEA, Warby), lifestyle + product-on-white + scale shot + detail shots. Mobile: swipeable carousel + pinch-zoom.
- Title (H1).
- Brand link (links to brand PLP).
- **Price**: current, compare-at strikethrough, savings %/amount, "from X" if variants vary, financing line ("o 6 cuotas sin interés de Gs 50.000").
- Rating summary: stars + count, anchor-link to reviews.
- Short description / value prop (1–2 sentences).
- **Variant pickers**: color (swatches with image-swap), size (with size-guide link, sold-out states ~~struck-through~~), other options. **Pre-select most popular / first-available** — never leave unselected.
- Quantity stepper.
- **Add to cart** primary, full-width on mobile.
- **Buy now / Express checkout** (Shop Pay, Apple Pay, PayPal, Google Pay, MercadoPago, Bancard wallet for PY).
- Wishlist + Share.
- **Stock indicator**: "En stock · Despacho en 1–2 días" / "Solo 3 disponibles" / "Pre-orden: despacha 15 mayo" / "Agotado: avisarme" with email capture.
- Shipping/returns micro-block: free-shipping threshold, ZIP-based ETA, free returns/exchanges, warranty.
- Trust badges: secure checkout, 1-year warranty.
- **Sticky add-to-cart bar** appears on scroll (mobile + desktop). 10–15% PDP conversion lift.

**Below the fold**:
- **Long description** in **accordions** (Baymard: tabs hide content from users who scroll; accordions win). Sections: Description, Materials/Specs, Care, Shipping & Returns, Sustainability/Story.
- Specifications table (electronics, appliances) — structured key-value.
- Size guide modal: measurements + how-to-measure + body-type guidance. Critical for fashion.
- "Complete the look" / cross-sell — outfit completers, accessories, bundles.
- "Frequently bought together" — Amazon-style bundle with combined discount. Amazon attributes 35% of revenue here.
- **Reviews block**:
  - Aggregate stars + distribution histogram.
  - Filter by rating / with-photos / verified-purchase / size-fit ("runs small/true/large" slider summary).
  - Sort by recent / helpful / rating.
  - Individual review: stars, title, body, photos/video, reviewer name, verified badge, size purchased, fit/quality scales, "helpful" voting.
  - Merchant responses on negative reviews.
- **Q&A section** — community questions answered by brand or other customers.
- Related products ("Te puede gustar") — 4–8 items.
- Recently viewed — bottom rail.
- Press quotes / editorial mentions for hero products.
- Sustainability / impact block for mission-driven brands.
- FAQs specific to product.
- Schema.org: `Product` + `Offer` + `AggregateRating` + `Review` markup.

**Pros add**: ZIP-based delivery ETA · fit/size sentiment summary aggregated from reviews · review filtering + photos · AR / 3D view · structured "notify me" backorder UX · cross-sell that's actually relevant (not just "more from category") · sticky CTA on desktop, not just mobile.

**Exemplars**: Apple (best-in-class), Crutchfield, Warby Parker, Allbirds, Glossier, Casper, Bombas, Gymshark.

## 2.4 Cart

Cart is a **review + reassurance** page. Job: get them to checkout without second-guessing. Not a sales page.

- **Slide-out mini-cart** triggered on add-to-cart: thumb, title, variant, qty, price, remove, subtotal, **View Cart** + **Checkout** buttons, free-shipping progress bar, 1 cross-sell upsell.
- **Full cart page**:
  - Line items: image (link to PDP), title, variant, qty stepper, unit + line price, remove, save-for-later/move-to-wishlist.
  - Editable variants inline (change size without removing).
  - Inventory warnings ("Solo 2 disponibles").
  - **Free-shipping progress bar** ("Te faltan Gs 23.000 para envío gratis").
  - **Promo / gift-card code field collapsed by default** — pros hide; visible promo fields trigger "I should look for a code" abandonment (Baymard).
  - Order summary: subtotal, estimated shipping (with ZIP estimator), estimated tax, discount, total.
  - Shipping estimator: ZIP/country → method options + ETA.
  - Trust strip: secure checkout, accepted payments, return policy.
  - Upsell rail: "Frecuentemente agregado con esto".
  - Checkout CTA sticky on mobile, prominent on desktop. **Express checkout buttons** (Shop Pay, PayPal, Apple Pay, Google Pay, MercadoPago Wallet) above or beside.
  - Continue-shopping link, secondary.
  - Persisted cart across devices for logged-in users.
  - Abandoned-cart email/SMS/WhatsApp trigger (backend).

**Pros add**: save-for-later (separate from wishlist) · free-shipping progress bar · inline variant edit · suppressed promo field (link only: "¿Tenés un código?") · express-checkout buttons in cart · cart-recovery via email/SMS/WhatsApp within 1–24h.

## 2.5 Checkout

Baymard's gold standard: **single-page or 3-step accordion**, guest checkout enabled, ~12–14 form fields max.

- **Header**: logo (links back to cart, NOT homepage), secure-checkout badge. Strip nav/footer to remove exit paths.
- **Progress indicator**: 1) Información 2) Envío 3) Pago (or single-page accordion).
- **Guest checkout DEFAULT**, with "Iniciar sesión" link top-right and "Crear cuenta" as a checkbox at the end (not a barrier).
- **Email first** (so abandoned-cart recovery works).
- **Shipping address** with autocomplete (Google Places). Country first, then dynamic state/region. Single full-name field. Phone with rationale ("para actualizaciones de envío").
- **Shipping method**: options with price + ETA, default to cheapest with shipping date shown.
- **Payment**: card (with inline validation, card-type detection, autoformatted number), Apple/Google/Shop Pay, PayPal, Klarna/Afterpay/Affirm equivalents (LATAM: BNPL via Bancard cuotas, MercadoPago Cuotas). Save-card option.
- **Billing**: "igual al envío" checked by default.
- **Order summary** sticky on right (desktop), collapsible on mobile with running total always visible: line items with thumbs, subtotal, shipping, tax, discount, total. Edit-cart link.
- Promo code collapsed.
- Trust badges: SSL, payment-network logos, money-back guarantee, return policy.
- **Inline error handling**: validate on blur, never lose entered data on submit error, scroll to and highlight the failing field, plain-language messages ("Tarjeta rechazada — probá otra").
- **Mobile-specific**: 44px+ tap targets, correct input types (`tel`, `email`, `numeric`), `autocomplete` attributes on every field (`cc-number`, `postal-code`, `tel`, etc.), native pickers, no "select country" dropdown if shipping is single-country.
- **Order confirmation page**: order number, summary, ETA, tracking-when-available, account-creation prompt (one-click since email known), social share / refer-a-friend, related products / "while you wait".
- **Confirmation email** within 60s with the same info.

**Pros add**: address autocomplete · Shop Pay / Link / one-click for returning users · ZIP-based ETA shown BEFORE checkout · field-level autocomplete attributes · account-creation post-purchase, not pre.

## 2.6 Account / Order pages

- **Dashboard**: greeting, recent order status, quick-links (track, return, reorder), reward/loyalty balance, recommended products.
- **Order history**: list with status, total, items thumb. Click → order detail.
- **Order detail**: items, totals, shipping address, payment method (last 4), tracking link with carrier, invoice download (PDF — Timbrado for PY), reorder button, return/exchange button, contact-support button.
- **Tracking**: in-app timeline (Pedido → Empacado → Despachado → En camino → Entregado) + carrier link.
- **Returns/exchanges**: self-serve flow — pick items, reason, refund vs exchange vs store credit, prepaid label generation.
- **Addresses**: CRUD, default shipping/billing.
- **Payment methods**: saved cards (tokenized), default.
- **Wishlist(s)**: multiple lists, share-link, move to cart, notify on sale/back-in-stock.
- **Subscriptions** (if applicable): pause, skip, swap, change frequency, change address, cancel without fighting.
- **Profile**: name, email, phone, password change, communication preferences (granular: order, marketing, SMS, WhatsApp).
- **Reviews-to-write** prompt for past orders.
- **Loyalty / rewards** page if program exists.

**Pros add**: self-serve returns with prepaid label · reorder-with-one-click · granular notification preferences · multiple wishlists / shareable lists.

**Exemplars**: Amazon, Sephora, Nike, REI.

## 2.7 Search

Search converts at **2–3× the rate of browse** for users who use it. Investment here pays.

- **Predictive autocomplete** with: product results (with thumb, price), category suggestions, content/article suggestions, popular searches, recent searches (per user).
- Typo tolerance / fuzzy matching (Algolia, Klevu, Searchspring, Typesense, or native pg_trgm).
- Synonyms (sneakers = trainers = kicks; in PY Spanish: `remera ↔ camiseta ↔ playera`, `cartera ↔ bolso`).
- Search-as-you-type with debounce (~150ms).
- **Results page**: same layout as PLP (filters, sort, cards) + query echoed in title, "X resultados para 'Y'", spelling correction ("¿Quisiste decir…?" / "Mostrando resultados para [corrected]. Buscar [original]").
- **No-results page**: spelling suggestions, popular categories, popular products, browse all, contact-us link. NEVER a dead end.
- Voice search on mobile (use `<input type="search">` with `webkitspeech` or button).
- Search analytics backend: log queries, no-results queries, click-through, conversion-by-query.

**Pros add**: recent + popular searches in autocomplete · content/blog results in search · no-results recovery · synonym dictionary and merchandising rules per query.

**Exemplars**: Sephora, Best Buy, Amazon, ASOS, Mercado Libre.

## 2.8 Static / Policy Pages

These are trust pages. Pros polish them; mid-tier dumps wall-of-text.

- **About** — mission, founder story, team, values, press, careers link, sustainability/impact. Hero image, narrative not bullet list, photos of real people.
- **Contact** — phone (with hours), email, WhatsApp/chat, contact form (subject dropdown so it routes), physical address + map, response-time expectation, social links.
- **Shipping policy** — table by region with method × cost × ETA, cutoff times, holidays, international, signature required, lost-package process.
- **Returns / refunds** — window, condition (unworn/tags), free vs paid, exchange path, refund timing, process steps, exclusions, link to start a return.
- **FAQ** — categorized accordions, search, with `FAQPage` schema.
- **Privacy** — GDPR/CCPA/MERCOSUR-LGPD compliant, last-updated date, cookie policy linked.
- **Terms** — legal but readable, last-updated.
- **Size guide** — per category, measurements in cm + in, how-to-measure with diagram, fit guidance, model wears size, body-type recommendations.
- **Store locator** — map + searchable list with hours, phone, services, "Cómo llegar", in-store inventory if integrated.
- **Care guide** — material-specific care.
- **Accessibility statement** — WCAG conformance, contact for issues.
- **Sustainability / impact report** — for mission brands.
- **B2B / wholesale** — application form, MOQ, pricing tier, terms.

**Exemplars**: Patagonia (sustainability + repair guides), Apple (specs + accessibility), Allbirds (impact reports).

## 2.9 Email Capture / Popups

- **Welcome popup**: appears on 2nd page or after 15–30s on first page (not immediately — Baymard + GDPR friction). Offer: 10–15% off first order, early access, or content.
- **Exit-intent** on desktop (mouse leaves viewport top) — single trigger per session, persistent dismissal.
- **Scroll-triggered** inline forms in footer + after blog content + on PDP after reviews.
- **GDPR/CCPA/LGPD**: explicit checkbox (not pre-checked) for marketing consent, separate from purchase. Cookie banner with reject-all option (not just "accept").
- **SMS capture** — separate consent, double opt-in.
- **Back-in-stock** subscriptions per product/variant.
- **Price-drop alerts** for wishlisted items.
- **Don't show popup** to: returning subscribers, in-checkout, on policy pages.

## 2.10 Blog / Content

Worth investing IF: niche allows (fashion/beauty/food/outdoor yes; commodity/B2B-spec less), and there's editorial commitment (≥2 posts/month).

- **Blog index**: hero featured post + grid of recent + categories/tags + search + newsletter inline.
- **Article page**: H1, byline, date, reading time, hero image, table of contents (long posts), body with images and embedded products ("compra el look" inline), related products module, related articles, comments (optional), share buttons, newsletter inline, author bio at bottom.
- Schema.org `Article` + `Author`.
- **Categories**: How-to / Buying guides / Behind the scenes / Customer stories / Lookbook / Editorial.
- **Buying-guide pages** are the highest-ROI content — they rank for high-intent keywords and route to filtered PLP. ("Mejores cañas de pescar para río" → links to filtered PLP.)
- **Lookbooks** with shop-the-look hotspots — fashion/home gold.

**Pros add**: buying guides that route to filtered PLPs · shoppable hotspots in editorial imagery · author profiles + topic-cluster internal linking for SEO.

---

# Part 3 — Ecommerce Playbook

## 3.1 Information Architecture & Taxonomy

### Category trees
- **Depth: 3 levels max.** Root → category → subcategory. Anything deeper is a filter, not a category.
- **Breadth: ~7 top-level categories.** Above ~10, users scan instead of recognize. Subdivide chunks beyond 10 (60% of sites get this wrong).
- **Min ~10 products per leaf node.** Empty leaves destroy trust.
- **Every leaf must have a viable PLP.** No "category of one."

### "Shop by X" axes
Pros expose the same catalogue under multiple mental models. Pick 2–4 axes per tenant:

| Axis | When to use | Examples |
|---|---|---|
| Type (product family) | Always | "Zapatos", "Carpas", "Juguetes" |
| Use / Occasion | Fashion, gifts, beauty, food | "Para trabajo", "Boda", "Para regalo" |
| Brand | Multi-brand catalogue (>5 brands) | "Nike", "Local artisans" |
| Audience | Apparel, beauty, gifts | "Mujer", "Hombre", "Niños" |
| Price tier | Mass / value catalogues | "Bajo Gs 100k" |
| Collection / Theme | Seasonal, drops, lifestyle | "Verano 25", "Eco" |
| Recipient | Gifts, jewelry | "Para mamá", "Para él" |

**Implementation rule**: axes are **tags layered over a single canonical category tree**; never duplicate categories per axis (kills SEO via dupes).

### Mega-menu vs flat vs sidebar
- **Mega-menu** (hover dropdown) — dominant pattern, 88% of top stores. Use when ≥3 categories with subcategories.
- **Flat top-bar** (no dropdown) only when total leaves ≤8 (Allbirds, Glossier-style).
- **Left sidebar nav** is *only* appropriate inside a category PLP, never as primary site nav (B2B/marketplace exception).

### Mega-menu critical details (Baymard — sites fail constantly)
- **Hover delay 300–500ms** before opening — 61% don't, causing accidental flickers between sibling menus.
- **Make the category header itself clickable** to a parent landing page — 33% don't.
- **Highlight current top-level scope** with color/weight in nav — **95% don't** (worst-violated rule in the industry).
- **Show subcategory thumbnails** in the dropdown for visual catalogues — 55% don't or use bad ones.
- **Don't nest the entire catalogue under a single "Shop" item** — 37% do. Wrong unless catalogue is genuinely tiny.

### Mobile navigation
- Hamburger top-left opening a full-height drawer — universal pattern.
- **Bottom tab bar** (5 icons: Home, Categorías, Buscar, Wishlist, Cart) for app-like stores or large catalogues. Lifts mobile conversion ~10–15% via thumb-zone ergonomics.
- Sticky search bar at the top of the drawer.
- **Full-scope link text** on mobile — say "Mujer / Vestidos" not just "Vestidos" — 59% of sites fail.

### Breadcrumbs
- Mandatory on every PLP and PDP. Hierarchical (location-based), not history-based.
- Top-left, just under header, before H1.
- Last crumb non-clickable, marked `aria-current="location"`.
- Truncate middle on mobile (`Home › … › Vestidos › Casuales`).
- Always emit `BreadcrumbList` JSON-LD — earns the breadcrumb display in Google SERP.

### Category landing pages
- Above-the-fold: category H1 + 100–200 word SEO copy + grid of sub-category tiles with thumbnails.
- Below: featured products from inside the category, then full PLP grid OR "browse subcategory" CTA.
- Don't dump 500 products at root — make users pick a sub-scope first if catalogue is large.

## 3.2 Faceted Filtering

**76% of major sites have filter usability issues serious enough to cause abandonment.** Sites with mediocre filtering see 67–90% PLP abandonment vs 17–33% for optimised sites. Single highest-leverage area.

### Standard facets per vertical (minimum set)

**Universal floor (every category)**: Price (range slider + manual input), Rating (4★+), Availability (in-stock toggle), On-sale toggle.

| Vertical | Add these |
|---|---|
| Apparel | Size (expanded by default), Color (visual swatches), Brand, Material, Gender, Fit, Length |
| Footwear | Size, Width, Color, Material, Style, Brand |
| Beauty | Skin type, Concern, Ingredient, Cruelty-free, Vegan, Shade family, Brand |
| Electronics | Brand, RAM, Storage, Screen size, Connectivity, Color |
| Home & Furniture | Room, Style, Material, Dimensions (range), Color, Assembly, Lead time |
| Food & Grocery | Diet (vegan/gluten-free), Brand, Pack size, Origin |
| Tools / Hardware (e.g. viajero-comercio) | Brand, Material, Power source, Pickup availability, Use case (camping/pesca/auto/moto) |
| Adult retail (e.g. fun4me) | Type (toy/lingerie/wellness), Material, Brand, Discreet packaging filter, Compatible-with |

### UI patterns (prescriptive)
- **Desktop**: persistent left sidebar, always visible, never collapsed.
- **Mobile**: "Filtrar y Ordenar" sticky button → opens **bottom sheet** (or full-screen drawer for many facets) with sticky **"Mostrar X resultados"** button at bottom that updates dynamically.
- **Multi-select within a facet (OR)**, AND across facets. Never radio-buttons for color/size/brand.
- **Show match count next to every value** ("Azul (34)") — Baymard: "one of the single highest-impact improvements."
- **Disable values that would yield zero, don't hide them** — gray-out + count "(0)". Hiding makes the user think your catalogue is missing options.
- Progressive disclosure: top 5–7 values per facet, "Ver más" reveals the rest.
- **Range sliders dual-handle + numeric inputs** for price/dimension. Slider alone is not accessible.
- **Color = swatch chips, not text.** Tooltip with color name for a11y.
- **Size = pill grid, not checkboxes** in apparel.
- **Star rating = visual stars + "y más"**, not "≥4.0".
- **Real-time updates on desktop, explicit Apply on mobile.** Mobile real-time refresh is disorienting.

### Applied filter chips
- Always render above results as removable chips ("Color: Azul ✕"). 20% of sites fail to keep applied filters visible.
- "Limpiar todo" action visible whenever ≥1 filter is applied.
- Active filter count badge on the mobile filter button.

### URL & SEO for filters (Google's actual guidance)
- **Filter state in query params**: `/tienda/vestidos?color=azul&size=m`. Never hash fragments (Google ignores them, breaks back-button + share).
- **Self-referencing canonical** on filter pages you want indexed (e.g., `?color=red` on a high-value brand+color combo); **canonical to base PLP** for combinations you don't want indexed.
- **`noindex, follow`** on multi-facet filter combinations to avoid index bloat. DO NOT combine `noindex` with `disallow` in robots.txt.
- **Block sort and view params in robots.txt**: `?sort=`, `?view=`, `?per_page=` — duplicate content with zero search value.
- **Per-facet decision tree**: Brand+Category combos = index. Color+Category = index if high-volume queries exist. 3+ facets stacked = noindex,follow.

### Common Baymard failures to actively avoid
- Forcing single-select (radio) for size or color
- Filter labels that mirror internal taxonomy ("SKU_attr_color") instead of customer language
- Filters returning zero results without graceful suggestion ("Quita un filtro: …")
- Inconsistent labels across categories ("Colour" here, "Color" there)
- Hiding filter counts
- Dropping all filters when user paginates or back-navigates

## 3.3 Sorting

### Standard options (in this order)
1. **Relevance / Recommended** (default — engineered, see below)
2. Bestsellers
3. Más nuevo (Newest)
4. Precio: menor a mayor
5. Precio: mayor a menor
6. Mejor valorados (Top rated)
7. Mayor descuento — only on sale pages

**Don't ship alphabetical.** It helps no one.

### Default sort
- "Recommended" = a hybrid score: `bestseller_rank × in_stock × margin_factor × freshness_decay`. This is what Amazon, Sephora, Nordstrom all do under the hood.
- **Never default to price ascending** — anchors users on cheapest-perceived-value items, kills AOV.
- Fallback: **Bestselling** is the best non-personalized default.
- Promote items with ≥4.0 rating and review count >threshold to top of default sort.

### Per-vertical tweaks
- **Apparel**: default = Newest during drops/seasons; Bestselling rest of year.
- **Electronics / appliances**: default = Top rated.
- **Food / consumables**: default = Bestselling or by repurchase rate.
- **B2B / wholesale**: default = SKU/code + sortable.

### Sort UI
- Dropdown top-right of PLP (desktop). Mobile: inside the same Filter sheet under "Ordenar" header, single-select pill list.
- **Persist sort in URL** (`?sort=price-asc`) so it's shareable and back-button safe.

## 3.4 Search

Where mid-tier stores fall apart fastest. Bad search → user leaves to Google.

### Autocomplete (mandatory)
- Trigger at 2 chars, debounce ~150ms.
- Order in dropdown: suggested queries (4–5) → matching categories ("en Vestidos (124)") → product hits with thumb + name + price (4–8) → content/blog hits (1–2) → "Ver todos los resultados →".
- Thumbnails non-negotiable in autocomplete for visual verticals.
- Highlight the matched substring in suggestions.

### Tolerance & language
- Typo tolerance: Levenshtein ≤2 for terms ≥4 chars ("vesitdo" → vestido).
- Stemming + lemmatization in Spanish (zapatos = zapato).
- **Synonyms** manual + auto: `remera ↔ camiseta ↔ playera`, `pantalón ↔ pants`, `cartera ↔ bolso`. Multi-region Spanish is critical for LATAM — rural PY users say different words from Asunción urbanites.
- Diacritic-insensitive (`bañera` = `banera`).
- Brand variants (`L'Oréal` = `loreal`).

### Zero-results page (sites bomb here)
Never show "0 results." Show:
- Recognition: "No encontramos coincidencias para 'X'."
- "¿Quisiste decir 'Y'?" (Did-you-mean from typo correction)
- Top categories
- Bestsellers
- Search box pre-filled to edit

### Search results page (SERP)
- Treat as a PLP — same filters, sort, card layout.
- Show query + result count + "Resultados para 'X'" header.
- Search-specific filters: Category facet appears at top of facet list when search spans categories.
- Personalised re-ranking by browse/purchase history if user is logged in.

### Surfacing
- "Búsquedas populares" when search input is focused but empty.
- "Búsquedas recientes" for returning users (localStorage).
- Save zero-result queries → analytics → fix synonym dictionary monthly.

### Voice / visual search
- Visual search is competitive differentiator (25–40% higher conversion on visual-search traffic in fashion/home). Defer until AI infra + a fashion/home tenant.
- Voice is overrated for ecommerce — surface only if integrated with native platform speech.

## 3.5 Product card anatomy

Components, in priority order:

1. **Primary image** (square or 4:5 portrait, never landscape for product). `object-fit: cover`, neutral or white background.
2. **Hover image** (alt angle/lifestyle) on desktop. Mobile: tap to swipe carousel of 2–3 images.
3. **Badges, max 1 visible** at a time (top-left): `Nuevo`, `-20%`, `Agotado próximo`, `Bestseller`. Multiple badges = no badges.
4. **Brand** (small, muted) above name. Skip if single-brand store.
5. **Product name**, max 2 lines, ellipsis after.
6. **Price block**: current price (bold) + original price strikethrough + discount % if on sale. Show installment line: "o 6x Gs 50.000".
7. **Rating**: stars + count `(34)`. Hide if <5 reviews — empty stars worse than no stars.
8. **Color swatches** (interactive): up to 4 visible + "+3" overflow. Hovering/clicking swatch updates the image inline. **Baymard: 57% of sites fail to expose all swatches on mobile** — make them horizontally scrollable.
9. **Size availability** (apparel only): "S, M, L, XL" pill row, grayed out if out of stock per size.
10. **Wishlist heart** top-right, visible on desktop hover, always visible on mobile.
11. **Quick-add** button on hover (desktop): "+ Agregar". Mobile: dedicated icon button. Skip if product requires variant selection — opens a quick-view drawer instead.

**Whole card clickable, but inner actions (wishlist, swatch, quick-add) stop propagation.** This bites engineers constantly.

## 3.6 Trust & Social Proof

Trust badges and reviews compound: a sound trust strategy delivers 20–30% conversion lift in year 1.

### Reviews (rank #1 trust lever)
- Display rating + count on PLP card, PDP, search result.
- **Products with ≥5 reviews are 270% more likely to convert** than zero-review. Seed reviews aggressively at launch — incentivize first 5 reviews per SKU.
- **Photo reviews**: customers seeing UGC on PDP convert 166% better. Surface a "Photos from customers" strip above written reviews.
- Sort/filter reviews: by rating, with-photos, verified-purchase.
- Show distribution histogram (5★: 67%, 4★: 22%, …).
- **Don't hide negative reviews.** A 4.7 with 1-stars feels real; a 5.0 with no negatives feels fake.
- Q&A section below reviews for high-consideration purchases (electronics, furniture).
- **Vendor options**: Yotpo (enterprise), Judge.me (Shopify SMB), Stamped (mid-market), Loox (photo-first). **Build native if multi-tenant** — third parties get expensive across N stores.

### Trust badges (placement matters)
- Header / sticky bar: free shipping threshold, return window. ("Envío gratis sobre Gs 500.000 · Devolución 30 días")
- PDP, near add-to-cart: payment icons, security lock, return policy link.
- Footer: payment icons full set, certifications, business registration (RUC for PY), shipping carrier logos.
- **Checkout, near pay button: SSL/secure-checkout badge** — boosts conversion up to 32% in tested isolation.

### Other social proof
- "X personas viendo esto ahora" — only if real.
- "Comprado por X clientes esta semana" — only if real.
- "As seen in" press logos in footer or above-fold of homepage.
- Instagram feed in footer or as dedicated section (auto-pulled, tagged products clickable). Mostly fashion/beauty/lifestyle.
- Testimonial blocks with face + name + city above-fold of homepage.

### Guarantees (above-the-fold of PDP)
- Free shipping threshold, clearly stated
- Return window (30 days minimum to be competitive)
- Money-back guarantee where applicable
- Secure-payment badge

## 3.7 Performance, SEO, Accessibility

### Core Web Vitals targets (Google's "Good")
- **LCP < 2.5s** (target 1.8s for store homepage / PLP / PDP)
- **INP < 200ms** (replace any third-party widget that pushes this)
- **CLS < 0.1** (reserve image space with width/height attrs; never inject banners after render)

A 1-second delay = 7% conversion loss. 53% of mobile users abandon at >3s load. **Currently only ~48% of mobile pages pass all three.**

### Image standards
- LCP image preloaded with `<link rel="preload" as="image" fetchpriority="high">` — typically the hero or first PLP product.
- `<img>` with `srcset` + `sizes` for responsive breakpoints. AVIF first, WebP fallback, JPEG last.
- Lazy-load everything below the fold (`loading="lazy"`).
- Always set `width` and `height` to prevent CLS.
- Product images: 1200px max source, served via image CDN with on-the-fly resize.
- CDN with edge caching for all static.

### Schema.org (JSON-LD, in `<head>`)
- `Organization` site-wide on homepage (logo, name, sameAs social URLs)
- `WebSite` with `SearchAction` (sitelinks search box in SERP)
- `BreadcrumbList` on every PLP and PDP
- `Product` on every PDP with: `name, image[], description, brand, sku, gtin13, offers (Offer with price, priceCurrency, availability, priceValidUntil, url, seller), aggregateRating (ratingValue, reviewCount), review[]`
- `ItemList` on PLPs with product references
- `FAQPage` on FAQ pages
- `Store` / `LocalBusiness` for tenants with physical presence (huge for LATAM SMBs)

Product schema with price + rating can lift CTR from SERP by 30%+.

### Sitemaps & robots
- `sitemap.xml` index referencing per-section sitemaps: `sitemap-products.xml`, `sitemap-categories.xml`, `sitemap-blog.xml`. Max 50k URLs per file, gzip.
- Submit via Search Console. Auto-regenerate on product CRUD.
- `robots.txt` allow all, disallow `?sort=`, `?view=`, `?per_page=`, `/cart`, `/checkout`, `/account`. Reference sitemap.

### WCAG AA essentials (mandatory — EAA in force in EU since June 2025; ADA risk in US; MERCOSUR following)
- **Contrast 4.5:1** body text, 3:1 large text + UI components.
- **Visible focus ring** ≥2px, 3:1 contrast vs background and vs unfocused state.
- **Focus must not be obscured** by sticky headers/cookie banners (WCAG 2.2 SC 2.4.11).
- All interactive ≥44×44px tap target.
- Form labels visible (`<label for>`); placeholder is NOT a label.
- Errors announced (`role="alert"`, `aria-describedby` linking error to input).
- `alt` text on all product images — generate as `{product.name} en {color}` if missing.
- Skip-to-content link at top of page.
- `aria-label="Breadcrumb"` on the breadcrumb nav, current crumb `aria-current="location"`.
- Keyboard: Tab order logical, Esc closes modals/sheets, focus returns to trigger on close.
- No autoplay video with sound.
- Language attribute on `<html lang="es-PY">`.

## 3.8 Mobile-specific

Mobile = 60–80% of LATAM ecommerce traffic. Design mobile-first, period.

- **Sticky add-to-cart bar** on PDP after scroll past primary ATC. 10–15% conversion lift typical, up to 20% on mobile-heavy stores. Bar contains: thumb, name, price, ATC button. Bottom-anchored, 50–55px tall.
- **Bottom navigation tab bar** for app-like feel (5 items, thumb zone).
- Swipeable product gallery on PDP with dot indicators. Pinch-to-zoom. Tap to fullscreen.
- Filter & Sort as bottom sheet with sticky "Mostrar X resultados" CTA.
- **One-tap payment**: Apple Pay, Google Pay, Shop Pay (where supported). LATAM: **MercadoPago Wallet, Pix QR for Brazil, Bancard wallet for Paraguay**. Express checkout above the form.
- **Click-to-call / WhatsApp button** floating bottom-right is *expected* in LATAM. Not desktop-style chat.
- Address autocomplete via Google Places — 2× form completion in LATAM where addresses are messy.
- Sticky search bar in header that collapses to icon on scroll.
- No hover state — every hover-only interaction must have a tap equivalent.

## 3.9 Conversion uplift patterns (with real impact data)

| Pattern | Typical lift | Notes |
|---|---|---|
| **Free-shipping threshold + dynamic progress bar in cart** | AOV +20–40%; orders +90% (NuFace) | 81% will add to cart to hit threshold. Set ~30–40% above current AOV. |
| **BNPL (Klarna/Afterpay/Mercado Pago Cuotas/Bancard cuotas)** | Conversion +20–35%, AOV +15–40% | Per-tx fee 4–6%; only worth it if AOV > Gs 200k. In PY: cuotas via Bancard already standard. |
| **Reviews + photo UGC** | Conversion +166% with photos | Highest ROI of any single feature. |
| **Trust badges at checkout** | Conversion +32% | Highest impact at the pay step. |
| **Live chat / WhatsApp** | Conversion +40% | LATAM standard. |
| **Sticky ATC mobile** | +10–15% PDP conversion | See §3.8. |
| **Real-time scarcity** ("Solo 3 disponibles") | +18–32% conversion when truthful | **Fake scarcity** destroys trust within 2–3 visits, drops repeat 41%. **Only when real.** |
| **Countdown timers** (real deadlines) | Up to 300% on isolated promos | Reset timers = brand poison. |
| **Cart abandonment exit-intent popup** | Recovers 13.5% of abandoners | With a coupon. ~3–7% capture. |
| **Cart abandonment email sequence** | 10–20% of abandoned carts recovered | 3 emails: 1h, 24h, 72h. |
| **Frequently bought together (PDP)** | +10–30% revenue | Amazon attributes 35% of revenue here. |
| **Post-purchase upsell (thank-you page)** | AOV +5–6%, ~4% conversion | One-click, no re-checkout. |
| **Bundles ("Compra el look")** | AOV +15–25% | Fashion/beauty especially. |
| **Wishlist** | Repeat-purchase lift; longer-term LTV | 40% of shoppers want it; surface "back in stock" notifications from wishlist. |
| **Free returns (vs paid)** | Conversion +20–30% | Returns hurt margin but absent free returns kills the first sale. |

## 3.10 Internationalization — LATAM / Spanish / MERCOSUR-specific

### Currency & pricing
- **Tax-inclusive pricing displayed.** LATAM consumers expect sticker price = what they pay (IVA included, like EU). Show "IVA incluido" inline.
- Local currency primary: PYG, ARS, BRL, CLP per tenant. No multi-currency switcher unless cross-border.
- **Number format locale-aware**: `Gs 1.500.000` (period thousands, no decimals for PYG; comma decimals for BRL/ARS).
- **Installments line** under price ("o 6 cuotas sin interés de Gs 50.000") — table stakes in LATAM.

### Address forms (LATAM differences from US)
- Not "State + Zip" — use **Departamento / Provincia / Estado** + **Ciudad** + **Barrio** (PY/UY) or **Bairro** (BR).
- Postal code optional (often unused in PY rural, mandatory in BR/CL).
- **CI / RUC / CPF / CNPJ** field for invoice (Timbrado in PY) — mandatory if invoicing.
- House-number-after-street ("Av. Mariscal López 1234") not before.
- Reference field ("Referencia: frente a la plaza") expected in PY/MX rural.
- **WhatsApp number = primary contact**, not email.

### Payment rails (LATAM)
- **Brazil**: Pix (84% adoption) + credit card with cuotas + Boleto (still ~10–15%).
- **Argentina**: Mercado Pago + tarjeta + Pagos en Efectivo (Pago Fácil, Rapipago).
- **Chile**: Webpay + Khipu + tarjeta + cuotas.
- **México**: Mercado Pago + OXXO + SPEI + tarjeta.
- **Paraguay**: Bancard (cards + cuotas), **Pagopar** (multi-rail aggregator — primary for `paragu-ai-builder`), Tigo Money / Personal Wallet, transferencia bancaria, dLocal/EBANX for cross-border (Phase 2).
- **Always show all payment-method icons** in footer + cart + checkout. Choice of payment method drives conversion alone.

### Language & content
- **es-PY by default** for the Paraguay tenants; allow es-AR/es-MX/es-CL overrides. Avoid Castilian "vosotros" / "ordenador" — use "ustedes" / "computadora".
- Date format DD/MM/YYYY, never US MM/DD.
- Units metric universally.
- Phone format: `+595 9XX XXX XXX` for PY, with masked input.

## 3.11 The 10 features that separate "decent" from "world-class"

What mature stores ship and SMB stores never get to:

1. **Personalized "Recommended" sort** based on session behavior + purchase history (not static).
2. **In-search merchandising** — pin specific products to query results (synonyms + boosts), promote new launches without code.
3. **Visual search** (upload photo → similar products) for fashion/home.
4. **AR product try-on** for eyewear, makeup, furniture — Warby Parker, Sephora Virtual Artist, IKEA Place.
5. **Save-for-later in cart**, distinct from wishlist; back-in-stock alerts wired to wishlist.
6. **Smart abandoned-cart recovery** — email + SMS + WhatsApp (LATAM), with progressive urgency and personalized product reminders.
7. **One-click checkout** for returning customers (Shop Pay-style) — single-page or accordion checkout, address book, saved payment.
8. **Outfit / Look builder + "Compra el look"** (cross-merchandise styled shots → multi-product cart-add).
9. **Loyalty / referral built into the storefront** — tier visible in header, points-on-action surfaced inline. Yotpo Loyalty / Smile.io patterns.
10. **Operational maturity invisible to the user**: real inventory sync (no overselling), per-region shipping calc inline before checkout, tax handling per buyer location, post-purchase tracking page (not dump-to-courier-site), fast support response with chat history persisted.

**Bonus #11**: ML-driven product recommendations across the site — homepage "for you", PDP "you might also like", thank-you page "based on your purchase", abandoned-cart email "complete your collection". Done well, recommendations drive 10–30% of total revenue.

---

# Part 4 — Amateur-vs-Pro: Top 15 Gaps

The combined punch list of things mid-tier sites consistently miss that pros always ship. **Both `fun4me` and `viajero-comercio` are missing most of these today** — the storefront engine has to ship them as primitives, not per-tenant.

| # | Gap | Impact / source |
|---|---|---|
| 1 | **ZIP-based delivery ETA** on PDP and pre-checkout | Removes biggest pre-purchase question; lifts checkout-start rate measurably |
| 2 | **Color swatches that swap card image inline** on PLP | Baymard: 57% of sites fail to expose all swatches on mobile |
| 3 | **Free-shipping progress bar** in cart and slide-out | AOV +20–40%; orders +90% (NuFace); 81% of users add-to-cart to hit threshold |
| 4 | **Suppressed promo-code field** (link, not visible input) | Visible input triggers "I should look for a code" abandonment (Baymard) |
| 5 | **Sticky add-to-cart on PDP** (mobile + desktop) | +10–15% PDP conversion, up to 20% mobile-heavy |
| 6 | **Address autocomplete** in checkout (Google Places) | 2× form completion in LATAM where addresses are messy |
| 7 | **Express-checkout buttons** (Shop/Apple/Google/PayPal/MercadoPago) in cart AND PDP | Cuts steps for returning users; major mobile conversion lift |
| 8 | **Self-serve returns** with prepaid labels | Free returns +20–30% conversion; absent free returns kills first sale |
| 9 | **Review filtering** by rating + photos + verified + fit | Photo reviews +166% conversion; sites with reviews + filters convert noticeably better |
| 10 | **Aggregated fit/size sentiment** ("Runs small — order up") | Removes top-3 reason for apparel returns |
| 11 | **Back-in-stock notification** with email capture per variant | Captures otherwise-lost intent; viajero has feature flag, fun4me doesn't |
| 12 | **Recently-viewed rail** across pages, persisted across sessions | viajero has it, fun4me doesn't — pros have it as standard primitive |
| 13 | **No-results recovery** on search and PLP (never a dead end) | Search converts at 2–3× browse — losing zero-result users is expensive |
| 14 | **Account creation OFFERED post-purchase**, not required pre | Guest checkout default is Baymard gold standard |
| 15 | **Schema.org markup on every entity** (Product, Review, FAQ, Breadcrumb, Article, ItemList) | +30%+ CTR from SERP; both tenants currently emit only `Store` |

**Plus the operational backbone (invisible-to-user but critical)**: abandoned-cart emails within 1h/24h/72h, post-purchase review request at delivery+5d, replenishment reminders for consumables, win-back series at 60/90/180d, **highlight-current-scope in mega-menu** (95% fail), **mega-menu hover delay 300–500ms** (61% fail), **clickable category header in mega-menu** (33% fail), **full-scope link text on mobile** (59% fail), and **filter match counts** ("Azul (34)") which Baymard calls one of the single highest-impact improvements.

---

# Part 5 — Prioritized Build-Spec for the Multi-Tenant Generator

Translating Parts 1–4 to engine-level work. Designed so all current and future `retail-local` tenants land in the top decile of Baymard's benchmark on day one — purely by not screwing up what 95% of sites screw up.

## 5.1 Section library (gap to reach "pro")

The current registry has **21 universal sections** (the spine). The gap to "pro" is roughly the 25 sections below + the 15 amateur-vs-pro fixes. This is the next wave of section work for the storefront product type:

**New section components** (alphabetical):
- `address-autocomplete` (Google Places / Loqate adapter)
- `announcement-bar` (free-shipping threshold, promo, cutoff countdown)
- `back-in-stock-form` (per-variant)
- `breadcrumbs` (with `BreadcrumbList` JSON-LD)
- `buying-guide-template` (article → filtered PLP)
- `complete-the-look` (multi-product PDP cross-merchandise)
- `express-checkout-buttons` (Pagopar / MercadoPago / Bancard / Apple/Google Pay)
- `faceted-filter-rail` (with type-specific facet config — see §5.2)
- `frequently-bought-together` (bundle with combined discount)
- `free-shipping-progress` (cart and slide-out)
- `lookbook-with-hotspots` (shoppable editorial)
- `mega-menu` (hover delay, clickable header, scope highlight, thumbnails)
- `no-results-recovery` (search + PLP)
- `order-tracking-timeline` (Pedido → Empacado → Despachado → En camino → Entregado)
- `product-card` (with hover-swap, color-swatches, quick-add, size availability)
- `q-and-a` (PDP)
- `recently-viewed` (cookie/db-synced rail across pages)
- `related-products` (PDP / cart)
- `review-block` (filtering, histogram, fit-summary, photos, verified badge)
- `search-autocomplete` (categories + products + content + popular + recent)
- `self-serve-returns-flow` (pick items → reason → method → label generation)
- `size-guide-modal` (per category, cm + in, how-to-measure, body-type)
- `slide-out-cart` (with progress bar + 1 cross-sell)
- `sticky-cta` (PDP add-to-cart bar, mobile + desktop)
- `value-prop-strip` (3–4 icons under hero)
- `zip-eta-estimator` (PDP and pre-checkout)

**Existing sections to upgrade**:
- `hero` → enforce ONE hero pattern; flag rotating carousels as anti-pattern
- `testimonials` (curated) — keep separate from `review-block` (UGC)
- `enhanced-faq` → emit `FAQPage` schema by default
- `gallery` → support PDP-grade lightbox + pinch-zoom + 360°/AR slot
- `commerce-catalog` → integrate with `faceted-filter-rail` + `sort-control`
- `trust-badges` → placement-aware variants (header / PDP / footer / **checkout** with conversion-best-spec)

## 5.2 Per-vertical preset config

`src/registry/[type].store.json` — declarative per-vertical config consumed by the universal facet engine, sort engine, search engine, and section composer.

```json
{
  "type": "viajero_comercio",
  "facets": {
    "universal": ["price", "rating", "availability", "sale"],
    "vertical": ["brand", "material", "power_source", "use_case", "pickup_available"],
    "displayOrder": ["use_case", "brand", "price", "material", "power_source", "rating", "availability", "sale"]
  },
  "sort": {
    "default": "recommended",
    "options": ["recommended", "bestselling", "newest", "price-asc", "price-desc", "top-rated", "discount"],
    "recommendedScore": "bestseller_rank * in_stock * margin_factor * freshness_decay"
  },
  "card": {
    "imageRatio": "4:5",
    "swatchOverflow": 4,
    "showSizeAvailability": false
  },
  "trustBadges": ["free_shipping_300k", "pagopar_secure", "30day_return", "ruc_registered"],
  "paymentIcons": ["pagopar", "bancard", "tigo_money", "transferencia"],
  "addressForm": "py_standard",
  "schema": {
    "primary": "Store",
    "additional": ["LocalBusiness", "Organization", "WebSite"]
  }
}
```

For `fun4me` add: `ageGate`, `discretePackaging`, `complianceDisclaimer`, vertical facet set: `["type", "material", "brand", "discreet_compatible"]`, statement-descriptor handling.

## 5.3 Universal facet engine

A single engine that ingests product attributes + per-vertical config and renders the correct UI automatically:

- **Slider** for ranges (price, dimension)
- **Swatch** for color
- **Pill grid** for size
- **Checkbox list** for brand, material, etc. (with progressive disclosure beyond 7 values)
- **Toggle** for sale / in-stock
- **Star visual** for rating

Engine emits live counts, gray-outs zero-results, supports multi-select within / AND across, persists state to URL, and renders applied-filter chips.

## 5.4 Filter URL convention (one rule for all tenants)

- `/{tenant}/{category}?{facet}={value}&{facet}={value}&sort={option}&page={n}`
- Multi-value within a facet: `?color=azul,rojo` (comma-separated)
- **Canonical/noindex policy** computed from per-tenant rules:
  - Brand+Category combo → indexable, self-referencing canonical
  - Single high-value facet (e.g. `?color=red` on a brand-color combo with verified search volume) → indexable
  - Multi-facet combos (≥3 facets) → `noindex,follow`
  - `?sort=` / `?view=` / `?per_page=` → blocked in `robots.txt`
- Every PLP emits `BreadcrumbList` + `ItemList` JSON-LD

## 5.5 JSON-LD generator

A render helper that takes a `Product`, `Category`, `Page`, `Article`, `FAQ`, or `Business` object and emits the correct schema. Specifically:

- `Organization` site-wide on homepage (logo, sameAs)
- `WebSite` with `SearchAction` (sitelinks search box)
- `BreadcrumbList` on every PLP/PDP
- `Product` + nested `Offer` + `AggregateRating` + `Review[]` on every PDP
- `ItemList` on PLPs
- `FAQPage` on FAQ
- `Store` / `LocalBusiness` for tenants with physical presence (huge for LATAM SMBs; both current tenants qualify)
- `Article` + `Author` on blog posts

## 5.6 Search backend

- **Phase 1**: native pg_trgm + tsvector with Spanish stemming + manual synonym map (per-tenant), serves typo tolerance ≤2 + diacritic insensitivity. Cost-zero. Sufficient for `<10k SKUs`.
- **Phase 2 (when SKU count or query volume justifies)**: Typesense (self-host) or Algolia. Add visual search via embedding model in Phase 3 only when a fashion/home tenant lands.
- Universal frontend: autocomplete with category + product + content tabs, recent + popular searches, no-results recovery template.
- Backend logging: every query, no-results queries, click-through, conversion-by-query → analytics dashboard → manual synonym/merchandising fixes monthly.

## 5.7 Performance budget enforced in CI

CI must fail builds when:
- LCP > 2.5s on key page templates (homepage / PLP / PDP) measured via Lighthouse CI on Moto G Power emulation
- INP > 200ms (lab proxy via TBT in Lighthouse + CrUX field data when available)
- CLS > 0.1
- JS bundle on first load > 200kb gzipped

Per-tenant allowlist for known third-party widgets (Pagopar, GA4, etc.) so tenants don't drift silently into bloat.

## 5.8 A11y baseline tests

`axe-core` run in CI on each page template:
- Homepage, PLP, PDP, cart, checkout, account, search SERP, FAQ, blog index, blog article, contact
- Zero `serious`/`critical` violations to merge
- WCAG 2.2 AA conformance level

Manual a11y review checklist (lives in `docs/process/`) for every new section component:
- Keyboard navigable end-to-end with visible focus
- Screen-reader labels for icon-only controls
- Color contrast 4.5:1 body / 3:1 UI
- 44×44px tap targets
- `aria-current`, `aria-expanded`, `role="alert"` where appropriate

## 5.9 Differentiators as opt-in features (off by default)

Tenants graduate into these — **never** ship to a tenant before the universal floor (§5.1–5.8) is in place:

- Personalized "Recommended" sort (requires session+purchase history)
- In-search merchandising (admin UI for query pinning / boosts)
- Visual search
- AR try-on
- Save-for-later distinct from wishlist
- Smart abandoned-cart recovery (email + SMS + WhatsApp orchestration)
- One-click checkout for returning customers
- Outfit / Look builder
- Loyalty / referral surfaced inline
- ML-driven recommendations (PDP + cart + post-purchase)
- Operational maturity layer: real inventory sync, per-region shipping calc inline, post-purchase tracking page, persistent support chat history

## 5.10 Tenant-specific gaps to close before next launch

**fun4me** (LIVE — these block "pro" status, not launch):
1. Add `recently-viewed` rail (already a pro primitive, viajero has it)
2. Wire actual Pagopar merchant credentials (placeholder noted in config)
3. RUC/Timbrado completion via Facture (planned phase4 — pull forward to phase2 if scaling)
4. Search + filters + sort on shop/category pages (currently absent)
5. Breadcrumbs + JSON-LD beyond `Store`
6. Sticky ATC on PDP
7. Free-shipping progress bar in cart
8. Express checkout buttons in cart and PDP
9. WhatsApp Business API graduate from click-to-chat to persistent thread (planned phase3)
10. Order-tracking timeline page (currently undocumented)

**viajero-comercio** (PRE-PRODUCTION — these block launch):
1. **Declare payment provider** in `site.json` (Pagopar by default per `paragu-ai-builder` policy) — currently absent
2. **Newsletter opt-in enforcement** explicit (currently undeclared → LGPD/GDPR risk)
3. Real product imagery (currently Unsplash placeholders)
4. Search + filters + sort on shop/category pages
5. Breadcrumbs + JSON-LD beyond default
6. Trust badge content concrete (current placeholder)
7. Either enable national shipping OR clearly message regional-only on every shipping touchpoint
8. Sticky ATC on PDP
9. Free-shipping progress bar in cart
10. Confirm route convention — `/s/es/viajero-comercio` vs `/viajero-comercio` (decide and standardize across all retail tenants — see §5.11)

## 5.11 Architectural decisions to lock in (open today)

- **Route convention**: pick one. Tenants with i18n potential keep `/s/{locale}/{tenant}/*`; English-only tenants drop the prefix. Document in `docs/reference/TENANTS.md` and migrate `fun4me` OR `viajero-comercio` to match. *Current memory note: "all tenants deploy under paragu-ai.com/s/es/<slug>, not the subdomain in site.json baseUrl" — `fun4me` therefore needs to migrate to `/s/es/fun4me`, with redirect from `/fun4me`.*
- **Payment provider default**: declare Pagopar as the registry-level default for `retail-local`, only override per-tenant. Stop letting tenants ship without an explicit provider.
- **Feature phasing model**: adopt fun4me's `featurePhases` schema as the standard for all tenants. Phase declarations make rollout calendars first-class; viajero-comercio currently has none.
- **Discrete-packaging stack**: extract fun4me's `neutralPackaging`, `statementDescriptor`, `billingName`, `invoiceConcept` as a reusable `discretion` config block — useful for any sensitive-vertical tenant.
- **Recently-viewed**: turn ON by default for all `retail-local` tenants (currently inconsistent).
- **Newsletter opt-in**: enforce `optInRequired: true` at the registry level for `retail-local` — it's a regulatory non-negotiable.
