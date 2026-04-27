# Complete Tenant Upgrade Plans

> Individual upgrade plans for each production tenant. Every issue identified, prioritized, and assigned a fix.

---

## 1. Alejandro Villamayor — Abogado (Investor Pass Specialist)

**Current score: 6/10 | Target: 9/10**

### Content Issues

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | **No lawyer photo** anywhere on the site | 🔴 CRITICAL | Add professional headshot to hero, about page, and OG image |
| 2 | **"consulta gratuita" used 5x on homepage** | 🟡 MAJOR | Vary CTA text: "Agendá una reunión", "Reservá tu lugar", "Programá una llamada" |
| 3 | **"primera consulta" used 3x** | 🟡 MAJOR | Replace 2 of 3 with "sin costo", "sin compromiso" |
| 4 | **"Te acompaño en cada etapa" — AI slop** | 🟡 MAJOR | Rewrite: "Analizo tu caso, te explico las opciones legales y definimos juntos el mejor camino" |
| 5 | **"con un enfoque estratégico y cercano" — cliché** | 🟢 MINOR | Replace with specific details about his approach |
| 6 | **"soluciones legales a medida" — template phrase** | 🟢 MINOR | Use "asesoría personalizada en derecho corporativo e inversiones" |
| 7 | **Stats counter +50/98% feel templated** | 🟡 MAJOR | Add real credentials: university name, CAP membership number, years practicing |
| 8 | **CTA banner phone number not clickable** | 🟢 MINOR | Add `tel:` link alongside WhatsApp |

### Structure Issues

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 9 | **Nav/Footer mismatch** | 🟢 MINOR | Footer has "Blog" missing from nav? Check and sync |
| 10 | **English OG image says "PARAGUAI BUILDER"** | 🟡 MAJOR | Generate separate OG images for EN site |
| 11 | **Blog posts need dates visible** | 🟢 MINOR | Check blog-index component renders dates |
| 12 | **Investor Pass comparison table not rendering** | 🟡 MAJOR | Debug content shape for features section |

### Priority Implementation
1. Add headshot (needs real photo)
2. Rewrite AI-generated template phrases
3. Vary CTA text
4. Fix OG images
5. Fix comparison table

---

## 2. Bufete Méndez — Estudio Jurídico

**Current score: 5/10 | Target: 8/10**

### Content Issues

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | **"servicio" used 27 times on homepage** | 🔴 CRITICAL | Replace 20+ with: asesoría, defensa, representación, gestión, consultoría, litigio, trámite |
| 2 | **"profesional" used 13x** | 🟡 MAJOR | Remove from all but essential context. Show credentials instead |
| 3 | **"experiencia" used 10x** | 🟡 MAJOR | Each attorney bio says "X años de experiencia" — vary the language |
| 4 | **CTA "Consulta Gratis" → `#contacto`** | 🔴 CRITICAL | Contact section has no form. Add quote-form or lead-form section |
| 5 | **"primera consulta" used 9x** | 🟡 MAJOR | Same problem. Vary text across hero, process, CTA, footer |

### Structure Issues

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 6 | **No attorney photos** | 🔴 CRITICAL | Add placeholder or real headshots. Remove team section if no photos |
| 7 | **Nav/Footer mismatch** | 🟢 MINOR | Footer has "Privacidad", "Términos" not in nav. Add or remove |
| 8 | **"Demo · pedí el tuyo" badge** | 🟡 MAJOR | Make smaller or remove for production-aimed sites |
| 9 | **No English version** | 🟢 MINOR | Add en.json for international clients |

### Priority Implementation
1. Fix CTA → contact form (add quote-form or lead-form section)
2. Replace "servicio" usage 27→5
3. Remove team section if no photos available
4. Vary CTA language
5. Attorney bio rewrite

---

## 3. Nüdo — Banda de Hardcore Metal

**Current score: 7/10 | Target: 9/10**

### Content Issues

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | **6 empty FAQ questions** | 🔴 CRITICAL | FAQ renders 6 blank items. Remove empty items or add real content |
| 2 | **Instagram feed has 0 posts** | 🟢 MINOR | Remove section or add real IG posts |
| 3 | **Shows page content not rendering** | 🟡 MAJOR | features section doesn't show venue data. Use proper content shape |
| 4 | **"hero.headline='NÜDO'"** | 🟢 MINOR | Hero is just the band name. No tagline in the actual hero data |

### Visual Issues

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 5 | **No band logo** | 🔴 CRITICAL | Header says "Nüdo" in plain text. Generate metal-style logo |
| 6 | **Hero has no visual weight** | 🟡 MAJOR | Add background image (blurred concert photo or album art) |
| 7 | **Gallery uses Unsplash stock photos** | 🟡 MAJOR | Replace with real band photos |
| 8 | **Spotify embed shows Related Artists** | 🟢 MINOR | Use Spotify playlist embed instead of artist page |

### Structure Issues

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 9 | **Footer missing "Galería" link** | 🟢 MINOR | Add Galería to footer.navLinks |
| 10 | **No English version** | 🟢 MINOR | Add en.json |

### Priority Implementation
1. Remove empty FAQ questions (delete them from content)
2. Add band logo to header (generated or real)
3. Fix shows page content rendering
4. Add hero background image
5. Remove empty Instagram feed

---

## 4. De Abasto a Casa — Meal Prep Service

**Current score: 5/10 | Target: 8/10**

### Content Issues

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | **"contactanos" used 4x** | 🟢 MINOR | Vary: "escribinos", "pedí tu plan", "coordiná tu compra" |
| 2 | **"servicio" used 5x** | 🟢 MINOR | Replace with "plan", "compra", "entrega", "prep" |
| 3 | **Testimonials still say "[cliente ilustrativo]"** | 🟡 MAJOR | Remove parenthetical tags completely |
| 4 | **No food photos** | 🟡 MAJOR | Add photos of prepared meals, produce, delivery |
| 5 | **"10% de descuento" with no mechanism** | 🟢 MINOR | Add coupon code field or "mention this page" note |

### Structure Issues

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 6 | **Contact page has empty address** | 🟡 MAJOR | "Dirección:" with nothing below. Add actual address or remove field |
| 7 | **No FAQ page** | 🟢 MINOR | FAQ only exists on homepage. Create dedicated faq page |
| 8 | **No blog** | 🟢 MINOR | Add meal prep tips, recipes, market guides |

### Priority Implementation
1. Fix contact page address field
2. Remove testimonial tags
3. Add food photos
4. Remove empty fields from contact

---

## 5. Nexa Paraguay — Relocation Services

**Current score: 8/10 | Target: 9/10**

### Content Issues

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | **"consulta gratuita" used 27x across site** | 🔴 CRITICAL | This is excessive for a premium ($2,900-$6,900) service |
| 2 | **"profesional" used 17x** | 🟡 MAJOR | The site already looks professional (photos, pricing, process). Don't say it |
| 3 | **"calidad" used 11x** | 🟡 MAJOR | Show quality through testimonials, not text |
| 4 | **Stats counter says "+500 familias" but hero says "250+ clientes"** | 🔴 CRITICAL | Conflicting numbers. Fix to be consistent |
| 5 | **Homepage too long (3+ scrolls)** | 🟢 MINOR | Move calculator to dedicated page, keep homepage focused |

### Structure Issues

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 6 | **Footer has 13+ links — too many** | 🟢 MINOR | Group by category with sub-headings |
| 7 | **3 CTAs on same page = redundant** | 🟢 MINOR | Keep 1 primary CTA above fold, 1 below |
| 8 | **Tax calculator default shows $60k savings** | 🟡 MAJOR | Default should be neutral. Show "calculate your savings" not "you save $60k" |

### Priority Implementation
1. Fix conflicting stats (+500 vs 250+)
2. Reduce "consulta gratuita" from 27x to 5x
3. Reduce "profesional" and "calidad" usage
4. Group footer links

---

## 6. Nexa Propiedades — Real Estate

**Current score: 5/10 | Target: 7/10**

### Content Issues

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | **"servicio" used 9x** | 🟢 MINOR | Replace with "propiedad", "inmueble", "operación" |
| 2 | **5 pages, 8KB total content** | 🔴 CRITICAL | Very thin. Need property listings, neighborhood guides |
| 3 | **No property photos** | 🔴 CRITICAL | Real estate site with zero property images |

### Structure Issues

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 4 | **No blog** | 🟢 MINOR | Real estate blogs are proven lead gen |
| 5 | **Footer doesn't link to Nexa Paraguay** | 🟡 MAJOR | Cross-sell opportunity. Add link to relocation service |
| 6 | **OG card says "PARAGUAI BUILDER"** | 🟡 MAJOR | Regenerate OG without template branding |

### Priority Implementation
1. Add property photos
2. Link to Nexa Paraguay in footer
3. Regenerate OG images

---

## 7. Fun4Me — Adult Store

**Current score: 5/10 | Target: 7/10**

### Content Issues

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | **9 empty FAQ questions** | 🔴 CRITICAL | FAQ renders 9 blank items. Remove all empty |
| 2 | **No product images** | 🔴 CRITICAL | Ecommerce site with zero product photos |
| 3 | **"contactanos" 5x, "escribinos" 5x** | 🟢 MINOR | Vary CTA text |
| 4 | **"experiencia" 5x, "calidad" 7x, "atencion" 7x** | 🟡 MAJOR | Redundant. Show, don't tell |

### Structure Issues

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 5 | **Nav and footer are COMPLETELY different sets** | 🔴 CRITICAL | Nav has 6 items, footer has 10. Sync them. Decide which pages exist |
| 6 | **No age gate** | 🔴 CRITICAL | Legal requirement for adult content. Add age-gate section to page configs |
| 7 | **No discreet shipping messaging** | 🟡 MAJOR | Add "envío discreto" badge prominently |
| 8 | **English version missing** | 🟡 MAJOR | Adult stores have international customers |

### Priority Implementation
1. Remove empty FAQ questions
2. Add age-gate section to page.json
3. Sync nav and footer
4. Add discreet shipping messaging

---

## 8. Dayah Litworks — Graphic Design

**Current score: 7/10 | Target: 8/10**

### Content Issues

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | **12 empty FAQ questions** | 🔴 CRITICAL | 12 blank accordion items. Most broken FAQ |
| 2 | **"profesional" used 16x** | 🟡 MAJOR | A designer's portfolio should show, not tell |
| 3 | **"servicio" used 14x** | 🟡 MAJOR | Replace with: "diseño", "proyecto", "trabajo", "portafolio" |
| 4 | **No portfolio images in gallery** | 🔴 CRITICAL | A graphic design site with zero design samples |

### Structure Issues

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 5 | **Nav/Footer mismatch** | 🟢 MINOR | Nav has "Catálogo", footer has "Portafolio" — same thing, different name |
| 6 | **No blog** | 🟢 MINOR | Design tips, case studies would be great content |
| 7 | **OG card says "PARAGUAI BUILDER"** | 🟡 MAJOR | Should show actual design work |

### Priority Implementation
1. Remove empty FAQ questions
2. Add portfolio images
3. Fix nav/footer sync (Catálogo vs Portafolio)
4. Regenerate OG images

---

## 9. Granja Cabral — Egg Farm

**Current score: 6/10 | Target: 8/10**

### Content Issues

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | **"calidad" used 15x** | 🟡 MAJOR | Farm produce should be shown, not described as "calidad" |
| 2 | **No social media links in footer** | 🟡 MAJOR | Farm content thrives on Instagram |

### Structure Issues

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 3 | **No blog** | 🟡 MAJOR | Recipes, chicken care, farm life — natural SEO content |
| 4 | **No Instagram section** | 🟢 MINOR | Add instagram-feed section with farm photos |
| 5 | **OG card says "PARAGUAI BUILDER"** | 🟡 MAJOR | Should show farm, eggs, or products |

### Priority Implementation
1. Add social media links to footer
2. Regenerate OG images
3. Add Instagram link

---

## 10. SuperSpuma — Mattress Store

**Current score: 7/10 | Target: 8/10**

### Content Issues

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | **"escribinos" used 8x, "calidad" 9x, "servicio" 7x** | 🟡 MAJOR | Vary messaging across pages |
| 2 | **No product photos** | 🔴 CRITICAL | 17 pages, 0 mattress photos. Retail sin |

### Structure Issues

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 3 | **Nav and footer are COMPLETELY different** | 🔴 CRITICAL | Nav: Guía/Envíos/Garantía/Catálogo/Nosotros/Financiación/Tiendas. Footer: Contacto/Tienda/Combos/FAQ. Doesn't match |
| 4 | **No social links** | 🟡 MAJOR | Retail chain without Instagram |
| 5 | **OG card says "PARAGUAI BUILDER"** | 🟡 MAJOR | Should show store or product |

### Priority Implementation
1. Sync nav and footer
2. Add product photos
3. Regenerate OG images
4. Add social media links

---

## 11. StoicFinch — Data Consulting (Canada)

**Current score: 7/10 | Target: 8/10**

### Content Issues

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | **0 images across 34 pages** | 🔴 CRITICAL | No team photos, no data viz examples, no office photos |
| 2 | **No client logos** | 🔴 CRITICAL | Data consultants need client logos for credibility |

### Structure Issues

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 3 | **Blog section exists but shows "No posts yet"** | 🔴 CRITICAL | Remove blog section or add content |
| 4 | **OG card says "PARAGUAI BUILDER"** | 🟡 MAJOR | Should show brand identity |

### Priority Implementation
1. Remove or fix blog section
2. Regenerate OG images (no "PARAGUAI BUILDER")
3. Add logo-strip section for client logos (even placeholder)

---

## Cross-Tenant Issues (Fix Once, Benefit All)

| # | Issue | Fix | Affected Sites |
|---|-------|-----|---------------|
| A | **OG cards say "PARAGUAI BUILDER"** | Regenerate all OG images without platform branding | 9 sites |
| B | **Empty FAQ questions** | Automated script to detect and remove empty items from content JSON | Nüdo, Fun4Me, Dayah |
| C | **AI template phrases** | Create content rewrite checklist: do not use "acompaño", "estratégico", "cercano", "transparente" | Alejandro (mostly) |
| D | **"consulta gratuita" overuse** | Content guideline: max 2 uses per page | Alejandro, Nexa Paraguay, Bufete |
| E | **No nav/footer sync validation** | Create script that compares nav items vs footer.navLinks and warns | All sites |

---

## Estimated Effort

| Tier | Time | Sites |
|------|------|-------|
| 🔴 Critical fixes (empty FAQ, nav/footer, OG branding, photos) | 4 hours | All 11 sites |
| 🟡 Major fixes (content rewrite, vary CTAs, add sections) | 8 hours | Alejandro, Bufete, Nexa PY, Fun4Me, Dayah |
| 🟢 Minor fixes (blog, social links, polish) | 4 hours | All 11 sites |
| **Total** | **16 hours** | **11 production tenants** |
