# Stoic Finch — Feature Plan

> Action list distilled from `COMPETITIVE_RESEARCH.md`.
> Each item: scope, files touched, blocking dependency, owner role.

## P0 — Pre-launch blockers (~3 days)

| # | Task | Files | Depends on | Owner |
|---|---|---|---|---|
| P0.1 | Collect 3-5 named testimonials (quote, name, role, company, photo) | `content/en.json` → `home.testimonialsList` | Client supplies | Client + builder |
| P0.2 | Wire `testimonials-section` into `pages/home.json` between services and process | `pages/home.json`, `site.json.features.testimonials = true` | P0.1 | Builder |
| P0.3 | Collect 6-12 client logos (SVG/PNG, brand-cleared) | `images/clients/` + `content/en.json` → `home.trust.logos` | Client supplies + cleared for use | Client + builder |
| P0.4 | Wire `trust-signals-logos-section` to home | `pages/home.json` | P0.3 | Builder |
| P0.5 | Founder bio + photo, 1 team paragraph | `content/en.json` → `about.team` | Client supplies | Client |
| P0.6 | Add team grid to home (or create `pages/about.json`) | `pages/home.json` or new `pages/about.json` | P0.5 | Builder |
| P0.7 | Replace `placeholderFields` in `site.json` (email, phone, full address) | `site.json` | Client supplies | Client |
| P0.8 | Flip `is_demo: false`, `isLiveProduction: true`, drop `demoMode` block | `site.json` | All P0 above | Builder |
| P0.9 | Verify `/s/en/stoicfinch` renders clean — no demo badge, no placeholders | manual QA | P0.8 | Builder |

## P1 — Match table-stakes (~3 weeks)

### Per-service deep-dive pages (5 pages)

| # | Page slug | URL | Purpose |
|---|---|---|---|
| P1.1 | `services/reports-dashboarding` | `/s/en/stoicfinch/services/reports-dashboarding` | Power BI / Tableau exec dashboards |
| P1.2 | `services/data-analysis` | `…/services/data-analysis` | Cohort, funnel, retention analyses |
| P1.3 | `services/data-science` | `…/services/data-science` | Forecasting, classification, recsys |
| P1.4 | `services/data-engineering` | `…/services/data-engineering` | Pipelines, warehouse, observability |
| P1.5 | `services/data-strategy` | `…/services/data-strategy` | Roadmap, governance, data-product PM |

Each page schema (reuse for all 5):
```
header → hero (service-specific) → features (3 deliverables) → services (sub-services) → 
case-studies-teaser (1-2) → process (mini timeline) → contact (or lead-form) → footer
```

Update `web/lib/engine/static-sites.ts` `pages` array to include all 5 slugs.

### Case studies (3 launch + index)

| # | Item | File |
|---|---|---|
| P1.6 | Index page | `pages/case-studies.json` |
| P1.7 | 3 case studies (template each: `pages/case-studies/{slug}.json`) | + `content/en.json` → `caseStudies.{slug}` |
| P1.8 | Required fields per case: client, industry, situation, intervention, stack, quantified result, named quote | content shape |

### Methodology / process (1 page or in-page section)

| # | Item | File |
|---|---|---|
| P1.9 | Formalize 3-mode methodology with deliverables per stage | `pages/methodology.json` (or expand existing `home.workingWithUs`) |

### Blog scaffolding + 3 launch posts

| # | Item | File |
|---|---|---|
| P1.10 | Blog index | `pages/blog.json` |
| P1.11 | 3 launch posts | `content/blog/{slug}.json` (or `pages/blog/{slug}.json`) |
| P1.12 | Suggested titles (founder-authority): "Building your first dashboard from scratch", "When to hire a data team vs. embed one", "Five signs your reporting is costing you a half-FTE" | content |

### Newsletter

| # | Item | File |
|---|---|---|
| P1.13 | Add `newsletter-signup-section` to home (above footer) and blog index | `pages/home.json`, `pages/blog.json` |
| P1.14 | Pick provider (recommend Mailchimp via existing `integrations.email` slot) | `site.json.integrations.email` |

### Legal scaffolding

| # | Item | File |
|---|---|---|
| P1.15 | Privacy policy | `pages/legal/privacy.json` + content |
| P1.16 | Terms of service | `pages/legal/terms.json` + content |
| P1.17 | Cookie policy | `pages/legal/cookies.json` + content |
| P1.18 | Footer "Legal" column linking the three | footer content update |

### Trust amplifiers

| # | Item | File |
|---|---|---|
| P1.19 | Microsoft / AWS / Databricks partner badges (if certified) | `images/partners/` + `home.trust` content |
| P1.20 | Stat trust line: "X years embedded · Y dashboards shipped · Z FTE-equivalent saved" | `content/en.json` → `home.hero.trustBadges` |

## P2 — Differentiators that drive qualified leads (~6-8 weeks)

### Free Data Health Check (lead magnet)

| # | Item | File |
|---|---|---|
| P2.1 | New page using `intake-wizard-section` | `pages/data-health-check.json` |
| P2.2 | 5-step questionnaire: industry → data sources → top pain → maturity tier → email | content keys under `dataHealthCheck.*` |
| P2.3 | Submit handler routes to existing lead-form API; success → Calendly invite | API wiring + content |
| P2.4 | Update home hero CTA from "Get Started Today" to "Get a Free Data Health Check" | `content/en.json` → `home.hero.ctaPrimaryText` |

### Calendly booking

| # | Item | File |
|---|---|---|
| P2.5 | Embed `booking-embed-section` on contact page + sticky button site-wide | `pages/contact.json` (new) + `site.json.bookingUrl` |

### Industry vertical pages (5 pages)

| # | Slug | URL |
|---|---|---|
| P2.6 | `industries/oil-and-gas` | Calgary energy sector — highest local relevance |
| P2.7 | `industries/manufacturing` | |
| P2.8 | `industries/healthcare` | |
| P2.9 | `industries/financial-services` | |
| P2.10 | `industries/b2b-saas` | |

Each: hero, 3-pillar benefits scoped to industry, 3 services scoped, 1-2 case studies teaser, contact. ~1500-2000 words for SEO.

### Local-SEO landing pages

| # | Slug | URL |
|---|---|---|
| P2.11 | `locations/calgary` | "Data consulting in Calgary" |
| P2.12 | `locations/edmonton` | |
| P2.13 | `locations/vancouver` | |

### Trust depth

| # | Item | File |
|---|---|---|
| P2.14 | Founder story page using `our-story-section` | `pages/about/founder.json` |
| P2.15 | Service-tier "starting from" pricing (`compare-plans-matrix-section`) | `pages/pricing.json` |
| P2.16 | Categorized FAQ (12-20 Qs) using `faq-categorized-section` | `pages/faq.json` |

## P3 — Long-tail growth & moats (~quarter+)

| # | Item | New code? | Notes |
|---|---|---|---|
| P3.1 | **Data maturity self-assessment** with scoring + result tier | Yes — new `maturity-assessment-section.tsx` | Highest-converting lead magnet for pro services. Multi-step → score → tier-specific result page → email capture. |
| P3.2 | Interactive sample dashboard (Power BI public iframe) | Maybe — `embed-iframe-section.tsx` if not just dropping into `features` | Demonstrates craft. |
| P3.3 | Resources hub with email-gated downloads | No (use existing `lead-form-section`) | Templates, success-story PDFs. |
| P3.4 | Podcast / YouTube embed | No (use `features-section` + iframe) | Founder authority. |
| P3.5 | Customer-portal area (login-gated) | Yes (auth + dashboard) | Defer until book justifies it. |
| P3.6 | Additional location pages (next 12 months' targets) | No | Same template as P2.11-13. |

## Section components needed but not yet built (P3 only)

| Component | Why | Scope |
|---|---|---|
| `maturity-assessment-section.tsx` | No existing scoring section; intake-wizard collects but doesn't score | ~3-5 days: form, scoring algo, result-tier renderer, lead post |

Everything else in P0–P2 reuses existing components — no engineering required for the marketing site itself, only content + JSON page configs.

## Cross-cutting non-feature work

| # | Item | Notes |
|---|---|---|
| X.1 | Image pipeline | Add `images.json` manifest for stoicfinch (currently absent — see fun4me/nexa-paraguay for reference). |
| X.2 | Domain + DNS | Decide whether stoicfinch lives at `stoicfinch.com` (their domain — needs handover) or at `paragu-ai.com/stoicfinch` (clone for analysis). |
| X.3 | GA4 property | Currently `site.json.integrations.analytics = "ga4"` but no measurement ID. |
| X.4 | OpenGraph image | Currently auto-generated from tenant route; consider a branded one. |
| X.5 | Favicon + apple-touch-icon | Needs Stoic Finch's actual brand mark. |
| X.6 | Tenant data regen | After every page/content/site/tokens edit: `cd web && npm run generate:tenant-data` |

## Definition of Done — launch (P0 complete)

- [ ] All 9 P0 tasks complete
- [ ] No `placeholderFields` remaining in `site.json`
- [ ] `is_demo: false`, `isLiveProduction: true`
- [ ] At least 3 named testimonials visible
- [ ] At least 6 client logos visible
- [ ] Founder bio visible
- [ ] Real email + phone + address in footer
- [ ] `/s/en/stoicfinch` returns 200 + no demo badge
- [ ] Lighthouse: ≥90 perf / ≥95 SEO / ≥95 accessibility
- [ ] Owner approval on copy + screenshots
