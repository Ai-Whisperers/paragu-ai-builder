# Real Clients — Build & Improve Roadmap

> Six real tenants as of April 2026. Three live in `sites/` as proper tenants, three still live in `web/lib/engine/demo-data.ts` and need migration. Every improvement below should land as a **reusable engine capability**, not a client-specific patch.

## The clients

| # | Slug | Business | Vertical | Where | Stage |
|---|------|----------|----------|-------|-------|
| 1 | **nexa-paraguay** | EU → PY relocation | real-estate-relocation | `sites/` | Staging green, prod-blocked by stakeholder decisions |
| 2 | **nexa-propiedades** | PY residential real estate | real-estate-relocation (inmobiliaria) | `sites/` | MVP — only home page authored |
| 3 | **nexa-uruguay** | EU → UY relocation | real-estate-relocation | `sites/` | Reproducibility spike; staging deployable |
| 4 | **nexaparaguay** (legacy) | Same business as #1 | relocation | `demo-data.ts` | Legacy alias; unify with sites/nexa-paraguay |
| 5 | **dayah-litworks** | Indie book cover design | portfolio-professional (diseno_grafico) | `demo-data.ts` | Needs migration to `sites/` |
| 6 | **de-abasto-a-casa** | Weekly groceries + mise-en-place delivery, San Lorenzo | food-beverage (meal_prep) | `demo-data.ts` | Needs migration + custom flows |

---

## Cross-client action: migration out of demo-data.ts

Three real tenants (#4, #5, #6) currently live in `web/lib/engine/demo-data.ts` — a file explicitly deprecated as "Paraguay-era fixtures". Treating real clients as fixtures risks accidental deletion during cleanup.

**Action**: create `sites/<slug>/` folders with `site.json`, `content/es.json` (+ more locales as needed), `pages/*.json`, `tokens.json`. Everything they need is already in the demo-data entry — it's a structural move, not authoring.

**Reusable deliverable**: a `npm run cli migrate-demo-to-site <slug>` subcommand that reads the demo-data entry and emits the tenant folder.

---

## 1. Nexa Paraguay — flagship

### Current state
- 9 pages × 4 locales (nl/en/de/es), blog index + posts per locale
- HubSpot + Mailchimp + Calendly + GA4 integrations declared
- Launch runbook + DNS cutover guide in `docs/`
- Navy + Champagne Playfair theme

### Reality gaps
| Gap | Impact | Reusable fix |
|-----|--------|--------------|
| 12 stakeholder decisions blocking prod | Can't go live | Not code — external |
| No paying customer dashboard | Customers have no visibility after signup | `customer-portal` vertical addon (Nexa Uruguay + future countries benefit) |
| Hardcoded program prices say "TBD" / "Consultar" | Conversion-killing | `pricing-with-confidential-cta` variant of `pricing` section (hide amount, show "request quote") |
| No lead-scoring on HubSpot handoff | Sales sees raw submissions | Enrichment step in `/api/leads` (adds geolocation, source, locale, UTM) — used by every site |
| Machine-quality DE translation flagged but not gated | SEO risk | Translation-quality metadata in locale files; build warns if flagged locales ship |

### Priority engine work (benefits all 3 Nexa tenants)
1. **Lead enrichment middleware** in `/api/leads` — attach UTM, locale, source, client IP → country, before CRM forward. ~1 day.
2. **`pricing-with-confidential-cta` section variant** — reusable for any B2B vertical that can't publish prices. ~half day.
3. **Translation quality flag in locale content** — `_meta.translationQuality: "machine" | "human" | "reviewed"` + build warning. Benefits every multi-locale tenant. ~half day.
4. **SEPRELAD / AML disclosure section** — compliance-type section for finance-adjacent and relocation-adjacent verticals. ~half day.
5. **Email nurture → Mailchimp Customer Journey importer** — `sites/nexa-paraguay/email-nurture.json` already declares the 7-email sequence; need the importer script. ~1 day.

---

## 2. Nexa Propiedades — real estate MVP

### Current state
- `site.json` declares 4 pages (home, propiedades, servicios, contacto) but only home exists
- Features flag `mortgageCalculator: true` but no implementation wired
- IG + FB + phone all real

### Reality gaps
| Gap | Impact | Reusable fix |
|-----|--------|--------------|
| `/propiedades` 404s — navigation broken | User can't actually browse listings | Author page using the existing `property-listings` section component |
| No property data source | Nothing to list | Supabase `properties` table + `/api/properties` — reusable by every inmobiliaria tenant |
| `mortgageCalculator: true` but no section | Flag lies | Build `mortgage-calculator-section.tsx` (note: we just deleted a Granja-Cabral one — different shape; this one is real-estate specific with PY/EU bank rates) |
| No agent profiles despite `agentProfiles: true` | Flag lies | Reuse existing `team` section; add `realtor` sub-profile with listings-owned count |
| No PT-BR content despite locale declared | Brazilian buyers see Spanish | Author pt.json (blocker for Ciudad del Este / border market) |

### Priority engine work
1. **`properties` data model in Supabase** + `/api/properties` GET/filter. Reusable by: nexa-propiedades, future PY/UY/regional real-estate clients. ~2 days.
2. **`mortgage-calculator` section with locale-aware rates** — EU mortgage intent for expats is a key conversion path. ~1 day.
3. **`listings-from-api` variant of `property-listings`** so the section can render from `/api/properties` instead of inline content. ~half day.
4. **PT-BR locale scaffolding** — benefits every PY border-adjacent tenant. Ship empty `pt.json` first, populate as content authored.

---

## 3. Nexa Uruguay — reproducibility proof

### Current state
- Full 9-page clone of nexa-paraguay, theme swapped, 2 locales (en/es)
- Explicitly called "reproducibility spike" in its docs
- Likely not yet pitched to real customers

### Reality gaps
| Gap | Impact | Reusable fix |
|-----|--------|--------------|
| Uruguay law ≠ Paraguay law — content copy-pasted | Legal risk if customer acts on it | Legal-review flag per locale/page; build fails on unsigned pages for high-regulation verticals |
| No custom domain cutover yet | Staging only | Same DNS runbook as nexa-paraguay, no new work |
| No UY tax-residency pricing | Can't convert | Uruguay has a 10-year tax holiday that's a huge selling point — `tax-holiday-banner` section variant (reusable for any country-specific program) |

### Priority engine work
1. **Legal-review flag + build gate** — each page/locale declares `reviewedBy: "<lawyer-name>" | null`; build fails in `regulation: high` verticals if any `null`. Reusable for all finance/health/legal verticals. ~1 day.
2. **Country-specific "why-here" section** — already exists as `why-destination`; needs a variant that accepts program-specific highlights (tax holiday, residency route, bilateral treaties). ~half day.
3. **Programmatic hreflang generation** — right now each tenant declares locales manually; automate from `site.json.locales`. ~2 hours.

---

## 4. nexaparaguay (legacy demo-data entry)

### Reality
Duplicate of #1 living in demo-data.ts. Probably served as a stopgap before `sites/nexa-paraguay/` was scaffolded.

### Action
**Delete after verifying `/nexaparaguay` URL is routed to `sites/nexa-paraguay/`.** Runs the risk of serving stale data right now — two representations of the same business drifting.

**Reusable deliverable**: `npm run cli audit-duplicates` subcommand that finds slugs appearing in both demo-data.ts AND `sites/` and flags drift.

---

## 5. Dayah LitWorks — indie book cover designer

### Current state
- Type: `diseno_grafico` (generic graphic design)
- Sells: custom ebook + paperback covers, 3D mockups (static + animated video), pre-made cover packs per genre (fantasy, romance, thriller, sci-fi, horror)
- Products are listed as inventory items (USD pricing, "Susurros del Bosque" $35, etc.)
- No hours, no address — fully online; WhatsApp + IG only
- Target: indie authors / self-publishers

### Reality gaps
| Gap | Impact | Reusable fix |
|-----|--------|--------------|
| `diseno_grafico` is too generic | Missing book-cover-specific sections | New type `book_cover_designer` extending `diseno_grafico` with premade-cover catalog + mockup showcase |
| Pre-made covers are sold as products but site has no checkout | Lost sales on productized offering | **Reusable**: a `digital-product-catalog` section with "buy now via WhatsApp / Stripe" flow — applies to any creator selling pre-made assets |
| USD pricing but no multi-currency support | Friction for PY buyers | Multi-currency rendering (already partially in Nexa's `currency` placeholder pattern; extract as shared util) |
| No before/after gallery of cover commissions | Portfolio thin | `portfolio-before-after` variant — reusable for designers, photographers, tattoo artists, architects |
| No creator process explanation | Objection: "how does this work?" | `process` section already exists; needs a `creative-commission-process` variant (brief → sketches → revisions → delivery) |
| No genre filter on premade covers | Bad UX with 6+ products | Reuse `product-catalog` with `categories` filter (already supported!) — just need content authored |

### Priority engine work
1. **New type: `book_cover_designer`** extending `diseno_grafico` with book-specific serviceCategories (custom-ebook, custom-paperback, mockup-static, mockup-video, premade). Reusable for any indie creator serving authors.
2. **`digital-product-catalog` section** — WhatsApp-first checkout for productized services (premade covers, digital templates, Notion templates, preset packs). Reusable for every creator vertical.
3. **Multi-currency rendering utility** (`formatPrice(amount, currency, locale)`) — reuse from Nexa's pattern, apply globally.
4. **`creative-commission-process` variant** of `process` section — 4-step brief/sketch/review/deliver template applicable to designers, tattoo artists, photographers, videographers.
5. **Migration to `sites/dayah-litworks/`** with English locale (indie authors globally, not just PY).

---

## 6. De Abasto a Casa — weekly meal prep, San Lorenzo

### Current state (your business)
- Type: `meal_prep`
- Three service levels with transparent per-week pricing (250k, 400k, 650k, 900k, 1.2M, 1.7M Gs/week)
- Add-ons (desayunos, postres, bebidas)
- "Comidas Listas" tier marked "Proximamente (en habilitacion INAN)" — INAN is Paraguay's food safety authority
- Hours tied to market-shop days (Martes y Jueves: Compras en Abasto)
- Testimonials marked "[Testimonio ilustrativo]" — honest placeholder
- Single-founder team

### Reality gaps
| Gap | Impact | Reusable fix |
|-----|--------|--------------|
| Weekly cadence is core to the model but not surfaced | Customers don't understand they're buying a rhythm, not a one-off | **New section**: `weekly-cadence-calendar` — visualizes "Monday: lista due → Tue: Abasto → Wed-Thu: prep → Fri-Sat: delivery". Reusable by any CSA, laundry service, cleaning subscription |
| Service levels are a ladder (L1 → L2 → L3) but shown as flat list | Customers can't see upgrade path | **Reusable**: `tiered-service-ladder` section — visualizes progression between plans. Applies to gyms, SaaS, meal-prep, any subscription |
| INAN habilitation status is a selling point (trust signal) but buried in a price tag line | Wastes credibility | **Reusable**: `regulatory-status-badge` section — food/health/pharma/financial businesses benefit |
| No "what you'll receive this week" preview | Buyers want concreteness before subscribing | **Reusable**: `sample-week-preview` section — works for any weekly-recurring service |
| No signup intake form (what household size, dietary constraints, dislikes, delivery window) | Sales friction — everything must go through WhatsApp free-text | **Reusable**: `intake-questionnaire` section — food, fitness coaches, personal stylists, concierges all need this |
| No testimonials yet (real), but the placeholder is labeled as such | Good instinct; needs a follow-up flow | **Reusable**: first-30-customers email capture + automated "can we publish your feedback?" sequence |
| Hours tied to market days but no calendar integration | Delivery scheduling is manual | **Reusable**: `delivery-slot-picker` integrated with Calendly or Cal.com — works for any delivery-scheduled business |
| Guaranies pricing only | Expats ordering might want USD | Same multi-currency utility from Dayah |
| No FAQ | Known objections (cold chain? minimum commitment? pause a week?) unanswered | Just author `faq` content — no new engine work |
| No "pause / skip a week" flow | Critical for subscription retention | **Reusable**: `subscription-lifecycle` customer portal — admin UI + customer self-serve pause/resume |

### Priority engine work (high leverage — you are both operator AND platform owner)
1. **`weekly-cadence-calendar` section** — you specifically benefit; reusable across subscription categories.
2. **`tiered-service-ladder` section** — L1/L2/L3 visualization; reusable across subscription verticals.
3. **`intake-questionnaire` section with validations** — per-vertical question packs (food prefs, dietary, household size, address, delivery window). Reusable as a pattern across services.
4. **`sample-week-preview` section** — "this is what last week's customers received" content block. Reusable across CSAs, meal plans, box services.
5. **`delivery-slot-picker` integration** — Cal.com or Calendly variant for delivery windows.
6. **Customer portal MVP** — authenticated area where paying customers manage their subscription (pause/skip/update dietary/view past weeks). Benefits Nexa customer retention too.
7. **Migration to `sites/de-abasto-a-casa/`** so your own business is treated as a first-class tenant with a real domain path.

---

## Extracted common patterns (the real reusable wins)

Ranked by leverage across the real client base:

### P0 — ships in < 1 week, benefits ≥ 3 clients
| Deliverable | Who benefits | Why P0 |
|-------------|--------------|--------|
| `intake-questionnaire` section | De Abasto, Dayah, Nexa × 3, future SMBs | Every service business has this; WhatsApp-only is a friction |
| Multi-currency price rendering | Dayah (USD), De Abasto, Nexa × 3 | Unblocks international pricing everywhere |
| Migration script: demo-data → sites/ | dayah-litworks, de-abasto-a-casa, nexaparaguay | One-shot cleanup prevents accidental deletion of real clients |
| Translation quality flag + build gate | Nexa × 3 | Prevents shipping machine translations to prod |
| `audit-duplicates` CLI subcommand | Operations | Drift detection before it bites |

### P1 — ships in 1-2 weeks, benefits ≥ 2 clients
| Deliverable | Who benefits | Why P1 |
|-------------|--------------|--------|
| `pricing-with-confidential-cta` variant | Nexa × 3, future B2B | Can't publish enterprise prices but can't show "TBD" |
| `tiered-service-ladder` section | De Abasto, gyms, SaaS tenants | Visualizes subscription upgrade paths |
| `creative-commission-process` variant | Dayah, future photographers/tattoo/videographers | Standardizes creator-service flow |
| Lead enrichment middleware | Nexa × 3, all future tenants | Better CRM handoff quality |
| `regulatory-status-badge` section | De Abasto (INAN), finance, health, pharma | Compliance-as-marketing |

### P2 — infrastructure investments, benefit a future pipeline
| Deliverable | Who benefits | Why P2 |
|-------------|--------------|--------|
| `properties` Supabase table + `/api/properties` | Nexa Propiedades + future real-estate | Inmobiliaria without a CMS is hand-editing JSON |
| `mortgage-calculator` section | Nexa Propiedades, future real-estate | Key conversion surface |
| Customer portal MVP | De Abasto retention, Nexa post-sale | Subscription management |
| `weekly-cadence-calendar` section | De Abasto, CSAs, laundry/cleaning subs | Weekly model needs a weekly visual |
| `sample-week-preview` section | De Abasto, meal plans, box services | Buyers need concreteness |
| `delivery-slot-picker` (Cal.com) | De Abasto, any delivery-window service | Replaces manual scheduling |
| Legal-review flag + build gate | Nexa × 3, finance/health tenants | Gates bad-faith deployments |

### P3 — later
| Deliverable | Who benefits | Why P3 |
|-------------|--------------|--------|
| Email nurture → Mailchimp importer | Nexa × 3 | Sequence authored, importer missing |
| `digital-product-catalog` with Stripe | Dayah premades, future creator tenants | Commerce layer adds operational overhead |
| `book_cover_designer` type | Dayah + future book-cover specialists | Narrow niche; works today as `diseno_grafico` |
| Per-locale hreflang automation | All multi-locale tenants | Manual is fine at 3 tenants |

---

## Recommended execution order

1. **Week 1 — migrate real clients out of demo-data.ts.** Build the migration script; run it for `nexaparaguay`, `dayah-litworks`, `de-abasto-a-casa`. Confirms they won't be lost in any future cleanup.
2. **Week 1 — P0 batch.** `intake-questionnaire`, multi-currency util, translation quality flag, duplicate audit. Each is < 1 day.
3. **Week 2 — P1 engine sections.** `pricing-confidential-cta`, `tiered-service-ladder`, `creative-commission-process`, `regulatory-status-badge`. All extend the existing section library — no new infrastructure needed.
4. **Week 3-4 — Nexa Propiedades unblock.** Supabase properties table, API, mortgage calculator, listings from API. Turns a 1-page MVP into a real product.
5. **Week 3-4 — De Abasto engine contributions.** `weekly-cadence-calendar`, `sample-week-preview`, `delivery-slot-picker`. Your own business benefits immediately; reusable for future subscription tenants.
6. **Week 5+ — Customer portal MVP.** Auth + subscription management. Unlocks retention work for Nexa + De Abasto.

---

## Anti-patterns to avoid

- **Custom code per client.** Every pattern above lands in the engine. If a requirement is truly client-specific (e.g., Nexa's SEPRELAD disclaimer wording), it goes into that tenant's content files, not the engine.
- **Deleting demo-data.ts before migration.** Would destroy real client data. Migrate first, delete second.
- **Building checkout infrastructure for Dayah's $35 covers before meal-prep subscription retention for De Abasto.** Low-volume vs high-LTV prioritization.
- **Hand-coding Uruguay-specific UY-law paragraphs in the component layer.** Keep all country-specific content in `sites/<tenant>/content/` — the whole reproducibility spike depends on this discipline.
