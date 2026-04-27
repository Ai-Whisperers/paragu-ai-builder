# Tenant Upgrade: de-abasto-a-casa

## Current Problems
1. **Only 2 pages** (home + contacto) — missing: FAQ, about, blog, menu/precios.
2. **Only 8KB content** — extremely thin. No product descriptions, pricing, delivery info.
3. **No services configured** — food-beverage vertical should have product catalog.

## Changes

### File: `sites/de-abasto-a-casa/pages/faq.json` (NEW)
Simple FAQ page:
```json
{
  "slug": "faq",
  "titleKey": "faqPage.seo.title",
  "descriptionKey": "faqPage.seo.description",
  "sections": [
    { "id": "header", "variant": "standard", "content": "navigation" },
    { "id": "hero", "variant": "minimal", "content": "faqPage.hero" },
    { "id": "faq", "variant": "simple", "content": "faqPage.faq" },
    { "id": "footer", "variant": "standard", "content": "footer" },
    { "id": "whatsapp-float", "variant": "standard", "content": "whatsapp" }
  ]
}
```

### File: `sites/de-abasto-a-casa/pages/productos.json` (NEW)
Product page for menu/precios.

### File: `sites/de-abasto-a-casa/site.json`
Add FAQ to navigation.

### File: `sites/de-abasto-a-casa/content/es.json`
Expand with FAQ data, product catalog items (weekly menu with prices).

## Verification
- [ ] FAQ page renders
- [ ] Navigation includes FAQ link
- [ ] Build passes
