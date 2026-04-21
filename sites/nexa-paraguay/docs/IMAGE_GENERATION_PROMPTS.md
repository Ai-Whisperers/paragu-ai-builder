# Nexa Paraguay — Image Generation Prompt Library

> Ready-to-paste prompts for generating every image Nexa Paraguay needs, tuned for Antigravity, Cursor's image tools, Imagen 3, Flux.1, Midjourney v6+, DALL·E 3. Ordered by launch priority (P0 → P3).
>
> **Ethics note.** Prompts tagged 👤 produce human likenesses. Use AI output only as **temporary placeholders**. Before production, replace with photographs of real consented people (team, clients). AI-generated faces in testimonials would be a GDPR + consumer-trust problem — see `/privacidad` section F in `STAKEHOLDER-QA.md`.
>
> **Related asset catalogs** (distribution-layer indexes, not prompts):
> - [`SOCIAL_ASSETS.md`](./SOCIAL_ASSETS.md) — 6 generic social templates + multilingual caption seeds.
> - [`ADS_ASSETS.md`](./ADS_ASSETS.md) — 22 paid-ad creatives across Meta, LinkedIn, Google Display and YouTube.
> - [`TESTIMONIALS_GATING.md`](./TESTIMONIALS_GATING.md) — how to unlock the testimonials feature once real consented photos replace the placeholders.

---

## How to use this file

1. Copy a prompt as-is into your image tool.
2. Append the **Style block** (below) to every prompt — it keeps the whole set visually coherent.
3. Set the aspect ratio to the value in the prompt (`--ar 3:2`, `aspect_ratio: "16:9"`, or the equivalent in your tool).
4. Apply the **Universal negative prompt** to every generation.
5. Save to `sites/nexa-paraguay/images/<bucket>/<filename>` — filenames are given per prompt.
6. Generate in JPG + WebP at the spec in `docs/IMAGE_GENERATION_PROMPTS.md § Technical specs`.

---

## Style block (append to every prompt)

```
Editorial commercial photography, shot on Sony A7 IV with 35mm f/1.8 lens, natural daylight
with soft bounce fill, shallow depth of field where appropriate, slight film grain,
color-graded to a restrained navy-and-champagne palette (deep navy #1B2A4A in shadows,
warm champagne #C9A96E in highlights, neutral whites), institutional but warm mood,
European real-estate / private-banking aesthetic, high resolution, tack sharp, no text overlays,
no logos on subjects, no watermark.
```

## Universal negative prompt

```
cartoon, anime, illustration, 3D render, CGI, painting, oversaturated colors,
HDR halos, lens distortion, fisheye, heavy vignette, blurry, low resolution, jpeg artifacts,
watermark, signature, text, typography, captions, stock-photo cheesy smiles, plastic skin,
deformed hands, extra fingers, six fingers, distorted faces, asymmetric eyes, double teeth,
fake-looking teeth, 1990s stock photography, clipart, emoji, neon colors, red green neon,
dutch angle, motion blur, tilt-shift effect, miniature effect, vertical letterboxing,
frame border, instagram filter look, grainy VHS.
```

## Aspect-ratio cheat sheet

| Use | Ratio | Midjourney | DALL·E / Imagen |
|---|---|---|---|
| Desktop hero | 12:7 | `--ar 12:7` | "1792×1024" |
| Mobile hero | 9:16 | `--ar 9:16` | "1024×1792" |
| Section / pillar | 3:2 | `--ar 3:2` | "1536×1024" |
| Process step | 4:3 | `--ar 4:3` | "1344×1024" |
| Blog cover | 16:9 | `--ar 16:9` | "1792×1024" |
| Team portrait | 4:5 | `--ar 4:5` | "1024×1280" |
| OG share | 1200:630 | `--ar 1200:630` | "1200×630" |
| Square | 1:1 | `--ar 1:1` | "1024×1024" |

---

# 🔴 P0 — Launch-blocking (20 images)

## Brand identity (items 1–6)

> For items 1–6 use a **vector-first tool** (logo generator, Figma, Illustrator). AI raster generators are poor for crisp logos. Prompts here produce *concept references* you can vectorize.

### 1. `brand/logo.svg` — Primary logo (horizontal)
Aspect: 5:2

```
Minimalist wordmark logo concept "Nexa Paraguay", two words stacked or horizontal,
serif capital "N" in Playfair Display paired with modern sans body, deep navy #1B2A4A
on pure white background, optional thin champagne #C9A96E accent (a single stroke or dot),
institutional finance-firm aesthetic, flat vector style, crisp edges, generous negative space,
centered, professional, timeless, high contrast. No photographic elements, no gradients,
no 3D effects. Logomark only, no tagline.
```
**Deliverable:** vectorize the chosen concept; export SVG + 2048px transparent PNG.

### 2. `brand/logo-dark.svg` — Monochrome white
Aspect: 5:2

Same prompt as #1, swap the navy for pure white `#FFFFFF`, background transparent. Used on hero overlay and dark CTA banners.

### 3. `brand/logo-icon.svg` — Icon-only mark
Aspect: 1:1

```
Minimalist monogram icon for "Nexa Paraguay", a single glyph combining the letter N with
a subtle compass-point or arch reference (a bridge, a doorway) that hints at relocation
without being literal, navy #1B2A4A on white, flat vector, geometric, symmetrical,
fits inside a 512×512 circle safe area, works as a 16×16 favicon, timeless wordless mark.
```

### 4. `brand/favicon.ico` — Favicon
Multi-res 16/32/48 from #3.

### 5. `brand/apple-touch-icon.png` — iOS home-screen icon
180×180 PNG from #3, navy background rounded square.

### 6. `brand/maskable-512.png` — PWA maskable
512×512 PNG from #3, with content inside 80% safe area, navy background fill.

---

## Hero (items 7–8)

### 7. `hero/hero-bg.jpg` — Home hero (desktop)
Aspect: 12:7 · 2400×1400 · ≤250 KB WebP

```
Wide cinematic photograph of the Asunción Paraguay skyline at late golden hour,
shot from the Costanera riverside looking back at the city, modern high-rise towers
(Torres del Paseo, Torre Pacífico silhouettes) rising over the Paraguay River,
warm amber and deep navy-blue sky gradient, a few lit windows beginning to glow,
pristine cloudless evening, no visible people or cars in foreground,
negative space on the upper left for headline text, professional travel-editorial quality,
reminiscent of Monocle magazine, Conde Nast Traveler. The mood is institutional,
prosperous, calm, inviting — not touristy, not flashy.
```
Append **Style block** + **Universal negative**.

### 8. `hero/hero-bg-mobile.jpg` — Home hero (mobile)
Aspect: 9:16 · 828×1100

Same scene as #7, re-composed vertically. Place the skyline in the lower third and the sky occupying the upper two-thirds so headline text overlays clean sky.

---

## Why Paraguay pillars (items 9–11)

### 9. `why-paraguay/economic.jpg` — Economic environment
Aspect: 3:2 · 1600×1000

```
Ground-level photograph of a modern glass-and-steel business district in Asunción Paraguay
at mid-morning, three mid-rise office towers in the background with clean contemporary
architecture, a wide avenue in the foreground with healthy jacarandá trees in bloom
(purple flowers are in-character for Asunción), one or two sharply-dressed professionals
walking with briefcases seen from behind or in profile (no visible faces), soft diffused
overcast-but-bright light, architectural photography composition, symmetrical or
one-point-perspective, Latin American urban but prosperous and well-kept, clean streets.
```

### 10. `why-paraguay/investment.jpg` — Investment opportunities
Aspect: 3:2 · 1600×1000

```
Elevated drone-style photograph of a premium residential development in Villa Morra or
Carmelitas, Asunción, showing a mix of modern mid-rise condominiums with landscaped
grounds, a swimming pool visible from above, palm trees, warm late-afternoon light
casting long shadows, golden hour. Subtropical but refined, reminiscent of Punta del Este
or Miami Brickell but with distinctly Paraguayan flora (lapacho trees, palm, jacaranda).
No text, no signs, no branded buildings.
```

### 11. `why-paraguay/lifestyle.jpg` — Quality of life
Aspect: 3:2 · 1600×1000

```
Lifestyle photograph of the Lake Ypacaraí shoreline at San Bernardino Paraguay,
soft morning light, a wooden pier extending into calm water, two adults mid-30s to 40s
seated on a café terrace in the foreground blurred (over-shoulder framing, no faces),
tereré drink vessel visible on the table as a subtle cultural signal, tropical trees,
gentle blue water, warm champagne light, European-expat-friendly atmosphere,
calm and upscale but unpretentious.
```

---

## Process timeline (items 12–16)

### 12. `process/consultation.jpg` — Step 1: Initial consultation
Aspect: 4:3 · 1200×900 · 👤

```
Over-the-shoulder photograph of a consultant in her mid-30s in a smart navy blazer
sitting at a modern minimal desk, facing a laptop with a video-call interface visible
but blurred, a notebook and champagne-colored coffee mug next to the laptop, window
with soft natural light on the left, clean Scandinavian-meets-Latin home office aesthetic,
plants in the background, warm and professional. Subject seen only from the back and side
(no face visible).
```

### 13. `process/documents.jpg` — Step 2: Document validation
Aspect: 4:3 · 1200×900

```
Close-up photograph of hands (adult, neutral skin tone, no jewelry) placing an apostilled
international document onto a stack of passports and folders on a dark wooden desk,
a silver embosser or notary seal visible in the top-right corner, shallow depth of field
with the near document tack-sharp, warm side-light from a window, very subtle champagne
glow, institutional but human, no visible text on documents (blurred or generic stamps),
no visible country names or personal data.
```

### 14. `process/arrival.jpg` — Step 3: Operational day (arrival in Paraguay)
Aspect: 4:3 · 1200×900 · 👤

```
Warm reportage photograph inside the arrivals hall of Silvio Pettirossi International
Airport Asunción or a stylized equivalent, a well-dressed male traveler mid-40s with a
small leather carry-on seen from behind walking toward a welcoming figure in a navy
blazer holding a discreet tablet (no visible logo), soft overhead airport lighting warmed
in post, clean modern terminal architecture, sense of a calm coordinated pickup,
no crowds, no visible airline branding.
```

### 15. `process/banking.jpg` — Step 4: Company & banking
Aspect: 4:3 · 1200×900

```
Editorial interior photograph of a private-banking-style meeting room, a polished
dark-wood conference table with two leather chairs, a leather folder and a silver fountain
pen resting on the table, large window behind with soft diffused daylight, tropical
foliage just visible outside suggesting Asunción, palette restricted to navy, champagne,
white and warm wood tones, no visible bank logos or brand marks, no people in frame,
architectural interior photography composition.
```

### 16. `process/completion.jpg` — Step 5: Delivery & follow-up
Aspect: 4:3 · 1200×900 · 👤

```
Waist-level photograph of a handshake between two adults across a desk, one wearing a
navy blazer, the other a champagne-cream blouse, a leather folder and a Paraguayan
cédula-sized card lying on the desk between them (no legible text on card),
natural window light from the left, shallow depth of field, warm and professional,
no visible faces (cropped at neck), communicates "deal closed, documents delivered".
```

---

## Social / SEO share cards (items 17–19)

These are **better generated as Next.js `opengraph-image.tsx`** (programmatic + brand-consistent) than with AI, but AI prompts provided as a fallback:

### 17. `brand/og-default.jpg` — Open Graph share
Aspect: 1200:630

```
Brand graphic in 1200×630, split-diagonal composition: left two-thirds a deep navy
#1B2A4A solid field containing the "Nexa Paraguay" wordmark in Playfair Display white,
right third a softly blurred photograph of the Asunción skyline at golden hour, thin
champagne #C9A96E hairline diagonal separating the two halves, generous padding,
typographic-first editorial layout, no other text, no icons.
```

### 18. `brand/twitter-card.jpg` — Twitter summary large image
Aspect: 16:9 · 1200×675

Same prompt as #17 reframed to 16:9.

### 19. `brand/whatsapp-square.jpg` — WhatsApp / square link preview
Aspect: 1:1 · 400×400

```
Square brand tile, deep navy #1B2A4A background, centered white Playfair Display wordmark
"Nexa Paraguay" with a thin champagne #C9A96E underline, flat, typographic-only,
generous margins, no photography, no icons.
```

---

## Placeholder fallback (item 20)

### 20. `brand/placeholder.svg` — Branded gradient fallback
Aspect: 3:2

```
Abstract vector gradient, smooth linear gradient from deep navy #1B2A4A top-left to
champagne #C9A96E bottom-right, very subtle grain texture overlay, a single thin
white diagonal line crossing the frame at 20° as a brand device, no text, no logo,
flat SVG-suitable, serves as neutral fallback when a photograph is missing.
```

---

# 🟠 P1 — Credibility lift (25 images)

## Team portraits (items 21–26) 👤

> ⚠️ **Use AI only for staging/mockups.** Ship real portraits before the "About" page goes live. AI-faced team members is a legal and trust risk.

**Shared portrait system (append to each portrait prompt for consistency):**

```
Environmental portrait, waist-up framing, 85mm lens, shallow depth of field, eye-level,
soft natural window light from camera-left, subject standing or leaning against a warm
neutral wall, slight smile or composed neutral expression, sharp focus on the eyes,
muted background with a hint of navy or champagne tone, editorial LinkedIn / TIME magazine
quality, consistent color grade across the series.
```

### 21. `team/operations-director.jpg` — Operations Director (Paraguay)
Aspect: 4:5 · 800×1000 · 👤

```
Paraguayan professional, male, 45–55, short dark hair with light grey at temples,
clean-shaven or short trimmed beard, wearing a navy suit jacket over open-collar white
shirt, standing in a warm modern Asunción office interior with bookshelves and a window
showing tropical foliage behind him, confident and approachable.
```
Append portrait system + style block + negative.

### 22. `team/commercial-director.jpg` — Commercial Director (Europe)
Aspect: 4:5 · 800×1000 · 👤

```
European professional, female, 35–45, shoulder-length blonde or chestnut hair,
wearing a cream champagne-tone blouse under a structured blazer, standing in a minimal
Amsterdam-style office with a large window behind her, faint canal-house rooflines blurred
outside, composed and warm.
```

### 23. `team/legal-lead.jpg` — Legal Lead
Aspect: 4:5 · 👤

```
South American professional, male or female 40–55 (choose one), formal dark suit,
standing next to a wall with framed legal certificates (blurred, no legible text),
glasses, serious-but-approachable expression, law-firm interior.
```

### 24. `team/accounting-lead.jpg` — Accounting Lead
Aspect: 4:5 · 👤

```
Paraguayan professional, any gender 35–50, wearing a smart sweater or blouse in champagne
tone, standing near a window with a modern bookshelf of reference books behind,
neutral friendly expression, accountancy-firm aesthetic.
```

### 25. `team/client-success.jpg` — Operations / Client Success
Aspect: 4:5 · 👤

```
Bilingual client-facing professional 28–38, casual-smart attire (no tie, linen shirt or
knit top), warm broad smile, standing in a coworking-style office with plants and warm
wood, approachable and energetic.
```

### 26. `team/group-shot.jpg` — Team group portrait
Aspect: 5:3 · 2000×1200 · 👤

```
Group editorial photograph of 5 professionals (mix of ages 30–55, mix of European and
South American, mix of genders) standing together in a warm modern office reception area,
all dressed in the navy-champagne palette, cohesive styling, front-lit by large windows,
relaxed but professional arrangement (no rigid lineup), subtle eye-contact with the camera
from 2–3 of them while the others are in casual conversation, Monocle magazine team-photo
aesthetic.
```

---

## Office & operations B-roll (items 27–31)

### 27. `office/exterior.jpg` — Asunción office exterior
Aspect: 3:2

```
Street-view photograph of a small boutique professional office building on a leafy street
in Villa Morra or Carmelitas Asunción, two-story modern facade with floor-to-ceiling
glass on the ground floor, lapacho trees framing the shot, discreet signage area visible
but blank (no readable brand), late-morning light, clean sidewalk, one parked vehicle
acceptable in frame, upscale professional-services district aesthetic.
```

### 28. `office/meeting-room.jpg` — Consultation in progress
Aspect: 3:2 · 👤

```
Editorial interior photograph of a warm modern meeting room with a round light-oak table,
four people seated around it mid-conversation (seen mostly from behind and side, no faces
identifiable), a laptop and leather folder visible on the table, large window with soft
daylight, potted plant in the corner, sense of quiet engaged discussion, no visible screens
with branded content.
```

### 29. `office/signing.jpg` — Notary / signing scene
Aspect: 3:2

```
Close-up photograph of two pairs of hands meeting over a notarized document on a
polished dark-wood desk, one hand holding a silver fountain pen, the other flat next to
an embossed red wax-seal-style stamp (generic, no legible text), a leather folder open
behind the document, shallow depth of field, warm dramatic side-light, institutional
solemnity.
```

### 30. `office/team-huddle.jpg` — Whiteboard moment
Aspect: 3:2 · 👤

```
Three professionals in smart-casual attire standing around a glass whiteboard filled
with abstract workflow diagrams (unreadable intentionally, not real text), one person
gesturing toward the board, seen in side profile, the others listening, warm office
lighting, modern but lived-in office, collaborative energy, no visible proper nouns
on the board.
```

### 31. `office/reception.jpg` — Reception / welcome desk
Aspect: 3:2

```
Warm interior photograph of a small reception area in a boutique professional office,
a curved light-oak desk with a small discreet brand-area (blank), a pair of designer
leather armchairs in navy with champagne throw cushions on a cream rug, a large
tropical plant in the corner, morning light through tall windows, no people in frame,
Kinfolk-magazine interior aesthetic, inviting and upscale.
```

---

## Trust & credentials (items 32–35)

### 32. `trust/migraciones.jpg` — Migraciones Paraguay context
Aspect: 3:2

```
Respectful architectural photograph of an official-looking Latin American government
building facade (generic, not the actual Migraciones logo), neoclassical or mid-century
institutional architecture, a Paraguayan flag red-white-blue visible atop the building
subtly blurred, clear blue sky, shot from across the plaza, civic and credible,
no license plates, no identifiable people.
```

### 33. `trust/cedula-in-hand.jpg` — Paraguayan cédula close-up
Aspect: 3:2

```
Macro close-up of a generic ID-card-sized plastic card held between thumb and forefinger
at a 30° angle, intentionally blank-faced (no photo, no name, no numbers visible —
the card is a stand-in), the background softly out of focus showing a warm wooden desk
and a leather folder, a subtle red-white-blue flag-tone hint along the top stripe of the
card, representational not literal.
```

### 34. `trust/company-certificate.jpg` — Company registration document
Aspect: 3:2

```
Overhead flat-lay photograph of a fictional corporate registration certificate on
heavy textured paper, generic seal bottom-right (no country-specific text, no legible
words beyond elegant calligraphic flourishes), a silver pen and a small leather
portfolio placed diagonally, a small lapacho flower as accent, warm even lighting,
editorial document-photography aesthetic, document intentionally unreadable.
```

### 35. `trust/registry-exterior.jpg` — Commercial registry building
Aspect: 3:2

```
Civic-architecture photograph of a government registry building exterior, Latin American
mid-century institutional style, stone or concrete facade with deep cornices, clean
symmetrical composition, warm late-afternoon light, a well-kept plaza in front with
palm trees, a sense of formal reliability and public record, no signage legible.
```

---

## Blog covers (items 36–45)

All blog covers: **Aspect 16:9 · 1600×900** · append style block + negative.

### 36. `blog/residencia-2024.jpg` — "Guía completa: residencia en Paraguay 2024"
```
Editorial still-life: a generic blue passport open to a blank page, a blank ID-card-
sized plastic card laid across it, a silver ballpoint pen diagonal, a small Paraguayan
flag fabric swatch in the corner, all on a warm wooden desk surface, moody directional
light, shallow DoF, symbolism of residency.
```

### 37. `blog/comparativa-fiscal.jpg` — "Paraguay vs Uruguay fiscal"
```
Split-frame composition: left half a skyline silhouette of Asunción at golden hour,
right half a skyline silhouette of Montevideo at blue hour, a thin champagne vertical
divider between them, a subtle "10% / 25%" typographic treatment suggested in negative
space but not rendered as legible text, editorial infographic-photographic hybrid.
```

### 38. `blog/propiedades.jpg` — "Comprar propiedades en Paraguay"
```
Elevated aerial photograph of a leafy Asunción residential neighborhood with a mix of
modern condominium towers and gated houses, pools visible in gardens, warm afternoon
light, tropical trees, clear sky, sense of market liquidity and opportunity.
```

### 39. `blog/banca.jpg` — "Apertura de cuenta bancaria"
```
Close-up flat-lay: a generic champagne-colored debit-card-shaped object (no logos,
no numbers), a blank check-style document, a fountain pen, a coffee cup with champagne-
tone rim, on a dark navy felt background, moody directional light, private-banking
aesthetic.
```

### 40. `blog/emprender.jpg` — "Emprender en Paraguay 2024"
```
Warm editorial photograph of a young entrepreneur (seen from behind, laptop open,
notebook beside) working at a window desk in a modern Asunción coworking space,
tropical plants outside the window, morning light, post-it notes on the wall (unreadable),
sense of founding a company with clarity.
```

### 41. `blog/cost-of-living.jpg` — "Cost of living in Paraguay"
```
Lifestyle still-life: a modest supermarket bag on a tiled kitchen counter with visible
fresh mango, avocado, a local bread loaf, a small bottle of milk, and a restaurant
receipt (illegible) beside a USD 10 bill, bright morning kitchen light, warm and
attainable.
```

### 42. `blog/healthcare.jpg` — "Healthcare for expats"
```
Clean architectural photograph of a modern private-hospital reception in a Latin American
capital, soft grey and warm wood interior, a tasteful seating area in champagne-tone
linen, a discreet reception desk, no identifiable logos, daylight flooding through
glass facade, calm and premium.
```

### 43. `blog/schools.jpg` — "Schools for expat families"
```
Warm photograph of the exterior courtyard of an international school in Asunción,
children in uniform walking in the distance (seen only as small silhouettes, faces
not recognizable), leafy trees, modern school architecture, reassuring and well-kept,
no legible school branding.
```

### 44. `blog/neighborhoods.jpg` — "Neighborhood guide: Villa Morra / Carmelitas"
```
Street-level photograph of a tree-lined residential street in Villa Morra at golden
hour, a couple walking small dogs in the distance (not recognizable), boutique café
on the corner, jacarandá trees in bloom, warm sunset light, charming and walkable.
```

### 45. `blog/paraguay-uruguay-panama.jpg` — "Paraguay vs Uruguay vs Panama"
```
Minimalist editorial graphic-photograph: a wooden world globe rotated to South America
with three push-pins (simple unbranded red-colored pins) stuck into Asunción, Montevideo,
and Panama City, soft moody side-light, navy background, shallow DoF on the center pin
(Paraguay).
```

---

# 🟡 P2 — Q1 post-launch (28 images)

## Testimonial portraits (items 46–50) 👤

> ⚠️ **Do NOT ship AI faces as real client testimonials.** Only use these as visual placeholders on staging until real clients consent. Currently `features.testimonials: false` — keep off until replaced.

All portraits: **Aspect 1:1 · 800×800** · circle-safe framing · append portrait system.

### 46. `testimonials/client-1.jpg` — Marcelo Díaz (Emprendedor Argentino)
```
Argentine male entrepreneur 40–48, short salt-and-pepper hair, open-collar navy shirt,
warm confident smile, environmental background with a blurred Asunción skyline,
eye-contact with camera, LinkedIn-grade professional portrait.
```

### 47. `testimonials/client-2.jpg` — Ana Lucía Fernández (Consultora)
```
Latin American female digital-marketing consultant 32–40, dark long wavy hair, wearing
a cream blouse, warm side-light, blurred coworking background, approachable and smart.
```

### 48. `testimonials/client-3.jpg` — Roberto González (Inversor inmobiliario)
```
Male real-estate investor 50–60, grey trimmed beard, wearing a navy polo, outdoor
setting with a blurred subtropical house in the background, relaxed confident expression.
```

### 49. `testimonials/client-4.jpg` — Carolina Silva (CEO Tech Startup)
```
Latin American female tech-founder 30–38, shoulder-length dark hair, wearing a
champagne blazer, modern office background with a blurred laptop and window,
determined composed expression.
```

### 50. `testimonials/client-5.jpg` — Fernando Morales (Productor agropecuario)
```
Latin American male agricultural entrepreneur 45–55, sun-tanned skin, weathered but
kind face, wearing a crisp white shirt, warm outdoor backdrop with blurred soybean
or cattle field, golden-hour light, grounded and trustworthy.
```

---

## Video-testimonial poster frames (items 51–55) 👤

Same subjects as 46–50 but **Aspect 16:9** and composed with more environmental breathing room (subject on left third, blurred setting on right). Use as YouTube/Vimeo poster images.

### 51–55.
Re-run prompts 46–50 at 16:9, add: `medium shot, subject on left third, environmental background relevant to their program (city skyline for Business, farm landscape for Tierras, condo tower for Investor, coworking for Base)`.

---

## Programs tier visuals (items 56–59)

All tier images: **Aspect 3:2** · 1600×1000 · editorial still-life.

### 56. `programs/base.jpg` — Paraguay Base (residency only)
```
Editorial flat-lay on a warm wooden surface: a single blank generic ID card, a blue
passport, a small lapacho flower, soft directional light, minimalist composition,
communicates "the essentials, done right".
```

### 57. `programs/business.jpg` — Paraguay Business (most-chosen)
```
Editorial flat-lay: ID card, passport, a leather corporate-folder embossed with a blank
crest, a champagne-colored bank-card-shape, a silver fountain pen, a small fresh
lapacho bloom, composition one step richer than the "Base" still-life, same warm desk
surface, "complete package" feel.
```

### 58. `programs/investor.jpg` — Paraguay Investor
```
Wider editorial scene: the Business still-life elements arranged on the left, on the right
a softly blurred real-estate brochure (unreadable) and a set of keys on a leather keyring,
a window in the far background showing a modern Asunción condo tower, implies investor
site-visit.
```

### 59. `programs/tierras.jpg` — Paraguay Tierras
```
Landscape photograph of Paraguayan rural land in Alto Paraná or Itapúa, gently rolling
fertile terrain with a small wooden gate or fence in the foreground, distant farmhouse,
warm late-afternoon light, sense of scale and opportunity, sky with soft clouds,
documentary-agricultural-photography aesthetic.
```

---

## Why-Paraguay deep (items 60–65)

All aspect 3:2 · 1600×1000.

### 60. `why-paraguay/tax.jpg` — Fiscal/tax
```
Architectural photograph of a Latin American tax-authority-style institutional building
exterior at mid-day, generic modernist facade with stone and glass, Paraguayan flag
subtly visible atop (not dominant), clean plaza in front with lapacho trees, civic and
orderly, no legible signage.
```

### 61. `why-paraguay/growth.jpg` — GDP growth
```
Dynamic construction-site photograph of a new Asunción tower mid-build, cranes against
a late-afternoon sky, orderly and clean site, warm light hitting glass curtain wall,
sense of sustained growth and investment, no visible workers' faces.
```

### 62. `why-paraguay/agribusiness.jpg` — Agribusiness
```
Wide landscape photograph of a well-managed soybean field in Alto Paraná or a cattle
ranch in the Chaco, golden-hour light, a sense of scale extending to the horizon,
a single tree on the left third, cinematic agricultural-Paraguay aesthetic (distinct
from pampas/Brazil by warmer light and specific tree species like quebracho),
documentary editorial quality.
```

### 63. `why-paraguay/community.jpg` — Expat community
```
Warm lifestyle photograph of a small relaxed gathering at an outdoor terrace in
San Bernardino or Asunción, 5–6 adults in their 30s–50s of diverse European and
Latin American origin, clinking glasses or mid-conversation, no faces frontal (all in
profile or three-quarter, slightly blurred), string lights above, evening golden hour,
welcoming and aspirational.
```

### 64. `why-paraguay/nature.jpg` — Climate & nature
```
Wide landscape photograph of Ñu Guasu Park in Asunción or the Itaipú reservoir shoreline,
lush subtropical greenery, soft morning mist over water, a jogging path or wooden walkway
in the foreground disappearing into the frame, warm daylight, quality-of-life signal.
```

### 65. `why-paraguay/culture.jpg` — Culture (asado + tereré)
```
Warm lifestyle photograph: a wooden table outdoors with a ceramic tereré vessel,
a bombilla straw, a plate of Paraguayan chipa, dappled sunlight through lapacho trees,
a pair of hands pouring tereré (seen from above, no face), cultural authenticity
without kitsch.
```

---

## Localized hero variants (items 66–69)

All aspect 12:7 · 2400×1400.

### 66. `hero/hero-nl.jpg` — NL-facing
```
Split-composition hero: on the left two-thirds, a sharply dressed professional in an
Amsterdam-style office (canal-house window visible blurred behind), on the right third,
a warm gradient fade into an Asunción skyline silhouette at sunrise, symbolizing a
bridge from the Netherlands to Paraguay, no text, leave upper-left negative space for
NL headline.
```

### 67. `hero/hero-de.jpg` — DE-facing
```
Conservative institutional hero: a formal neoclassical government-adjacent building
exterior (generic, could read as Frankfurt or Berlin) softly blended on the left half
with an Asunción institutional building on the right, unified sky, restrained palette,
negative space on the top-right for DE headline.
```

### 68. `hero/hero-en.jpg` — EN-facing
```
International-neutral hero: wide cinematic shot of an Asunción business tower at golden
hour with a professional silhouette standing at the foot of the building looking up,
sense of scale and opportunity, no text, clean composition for EN headline overlay.
```

### 69. `hero/hero-es.jpg` — ES/LATAM-facing
```
Warm family-lifestyle hero: a couple with a child (seen from behind, no faces) walking
toward a welcoming modern home at golden hour in a leafy Paraguayan neighborhood,
warmth and settlement, negative space top-center for ES headline.
```

---

## Process & FAQ supporting (items 70–73)

### 70. `process/operational-day.jpg` — Operational day composite
Aspect: 3:2

```
Wide editorial reportage photograph blending three moments of one coordinated day in
Asunción: on the left a car arriving at an office, center a signing at a desk, right
a handshake, soft cinematic panorama composition, warm gold-hour light, no faces
identifiable, storytelling single frame.
```

### 71. `process/apostille-stack.jpg` — Document apostille stack
Aspect: 4:3

```
Overhead macro of a stack of 5–7 official-looking documents, top one carrying a generic
embossed apostille-style seal in the corner, ribbons or staples visible, on a dark navy
felt surface, single-source warm side-light, shallow DoF on the seal.
```

### 72. `process/family-residency.jpg` — Family application
Aspect: 3:2 · 👤

```
Warm environmental photograph of a family of four (two adults, two children) seen from
behind walking into a modern government-adjacent building plaza in a Latin American
capital, all neatly dressed, late-morning light, no faces recognizable, civic and
hopeful.
```

### 73. `process/bank-customer-side.jpg` — Bank visit
Aspect: 3:2 · 👤

```
Over-the-shoulder photograph of a customer seated at a private-banking-style desk
across from a bank officer (both seen from behind/side, no faces), a folder and a
champagne-toned card on the desk, warm interior light, polished marble floor suggesting
a major bank lobby without any visible logo.
```

---

# 🟢 P3 — Growth & campaign assets (39 images)

## Paid ads creative library (items 74–95)

**Pattern prompt (clone per platform × locale × angle):**

```
Modern performance-marketing ad creative for Nexa Paraguay, showing [SUBJECT],
strong visual hierarchy with left-third negative space for overlaid headline text
in [LOCALE] (do not render the text — leave empty space), navy + champagne palette,
one focal subject, shallow DoF, bright but institutional mood.
```

### 74–77. Meta (FB/IG) feed — "One trip, one program" angle
Aspect 4:5 (items 74–77, one per locale NL/EN/DE/ES)
`[SUBJECT]` = "a single leather folder on a desk with a passport, an ID card, and a set of keys side by side, champagne accent light"

### 78–81. Meta story — "8–12 weeks" angle
Aspect 9:16 (one per locale)
`[SUBJECT]` = "a minimalist calendar graphic overlay on a warm office desk, suggesting 8–12 weeks without explicit numbers"

### 82–85. LinkedIn sponsored — "Institutional trust" angle
Aspect 1200:627 (one per locale)
`[SUBJECT]` = "the Operations Director-type silhouette (back to camera) looking out over the Asunción skyline from a high-rise office"

### 86–89. LinkedIn — "Investor" angle
Aspect 1200:627 (one per locale)
`[SUBJECT]` = "a real-estate tour scene: two figures walking a property seen from a distance, SUV parked, property in golden light"

### 90. `ads/google-display-728x90.jpg`
```
Horizontal banner ad: Asunción skyline silhouette right, solid navy left with negative
space for a short headline and a champagne CTA button area (leave empty), clean.
```

### 91. `ads/google-display-300x250.jpg`
Square banner — stacked version of 90.

### 92. `ads/google-display-336x280.jpg`
Medium rectangle — same composition, reframed.

### 93. `ads/google-display-970x250.jpg`
Large leaderboard — wider panoramic version of 90.

### 94–95. YouTube pre-roll thumbnails
Aspect 16:9 · 1280×720
- `ads/youtube-thumb-1.jpg` — "a confident founder-type silhouette against the Asunción skyline, arms crossed, golden light"
- `ads/youtube-thumb-2.jpg` — "a close-up of a Paraguayan cédula being placed on top of a passport, hands only"

---

## Email nurture headers (items 96–102)

Aspect 2:1 · 1200×600 · append style block.

### 96. `email/01-welcome.jpg`
```
Warm minimal editorial header: a café table with a coffee cup and a small notebook,
soft morning light through a window, a single lapacho flower, communicates welcome.
```

### 97. `email/02-paraguay-different.jpg`
```
Sunrise cinematic panorama of the Asunción skyline from the Paraguay River,
gradient sky from warm champagne to deep navy, no people, no text.
```

### 98. `email/03-process.jpg`
```
Overhead flat-lay of a printed timeline document with 5 numbered steps (numbers visible,
step words abstracted / unreadable), a pen pointing at step 2, warm lighting.
```

### 99. `email/04-one-trip.jpg`
```
Stylized overhead of a small vintage map of Paraguay (not precisely geographic) with
three minimalist pins (warm champagne) connecting Asunción to the Costanera, a small
paper airplane, warm side-light.
```

### 100. `email/05-banking.jpg`
```
Close-up of a champagne-toned blank bank card laid on a dark leather desk pad next to
a silver pen and a small leather card-wallet, moody directional light.
```

### 101. `email/06-which-program.jpg`
```
Editorial flat-lay showing 4 leather folders of increasing thickness fanned out on a
desk labeled only with roman-numeral-style tabs (I, II, III, IV — may render these as
they are short), warm light.
```

### 102. `email/07-next-step.jpg`
```
A laptop open on a wooden desk showing a soft out-of-focus calendar-booking interface
(no legible text, no real brand), a coffee cup, a notebook, warm morning light,
"one click away" feel.
```

---

## Social content templates (items 103–108)

For monthly ~12-post rhythm, generate 6 reusable background-plates; the design team composites text overlays in Figma.

### 103. `social/neighborhood-villa-morra.jpg` — 1:1
```
Street-level photograph of Villa Morra café patio at golden hour, warm and social,
negative space top for future "Villa Morra" text overlay.
```

### 104. `social/neighborhood-carmelitas.jpg` — 1:1
Similar, reframed for Carmelitas aesthetic (tree-lined boulevard with boutique shops).

### 105. `social/neighborhood-san-bernardino.jpg` — 1:1
Lakeside pier at San Bernardino, soft morning light.

### 106. `social/data-tip-background.jpg` — 1:1
```
Abstract brand-tile: soft navy-to-champagne gradient with subtle geometric line pattern
(arches referencing "bridging"), center kept clean for stat overlay like "10%" or "8–12".
```

### 107. `social/bts-office.jpg` — 1:1
Office interior with people at work (no faces), behind-the-scenes warm documentary feel.

### 108. `social/client-journey.jpg` — 1:1
```
Editorial still-life: a passport, a boarding-pass-shaped blank card, a set of keys, a
pair of sunglasses, arranged diagonally on warm wood, communicates "before → after".
```

---

## Press kit & infographics (items 109–112)

### 109. `press/founders-hi-res.jpg` — Founders press portrait
Aspect 4:5 · 6000×7500 (300 DPI, print-grade)
Re-shoot #21 and #22 in studio conditions with a pure off-white backdrop and print-grade
lighting. AI unsuitable — must be real.

### 110. `press/brand-book-cover.jpg` — Brand book PDF cover
```
Minimal editorial cover: a single embossed "N" wordmark on a rich navy paper texture,
centered, with a thin champagne foil horizontal hairline, communicates printed
premium brand book. Flat graphic, not photographic.
```

### 111. `press/factsheet-infographic.jpg` — 2:3
```
Clean editorial infographic layout on a cream background, three minimalist icons
(compass, key, building) in navy, ample white space, leaves text placeholders for
stats. Flat vector aesthetic.
```

### 112. `press/country-data-infographic.jpg` — 2:3
```
Same style as 111 but with an outline map of Paraguay centered, three small pins
(Asunción, Ciudad del Este, Encarnación), clean editorial layout with negative space
for stat overlays.
```

---

# Technical delivery specs (recap — applies to all)

| Usage | Max width | JPG target | WebP target |
|---|---|---|---|
| Desktop hero | 2400 px | ≤ 380 KB | ≤ 250 KB |
| Mobile hero | 828 px | ≤ 160 KB | ≤ 110 KB |
| Section / pillar | 1600 px | ≤ 260 KB | ≤ 180 KB |
| Process step | 1200 px | ≤ 180 KB | ≤ 120 KB |
| Blog cover | 1600 px | ≤ 260 KB | ≤ 180 KB |
| Team portrait | 800 px | ≤ 130 KB | ≤ 90 KB |
| OG / share | 1200 px | ≤ 220 KB | — |
| Logos / icons | SVG | ≤ 40 KB | — |

All deliveries must include:
1. JPG **and** WebP of the same resolution.
2. An `alt` string in ES, NL, EN, DE — appended to `images.json`.
3. Signed model release for any recognizable face (GDPR).
4. Color-graded toward navy `#1B2A4A` shadows + champagne `#C9A96E` highlights.

---

# Quick-start execution order

If budget allows only one batch:

1. **Day 1 (1 hour):** Generate items **17–20** (OG cards + placeholder). Eliminates embarrassment.
2. **Day 1 (2 hours):** Generate items **7–16** (hero + pillars + process). Site looks intentional.
3. **Day 2 (1 hour):** Generate items **36–45** (blog covers). `/blog` page stops 404-ing.
4. **Day 2 (2 hours):** Generate items **21–31** (team + office) as **staging-only placeholders**.
5. **Week 1:** Real photo shoot to replace items **21–31** and **46–55**.
6. **Month 1+:** Generate P3 paid-ads library on demand per campaign.

---

# 🟣 P4 — Coverage gaps identified in audit (Apr 2026)

After wiring the first 111 assets we found six gaps that materially
affect how serious the site looks to an expat shopping this type of
service: a founder portrait, document reassurance, branded icons, maps,
partner trust, a standalone comparison infographic. Every P4 prompt
still appends **Style block** + **Universal negative**.

## P4.1 — Founder / CEO portrait 👤

Aspect: 4:5 · Desired output: `team/founder.png`

```
Editorial portrait of a Latin American business executive in their 40s,
navy suit with an open-collar white shirt, no tie, seated at a walnut
desk in an Asunción office, neutral warm-grey wall behind with a single
framed map print and a brass desk lamp catching champagne-colored
light, direct but approachable eye contact with the camera, confident
relaxed posture, hands resting on desk, late-afternoon window light
from the left, shallow depth of field background softly defocused,
the feel of an FT Weekend profile shoot. Not a headshot on a grey
backdrop — a portrait with environmental context.
```
**Wiring:** add `team.founder` to `images.json`; render on `/sobre`
above the team grid with a short founder bio. Also expose as
`press.founder` on `/prensa` for media requests.

## P4.2 — Document mockups (reassurance)

Illustrated, NOT photorealistic reproductions — these must never be
mistaken for real Paraguayan ID documents (fraud risk).

### 21. `trust/cedula-mockup.png` — aspect 3:2
```
Flat 3/4-top-down composition of a single generic "ID card"
illustration on a walnut desk, clearly stylized (soft drop shadow,
slightly exaggerated proportions, no photographic textures, no real
coat of arms, placeholder text "00.000.000", generic silhouette
photo placeholder). Palette: navy and champagne. Caption space clear
bottom right. Purpose: reassure prospects that they receive a national
ID at the end of the process without impersonating the real cédula.
```

### 22. `trust/ruc-certificate-mockup.png` — aspect 3:2
```
Illustration of a corporate registration certificate on a leather
blotter, obviously fictional letterhead (placeholder crest, Lorem
Ipsum paragraph), gold wax seal bottom right, Mont Blanc pen laid
across the page, brass table lamp catching champagne light. Editorial
illustration style, NOT a reproduction of any real RUC certificate.
```

### 23. `trust/residency-card-mockup.png` — aspect 3:2
```
Two-up composition of a stylized residency card + a passport (closed,
spine up, muted colour not tied to any real country) on a linen cloth,
warm window light from right, small glass of tereré beside them for
cultural anchoring. Illustrated feel with clean gradient shading, NOT
a photograph — obvious at 10 paces this is a product visualisation.
```

**Wiring:** `trust.cedulaMockup` / `trust.rucCertificateMockup` /
`trust.residencyCardMockup`. Use on `/programas` tier cards ("what you
receive") + relevant blog post thumbnails.

## P4.3 — Service icon set (12 icons)

Replaces Lucide glyphs on `/por-que-paraguay`, `/programas`, `/proceso`.
Aspect 1:1. Output: `icons/service-<name>.svg` (vectorize after raster
generation).

Generic prompt — swap the **Subject** line per icon:

```
Minimalist editorial line-icon, single continuous-stroke feel, 2px
equivalent weight, navy #1B2A4A on transparent/white background,
subtle champagne #C9A96E accent on ONE element only (a dot or arc),
inside a 512×512 square with 48px padding, NO text, NO drop shadows,
NO gradients, NO photographic elements. Inspired by Monocle, Financial
Times, and the Noun Project paid tier. Reads clearly at 32×32 and 16×16.

Subject: <NAME>
```

Icons:
1. `service-residency` — hand holding ID card
2. `service-company` — building silhouette with pillar entrance
3. `service-bank-account` — bank card with subtle lock
4. `service-tax-id` — document with barcode
5. `service-property` — house with key
6. `service-apostille` — stamped paper + ribbon
7. `service-notary` — quill on scroll
8. `service-visa` — passport with stamp arc
9. `service-banking` — columns with vault hint
10. `service-education` — graduation cap
11. `service-healthcare` — medical cross inside soft shield
12. `service-consultation` — two speech bubbles overlapping

**Deliverable:** generate concept PNGs, vectorize to SVG, add `icons` bucket
to `images.json`. Wire via optional `iconSrc` prop that overrides the
Lucide name when provided.

## P4.4 — Map graphics

### 24. `maps/paraguay-coverage.png` — aspect 3:2
```
Editorial-style vector map of Paraguay, stylized (not geographically
precise), deep navy landmass on warm off-white background, champagne
highlight pins on: Asunción (larger), Ciudad del Este, San Bernardino,
Encarnación. Thin neighbouring-country outlines (Argentina, Brasil,
Bolivia). No labels, no compass rose. Feels like a map insert in a
Monocle country guide.
```

### 25. `maps/asuncion-neighborhoods.png` — aspect 3:2
```
Editorial stylized map of central Asunción, navy street-grid on warm
off-white, champagne-filled highlight blocks for Villa Morra, Las
Carmelitas, Mburucuyá, Costanera. Paraguay River as a gentle champagne
wash at top-left. Small illustrated pin markers for Shopping del Sol,
Parque Ñu Guasu, Costanera Park. Thin north arrow, no compass rose.
Premium relocation-guide aesthetic.
```

**Wiring:** `maps.paraguayCoverage` on `/por-que-paraguay`;
`maps.asuncionNeighborhoods` as a secondary hero on the `neighborhoods`
blog post.

## P4.5 — Partner / press-mention placeholder slots

No new imagery needed — wire `trust-signals` section with its `logos-row`
variant rendering partner logos. Until real partnerships are named,
populate with "Próximamente" / "Coming soon" text slots so the layout
reserves space.

- `/sobre` — second trust-signals block "Socios bancarios y legales"
  with 5 slots.
- home — below existing credentials block: "Menciones en medios",
  4 slots.

When real partnerships ship, swap the placeholder labels for actual
logos (obtain from the partner's brand guidelines, don't scrape).

## P4.6 — Standalone comparison infographic

### 26. `infographics/paraguay-vs-uruguay-panama.png` — aspect 4:3
```
Editorial comparison infographic, 3-column layout, one country per
column (Paraguay, Uruguay, Panama), column headers as minimal flag
strips in brand navy/champagne palette (not national flag colors),
5 rows comparing: income tax rate, VAT, patrimony tax, dividends tax,
residency timeline. Rows use numeric callouts + tiny icons. Source
footnote in small italic at bottom. Feels like The Economist's Pocket
World in Figures — tight typographic grid, disciplined use of accent
colour on only the "winner" cell per row.
```

**Wiring:** hero of the matching blog post + standalone on
`/por-que-paraguay` + downloadable PDF on `/prensa`.

---

# 🟠 P5 — Nice-to-have (when budget allows)

Abbreviated — append Style block + negative to each.

| # | File | Aspect | Brief |
|---|------|--------|-------|
| 27 | `brand/logo-animated.lottie` | — | Wordmark assembly 1.5s with champagne sweep. Loading states and video intros only. |
| 28 | `brand/email-signature.png` | 4:1 (600×150) | Horizontal banner: logo-icon left, wordmark centre, single tagline right. |
| 29 | `brand/logo-on-photo.png` | 5:2 | Semi-transparent white wordmark for hero-overlay use. |
| 30 | `brand/print-logo-cmyk.svg` | 1:1 + 5:2 | Vector set for letterhead and business cards (SVG + EPS + 2000px PNG). |
| 31 | `misc/404-illustration.png` | 3:2 | Folded paper map with gentle question-mark watermark, navy + champagne, sparse. |
| 32 | `misc/empty-state.png` | 1:1 | Open folder with one champagne-coloured paper inside. Empty search / no-results UI. |
| 33 | `misc/cost-of-living.png` | 3:2 | Editorial still-life: minimalist grocery basket + a guaraní bill + café receipt on linen. |
| 34 | `misc/currency-guaranies.png` | 3:2 | Three stylized guaraní notes fanned on walnut, warm afternoon light. |
| 35 | `hero/video-cinemagraph.mp4` | 16:9 | 10s seamless loop of Asunción skyline at golden hour, subtle river motion only. ≤2MB H.264 auto-play muted. |

---

# Bucket addition rules

When adding any P4/P5 asset to the manifest:

1. Generate the image.
2. Convert to WebP via `npm run convert:tenant-images -- nexa-paraguay`.
3. Add entry to `sites/nexa-paraguay/images.json` under the correct
   bucket (create new buckets `icons/`, `maps/`, `infographics/`,
   `misc/` if needed).
4. Include `altByLocale` for all 4 locales at creation time (don't
   defer — backfilling across a dozen assets is painful).
5. Run `npm run validate:tenant-images -- nexa-paraguay` — must pass.
6. Update MEMORY.md or the admin dashboard label if the asset replaces
   an AI placeholder (so the launch-gate hashes stay in sync).

---

_Last updated: April 2026. Keep this file in sync with `images.json` and `sites/nexa-paraguay/images/` directory structure._
