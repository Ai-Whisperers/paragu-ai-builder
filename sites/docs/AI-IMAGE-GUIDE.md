# Dayah LitWorks — AI Image Generation Guide

> Complete guide for generating every image the site needs.
> **Rule: Premade covers are REAL products Dayah sells — NEVER AI-generate those.**
> Everything else (hero, about, blog, social, service cards) = AI-generated.
>
> Updated: 2026-04-22

---

## Quick Reference — What to Generate vs What's Real

| Image | Type | How to get it | Priority |
|-------|------|---------------|----------|
| Hero background | AI | Generate below | P0 |
| About page headshot placeholder | AI | Generate below | P1 |
| Workspace photo | AI | Generate below | P1 |
| Service card backgrounds (4) | AI | Generate below | P1 |
| Blog post thumbnails | AI | Generate below | P2 |
| Blog hero banner | AI | Generate below | P2 |
| Social media banners (4) | AI | Generate below | P2 |
| Seasonal campaign images (4) | AI | Generate below | P3 |
| **Premade cover images (6)** | **REAL** | **Dayah provides** | P1 |
| Logo | **REAL** | **Dayah provides** | P1 |
| Favicon | Derived | From logo | P1 |
| Portfolio work samples | **REAL** | **Dayah provides** | P2 |

---

## Recommended AI Image Generators

| Tool | Cost | Best for | URL |
|------|------|----------|-----|
| Midjourney v6 | $10/mo | Highest quality, best art direction | midjourney.com |
| DALL-E 3 (ChatGPT Plus) | $20/mo | Easiest to use, good text rendering | chatgpt.com |
| Ideogram | Free tier | Best at text-in-image generation | ideogram.ai |
| Leonardo.ai | Free/$12 | Good batch generation, style control | leonardo.ai |
| FLUX (via fal.ai) | Pay-per-use | Photorealistic, fast | fal.ai |

**If you only pick one:** Midjourney v6 for the hero/portfolio mood. Use Ideogram or DALL-E 3 when text needs to appear in the image.

---

## P0 — Hero Background (Generate FIRST)

This is the first thing visitors see. Needs to scream "professional book cover design."

### hero-bg.jpg — Main Hero Background

| Spec | Value |
|------|-------|
| **Filename** | `hero-bg.jpg` |
| **Dimensions** | 1920×1080px |
| **Aspect Ratio** | 16:9 |
| **Format** | JPG (quality 85) |
| **Final file size target** | < 200KB |
| **Location** | `sites/dayah-litworks/assets/hero-bg.jpg` |

**Midjourney Prompt:**
```
dramatic close-up of an open hardcover book with golden light streaming from the pages, floating luminous particles, dark navy blue atmospheric background with subtle mist, cinematic depth of field, moody dramatic lighting, professional photography, dark academia aesthetic, book cover design studio vibe --ar 16:9 --v 6.1 --stylize 300 --q 2
```

**DALL-E 3 Prompt:**
```
A dramatic, cinematic image of an open hardcover book on a dark surface, with warm golden light emanating from the pages. Floating dust particles catch the light. Dark navy blue atmospheric background with subtle fog. Professional photography style, dark moody aesthetic suitable for a book cover designer's website hero section. No text. 16:9 aspect ratio.
```

**Post-processing:**
1. Download generated image
2. Open in Canva or Photopea (free Photoshop alternative)
3. Add dark gradient overlay at bottom (black → transparent, 40% opacity) so white text is readable
4. Resize to exactly 1920×1080
5. Export as JPG quality 85

---

## P1 — About Page Images

### about-headshot.jpg — Dayah's Portrait (Placeholder)

| Spec | Value |
|------|-------|
| **Filename** | `about-headshot.jpg` |
| **Dimensions** | 800×800px |
| **Aspect Ratio** | 1:1 |
| **Format** | JPG |
| **Location** | `sites/dayah-litworks/assets/about-headshot.jpg` |

**IMPORTANT:** This is a TEMPORARY placeholder until Dayah sends her real photo. The AI headshot should look professional and friendly, not overly perfect.

**Midjourney Prompt:**
```
professional portrait photo of a young creative Latina woman in her late 20s, warm friendly smile, soft natural window lighting, dark solid background, wearing minimal elegant jewelry, professional headshot style, high quality photography, shallow depth of field --ar 1:1 --v 6.1 --stylize 150
```

**DALL-E 3 Prompt:**
```
Professional portrait photo of a young creative Latina woman, late 20s, with a warm confident smile. Soft natural window lighting from the left. Dark navy blue solid background. Wearing a simple elegant dark top. Professional headshot style. Square format. No text or watermarks.
```

**Post-processing:**
1. Crop to square 1:1
2. Add subtle vignette (darken edges 10%)
3. Resize to 800×800

**⚠️ Replace this with Dayah's real photo ASAP. Mark in code as placeholder.**

---

### about-workspace.jpg — Creative Workspace

| Spec | Value |
|------|-------|
| **Filename** | `about-workspace.jpg` |
| **Dimensions** | 1200×800px |
| **Aspect Ratio** | 3:2 |
| **Format** | JPG |
| **Location** | `sites/dayah-litworks/assets/about-workspace.jpg` |

**Midjourney Prompt:**
```
cozy creative workspace desk top-down angle, pen tablet and large monitor displaying book cover design, scattered art supplies, coffee mug, warm desk lamp lighting, dark moody aesthetic, professional design studio, navy and gold color accents, creative atmosphere --ar 3:2 --v 6.1 --stylize 250
```

**DALL-E 3 Prompt:**
```
A cozy creative workspace viewed from a 45-degree angle. A Wacom pen tablet sits next to a large monitor displaying a book cover design in progress. Scattered art supplies, a coffee mug, and warm desk lamp lighting create a moody, creative atmosphere. Dark navy and gold color scheme. Professional design studio feel. No text or logos. 3:2 aspect ratio.
```

---

## P1 — Service Card Backgrounds (4 images)

These appear behind each service category. Abstract/moody, not literal.

### svc-custom.jpg — Custom Covers Background

| Spec | Value |
|------|-------|
| **Filename** | `svc-custom.jpg` |
| **Dimensions** | 600×800px |
| **Aspect Ratio** | 3:4 |
| **Format** | JPG |
| **Location** | `sites/dayah-litworks/assets/services/svc-custom.jpg` |

**Midjourney Prompt:**
```
abstract artistic image of a blank canvas with paintbrushes and creative tools, dark moody navy blue background with golden light streaks, creative design process aesthetic, cinematic lighting, professional photography --ar 3:4 --v 6.1 --stylize 200
```

---

### svc-premade.jpg — Premade Covers Background

**Midjourney Prompt:**
```
elegant arrangement of multiple book covers fanned out on dark surface, warm golden lighting, professional studio photography, dark navy background, book cover catalog aesthetic --ar 3:4 --v 6.1 --stylize 250
```

---

### svc-maquetacion.jpg — Interior Layout Background

**Midjourney Prompt:**
```
close-up of elegant book interior pages with beautiful typography layout, soft warm lighting, dark background, professional book design aesthetic, cream paper texture visible, clean modern typesetting --ar 3:4 --v 6.1 --stylize 200
```

---

### svc-addons.jpg — Add-ons (Mockups) Background

**Midjourney Prompt:**
```
photorealistic 3D book mockup floating in dark space with dramatic rim lighting, soft shadows, professional product photography, dark navy background, cinematic mood --ar 3:4 --v 6.1 --stylize 300
```

---

## P1 — Contact/CTA Background

### contact-bg.jpg — Contact Section Background

| Spec | Value |
|------|-------|
| **Filename** | `contact-bg.jpg` |
| **Dimensions** | 1920×600px |
| **Aspect Ratio** | ~3:1 |
| **Format** | JPG |
| **Location** | `sites/dayah-litworks/assets/contact-bg.jpg` |

**Midjourney Prompt:**
```
soft bokeh lights in warm gold and navy blue, abstract professional background, gentle gradient, dark moody aesthetic, suitable for contact form overlay, minimal and elegant --ar 3:1 --v 6.1 --stylize 150
```

---

## P2 — Blog Images

### blog-hero.jpg — Blog Page Banner

| Spec | Value |
|------|-------|
| **Filename** | `blog-hero.jpg` |
| **Dimensions** | 1920×600px |
| **Format** | JPG |
| **Location** | `sites/dayah-litworks/assets/blog/blog-hero.jpg` |

**Midjourney Prompt:**
```
overhead flat lay of open notebook with pen, scattered book pages, coffee cup, warm cozy lighting, creative writing aesthetic, dark navy background with golden accents, professional blog header photography --ar 16:5 --v 6.1 --stylize 200
```

---

### Blog Post Thumbnails (3 initial)

| Post | Filename | Prompt |
|------|----------|--------|
| Cómo elegir portada | `thumb-elegir-portada.jpg` | `magnifying glass over a collection of colorful book covers on dark surface, selective focus, professional photography, warm lighting --ar 4:3 --v 6.1 --stylize 200` |
| Premade vs Custom | `thumb-premade-vs-custom.jpg` | `split comparison image, left side shows simple generic book cover, right side shows stunning professional book cover, dark background, dramatic lighting contrast --ar 4:3 --v 6.1 --stylize 200` |
| Tendencias 2026 | `thumb-tendencias-2026.jpg` | `modern colorful book covers arranged in artistic grid pattern, dark navy background, professional product photography, editorial aesthetic --ar 4:3 --v 6.1 --stylize 250` |

| Dimensions | 800×600px |
| Format | JPG |
| Location | `sites/dayah-litworks/assets/blog/thumbnails/` |

---

## P2 — Social Media Banners

### Facebook Cover (820×312)

**Midjourney Prompt:**
```
professional banner for book cover design business, dark navy background with golden accents, elegant book imagery, minimal clean design, space for text overlay, professional photography style --ar 8:3 --v 6.1 --stylize 200
```

**Post-processing in Canva:**
1. Add text: "Dayah LitWorks — Diseño de Portadas"
2. Add website: paragu-ai.com/dayah-litworks
3. Export as PNG

### LinkedIn Banner (1584×396)

Same concept as Facebook, different crop. Use `--ar 4:1`.

### Twitter/X Header (1500×500)

Same concept. Use `--ar 3:1`.

### YouTube Banner (2560×1440)

Same concept. Use `--ar 16:9`.

---

## P3 — Seasonal Campaign Images (Future)

| Campaign | Filename | When | Prompt Template |
|----------|----------|------|----------------|
| Valentine | `seasonal-valentine.jpg` | February | `romantic book cover promotion, red and pink tones, hearts and roses, dark elegant background --ar 1:1 --v 6.1 --stylize 250` |
| Summer Reading | `seasonal-summer.jpg` | Dec-Jan | `summer beach reads, warm sunset tones, books on sandy surface, tropical elements --ar 1:1 --v 6.1 --stylize 250` |
| Halloween | `seasonal-halloween.jpg` | October | `spooky horror book aesthetic, fog and pumpkins, dark purple orange tones, eerie elegant mood --ar 1:1 --v 6.1 --stylize 300` |
| Black Friday | `seasonal-blackfriday.jpg` | November | `black friday book design sale, bold gold typography on black, minimalist luxury, discount aesthetic --ar 1:1 --v 6.1 --stylize 200` |

---

## P3 — Instagram Post Templates (6 initial)

**Style:** Dark background + book cover design tip/quote + Dayah LitWorks branding

| Post | Prompt | Text overlay in Canva |
|------|--------|----------------------|
| Tip 1 | `minimalist dark navy background with subtle golden particles, professional design quote card template, clean layout --ar 1:1 --v 6.1 --stylize 150` | "Tu portada es tu primera impresión. ¿Está vendiendo tu libro?" |
| Tip 2 | Same template | "5 de cada 10 lectores deciden por la portada. ¿La tuya convence?" |
| Tip 3 | Same template | "Tipografía = 70% del impacto de tu portada" |
| Behind the scenes | `designer workspace with pen tablet, work in progress visible on screen, warm desk lamp, dark moody aesthetic --ar 4:5 --v 6.1 --stylize 250` | "Detrás de cada portada..." |
| Portfolio showcase | `professional 3D book mockup display, dramatic lighting, dark background --ar 4:5 --v 6.1 --stylize 300` | "Nueva portada disponible" |
| Process step | Same template | "1. Brief → 2. Propuestas → 3. Revisiones → 4. Entrega" |

---

## What NOT to AI-Generate (Dayah Must Provide)

These are her real products and identity — AI versions would be misleading:

### Premade Cover Images (6 REAL images needed)

| # | Name | Size | Notes |
|---|------|------|-------|
| 1 | Susurros del Bosque | 1200×1800px | **Dayah sends actual cover file** |
| 2 | Corazón de Cenizas | 1200×1800px | **Dayah sends actual cover file** |
| 3 | El Último Código | 1200×1800px | **Dayah sends actual cover file** |
| 4 | Galaxia Interior | 1200×1800px | **Dayah sends actual cover file** |
| 5 | Sombras en el Espejo | 1200×1800px | **Dayah sends actual cover file** |
| 6 | Alas de Cristal | 1200×1800px | **Dayah sends actual cover file** |

**Location:** `sites/dayah-litworks/assets/products/`

### Logo

| Spec | Value |
|------|-------|
| **Format** | SVG (preferred) or PNG with transparency |
| **Dimensions** | 512×512px minimum |
| **Location** | `sites/dayah-litworks/assets/logo.svg` |

### Portfolio Work Samples

| Spec | Value |
|------|-------|
| **Count** | As many as Dayah has (minimum 6) |
| **Dimensions** | 1200×1800px minimum |
| **Format** | JPG |
| **Location** | `sites/dayah-litworks/assets/portfolio/` |
| **Naming** | `port-01-[book-title-slug].jpg` |

### Real Headshot

| Spec | Value |
|------|-------|
| **Dimensions** | 800×800px minimum |
| **Format** | JPG |
| **Location** | `sites/dayah-litworks/assets/about-headshot.jpg` (replaces AI placeholder) |

---

## Generation Checklist — Run This Before Asking Dayah for Anything

### Immediate (generate today)

- [ ] hero-bg.jpg — 1 hero background
- [ ] about-headshot.jpg — 1 placeholder portrait
- [ ] about-workspace.jpg — 1 workspace photo
- [ ] svc-custom.jpg — 1 service background
- [ ] svc-premade.jpg — 1 service background
- [ ] svc-maquetacion.jpg — 1 service background
- [ ] svc-addons.jpg — 1 service background
- [ ] contact-bg.jpg — 1 contact section background

**Total: 8 images, ~30 min generation time**

### This week (when blog posts are ready)

- [ ] blog-hero.jpg — 1 blog banner
- [ ] thumb-elegir-portada.jpg — 1 thumbnail
- [ ] thumb-premade-vs-custom.jpg — 1 thumbnail
- [ ] thumb-tendencias-2026.jpg — 1 thumbnail

**Total: 4 images, ~15 min generation time**

### This month (social launch)

- [ ] Facebook cover
- [ ] LinkedIn banner
- [ ] Twitter header
- [ ] YouTube banner
- [ ] 6 Instagram post templates

**Total: 10 images, ~45 min generation time**

---

## Post-Processing Workflow (Every Image)

1. **Generate** using prompts above in your preferred AI tool
2. **Review** — reject anything with: extra fingers, weird text, blurry, wrong aspect ratio
3. **Resize** to exact dimensions specified using:
   - Canva (free, easy)
   - Photopea.com (free Photoshop alternative)
   - Squoosh.app (Google's free image optimizer)
4. **Optimize** — compress to target file size:
   - Hero images: < 200KB
   - Cards/thumbnails: < 100KB
   - Social banners: < 150KB
5. **Save** to correct location in `sites/dayah-litworks/assets/`
6. **Update** `imageUrl` fields in content/es.json and content/en.json
7. **Regenerate** tenant-data.ts: `npm run generate:tenant-data`

---

## File Structure After Generation

```
sites/dayah-litworks/assets/
├── hero-bg.jpg                    ← AI generated
├── contact-bg.jpg                 ← AI generated
├── about-headshot.jpg             ← AI placeholder (replace with real)
├── about-workspace.jpg            ← AI generated
├── logo.svg                       ← Dayah provides (REAL)
├── favicon.ico                    ← Derived from logo
├── services/
│   ├── svc-custom.jpg             ← AI generated
│   ├── svc-premade.jpg            ← AI generated
│   ├── svc-maquetacion.jpg        ← AI generated
│   └── svc-addons.jpg             ← AI generated
├── products/
│   ├── susurros-del-bosque.jpg    ← REAL (Dayah provides)
│   ├── corazon-de-cenizas.jpg     ← REAL (Dayah provides)
│   ├── el-ultimo-codigo.jpg       ← REAL (Dayah provides)
│   ├── galaxia-interior.jpg       ← REAL (Dayah provides)
│   ├── sombras-en-el-espejo.jpg   ← REAL (Dayah provides)
│   └── alas-de-cristal.jpg        ← REAL (Dayah provides)
├── portfolio/
│   └── (Dayah provides)           ← REAL work samples
├── blog/
│   ├── blog-hero.jpg              ← AI generated
│   └── thumbnails/
│       ├── thumb-elegir-portada.jpg       ← AI generated
│       ├── thumb-premade-vs-custom.jpg    ← AI generated
│       └── thumb-tendencias-2026.jpg      ← AI generated
└── social/
    ├── facebook-cover.png         ← AI + Canva text overlay
    ├── linkedin-banner.png        ← AI + Canva text overlay
    ├── twitter-header.png         ← AI + Canva text overlay
    └── youtube-banner.png         ← AI + Canva text overlay
```

---

*Last updated: 2026-04-22*
*Related files: `sites/dayah-litworks/IMAGES.md` (old Midjourney-only version), `sites/dayah-litworks/docs/UPGRADE-PLAN.md`*
