# Add a new vertical · runbook

> A **vertical** is a top-level industry group (e.g. `beauty-personal-care`,
> `food-beverage`, `agriculture-agribusiness`). Individual **business types**
> (`peluqueria`, `barberia`, `panaderia`) live inside one vertical and inherit
> its theme defaults, allowed sections, and copy.
>
> Closes BUG_HUNT_500 #485. Companion to `docs/runbooks/ADD_NEW_TENANT.md`
> (which onboards a single client onto an *existing* vertical).

## When to add a new vertical (vs. just a new type)

Add a new **type** (5 min, common) when the new business slots into an
existing vertical: another beauty service, another restaurant subtype, etc.
See "Type-only path" at the bottom.

Add a new **vertical** (1–2 h, rare) when the industry is fundamentally
different from anything in `src/verticals/`. Triggers:

- New theme palette/typography that doesn't fit any existing vertical
- New required sections that aren't in any vertical's `allowedSections`
- New regulatory profile (e.g. licensed financial services, health)
- Different default page composition (e.g. RFQ-first instead of bookings)

If unsure, grep `src/registry/index.json` for similar types — if 3+ existing
types resemble the new one, you probably need a new vertical.

## Anatomy of a vertical

```
src/verticals/<id>/
├── vertical.json                 # metadata, allowedSections, locales
├── schema.json                   # JSON Schema for content shape
├── defaults.tokens.json          # palette, typography, fonts
├── copy/
│   └── es.json                   # default copy templates (one per locale)
└── starter-kits/
    └── minimal.pages.json        # default page composition
```

Plus the catalog entry in `src/verticals/catalog.json` and an entry in
`src/registry/index.json` under `verticalsCatalog`.

## Step 1. Pick the ID + decide locales

```bash
VID=education-training       # kebab-case, descriptive, NAICS-flavored
LOCALES='["es"]'             # most PY verticals are Spanish-only
                             # Use ["es","en"] for international (relocation, finance)
                             # Use ["es","en","pt"] for MERCOSUR-facing
```

ID conventions:
- kebab-case
- 2–3 words max (`food-beverage`, not `food-and-beverage-services`)
- Use the NAICS / GBP industry name if there's a clean fit
- Match `verticalsCatalog` keys in `src/registry/index.json`

## Step 2. Create the directory + files

```bash
cd ~/paragu-ai-builder
mkdir -p src/verticals/$VID/{copy,starter-kits}
```

### `vertical.json`

```json
{
  "id": "education-training",
  "name": "Education & Training",
  "nameEs": "Educacion y Formacion",
  "description": "Schools, academies, tutoring, vocational training. Enrollment-driven, syllabus-heavy, parent/student dual audience.",
  "baseType": "education_base",
  "features": {
    "i18n": "partial",
    "enrollmentForm": true,
    "syllabusDownload": true,
    "instructorProfiles": true,
    "whatsappFloat": true,
    "testimonials": true
  },
  "allowedSections": [
    "header", "hero", "about", "programs", "instructors",
    "schedule", "testimonials", "faq", "enrollment-form",
    "contact", "google-maps", "footer", "whatsapp-float"
  ],
  "defaultStarterKit": "minimal",
  "locales": ["es"]
}
```

`allowedSections` is the whitelist that `validate-vertical.ts` enforces on
every starter kit. List every section any current or future starter kit in
this vertical might use.

### `defaults.tokens.json`

```json
{
  "name": "Education trustworthy blue",
  "theme": "light",
  "palettes": {
    "default": {
      "name": "Academic Blue",
      "colors": {
        "primary": "#1E40AF",
        "secondary": "#F59E0B",
        "accent": "#DBEAFE",
        "background": "#F8FAFC",
        "surface": "#FFFFFF",
        "text": "#0F172A",
        "textMuted": "#64748B"
      }
    }
  },
  "defaultPalette": "default",
  "typography": {
    "heading": "'Merriweather', serif",
    "body": "'Inter', sans-serif",
    "headingWeight": "700",
    "bodyWeight": "400"
  },
  "googleFonts": ["Merriweather:wght@600;700", "Inter:wght@400;500;600"]
}
```

Contrast every text/background pair against WCAG AA (4.5:1) using
`web/scripts/contrast-audit.ts` after adding. `textMuted` was the bug
that landed `paragu-ai.com` at 89/100 a11y in the last audit.

### `schema.json`

JSON Schema for the content shape this vertical's tenants must follow.
Copy from a similar vertical and adapt:

```bash
cp src/verticals/beauty-personal-care/schema.json src/verticals/$VID/schema.json
$EDITOR src/verticals/$VID/schema.json
```

### `copy/es.json` (and other locales)

```json
{
  "common": {
    "cta": {
      "enroll": "Inscribirse",
      "whatsapp": "Chatear por WhatsApp",
      "syllabus": "Descargar syllabus"
    },
    "labels": {
      "programs": "Programas",
      "instructors": "Profesores",
      "schedule": "Horarios",
      "contact": "Contacto"
    }
  },
  "defaults": {
    "hero": {
      "headline": "{{businessName}}",
      "subheadline": "Educacion de calidad en {{city}}.",
      "ctaPrimaryText": "Inscribirse",
      "ctaSecondaryText": "Ver Programas"
    },
    "footer": { "tagline": "Forma tu futuro con {{businessName}}." }
  }
}
```

Spanish defaults to "rioplatense / paraguayo" register. No
`coger`, `vosotros`, peninsular vocabulary.

### `starter-kits/minimal.pages.json`

```json
{
  "description": "Education minimal kit: programs, instructors, enrollment, contact.",
  "pages": {
    "home": {
      "slug": "",
      "titleKey": "home.seo.title",
      "descriptionKey": "home.seo.description",
      "sections": [
        { "id": "header", "variant": "standard", "content": "navigation" },
        { "id": "hero", "variant": "image", "content": "home.hero" },
        { "id": "programs", "variant": "grid", "content": "home.programs" },
        { "id": "instructors", "variant": "cards", "content": "home.instructors", "enabledWhen": "instructorProfiles" },
        { "id": "testimonials", "variant": "carousel", "content": "home.testimonials", "enabledWhen": "testimonials" },
        { "id": "enrollment-form", "variant": "inline", "content": "home.enrollment", "enabledWhen": "enrollmentForm" },
        { "id": "contact", "variant": "split", "content": "home.contact" },
        { "id": "google-maps", "variant": "embed", "content": "home.location" },
        { "id": "footer", "variant": "standard", "content": "footer" },
        { "id": "whatsapp-float", "variant": "standard", "content": "whatsapp" }
      ]
    }
  }
}
```

Every section ID listed here MUST appear in `vertical.json#allowedSections`
AND in the global `SECTION_CATALOG` (`web/lib/engine/section-registry.ts`).
If you're using a new section, add it to the catalog first — separate task.

## Step 3. Register the vertical

### `src/registry/index.json`

Add an entry under `verticalsCatalog`:

```json
"education-training": {
  "nameEs": "Educacion y Formacion",
  "i18n": "partial",
  "regulation": "low"
}
```

Flags:
- `i18n`: `false` (Spanish only) | `"partial"` (some locales) | `true` (full multi-locale)
- `regulation`: `"low"` | `"high"` | `"very-high"` (legal/financial copy review required)
- `b2b: true` if the vertical is primarily B2B
- `culturallyVariant: true` if content needs heavy cultural adaptation per region
- `folderAlias` if the folder name differs from the registered ID
  (e.g. `real-estate-relocation` lives in `src/verticals/relocacion/`)

### `src/verticals/catalog.json`

Append the new vertical's metadata so the type-creation tooling picks it up.
See an existing entry for the exact shape.

## Step 4. Validate

```bash
cd web
npm run validate:vertical $VID    # checks the new vertical only
npm run validate:registry         # checks index.json shape
npm run validate:tokens           # checks token files parse + reference base
```

Fix every error. Warnings about missing translations are OK if you only
listed one locale.

## Step 5. Generate at least one type inside the new vertical

A vertical is useless without types. Create at least one to validate the
end-to-end flow:

```bash
cd web
npx tsx scripts/create-type.ts \
  --id academia-idiomas \
  --vertical education-training \
  --nameEs "Academia de Idiomas" \
  --nameEn "Language School"
```

This generates:
- `src/registry/academia-idiomas.type.json`
- `src/content/academia-idiomas.content.json`
- (Optional) `src/tokens/academia-idiomas.tokens.json` if the type needs
  to override the vertical defaults

Then add to `src/registry/index.json#types`. See an existing type for the
exact shape.

## Step 6. Generate static config + smoke test

```bash
npm run generate:config           # rebuilds the static registry bundle
npm run validate:all              # runs the full validation suite
npm run dev                       # spin up locally
```

Visit `http://localhost:3000/p/academia-idiomas` (or whatever type slug)
and confirm the marketing page renders with the new vertical's theme.

## Step 7. Create one demo tenant

End-to-end proof: scaffold a demo tenant on the new type per
`docs/runbooks/ADD_NEW_TENANT.md` (demo path). If the demo renders cleanly
with the new vertical's tokens and copy, the vertical is shippable.

## Step 8. Commit

```bash
git checkout -B feat/vertical-$VID
git add src/verticals/$VID/ src/registry/index.json src/verticals/catalog.json
git add src/registry/<at-least-one-new-type>.type.json
git add src/content/<at-least-one-new-type>.content.json
git commit -m "feat(verticals): add $VID with N initial types"
git push -u origin feat/vertical-$VID
gh pr create --fill
```

**Never push directly to Main.** Main auto-deploys to prod via the deploy
workflow — every change goes through a PR.

## Type-only path (the common case · 5 min)

If the new business fits an existing vertical, skip the runbook above. Just:

```bash
cd web
npx tsx scripts/create-type.ts \
  --id $TYPE_ID \
  --vertical <existing-vertical-id> \
  --nameEs "<Spanish name>"

# Add to src/registry/index.json under "types"
# Then:
npm run generate:config
npm run validate:all
```

Commit + PR as usual.

## Common mistakes

- **Section in starter kit but not in `allowedSections`** — `validate-vertical`
  fails. Add the section ID to `vertical.json#allowedSections`.
- **Section in starter kit but not in `SECTION_CATALOG`** — runtime crash on
  render. Register the section in `web/lib/engine/section-registry.ts` first
  (separate, larger task).
- **Token contrast fails WCAG AA** — landing audit will flag it. Pick a
  darker `text` or lighter `background`. Run `npm run validate:contrast`
  after editing tokens.
- **Forgot `verticalsCatalog` entry** — types in this vertical render but
  the admin/registry UI shows them as "uncategorized". Always add both the
  `vertical.json` AND the `verticalsCatalog` entry.
- **Folder name vs ID mismatch** — set `folderAlias` in
  `verticalsCatalog`, otherwise the loader can't find the directory
  (see how `real-estate-relocation` aliases to `relocacion`).
- **Missing copy locale** — if `vertical.json#locales` lists `["es","en"]`
  but `copy/en.json` doesn't exist, every tenant on this vertical 500s on
  the English route.
- **Adding a vertical with zero types** — passes validation but ships
  nothing usable. Always create at least one type in the same PR.

## Promote a partial vertical to full multi-locale

Most verticals start `i18n: false` (Spanish only). To upgrade later:

1. Add `copy/en.json` (and `pt.json` for MERCOSUR) under the vertical
2. Update `vertical.json#locales` to `["es", "en"]`
3. Update `verticalsCatalog#i18n` to `true` or `"partial"`
4. For each tenant on this vertical, add `content/en.json` to their site
5. Rerun `npm run generate:config` and `npm run validate:all`

## See also

- `docs/runbooks/ADD_NEW_TENANT.md` — onboarding a single client
- `docs/GLOBAL_BUSINESS_TAXONOMY.md` — NAICS/GBP/Schema.org reasoning behind the catalog
- `docs/reference/BUSINESS_TYPES.md` — generated overview of all types
- `docs/reference/SECTIONS.md` — what each section ID renders
- `web/scripts/scaffold-verticals.ts` — bulk scaffolding script (for batches)
- `web/scripts/create-type.ts` — single-type generator
- `web/scripts/validate-vertical.ts` — the validator itself
