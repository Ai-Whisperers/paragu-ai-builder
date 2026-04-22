# Dayah LitWorks — Complete Adaptation, Improvement & Upgrade Plan

> Based on: source-of-truth.md (confirmed answers), full tenant file audit, engine code analysis
> Created: 2026-04-22
> Status: Ready for execution

---

## Executive Summary

Dayah's site has **14 critical gaps** between what's live and what her answers require. The biggest blockers are: wrong contact info (email/phone), outdated 4-service catalog (should be 8 with real pricing), missing English locale activation, and 6 page configs referencing content keys that don't exist (causing silent render failures). This plan is organized into 7 batches, prioritized by what blocks a professional relaunch.

**Current state:** Site renders at paragu-ai.com/dayah-litworks but shows wrong email, placeholder pricing, no portfolio data, broken blog/contact pages, and no English version.

**Target state:** Bilingual (ES/EN) site with 8 real services + pricing, working portfolio, functional blog, proper contact form, custom branding, and real premade catalog images.

---

## BATCH 1 — Critical Data Fixes (Blocks everything)
**Priority:** P0 — Do first
**Effort:** ~1 hour
**Risk:** Zero (data-only changes, no code)

### What's wrong

| Issue | Current | Required |
|-------|---------|----------|
| Email | `dayah@litworks.com` | `dayahlitworks@gmail.com` |
| Demo-data WhatsApp | `+595981000000` (placeholder!) | `+595986868241` |
| `site.json` locales | `["es"]` | `["es", "en"]` |
| `static-sites.ts` pages | `['home']` only | All 6 pages |
| Services count | 4 services, all "Consultar" | 8 services with real USD + PYG pricing |
| EN locale not activated | en.json exists but site.json doesn't include "en" | Add "en" to locales |

### Tasks

1. **Update `site.json`** — fix email, add "en" to locales array, add founded date, add legal name, add Facebook/LinkedIn to contact
2. **Update `tokens.json`** — add minimal branding overrides (dark/moody theme suits book cover design)
3. **Update `content/es.json`** — replace 4 services with 8 real ones (with pricing), add `process`, `faq`, `trustBadges`, `navigation.items`, `products.categories` sections (currently ES is missing all of these that EN has)
4. **Update `content/en.json`** — replace 4 services with 8 real ones (with pricing), fix email to gmail, add Facebook/LinkedIn to contact
5. **Update `web/lib/engine/demo-data.ts`** — fix WhatsApp from placeholder to real number, update email, update services to match source-of-truth
6. **Update `web/lib/engine/static-sites.ts`** — add all 6 pages to the pages array, add "en" to locales
7. **Regenerate `web/lib/engine/generated/tenant-data.ts`** — run whatever build step generates this

### Why this is first

Every other batch depends on correct data. The placeholder WhatsApp and wrong email mean leads are going nowhere. "Consultar" pricing means visitors bounce. The ES content is missing entire sections that the page configs reference.

---

## BATCH 2 — Broken Page Fixes (3 pages silently failing)
**Priority:** P0 — Do immediately after Batch 1
**Effort:** ~2 hours
**Risk:** Low (adding missing content keys)

### What's wrong

3 page configs reference content keys that **don't exist** in any content file:

| Page | Missing content keys | Effect |
|------|---------------------|--------|
| `/blog` | `blog.seo.title`, `blog.seo.description`, `blog` (hero), `blog.posts`, `newsletter`, `ctaBanner` | Blog page renders with no data |
| `/blog/como-elegir-portada-libro` | `blogPost`, `blog.related`, `newsletter` | Blog post renders empty |
| `/contacto` | `contactHero`, `quoteForm`, `home.newsletter` | Contact page missing intake form and hero |

Additionally:
- `/portafolio` references `portfolio` and `portfolio.seo.*` — no portfolio content exists
- `/servicios` references `home.faq` and `ctaBanner` — ES content has no `faq`, neither has `ctaBanner`

### Tasks

1. **Add to `content/es.json` and `content/en.json`:**
   - `blog.seo.title` / `blog.seo.description`
   - `blog` hero section (title + subtitle)
   - `blog.posts` array (start with 1 post: como-elegir-portada-libro)
   - `blogPost` full content for the first blog post (write real article content)
   - `blog.related` array (related posts list)
   - `newsletter` section (title + subtitle + CTA)
   - `ctaBanner` section (title + CTA text + CTA href)
   - `portfolio` section (initial empty state with placeholder text "Portfolio coming soon")
   - `portfolio.seo.title` / `portfolio.seo.description`
   - `contactHero` section
   - `quoteForm` multi-step form content (brief intake: genre, title, timeline, budget range)
   - `home.faq` section with Dayah's real FAQ answers (she provided conditions that can become FAQ)

2. **Write first blog post content** — "Como elegir la portada perfecta para tu libro" — actual article body, not just a stub

3. **Build quote form content** — multi-step intake form for potential clients:
   - Step 1: Book genre + title
   - Step 2: Service type (custom/premade/maquetación)
   - Step 3: Timeline + budget
   - Step 4: Contact info
   - Submission → WhatsApp message

### Why this matters

These pages exist in the nav but show empty/broken content. That's worse than not having them at all — it signals an unfinished site.

---

## BATCH 3 — New Pages (Sobre + Términos + Condiciones)
**Priority:** P1 — Needed before relaunch
**Effort:** ~2 hours
**Risk:** Low

### What's missing

Dayah has no "About" page and no "Terms & Conditions" page. For a service business selling creative work internationally, both are essential.

### Tasks

1. **Create `pages/sobre.json`** — About page config
   - Hero with Dayah's name + tagline
   - Bio section (long version)
   - Tools/software grid
   - Timeline (founded 2019 → present milestones)
   - Genres I work with (visual grid)
   - CTA to contact

2. **Add `sobre` content to ES/EN** — Needs Dayah's bio (pending from questionnaire v2)
   - **Placeholder approach:** Write professional bio based on available info (founded 2019, book cover design, Asunción, international clients) and flag for Dayah to review/edit
   - Include her T&C conditions as content (she already provided these)

3. **Create `pages/terminos.json`** — Terms & Conditions page
   - Dayah's 7 conditions (verbatim from source-of-truth §4)
   - Payment methods section
   - Rights/licensing section (pending her answers on premade exclusivity)
   - Privacy policy section (Ley 1.682/01 Paraguay template)

4. **Add `terminos` content to ES/EN**

5. **Update navigation** in both locales to include new pages:
   - ES: `["Inicio", "Servicios", "Catálogo", "Portafolio", "Blog", "Sobre", "Contacto"]`
   - EN: `["Home", "Services", "Catalog", "Portfolio", "Blog", "About", "Contact"]`

6. **Add pages to `static-sites.ts`** and regenerate tenant-data

### What we can write now vs needs Dayah

| Section | Can write now | Needs Dayah |
|---------|---------------|-------------|
| T&C (7 conditions) | Yes — she provided verbatim | No |
| Payment methods | Yes — she provided (WU, bank, cash) | No |
| About bio (placeholder) | Yes — professional draft | She reviews/edits |
| Founded date (2019) | Yes | No |
| Photo for about page | No | Needs her photo |
| Software/tools | No | Needs her answer |
| Languages she speaks | No | Needs her answer |

---

## BATCH 4 — Service Catalog Restructure
**Priority:** P1 — Core revenue display
**Effort:** ~3 hours
**Risk:** Medium (may need new section variants)

### What needs to change

Current site shows services as a flat card grid. Dayah's 8 services naturally group into 3 categories:

| Category | Services | Price range |
|----------|----------|-------------|
| **Portadas Personalizadas** (Custom) | eBook $45, Tapa Blanda $80, Combo $120 | $45–$120 |
| **Portadas Premade** | eBook $35, Combo $80 | $35–$80 |
| **Maquetación Interior** | eBook $25, Paperback $35, Combo $50 | $25–$50 |

Plus 3 add-ons: Mockup 3D (TBD), Video Mockup 3D (TBD), Corrección ortotipográfica (per evaluation)

### Tasks

1. **Restructure services data** — group by category instead of flat list
   - Each category has: title, description, items[]
   - Each item: name, priceUSD, pricePYG, delivery, includes[]

2. **Update `pages/servicios.json`** — use `variant: "categories"` (already referenced) to render grouped services

3. **Add price display component** — show both USD and PYG (Dayah serves international + local clients)
   - Format: `$45 USD / ₲300.000` on each service card

4. **Add "What's included" expandable** — each service has 5-6 deliverables, should be collapsible list

5. **Add "Packages & Promos" section** — Dayah wants combos + flash sales
   - Initial: just a CTA banner "Ask about our bundles and launch promotions"
   - Future: actual package cards when she defines them

6. **Add "Add-ons" section** — Mockup 3D, Video Mockup, Corrección ortotipográfica
   - Mockups: "Price TBD — contact for quote"
   - Corrección: "Priced per evaluation"

7. **Service detail comparison** — helpful for authors choosing between custom/premade/maquetación
   - Could be a comparison table or tier cards

### Services content structure (for both ES and EN)

```json
{
  "services": {
    "title": "Nuestros Servicios",
    "subtitle": "Diseño profesional para tu libro",
    "categories": [
      {
        "id": "custom",
        "title": "Portadas Personalizadas",
        "description": "Diseño exclusivo creado desde cero para tu libro",
        "items": [
          {
            "name": "Portada Personalizada — eBook",
            "priceUSD": "$45",
            "pricePYG": "₲300.000",
            "delivery": "1–2 semanas",
            "includes": [
              "Portada de libro electrónico (JPG/PDF)",
              "Título en formato PNG y Portadilla PNG",
              "2 banners de revelación de portada",
              "2 Mockups"
            ]
          },
          { ... }
        ]
      },
      {
        "id": "premade",
        "title": "Portadas Premade",
        ...
      },
      {
        "id": "maquetacion",
        "title": "Maquetación Interior",
        ...
      }
    ],
    "addons": [
      { "name": "Mockup 3D Estático", "price": "Cotizar", ... },
      { "name": "Video Mockup 3D", "price": "Cotizar", ... },
      { "name": "Corrección ortotipográfica y de estilo", "price": "Según evaluación", ... }
    ]
  }
}
```

---

## BATCH 5 — Visual Branding & Design System
**Priority:** P2 — Important for professionalism, not blocking
**Effort:** ~3 hours (what we can do) + waiting on Dayah for logo/colors
**Risk:** Low

### What's wrong

Currently inherits generic `portfolio-professional` vertical defaults — no custom colors, no custom fonts, no logo. For a book cover designer, the site IS the portfolio — it needs to look like she designed it.

### Tasks (can do now)

1. **Set custom tokens.json** with a dark/moody book-cover aesthetic:
   ```json
   {
     "extends": "vertical:portfolio-professional",
     "palette": {
       "primary": "#1a1a2e",
       "secondary": "#e94560",
       "accent": "#0f3460",
       "background": "#16213e",
       "surface": "#1a1a2e",
       "text": "#eaeaea",
       "textMuted": "#a0a0a0"
     },
     "typography": {
       "heading": "Playfair Display",
       "body": "Inter"
     },
     "theme": "dark"
   }
   ```

2. **Add Google Fonts import** for Playfair Display (elegant, book-cover-appropriate)

3. **Create a text-based logo fallback** — "Dayah LitWorks" in Playfair Display with a subtle book icon — until Dayah provides her actual logo

### Tasks (need Dayah's input)

4. **Logo** — need SVG or high-res PNG. Ask her to send or create a Canva text logo
5. **Favicon** — generate from logo
6. **Hero background** — dark moody book image (Midjourney prompts ready in IMAGES.md)
7. **Color palette confirmation** — propose 2-3 options, she picks

---

## BATCH 6 — Premade Catalog Upgrade
**Priority:** P2 — Revenue-critical but not blocking relaunch
**Effort:** ~4 hours + waiting on Dayah for images
**Risk:** Medium (needs image assets from Dayah)

### What needs to happen

6 premades listed with no images. Premade names might be placeholders. No exclusivity model defined. No "sold" mechanism.

### Tasks (can do now)

1. **Add `pricePYG` to each premade** — show both USD and PYG like services
2. **Add `format` field** — eBook vs eBook & Paperback (currently only shows $35/$30 with no format indication)
3. **Add `includes` array** — what the premade purchase includes (from source-of-truth §3.2)
4. **Create premade detail view** — when clicking a premade, show:
   - Full-size cover image
   - Genre + mood
   - What's included
   - Price (USD + PYG)
   - "Request this cover" CTA → WhatsApp with pre-filled message including cover name

5. **Add "Sold" badge system** — when a premade is marked `available: false`, show "VENDIDA" overlay

### Tasks (need Dayah)

6. **Confirm if names are real or placeholders** — if placeholders, get real names + images
7. **Upload cover images** (1200×1800 minimum) — or generate with Midjourney using prompts from IMAGES.md
8. **Define exclusivity model** — exclusive (one sale, remove from catalog) or non-exclusive?
9. **Full catalog** — she may have more premades than the 6 listed

### Premade content structure upgrade

```json
{
  "name": "Susurros del Bosque",
  "genre": "Fantasía / Romance",
  "priceUSD": "$35",
  "pricePYG": "₲250.000",
  "format": "eBook",
  "imageUrl": "/assets/dayah-litworks/products/susurros-del-bosque.jpg",
  "available": true,
  "includes": [
    "Portada eBook (JPG/PDF)",
    "Título PNG + Portadilla PNG",
    "2 banners de revelación",
    "2 mockups"
  ],
  "scopeNote": "Incluye cambios de tipografía, color y posición de elementos",
  "ctaText": "Quiero esta portada",
  "ctaHref": "https://wa.me/595986868241?text=Hola! Me interesa la portada premade 'Susurros del Bosque'"
}
```

---

## BATCH 7 — Portfolio, Blog Content & SEO
**Priority:** P3 — Polish and growth
**Effort:** Ongoing
**Risk:** Low

### Portfolio

Currently empty (`portfolio` content key doesn't exist). Needs:

1. **Create `portfolio` content structure** with genre-based filtering:
   ```json
   {
     "seo": { "title": "Portafolio — Dayah LitWorks" },
     "filters": ["Todos", "Fantasía", "Romance", "Thriller", "Ciencia Ficción", "Terror"],
     "items": [
       {
         "title": "Book Title",
         "author": "Author Name",
         "genre": "Fantasía",
         "year": 2024,
         "imageUrl": "/assets/dayah-litworks/portfolio/xxx.jpg",
         "mockupUrl": "/assets/dayah-litworks/portfolio/xxx-mockup.jpg",
         "type": "custom",
         "description": "Brief: [what client wanted]. Solution: [what Dayah created]",
         "link": "https://amazon.com/..."
       }
     ]
   }
   ```

2. **Populate with whatever Dayah provides** — even 6-10 covers is enough for launch
3. **Before/After section** — if Dayah has redesign examples (she hasn't confirmed)
4. **Process showcase** — moodboard → sketch → final (if available)

### Blog

Structure exists, content doesn't. Plan:

1. **Write 3 launch articles** (in both ES and EN):
   - "5 errores que cometen los autores indie al elegir portada"
   - "Portada premade vs personalizada: cuándo elegir cada una"
   - "Tendencias de portadas 2026 por género"

2. **Create blog content keys** in both ES and EN for all posts

3. **SEO optimization** per article:
   - Meta title + description
   - Open Graph image
   - Schema.org Article markup
   - Internal links to relevant services

### SEO (site-wide)

1. **Meta tags per page** — already have SEO keys in page configs, need to ensure content is correct
2. **Schema.org markup** — LocalBusiness, Service, Product for premades, FAQPage for FAQ section
3. **Sitemap** — ensure all tenant pages appear in sitemap.xml
4. **Open Graph images** — create branded OG images for each page
5. **Canonical URLs** — ensure correct canonicals when domain is registered

---

## Dependency Map

```
Batch 1 (Data fixes)
  ├── Batch 2 (Broken pages) — depends on Batch 1 data being correct
  ├── Batch 3 (New pages) — depends on Batch 1 data
  ├── Batch 4 (Service restructure) — depends on Batch 1 services data
  │     └── Batch 6 (Premade catalog) — depends on Batch 4 structure
  ├── Batch 5 (Branding) — independent, can run parallel
  └── Batch 7 (Portfolio/Blog/SEO) — depends on Batch 2 content keys
```

## Recommended Execution Order

| Week | Batches | Deliverable |
|------|---------|-------------|
| **Now** | Batch 1 + Batch 5 | Correct data everywhere + custom dark theme tokens |
| **Now +1** | Batch 2 + Batch 4 | All pages render correctly + real services with pricing |
| **Now +2** | Batch 3 + Batch 6 | About + T&C pages live + premade catalog with images (if Dayah provides) |
| **Ongoing** | Batch 7 | Portfolio population + blog writing + SEO polish |

## What Blocks Relaunch

Minimum viable relaunch needs: **Batch 1 + Batch 2 + Batch 4** (about 6 hours of work). After that, the site has correct contact info, real pricing, all pages working, and bilingual support.

Everything else (Batch 3, 5, 6, 7) is polish that can happen after relaunch — either because it needs Dayah's input or because it's enhancement rather than fix.

## Files That Need Changes

### Tenant files (sites/dayah-litworks/)
| File | Batch | Action |
|------|-------|--------|
| `site.json` | 1 | Fix email, add "en", add contact channels, add founded |
| `tokens.json` | 5 | Add custom dark theme palette + fonts |
| `content/es.json` | 1,2,3,4,6 | Complete rewrite of services, add all missing content keys |
| `content/en.json` | 1,2,3,4,6 | Mirror ES changes in English |
| `pages/sobre.json` | 3 | New file |
| `pages/terminos.json` | 3 | New file |
| `pages/home.json` | 4 | Add process section, add trust badges section |
| `pages/servicios.json` | 4 | May need variant changes for grouped services |
| `pages/catalogo.json` | 6 | May need detail view addition |

### Engine code (web/lib/engine/)
| File | Batch | Action |
|------|-------|--------|
| `demo-data.ts` | 1 | Fix WhatsApp, email, services |
| `static-sites.ts` | 1 | Add all pages, add "en" locale |
| `generated/tenant-data.ts` | 1 | Regenerate from source files |

### Pending Dayah's Input (questionnaire v2)
| Item | Blocks which batch |
|------|-------------------|
| Logo + brand colors | Batch 5 (full), but text fallback works for launch |
| Premade cover images | Batch 6 (full), but catalog shows without images for launch |
| Portfolio images | Batch 7 (portfolio section) |
| Bio + photo | Batch 3 (About page, can use placeholder bio) |
| FAQ answers | Batch 2 (FAQ section, can write from her T&C + pricing) |
| Testimonials confirmation | Batch 2 (testimonials section) |
| Exclusivity model | Batch 6 (premade licensing section) |

---

*This plan is self-contained — any batch can be executed independently as long as its dependencies (listed above) are satisfied first.*
