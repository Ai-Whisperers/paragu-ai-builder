# Explanation

This folder holds **conceptual documentation** in the [Diataxis](https://diataxis.fr/explanation/) sense: *why* the system is built the way it is, not *how* to use it.

If you want to **do** something, you want [how-to/](../how-to/). If you want to **look something up**, you want [reference/](../reference/). If you want to **learn from scratch**, you want [tutorials/](../tutorials/).

## Current docs

| Topic | File | What it explains |
|---|---|---|
| Multi-tenancy | [multi-tenancy.md](./multi-tenancy.md) | Why every query filters by `business_id`, and how the isolation invariant is enforced |
| Composition pipeline | [composition-pipeline.md](./composition-pipeline.md) | How `site.json` + tokens + content templates become a rendered page |
| Theming | [theming.md](./theming.md) | Why the system uses CSS variables + token merging instead of per-tenant Tailwind classes |

## Style rules

- **Explain the "why".** Each doc opens with the design decision and the problem it solves.
- **Link to code, not quote it.** Reference files under `web/` or `src/` with `path:line_start-line_end` — don't paste the source.
- **Link to the related reference + how-to.** Explanation docs are gateways, not silos.
- **Keep it short.** If you need more than ~400 lines, you're probably explaining *how*, not *why* — split it into a how-to.

Authoritative deeper system tour lives in [/ARCHITECTURE.md](../../ARCHITECTURE.md); these explanation docs are focused follow-ups on individual cross-cutting concerns.
