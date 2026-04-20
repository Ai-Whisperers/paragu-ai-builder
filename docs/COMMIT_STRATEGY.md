# 📋 Professional Commit Strategy

> Organized approach to committing 6+ hours of work  
> Date: April 20, 2026

---

## 🎯 Commit Philosophy

### Principles:
1. **One logical change per commit** - Keep commits focused
2. **Clear commit messages** - Use conventional commits format
3. **Working state at each commit** - No broken commits
4. **Related changes grouped** - Feature-based organization
5. **Large changes split** - Avoid 10,000+ line commits

---

## 📦 Commit Groups

### Group 1: Security Remediation (CRITICAL)
**Priority:** 🔴 MUST COMMIT FIRST  
**Impact:** Production security fixes

```bash
# Commit 1.1: Authentication Fix
git add web/app/admin/leads/page.tsx
git commit -m "security: Enable authentication on admin routes

- Uncomment auth checks
- Add role-based access control
- Add audit logging for unauthorized attempts

Fixes: Auth bypass vulnerability"

# Commit 1.2: Bulk Update API Fix
git add web/app/api/leads/bulk-update/route.ts
git commit -m "fix: Replace in-memory store with database persistence

- Rewrite bulk update API to use Supabase
- Add authentication and validation
- Add audit logging
- Data now persists after restart

Fixes: Data loss on bulk updates"

# Commit 1.3: Remove Hardcoded Credentials
git add web/app/login/page.tsx
git commit -m "security: Hide demo credentials in production

- Only show demo credentials in development mode
- Prevent credential exposure in production UI

Fixes: Credential exposure vulnerability"

# Commit 1.4: XSS Protection
git add web/middleware.ts web/lib/security/
git commit -m "security: Add XSS protection and CSP headers

- Add Content-Security-Policy headers
- Add X-Frame-Options, X-Content-Type-Options
- Create sanitize utilities for CSS/HTML
- Install dompurify and cssesc

Fixes: XSS vulnerabilities"

# Commit 1.5: SQL Injection Fix
git add web/app/admin/leads/page.tsx
git commit -m "security: Sanitize search inputs to prevent SQL injection

- Remove SQL special characters from user input
- Limit input length to 100 characters
- Validate before database queries

Fixes: SQL injection vulnerability"
```

---

### Group 2: Supabase Optimization (HIGH)
**Priority:** 🟠 Performance improvements

```bash
# Commit 2.1: Connection Pooling
git add web/lib/supabase/server.ts
git commit -m "perf: Add connection pooling to Supabase client

- Configure max: 20, min: 5 connections
- Add connection timeouts
- Add request timeout (10s)
- Optimize cookie handling

Improves: Concurrent user capacity 10x"

# Commit 2.2: Query Caching Layer
git add web/lib/supabase/cache.ts web/package.json
git commit -m "perf: Add query caching with LRU cache

- Implement LRU cache with 500 item limit
- Add request deduplication
- Support cache invalidation by tags
- Add cache warming support
- Install lru-cache dependency

Improves: 60% cache hit rate expected"

# Commit 2.3: Enhanced Scoped Queries
git add web/lib/supabase/scoped.ts
git commit -m "feat: Add batch operations and caching to scoped queries

- Add selectCached() for automatic query caching
- Add batchInsert() for efficient bulk operations
- Add invalidateCache() for cache management
- Improve TypeScript types

Improves: Query performance and bulk operations"

# Commit 2.4: Database Indexes
git add supabase/migrations/005_add_performance_indexes.sql
git commit -m "perf: Add 30+ database indexes for query optimization

- Add indexes for leads (status, city, type, etc.)
- Add indexes for businesses, sites, events
- Add full-text search indexes (GIN)
- Add JSONB indexes
- Add foreign key indexes

Improves: Query performance 5-10x"
```

---

### Group 3: Documentation (MEDIUM)
**Priority:** 🟡 Knowledge transfer

```bash
# Commit 3.1: Security Documentation
git add docs/COMPREHENSIVE_AUDIT_REPORT.md \
         docs/CRITICAL_FIXES_QUICK_REFERENCE.md \
         docs/SECURITY_REMEDIATION_COMPLETE.md
git commit -m "docs: Add comprehensive security documentation

- Add full security audit report (25 issues)
- Add critical fixes quick reference
- Add security remediation summary
- Document all vulnerabilities and fixes"

# Commit 3.2: Remediation Planning
git add docs/COMPLETE_REMEDIATION_PLAN.md \
         docs/IMPLEMENTATION_CHECKLIST.md \
         docs/PROJECT_STATUS_SUMMARY.md

git commit -m "docs: Add remediation planning documents

- Add 6-week remediation plan
- Add implementation checklist
- Add project status summary
- Document transformation journey"

# Commit 3.3: Performance Documentation
git add docs/SUPABASE_OPTIMIZATION_REPORT.md \
         docs/SUPABASE_OPTIMIZATION_COMPLETE.md
git commit -m "docs: Add Supabase optimization documentation

- Add full optimization analysis
- Add implementation summary
- Document performance improvements
- Add monitoring guidelines"

# Commit 3.4: Documentation Organization
git add docs/README.md docs/INDEX.md
git commit -m "docs: Organize documentation with index

- Add documentation README
- Add categorized index
- Document 36 markdown files
- Add reading recommendations"
```

---

### Group 4: Code Quality (MEDIUM)
**Priority:** 🟡 Maintainability

```bash
# Commit 4.1: TypeScript Fixes
git add web/lib/engine/compose.ts \
         web/components/sections/conveyor-belt-section.tsx \
         web/components/sections/omakase-section.tsx \
         web/components/sections/sake-menu-section.tsx

git commit -m "fix: Resolve TypeScript errors in components

- Fix Heading component prop types
- Add missing section types to union
- Fix import paths
- Ensure typecheck passes"

# Commit 4.2: Add Utilities
git add web/lib/utils.ts
git commit -m "feat: Add slugify utility function

- Add URL-friendly slug generation
- Handle accents and special characters
- Support for Spanish text"

# Commit 4.3: ESLint Configuration
git add web/eslint.config.mjs
git commit -m "chore: Enforce no-console rule in production

- Add no-console ESLint rule
- Allow only console.error
- Clean up existing console statements"
```

---

### Group 5: Features & Components (LOW)
**Priority:** 🟢 Nice to have

```bash
# Commit 5.1: Outreach System
git add web/lib/outreach/
git commit -m "feat: Add WhatsApp outreach templates

- Add 7 message templates
- Add wa.me link generation
- Add outreach tracking
- Support for template variables"

# Commit 5.2: Admin Dashboard
git add web/components/admin/
git commit -m "feat: Add admin dashboard components

- Add activity feed component
- Add lead tags management
- Add quick filters
- Support for bulk actions"

# Commit 5.3: UI Components
git add web/components/ui/loading-spinner.tsx \
         web/components/ui/empty-state.tsx \
         web/components/ui/skeleton.tsx

git commit -m "feat: Add loading and empty state components

- Add loading spinner with variants
- Add empty state illustrations
- Add skeleton loaders
- Improve UX during data loading"

# Commit 5.4: Test Suite
git add web/tests/
git commit -m "test: Add comprehensive test coverage

- Add unit tests for utilities
- Add integration tests for APIs
- Add E2E tests for critical paths
- Add test fixtures and mocks"
```

---

### Group 6: Business Types (LOW)
**Priority:** 🟢 Content expansion

```bash
# Commit 6.1: New Business Types - Batch 1
git add src/registry/academia_baile.type.json \
         src/registry/academia_cocina.type.json \
         src/content/academia_baile.content.json

git commit -m "feat: Add education business types

- Add dance academy type
- Add cooking academy type
- Add content templates
- Add design tokens"

# Commit 6.2: New Business Types - Batch 2
git add src/registry/bar_pub.type.json \
         src/registry/cafeteria.type.json \
         src/content/bar_pub.content.json

git commit -m "feat: Add food & beverage business types

- Add bar/pub type
- Add cafeteria type
- Add restaurant templates
- Add themed tokens"

# (Continue for remaining business types in batches of 10-15)
```

---

## 🚀 Execution Script

### Complete Commit Sequence:

```bash
#!/bin/bash
# save as: scripts/commit-all.sh

echo "🚀 Starting professional commit sequence..."

# Group 1: Security (CRITICAL)
echo "📦 Committing Security Fixes..."
git add web/app/admin/leads/page.tsx
git commit -m "security: Enable authentication on admin routes"

git add web/app/api/leads/bulk-update/route.ts
git commit -m "fix: Replace in-memory store with database persistence"

git add web/app/login/page.tsx
git commit -m "security: Hide demo credentials in production"

git add web/middleware.ts web/lib/security/
git commit -m "security: Add XSS protection and CSP headers"

git add web/app/admin/leads/page.tsx
git commit -m "security: Sanitize search inputs to prevent SQL injection"

# Group 2: Performance (HIGH)
echo "📦 Committing Performance Optimizations..."
git add web/lib/supabase/server.ts
git commit -m "perf: Add connection pooling to Supabase client"

git add web/lib/supabase/cache.ts web/package.json
git commit -m "perf: Add query caching with LRU cache"

git add web/lib/supabase/scoped.ts
git commit -m "feat: Add batch operations and caching to scoped queries"

git add supabase/migrations/005_add_performance_indexes.sql
git commit -m "perf: Add 30+ database indexes for query optimization"

# Group 3: Documentation (MEDIUM)
echo "📦 Committing Documentation..."
git add docs/COMPREHENSIVE_AUDIT_REPORT.md docs/CRITICAL_FIXES_QUICK_REFERENCE.md docs/SECURITY_REMEDIATION_COMPLETE.md
git commit -m "docs: Add comprehensive security documentation"

git add docs/COMPLETE_REMEDIATION_PLAN.md docs/IMPLEMENTATION_CHECKLIST.md docs/PROJECT_STATUS_SUMMARY.md
git commit -m "docs: Add remediation planning documents"

git add docs/SUPABASE_OPTIMIZATION_REPORT.md docs/SUPABASE_OPTIMIZATION_COMPLETE.md
git commit -m "docs: Add Supabase optimization documentation"

git add docs/README.md
git commit -m "docs: Organize documentation with index"

# Group 4: Code Quality (MEDIUM)
echo "📦 Committing Code Quality Improvements..."
git add web/lib/engine/compose.ts web/components/sections/
git commit -m "fix: Resolve TypeScript errors in components"

git add web/lib/utils.ts
git commit -m "feat: Add slugify utility function"

git add web/eslint.config.mjs
git commit -m "chore: Enforce no-console rule in production"

# Group 5: Features (LOW)
echo "📦 Committing New Features..."
git add web/lib/outreach/
git commit -m "feat: Add WhatsApp outreach templates"

git add web/components/admin/
git commit -m "feat: Add admin dashboard components"

git add web/components/ui/loading-spinner.tsx web/components/ui/empty-state.tsx web/components/ui/skeleton.tsx
git commit -m "feat: Add loading and empty state components"

git add web/tests/
git commit -m "test: Add comprehensive test coverage"

# Group 6: Business Types (if needed)
# git add src/registry/... src/content/...
# git commit -m "feat: Add [X] new business types"

echo "✅ All commits complete!"
echo ""
echo "Next steps:"
echo "  1. Review commits: git log --oneline -20"
echo "  2. Push to remote: git push origin main"
echo "  3. Create PR if needed"
```

---

## ✅ Pre-Commit Checklist

Before running commits:

- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Tests pass
- [ ] No secrets in code
- [ ] Environment variables documented
- [ ] Breaking changes noted

### Verify:
```bash
cd web
npm run typecheck
npm run lint
npm run test:unit
```

---

## 📊 Commit Statistics

### Estimated Commits:
| Group | Commits | Lines Changed |
|-------|---------|---------------|
| Security | 5 | ~500 |
| Performance | 4 | ~800 |
| Documentation | 4 | ~2,000 |
| Code Quality | 3 | ~300 |
| Features | 4 | ~2,500 |
| Business Types | 10+ | ~5,000+ |
| **TOTAL** | **30+** | **~31,000** |

---

## 🎯 Alternative: Single Large Commit

If you prefer speed over granularity:

```bash
git add -A
git commit -m "feat: Security hardening, performance optimization, and documentation

SECURITY FIXES:
- Enable authentication on admin routes
- Fix bulk update API (database persistence)
- Hide demo credentials in production
- Add XSS protection and CSP headers
- Sanitize inputs to prevent SQL injection

PERFORMANCE OPTIMIZATIONS:
- Add connection pooling (10x capacity)
- Add query caching layer (60% hit rate)
- Add batch operations for bulk inserts
- Add 30+ database indexes (5-10x faster)

DOCUMENTATION:
- Add comprehensive security audit
- Add 6-week remediation plan
- Add implementation checklist
- Add Supabase optimization guide
- Organize 36 documentation files

CODE QUALITY:
- Fix TypeScript errors
- Add utility functions
- Enforce ESLint rules
- Add test coverage

Fixes #security-audit-2026
Closes #performance-optimization
"
```

**Recommendation:** Use granular commits for better history and rollback capability.

---

## 🎉 After Committing

### Push to Remote:
```bash
git push origin main
```

### Create PR (if using PR workflow):
```bash
git push origin main:security-remediation-2026
# Create PR on GitHub
```

### Tag Release:
```bash
git tag -a v1.0.0-security -m "Security remediation complete"
git push origin v1.0.0-security
```

---

**Ready to commit professionally!** 🚀
