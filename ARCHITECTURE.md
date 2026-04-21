# Architecture

This document follows the [matklad ARCHITECTURE.md convention](https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html): a bird's-eye view, a code map, cross-cutting concerns, and invariants. It's the first doc a new contributor should read after [README.md](./README.md).

## 1. Bird's-eye view

Paragu AI Builder is a **multi-tenant site generator**. A single Next.js app serves many tenants by reading per-tenant JSON at request time, merging it with vertical-level defaults and design tokens, and rendering a shared pool of React section components.

There is **no per-tenant code** — tenants are pure configuration. A new tenant requires only:

1. A `sites/<slug>/` directory with `site.json`, `pages/*.json`, `content/<locale>.json`, and optional `tokens.json`.
2. Optionally, a new business type under `src/registry/` if the tenant's vertical isn't already supported.

The application runs on **Cloudflare Workers** via [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare). Postgres lives in **Supabase**; observability in **Sentry + Cloudflare Analytics Engine + Axiom Logpush**. The admin dashboard is protected by Supabase Auth and gated in [`middleware.ts`](./web/middleware.ts).

## 2. Code map

### `src/` — the data layer (code-free)

JSON schemas, design tokens, business-type registry, vertical catalogs, content templates, compliance templates. All code-free and tenant-agnostic — the only things that change per-tenant live under `sites/`.

```
src/
├── schemas/         JSON Schema definitions (base + per-business-type)
├── tokens/          31 token files — base + per-vertical overrides
├── registry/        Business-type definitions (sections, features, SEO)
├── verticals/       23 verticals — each groups related business types
├── content/         34 content templates with {{placeholder}} keys
└── compliance/      5 legal templates (privacy-py, terms, AML, INAN, cookies)
```

### `sites/` — the tenant layer

One directory per tenant. Everything a tenant customises lives here; nothing else.

```
sites/<slug>/
├── site.json              hostname, locales, businessType, integrations
├── tokens.json            brand-colour overrides
├── pages/                 page-by-page section ordering
│   └── <page>.json        `{ sections: [ { id, variant, content } ] }`
├── content/               locale-keyed copy
│   ├── es.json
│   ├── en.json
│   └── …                  up to 4 locales per tenant today
├── blog/                  per-locale markdown blog posts (optional)
├── assets/                tenant-owned images (optional)
└── docs/                  stakeholder + ops docs (optional; tenant-specific)
```

Five tenants are live clients: `nexa-paraguay`, `nexaparaguay`, `nexa-propiedades`, `de-abasto-a-casa`, `dayah-litworks`. Everything else under `sites/` is a demo that exercises the engine.

### `web/app/` — Next.js App Router

Two routing patterns coexist:

- **`[business]/`** — legacy flat pattern (`/gymfit-py`, `/salon-maria`). Still used by demo tenants.
- **`s/[locale]/[siteSlug]/`** — modern locale-prefixed pattern (`/s/es/nexa-paraguay/programas`). All new tenants use this. The locale segment drives `hreflang`, copy selection, and locale-scoped sitemaps.

Tenant hostnames are mapped to the modern pattern in [`middleware.ts`](./web/middleware.ts) — `nexaparaguay.com` is rewritten internally to `/s/<defaultLocale>/nexa-paraguay/…`.

Administrative surfaces are under `app/admin/` (auth-gated) and `app/api/` (21 routes — see [docs/reference/API.md](./docs/reference/API.md)).

### `web/components/sections/` — the section pool (83 components)

Every section is a self-contained React component that accepts a typed data shape. Sections are registered in [`web/lib/engine/section-registry.ts`](./web/lib/engine/section-registry.ts) and rendered via [`web/lib/engine/renderer.tsx`](./web/lib/engine/renderer.tsx). Tenants reference sections by kebab-case id in their `pages/*.json`.

Full catalog: [docs/reference/SECTIONS.md](./docs/reference/SECTIONS.md).

### `web/lib/` — library modules

| Subdir | Role |
|---|---|
| `engine/` | Composition pipeline: `site-loader` → `resolve-copy` → `resolve-site-tokens` → `site-renderer`. The heart. |
| `supabase/` | DB clients. `server.ts`, `client.ts`, `admin.ts`, and **`scoped.ts`** (which enforces per-tenant filtering). |
| `integrations/` | Registry-driven adapters: booking (Calendly, Cal.com), CRM (HubSpot, Pipedrive, Notion), email (Mailchimp, Resend), analytics (GA4, Plausible). |
| `obs/` | Structured logger, request-ID / traceparent propagation, Sentry, metrics, PII redaction. ECS-aligned field names. |
| `tokens/` | Token → CSS-variable resolver + Google Fonts URL builder. |
| `i18n/` | Locale config + routing helpers. |
| `leads/` | Lead dedup + enrichment (device, referrer, geo) before insert. |
| `seo/`, `perf/` | JSON-LD builders, LCP preload, Lighthouse budgets. |
| `security/` | DOMPurify sanitizer for any user-provided HTML. |
| `generation/`, `outreach/`, `reminders/` | Supporting logic for page composition, outreach templates, reminder scheduling. |

## 3. Request lifecycle

A tenant request flows like this:

```
Request (host: nexaparaguay.com, path: /programas)
    │
    ▼
middleware.ts ──► correlation id (traceparent / x-request-id)
    │              ├─ hostname→slug rewrite
    │              ├─ security headers (CSP et al. via next.config.mjs)
    │              ├─ admin auth guard (if /admin/*)
    │              └─ optional rate-limit (Upstash)
    ▼
app/s/[locale]/[siteSlug]/page.tsx
    │
    ▼
site-loader ──► sites/nexa-paraguay/site.json
                sites/nexa-paraguay/pages/programas.json
                sites/nexa-paraguay/content/<locale>.json
                src/registry/relocation.type.json          (vertical defaults)
                src/verticals/real-estate-relocation/…
    │
    ▼
resolve-copy (merge copy, fill {{placeholders}})
resolve-site-tokens (merge base tokens + vertical tokens + tenant tokens)
    │
    ▼
renderer.tsx (map section ids → React components, inject CSS vars)
    │
    ▼
HTML response (+ JSON-LD, sitemap links, hreflangs)
```

Every step logs to the ECS logger with `trace.id`, `labels.business_id`, `http.method`, `url.path`. Sentry captures exceptions; metrics writes flow counters to Analytics Engine.

## 4. Cross-cutting concerns

### Tenant isolation

- **Frontend**: every tenant route is scoped by `siteSlug` — a section that leaks into another tenant's route is a bug.
- **Backend**: every Supabase query MUST pass through [`scopedQueries(supabase, businessId)`](./web/lib/supabase/scoped.ts). This is enforced by a dedicated test: `web/tests/unit/scoped-query-audit.test.ts`. RLS policies reinforce it at the DB layer.

### Observability

- **Logger**: ECS-aligned fields (`@timestamp`, `log.level`, `trace.id`, `labels.*`, `http.*`, `error.*`). Defined in `web/lib/obs/logger.ts`. Console output is pretty-printed locally, JSON in production.
- **Tracing**: upstream W3C `traceparent` / `x-request-id` headers are honoured — correlation IDs propagate end-to-end. Fresh IDs generated only if none supplied.
- **Context**: [AsyncLocalStorage](https://nodejs.org/api/async_context.html) in `web/lib/obs/context.ts` propagates the request context to any code called during a request, without threading it through every signature.
- **PII**: `web/lib/obs/redact.ts` sanitises log fields with an allowlist + pattern matchers (email, JWT, bearer, card).
- **Sentry**: initialised in `web/instrumentation.ts` (server) and `web/instrumentation-client.ts` (browser). DSN is optional — absent DSN ⇒ silent no-op.

### Theming

Tokens flow: `base.tokens.json` → `<vertical>.tokens.json` → `sites/<slug>/tokens.json` → CSS custom properties on `:root`. Section components use only `var(--*)` — **never** hard-coded colors. [Enforced by ESLint](./web/eslint.config.mjs).

### i18n

Locales are declared per-tenant in `site.json`. A tenant may support 1–4 locales today; the engine resolves copy from `sites/<slug>/content/<locale>.json` and falls back to the tenant's `defaultLocale` for missing keys. Server components read the locale from route params; client components use `NEXT_LOCALE` cookie.

### Compliance

Legal documents are templates under `src/compliance/` (privacy-py, terms, AML-Nexa, INAN-food, cookie-classification). A tenant opts in via its `site.json`; the copy is spliced into the privacy page at render time. `web/scripts/legal-review-gate.ts` is a pre-deploy check that every tenant ships the required docs.

## 5. Architectural invariants

These are the rules that should never be broken. If you find yourself tempted to violate one, stop and open an issue.

1. **Every Supabase query filters by `business_id`.** Use `scopedQueries()`. No exceptions. (Enforced by `scoped-query-audit.test.ts`.)
2. **No hardcoded colours in components.** Only `var(--primary)` / `var(--surface)` / etc. (Enforced by ESLint.)
3. **No `console.*` in production code.** Use `logger` from `@/lib/logger` (a thin re-export of the obs logger). (Enforced by ESLint.)
4. **No raw `<h1>/<h2>/<h3>` in sections.** Use the shared `Heading` component for consistent semantics + styling. (Enforced by ESLint.)
5. **Server-first by default.** Client components must declare `'use client'` explicitly and should only wrap interactive leaves — not whole pages.
6. **Tailwind stays at 3.4.19.** v4 breaks the JSON-scan step. Do not upgrade.
7. **All API routes use `withRequestLog`.** It wires the logger, ALS context, and perf tracker. Never hand-roll.
8. **Errors are logged and re-thrown or returned as structured errors.** Never silently caught. (See [CLAUDE.md › Error Handling](./CLAUDE.md#error-handling-mandatory).)
9. **All generated-site UI text is Spanish.** The builder admin UI is English; tenant-facing content is per-tenant locale configuration.

## 6. Boundaries

- **`src/` vs `sites/`**: `src/` is tenant-agnostic. If something varies per-tenant, it belongs under `sites/`, not in `src/`.
- **`web/lib/engine/` vs `web/components/sections/`**: the engine composes; sections render. Sections never import from `engine/` except for types.
- **Integration adapters (`web/lib/integrations/`)**: all outbound third-party calls go through an adapter. Routes call adapters; they never import third-party SDKs directly.
- **Schema validation at boundaries only**: Zod validates user input (form bodies, API payloads) and external responses. Internal code trusts its types.

## 7. Deployment topology

- Production: single Cloudflare Worker (global edge).
- Database: one Supabase project, shared across tenants, isolated by `business_id` + RLS.
- Assets: per-tenant images in `sites/<slug>/assets/` (checked into Git today; TODO: move to Supabase Storage or R2 for scale).
- CI/CD: GitHub Actions → build with OpenNext → publish to Cloudflare.

## 8. What this architecture does NOT do (yet)

- **Tenant self-service.** Adding a tenant is a developer task today. An admin UI to add tenants without code exists in skeletal form under `app/admin/`; not feature-complete.
- **Asset CDN per tenant.** Assets are currently bundled with the Worker.
- **Per-tenant database.** Everything is shared schema + `business_id`. A schema-per-tenant or DB-per-tenant model is not needed yet and not planned.
- **Plugin system.** New section types require code. Sections are a finite, curated pool, not a plugin API.

---

_Keep this document short (≤500 lines). When a topic grows, split it into its own file under `docs/explanation/`._
