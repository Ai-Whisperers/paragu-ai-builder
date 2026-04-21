# Demo polish playbook

> Companion to `docs/BUG_HUNT_500.md` items 061–320. The repeatable process
> for taking one demo from "deprecated fixture" to "I'd show this to a prospect".
> Run through this for `salon-maria` first; it's the proof-of-concept. If it
> takes longer than 4 hours, the workflow needs revision before scaling to 13.

## Before you start

Verify these are in place (one-time, project-wide):

- [ ] `<DemoBadge>` component built (BUG_HUNT_500 #291)
- [ ] `is_demo: boolean` in site.json schema (#293)
- [ ] AI image budget approved (~$5 per demo at $0.04/image)
- [ ] Recraft + Flux Pro accounts ready
- [ ] AI Asset Brief template open (`docs/AI_ASSETS_PLAN.md`)

## Workflow (per demo · target: 2-3 hours)

### Step 1 · Inventory the existing state (10 min)

```bash
SLUG=salon-maria
ls sites/$SLUG/ 2>/dev/null || echo 'TENANT MISSING — needs scaffold'
cat sites/$SLUG/site.json 2>/dev/null | head -20
cat sites/$SLUG/content/es.json 2>/dev/null | python3 -m json.tool | head -50
```

What you're looking for:
- Does the tenant exist?
- What sections does the page composition reference?
- What's the current placeholder content?
- Any obvious bugs (missing comma, wrong type)?

### Step 2 · Author content first, generate images second (60 min)

Reason: content drives image briefs. Don't generate a logo without knowing
the brand name; don't shoot a hero without knowing the vibe.

In `sites/$SLUG/content/es.json`, fill these in order:

1. **siteName** — realistic Paraguayan business name (use the existing if
   it fits, e.g. "Salon Maria")
2. **tagline** — pattern: `<verb> <outcome> <where>`
   ("Cortes precisos para hombres y mujeres en Asunción")
3. **navigation** — keep stock unless this demo has unusual sections
4. **home.hero** — headline + subheadline + 1 primary CTA
5. **home.services** — 6-10 services with `name`, `price`, `duration`,
   `description`. Use real PY market rates (research a real competitor)
6. **home.team** — 2-4 members with `name`, `role`, `bio`. Names
   should sound Paraguayan (avoid generic "Maria Garcia")
7. **home.testimonials** — 3 quotes. Vary the sentiment (one about
   craft, one about service, one about result). Use real first-name +
   last-initial format
8. **home.contact** — realistic address + hours + email
9. **footer** — copyright, social handles, ParaguAI attribution

Common content mistakes to avoid:
- AI-flavored phrasing ("estamos comprometidos", "experiencia única",
  "calidad superior")
- Same first-name in services as in team
- Hours format inconsistency across same file
- USD prices when PY uses Gs

### Step 3 · Generate images (90 min including iteration)

#### 3a · Logo via Recraft

Brief template:
```
Brand: <siteName>
Vertical: <peluqueria>
Style: <classic salon · warm tones>
Colors: <#b76e79 + #d4a574> (from sites/<slug>/tokens.json)
Font feel: <handwritten cursive>
Output: SVG, single color version + 2-color version
```

Pick best variation. Save to `web/public/clients/$SLUG.svg`.

#### 3b · Hero via Flux Pro (Replicate)

Prompt template:
```
Photorealistic interior of a <vertical> in Asunción Paraguay, warm
golden-hour lighting, modern but welcoming, brand colors of <#hex>,
no people in frame, 16:9 aspect ratio, ultra-realistic
```

Iterate 2-3 times until it looks right. Save to
`web/public/clients/$SLUG/hero.webp` (convert via squoosh.app).

#### 3c · Service photos (4-6 via Flux Pro)

For peluquería: photo of corte being done, photo of color, photo of
finished look, photo of products. For gimnasio: equipment, classes,
trainer in action, locker room. Vary by vertical.

Save to `web/public/clients/$SLUG/services/`.

#### 3d · Team avatars via GenerativePhotos

Diverse, age-appropriate, attractive but not model-perfect. Save
square 800×800 to `web/public/clients/$SLUG/team/`.

### Step 4 · Wire the assets into content (15 min)

In `es.json`, add image URLs to each item:

```json
"home": {
  "services": {
    "items": [
      {
        "name": "Corte Dama",
        "price": "80.000 Gs",
        "imageUrl": "/clients/salon-maria/services/corte-dama.webp"
      }
    ]
  }
}
```

Same for team avatars and hero.

### Step 5 · Mark as demo + ship (15 min)

```json
// In sites/$SLUG/site.json
{
  "is_demo": true,
  ...
}
```

Verify on local:

```bash
cd web && npm run dev
open http://localhost:3000/$SLUG
```

Then commit:

```bash
git add sites/$SLUG/ web/public/clients/$SLUG.svg web/public/clients/$SLUG/
git commit -m "demo($SLUG): polish content + AI assets · closes #061-080"
```

## Quality bar checklist (don't ship until all true)

- [ ] DEMO badge visible on all pages
- [ ] Phone is realistic (not 595981234567 placeholder)
- [ ] Address is a real Paraguayan street
- [ ] Hours format matches style guide (`docs/BUG_HUNT_500.md` #310)
- [ ] Currency is Gs not USD (unless vertical is portfolio-pro)
- [ ] All images load and are < 200kb each
- [ ] No `__placeholder__` strings anywhere in the rendered page
- [ ] WhatsApp pre-filled message includes the business name + asks
      for what makes sense for that vertical
- [ ] Mobile renders without horizontal scroll
- [ ] Lighthouse score >= 80 on this demo page

## After polishing 1 demo

Reflect: did this take longer than 3 hours? Why?
- If content authoring was slow → improve the per-vertical content template
- If image generation was slow → save the prompt as a reusable template
- If wiring was slow → improve the `is_demo` schema or the asset path convention

Don't scale to demo 2 until the workflow feels predictable.

## After polishing 5 demos

Reflect: which content patterns repeat?
- Promote them to `src/content/<vertical>.content.json` defaults
- Reduce per-demo authoring time

## Anti-patterns to avoid

- ❌ Polishing all 13 demos in parallel before validating the workflow on 1
- ❌ Generating images first, content second
- ❌ Using AI face generation for "real client" testimonials (legal + trust)
- ❌ Skipping the DEMO badge "because it's obvious from context"
- ❌ Reusing the same hero image across multiple demos
- ❌ Letting one demo block the launch — accept good-enough on 80% of items

## When to stop

Polishing demos is an infinite well. Stop when:
- Top 5 demos for your top 5 verticals are flagship-quality
- The remaining 8 are "presentable" (no placeholder phone, has hero,
  has DEMO badge)
- You can show prospects something for any of the 16 verticals you
  market

Beyond that, polish should be replaced with **acquiring real clients
whose actual sites become the new demos**. Real beats polished every
time.
