# Paragu-AI Builder - Universal Website Generation Engine

> Generates static marketing websites for ANY business type using reusable AI-powered templates.
> Next.js 15 + Supabase + TypeScript. Multi-business via `/[business]/*` routing.

## Vision

**Most websites need the same core functionality.** This engine auto-generates websites from templates + business content:

- Hero + Call to Action
- Services/Catalog/Packages
- About/Team
- Gallery/Portfolio
- Testimonials
- Contact Form + WhatsApp
- Google Maps location
- FAQ
- Blog (optional)

**The only differences between businesses:**
1. Content (text, images, services)
2. Theme (colors, fonts, styling via CSS variables)
3. Section order/layout

## Table of Contents
- [Quick Rules](#quick-rules)
- [Critical Warnings](#critical-warnings)
- [Architecture](#architecture)
- [Business Types](#business-types)
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
| **Reuse over rebuild** | New business types use existing sections |

## Critical Warnings

```
DO NOT upgrade Tailwind to v4 (JSON scanning breaks build with token files)
DO NOT hardcode colors - use CSS variables only
DO NOT skip business_id in queries
DO NOT commit .env files or credentials
DO NOT silently swallow errors in catch blocks
```

### Error Handling (MANDATORY)

Every catch block MUST either:
1. **Log + Rethrow** - For critical operations
2. **Log + Return structured error** - For service methods
3. **Log warning + Fallback** - For truly optional operations (document why)

---

## Architecture

```
src/                         Data layer (JSON - schemas, tokens, registry, content)
  ├── schemas/               JSON Schema definitions (base + business types)
  ├── tokens/               Design tokens (base + per-type themes)
  ├── registry/             Business type definitions (sections, features, SEO)
  └── content/              Content templates with {{placeholders}}

web/                        Application layer (Next.js)
  ├── app/
  │   ├── [business]/       Generated site routes (SSG)
  │   ├── admin/            Builder dashboard (protected)
  │   └── api/              REST APIs
  ├── components/
  │   ├── sections/         Page sections (21 reusable types)
  │   ├── ui/             Primitives (Button, Card, Badge - CVA-based)
  │   └── layouts/          Page layouts and grids
  ├── lib/
  │   ├── supabase/         DB clients (server, client, admin, scoped)
  │   ├── tokens/           Token → CSS variable pipeline
  │   ├── engine/           Template composition engine
  │   ├── generation/       Site generation pipeline
  │   ├── env.ts           Validated environment variables
  │   └── logger.ts         Structured logging
  └── tests/               Vitest + Playwright
```

### Section Components (Reusable for ALL business types)

| Category | Sections |
|----------|----------|
| **Universal** | hero, whatsapp-button, business-header, business-info-card, service-menu, photo-gallery, testimonials, contact-form, business-hours, google-maps |
| **Booking** | service-selector, date-time-picker, staff-selector, booking-form, booking-wizard |
| **Catalog** | product-card, product-grid |
| **Portfolio** | portfolio-gallery, before-after |
| **Specialized** | class-schedule, membership-plans, room-booking, event-venues, quote-form, emergency-indicator |

---

## Business Types

### Currently Supported (12 types)

| Type | Spanish | Use Case |
|------|--------|---------|
| peluqueria | Peluquería | Hair salons |
| salon_belleza | Salón Belleza | Beauty salons |
| gimnasio | Gimnasio | Gyms & fitness |
| spa | Spa | Wellness & spa |
| unas | Uñas | Nail salons |
| tatuajes | Tatuajes | Tattoo shops |
| barberia | Barbería | Barbershops |
| estetica | Estética | aesthetics |
| maquillaje | Maquillaje | Makeup artists |
| depilacion | Depilación | Hair removal |
| pestanas | Pestañas | Eyelash extensions |
| diseno_grafico | Diseño Gráfico | Graphic design |

### Adding New Business Types

**Most new types need ZERO new components.** Just configure:

1. `src/tokens/[type].tokens.json` - colors, fonts
2. `src/registry/[type].type.json` - which sections to use, SEO
3. `src/content/[type].content.json` - Spanish copy templates

Example for relocation service:
```json
{
  "type": "relocation",
  "displayName": "Servicios de Reubicación",
  "sections": ["hero", "packages", "process", "about", "testimonials", "faq", "contact"]
}
```

---

## Token → Theme Pipeline

```
src/tokens/base.tokens.json     (shared design system)
src/tokens/[type].tokens.json  (type-specific overrides)
        ↓
web/lib/tokens/resolver.ts     (merge + resolve)
        ↓
CSS custom properties         (injected into :root)
        ↓
web/components/sections/*.tsx  (use var(--primary), etc.)
```

One set of components serves ALL business types by swapping CSS variables.

---

## Coding Standards

### TypeScript

```typescript
interface Business {
  id: string;
  name: string;
  slug: string;
  type: string; // 'peluqueria', 'relocation', 'restaurant', etc.
  theme: ThemeTokens;
  content: BusinessContent;
}
```

### React Components

```typescript
// DO: Server Components, theme variables
export default async function HeroSection({ data }: { data: HeroData }) {
  return (
    <section className="py-20 bg-[var(--primary)]">
      <h1 className="text-[var(--primary-foreground)]">{data.title}</h1>
    </section>
  );
}

// DON'T: hardcoded colors
export function HeroSection({ title }) {
  return <section className="bg-blue-500">{title}</section>;
}
```

---

## Common Tasks

### Add New Business Type (5 minutes)

1. Create `src/registry/[type].type.json` - sections + SEO config
2. Create `src/tokens/[type].tokens.json` - brand colors (or inherit from base)
3. Add type to `src/registry/index.json`

### Generate a New Website

```bash
# Via Builder Dashboard
POST /api/generate
{ "slug": "mi-negocio", "type": "peluqueria" }

# Or via CLI
npm run generate:site mi-negocio
```

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| JSON parsing | Tailwind v4 | Downgrade to `3.4.19` |
| Theme not applied | Hardcoded colors | Use `var(--primary)` |
| Missing sections | Business type not configured | Check registry |

---

## Reference

### Commands

```bash
cd web
npm run dev              # Dev server
npm run build            # Production build
npm run generate:site    # Generate a site
npm run test            # Run tests
```

### Key Files

| Purpose | Location |
|--------|----------|
| Section components | `web/components/sections/` |
| Supabase client (server) | `web/lib/supabase/server.ts` |
| Supabase client (browser) | `web/lib/supabase/client.ts` |
| Business-scoped queries | `web/lib/supabase/scoped.ts` |
| Environment variables | `web/lib/env.ts` |
| Structured logger | `web/lib/logger.ts` |
| Business type schemas | `src/schemas/` |
| Business registry | `src/registry/` |
| Theme tokens | `src/tokens/` |
| Content templates | `src/content/` |
| Demo data | `web/lib/engine/demo-data.ts` |
| Tenancy model | `docs/TENANTS.md` |

### Technology Stack

| Component | Version |
|-----------|---------|
| Next.js | 15.5 |
| TypeScript | 5.x |
| Tailwind | **3.4.19** |
| Supabase | 2.103 |
| Vitest | 4.x |
| Playwright | 1.59 |

---

## Clients

| Client | Slug | Type | Status |
|--------|------|------|--------|
| Salon Maria | salon-maria | peluqueria | Demo |
| GymFit Paraguay | gymfit-py | gimnasio | Demo |
| Spa Serenidad | spa-serenidad | spa | Demo |
| ... | ... | ... | ... |
| **Nexa Paraguay** | nexaparaguay | relocation | **PENDING** |

---

_Updated: April 2026_