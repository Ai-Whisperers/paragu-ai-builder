# Composition pipeline

## The problem

Generate a marketing site for any tenant from JSON configuration — no per-tenant code, no per-tenant components. The engine must merge vertical-level defaults (which sections to use, SEO presets) with tenant-level overrides (brand name, services, images) and produce HTML that looks hand-built.

## The pipeline

```
sites/<slug>/site.json        ────┐
sites/<slug>/pages/*.json     ────┤
sites/<slug>/content/*.json   ────┤
sites/<slug>/tokens.json      ────┤
                                  │
src/registry/<type>.type.json ────┼──► compose-site.ts ──► page tree ──► React SSR ──► HTML
src/content/<type>.content.json ──┤           │
src/tokens/<type>.tokens.json ────┤           │
                                  │           └──► section-builders.ts per section
src/schemas/*.json            ────┘                        │
                                                           └──► resolve-copy.ts
                                                                  │
                                                                  └──► placeholder fill + $ref
```

Two composition patterns coexist:

| Pattern | Entry point | Route shape | Used by |
|---|---|---|---|
| **Flat** | [`web/lib/engine/compose.ts`](../../web/lib/engine/compose.ts) | `/[business]/*` | Demo fixtures, Paraguay SMB tenants |
| **Vertical** | [`web/lib/engine/compose-site.ts`](../../web/lib/engine/compose-site.ts) | `/s/[locale]/[site]/*` | Real tenants with per-locale pages (Nexa group) |

Both share [`section-builders.ts`](../../web/lib/engine/section-builders.ts) — one builder per section type, dispatched by name.

## Why two patterns?

The flat pattern came first (single-locale Paraguay clients). Vertical arrived when Nexa Paraguay needed 4 locales × 9 pages and a pattern that scaled by "copy the folder and rename the slug" (hence the `nexa-uruguay` reproducibility spike). Both still serve live tenants — retiring flat would break the demo fixtures today.

## Resolve-copy: the placeholder layer

Content files use `{{placeholders}}` that get filled from the tenant's content JSON at render time. Dotted-path lookup + `$ref` support let one template serve many tenants:

```json
// src/content/peluqueria.content.json
{ "hero": { "title": "{{businessName}} — {{tagline}}" } }

// sites/salon-maria/content/es.json
{ "businessName": "Salón María", "tagline": "Belleza cerca de vos" }
```

See [`web/lib/engine/resolve-copy.ts`](../../web/lib/engine/resolve-copy.ts).

## Where to look

- System tour: [/ARCHITECTURE.md](../../ARCHITECTURE.md)
- All available sections: [reference/SECTIONS.md](../reference/SECTIONS.md)
- Business types + their section lineups: [reference/BUSINESS_TYPES.md](../reference/BUSINESS_TYPES.md)
- Adding a business type: [/web/docs/ADDING_BUSINESS_TYPES.md](../../web/docs/ADDING_BUSINESS_TYPES.md)
