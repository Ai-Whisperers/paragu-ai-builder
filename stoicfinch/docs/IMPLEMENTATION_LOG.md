# Stoic Finch — Implementation Log

_2026-04-21_

## What shipped

### Tenant data
- `site.json` — full config, `is_demo: true`, all `placeholderFields` flagged
- `tokens.json` — Calgary Navy `#0B1F3A` + Glacier Teal `#14B8A6`, Inter font
- `content/en.json` — full English content for ALL pages (~1100 lines)
- `content/blog/posts.json` — 3 launch blog posts with full markdown bodies

### Pages (33 total)
Home + about, founder, methodology, services index, 5 service deep-dives, industries index, 5 industry pages, locations index, 3 location pages, case studies index, 3 case studies, pricing, faq, contact, data-health-check, data-maturity, resources, blog, privacy, terms, cookies.

### New code
- `web/components/sections/maturity-assessment-section.tsx` — scored multi-question maturity assessment with tier-specific result + lead capture. Generic, config-driven, reusable across tenants.

### Docs
- `RESEARCH.md` — public-source research dossier
- `COMPETITIVE_RESEARCH.md` — 7-firm competitive analysis
- `FEATURE_PLAN.md` — P0–P3 phased roadmap
- `IMPLEMENTATION_LOG.md` — this file

## What's blocked

### Vertical config + canonical site list
The `technology-digital` vertical's `allowedSections` is restricted to 13 sections (header, hero, services, features, case-studies, process, team, testimonials, faq, lead-form, contact, footer, whatsapp-float). The canonical site list (`web/lib/engine/static-sites.ts`) does not include `stoicfinch`. Both files are protected from modification in this environment — every Edit succeeds and is then reverted before the next operation reads them.

**Consequences:**
1. **`maturity-assessment-section` component is built but unwired.** The vertical rejects the `maturity-assessment` section ID. Workaround: `data-maturity` page uses `faq-accordion` to deliver the same content as a self-scored Q&A.
2. **Several richer sections couldn't be used:** `cta-banner`, `trust-signals`, `trust-signals-logos`, `portfolio`, `gallery`, `our-story`, `programs-comparison`, `process-timeline`, `enhanced-faq`, `intake-questionnaire`, `newsletter-signup`, `blog-index`, `blog-post`, `booking-embed`, `promo-banner`. Workarounds use the 13 allowed sections (often the generic `services` cards or `features` 3-col).
3. **Stoicfinch is absent from `static-sites.ts`.** The route still serves at `/s/en/stoicfinch` because the catch-all is `dynamic = 'force-dynamic'` with `dynamicParams = true` and the loader reads from the generated tenant-data bundle (which DOES include stoicfinch from `sites/stoicfinch/site.json`). What's lost: SSG params and sitemap auto-discovery.

### To unblock — when authorized
1. Add `stoicfinch` to `web/lib/engine/static-sites.ts` `SITES` const with the full `pages` list (33 entries — see implementation log entry for the canonical list).
2. Add to `src/verticals/technology-digital/vertical.json` `allowedSections`: `trust-signals`, `trust-badges`, `portfolio`, `gallery`, `process-timeline`, `programs-comparison`, `our-story`, `enhanced-faq`, `intake-questionnaire`, `lead-form`, `newsletter-signup`, `blog-index`, `blog-post`, `booking-embed`, `cta-banner`, `promo-banner`, `contact`, `maturity-assessment`.
3. Register `MaturityAssessmentSection` in `web/lib/engine/site-renderer.tsx` `COMPONENTS` map under id `maturity-assessment`.
4. Swap each page's section IDs back to the richer set. The content keys are already structured for the richer sections (`home.techStack`, `home.caseStudies`, `pricingPage.pricing`, `dataMaturityPage.assessment`, etc.) — the en.json doesn't need changes.

### Canonical pages list (for static-sites.ts when unblocked)

```ts
'stoicfinch': {
  slug: 'stoicfinch',
  vertical: 'technology-digital',
  country: 'Canada',
  domain: 'stoicfinch.com',
  defaultLocale: 'en',
  locales: ['en'],
  pages: [
    'home', 'about', 'founder', 'methodology', 'services',
    'service-reports-dashboarding', 'service-data-analysis',
    'service-data-science', 'service-data-engineering', 'service-data-strategy',
    'industries', 'industry-oil-and-gas', 'industry-manufacturing',
    'industry-healthcare', 'industry-financial-services', 'industry-b2b-saas',
    'locations', 'location-calgary', 'location-edmonton', 'location-vancouver',
    'case-studies', 'case-retail-saas-pipeline', 'case-oil-gas-dashboard',
    'case-healthcare-forecasting', 'pricing', 'faq', 'contact',
    'data-health-check', 'data-maturity', 'resources', 'blog',
    'privacy', 'terms', 'cookies',
  ],
},
```

## Notes on AI-placeholder content

All testimonials, case studies, team profiles, and most contact details are AI-generated placeholders consistent with the live site's voice. The tenant ships `is_demo: true` so it gets `noindex` automatically and a "Demo" badge. Replace ALL flagged fields in `site.json.placeholderFields` before any paid traffic.

## Verification

- `npm run generate:tenant-data` regenerates the tenant data bundle (must run after any en.json or page edit)
- `npm run build` builds Next.js
- Smoke test: `curl /s/en/stoicfinch` — expect 200 + populated body
- Smoke test: `curl /s/en/stoicfinch/services` and a sampling of the other 32 pages

## Useful diagnostic

To list every section ID currently registered in the renderer:

```bash
grep -oE "'[a-z-]+': [A-Z][A-Za-z]+Section|^[ ]+[a-z]+: [A-Z][A-Za-z]+Section" web/lib/engine/site-renderer.tsx
```
