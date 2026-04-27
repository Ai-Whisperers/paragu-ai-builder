# Section Styling System

> Every section in a page JSON can now specify per-instance styling and layout options.
> The system is backward-compatible — existing pages without styling config work the same.

---

## How It Works

Each section in a page JSON supports an optional `styling` object:

```json
{
  "id": "services",
  "variant": "cards",
  "content": "home.services",
  "styling": {
    "padding": "lg",
    "background": "alt",
    "maxWidth": "default",
    "animation": "fade",
    "textAlign": "center",
    "textColor": "default"
  }
}
```

The renderer wraps every section in `<SectionWrapper>` which applies the tailwind classes automatically.

---

## Styling Options

### `padding` — Section vertical spacing

| Value | Tailwind | When to use |
|-------|----------|-------------|
| `none` | `py-0` | No padding, content touches edges |
| `sm` | `py-8 sm:py-12` | Tight spacing, compact sections |
| `md` | `py-12 sm:py-16` | Default — most sections |
| `lg` | `py-16 sm:py-20` | Spacious — hero, banners, CTAs |
| `xl` | `py-20 sm:py-28 lg:py-32` | Very spacious — landing pages |

### `background` — Section background color

| Value | Tailwind | When to use |
|-------|----------|-------------|
| `default` | `bg-[var(--background)]` | Main site background (most sections) |
| `alt` | `bg-[var(--surface)]` | Alternating section — creates visual rhythm |
| `accent` | `bg-[var(--primary)]` | Highlight section — CTAs, important info |
| `dark` | `bg-neutral-900` | Dark section for contrast |
| `image` | Custom | Requires `backgroundImage` URL |
| `gradient` | `bg-gradient-to-br from-primary to-secondary` | Premium/dramatic sections |
| `transparent` | `bg-transparent` | Overlay sections, hero backgrounds |

### `maxWidth` — Inner content width

| Value | Tailwind | When to use |
|-------|----------|-------------|
| `narrow` | `max-w-3xl` | Text-heavy content (blog, about) |
| `default` | `max-w-6xl` | Most sections |
| `wide` | `max-w-7xl` | Galleries, grids, large layouts |
| `full` | `max-w-full` | Edge-to-edge (hero, map) |

### `backgroundImage` — Full section background image

When set, the image is applied as a CSS `background-image` on the section element.
Combine with `backgroundOverlay: true` for readability.

```json
"styling": {
  "background": "image",
  "backgroundImage": "https://images.unsplash.com/photo-xxx?w=1920",
  "backgroundOverlay": true
}
```

### `textAlign` — Content text alignment

| Value | Effect |
|-------|--------|
| `left` | (Default) |
| `center` | Centered text |
| `right` | Right-aligned |

### `textColor` — Section text color

| Value | Effect |
|-------|--------|
| `default` | (Default) |
| `light` | White text (for dark backgrounds) |
| `dark` | Dark text (for light backgrounds) |
| `accent` | Primary color text |

### `animation` — Scroll-triggered animation

| Value | Effect |
|-------|--------|
| `none` | No animation |
| `fade` | Fade in on scroll |
| `slide-up` | Slide up + fade |
| `stagger` | Stagger children |
| `zoom` | Zoom in |

### `divider` — Section separator

| Value | Effect |
|-------|--------|
| `none` | No divider |
| `top` | Border top |
| `bottom` | Border bottom |
| `both` | Top + bottom borders |

---

## Best Practices

### Alternating backgrounds
The most common pattern: alternate `default` and `alt` backgrounds to create visual rhythm:

```json
[
  { "id": "hero",  "styling": { "padding": "xl", "background": "dark" } },
  { "id": "services", "styling": { "background": "alt" } },
  { "id": "process", "styling": { "background": "default" } },
  { "id": "team",  "styling": { "background": "alt" } },
  { "id": "cta-banner", "styling": { "padding": "lg", "background": "accent" } }
]
```

### Dark sections with light text
```json
"styling": { "background": "dark", "textColor": "light", "padding": "lg" }
```

### Image background hero
```json
"styling": {
  "padding": "xl",
  "backgroundImage": "/images/hero-bg.jpg",
  "textColor": "light",
  "textAlign": "center"
}
```

---

## SectionWrapper Component

For new sections, import and use `SectionWrapper` directly:

```tsx
import { SectionWrapper } from '@/components/ui/section-wrapper'
import { Container } from '@/components/ui/container'

export function MyNewSection({ title, __styling }: { title: string; __styling?: any }) {
  return (
    <SectionWrapper styling={__styling || { padding: 'lg', background: 'alt' }}>
      <Container size="lg">
        <h2>{title}</h2>
      </Container>
    </SectionWrapper>
  )
}
```

The `__styling` prop is automatically injected by the renderer from the page JSON.
