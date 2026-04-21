# Glossary

> Vocabulary that recurs across this repo, in code, docs, and sales
> conversations. Read once; come back when a term confuses you.
>
> Closes BUG_HUNT_500 #493.

## Engine concepts

| Term | Definition | Where in code |
|---|---|---|
| **Vertical** | An industry group that shares a theme palette, allowed sections, and content shape. E.g. `beauty-personal-care`, `food-beverage`, `relocation`. About 23 verticals exist. | `src/verticals/<id>/` |
| **Type** (a.k.a. **Business type**, **Plantilla** in Spanish UI) | A specific business inside a vertical. E.g. `peluqueria`, `barberia`, `panaderia`. About 1,960 types exist. Each declares which sections to render and what SEO to emit. | `src/registry/<id>.type.json` |
| **Site** (a.k.a. **Tenant**) | A real or demo business with its own slug, copy, brand colors, and pages. Sites are *configured*, not *built* — they re-use the same React section components, just with different JSON. | `sites/<slug>/` |
| **Section** | A reusable React component that renders one block of a page (hero, services, testimonials, etc.). About 82 exist. | `web/components/sections/` |
| **Composition pipeline** | The build-time process that takes a site's JSON + the vertical's defaults + the type's section list, and emits the rendered page. | `web/lib/engine/compose-site.ts` |
| **Token resolver** | Merges base + vertical + per-tenant token files into the CSS variables a tenant's pages read. | `web/lib/engine/resolve-site-tokens.ts` |
| **Locale-prefixed route** | The canonical tenant URL: `/s/<locale>/<slug>` (e.g. `/s/es/nexa-paraguay`). | `web/app/s/[locale]/[site]/` |
| **Flat-slug route** | Legacy URL: `/<slug>` redirects to the locale-prefixed canonical via the middleware rewrite. | `web/middleware.ts` |

## Tenant lifecycle

| Term | Definition |
|---|---|
| **Demo** | A site we build to show what the engine produces for a vertical. `is_demo: true` in `site.json`. WhatsApp CTAs point at the ParaguAI sales line, not at the imaginary business. Demo sites get a `<DemoBadge>` overlay and a `noindex` meta tag. |
| **Real tenant** | A paying or pilot customer's site. `is_demo: false`. Real WhatsApp number, real address, real services. Lives at the same `sites/<slug>/` path as a demo. |
| **Pilot** | A real tenant who isn't yet paying — our 6 current real tenants are all pilots. The model is "deliver value first, charge once they're getting leads". |
| **Promote** | The act of turning a demo into a real tenant. Steps in `docs/runbooks/ADD_NEW_TENANT.md` § "Promote a demo to a real tenant". |

## Pricing terms

| Term | Definition |
|---|---|
| **Setup** | One-time fee at sign-up. Plan-dependent (Gs 0 / Gs 650K / Gs 1.2M / etc). |
| **Mensualidad** | Monthly recurring fee. |
| **Plan Starter** | Free tier — subdomain `<slug>.paragu-ai.com`, single page, WhatsApp button. Used for "let me see what it'd look like" prospects. |
| **Plan Profesional** | Real domain `.com.py`, up to 5 pages, SEO, 2 monthly content updates included. |
| **Plan Negocio** | Bookings, catalog, blog, priority support. |
| **Comisión** | Our per-transaction cut on commerce sales (Pagopar split-billing). |

## Provider / payment terms

| Term | Definition |
|---|---|
| **Pagopar** | The Paraguayan payment gateway we use. Handles Bancard cards, Tigo Money, transfers. See ADR `0004`. |
| **Bancard** | The Paraguayan card-processing utility behind every PY card. Pagopar abstracts it. |
| **Tigo Money** | Local mobile-money wallet, very common for small purchases. |
| **dLocal** | Future provider (Phase 2) for international cards — relocation tenants need this. |
| **Facilitator Lite** | Our legal model: ParaguAI receives the customer payment, settles to the merchant minus our commission. Avoids per-merchant Pagopar onboarding friction. |

## Operational terms

| Term | Definition | Where |
|---|---|---|
| **CRON_SECRET** | Header (`x-cron-secret`) every cron job sends; routes 403 without it. | `web/app/api/cron/*/route.ts` |
| **`webhook_events`** | Append-only audit table for all incoming webhooks. UNIQUE on `(provider, provider_event_id)` gives replay dedup. | `supabase/migrations/20260421000000_commerce_core.sql` |
| **`analytics_events`** | Append-only event log. Front-end fires events into here via `/api/analytics/track`. | `supabase/migrations/20260422000300_analytics_events.sql` |
| **withRequestLog** | Middleware wrapper for API routes. Stamps `x-request-id`, sets up trace context, catches unhandled errors. | `web/lib/api/with-request-log.ts` |
| **checkAdmin / requireAdmin** | The two admin auth helpers. `requireAdmin()` redirects (Server Components); `checkAdmin()` returns a discriminated result (route handlers). | `web/lib/auth/admin.ts` |
| **Cloudflare Polish** | Zone-level setting that auto-converts images to WebP/AVIF based on the request's `Accept` header. Covers our `<img>` use without `next/image`. |  Cloudflare dash |

## Doc conventions

| Term | Definition |
|---|---|
| **Runbook** | What-to-do-when-X-fires document. One file per alert. Lives in `docs/runbooks/`. |
| **ADR** | Architecture Decision Record — "why we picked X over Y", immutable once accepted. Lives in `docs/decisions/`. |
| **BUG_HUNT_500** | The 500-item launch-readiness backlog at `docs/BUG_HUNT_500.md`. Source of truth for what's open/closed/in-progress. |
| **Closure log** | The append-only list at the top of `BUG_HUNT_500.md` documenting each closed item with brief context. |

## Verticals catalog (for quick reference)

`beauty-personal-care`, `health-wellness`, `food-beverage`, `hospitality-tourism`,
`service-booking`, `portfolio-professional`, `trades-home-services`, `automotive`,
`retail-local`, `education-training`, `b2b-professional`, `real-estate-relocation`,
`trades-industrial`, `agriculture-agribusiness`, `logistics-transport`,
`finance-insurance`, `technology-digital`, `arts-entertainment-venues`,
`sports-recreation`, `pets-animals`, `media-publishing`, `membership-community`,
`death-care`. Authoritative list at `src/registry/index.json#verticalsCatalog`.

## See also

- `docs/decisions/` — ADRs explaining *why* we picked each pattern
- `docs/runbooks/` — what-to-do-when things break
- `docs/reference/` — exhaustive catalogs (every section, every type)
