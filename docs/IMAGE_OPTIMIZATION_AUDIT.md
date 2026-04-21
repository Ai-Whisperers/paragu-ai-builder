# Image optimization audit · 2026-04-21

> Closes BUG_HUNT_500 #471. Snapshot of `<img>` usage and the gap to
> next/image migration. Scope: `web/components/**`.

## Summary

- **9 components** use raw `<img>` tags (12 total tag instances).
- **11/12** already have `loading="lazy"` + `decoding="async"`.
- **1/12** was missing both — fixed in this PR (`testimonials-section.tsx:155`).
- **0/12** use `width`/`height` for explicit aspect-ratio (CLS risk).
- **0/12** use next/image (would give automatic AVIF/WebP + responsive srcset).

## Why next/image migration is deferred

next/image requires either explicit `width`/`height` or `fill` + a sized
parent. For tenant content images (uploaded by clients, sourced from
Supabase storage or external CDNs), we don't know dimensions at build time
and they vary per tenant. Migration would require either:

1. **Server-side dimension lookup at build/render time** — adds a network
   round-trip per image, slows SSG.
2. **Client-side `fill` everywhere with parent aspect ratios** — already
   how most current `<img>` containers work (`aspect-square`, `aspect-video`),
   so this is the cleanest path. But every container needs auditing.
3. **Storing dimensions in the content schema** — best long-term, but
   requires authoring tooling + migration of existing tenant content.

**Decision:** ship Cloudflare-fronted `<img>` with proper `loading` +
`decoding` for now. Cloudflare Polish (already enabled per the deploy
playbook) does WebP negotiation server-side. Defer next/image migration to
a dedicated epic once we have the content-schema dimension change.

## Cloudflare Polish status

Confirmed enabled at the zone level. Polish negotiates WebP/AVIF based on
the request `Accept` header, so even bare `<img src=".../foo.jpg">`
gets served as WebP to modern browsers. This closes most of the gap.

## Affected files

| File | Tags | Has lazy/async | Has width/height |
|---|---|---|---|
| `components/sections/testimonials-section.tsx` | 1 | ✅ (fixed in this PR) | ✅ (added in this PR, 48×48) |
| `components/sections/blog-index-section.tsx` | 1 | ✅ | ❌ |
| `components/sections/blog-post-section.tsx` | 1 | ✅ | ❌ |
| `components/booking/staff-selector.tsx` | 1 | ✅ | ❌ |
| `components/catalog/product-card.tsx` | 1 | ✅ | ❌ |
| `components/portfolio/before-after.tsx` | 2 | ✅ | ❌ |
| `components/portfolio/portfolio-gallery.tsx` | 2 | ✅ | ❌ |
| `components/universal/photo-gallery.tsx` | 2 | ✅ | ❌ |
| `components/universal/business-header.tsx` | 1 | ✅ | ❌ |

## Lighthouse impact

Per `docs/LIGHTHOUSE_BASELINE.md`, image-related issues did NOT appear in
the perf breakdown for any of the 4 audited URLs. The landing page
performance bottleneck was JS execution time (TBT 2.25s), now fixed via
next/dynamic. Subpages were already 90+/100.

## Follow-ups (not blocking launch)

1. **Add width/height to all `<img>`** — kills CLS, even without next/image.
   ~30 min, but requires knowing each container's intended size.
2. **Content-schema dimension fields** — store width/height with each
   tenant image. Enables next/image migration.
3. **next/image migration** — once dimensions are available, swap each
   `<img>` for `<Image>` and validate the remote-pattern allowlist in
   `next.config.mjs#images.remotePatterns`.

## See also

- `docs/LIGHTHOUSE_BASELINE.md` — perf scores, no image issues flagged
- `web/next.config.mjs` — remote-pattern allowlist for next/image
- `docs/AI_ASSETS_PLAN.md` — image generation pipeline (separate epic)
