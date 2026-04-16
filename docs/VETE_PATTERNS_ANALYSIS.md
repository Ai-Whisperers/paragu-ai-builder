# Vete Repo Analysis: Pro Tips & Reusable Patterns

> Deep analysis of [ai-whisperers/vete](https://github.com/ai-whisperers/vete) —
> what we learned, what we took, and what we built fresh for the builder.

## Executive Summary

Vete is a **production multi-tenant SaaS platform** (veterinary clinic management) built with
Next.js 15 + Supabase + TypeScript. After thorough analysis, we ported **~12 files directly**,
**adapted ~6 patterns**, identified **~5 systems to build from scratch**, and **skipped ~25 features**
that don't apply to the builder's website-generation domain.

---

## Pro Tips Extracted from Vete

### 1. Tailwind v4 Will Break Your JSON Build

**The Problem:** Tailwind v4's new scanner reads ALL files in the content paths and tries to
interpret JSON values as class names. Our `src/tokens/*.json` files contain color hex values,
spacing values, etc. that Tailwind v4 treats as utility classes, causing cryptic build failures.

**The Fix:** Pin to `tailwindcss: "3.4.19"` (exact, no `^` or `~`). Dependabot is configured
to ignore major Tailwind version bumps.

**Source:** Vete's `CLAUDE.md` critical warning + `tailwind.config.js` header comment.

---

### 2. CSS Variables > Hardcoded Colors (Always)

**The Pattern:** Every color in the UI comes from a CSS custom property, never a Tailwind color class.

```typescript
// WRONG - breaks when business type changes
<div className="bg-blue-500 text-white">

// RIGHT - theme-driven, works for all 9 business types
<div className="bg-[var(--primary)] text-[var(--primary-foreground)]">
```

**Why it matters for the builder:** One component library serves peluquerias (warm rose gold),
gyms (energetic green), spas (calm teal), tattoo shops (dark/edgy) — all by swapping CSS variables.

**Source:** Vete's `tailwind.config.js`, `globals.css`, and CLAUDE.md coding standards.

---

### 3. Supabase SSR Client Pattern (Server vs Browser)

**The Pattern:** Two separate client factories, never mix them:

- **`server.ts`** — Uses `cookies()` from Next.js, async, used in Server Components & API routes
- **`client.ts`** — Singleton with `localStorage` persistence, used in Client Components

**Critical:** In middleware, create a third client inline using `createServerClient` from
`@supabase/ssr` with custom cookie handlers (middleware can't use `cookies()` directly).

**Pro Tip:** Use `getUser()` not `getSession()` in middleware — only `getUser()` actually
refreshes expired tokens.

**Source:** Vete's `web/lib/supabase/server.ts`, `client.ts`, `middleware.ts`.

---

### 4. Scoped Queries Prevent Cross-Tenant Data Leaks

**The Pattern:** A wrapper around Supabase client that auto-injects `business_id`
(originally `tenant_id`) into every query:

```typescript
const { select, insert, update } = scopedQueries(supabase, businessId)

// Automatically adds .eq('business_id', businessId)
await select('generated_sites', '*')

// Auto-adds business_id to inserted records
await insert('site_pages', { slug: 'home', title: 'Inicio' })

// Prevents cross-business moves by stripping business_id from update data
await update('site_pages', { title: 'New' }, (q) => q.eq('id', pageId))
```

**Bonus features ported:**
- `exists(table, id)` — check if record belongs to this business
- `verify(table, id)` — get record only if valid for this business
- Slow query detection (logs queries > 1000ms)

**Source:** Vete's `web/lib/supabase/scoped.ts` (280 lines).

---

### 5. Environment Variable Validation at Module Load

**The Pattern:** Never use `process.env.X` directly. Import from a validated `env` object:

```typescript
import { env } from '@/lib/env'

// Fails fast on server if missing, graceful degradation on client
const client = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
```

**Key techniques:**
- `NEXT_PUBLIC_*` vars use lazy getters (client-safe, inlined at build time)
- Server-only vars use `requireEnv()` that throws immediately
- Optional vars use `optionalEnv()` with defaults
- Boolean vars parsed with `boolEnv()`
- Dev mode logs successful validation at startup

**Source:** Vete's `web/lib/env.ts` (300 lines, reduced to ~120 for builder).

---

### 6. Structured Logging (Dev Pretty, Prod JSON)

**The Pattern:** One logger, two output formats:

- **Development:** Colorized, human-readable with timestamps and context
- **Production:** Single-line JSON for log aggregation (CloudWatch, DataDog, etc.)

```typescript
import { logger, createRequestLogger } from '@/lib/logger'

// Global logging
logger.info('Site generated', { businessType: 'peluqueria', duration: 1200 })

// Request-scoped (auto-includes requestId, method, path, IP)
const log = createRequestLogger(request, { businessId: '123' })
log.info('Processing generation request')
```

**Performance tracking:**
```typescript
const perf = createPerformanceTracker(requestId)
perf.checkpoint('data_loaded')
perf.checkpoint('template_composed')
perf.checkpoint('html_rendered')
const duration = perf.finish({ path: '/api/generate' })
// Automatically warns if total > 1000ms
```

**Source:** Vete's `web/lib/logger.ts` (500+ lines, reduced to ~200 for builder).

---

### 7. Middleware Architecture: Skip Public Routes Early

**The Pattern:** Check if the route is public BEFORE doing any auth work:

```typescript
// OPTIMIZATION: Public routes skip auth entirely (~50-100ms savings)
const isPublicRoute = !path.startsWith('/admin')
if (isPublicRoute) {
  return response  // No auth check, no session refresh
}

// Only protected routes get the full auth treatment
const supabase = createServerClient(...)
await supabase.auth.getUser()
```

**Other middleware lessons from Vete:**
- Request ID correlation (`x-request-id` header) for distributed tracing
- Rate limiting is optional (graceful fallback if Upstash not configured)
- Edge-compatible logging (can't import full logger in middleware)

**Source:** Vete's `web/middleware.ts` (300 lines, reduced to ~80 for builder).

---

### 8. Security Headers Are Free

**The Pattern:** Production-grade security headers cost nothing to add:

```javascript
// In next.config.mjs
const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]
```

**CSP tip:** Development needs `'unsafe-eval'` for Next.js Fast Refresh. Production removes it.

**Source:** Vete's `web/next.config.mjs` ARCH-024 implementation.

---

### 9. Docker Multi-Stage Build Pattern

**The Pattern:** 3-stage Dockerfile for minimal production image:

1. **deps** — Install node_modules (cached layer)
2. **builder** — Copy deps + source, run `next build`
3. **runner** — Copy only `.next/standalone` + `.next/static` + `public`

**Key details:**
- `NEXT_PUBLIC_*` vars passed as build args (inlined at build time)
- Non-root user (`nextjs:nodejs`) for security
- Health check endpoint (`/api/health`)
- `output: 'standalone'` in next.config for minimal server.js

**Source:** Vete's `web/Dockerfile`.

---

### 10. Test Configuration Separation

**The Pattern:** Different vitest configs for different test types:

```bash
vitest.config.ts              # Unit tests (jsdom, fast)
vitest.config.components.ts   # Component tests (React Testing Library)
vitest.config.api.ts          # API route tests (no DOM)
vitest.config.database.ts     # DB tests (real Supabase)
vitest.integration.config.ts  # Integration tests
playwright.config.ts          # E2E tests
```

**Pro tips:**
- Load `.env.test` before `.env.local` before `.env` (priority chain)
- Mock `server-only` package so server components can be tested
- Sequential execution for DB tests (avoid rate limits): `forks.singleFork: true`
- Retry failed tests once: `retry: 1`

**Source:** Vete's 5 vitest config files + `playwright.config.ts`.

---

### 11. Error Handling is Non-Negotiable

**Vete's strongest cultural pattern:** Every catch block must do something visible.

```typescript
// Vete CLAUDE.md literally calls this "FORBIDDEN":
try { await op(); } catch (e) { /* silently fail */ }
try { await op(); } catch (e) { return null; }

// Every catch must:
// 1. Log + Rethrow, OR
// 2. Log + Return { success: false, error: msg }, OR
// 3. Log warning + Document WHY fallback is safe
```

We adopted this rule identically in the builder's CLAUDE.md.

---

### 12. Webpack Optimization for Production

**Code splitting strategy from Vete:**
- Max chunk size: 512KB
- Min chunk size: 100KB
- Separate vendor chunk for React/React-DOM/Lucide/clsx
- Separate chunk for Supabase (large library)
- Domain-specific chunks (e.g., store filters, cards)

**Source:** Vete's `web/next.config.mjs` webpack config.

---

## What We Copied Directly

| File | From (Vete) | To (Builder) | Lines |
|------|-------------|-------------|-------|
| `server.ts` | `web/lib/supabase/server.ts` | `web/lib/supabase/server.ts` | 30 |
| `client.ts` | `web/lib/supabase/client.ts` | `web/lib/supabase/client.ts` | 40 |
| `admin.ts` | `web/lib/supabase/admin.ts` | `web/lib/supabase/admin.ts` | 12 |
| Tailwind config | `web/tailwind.config.js` | `web/tailwind.config.js` | 80 |
| PostCSS config | `web/postcss.config.js` | `web/postcss.config.js` | 6 |
| Vitest setup | `web/vitest.setup.ts` | `web/vitest.setup.ts` | 1 |
| server-only mock | `tests/__mocks__/server-only.ts` | `tests/__mocks__/server-only.ts` | 2 |
| Security headers | `web/next.config.mjs` (headers) | `web/next.config.mjs` (headers) | 15 |
| PR template | `.github/pull_request_template.md` | `.github/pull_request_template.md` | 25 |
| Dependabot | `.github/dependabot.yml` | `.github/dependabot.yml` | 30 |
| CODEOWNERS | `.github/CODEOWNERS` | `.github/CODEOWNERS` | 8 |
| Dockerfile pattern | `web/Dockerfile` | `web/Dockerfile` | 50 |

## What We Adapted

| Pattern | Key Changes |
|---------|------------|
| `scoped.ts` | `tenant_id` → `business_id`, removed 60-table list, kept 5 builder tables |
| `env.ts` | Removed WhatsApp/Twilio/Stripe/AWS/Drizzle vars, kept Supabase + Cloudinary + Upstash |
| `logger.ts` | Removed DataDog/LogRocket/custom metrics APIs, kept core + performance tracker |
| `middleware.ts` | Removed custom domains + role routing, kept auth check + request ID |
| `next.config.mjs` | Removed Sentry/next-intl wrapping, 50+ image CDNs → 5, kept security headers |
| `vitest.config.ts` | Updated paths, kept env loading + coverage config |
| `CLAUDE.md` | Rewrote all domain content (businesses not clinics), kept rules + format |

## What We're Building Fresh

| System | Purpose | Status |
|--------|---------|--------|
| Token → CSS pipeline | Reads JSON tokens, outputs CSS variables | To build |
| Template composition engine | Registry + business data → page component tree | To build |
| Section components | Hero, Services, Gallery, Team, Contact, Footer | To build |
| UI primitives (CVA) | Button, Card, Badge, Container, Heading | To build |
| Generation pipeline | Orchestrates: validate → compose → render → export | To build |
| Admin dashboard | Business list, preview, deploy controls | To build |
| DB schema (Supabase) | businesses, generated_sites, site_pages, assets, logs | To build |

## What We Skipped (and Why)

| Vete Feature | Reason |
|---|---|
| Drizzle ORM | Supabase client sufficient for builder's simpler schema |
| next-intl (i18n) | Generated sites are Spanish-only |
| Stripe payments | No billing in the builder |
| Twilio SMS | Generated sites use WhatsApp links |
| Resend email | No transactional emails |
| Inngest scheduling | No background jobs yet |
| Leaflet maps | Google Maps iframe in generated sites |
| react-big-calendar | No scheduling UI |
| @react-pdf/renderer | No PDF generation |
| ExcelJS | No data export |
| framer-motion | Add later for polish |
| recharts | No analytics dashboard yet |
| DOMPurify | No user-generated HTML |
| Custom domain resolution | Builder serves from single domain |
| Clinical modules | Wrong domain entirely |
| E-commerce / store | Not a store builder |
| Loyalty system | Not relevant |

---

## Vete Architecture Reference

For full context, here's how Vete organizes its 100+ table, 94-migration codebase:

```
web/
├── app/[clinic]/           # Multi-tenant routes (portal, dashboard, booking, store)
├── lib/
│   ├── supabase/           # 6 client files (server, client, admin, service, scoped, guide)
│   ├── services/           # BaseService pattern for business logic
│   ├── hooks/              # 8+ custom React hooks
│   ├── actions/            # Server Actions for mutations
│   ├── auth/               # Authentication utilities
│   ├── booking/            # Appointment scheduling
│   ├── clinical/           # Medical records
│   ├── store/              # E-commerce
│   ├── payments/           # Stripe integration
│   ├── email/              # Resend templates
│   ├── whatsapp/           # WhatsApp API
│   ├── schemas/            # Zod validation schemas
│   ├── types/              # TypeScript definitions
│   ├── security/           # Security utilities
│   ├── monitoring/         # Observability (slow query tracking)
│   └── [30+ more]         # audit, backup, billing, cache, consent, export, etc.
├── db/
│   ├── 00_setup/           # Extensions, types, RLS
│   ├── 10_core/            # Users, profiles, tenants
│   ├── 20_pets/            # Pets, vaccines, medical records
│   ├── 30_clinical/        # Prescriptions, diagnoses
│   ├── 40_scheduling/      # Appointments, services
│   ├── 50_finance/         # Invoices, expenses
│   ├── 60_store/           # E-commerce
│   ├── 70_communications/  # Messages, templates
│   └── migrations/         # 94 sequential migrations
└── tests/                  # unit, integration, e2e, components, api, security, performance, load
```

**Key numbers:** 100+ tables, 94 migrations, 45 dependencies, 30 devDependencies, 77 env vars.

**Builder numbers:** ~5 tables (initially), 0 migrations (yet), 18 dependencies, 14 devDependencies, ~10 env vars.

---

_Analysis completed: April 2026_
