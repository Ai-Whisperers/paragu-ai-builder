# Theming

## The problem

One set of section components renders every tenant's site. A spa should look calming; a gym should look energetic; a tattoo shop should look edgy. Hardcoded `bg-blue-500` classes would lock every tenant into the same palette — so brand colours, typography, and spacing all have to be *per-tenant runtime values*, not compile-time class names.

## The decision: CSS variables + token merging

Tokens are the source of truth. Components read `var(--primary)`. A small resolver merges base tokens with vertical tokens with tenant tokens, injects them as CSS custom properties at the top of every page, and components just work.

```
src/tokens/base.tokens.json      (shared design system — spacing, radius, shadows)
       +
src/tokens/<type>.tokens.json    (vertical overrides — spa pastels, gym neons)
       +
sites/<slug>/tokens.json         (tenant brand overrides)
       │
       └──► web/lib/tokens/resolver.ts merges in that order
                │
                └──► injected as CSS custom properties on :root
                            │
                            └──► components use var(--primary) etc.
```

## Why not Tailwind theme config?

Tailwind's `theme.colors` is compile-time. That means either (a) every tenant has its own bundle (explodes build time + caching), or (b) every tenant shares one palette (impossible).

Tailwind arbitrary values — `bg-[var(--primary)]` — let us keep the Tailwind DX (`p-4 rounded-xl flex items-center`) while making colour, font-family, and a handful of other brand dimensions per-tenant runtime.

## The invariant

Raw Tailwind palette colours (`bg-green-*`, `text-red-*`) and raw hex (`#3b82f6`) are **banned** in section components and landing components. ESLint enforces it at error level. Semantic CSS variables (`var(--primary)`, `var(--color-success)`) are the only allowed form.

See [`/ARCHITECTURE.md` § architectural invariants](../../ARCHITECTURE.md#5-architectural-invariants).

## Where to look

- Token reference: [reference/TOKENS.md](../reference/TOKENS.md)
- Token files live in `src/tokens/` (31 files — 1 base + 30 verticals)
- Resolver: [`web/lib/tokens/resolver.ts`](../../web/lib/tokens/resolver.ts)
- Per-tenant overrides: `sites/<slug>/tokens.json`
