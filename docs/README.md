# Documentation Hub

This is the documentation index. Docs are organised by **audience and intent**, following the [Diataxis framework](https://diataxis.fr/):

- **Tutorials** — guided learning. "Walk me through X for the first time."
- **How-to** — task recipes. "I know what I want; how do I do it?"
- **Reference** — factual lookup. "What sections exist? What does this config field mean?"
- **Explanation** — conceptual understanding. "Why is the system built this way?"

The [docs consolidation plan](./DOCS_CONSOLIDATION_PLAN.md) tracked the migration from 141 scattered files to this structure. Phases A–G are complete; the plan is now the index of what was consolidated and what remains deferred.

## Start here

| If you are… | Read first |
|---|---|
| New to the repo | [/README.md](../README.md) → [/ARCHITECTURE.md](../ARCHITECTURE.md) |
| Learning by doing | [tutorials/first-tenant-site.md](./tutorials/first-tenant-site.md) |
| Contributing code | [/CONTRIBUTING.md](../CONTRIBUTING.md) |
| An AI agent working here | [/CLAUDE.md](../CLAUDE.md) + [/AGENTS.md](../AGENTS.md) |
| Onboarding a new business type | [/web/docs/ADDING_BUSINESS_TYPES.md](../web/docs/ADDING_BUSINESS_TYPES.md) |
| Looking up an API route | [reference/API.md](./reference/API.md) |
| Looking up a section component | [reference/SECTIONS.md](./reference/SECTIONS.md) |
| Looking up a business type or tenant | [reference/BUSINESS_TYPES.md](./reference/BUSINESS_TYPES.md) + [reference/TENANTS.md](./reference/TENANTS.md) |
| Looking up environment variables | [reference/ENV_VARS.md](./reference/ENV_VARS.md) |
| Shipping to production | [how-to/deploy.md](./how-to/deploy.md) |
| Generating images for a tenant | [how-to/generate-images.md](./how-to/generate-images.md) |
| Debugging a live issue | [how-to/debug.md](./how-to/debug.md) + [observability/](./observability/) |
| Understanding why the system is built this way | [explanation/](./explanation/) |
| Responding to an alert | [runbooks/](./runbooks/) _(one file per alert, added as alerts are defined)_ |
| Asking "why did we pick X?" | [decisions/](./decisions/) — ADR log of locked-in technical choices |

## Canonical layout

```
docs/
├── README.md                         (this file — the hub)
├── DOCS_CONSOLIDATION_PLAN.md        (migration log — phases A–G complete)
│
├── tutorials/                        step-by-step learning
│   └── first-tenant-site.md          guided walkthrough
│
├── how-to/                           task recipes
│   ├── deploy.md                     ship to Cloudflare Workers
│   ├── debug.md                      investigate production issues
│   ├── generate-images.md            run the image pipeline
│   ├── generate-apis.md              regenerate API types
│   └── set-up-github-projects.md     configure GitHub Projects
│
├── reference/                        factual catalogs
│   ├── API.md                        21 API routes
│   ├── SECTIONS.md                   83 section components
│   ├── BUSINESS_TYPES.md             types + verticals + tenants
│   ├── TENANTS.md                    tenant data model
│   ├── TOKENS.md                     design tokens
│   ├── ENV_VARS.md                   environment variables
│   ├── image-prompts.md              per-vertical image prompt palettes
│   └── animations.md                 CSS animation utility classes
│
├── explanation/                      conceptual — "why is it built this way?"
│   ├── README.md
│   ├── multi-tenancy.md
│   ├── composition-pipeline.md
│   └── theming.md
│
├── observability/                    one file per signal type
│   ├── README.md
│   ├── logging.md
│   ├── tracing.md
│   └── metrics.md
│
├── runbooks/                         one file per pageable alert
│   └── README.md                     convention (no runbooks yet — populated as alerts are defined)
│
├── decisions/                        ADRs — "why we picked X over Y"
│   └── README.md                     index + format
│
└── archive/                          superseded/completed — preserved for audit
    └── 2026-04/                      39 files archived during the consolidation
```

Per-tenant docs live under `sites/<slug>/docs/`. Developer-facing docs live under `web/docs/`.

## Still at docs/ root (kept on purpose)

The flat files at `docs/*.md` that remain are cohesive sets the consolidation plan kept in place rather than nest into sub-folders:

| Cluster | Files | Why kept |
|---|---|---|
| Business-model pack | `01_VALUE_PROPOSITION.md` – `07_SUPPORT_OPERATIONS.md`, `BUSINESS_MODEL_QUESTIONNAIRE_ENHANCED.md`, `PRICING_DEEP_RESEARCH.md`, `PRICING_FRAMEWORK_SUMMARY.md`, `SUBSCRIPTION_COST_ANALYSIS.md` | Active business-strategy docs — read top-down, not looked up |
| Strategy / roadmaps | `ADDITIONAL_FEATURES_ROADMAP.md`, `EPIC_PLAN.md`, `REAL_CLIENTS_ROADMAP.md`, `RESTAURANT_TEMPLATE_PLAN.md`, `STRATEGY_NEXT_STEPS.md`, `100_EASY_WINS.md` | Live backlogs |
| Research / taxonomies | `GLOBAL_BUSINESS_TAXONOMY.md`, `GLOBAL_BUSINESS_TYPE_ENUMERATION.md`, `LEADS_REPO_ANALYSIS.md`, `VETE_PATTERNS_ANALYSIS.md` | Research archive — referenced when adding verticals |
| Agent-facing guides | `AI_BUG_HUNTING_GUIDE.md`, `AI_SELF_CONFIGURATION.md` | Prompts/playbooks for AI agents |
| Quality/process (pending merge into CONTRIBUTING) | `COMMIT_STRATEGY.md`, `PREMIUM_QUALITY_GUIDE.md` | Deferred: need thoughtful prose merge, not a mechanical move |
| Single-topic explainers (pending migration to explanation/) | `UXUI_BEAUTIFICATION.md`, `UNIVERSAL_COMPONENTS.md`, `SUPABASE_OPTIMIZATION_REPORT.md`, `SEO_PERFORMANCE.md` | Deferred: need edit pass to fit Diataxis explanation style |
| Backlog imports | `github-import-epics.csv`, `github-import-stories.csv`, `github-import-tasks-part*.csv` | Historical — safe to archive later |

See [DOCS_CONSOLIDATION_PLAN.md § Still deferred](./DOCS_CONSOLIDATION_PLAN.md) for the precise pending actions.

## Principles for new docs

1. **One topic per file.** If two docs overlap, merge them.
2. **Follow Diataxis.** Is this teaching (tutorial), a recipe (how-to), a lookup (reference), or a concept (explanation)?
3. **Status reports are not docs.** Implementation summaries belong in PR descriptions or CHANGELOG.
4. **Archive rather than delete.** Move outdated docs to `docs/archive/YYYY-MM/` with a one-line "superseded by X" header.
5. **Cross-link.** Every reference doc links back to the relevant explanation; every how-to links to the reference it uses.
6. **Short.** Individual docs ≤1000 lines. If one grows longer, split it.
7. **No decorative emoji.** Tables and code blocks do the work.

---

_Last reviewed: April 2026 (after Phase G of the consolidation). Diataxis structure is live; legacy 01–08 numbered folders no longer exist as directories — those files live flat at `docs/` root as the business/strategy/research pack (see table above)._
