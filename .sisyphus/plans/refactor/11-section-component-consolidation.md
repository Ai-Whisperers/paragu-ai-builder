# Plan: Standardize Section Component Structure and File Naming

## Current State

120 section files with inconsistent patterns:

### Naming Inconsistencies

| Pattern | Examples | Count |
|---|---|---|
| `*-section.tsx` | `hero-section.tsx`, `footer-section.tsx` | ~70 |
| `*-form.tsx` | `lead-form.tsx`, `review-form.tsx`, `subscription-form.tsx` | ~5 |
| `*-picker.tsx` | `delivery-slot-picker-section.tsx` | 1 |
| `*-calculator.tsx` | `delivery-calculator-section.tsx`, `savings-calculator-section.tsx` | 2 |
| Mixed suffix | `blog-social-share.tsx`, `smart-whatsapp-section.tsx` | ~5 |
| No standard export | Some `export default`, some `export function`, some both | ~40 |

### Structural Inconsistencies

1. Some have `*-data.ts` sidecars, others embed types inline
2. Some import at the top (standard), `product-catalog-section.tsx` has an import at line 144
3. Some have `'use client'`, others don't (server components)
4. Export default vs named export varies — renderer-map imports both ways
5. Some sections export their Props interface, others keep it private

## Proposed Solution

### 1. File Naming Convention

```
{sections,forms,content,navigation,media,hero,commerce,social,calculators,specialty}/
  {name}-section.tsx          # Main section component  
  {name}-section.data.ts      # Optional: types + defaults (current *-data.ts convention)
```

**Exceptions** (stay as-is):
- Sub-components used only by one section: co-located in same dir
- Utility-like sections: `whatsapp-float.tsx` (used by renderer, not a page section)

### 2. Structural Convention

```typescript
// 1. 'use client' only if hooks/state are used
'use client'

// 2. External imports (third-party first, then @/ aliases)
import { useState } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

// 3. Local types (or import from .data file)
export interface MySectionProps {
  title: string
  items: Array<{ name: string }>
}

// 4. Constants / defaults
const DEFAULT_TITLE = 'Default Title'

// 5. Helper functions (pure, no hooks)
function formatItem(item: { name: string }): string {
  return item.name.toUpperCase()
}

// 6. Component (named export only)
export function MySection({ title, items }: MySectionProps) {
  return (
    <section>...</section>
  )
}
// NO export default — renderer imports by name
```

### 3. Renderer-Map Alignment

The auto-generated `renderer-map.ts` imports by filename convention:
- `*-section.tsx` → looks for `{Name}Section` export
- `*-form.tsx` → looks for `{Name}Form` export
- Others → tries camelCase export matching filename

**Fix**: Update the generator script (`web/scripts/generate-renderer-map.ts`) to handle all patterns explicitly.

### 4. Audit and Fix `export default`

Search for files with `export default` in sections:

```bash
grep -rn "^export default" web/components/sections/ --include='*.tsx' | grep -v node_modules
```

For each:
- If both `export function` and `export default` exist → remove `export default`
- If only `export default` exists → add named export, keep default for backward compat
- Update renderer-map if needed

### 5. Fix Late Import

```typescript
// product-catalog-section.tsx:144 — import inside file
// Move to top:
import { ProductCard } from './product-card'
```

## Files to Touch

| File | Change |
|---|---|
| `web/scripts/generate-renderer-map.ts` | Improve name detection |
| `web/components/sections/commerce/product-catalog-section.tsx` | Move import to top |
| All `export default` section files (audit needed) | Add/add named export |
| `docs/AGENTS.md` or `CLAUDE.md` | Document conventions |

## Effort & Risk

- **Effort**: Medium (3-4 hours for full audit + fixes)
- **Risk**: Low — no functional changes, naming only
- **Impact**: 120 files with consistent structure reduces cognitive load

## Success Criteria

- [ ] All section files follow the structural convention
- [ ] No `export default` in section files without a named export
- [ ] No imports at the bottom of section files
- [ ] Renderer-map generator handles all naming patterns
- [ ] Build passes (renderer-map must match actual exports)
