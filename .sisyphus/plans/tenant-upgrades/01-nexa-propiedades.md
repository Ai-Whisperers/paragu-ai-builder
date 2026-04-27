# Tenant Upgrade: nexa-propiedades

## Current Problems
1. **Duplicate cta-banner on propiedades page** — `propiedades.json` has TWO cta-banner sections (line 18 and line 23). The first one points to `servicesPage.cta` (wrong content ref).
2. **No property-listings section** — `propertySearch` feature is enabled but the page uses cta-banner instead of `property-listings` section.
3. **Content too thin** — only 8KB per locale, 2 sample properties.
4. **Homepage only 4 sections** — needs more content to be engaging.

## Changes

### File: `sites/nexa-propiedades/pages/propiedades.json`
Replace duplicate cta-banner with proper property-listings:

```json
{
  "slug": "propiedades",
  "titleKey": "propertiesPage.seo.title",
  "descriptionKey": "propertiesPage.seo.description",
  "schemaType": "RealEstateAgent",
  "sections": [
    { "id": "header", "variant": "standard", "content": "navigation" },
    { "id": "hero", "variant": "minimal", "content": "propertiesPage.hero" },
    { "id": "property-listings", "variant": "grid", "content": "propertiesPage.listings" },
    { "id": "cta-banner", "variant": "gradient", "content": "propertiesPage.cta" },
    { "id": "footer", "variant": "standard", "content": "footer" },
    { "id": "whatsapp-float", "variant": "standard", "content": "whatsapp" }
  ]
}
```

### File: `sites/nexa-propiedades/content/es.json`
Expand propertiesPage.listings to include more properties and add search/filter data.
Add `property-listings` section data structure that the component expects.

### File: `sites/nexa-propiedades/content/en.json` (same structure)
### File: `sites/nexa-propiedades/content/pt.json` (same structure)

## Verification
- [ ] propiedades page shows property grid, not duplicated banner
- [ ] All 3 locales show properties
- [ ] Build passes
