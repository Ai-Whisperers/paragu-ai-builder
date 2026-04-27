# Tenant Upgrade Plan — Executive Summary

13 tenants evaluated. 3 critical, 4 high, 5 medium priority items identified.

## Priority Matrix

| Priority | Tenant | Issue | Effort | Risk |
|---|---|---|---|---|
| 🔴 CRITICAL | nexa-propiedades | Property page broken: duplicate cta-banner, no property-listings, 8KB thin content | 1h | Low |
| 🔴 CRITICAL | nudo | `letras` page empty (hero only), `shows` has no dates, no ticket integration | 30min | Low |
| 🔴 CRITICAL | stoicfinch | Edmonton+Vancouver location pages are 3-section stubs; 33 pages with massive duplication | 2h | Low |
| 🔴 CRITICAL | fun4me | `legal` page has 4 duplicate FAQ sections; 9 separate locale files should be 1 | 30min | Low |
| 🔴 CRITICAL | alejandro-villamayor | `inversionista` + `investor-pass` duplicate content; no custom domain | 1h | Low |
| 🟡 HIGH | granja-cabral | EN locale needed for wholesale; productos uses wrong section type; blog empty | 2h | Low |
| 🟡 HIGH | dayah-litworks | Sobre page has duplicate features sections; privacy/terms missing footer | 30min | Low |
| 🟡 HIGH | de-abasto-a-casa | Only 2 pages, 8KB content — needs blog, FAQ, menu page | 2h | Low |
| 🟡 HIGH | superspuma | NONE features configured; duplicate sections; promo-cartagena abandoned | 1h | Low |
| 🟢 MEDIUM | bufete-mendez | Single locale; no domain; `terminos` uses wrong section type | 30min | Low |
| 🟢 MEDIUM | nudo | Music/videos pages overlap; no show dates/calendar | 1h | Low |
| 🟢 MEDIUM | demo tenants | Mark as demo clearly or clean up placeholder content | 30min | Low |
| 🟢 MEDIUM | nexa-paraguay | 21 pages consolidate; privacidad has wrong section type | 2h | Low |
| 🟢 MEDIUM | fun4me | 19 features overwhelming; home page 16 sections too long | 1h | Medium |

## Implementation Waves

### Wave 1 — Critical Fixes (4h)
Files: page.json configs, site.json configs, content JSONs
1. nexa-propiedades: fix propiedades page, add content
2. fun4me: fix legal page, consolidate locale files
3. alejandro-villamayor: merge inversionista/investor-pass
4. nudo: fix empty pages
5. stoicfinch: fix thin location pages

### Wave 2 — High Impact (5h)
6. granja-cabral: add EN locale, fix productos section
7. dayah-litworks: fix sobre page
8. de-abasto-a-casa: add pages and content
9. superspuma: configure features + deduplicate

### Wave 3 — Polish (3h)
10. bufete-mendez: add EN locale, add domain config
11. nudo: event integration
12. demo tenant cleanup
13. nexa-paraguay page consolidation
14. fun4me feature cleanup

## Files to Touch Estimate
- ~40 page.json files
- ~15 content JSON files
- ~13 site.json files
- No component code changes — all data-layer
