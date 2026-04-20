# Troubleshooting Guide

Common issues and solutions for Paragu-AI Builder.

## Build Issues

### TypeScript Errors

**Problem:** `npm run typecheck` fails with type errors

**Solution:**
```bash
# Check specific error
npx tsc --noEmit

# Common fixes:
# 1. Add missing type definitions
npm install -D @types/package-name

# 2. Fix import paths (use @/ alias)
import { utils } from '@/lib/utils'  # ✅
import { utils } from '../../../lib/utils'  # ❌

# 3. Add proper type annotations
const data: BusinessData = await loadBusiness(slug)
```

### ESLint Errors

**Problem:** `npm run lint` fails

**Solution:**
```bash
# Auto-fix most issues
npm run lint:fix

# Ignore specific line (add comment)
// eslint-disable-next-line rule-name
const unused = 'value'

# Disable for entire file (at top)
/* eslint-disable rule-name */
```

### Build Fails with Memory Error

**Problem:** `npm run build` runs out of memory

**Solution:**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Or use the following in package.json
"build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
```

## Database Issues

### Connection Failed

**Problem:** Cannot connect to Supabase

**Solution:**
```bash
# 1. Verify environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# 2. Check network connectivity
curl $NEXT_PUBLIC_SUPABASE_URL

# 3. Verify RLS policies aren't blocking
# Check Supabase Dashboard → Database → Policies
```

### Migration Failed

**Problem:** Database migration won't apply

**Solution:**
```bash
# Check migration status
supabase migration list

# Apply pending migrations
supabase migration up

# Reset and reapply (WARNING: loses data)
supabase db reset
```

### Query Timeout

**Problem:** Database queries timeout

**Solution:**
```sql
-- Add index for frequently queried columns
CREATE INDEX idx_leads_city ON leads(city);
CREATE INDEX idx_leads_status ON leads(status);

-- Analyze slow queries
EXPLAIN ANALYZE SELECT * FROM leads WHERE city = 'Asuncion';
```

## Runtime Issues

### Business Page Not Found

**Problem:** `/some-business` returns 404

**Solution:**
```typescript
// 1. Check if business exists
const business = await loadBusiness('some-business')
console.log(business)

// 2. Verify slug format (lowercase, hyphenated)
const slug = 'some-business'  // ✅
const slug = 'Some Business'  // ❌

// 3. Check demo-data.ts for valid slugs
DEMO_BUSINESSES['peluqueria']  // Valid business type
```

### Styles Not Loading

**Problem:** CSS variables not applied

**Solution:**
```typescript
// 1. Verify theme CSS is injected
<style dangerouslySetInnerHTML={{ __html: page.theme.cssString }} />

// 2. Check token resolution
import { resolveTokens } from '@/lib/tokens/resolver'
const tokens = resolveTokens(business.type)
console.log(tokens.cssString)

// 3. Ensure no hardcoded colors
// ❌ Bad
<div className="bg-blue-500">

// ✅ Good
<div className="bg-[var(--primary)]">
```

### Hydration Mismatch

**Problem:** React hydration error in console

**Solution:**
```typescript
// 1. Use 'use client' for client components
'use client'

import { useState } from 'react'

// 2. Avoid using window/document in SSR
const [width, setWidth] = useState(0)
useEffect(() => {
  setWidth(window.innerWidth)  // Safe in useEffect
}, [])

// 3. Use dynamic import for browser-only code
const DynamicMap = dynamic(() => import('./map'), { ssr: false })
```

## Development Issues

### Hot Reload Not Working

**Problem:** Changes not reflected in browser

**Solution:**
```bash
# 1. Restart dev server
Ctrl/Cmd + C
npm run dev

# 2. Clear Next.js cache
rm -rf .next
npm run dev

# 3. Hard refresh browser
Ctrl/Cmd + Shift + R
```

### Port Already in Use

**Problem:** `Port 3000 is already in use`

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
npm run dev -- --port 3001
```

### Module Not Found

**Problem:** `Cannot find module '@/components/ui/button'`

**Solution:**
```bash
# 1. Check tsconfig.json paths
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}

# 2. Restart TypeScript server in VS Code
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

# 3. Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Deployment Issues

### Cloudflare Build Fails

**Problem:** Build fails on Cloudflare Pages

**Solution:**
```bash
# 1. Verify build command
cd web && npm run build

# 2. Check build output directory
web/dist

# 3. Verify environment variables set in dashboard
# Dashboard → Pages → Project → Settings → Environment Variables
```

### API Routes 404

**Problem:** API routes return 404 in production

**Solution:**
```typescript
// 1. Ensure dynamic export for API routes
export const runtime = 'nodejs'

// 2. Check route path matches exactly
// app/api/health/route.ts → /api/health
// app/api/webhooks/mercadopago/route.ts → /api/webhooks/mercadopago

// 3. Verify no middleware blocking
// middleware.ts should allow API routes
```

### Static Generation Fails

**Problem:** `generateStaticParams` fails

**Solution:**
```typescript
// 1. Add error handling
export async function generateStaticParams() {
  try {
    const slugs = await loadAllSlugs()
    return slugs.map(slug => ({ business: slug }))
  } catch (e) {
    console.error('Failed to generate static params:', e)
    return []  // Return empty array instead of crashing
  }
}

// 2. Add dynamicParams = true
export const dynamicParams = true
```

## Performance Issues

### Slow Page Load

**Problem:** Business pages load slowly

**Solution:**
```typescript
// 1. Add caching
export const revalidate = 3600  // Revalidate every hour

// 2. Optimize images
<Image
  src={imageUrl}
  width={800}
  height={600}
  priority={index < 4}
/>

// 3. Lazy load below-fold content
const Footer = dynamic(() => import('./footer'))
```

### Large Bundle Size

**Problem:** JavaScript bundle too large

**Solution:**
```bash
# Analyze bundle
npm run analyze

# Common optimizations:
# 1. Dynamic imports for heavy components
const HeavyChart = dynamic(() => import('./chart'), {
  loading: () => <ChartSkeleton />
})

# 2. Tree-shake unused imports
import { specificFunction } from 'library'  // ✅
import * as Library from 'library'  // ❌ (imports everything)

# 3. Use lighter alternatives
# Replace moment.js with date-fns
```

## Debug Techniques

### Enable Debug Logging

```bash
# Set debug mode
DEBUG=true npm run dev

# Or in .env.local
DEBUG=true
```

### Check Supabase Queries

```typescript
// Enable query logging
const { data, error } = await supabase
  .from('leads')
  .select('*')
  .eq('city', 'Asuncion')

console.log('Query:', supabase.from('leads').select('*').eq('city', 'Asuncion').toString())
console.log('Result:', { data, error })
```

### Network Debugging

```bash
# Check API responses
curl -v https://paragu-ai.pages.dev/api/health

# Check headers
curl -I https://paragu-ai.pages.dev/salon-maria
```

## Getting Help

If issues persist:

1. **Check logs:** Cloudflare Dashboard → Pages → Deployment → Functions
2. **Check status:** https://status.supabase.com/
3. **Review documentation:** `/docs` folder in repo
4. **Create issue:** Include error logs, reproduction steps, and environment info
