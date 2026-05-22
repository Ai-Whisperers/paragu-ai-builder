# Nexa Paraguay — pre-launch inventory

> Concrete punch-list of placeholder content currently shipped in the site.
> Every row blocks (or doesn't) the flip from `is_demo: true` →
> `is_demo: false`. Ordered by impact on trust/conversion.
>
> **Companion docs:**
> - `LAUNCH.md` — blocking decisions + secret/env checklist
> - `DEMO_CONTENT.md` — what demo mode renders vs production
> - `STAKEHOLDER-QA.md` — per-section questions for client sign-off
> - `TESTIMONIALS_GATING.md` — the single hardest gate (GDPR consent)

## Impact legend

| Tier | Meaning |
|---|---|
| 🔴 **BLOCKING** | Cannot flip to production with this in place. Client/legal liability, GDPR, or direct conversion killer. |
| 🟠 **SIGNIFICANT** | Can ship but conversion leaves money on the table. Fix within 2 weeks of launch. |
| 🟡 **LOW** | Ship as-is; iterate post-launch. |

## Cost legend

| Symbol | Time to swap once content arrives |
|---|---|
| ⏱️ | <15 min (1 file edit) |
| ⏱️⏱️ | 1-2 h (wiring + regen tenant-data) |
| ⏱️⏱️⏱️ | 4+ h (multi-file, schema change, or asset pipeline) |

---

## 1. People & testimonials 🔴

The biggest trust-killer for an investor audience is fake faces. AI-generated
portraits on team or testimonials, even labeled "placeholder," start failing
due-diligence conversations immediately.

| # | Item | Current state | Needed | Cost |
|---|---|---|---|---|
| 1.1 | 🔴 Founder photo + bio | `/fundador` shows "Fundador" (generic label), no photo | Real name, real photo (headshot 800×1000), 2-paragraph bio | ⏱️ once provided |
| 1.2 | 🔴 Senior lawyer photo + name | "Abogado senior" placeholder | Real name, photo, paragraph with licence + bar registration number | ⏱️ |
| 1.3 | 🔴 Tax accountant photo + name | "Contador" placeholder | Real name, photo, paragraph with CPA credentials | ⏱️ |
| 1.4 | 🔴 Testimonial #1-5 on `/casos-de-exito` | "M. — Alemania", "J. — Países Bajos", etc. — anonymised initials with AI portraits | 3-5 real clients, signed consent form (`TESTIMONIALS_GATING.md`), real quote, real photo OR explicit opt-in for named-but-no-photo | ⏱️⏱️ |
| 1.5 | 🔴 Testimonial portraits in `/images/testimonials/` | AI-generated faces (`testimonial-client-1.png`..`testimonial-client-5.png`) | Real photos OR remove portraits entirely and keep quote-only | ⏱️ swap |
| 1.6 | 🟠 Team page portraits on `/sobre` | AI-generated portraits | Real photos of every named team member | ⏱️ per person |

**Gate:** every row here needs **signed GDPR consent** per person. See
`TESTIMONIALS_GATING.md`. Until all 🔴 rows have consent on file, legal
cannot clear the `is_demo: false` flip.

---

## 2. Pricing & commercial claims 🔴

Pricing claims become legally binding on flip. Current content has several
TBD values and round-number guesstimates that may or may not be what the
client actually sells.

| # | Item | Current state | Needed | Cost |
|---|---|---|---|---|
| 2.1 | 🔴 Paraguay Base retail price | "USD 2.900" (round number, no priceNote explaining scope) | Confirm: is USD 2,900 the retail price? What's included vs extras? | ⏱️ |
| 2.2 | 🔴 Paraguay Business retail price | "USD 4.400+" with "Precio desde" note | Confirm the 4,400 floor and what variables push it up | ⏱️ |
| 2.3 | 🔴 Paraguay Investor retail price | "USD 6.900+" with "Precio desde" note | Same confirmation | ⏱️ |
| 2.4 | 🔴 Compra de Tierras pricing | "Desde USD 3.500" placeholder | Either lock retail OR remove tier entirely and ship 3-column grid (see `STAKEHOLDER-QA.md` §B1) | ⏱️ if remove / ⏱️⏱️ if reshape grid |
| 2.5 | 🔴 "Todo incluido" claims | Each tier's priceNote says "Honorarios, IVA y tasas incluidas" or similar | Legal sign-off that this is accurate; list edge-case exclusions (expedited fees, third-party translations, etc.) | ⏱️ once copy locked |
| 2.6 | 🟠 Wholesale-cost references | Already scrubbed of LEALTIS mentions (PR #177+) but audit any remaining partner reveals | Audit pass on all 4 locales for partner-firm names | ⏱️ |
| 2.7 | 🔴 Tax savings calculator numbers | Hard-coded country rates + generic salary bands | Legal review: are the tax deltas we're showing legally defensible marketing claims or "projections"? Add disclaimer if marketing | ⏱️ add disclaimer |

---

## 3. Translations 🔴

The DE locale has `_meta.translationQuality: "machine"`. That text *cannot*
ship to a production domain without the `ALLOW_MACHINE_TRANSLATIONS=1`
override — `validate-sites.ts` enforces this as an error gate. Either flip
the gate (risky) or ship pro translation first.

| # | Item | Current state | Needed | Cost |
|---|---|---|---|---|
| 3.1 | 🔴 DE locale quality | Seeded MT output (`sites/nexa-paraguay/content/de.json` `_meta.notes`) | Professional human translation of ~20k words, review by native DE speaker | ⏱️⏱️⏱️ external dependency |
| 3.2 | 🟠 NL locale spot-check | Not flagged as machine, but seeded ~18 months ago | Native NL speaker read-through on 8 top pages (home, programas, proceso, sobre, faq, contacto, fundador, comparacion) | ⏱️⏱️ per locale |
| 3.3 | 🟠 EN locale spot-check | Not flagged as machine | Native EN speaker read-through (lower priority — less conversion weight than DE/NL) | ⏱️⏱️ |
| 3.4 | 🟡 PT locale | Not shipped at all | Defer to Phase 2; Brazilian investors are a distinct market | — |

---

## 4. Imagery 🟠

Hero images, blog covers, and section backgrounds are AI-generated. For an
institutional look, stock + real photography reads better than AI.

| # | Item | Current state | Needed | Cost |
|---|---|---|---|---|
| 4.1 | 🟠 Hero background (all 4 locale variants + mobile) | AI-generated `hero-bg*.webp` | Real Asunción photography OR license Unsplash-editorial-grade stock | ⏱️⏱️ re-optimize + regen tenant-data |
| 4.2 | 🟠 "Why Paraguay" pillar images (4) | AI-generated `why-paraguay/*.webp` | Real photography for each pillar (economic, investment, lifestyle, tax) | ⏱️ |
| 4.3 | 🟠 Blog cover images (~10 posts) | AI-generated per post | Real editorial photography or stock per post | ⏱️ per post |
| 4.4 | 🟠 Process step illustrations | AI-generated `process/*.webp` | Can stay AI OR replace with icon-only (Lucide) treatment — lower lift | ⏱️ |
| 4.5 | 🔴 Logo | Text-only Playfair wordmark (placeholder) | Real logo SVG + icon mark + favicon set | ⏱️⏱️ wiring (set in `brand.*` manifest) |

---

## 5. Integrations & endpoints 🔴

Several integrations are wired but require client-provided credentials.
Without them, contact forms fail-soft to mailto — functional but leaves
CRM/email-list tracking blind.

| # | Item | Current state | Needed | Cost |
|---|---|---|---|---|
| 5.1 | 🔴 Calendly URL (booking-embed section) | Placeholder `https://calendly.com/nexaparaguay/consulta` — 404 today | Real Calendly account + event type URL (see `LAUNCH.md` #4) | ⏱️ env var only |
| 5.2 | 🔴 HubSpot portal + form id | Not configured → `/api/leads` returns 502 for CRM forward | `CRM_PORTAL_ID` + `CRM_FORM_ID` env vars | ⏱️ env var only |
| 5.3 | 🔴 Mailchimp API key + list id | Not configured → newsletter fails soft | `MAILCHIMP_API_KEY` + `MAILCHIMP_LIST_ID` env vars | ⏱️ env var only |
| 5.4 | 🔴 GA4 measurement id | Not configured → no analytics firing | `NEXT_PUBLIC_GA4_ID` env var | ⏱️ env var only |
| 5.5 | 🟠 Crisp website ID (live chat) | Not configured → no chat widget | `NEXT_PUBLIC_CRISP_WEBSITE_ID` env var | ⏱️ env var only |
| 5.6 | 🔴 WhatsApp number | Placeholder `+595 000 000 000` in `content.whatsapp.phone` | Real Nexa WhatsApp Business line | ⏱️ content edit + regen |
| 5.7 | 🔴 Contact phone + email | Placeholder values in `content.contact.*` | Real values | ⏱️ |

---

## 6. Legal & compliance 🔴

These block launch absolutely. No workarounds.

| # | Item | Current state | Needed | Cost |
|---|---|---|---|---|
| 6.1 | 🔴 Privacy policy (`/privacidad`) | Draft content covering GDPR basics | Attorney review + stamp | ⏱️⏱️ external |
| 6.2 | 🔴 Terms of service | Not present in nav | Attorney-drafted, wired into footer | ⏱️⏱️⏱️ write + wire |
| 6.3 | 🔴 Compliance disclaimer | Exists as `compliance-disclaimer-footer` section | Attorney review of current copy | ⏱️⏱️ |
| 6.4 | 🔴 SEPRELAD (anti-money-laundering) registration | Currently unclear | Confirm Nexa Paraguay is a reporting entity; update `seprealadAttestation` copy to match | ⏱️⏱️ |
| 6.5 | 🔴 Consent forms (client-facing) | No downloadable PDFs for clients to sign | `/recursos` should host: consent template, intake form, KYC checklist | ⏱️⏱️⏱️ |

---

## 7. Resource downloads 🟠

`/recursos` currently lists 3 guides (checklist documental, guía fiscal,
Q&A inversores) but the PDF files don't exist. Clicking either 404s or
shows placeholder link text.

| # | Item | Current state | Needed | Cost |
|---|---|---|---|---|
| 7.1 | 🟠 Document checklist PDF | Listed, no file | Written content + PDF export | ⏱️⏱️⏱️ per doc |
| 7.2 | 🟠 Tax guide 2026 PDF | Listed, no file | Written content + legal review + PDF export | ⏱️⏱️⏱️ |
| 7.3 | 🟠 Investor Q&A PDF | Listed, no file | Content exists in `STAKEHOLDER-QA.md` — extract and polish for external | ⏱️⏱️ |

---

## 8. Stats & social proof 🟠

Current testimonial.stats claims are "250 clients" and "98% satisfaction".
These are fabricated for demo purposes.

| # | Item | Current state | Needed | Cost |
|---|---|---|---|---|
| 8.1 | 🔴 Total clients count | 250 (fabricated) | Real number or remove | ⏱️ |
| 8.2 | 🔴 Satisfaction rate | 98% (fabricated) | Real NPS/CSAT data or remove | ⏱️ |
| 8.3 | 🔴 Average rating | 4.9 (fabricated) | Real data or remove | ⏱️ |
| 8.4 | 🟠 Client-origin country list | Already cleaned (removed Uruguay in #227, has Argentina/Brasil/Chile/Colombia/España/Estados Unidos) | Confirm this reflects reality | ⏱️ |

---

## Critical-path checklist (what flips `is_demo: false`)

Before running production paid traffic, every 🔴 row above must be resolved:

### Must-fix-before-launch (blockers, approximate owners)
- [ ] All 🔴 in §1 People & testimonials — **owner: commercial + legal**
- [ ] All 🔴 in §2 Pricing & commercial claims — **owner: commercial + legal**
- [ ] Row 3.1 DE translation — **owner: marketing (hire translator)**
- [ ] Row 4.5 Logo — **owner: designer**
- [ ] All 🔴 in §5 Integrations — **owner: ops (env vars in Cloudflare)**
- [ ] All 🔴 in §6 Legal — **owner: legal (external attorney)**
- [ ] All 🔴 in §8 Stats — **owner: commercial**

### Safe-to-ship-and-iterate (not blockers)
- Every 🟠 row can land in production as-is; replace within first 2 weeks.
- Every 🟡 row is fine indefinitely.

### Code-side flip

Once the checklist clears:

```diff
 // sites/nexa-paraguay/site.json
-  "is_demo": true,
+  "is_demo": false,
   "demoMode": {
-    "enabled": true,
+    "enabled": false,
-    "aiPlaceholdersAllowed": true
+    "aiPlaceholdersAllowed": false
   }
```

Plus in `sites/nexa-paraguay/content/de.json`:

```diff
   "_meta": {
-    "translationQuality": "machine",
+    "translationQuality": "human",
     "notes": "..."
   }
```

## What unlocks automatically on flip

- Lighthouse SEO score jumps from 0.66 → 0.9+ (removes `noindex, nofollow`).
- Sitemap starts listing Nexa pages.
- Testimonials `is-crawlable` + `meta-robots` audits pass.
- `/privacidad` legal text can stop showing draft watermarks.
- Analytics events start firing (once `NEXT_PUBLIC_GA4_ID` is set).

## Open questions for client

1. Which 3-5 clients will sign testimonial consent forms first? (Bottleneck.)
2. Is Compra de Tierras a real product at launch, or a "coming soon" teaser?
3. Do we have the budget + timeline for real photography in Asunción, or ship with licensed stock?
4. Who owns the Calendly + Mailchimp + HubSpot + GA4 accounts — Nexa directly, or managed by the marketing agency?
5. Has legal counsel been engaged for attorney review of privacy + ToS + disclaimer?

---

*Document generated 2026-04-21. Re-audit once client sign-off on the blocking checklist is received.*
