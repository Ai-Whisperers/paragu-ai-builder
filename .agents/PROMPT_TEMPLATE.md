# AI Agent Prompt Template for Paragu-AI Builder
#
# Use this prompt to quickly onboard AI assistants to this project:
#

You are working on **Paragu-AI Builder**, a universal website generation engine for Paraguayan businesses.

## Project Context

**Stack:** Next.js 15 + TypeScript + Tailwind 3.4.19 + Supabase + Cloudflare Pages
**Content Language:** Spanish (all generated sites use Spanish UI text)
**Code Language:** English (TypeScript, variable names, comments)

## Critical Rules (NEVER Break)

🚫 **NEVER:**
- Upgrade Tailwind to v4 (breaks build with token files)
- Hardcode colors like `bg-blue-500` (use `var(--primary)`)
- Skip `business_id` in database queries
- Commit `.env` files
- Silently catch errors (always log or rethrow)

✅ **ALWAYS:**
- Use CSS variables for theming
- Filter Supabase queries by `business_id`
- Reuse existing section components
- Test with `npm run build` before completing
- Handle errors properly (log + rethrow or return structured error)

## Project Structure

```
src/                         # Data layer (JSON configs)
├── registry/*.type.json     # Business type definitions
├── tokens/*.tokens.json     # Design tokens (CSS vars)
├── content/*.content.json   # Spanish content templates
└── schemas/*.schema.json    # Validation schemas

web/                         # Application layer
├── app/
│   ├── [business]/          # Generated sites
│   ├── admin/              # Dashboard
│   └── api/                # REST APIs
├── components/sections/     # 21 reusable sections
└── lib/
    ├── engine/              # Template composition
    ├── supabase/            # Database clients
    └── types.ts             # TypeScript types
```

## Common Tasks

### Adding a Business Type (5 min)
1. Create `src/registry/{type}.type.json` (copy from peluqueria.type.json)
2. Create `src/tokens/{type}.tokens.json`
3. Create `src/content/{type}.content.json`
4. Add to `web/lib/types.ts` `BUSINESS_TYPES` array
5. Test: `npm run build`

### Adding a Section Component (10 min)
1. Create `web/components/sections/{name}-section.tsx`
2. Use CSS variables: `bg-[var(--background)]`, `text-[var(--primary)]`
3. Add to `web/lib/engine/renderer.tsx` `SECTION_COMPONENTS`
4. Add to `web/lib/engine/compose.ts` `SectionType`
5. Test: `npm run build`

### Database Changes
- Add to `supabase/migrations/000_complete_schema.sql`
- Include RLS policies
- Add indexes
- Test migration

## Testing Checklist

Before completing any task, verify:
- [ ] `npm run typecheck` passes
- [ ] `npm run build` succeeds
- [ ] No hardcoded colors in new code
- [ ] Error handling is proper
- [ ] Database queries filter by `business_id` (if applicable)

## Firecrawl Skills Available

Use these for research and validation:
- `firecrawl-scrape` - Extract single page content
- `firecrawl-crawl` - Crawl entire site
- `firecrawl-search` - Web search with content
- `firecrawl-agent` - Structured data extraction

**Don't use skills for:** Database operations, template rendering, auth, payments

## Quick Commands

```bash
# Development
cd web && npm run dev          # Start dev server
cd web && npm run build        # Build for production
cd web && npm run typecheck    # TypeScript check

# Deployment
cd web && npm run deploy       # Deploy to Cloudflare
cd web && npm run deploy:setup # Guided setup

# Data
cd web && npm run import:leads -- --file=path/to/leads.csv
```

## Documentation

- **CLAUDE.md** - Technical architecture
- **AGENTS.md** - AI agent guide
- **docs/DEPLOYMENT.md** - Production deployment
- **docs/STRATEGY_NEXT_STEPS.md** - Roadmap

## Emergency

If production is down:
1. Check Cloudflare Pages status
2. Check Supabase status
3. Rollback to last known good commit
4. Check error logs

---

Now you understand the project. What would you like to work on?
