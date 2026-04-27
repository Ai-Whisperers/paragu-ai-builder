# ParaguAI Builder — Complete Improvement Plan

Full audit of 98+ section components, 638-line section registry, renderer patterns, and competitor analysis.
Goal: Reduce component bloat 60%, add missing features, implement section-level configuration.

---

## Phase 0: Architecture Assessment

### Current Architecture Problems

1. **Two renderers**: `renderer.tsx` (legacy, 175 lines) + `site-renderer.tsx` (modern, 187 lines) — both map section IDs to React components manually. Adding a section requires editing 3 files (registry + 2 renderers).
2. **No automatic registration**: Every section needs manual import in BOTH renderers.
3. **No section config system**: Sections can't be styled per-instance (no padding, background, animation overrides).
4. **CVA not used in sections**: UI primitives (`button.tsx`, `badge.tsx`) use CVA but section components don't.
5. **Bloat**: 6 gallery-like components, 5 price components, 4 FAQ components, 7 restaurant/menu components.

### Target Architecture

```
section-registry.ts          — Single source of truth (component manifest)
    ↓
compose-site.ts              — Reads registry, validates sections, resolves content
    ↓
renderer.tsx (AUTO-GENERATED) — Dynamically imports from registry — no manual maps
    ↓
section-components/*.tsx     — Standard props interface with CVA variants
```

---

## Phase 1: Add Missing Core Components

### 1.1 `stats-counter` — Add to Registry + Create Component
Currently NOT in registry. Referenced in `b2b-professional` allowedSections but no component exists.

```typescript
'stats-counter': {
  id: 'stats-counter',
  defaultVariant: 'inline',
  variants: ['inline', 'cards', 'minimal'],
},
```

Props: `items: Array<{ value: string; label: string; icon?: string }>`, `columns: 2|3|4`

### 1.2 `logo-strip` — Add to Registry + Create Component
Client logos are a critical trust signal. NOT in registry.

```typescript
'logo-strip': {
  id: 'logo-strip',
  defaultVariant: 'grid',
  variants: ['grid', 'carousel', 'single-row'],
},
```

Props: `title?: string`, `logos: Array<{ src: string; alt: string; href?: string }>`

### 1.3 `video-embed` — Add to Registry + Create Component
In allowedSections but NOT in registry. Blocks YouTube/Vimeo embeds.

```typescript
'video-embed': {
  id: 'video-embed',
  defaultVariant: 'aspect-16-9',
  variants: ['aspect-16-9', 'aspect-4-3', 'square', 'full-width'],
},
```

Props: `url: string`, `title?: string`, `caption?: string`, `autoplay?: boolean`

### 1.4 `breadcrumbs` — Add as Standalone Section
Currently used internally by blog but no standalone section.

```typescript
'breadcrumbs': {
  id: 'breadcrumbs',
  defaultVariant: 'default',
  variants: ['default', 'minimal'],
},
```

---

## Phase 2: Component Consolidation

### 2.1 Unified `<ContentGrid>` — Replaces 8 Components

**Problem**: `gallery`, `photo-gallery`, `portfolio`, `features`, `services`, `branches`, `team`, `case-studies` all show a grid of cards with different props.

**Solution**: Single `<ContentGrid>` with variants:

| Current Component | ContentGrid Mapping |
|------------------|-------------------|
| `gallery` | variant='grid', imageShape='square' |
| `photo-gallery` | variant='masonry' |
| `portfolio` | variant='grid', showFilters=true, cardStyle='detailed' |
| `features` | cardStyle='icon-card' |
| `services` | cardStyle='icon-card' |
| `team` | imageShape='circle', cardStyle='detailed' |
| `branches` | variant='list', cardStyle='horizontal' |
| `case-studies` | cardStyle='detailed' |

```typescript
interface ContentGridProps {
  variant?: 'grid' | 'masonry' | 'list' | 'carousel'
  items: Array<{
    title: string; description?: string; image?: string
    icon?: string; badge?: string; href?: string; metadata?: Record<string, string>
  }>
  columns?: 2 | 3 | 4
  cardStyle?: 'minimal' | 'standard' | 'detailed' | 'horizontal' | 'icon-card'
  imageShape?: 'square' | 'rounded' | 'circle' | 'none'
  showFilters?: boolean
  filterKey?: string
}
```

### 2.2 FAQ Consolidation (4 → 2)

| Current | Action | Reason |
|---------|--------|--------|
| `faq` | KEEP | Standard accordion, most used |
| `faq-categorized` | MERGE into faq as variant | `faq` variants: ['accordion', 'categorized'] |
| `faq-chatbot` | REMOVE | AI chatbot not production-ready |
| `enhanced-faq` | REMOVE | Egg-farm specific, merge into faq variant='searchable' |

### 2.3 Menu/Food Consolidation (7 → 3)

Keep: `menu-categorized-priced`, `pricing-table`, `features`
Remove: `sake-menu`, `omakase`, `conveyor-belt`, `conveyor-belt-strip`, `color-coded-menu`, `sushi-menu-sections`
Strategy: All removed sections redirect via aliases to `menu-categorized-priced` or `features`.

### 2.4 Pricing Consolidation (5 → 2)

Keep: `pricing-table` (with variants 'default', 'tiered', 'membership')
Keep: `subscription` (different UX, checkout flow)
Remove via alias: `pricing-range` → `pricing-table`, `packages-giftcards` → `pricing-table`, `membership-plans` → `pricing-table`

---

## Phase 3: Section-Level Configuration System

### 3.1 Extended Page JSON

Current:
```json
{ "id": "hero", "variant": "image", "content": "home.hero" }
```

Proposed:
```json
{
  "id": "hero", "variant": "image", "content": "home.hero",
  "styling": {
    "padding": "lg",
    "background": "dark",
    "backgroundImage": "/images/hero-bg.jpg",
    "maxWidth": "wide",
    "animation": "fade-up",
    "textColor": "light"
  },
  "visibility": {
    "desktop": true,
    "mobile": false
  }
}
```

### 3.2 Styling Options

```typescript
interface SectionStyling {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  background?: 'default' | 'alt' | 'accent' | 'dark' | 'image' | 'gradient' | 'transparent'
  backgroundImage?: string
  backgroundOverlay?: boolean
  maxWidth?: 'narrow' | 'default' | 'wide' | 'full'
  animation?: 'none' | 'fade' | 'slide-up' | 'slide-left' | 'stagger' | 'zoom'
  textAlign?: 'left' | 'center' | 'right'
  textColor?: 'default' | 'light' | 'dark' | 'accent'
}
```

### 3.3 Auto-Generated Renderer

Replace manual SECTION_COMPONENTS maps in two renderer files with auto-generated code:

```typescript
// Auto-generated from section-registry.ts by npm run generate:renderer
// Scans /components/sections/ and registry to produce:
export const SECTION_COMPONENTS: Record<string, ComponentType> = {
  'hero': HeroSection,
  'gallery': GallerySection,
  // ... all others auto-mapped
}
```

This removes:
- 175 lines of manual imports in `renderer.tsx`
- 187 lines in `site-renderer.tsx`
- Bug-prone manual sync between registry and renderer

---

## Phase 4: New Sections to Build

| Priority | Section | Why | Effort |
|----------|---------|-----|--------|
| 🔴 P0 | `stats-counter` | Needed for law firm, agency sites. Currently broken. | 1h |
| 🔴 P0 | `logo-strip` | Client logos = trust. Every site needs this. | 1h |
| 🔴 P0 | `video-embed` | In allowedSections but broken. Band/portfolio sites need it. | 1h |
| 🟡 P1 | `team-detailed` | Attorney profiles with photos, credentials, bio | 2h |
| 🟡 P1 | `case-studies-card` | Results showcase with metrics (Gross Brown style) | 2h |
| 🟡 P1 | `hero-video` | Hero with background video (2026 trend) | 3h |
| 🟢 P2 | `contact-map` | Contact + Google Maps embed | 1h |
| 🟢 P2 | `site-search` | Search within site for large firms | 3h |
| 🟢 P2 | `scroll-to-top` | Floating scroll-to-top button | 0.5h |
| 🟢 P3 | `live-chat-widget` | WhatsApp live chat (not just float button) | 2h |
| 🟢 P3 | `dark-mode-toggle` | Dark/light theme switch | 1h |

---

## Phase 5: Section Variant Expansion

| Section | Current Variants | Add |
|---------|-----------------|-----|
| `hero` | image, split, minimal | **video**, **parallax** |
| `team` | cards, list | **grid-photos** (large photo overlay) |
| `contact` | split, form-only | **map** (Google Maps embed) |
| `testimonials` | carousel, grid | **video-testimonial**, **stats** |
| `header` | standard | **transparent**, **sticky** |
| `footer` | standard, minimal | **multi-column**, **newsletter** |

---

## Phase 6: Tooling & DX Improvements

| Tool | What | Why |
|------|------|-----|
| `npm run validate:content` | Validates all content refs resolve | Catches broken references before deploy |
| `npm run preview:section <slug> <sectionId>` | Renders single section in isolation | Test section variants without full site build |
| `/admin/sections` | Visual catalog of all sections + variants | Foundation for drag-and-drop builder |
| `npm run generate:renderer` | Auto-generates the renderer maps | Eliminates manual renderer edits |

---

## Implementation Order (Recommended Sprints)

```
Sprint 1 (NOW):  Add stats-counter, logo-strip, video-embed to registry + components
                 + Remove faq-chatbot via alias
                 
Sprint 2:         ContentGrid unification (replace 8 components)
                 + FAQ consolidation (4→2)

Sprint 3:         Section styling config → compose-site.ts
                 + Auto-generated renderer script
                 
Sprint 4:         New sections: team-detailed, hero-video, 
                 contact-map, case-studies-card
                 
Sprint 5:         Pricing consolidation (5→2)
                 + Menu consolidation (7→3)
                 + Content validation script
                 
Sprint 6:         Admin section catalog
                 + Section preview tool
                 + Hero variant expansion
```

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Total sections | ~98 | ~50 (48% reduction) |
| Renderer lines | 362 (2 files) | 0 (auto-generated) |
| Section reg lines | 638 | ~400 (with alias cleanup) |
| Common patterns duplicated | 8 (grid-like) | 1 (ContentGrid) |
| Broken sections (allowed but not registered) | 3 | 0 |
| Missing trust signals (stats, logos) | 0 | 2 |
| Section styling config | ❌ | ✅ |
| Content validation | ❌ | ✅ |
| Renderer auto-generation | ❌ | ✅ |
