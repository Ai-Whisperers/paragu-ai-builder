# Paragu-AI Builder - Website Generation Engine

> Generates static marketing websites for Paraguayan beauty/wellness businesses.
> Next.js 15 + Supabase + TypeScript. Multi-business via `/[business]/*` routing.

## Table of Contents
- [Quick Rules](#quick-rules)
- [Critical Warnings](#critical-warnings)
- [Architecture](#architecture)
- [Coding Standards](#coding-standards)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)
- [Reference](#reference)

---

## Quick Rules

| Rule | Details |
|------|---------|
| **Multi-business** | All queries MUST filter by `business_id` — see [docs/TENANTS.md](./docs/TENANTS.md) |
| **Theme variables** | Use `var(--primary)`, NEVER `bg-blue-500` |
| **Generated site language** | All generated site UI text in Spanish |
| **Server-first** | Default to Server Components |
| **Auth** | Admin routes check auth first |
| **Error handling** | NEVER silently swallow errors - always log or rethrow |
| **Tokens drive themes** | Business type tokens → CSS variables → components |

## Critical Warnings

```
DO NOT upgrade Tailwind to v4 (JSON scanning breaks build with token files)
DO NOT hardcode colors - use CSS variables only
DO NOT skip business_id in queries
DO NOT commit .env files or credentials
DO NOT silently swallow errors in catch blocks
```

### Error Handling (MANDATORY)

Pattern ported from Vete - every catch block MUST either:
1. **Log + Rethrow** - For critical operations
2. **Log + Return structured error** - For service methods
3. **Log warning + Fallback** - For truly optional operations (document why)

```typescript
// FORBIDDEN
try { await op(); } catch (e) { /* silently fail */ }

// REQUIRED
try {
  await op();
} catch (error) {
  console.error('[Module/fn] Error:', error);
  throw error;
}
```

---

## Architecture

```
src/                         Data layer (JSON - schemas, tokens, registry, content)
  ├── schemas/               JSON Schema definitions (base + 9 business types)
  ├── tokens/                Design tokens (base + 9 business types)
  ├── registry/              Business type definitions (sections, features, SEO)
  └── content/               Content templates with {{placeholders}}

web/                         Application layer (Next.js)
  ├── app/
  │   ├── [business]/        Generated site routes (SSG)
  │   ├── admin/             Builder dashboard (protected)
  │   └── api/               REST APIs
  ├── components/
  │   ├── sections/          Page sections (Hero, Services, Gallery, Team, etc.)
  │   ├── ui/                Primitives (Button, Card, Badge - CVA-based)
  │   └── layouts/           Page layouts and grids
  ├── lib/
  │   ├── supabase/          DB clients (server, client, admin, scoped)
  │   ├── tokens/            Token → CSS variable pipeline
  │   ├── engine/            Template composition engine
  │   ├── generation/        Site generation pipeline
  │   ├── env.ts             Validated environment variables
  │   └── logger.ts          Structured logging
  └── tests/                 Vitest + Playwright
```

### Business Types (9 categories)

| Type | Spanish | Lead Count |
|------|---------|-----------|
| peluqueria | Peluquería | 2,393 |
| gimnasio | Gimnasio | 1,009 |
| spa | Spa | 638 |
| unas | Uñas | 578 |
| tatuajes | Tatuajes | 312 |
| barberia | Barbería | 262 |
| estetica | Estética | 219 |
| maquillaje | Maquillaje | 43 |
| depilacion | Depilación | 9 |

### Token → Theme Pipeline

```
src/tokens/peluqueria.tokens.json    (design tokens)
        ↓
web/lib/tokens/resolver.ts           (reads + merges with base.tokens.json)
        ↓
CSS custom properties                (injected into :root or page head)
        ↓
web/tailwind.config.js               (references var(--primary) etc.)
        ↓
web/components/sections/*.tsx         (uses Tailwind classes)
```

One set of components serves ALL 9 business types by swapping CSS variables.

---

## Coding Standards

### TypeScript
```typescript
// DO: Explicit types, interfaces for objects
interface Business {
  id: string;
  name: string;
  type: 'peluqueria' | 'gimnasio' | 'spa' | 'unas' | 'tatuajes' | 'barberia' | 'estetica' | 'maquillaje' | 'depilacion';
}

// DON'T: any, implicit returns
const getBiz = (id) => fetch(`/api/businesses/${id}`);
```

### React Components
```typescript
// DO: Server Components by default, theme variables
export default async function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="rounded-lg bg-[var(--card)] p-6 shadow-card">
      <h3 className="text-[var(--primary)]">{service.name}</h3>
      <p className="text-[var(--secondary)]">{service.price}</p>
    </div>
  );
}

// DON'T: Unnecessary "use client", hardcoded colors
"use client";
export function ServiceCard({ service }) {
  return <div className="bg-white text-gray-800">{service.name}</div>;
}
```

### API Routes
```typescript
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // 1. Auth check
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // 2. Query with scoped builder
  const { select } = scopedQueries(supabase, businessId);
  const { data, error: queryError } = await select('generated_sites', '*');

  // 3. Error handling - NEVER ignore errors
  if (queryError) {
    console.error('[API/sites] Error:', queryError);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }

  return NextResponse.json(data);
}
```

---

## Common Tasks

### Add New Business Type
1. Create `src/schemas/[type].schema.json` (extend base-business)
2. Create `src/tokens/[type].tokens.json` (colors, fonts for the type)
3. Create `src/registry/[type].type.json` (sections, features, SEO)
4. Create `src/content/[type].content.json` (Spanish copy with placeholders)
5. Add type to `src/registry/index.json`

### Add New Section Component
```typescript
// web/components/sections/NewSection.tsx
interface NewSectionProps {
  data: {
    title: string;
    items: Array<{ id: string; label: string }>;
  };
}

export function NewSection({ data }: NewSectionProps) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-8 text-3xl font-bold text-[var(--primary)]">
          {data.title}
        </h2>
        {/* Content using theme variables only */}
      </div>
    </section>
  );
}
```

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| JSON parsing in Tailwind | Tailwind v4 | Downgrade to `3.4.19` |
| `Cannot find module` | Missing dep | `npm install` in `web/` |
| Empty data from query | Missing business_id filter | Add `.eq('business_id', id)` |
| Theme not applied | Hardcoded colors | Use `var(--primary)` syntax |
| 401 on admin routes | Missing/expired auth | Check `supabase.auth.getUser()` |

---

## Reference

### Commands

```bash
cd web
npm run dev              # Dev server (localhost:3000)
npm run build            # Production build
npm run lint             # ESLint
npm run typecheck        # TypeScript check
npm run format           # Prettier
npm run test             # Unit tests (Vitest)
npm run test:e2e         # E2E tests (Playwright)
npm run test:coverage    # Coverage report
npm run validate:schemas # Validate JSON schemas
npm run validate:tokens  # Validate design tokens
npm run generate:site    # Generate a site from business data
```

### Key Files

| Purpose | Location |
|---------|----------|
| Supabase client (server) | `web/lib/supabase/server.ts` |
| Supabase client (browser) | `web/lib/supabase/client.ts` |
| Business-scoped queries | `web/lib/supabase/scoped.ts` |
| Environment variables | `web/lib/env.ts` |
| Structured logger | `web/lib/logger.ts` |
| Business type schemas | `src/schemas/` |
| Design tokens | `src/tokens/` |
| Business type registry | `src/registry/` |
| Content templates | `src/content/` |
| Tenancy model | `docs/TENANTS.md` |

### Technology Stack

| Component | Version | Notes |
|-----------|---------|-------|
| Next.js | 15.5 | App Router, Server Components |
| TypeScript | 5.x | Strict mode |
| Tailwind | **3.4.19** | **DO NOT upgrade to v4** |
| Supabase | 2.103 | PostgreSQL + Auth + Storage |
| Vitest | 4.x | Unit tests |
| Playwright | 1.59 | E2E tests |
| Zod | 3.25 | Schema validation |
| CVA | 0.7 | Component variants |
| Zustand | 5.x | State management |
| React Query | 5.x | Server state |

### Patterns Ported from Vete

| Pattern | Source | Adaptation |
|---------|--------|-----------|
| Supabase SSR clients | `vete/web/lib/supabase/` | Direct copy |
| Scoped queries | `vete/web/lib/supabase/scoped.ts` | `tenant_id` → `business_id` |
| Env validation | `vete/web/lib/env.ts` | Stripped to builder-only vars |
| Structured logger | `vete/web/lib/logger.ts` | Removed external service integrations |
| Middleware | `vete/web/middleware.ts` | Simplified (no custom domains, no role routing) |
| Security headers | `vete/web/next.config.mjs` | Direct copy of CSP + headers |
| Tailwind config | `vete/web/tailwind.config.js` | Same CSS variable approach |
| Dockerfile | `vete/web/Dockerfile` | Same multi-stage pattern |
| Vitest config | `vete/web/vitest.config.ts` | Same setup with builder paths |
| Error handling | CLAUDE.md mandate | Identical rules |

---

_Initialized: April 2026_
