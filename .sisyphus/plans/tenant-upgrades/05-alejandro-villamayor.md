# Tenant Upgrade: alejandro-villamayor

## Current Problems
1. **`inversionista` (ES) and `investor-pass` (EN) are duplicate pages** — same content, different languages, separate pages. Should be one locale-aware page.
2. **No custom domain** — `alejandrovillamayor.com` should be configured.
3. **`sobre-mi` page has only 3 sections** — thin content.
4. **FAQ and contacto pages missing chrome** — no footer, no whatsapp-float.

## Changes

### File: `sites/alejandro-villamayor/site.json`
Add domain:
```json
"domain": "alejandrovillamayor.com"
```

### File: `sites/alejandro-villamayor/pages/inversionista.json`  
Add chrome sections (footer, whatsapp-float) to match other pages.

### File: `sites/alejandro-villamayor/pages/investor-pass.json`
Same — add chrome sections.

### File: `sites/alejandro-villamayor/pages/faq.json`
Add footer + whatsapp-float.

### File: `sites/alejandro-villamayor/pages/contacto.json`
Add footer + whatsapp-float.

## Verification
- [ ] investor-pass and inversionista pages have footer + whatsapp
- [ ] FAQ page has footer
- [ ] Contacto page has footer + whatsapp
- [ ] Build passes
