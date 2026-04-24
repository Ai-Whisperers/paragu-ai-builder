# Section Component Reference

Every section in `web/components/sections/` is listed here. Sections are building blocks tenants compose into pages via `sites/<slug>/pages/*.json`. All are referenced by **kebab-case id** in tenant JSON; the renderer normalizes camelCase aliases for backwards compatibility (see `resolveSectionAlias` in `web/lib/engine/section-registry.ts`).


**Total: 101 sections** across functional groups. Every section is theme-driven (`var(--*)` tokens only), Server Component by default unless interactive.


See [ARCHITECTURE.md § request lifecycle](../../ARCHITECTURE.md#3-request-lifecycle) for where sections fit in the pipeline.

---

## Navigation & Layout

| Id | File | Purpose |
|---|---|---|
| `footer` | `footer-section.tsx` | Navigation & Layout |
| `header` | `header-section.tsx` | Navigation & Layout |
| `language-selector` | `language-selector-section.tsx` | Navigation & Layout |
| `smart-whatsapp` | `smart-whatsapp-section.tsx` | Navigation & Layout |

## Hero & Landing

| Id | File | Purpose |
|---|---|---|
| `cta-banner` | `cta-banner-section.tsx` | Hero & Landing |
| `hero` | `hero-section.tsx` | Hero & Landing |

## Features & Services

| Id | File | Purpose |
|---|---|---|
| `features` | `features-section.tsx` | Features & Services |
| `process` | `process-section.tsx` | Features & Services |
| `process-timeline` | `process-timeline-section.tsx` | Features & Services |
| `programs-comparison` | `programs-comparison-section.tsx` | Features & Services |
| `services` | `services-section.tsx` | Features & Services |
| `tiered-service-ladder` | `tiered-service-ladder-section.tsx` | Features & Services |
| `timeline-history` | `timeline-history-section.tsx` | Features & Services |
| `why-destination` | `why-destination-section.tsx` | Features & Services |

## Pricing & Commerce

| Id | File | Purpose |
|---|---|---|
| `commerce-catalog` | `commerce-catalog-section.tsx` | Pricing & Commerce |
| `currency-toggle` | `currency-toggle-section.tsx` | Pricing & Commerce |
| `membership-plans` | `membership-plans-section.tsx` | Pricing & Commerce |
| `price-list` | `price-list-section.tsx` | Pricing & Commerce |
| `pricing-range` | `pricing-range-section.tsx` | Pricing & Commerce |
| `pricing-table` | `pricing-table-section.tsx` | Pricing & Commerce |
| `product-catalog` | `product-catalog-section.tsx` | Pricing & Commerce |
| `subscription` | `subscription-section.tsx` | Pricing & Commerce |

## Booking & Scheduling

| Id | File | Purpose |
|---|---|---|
| `booking` | `booking-section.tsx` | Booking & Scheduling |
| `class-schedule` | `class-schedule-section.tsx` | Booking & Scheduling |
| `delivery-slot-picker` | `delivery-slot-picker-section.tsx` | Booking & Scheduling |
| `preorder-calendar` | `preorder-calendar-section.tsx` | Booking & Scheduling |
| `room-booking` | `room-booking-section.tsx` | Booking & Scheduling |
| `sample-week-preview` | `sample-week-preview-section.tsx` | Booking & Scheduling |
| `weekly-schedule` | `weekly-schedule-section.tsx` | Booking & Scheduling |

## Calculators & Tools

| Id | File | Purpose |
|---|---|---|
| `bulk-calculator` | `bulk-calculator-section.tsx` | Calculators & Tools |
| `calc-aguinaldo` | `calc-aguinaldo-section.tsx` | Calculators & Tools |
| `calc-costo-empleado` | `calc-costo-empleado-section.tsx` | Calculators & Tools |
| `calc-finiquito` | `calc-finiquito-section.tsx` | Calculators & Tools |
| `calc-ips` | `calc-ips-section.tsx` | Calculators & Tools |
| `calc-ire` | `calc-ire-section.tsx` | Calculators & Tools |
| `calc-irp` | `calc-irp-section.tsx` | Calculators & Tools |
| `calc-iva` | `calc-iva-section.tsx` | Calculators & Tools |
| `calc-resimple-qualifier` | `calc-resimple-qualifier-section.tsx` | Calculators & Tools |
| `delivery-calculator` | `delivery-calculator-section.tsx` | Calculators & Tools |
| `mortgage-calculator` | `mortgage-calculator-section.tsx` | Calculators & Tools |
| `savings-calculator` | `savings-calculator-section.tsx` | Calculators & Tools |

## Forms & Lead Capture

| Id | File | Purpose |
|---|---|---|
| `contact` | `contact-section.tsx` | Forms & Lead Capture |
| `contact-strip` | `contact-strip-section.tsx` | Forms & Lead Capture |
| `intake-questionnaire` | `intake-questionnaire-section.tsx` | Forms & Lead Capture |
| `intake-wizard` | `intake-wizard-section.tsx` | Forms & Lead Capture |
| `lead-form` | `lead-form-section.tsx` | Forms & Lead Capture |
| `multi-step-form` | `multi-step-form-section.tsx` | Forms & Lead Capture |
| `newsletter-signup` | `newsletter-signup-section.tsx` | Forms & Lead Capture |
| `quote-form` | `quote-form-section.tsx` | Forms & Lead Capture |

## Content & Media

| Id | File | Purpose |
|---|---|---|
| `before-after` | `before-after-section.tsx` | Content & Media |
| `before-after-split` | `before-after-split-section.tsx` | Content & Media |
| `blog-index` | `blog-index-section.tsx` | Content & Media |
| `blog-post` | `blog-post-section.tsx` | Content & Media |
| `gallery` | `gallery-section.tsx` | Content & Media |
| `photo-gallery` | `photo-gallery-section.tsx` | Content & Media |
| `portfolio` | `portfolio-section.tsx` | Content & Media |

## Trust & Social Proof

| Id | File | Purpose |
|---|---|---|
| `google-reviews-widget` | `google-reviews-widget-section.tsx` | Trust & Social Proof |
| `referral` | `referral-section.tsx` | Trust & Social Proof |
| `reviews` | `reviews-section.tsx` | Trust & Social Proof |
| `team` | `team-section.tsx` | Trust & Social Proof |
| `testimonial-video` | `testimonial-video-section.tsx` | Trust & Social Proof |
| `testimonials` | `testimonials-section.tsx` | Trust & Social Proof |
| `trust-badges` | `trust-badges-section.tsx` | Trust & Social Proof |
| `trust-signals` | `trust-signals-section.tsx` | Trust & Social Proof |
| `trust-signals-logos` | `trust-signals-logos-section.tsx` | Trust & Social Proof |

## Status & Real-time

| Id | File | Purpose |
|---|---|---|
| `countdown-timer` | `countdown-timer-section.tsx` | Status & Real-time |
| `emergency-indicator` | `emergency-indicator-section.tsx` | Status & Real-time |
| `open-hours-status` | `open-hours-status-section.tsx` | Status & Real-time |
| `stock-indicator` | `stock-indicator-section.tsx` | Status & Real-time |

## Food & Menu

| Id | File | Purpose |
|---|---|---|
| `menu-categorized-priced` | `menu-categorized-priced-section.tsx` | Food & Menu |
| `omakase` | `omakase-section.tsx` | Food & Menu |
| `recipe` | `recipe-section.tsx` | Food & Menu |
| `sake-menu` | `sake-menu-section.tsx` | Food & Menu |

## FAQ & Info

| Id | File | Purpose |
|---|---|---|
| `enhanced-faq` | `enhanced-faq-section.tsx` | FAQ & Info |
| `faq` | `faq-section.tsx` | FAQ & Info |
| `faq-categorized` | `faq-categorized-section.tsx` | FAQ & Info |
| `faq-chatbot` | `faq-chatbot-section.tsx` | FAQ & Info |

## Real Estate & Hospitality

| Id | File | Purpose |
|---|---|---|
| `event-venues` | `event-venues-section.tsx` | Real Estate & Hospitality |
| `property-listings` | `property-listings-section.tsx` | Real Estate & Hospitality |

## Compliance

| Id | File | Purpose |
|---|---|---|
| `compliance-disclaimer-footer` | `compliance-disclaimer-footer-section.tsx` | Compliance |
| `regulatory-status-badge` | `regulatory-status-badge-section.tsx` | Compliance |

## Booking internals

| Id | File | Purpose |
|---|---|---|
| `booking-embed` | `booking-embed-section.tsx` | Booking internals |

## Other

| Id | File | Purpose |
|---|---|---|
| `age-gate` | `age-gate-section.tsx` | Other |
| `b2b-wholesale` | `b2b-wholesale-section.tsx` | Other |
| `blog` | `blog-section.tsx` | See component |
| `color-coded-menu` | `color-coded-menu-section.tsx` | See component |
| `conveyor-belt` | `conveyor-belt-section.tsx` | Other |
| `featured-products` | `featured-products-section.tsx` | See component |
| `illustration` | `illustration-section.tsx` | Other |
| `instagram-feed` | `instagram-feed-section.tsx` | Other |
| `mattress-quiz` | `mattress-quiz-section.tsx` | Other |
| `maturity-assessment` | `maturity-assessment-section.tsx` | Other |
| `our-story` | `our-story-section.tsx` | Other |
| `packages` | `packages-section.tsx` | Other |
| `promo-banner` | `promo-banner-section.tsx` | See component |
| `related-posts` | `related-posts-section.tsx` | See component |
| `resources-list` | `resources-list-section.tsx` | See component |
| `service-area-map-zones` | `service-area-map-zones-section.tsx` | Other |
| `tax-deadline-banner` | `tax-deadline-banner-section.tsx` | See component |
| `tax-savings-calculator` | `tax-savings-calculator-section.tsx` | See component |
| `weekly-cadence-calendar` | `weekly-cadence-calendar-section.tsx` | See component |

---

## Conventions

- **Section id**: kebab-case, matches registered key in `section-registry.ts`.
- **File**: `web/components/sections/<id>-section.tsx` (except when a file exports multiple sections, e.g., `sushi-menu-sections.tsx` → `featured-menu` + `full-menu`).
- **Props**: each section exports a typed Props interface; the renderer passes `section.data` as props.
- **Tokens**: components consume `var(--primary)`, `var(--surface)`, etc. — never hardcoded colors.
---

## Adding a new section

1. Create `web/components/sections/<kebab-name>-section.tsx` with a typed Props interface.
2. Import + register in `web/lib/engine/section-registry.ts`:
```tsx
import { NewSection } from '@/components/sections/new-section'
// …
```
3. Add an entry to this file with one-line purpose.
4. Snapshot or component test under `web/tests/unit/components/`.
5. If the section is vertical-specific, add it to the relevant `src/verticals/<vertical>/vertical.json` and any business types that use it.

See [CONTRIBUTING.md § Adding sections](../../CONTRIBUTING.md#adding-sections).
---

_Last generated: 2026-04-24T21:18:57.853Z — Auto-generated from actual section files._
