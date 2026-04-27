# Tenant Upgrade: fun4me

## Current Problems
1. **`legal` page has 4 duplicate `faq` sections** — lines like `{ "id": "faq", ... }` repeated 4 times. Only 1 needed.
2. **9 separate locale files** — `bundles.json`, `checkout.json`, `es.json`, `gift-cards.json`, `loyalty.json`, `referral.json`, `reviews.json`, `size-guides.json`, `subscriptions.json`. These should be consolidated into `es.json`.
3. **19 features enabled** — too many for a focused store. Consider trimming.
4. **Every page has 5 boilerplate chrome sections** — age-gate, header, footer, compliance-disclaimer, whatsapp-float. That's 42% of each page before any content.
5. **`blog` page lists `services` twice** — duplicate section.

## Changes

### File: `sites/fun4me/pages/legal.json`
Remove 3 of the 4 duplicate FAQ sections. Keep 1 FAQ section.

### File: `sites/fun4me/pages/blog.json`
Remove duplicate `services` entry. Keep 1.

### File: `sites/fun4me/pages/bundles.json`
Remove duplicate `services` entry. Keep 1.

## Verification
- [ ] legal page has 1 FAQ section (not 4)
- [ ] blog page has 1 services section (not 2)
- [ ] bundles page has 1 hero section + 1 services section
- [ ] Build passes
