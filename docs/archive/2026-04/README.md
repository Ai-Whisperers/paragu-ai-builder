# Archive — April 2026

Point-in-time status reports and completion summaries moved here as part of the [docs consolidation](../../DOCS_CONSOLIDATION_PLAN.md) (Phase B.1).

These files are **preserved for historical audit trail** — they describe work completed or state snapshots at specific moments. They are NOT current documentation.

For the current state of the repo, see:

- [/README.md](../../../README.md) — system map
- [/ARCHITECTURE.md](../../../ARCHITECTURE.md) — architectural overview
- [docs/reference/](../../reference/) — live catalogs (sections, business types, API)
- Git log + merged PR descriptions — authoritative change record

## What's here

| File | Original location | What it was |
|---|---|---|
| `BUG_HUNT_REPORT_2026-04-20.md` | `docs/` | Snapshot of bugs found during 2026-04-20 hunt session |
| `BUNDLE_OPTIMIZATION.md` | root | Historical notes on bundle-size work |
| `DEPLOY_STATUS.md` | root | Point-in-time deployment status with URLs + test results |
| `IMPLEMENTATION_CHECKLIST.md` | `docs/` | Point-in-time implementation tracker |
| `IMPLEMENTATION_COMPLETE.md` | root | Completion report for a phase of work |
| `IMPLEMENTATION_COMPLETE_SUMMARY.md` | `docs/` | Summary of the above |
| `IMPLEMENTATION_SUMMARY.md` | root | Executive summary of implementation work |
| `IMPROVEMENT_DOCUMENTATION_SUMMARY.md` | `docs/` | Meta-summary of documentation improvements |
| `PROJECT_STATUS_SUMMARY.md` | `docs/` | Executive status report (grade, issues, timeline) |
| `PROJECT_TRANSFORMATION_COMPLETE.md` | `docs/` | Completion report for security+perf transformation |
| `SECURITY_REMEDIATION_COMPLETE.md` | `docs/` | Completion report for security fixes |
| `SUPABASE_OPTIMIZATION_COMPLETE.md` | `docs/` | Completion report for Supabase connection optimization |
| `TRANSFORMATION_SUMMARY.md` | root | 5 security + 4 perf + 108 files executive summary |
| `UXUI_IMPLEMENTATION_SUMMARY.md` | `docs/` | Summary of UI/UX implementation work |
| `WINS_76_100_SUMMARY.md` | root | Progress tracking for the 76–100 "wins" effort |
| `QUICK_DEPLOY.md` | root | "Paste-me-your-creds" deploy walkthrough — contains stale Supabase refs |
| `CLOUDFLARE_DEPLOY.md` | root | Cloudflare Workers deploy — superseded by `docs/how-to/deploy.md` |
| `HOSTINGER_CLOUDFLARE_SETUP.md` | root | VPS + CF-DNS walkthrough — contains stale Supabase refs; VPS section merged into canonical deploy doc |
| `DEPLOYMENT.md` | `docs/` | Original Supabase+Pages walkthrough — superseded |

> **Security note:** `QUICK_DEPLOY.md` and `HOSTINGER_CLOUDFLARE_SETUP.md` contain **two different Supabase project URLs + publishable keys** hard-coded. Publishable (anon) keys are designed to be client-exposed under RLS, but shipping them in committed docs is sloppy. The projects referenced (`okddppczckbjdotrxiev` and `qyvokpribmbrosafntqa`) should be verified — if either is current, rotate the publishable key as a hygiene step and remove from the archive with a redacted stub.

## Why they're archived, not deleted

The [consolidation principles](../../DOCS_CONSOLIDATION_PLAN.md#principles) say: **archive over delete**. Completed work is real history — the audit trail is valuable. But these docs are not how readers find current information today.

If you need the content:

- **Still relevant context** (why X was done, what tradeoffs were considered) — read the original file in this dir.
- **What the code currently does** — read `ARCHITECTURE.md` or the relevant `reference/` doc.
- **When and by whom** — `git log` on the specific change, or the merged PR description.

## Future status reports

Do not create new files like these. Instead:

- **What changed in a release** → [`CHANGELOG.md`](../../../CHANGELOG.md) _(planned)_
- **What this PR does** → the PR description
- **Architecture rationale** → update the relevant `docs/explanation/` file
- **Completed roadmap items** → tick them in `docs/02_STRATEGY/EPIC_PLAN.md` and reference the merge commit

---

_Archived 2026-04-20._
