# Paragu-AI Builder - AI Agent Configuration

> AI-first development configuration for the Universal Website Generation Engine
> This file guides AI agents working on this project

## Project Context

**Paragu-AI Builder** is a multi-tenant, multi-locale website generation engine for Paraguayan businesses. It uses:
- **Next.js 15** + **TypeScript** + **Tailwind 3.4.19**
- **Supabase** (PostgreSQL + Auth)
- **Cloudflare Pages** (deployment)
- **Token-based theming** (CSS variables, not hardcoded colors)
- **21 reusable section components** serving 20+ business types

## AI Agent Quick Start

### When Starting Work on This Project

1. **Read This File** - You are here! ✅
2. **Read CLAUDE.md** - Technical architecture and coding standards
3. **Check Current State** - Run `git status` to see what's happening
4. **Check Open PRs** - Run `gh pr list` to see in-flight work
5. **Review Recent Commits** - Run `git log --oneline -10`

### Critical Rules (NEVER Break These)

```
⚠️  DO NOT upgrade Tailwind to v4 (breaks build)
⚠️  DO NOT hardcode colors - always use var(--primary)
⚠️  DO NOT skip business_id in database queries
⚠️  DO NOT commit .env files
⚠️  DO NOT silently catch errors - always log/rethrow
```

## Project Structure for AI Agents

```
src/                         # Data layer (JSON configs)
  ├── schemas/               # Business type schemas
  ├── tokens/               # Design tokens (colors, fonts)
  ├── registry/             # Business type registry
  └── content/              # Content templates

web/                        # Application layer
  ├── app/
  │   ├── [business]/       # Generated sites (SSG)
  │   ├── admin/            # Admin dashboard
  │   ├── api/              # API routes
  │   └── s/[locale]/       # Multi-tenant sites
  ├── components/
  │   ├── sections/         # 21 reusable sections
  │   └── ui/              # UI primitives (CVA-based)
  ├── lib/
  │   ├── supabase/         # Database clients
  │   ├── engine/           # Template engine
  │   └── types.ts          # TypeScript types
  └── scripts/              # Build/generation scripts
```

## AI-Specific Patterns

### 1. Adding New Business Type (Most Common Task)

When adding a new business type (e.g., `dentist`, `mechanic`):

**Required Files:**
```
src/
├── registry/[type].type.json          # Section config, features
├── tokens/[type].tokens.json         # Colors, fonts
├── content/[type].content.json       # Spanish copy templates
└── schemas/[type].schema.json        # Validation schema
```

**Reuses:**
- ✅ Existing section components from `web/components/sections/`
- ✅ Base tokens from `src/tokens/base.tokens.json`
- ✅ No new React components needed (usually)

**Example (5-minute add):**
```json
// src/registry/dentist.type.json
{
  "id": "dentist",
  "nameEs": "Consultorio Dental",
  "tokens": "dentist",
  "sections": ["hero", "services", "team", "testimonials", "contact"],
  "features": { "booking": true, "emergency": true }
}
```

### 2. Adding New Section Component

When adding a new reusable section:

**File:** `web/components/sections/[name]-section.tsx`

**Pattern:**
```typescript
interface [Name]SectionProps {
  title: string
  items: Array<{...}>
  // Theme automatically applied via CSS variables
}

export function [Name]Section({ title, items }: [Name]SectionProps) {
  return (
    <section className="py-16 bg-[var(--background)]">
      <h2 className="text-[var(--primary)]">{title}</h2>
      {/* Content */}
    </section>
  )
}
```

**Registration:** Add to `web/lib/engine/renderer.tsx`

### 3. Database Schema Changes

When modifying Supabase schema:

**Location:** `supabase/migrations/000_complete_schema.sql`

**Rules:**
- Add new tables at the end
- Include RLS policies for every table
- Add indexes for query performance
- Create views for analytics if needed
- Test with `npm run typecheck`

### 4. Environment Variables

**Local:** `web/.env.local` (gitignored)
**Production:** Cloudflare Pages dashboard

**Required:**
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

**Optional:**
```
MERCADOPAGO_PUBLIC_KEY=
MERCADOPAGO_ACCESS_TOKEN=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

## AI-Optimized Workflows

### Workflow 1: Generate Preview Site for Lead

**Context:** Admin wants to generate a demo site for a lead

**Steps:**
1. Query lead from `leads` table
2. Compose page using `composePage()` from business type
3. Generate static HTML
4. Store in `generated_sites` table
5. Return preview URL

**Key Files:**
- `web/lib/engine/compose.ts` - Page composition
- `web/lib/engine/renderer.tsx` - Section rendering
- `web/app/admin/leads/page.tsx` - Admin UI

### Workflow 2: WhatsApp Outreach

**Context:** Send templated WhatsApp message to lead

**Steps:**
1. Get lead phone/whatsapp from `leads` table
2. Generate wa.me link with templated message
3. Log event to `outreach_events` table
4. Update lead status to `contacted`

**Template Location:** `web/lib/outreach/templates.ts` (create if needed)

### Workflow 3: MercadoPago Payment

**Context:** Lead wants to subscribe

**Steps:**
1. Create subscription in `subscriptions` table
2. Generate MercadoPago checkout
3. Handle webhook at `/api/webhooks/mercadopago`
4. Update subscription status on payment
5. Grant access to self-service editing

## Common AI Tasks & Solutions

### Task: Fix Build Error

**Checklist:**
1. `npm run typecheck` - TypeScript errors
2. `npm run lint` - ESLint errors
3. Check for Tailwind v4 (should be 3.4.19)
4. Check for hardcoded colors (should use CSS vars)
5. Check for missing `business_id` in queries

### Task: Debug Database Connection

**Checklist:**
1. `.env.local` exists with correct keys
2. Supabase project is running
3. RLS policies allow the operation
4. Using correct client (server vs browser vs admin)

### Task: Add New Feature

**Questions to Ask:**
1. Can this reuse existing sections? (95% of cases: YES)
2. Does it need new database tables? (check schema first)
3. Is it admin-only or public? (affects auth)
4. Does it need MercadoPago? (payments feature)

### Task: Optimize Performance

**Strategies:**
1. Use Server Components by default
2. Lazy load heavy components
3. Add database indexes for common queries
4. Use Cloudflare caching rules
5. Minimize client-side JavaScript

## AI Tools Available

### Firecrawl Skills (Web Scraping)

Installed and ready to use:

```typescript
// Use skill for web research
import { skill } from '@/lib/skills'

// Example: Research competitor websites
await skill('firecrawl-scrape', {
  url: 'https://competitor.com',
  format: 'markdown'
})
```

**Available Skills:**
- `firecrawl-scrape` - Single page extraction
- `firecrawl-crawl` - Site-wide crawling
- `firecrawl-search` - Web search with content
- `firecrawl-map` - URL discovery
- `firecrawl-agent` - Structured data extraction
- `firecrawl-download` - Bulk download

### When to Use Skills

✅ Research competitor pricing  
✅ Extract content from existing business websites  
✅ Find images/logos for leads  
✅ Validate business information  

❌ Don't use for: Database queries, template rendering, auth operations

## Testing for AI Agents

### Quick Test Commands

```bash
# Type checking
npm run typecheck

# Build test
npm run build

# Unit tests
npm run test:unit

# E2E tests (requires dev server)
npm run dev &
npm run test:e2e
```

### What to Test

**New Business Type:**
- Registry file is valid JSON
- Tokens file has all required fields
- Content template renders correctly
- Section order works in compose

**New Section:**
- Renders without errors
- Accepts all props
- Uses CSS variables (no hardcoded colors)
- Responsive on mobile

**Database Changes:**
- Migration runs without errors
- RLS policies work
- Indexes improve query speed

## AI Communication Guidelines

### Commit Messages

Use conventional commits:
```
feat: Add dentist business type
fix: Resolve token resolution for missing palettes
refactor: Simplify hostname mapping
docs: Update deployment guide
test: Add unit tests for compose engine
```

### PR Descriptions

Include:
1. What changed (bullet points)
2. Why it changed (business reason)
3. Testing performed
4. Screenshots (if UI changes)

### Code Comments

**Required:**
- Complex business logic
- Non-obvious database queries
- External API integrations
- Workarounds or hacks (explain why)

**Optional:**
- Simple rendering logic
- Type definitions (self-documenting)
- Obvious utility functions

## Emergency Procedures

### Production is Down

1. Check Cloudflare Pages status
2. Check Supabase status
3. Rollback to last known good commit
4. Check error logs in Cloudflare
5. Notify team via established channel

### Database Migration Failed

1. Do NOT run migration again blindly
2. Check error message in Supabase logs
3. Create fix migration if needed
4. Test in preview environment first
5. Run during low-traffic period

### Security Incident

1. Rotate all API keys immediately
2. Check access logs in Supabase
3. Review recent deployments
4. Notify affected leads if data breach
5. Document incident and response

## Learning Resources

### Architecture Docs
- `CLAUDE.md` - This is the main technical reference
- `docs/STRATEGY_NEXT_STEPS.md` - Roadmap and priorities
- `docs/TENANTS.md` - Multi-tenancy model
- `docs/DEPLOYMENT.md` - Production deployment

### Code Examples
- `src/registry/peluqueria.type.json` - Simple business type
- `src/registry/relocation.type.json` - Complex business type
- `web/components/sections/hero-section.tsx` - Section pattern
- `web/lib/engine/compose.ts` - Composition logic

### External References
- Next.js 15 docs: https://nextjs.org/docs
- Supabase JS client: https://supabase.com/docs/reference/javascript
- Tailwind 3.4 docs: https://v3.tailwindcss.com
- Cloudflare Pages: https://developers.cloudflare.com/pages

---

**Last Updated:** April 2026
**AI Agent Version:** 1.0
**Project:** Paragu-AI Builder
