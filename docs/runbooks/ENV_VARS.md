# Environment variables · single source of truth

> **Audience:** anyone deploying ParaguAI or rotating a secret. Save you from
> grepping through commit history to figure out where a key is supposed to live.

## Layout

| Layer | Where | Read by |
|---|---|---|
| **Local dev** | `web/.env.local` (gitignored) | `next dev` on your laptop |
| **VPS prod** | `/srv/paragu-ai/.env` (or wherever Docker Compose reads `env_file`) | running container at `72.61.44.159` |
| **GitHub Actions** | repo Settings → Secrets and variables → Actions | the deploy workflow only |

**Rule:** every secret lives in **all three** for dev parity. If you add a new var, update this file too.

## Required variables

### Supabase (already provisioned)

| Var | Public? | Where to get | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | yes | [Supabase dashboard](https://supabase.com/dashboard) → project → Settings → API → "Project URL" | safe to expose |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | same → "Project API keys" → `anon public` | safe to expose, RLS-bound |
| `SUPABASE_SERVICE_ROLE_KEY` | **NO** | same → `service_role secret` | never expose; bypasses RLS |

### Resend (transactional email)

| Var | Where to get | Status |
|---|---|---|
| `RESEND_API_KEY` | [resend.com/api-keys](https://resend.com/api-keys) → Create API Key → "Sending access" | ✅ set on VPS prod + staging (2026-04-21) |
| `LEADS_DIGEST_FROM` | A verified domain on Resend | ✅ `leads@paragu-ai.com` (bare email — Docker swarm `--env-add` mishandles spaces/angle brackets in display-name format; Resend accepts bare emails fine) |
| `LEADS_DIGEST_TO` | Comma-separated recipient(s) for daily digest | ✅ `weissvanderpol.ivan@gmail.com` |
| `COMMERCE_EMAIL_FROM` | Same Resend domain, used by commerce flush cron | ✅ already set on VPS |
| `RESEND_WEBHOOK_SECRET` | Resend dashboard → Webhooks → create endpoint `https://paragu-ai.com/api/webhooks/resend` → copy the `whsec_...` value | ⚠️ unset until webhook configured. Without it, `/api/webhooks/resend` rejects every request as 401 (fail closed). Subscribe to `email.delivered`, `email.bounced`, `email.complained` at minimum. |

> **Domain verification status:** `paragu-ai.com` verified 2026-04-20. If you
> add another sender domain, follow [resend.com/domains](https://resend.com/domains)
> → add domain → drop the DKIM/SPF/DMARC records at your DNS host (Cloudflare
> for paragu-ai.com).

### Cron security

| Var | Where to get | Notes |
|---|---|---|
| `CRON_SECRET` | `openssl rand -hex 32` (must produce 64 chars) | ✅ rotated 2026-04-21 to a fresh 64-char value, synced to VPS prod + staging + `web/.env.local` |

> The original questionnaire value was 53 chars (copy truncated). The
> rotated value is in `web/.env.local`; the VPS containers have it via
> `docker service update --env-add`.

### Google Analytics

| Var | Where to get | Status |
|---|---|---|
| `NEXT_PUBLIC_GA4_ID` | [analytics.google.com](https://analytics.google.com) → Admin → Data Streams → web stream → "Measurement ID" (`G-XXXXXXXXXX`) | ✅ `G-XE49GLEP34` (set on VPS 2026-04-21) — note the `_GA4_` not `_GA_`, code reads this exact name in `web/app/s/[locale]/[site]/[[...page]]/page.tsx:109` |

### Search Console

> Not an env var — verification works via the file at
> `web/public/googleb5b0b1b9be89eed8.html`. After deploy, the URL
> `https://paragu-ai.com/googleb5b0b1b9be89eed8.html` resolves and Google
> verifies.

### Logging

| Var | Values | Default | Notes |
|---|---|---|---|
| `LOG_LEVEL` | `debug` \| `info` \| `warn` \| `error` | `info` in prod, `debug` elsewhere | Read by `web/lib/obs/logger.ts:106`. Lower-cased before lookup. Anything unknown falls back to the default. |
| `LOG_FORMAT` | `json` \| `pretty` | `json` in prod, `pretty` elsewhere | Read by `web/lib/obs/logger.ts:111`. `pretty` is colored single-line for terminals; `json` is one structured object per line for log aggregators (Axiom, Datadog, Loki). |

Set both to `debug` + `pretty` on your laptop for readable local development.
Leave both unset on the VPS — the production default is `info` + `json` which is what
Cloudflare/Axiom expects.

If you change `LOG_FORMAT=pretty` on the VPS for one-off debugging, remember
that `docker service logs` will keep showing colorized output until you set
it back. The diagnostics route at `/api/diagnostics` reflects current values.

### WhatsApp Business API webhook

| Var | Where to get | Notes |
|---|---|---|
| `WHATSAPP_VERIFY_TOKEN` | You choose any string when configuring the webhook in Meta's Business Manager | Used by GET `/api/whatsapp-webhook` for the initial verify-token challenge. |
| `WHATSAPP_APP_SECRET` | Meta App Dashboard → App settings → Basic → "App secret" | Used by POST `/api/whatsapp-webhook` to verify Meta's `x-hub-signature-256` HMAC. **Without this set, every POST is 401-rejected** (fail-closed). |
| `WHATSAPP_PHONE_SITE_MAP` | Self-managed JSON, e.g. `{"5959810000":"nexa-paraguay"}` | Maps Meta `phone_number_id` to a tenant slug for inbound lead routing. |

### Mailchimp (deferred per Q8.2)

Skip until the newsletter flow becomes a priority. When you wire it:

| Var | Where to get |
|---|---|
| `MAILCHIMP_API_KEY` | Mailchimp → [Profile → API keys](https://us1.admin.mailchimp.com/account/api/) |
| `MAILCHIMP_DEFAULT_LIST_ID` | List → Settings → "List name and defaults" → near bottom |

## How to set secrets on the VPS

```bash
ssh root@72.61.44.159
# Find the env file the running container reads:
sudo find /srv -name '.env' -o -name '*.env' 2>/dev/null | head
# Or, if managed by docker compose, check the compose file:
sudo grep -r 'env_file' /srv 2>/dev/null

# Edit the file in place
sudo nano /srv/paragu-ai/.env
# Append/replace any value, save, then bounce the service:
docker service update --force paragu-ai_web
```

If the env file lives in a different place, document it here once you find it.

## How to rotate a secret

1. Update the value at the source (Resend dashboard, `openssl rand`, etc.).
2. Update `web/.env.local` (your machine).
3. Update the VPS env file + `docker service update --force`.
4. Update the GitHub Actions secret (Settings → Secrets and variables → Actions).
5. Update this doc if the location moved.

## What NOT to do

- ❌ Commit `.env` or `.env.local` to git (already in `.gitignore`).
- ❌ Paste secrets into Slack / Discord / GitHub issues.
- ❌ Commit `LAUNCH_READINESS_QUESTIONNAIRE.md` after answers are filled (also gitignored).
- ❌ Use the same `CRON_SECRET` for staging and prod (use distinct values).

## Verifying everything is set

```bash
# On the VPS, in a shell with the env loaded:
node -e "['RESEND_API_KEY','CRON_SECRET','NEXT_PUBLIC_GA_ID','NEXT_PUBLIC_SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY'].forEach(k => console.log(k, process.env[k] ? 'SET' : 'MISSING'))"
```

If any return `MISSING`, the relevant feature won't work.

## Minimum env to make `/api/cron/leads-digest` send mail

- `CRON_SECRET` (any value)
- `RESEND_API_KEY`
- `LEADS_DIGEST_FROM` (must be on a verified Resend domain)
- `LEADS_DIGEST_TO`

If any are missing, the cron returns `{skipped: true}` — no error, just no email.
