# AI-generated assets · production plan

> **Question from launch questionnaire (§4.1, §4.2, §4.3):** "make a detaild plan
> for all teh assests we need for all clients etc and aslo for all demo websites
> to generate all of them with AI"

## What we need, by category

| Asset class | Target count | Where consumed |
|---|---|---|
| Client logos (real tenants) | 5 | LogoStrip, tenant headers |
| Demo logos (13 fictional businesses) | 13 | Demo tenant headers |
| Hero images (real tenants) | 5 | Tenant home hero |
| Hero images (demos) | 13 | Demo home hero |
| Service/product photos (real) | ~30 (6 per tenant avg) | Tenant catalog/services |
| Service/product photos (demos) | ~80 | Demo catalog/services |
| Team / founder photos (real) | 3 | Case studies, About pages |
| Team / founder photos (demos) | ~25 | Demo team sections |
| Testimonial avatars | ~15 | Tenant testimonial sections |
| Walkthrough video (60s) | 1 | Marketing landing VideoBlock |
| Open Graph variant images | already done | Per-vertical, per-city |

**Estimated total:** ~190 images + 1 video.

## Tools (current best-in-class as of 2026-04-20)

### Logos · vector

| Tool | Cost | Strength | Use for |
|---|---|---|---|
| [Recraft v3](https://www.recraft.ai/) | Free tier · paid from $12/mo | Vector-native, brand-consistency mode | All 18 logos |
| Looka.com | $20/logo | Templated, very fast | Backup if Recraft style doesn't fit |
| Hand-drawn → vectorized via Adobe Capture | free if you have CC | One-off, very on-brand | The 5 real clients only if Recraft fails |

**Recommended:** Recraft v3, single project per brand. Each brand gets 5-10
vector iterations; pick one + 2 alternatives.

### Hero images / lifestyle photos

| Tool | Cost | Notes |
|---|---|---|
| [Midjourney v7](https://www.midjourney.com/) | $10/mo | Best quality, slow iteration |
| [Leonardo.ai](https://leonardo.ai/) | Free tier · $12/mo | Faster iteration, decent quality |
| [Flux Pro 1.1](https://blackforestlabs.ai/) (via Replicate) | $0.04/image | Best photorealism for product/business |
| Stable Diffusion 3.5 Large via [Replicate](https://replicate.com/) | $0.04/image | Open-source, repeatable |

**Recommended:** Flux Pro for hero/product (photoreal), Midjourney for stylized
brand imagery.

### Team / portrait avatars

> ⚠️ Generated portraits are an ethical gray area when posing as real testimonials.
> For **demo tenants**, AI-generated faces are fine. For **real client testimonials**,
> get real photos with permission (already noted in questionnaire §4.3).

| Tool | Cost | Notes |
|---|---|---|
| [GenerativePhotos](https://generated.photos/) | Free with attribution · paid for commercial | Pre-generated diverse portraits, no prompt needed |
| Midjourney v7 + portrait prompts | $10/mo | More control |
| Avatar from initials (Boring Avatars / DiceBear) | free | If you'd rather not use AI faces at all |

**Recommended for demos:** GenerativePhotos for variety, no per-image cost.
**Recommended for real testimonials:** real photos when available, **initials avatar fallback** if not — never AI-faces masquerading as a real client.

### Walkthrough video (60s)

| Approach | Cost | Effort | Quality |
|---|---|---|---|
| **Text → AI video** ([Runway Gen-3](https://runwayml.com/), [Luma Dream Machine](https://lumalabs.ai/dream-machine), [Sora](https://openai.com/sora/)) | $30-100 for ~60s | Low | Improving fast but still has surreal artifacts. Risky for product demos. |
| **AI avatar reading a script** ([HeyGen](https://www.heygen.com/), [Synthesia](https://www.synthesia.io/)) | $30/mo | Low | Solid for explainers. The avatar feels generic but the message lands. |
| **AI voiceover + screen recording** (you record screen, AI does voice via [ElevenLabs](https://elevenlabs.io/)) | $5/mo + 1h of work | Medium | **Recommended.** Authentic screen + clean voice. |
| **Manual record** (Loom) | free | 1h of work | Best for trust |

**Recommended:** AI voiceover + screen recording.
1. Record yourself doing the WhatsApp → demo flow on Loom.
2. Write a clean 60-second script.
3. Generate voiceover with ElevenLabs (Spanish PY-flavored voice).
4. Edit in [DaVinci Resolve](https://www.blackmagicdesign.com/products/davinciresolve/) (free) or [CapCut](https://www.capcut.com/) (free).
5. Upload to YouTube as unlisted, embed in `<VideoBlock embedUrl="...">`.

## Asset brief (template per asset)

Use this spec for every generation request. Saves rework.

```
Brand: <client name>
Vertical: <peluqueria | gimnasio | etc>
Location: Asunción / [city]
Mood: <warm / clinical / energetic / serious>
Colors: <#hex from sites/<slug>/tokens.json>
Avoid: <things that don't fit, e.g. "no pink", "no abstract">
Aspect ratio: <16:9 hero / 1:1 portrait / 4:3 service / vector svg>
Output count: 4 variations
```

## Workflow

### Phase 1 — Real tenants (week 1)

| # | Asset | Tool | Status |
|---|---|---|---|
| 1.1 | Nexa Paraguay logo (refine existing or new) | Recraft | TODO |
| 1.2 | Nexa Paraguay hero — Asunción rooftop / cityscape | Flux Pro | TODO |
| 1.3 | Nexa Paraguay programs section icons (4) | Recraft | TODO |
| 1.4 | Nexa Uruguay logo (variant of PY) | Recraft | TODO |
| 1.5 | Nexa Propiedades logo (variant of PY) | Recraft | TODO |
| 1.6 | Nexa Propiedades — Asunción residential property photos (3) | Flux Pro | TODO |
| 1.7 | Dayah Litworks logo | Recraft | TODO |
| 1.8 | Dayah Litworks portfolio mockups (5 fake book covers) | Midjourney | TODO |
| 1.9 | De Abasto a Casa logo | Recraft | TODO |
| 1.10 | De Abasto a Casa weekly menu photos (10 dishes) | Flux Pro | TODO |

### Phase 2 — 13 demo tenants (week 2)

For each demo (`salon-maria`, `gymfit-py`, `studio-belleza`, etc.):
- 1 logo (Recraft)
- 1 hero (Flux Pro)
- 4-6 service photos (Flux Pro)
- 2-3 team avatars (GenerativePhotos)
- "DEMO" badge overlay (one shared SVG)

Rough estimate: 10 images per demo × 13 demos = **130 images**, ~$10 in
Replicate credits if using Flux Pro at $0.04 each.

### Phase 3 — Walkthrough video (week 3)

1. Script — 60s, Spanish PY voice
2. Loom screen recording of the actual WhatsApp → demo flow
3. ElevenLabs voiceover (~$5)
4. CapCut edit (~30 min)
5. YouTube unlisted upload
6. Embed URL into `<VideoBlock>`

## Asset storage

- **Real client images:** `web/public/clients/<slug>/<image>.{webp,jpg,svg}`
- **Demo images:** `web/public/demos/<slug>/<image>.{webp,jpg,svg}`
- **Logos in LogoStrip:** `web/public/clients/<slug>.svg`
- **Hero in tenant content JSON:** `"images.hero": "/clients/<slug>/hero.webp"`

Use [Squoosh](https://squoosh.app/) to convert AI output (PNG) → WebP at q=80
before committing. Saves ~50% file size.

## Commit cadence

One PR per phase, one commit per tenant within a phase. Reviewer can spot-check
each tenant independently.

## Ethics & accuracy guard-rails

- ✅ AI-generated faces for **demo tenants** (clearly fictional)
- ❌ AI faces presented as real client testimonials
- ✅ AI-generated property photos for `nexa-propiedades` if labeled "ejemplo"
- ❌ AI-generated property photos presented as actual listings
- ✅ AI-generated logos as starting points; refine with the client before "official"
- ❌ AI-generated press mentions or fake reviews

## Budget

| Tool | Plan | Monthly |
|---|---|---|
| Recraft v3 | Pro | $12 |
| Midjourney | Standard | $10 |
| Replicate | pay-per-use | ~$15 (Phase 1) + ~$10 (Phase 2) one-off |
| ElevenLabs | Starter | $5 |
| Flux Pro via Replicate | included above | — |
| **Total month 1** | | **~$50** |
| **Total ongoing (after Phase 1-3)** | | **~$22/mo** (Recraft + MJ for tweaks) |

## Out of scope here (do separately)

- Actual brand identity work (typography, full brand book) — hire a human for
  $300-500 if Nexa wants a serious upgrade
- Photography of the real founders — schedule a session, no AI
- Video testimonials from real clients — schedule, no AI

---

> When you're ready to start, ping me with which tenant to do first and I'll
> draft the per-asset prompts following the brief template above.
