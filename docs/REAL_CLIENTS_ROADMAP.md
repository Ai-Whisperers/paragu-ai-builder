# Real Clients — Build & Improve Roadmap (100 items)

> Six real tenants as of April 2026. Analysis + catalog of reusable engine capabilities. Items marked ✅ are shipped; ⏳ in progress; ⬜ planned; ❌ anti-pattern (do not build).

## Clients

| # | Slug | Business | Vertical | Where | Stage |
|---|------|----------|----------|-------|-------|
| 1 | **nexa-paraguay** | EU → PY relocation (flagship) | real-estate-relocation | `sites/nexa-paraguay/` | Staging green, prod-blocked by 12 stakeholder items |
| 2 | **nexa-propiedades** | PY residential real estate | real-estate-relocation | `sites/nexa-propiedades/` | MVP — 4 pages authored, some routes still sparse |
| 3 | **nexaparaguay** | Legacy alias | real-estate-relocation | `sites/nexaparaguay/` | Migrated out of demo-data.ts |
| 5 | **dayah-litworks** | Indie book cover designer | portfolio-professional | `sites/dayah-litworks/` | Migrated, needs product-catalog + genre filter |
| 6 | **de-abasto-a-casa** | Weekly meal prep (Ivan's biz) | food-beverage | `sites/de-abasto-a-casa/` | Migrated, needs weekly-cadence + portal |

---

## P0 — Foundation (SHIPPED)

| # | Item | Status | Who benefits | Note |
|---|------|--------|--------------|------|
| 1 | Migration script `cli migrate-demo-to-site` | ✅ | 3 real clients | `web/scripts/migrate-demo-to-site.ts` |
| 2 | Run migration for 3 real clients | ✅ | All real clients | nexaparaguay / dayah / de-abasto now in sites/ |
| 3 | Multi-currency price formatter (`formatPrice`) | ✅ | Dayah (USD), De Abasto (Gs), Nexa × 3 | `web/lib/currency.ts` + 12 tests |
| 4 | `intake-questionnaire` section | ✅ | De Abasto, Dayah, Nexa — any tenant needing structured lead intake | `components/sections/intake-questionnaire-section.tsx` |
| 5 | Translation-quality flag + build gate | ✅ | Nexa × 3 | Marks DE as `machine`; validate-sites blocks prod |
| 6 | `cli audit-duplicates` | ✅ | Ops | Flags slug drift between demo-data.ts and sites/ |

## P1 — Extend the library (SHIPPED)

| # | Item | Status | Who benefits | Note |
|---|------|--------|--------------|------|
| 7 | `pricing-with-confidential-cta` variant | ✅ | Nexa × 3, B2B tenants | `variant: "confidential"` hides amounts |
| 8 | `tiered-service-ladder` section | ✅ | De Abasto, gyms, SaaS | L1→L2→L3 progression |
| 9 | `creative-commission-process` variant | ✅ | Dayah, photographers, designers | `process` variant `commission` |
| 10 | Lead enrichment (`/api/leads`) | ✅ | All tenants | `lib/leads/enrich.ts` — UA/device/ipCountry/referrer |
| 11 | `regulatory-status-badge` section | ✅ | De Abasto INAN, finance, health, pharma | `components/sections/regulatory-status-badge-section.tsx` |

## P2 — Data + state infrastructure (planned)

| # | Item | Status | Who benefits | Effort |
|---|------|--------|--------------|--------|
| 12 | Supabase `properties` table + `/api/properties` | ⬜ | Nexa Propiedades | 2 days |
| 13 | `mortgage-calculator` section (PY + EU rates) | ⬜ | Nexa Propiedades | 1 day |
| 14 | `listings-from-api` variant of `property-listings` | ⬜ | Nexa Propiedades | 0.5 day |
| 15 | Customer portal MVP (auth + pause/resume) | ⬜ | De Abasto, Nexa post-sale | 1 week |
| 16 | `weekly-cadence-calendar` section | ⬜ | De Abasto, CSAs, weekly subs | 1 day |
| 17 | `sample-week-preview` section | ⬜ | De Abasto, meal plans, box services | 0.5 day |
| 18 | `delivery-slot-picker` (Cal.com) | ⬜ | De Abasto, any delivery window | 1 day |
| 19 | Legal-review flag + build gate | ⬜ | Nexa × 3, finance/health/law | 0.5 day |

## P3 — Polish and later (planned)

| # | Item | Status | Who benefits | Effort |
|---|------|--------|--------------|--------|
| 20 | Email-nurture → Mailchimp Customer Journey importer | ⬜ | Nexa × 3 | 1 day |
| 21 | `digital-product-catalog` with Stripe checkout | ⬜ | Dayah premades, creator tenants | 2 days |
| 22 | `book_cover_designer` narrow type | ⬜ | Dayah | 2 hours |
| 23 | Per-locale hreflang automation | ⬜ | All multi-locale | 2 hours |

---

## P4 — More reusable section components

| # | Section | Who benefits | Pattern |
|---|---------|--------------|---------|
| 24 | `before-after-split` — transformation visualiser | Nexa (before/after relocating), meal prep, fitness | Side-by-side |
| 25 | `pricing-range` — "from X to Y" pricing with factors | Photographers, architects | Adaptive price |
| 26 | `trust-signals-logos` — client logos wall | B2B, agencies, consulting | Logo grid |
| 27 | `faq-categorized` with search | Nexa, legal, complex services | Multi-category FAQ |
| 28 | `compare-plans-matrix` — feature comparison | SaaS, gyms, Nexa programs | Matrix |
| 29 | `timeline-history` — company milestones | About pages, trust building | Vertical timeline |
| 30 | `testimonial-video` — video testimonials | All — higher conversion than text | Video embeds |
| 31 | `instagram-feed` — live IG grid | Beauty, food, creators | IG API + fallback |
| 32 | `google-reviews-widget` — real reviews | Local businesses | Google Places API |
| 33 | `open-hours-status` — "Open now" real-time | All local businesses | Hours-aware badge |
| 34 | `currency-toggle` — switch display currency | Dayah, international tenants | Wrapper around formatPrice |
| 35 | `multi-step-form` — wizard alternative to intake | Complex qualification flows | Stateful stepper |
| 36 | `countdown-timer` — event / launch | Weddings, product launches | Client-side timer |
| 37 | `newsletter-signup` — inline email capture | All | Simple form → Mailchimp |
| 38 | `language-selector` — dropdown | Multi-locale tenants | Swap in header |
| 39 | `compliance-disclaimer-footer` | Nexa, finance, health | Small-print banner |
| 40 | `service-area-map-with-zones` | Trades, delivery | Interactive zones |

## P5 — API + webhooks

| # | Endpoint | Purpose |
|---|----------|---------|
| 41 | `/api/properties` GET + filter | Real-estate listings |
| 42 | `/api/properties/:id` GET | Single property detail |
| 43 | `/api/subscriptions/pause` POST | De Abasto self-serve pause |
| 44 | `/api/subscriptions/skip` POST | Skip a week |
| 45 | `/api/subscriptions/preferences` PATCH | Update diet/household |
| 46 | `/api/calendly-webhook` POST | Booked slot → CRM |
| 47 | `/api/mailchimp-journey-import` POST | One-shot journey import |
| 48 | `/api/hubspot-cron-sync` | Drift detection CRM ↔ Supabase |
| 49 | `/api/whatsapp-webhook` | Inbound WA messages → CRM |
| 50 | `/api/og-image/:slug` GET | Dynamic OG image per tenant |

## P6 — Tenant content remaining

| # | Task | Tenant | Blocker |
|---|------|--------|---------|
| 51 | Author PT-BR content | nexa-propiedades | Translation pass needed |
| 53 | Professional DE translation | nexa-paraguay | Stakeholder decision #8 |
| 54 | Author `/propiedades` page content | nexa-propiedades | Source of listings TBD |
| 55 | Author `/servicios` page content | nexa-propiedades | Partially done |
| 56 | De Abasto weekly menu content | de-abasto-a-casa | Weekly content cadence |
| 57 | De Abasto FAQ (cold chain, pausing, minimums) | de-abasto-a-casa | Author pass |
| 58 | Dayah portfolio expansion (finished covers grid) | dayah-litworks | Get Dayah's CSV |
| 59 | Testimonial collection flow | de-abasto-a-casa | "can we publish?" email |
| 60 | Replace placeholder testimonials | de-abasto-a-casa | Real client quotes |

## P7 — CLI & operator DX

| # | Command | Purpose |
|---|---------|---------|
| 61 | `cli doctor` — full pre-flight | Runs all validators + reports |
| 62 | `cli diff-tenant <a> <b>` | Compare two tenants' configs |
| 63 | `cli export-tenant <slug>` | Archive tenant as tarball |
| 64 | `cli pull-content <slug>` | Pull live content back to repo |
| 65 | `cli new-tenant` | Interactive wizard for new tenant |
| 66 | `cli lint-content` | Grammar / link / i18n checks |
| 67 | `cli perf-budget <slug>` | Lighthouse perf report |
| 68 | `cli screenshots <slug>` | Visual-regression baselines |
| 69 | `cli check-links <slug>` | Broken link detector |
| 70 | `cli rotate-secrets` | Credential hygiene |

## P8 — SEO / performance

| # | Item | Who benefits |
|---|------|--------------|
| 71 | Per-locale sitemap generation | All multi-locale |
| 72 | Per-tenant `robots.txt` | All |
| 73 | Dynamic OG image generator | All |
| 74 | JSON-LD per section type (not just LocalBusiness) | Every type |
| 75 | Critical CSS extraction | All |
| 76 | Image optimization pipeline | All (heavy image tenants) |
| 77 | Font subsetting per tenant | All |
| 78 | Lazy-hydration for below-fold sections | All |
| 79 | Preload LCP asset | All |
| 80 | Per-page Lighthouse budget in CI | All |

## P9 — Compliance / legal

| # | Item | Who benefits |
|---|------|--------------|
| 81 | GDPR consent banner (already exists — variant per locale) | EU-facing tenants |
| 82 | Privacy policy template per jurisdiction (PY, UY, EU) | All |
| 83 | ToS template per vertical | All |
| 84 | AML disclaimer template | Nexa × 3, finance |
| 85 | Cookie classification + banner granularity | EU-facing |
| 86 | Data request flow (GDPR right-to-delete) | All with EU users |
| 87 | INAN disclaimer for food tenants | De Abasto, future F&B |
| 88 | SEPRELAD attestation form | Nexa × 3 |

## P10 — Analytics & observability

| # | Item | Who benefits |
|---|------|--------------|
| 89 | Conversion-funnel events per tenant | All |
| 90 | A/B testing harness (flag-gated section swaps) | All |
| 91 | Error boundary with Sentry | All |
| 92 | Real User Monitoring (Web Vitals → Cloudflare) | All |
| 93 | Per-section impression tracking | All |
| 94 | CTA click heatmap | All |

## P11 — Accessibility

| # | Item | Who benefits |
|---|------|--------------|
| 95 | WCAG 2.1 AA audit | All — legal requirement EU |
| 96 | Keyboard nav on all forms | All |
| 97 | aria-labels audit | All |
| 98 | Color contrast validator in CI | All |
| 99 | Reduced-motion preference honored | All animated sections |

## P12 — Capstone

| # | Item | Note |
|---|------|------|
| 100 | `cli health <slug>` — tenant readiness scorecard | Aggregates perf, a11y, validation, completeness |

---

## Anti-recommendations (DO NOT build)

| # | Item | Why not |
|---|------|---------|
| ❌ | Per-client custom React code | Goes in `sites/<slug>/content/` — the whole scalability model depends on this |
| ❌ | Checkout for every creator before retention stack for De Abasto | Revenue-per-customer × LTV says meal-prep retention first |
| ❌ | UY-law paragraphs in component layer | Country-specific content lives in tenant content, not components |
| ❌ | Stripe before WhatsApp-order for LATAM tenants | LATAM buyers overwhelmingly prefer WhatsApp; Stripe adds checkout abandonment |
| ❌ | Full i18n SSR pipeline when only 4 locales in use | YAGNI — tenant `locales: []` + copy JSON per locale is fine at this scale |
| ❌ | Custom CMS UI before admin panel improvements | Content is JSON in git — authors can PR. A full CMS adds 6+ weeks of unrelated surface |
| ❌ | Migrate away from Next.js App Router | Router gives us ISR + middleware + edge — swapping out would delete months of gains for no client win |

---

## Summary

- **11 items shipped** this round (P0 + P1)
- **89 items documented** as planned / patterns / anti-patterns
- Every shipped item is **reusable** — lives in the engine, not per-client
- Every planned item has a **clear beneficiary** among the 6 real tenants
- **Anti-recommendations** prevent scope drift into custom-per-client work

## What's live for each real client today

| Client | Shipped improvements (this round) |
|--------|-----------------------------------|
| **nexa-paraguay** | Translation-quality gate flags DE; confidential-pricing variant available for "Consultar" tiers; lead enrichment on submissions |
| **nexa-propiedades** | Migrated vertical id to canonical `real-estate-relocation`; enrichment + currency utility available |
| **nexaparaguay** | Migrated into `sites/nexaparaguay/` as proper tenant; contact/whatsapp refs wired |
| **dayah-litworks** | Migrated into `sites/dayah-litworks/`; multi-currency formatter unlocks USD display; intake-questionnaire available for book-brief flow |
| **de-abasto-a-casa** | Migrated into `sites/de-abasto-a-casa/`; tiered-service-ladder section available for L1/L2/L3; regulatory-status-badge ready for INAN surfacing; intake-questionnaire ready for household/dietary capture |

---

_Last updated: 2026-04-20._
