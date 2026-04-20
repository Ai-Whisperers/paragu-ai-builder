# SEO + Performance Playbook

Living doc for the SEO + perf items shipped in Phase D of the 100-item roadmap.

## Shipped

| # | Item | Where | Notes |
|---|------|-------|-------|
| 71 | Per-locale sitemap | `app/s/[locale]/[siteSlug]/sitemap.xml/route.ts` | Auto-enumerates pages from `sites/<slug>/pages/` |
| 72 | Per-tenant `robots.txt` | `app/s/[locale]/[siteSlug]/robots.txt/route.ts` | References the per-locale sitemap |
| 73 | Dynamic OG image | `app/api/og-image/[slug]/route.tsx` | Satori-based 1200×630 render |
| 74 | JSON-LD builders | `lib/seo/json-ld.ts` + tests | `localBusiness`, `faqPage`, `breadcrumbList`, `productOffers`, `aggregateRating` |
| 80 | Perf budget map | `lib/perf/budget.ts` | Used by `cli perf-budget`; wire into Lighthouse CI |

## Remaining (documented for future work)

| # | Item | Plan |
|---|------|------|
| 75 | Critical CSS extraction | Adopt Next.js `app` route segment config + inline `<style>` for hero; rest deferred via `<link rel="stylesheet" precedence="default">`. Requires measuring current CLS on a staging tenant first. |
| 76 | Image optimization pipeline | Use `next/image` with a per-tenant CDN loader pointing at Cloudflare Images. Already partially used; needs consistent `sizes=` per section. |
| 77 | Font subsetting | Each vertical declares 2 Google Fonts in `defaults.tokens.json`. Subset via `next/font/google` with `subsets: ['latin']` for LATAM + `['latin-ext']` when EU tenants need it. |
| 78 | Lazy hydration for below-fold sections | Adopt React Server Components where possible (already mostly server-rendered). Convert `testimonials-section`, `gallery-section` to accept `priority?: boolean` and lazy-hydrate others. |
| 79 | LCP preload | Hero image gets `<link rel="preload" as="image">` — add to `app/[business]/page.tsx` and site renderer head. |

## CI integration

Add to `.github/workflows/ci.yml`:

```yaml
- name: Perf budget (content size)
  run: |
    for slug in $(ls sites/); do
      [ -d "sites/$slug" ] || continue
      npx tsx web/scripts/cli-ops.ts perf-budget "$slug"
    done

- name: SEO JSON-LD tests
  run: cd web && npx vitest run tests/unit/seo
```

## Lighthouse thresholds

Set in `lighthouserc.json` when adopted:

```json
{
  "ci": {
    "assert": {
      "assertions": {
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-blocking-time": ["error", { "maxNumericValue": 300 }],
        "interactive": ["warn", { "maxNumericValue": 3800 }]
      }
    }
  }
}
```
