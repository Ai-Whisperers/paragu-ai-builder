# 0001 · Tailwind 3.4.19 (do not upgrade to v4)

**Status:** Accepted · 2026-04-15
**Deciders:** Ivan

## Context

We composed tenant themes as JSON token files (`src/tokens/<vertical>.tokens.json`)
that the build pipeline reads to generate per-tenant CSS variables. Tailwind v4
introduced a new content-scanner that aggressively parses every JSON in the
working tree, treating our token files as class candidates. That broke the
build with cryptic "unknown class" errors.

## Options considered

- **Tailwind v4 + ignore globs** — patch the v4 scanner config to exclude
  `src/tokens/**`. Risk: scanner internals are moving target; future v4 minor
  may re-break the workaround.
- **Tailwind v4 + rename token files** — move tokens out of `src/` so the
  scanner doesn't see them. Forces a wide structural change for a tooling fix.
- **Stay on Tailwind 3.4.19** — last version before the scanner change. Loses
  v4's perf gains (color-mix(), variants engine).

## Decision

Pin `tailwindcss@3.4.19` until the v4 scanner is configurable enough to ignore
JSON content directories without per-release maintenance.

## Consequences

- Pre-commit and CI pin the version explicitly; dependabot PRs that try to bump
  Tailwind get rejected.
- We forgo v4's CSS-only build mode and the new variants. Acceptable trade for
  build stability.
- `CLAUDE.md` highlights this as a "DO NOT" rule so contributors don't waste
  time chasing the upgrade.

## Revisit if

- Tailwind v4 ships an explicit "ignore JSON" config knob, OR
- Our token format moves to TypeScript (which v4 wouldn't scan), OR
- A future build-perf bottleneck makes v4's gains worth the maintenance.
