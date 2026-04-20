# Section Component Reference

Every section in `web/components/sections/` is listed here. Sections are the building blocks tenants compose into pages via `sites/<slug>/pages/*.json`. All are referenced by **kebab-case id** in tenant JSON; the renderer normalizes camelCase aliases for backwards compatibility (see `resolveSectionAlias` in `web/lib/engine/section-registry.ts`).

**Total: 83 sections** across 10 functional groups. Every section is theme-driven (`var(--*)` tokens only), Server Component by default unless interactive.

See [ARCHITECTURE.md § request lifecycle](../../ARCHITECTURE.md#3-request-lifecycle) for where sections fit in the pipeline.

---

## Conventions

- **Section id**: kebab-case, matches the registered key in `renderer.tsx`.
- **File**: `web/components/sections/<id>-section.tsx` (except when a file exports multiple sections, e.g. `sushi-menu-sections.tsx` → `featured-menu` + `full-menu`).
- **Props**: each section exports a typed Props interface; the renderer passes `section.data` as props.
- **Tokens**: components consume `var(--primary)`, `var(--surface)`, etc. — never hardcoded colors.

---

## 1. Navigation & Layout

| Id | File | Purpose |
|---|---|---|
| `header` | `header-section.tsx` | Sticky top bar with logo, nav links, primary CTA |
| `footer` | `footer-section.tsx` | Footer with link columns, contact block, compliance strip |
| `whatsapp-float` | `whatsapp-float.tsx` | Floating WhatsApp CTA button (all pages) |
| `smart-whatsapp` | `smart-whatsapp-section.tsx` | WhatsApp CTA with context-aware pre-filled message |
| `language-selector` | `language-selector-section.tsx` | Locale switcher (updates `NEXT_LOCALE` cookie) |

## 2. Hero & Landing

| Id | File | Purpose |
|---|---|---|
| `hero` | `hero-section.tsx` | Full-width hero — headline, subhead, CTA, background image or video |
| `cta-banner` | `cta-banner-section.tsx` | Horizontal promo banner |
| `landing` | `landing-section.tsx` | Generic top-of-page block |

## 3. Features & Services

| Id | File | Purpose |
|---|---|---|
| `features` | `features-section.tsx` | Icon-led feature list (3–6 items) |
| `services` | `services-section.tsx` | Service cards with image + description + CTA |
| `process` | `process-section.tsx` | Step-by-step process (horizontal) |
| `process-timeline` | `process-timeline-section.tsx` | Vertical timeline with milestones |
| `timeline-history` | `timeline-history-section.tsx` | Company history timeline |
| `tiered-service-ladder` | `tiered-service-ladder-section.tsx` | Escalating service levels (Bronze → Gold) |
| `programs-comparison` | `programs-comparison-section.tsx` | Side-by-side programme comparison (relocation) |
| `why-destination` | `why-destination-section.tsx` | "Why choose this destination" block (relocation) |

## 4. Pricing & Commerce

| Id | File | Purpose |
|---|---|---|
| `pricing` | `pricing-table-section.tsx` | Plan comparison table |
| `pricing-range` | `pricing-range-section.tsx` | "From X to Y" price display |
| `membership-plans` | `membership-plans-section.tsx` | Tier cards with features + CTA |
| `subscription` | `subscription-section.tsx` | Subscription management UI (customer portal) |
| `compare-plans-matrix` | `compare-plans-matrix-section.tsx` | Feature-by-feature matrix |
| `product-catalog` | `product-catalog-section.tsx` | Product grid with variants |
| `price-list` | `price-list-section.tsx` | Itemised line-by-line price list |
| `currency-toggle` | `currency-toggle-section.tsx` | Multi-currency selector |

## 5. Booking & Scheduling

| Id | File | Purpose |
|---|---|---|
| `booking` | `booking-section.tsx` | Calendly / Cal.com embed |
| `class-schedule` | `class-schedule-section.tsx` | Weekly class timetable (gyms, yoga) |
| `room-booking` | `room-booking-section.tsx` | Room/table reservation form |
| `delivery-slot-picker` | `delivery-slot-picker-section.tsx` | Delivery time selection (meal prep) |
| `preorder` | `preorder-calendar-section.tsx` | Pre-order calendar (egg farm, meal prep) |
| `weekly-cadence-calendar` | `weekly-cadence-calendar-section.tsx` | Recurring delivery cadence |
| `sample-week-preview` | `sample-week-preview-section.tsx` | Trial-week preview before subscribing |

## 6. Calculators & Tools

| Id | File | Purpose |
|---|---|---|
| `bulk-calculator` | `bulk-calculator-section.tsx` | Bulk-order pricing |
| `delivery-calculator` | `delivery-calculator-section.tsx` | Delivery cost estimator |
| `mortgage-calculator` | `mortgage-calculator-section.tsx` | Real-estate mortgage calc |
| `savings-calculator` | `savings-calculator-section.tsx` | Savings / ROI estimator |

## 7. Forms & Lead Capture

| Id | File | Purpose |
|---|---|---|
| `lead-form` | `lead-form-section.tsx` | Basic lead form (name, email, phone) |
| `contact` | `contact-section.tsx` | Contact form with message |
| `newsletter-signup` | `newsletter-signup-section.tsx` | Email-only subscription |
| `quote-form` | `quote-form-section.tsx` | Quote-request form |
| `multi-step-form` | `multi-step-form-section.tsx` | Wizard form |
| `intake-questionnaire` | `intake-questionnaire-section.tsx` | Multi-step intake (health, service onboarding) |

## 8. Content & Media

| Id | File | Purpose |
|---|---|---|
| `gallery` | `gallery-section.tsx` | Image carousel / lightbox |
| `photo-gallery` | `photo-gallery-section.tsx` | Grid photo gallery |
| `portfolio` | `portfolio-section.tsx` | Portfolio project cards |
| `before-after` | `before-after-section.tsx` | Slider comparison |
| `before-after-split` | `before-after-split-section.tsx` | Split-screen comparison |
| `recipes` | `recipe-section.tsx` | Recipe card (ingredients + steps) |
| `blog-index` | `blog-index-section.tsx` | Blog post list |
| `blog-post` | `blog-post-section.tsx` | Single blog-post view |
| `conveyor-belt` | `conveyor-belt-section.tsx` | Auto-scrolling item belt (sushi) |
| _(shared)_ `conveyor-belt-strip.tsx` | Reusable strip inside the above |

## 9. Trust & Social Proof

| Id | File | Purpose |
|---|---|---|
| `testimonials` | `testimonials-section.tsx` | Testimonial cards / carousel |
| `testimonial-video` | `testimonial-video-section.tsx` | Embedded video testimonials |
| `reviews` | `reviews-section.tsx` | Star ratings + review text |
| `google-reviews-widget` | `google-reviews-widget-section.tsx` | Google-Reviews embed |
| `trust-signals` | `trust-signals-section.tsx` | Badges + certifications |
| `trust-signals-logos` | `trust-signals-logos-section.tsx` | Client-logo carousel |
| `team` | `team-section.tsx` | Team-member profile cards |
| `referral` | `referral-section.tsx` | Referral-rewards programme |

## 10. Status & Real-time

| Id | File | Purpose |
|---|---|---|
| `open-hours-status` | `open-hours-status-section.tsx` | Live open/closed + hours |
| `stock-indicator` | `stock-indicator-section.tsx` | Inventory level (egg farm) |
| `emergency-indicator` | `emergency-indicator-section.tsx` | Emergency-service alert banner |
| `regulatory-status-badge` | `regulatory-status-badge-section.tsx` | Licensing / compliance badge |
| `countdown-timer` | `countdown-timer-section.tsx` | Offer / event countdown |
| `instagram-feed` | `instagram-feed-section.tsx` | Instagram embed |
| `service-area-map-zones` | `service-area-map-zones-section.tsx` | Delivery / service-area map |

## 11. Food & Menu

| Id | File | Purpose |
|---|---|---|
| `menu-categorized-priced` | `menu-categorized-priced-section.tsx` | Categorised priced menu |
| `featured-menu` | `sushi-menu-sections.tsx` | Featured dishes with glyph icons (sushi) |
| `full-menu` | `sushi-menu-sections.tsx` | Full menu (sushi) |
| `color-coded-menu` | `color-coded-menu-section.tsx` | Plate-colour-based pricing |
| `special-order` | `color-coded-menu-section.tsx` | Special-order builder |
| `omakase` | `omakase-section.tsx` | Tasting-menu card |
| `sake-menu` | `sake-menu-section.tsx` | Sake pairings |
| `nutritional-info` | `nutritional-info-section.tsx` | Nutritional facts display |
| `huevo-del-dia` | `huevo-del-dia-section.tsx` | Daily-special (legacy egg farm) |

## 12. FAQ & Info

| Id | File | Purpose |
|---|---|---|
| `faq` | `faq-section.tsx` | Accordion FAQ |
| `faq-categorized` | `faq-categorized-section.tsx` | Tab-grouped FAQ |
| `faq-chatbot` | `faq-chatbot-section.tsx` | AI chatbot interface |

## 13. Real Estate & Hospitality

| Id | File | Purpose |
|---|---|---|
| `property-listings` | `property-listings-section.tsx` | Property grid with filters |
| `event-venues` | `event-venues-section.tsx` | Venue cards |

## 14. Compliance

| Id | File | Purpose |
|---|---|---|
| `compliance-disclaimer-footer` | `compliance-disclaimer-footer-section.tsx` | Regulatory disclaimer footer |

## 15. Booking internals

| Id | File | Purpose |
|---|---|---|
| `booking-embed` | `booking-embed-section.tsx` | Third-party booking widget embed |
| `service-selector` | (in `web/components/booking/`) | Step: choose service |
| `date-time-picker` | (in `web/components/booking/`) | Step: choose slot |
| `staff-selector` | (in `web/components/booking/`) | Step: choose staff |
| `booking-form` | (in `web/components/booking/`) | Step: contact + confirm |
| `booking-wizard` | (in `web/components/booking/`) | Orchestrates the above four |

_Booking components are not sections; they live under `components/booking/` and are composed by the `booking` section via variant prop._

---

## Adding a new section

1. Create `web/components/sections/<kebab-name>-section.tsx` with a typed Props interface.
2. Use only `var(--*)` tokens.
3. Import + register in `web/lib/engine/renderer.tsx`:
   ```tsx
   import { NewSection } from '@/components/sections/new-section'
   // …
   'new-section': NewSection,
   ```
4. Add an entry to this file with one-line purpose.
5. Snapshot or component test under `web/tests/unit/components/`.
6. If the section is vertical-specific, add it to the relevant `src/verticals/<vertical>/vertical.json` and any business types that use it.

See [CONTRIBUTING.md § Adding sections](../../CONTRIBUTING.md#adding-sections).

---

## Deprecated / under review

| Id | Reason |
|---|---|
| `huevo-del-dia` | Vertical-specific (egg farm); evaluating whether to deprecate in favour of generic `product-of-the-day` |
| `nutritional-info` | Was deleted in PR #34 then restored — conflicting signals; confirm with egg-farm tenant before cleanup |

---

_Last reviewed: April 2026 — after PR #34 (+22 sections) and PR #40 (+4 sushi sections)._
