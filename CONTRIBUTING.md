# Contributing

Thanks for working on Paragu AI Builder. This doc covers the day-to-day workflow: how we branch, commit, open PRs, and gate merges. For system concepts see [ARCHITECTURE.md](./ARCHITECTURE.md); for agent-specific instructions see [CLAUDE.md](./CLAUDE.md).

## Setup

```bash
git clone https://github.com/Ai-Whisperers/paragu-ai-builder.git
cd paragu-ai-builder/web
npm install
cp .env.example .env.local    # fill in Supabase + integration keys
npm run dev                   # http://localhost:3000
```

Node 20+ required. We deploy on Cloudflare Workers; the dev server uses the Next.js runtime.

## Branch structure

| Branch | Purpose | Auto-deploy |
|--------|---------|------------|
| `Main` | Production code | Yes → Cloudflare (paragu-ai.com) |
| `dev` | Development | Yes → Preview builds |

### Workflow

```
# 1. Start on dev
git checkout dev
git pull origin dev

# 2. Create feature branch
git checkout -b feat/your-feature

# 3. Work → test → push
git push origin feat/your-feature

# 4. After testing, merge to dev
git checkout dev
git merge feat/your-feature
git push origin dev

# 5. Create PR: dev → Main after preview works
```

### Rules

- **Never push directly to Main** - all changes via PR
- **Squash-merge** - keep history linear
- **Delete branches after merge** - cleanup

## Branch naming

| Prefix | Use for | Example |
|---|---|---|
| `feat/` | new feature | `feat/subscription-pause-portal` |
| `fix/` | bug fix | `fix/middleware-csp-google-fonts` |
| `docs/` | docs-only | `docs/canonical-north-star-set` |
| `chore/` | tooling, refactor, cleanup | `chore/ops-scripts` |
| `refactor/` | non-behavioural change | `refactor/extract-site-loader` |
| `test/` | tests only | `test/scoped-query-audit` |
| `wip/` | work-in-progress backup | `wip/apr-20-snapshot` |

One branch = one focused change. If you find yourself scope-creeping, open a second branch.

## Commit messages

We follow **Conventional Commits**. The commit linter is in `commitlint.config.js`.

```
<type>(<scope>): <short summary>

<body — optional, wrap at 72 cols>

<footer — optional, e.g. "Closes #123">
```

Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `perf`, `build`, `ci`.

Scope is optional but helpful for large areas: `engine`, `api`, `sites`, `middleware`, `obs`, `compliance`.

Messages focus on **why**, not what. The diff shows what.

## Pull requests

1. **Rebase on `Main` before opening.** We squash-merge, so linear history matters.
2. **Use the [PR template](./.github/pull_request_template.md).**
3. **Keep PRs small.** If it's >500 lines of non-test code, split it unless you can justify the bundle.
4. **Declare dependencies.** If PR B needs PR A merged first, say so at the top of the description.
5. **Reference issues.** `Closes #123` / `Refs #456` / `Follow-up to #789`.
6. **No auto-merge.** Every PR waits for review. `docs/*` and `chore/*` PRs can self-approve if trivial.
7. **Drafts are fine.** Open early with `[WIP]` in the title if you want feedback before it's ready.

## Quality gates

All of these run in CI (`.github/workflows/ci.yml`) and must pass before merge:

| Gate | Command | Threshold |
|---|---|---|
| Typecheck | `npm run typecheck` | zero errors |
| Lint | `npm run lint` | zero errors |
| Unit tests | `npm test` | all pass |
| Integration tests | `npm run test:integration` | all pass |
| Coverage | `npm run test:coverage` | ≥ configured (see `vitest.config.ts`) |
| E2E (on `main` merge) | `npm run test:e2e` | all pass |
| A11y (on PR) | `npx tsx web/scripts/a11y-audit.ts` | no new issues |
| Lighthouse (on PR) | `lhci autorun` | meets `lighthouserc.json` budgets |

Run the local gauntlet before pushing:

```bash
cd web
npm run typecheck && npm run lint && npm test
```

## Pre-commit hooks

Husky runs lint-staged + typecheck on every commit (`.husky/pre-commit`). Don't bypass with `--no-verify` unless truly necessary; investigate the failure instead.

If a pre-commit hook fails, the commit **did not happen** — fix the issue, re-stage, and commit again. Do not `--amend` a non-existent commit.

## Testing patterns

- **Unit tests** live next to or under `web/tests/unit/` mirroring the module path. Use Vitest + `@testing-library/react`.
- **Integration tests** hit real subsystems (the loader reads real tenant JSON from disk). See `web/tests/integration/`.
- **E2E tests** drive a browser via Playwright. See `web/tests/e2e/`. Keep them smoke-scoped — visual regression is separate.
- **Do NOT mock Supabase in tests that exercise the scoped-query boundary.** Use the integration layer or a real test project.
- **The `scoped-query-audit` test is the load-bearing one.** It enforces that every tenant-table query goes through `scopedQueries()`. Don't weaken it.

## Adding sections

Every new section:

1. Lives at `web/components/sections/<kebab-name>-section.tsx`.
2. Exports a typed Props interface.
3. Uses only `var(--*)` tokens for colors. Typography via the shared `Heading` + `Text` components.
4. Is imported and registered in `web/lib/engine/renderer.tsx` under the kebab-case key.
5. Is added to [`docs/reference/SECTIONS.md`](./docs/reference/SECTIONS.md) with a one-line description + intended category.
6. Has at least a snapshot test if stateless, or component test if interactive.

## Adding tenants

See [docs/how-to/add-tenant.md](./docs/how-to/add-tenant.md) _(planned — for now, copy an existing tenant under `sites/` and adapt)_.

The short version:

```
sites/<slug>/
├── site.json      # hostname, locales, integrations, defaultLocale
├── tokens.json    # optional brand-colour overrides
├── pages/         # at minimum home.json
└── content/       # at minimum <defaultLocale>.json
```

Validate with `npx tsx web/scripts/validate-sites.ts` before opening a PR.

## Adding business types

See [web/docs/ADDING_BUSINESS_TYPES.md](./web/docs/ADDING_BUSINESS_TYPES.md). Short version:

1. `src/registry/<type>.type.json` — section list, SEO config, default features
2. `src/tokens/<type>.tokens.json` — optional colour overrides (usually inherit base)
3. `src/content/<type>.content.json` — Spanish copy templates with `{{placeholders}}`
4. Update `src/verticals/<vertical>/vertical.json` if it belongs to a new vertical.

## Observability conventions

- Use the logger, not `console.*`. ESLint will catch it.
- Log at `info` for normal successful operations, `warn` for recoverable/expected failures, `error` for bugs.
- Use ECS field names: `trace.id`, `labels.business_id`, `http.method`, `url.path`, `error.message`, `error.stack`.
- Never log raw tokens, PII, or request bodies without running them through `redact()`.

See [ARCHITECTURE.md › Observability](./ARCHITECTURE.md#observability) for details.

## Documentation

When your change affects how the system is used, update the relevant doc in the same PR. See [docs/README.md](./docs/README.md) for the layout.

New docs should fit the Diataxis framework:
- **Tutorial** (learn by doing): `docs/tutorials/`
- **How-to** (task-focused): `docs/how-to/`
- **Reference** (factual lookup): `docs/reference/`
- **Explanation** (conceptual): `docs/explanation/`

Status/progress/completion notes belong in the PR description or [CHANGELOG.md](./CHANGELOG.md) _(planned)_, not as new markdown files.

## Security

- Never commit `.env*`, keys, tokens, or credentials.
- Report vulnerabilities privately to the maintainers per [SECURITY.md](./SECURITY.md) _(planned)_.
- Fix, don't bypass. If `npm audit` reports high/critical, resolve before merging.

## Common pitfalls

- **Forgetting `scopedQueries()`.** → `scoped-query-audit.test.ts` will fail.
- **Importing from `@/components/sections/*` into engine code.** → circular, breaks build.
- **Hardcoding colors.** → ESLint error.
- **Using `<h1>/<h2>/<h3>` in sections directly.** → ESLint error; use `Heading`.
- **Upgrading Tailwind to v4.** → build breaks on JSON scan. Pinned at 3.4.19.

## Who to ask

- Product / tenants / clients: Nyx (repo owner).
- Architecture / engine: read [ARCHITECTURE.md](./ARCHITECTURE.md) first, then ask in PR.
- Ops / deploy: see `docs/03_ARCHITECTURE/DEPLOYMENT.md` and `CLOUDFLARE_DEPLOY.md`.

---

_Last reviewed: April 2026._
