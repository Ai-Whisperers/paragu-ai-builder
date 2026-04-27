# Site Upgrade Plan — All Sites to Client-Ready Level

## Current State Summary

| Site | Pages | Images | EN | Blog | Chrome | Overall Rating |
|------|-------|--------|----|------|--------|---------------|
| Alejandro Villamayor | 9 | 4 | ✅ | 2 posts | ✅ | 8/10 |
| Bufete Méndez | 8 | 3 | ❌ | ❌ | ✅ | 7/10 |
| Nüdo | 7 | 53 | ❌ | ❌ | ✅ | 8/10 |
| Demo Contador | 4 | 3 | ❌ | ❌ | ✅ | 5/10 |
| Demo Estudio Contable | 4 | 3 | ❌ | ❌ | ❌ | 6/10 |
| Nexa Paraguay | 21 | 282 | ✅ | 4 posts | ❌ | 9/10 |
| Nexa Propiedades | 5 | 14 | ✅ | ❌ | ❌ | 4/10 |
| Fun4Me | 11 | 0 | ❌ | 1 post | ❌ | 5/10 |
| Granja Cabral | 9 | 39 | ❌ | ❌ | ❌ | 6/10 |
| Dayah Litworks | 9 | 0 | ✅ | ❌ | ✅ | 7/10 |
| De Abasto a Casa | 1 | 0 | ❌ | ❌ | ❌ | 2/10 |
| SuperSpuma | 17 | 0 | ❌ | ❌ | ✅ | 6/10 |
| StoicFinch | 34 | 0 | ✅ | ❌ | ❌ | 7/10 |

---

## Critical Gaps (All Sites)

### 1. Missing Chrome Config (header/footer auto-injection)
Without chrome, each page must manually include header/footer sections. Sites missing it: **Nexa Paraguay, Nexa Propiedades, Fun4Me, Granja Cabral, De Abasto a Casa, StoicFinch, Demo Estudio Contable**

**Fix:** Add `chrome` block to `site.json`:
```json
"chrome": {
  "header": { "id": "header", "variant": "standard", "content": "navigation" },
  "footer": [
    { "id": "whatsapp-float", "variant": "standard", "content": "whatsapp" },
    { "id": "footer", "variant": "standard", "content": "footer" }
  ]
}
```

### 2. Missing OG Images & Favicons
Sites without brand images: **Nexa Propiedades, Fun4Me, Dayah Litworks, De Abasto a Casa, StoicFinch, SuperSpuma**

**Fix:** Auto-generate OG default, favicon, apple-touch-icon for each.

### 3. Missing Footer navLinks
Sites without footer navigation: **Nexa Propiedades, Granja Cabral, De Abasto a Casa, SuperSpuma**

**Fix:** Add `footer.navLinks` to content JSON.

### 4. Missing SEO Metadata
Sites without top-level `seo` section: **Alejandro Villamayor, Demo Contador, Demo Estudio Contable, Fun4Me, Nexa Paraguay, Nexa Propiedades, De Abasto a Casa, Granja Cabral, StoicFinch, SuperSpuma**

**Fix:** Add `seo` block with faq, servicios, per-page SEO overrides.

### 5. Unused Demo Sites
**152 preview sites** exist but most have no images, no multiple pages, and aren't registered in static-sites.ts. These are auto-generated demos that clutter the repo.

---

## Per-Site Upgrade Checklist

### Tier 1: Production Sites (Fix Now)

#### Alejandro Villamayor (8/10 → 10/10)
- [ ] Add top-level `seo` section to content/es.json
- [ ] Add English content for /investor-pass page
- [ ] Add real band/photo (needs Alejandro)
- [ ] Content is already strong — minor polish

#### Bufete Méndez (7/10 → 10/10)
- [ ] Add chrome config ✅ (already has it)
- [ ] Add English content (en.json)
- [ ] Add blog section with posts
- [ ] Need real attorney photos

#### Nüdo (8/10 → 10/10)
- [ ] Add chrome config ✅ (already has it)
- [ ] Already has images (53!) ✅
- [ ] Need newsletter to actually work (API endpoint)
- [ ] Gallery still uses Unsplash placeholders

### Tier 2: Client Demos (Upgrade to Full)

#### Demo Contador (5/10 → 9/10)
- [ ] Expand from 4 pages to 7+ (add blog, faq page, servicios detail)
- [ ] Add chrome config ✅ (already has it)
- [ ] Improve content depth (add pricing, process detail)
- [ ] Add testimonials with real names
- [ ] Better images (brand assets done ✅)

#### Demo Estudio Contable (6/10 → 9/10)
- [ ] Add chrome config to site.json
- [ ] Expand nav from 4 to 6+ items
- [ ] Content is rich (pricing, calculators) ✅
- [ ] Could add blog

#### Nexa Propiedades (4/10 → 8/10)
- [ ] Add chrome config
- [ ] Add footer navLinks
- [ ] Add OG/favicon images
- [ ] Add FAQ, testimonials to content
- [ ] Expand pages with property detail pages

#### Fun4Me (5/10 → 8/10)
- [ ] Add chrome config
- [ ] Add OG/favicon images
- [ ] Add English version
- [ ] Content is very large (65KB) — split into sub-pages

### Tier 3: Polish Pass

#### De Abasto a Casa (2/10 → 8/10)
- [ ] Only 1 page — needs full build-out
- [ ] Add chrome config
- [ ] Add footer, navigation, testimonials, FAQ
- [ ] Add OG/favicon images
- [ ] Build servicios, contacto, faq pages

#### SuperSpuma (6/10 → 9/10)
- [ ] Already 17 pages ✅
- [ ] Add OG/favicon images
- [ ] Add footer navLinks
- [ ] 73KB content — well done ✅

---

## Quick Wins (Do First, 1 Hour Total)

1. **Generate OG/favicons** for 6 sites missing them (script already exists)
2. **Add chrome config** to 7 sites missing it
3. **Add footer navLinks** to 4 sites missing them
4. **Add top-level SEO** to 10 sites missing it

## Automation Script

```bash
# Generate missing brand assets
for slug in nexa-propiedades fun4me de-abasto-a-casa dayah-litworks stoicfinch superspuma; do
  mkdir -p sites/$slug/images/brand
  python3 -c "
from PIL import Image, ImageDraw, ImageFont
import os
base = 'sites/$slug/images/brand'
os.makedirs(base, exist_ok=True)
img = Image.new('RGB', (1200, 630), (30, 30, 50))
# ... save og-default.png, favicon.png, apple-touch-icon.png
"
done
```
