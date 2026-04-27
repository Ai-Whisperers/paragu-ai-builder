# Tenant Upgrade: granja-cabral

## Current Problems
1. **Single locale only** — ES only. Needs EN for international wholesale buyers.
2. **`productos` page uses `services` section instead of `product-catalog`** — inconsistent with feature config.
3. **`sostenibilidad` and `sobre-nosotros` both use `our-story`** — duplicate content.
4. **Blog has no posts** — recipes exist but blog page is empty.
5. **No delivery zones in EN** — delivery-calculator zones are Spanish-only.

## Changes

### File: `sites/granja-cabral/site.json`
Add EN locale:
```json
"locales": ["es", "en"]
```

### File: `sites/granja-cabral/pages/productos.json`
Replace `services` with `product-catalog`:
```json
{ "id": "product-catalog", "variant": "grid", "content": "home.products" }
```

### File: `sites/granja-cabral/content/en.json` (NEW)
Create EN content file with translated wholesale data, delivery zones, products.

### File: `sites/granja-cabral/content/es.json`
Add blog posts, expand recipes content.

## Verification
- [ ] EN locale loads for granja-cabral
- [ ] productos page shows product catalog, not services
- [ ] Build passes
