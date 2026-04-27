# Plan: Optimize Lucide React Icon Imports

## Current State

Multiple section files import ALL icons from `lucide-react` using wildcard imports:

```typescript
// components/sections/content/features-section.tsx
import * as Icons from 'lucide-react'  // Loads ALL 1000+ icons
```

Others import 15+ individual icons:

```typescript
import { Heart, Leaf, Award, MapPin, Clock, Phone, MessageCircle, CheckCircle, Egg, Bird, Sprout, Shield, TreePine, Users, Sparkles, Droplets, Recycle, ArrowRight, Check } from 'lucide-react'
```

### The Problem

Next.js 15 with Turbopack tree-shakes these at build time, so the production bundle only includes used icons. However:
- Turbopack's tree-shaking isn't as thorough as webpack's in all edge cases
- The `import * as Icons` pattern forces the bundler to evaluate ALL exports before it can tree-shake
- IDE autocomplete and TypeScript type checking are slower with 1000+ exports
- Bundle analysis shows lucide-react as a significant chunk

### Current Usage Pattern

About 50+ distinct icons are used across the codebase. Each file imports them individually OR uses the `* as Icons` pattern.

### Recommendation

Given Next.js 16 + Turbopack, tree-shaking is effective enough that this isn't a critical issue. But there are two concrete improvements:

### 1. Replace `import * as Icons` with Named Imports

```typescript
// Before (features-section.tsx):
import * as Icons from 'lucide-react'

// After:
import { Shield, Download, ExternalLink } from 'lucide-react'
// ... and use icons directly instead of Icons[name] dynamic lookup
```

The `features-section.tsx` does dynamic icon lookup via `Icons[name]` — this is the worst pattern because it bypasses static analysis entirely. Replace with a static map:

```typescript
// Before:
function FeatureIcon({ name }: { name?: string }) {
  if (!name) return null
  const Icon = (Icons as any)[name]  // Dynamic lookup — can't tree-shake
  return <Icon size={24} />
}

// After:
import { Shield, Download, ExternalLink, CheckCircle, Star } from 'lucide-react'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  shield: Shield,
  download: Download,
  'external-link': ExternalLink,
  check: CheckCircle,
  star: Star,
}

function FeatureIcon({ name }: { name?: string }) {
  if (!name || !ICON_MAP[name]) return null
  const Icon = ICON_MAP[name]
  return <Icon size={24} />
}
```

### 2. Audit `b2b-wholesale-section.tsx` and `our-story-section.tsx`

These files import ~20+ individual icons each. Consider creating a shared icon registry for components that use many icons from data files (icons are referenced by string name in content):

```typescript
// web/lib/icons.ts
import { CheckCircle, Shield, Truck, Leaf, Award, Users, Package, ... } from 'lucide-react'

export const SECTION_ICONS = {
  CheckCircle, Shield, Truck, Leaf, Award, Users, Package,
  // ... all icons used across sections
} as const

export type SectionIconName = keyof typeof SECTION_ICONS
```

This way, one optimized import serves all sections, and the bundle only includes icons that are actually referenced.

## Effort

- **Small**: 30 min to fix `features-section.tsx`
- **Optional**: 30 min to create shared icon registry
- **Total**: ~1 hour

## Files to Touch

| File | Change |
|---|---|
| `web/components/sections/content/features-section.tsx` | Replace `import * as Icons` with named imports + ICON_MAP |
| `web/lib/icons.ts` | NEW — shared icon registry (optional) |
| `web/components/sections/specialty/b2b-wholesale-section.tsx` | MAYBE use shared icon registry |
| `web/components/sections/specialty/our-story-section.tsx` | MAYBE use shared icon registry |
