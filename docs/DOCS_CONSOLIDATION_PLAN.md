# Docs Consolidation Plan

An inventory of all 141 markdown files in the repo (April 2026 audit) with a proposed target location under the [Diataxis](https://diataxis.fr/) hierarchy described in [`docs/README.md`](./README.md).

**This is a plan, not the execution.** Nothing moves until a follow-up PR implements each section below. The plan lives in the repo so the migration can be completed incrementally without losing track.

The goal is to go from **141 scattered files → ~40 canonical docs** under clear Diataxis headings, with the rest archived (not deleted).

---

## Principles

1. **Archive over delete.** Completed plans, status snapshots, one-time reports all move to `docs/archive/YYYY-MM/`. Nothing is lost.
2. **Status → git/CHANGELOG.** Anything titled `*_COMPLETE`, `*_SUMMARY`, `WINS_*`, `DEPLOY_STATUS` belongs in a CHANGELOG entry or PR description, not the repo.
3. **Merge duplicates.** Where 2–4 docs cover the same topic from different angles, one canonical doc wins.
4. **Move tenant-specific to `sites/<slug>/docs/`.** Per-client planning artifacts (e.g. Laura egg farm) move to the tenant directory or an external CRM.
5. **Keep root clean.** Only the canonical set at repo root: `README`, `CONTRIBUTING`, `ARCHITECTURE`, `CHANGELOG`, `SECURITY`, `CODE_OF_CONDUCT`, `LICENSE`, `CLAUDE`, `AGENTS`.

---

## Proposed end state

```
/                                    ≤ 9 canonical files
  README.md            ✓ (added this PR)
  ARCHITECTURE.md      ✓ (added this PR)
  CONTRIBUTING.md      ✓ (added this PR)
  CLAUDE.md            (keep — agent instructions)
  AGENTS.md            (keep — agent config)
  CHANGELOG.md         (add — rolling change log)
  SECURITY.md          (add — vulnerability reporting)
  CODE_OF_CONDUCT.md   (add)
  LICENSE              (add)

docs/
  README.md                          ✓ (rewritten this PR)
  DOCS_CONSOLIDATION_PLAN.md         ✓ (this file)

  tutorials/
    first-tenant-site.md             (new — guided walk-through)

  how-to/
    add-tenant.md                    (merge: existing per-tenant notes)
    add-business-type.md             (keep: web/docs/ADDING_BUSINESS_TYPES.md link)
    deploy.md                        (MERGE: QUICK_DEPLOY + CLOUDFLARE_DEPLOY + HOSTINGER_CLOUDFLARE_SETUP + DEPLOY_STATUS + docs/03_ARCHITECTURE/DEPLOYMENT.md)
    run-tests.md                     (keep: web/docs/TESTING.md link)
    generate-images.md               (merge: GEMINI_*.md)
    set-up-github-projects.md        (keep: 04_IMPLEMENTATION/GITHUB_PROJECTS_SETUP.md)

  reference/
    SECTIONS.md                      ✓ (added this PR)
    BUSINESS_TYPES.md                ✓ (added this PR)
    API.md                           ✓ (added this PR)
    TENANTS.md                       (move: docs/03_ARCHITECTURE/TENANTS.md + refresh)
    TOKENS.md                        (move: web/docs/TOKEN_SYSTEM.md)
    ENV_VARS.md                      (new — from web/lib/env.ts schema)

  explanation/
    multi-tenancy.md                 (new — how isolation actually works end-to-end)
    composition-pipeline.md          (new — site.json → HTML)
    theming.md                       (new — tokens → CSS variables)
    why-next-15-cf-workers.md        (new — architectural rationale)

  observability/
    logging.md                       (move: docs/03_ARCHITECTURE/OBSERVABILITY.md + split)
    tracing.md                       (split from above)
    metrics.md                       (split from above)

  runbooks/
    _placeholder.md                  (one file per pageable alert, added as alerts are defined)

  archive/
    2026-04/                         (one-time dump of completion/summary docs)

  legacy/                            (existing 01–08 structure preserved until migrated)
    01_BUSINESS_MODEL/                 → keep as-is, link from README
    02_STRATEGY/                       → keep current; archive done plans
    03_ARCHITECTURE/                   → source docs for new reference/explanation
    04_IMPLEMENTATION/                 → each → how-to/
    05_RESEARCH/                       → keep as research archive
    06_REFERENCE/                      → split: refs → reference/, status → archive/
    08_CLIENTS/                        → move to sites/<slug>/docs/ or CRM

web/docs/                            application-specific keeps its own nested docs
  README.md                          (add: index for dev docs)
  ADDING_BUSINESS_TYPES.md           (keep)
  ADMIN_GUIDE.md                     (keep)
  API_ENDPOINTS.md                   (merge: → docs/reference/API.md)
  COMPONENT_LIBRARY.md               (merge: → docs/reference/SECTIONS.md, keep a slim index here)
  DEPLOYMENT_CHECKLIST.md            (keep — dev-facing checklist distinct from how-to/deploy)
  TESTING.md, TESTING_PATTERNS.md    (keep both)
  TOKEN_SYSTEM.md                    (move: → docs/reference/TOKENS.md)
  TROUBLESHOOTING.md                 (keep — dev-facing)
  VS_CODE_SNIPPETS.md                (keep — dev-facing)

sites/<slug>/docs/                   per-tenant, no changes needed
```

---

## Per-file disposition (141 files)

### Root-level (16 files)

| File | Current status | Target |
|---|---|---|
| `README.md` | — | **Rewritten ✓ (this PR)** |
| `CLAUDE.md` | current | Keep at root |
| `AGENTS.md` | current | Keep at root |
| `CLIENTS_TENANTS.md` | current | Review → merge into `docs/reference/BUSINESS_TYPES.md` (this PR consolidates the tenant section there) |
| `PROMPTS.md` | current | Move → `docs/legacy/prompts.md` (not part of Diataxis) |
| `QUICK_COMMANDS.md` | current | Move → `docs/reference/cli-commands.md` |
| `QUICK_DEPLOY.md` | current | Merge → `docs/how-to/deploy.md` |
| `CLOUDFLARE_DEPLOY.md` | current | Merge → `docs/how-to/deploy.md` |
| `HOSTINGER_CLOUDFLARE_SETUP.md` | current | Merge → `docs/how-to/deploy.md` (DNS section) |
| `DEPLOY_STATUS.md` | historical | Archive → `docs/archive/2026-04/` |
| `DISABLE_PAGES_BUILD.md` | draft workaround | Archive or delete (verify still needed) |
| `BUNDLE_OPTIMIZATION.md` | historical | Archive → `docs/archive/2026-04/` |
| `IMAGES_START_HERE.md` | current | Move → `docs/how-to/generate-images.md` (merge with GEMINI docs) |
| `IMPLEMENTATION_SUMMARY.md` | current | **Archive** → `docs/archive/2026-04/` (status report, belongs in CHANGELOG) |
| `IMPLEMENTATION_COMPLETE.md` | current | **Archive** → `docs/archive/2026-04/` (duplicate of above) |
| `TRANSFORMATION_SUMMARY.md` | current | **Archive** → `docs/archive/2026-04/` |
| `WINS_76_100_SUMMARY.md` | historical | **Archive** → `docs/archive/2026-04/` |

### `docs/01_BUSINESS_MODEL/` (7 files) — **keep as-is**, link from README

Cohesive set, no duplicates. Value proposition, targeting, pricing, tiers, bundles, acquisition, operations. These are business-strategy docs, not technical — they are their own target.

### `docs/02_STRATEGY/` (13 files) — keep current, archive completed plans

| File | Target |
|---|---|
| `100_EASY_WINS.md` | Merge with `100_WINS_COMPLETE.md` → `docs/legacy/100_wins.md` or CHANGELOG |
| `100_WINS_COMPLETE.md` | Merge (above) |
| `20_DOLLAR_BEST_VALUE.md` | Archive (pricing analysis; superseded by 01_BUSINESS_MODEL/03_PRICING_MODEL.md) |
| `ADDITIONAL_FEATURES_ROADMAP.md` | Keep — roadmap is live |
| `BUSINESS_ANALYSIS_COMPLETE.md` | Archive (point-in-time audit) |
| `COMPLETE_REMEDIATION_PLAN.md` | Archive if executed (1,896 lines of a completed 6-week plan) |
| `EPIC_PLAN.md` | Keep — backlog |
| `EPIC_PLANNING_SUMMARY.md` | Merge into `EPIC_PLAN.md` intro |
| `FEATURE_GAP_ANALYSIS.md` | Archive (historical analysis) |
| `HOMEPAGE_IMPROVEMENT_PLAN.md` | Archive (completed) |
| `REAL_CLIENTS_ROADMAP.md` | Keep — client pipeline |
| `RESTAURANT_TEMPLATE_PLAN.md` | Keep — template roadmap |
| `STRATEGY_NEXT_STEPS.md` | Review; merge into `ADDITIONAL_FEATURES_ROADMAP.md` |

### `docs/03_ARCHITECTURE/` (8 files) — mine for new reference/explanation docs

| File | Target |
|---|---|
| `DEPLOYMENT.md` | Merge → `docs/how-to/deploy.md` |
| `OBSERVABILITY.md` | Split → `docs/observability/{logging,tracing,metrics}.md` |
| `SUPABASE_OPTIMIZATION_REPORT.md` | Keep (analysis; rename → `docs/explanation/supabase-connection-pool.md`) |
| `SUPABASE_OPTIMIZATION_COMPLETE.md` | Archive (implementation done; fold key takeaways into above) |
| `TENANTS.md` | Expand → `docs/reference/TENANTS.md` + `docs/explanation/multi-tenancy.md` |
| `TENANTS_STATUS_AND_IMAGE_REQUIREMENTS.md` | Split — status part to archive, image-requirements to `docs/how-to/generate-images.md` |
| `UNIVERSAL_COMPONENTS.md` | Merge into `docs/reference/SECTIONS.md` (as the "primitives" appendix) |
| `UNIVERSAL_COMPONENTS_SUMMARY.md` | Archive (summary of above) |

### `docs/04_IMPLEMENTATION/` (8 files) — each → `docs/how-to/`

| File | Target |
|---|---|
| `API_GENERATION_GUIDE.md` | Review — if still relevant, → `docs/how-to/generate-apis.md` |
| `GEMINI_IMAGE_GENERATION_GUIDE.md` | Merge → `docs/how-to/generate-images.md` |
| `GEMINI_TO_DRIVE_WORKFLOW.md` | Merge → `docs/how-to/generate-images.md` |
| `GEMINI_USAGE_GUIDE.md` | Merge → `docs/how-to/generate-images.md` |
| `GITHUB_PROJECTS_SETUP.md` | → `docs/how-to/set-up-github-projects.md` |
| `IMAGE_PROMPTS_QUICK_REFERENCE.md` | → `docs/reference/image-prompts.md` |
| `IMPLEMENTATION_CHECKLIST.md` | Archive (point-in-time tracker) |
| `IMPLEMENTATION_COMPLETE_SUMMARY.md` | Archive |

### `docs/05_RESEARCH/` (7 files) — keep as research archive, no movement

Taxonomies, competitor scrapes, analysis. Historical-but-useful. Add a `docs/05_RESEARCH/README.md` index if missing.

### `docs/06_REFERENCE/` (18 files) — split: refs → `reference/`, status → `archive/`

| File | Target |
|---|---|
| `README.md` | Keep as legacy index |
| `AI_BUG_HUNTING_GUIDE.md` | Keep in this folder (agent-facing) |
| `AI_SELF_CONFIGURATION.md` | Keep |
| `BUG_HUNT_REPORT_2026-04-20.md` | Archive → `docs/archive/2026-04/` |
| `COMMIT_STRATEGY.md` | Merge into `CONTRIBUTING.md` |
| `COMPREHENSIVE_AUDIT_REPORT.md` | Archive (completed audit) |
| `CRITICAL_FIXES_QUICK_REFERENCE.md` | Archive (point-in-time) |
| `DEBUGGING.md` | Move → `docs/how-to/debug.md` |
| `IMPROVEMENT_DOCUMENTATION_SUMMARY.md` | Archive |
| `PREMIUM_QUALITY_GUIDE.md` | Merge into `CONTRIBUTING.md` (quality standards section) |
| `PROJECT_STATUS_SUMMARY.md` | Archive |
| `PROJECT_TRANSFORMATION_COMPLETE.md` | Archive |
| `QUICK_REFERENCE.md` | Move → `docs/reference/cli-commands.md` |
| `SECURITY_REMEDIATION_COMPLETE.md` | Archive (completed); summarize into `SECURITY.md` |
| `UXUI_BEAUTIFICATION.md` | Merge into new `docs/explanation/design-system.md` |
| `UXUI_IMPLEMENTATION_SUMMARY.md` | Archive |
| `UX_UI_REDESIGN_PLAN.md` | Archive (completed) |

### `docs/08_CLIENTS/` (4 files) — move to tenant dir

| File | Target |
|---|---|
| `LAURA_EGG_FARM_WEBSITE_PLAN.md` | Move → `sites/laura-egg-farm/docs/plan.md` (once the tenant exists) OR external CRM |
| `LAURA_FEATURES_ROADMAP.md` | Move (same) |
| `LAURA_QUESTIONNAIRE.md` | Move (same) |
| `LAURA_QUESTIONNAIRE_SUMMARY.md` | Merge into the questionnaire |

### Business model questionnaires (top-level)

| File | Target |
|---|---|
| `BUSINESS_MODEL_QUESTIONNAIRE.md` | Archive (shorter variant superseded) |
| `BUSINESS_MODEL_QUESTIONNAIRE_ENHANCED.md` | Keep as the canonical — rename → `docs/legacy/business-model-questionnaire.md` |
| `BUSINESS_MODEL_SIMPLE.md` | Archive |
| `BUSINESS_MODEL_QUESTIONNAIRE_BASE.md` | Merge into enhanced |
| `PRICING_STRATEGY_INCOME_BASED.md` | Keep → `docs/01_BUSINESS_MODEL/08_PRICING_STRATEGY_INCOME_BASED.md` |

### `sites/*/docs/` (9 files) — **keep as-is**

Per-tenant stakeholder docs. Already in the right place. `sites/nexa-paraguay/docs/STAKEHOLDER-QA.md` etc. Verify `sites/nexa-uruguay/docs/SPIKE.md` is still relevant.

### `web/docs/` (10 files) — mostly keep; cross-link to canonical

| File | Target |
|---|---|
| `ADDING_BUSINESS_TYPES.md` | Keep — dev-facing runbook |
| `ADMIN_GUIDE.md` | Keep |
| `API_ENDPOINTS.md` | Deprecate → point to `docs/reference/API.md` |
| `COMPONENT_LIBRARY.md` | Deprecate → point to `docs/reference/SECTIONS.md` |
| `DEPLOYMENT_CHECKLIST.md` | Keep — dev-facing pre-deploy checklist |
| `TESTING.md` | Keep |
| `TESTING_PATTERNS.md` | Keep |
| `TOKEN_SYSTEM.md` | Move → `docs/reference/TOKENS.md` |
| `TROUBLESHOOTING.md` | Keep — dev-facing |
| `VS_CODE_SNIPPETS.md` | Keep — dev-facing |

### `src/compliance/` (4 templates) — **leave alone**

These aren't docs, they're data — legal templates that get spliced into tenant pages at render time. Keep where they are.

### `.firecrawl/` (10 files) — move out of repo root

Raw web scrapes used for research. Options:
1. Move → `docs/archive/firecrawl-scrapes/` (keeps history)
2. Add to `.gitignore` and rely on external research tooling to regenerate

Recommendation: **option 1** for the ones actively referenced by docs (sushi-feature-analysis), **option 2** for one-off scrapes.

### `.agents/` (2 files), `.github/` (1 file) — **leave alone**

Infrastructure; not user-facing docs.

---

## Migration sequencing

**Phase A — Canonical foundation.** ✅ Shipped in PR #41 (`bc75807`).
- Root `README`, `ARCHITECTURE`, `CONTRIBUTING`
- `docs/README.md` (hub)
- `docs/reference/SECTIONS.md`, `BUSINESS_TYPES.md`, `API.md`
- `docs/DOCS_CONSOLIDATION_PLAN.md` (this file)

**Phase B — High-value consolidations.** ✅ Shipped in PRs #42, #43, #44.
- PR #42 (`9ac6a87`): 15 status/completion reports → `docs/archive/2026-04/`
- PR #43 (`df0f1f5`): `docs/how-to/deploy.md` merging 4 deploy docs
- PR #44 (`3b26c1d`): observability monolith split into `docs/observability/{README,logging,tracing,metrics}.md`

**Phase C — Reference completion.** ✅ Shipped in PR #45 (`2ee83c6`).
- `docs/reference/TENANTS.md` (moved from `docs/03_ARCHITECTURE/`)
- `docs/reference/TOKENS.md` (moved from `web/docs/TOKEN_SYSTEM.md`)
- `docs/reference/ENV_VARS.md` (generated from `web/lib/env.ts`)

**Phase D — How-to harvest.** ✅ Shipped in PR #46 (`809334f`).
- `docs/how-to/generate-images.md` merging 3 GEMINI docs + `IMAGES_START_HERE.md`
- `docs/how-to/set-up-github-projects.md`, `docs/how-to/generate-apis.md`
- `docs/reference/image-prompts.md`

**Phase E — Cleanup.** ✅ Shipped in PR #47 (`179c5b5`).
- Questionnaire duplicates archived (`BUSINESS_MODEL_QUESTIONNAIRE.md`, `BUSINESS_MODEL_SIMPLE.md`)
- Laura client docs → `docs/archive/2026-04/clients/laura/`
- `.firecrawl/` scrapes → `docs/archive/2026-04/firecrawl-scrapes/`

**Phase F — Canonical additions.** ✅ Shipped in PR #48 (`599963d`).
- `CHANGELOG.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md` at repo root
- `docs/tutorials/first-tenant-site.md`
- **Deferred:** `LICENSE` (needs license choice), `next-openapi-gen` adoption

**Phase G — Finalization.** ✅ Shipped in this PR.
- `docs/explanation/` created with `README.md` + 3 topic stubs (multi-tenancy, composition-pipeline, theming)
- `docs/runbooks/README.md` placeholder + convention doc
- `docs/DEBUGGING.md` → `docs/how-to/debug.md`; cross-references updated in `web/lib/logger.ts`, `web/instrumentation.ts`, `web/lib/supabase/server.ts`, `sites/nexa-paraguay/docs/STAKEHOLDER-QA.md`
- `docs/QUICK_REFERENCE.md` → `docs/reference/animations.md`
- Archived per plan: `HOMEPAGE_IMPROVEMENT_PLAN.md`, `UX_UI_REDESIGN_PLAN.md`, `COMPLETE_REMEDIATION_PLAN.md`, `COMPREHENSIVE_AUDIT_REPORT.md`, `FEATURE_GAP_ANALYSIS.md`, `BUSINESS_ANALYSIS_COMPLETE.md`, `CRITICAL_FIXES_QUICK_REFERENCE.md`, `UNIVERSAL_COMPONENTS_SUMMARY.md`, `20_DOLLAR_BEST_VALUE.md`, `100_WINS_COMPLETE.md`, `EPIC_PLANNING_SUMMARY.md`, `TENANTS_ANALYSIS_AND_IMAGES.md`, `TENANTS_STATUS_AND_IMAGE_REQUIREMENTS.md`

**Still deferred** (need thoughtful prose merges, not mechanical moves):
- `COMMIT_STRATEGY.md` + `PREMIUM_QUALITY_GUIDE.md` → merge into `CONTRIBUTING.md`
- `UXUI_BEAUTIFICATION.md` + `UNIVERSAL_COMPONENTS.md` → `docs/explanation/design-system.md`
- `SUPABASE_OPTIMIZATION_REPORT.md` → `docs/explanation/supabase-connection-pool.md`
- `github-import-*.csv` (5 files) → decide: archive as historical backlog imports, or delete
- `LICENSE` — pick a license and commit

Each phase shipped as a standalone PR per the original rule — none were bundled.

---

## What NOT to do

- **Don't delete anything yet.** Everything is preserved either in a canonical location or under `docs/archive/`. Deletion is a separate later decision.
- **Don't break cross-links.** When moving a doc, leave a stub behind pointing to the new location, or update all referring docs in the same PR.
- **Don't create new root-level `.md` files.** If it's a new status report, put it in the PR description. If it's reference, put it under `docs/reference/`.
- **Don't introduce 5th "audit" or "transformation" doc.** Existing ones already cover it; update them instead.

---

_Consolidation plan last reviewed: April 2026 (after Phase G). Phases A–G complete. Remaining work is flagged under "Still deferred" above._
