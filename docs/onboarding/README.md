# Client Onboarding

Process + questionnaires for turning a new client into a live tenant on `paragu-ai.com/<slug>` (or their own custom domain).

## The end-to-end flow

```
Discovery ──► Questionnaires ──► Content sign-off ──► Build & deploy ──► Launch
   30 min        1–3 days           0.5–1 day          48 hours          ~2 min
```

| Phase | Owner | Artefacts |
|---|---|---|
| 1. Discovery (sales call) | Sales | [`00-quick-start.md`](./00-quick-start.md) — 10 fields, ~10 min |
| 2. Full questionnaire | Client | [`01-master-questionnaire.md`](./01-master-questionnaire.md) (universal) + relevant vertical addendum from [`02-vertical-addenda.md`](./02-vertical-addenda.md) + any features from [`03-features-addenda.md`](./03-features-addenda.md) |
| 3. Content sign-off | Client + Copy team | Reviewed copy, approved images, legal templates acknowledged |
| 4. Build & deploy | Engineering | `sites/<slug>/` folder committed, deployed to staging → signed off → promoted to prod |
| 5. Launch | Operations | DNS cutover (for custom domain), stakeholder announcement, post-launch QA |

## Decision tree — which questionnaires a client fills

```
Every client ──► 00-quick-start.md           (sales)
              ──► 01-master-questionnaire.md (universal)
                       │
                       ▼
               what vertical?
                       │
          ┌────────────┼──────────────┬─────────────┬─────────────┐
          ▼            ▼              ▼             ▼             ▼
   beauty-wellness  gastronomia  profesionales  portafolio  relocation
      A            B            C              D           E
          │            │              │             │             │
          ▼            ▼              ▼             ▼             ▼
          └─────────── pick sections of 02-vertical-addenda.md ──────┘

Features on top (pick any that apply) ──► 03-features-addenda.md:
  booking · blog · multi-currency · WhatsApp · newsletter · multi-locale ·
  GDPR cookies · AML (relocation) · INAN (food) · payments · analytics
```

## Artefact → JSON mapping

Every answer maps to a file under `sites/<slug>/` or a vertical config under `src/`. The questionnaires note the target JSON field for the engineering team.

| Questionnaire section | Maps to |
|---|---|
| Business identity (slug, name, domain, locales) | `sites/<slug>/site.json` |
| Brand (colors, fonts) | `sites/<slug>/tokens.json` |
| Copy (per locale) | `sites/<slug>/content/<locale>.json` |
| Page structure | `sites/<slug>/pages/<page>.json` |
| Images | `sites/<slug>/assets/` |
| Blog posts | `sites/<slug>/blog/<locale>/*.md` |
| Integrations (Calendly, HubSpot, Mailchimp, GA4, WhatsApp) | `sites/<slug>/site.json › integrations` |
| Legal templates | `src/compliance/*.template.md` (shared) + tenant opt-in flags |

See [`ARCHITECTURE.md`](../../ARCHITECTURE.md) for the composition pipeline.

## Tenant slug conventions

- kebab-case, 3–40 chars, ASCII lowercase + digits + hyphens
- Should read well in a URL: `/mi-cafe-asuncion` ✓, `/mcaf11` ✗
- Avoid numbers if the business doesn't use one
- If the client has a preferred brand like "Salón María" → `salon-maria`
- Must NOT clash with existing demo slugs (`salon-maria`, `gymfit-py`, `spa-serenidad`, `tinta-viva`, etc.) — check `sites/` before picking

## Delivery format to the client

Questionnaires are plain Markdown — you can:
- Copy them into a Google Doc / Notion page and share with the client for editing
- Email them as PDF with instructions to reply inline
- Walk through them verbally on a Zoom call, filling in as you go
- Convert to a Typeform / Tally form for self-serve

Keep one version per client under `sites/<slug>/docs/onboarding.md` once filled in, so the answers are committed alongside the tenant config.

## Role-based views

### Sales team
- Run the 10-field Quick Start on the first call
- Hand off qualified leads (budget confirmed, timeline set) to the copy team with the filled Quick Start

### Copy team
- Send full questionnaire to the client within 24h of handover
- Weekly check-in until the universal + vertical sections are complete
- Cross-reference tenant images vs. hero / gallery / team photo needs
- Escalate to legal team for compliance sign-off (PY privacy, AML/SEPRELAD, INAN)

### Engineering team
- Once content is signed off, use `npx tsx web/scripts/new-tenant.ts` to scaffold the `sites/<slug>/` directory
- Fill the JSON from the questionnaire answers — fields are explicitly marked
- Push to `staging` branch → auto-deploys to `staging.paragu-ai.com/<slug>`
- After client signs off on staging, PR to `Main` → auto-deploys to prod

### Client
- Answers the questionnaire once (it's long but thorough; expect 2–4 hours total if answered carefully)
- Reviews staging build
- Signs off or requests changes
- Receives production link + CMS-free handoff docs

## What the client does NOT need to provide

This is intentionally a curated list of what we handle, so clients don't feel they need to be web designers:

- **Visual design** — we apply their brand colors/fonts to a proven layout
- **Code** — zero; their site is pure configuration
- **SEO structure** — we generate title tags, meta descriptions, JSON-LD automatically per page
- **Mobile responsiveness** — baked into every section component
- **Hosting / domain / SSL** — all handled
- **WhatsApp button placement** — standard, configurable
- **Cookie banner** — standard compliance flow, they only pick which integrations load
- **Language detection** — automatic per their locale list

## What the client MUST provide

- **Clear answers** to the questionnaire (ambiguity = delays)
- **Imagery** — at minimum a logo + hero image + 3–6 gallery images + team photos if using team section
- **Copy in the primary language** (we translate to additional locales on request, marked clearly as machine/professional)
- **Legal sign-off** on the privacy policy text (Paraguay LPDP-aligned template provided)
- **Integration credentials** — if they want HubSpot/Calendly/GA4/WhatsApp wired

## After launch — what's maintained vs. static

| Changes without deploy | Changes requiring deploy |
|---|---|
| Blog posts (if they CMS) | Adding new sections / pages |
| WhatsApp message text (via env) | Brand colours, fonts |
| Open/close hours (if DB-backed) | Copy outside blog |
| Images (if R2-backed) | Integrations |

Currently most content lives in JSON in the repo → changes require a deploy. A self-serve content CMS is a future feature. See `docs/02_STRATEGY/` for roadmap.

---

_Last reviewed: April 2026._
