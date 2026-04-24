# Landing Reference

> Landing page generation: how tenant websites are composed and rendered.

## Architecture

```
Tenant config (JSON) + Content templates + Section registry → Composed page → Static/Edge HTML
```

## Generation Pipeline

### 1. Tenant Config (`sites/<slug>/site.json`)
Defines: hostname, locales, features, integrations, page structure.

### 2. Content Templates (`sites/<slug>/content/<locale>.json`)
Per-locale copy with `{{placeholders}}` for business-specific values.

### 3. Section Registry (`web/lib/engine/section-registry.ts`)
Maps section IDs → component variants. 108 registered sections total.

### 4. Composition Engine (`web/lib/engine/compose.ts`)
- Reads tenant config
- Resolves section IDs (including aliases)
- Renders sections in order with content
- Applies theme tokens (CSS variables)

## Routes

- **`/s/[locale]/[siteSlug]`** - Modern locale-prefixed route
- **`/[business]/`** - Legacy flat pattern (maintained for existing links)
- **`/admin/preview`** - Admin preview of generated site

## Content Placeholders

`{{businessName}}`, `{{city}}`, `{{neighborhood}}`, `{{phone}}`, `{{whatsapp}}`
Replaced at render time from tenant config.

## Design Tokens

- `src/tokens/base.tokens.json` - Universal design tokens
- `src/tokens/<vertical>.tokens.json` - Vertical-specific overrides
- `sites/<slug>/tokens.json` - Tenant-specific brand overrides

Tokens are CSS variables: `--primary`, `--background`, `--font-family`, etc.
See [TENANTS.md](./TENANTS.md) for URL contract.

---

_Last updated: April 24, 2026_
