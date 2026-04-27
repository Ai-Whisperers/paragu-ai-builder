# Tenant Upgrade: dayah-litworks

## Current Problems
1. **`sobre` page has duplicate `features` sections** — lines 5-6 in sobre.json both point to features.
2. **`privacidad` and `terminos` pages missing footer + whatsapp-float** — they render hero + faq only, then nothing.

## Changes

### File: `sites/dayah-litworks/pages/sobre.json`
Remove 1 of the 2 duplicate features entries. Replace with process section.

### File: `sites/dayah-litworks/pages/privacidad.json`
Add footer + whatsapp-float to chrome.

### File: `sites/dayah-litworks/pages/terminos.json`
Add footer + whatsapp-float to chrome.

## Verification
- [ ] sobre page has 1 features section (not 2)
- [ ] privacidad + terminos pages have footer + whatsapp
- [ ] Build passes
