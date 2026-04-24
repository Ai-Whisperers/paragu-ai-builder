# Visual Critique + Image Generation Plan — 2026-04-24

Fresh scroll-through screenshots (1440×full). Covers both tenants, every public page.

Legend: **P0** = break; **P1** = ugly; **P2** = polish; **IMG** = needs image.

---

## Cross-cutting bugs (both tenants)

| # | Bug | Evidence |
|---|-----|----------|
| **P0-A** | Empty section wrappers eating 400–1000px of blank scroll on half the pages. Most visible on ss-home, ss-combos, ss-envios, ss-garantia, ss-nosotros, ss-cambio, d-servicios, d-portafolio, d-privacidad. | Grey/dark slabs with nothing in them. |
| **P0-B** | Dayah cookie-consent card is docked to the **left of the hero** as a floating dark panel, not a bottom banner. Appears on 7/9 Dayah pages. | Small black card with "Rojetur tadas …" fragment next to the hero glass. |
| **P1-C** | Every hero on both tenants is a coloured gradient box. Zero photography. The gradient is pretty on Dayah, cheap on Superspuma. | `ss-*` blue→purple→orange; `d-*` dark→pink. |
| **P1-D** | Footer CTA strip (big gradient bar before the footer) is an orphan — repeats on every page with no content. | Visible on every tenant page. |
| **P2-E** | Header doesn't distinguish current page; no breadcrumbs. | All pages. |

---

## SUPERSPUMA — 13 pages

### ss-home
- **P0**: Category tabs render (Colchones / Resortes / …) but the **grid below is empty**. `ProductCatalogSection` rendering 6 gray skeleton boxes, not the 23 hot-linked products that exist in `content/es.json`. Biggest single bug on the site.
- **P0**: ~2000px of pure empty grey between FAQ and the next slab.
- **P1**: Hero image — currently the 2XL sleep image barely peeks out. Resize/crop, bring the bed forward, reduce dark overlay.
- **P1**: "Promo World y Pagá 2026" ticker looks like a bug bar, not a deal strip.
- **P2**: Trust-badges row has fine icons but the spacing is cramped against the ticker.
- **IMG needed**: 1 hero bed photo, 6 product tile fallbacks.

**Prompt — hero bed (high-res, 2400×1200):**
> Soft morning light in a serene Paraguayan middle-class bedroom. A low-profile upholstered bed with a pristine white Superspuma mattress and crisp linen bedding. Clay-earth wall, one terracotta-coloured throw, woven palo-santo side table, a single ceramic cup. Shot at eye level on 35mm, shallow depth of field, window light raking across the linen. Photorealistic, warm 5000K white-balance, subtle film grain. No text, no watermark. Composition leaves the right third empty for copy overlay.

### ss-financiacion
- **P0**: After the tier-calculator cards there's 1200px of empty space before the bank logo grid. The calculator and payment-methods sections lost their render.
- **P1**: Bank grid is text-only ("Itaú / Visión Banco / …"). Needs square logo tiles.
- **P2**: CTA buttons in the 3 pay-options cards share the same style; differentiate cash/credit/cuotas.
- **IMG needed**: 12 bank logos (vector), 1 hero "pocket-money" illustration.

**Prompt — bank logo tiles:** do NOT generate; download official SVGs from each bank's press kit. Itaú PY, Banco Familiar, Visión Banco, Banco Continental, Banco Atlas, Sudameris, Interfisa, Ueno, Regional, BASA, Banco Nacional de Fomento, GNB.

### ss-promociones
- Actually the cleanest page on the site. Keep.
- **P2**: Hero reads "Promociones vigentes" on a mauve gradient — add a thin overlay of overlapping price-tags in the background at 8% opacity to give it character.
- **IMG**: 1 hero background (optional).

**Prompt — promo hero bg:**
> Flat geometric pattern of overlapping paper price tags and percent-off rosettes, in navy and coral with white accents, evenly distributed across a 2400×800 canvas, subtle noise texture. Print-poster aesthetic, 5% opacity-ready (can be overlaid under a gradient). No numbers, no words.

### ss-combos
- **P0**: After the 3 combo cards, ~1000px of empty white, then FAQ, then another dead zone before footer. Two empty section containers in a row.
- **P1**: "Tres combos más pedidos" but only price tags, no imagery. Combo = bed + mattress + pillow, so show them.
- **IMG needed**: 3 combo still-life photos.

**Prompt — combo stills (shared style, 1200×900 each, 3 variants):**
> Clean studio still-life, white seamless backdrop with soft shadow: a twin mattress stacked on a wooden bed base, a folded duvet, two pillows. Slight overhead 3/4 angle. Cold daylight with one warm rim-light. One variant shows a **Esencial** (simple grey), one shows **Confort** (linen beige), one shows **Imperial** (dark navy and walnut wood). No props, no text, no brand marks. Commercial catalogue style.

### ss-guias
- Decent. Firmness scale renders. "Espuma vs Resorte" table works.
- **P1**: The four circular "Espuma vs Resorte" icons are generic glyphs — replace with diagrams.
- **P2**: Empty white slab between FAQ and footer.
- **IMG needed**: 4 diagrammatic icons (Firmeza, Espesor, Peso, Sueño caliente/frío).

**Prompt — icon set (monochrome line, 512×512 each):**
> Four flat line-art icons in navy on white, 2px stroke, same visual weight: 1) mattress side-view with 5 horizontal compression marks (firmness), 2) mattress side profile with a tape-measure on the left edge (thickness), 3) stacked mattress on a scale (weight), 4) thermometer next to a mattress with a sun and moon split (sleep temperature). Flat, no shadow, no text.

### ss-tiendas
- **P0**: Only 4 store cards visible in row 1. Copy says "7 tiendas + 6 centros logísticos" → grid renders just 4 then 600px of empty, then the generic trust-badges repeat.
- **P0**: No map of the country showing store pins.
- **IMG needed**: 1 Paraguay map illustration.

**Prompt — Paraguay map with store pins (1600×1200):**
> Minimalist political map of Paraguay with department borders in light grey, rivers in a soft cyan, major cities labeled in a small sans-serif. Seven coral pin-markers placed on Asunción (x3), Luque, Fernando de la Mora, Villa Elisa, and Lambaré. Six smaller light-grey dots for logistics centres across the Chaco and eastern region. Flat vector style, no topography, white background. Top-down view, no decorative compass.

### ss-envios
- **P0**: "Cobertura por zona" header exists but the section below is completely blank — missing zones grid or map.
- **P1**: FAQ renders with filters (Tiempos, Costos, Retiro viejo, …) but category tabs push the first Q below the fold.
- **IMG needed**: 1 delivery-truck/route illustration OR reuse the Paraguay map above with delivery tier overlays.

**Prompt — delivery zones overlay (reuse map above, add 3 tinted regions):**
> Over the Paraguay map, add three semi-transparent region fills: 1) **Zona 1 – Asunción metro** in coral at 20% opacity, 2) **Zona 2 – Central + Alto Paraná + Itapúa** in amber at 15% opacity, 3) **Zona 3 – Chaco + Norte** in sand yellow at 10% opacity. Small legend bottom-right.

### ss-garantia
- **P0**: "Qué cubre / Qué no" 2-column grid is rendered but only visible as grey silhouettes — the cards lost their white surface.
- **P2**: The "Respaldo de fábrica paraguaya" hero is pure gradient again. Put a picture of the factory/a craftsman.
- **IMG needed**: 1 factory/craftsman shot.

**Prompt — craftsman (1600×1000):**
> Documentary photograph inside a Paraguayan mattress factory. A worker in a grey polo rolling/stitching a white mattress cover on a long industrial table. Warm overhead fluorescent mixed with natural window light. Background shows stacked foam blocks and a QR-coded label dispenser. Clean, honest, no staged-smile. Shot with 50mm, slight shallow depth of field. Real workplace — not a stock-photo smile.

### ss-nosotros
- **P1**: 6-image interior gallery is great (actually lifestyle bedrooms) — this is the ONE good photo grid on the site. Mirror this layout on ss-home.
- **P0**: 800px empty between gallery and footer.
- **P2**: "49 años" stat is fine but `+100 colaboradores / +250 madereras`-style metrics should animate-count.
- **IMG needed**: 0 new (gallery works).

### ss-cambio
- **P1**: Four-step process renders, but steps 3 and 4 are cut off by the empty container below.
- **P0**: Between process and form, ~800px of dead space.
- **IMG needed**: 1 hero image or small illustration of "old mattress rolled up → new one in shrink-wrap".

**Prompt — trade-in hero (1600×800):**
> Side-by-side split-frame photograph: left panel a tired old mattress rolled and tied with twine in a grey garage; right panel a pristine white Superspuma mattress wrapped in transparent plastic being carried into a bright apartment by two workers in orange polos. Natural daylight on both sides, subtle desaturation on the left panel and full colour on the right. No text.

### ss-terminos
- Clean, categorical filter tabs work.
- **P2**: Hero gradient again — add a paper/document texture at 5%.
- **IMG**: none needed.

### ss-privacidad
- Clean. Works.
- **P2**: Same hero fatigue.
- **IMG**: none needed.

### ss-promo-cart
- Participation form renders.
- **P0**: Too sparse. The promo is a trip for 10 people to Cartagena — needs imagery.
- **IMG needed**: 1 Cartagena hero.

**Prompt — Cartagena cruise hero (2400×1200):**
> Golden-hour aerial photograph of Cartagena de Indias, Colombia: colourful colonial rooftops, fortress walls, Caribbean sea on the right with a mid-sized cruise ship anchored offshore, palms in the foreground. Warm saturated colour, travel-magazine aesthetic. Leave the top-left quadrant less busy for overlay text "Promo Cartagena 2026". No logos.

---

## DAYAH LITWORKS — 9 pages

### d-home
- **P0**: Cookie-consent dark card is stuck to the left of the hero (not a bottom banner). Fixed-position CSS bug — `ConsentBanner` was absolutely positioned with wrong offset.
- **P1**: "Nuestros Servicios" shows 3 tiers — good — but after that a 600px dark void, then another section, then another void.
- **P2**: Process section's timeline dots are sized inconsistently.
- **IMG needed**: 1 portfolio-tile hero background, 3 book-cover visuals.

**Prompt — Dayah hero bg (2400×1200):**
> Cinematic editorial photograph of a weathered wooden writer's desk at dusk, top-down 45° angle. An open hardcover novel with a half-visible crimson-and-midnight-blue cover, a brass fountain pen, a stack of parchment pages, a steaming cup of black tea, a single matte-black hardcover book standing on its spine. Backlit by a window with soft golden hour light hitting only the right edge. Deep indigo and oxblood palette with cream highlights. Slight vignette, film grain, 35mm aesthetic. Very moody. Text-safe negative space on the left third. No book titles visible.

### d-servicios
- **P0**: Between the 3 Portadas cards and the 5 "Servicios adicionales" cards there's a 500px dark void.
- **P0**: Empty search-bar stub floats in a dark void near the bottom — that's a headless FAQ filter with no FAQ.
- **P1**: The two tier rows are visually disconnected — same brand, different card style.
- **IMG needed**: 3 mockup renders (eBook portada, Portada tapa blanda, Hardcover combo).

**Prompt — book-cover mockup set (1200×1600 each, portrait):**
> Three commercial product mockups on matching dark navy backdrop with soft top-down spotlight:
> 1) A sleek Kindle-like eReader device tilted 15°, screen showing a dramatic fantasy book cover with silver foil title "AURORA" over a shadowed forest illustration in crimson and midnight-blue.
> 2) A paperback book standing upright with dust-jacket wrapping, cover art showing a stormy coastline in oxblood and slate, title "EL ÚLTIMO FARO" in serif gold-foil.
> 3) A premium hardcover book in a slipcase next to a smaller matching eReader, both displaying coordinated cover art — a gothic castle silhouette in crimson/indigo, gold-leaf title "SOMBRAS EN EL ESPEJO".
> Studio product photography, sharp reflections on cover surfaces, no human hands. All three at identical camera height for use as a row. Negative space above each book for label badges. No author names, no publisher marks, no visible barcodes.

### d-catalogo
- 6 Premade cover cards work (atmospheric titles "Susurros del Bosque / Corazón de Cenizas …").
- **P0**: "Contactanos" section appears as orphan text at the bottom — the form didn't render.
- **P1**: Genre pills (Fantasía, Romance, Thriller) don't actually filter — they're static.
- **IMG needed**: 6 cover thumbnails matching the 6 existing titles.

**Prompt — 6 premade cover thumbnails (900×1350 each, portrait):**
Give Midjourney/DALL-E one prompt per cover — consistent series style:
> A book cover design, portrait 2:3 ratio. Dark moody atmospheric illustration in oxblood, midnight-blue, and cream. Centred serif title in gold-foil distressed texture. Small subtitle/tagline below title. Minimal author slug bottom-centre (use "DAYAH AUTOR"). Series style: painterly/digital-art, cinematic lighting, subtle paper grain overlay.
> Variants:
> 1. **SUSURROS DEL BOSQUE** (Fantasía) — ethereal moonlit pine forest, a lone figure with cloak, fog rising.
> 2. **CORAZÓN DE CENIZAS** (Romance dark) — a single wilting rose over charred pages, blood-drop accent.
> 3. **EL ÚLTIMO CÓDIGO** (Thriller) — cracked digital binary rain over a rain-soaked alley, neon-red glyph.
> 4. **GALAXIA INTERIOR** (Ciencia Ficción) — astronaut silhouette dissolving into a nebula of violets and golds.
> 5. **SOMBRAS EN EL ESPEJO** (Terror/psicológico) — a cracked antique mirror reflecting two different faces.
> 6. **ALAS DE CRISTAL** (Fantasía juvenil) — translucent crystalline wings catching prism light over a misty lake at dawn.

### d-portafolio
- 3 CTA cards render (Pedir muestra / Instagram / Catálogo Premade).
- **P0**: 800px of empty dark space before footer.
- **P1**: Hero copy says "clientes están publicando — estoy esperando permisos" — this is too humble. Rewrite as "Portafolio NDA-protegido" with an authority tone.
- **IMG needed**: 1 blurred/redacted portfolio grid.

**Prompt — NDA-protected grid (1600×1000):**
> A 3×3 grid of book covers on dark backdrop, each cover's artwork visibly present but the title/author text replaced with a horizontal grey bar (redaction style). Covers in varied genres: fantasy, romance, thriller, sci-fi, all tonally matching with deep reds, navies, golds. Each cover has a small "NDA-protected preview" watermark at bottom-centre in 10% white. Used as portfolio teaser that respects client confidentiality. Editorial publishing aesthetic.

### d-sobre
- Content rich, the best Dayah page. Keep.
- **P2**: Process timeline centres one card at a time — widen so all 3 tramos show at once on desktop.
- **IMG needed**: 1 Daihana portrait, 1 workspace shot.

**Prompt — Daihana portrait (1200×1600 portrait):**
> Editorial portrait of a woman in her 30s, South American features, shoulder-length dark hair, thoughtful but warm expression, wearing a rust-coloured turtleneck, seated at a dark wooden desk with an iMac showing Adobe Photoshop and a manuscript page beside it. Moody side-light from a window on the right, soft shadows, deep teal/navy wall behind. Shallow depth of field, 85mm, editorial colour grade. Real, non-stock, believable. Frame leaves room at top for a pull-quote overlay.

### d-blog
- Newsletter placeholder and 3 CTA cards work.
- **P2**: The empty blog grid should say "Próximamente — 3 posts en edición" to show activity, not just "Solo newsletter por ahora".
- **IMG needed**: none.

### d-contacto
- Contact form renders with all 10 fields.
- **P0**: Right column of the "Contactanos" section is **empty** (hours card is on the left, right side is blank dark). Should have a map OR a decorative atmospheric image.
- **P1**: The "Envío por WhatsApp" submit button has pink text on darker pink — contrast suspect.
- **IMG needed**: 1 atmospheric "stack of books / fountain pen" image for the empty right column.

**Prompt — contacto atmospheric (1200×900):**
> Flat-lay overhead: a stack of 5 hardcover novels in crimson/navy/cream, an open A5 hardcover notebook with handwritten Spanish cursive, a vintage brass fountain pen on the page, a sprig of dried lavender, a small brass key. Dark stained walnut wood backdrop. Moody side light, desaturated slightly, premium editorial look. No text, no brand marks.

### d-terminos
- **P1**: Only 4 clauses rendered ("Referencias previas / Días hábiles / Anticipo / Responsabilidad de revisión") — content has 7. Either deploy missed or content ref is stale. Check.
- **IMG needed**: none.

### d-privacidad
- **P0**: Page is nearly empty — "Política de privacidad" header + search bar + NO CLAUSES. Content file exists but the FAQ section has an empty `items` array or wrong key.
- **IMG needed**: none.

---

## Image-generation plan summary

| Tenant | Page | # Images | Priority | Notes |
|--------|------|---------:|----------|-------|
| ss | home | 7 | P0 | 1 hero + 6 product tiles |
| ss | financiacion | 12 | P1 | download bank logos, don't generate |
| ss | promociones | 1 | P2 | decorative bg |
| ss | combos | 3 | P0 | combo still-lifes |
| ss | guias | 4 | P1 | icon set |
| ss | tiendas | 1 | P0 | PY map with pins |
| ss | envios | 1 | P0 | zones overlay (reuse map) |
| ss | garantia | 1 | P1 | craftsman shot |
| ss | nosotros | 0 | — | gallery already good |
| ss | cambio | 1 | P0 | trade-in split-frame |
| ss | terminos | 0 | — | |
| ss | privacidad | 0 | — | |
| ss | promo-cart | 1 | P0 | Cartagena hero |
| d | home | 4 | P0 | hero + 3 sample covers |
| d | servicios | 3 | P0 | 3 mockup renders |
| d | catalogo | 6 | P0 | 6 premade covers matching titles |
| d | portafolio | 1 | P0 | NDA grid |
| d | sobre | 2 | P1 | portrait + workspace |
| d | blog | 0 | — | |
| d | contacto | 1 | P1 | atmospheric flat-lay |
| d | terminos | 0 | — | |
| d | privacidad | 0 | — | |

**Grand total: ~48 images** (12 of which are bank logos to download, not generate; ~36 AI-generatable).

---

## Priority fix queue (bugs, not images)

1. **Fix cookie-consent position** on every Dayah page (stuck to hero) — `P0-B`
2. **Fix ss-home product grid** not loading (23 products in content, 6 gray tiles shown) — `P0`
3. **Remove empty section wrappers** eating scroll on 10+ pages — `P0-A`
4. **Fix ss-tiendas grid** showing 4/7 stores — `P0`
5. **Fix ss-envios "Cobertura por zona" empty slab** — `P0`
6. **Fix ss-garantia cards losing white surface** — `P0`
7. **Fix d-privacidad empty FAQ body** — `P0`
8. **Fix d-catalogo orphan "Contactanos" text** (form not rendering) — `P0`
9. **Fix d-contacto right column empty** (add image or map) — `P0`
10. **Deploy missing d-terminos clauses** (4 shown, 7 expected) — `P0`
11. Replace every gradient hero with a real image — `P1`
12. Kill repeated "Promo World y Pagá 2026" ticker on non-relevant pages — `P2`

---

*Audit: 2026-04-24, Nyx. Sources: /tmp/shots-fresh/*.png (1440×full, scrolled to trigger animate-on-scroll).*
