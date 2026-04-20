# 🚀 OpenCode Quick Commands System

This directory contains tools to make your OpenCode interactions faster and more consistent.

## 📁 Files Created

| File | Purpose |
|------|---------|
| `PROMPTS.md` | Track your effective prompts and templates |
| `opencode-cmd.sh` | Shell script for command routing |
| `.vscode/opencode-snippets.code-snippets` | VS Code snippets for quick prompts |

## 🎯 How to Use

### Method 1: Direct Commands (Recommended)

Simply type these commands in any OpenCode chat:

```
/fix-build           → Fix TypeScript/build errors
/add-section X       → Add new section component
/add-business X      → Add new business type  
/db-migrate X        → Create database migration
/check-security      → Run security audit
/research X          → Research a topic
/analyze-code        → Analyze codebase patterns
```

### Method 2: VS Code Snippets

In VS Code, type:

- `opc-` → See all OpenCode snippets
- `opc-fix` → Fix build error template
- `opc-section` → Add section template
- `opc-business` → Add business type template
- `opc-migrate` → Database migration template
- `opc-research` → Research template
- `opc-review` → Code review template
- `opc-optimize` → Performance optimization template

### Method 3: Shell Script

```bash
# Make executable (one time)
chmod +x opencode-cmd.sh

# Use commands
./opencode-cmd.sh fix-build
./opencode-cmd.sh add-section hero-banner
./opencode-cmd.sh research "competitor pricing"
```

### Method 4: npm Scripts

```bash
cd web/
npm run check        # Run all checks (typecheck + lint + format)
npm run fix          # Fix all auto-fixable issues
npm run typecheck    # TypeScript check only
npm run lint         # ESLint check
npm run lint:fix     # Fix ESLint issues
npm run format       # Format with Prettier
```

## 📝 Prompt Templates

See `PROMPTS.md` for full templates. Quick examples:

### Fix Build Error
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

### Add New Section
```
Add a new section component named 'testimonials-carousel' 
following the pattern from hero-section.tsx.

Requirements:
- Use CSS variables (var(--primary), var(--background))
- Accept props: title, testimonials[]
- Responsive design
- Add to web/components/sections/
```

### Database Migration
```
Create a database migration for table 'appointments':

Fields:
- business_id: uuid (FK to businesses)
- customer_name: text
- appointment_date: timestamptz
- status: text

Requirements:
- Add RLS policies
- Add indexes for business_id and appointment_date
- Follow existing migration patterns
```

## 🔄 Workflow Examples

### Adding a New Business Type

```
/add-business mechanic

Or type it out:
Add a new business type: mechanic
- Business name: Taller Mecánico
- Sections: hero, services, team, testimonials, contact
- Features: emergency: true, booking: true
- Colors: red primary (#dc2626)
```

### Researching Competitors

```
/research https://competitor.com/pricing

Or:
Research https://competitor.com and extract:
- Pricing tiers and features
- Value propositions
- Call-to-action patterns
- Page structure
```

### Code Review Request

```
Review web/components/sections/hero-section.tsx for:
- Type safety
- Error handling
- Performance optimization opportunities
- Accessibility compliance
```

## 💡 Best Practices

1. **Be Specific**: Include file paths, exact error messages, expected behavior
2. **Reference Examples**: "Follow the pattern from [existing file]"
3. **Test Requests**: Always ask to run `typecheck` or `build` after changes
4. **Minimal Changes**: Request focused fixes, not complete rewrites
5. **Context Matters**: Mention if it's for Paragu-AI Builder (I know the patterns!)

## 🎨 Project-Specific Shortcuts

Since this is **Paragu-AI Builder**, these shortcuts work great:

| Shortcut | What I Know |
|----------|-------------|
| `/add-section` | Knows 21 existing sections to use as reference |
| `/add-business` | Knows the 4-file pattern (registry, tokens, content, schema) |
| `/db-migrate` | Knows RLS policies and indexing requirements |
| `/fix-build` | Knows Tailwind 3.4.19, CSS variables, no hardcoded colors |
| `/check-security` | Knows to check RLS, .env files, business_id filters |

## 📝 Tracking Your Prompts

As you find prompts that work well, add them to `PROMPTS.md`:

```markdown
### Prompt: [Category]
```
[Your prompt]
```
**Result:** [What it accomplished]
**When to use:** [Context for reuse]
```

This builds your personal prompt library!

## 🆘 Troubleshooting

**Commands not working?**
- Make sure you're in the correct project directory
- Check that the shell script is executable: `chmod +x opencode-cmd.sh`

**VS Code snippets not showing?**
- Make sure `.vscode/` folder is at project root
- Reload VS Code window

**Want to add new commands?**
- Edit `opencode-cmd.sh` to add shell commands
- Edit `.vscode/opencode-snippets.code-snippets` for VS Code
- Update `PROMPTS.md` with new templates

---

**Happy coding!** 🚀
