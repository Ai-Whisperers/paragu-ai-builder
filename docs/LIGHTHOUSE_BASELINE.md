# Lighthouse + a11y baseline · 2026-04-21

> First real audit of `paragu-ai.com` against Google Lighthouse + axe-core
> rules. Run from this dev machine against the live prod URLs (no
> auth required for these pages).
>
> Reports saved to `/tmp/lh-baseline/*.json`. To rerun:
>
>     cd /tmp/lh-baseline
>     for u in https://paragu-ai.com/ https://paragu-ai.com/p/peluqueria \
>              https://paragu-ai.com/precios https://paragu-ai.com/demo; do
>       slug=$(echo "$u" | sed 's|.*/||' | sed 's|^$|landing|')
>       npx lighthouse "$u" --output json --output-path "./$slug.json" \
>         --only-categories=performance,accessibility,best-practices,seo \
>         --chrome-flags="--headless=new --no-sandbox" --quiet
>     done

## Scores per page

| URL | Perf | A11y | BP | SEO | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|
| `/` (landing) | **44** ❌ | 89 | 96 | 63 | 4.6s | 2,250ms | 0 |
| `/p/peluqueria` | **98** ✅ | 96 | 96 | 66 | 2.3s | 50ms | 0 |
| `/precios` | **98** ✅ | 94 | 96 | 66 | 2.4s | 60ms | 0 |
| `/demo` | **90** ✅ | 94 | 96 | 66 | 3.4s | 60ms | 0 |

**Performance target:** ≥85 (set in `lighthouserc.json`). Landing is the
only failure.

## 🚨 LAUNCH BLOCKER · all 4 pages have `x-robots-tag: noindex, nofollow`

Discovered while running `is-crawlable` audit. Header is **not** in the
codebase, **not** in the Docker container response, **not** in Traefik
labels. Confirmed by hitting the origin directly inside the container:

    docker exec <paragu-ai_web> wget -SO- http://0.0.0.0:3000/

…returns no `x-robots-tag` header. The header is **injected by Cloudflare**
before reaching the browser. Source candidates (you must investigate in the
Cloudflare dashboard):

1. **Transform Rules** → Modify Response Header (most likely)
2. **Workers** → any worker bound to `paragu-ai.com/*`
3. **Page Rules** with "Modify Response Header"
4. **Configuration Rules** with crawler hints set wrong

This blocks Google indexing for the entire site. **Until removed, no SEO
work matters** (the 80 city × vertical pages, the 16 verticals, the blog —
all invisible to search).

## Performance · landing only

The 44/100 landing score is dominated by **TBT 2,250ms** — main thread
blocked for 2.25 seconds. Likely culprits (in priority order):

1. **Hero animations + 6 floating components mount in parallel**:
   `<FloatingShape>` × 3, `<FloatingWhatsApp>`, `<BackToTop>`,
   `<StickyMobileCTA>`, `<HeroVariantChip>`, `<ScrollDepthTracker>`,
   `<DemoBadge>`, `<TestimonialCarousel>` (auto-rotating), `<ActivityTicker>`
   (auto-rotating). Each adds JS to the main thread.
2. **`useCountUp` hook** runs animation loops on mount for the hero stats.
3. **lucide-react** icons not tree-shaken (`optimizePackageImports`
   enabled but icons might still bloat).
4. **CountUp + FadeIn together** force layout thrash on the first paint.
5. **GA4 + Cloudflare Insights scripts** load early.

`/p/[rubro]`, `/precios`, `/demo` all hit 90+ — they don't have the floating-
chrome circus that the landing page does.

### Suggested fixes

- **Defer floating components** (`<FloatingWhatsApp>`, `<BackToTop>`,
  `<StickyMobileCTA>`, `<HeroVariantChip>`, `<ScrollDepthTracker>`) behind
  `requestIdleCallback` or `<Suspense>` with a `lazy()` boundary so they
  don't compete with hero render.
- **Stop auto-rotating tickers/carousels** until first interaction or
  scroll — `<ActivityTicker>` and `<TestimonialCarousel>` start interval
  timers immediately on mount.
- **Remove or reduce `<FloatingShape>` blobs** during initial render;
  add them after FCP via dynamic import.

Estimated impact: TBT 2,250ms → ~400ms, perf 44 → 75-85.

## Accessibility · cross-page issues

### color-contrast (4/4 pages) ✅ FIXED IN THIS PR

Every `text-muted` element fails WCAG AA. Tokens were `#888888` (3.54:1
against white). Bumped to `#6b6b6b` (5.04:1, AA pass). Same for
`muted-foreground` (was `#737373` = 4.49:1).

### heading-order (3/4 pages) ✅ FIXED IN THIS PR

Footer used `<h4>` columns with no `<h3>` parents. Changed to `<h3>`. Both
the inline footer in `web/app/page.tsx` and `<SiteFooter>` need the same
fix; the inline one done here.

### button-name (1/4 pages) ✅ FIXED IN THIS PR

Mobile menu open/close buttons had no accessible text (icon-only). Added
`aria-label="Abrir menú"` + `aria-label="Cerrar menú"`.

### errors-in-console (4/4 pages) ⚠️ NOT FIXED

Browser errors logged on every page. Need to scrape and triage. Likely:
- Cloudflare Insights inline script CSP warnings
- React 19 hydration mismatch (suppressed but logged)
- 3rd-party prefetch failures

Run with DevTools open to capture. Fix in next batch.

## Best-practices · 96/100 across the board

Single recurring issue: **`legacy-javascript-insight`**. Next.js + Vite
default to ES2017 transpile target. Bumping to `es2020` saves ~20-40 KB.
Tradeoff: drops support for Safari < 13.1 (you don't care).

## SEO · 63-66/100

Driven entirely by `is-crawlable` failure (Cloudflare noindex). Without
that, all 4 pages would be 100/100 SEO.

Other minor:
- Per-vertical OG images render correctly (`/p/[rubro]/opengraph-image`)
- Schema.org Service per vertical — present
- hreflang alternates — present
- robots.txt — correct

Once Cloudflare noindex is removed, expect SEO scores to jump to 95+.

## Action items (ordered by leverage)

| # | Task | Owner | Effort |
|---|---|---|---|
| 1 | **Remove Cloudflare `x-robots-tag` injection** | You (Cloudflare dash) | 5 min |
| 2 | **Defer landing floating components** | Me | 1h |
| 3 | **Fix CSS color tokens** | Me | done in this PR |
| 4 | **Fix heading order** | Me | done in this PR |
| 5 | **Add aria-labels to icon buttons** | Me | done in this PR |
| 6 | **Fix `<SiteFooter>` heading-order** (sub-pages) | Me | 5 min |
| 7 | **Triage browser console errors** | Me | 1h |
| 8 | **ES2020 transpile target** | Me | 30 min |

P0 #1 is yours. Once you've checked Cloudflare and the noindex is gone,
re-run the audits and the scores should jump on every page except landing.
