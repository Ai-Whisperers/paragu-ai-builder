# Nexa Paraguay — stakeholder Q&A packet

**For:** Nexa Paraguay leadership (commercial director Europe, operations director Paraguay, legal counsel).
**Audience:** decision-makers who need to confirm, modify, or reject the defaults we've built into the site.
**Purpose:** every open question that blocks production launch, with our proposed answer grounded in the codebase so you can confirm "yes, ship it" or redline what to change.
**How to use:** read each section, confirm the answer in the "**Proposed answer**" block, or respond with changes. Anything marked 🔴 is a blocker; 🟡 is ship-ready but improvable; 🟢 is done and just needs sign-off.

Cross-references:
- `LAUNCH.md` — the 12 blocking items we tracked during build.
- `STAKEHOLDER-REVIEW.md` — per-role checklist version of this doc.
- `DNS.md` — DNS cutover sequence.

Staging URL: `https://staging.nexaparaguay.com`
Proposed production URL: `https://nexaparaguay.com`

---

## Legend

| Symbol | Meaning |
|--------|---------|
| 🔴 | Blocks production launch — we need an answer before cutover |
| 🟡 | Built with a reasonable default, improvable later |
| 🟢 | Fully built, just needs your "go" |
| 📌 | A choice you should make consciously; we can't pick for you |

---

# Section A — Brand & identity

## A1. Company name 🔴

**Question:** What's the final legal and commercial name to use across the site, footer, copyright, email signatures, and legal documents?

**Proposed answer:** "**Nexa Paraguay**" — single two-word brand, used in:
- `siteName` in all 4 locale content files (`es.json`, `en.json`, `nl.json`, `de.json`)
- `navigation.businessName` on every page header
- Footer: `© 2026 Nexa Paraguay. Todos los derechos reservados.`
- WhatsApp message prefill: "Hola, soy un lead de Nexa Paraguay…"
- Email `From:` name: "Nexa Paraguay"
- Social handles: `linkedin.com/company/nexa-paraguay`, `instagram.com/nexaparaguay`
- Legal entity in privacy policy: currently "Nexa Paraguay" as placeholder

**Confirm:**
- [ ] The commercial name is exactly "Nexa Paraguay" (not "NEXA Paraguay" all-caps, not "Nexa LATAM", not "Nexa Group Paraguay", etc.)?
- [ ] The legal entity (the company on invoices, contracts, and privacy policy) has the **same** name, or a different one we need to name separately?
- [ ] Is there a tagline to add alongside? Current NL tagline: "Uw nieuwe start in Paraguay, eenvoudig en gerust." ("Your new start in Paraguay, simple and calm.") Confirm or replace.

**Consequences of change:** rename is a one-line edit per locale; deferrable until cutover.

---

## A2. Logo 🔴

**Question:** What logo file should ship? Do you have an SVG / PNG suite?

**Proposed answer (current state):** Text-only wordmark — "Nexa Paraguay" rendered in Playfair Display, navy `#1B2A4A`. No icon, no SVG. Used in the header and footer. This is a temporary placeholder.

**What we need:**
- [ ] Logo SVG (preferred) or high-res PNG (2048px wide) with transparent background
- [ ] Icon-only mark for favicon + social share thumbnails (32×32 min, 512×512 recommended)
- [ ] Monochrome (white) version for dark backgrounds (hero, CTA banner)
- [ ] Favicon file (`favicon.ico`) + Apple touch icon (180×180 PNG)

**If you haven't commissioned one yet:** we can keep the wordmark through soft-launch. The site still looks intentional — the placeholder isn't broken, just generic.

**Delivery path:** drop files into `sites/nexa-paraguay/images/brand/` with names `logo.svg`, `logo-dark.svg`, `logo-icon.svg`, `favicon.ico`, `apple-touch-icon.png`. We wire them in.

---

## A3. Color palette 🟢

**Question:** Do the current colors match the brand direction, or do you want to change the primary/secondary?

**Proposed answer (current state):**

| Token | Hex | Usage |
|-------|-----|-------|
| `--primary` | `#1B2A4A` | Deep navy — hero background, CTA banner, headings |
| `--secondary` | `#C9A96E` | Warm gold — buttons, accents, "Más elegido" badge |
| `--accent` | `#C9A96E` | (same as secondary) |
| `--background` | `#FFFFFF` | Page background |
| `--surface` | `#FFFFFF` | Card background |
| `--surface-light` | `#F5F3EE` | Alt section background (warm off-white) |
| `--text` | `#1B2A4A` | Body text |
| `--text-muted` | `#777777` | Captions, secondary copy |
| `--color-success` | `#16a34a` | Form success states |
| `--color-error` | `#dc2626` | Form errors |

Palette is in `src/verticals/relocacion/defaults.tokens.json`. Vibe: **institutional, trust-coded, European-feel** (navy + gold).

**Confirm:**
- [ ] Is the navy/gold direction right? Or would you prefer something warmer (earth/terracotta) or more modern (teal/slate)?
- [ ] Any specific HEX values from an existing brand guide we should match exactly?

**Consequences of change:** one JSON file edit rebrands the entire site in seconds (the token system is precisely for this).

---

## A4. Typography 🟢

**Question:** Fonts are locked to `Playfair Display` (headings, serif) + `Inter` (body, sans). Keep or change?

**Proposed answer:** Keep. The pair reads as "trustworthy but modern" and loads from Google Fonts (CSP already allows this). Playfair for an institutional feel, Inter for legibility.

**Confirm:**
- [ ] Or do you want something like DM Serif Display + DM Sans (similar vibe, modern alternative)?
- [ ] Or a custom font you've licensed (drop the WOFF2 into `public/fonts/` and we'll wire it)?

---

# Section B — Services & offerings

## B1. Program tiers — the 4 packages 🔴

**Question:** Are the four program tiers, their names, their scope, and their "who it's for" audiences finalized?

**Proposed answer (current state, all 4 locales):**

| Tier | Name (ES) | Price | Included |
|------|-----------|-------|----------|
| 1 | **Paraguay Base** | A definir | Residencia permanente + cédula de identidad + pre-validación documental + jornada operativa de 1 día + acompañamiento logístico |
| 2 | **Paraguay Business** ⭐ Más elegido | **USD 4.400+** | Todo lo de Base + constitución de sociedad + obtención de RUC + apertura de cuenta bancaria + tour inmobiliario + honorarios / IVA / tasas incluidos |
| 3 | **Paraguay Investor Program** | **USD 6.900+** | Todo lo de Business + contabilidad empresarial 12 meses + asesoramiento jurídico y fiscal 12 meses + análisis de inversiones + acceso directo al equipo técnico |
| 4 | **Compra de Tierras** | A definir | Definición de perfil y criterios + búsqueda y short list + due diligence legal y técnica + negociación y escrituración + inscripción registral |

**Confirm per tier:**
- [ ] **Base:** name and scope correct? Should it include anything else (tax ID? driver's license exchange?)
- [ ] **Business:** the "+ tasas incluidas" claim — does this really cover 100% of government fees, or is it "+ tasas estándar, los extraordinarios se facturan aparte"?
- [ ] **Investor:** 12 months of accounting + legal — does this mean 12 calendar months from residency approval, or 12 months of active engagement? How does it renew in year 2?
- [ ] **Tierras:** this is currently "exploratory conversation only, price TBD." Ship as-is or remove entirely? If remove, we reduce to 3 tiers.

**Consequences:** the four-tier structure is a load-bearing part of the visual design (4-column grid on desktop, stacks on mobile). Removing tier 4 means a 3-column grid — cleaner but changes the visual balance. We recommend keeping all 4 even if Tierras is "exploratory" because it sends a completionist signal ("we handle the full land-acquisition track too").

## B2. Pricing — retail 🔴

**Question:** What are the final retail prices? The tiers currently show wholesale base cost (LEALTIS) with "final Nexa price TBD."

**Current state (`_meta.priceNote` on each tier):**
- Base: `"TBD"`
- Business: `"USD 4.400+"` — LEALTIS base cost only, needs Nexa margin
- Investor: `"USD 6.900+"` — LEALTIS base cost only, needs Nexa margin
- Tierras: `"A definir"`

**What we need to know:**
1. **Retail price per tier** (what the customer sees)
2. **Currency** — stays USD, or show EUR alongside for European prospects? We can dual-display if you want.
3. **Inclusion disclosure** — do the displayed prices include or exclude Paraguayan IVA (10%)? Most European prospects will read "USD 6.900" as "what I pay, all in."
4. **"+" semantics** — does "USD 4.400+" mean "starts at USD 4.400" (dependent services optional) or "from USD 4.400 with potential surcharges"? We should be explicit.
5. **Payment terms** — is it 50% upfront / 50% on delivery? 100% upfront? Retainer + milestones? Affects the copy of the booking → payment flow.
6. **Currency of invoicing** — USD, EUR, or PYG (guaraníes)?

**Proposed default if you want a minimal answer:** USD prices, show "USD 4.400" (no `+`), display "IVA 10% incluido" in fine print beneath the price. Payment terms: 50/50 (50% on contract signature, 50% on residency card delivery). Invoicing in USD.

## B3. Process duration claim 🟡

**Question:** The site claims the end-to-end process takes **"8–12 semanas"** (8–12 weeks). Accurate? Too aggressive? Too conservative?

**Current state:** hardcoded in the `processWeeks` placeholder in all 4 locales. Used in `home.process.totalDuration` and repeatedly in FAQ.

**Confirm:**
- [ ] Is 8–12 weeks the real range? Our reading: it assumes documents are clean, no rework, Migraciones not backlogged. In reality, range might be 10–16 weeks.
- [ ] Should we add a disclaimer like "rango típico; casos con requisitos adicionales pueden extenderse"?

## B4. Process steps 🟡

**Question:** The process is presented as 5 steps. Confirm the names and scope:

1. **Consulta inicial** — 30-min video call, program selection
2. **Validación documental** — document pre-validation and translation
3. **Jornada operativa** — 1-day in-person in Asunción (biometrics, appointments)
4. **Sociedad y banca** — company formation + bank account (if Business tier and above)
5. **Entrega y seguimiento** — residency card delivery + 30-day follow-up

**Confirm:**
- [ ] Is the 5-step model accurate? We could go to 4 (merge banking into operational day) or 6 (separate residency card from follow-up).
- [ ] Any step we're missing that's actually critical to convey (e.g., Apostille pre-consultation, tax ID obtention separate from RUC)?

## B5. FAQ content 🟡

**Question:** The FAQ page has 15 items. Your team needs to read them in Spanish and confirm the answers match your operational reality.

**Sample items (Spanish, full list in `faqPage.full.items[]`):**
1. "¿El proceso es 100% legal?" → "Sí, operamos bajo el marco migratorio y comercial vigente en Paraguay. Trabajamos con LEALTIS Escribanía, firma autorizada y registrada."
2. "¿Cuánto tiempo tarda la residencia?" → "Entre 8 y 12 semanas para la residencia permanente, dependiendo de la limpieza documental."
3. "¿Puedo mantener mi residencia en Europa?" → "La residencia paraguaya no reemplaza ni anula su residencia europea. Consulte a su asesor fiscal local sobre implicaciones de doble residencia."
4. "¿Pago impuestos en Paraguay sobre ingresos de Europa?" → "Paraguay aplica sistema territorial: sólo tributa ingresos generados en Paraguay. Consulte para su caso específico."
5. "¿Mis hijos también obtienen residencia?" → "Sí, los menores dependientes obtienen residencia bajo el mismo expediente, con costo marginal."

**For the team:** each answer is a legal/commercial claim. Read all 15 and flag any you'd phrase differently or disagree with.

**Location:** `sites/nexa-paraguay/content/es.json` → `faqPage.full.items[]`.

## B6. Additional services we're NOT offering 📌

**Question:** Should any of these be mentioned or explicitly excluded?

Services we do NOT currently list:
- **Family relocation** (spouse residency, school enrollment, healthcare onboarding) — mentioned in passing, not priced
- **Tax optimization consultation** — absorbed into Investor tier, not sold separately
- **Real estate financing** — not offered
- **Citizenship path** (5-year track to Paraguayan passport) — mentioned in one FAQ, no dedicated page
- **Property management** (once land is bought) — not offered
- **Remote-work coaching / coworking intros** — not offered

**Confirm:**
- [ ] Anything on this list we should add as a separate service (even a single "Consultar" CTA)?
- [ ] Anything we should explicitly say "we do NOT offer" to set expectations? (E.g., property management)

---

# Section C — Legal & compliance

## C1. Legal entity of record 🔴

**Question:** What legal entity is signing contracts, receiving payments, and listed on the privacy policy?

**Proposed answer (current placeholder):** "Nexa Paraguay" — no RUC listed, no address listed, no jurisdiction declared.

**What we need:**
- [ ] Full legal name of the entity (SA, SRL, EIRL, etc.)
- [ ] RUC (Paraguay tax ID)
- [ ] Registered address
- [ ] Which country's law governs the contracts (Paraguay? Netherlands? Spain?)
- [ ] Which jurisdiction for disputes? (Paraguay courts? Arbitration seat somewhere?)

These get inserted into:
- The footer ("Nexa Paraguay SA • RUC XXX-X • Av. Mcal. López 1234, Asunción")
- Privacy policy contact section
- Terms of service (if we add one — we currently don't)
- Intake contract template

## C2. Privacy policy review 🔴

**Question:** The privacy policy page (`/privacidad`) is an accordion of 10+ items covering data collection, retention, user rights, third-party processors. Has counsel reviewed it?

**Current state:** page exists, content drafted in all 4 locales, structure follows a standard GDPR-light template. Accordion items cover:
- What personal data we collect (name, email, phone, program interest, message)
- Why we collect it (to respond to inquiry, to execute service if contracted)
- How long we retain it (stated: 3 years after last interaction)
- Who we share it with (HubSpot, Mailchimp, Calendly listed as processors)
- User rights (access, rectification, erasure, portability, objection)
- Contact for data requests (`hola@nexaparaguay.com`)
- Cookie policy (essential + optional analytics, explicit consent)
- Changes policy (24h notice, archive prior version)
- Governing law (TBD — see C1)
- Complaint path (national data authority of the user's residence)

**What we need:**
- [ ] Attorney (data-privacy specialist, ideally EU-qualified since most prospects are European) to review all 10 items and confirm wording.
- [ ] Specifically: confirm processor list is complete — is there anyone else (e.g., Supabase as database operator, Cloudflare as edge processor, Resend as transactional email) we need to add?
- [ ] **Data residency:** Supabase hosts in the EU by default but we should confirm. Our current claim is "EU-hosted database."
- [ ] Retention period of 3 years — confirmed or change?

## C3. SEPRELAD / AML (anti-money-laundering) 🔴

**Question:** Paraguay's SEPRELAD requires certain lead-capture / KYC flows for regulated service providers. Is Nexa Paraguay subject to SEPRELAD?

**Our understanding:** legal/immigration consulting services performing cross-border transactions on behalf of foreign nationals can fall under "obligated parties" under Law 1015/97. Unclear if Nexa's specific business model (bundled consulting) triggers registration.

**What we need:**
- [ ] Formal legal opinion: is Nexa Paraguay a SEPRELAD-obligated party?
- [ ] If yes: KYC intake requirements, records retention period (usually 5 years), suspicious-activity reporting obligations
- [ ] If yes: we likely need a KYC upload step in the intake flow (ID photo, proof of funds). Not currently built.

**Consequences if deferred:** operating without SEPRELAD registration when required = regulatory risk. The site's lead intake currently collects name/email/phone/message only — compliant for pre-sales contact but insufficient if SEPRELAD applies before contract signature.

## C4. Terms of service / intake contract 🟡

**Question:** We have no `/terms` page. Do you have an existing intake contract? Do you want the site to reference it?

**Current state:** no TOS. The privacy checkbox on the contact form says "Acepto la política de privacidad" only.

**What we need:**
- [ ] Do we add a `/terminos` page? Content needs to come from legal.
- [ ] Or do we keep TOS out of the site and rely on the intake contract signed during onboarding?
- [ ] If we add one: same drill as privacy — counsel drafts, we drop into content file.

## C5. Cookie banner — GDPR compliance 🟡

**Question:** The cookie banner is live in 4 locales. Does the wording satisfy GDPR/CCPA for your prospect profile?

**Current Spanish wording:**
> "Usamos cookies esenciales para el funcionamiento del sitio y cookies de análisis (opcional) para mejorar la experiencia. Puede cambiar su decisión en cualquier momento desde el pie de página."

Buttons: "Aceptar todas" / "Solo esenciales" / "Preferencias"

**What the banner does correctly:**
- No analytics cookies fire until user clicks "Aceptar todas" (GDPR-compliant)
- "Solo esenciales" path stores no optional cookies
- Choice is reversible (footer link mentioned in text)

**What could be better:**
- [ ] The "Preferencias" button is currently a placeholder (no modal opens) — should we build a granular consent UI, or is the 3-button bar enough?
- [ ] For strictly GDPR compliance the Dutch version should match Dutch DPA guidance exactly — confirm with counsel.
- [ ] No explicit list of which cookies are set (name, purpose, duration). Some DPAs want this as a table.

---

# Section D — Integrations

## D1. HubSpot (CRM) 🔴

**Question:** Is there a HubSpot portal? Which form should leads land in?

**Currently expected env vars** (none are set):
- `CRM_PORTAL_ID` — your HubSpot portal's numeric ID
- `CRM_ENDPOINT` — the form GUID of the form we post to
- (Optional) `CRM_API_KEY` — only if we switch from forms submission to the private app API

**What we need:**
- [ ] **Is there an existing HubSpot portal?** If yes: portal ID + form GUID.
- [ ] **If no portal:** do you want us to create one (Starter plan is free for low-volume), or use a CRM you already use (Pipedrive, Notion, Airtable — we have adapters for all three)?
- [ ] **Field mapping:** we currently send `firstname, lastname, email, phone, country, program_interest, objective, source_site, language`. Confirm these field names exist in your HubSpot form, or tell us what fields you want instead.
- [ ] **Properties per tier:** should `program_interest` map to a dropdown (Base/Business/Investor/Tierras) or stay free-text?

**Today's behaviour:** `/api/leads` returns 502 when no CRM is configured, then falls back to persisting in our Supabase `leads` table. We don't lose leads, but no CRM workflow fires. **You'd be missing automated follow-up.**

## D2. Mailchimp (email subscribe) 🔴

**Question:** Is there a Mailchimp account + audience set up for the site's newsletter / welcome email?

**Currently expected env vars:**
- `EMAIL_API_KEY` — e.g. `xxx-us1`
- `EMAIL_LIST_ID` — the audience ID
- `EMAIL_FROM_ADDRESS` — defaults to `hola@nexaparaguay.com`
- `EMAIL_FROM_NAME` — "Nexa Paraguay"

**What we need:**
- [ ] Existing Mailchimp account? If yes: provide API key + list ID.
- [ ] **If we create a new audience:** which tags/groups should we pre-configure? (E.g., "Nexa site lead", "program:business", "locale:es", "source:hero-cta")
- [ ] **Welcome automation:** do you want an automated welcome email sent when a lead signs up? If yes: who writes the copy (in 4 languages)?
- [ ] **Unsubscribe + GDPR lawful basis:** Mailchimp handles this if the audience is configured correctly. Confirm you want double opt-in (recommended for EU prospects).

**Today's behaviour:** marketing-consent checkbox on the contact form is wired, but there's no downstream list to send to. Leads still save to Supabase.

## D3. Calendly (booking) 🔴

**Question:** Does the Calendly account + "Consulta gratuita" event exist?

**Current config:**
- Hardcoded URL in `site.json`: `https://calendly.com/nexaparaguay/consulta`
- Not an env var — literally baked into the site config
- Returns 404 today (account doesn't exist)

**What we need:**
- [ ] Create the Calendly account under a team email (e.g., `hola@nexaparaguay.com`).
- [ ] Create an event type named "Consulta gratuita" (or your preferred name) — recommend 30 minutes.
- [ ] Event type URL slug should be `consulta` (so the full URL matches what we ship). Or tell us a different slug and we'll update the config.
- [ ] Confirm which team member's calendar(s) receive the bookings.
- [ ] Recommended: enable reminder emails + 24h cancellation policy.

**Why this is a launch blocker:** every "Agendar consulta gratuita" CTA (9 places on the home page alone, more across other pages) opens this URL. It 404s right now. You launch with a broken primary conversion path otherwise.

## D4. Google Analytics (GA4) 🔴

**Question:** Is there a GA4 property set up? What's the measurement ID?

**Currently expected env var:**
- `NEXT_PUBLIC_GA4_ID` — format `G-XXXXXXXXXX`

**What we need:**
- [ ] GA4 property — create one under the Nexa Paraguay Google Workspace account.
- [ ] Measurement ID → drop into env vars.
- [ ] Confirm default events are enough: page_view, scroll, click, form_submit, file_download, video_start. Or do you want custom events (e.g., "program_tier_clicked" with `tier` as a parameter)?
- [ ] IP anonymization: we turn it on by default (safer for EU prospects). Confirm.

**Today:** no script loads. We have a `--color-info` in `/api/health?deep=1` that reports `sentry=off metrics=off logs=...` — GA4 being off is just visible in the page source (no gtag).

## D5. WhatsApp number 🔴

**Question:** What phone number should "Escribinos por WhatsApp" link to?

**Current value in site.json:** `595000000000` — clearly a placeholder.

**What we need:**
- [ ] **The actual number** that receives the leads. Format: `595XXXXXXXXX` (country code + area code + number, no spaces, no `+`).
- [ ] **Who monitors it:** which team member owns the inbox? What's the response-time target (24h? business hours only?).
- [ ] **WhatsApp Business account:** recommended so replies use the team name. Optional; regular WhatsApp works.

## D6. Email `hola@nexaparaguay.com` 🔴

**Question:** Is this email real and monitored? What's the MX setup?

**Currently referenced in 8 places:**
- Footer
- Privacy policy (data requests)
- Contact page
- FAQ ("¿Cómo los contacto?")
- Transactional emails (Mailchimp From + Resend Reply-To)
- Social profiles (LinkedIn, Instagram)

**What we need:**
- [ ] Does the inbox exist? (Google Workspace? Zoho? Self-hosted?)
- [ ] Who gets new mail? Auto-responder configured?
- [ ] MX records for `nexaparaguay.com`: needs configuring before DNS cutover. See `DNS.md` for the record template.
- [ ] DKIM + SPF for outbound email (Mailchimp + Resend): required for inbox placement in EU/US. We'll document but you need to publish the DNS records.

## D7. Social profile URLs 🟡

**Question:** LinkedIn + Instagram URLs are declared in `site.json`. Do the accounts exist and belong to Nexa?

- `https://www.linkedin.com/company/nexa-paraguay`
- `https://instagram.com/nexaparaguay`

**Confirm:**
- [ ] Both URLs are claimed by Nexa Paraguay? (Check for squatters.)
- [ ] Should we add: Facebook, YouTube, TikTok, X/Twitter?
- [ ] Social images (OG image, Twitter card image) — currently we use the hero shot. OK?

---

# Section E — Content & translation

## E1. German translation quality 🔴

**Question:** The German content file (`de.json`) is flagged in its metadata as machine-translated. Accept this for launch or block on professional translation?

**`_meta` block from `content/de.json`:**
```json
"translationQuality": "machine",
"notes": "Seeded MT output. Needs professional DE translation before production."
```

**Rough word count to translate:** ~20,000 words (including FAQ, program tiers, pillars, blog meta).

**What we need:**
- [ ] Your call: ship machine-translated German and revise after launch, or delay the DE launch until a native translator does a pass?
- [ ] If delay: we disable `de` in `site.json` → `locales` and strip the DE option from the language switcher. Trivial revert when translation is ready.
- [ ] If ship with MT: we recommend adding a `<meta name="translation-quality" content="machine">` header so it's disclosed (and we add a small "Beta-Übersetzung" badge in the language switcher).

## E2. Blog translation 🟡

**Question:** 10 Spanish blog posts are ready. 0 English, 0 Dutch, 0 German. Do you want the blog live in ES only, or block the blog page until at least English is translated?

**The 10 Spanish posts:**
1. Guía Completa: Cómo Obtener la Residencia en Paraguay en 2024
2. Comparativa Fiscal 2024: Paraguay vs Uruguay para Empresas
3. Guía para Extranjeros: Cómo Comprar Propiedades en Paraguay
4. Apertura de Cuenta Bancaria en Paraguay para Extranjeros
5. Emprender en Paraguay: Oportunidades de Negocio 2024
6. Los 5 Errores Más Comunes al Mudarte a Paraguay
7. SEPRELAD y Compliance: Lo Que Todo Inversionista Extranjero Debe Saber
8. Paraguay vs Portugal: Guía Comparativa para Residencia Europea
9. Cómo Funciona el Sistema Tributario Territorial en Paraguay
10. Las Mejores Zonas para Vivir en Asunción

**Our recommendation:** translate posts 1, 2, 8 to English + Dutch first (highest conversion value for European prospects). Posts 3, 4, 7 next. The rest can stay ES only or be progressively translated.

**Confirm:**
- [ ] Prioritization order OK?
- [ ] Target word-for-word translation or localized adaptation (UK vs US English, Dutch as used in NL vs BE)?
- [ ] Do you have a translation provider, or should we recommend one?

## E3. Testimonials 🟡

**Question:** The site has testimonial content for 5 people, but `features.testimonials` is currently `false` in `site.json`, so the section is hidden.

**Why currently off:** the 5 testimonials are named but not verified real customers. Launching with unverified testimonials has legal and trust implications.

**What we need:**
- [ ] Do you have real customer testimonials that can be published with their full name + city/country? (Doesn't need to be 5 — even 2 real ones beats 5 placeholder ones.)
- [ ] If yes: replace the current 5 items in `home.testimonials.items[]` with real ones across all locales.
- [ ] If no: keep `features.testimonials: false` through launch. The site still reads as complete without them.

## E4. Tone of voice — per locale 🟡

**Question:** Each locale has a subtle voice. Spanish is professional-warm. Dutch is direct. English is aspirational. German was MT so neutral. Is this intentional?

**Current state:**
- **ES:** formal "usted" throughout, warm but respectful
- **EN:** formal "you", slightly more marketing-polished
- **NL:** formal "u" (not "je"), direct, matches Dutch business convention
- **DE:** formal "Sie", but MT so tone is uneven

**Confirm:**
- [ ] "usted" vs "tú" in Spanish — Paraguay is "usted" formal in sales context. We're on "usted". OK?
- [ ] "u" vs "je" in Dutch — we're on "u" (business-formal, Belgian-safe). OK for your NL audience?
- [ ] Should EN favour British or American spelling? We default to British (metric, "centre", "colour") — matches our European audience; confirm.

---

# Section F — Media & photography

## F1. Hero image 🔴

**Question:** The home hero uses a photo of Asunción skyline at golden hour (`images/hero/hero-bg.jpg`, 698KB). Is this a licensed photo or placeholder?

**What we need:**
- [ ] Licensing confirmation — is this image licensed for commercial use? Source and license type?
- [ ] **Alternative:** commission a real photo shoot — Asunción skyline, the LEALTIS office, team portraits, local architecture. Typical shoot: 1 day with a local photographer, €500–1500.
- [ ] If stock photo: Unsplash or Pexels give free commercial licenses. Our CSP already whitelists both domains.

**Why it matters:** the hero sets the tone. A real, identifiable Asunción shot signals "we're actually in Paraguay" much better than a generic navy gradient (our current fallback when the photo fails).

## F2. "Why Paraguay" pillar images 🟡

**Question:** 3 pillars currently have images: business-district, real-estate, lifestyle. Confirmed licensing?

**Files:**
- `images/why-paraguay/business-district.jpg` (81 KB)
- `images/why-paraguay/real-estate.jpg` (76 KB)
- `images/why-paraguay/lifestyle.jpg` (56 KB)

**Same question as F1:** licensed? replace with commissioned shots?

## F3. Process step images 🟡

**Question:** 5 process-step images exist (consultation.jpg, documents.jpg, arrival.jpg, banking.jpg, completion.jpg). Relevance check?

**Confirm:**
- [ ] Are the current images on-brand and relevant? Or are they generic stock that doesn't quite fit?
- [ ] Alternative: replace with illustrated SVGs (professional, brand-consistent, ~€200 for a 5-icon set from a designer on Fiverr/Upwork).

## F4. Team photos 🔴

**Question:** The `/sobre` page has a team section. Currently shows placeholder initials in circles. Who's on the team?

**What we need:**
- [ ] Team member names, roles, and short bios (2-3 sentences, per locale)
- [ ] Headshots (square, 400×400 min, consistent lighting/background)
- [ ] Optional: LinkedIn URL per member
- [ ] Optional: years-of-experience badge per member

**If the team is not customer-facing yet:** we can hide the team section entirely (`/sobre` page becomes hero + differentiators + trust + CTA, no team).

## F5. Logo files 🔴

See A2 above — same question.

## F6. Favicon + OG image 🟡

**Question:** Favicon is currently a generic N. Social share preview (when someone links to nexaparaguay.com on WhatsApp/LinkedIn) uses the hero image cropped oddly. Custom artwork?

**What we need:**
- [ ] Favicon set — ideally derived from the logo icon (32×32 ICO + 180×180 PNG apple-touch-icon)
- [ ] OG image (1200×630, dedicated — not the hero crop) with logo + tagline overlay. This is the image that appears in WhatsApp link previews, LinkedIn shares, Slack unfurls.

---

# Section G — Operations & lead handling

## G1. Lead routing 🔴

**Question:** When someone submits the contact form, where does the lead go, and who responds?

**Today (fallback behaviour since integrations aren't configured):**
1. Lead is written to our Supabase `leads` table.
2. Nobody is notified. Lead sits there until someone queries the admin dashboard.

**Target behaviour:**
1. Lead is posted to HubSpot form → triggers HubSpot workflow → assigns to a rep based on country/program/language.
2. Simultaneously: lead is added to Mailchimp audience with tags for segmentation.
3. Simultaneously: an internal Slack / email notification fires to the assigned rep within 2 minutes.
4. Lead receives an auto-reply in their language confirming receipt + expected response time.

**What we need:**
- [ ] Who's the fallback rep if routing rules don't assign (e.g., unusual country)?
- [ ] Do you have Slack? If so, a webhook URL for the `#leads` channel and we wire it.
- [ ] What's the SLA? E.g., "respond within 2 business hours, Monday–Friday 09:00–18:00 PYT"?
- [ ] Auto-reply copy in 4 languages — who writes it?

## G2. Lead scoring / qualification 🟡

**Question:** Do you want us to score / tag leads automatically?

**What's possible with the form data today:**
- Tag by `programInterest` (Base/Business/Investor/Tierras)
- Tag by `country`
- Tag by `locale` (likely proxy for buyer market)
- Tag by `source` (which CTA they clicked — we track this)

**What's not possible without more form fields:**
- Budget tier
- Timeline urgency
- Current residency status
- Source of funds disclosure (relevant if SEPRELAD applies)

**Confirm:**
- [ ] Do you want to add any qualifying fields to the form? Each added field reduces conversion by ~5–10% (industry average). Current 7 fields is already higher than optimal.
- [ ] Or do you prefer to handle qualification in the intake call (keep form simple, qualify verbally)?

## G3. CRM pipeline stages 🟡

**Question:** What pipeline stages should HubSpot have for Nexa leads?

**Proposed default:**
1. **New** — form just submitted, not yet contacted
2. **Contacted** — first reply sent, awaiting response
3. **Qualified** — discovery call scheduled via Calendly
4. **Proposal** — custom proposal sent
5. **Contracted** — contract signed, deposit received
6. **Delivered** — residency card issued
7. **Follow-up** — in 30-day post-delivery support window
8. **Lost** — disqualified or went cold (sub-statuses: no-response, wrong-fit, too-expensive, chose-competitor)

**Confirm:** stages match your sales process?

## G4. Weekly / monthly reporting 🟡

**Question:** What reporting cadence do you want?

**What we can emit today:**
- Daily lead count (new leads, by country, by program)
- Conversion funnel (site visit → form view → form submit → Calendly booked → contract signed)
- Traffic breakdown (country, locale, source, top pages)
- Blog performance (reads, shares)

**Delivery options:**
- Weekly email digest to a distribution list
- GA4 dashboard URL you check whenever
- Scheduled Axiom query (once log sink is live) for operational metrics

**What we need:** who gets the report, at what cadence, in what format?

---

# Section H — Domain & DNS

## H1. Domain ownership 🔴

**Question:** Who owns `nexaparaguay.com`?

**What we need:**
- [ ] Registrar name (GoDaddy, Namecheap, Cloudflare Registrar, etc.)
- [ ] Account holder (individual or company?)
- [ ] When does it expire? Any renewal risk?
- [ ] Who has registrar login — ideally a team, not one person.

## H2. DNS cutover timing 🔴

**Question:** When are we OK to flip production DNS to the Cloudflare Pages deployment?

**Pre-cutover checklist (from `DNS.md`):**
1. Lower TTL to 300s at least 24h before cutover (makes rollback fast if something breaks)
2. Verify staging at `staging.nexaparaguay.com` is green (it is today)
3. Legal sign-off on privacy policy (see C2) — MANDATORY
4. Integrations configured (D1–D6) — strongly recommended, not absolutely mandatory

**Timing recommendation:** cutover on a Tuesday or Wednesday morning, European timezone. Avoid Friday afternoon (nobody to debug over the weekend), avoid Monday (team catching up on email).

## H3. MX records 🔴

**Question:** Email hosting for `@nexaparaguay.com` — what's the plan?

**Options:**
- **Google Workspace** (€6/user/month) — recommended for a small team, familiar UX
- **Zoho Mail** (free for 5 users, ~€1/user/month beyond) — cheaper alternative
- **Self-hosted** — not recommended
- **Forwarding only** (`hola@` → a personal gmail) — works short-term but looks unprofessional on DKIM/SPF checks

**What we need:**
- [ ] Choose provider and configure
- [ ] Publish MX records (we'll document in DNS.md)
- [ ] Publish SPF + DKIM records (required for outbound email to not land in spam)

## H4. HTTPS / SSL 🟢

**Question:** SSL strategy is "Full (strict)" at Cloudflare. Confirm.

**Current state:** Cloudflare Pages auto-provisions SSL via Let's Encrypt. "Full (strict)" means Cloudflare validates the origin cert — prevents the "orange-cloud but insecure origin" problem.

**Confirm:** OK with auto-renew Let's Encrypt? (Versus purchasing an EV cert for extra browser prestige — not recommended for this use case.)

---

# Section I — Analytics & reporting

## I1. GA4 events 🟡

**Question:** What custom events should we track beyond default page_view/scroll/click?

**Proposed event taxonomy:**
- `program_tier_clicked` — `{ tier: 'base'|'business'|'investor'|'tierras' }`
- `cta_clicked` — `{ location: 'hero'|'programs'|'why'|'process'|'cta-banner', label: 'agendar'|'ver-programas' }`
- `form_started` — when user focuses first field
- `form_submitted` — when form posts successfully
- `form_error` — when form validation or submit fails
- `calendly_opened` — booking widget opened
- `whatsapp_clicked` — floating WhatsApp button clicked
- `blog_read` — article page loaded
- `language_switched` — `{ from: 'es', to: 'en' }`

**Confirm:** this taxonomy works? Anything to add/remove?

## I2. Conversion goals 🟡

**Question:** Which GA4 events count as "conversion"?

**Recommended conversions:**
- Primary: `form_submitted` — the thing we optimize for
- Secondary: `calendly_opened` — shows intent even if user didn't finish
- Tertiary: `whatsapp_clicked` — warm signal

**Confirm:** agree?

## I3. Reporting dashboard 🟡

**Question:** Do you want a pre-built Looker Studio dashboard on top of GA4?

**Template we can ship (copy-paste into Looker Studio):**
- Widget 1: 7-day traffic trend by country
- Widget 2: Funnel from landing → form submit by language
- Widget 3: Top exit pages (where people bail)
- Widget 4: Blog post reads
- Widget 5: Lead count by program interest

**Confirm:** want this? We set it up.

---

# Section J — Launch & post-launch

## J1. Launch type 📌

**Question:** Soft-launch, hard-launch, or phased?

**Options:**
- **Soft-launch (recommended):** DNS cutover with minimal announcement. Maybe LinkedIn post only. Iterate for 2-4 weeks before pushing marketing. Lets you find bugs at low blast radius.
- **Hard-launch:** DNS cutover simultaneous with press release, LinkedIn campaign, partner newsletter. Higher risk but better for funding/PR milestones.
- **Phased by locale:** launch ES only first, then NL, then EN, then DE. Good if translations aren't all ready.

**Our recommendation:** soft-launch. The site is solid but the integrations are new; find issues with low traffic first.

## J2. Launch announcement copy 📌

**Question:** If we're announcing, what channels and what copy?

**Candidate channels:**
- LinkedIn company page post (NL, EN)
- Personal founder post
- Email to existing mailing list (if any)
- Press: local Paraguay media (ABC Color, Última Hora) + expat-focused Europe media
- Paid: LinkedIn ads targeting "HNW European, 35-65, interested in relocation"

**What we need:** copy in whichever languages matter, launch date.

## J3. Soft-launch QA checklist 🟡

**Question:** Who does the final browse-through before cutover?

**Our recommendation:** 3 people, one each:
- **Commercial director** — browse the whole site in their native language. Read every CTA. Try to find something that feels off.
- **Operations director** — click every form, submit test leads, verify they land correctly. Test the Calendly flow end-to-end.
- **Legal counsel** — read the privacy policy, read the FAQ items that make legal claims.

Each person gives a go/no-go. No launch without 3 greens.

## J4. Post-launch cadence 🟡

**Question:** How often do we iterate?

**Our recommendation:**
- **Week 1–2:** daily monitoring. Check lead volume, GA4, Sentry errors, Axiom logs. Fix hotspots.
- **Week 3–8:** weekly "what did we learn" meeting. Which blog posts got read? Which CTAs convert? Any recurring FAQ question from leads? Update content.
- **Month 3+:** monthly retrospective + quarterly content refresh.

---

# Section K — Commercial / pricing mechanics

## K1. Currency strategy 📌

**Question:** Display prices in USD only, or offer currency switching?

**Today:** USD only (consistent with LEALTIS wholesale pricing).

**Options:**
- Keep USD only (simple, matches legal invoicing)
- Add EUR display alongside for European users (complexity: currency conversion at what rate? daily feed?)
- Detect user's IP and show locale-appropriate price (over-engineered for v1)

**Recommendation:** USD only for launch, revisit after 3 months of lead data.

## K2. Payment collection 📌

**Question:** How do customers actually pay?

**Currently:** not on the site. Payment happens offline after contract signature.

**Options for later:**
- Add Stripe checkout for the initial 50% deposit (needs Stripe account + Paraguay sender setup, usually via Stripe's international payouts).
- Add MercadoPago for local Paraguay payments.
- Keep offline (bank transfer / LEALTIS handles) — simpler, more consistent with B2B service reality.

**Recommendation:** keep payments offline for launch. Revisit when volume justifies Stripe setup.

## K3. Invoicing 📌

**Question:** Who issues the invoice? In what currency? With what tax treatment?

**This is really a legal/ops question:** your entity issues the invoice; we don't need to build invoicing into the site for v1.

**Confirm:** no site-level changes needed, correct?

---

# Section L — Ownership, maintenance, escalation

## L1. Content ownership 🟡

**Question:** Post-launch, who can update text on the site?

**Today:** content lives in JSON files in the repo. Editing requires git access + knowledge of JSON. Non-technical updates are painful.

**Options:**
- Keep as-is — fast iteration via PR, but only engineering can do it
- Add a content admin UI — complex to build but empowers you to edit copy yourself
- Middle ground: create a Google Doc per locale, we sync weekly — slow but non-technical

**Recommendation:** keep as-is for launch. Add content admin in month 2 if it becomes a bottleneck.

## L2. Operational handoff 🟡

**Question:** When we hand off the site, what does "handoff" mean?

**Our proposed scope:**
- Repo access for your operations team
- Documentation of every environment variable (we have this in `.env.example`)
- Runbook for "lead just submitted but didn't arrive in HubSpot" (we add to `docs/how-to/debug.md`)
- Runbook for "change copy in blog post 3" (we add to a new `docs/CONTENT-EDIT-GUIDE.md`)
- 2-hour onboarding video call

**Confirm:** this scope works? Anything else to include?

## L3. SLAs 📌

**Question:** What SLA do you want from us (engineering) post-launch?

**Our default:**
- Critical bug (site down, all leads lost): 2-hour response, 8-hour fix
- Major bug (one form broken, some leads missing): 1 business day response, 3 business day fix
- Minor bug (typo, layout glitch): weekly batch
- Feature request: fortnightly backlog grooming

**Confirm:** agree, or want stricter terms?

---

# Section M — Risks & things we can't answer alone

Three items that don't fit elsewhere but need to be on your radar:

## M1. Regulatory risk 🔴
Paraguayan immigration law, SEPRELAD, and bilateral tax treaties change regularly. The site's FAQ, program descriptions, and process timeline make claims that must stay accurate. **Who on your team owns updating the site when the law changes?** We recommend naming someone now, not at the first incident.

## M2. Brand-name risk 🟡
"Nexa" as a brand is used by multiple companies in LATAM (not relocation, but adjacent). Worth trademark-searching in Paraguay, Netherlands, Spain, and Germany before major marketing spend. Not a blocker for soft-launch.

## M3. Partner dependency risk 🟡
Nexa's service depends on LEALTIS Escribanía for legal execution. If LEALTIS's pricing, scope, or availability changes, the Nexa site's claims must track. **Is there a backup escribanía relationship, or is LEALTIS sole-source?** If sole-source, add a contractual SLA with them.

---

# Answer-back template

Copy this block and fill it in. Any `🔴` item you can't answer yet → block launch.

```
A1 Company name           :  [ ] Confirm "Nexa Paraguay"   / [ ] Change to: ___
A2 Logo                   :  [ ] Files coming              / [ ] Ship text wordmark
A3 Colors                 :  [ ] Confirm navy+gold         / [ ] Change: ___
B1 Program tiers          :  [ ] Confirm 4 tiers            / [ ] Changes: ___
B2 Retail pricing         :    Base $___  Business $___  Investor $___  Tierras $___
B3 Process duration       :  [ ] 8–12 weeks                / [ ] Change: ___
B5 FAQ review             :  [ ] Reviewed all 15 / changes: ___
C1 Legal entity           :    Name: ___  RUC: ___  Address: ___
C2 Privacy counsel review :  [ ] Reviewed                  / [ ] Still pending
C3 SEPRELAD status        :  [ ] Not obligated             / [ ] Obligated — KYC flow needed
D1 HubSpot                :    Portal ID: ___  Form GUID: ___
D2 Mailchimp              :    API key: ___  List ID: ___
D3 Calendly               :    URL: ___
D4 GA4                    :    Measurement ID: G-___
D5 WhatsApp               :    Number: 595___
D6 Email hosting          :    Provider: ___
E1 German translation     :  [ ] Ship MT                   / [ ] Delay until professional pass
E2 Blog translation       :  Priority order: ___
F1 Hero image             :  [ ] Current OK                / [ ] Commission shoot
F4 Team                   :  [ ] N/A hide                  / [ ] Members: ___
G1 Lead SLA               :    Response within: ___
H1 Domain                 :    Registrar: ___
J1 Launch type            :  [ ] Soft                      / [ ] Hard      / [ ] Phased
```

---

**Next step after you return this doc:** we update site config, wire integrations, schedule DNS cutover. Typical turnaround: 1 week from "all answers received" to "production live."
