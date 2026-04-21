# Decision log (ADRs)

> **What:** lightweight Architecture Decision Records.
> **Why:** answer "why did we pick X over Y?" without grepping commit history.
> **When to add:** any time a non-obvious technical choice gets locked in
> (framework, tool, library, schema shape, naming convention, deploy target).

## Format

One file per decision. Filename: `NNNN-short-title.md` (4-digit zero-padded
sequence). Body:

```markdown
# NNNN · <Decision title>

**Status:** Accepted · YYYY-MM-DD
**Deciders:** <names or roles>

## Context
<What's the problem? What were the constraints?>

## Options considered
- **Option A** — pros / cons
- **Option B** — pros / cons
- **Option C** — pros / cons

## Decision
<What did we pick? In one sentence.>

## Consequences
<What does this make easier / harder going forward?
What load-bearing assumptions does this rest on?>

## Revisit if
<Trigger conditions that should make us reopen this. e.g.
"Tailwind v4 ships JSON support", "Supabase adds edge-region replication",
"team grows past 5 admins".>
```

Keep ADRs **immutable once accepted** — if the decision changes, write a new
ADR that supersedes the old one (and link both ways).

## Index

- [0001 — Tailwind 3.4.19 (do not upgrade to v4)](./0001-tailwind-3-not-4.md)
- [0002 — Hostinger VPS crontab over external cron services](./0002-hostinger-cron.md)
- [0003 — Env-allowlist for admin auth (vs `profiles.role` table)](./0003-env-allowlist-admin.md)
- [0004 — Pagopar primary, MP removed, dLocal Phase 2](./0004-payments-pagopar-first.md)
- [0005 — `<img>` over `next/image` until tenant-content dimensions exist](./0005-defer-next-image.md)
- [0006 — Module-scoped Supabase client cache for cold-start fix](./0006-supabase-client-cache.md)

## See also

- `docs/runbooks/` — what to do when something breaks
- `CLAUDE.md` — current state of all conventions (decisions get summarized here)
