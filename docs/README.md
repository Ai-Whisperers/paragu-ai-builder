# Documentation Hub

This is the documentation index. Docs are organised by **audience and intent**, following the [Diataxis framework](https://diataxis.fr/):

- **Tutorials** — guided learning. "Walk me through X for the first time."
- **How-to** — task recipes. "I know what I want; how do I do it?"
- **Reference** — factual lookup. "What sections exist? What does this config field mean?"
- **Explanation** — conceptual understanding. "Why is the system built this way?"

The repo today has 141 markdown files — many predating this structure. The [docs consolidation plan](./DOCS_CONSOLIDATION_PLAN.md) maps each legacy doc to its target home. Until that migration is complete, both this canonical layout and the legacy numbered folders (`docs/01_BUSINESS_MODEL/` … `docs/08_CLIENTS/`) coexist.

## Start here

| If you are… | Read first |
|---|---|
| New to the repo | [/README.md](../README.md) → [/ARCHITECTURE.md](../ARCHITECTURE.md) |
| Contributing code | [/CONTRIBUTING.md](../CONTRIBUTING.md) |
| An AI agent working here | [/CLAUDE.md](../CLAUDE.md) + [/AGENTS.md](../AGENTS.md) |
| Onboarding a new tenant | [how-to/add-tenant.md](./how-to/add-tenant.md) _(planned)_ |
| Onboarding a new business type | [/web/docs/ADDING_BUSINESS_TYPES.md](../web/docs/ADDING_BUSINESS_TYPES.md) |
| Looking up an API route | [reference/API.md](./reference/API.md) |
| Looking up a section component | [reference/SECTIONS.md](./reference/SECTIONS.md) |
| Looking up a business type or tenant | [reference/BUSINESS_TYPES.md](./reference/BUSINESS_TYPES.md) |
| Shipping to production | `03_ARCHITECTURE/DEPLOYMENT.md`, `/CLOUDFLARE_DEPLOY.md` _(legacy — will collapse into `how-to/deploy.md`)_ |
| Investigating an incident | [/ARCHITECTURE.md § Observability](../ARCHITECTURE.md#observability) + `03_ARCHITECTURE/OBSERVABILITY.md` |

## Canonical layout (target)

```
docs/
├── README.md                         (this file)
├── DOCS_CONSOLIDATION_PLAN.md        (migration roadmap for the 141 legacy docs)
│
├── tutorials/                         step-by-step learning
│   └── first-tenant-site.md          (planned)
│
├── how-to/                           task recipes
│   ├── add-tenant.md                 (planned)
│   ├── add-business-type.md          (→ web/docs/ADDING_BUSINESS_TYPES.md)
│   ├── deploy.md                     (planned — merges 4 legacy deploy docs)
│   └── run-tests.md                  (→ web/docs/TESTING.md)
│
├── reference/                        factual catalogs
│   ├── SECTIONS.md                   83 section components
│   ├── BUSINESS_TYPES.md             types + verticals + tenants
│   ├── API.md                        21 API routes
│   ├── TENANTS.md                    tenant model reference
│   ├── TOKENS.md                     design tokens
│   └── ENV_VARS.md                   env vars (planned)
│
├── explanation/                      conceptual
│   ├── multi-tenancy.md
│   ├── composition-pipeline.md
│   └── theming.md
│
├── observability/
│   ├── logging.md
│   ├── tracing.md
│   └── metrics.md
│
├── runbooks/                         one file per alert
│
└── archive/                          completed plans, status reports, historical
    └── 2026-04/
```

## What's live today (April 2026)

**Canonical docs written in this PR:**
- [/README.md](../README.md) — repo entry + map
- [/ARCHITECTURE.md](../ARCHITECTURE.md) — matklad-style system tour
- [/CONTRIBUTING.md](../CONTRIBUTING.md) — dev workflow
- [docs/README.md](./README.md) — this file
- [docs/reference/SECTIONS.md](./reference/SECTIONS.md) — 83 sections
- [docs/reference/BUSINESS_TYPES.md](./reference/BUSINESS_TYPES.md) — types + verticals + tenants
- [docs/reference/API.md](./reference/API.md) — 21 routes
- [docs/DOCS_CONSOLIDATION_PLAN.md](./DOCS_CONSOLIDATION_PLAN.md) — migration map

**Existing structure preserved as legacy (see the consolidation plan for per-file migration):**

| Legacy folder | What it holds | Fate |
|---|---|---|
| `docs/01_BUSINESS_MODEL/` | value prop, pricing, tiers, acquisition | Keep — link from README |
| `docs/02_STRATEGY/` | roadmaps, plans, epics | Keep current; archive completed plans |
| `docs/03_ARCHITECTURE/` | deployment, observability, tenants, components | Source of truth for explanations — move gradually to `explanation/` + `reference/` |
| `docs/04_IMPLEMENTATION/` | how-to guides (Gemini, GitHub Projects, images) | Each → `how-to/` |
| `docs/05_RESEARCH/` | taxonomies, competitor analysis | Keep as research archive |
| `docs/06_REFERENCE/` | audit reports, AI guides, quick refs | Split — refs to `reference/`, status to `archive/` |
| `docs/08_CLIENTS/` | per-client docs (Laura egg farm) | Move to `sites/<slug>/docs/` or external CRM |

Per-tenant docs live under `sites/<slug>/docs/` (example: `sites/nexa-paraguay/docs/STAKEHOLDER-QA.md`). Application/developer docs live under `web/docs/`.

## Known redundancies

Tracked in [DOCS_CONSOLIDATION_PLAN.md](./DOCS_CONSOLIDATION_PLAN.md). Summary:

| Cluster | Files | Resolution |
|---|---|---|
| Deploy guides | `QUICK_DEPLOY.md`, `CLOUDFLARE_DEPLOY.md`, `HOSTINGER_CLOUDFLARE_SETUP.md`, `DEPLOY_STATUS.md` | Collapse → `how-to/deploy.md` |
| Transformation/completion | `TRANSFORMATION_SUMMARY`, `IMPLEMENTATION_COMPLETE`, `IMPLEMENTATION_SUMMARY`, `PROJECT_TRANSFORMATION_COMPLETE`, `WINS_76_100_SUMMARY` | Archive — future summaries go in CHANGELOG or PR descriptions |
| UX/UI | `UXUI_BEAUTIFICATION`, `UXUI_IMPLEMENTATION_SUMMARY`, `UX_UI_REDESIGN_PLAN` | Single design-system doc |
| Business-model questionnaires | `BUSINESS_MODEL_QUESTIONNAIRE.md`, `BUSINESS_MODEL_QUESTIONNAIRE_ENHANCED.md`, `BUSINESS_MODEL_SIMPLE.md` | Keep one canonical, archive the others |
| Win checklists | `100_EASY_WINS.md`, `100_WINS_COMPLETE.md` | Merge into a progress ledger or move to CHANGELOG |
| Supabase optimization pair | `SUPABASE_OPTIMIZATION_REPORT.md`, `SUPABASE_OPTIMIZATION_COMPLETE.md` | Keep both (analysis + result) but mark completion as historical |
| Universal components pair | `UNIVERSAL_COMPONENTS.md`, `UNIVERSAL_COMPONENTS_SUMMARY.md` | Keep both (reference + summary) |

`.firecrawl/` contains 10 raw web scrapes used for research. They should move to `docs/archive/firecrawl-scrapes/` or be gitignored.

## Principles for new docs

1. **One topic per file.** If two docs overlap, merge them.
2. **Follow Diataxis.** Is this teaching (tutorial), a recipe (how-to), a lookup (reference), or a concept (explanation)?
3. **Status reports are not docs.** Implementation summaries belong in PR descriptions or CHANGELOG.
4. **Archive rather than delete.** Move outdated docs to `docs/archive/YYYY-MM/` with a one-line "superseded by X" header.
5. **Cross-link.** Every reference doc links back to the relevant explanation; every how-to links to the reference it uses.
6. **Short.** Individual docs ≤1000 lines. If one grows longer, split it.
7. **No decorative emoji.** Tables and code blocks do the work.

---

_Last reviewed: April 2026. Supersedes the previous 01–08 numbered index; that index lives on as the legacy navigation until consolidation completes._
