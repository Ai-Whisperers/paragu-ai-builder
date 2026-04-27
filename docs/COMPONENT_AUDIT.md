# ParaguAI Builder — Section Component Audit

> Full audit of all 98+ section components. Analysis of variants, gaps, and abstraction opportunities.
> Generated: 2026-04-26

---

## 1. Current State Overview

| Category | Count | Assessment |
|----------|-------|------------|
| **Hero & Header** | 2 | ✅ Good but missing variants |
| **Content / Marketing** | 15+ | ⚠️ Fragmented — many similar components |
| **Commerce** | 7 | ✅ Solid, well-differentiated |
| **Forms & Leads** | 8 | ✅ Good, covers all needs |
| **Social Proof** | 6 | ⚠️ Overlapping `reviews`/`testimonials`/`google-reviews` |
| **Calculators** | 12 | ✅ Excellent coverage for PY tax system |
| **Media & Gallery** | 6 | ⚠️ Too many gallery variants (3 gallery components) |
| **Legal / Compliance** | 3 | ✅ Good for regulated industries |
| **Specialty (food, music, etc.)** | 20+ | ❌ Poorly organized, industry-specific mix |
| **Navigation / Utilities** | 2 | ⚠️ Missing: scroll-to-top, quick-nav, chatbot |
| **TOTAL** | **~98** | |

## 2. Critical Issues

### 2.1 Component Bloat — 3+ Ways to Do the Same Thing

| Function | Components | Problem |
|----------|-----------|---------|
| Gallery | `gallery`, `photo-gallery`, `portfolio`, `before-after`, `before-after-split` | 5 components for "show images" |
| Reviews | `testimonials`, `google-reviews`, `google-reviews-widget`, `reviews`, `testimonial-video`, `success-stories` | 6 components for "show what people say" |
| FAQ | `faq`, `faq-categorized`, `faq-chatbot`, `enhanced-faq` | 4 components for questions/answers |
| Menu/Food | `menu-categorized-priced`, `color-coded-menu`, `sake-menu`, `conveyor-belt`, `conveyor-belt-strip`, `omakase`, `sushi-menu-sections` | 7 components for restaurant menus |
| Blog | `blog`, `blog-index`, `blog-post`, `blog-social-share`, `related-posts` | 5 components for blog |
| Pricing | `pricing-table`, `pricing-range`, `packages-giftcards`, `subscription`, `membership-plans` | 5 components for "show prices" |
| Process | `process`, `process-timeline`, `programs-comparison`, `how-it-works` (alias) | 4 for showing steps |
| Services | `services`, `features`, `service-menu` (alias) | 3 overlapping |

### 2.2 Missing Core Sections

| Missing | Why It Matters |
|---------|---------------|
| **Stats Counter** | It's in some verticals' allowedSections but NOT in the registry. Every law firm/agency site needs this. |
| **Logo Strip** | In allowedSections but not in registry. Client logos are critical trust signals. |
| **Team Grid** | There's no standalone team section. `team` exists but only has `cards`/`list` variants. |
| **Video Embed** | In allowedSections but NOT in registry. No component to embed YouTube/Vimeo. |
| **Contact Map** | `contact` has split/form-only but no Google Maps embed variant. |
| **Breadcrumbs** | Used by blog but not available as a standalone section. |

### 2.3 Variant Gaps

| Section | Has | Missing |
|---------|-----|---------|
| `hero` | image, split, minimal | **video hero**, **parallax**, **animated** |
| `team` | cards, list | **grid with photos**, **carousel**, **detailed profile cards** |
| `contact` | split, form-only | **map + form**, **simple contact strip** |
| `testimonials` | carousel, grid | **video testimonials**, **case study cards** |
| `header` | standard | **sticky header**, **transparent overlay**, **hamburger-mobile** |
| `footer` | standard, minimal | **multi-column with social**, **newsletter in footer** |

## 3. Abstraction Opportunities

### 3.1 Create a Unified "Content Grid" Component

Replace: `gallery`, `photo-gallery`, `portfolio`, `features`, `services`, `branches`, `team`, `case-studies`

**Proposed unified component:**
```
<ContentGrid
  variant: 'cards' | 'grid' | 'masonry' | 'list' | 'carousel' | 'detailed'
  items: Array<{ image, title, description, link, badge, metadata }>
  columns: 2 | 3 | 4
  cardStyle: 'minimal' | 'standard' | 'detailed' | 'horizontal'
/>
```

**What it solves:** 8 different components doing the same thing with slightly different props.

### 3.2 Create a Unified "Hero" with 5 Variants

Currently `hero` has 3 variants. Extend to:
- `image` — current, background image with text overlay
- `split` — current, image + text side by side
- `minimal` — current, simple text
- **`video`** — background video with overlay
- **`search`** — hero with embedded search bar (for directories/large sites)
- **`parallax`** — scrolling parallax effect

### 3.3 Create a Unified "CTA Banner" with Color System

Current `cta-banner` has `gradient` and `solid`. Should be:
- Configurable gradient (primary→secondary, brand colors)
- Configurable solid color
- Configurable image background
- Variants: `centered`, `split`, `minimal`

### 3.4 Abstract the Section System — Meta-Config

Each section should expose a **standard props pattern**:

```typescript
interface SectionConfig {
  id: string
  variant: string
  content: string  // content key reference
  overrides?: Record<string, any>  // override specific fields
  // NEW:
  styling?: {
    padding?: 'none' | 'sm' | 'md' | 'lg'
    background?: 'default' | 'alt' | 'accent' | 'dark' | 'image' | 'custom'
    backgroundImage?: string
    maxWidth?: 'narrow' | 'default' | 'wide' | 'full'
    animation?: 'none' | 'fade' | 'slide-up' | 'stagger'
  }
  visibility?: {
    desktop?: boolean
    mobile?: boolean
    loggedIn?: boolean
    afterDate?: string
    beforeDate?: string
  }
}
```

## 4. Recommended Consolidation Plan

### Phase 1 (Immediate — 1 session)
| Action | Components | Impact |
|--------|-----------|--------|
| Add `stats-counter` to registry | — | Enable stat counters for all sites |
| Add `logo-strip` to registry | — | Enable client logos for all sites |
| Add `video-embed` to registry | — | Enable YouTube/Vimeo embeds |
| Merge `photo-gallery` → alias to `gallery` | 2→1 | Reduce bloat |
| Merge `before-after-split` → alias to `before-after` | 2→1 | Reduce bloat |

### Phase 2 (Within sprint)
| Action | Components | Impact |
|--------|-----------|--------|
| Create unified `<ContentGrid>` | 8→1 | Massive simplification |
| Refactor hero variants | 3→5 | More design options |
| Add section styling config | — | Per-section customization |
| Merge FAQ components | 4→2 | Less confusion |
| Merge pricing components | 5→2 | Less confusion |

### Phase 3 (Strategic)
| Action | Impact |
|--------|--------|
| Visual editor for sections | Drag & drop section builder |
| Section preview mode | See all variants before choosing |
| Component documentation auto-gen | Self-documenting system |
| A/B testing per variant | Data-driven design decisions |

## 5. Gap Analysis — Features Competitors Have We Don't

| Feature | Competitor(s) | Our Status |
|---------|---------------|------------|
| Scroll-triggered animations | All top firm sites | ❌ Not configurable |
| Attorney profiles with photos | Every wire firm | ⚠️ Basic team section only |
| Results/case studies | Gross Brown, Vouga | ⚠️ Via features section |
| Blog with real articles | Berkemeyer (weekly) | ✅ Just added for AV site |
| Podcast/video content | Mersanlaw | ❌ No audio/video sections |
| Newsletter signup | Berkemeyer | ✅ newsletter-signup exists |
| Interactive timelines | Irun Villamayor | ⚠️ process-timeline exists |
| Multi-language RTL | None needed (ES/EN) | ✅ Handled |
| Cookie consent | EU requirement | ✅ Cookie-banner exists |
| Live chat | Modern firms | ❌ Not available |
| Dark mode toggle | Niche | ❌ Not available |
| Search within site | Large firms | ❌ Not available |
