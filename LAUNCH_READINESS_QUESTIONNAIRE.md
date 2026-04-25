# ParaguAI — Launch Readiness Questionnaire
> **Single source of truth** for everything I still need from you to ship the site
> for paying customers. Fill answers inline (under each `▶ ANSWER:` line) and
> save. I'll pick this up file as the authoritative spec.
>
> **How to use:** edit answers in place, leave items you don't have yet as
> `▶ ANSWER: TODO — <reason>`. I'll process whatever you've filled and ask
> only about what's still missing.

---

## 0 · Quick stats

- **Items needing answers:** 38
- **Estimated time to fill:** 30–45 min if you have the data, 1–2h if you need to gather it
- **Critical blockers (P0):** items 1, 2, 3, 6, 7, 8 — without these we cannot launch
- **Last updated:** 2026-04-20

---

## 1 · Real WhatsApp numbers (P0)

The marketing site and 3 of the 6 tenant content files have placeholder/test numbers. Every CTA on the live site sends users to a non-working number.

### 1.1 ParaguAI sales WhatsApp (the marketing site number)
> Currently hardcoded to `595981234567` in `web/lib/landing/marketing-data.ts`.
> Used by all CTAs across `paragu-ai.com` (hero, pricing, demo, blog, etc.).

▶ ANSWER:+5959812354569 is paragui-ai phone number 

### 1.2 Dayah Litworks WhatsApp
> Currently `595981000000` in `sites/dayah-litworks/content/es.json`.

▶ ANSWER:+595 986 868241

### 1.3 De Abasto a Casa WhatsApp
> Currently `595000000000` (literal six zeros) in `sites/de-abasto-a-casa/content/es.json`.

▶ ANSWER:+5959812354569

### 1.4 Nexa Paraguay sales WhatsApp
> Nexa uses internal `/contacto` form CTAs, not WhatsApp. Confirm or provide a
> direct WhatsApp number to add as a secondary CTA.

▶ ANSWER:+595 982 515138

### 1.5 Nexa Uruguay sales WhatsApp

▶ ANSWER:+595 982 515138

### 1.6 Nexa Propiedades sales WhatsApp

▶ ANSWER:+595 982 515138

### 1.7 Should we delete the duplicate `/nexaparaguay` (one-word) variant?
> Currently broken (.map-on-undefined crash) and uses fake `595984561234`.
> The full multi-locale site at `/nexa-paraguay` (with hyphen) handles everything.
> **Recommendation:** delete it.

▶ ANSWER delete
---

## 2 · Tenant content corrections (P0)

### 2.1 Nexa Paraguay default locale
> Currently `nl` (Dutch). New visitors with no language preference land in Dutch.
> Probably should be `es` for Paraguay-targeted SEO.

▶ ANSWER (en): but should in the website itself have a way to switch between languages etc 

### 2.2 Nexa Paraguay German (DE) translation
> CI flags it as machine-translated, not shippable. Three options:
> (a) Pay for human translation (~€100-200), (b) Remove DE locale until then,
> (c) Override and ship as-is with `ALLOW_MACHINE_TRANSLATIONS=1`.

▶ ANSWER analyze it in deapth and improve the wording and cioommit AI wording 

### 2.3 Nexa Propiedades — "Más de 500 propiedades disponibles"
> Currently in hero copy. Real number, or aspirational?
> If real: source it. If aspirational: replace with something verifiable.

▶ ANSWER:insppirational

### 2.4 Nexa Uruguay default locale
> Currently `en`. Confirm.

▶ ANSWER: yes

### 2.5 Dayah Litworks tagline
> Currently "Donde la fantasía se convierte en realidad" — generic.
> Want something more specific to book-cover design?

▶ ANSWER: yes 

---

## 3 · Demo strategy decision (P0)

The marketing site links to 13 "demo" URLs (`/salon-maria`, `/gymfit-py`, `/spa-serenidad`, etc.). These render from a **deprecated** fixtures file with hardcoded fake data. When a prospect clicks "Ver demo en vivo" on `/p/peluqueria`, they land on `salon-maria` and see fake addresses, fake teams, fake test phone numbers.

### 3.1 Demo URL strategy
> **Option A — Polish them:** Treat each demo as a flagship example. Replace
> fake data with thoughtful realistic data, add "DEMO" badge so prospects
> know it's not a real client. ~1–2 days of work for 13 demos.
> **Option B — Unlink them:** Remove "Ver demo en vivo" CTAs from `/p/[rubro]`
> pages. Replace with "Pedí tu demo personalizada" → WhatsApp. ~30 min.
> **Option C — Show only the 5 real client links** as demos (Nexa, Dayah, Abasto)
> and remove the rest. ~1 hour.

▶ ANSWER (A ):

### 3.2 If A: who provides the realistic demo data?
> Photos, prices, services, etc. Per-demo briefing or generic "Paraguay-realistic" content?


▶ ANSWER: > its all AI generated and later once we have clients clients will be demo 

---

## 4 · Brand assets (P1)

### 4.1 Real logos (SVG or transparent PNG) for the LogoStrip
- [ ] Nexa Paraguay logo
- [ ] Dayah Litworks logo
- [ ] De Abasto a Casa logo
- [ ] Nexa Uruguay logo (or reuse Nexa Paraguay's)
- [ ] Nexa Propiedades logo (or reuse)

> Drop into `web/public/clients/` as `nexa-paraguay.svg`, etc. or send and I'll
> place them.

▶ ANSWER: make a detaild plan for all teh assests we need for all clients etc and aslo for all demo websites to generate all of them with AI 

### 4.2 60-second walkthrough video
> The `<VideoBlock>` slot on the landing page is wired and waiting for a
> Loom or YouTube embed URL. Should show "WhatsApp message → demo delivered".
>
> **Where to record:** [Loom](https://www.loom.com/) (free, easy, screen+webcam).
> **Where to host:** Loom (default), [YouTube unlisted](https://studio.youtube.com),
> or self-host as MP4 in `web/public/`.

▶ ANSWER (URL): if we make a video it will be AI generated not manually research how to do this if needed and document 

### 4.3 Real client photos for case studies
- [ ] Photo + permission from Equipo Nexa (1 person OK, or team shot)
- [ ] Photo + permission from Dayah
- [ ] Photo + permission from Iván (De Abasto a Casa)

> Photos go in `web/public/casos/<slug>.jpg` (square 800×800 ideal).

▶ ANSWER: all have persmission no photos yet

---

## 5 · Case study claim validation (P1)

Each case study currently has outcome bullets I wrote based on testimonials. Confirm or correct each.

### 5.1 Nexa Paraguay outcomes (claimed)
- "4 idiomas activos desde el primer día (ES/EN/DE/NL)" — **DE is currently flagged as not shippable. Correct?** yes
- "Sitio replicado para Nexa Uruguay en cuestión de días" yes 
- "Sin permanencia con un proveedor — la infraestructura es propia" not sure what it means w clients dont provide domains if they have one shure i hook it up no prob but we only use one domain pragu-ai 


### 5.2 Nexa Uruguay outcomes (claimed)
- "De decisión a producción en días, no meses"
- "Misma arquitectura multi-idioma sin re-implementar nada"
- "Cero costo extra de mantenimiento por sitio adicional"

▶ ANSWER:ytue but its not a real client just an example

### 5.3 Nexa Propiedades outcomes (claimed)
- "Listado de propiedades actualizable sin tocar código"
- "Misma identidad visual que el resto de marcas Nexa"
- "Contacto directo por WhatsApp en cada propiedad"

▶ ANSWER: listado needs to be worked on and we need data from diferent sourfes to fill it up  etc 

### 5.4 Dayah Litworks outcomes (claimed)
- "3 comisiones cerradas en el primer mes" — **uncited claim, need confirmation** not confirmed website still ion demo for dayah
- "Pricing en USD listo para clientes internacionales"  we need usd and pyg pricing depending on if the person that checks the website is in paraguay or outside
- "Proceso de encargo claro, sin DMs de ida y vuelta"

▶ ANSWER:

### 5.5 De Abasto a Casa outcomes (claimed)
- "De mensaje de WhatsApp a sitio publicado: 4 días"
- "Menú semanal con precios en Gs visible 24/7"
- "Clientes hacen su selección y la mandan por WhatsApp con un clic"
still ned work on the plan and the contents fot the website research similar business and what they made and what features they use and what features clients for this business would want 

▶ ANSWER (confirm with Iván):

---

## 6 · Marketing claims (P1)

### 6.1 "16 plantillas listas" claim
> Technically true — 16 verticals have content/tokens. Practically false — most
> aren't backed by a real productized configuration ready for a new client.
> **Recommendation:** change to "Plantillas especializadas para X rubros" without
> a precise count, OR commit to having all 16 actually salable by launch.

▶ ANSWER (keep "16 listas" / change wording / commit to making 16 real):
change wording

### 6.2 EN locale (`/en/p/[rubro]`)
> Currently 16 EN landings. For most verticals (peluquería, gimnasio, spa, etc.)
> the English-speaking PY market is ~zero. Only relocation, real estate, and
> professional services have real EN demand (Nexa pattern).
> **Recommendation:** Keep EN for: relocation, professional services. Remove
> from beauty/wellness/food/restaurant verticals.

▶ ANSWER (keep all 16 / keep only [list]):
keep all but make both spanish and eng version and choose for each what to make the default 

### 6.3 Pricing — confirm exact numbers and trial
- Plan Prueba: Gratis · 3 meses sin costo                  ▶ CONFIRM:yes
- Plan Presencia: Gs 650.000 setup · Gs 100.000/mes        ▶ CONFIRM:yes
- Plan Crecimiento: Gs 1.200.000 setup · Gs 150.000/mes    ▶ CONFIRM:yes
- Plan Profesional: Gs 2.200.000 setup · Gs 300.000/mes    ▶ CONFIRM:yes

i want to work on the plans more still ideally i want to offer for the first 3 months full premium etc  and poayed tiers get 4 and 6 months of full premium 

i want to make sure the pricing is right etc and we have detaild communication with clients easy so we can know what they want and need upgraded etc


### 6.4 Payment methods listed: "Mercado Pago o transferencia bancaria"
> No checkout exists. Only WhatsApp closes deals today.

▶ ANSWER (confirm WhatsApp-only for now / build checkout / change copy):
whatsapp only for now working on checkout etc

### 6.5 30-day money-back guarantee
> Currently advertised. Confirm.

▶ ANSWER:yes

### 6.6 Per-city stats (currently my estimates from your 7.4K dataset)
- Asunción: 3,200 negocios mapeados, 74% sin web
- Ciudad del Este: 1,100 negocios, 78% sin web
- Encarnación: 580 negocios, 76% sin web
- Luque: 720 negocios, 79% sin web
- San Lorenzo: 950 negocios, 75% sin web

▶ ANSWER (use as-is / replace with [data] / source from leads dataset):
https://github.com/Ai-Whisperers/paragu-ai-leads aanlyze here for more context and make a detaild list of things we should improve in this repo etc 

---

## 7 · Domain pointing (P1)

Per the prior status box, all 5 client domains are configured at Traefik but
need DNS pointed at `72.61.44.159` to issue Let's Encrypt certs.

| Domain | Pointed at VPS? | Cert issued? |
|---|---|---|
| nexaparaguay.com | ▶ | ▶ |
| nexauruguay.com | ▶ | ▶ |
| nexapropiedades.com | ▶ | ▶ |
| deabastoacasa.com.py | ▶ | ▶ |
| dayah-litworks.com | ▶ | ▶ |

> Need an A record at the registrar pointing to `72.61.44.159`. After DNS
> propagates (~15 min – 24h), Traefik auto-issues Let's Encrypt cert on
> first request.
>
> **Registrar links** (where to add A records):
> - `.com.py`: [NIC.PY](https://www.nic.py/)
> - `.com`: depends on which registrar (Namecheap / GoDaddy / Cloudflare / etc.)
>
> **A record format:** Name = `@` (root) + `www`. Value = `72.61.44.159`. TTL = 3600.

all will only be accesible via slug in our pparagu-ai domain only this will be done if clients provide domains etc 
---

## 8 · API keys / environment variables (P1)

These need to be set in your VPS env (probably via the GitHub Actions deploy
secrets or a `.env` file on the server).
make a complete guide for this and lets keep all secrets etc all in 1 place in the vps we have things for this i think

### 8.1 Resend (transactional email — required for `/api/cron/leads-digest`)

| Variable | Where to get | Status |
|---|---|---|
| `RESEND_API_KEY` | [resend.com/api-keys](https://resend.com/api-keys) → "Create API Key" → choose "Sending access" | ▶ SET / NOT SET | re_XoFiWMDT_Q8HmT27sXvzLLZe7563jB42y
| `LEADS_DIGEST_FROM` | A verified domain on Resend, e.g. `"ParaguAI Leads <leads@paragu-ai.com>"` | ▶ |
| `LEADS_DIGEST_TO` | Comma-separated emails to receive the daily digest | ▶ |

> **First-time setup**: Resend requires you to verify a sending domain via DNS
> records. [Resend domains setup](https://resend.com/domains). Use
> `paragu-ai.com` or a subdomain.

### 8.2 Mailchimp (newsletter signup — currently optional, falls back to logging)

| Variable | Where to get | Status |
|---|---|---|
| `MAILCHIMP_API_KEY` | Mailchimp account → [Profile → API keys](https://us1.admin.mailchimp.com/account/api/) → "Create A Key" | ▶ |
| `MAILCHIMP_DEFAULT_LIST_ID` | List → Settings → "List name and defaults" → near bottom: "List ID" | ▶ |

> If unset, newsletter form returns "Mailchimp not configured" and the email
> is logged but not stored. Acceptable for v1, blocker for serious lead capture.
>
> **Mailchimp thank-you page redirect:** in the same List Settings → "Form
> responses" → "Subscribe thank you page" → URL: `https://paragu-ai.com/gracias-newsletter`


not needed for now
### 8.3 Cron secret (already required by commerce crons)

| Variable | Where to get | Status |
|---|---|---|
| `CRON_SECRET` | Generate with `openssl rand -hex 32` and set in env | ▶ ALREADY SET / NEED TO GENERATE |
Welcome to Ubuntu 24.04.4 LTS (GNU/Linux 6.8.0-90-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of Mon Apr 20 20:50:59 -03 2026

  System load:  2.68                Processes:             426
  Usage of /:   57.2% of 386.42GB   Users logged in:       0
  Memory usage: 48%                 IPv4 address for eth0: 72.61.44.159
  Swap usage:   18%                 IPv6 address for eth0: 2a02:4780:66:42fb::1

  => There are 21 zombie processes.

 * Strictly confined Kubernetes makes edge and IoT secure. Learn how MicroK8s
   just raised the bar for easy, resilient and secure K8s cluster deployment.

   https://ubuntu.com/engage/secure-kubernetes-at-the-edge

Expanded Security Maintenance for Applications is not enabled.

20 updates can be applied immediately.
2 of these updates are standard security updates.
To see these additional updates run: apt list --upgradable

15 additional security updates can be applied with ESM Apps.
Learn more about enabling ESM Apps service at https://ubuntu.com/esm


5 updates could not be installed automatically. For more details,
see /var/log/unattended-upgrades/unattended-upgrades.log

Last login: Sat Apr 18 17:37:32 2026 from 186.158.200.190
root@agentzero:~# openssl rand -hex 32
7c8eb36c5ba4c404850d79cf502e23655efcb2ec847ace7aa662aefa9
### 8.4 Google Analytics / GA4 (optional but recommended for traffic visibility)

| Variable | Where to get | Status |
|---|---|---|
| `NEXT_PUBLIC_GA_ID` | [Google Analytics](https://analytics.google.com) → Admin → Data Streams → choose web stream → "Measurement ID" (format: `G-XXXXXXXXXX`) | ▶ |
Stream Name
paragu-ai
Stream URL
https://paragu-ai.com
Stream ID
14405264551
Measurement Id
G-XE49GLEP34

> The codebase has a `<GA4Loader>` component but currently no env wired.

### 8.5 Google Search Console (for sitemap submission)

> Not an env var — a one-time setup.
> [Search Console](https://search.google.com/search-console) → Add property
> → choose "URL prefix" → `https://paragu-ai.com` → verify (DNS or HTML file)
> → Sitemaps → submit `https://paragu-ai.com/sitemap.xml`
>Verify ownership
https://paragu-ai.com/
Recommended verification method
HTML file
Upload an HTML file to your website
1. Download the file:
2. Upload to: https://paragu-ai.com/
To stay verified, don't remove the file, even after verification succeeds.
Full details
Other verification methods
HTML tag
Add a meta tag to your site's home page
Google Analytics
Use your Google Analytics account
Google Tag Manager
Use your Google Tag Manager account
Domain name provider
Associate a DNS record with Google
google-site-verification: googleb5b0b1b9be89eed8.html
> Repeat for each tenant domain that has its own sitemap.

▶ ANSWER (done / pending / will do after DNS):

---

## 9 · Cron scheduling (P1)

You have 3 crons defined in code that need to be triggered by something:

| Endpoint | Schedule | Purpose |
|---|---|---|
| `POST /api/cron/leads-digest` | `0 9 * * *` (9am Asunción) | Daily inbound lead email digest |
| `POST /api/cron/sitemap-ping` | `0 8 * * 1` (Mon 8am) | Re-ping search engines after content updates |
| `POST /api/cron/commerce-email-flush` | `*/5 * * * *` (every 5 min) | Send queued commerce emails |
| `POST /api/cron/commerce-abandoned-cart` | `0 */4 * * *` (every 4h) | Abandoned cart recovery |
| `POST /api/cron/commerce-reconcile-pending` | `0 * * * *` (hourly) | Reconcile Mercado Pago pending payments |

> All require `x-cron-secret: <CRON_SECRET>` header.
>
> **Where to schedule them:** Hostinger VPS likely uses cron via crontab.
> Existing commerce crons are presumably already scheduled — check with:
> `ssh user@72.61.44.159 'crontab -l'`

▶ ANSWER (current cron infra / where to add new ones): i think all should be in hostinger what do yopu suggest analyze and choose the best option

---

## 10 · Press / social proof (P2)

### 10.1 Any press mentions to add to PressStrip?
> Currently empty (component returns null when array is empty).
> Add to `web/lib/landing/press.ts` as `{ outlet, url, date, context }`.

▶ ANSWER (none yet / [list]):none yet

### 10.2 Real client testimonials with explicit publish permission
> Currently 3 testimonials based on what you told me. Want explicit signed
> permission from each client before promoting heavily?

▶ ANSWER:no clients yet

---

## 11 · Misc decisions (P2)

### 11.1 Registry pruning
> 1,942 type definitions, only 34 backed by content. Recommendation: move
> the unimplemented 1,908 to `src/registry/_planned/` so it's clear what's live.

▶ ANSWER (yes / no / leave for later):yes

### 11.2 Newsletter strategy
> Where do you want subscribers to land? Options:
> (a) Welcome series of 3-5 emails over 2 weeks
> (b) Monthly newsletter with new templates / case studies
> (c) Just collect emails, decide later

▶ ANSWER:Just collect emails, decide later

### 11.3 Admin user account
> `/admin/*` requires `profiles.role = 'admin'` in Supabase.
> Confirm your account (`weissvanderpol.ivan@gmail.com`) is set as admin.

▶ ANSWER :confirmed

### 11.4 Other admins / team members
> Anyone else who should have admin access?

▶ ANSWER:none

---

## 12 · Honest "are we ready" gate

Mark each as **YES / NO / NOT-SURE**:

- [NOT-SURE ] All 5 client domains have valid SSL certs and resolve to the right tenant
- [ YES] Every CTA on the marketing site goes to a working WhatsApp number
- [NOT-SURE ] Every "Ver demo" link goes somewhere I'm proud to show a prospect
- [ YES] At least 1 paying customer can be onboarded end-to-end (intake → demo → payment → live)
- [NOT-SURE ] I can see new leads come in and reply to them within 24h
- [ YES] If I get hit by a bus, someone else can keep the business running on the existing infra

▶ ANSWER:

---

## After you're done

1. **Save this file.**
2. **Commit it** so it's preserved in history: `git add LAUNCH_READINESS_QUESTIONNAIRE.md && git commit -m "docs: launch readiness questionnaire"` (or just save and tell me, I'll commit).
3. **Tell me you're done** — I'll process the answers, do everything I can with the data you provided, and come back with a list of what's still missing.

---

> This file is the **single source of truth** for launch data. Keep it updated
> as decisions change. Treat conflicting info elsewhere (CLAUDE.md, docs/) as
> stale and update both.
