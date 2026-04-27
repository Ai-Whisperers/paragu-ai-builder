# Plan: Clean Up Demo Data, Placeholders, and Archive Code

## Current State

### Demo Data with Placeholder Phone Numbers

`web/lib/engine/demo-data.ts` contains demo tenant data with placeholder contact info:

```typescript
// Line 463-464
phone: '+595XXXXXXXXX', // PLACEHOLDER - UPDATE WITH LAURA'S REAL NUMBER
whatsapp: '+595XXXXXXXXX', // PLACEHOLDER - UPDATE WITH LAURA'S REAL NUMBER
```

These are real tenant placeholders (Granja Cabral = Laura's egg farm) that were never filled in. The comments are 6+ months old.

### Demo GA4 IDs

`web/lib/constants.ts`:
```typescript
export const DEMO_GA4_MEASUREMENT_ID = 'G-XXXXXXXXXXX'
export const DEMO_GA4_MEASUREMENT_ID_R = 'R-XXXXXXXXXX'
```

These are used as fallback GA4 IDs. If someone deploys without setting real GA4 env vars, analytics will report to a fake ID.

### Placeholder TODO Content

`web/scripts/create-type.ts` generates new business types with TODO content:

```typescript
primary: 'TODO: describe primary audience',
descriptionTemplate: `{{businessName}} en {{city}}. TODO: write a 2-sentence description.`,
subheadlineTemplate: 'TODO: tagline',
```

These are intentional (scaffolding), but the CLI-ops script (`web/scripts/cli-ops.ts:204`) has logic to detect them. That detection code would be cleaner as a CLI lint command.

### Archived Scripts

`web/scripts/_archive/tenant-health.ts` — orphaned script. It was a CLI tool to check tenant health. Either restore it as a real CLI command or remove it.

## Proposed Cleanup

### 1. Fill Real Demo Data

```typescript
// web/lib/engine/demo-data.ts
// Replace placeholder numbers with real Granja Cabral contact info
phone: '+595 981 324 569',  // Laura's verified number
whatsapp: '+595 981 324 569',
```

Or, if this is a security concern (exposing real numbers in source), load from env:

```typescript
// web/lib/engine/demo-data.ts
phone: process.env.DEMO_PHONE || '+595 981 XXX XXX'
```

### 2. Fix Demo GA4 IDs

```typescript
// web/lib/constants.ts
export const DEMO_GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || ''
export const DEMO_GA4_MEASUREMENT_ID_R = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID_R || ''
```

Or, better: make GA4 tracking a no-op when the measurement ID isn't set:

```typescript
// web/lib/integrations/analytics/ga4.ts
if (!measurementId || measurementId.startsWith('G-XXXXXXXX')) {
  logger.warn('GA4 not configured — skipping event')
  return
}
```

### 3. Archive or Restore `tenant-health.ts`

**Option A: Remove** (if unused):
```bash
rm web/scripts/_archive/tenant-health.ts
```

**Option B: Restore as CLI command**:
```typescript
// web/scripts/cli.ts — add command
{
  name: 'tenant-health',
  description: 'Check all tenants for common issues',
  run: async () => {
    const { checkTenantHealth } = await import('./_archive/tenant-health')
    await checkTenantHealth()
  }
}
```

**Recommendation**: Option A. The health check is better done by the monitoring system. The archived script is 3 years old.

### 4. Document Placeholder Detection Pattern

The `create-type.ts` TODO markers are intentional scaffolding. Document this in the CLI:

```bash
npx tsx scripts/cli.ts check-todos  # Checks all content for unmatched TODO markers
```

## Files to Touch

| File | Change |
|---|---|
| `web/lib/engine/demo-data.ts` | Fill real phone numbers or load from env |
| `web/lib/constants.ts` | Make demo GA4 IDs no-ops when not configured |
| `web/lib/integrations/analytics/ga4.ts` | Add measurement ID validation |
| `web/scripts/_archive/tenant-health.ts` | DELETE or restore as CLI command |
| `web/scripts/cli-ops.ts` | MAYBE simplify TODO detection |

## Effort & Risk

- **Effort**: Small (30 min - 1 hour)
- **Risk**: Minimal
- **Impact**: Demo previews will have real contact info. Analytics won't report to fake IDs.
