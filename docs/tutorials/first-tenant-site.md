# Tutorial: build your first tenant site

In this tutorial you'll create a complete tenant from scratch — a fictional **Mi Café** coffee shop in Asunción — and see it render at `http://localhost:3000/s/es/mi-cafe`. No code changes; pure JSON configuration.

**Time:** ~15 minutes.

**Prerequisites:** you've [installed and run the dev server](../../CONTRIBUTING.md#setup) at least once. You have `npm run dev` working.

By the end you'll understand:
- How tenants are structured under `sites/<slug>/`
- How the composition engine merges vertical defaults + tenant config + content
- How to add and reorder sections on a page
- How to validate a tenant before committing

If you want the full reference for any step, follow the links to the [reference docs](../reference/).

---

## Step 1 — Create the tenant directory

```bash
cd sites
mkdir -p mi-cafe/{pages,content,assets}
```

Your new tenant has an empty skeleton. The engine needs a minimum of `site.json` + one page + one content locale to render.

---

## Step 2 — Declare the tenant

Create `sites/mi-cafe/site.json`:

```json
{
  "slug": "mi-cafe",
  "displayName": "Mi Café",
  "hostnames": ["mi-cafe.local"],
  "businessType": "restaurant",
  "verticalId": "food-beverage",
  "defaultLocale": "es",
  "locales": ["es"],
  "features": {
    "booking": false,
    "blog": false,
    "contact": true
  },
  "integrations": {
    "analytics": null
  }
}
```

Notes:
- `slug` **must** match the directory name.
- `businessType` must exist in [`src/registry/`](../../src/registry/) — `restaurant.type.json` is already there.
- `hostnames` is used by [`middleware.ts`](../../web/middleware.ts) to map production domains → tenant. For local dev any placeholder works.
- `defaultLocale` + `locales` determine which `content/<locale>.json` files are expected.

Full schema reference: [`docs/reference/BUSINESS_TYPES.md § tenant directory schema`](../reference/BUSINESS_TYPES.md#tenant-directory-schema).

---

## Step 3 — Define the home page

Create `sites/mi-cafe/pages/home.json`:

```json
{
  "slug": "",
  "titleKey": "home.seo.title",
  "descriptionKey": "home.seo.description",
  "sections": [
    { "id": "header", "variant": "standard", "content": "navigation" },
    { "id": "hero", "variant": "image", "content": "home.hero" },
    { "id": "menu-categorized-priced", "variant": "standard", "content": "home.menu" },
    { "id": "open-hours-status", "variant": "standard", "content": "home.hours" },
    { "id": "contact", "variant": "split", "content": "home.contact" },
    { "id": "footer", "variant": "standard", "content": "footer" },
    { "id": "whatsapp-float", "variant": "standard", "content": "whatsapp" }
  ]
}
```

- Each `sections[]` entry tells the renderer: use section `id`, variant `variant`, hydrated from content key `content`.
- All section ids here are kebab-case keys registered in [`web/lib/engine/renderer.tsx`](../../web/lib/engine/renderer.tsx).
- The full list of 83 available sections with one-line descriptions: [`docs/reference/SECTIONS.md`](../reference/SECTIONS.md).

---

## Step 4 — Write the Spanish copy

Create `sites/mi-cafe/content/es.json`:

```json
{
  "home": {
    "seo": {
      "title": "Mi Café | Asunción",
      "description": "Café de especialidad en el corazón de Asunción. Desayunos, almuerzos y postres."
    },
    "hero": {
      "headline": "Un buen café cambia el día",
      "subhead": "Abierto de 7h a 20h. Asunción, Avda. Mariscal López 1234.",
      "ctaText": "Ver menú",
      "ctaHref": "#menu"
    },
    "menu": {
      "title": "Nuestro menú",
      "categories": [
        {
          "name": "Café de especialidad",
          "items": [
            { "name": "Espresso",      "price": "PYG 12.000" },
            { "name": "Cortado",       "price": "PYG 15.000" },
            { "name": "Flat white",    "price": "PYG 18.000" },
            { "name": "Latte",         "price": "PYG 20.000" }
          ]
        },
        {
          "name": "Para acompañar",
          "items": [
            { "name": "Medialuna",     "price": "PYG 8.000" },
            { "name": "Tostada de palta", "price": "PYG 25.000" },
            { "name": "Cheesecake",    "price": "PYG 22.000" }
          ]
        }
      ]
    },
    "hours": {
      "label": "Abierto ahora",
      "schedule": "Lunes a sábado: 7:00 — 20:00. Domingo: 8:00 — 14:00."
    },
    "contact": {
      "title": "Visitános",
      "address": "Avda. Mariscal López 1234, Asunción",
      "phone": "+595 21 555-0123",
      "email": "hola@mi-cafe.com.py",
      "hours": "Lun–Sáb 7:00–20:00 · Dom 8:00–14:00"
    }
  },
  "navigation": {
    "logo": "Mi Café",
    "links": [
      { "label": "Menú",    "href": "#menu" },
      { "label": "Contacto", "href": "#contacto" }
    ],
    "cta": { "label": "Cómo llegar", "href": "#contacto" }
  },
  "footer": {
    "copyright": "© Mi Café · Asunción, Paraguay",
    "links": []
  },
  "whatsapp": {
    "number": "595975550123",
    "message": "Hola, tengo una pregunta sobre Mi Café."
  }
}
```

The content-key paths in `pages/home.json` (`home.hero`, `home.menu`, etc.) resolve into this JSON. Each section gets the object at its key as props.

---

## Step 5 — (Optional) Override brand colors

The `restaurant` business type inherits tokens from the `food-beverage` vertical. To override:

Create `sites/mi-cafe/tokens.json`:

```json
{
  "colors": {
    "primary": "#6F4E37",
    "primary-foreground": "#FFFFFF",
    "accent": "#D4A574",
    "surface": "#FAF5EE"
  },
  "fonts": {
    "heading": "Playfair Display",
    "body": "Inter"
  }
}
```

These merge into `var(--primary)`, `var(--accent)`, etc. that section components consume. Full token reference: [`docs/reference/TOKENS.md`](../reference/TOKENS.md).

---

## Step 6 — Validate

```bash
cd web
npx tsx scripts/validate-sites.ts
```

If everything is correct you'll see `mi-cafe ✓`. If not, the script lists missing content keys, unknown section ids, or locale mismatches.

---

## Step 7 — Render

Start the dev server if it isn't running:

```bash
npm run dev
```

Open <http://localhost:3000/s/es/mi-cafe>.

You should see a full café site: hero with the Playfair Display headline, categorized menu with prices, open-hours indicator, contact block, WhatsApp float button, footer.

Inspect the HTML — note:
- `<html lang="es">`
- A JSON-LD script tag with a `LocalBusiness` / `Restaurant` schema (generated by `web/lib/seo/json-ld.ts`)
- CSS variables on `:root` matching your `tokens.json`

---

## Step 8 — Experiment

Try any of these. Each is a pure JSON change; no restart needed (Next.js hot-reloads):

- **Reorder sections** — swap `menu` and `hours` in `pages/home.json` and watch the page change.
- **Add a new section** — grab any id from [SECTIONS.md](../reference/SECTIONS.md) (say, `testimonials`) and wire its content under a new key in `content/es.json`.
- **Add an English locale** — create `content/en.json` with the same key structure, add `"en"` to `site.json/locales`. Visit `/s/en/mi-cafe`.
- **Change primary color** — tweak `tokens.json` and refresh. Every section that uses `var(--primary)` updates.

---

## What just happened

The composition engine:
1. Matched `/s/es/mi-cafe` to `sites/mi-cafe/site.json`.
2. Loaded `restaurant.type.json` + `food-beverage` vertical defaults.
3. Merged tokens: `base.tokens.json` → `food-beverage.tokens.json` → `restaurant.tokens.json` → `sites/mi-cafe/tokens.json`. Later layers override earlier.
4. Loaded `pages/home.json` and `content/es.json`.
5. For each section in `pages/home.json`:
   - Resolved the content key from `content/es.json`.
   - Looked up the React component by kebab id in `renderer.tsx`.
   - Rendered with the resolved props + CSS-var tokens.
6. Shipped SSR HTML + JSON-LD + alternate hreflang tags.

The full request lifecycle: [`/ARCHITECTURE.md § request lifecycle`](../../ARCHITECTURE.md#3-request-lifecycle).

---

## Next steps

- Add a second page (`pages/about.json`) — repeat Steps 3 + 4 with a new slug like `"about"`.
- Add more locales — duplicate `content/es.json` as `content/en.json`, translate, add to `site.json/locales`.
- Put real images in `sites/mi-cafe/assets/` and reference them. See [`docs/how-to/generate-images.md`](../how-to/generate-images.md).
- Enable a real integration — add `"analytics": "ga4"` to `site.json` + set `GA4_MEASUREMENT_ID` in env. See [`docs/reference/API.md`](../reference/API.md).
- Deploy — see [`docs/how-to/deploy.md`](../how-to/deploy.md).

If something didn't work, run `npx tsx web/scripts/tenant-health.ts` against your tenant — it'll report any config or rendering issues.

---

_Last reviewed: April 2026._
