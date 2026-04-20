# How to generate images

Tenants need imagery — hero photos, gallery shots, team portraits, product cards. We don't ship stock photos in the repo by default; per-tenant images live under `sites/<slug>/assets/` and are bundled with the Worker.

This guide covers the **image generation pipeline** used by the team today: AI-generated images via **Google Gemini** / **Leonardo** / **Replicate** + upload to Google Drive for stakeholder review + import into tenant `assets/`.

Supersedes: `GEMINI_IMAGE_GENERATION_GUIDE.md`, `GEMINI_TO_DRIVE_WORKFLOW.md`, `GEMINI_USAGE_GUIDE.md`, `IMAGES_START_HERE.md`. Originals archived in [`docs/archive/2026-04/`](../archive/2026-04/).

---

## When to use what

| Tool | Cost | Output quality | Use for |
|---|---|---|---|
| **Google Gemini (gemini-2.5-flash-image)** | pay-per-call (cheap) | excellent for marketing hero / lifestyle | Default — start here |
| **Leonardo.AI** | subscription (~$12/mo) | photoreal, high control | Portfolio shots, product photography |
| **Replicate** (Flux / SDXL) | pay-per-call | varies by model | Batch generation, custom prompts |
| **Free stock** (Unsplash / Pexels / Pixabay) | free | generic | Placeholders during development |

Always run output through [`web/scripts/optimize-images.js`](../../web/scripts/optimize-images.js) to convert to WebP + multiple sizes before shipping.

---

## The pipeline

```
prompt + brand context
        ▼
  [ Gemini / Leonardo / Replicate ]
        ▼
   raw images (PNG, variable size)
        ▼
  [ Google Drive — stakeholder review ]
        ▼
  approved selections
        ▼
  [ optimize-images.js — WebP + sizes ]
        ▼
  sites/<slug>/assets/<image>.webp
        ▼
  referenced in sites/<slug>/content/<locale>.json
```

---

## Step 1 — Set up Gemini access

1. Visit [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) and create an API key.
2. Add to `web/.env.local`:
   ```bash
   GEMINI_API_KEY=<your-key>
   ```
3. Verify: `node scripts/debug-prompts.js` (if present) or a direct test script.

---

## Step 2 — Generate images

Run the batch generator:

```bash
cd web
node scripts/generate-premium.js
```

This script reads prompt templates and calls Gemini for each tenant × section combination. Output lands in `web/.generated-images/` (gitignored).

Prompt templates live in [`docs/reference/image-prompts.md`](../reference/image-prompts.md) _(planned — currently under `IMAGE_PROMPTS_QUICK_REFERENCE.md` in docs root)_. Each tenant vertical has its own prompt palette emphasizing the right mood (professional/clinical for legal, warm/bright for food, aspirational for relocation, etc.).

---

## Step 3 — Stakeholder review via Google Drive

For real clients (Nexa Paraguay, dayah-litworks, etc.), generated images must be reviewed before publishing.

Upload process:

1. Create a Drive folder `paragu-ai / <tenant-slug> / 2026-MM-DD-batch/`.
2. Upload from `.generated-images/` (bulk).
3. Share with the client stakeholder (see each tenant's `sites/<slug>/docs/STAKEHOLDER-*.md`).
4. Stakeholder marks approved images with ✓ in filename or a separate approvals sheet.

A helper script `scripts/upload-to-drive.js` _(planned)_ will automate the upload.

---

## Step 4 — Import approved images

```bash
cd web
node scripts/optimize-images.js --in=path/to/approved/ --tenant=<slug>
```

This:
- Converts PNG → WebP (`-q 80` default)
- Generates responsive sizes (`-480.webp`, `-768.webp`, `-1200.webp`, `-1920.webp`)
- Writes to `sites/<slug>/assets/`
- Outputs a manifest `sites/<slug>/assets/images.json` mapping logical names → file paths

---

## Step 5 — Reference in tenant content

Edit `sites/<slug>/content/<locale>.json` and reference images by logical name:

```json
{
  "home": {
    "hero": {
      "image": "hero-main"
    }
  }
}
```

The engine (`resolve-copy.ts`) reads `images.json` to map `"hero-main"` → actual URL at render time. Section components receive the resolved URL.

---

## Free-stock fallback (development)

During early development, `sites/<slug>/content/*.json` can reference Unsplash / Pexels URLs directly instead of bundled assets. See the legacy [`IMAGES_START_HERE.md`](../archive/2026-04/IMAGES_START_HERE.md) _(planned archive location)_ for curated stock sources. Replace with real imagery before production launch.

---

## Cost tracking

- Gemini: ~$0.002 per image — a full tenant batch (20 images) is ~$0.04
- Leonardo: subscription — effectively unlimited at the scale we're running
- Replicate Flux Pro: ~$0.05 per image
- Stock: free

Budget ~$1 per new tenant for image generation. More if iterating heavily on prompts.

---

## Troubleshooting

**Gemini returns "resource exhausted"** — daily quota hit. Either wait, upgrade tier, or switch temporarily to Leonardo for the remainder.

**Images look generic / on-brand miss** — prompts are tenant-agnostic. Add brand context to the prompt template: "in the style of a Paraguay relocation agency, warm colors, aspirational, photographs of Asunción architecture".

**Optimizer chokes on large batch** — run it in chunks of 20 files. The script is not memory-bounded; a 100-file batch may OOM Node.

**Image shows up as broken on site** — verify the `images.json` manifest has the logical name; the content JSON references the logical name, not the file path.

---

## Future work

- Scripted Drive upload + approval-via-Sheets integration
- Per-vertical prompt presets as first-class in the registry
- Cloudinary migration for tenants with >50 images (outgrows Worker bundle size)
- Alt-text generation (Gemini vision → description → tenant content)

---

_Last reviewed: April 2026. Cross-refs: [`docs/reference/image-prompts.md`](../reference/image-prompts.md) (planned), tenant `STAKEHOLDER-*.md` per-client docs._
