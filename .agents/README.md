# 🤖 AI Agent Setup for Paragu-AI Builder

This directory contains AI-specific configuration and tooling for agents working on the Paragu-AI Builder project.

## Quick Start for New AI Agents

1. **Read the guides:**
   - `../AGENTS.md` - AI-specific patterns and workflows
   - `../CLAUDE.md` - Technical architecture and standards

2. **Check the config:**
   - `../.ai-config.json` - Machine-readable project configuration
   - `../.claude-config.toml` - Claude-specific settings

3. **Verify your environment:**
   ```bash
   cd web
   npm install
   npm run typecheck
   ```

## Available Skills

This project uses Firecrawl skills for web scraping:

| Skill | Use For | Don't Use For |
|-------|---------|---------------|
| `firecrawl-scrape` | Single page extraction | Database queries |
| `firecrawl-crawl` | Site-wide crawling | Template rendering |
| `firecrawl-search` | Web search with content | Auth operations |
| `firecrawl-map` | URL discovery | Payments |
| `firecrawl-agent` | Structured data extraction | Business logic |

### Example Usage

```typescript
// Research competitor
const result = await skill('firecrawl-scrape', {
  url: 'https://competitor.com',
  format: 'markdown'
});

// Extract pricing
const pricing = await skill('firecrawl-agent', {
  url: 'https://example.com/pricing',
  schema: {
    plans: [{
      name: 'string',
      price: 'string',
      features: ['string']
    }]
  }
});
```

## AI Agent Workflows

### Adding a Business Type (5 min)

```bash
# AI will:
# 1. Create src/registry/[type].type.json
# 2. Create src/tokens/[type].tokens.json
# 3. Create src/content/[type].content.json
# 4. Update types and demo data
# 5. Test build
```

### Fixing Build Errors

```bash
# AI checklist:
# 1. npm run typecheck
# 2. npm run lint  
# 3. Check tailwind version
# 4. Search for hardcoded colors
# 5. Check business_id filters
```

### Database Changes

```bash
# Always:
# 1. Add to supabase/migrations/000_complete_schema.sql
# 2. Include RLS policies
# 3. Add indexes
# 4. Test migration
```

## Critical Rules for AI Agents

🚫 **NEVER:**
- Upgrade Tailwind to v4
- Hardcode colors (use CSS variables)
- Skip business_id in queries
- Commit .env files
- Silently catch errors

✅ **ALWAYS:**
- Log or rethrow errors
- Use CSS variables for theming
- Filter queries by business_id
- Reuse existing section components
- Test with npm run build

## Project Structure for AI

```
src/              # Data layer (JSON configs)
├── registry/     # Business type definitions
├── tokens/      # Design tokens
├── content/     # Content templates
└── schemas/     # Validation schemas

web/              # Application layer
├── app/         # Next.js routes
├── components/  # React components
├── lib/         # Utilities and engine
└── scripts/     # Automation scripts
```

## Testing Checklist

Before completing any task:

- [ ] `npm run typecheck` passes
- [ ] `npm run build` succeeds
- [ ] No hardcoded colors in new code
- [ ] Error handling is proper (log/rethrow)
- [ ] Database queries filter by business_id (if applicable)

## Emergency Procedures

### Production Down
1. Check Cloudflare Pages status
2. Check Supabase status
3. Rollback to last known good commit if needed
4. Check error logs

### Security Incident
1. Rotate all API keys
2. Check access logs in Supabase
3. Review recent deployments
4. Document and notify

## Support

- **Architecture questions:** See `../CLAUDE.md`
- **AI workflow questions:** See `../AGENTS.md`
- **Strategy questions:** See `../docs/STRATEGY_NEXT_STEPS.md`
