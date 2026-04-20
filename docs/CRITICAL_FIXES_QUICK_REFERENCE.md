# 🚨 CRITICAL FIXES QUICK REFERENCE
## Start Here - Fix These First

**⚠️ DO NOT DEPLOY UNTIL THESE ARE FIXED ⚠️**

---

## 🔴 FIX #1: Enable Authentication (30 minutes)

**File:** `app/admin/leads/page.tsx` (lines 196-200)

### Problem
```typescript
// AUTH IS COMMENTED OUT!
// const supabase = await createClient()
// const { data: { user } } = await supabase.auth.getUser()
// if (!user) redirect('/login')
```

### Fix
```typescript
// ADD THIS IMMEDIATELY
const supabase = await createClient()
const { data: { user }, error: authError } = await supabase.auth.getUser()

if (authError || !user) {
  redirect('/login?error=unauthorized')
}
```

---

## 🔴 FIX #2: Fix Bulk Update API (2 hours)

**File:** `app/api/leads/bulk-update/route.ts` (lines 44-53)

### Problem
```typescript
// DATA LOST ON SERVER RESTART!
const leadsStore = new Map<string, {...}>()
```

### Fix
Replace entire file content with database-backed version (see full remediation plan).

**Quick Fix:**
```typescript
// Replace the in-memory Map with Supabase queries
const { data, error } = await supabase
  .from('leads')
  .update(updateData)
  .in('id', accessibleIds)
  .select()
```

---

## 🔴 FIX #3: Remove Hardcoded Credentials (5 minutes)

**File:** `app/login/page.tsx` (lines 96-99)

### Problem
```tsx
<p>admin@paragu-ai.builder / demo123</p>
```

### Fix
```tsx
{process.env.NODE_ENV === 'development' && (
  <div className="mt-6 text-center text-sm text-gray-500">
    <p>Demo credentials:</p>
    <p className="mt-1 font-mono text-xs">admin@paragu-ai.builder / demo123</p>
  </div>
)}
```

---

## 🔴 FIX #4: Sanitize dangerouslySetInnerHTML (2 hours)

**Files:** 6 files using dangerous HTML

### Install
```bash
npm install dompurify cssesc
npm install --save-dev @types/dompurify jsdom
```

### Create Sanitizer
```typescript
// lib/security/sanitize.ts
import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import cssesc from 'cssesc'

const window = new JSDOM('').window
const purify = DOMPurify(window)

export function sanitizeCSS(css: string): string {
  // Block dangerous CSS
  const dangerous = ['expression', 'javascript:', 'behavior:', '<script']
  if (dangerous.some(d => css.toLowerCase().includes(d))) {
    throw new Error('Invalid CSS')
  }
  return cssesc(css, { isIdentifier: false, quotes: 'double', wrap: false })
}
```

### Apply
```typescript
// BEFORE
<style dangerouslySetInnerHTML={{ __html: page.theme.cssString }} />

// AFTER
import { sanitizeCSS } from '@/lib/security/sanitize'
<style dangerouslySetInnerHTML={{ __html: sanitizeCSS(page.theme.cssString) }} />
```

---

## 🔴 FIX #5: Add CSP Headers (30 minutes)

**File:** `middleware.ts` or `next.config.js`

### Add to Middleware
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  response.headers.set('Content-Security-Policy', 
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"
  )
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  return response
}
```

---

## 🟠 FIX #6: Remove Console.logs (1 hour)

### Quick Script
```bash
# Count them
grep -r "console\." --include="*.ts" --include="*.tsx" web/ | wc -l

# Replace with logger (be careful!)
find web -name "*.ts" -o -name "*.tsx" | xargs sed -i 's/console\.log/logger.info/g'
find web -name "*.ts" -o -name "*.tsx" | xargs sed -i 's/console\.warn/logger.warn/g'
find web -name "*.ts" -o -name "*.tsx" | xargs sed -i 's/console\.error/logger.error/g'
```

### ESLint Rule
```json
// .eslintrc.json
{
  "rules": {
    "no-console": ["error", { "allow": ["error"] }]
  }
}
```

---

## 🟠 FIX #7: Fix SQL Injection (1 hour)

**File:** `app/admin/leads/page.tsx` (line 97)

### Problem
```typescript
query = query.ilike('business_name', `%${searchParams.search}%`)
```

### Fix
```typescript
import { z } from 'zod'

const SearchSchema = z.object({
  search: z.string().max(100).regex(/^[a-zA-Z0-9\s\-_]*$/).optional()
})

// Validate
const params = SearchSchema.parse(searchParams)

if (params.search) {
  // Safe - validated and sanitized
  query = query.ilike('business_name', `%${params.search}%`)
}
```

---

## 🟠 FIX #8: Add Rate Limiting (2 hours)

### Install
```bash
npm install @upstash/ratelimit @upstash/redis
```

### Create Middleware
```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
})

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m')
})
```

### Apply to API
```typescript
// In API route
const { success } = await ratelimit.limit(user.id || ip)
if (!success) {
  return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
}
```

---

## 🟡 FIX #9: Add Error Boundaries (1 hour)

**File:** `components/error-boundary.tsx`

```tsx
'use client'

import { Component, ReactNode } from 'react'

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please refresh.</div>
    }
    return this.props.children
  }
}
```

**Apply in layout:**
```tsx
// app/layout.tsx
<ErrorBoundary>{children}</ErrorBoundary>
```

---

## 🟡 FIX #10: Fix RLS Policies (2 hours)

**File:** `supabase/migrations/002_fix_rls.sql`

```sql
-- Drop insecure policies
DROP POLICY IF EXISTS "Authenticated read" ON leads;

-- Create secure policy
CREATE POLICY "leads_isolation" ON leads
  FOR ALL TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- Repeat for all tables
```

---

## ⏱️ TIME ESTIMATES

| Fix | Time | Priority |
|-----|------|----------|
| Enable Auth | 30 min | 🔴 CRITICAL |
| Fix Bulk Update | 2 hours | 🔴 CRITICAL |
| Remove Credentials | 5 min | 🔴 CRITICAL |
| Sanitize HTML | 2 hours | 🔴 CRITICAL |
| CSP Headers | 30 min | 🔴 CRITICAL |
| Remove Console.logs | 1 hour | 🟠 HIGH |
| Fix SQL Injection | 1 hour | 🟠 HIGH |
| Add Rate Limiting | 2 hours | 🟠 HIGH |
| Error Boundaries | 1 hour | 🟡 MEDIUM |
| Fix RLS | 2 hours | 🟡 MEDIUM |

**Total: ~12 hours for critical fixes**

---

## ✅ DEPLOYMENT CHECKLIST

Before production deploy, verify:

- [ ] All 🔴 CRITICAL fixes complete
- [ ] Authentication working
- [ ] Bulk updates persist
- [ ] No hardcoded credentials
- [ ] XSS not possible
- [ ] SQL injection not possible
- [ ] Rate limiting active
- [ ] RLS policies enforced
- [ ] Tests passing
- [ ] Security scan clean

**Current Status:** 0/10 ❌

---

## 🚀 EMERGENCY DEPLOY (Minimum Viable)

If you MUST deploy immediately, do ONLY these 5:

1. ✅ Enable authentication (30 min)
2. ✅ Fix bulk update API (2 hours)
3. ✅ Remove demo credentials (5 min)
4. ✅ Add basic CSP headers (10 min)
5. ✅ Add input validation (1 hour)

**Time: ~4 hours to minimum security**

---

## 📞 GETTING HELP

### Security Issues
- Hire security consultant: $5,000
- Security audit: 1 week
- Penetration testing: 2-3 days

### Development
- Senior developer: 6 weeks
- Cost: ~$15,000
- Can be parallelized with 2 devs

### Emergency Contacts
- Security incident: security@company.com
- Production issues: oncall@company.com
- Escalation: CTO/CEO

---

## 🎯 SUCCESS CRITERIA

You're ready to deploy when:

✅ No critical vulnerabilities (npm audit)
✅ Authentication enforced
✅ Input validated
✅ Output sanitized
✅ Rate limiting active
✅ Tests passing (>80% coverage)
✅ Load tested (1000 users)
✅ Monitoring active
✅ Rollback plan ready
✅ Team sign-off

---

**Start with Fix #1 NOW. Every minute counts.**
