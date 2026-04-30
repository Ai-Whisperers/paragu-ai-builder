# ParaguAI Builder — Architecture & Organization Analysis

## 1. Current Architecture

```
paragu-ai-builder/                           (1 monorepo, ~13K files)
├── src/             7,642 files            ← SHARED data layer
│   ├── registry/    1,972 business types
│   ├── content/     1,789 content templates
│   ├── tokens/      1,773 visual themes
│   ├── schemas/     1,972 validations
│   └── verticals/   125 verticals
├── web/             1,805 files            ← SHARED application
│   ├── components/sections/  173 section components  (25K LOC)
│   ├── components/ui/         53 UI primitives
│   ├── lib/engine/            18 engine files
│   └── app/                   65 page routes
├── sites/             40 tenant dirs       ← UNIQUE per tenant
│   └── dayah-litworks/     29 files (content, pages, tokens, images)
└── Dockerfile ⇒ 1.17GB image
```

**The problem:** 173 section components + 18 engine files + 53 UI primitives are SHARED by ALL tenants. A change to any one of them during a client project affects every other client.

**What actually happened with dayah:** Of 18 commits, ~4 touched shared files (hero-section.tsx, portfolio-section.tsx, section-builders.ts, resolve-site-tokens.ts, compose-site.ts). The other 14 were dayah-specific (content, tokens, images). The 4 shared changes mostly improved all tenants (added missing CSS vars, fixed portfolio double-render), but ONE change (hero overlay default) hypothetically could break a light-themed tenant.

---

## 2. How Others Do It

### Pattern A: Monorepo with Per-Project Packages (Turborepo / Nx)
**Used by:** Vercel, Atlassian, Blitz.js

```
ai-whisperers/
├── packages/
│   ├── core-engine/         ← The composition engine (18 files)
│   ├── ui-primitives/       ← The 53 UI components
│   └── section-library/     ← The 173 section components
├── apps/
│   ├── paragu-ai-builder/   ← Main business: shared hosting + admin
│   ├── dayah-litworks/      ← Client site: only her data, custom sections
│   ├── fun4me/              ← Client site
│   └── nexa-paraguay/       ← Client site
```

**Pros:** Single `git clone`, shared packages as dependencies, Turborepo caching, atomic cross-project refactors.
**Cons:** Still ONE broken build can block all clients (if shared package breaks). Still one Docker image. Still need CI to prevent regressions.

**Verdict:** Better DX but same fragility. The shared packages are still shared — a bug in `section-library` crashes every tenant.

### Pattern B: Platform + Per-Client "Plugin" (Shopify Themes / WordPress Child Themes)
**Used by:** Shopify, WordPress multisite, Ghost

```
paragu-ai-platform/          ← The engine + admin (1 repo)
dayah-litworks/              ← Client: tokens, content, images only (separate repo)
fun4me-store/                ← Client: tokens, content, images only
```

The platform repo has:
- The engine (compose, render, copy system)
- All 173 section components
- The admin panel
- Shared hosting / auth

Each client repo has MINIMAL code:
- Their `site.json`, `tokens.json`, `content/*.json`
- Custom CSS overrides (if any)
- Custom section overrides (if any)
- Images
- References to which packages/versions to use

The platform imports client data at build/deploy time. Client changes NEVER break platform.

**Cons:** More complex deploy pipeline. Need platform-client version pinning. Need to test platform upgrades across all clients.

### Pattern C: Fork-Per-Client (The "Agency" Approach)
**Used by:** Small agencies, freelancers

```
paragu-ai-builder/           ← Main repo, source of truth
├── (everyone's here)
├── sites/dayah-litworks/
└── sites/fun4me-store/     ← ALL in one

dayah-litworks/              ← Fork: copy of everything, dayah-only
fun4me-store/                ← Fork: copy of everything, fun4me-only
```

Each client gets a FULL copy of the repo. They can modify ANY file without affecting others. Updates are backported from main repo via cherry-pick or merge.

**Pros:** Zero coupling. Client can modify any section component at will. Simple mental model.
**Cons:** MASSIVE duplication (13K files per client). Nightmare to backport upstream fixes. Disk space. 27,000 files to clone for 2 clients. Wasteful.

### Pattern D: NPM Package + Per-Client App (The "SDK" Approach)

```
packages/
├── @ai-whisperers/engine         ← Published NPM package
├── @ai-whisperers/sections       ← Published NPM package
└── @ai-whisperers/ui             ← Published NPM package

dayah-litworks/                    ← Standalone Next.js app
├── package.json → depends on @ai-whisperers/*
├── content/, tokens/, pages/      ← Her data
├── custom/hero-section-override.tsx  ← Her customizations
└── app/                           ← Her own Next.js app
```

Each client is a STANDALONE Next.js app that imports the shared packages as dependencies. They can override any section by creating a file with the same name in their `custom/` directory.

**Pros:** Zero coupling. Package versioning means `npm update @ai-whisperers/sections` backports fixes. Client can override anything. Each client deploys independently (own Docker container, or own Cloudflare Pages). TypeScript catches breakage.
**Cons:** More initial setup (NPM publishing pipeline). Each client needs its own deployment. More memory on VPS.

---

## 3. Recommended Approach: NPM Package + Standalone Client Apps (Pattern D)

### Why This Is Best For Us

| Factor | Current (monorepo) | Pattern D |
|--------|-------------------|-----------|
| Change in section component | Affects ALL tenants | Affects only clients that `npm update` |
| Client wants custom section | Must touch shared code (risky) | Override in their app directory |
| Deploy a client fix | Full Docker rebuild (1.17GB, 5min) | Their container only (small) |
| Onboard new client | Add to shared site.json, rebuild | `npm create ai-whisperers-client example` |
| Upgrade engine for all | Update shared code, test manually | `npm update @ai-whisperers/engine` |
| Scale to 40+ clients | Image becomes huge, build fragile | Each client is independent (parallel deploys) |

### What Lives Where

```
github.com/Ai-Whisperers/paragu-ai-platform       ← NPM packages source
github.com/Ai-Whisperers/paragu-ai-client-template  ← Starter template
github.com/Ai-Whisperers/paragu-ai-builder          ← Backward compat / admin app
github.com/Ai-Whisperers/dayah-litworks             ← Client app
github.com/Ai-Whisperers/fun4me-store               ← Client app
...
```

### Package Structure (paragu-ai-platform)

```
packages/
├── @ai-whisperers/engine/
│   ├── compose.ts               ← Composition engine (shared)
│   ├── resolve-site-tokens.ts    ← Token resolution
│   ├── resolve-copy.ts          ← Content ref resolution
│   └── package.json             ← Versioned at package level
├── @ai-whisperers/sections/
│   ├── hero/
│   │   ├── hero-section.tsx
│   │   └── variants/            ← Each variant as sub-component
│   ├── portfolio/
│   │   └── portfolio-section.tsx
│   └── ... (173 sections, but each is opt-in import)
├── @ai-whisperers/ui/
│   ├── button.tsx
│   ├── heading.tsx
│   └── ... (53 UI primitives)
└── @ai-whisperers/data/
    ├── registry/*.type.json     ← Business type definitions
    ├── content/*.content.json   ← Content templates
    ├── tokens/*.tokens.json     ← Theme tokens
    └── schemas/*.schema.json    ← Validation schemas
```

### Client App Structure (dayah-litworks)

```
dayah-litworks/
├── package.json
│   /* Dependencies:
│      @ai-whisperers/engine: ^1.0.0
│      @ai-whisperers/sections: ^1.0.0
│      @ai-whisperers/ui: ^1.0.0
│      next: ^16.0.0
│   */
├── app/
│   ├── layout.tsx               ← Client's custom header/footer
│   ├── page.tsx                 ← Home page
│   ├── portfolio/page.tsx
│   └── ... (17 pages from requirements)
├── content/
│   ├── es.json                  ← Her data (58KB)
│   └── en.json
├── tokens/
│   └── dayah-tokens.json        ← Her visual theme
├── images/
│   └── covers/*.jpg             ← Her images
├── components/                  ← Client-specific components
│   ├── header.tsx               ← Header with her logo (if she wants custom)
│   ├── hero.tsx                 ← Override: uses base import + custom
│   └── premade-store.tsx        ← New: premade store with payment (her needs)
└── next.config.js               ← Her domain, locales, etc.
```

**Key insight:** The client app imports sections it needs, overrides what it wants. It's NOT a full copy of the 13K-file repo — it's a 30-file project that imports shared packages.

### Override System

A client can override any section by creating a file in their `components/` directory with the same export name:

```tsx
// dayah-litworks/components/hero.tsx
import { BaseHeroSection } from '@ai-whisperers/sections/hero'
// ... wrap or modify, pass custom props
export default MyCustomHeroSection
```

The engine checks: "does the client have a custom version?" → yes → use it. No → use the package default.

### Deployment Model

Each client is a standalone Next.js app:
- **Build:** `cd dayah-litworks && npm run build` (30 seconds, not 5 minutes)
- **Deploy:** Docker container orchestrated by `docker-compose.clients.yml`
- **Hosting:** Same VPS, different ports + Traefik routing per domain
- **Domain:** dayah-litworks.com → Traefik → dayah container:3001
- **Update engine:** `npm update @ai-whisperers/sections` in client, rebuild, deploy

### What We Can Reuse from GitHub (not build everything)

| Need | Existing Open Source |
|------|---------------------|
| Monorepo tooling | Turborepo (Vercel), Nx (Nrwl) |
| NPM package publishing | Changesets (changesets/changesets) |
| Container orchestration | Docker Compose, Traefik (already ours) |
| Auth for clients | Supabase Auth, NextAuth.js, Clerk |
| Payment processing | MercadoPago API (already ours) |
| File upload (intake forms) | Uploadthing, Uppy, or Supabase Storage |
| Email/newsletter | Mailchimp API, Resend, Loops.so |
| 3D mockup generator | Three.js, or API: Placeit, Smartmockups |
| Image optimization | Next.js Image (bundled), Cloudinary, Imgix |
| Scheduling | Calendly embed (free tier) |
| Multi-language | next-intl, next-i18next, Tolgee |
| Analytics | Plausible, Umami, PostHog open source |
| CMS for clients | Payload CMS, Keystone, Strapi |
| Drag-and-drop sections | react-dnd, dnd-kit, GrapesJS |
| Headless WordPress as client CMS | WordPress REST API + our sections |

### What We DON'T Need to Build

- **Payment system** → MercadoPago SDK (we already have it)
- **Auth** → Supabase Auth (already have it)
- **Email** → Resend / Mailchimp API (already have Mailchimp placeholders)
- **Image CDN** → Cloudinary free tier or Next.js Image with remote patterns
- **Analytics** → Plausible self-hosted (we already have Grafana)
- **Scheduling** → Calendly embed (1 line of HTML)
- **Blog CMS** → Markdown files in client repo (we already do this)
- **Drag-and-drop page builder** → This would be the BIG one to build. GrapesJS is GPL, can fork.
- **3D mockup** → Three.js + a template Blender file, or outsource to Placeit API

---

## 4. Migration Plan (Phased)

### Phase 1: Extract Packages (1-2 weeks)
1. Create `paragu-ai-platform` repo
2. Move `web/lib/engine/` → `packages/engine/`
3. Move `web/components/ui/` → `packages/ui/`
4. Move `web/components/sections/` → `packages/sections/` (with proper exports)
5. Set up Turborepo + Changesets for versioning
6. Publish `@ai-whisperers/*` to GitHub Packages or npm

### Phase 2: Client Template (3-5 days)
1. Create `paragu-ai-client-template` repo with:
   - Minimal Next.js app setup
   - Import `@ai-whisperers/*` packages
   - CLI tool: `npx create-ai-whisperers-client <client-name>`
2. Add override system (client can shadow any section)
3. Set up Docker Compose for multi-client hosting

### Phase 3: Migrate Dayah (2-3 days)
1. Fork the template for dayah
2. Copy her content/ images/ tokens/ into the new app
3. Test, deploy, redirect dayah-litworks.com
4. Delete her data from the big monorepo

### Phase 4: Roll Out (ongoing)
1. New clients → use template (never touch the monorepo)
2. Existing clients → migrate when touched for updates
3. Monorepo becomes admin/builder app only
4. Eventually deprecate and archive

---

## 5. The Big Question: Do We Need the Migration Now?

**Honest answer:** For 40 clients, the current monorepo IS workable. The coupling risk is real but manageable IF:
- We run automated visual regression tests per client (Playwright screenshots)
- We lock section components that are "stable" and only change them when ALL clients benefit
- Client-specific changes go in their `sites/` dir only

**When to migrate:**
- When we hit 20+ paying clients
- When clients start asking for conflicting customizations
- When the Docker build takes >10 minutes
- When we need independent deploys per client (client A's fix shouldn't redeploy client B)

**For now, the best intermediate step** (pattern B — Platform + Per-Client Plugin):
1. Keep the monorepo as-is
2. Add a per-client override directory: `sites/dayah-litworks/components/override/`
3. Engine checks for overrides before using shared components
4. This lets dayah customize any section without touching shared code
5. Later, extract the override dir into a standalone repo

This gives us the BENEFIT of isolation without the COST of full migration.
