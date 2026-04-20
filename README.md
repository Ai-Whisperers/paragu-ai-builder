# Paragu AI Builder

A **multi-tenant marketing-site generator**. Ships a single Next.js 15 + Supabase + Cloudflare Workers app that renders a library of reusable section components against per-tenant JSON configuration — so new sites are _configured_, not _built_.

```
[ tenant JSON ]  +  [ vertical copy ]  +  [ design tokens ]
        ─────────────────────────────────────────────────►
                          composition engine
                                  │
                                  ▼
                      React sections (shared pool)
                                  │
                                  ▼
                Static HTML / Edge-rendered route
```

## Live tenants

| Tenant | Slug | Vertical | Hostname | Locales |
|---|---|---|---|---|
| Nexa Paraguay | `nexa-paraguay` | relocation | nexaparaguay.com | nl · en · de · es |
| Nexa Paraguay (ES landing) | `nexaparaguay` | relocation | nexaparaguay.com | es |
| Nexa Uruguay | `nexa-uruguay` | relocation | nexauruguay.com | en · es |
| Nexa Propiedades | `nexa-propiedades` | real-estate | nexapropiedades.com | es · en · pt |
| De Abasto a Casa | `de-abasto-a-casa` | meal-prep | deabastoacasa.com.py | es |
| Dayah Litworks | `dayah-litworks` | portfolio (design) | dayah-litworks.com | es |

Demo tenants (salon-maria, gymfit-py, spa-serenidad, etc.) live alongside real tenants under `sites/` to exercise the engine across verticals.

## Start here

- **New to the repo?** → [ARCHITECTURE.md](./ARCHITECTURE.md) (the 5-minute system tour)
- **Contributing code?** → [CONTRIBUTING.md](./CONTRIBUTING.md) (branch, commit, PR, quality gates)
- **Looking for something specific?** → [docs/README.md](./docs/README.md) (docs hub — every reference, how-to, and explainer)
- **Adding a new tenant?** → [docs/how-to/add-tenant.md](./docs/how-to/add-tenant.md) _(planned — see [consolidation plan](./docs/DOCS_CONSOLIDATION_PLAN.md))_
- **AI-agent-oriented context?** → [CLAUDE.md](./CLAUDE.md) (the instructions LLMs read)

## Quick start

```bash
git clone https://github.com/Ai-Whisperers/paragu-ai-builder.git
cd paragu-ai-builder/web
npm install
cp .env.example .env.local    # fill Supabase, integration keys
npm run dev                    # http://localhost:3000
```

Then open:
- `/` — builder landing
- `/s/es/nexa-paraguay` — a tenant rendered via locale-prefixed route
- `/admin/leads` — admin dashboard (auth required)

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5.x |
| Styling | Tailwind **3.4.19** (do not upgrade to v4 — see [warnings](./CLAUDE.md#critical-warnings)) |
| Database | Supabase (Postgres + RLS) |
| Edge | Cloudflare Workers via `@opennextjs/cloudflare` |
| Observability | Structured logger (ECS-aligned) + Sentry + Cloudflare Analytics Engine |
| Testing | Vitest (unit + integration) + Playwright (e2e + visual) |
| CI | GitHub Actions: lint, typecheck, test, Lighthouse, a11y |

## Repository map

```
src/                  Data layer (JSON — tenant-agnostic)
  schemas/              JSON schemas (base + per-business-type)
  tokens/               Design tokens (base + per-vertical)
  registry/             Business-type definitions
  verticals/            Vertical catalogs (relocation, food-beverage, …)
  content/              Content templates with {{placeholders}}
  compliance/           Legal templates (privacy, ToS, AML, INAN)

sites/                Tenant layer (one dir per tenant)
  <slug>/
    site.json             hostname, locales, integrations
    tokens.json           brand-colour overrides
    pages/*.json          page-by-page section lists
    content/<locale>.json per-locale copy overrides

web/                  Application layer (Next.js)
  app/                    App Router
    [business]/             flat-pattern legacy tenant routes
    s/[locale]/[siteSlug]/  locale-prefixed modern tenant routes
    admin/                  protected dashboard
    api/                    21 REST routes
  components/
    sections/               83 reusable section components
    ui/                     primitives (Button, Card, Badge via CVA)
  lib/
    engine/                 composition pipeline
    supabase/               DB clients (server / client / admin / scoped)
    integrations/           booking · crm · email · analytics adapters
    obs/                    logger · tracer · metrics · sentry
    tokens/                 token → CSS var resolver
    i18n/                   locale config + routing
  tests/                  unit · integration · e2e · a11y
  scripts/                ops toolbox (see web/scripts/)

docs/                 Long-form documentation (see docs/README.md)
```

## License

See [LICENSE](./LICENSE) _(to be added — currently inherited from parent org)_.

---

_Last reviewed: April 2026. Keep this file at ≤200 lines; long-form belongs in `docs/`._
