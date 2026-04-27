# Tenant Upgrade: superspuma

## Current Problems
1. **NONE features configured** — `features: NONE` in site.json. Many site features are undefined.
2. **`garantia` page has duplicate `programs-comparison` sections** — two identical entries.
3. **`guias` and `guia-compra` overlap heavily** — nearly duplicate content.
4. **`faq`, `privacidad`, `terminos` have only 2 sections each** — very thin.
5. **`promo-cartagena` is an abandoned campaign** — hero + lead-form only.
6. **No custom domain configured.**

## Changes

### File: `sites/superspuma/site.json`
Add minimal features:
```json
"features": {
  "whatsappFloat": { "enabled": true },
  "productCatalog": { "enabled": true },
  "testimonials": { "enabled": true },
  "ageGate": { "enabled": false }
}
```

### File: `sites/superspuma/pages/garantia.json`
Remove 1 duplicate `programs-comparison` entry.

### File: `sites/superspuma/pages/privacidad.json`
Add footer + whatsapp-float.

### File: `sites/superspuma/pages/terminos.json`
Add footer + whatsapp-float.

## Verification
- [ ] Features load without errors
- [ ] garantia page has 1 programs-comparison (not 2)
- [ ] privacidad + terminos pages have footer + whatsapp
- [ ] Build passes
