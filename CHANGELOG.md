# Changelog

All notable changes to this project are documented here. Format follows [Common Changelog](https://common-changelog.org/). Versions are currently date-tagged (calendar releases) rather than semver — the project is pre-1.0 and pushes to production continuously.

## 2026-04-20

### Added
- Canonical doc set: `README.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md` at repo root, `docs/README.md` as hub, and `docs/reference/{SECTIONS,BUSINESS_TYPES,API,TENANTS,TOKENS,ENV_VARS}.md` as lookup catalogs (PRs #41, #45)
- `docs/how-to/deploy.md` — canonical deploy guide consolidating 4 legacy docs (PR #43)
- `docs/how-to/generate-images.md` — canonical image pipeline consolidating 4 legacy GEMINI/IMAGES docs (PR #46)
- `docs/observability/{README,logging,tracing,metrics}.md` — per-signal observability docs (PR #44)
- 83-section component library: PR #34 added 22 reusable sections; PR #40 added 4 sushi-menu sections ported from legacy `main` branch
- 21-route API surface: PR #37 added integration webhooks (Calendly, HubSpot, Mailchimp, WhatsApp), customer-portal self-serve (subscriptions pause/skip/preferences), properties catalog, GDPR data-request handler
- Locale-prefixed tenant routing `/s/[locale]/[siteSlug]/` + 4 real tenants (`nexaparaguay`, `dayah-litworks`, `de-abasto-a-casa`, `nexa-propiedades`) (PR #38)
- SEO JSON-LD builders, perf budget, Lighthouse CI, Google Fonts URL utility (PR #35)
- Compliance templates (PY privacy, AML-Nexa, INAN-food, ToS, cookie classification) + legal-review-gate script (PR #36)
- Ops scripts: a11y-audit, audit-duplicates, cli-ops, migrate-demo-to-site, new-tenant, tenant-health (PR #39)
- Business model + AI workflow documentation (7 + 3 files, PR #33)

### Changed
- **Single trunk**: unified `main` and `Main` branches. `main` (stale lowercase) is deleted; `Main` is the sole canonical trunk (PR #40 ported the 5 unique files `main` had)
- CSP: removed duplicate CSP in `middleware.ts` that was blocking Google Fonts on tenant sites; canonical CSP lives in `next.config.mjs → headers()` (PR #32)
- Docs organisation: adopted [Diataxis framework](https://diataxis.fr/) + [matklad ARCHITECTURE.md convention](https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html). `docs/` now structured as `reference/`, `how-to/`, `observability/`, `archive/`. Legacy numbered folders preserved until the [consolidation plan](./docs/DOCS_CONSOLIDATION_PLAN.md) completes.

### Moved / Archived
- 15 status/completion reports → `docs/archive/2026-04/` (PR #42)
- 4 legacy deploy docs (`QUICK_DEPLOY`, `CLOUDFLARE_DEPLOY`, `HOSTINGER_CLOUDFLARE_SETUP`, `docs/DEPLOYMENT`) → archive + replaced by `docs/how-to/deploy.md` (PR #43)
- 4 legacy image-gen docs → archive + replaced by `docs/how-to/generate-images.md` (PR #46)
- Monolithic `docs/OBSERVABILITY.md` → archive + split into per-signal files (PR #44)
- Questionnaire duplicates (`BUSINESS_MODEL_QUESTIONNAIRE.md`, `BUSINESS_MODEL_SIMPLE.md`) → archive; `ENHANCED` variant renamed as canonical (PR #47)
- 4 Laura-egg-farm client docs → `docs/archive/2026-04/clients/laura/` (pending tenant creation) (PR #47)
- 15 `.firecrawl/` research scrapes → `docs/archive/2026-04/firecrawl-scrapes/` (PR #47)

### Security
- Discovered 2 Supabase publishable keys hard-coded in archived deploy docs (`okddppczckbjdotrxiev` + `qyvokpribmbrosafntqa`). Publishable keys are client-exposed by design (RLS enforces at DB), so risk is low — but rotating the key is recommended as a hygiene step if either project is still active. See PR #43 description.

---

## Prior history (pre-changelog)

Before 2026-04-20 the project tracked work via status-report markdown files at repo root (`IMPLEMENTATION_COMPLETE.md`, `TRANSFORMATION_SUMMARY.md`, `WINS_76_100_SUMMARY.md`, etc.). Those are archived under [`docs/archive/2026-04/`](./docs/archive/2026-04/) for historical audit. From this changelog onward, user-visible changes belong here.

For the full commit-level history, see `git log`. For merged PR descriptions, see the [GitHub PR list](https://github.com/Ai-Whisperers/paragu-ai-builder/pulls?q=is%3Apr+is%3Aclosed).

---

## Maintenance

- Add entries at the **top** under a new date heading (or version heading once we tag releases).
- Group entries as: **Added · Changed · Deprecated · Removed · Fixed · Security · Moved/Archived**.
- Link PRs with `(PR #N)`.
- Be specific: "added" beats "implemented"; mention the user-visible outcome.
- Keep entries terse — one sentence each where possible.
