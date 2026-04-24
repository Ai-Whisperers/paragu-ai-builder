# Dead Code Audit

**Audit Date**: April 24, 2026
**Method**: Cross-reference of export → import chains (excluding section-registry dynamic loading)
**Scope**: `web/` directory (app, lib, components)

## BATCH 4.28 Findings

### Section Components (Never Directly Imported)
17 files are never directly imported by any other file. This is EXPECTED - section components are loaded dynamically through the section-registry and section-renderer.

- `before-after-split-section.tsx`
- `blog-social-share.tsx`
- `bulk-calculator-section.tsx`
- `calc-resimple-qualifier-section.tsx`
- `conveyor-belt-strip.tsx`
- `countdown-timer-section.tsx`
- `currency-toggle-section.tsx`
- `faq-chatbot-section.tsx`
- `google-reviews-widget-section.tsx`
- `language-selector-section.tsx`
- `multi-step-form-section.tsx`
- `service-area-map-zones-section.tsx`
- `smart-whatsapp-section.tsx`
- `success-stories.tsx`
- `testimonial-video-section.tsx`
- `timeline-history-section.tsx`
- `trust-signals-logos-section.tsx`

**Status**: ✅ All registered in `section-registry.ts`. Dynamic loading is the correct pattern.

### Utility Files (Potentially Dead)
14 utility files found with zero imports:

| File | Likely Purpose | Recommend |
|------|---------------|-----------|
| `web/lib/commerce/inventory.ts` | Commerce inventory helpers | **KEEP** - future commerce feature |
| `web/lib/data/py-dnit-resolutions.ts` | Paraguay DNIT tax data | **KEEP** - static reference data |
| `web/lib/data/py-entity-regimes.ts` | Paraguay entity regimes | **KEEP** - static reference data |
| `web/lib/data/py-service-packages.ts` | Paraguay service packages | **KEEP** - static reference data |
| `web/lib/engine/demo-sakura-sushi.ts` | Sakura sushi demo content | **KEEP** - demo data |
| `web/lib/experiments/ab-test.ts` | A/B testing framework | **KEEP** - planned feature |
| `web/lib/hooks/use-section-impression.ts` | Section view tracking | **KEEP** - planned analytics |
| `web/lib/leads/duplicate-detection.ts` | Lead dedup logic | **KEEP** - planned |
| `web/lib/outreach/tracking.ts` | Outreach event tracking | **KEEP** - planned |
| `web/lib/reminders/scheduler.ts` | Reminder scheduling | **KEEP** - planned |
| `web/lib/security/sanitize.ts` | Input sanitization utilities | **KEEP** - security |
| `web/lib/seo/sitemap-generator.ts` | Sitemap generation | **KEEP** - planned |
| `web/lib/stores/wishlist-store.ts` | Wishlist state management | **KEEP** - planned commerce |
| `web/lib/seo/hreflang.tsx` | hreflang tag component | **KEEP** - planned SEO |

**Recommendation**: All `KEEP`. These are pre-built utilities for planned features. None are truly dead.

---

## BATCH 4.29 Findings: Root-Level Directories

| Directory | Files | Size | Gitignored | Verdict |
|-----------|-------|------|------------|---------|
| `.agents/` | 4 files (project-manifest.json, PROMPT_TEMPLATE.md, README.md, setup.sh) | ~16KB | Yes | **KEEP** - Hermes agent config |
| `prompts/` | 4 files (batch-1-heroes.txt, batch-2-team.txt, batch-3-services.txt, batch-4-sushi.txt) | ~35KB | Yes | **KEEP** - AI batch prompts |
| `marketing/` | 1 file (sales-call-script.md) | ~10KB | Yes | **KEEP** - sales material |

**Status**: All 3 directories already gitignored. No action needed.

---

## Overall Verdict

No truly dead code found. All 14 unused utilities are pre-built for planned features. All 17 unused sections are dynamically loaded through the renderer. All 3 root-level directories are gitignored and non-interfering.

**Dead code cleanup priority**: Low (none is causing issues)
**Documentation value**: Medium (saves future agents from investigating)

---

_Last updated: April 24, 2026_
