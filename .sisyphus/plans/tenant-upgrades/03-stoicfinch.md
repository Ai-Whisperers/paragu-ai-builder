# Tenant Upgrade: stoicfinch

## Current Problems
1. **33 pages — many are thin stubs** — Edmonton and Vancouver location pages have only 3 sections.
2. **Industry pages are nearly identical** — copy-paste template duplication.
3. **`cookies` page uses hero + faq** — no Cookie consent info.
4. **`founder` page is hero + features only** — needs real founder story.

## Changes

### File: `sites/stoicfinch/pages/location-edmonton.json` and `location-vancouver.json`
Flesh out to match location-calgary pattern (5 sections):
Add `features`, `contact` sections.

### File: `sites/stoicfinch/content/en.json`
Add location-specific content for Edmonton and Vancouver:
- Local context (why this city)
- Contact info for each location
- Available services in that region

## Verification
- [ ] Edmonton and Vancouver pages have proper content
- [ ] No 3-section stub pages remain
- [ ] Build passes
