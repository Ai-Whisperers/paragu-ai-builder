# Nexa Paraguay — Client Intake & Validation Questionnaire

> **Purpose.** One consolidated document that (a) validates every default we baked into the site, (b) fills every placeholder / TBD / AI-generated asset, and (c) asks the additional questions needed to flip `is_demo: true → false` and run real paid traffic.
>
> **Who fills this.** Nexa Paraguay leadership: commercial director (Europe), operations director (Paraguay), legal counsel. Each section names the likely owner.
>
> **Status legend.**
> - 🔴 **BLOCKER** — cannot go live without an answer
> - 🟠 **SIGNIFICANT** — can soft-launch but needed within 2 weeks
> - 🟡 **NICE-TO-HAVE** — iterate post-launch
> - 📌 **CHOICE** — we cannot decide for you, but the default will ship if unanswered
> - ✅ **CONFIRM-ONLY** — we already built it; just tick the box to lock it in
>
> **How to return it.** Fill the checkboxes and blanks inline, or paste the Answer Template at the bottom into an email to `hola@nexaparaguay.com`. Any field left blank = ship our default (flagged below).
>
> **Current build status.** Staging green at `https://staging.nexaparaguay.com`. `is_demo: true` — all team portraits, testimonials, and stock imagery are AI placeholders by design. **18 blockers** tracked against production flip (see `LAUNCH.md` + `PRE-LAUNCH-INVENTORY.md`).
>
> **Cross-refs.** Supersedes `STAKEHOLDER-QA.md` (kept for history). Reads alongside `LAUNCH.md` (runbook), `DNS.md` (cutover), `PRE-LAUNCH-INVENTORY.md` (raw inventory).

---

## Table of contents
1. [Business identity & legal entity](#1-business-identity--legal-entity)
2. [Team & founders](#2-team--founders)
3. [Services, programs & pricing](#3-services-programs--pricing)
4. [Legal, compliance & AML/SEPRELAD](#4-legal-compliance--amlseprelad)
5. [Brand & visual identity](#5-brand--visual-identity)
6. [Photography, imagery & OG assets](#6-photography-imagery--og-assets)
7. [Testimonials, case studies & social proof](#7-testimonials-case-studies--social-proof)
8. [Locales & translation](#8-locales--translation)
9. [Page-by-page content validation](#9-page-by-page-content-validation)
10. [Blog, resources & downloadables](#10-blog-resources--downloadables)
11. [Integrations & infrastructure](#11-integrations--infrastructure)
12. [Analytics, tracking & marketing tech](#12-analytics-tracking--marketing-tech)
13. [Ads, social calendar & PR](#13-ads-social-calendar--pr)
14. [Lead handling & operations](#14-lead-handling--operations)
15. [Domain, DNS & email hosting](#15-domain-dns--email-hosting)
16. [Launch logistics](#16-launch-logistics)
17. [Commercial mechanics](#17-commercial-mechanics)
18. [Maintenance, ownership & handoff](#18-maintenance-ownership--handoff)
19. [Risks & open items](#19-risks--open-items)
20. [Answer template](#20-answer-template)

---

## 1. Business identity & legal entity

**Owner: Legal + Commercial director.**

### 1.1 Final commercial name 🔴
Everywhere on the site, in social handles, email signatures, invoices, and trademarks — what is the **exact** commercial name to lock?

- [ ] Confirm **"Nexa Paraguay"** (two words, title case, used today)
- [ ] Change to: `________________________`
- [ ] Is there a **full official name** different from the brand (e.g., "Nexa Paraguay Relocation Services")? Specify: `________________________`

### 1.2 Legal entity 🔴
- [ ] **Entity type** (pick one): [ ] SA [ ] SRL [ ] EIRL [ ] Other: `___`
- [ ] **Full legal name** on invoices, contracts, privacy policy: `________________________`
- [ ] **RUC (Paraguay tax ID):** `________________________`
- [ ] **Registered address** (street, city, Paraguay): `________________________`
- [ ] **Email domain** used for legal notices: `________________________`
- [ ] Is the legal entity **already constituted**, [ ] in process, [ ] not yet started?
- [ ] **Shareholders / owners** (for footer and privacy policy): `________________________`

### 1.3 Governing law & jurisdiction 🔴
- [ ] **Governing law for contracts:** [ ] Paraguay [ ] Netherlands [ ] Other: `___`
- [ ] **Dispute resolution venue:** [ ] Paraguayan courts [ ] Arbitration at: `___` [ ] Other: `___`
- [ ] **Consumer-protection jurisdiction** that applies to European buyers: `________________________`

### 1.4 Trademark status 🟠
"Nexa" is used by multiple companies across LATAM (non-competing verticals). Before paid marketing scales:
- [ ] **Paraguay (DINAPI)** trademark search completed? [ ] Yes / [ ] No / [ ] In progress
- [ ] **Netherlands (BOIP)** search completed? [ ] Yes / [ ] No / [ ] In progress
- [ ] **Germany (DPMA)** search completed? [ ] Yes / [ ] No / [ ] In progress
- [ ] **Spain (OEPM)** search completed? [ ] Yes / [ ] No / [ ] In progress
- [ ] **EUIPO (community mark)** search completed? [ ] Yes / [ ] No / [ ] In progress
- [ ] Preferred filing jurisdiction if any conflict forces a rename: `________________________`

### 1.5 Corporate relationship with LEALTIS 🔴
The underlying service delivery (residency, company formation, banking) is executed by LEALTIS Escribanía (confirmed in the business-planning repo). The public site has been scrubbed of LEALTIS mentions — but the commercial relationship itself needs to be locked:
- [ ] **Commercial arrangement:** [ ] Reseller [ ] Referral [ ] White-label [ ] Other: `___`
- [ ] Is there a **written master services agreement** with LEALTIS? [ ] Yes — signed / [ ] Drafted / [ ] No
- [ ] **Exclusivity:** is Nexa LEALTIS's only European-facing reseller? [ ] Yes / [ ] No
- [ ] **Backup escribanía** if LEALTIS pauses or exits: `________________________` (⚠ currently sole-source)
- [ ] Do we need to **disclose** the LEALTIS relationship in the privacy policy, AML disclosure, or process page? [ ] Yes / [ ] No — legal to confirm

### 1.6 Tagline / slogan per locale 🟡
Current working tagline is "Tu nuevo comienzo en Paraguay, simple y tranquilo." — confirm or replace per locale:
| Locale | Current | Confirm / replace |
|--------|---------|-------------------|
| ES | Tu nuevo comienzo en Paraguay, simple y tranquilo. | `_______________` |
| EN | Your new start in Paraguay, simple and calm. | `_______________` |
| NL | Uw nieuwe start in Paraguay, eenvoudig en gerust. | `_______________` |
| DE | Ihr neuer Anfang in Paraguay, einfach und ruhig. | `_______________` |

---

## 2. Team & founders

**Owner: Commercial director + Operations director.**

### 2.1 Founder identities 🔴
Currently `/fundador` page has generic labels and AI portraits.

**Founder 1 — Operations director (Asunción):**
- [ ] **Real name:** `________________________`
- [ ] **Role title (ES/EN/NL/DE):** `________________________`
- [ ] **2-paragraph bio** (provide per locale — ES mandatory, EN+NL recommended): attached / coming by `___`
- [ ] **Professional headshot** (square, ≥400×400, consistent lighting): attached / coming by `___`
- [ ] **LinkedIn URL:** `________________________`
- [ ] **Years of relevant experience:** `___`
- [ ] **Quotable "why I founded this" line:** `________________________`

**Founder 2 — Commercial director (Europe):**
- [ ] **Real name:** `________________________`
- [ ] **Country of residence:** `________________________`
- [ ] **Role title (4 locales):** `________________________`
- [ ] **Bio:** attached / coming by `___`
- [ ] **Headshot:** attached / coming by `___`
- [ ] **LinkedIn URL:** `________________________`
- [ ] **Why-founded quote:** `________________________`

**Co-founders / other principals** (list any additional named founders, equity partners, or advisors whose name will appear publicly):
| Name | Role | Locale bio ready? | Photo ready? | LinkedIn |
|------|------|-------------------|--------------|----------|
| `___` | `___` | [ ] | [ ] | `___` |
| `___` | `___` | [ ] | [ ] | `___` |

### 2.2 Senior team — attributed professionals 🔴
Visible on `/sobre` and `/fundador`. Each name carries professional-liability weight; credentials must be verifiable.

| # | Role | Real name | Credentials (bar no. / CPA / etc.) | Headshot | Bio in 4 locales |
|---|------|-----------|------------------------------------|----------|------------------|
| 1 | Legal lead (attorney) | `___` | `___` | [ ] | [ ] |
| 2 | Accounting lead (contador) | `___` | `___` (CPN no.) | [ ] | [ ] |
| 3 | Escribano (notary) | `___` | Matrícula no. `___` | [ ] | [ ] |
| 4 | Financial advisor | `___` | `___` | [ ] | [ ] |
| 5 | Client success lead | `___` | `___` | [ ] | [ ] |

- [ ] Are any team members **contractors / referral partners** rather than employees? If yes, does the site disclose that? [ ] Yes disclose / [ ] No disclose
- [ ] Alternative: hide `/sobre` team section entirely until real photos consented → the page becomes hero + values + trust + CTA with no team. [ ] Prefer hide until ready

### 2.3 Group / office photography 🟠
- [ ] Commission a real **group shot** + **individual headshots** in Asunción? [ ] Yes by date `___` / [ ] Ship AI placeholders through soft-launch
- [ ] Budget approved for local photographer (~€500–1,500 for full shoot): [ ] Yes / [ ] No / [ ] Defer

### 2.4 Consent forms for team likenesses 🔴
GDPR requires a signed consent per person whose face or name appears.
- [ ] Do you have signed consent forms for all named team members? [ ] Yes / [ ] No — we provide template
- [ ] Where are they stored? `________________________`

---

## 3. Services, programs & pricing

**Owner: Commercial director + Operations director + Legal.**

### 3.1 Program tier lineup 🔴
Today the site has **4 tiers** (Base / Business / Investor / Compra de Tierras). Confirm each:

#### Tier 1 — Paraguay Base
- [ ] **Keep name "Paraguay Base"** / [ ] Rename to `_______________`
- [ ] **Confirm scope:** Residencia permanente + cédula de identidad + pre-validación documental + jornada operativa 1 día + acompañamiento logístico
- [ ] Add: [ ] Driver's-license exchange [ ] Tax-ID obtention [ ] Other: `___`
- [ ] Remove: `___`
- [ ] **Retail price:** USD `_______` (currently shown as "A definir")
- [ ] **Is IVA 10% included** in the displayed price? [ ] Yes included / [ ] No, add 10%
- [ ] **LEALTIS wholesale cost:** USD `_______` (for internal P&L sanity-check)
- [ ] **Nexa margin:** USD `_______` or `___%`

#### Tier 2 — Paraguay Business ⭐ "Más elegido"
- [ ] Keep name / rename to `_______________`
- [ ] Scope confirmed: Base + constitución de sociedad + RUC + cuenta bancaria + tour inmobiliario
- [ ] **Retail price (final customer):** USD `_______` (currently "USD 4,400+" as LEALTIS wholesale)
- [ ] **"+" semantics:** [ ] "Starts at" (mandatory add-ons possible) / [ ] "From" (everything included, optional add-ons only)
- [ ] **Tour inmobiliario scope:** who are the real-estate partners? do they pay Nexa commission? is this disclosed? `___`
- [ ] Are there **kickbacks** from banks or escribanías that create conflict-of-interest? If yes, is a disclosure required? `___`
- [ ] **"+ tasas incluidas"** claim: confirmed 100% of government fees, or are extraordinary tasas billed separately? `___`

#### Tier 3 — Paraguay Investor Program
- [ ] Keep name / rename to `_______________`
- [ ] Scope: Business + 12 months accounting + 12 months legal + investment analysis + direct team access
- [ ] **Retail price:** USD `_______` (currently "USD 6,900+" wholesale)
- [ ] **12-month clock:** starts [ ] on contract signature / [ ] on residency approval / [ ] on delivery of cédula
- [ ] **Year-2 renewal:** how is it priced? `___` (site currently silent)
- [ ] "Análisis de inversiones" — does this constitute regulated **investment advice** under Paraguayan law? Legal opinion: `___`

#### Tier 4 — Compra de Tierras 🔴
Currently listed but scope is vague and price is "Quote on request." Decide now:
- [ ] **Ship as 4th tier** with "Conversación exploratoria" CTA (no price displayed) — OR —
- [ ] **Ship as full tier** with scope + price locked below — OR —
- [ ] **Remove** from tier grid (reduce to 3 tiers, reshoot comparison page)

If shipping with full scope:
- [ ] **Deliverables:** `________________________`
- [ ] **Partner network** (real-estate agencies, escribanías): `________________________`
- [ ] **Retail price or price range:** USD `_______`
- [ ] **Fee structure:** [ ] Flat fee [ ] % of property value [ ] Tiered by property value
- [ ] **Escrow handling:** `___`
- [ ] **Dispute resolution** if title search fails post-purchase: `___`
- [ ] **Restrictions:** Paraguay prohibits foreign ownership of land in border zones (50 km from borders). How is this disclosed? `___`

### 3.2 Pricing mechanics — display & payment 🔴

| Question | Our default | Your answer |
|----------|-------------|-------------|
| Display currency | USD only | [ ] USD only [ ] USD + EUR dual [ ] Auto-detect IP |
| IVA treatment in displayed price | Included, disclosed in fine print | [ ] Included [ ] Excluded [ ] "IVA no incluido" disclaimer only |
| Invoicing currency | USD | [ ] USD [ ] EUR [ ] PYG (guaraníes) |
| Payment terms | 50% on signature + 50% on residency delivery | [ ] 50/50 [ ] 100% upfront [ ] 30/70 [ ] Other `___` |
| Payment channels | Offline bank transfer | [ ] Bank transfer only [ ] + Stripe [ ] + MercadoPago [ ] + Crypto |
| Refund policy | None stated | `___` |
| Cooling-off period (EU distance-selling) | None stated | [ ] 14-day EU cooling-off [ ] Waived (service starts immediately with written consent) |

### 3.3 Process duration 🟡
The site claims "8–12 weeks" end-to-end. Audit flag: historically 10–16 weeks when documents need rework.
- [ ] Keep **"8–12 semanas"** claim
- [ ] Change to **"10–14 semanas"** (more conservative)
- [ ] Change to **"8–16 semanas"** (range reflects variance)
- [ ] Add disclaimer: "Casos con requisitos adicionales pueden extenderse" [ ] Yes / [ ] No
- [ ] Separate durations per tier? Base `___`, Business `___`, Investor `___`

### 3.4 Process 5-step model 🟡
Current steps: Consulta inicial → Validación documental → Jornada operativa → Sociedad y banca → Entrega y seguimiento.
- [ ] Confirm 5 steps as-is
- [ ] Merge steps 4+5 (→ 4-step model): [ ] Prefer
- [ ] Add step for **Apostille pre-consultation** before "Validación documental": [ ] Yes / [ ] No
- [ ] Add step for **Tax-ID obtention** (separate from RUC): [ ] Yes / [ ] No
- [ ] Specific **guarantees or escape clauses** if visa is rejected: `________________________`

### 3.5 Services NOT offered — disclose explicitly? 📌
We currently don't list these. Should we add them as "no ofrecemos" to set expectations?
- [ ] Family relocation (spouse residency, school enrollment, healthcare onboarding) — [ ] Offer [ ] Explicitly no [ ] Stay silent
- [ ] Tax optimization standalone — [ ] Offer [ ] Explicitly no [ ] Bundled in Investor only
- [ ] Real estate financing / mortgages — [ ] Offer [ ] Explicitly no
- [ ] Citizenship (5-year passport track) — [ ] Offer [ ] Explicitly no [ ] Mention in FAQ only
- [ ] Property management post-purchase — [ ] Offer [ ] Explicitly no
- [ ] Remote-work coaching / coworking intros — [ ] Offer [ ] Explicitly no

### 3.6 Tax calculator 🟠
`/calidad-de-vida` and landing pages reference a savings calculator using hardcoded country rates. Legal risk if numbers are taken as binding.
- [ ] Keep calculator with disclaimer **"Illustration only, not tax advice"** in all 4 locales
- [ ] Remove calculator until attorney-reviewed
- [ ] Rewrite with **dynamic inputs** (user picks country, income band)

---

## 4. Legal, compliance & AML/SEPRELAD

**Owner: Legal counsel (EU data-privacy specialist strongly recommended).**

### 4.1 SEPRELAD status 🔴
Paraguay's SEPRELAD (UAF equivalent) designates "obligated parties" under Law 1015/97. Legal/migratory consulting with cross-border money movement may qualify.

- [ ] **Is Nexa Paraguay a SEPRELAD-obligated party?** [ ] Yes / [ ] No / [ ] Legal opinion in progress
- [ ] If yes, **category:** [ ] Financial intermediary [ ] Real-estate broker [ ] Gestoría [ ] Other: `___`
- [ ] **Registration number:** `_______` (fills `{{registrationNumber}}` in `src/compliance/aml-disclosure-nexa.template.md`)
- [ ] **Compliance officer name:** `_______`
- [ ] **Compliance officer email:** `_______`
- [ ] **Date of registration:** `_______`
- [ ] **Reporting obligations** (Suspicious Activity Reports, Threshold Reports): acknowledged and process in place? [ ] Yes / [ ] No
- [ ] **KYC records retention:** 5 years default — confirm or adjust `___`

### 4.2 KYC intake flow 🔴
Site has a `seprealadAttestation` form (name, DOB, passport, economic activity, source of funds, PEP declaration, truthful-declaration checkbox).
- [ ] **Is the current form compliant?** [ ] Yes / [ ] Needs changes: `___`
- [ ] **Where are submissions stored?** [ ] Supabase leads table [ ] Direct-to-compliance-officer email [ ] HubSpot record [ ] Encrypted S3 bucket: `___`
- [ ] **Data at rest encryption** confirmed for KYC fields? [ ] Yes / [ ] Verify
- [ ] **ID document upload** step — add file-upload field? [ ] Yes (build it) / [ ] No (verbal at consult)
- [ ] **Proof-of-funds** upload — add? [ ] Yes / [ ] No
- [ ] **PEP (Politically Exposed Person) flow** when user self-declares yes: [ ] Route to compliance officer only / [ ] Block + manual review / [ ] Other: `___`

### 4.3 Privacy policy attorney review 🔴
`/privacidad` has 10 accordion items (collection, retention, user rights, processors). Needs EU-qualified data-privacy counsel sign-off because prospects are mostly European.

- [ ] **Counsel assigned:** `________________________`
- [ ] **Review completed?** [ ] Yes / [ ] In progress / [ ] Not started
- [ ] **Processor list** — today: HubSpot, Mailchimp, Calendly. Add: [ ] Supabase (DB) [ ] Cloudflare (edge) [ ] Resend (email) [ ] Anything else: `___`
- [ ] **Data residency claim** — we state "EU-hosted DB." Is Supabase project region EU? `___`
- [ ] **Retention period** — currently 3 years. Change to `___`
- [ ] **DPO (Data Protection Officer) required?** Under GDPR Art. 37, if Nexa processes "systematically and on a large scale." [ ] Yes appointed: `___` / [ ] Not required
- [ ] **Legal basis per processing purpose** — documented? [ ] Yes / [ ] No, to draft
- [ ] **EU representative under GDPR Art. 27** (since Nexa targets EU but is based in Paraguay): [ ] Appointed: `___` / [ ] Not required / [ ] To appoint by `___`

### 4.4 Terms of Service 🔴
Currently **no** `/terminos` page. The intake contract handles commercial terms offline.
- [ ] Add `/terminos` page with attorney-drafted TOS? [ ] Yes [ ] No
- [ ] If yes, content owner: `___`
- [ ] If no, confirm TOS lives only in signed intake contract (OK for B2C EU?)

### 4.5 Cookie banner & consent 🟡
4-locale banner live. Buttons: "Aceptar todas" / "Solo esenciales" / "Preferencias."
- [ ] "Preferencias" modal — build granular per-category consent UI? [ ] Yes / [ ] Keep 3-button only
- [ ] Cookie inventory table (name, purpose, duration) added to `/privacidad`? [ ] Yes add / [ ] Skip
- [ ] **Dutch DPA (AP)** specific wording verified for NL locale? [ ] Yes / [ ] Pending counsel
- [ ] **Germany (TTDSG + DSGVO)** — stricter than GDPR for telemetry. Reviewed? [ ] Yes / [ ] Pending
- [ ] **ePrivacy Directive** compliance (consent BEFORE analytics fires, which we already do): [ ] Confirm
- [ ] Consent log stored for audit? [ ] Yes / [ ] To add

### 4.6 Compliance disclaimer copy 🔴
`complianceDisclaimer` section in all 4 locales references:
- "Nexa Paraguay does not provide legal, tax or investment advice"
- "registered as a reporting entity with SEPRELAD"
- **SEPRELAD license number: "Pending registration"** ← BLOCKER

- [ ] Update "Pending registration" → actual number: `___`
- [ ] Review each disclaimer sentence: [ ] Accurate / [ ] Changes: `___`
- [ ] Add "not a law firm" disclaimer if Nexa is not legally a law firm? [ ] Yes / [ ] Not needed

### 4.7 Marketing claims requiring defensibility 🟠
These appear in copy and may need evidentiary backup:
- [ ] **"30–50% menor que Madrid o Berlín"** (cost of living, `/calidad-de-vida`) — source? `___`
- [ ] **"Territorial tax system — only Paraguay-sourced income taxed"** (FAQ, `/por-que-paraguay`) — verified with qualified Paraguayan tax counsel? [ ] Yes / [ ] Pending
- [ ] **"One trip is enough"** (hero, `/proceso`) — unconditional? Any edge cases that require a second trip? `___`
- [ ] **"8–12 weeks"** — see 3.3
- [ ] **"98% satisfaction, 250+ clients"** (testimonials.json) — currently fabricated demo stats. Replace with real or remove. See §7.

### 4.8 Consumer-protection compliance 🟡
- [ ] **EU distance-selling directive** (14-day withdrawal for consumers) — does it apply? `___`
- [ ] **Paraguayan consumer law (Ley 1334/98)** — any specific disclosures required? `___`
- [ ] **Dutch Civil Code Art. 7:46d** (distance contracts) — specifically relevant for NL clients? `___`

---

## 5. Brand & visual identity

**Owner: Commercial director + designer (if commissioned).**

### 5.1 Color palette ✅ (confirm-only unless changing)
Currently locked: navy `#1B2A4A` + champagne `#C9A96E` + off-white `#F5F3EE` + white surfaces.
- [ ] **Confirm palette as-is**
- [ ] Change primary to: `#______`
- [ ] Change accent/secondary to: `#______`

### 5.2 Typography ✅
Locked: Playfair Display (headings) + Inter (body) via Google Fonts.
- [ ] **Confirm as-is**
- [ ] Swap to DM Serif Display + DM Sans
- [ ] Use custom licensed font — drop WOFF2 files in `public/fonts/`: attached / coming `___`

### 5.3 Logo suite 🔴
Today = text-only wordmark in Playfair navy. Need full suite:

| Asset | Spec | Status |
|-------|------|--------|
| Primary logo | SVG preferred, else PNG ≥2048px wide, transparent | [ ] Delivered [ ] Commissioned [ ] Ship wordmark |
| Icon-only mark | 512×512 SVG/PNG for social + favicon | [ ] Delivered [ ] Commissioned [ ] Derive from "N" |
| Monochrome white | For dark hero + CTA banner | [ ] Delivered [ ] Commissioned |
| Favicon | `favicon.ico` multi-res (16/32/48) | [ ] Delivered [ ] Generate from icon |
| Apple touch icon | 180×180 PNG | [ ] Delivered [ ] Generate |
| Android maskable icon | 512×512 with safe zone | [ ] Delivered [ ] Generate |
| Brand guidelines PDF | Colors, fonts, spacing, do/don't | [ ] Delivered [ ] Skip for now |

Delivery path: drop files into `sites/nexa-paraguay/assets/brand/`.

### 5.4 OG / social preview image 🟠
The image shown when someone pastes `nexaparaguay.com` into WhatsApp, LinkedIn, Slack, X, etc.
- [ ] Commission dedicated 1200×630 OG image (logo + tagline overlay on brand gradient)
- [ ] Keep hero-crop (current behaviour, suboptimal)
- [ ] Per-locale OG images (4 versions)? [ ] Yes / [ ] One EN version

### 5.5 Iconography 🟡
Process step illustrations are currently AI placeholders. Alternatives:
- [ ] Commission 5 custom SVG icons (~€200 freelance): consultation / documents / operational-day / banking / completion
- [ ] Use Lucide icon library in brand navy (free, consistent, generic)
- [ ] Keep AI illustrations (accept "demo" feel)

### 5.6 Voice & tone — per locale 🟡
| Locale | Current | Confirm |
|--------|---------|---------|
| ES | Formal **"usted"**, warm-professional | [ ] Confirm / [ ] Switch to "tú" |
| EN | Formal "you", British spelling (centre, colour, metric units) | [ ] Confirm / [ ] US spelling |
| NL | Formal **"u"** (not "je"), direct | [ ] Confirm / [ ] Informal "je" |
| DE | Formal **"Sie"**, currently MT quality | [ ] Confirm after pro translation / [ ] Other |

---

## 6. Photography, imagery & OG assets

**Owner: Commercial director + producer.** All current imagery is AI-generated (`is_demo: true`). List by category:

### 6.1 Hero imagery 🟠
- Current: AI-generated Asunción skyline, 5 locale variants (`hero-bg`, `hero-nl`, `hero-en`, `hero-de`, `hero-es`, mobile variant)
- [ ] Commission **real Asunción photography** (1-day shoot, ~€500–1,500): [ ] Yes by `___` / [ ] License Unsplash editorial: `___` / [ ] Ship AI through soft-launch
- [ ] Licensed-stock source (if going that route): Unsplash / Pexels / Shutterstock / iStock — our CSP whitelists Unsplash + Pexels
- [ ] If commissioning: shot list (skyline, Costanera, Mcal López avenue, Villa Morra, office exterior, café culture): `___`

### 6.2 "Why Paraguay" pillar images 🟠
9 AI images currently: economic, investment, lifestyle, tax, growth, agribusiness, community, nature, culture.
- [ ] Replace with real photography: [ ] Yes [ ] Ship AI
- [ ] Reduce count (drop the 3-4 weakest pillars if no real photo available)?

### 6.3 Office gallery 🔴
5 AI office images flagged explicitly in `/sobre` subtitle: *"AI placeholders below — swap for real photos before launch."* Trust signal — real photos matter.
- exterior / meeting-room / signing / team-huddle / reception
- [ ] Real photos committed by date: `___`
- [ ] Hide office gallery until real photos ready: [ ] Yes / [ ] No

### 6.4 Process step images 🟠
5 AI images (consultation, documents, arrival, banking, completion) + 4 secondary (operational-day, apostille-stack, family-residency, bank-customer-side).
- [ ] Replace with real photos: [ ] Yes
- [ ] Replace with Lucide icon grid: [ ] Yes (cleaner for B2B)
- [ ] Keep AI: [ ] Yes

### 6.5 Blog cover images 🟡
10 AI covers (residency, real-estate, banking, entrepreneurship, cost-of-living, healthcare, schools, neighborhoods, etc.).
- [ ] Replace top 3 priority posts with real/licensed photos
- [ ] Keep AI: acceptable for blog SEO

### 6.6 Press-kit assets 🟡
Referenced: brand-book-cover, factsheet-infographic, country-data-infographic.
- [ ] Generate press kit PDF? [ ] Yes / [ ] Defer
- [ ] `/prensa` page live or hidden? [ ] Live (need press clippings if any) / [ ] Hide until media mentions exist

### 6.7 Image licensing audit 🔴
- [ ] Every image shipping to production has documented license or consent: [ ] Yes [ ] To audit
- [ ] **Signed model releases** for any human face shown (team, testimonials, stock people): [ ] Yes / [ ] Need template
- [ ] Licenses stored at: `___`

### 6.8 Placeholder-hash gate
`sites/nexa-paraguay/docs/PLACEHOLDER_HASHES.json` stores SHA-256 of every current AI image. Deploy validator blocks production flip if any hash still matches the placeholder registry. **Understood — each image swap regenerates the hash, validator auto-clears.** No action needed unless you want to disable the gate.

---

## 7. Testimonials, case studies & social proof

**Owner: Commercial director + legal (consent forms).**

### 7.1 Replace 5 AI testimonials 🔴
Current roster is **entirely AI-generated** (Marcelo Díaz / Ana Lucía Fernández / Roberto González / Carolina Silva / Fernando Morales). Founder (Ivan W.) + co-founder (Sonia) consented to AI content pre-launch — but **real consented content required for production.**

For each real client you want to feature, provide:

| # | Real name | Role / company | City, country | Quote (in client's language) | Photo consent | Video consent | GDPR form signed |
|---|-----------|----------------|---------------|-------------------------------|---------------|---------------|-------------------|
| 1 | `___` | `___` | `___` | `___` | [ ] | [ ] | [ ] |
| 2 | `___` | `___` | `___` | `___` | [ ] | [ ] | [ ] |
| 3 | `___` | `___` | `___` | `___` | [ ] | [ ] | [ ] |
| 4 | `___` | `___` | `___` | `___` | [ ] | [ ] | [ ] |
| 5 | `___` | `___` | `___` | `___` | [ ] | [ ] | [ ] |

- [ ] **Until at least 2 real testimonials + consent are ready:** keep `features.testimonials: false` (section hidden) — recommended over shipping unverified names. [ ] Agree
- [ ] **Anonymous testimonials** (first name + city only, no photo): [ ] Acceptable fallback / [ ] Not acceptable

### 7.2 Headline stats 🔴
testimonials.json currently claims: `totalClients: 250`, `satisfactionRate: 98%`, `averageRating: 4.9`, `countries: [Argentina, Brasil, Chile, Colombia, España, Estados Unidos]`. **All fabricated.**

- [ ] **Real totalClients** as of launch: `___`
- [ ] **Real satisfactionRate**: `___%` (sourced from post-delivery survey? or remove claim)
- [ ] **Real averageRating**: `___`
- [ ] **Real countries served**: `_______________`
- [ ] **Preferred: remove the numeric stats entirely until real data** — replace with "Confianza construida caso por caso" ethos? [ ] Prefer this route

### 7.3 Video testimonials 🟡
5 AI video-poster thumbnails exist with empty `videoUrl`. Each slot renders "video coming soon."
- [ ] Commission real videos: budget `___`, timeline `___`
- [ ] Remove video slots (poster-only) until real videos ready: [ ] Yes

### 7.4 Case studies / success stories 🟠
`/casos-de-exito` page exists. Currently references placeholder case studies.
- [ ] Provide 2-3 real anonymized case studies (with signed consent for anonymized use): [ ] Yes by `___`
- [ ] Hide `/casos-de-exito` until real cases available: [ ] Yes

### 7.5 Trust logos / partner seals 🟡
- [ ] Any official recognitions (SEPRELAD registration badge, DINAPI trademark, EU Chamber of Commerce membership, etc.) to display? `___`
- [ ] Media mention logos ("As featured in…")? `___`

---

## 8. Locales & translation

**Owner: Commercial director + external translator.**

### 8.1 Current locale state
| Locale | Default? | Quality | Action needed |
|--------|----------|---------|---------------|
| ES | (primary) | Native | Sign-off pass |
| EN | ✓ Default per `site.json` | High (seeded) | Spot-check |
| NL | — | High (seeded) | Native-speaker spot-check |
| DE | — | **🔴 Machine** | Pro translation (~20k words) or override |

### 8.2 German translation decision 🔴
- [ ] **Commission professional DE translation** — provider `___`, budget `___`, ETA `___`
- [ ] **Ship machine-translated DE** with `ALLOW_MACHINE_TRANSLATIONS=1` env var + "Beta-Übersetzung" badge — accepted risk for German market
- [ ] **Temporarily disable DE locale** — strip from language switcher until pro translation lands (reversible)

### 8.3 Spot-check sign-offs 🟠
| Locale | Reviewer name | Date | Status |
|--------|---------------|------|--------|
| ES | `___` | `___` | [ ] Approved |
| EN | `___` | `___` | [ ] Approved / changes: `___` |
| NL | `___` (native) | `___` | [ ] Approved / changes: `___` |
| DE | `___` | `___` | [ ] Approved after pro pass |

### 8.4 Blog translation prioritization 🟡
10 ES seed posts exist. Translate which 3 first?
Proposed order (by conversion weight): (1) Residencia en Paraguay 2024, (2) SEPRELAD & Compliance, (3) Sistema tributario territorial.
- [ ] **Confirm order** / [ ] Reorder: `___`
- [ ] **Target locales for blog translation:** [ ] EN [ ] NL [ ] DE [ ] All three
- [ ] **Localization vs word-for-word:** [ ] Localize (NL/BE Dutch, UK/US English considered) / [ ] Word-for-word

### 8.5 Template variable substitution ✅
Copy uses `{{taxRate}}` for locale-aware tax-rate insertion.
- [ ] Confirm rendering engine substitutes correctly (internal verification — no client action unless issue reported)

### 8.6 Portuguese 📌
Flagged as Phase-2 deferral (Brazilian-investor market).
- [ ] Defer to post-launch: [ ] Agree
- [ ] Add to Phase 1 (if targeting border Brazilians aggressively): [ ] Yes — adds ~4 weeks

---

## 9. Page-by-page content validation

**Owner: Commercial director (read every page in their language).**

Read each page on staging (`https://staging.nexaparaguay.com`) in your native language. Mark one box:
- **✅** = ship as-is
- **⚠️** = ship but iterate within 2 weeks
- **🛑** = block launch / rewrite needed

| # | Page | Path | Status | Specific comment |
|---|------|------|--------|------------------|
| 1 | Home | `/` | [ ] | `___` |
| 2 | Programs | `/programas` | [ ] | (pricing 🔴 see §3.1) |
| 3 | Process | `/proceso` | [ ] | `___` |
| 4 | Why Paraguay | `/por-que-paraguay` | [ ] | `___` |
| 5 | Quality of life | `/calidad-de-vida` | [ ] | (cost-of-living claim 🟠 §4.7) |
| 6 | Lifestyle | `/lifestyle` | [ ] | `___` |
| 7 | About (company) | `/sobre` | [ ] | (team 🔴 §2.2) |
| 8 | Company | `/empresa` | [ ] | `___` |
| 9 | Founder | `/fundador` | [ ] | (founder identity 🔴 §2.1) |
| 10 | Investor landing | `/inversor` | [ ] | `___` |
| 11 | Benelux desk | `/benelux` | [ ] | (NL Box 3 / emigratieheffing claims — valid?) |
| 12 | Trust / why us | `/trust` | [ ] | `___` |
| 13 | Case studies | `/casos-de-exito` | [ ] | (real cases? §7.4) |
| 14 | Comparison | `/comparacion` | [ ] | (DIY pricing claims — source?) |
| 15 | FAQ | `/faq` | [ ] | (15 items — each reviewed?) |
| 16 | Glossary | `/glosario` | [ ] | `___` |
| 17 | Resources | `/recursos` | [ ] | (3 PDF guides 🟠 §10.3) |
| 18 | Blog index | `/blog` | [ ] | `___` |
| 19 | Assistant | `/asistente` | [ ] | (AI assistant scope + disclaimer) |
| 20 | Privacy | `/privacidad` | [ ] | (attorney 🔴 §4.3) |
| 21 | Press | `/prensa` | [ ] | (content exists? §6.6) |
| 22 | Contact | `/contacto` | [ ] | (form success message? Calendly URL?) |

### 9.1 FAQ item-by-item review 🔴
15 questions in `faqPage.full.items[]`. Each answer is a legal/commercial claim. Any you'd phrase differently or disagree with?
- [ ] **Reviewed all 15 — approved**
- [ ] **Changes (list items + edits):** `________________________`

### 9.2 AI Assistant page (`/asistente`) 🟠
- [ ] **Is an AI assistant live** or a coming-soon page? `___`
- [ ] If live: **model + provider** (OpenAI/Anthropic/…)? `___`
- [ ] Disclaimer: "AI responses are informational, not legal advice" — [ ] present [ ] add
- [ ] PII handling: does user input get stored? retained how long? `___`
- [ ] Rate limiting / abuse prevention: `___`

### 9.3 Contact page success flow 🟠
- [ ] **Thank-you copy** after form submit (per locale): `___`
- [ ] **Auto-reply email** content (per locale) — who writes? `___`
- [ ] **Expected response time** shown to user: `___` business hours

### 9.4 Benelux desk page 🟡
Contains NL-specific tax references (Box 3, emigratieheffing).
- [ ] **Tax claims verified** by NL-qualified tax advisor: [ ] Yes [ ] Pending
- [ ] **Disclaimer** "tax situation depends on individual circumstances" — [ ] present [ ] add

### 9.5 Comparison page 🟡
Claims: "DIY: USD 800–1,500", "Local agent: USD 2,500–3,500." Sources?
- [ ] **Keep with source footnote**: `___`
- [ ] **Remove specific numbers**, keep qualitative comparison
- [ ] **Update to real ranges**: DIY `$___`, Local agent `$___`

---

## 10. Blog, resources & downloadables

**Owner: Commercial director + content writer.**

### 10.1 Blog content 🟠
10 ES seed posts referenced in `STAKEHOLDER-REVIEW.md`:
1. Guía Residencia Paraguay 2024
2. Comprar Propiedades en Paraguay (extranjeros)
3. Apertura Cuenta Bancaria Paraguay (extranjeros)
4. Emprender en Paraguay: Oportunidades 2024
5. 5 Errores al Mudarte a Paraguay
6. SEPRELAD y Compliance (inversionistas)
7. Sistema Tributario Territorial
8. Mejores Zonas para Vivir en Asunción
9. (TBC)
10. (TBC)

- [ ] **All 10 posts written and seeded?** [ ] Yes / [ ] Only `___` ready
- [ ] **Authorship / byline** — every post needs an author and date for SEO credibility. Byline per post: [ ] "Equipo Nexa Paraguay" generic / [ ] Real author names: `___`
- [ ] **Publication dates** — real publish dates or backdated to look "established"? [ ] Real / [ ] Backdated (note: Google devalues backdating if detected)
- [ ] **Each post reviewed by legal** for claims? [ ] Yes / [ ] Pending

### 10.2 Post metadata 🟡
- [ ] SEO description (155 chars) per post — written? [ ] Yes / [ ] Pending
- [ ] Internal-link strategy between posts and pillar pages? [ ] Yes `___` / [ ] Auto

### 10.3 Resource PDFs 🟠
`/recursos` lists 3 downloadable guides. Files **do not exist** — clicking 404s:
1. Guía de residencia paraguaya (30+ pages)
2. Sistema fiscal territorial (20+ pages)
3. Costo de vida en Asunción (15+ pages)

Decide:
- [ ] **Create all 3 PDFs** (each needs content + legal review + PDF export, ~€300–600/doc or internal): ETA `___`
- [ ] **Ship 1 flagship PDF first** (Residencia), defer others: title `___`, ETA `___`
- [ ] **Remove `/recursos` page** until assets exist
- [ ] **Lead-magnet gating:** email-gate downloads? [ ] Yes (builds list) / [ ] Free

### 10.4 Glossary page 🟡
`/glosario` lists migration/tax/legal terms.
- [ ] **Reviewed by legal + ops?** [ ] Yes / [ ] Pending
- [ ] Missing terms to add: `___`

---

## 11. Integrations & infrastructure

**Owner: Operations + engineering.**

### 11.1 Supabase (database) 🔴
Backing store for leads, KYC, analytics events.
- [ ] **Supabase project created?** [ ] Yes — URL: `___` / [ ] Needs creation
- [ ] **Region** (EU preferred for GDPR): `___`
- [ ] **Anon key:** provide via secure channel
- [ ] **Service-role key:** provide via secure channel
- [ ] **Tables initialized** (leads, kyc_intake, analytics_events): [ ] Yes / [ ] Via migration
- [ ] **RLS policies** (public read blocked, service-role write only): [ ] Confirmed

### 11.2 HubSpot CRM 🔴
- [ ] **HubSpot portal exists?** [ ] Yes — Portal ID: `___` / [ ] Create one / [ ] Use another CRM instead: `___`
- [ ] **Form GUID** for `/api/leads` post: `___`
- [ ] **Field mapping** — confirm these HubSpot properties exist and accept values:
  - `firstname`, `lastname`, `email`, `phone`, `country`, `program_interest` (Base/Business/Investor/Tierras), `objective`, `source_site`, `language`, `utm_source`, `utm_medium`, `utm_campaign`
  - [ ] All mapped / [ ] Changes: `___`
- [ ] **Pipeline stages** — confirm or edit:
  `New → Contacted → Qualified → Proposal → Contracted → Delivered → Follow-up → Lost`
  - [ ] Confirm / [ ] Changes: `___`
- [ ] **Lost sub-reasons:** no-response / wrong-fit / too-expensive / chose-competitor — add others: `___`

### 11.3 Mailchimp (nurture email) 🔴
- [ ] **Mailchimp account exists?** [ ] Yes — [ ] Create
- [ ] **API key** (format `xxx-us1`): `___`
- [ ] **Audience (list) ID:** `___`
- [ ] **Double opt-in** enabled (EU-recommended): [ ] Yes / [ ] No
- [ ] **Tags to pre-create:** `nexa-paraguay-lead`, `program:base`, `program:business`, `program:investor`, `program:tierras`, `locale:es`, `locale:en`, `locale:nl`, `locale:de`, `source:hero-cta`, `source:programs-cta`, `source:whatsapp`, `source:calendly`
  - [ ] Confirm / [ ] Add: `___`
- [ ] **7-email nurture sequence** (days 0, 3, 7, 12, 18, 25, 35) defined in `email-nurture.json` — [ ] Approved as-is / [ ] Changes per email: `___`
- [ ] **Welcome email** auto-send on lead capture: [ ] Enable / [ ] Disable
- [ ] **From name:** "Nexa Paraguay" ✅ / [ ] Change: `___`
- [ ] **From address:** `hola@nexaparaguay.com` ✅ / [ ] Change: `___`

### 11.4 Calendly (booking) 🔴
Hardcoded: `https://calendly.com/nexaparaguay/consulta` — currently **404s**.
- [ ] **Create Calendly account** under team email (recommend `hola@nexaparaguay.com`)
- [ ] **Event type name:** "Consulta gratuita" / other: `___`
- [ ] **Event URL slug:** `consulta` ✅ (matches hardcoded URL) / [ ] Different: `___` (we update config)
- [ ] **Duration:** 30 min ✅ / [ ] Other: `___`
- [ ] **Team member(s) receiving bookings:** `___`
- [ ] **Reminder emails** enabled: [ ] Yes
- [ ] **Cancellation policy:** 24h default / [ ] Other: `___`
- [ ] **Tracking:** UTM parameters preserved in Calendly form hidden fields? [ ] Yes / [ ] Verify

### 11.5 WhatsApp Business 🔴
Current placeholder: `595000000000` (from GitHub `sitio-web` folder) or `595982515138` (local fallback).
- [ ] **Real number** (format `595XXXXXXXXX`, no `+` or spaces): `___`
- [ ] **WhatsApp Business account** (not personal): [ ] Created / [ ] Pending
- [ ] **Business profile** (name, category, description, hours, email, address): [ ] Completed / [ ] Pending
- [ ] **Message templates** pre-approved (for proactive replies): [ ] Yes `___` / [ ] Reactive-only
- [ ] **Response-time SLA** shown to user: `___` business hours
- [ ] **Monitoring owner** (team member who receives leads): `___`
- [ ] **Out-of-hours auto-reply:** text `___`

### 11.6 GA4 🔴
- [ ] **GA4 property created?** [ ] Yes — Measurement ID: `G-___` / [ ] Needs creation
- [ ] **IP anonymization:** enabled ✅ / [ ] Disable
- [ ] **Google Signals** (cross-device tracking) — requires consent: [ ] On / [ ] Off
- [ ] **Data retention:** 14 months (EU default) / [ ] 2 months / [ ] Other

### 11.7 Crisp (live chat, optional) 🟡
- [ ] **Install Crisp live chat?** [ ] Yes — Website ID: `___` / [ ] Skip

### 11.8 Sentry (error monitoring) 🟡
- [ ] **Install Sentry frontend monitoring?** [ ] Yes — DSN: `___` / [ ] Skip / [ ] Use existing Axiom sink

### 11.9 Email transactional (Resend / Postmark / SendGrid) 🔴
Required for auto-replies, lead notifications, Mailchimp-triggered emails.
- [ ] **Provider choice:** [ ] Resend (recommended, EU region sa-east-1 already verified in paragu-ai.com) [ ] Postmark [ ] SendGrid [ ] AWS SES
- [ ] **API key:** `___`
- [ ] **From domain verified** (`nexaparaguay.com`): [ ] Yes / [ ] Pending DNS
- [ ] **Reply-To:** `hola@nexaparaguay.com` ✅ / [ ] Other

---

## 12. Analytics, tracking & marketing tech

**Owner: Marketing.**

### 12.1 GA4 event taxonomy 🟡
Proposed events: `program_tier_clicked`, `cta_clicked`, `form_started`, `form_submitted`, `form_error`, `calendly_opened`, `whatsapp_clicked`, `blog_read`, `language_switched`.
- [ ] **Confirm taxonomy** / [ ] Add/remove: `___`
- [ ] **Conversion events** (count as "conversion"): [ ] `form_submitted` (primary) [ ] `calendly_opened` (secondary) [ ] `whatsapp_clicked` (tertiary) / [ ] Other: `___`

### 12.2 Meta Pixel / Conversions API 🟡
If running paid Meta ads:
- [ ] **Install Meta Pixel:** [ ] Yes — Pixel ID: `___` / [ ] Skip
- [ ] **Server-side CAPI** (ad-blocker resistant): [ ] Yes / [ ] Pixel only
- [ ] **Custom conversions:** Lead / SubmitApplication — [ ] confirm / [ ] other

### 12.3 LinkedIn Insight Tag 🟡
- [ ] **Install LinkedIn Insight Tag:** [ ] Yes — Partner ID: `___` / [ ] Skip

### 12.4 Google Ads tag 🟡
- [ ] **Install Google Ads remarketing tag:** [ ] Yes — Conversion ID + Label: `___` / [ ] Skip

### 12.5 UTM strategy ✅
Our outgoing CTAs already append UTMs (e.g., `utm_source=linkedin&utm_medium=paid&utm_campaign=investor&utm_content=cta-hero-en`).
- [ ] **Confirm** / [ ] Change convention: `___`

### 12.6 Reporting dashboard 🟡
- [ ] **Pre-built Looker Studio template** (7-day traffic, funnel by language, top exits, blog reads, lead-count by program): [ ] Yes deliver / [ ] Skip
- [ ] **Weekly email digest** recipients: `___`
- [ ] **Frequency:** [ ] Weekly [ ] Biweekly [ ] Monthly

### 12.7 Search Console + Bing Webmaster ✅
Verification file already shipped (`googleb5b0b1b9be89eed8.html`).
- [ ] **Claim Search Console** with Nexa account: [ ] Done / [ ] Pending
- [ ] **Submit sitemaps** per locale at cutover:
  - `https://nexaparaguay.com/s/nl/nexa-paraguay/sitemap.xml`
  - `https://nexaparaguay.com/s/en/nexa-paraguay/sitemap.xml`
  - `https://nexaparaguay.com/s/de/nexa-paraguay/sitemap.xml`
  - `https://nexaparaguay.com/s/es/nexa-paraguay/sitemap.xml`
- [ ] **Bing Webmaster:** [ ] Claim / [ ] Skip

---

## 13. Ads, social calendar & PR

**Owner: Marketing.**

### 13.1 Paid ads assets 🟡
22 creatives catalogued in `ADS_ASSETS.md` (Meta, LinkedIn, Google Display, YouTube pre-roll).
- [ ] **All 22 exported in correct platform specs** (Meta 1:1 + 9:16, LinkedIn 1200×627, YouTube 16:9): [ ] Yes / [ ] Pending
- [ ] **Ad copy per creative** in 4 locales: [ ] Done / [ ] Pending
- [ ] **Launch-day paid spend**: [ ] Yes — budget $`___`/platform / [ ] Organic only for soft-launch
- [ ] **Targeting:** HNW European, 35–65, interest: relocation/tax/residency-by-investment — confirm or adjust `___`

### 13.2 Social calendar Q2 2026 🟡
12 posts scheduled in `CONTENT_CALENDAR.yml` (May–Jun 2026, every ~5 days) using approved social templates (villa-morra, data-tip, bts-office, carmelitas, san-bernardino, client-journey), captions in ES/EN/NL/DE.
- [ ] **Calendar approved?** [ ] Yes / [ ] Changes: `___`
- [ ] **Scheduling tool:** [ ] Buffer [ ] Hootsuite [ ] Later [ ] Manual
- [ ] **Approval workflow:** per-post sign-off before publish? [ ] Yes / [ ] No

### 13.3 Social accounts 🟠
- [ ] **LinkedIn Company page** `linkedin.com/company/nexa-paraguay` — [ ] Claimed by Nexa / [ ] To claim / [ ] Taken by squatter (rename?)
- [ ] **Instagram** `@nexaparaguay` — [ ] Claimed / [ ] To claim
- [ ] **Facebook** page — [ ] Create [ ] Skip
- [ ] **YouTube** channel — [ ] Create (for testimonial videos + process walkthroughs) [ ] Skip
- [ ] **TikTok** — [ ] Create (lifestyle-in-Asuncion content) [ ] Skip
- [ ] **X (Twitter)** — [ ] Create [ ] Skip

### 13.4 Press / PR launch 🟡
- [ ] **Press release prepared** (ES + EN + NL)? [ ] Yes / [ ] Pending / [ ] Skip
- [ ] **Media list** (local: ABC Color, Última Hora, 5días; European expat: IamExpat, DutchNews, GoStudy): [ ] Ready / [ ] To build
- [ ] **Embargo date** coordinated with launch? [ ] Yes — `___` / [ ] No / [ ] Skip
- [ ] **Founder interview availability** for journalists: [ ] Yes / [ ] Decline

---

## 14. Lead handling & operations

**Owner: Operations director.**

### 14.1 Lead routing 🔴
- [ ] **Assigned rep** for EU leads: `___` / [ ] Round-robin
- [ ] **Assigned rep** for LATAM leads: `___` / [ ] Round-robin
- [ ] **Fallback rep** (unrecognized country): `___`
- [ ] **Language-based routing:** NL → `___`, DE → `___`, EN → `___`, ES → `___`
- [ ] **Program-based routing:** Investor tier escalated to: `___`
- [ ] **Internal Slack notification** `#leads` channel webhook: `___` / [ ] Email-only instead: `___`

### 14.2 Response SLA 🔴
- [ ] **Response time commitment shown to user** (on thank-you page): [ ] 2 business hours [ ] 24 hours [ ] 48 hours [ ] Other: `___`
- [ ] **Business hours:** `___` (e.g., M–F 09:00–18:00 PYT)
- [ ] **Out-of-hours handling:** auto-reply only / on-call rep / next business day

### 14.3 Auto-reply copy 🔴
Per-locale auto-reply text. Who writes (same author as site copy?):
- [ ] ES: `___` (or author `___`)
- [ ] EN: `___`
- [ ] NL: `___`
- [ ] DE: `___`

### 14.4 Lead scoring 🟡
Current form fields: name, email, phone, country, program_interest, objective, source_site, language.
- [ ] **Add qualifying fields?** Each field adds 5–10% form-abandonment risk.
  - [ ] Budget tier (~€5k/€10k/€20k+)
  - [ ] Timeline urgency (this month / 3 months / exploratory)
  - [ ] Current residency status
  - [ ] Source of funds category (salary / business / investments / inheritance)
  - [ ] Custom: `___`
- [ ] **Keep form minimal** — qualify verbally in first call: [ ] Prefer

### 14.5 Handoff to LEALTIS 🟠
- [ ] **Lead handoff SOP** (when Nexa → LEALTIS after contract signature): documented? `___`
- [ ] **Client-facing continuity** (client sees one brand or knows about LEALTIS execution)? `___`

---

## 15. Domain, DNS & email hosting

**Owner: Operations + registrar-account holder.**

### 15.1 Domain 🔴
- [ ] **Registrar:** [ ] Cloudflare Registrar (recommended) [ ] GoDaddy [ ] Namecheap [ ] Other: `___`
- [ ] **Account holder:** individual or company? `___`
- [ ] **Expiry date:** `___`
- [ ] **Auto-renew enabled?** [ ] Yes / [ ] No
- [ ] **Registrar login access:** team / single person? `___`
- [ ] **Secondary domains owned** (nexaparaguay.net/.org/.py)? `___`

### 15.2 DNS records — pre-cutover setup 🔴
See `DNS.md` for record templates. Lock each:

| Record | Host | Target | Status |
|--------|------|--------|--------|
| CNAME | `@` | (Cloudflare Pages project) | [ ] |
| CNAME | `www` | (Cloudflare Pages project) | [ ] |
| CNAME | `staging` | (preview deploy) | [ ] |
| Redirect | `www.nexaparaguay.com/*` → `nexaparaguay.com/$1` (301) | — | [ ] |
| MX | `@` | (email provider) | [ ] |
| TXT | `@` SPF | `v=spf1 include:___ ~all` | [ ] |
| TXT | `default._domainkey` DKIM | (from email provider) | [ ] |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:___` | [ ] |

### 15.3 Email hosting 🔴
- [ ] **Provider:** [ ] Google Workspace (€6/user/mo) [ ] Zoho Mail (free ≤5 users, then €1/user/mo) [ ] Fastmail [ ] Microsoft 365
- [ ] **Mailboxes to create:**
  - [ ] `hola@nexaparaguay.com` (primary inbox)
  - [ ] `contacto@nexaparaguay.com` (alias)
  - [ ] `legal@nexaparaguay.com` (privacy / data requests)
  - [ ] `compliance@nexaparaguay.com` (SEPRELAD)
  - [ ] `prensa@nexaparaguay.com` (press)
  - [ ] `noreply@nexaparaguay.com` (transactional sender)
- [ ] **Monitoring owner** per mailbox: `___`

### 15.4 SSL / HTTPS ✅
Cloudflare Pages + Let's Encrypt auto-renew, "Full (strict)" SSL mode.
- [ ] Confirm / [ ] EV cert instead (not recommended)

### 15.5 Cutover timing 🔴
- [ ] **Preferred cutover date:** `___` (avoid Fri PM / Mon AM)
- [ ] **Lower TTL to 300s ≥24h before cutover:** [ ] Scheduled
- [ ] **Freeze windows** around MERCOSUR holidays (no cutover during): `___`

### 15.6 Monitoring post-cutover ✅
- Cloudflare Analytics ✅
- GA4 traffic ✅
- Supabase `leads` count daily ✅
- Lead-count alert if `=0` for 7 days after traffic > 100/day ✅
- [ ] Additional alerting / dashboards needed: `___`

---

## 16. Launch logistics

**Owner: All stakeholders.**

### 16.1 Launch type 📌
- [ ] **Soft-launch** (recommended) — DNS cutover + minimal announcement, 2–4 weeks iteration before marketing push
- [ ] **Hard-launch** — simultaneous DNS + press release + LinkedIn campaign + paid ads
- [ ] **Phased by locale** — ES first, then NL, EN, DE sequentially

### 16.2 Launch date 📌
- [ ] **Target:** `___` (YYYY-MM-DD, Tue/Wed AM PYT recommended)
- [ ] **Hard constraints** (investor event, press deadline, partner availability): `___`

### 16.3 3-person QA sign-off 🔴
Before DNS cutover, explicit green light from:
- [ ] **Commercial director** — reviewed full site in native language: `___` (name + date)
- [ ] **Operations director** — tested every form, verified lead flow end-to-end: `___`
- [ ] **Legal counsel** — reviewed privacy policy, FAQ legal claims, AML disclosure: `___`

### 16.4 Announcement channels 📌
- [ ] LinkedIn company post (NL, EN) — copy: `___`
- [ ] Founder personal LinkedIn — copy: `___`
- [ ] Existing mailing list (if any) — size `___`, copy: `___`
- [ ] Paraguayan press (ABC Color, Última Hora) — [ ] Yes [ ] No
- [ ] European expat press (IamExpat, DutchNews) — [ ] Yes [ ] No
- [ ] Paid LinkedIn ads launch — [ ] Yes day 1 / [ ] Week 2+ / [ ] No

### 16.5 Post-launch iteration cadence 🟡
- [ ] **Week 1–2:** daily monitoring (leads, GA4, errors, Sentry/Axiom logs)
- [ ] **Week 3–8:** weekly "what did we learn" review
- [ ] **Month 3+:** monthly retrospective + quarterly content refresh

---

## 17. Commercial mechanics

**Owner: Commercial director.**

### 17.1 Financial projections context ✅ (informational)
Business-plan repo documents: break-even ~1 client/month, Y1 USD 113k revenue, Y3 USD 401k. No action on site copy; informs ad budget + content investment decisions.

### 17.2 On-site payment 📌
- [ ] **Keep payments offline** (bank transfer / intake contract) for launch — recommended
- [ ] **Add Stripe** 50% deposit checkout — requires Stripe international payouts + Paraguay receiving bank, ~2 weeks setup
- [ ] **Add Pagopar / MercadoPago** for local Paraguay payments (if any local clients)
- [ ] **Crypto option** (USDT/USDC)? [ ] Yes [ ] No

### 17.3 Refund / cancellation policy 🔴 (legal)
- [ ] **Refund policy text** (per locale): `___`
- [ ] **EU distance-selling 14-day cooling-off** — applies? waived? how? `___`
- [ ] **Cancellation fees** (e.g., deposit non-refundable after documents submitted): `___`

### 17.4 Dispute resolution 🟠
- [ ] **In-product disclosure** of dispute path (arbitration / courts / ODR platform for EU): [ ] Yes `___` / [ ] TOS-only

---

## 18. Maintenance, ownership & handoff

**Owner: Operations director + engineering.**

### 18.1 Content ownership post-launch 🟡
- [ ] **Keep JSON-in-repo** (fast but requires git knowledge) — recommended for launch
- [ ] **Build content admin UI** (~2 weeks post-launch)
- [ ] **Google-Doc-sync** (slow, non-technical-friendly, adds translation-drift risk)

### 18.2 Content update SLA 🟡
When Paraguayan immigration law / tax rules / SEPRELAD guidance change:
- [ ] **Owner** on Nexa side who monitors regulatory change: `___`
- [ ] **Update SLA** (from law change → site reflects it): [ ] 1 business day / [ ] 1 week / [ ] 1 month

### 18.3 Engineering handoff scope 🟡
Proposed scope:
- Repo access for operations team
- `.env.example` with every var documented
- `docs/CONTENT-EDIT-GUIDE.md` (for non-engineer edits)
- `docs/how-to/debug-leads.md` (when a lead doesn't land in HubSpot)
- 2-hour onboarding video call
- [ ] **Confirm scope** / [ ] Add: `___`

### 18.4 Engineering SLAs 📌
- [ ] **Critical bug** (site down, all leads lost): 2h response, 8h fix
- [ ] **Major bug** (one form broken): 1 business day response, 3 bd fix
- [ ] **Minor bug** (typo, layout glitch): weekly batch
- [ ] **Feature request:** fortnightly backlog grooming
- [ ] Stricter? `___`

### 18.5 Backup & disaster recovery 🟠
- [ ] **Supabase PITR (Point-in-Time Recovery)** enabled: [ ] Yes / [ ] Verify
- [ ] **Cloudflare Pages rollback** (one-click to previous deploy) — accepted as DR: [ ] Confirm
- [ ] **Database export cadence** (weekly SQL dump to S3 / Drive): [ ] Set up / [ ] Skip
- [ ] **Incident runbook** for data breach (GDPR 72h notification rule): [ ] Document / [ ] Counsel to draft

### 18.6 Access management 🟠
- [ ] **Named humans with production access** (who can deploy, who can read leads DB): `___`
- [ ] **2FA enforced** on all admin accounts: [ ] Yes / [ ] Verify
- [ ] **Offboarding process** if a team member leaves: `___`

---

## 19. Risks & open items

**Owner: Commercial director + legal.**

### 19.1 Regulatory risk 🔴
Paraguayan immigration law, SEPRELAD rules, bilateral tax treaties change periodically. Site copy makes claims that must track law changes.
- [ ] **Named owner** for quarterly regulatory review: `___`
- [ ] **Change-management process** when law updates: `___`

### 19.2 Brand-name risk 🟠
"Nexa" is widely used across LATAM (non-competing sectors but adjacent).
- [ ] **Trademark filings committed in Y1** (PY/NL/DE/ES/EU): `___`
- [ ] **Rename plan** if a conflict surfaces post-marketing-spend: `___`

### 19.3 Partner-dependency risk 🔴
LEALTIS is effectively sole-source for legal/notarial execution.
- [ ] **Written SLA with LEALTIS**: [ ] Signed / [ ] Drafted / [ ] None — action: `___`
- [ ] **Backup escribanía relationship** developed: [ ] Yes / [ ] In progress / [ ] None
- [ ] **Contingency plan** if LEALTIS exits or raises prices 30%+: `___`

### 19.4 Concentration / key-person risk 🟡
- [ ] **Key-person insurance** on founders: [ ] Yes / [ ] Considered / [ ] No
- [ ] **Succession plan** if operations director leaves: `___`

### 19.5 Reputational / review-management risk 🟡
- [ ] **Google Business Profile** claimed: [ ] Yes / [ ] To claim
- [ ] **Trustpilot / review-site strategy** (invite post-delivery?): [ ] Yes / [ ] No
- [ ] **Negative-review response SOP**: [ ] Yes `___` / [ ] None

### 19.6 Financial / FX risk 🟡
Pricing in USD, costs partly in PYG (local team) and EUR (Europe-based director).
- [ ] **FX hedging** approach: `___` / [ ] None needed at current volume

### 19.7 Tech-stack risk 🟡
Tenant hosted on Cloudflare Pages + Supabase (EU) + paragu-ai-builder engine.
- [ ] Understand the **multi-tenant dependency** on `paragu-ai.com` infrastructure: [ ] Yes / [ ] Clarify with engineering
- [ ] **Exit plan** to self-hosted deployment if ever needed: `___`

### 19.8 Anything else not covered above?
List any concerns, edge cases, or questions unanswered by this document:
`___________________________________________________`
`___________________________________________________`
`___________________________________________________`

---

## 20. Answer template

Copy everything below into an email to `hola@nexaparaguay.com` (or replace with wherever responses should go). Any 🔴 left blank = launch blocked.

```
=== NEXA PARAGUAY — CLIENT QUESTIONNAIRE ANSWERS ===
Respondent: ________________________
Role: ________________________
Date: YYYY-MM-DD

--- 1. BUSINESS IDENTITY ---
1.1 Commercial name          : [ ] Confirm "Nexa Paraguay" / [ ] Change: ___
1.2 Legal entity             : Type ___ / Name ___ / RUC ___ / Address ___
1.3 Governing law            : ___ / Jurisdiction ___
1.4 Trademark status (PY/NL/DE/ES/EU): ___
1.5 LEALTIS relationship     : [ ] Reseller / [ ] Other ___ / MSA signed [ ]
1.6 Taglines confirmed       : ES ✅ / EN ✅ / NL ✅ / DE ✅ / edits ___

--- 2. TEAM & FOUNDERS ---
2.1 Founder 1 (Ops):   Name ___ / Bio ready [ ] / Photo ready [ ] / LinkedIn ___
2.1 Founder 2 (Comm):  Name ___ / Bio ready [ ] / Photo ready [ ] / LinkedIn ___
2.2 Legal lead:        Name ___ / Bar # ___ / Photo ready [ ]
2.2 Contador:          Name ___ / CPN # ___ / Photo ready [ ]
2.2 Escribano:         Name ___ / Matrícula ___ / Photo ready [ ]
2.2 Financial advisor: Name ___ / Photo ready [ ]
2.2 Client success:    Name ___ / Photo ready [ ]
2.3 Photo shoot committed: [ ] By ___ / [ ] Ship AI through soft-launch
2.4 Consent forms on file: [ ] Yes / [ ] Need template

--- 3. SERVICES & PRICING ---
3.1 Base:     name ___ / retail USD ___ / IVA incl [ ] / scope changes ___
3.1 Business: name ___ / retail USD ___ / IVA incl [ ] / scope changes ___
3.1 Investor: name ___ / retail USD ___ / IVA incl [ ] / scope changes ___
3.1 Tierras:  [ ] CTA-only / [ ] Full scope + price USD ___ / [ ] Remove
3.2 Display currency: [ ] USD only / [ ] USD+EUR / [ ] Auto
3.2 Payment terms:    [ ] 50/50 / [ ] 100% upfront / [ ] Other ___
3.2 Invoicing currency: [ ] USD / [ ] EUR / [ ] PYG
3.2 Refund policy: ___
3.3 Duration claim: [ ] 8-12 wks / [ ] 10-14 / [ ] 8-16 / disclaimer [ ]
3.4 Process model: [ ] 5 steps as-is / [ ] Changes ___
3.5 Services NOT offered disclosed: ___
3.6 Tax calculator: [ ] Keep+disclaimer / [ ] Remove / [ ] Rewrite

--- 4. LEGAL / COMPLIANCE ---
4.1 SEPRELAD status:   [ ] Obligated, reg # ___, category ___, officer ___
                       [ ] Not obligated (legal opinion attached [ ])
4.2 KYC flow changes:  ___
4.3 Privacy counsel:   Name ___ / Reviewed [ ] / Changes ___
4.3 EU representative: [ ] Appointed ___ / [ ] Not required
4.4 Terms of Service:  [ ] Add page / [ ] Intake-contract only
4.5 Cookie banner:     [ ] Approved / changes ___
4.6 Compliance disclaimer reg #: ___
4.7 Claims defensibility: cost-30-50% source ___ / tax-territorial verified [ ]
4.8 EU 14-day cooling-off: [ ] Applies / [ ] Waived

--- 5. BRAND ---
5.1 Palette:   [ ] Confirm navy+gold / [ ] Change ___
5.2 Typography: [ ] Confirm PlayfairInter / [ ] Change ___
5.3 Logo suite: [ ] Delivered / [ ] Commissioned ETA ___ / [ ] Ship wordmark
5.4 OG image:  [ ] Commission / [ ] Hero-crop
5.5 Iconography: [ ] Custom SVG / [ ] Lucide / [ ] Keep AI
5.6 Voice/tone: ES ✅ EN ___ NL ___ DE ___

--- 6. PHOTOGRAPHY ---
6.1 Hero:      [ ] Commission shoot by ___ / [ ] License stock / [ ] Ship AI
6.2 Why-PY:    [ ] Real / [ ] AI / [ ] Reduce
6.3 Office:    [ ] Real by ___ / [ ] Hide / [ ] Ship AI
6.4 Process:   [ ] Real / [ ] Lucide / [ ] AI
6.5 Blog:      [ ] Top 3 real / [ ] All AI
6.6 Press kit: [ ] Generate / [ ] Skip
6.7 Licensing audit: [ ] Complete / [ ] In progress
Model releases template needed: [ ]

--- 7. TESTIMONIALS ---
7.1 Real testimonials (with consent): ___, ___, ___, ___, ___
    features.testimonials flip to true when count ≥ ___
7.2 Real stats: totalClients ___ / satisfaction ___% / rating ___ / countries ___
    OR: [ ] Remove numeric stats
7.3 Video testimonials: [ ] Commission by ___ / [ ] Remove slots
7.4 Case studies: ___, ___, ___
7.5 Trust logos: ___

--- 8. LOCALES ---
8.1 DE:  [ ] Pro translation by ___ / [ ] Ship MT with badge / [ ] Disable DE
8.2 Reviewers: ES ___ EN ___ NL ___ DE ___
8.3 Blog priority: 1=___ 2=___ 3=___ (locales: [ ] EN [ ] NL [ ] DE)
8.4 Localize vs word-for-word: [ ] Localize / [ ] Word-for-word
8.5 PT locale: [ ] Defer / [ ] Add Phase 1

--- 9. PAGE REVIEW ---
Status per page (✅/⚠️/🛑): Home ___ Programs ___ Process ___ WhyPY ___
   QoL ___ Lifestyle ___ About ___ Company ___ Founder ___ Investor ___
   Benelux ___ Trust ___ Cases ___ Comparison ___ FAQ ___ Glossary ___
   Resources ___ Blog ___ Assistant ___ Privacy ___ Press ___ Contact ___
9.1 FAQ 15 items: [ ] All approved / [ ] Changes ___
9.2 AI assistant: [ ] Live (model ___) / [ ] Coming soon
9.3 Contact thank-you copy + SLA: ___
9.4 Benelux tax claims verified: [ ] Yes / [ ] Pending
9.5 Comparison page prices: [ ] Keep+source / [ ] Remove / [ ] Update ___

--- 10. BLOG & RESOURCES ---
10.1 Blog posts ready: ___ of 10 / Bylines: [ ] Generic / [ ] Real authors ___
10.3 Resource PDFs: [ ] All 3 / [ ] 1 flagship / [ ] Remove page / [ ] Gate with email

--- 11. INTEGRATIONS ---
11.1 Supabase URL ___ / region ___
11.2 HubSpot portal ___ / form GUID ___
11.3 Mailchimp API key ___ / list ID ___
11.4 Calendly URL slug ___ / owners ___
11.5 WhatsApp ___ / owner ___ / SLA ___
11.6 GA4 measurement ID G-___
11.7 Crisp: [ ] Yes ID ___ / [ ] Skip
11.8 Sentry: [ ] Yes DSN ___ / [ ] Skip
11.9 Transactional email: [ ] Resend / [ ] Other ___ / API key ___

--- 12. ANALYTICS ---
12.1 Event taxonomy: [ ] Confirm / [ ] Changes ___
12.2 Meta Pixel: [ ] Yes ___ / [ ] Skip
12.3 LinkedIn Insight: [ ] Yes ___ / [ ] Skip
12.4 Google Ads tag: [ ] Yes ___ / [ ] Skip
12.6 Reporting: weekly digest to ___
12.7 Search Console claimed by ___

--- 13. ADS & SOCIAL ---
13.1 Ad budget day-1: $___ / platform / targeting ___
13.2 Social calendar approved: [ ] Yes / scheduler ___
13.3 Socials claimed: LI [ ] IG [ ] FB [ ] YT [ ] TT [ ] X [ ]
13.4 Press launch: [ ] Yes embargo ___ / [ ] No

--- 14. LEAD HANDLING ---
14.1 EU rep ___ / LATAM rep ___ / Fallback ___ / Slack webhook ___
14.2 Response SLA ___ / Business hours ___
14.3 Auto-reply copy author ___ / locales ready: ES [ ] EN [ ] NL [ ] DE [ ]
14.4 Additional qualifying fields: ___
14.5 LEALTIS handoff SOP: ___

--- 15. DOMAIN & DNS ---
15.1 Registrar ___ / account holder ___ / expiry ___ / auto-renew [ ]
15.2 DNS records all locked: [ ]
15.3 Email provider ___ / mailboxes ___
15.5 Cutover date ___ / TTL lowered ≥24h before [ ]

--- 16. LAUNCH ---
16.1 Type: [ ] Soft / [ ] Hard / [ ] Phased
16.2 Date ___
16.3 QA sign-offs: Commercial ___ / Ops ___ / Legal ___
16.4 Channels: LI [ ] Founder [ ] Mailing list [ ] PY press [ ] EU press [ ] Paid [ ]

--- 17. COMMERCIAL ---
17.2 Payment method: [ ] Offline only / [ ] Stripe / [ ] Local rails
17.3 Refund policy: ___
17.3 EU 14-day cooling-off: [ ] Applies / [ ] Waived
17.4 Dispute resolution surfaced: ___

--- 18. MAINTENANCE ---
18.1 Content ownership: [ ] JSON in repo / [ ] Admin UI / [ ] GDoc sync
18.2 Regulatory owner ___ / Update SLA ___
18.3 Handoff scope changes ___
18.4 Eng SLAs: [ ] Defaults / [ ] Stricter ___
18.5 DB backup cadence ___ / Incident runbook [ ]
18.6 Prod access list ___ / 2FA enforced [ ]

--- 19. RISKS ---
19.1 Regulatory review owner ___
19.2 Trademark filing commitments ___
19.3 LEALTIS SLA signed [ ] / Backup escribanía ___
19.4 Key-person insurance ___
19.5 GBP claimed [ ] / Review strategy ___
19.6 FX hedging ___
19.8 Open concerns: ___

=== END ===
```

---

## Next steps after this document returns

1. **Engineering** replaces placeholders, wires integrations, updates AML disclosure template, clears placeholder-hash gate.
2. **Legal** signs off on privacy, TOS, SEPRELAD disclosures.
3. **Content / media** producers swap AI assets for real photography + consented testimonials.
4. **Ops** provisions Supabase, HubSpot, Mailchimp, Calendly, GA4, WhatsApp Business, email hosting.
5. **Commercial** prepares launch announcement, paid-ad creatives, social schedule.
6. **Three-person QA sign-off** (commercial + ops + legal).
7. **DNS cutover** on agreed date (Tue/Wed AM PYT).
8. **Submit sitemaps** to Google Search Console + Bing Webmaster in all 4 locales.
9. **Announce** per chosen channel mix.
10. **Iterate** weekly through month 2, then monthly.

**Typical turnaround:** 1 week from "all 🔴 answered" to "production live."

---

_Last updated: 2026-04-22. Supersedes `STAKEHOLDER-QA.md`. Cross-refs: `LAUNCH.md`, `DNS.md`, `PRE-LAUNCH-INVENTORY.md`, `DEMO_CONTENT.md`, `TESTIMONIALS_GATING.md`, `PLACEHOLDER_HASHES.json`, `src/compliance/aml-disclosure-nexa.template.md`._
