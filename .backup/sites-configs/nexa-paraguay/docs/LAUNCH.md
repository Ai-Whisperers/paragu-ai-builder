# Nexa Paraguay — launch runbook

> Target: `nexaparaguay.com` live on Cloudflare Pages with hreflang, GDPR consent, GA4, and lead capture to HubSpot + Mailchimp.
> Owner: commercial director Europe + operations director Paraguay.
> Stakeholder sign-off required before DNS cutover.

## Blocking decisions to lock before production

| # | Decision | Owner | Default if unlocked |
|---|---|---|---|
| 1 | Final company name | Stakeholders | Keep "Nexa Paraguay" (working name) |
| 2 | Nexa retail pricing (LEALTIS wholesale + margin) | Commercial | Show "TBD" on tiers |
| 3 | Compra de Tierras scope + pricing + partner network | Ops + legal | Ship as "Conversación exploratoria" CTA only |
| 4 | Calendly account + event type URL | Ops | Uses `https://calendly.com/nexaparaguay/consulta` placeholder — 404 until created |
| 5 | HubSpot portal id + form id | Marketing | `/api/leads` returns 502 for CRM forward, still persists to Supabase |
| 6 | Mailchimp API key + list id | Marketing | Same — email subscribe fails soft |
| 7 | GA4 measurement id | Marketing | Analytics script not injected |
| 8 | Professional translation of ES → NL, EN, DE (~20k words) | Translator | Seeded translations ship as-is (NL/EN quality high, DE machine-quality marked) |
| 9 | Asunción photography (50–100 images) | Producer | Navy gradient placeholders (accept ugly or source stock) |
| 10 | Logo design | Designer | Text-only navy Playfair wordmark |
| 11 | Attorney review of privacy policy + legal templates | Legal | Cannot launch without sign-off |
| 12 | SEPRELAD / anti-money-laundering compliance status | Legal | Cannot launch without sign-off |

## Environments

| Env | Host | Branch | Secrets source |
|---|---|---|---|
| Dev | `http://localhost:3000/s/<locale>/nexa-paraguay` | any | `.env.local` |
| Staging | `https://staging.nexaparaguay.com` | `claude/analyze-websuite-updates-ESbep` | Cloudflare Pages (preview) |
| Production | `https://nexaparaguay.com` | `Main` | Cloudflare Pages (production) |

## Required secrets (Cloudflare Pages project settings)

```
NEXT_PUBLIC_APP_URL                   = https://nexaparaguay.com
NEXT_PUBLIC_SUPABASE_URL              = https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY         = <anon-key>
SUPABASE_SERVICE_ROLE_KEY             = <service-role-key>
NEXT_PUBLIC_GA4_ID                    = G-XXXXXXXX
CRM_PORTAL_ID                         = <hubspot-portal-id>
CRM_ENDPOINT                          = <hubspot-form-guid>
EMAIL_API_KEY                         = <mailchimp-api-key>
EMAIL_LIST_ID                         = <mailchimp-audience-id>
EMAIL_FROM_ADDRESS                    = hola@nexaparaguay.com
EMAIL_FROM_NAME                       = Nexa Paraguay
```

## Launch runbook (step-by-step)

### Week 7 — staging

1. `npm ci && npm run build` in `web/`. Confirm clean build with 4 locales × 9 pages × tenant routes generated.
2. `npm run validate:all` — blocks merge on locale parity + section catalog integrity.
3. `npm run test:unit && npm run test:e2e` — expect all passing.
4. Deploy staging via Cloudflare Pages preview of this branch. Point `staging.nexaparaguay.com` DNS (CNAME → pages.dev) with Cloudflare SSL.
5. Stakeholder walkthrough: NL + EN content review by commercial director; legal sign-off on `/privacidad`; attorney sign-off on `/faq`.
6. Translator pass: NL locked (primary), DE polish, blog 10 articles translated.
7. Photography swap in `sites/nexa-paraguay/assets/` and reference in `content/*.json`.

### Week 8 — production

1. Merge PR to `Main` (CI must be green — validators + unit tests).
2. Confirm Cloudflare Pages auto-deploys `Main` to production.
3. **DNS cutover** (see DNS.md). Expect 5–10 min TTL propagation.
4. Smoke checks (production):
   - `curl -I https://nexaparaguay.com` → 200
   - `curl https://nexaparaguay.com/s/nl/nexa-paraguay/sitemap.xml` → 200 XML
   - Open each locale home page, verify hreflang tags, GA4 fires after consent
   - Submit test lead through `/contacto` form, verify row in Supabase `leads` + HubSpot contact + Mailchimp subscription
5. Submit `https://nexaparaguay.com/s/nl/nexa-paraguay/sitemap.xml` (and 3 other locales) to Google Search Console + Bing Webmaster.
6. Announce: LinkedIn post, first nurture email blast, press release (if applicable).

## Rollback

If production shows critical issues within 1 hour:
- Cloudflare Pages: **Production → Rollback to previous deployment** (one click).
- DNS: if Cloudflare is down entirely, switch CNAME back to holding page.
- Data: `leads` table remains intact across rollbacks; RLS prevents public read.

## Monitoring

- Cloudflare Analytics — traffic, geo split, bot filter.
- GA4 — conversion (Calendly click, lead submit), funnel per locale.
- Supabase `leads` — nightly count; alert if 0 leads for 7 consecutive days once traffic > 100/day.
- Search Console — indexation + hreflang errors, core web vitals.
