# Token System

Documentation of the design token system used in Paragu-AI Builder.

## Overview

The token system uses CSS custom properties (variables) to enable consistent theming across all business websites. This approach allows dynamic theme changes without modifying component code.

## Token Structure

Tokens are organized into categories and stored in JSON files:

```
src/tokens/
├── base.tokens.json          # Core design tokens
├── [type].tokens.json        # Business type specific tokens
└── overrides/                # Per-business overrides
```

## Base Tokens

### Colors

```json
{
  "colors": {
    "primary": "#2563eb",
    "primaryForeground": "#ffffff",
    "secondary": "#64748b",
    "secondaryForeground": "#ffffff",
    "background": "#ffffff",
    "surface": "#f8fafc",
    "surfaceLight": "#f1f5f9",
    "text": "#0f172a",
    "textLight": "#64748b",
    "textMuted": "#94a3b8",
    "border": "#e2e8f0",
    "success": "#22c55e",
    "warning": "#f59e0b",
    "error": "#ef4444"
  }
}
```

### Typography

```json
{
  "typography": {
    "fontHeading": "Inter",
    "fontBody": "Inter",
    "fontAccent": "Playfair Display"
  }
}
```

### Spacing

```json
{
  "spacing": {
    "xs": "0.25rem",
    "sm": "0.5rem",
    "md": "1rem",
    "lg": "1.5rem",
    "xl": "2rem",
    "2xl": "3rem",
    "3xl": "4rem"
  }
}
```

### Border Radius

```json
{
  "borderRadius": {
    "sm": "0.25rem",
    "md": "0.5rem",
    "lg": "0.75rem",
    "xl": "1rem",
    "2xl": "1.5rem",
    "full": "9999px"
  }
}
```

## Business Type Tokens

Each business type can have specific tokens:

### Example: Peluqueria (Hair Salon)

```json
{
  "id": "peluqueria",
  "extends": "base",
  "colors": {
    "primary": "#b76e79",
    "secondary": "#d4a574",
    "surfaceLight": "#faf5f0"
  },
  "typography": {
    "fontAccent": "Playfair Display"
  }
}
```

### Example: Gimnasio (Gym)

```json
{
  "id": "gimnasio",
  "extends": "base",
  "colors": {
    "primary": "#2d6a4f",
    "secondary": "#40916c",
    "surfaceLight": "#f0f7f4"
  },
  "typography": {
    "fontHeading": "Oswald",
    "fontBody": "Roboto"
  }
}
```

## Token Resolution

The token resolver (`lib/tokens/resolver.ts`) merges tokens in order:

1. Base tokens
2. Business type tokens
3. Per-business overrides

### Resolution Example

```typescript
import { resolveTokens } from '@/lib/tokens/resolver'

const tokens = resolveTokens('peluqueria')
// Returns merged tokens with peluqueria colors
```

## CSS Generation

Tokens are converted to CSS custom properties:

```css
:root {
  --primary: #b76e79;
  --primary-foreground: #ffffff;
  --secondary: #d4a574;
  /* ... */
  
  /* Typography */
  --font-heading: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
}
```

## Usage in Components

Components reference tokens via CSS variables:

```tsx
<button 
  className="bg-[var(--primary)] text-[var(--primary-foreground)]"
>
  Button Text
</button>
```

## Google Fonts Integration

The token system generates Google Fonts URLs:

```typescript
// Generated URL
https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;700&display=swap
```

## Dark Mode Support

Tokens support dark mode variants:

```json
{
  "theme": "light",
  "dark": {
    "colors": {
      "background": "#0f172a",
      "surface": "#1e293b",
      "text": "#f8fafc"
    }
  }
}
```

## Creating Custom Tokens

1. Create a new JSON file in `src/tokens/`
2. Define your color palette and typography
3. Reference in business type registry
4. Test with `npm run dev`

### Token Validation

Run the token validator:

```bash
npm run tokens:validate
```

This checks:
- All required tokens present
- Color values are valid hex codes
- Typography fonts are available on Google Fonts
- No duplicate token definitions

## Best Practices

1. **Always extend base tokens** - Don't create from scratch
2. **Use semantic names** - `primary`, not `blue`
3. **Test contrast** - Ensure accessibility compliance
4. **Limit custom fonts** - Stick to 2-3 font families
5. **Document changes** - Add comments for non-obvious choices
