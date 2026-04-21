# 0005 · `<img>` over `next/image` until tenant-content dimensions exist

**Status:** Accepted · 2026-04-21
**Deciders:** Ivan

## Context

`next/image` would give us automatic WebP/AVIF negotiation, responsive
srcset, and lazy loading. The audit (#471, full report in
`docs/IMAGE_OPTIMIZATION_AUDIT.md`) found 12 raw `<img>` tags across
`web/components/`, all rendering tenant-supplied images (Supabase Storage
URLs or external CDNs) where dimensions aren't known at build time.

## Options considered

- **Use `<Image>` with `fill` + sized parent containers** — current containers
  already use `aspect-square` / `aspect-video`, so this is the cleanest path.
  Requires auditing every container.
- **Server-side dimension lookup at build/render** — adds a network round-trip
  per image, slows SSG.
- **Store dimensions in the content schema** — best long-term. Requires
  authoring tooling + migration of existing tenant content.

## Decision

Stay on `<img>` for now. Apply `loading="lazy"` + `decoding="async"` + explicit
`width`/`height` everywhere we can infer them. Defer the `next/image` migration
to a dedicated epic that includes the schema change.

Cloudflare Polish (zone-level setting, already enabled) handles WebP/AVIF
negotiation server-side, so the loss vs `next/image` is smaller than it appears.

## Consequences

- Lighthouse perf scores didn't flag image issues on any of the 4 audited URLs
  (the bottleneck was JS execution, fixed via `next/dynamic` in PR #114).
- We forgo `next/image`'s built-in srcset generation — Cloudflare's auto
  width-by-DPR is the closest analogue, and it ships today without code changes.
- When the schema migration lands, swapping `<img>` → `<Image>` is mechanical
  per-component.

## Revisit if

- We add a new image-heavy section (e.g. portfolio with 50+ images) where
  bandwidth becomes the dominant cost.
- We move off Cloudflare (Polish goes away).
- Tenant content authoring tool gains a "set dimensions" step.

## See also

- `docs/IMAGE_OPTIMIZATION_AUDIT.md`
