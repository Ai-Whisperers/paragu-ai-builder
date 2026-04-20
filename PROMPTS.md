# My OpenCode Prompts Log

> Track and reuse your most effective prompts
> Last updated: April 2026

## Quick Commands

Use these shortcuts for common tasks:

### Development Tasks

| Command | Description |
|---------|-------------|
| `/fix-build` | Fix TypeScript/build errors |
| `/add-section [name]` | Add new section component |
| `/add-business [type]` | Add new business type |
| `/db-migrate [name]` | Create database migration |
| `/check-security` | Run security audit |

### Research Tasks

| Command | Description |
|---------|-------------|
| `/research [topic]` | Research a topic |
| `/scrape [url]` | Scrape a website |
| `/analyze-code` | Analyze codebase patterns |

---

## Prompt Templates

Copy these and fill in the brackets:

### 1. Fix Build Error
```
I'm getting this error:
```
[PASTE ERROR]
```

Please:
1. Identify the root cause
2. Fix it with minimal changes
3. Run typecheck to verify
```

### 2. Add New Business Type
```
Add a new business type: [TYPE_NAME]

Details:
- Business name in Spanish: [NAME_ES]
- Sections needed: [SECTIONS]
- Special features: [FEATURES]
- Primary color: [COLOR]

Follow the pattern from peluqueria.type.json
```

### 3. Database Schema Change
```
Add a new table: [TABLE_NAME]

Fields:
- [FIELD_NAME]: [TYPE] - [DESCRIPTION]

Requirements:
- Add RLS policies
- Add indexes for [FIELDS]
- Create migration file
```

### 4. Research Competitor
```
Research [COMPETITOR_URL] and extract:
- Pricing information
- Key features
- Page structure
- Content themes

Use firecrawl-scrape skill.
```

### 5. Code Review
```
Review [FILE_PATH] for:
- Code quality
- Type safety
- Best practices
- Potential bugs

Suggest improvements with specific examples.
```

### 6. Optimize Performance
```
Optimize [COMPONENT/PAGE] for:
- [ ] Load time
- [ ] Bundle size
- [ ] Database queries
- [ ] Rendering performance

Measure before and after.
```

---

## My Effective Prompts

> Add your actual prompts that worked well here:

### Prompt 1: [Category]
```
[PASTE YOUR PROMPT HERE]
```
**Result:** [What it accomplished]

### Prompt 2: [Category]
```
[PASTE YOUR PROMPT HERE]
```
**Result:** [What it accomplished]

---

## Project-Specific Shortcuts

### Paragu-AI Builder Specific

| Shortcut | Full Request |
|----------|--------------|
| `/new-section` | "Create a new reusable section component following the pattern in web/components/sections/" |
| `/compose-page` | "Generate a composed page for business type [X] using the template engine" |
| `/update-tokens` | "Update design tokens for [business] with [color] primary color" |
| `/check-rls` | "Check RLS policies for [table] and ensure proper security" |

---

## Prompting Best Practices

Based on this project (Paragu-AI Builder):

1. **Always specify business_id** - When working with database queries
2. **Use CSS variables** - Never ask for hardcoded colors
3. **Minimal changes** - Ask for focused, specific fixes
4. **Test verification** - Always ask to run typecheck/build after changes
5. **Follow existing patterns** - Reference similar files as examples

---

## Auto-Commands Setup

To use these commands, just type the command name in chat:

```
/fix-build
/add-section hero-banner
/research pricing strategies
```

I'll recognize these and execute the appropriate workflow.
