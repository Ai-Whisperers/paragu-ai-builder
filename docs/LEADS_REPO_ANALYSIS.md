# Leads Repo Template Analysis
## Complete Analysis for Building an Abstracted, Reusable Template System

---

## 1. EXECUTIVE SUMMARY

The `paragu-ai-leads` repository contains a comprehensive lead intelligence platform for
the Paraguayan beauty/wellness market. It has **7,463 businesses** analyzed across **209+ cities**,
with **3,960 Priority-A leads** (businesses without proper websites).

The repo contains rich template specifications for **9 business categories** -- but everything
is in markdown documentation. Our job is to **extract, structure, and codify** this into
a reusable, data-driven template system in the `paragu-ai-builder` repo.

---

## 2. WHAT EXISTS IN THE LEADS REPO

### 2.1 Data Layer (Python + CSV/JSON)
| Asset | Location | Description |
|-------|----------|-------------|
| Business data | `data/processed/*.csv` | 7,463 businesses with 40+ fields |
| Priority leads | `data/processed/paraguay_priority_a.csv` | 3,960 high-value leads |
| Category analysis | `data/processed/deep_analysis_summary.json` | 12 categories, city-level breakdown |
| Requirements analysis | `data/processed/business_requirements_analysis.json` | Feature matrix by type |

### 2.2 Template Specifications (Markdown Docs)
| Document | Location | What It Contains |
|----------|----------|-----------------|
| Template Specs | `docs/03_templates/TEMPLATE_SPECIFICATIONS.md` | 9 complete design systems (colors, typography, spacing, components, states, animations) |
| Wireframes | `docs/03_templates/WIREFRAME_CONCEPTS.md` | ASCII wireframes for all 9 types, section-by-section layouts |
| Content Templates | `docs/03_templates/CONTENT_TEMPLATES.md` | Pre-written Spanish copy with `[placeholders]` for all pages |
| Business Input Form | `docs/03_templates/BUSINESS_INPUT_FORM.md` | Data collection schemas per business type |

### 2.3 Requirements (Markdown Docs)
| Document | Location | What It Contains |
|----------|----------|-----------------|
| Business Type Requirements | `docs/02_requirements/BUSINESS_TYPE_REQUIREMENTS.md` | MVP features, audience personas, service offerings, SEO, booking integration per type |
| Technical Implementation | `docs/04_technical/TECHNICAL_IMPLEMENTATION.md` | Stack options, performance targets, SEO, accessibility, deployment |

### 2.4 The 9 Business Categories
| # | Category (ES) | Category (EN) | Lead Count | No Website % |
|---|---------------|---------------|------------|--------------|
| 1 | Peluqueria | Hair Salon | 2,393 | 81% |
| 2 | Gimnasio/Fitness | Gym/Fitness | 1,087 | 72% |
| 3 | Spa/Wellness | Spa/Wellness | 927 | 76% |
| 4 | Unas | Nail Salon | 488 | 75% |
| 5 | Tatuajes/Piercing | Tattoo/Piercing | 272 | 70% |
| 6 | Barberia | Barbershop | 39 | 77% |
| 7 | Estetica/Facial | Aesthetic Clinic | 137 | 77% |
| 8 | Maquillaje | Makeup Artist | 130 | 72% |
| 9 | Depilacion | Hair Removal | 9 | 78% |

---

## 3. WHAT NEEDS TO BE EXTRACTED

### 3.1 Design Tokens (per category)
Each of the 9 categories defines:
- **Color palettes** (2-3 palette options with 7-10 CSS custom properties each)
- **Typography** (heading/body/accent font families + size scale)
- **Spacing system** (8-point grid, section padding)
- **Border radius** (rounded for spa, sharp for gym/tattoo)
- **Animations** (fade-in, scale, translate timings)
- **Visual style** (dark vs light theme, mood descriptors)

### 3.2 Page Sections (composable)
Every template is composed from a common set of **page sections**:

| Section | Used By | Variants |
|---------|---------|----------|
| Header/Nav | All 9 | Sticky, transparent, dark, light |
| Hero | All 9 | Image, video, slider, split |
| Services/Menu | 8 of 9 | Grid cards, list, accordion, tabbed |
| Gallery/Portfolio | 7 of 9 | Grid, masonry, filtered, slider |
| Team/Staff | All 9 | Cards (circle img), grid, carousel |
| Pricing/Tiers | 3 of 9 | Comparison table, cards |
| Before/After | 4 of 9 | Slider, side-by-side |
| Contact/Location | All 9 | Map + form, info split |
| Testimonials | 5 of 9 | Cards, carousel |
| FAQ | 6 of 9 | Accordion |
| Packages/Deals | 3 of 9 | Banner, cards |
| Footer | All 9 | 4-col, minimal |
| WhatsApp Float | All 9 | Fixed button |

### 3.3 Content Templates (per category per page)
Pre-written Spanish copy with placeholders for:
- Hero headlines + subheadlines
- Service descriptions with price/duration slots
- Team bios
- FAQ Q&A pairs
- CTA button text
- SEO meta tags (title, description, schema.org)

### 3.4 Business Input Schema (per category)
Data collection forms define exactly what data each business needs to provide:
- Basic info (name, address, phone, WhatsApp)
- Services + pricing
- Team members + photos
- Operating hours
- Portfolio images
- Booking preferences
- Branding preferences
- Current online presence

### 3.5 Feature Flags (per category)
The cross-category matrix defines which features apply:

| Feature | Hair | Gym | Spa | Nails | Tattoo | Barber | Aesthetic | Makeup | Depil |
|---------|------|-----|-----|-------|--------|--------|-----------|--------|-------|
| Online Booking | YES | YES | YES | YES | CONSULT | YES | CONSULT | INQUIRY | CONSULT |
| Service Menu | YES | YES | YES | YES | NO | YES | YES | YES | YES |
| Portfolio | YES | NO | NO | YES | YES | YES | YES | YES | NO |
| Before/After | OPT | NO | NO | YES | YES | YES | YES | YES | OPT |
| Pricing Display | YES | YES | YES | YES | NO | YES | FROM | YES | YES |
| Walk-in Policy | NO | NO | NO | NO | NO | YES | NO | NO | NO |
| Class Schedule | NO | YES | NO | NO | NO | NO | NO | NO | NO |
| Package Builder | NO | NO | YES | NO | NO | NO | NO | NO | YES |
| Aftercare Info | NO | NO | NO | NO | YES | NO | YES | NO | YES |

### 3.6 Booking Integration Config
| Category | Primary Method | Fallback |
|----------|---------------|----------|
| Hair Salon | Fresha | WhatsApp |
| Gym | Mindbody/Glofox | Form + WhatsApp |
| Spa | Fresha | WhatsApp |
| Nail Salon | Fresha | WhatsApp |
| Tattoo | Consultation form | WhatsApp |
| Barbershop | Square | Walk-in + WhatsApp |
| Aesthetic | Consultation form | WhatsApp |
| Makeup | Inquiry form | WhatsApp |
| Hair Removal | Consultation form | WhatsApp |

---

## 4. ABSTRACTION ARCHITECTURE

### 4.1 Layered Architecture

```
                    +---------------------------+
                    |    Business Input Data     |  <-- From leads CSV or intake form
                    |  (name, services, photos)  |
                    +-------------+-------------+
                                  |
                    +-------------v-------------+
                    |   Business Type Registry   |  <-- 9 category definitions
                    |   (features, sections,     |
                    |    content defaults)        |
                    +-------------+-------------+
                                  |
              +-------------------+-------------------+
              |                   |                   |
   +----------v--------+ +-------v--------+ +--------v--------+
   |   Design Tokens    | |  Page Sections | |  Content Model  |
   |  (colors, fonts,   | | (composable    | | (structured     |
   |   spacing, mood)   | |  section defs) | |  placeholders)  |
   +----------+--------+ +-------+--------+ +--------+--------+
              |                   |                   |
              +-------------------+-------------------+
                                  |
                    +-------------v-------------+
                    |     Template Renderer      |  <-- Combines tokens + sections + content
                    |  (Next.js/Astro + Tailwind)|
                    +-------------+-------------+
                                  |
                    +-------------v-------------+
                    |      Generated Website     |
                    +---------------------------+
```

### 4.2 Core Abstractions

#### A. Design Token System (`src/tokens/`)
Structured JSON files that codify every visual decision:
```
tokens/
  base.tokens.json          # Shared spacing, breakpoints, animations
  peluqueria.tokens.json    # Hair salon palettes + typography
  gimnasio.tokens.json      # Gym palettes + typography
  ...                       # One per category
```

#### B. Page Section Registry (`src/sections/`)
Each section is a composable building block with:
- A **schema** (what data it needs)
- A **default layout** (how it renders)
- **Variants** (per-category visual tweaks)
```
sections/
  hero.section.json
  services.section.json
  gallery.section.json
  team.section.json
  contact.section.json
  pricing.section.json
  ...
```

#### C. Business Type Registry (`src/registry/`)
Each business type is a **composition** of tokens + sections + content:
```
registry/
  peluqueria.type.json     # Which sections, which tokens, which content
  gimnasio.type.json
  ...
```

#### D. Content Model (`src/content/`)
Structured content templates with i18n-ready placeholders:
```
content/
  peluqueria.content.json  # Default Spanish copy, service structures
  gimnasio.content.json
  ...
```

#### E. Business Input Schema (`src/schemas/`)
JSON Schema definitions for data collection:
```
schemas/
  business.schema.json     # Base schema (all types)
  peluqueria.schema.json   # Category-specific extensions
  ...
```

### 4.3 How It All Connects

```
1. SELECT business type     --> loads registry/peluqueria.type.json
2. Registry specifies       --> tokens: "peluqueria", sections: [hero, services, gallery, team, contact]
3. For each section         --> load section schema + map business data to slots
4. Apply design tokens      --> CSS custom properties from peluqueria.tokens.json
5. Fill content templates   --> merge business data with content/peluqueria.content.json
6. Render                   --> composable React/Astro components
```

---

## 5. IMPLEMENTATION PLAN

### Phase 1: Foundation (This PR)
- [x] Analysis document (this file)
- [ ] Base schemas (TypeScript interfaces)
- [ ] Design token files for all 9 categories
- [ ] Business type registry for all 9 categories
- [ ] Content model templates for all 9 categories
- [ ] Business input schemas for all 9 categories

### Phase 2: Component Library
- [ ] Choose framework (Next.js + Tailwind recommended)
- [ ] Build universal section components (Hero, Services, Gallery, Team, Contact, Footer)
- [ ] Build category-specific components (ClassSchedule, PricingTiers, BeforeAfter)
- [ ] Token-to-CSS pipeline (design tokens -> Tailwind theme)
- [ ] Responsive layout system

### Phase 3: Builder Engine
- [ ] Business data ingestion (from leads CSV or intake form)
- [ ] Template composition engine (registry -> sections -> render)
- [ ] Preview system (live preview with real data)
- [ ] Export/deploy pipeline (static site generation)

### Phase 4: Integration
- [ ] Booking integration adapters (Fresha, WhatsApp, Mindbody)
- [ ] SEO automation (meta tags, schema.org, sitemap)
- [ ] Analytics setup (GA4, Search Console)
- [ ] Image optimization pipeline

### Phase 5: Scale
- [ ] Batch generation (process 100s of leads)
- [ ] A/B testing for templates
- [ ] Multi-language support (Spanish primary, Guarani optional)
- [ ] Client self-service portal

---

## 6. KEY DESIGN DECISIONS

### 6.1 Why JSON Schemas (not Markdown)?
The leads repo stores everything in markdown. For the builder, we need:
- **Machine-readable** data that code can consume
- **Validated** structures (JSON Schema enforces required fields)
- **Composable** definitions (one template = tokens + sections + content)
- **Diffable** changes (structured JSON diffs cleanly)

### 6.2 Why Composable Sections (not Monolithic Templates)?
A monolithic "hair salon template" couples layout to category. Instead:
- A **Hero** section works for ANY category with different tokens
- A **Services Grid** works for salons, spas, and barbershops
- A **Pricing Table** works for gyms and clinics
- New categories can be composed from existing sections

### 6.3 Why Design Tokens (not Hardcoded CSS)?
- One JSON file change swaps the entire visual identity
- Tokens can be overridden per-client (custom brand colors)
- Tokens feed into Tailwind, CSS custom properties, or any framework
- Enables "palette switching" for A/B testing

### 6.4 Recommended Tech Stack
| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 14+ (App Router) | SSG for performance, React ecosystem |
| Styling | Tailwind CSS | Token-friendly, utility-first, responsive |
| Content | JSON + MDX | Structured data + rich content |
| Schema | TypeScript + Zod | Type-safe validation |
| Build | Turborepo | Monorepo for shared code |
| Deploy | Vercel | Zero-config Next.js hosting |
| Images | next/image + Cloudinary | Optimization + CDN |

---

## 7. DATA FLOW: LEADS REPO -> BUILDER

```
paragu-ai-leads                          paragu-ai-builder
================                         ==================

data/processed/                          src/schemas/
  paraguay_priority_a.csv  --------->      business.schema.json
  (business records)                       (validated input format)

docs/03_templates/                       src/tokens/
  TEMPLATE_SPECIFICATIONS.md  ------->     {category}.tokens.json
  (colors, fonts, spacing)                 (structured design tokens)

docs/03_templates/                       src/registry/
  WIREFRAME_CONCEPTS.md  ----------->      {category}.type.json
  (layouts, section order)                 (section composition)

docs/03_templates/                       src/content/
  CONTENT_TEMPLATES.md  ------------>      {category}.content.json
  (copy, placeholders)                     (structured content)

docs/02_requirements/                    src/registry/
  BUSINESS_TYPE_REQUIREMENTS.md  --->      {category}.type.json
  (features, booking config)               (feature flags, integrations)

docs/03_templates/                       src/schemas/
  BUSINESS_INPUT_FORM.md  ---------->      {category}.schema.json
  (data collection fields)                 (input validation)
```

---

## 8. FILE INVENTORY (What to Create)

### Core Schema Files
```
src/schemas/
  base-business.schema.json           # Universal fields (name, address, phone, etc.)
  peluqueria.schema.json              # Hair salon specific fields
  gimnasio.schema.json                # Gym specific fields
  spa.schema.json                     # Spa specific fields
  unas.schema.json                    # Nail salon specific fields
  tatuajes.schema.json                # Tattoo specific fields
  barberia.schema.json                # Barbershop specific fields
  estetica.schema.json                # Aesthetic clinic specific fields
  maquillaje.schema.json              # Makeup artist specific fields
  depilacion.schema.json              # Hair removal specific fields
```

### Design Token Files
```
src/tokens/
  base.tokens.json                    # Shared spacing, breakpoints, animations
  peluqueria.tokens.json              # "Elegant Rose" + "Modern Copper"
  gimnasio.tokens.json                # "Energy Black"
  spa.tokens.json                     # "Serene Nature"
  unas.tokens.json                    # "Chic Minimal"
  tatuajes.tokens.json                # "Dark Studio"
  barberia.tokens.json                # "Classic Sharp"
  estetica.tokens.json                # "Clinical Luxury"
  maquillaje.tokens.json              # "Editorial Glam"
  depilacion.tokens.json              # "Clinical Clean"
```

### Registry Files
```
src/registry/
  index.json                          # Master registry of all types
  peluqueria.type.json                # Section composition + feature flags
  gimnasio.type.json
  spa.type.json
  unas.type.json
  tatuajes.type.json
  barberia.type.json
  estetica.type.json
  maquillaje.type.json
  depilacion.type.json
```

### Content Template Files
```
src/content/
  peluqueria.content.json             # Spanish copy with {{placeholders}}
  gimnasio.content.json
  spa.content.json
  unas.content.json
  tatuajes.content.json
  barberia.content.json
  estetica.content.json
  maquillaje.content.json
  depilacion.content.json
```

**Total: ~40 structured JSON files** to be created from the leads repo markdown.

---

*Analysis completed: April 2026*
*Source: paragu-ai-leads repository*
