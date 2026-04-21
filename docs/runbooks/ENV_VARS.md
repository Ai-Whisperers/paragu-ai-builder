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
| `RESEND_API_KEY` | [resend.com/api-keys](https://resend.com/api-keys) → Create API Key → "Sending access" | ✅ provisioned |
| `LEADS_DIGEST_FROM` | A verified domain on Resend | ✅ `paragu-ai.com` verified, sa-east-1 |
| `LEADS_DIGEST_TO` | Comma-separated recipient(s) for daily digest | ✅ default = `weissvanderpol.ivan@gmail.com` |
| `COMMERCE_EMAIL_FROM` | Same Resend domain, used by commerce flush cron | TODO if commerce launches |

> **Domain verification status:** `paragu-ai.com` verified 2026-04-20. If you
> add another sender domain, follow [resend.com/domains](https://resend.com/domains)
> → add domain → drop the DKIM/SPF/DMARC records at your DNS host (Cloudflare
> for paragu-ai.com).

### Cron security

| Var | Where to get | Notes |
|---|---|---|
| `CRON_SECRET` | `openssl rand -hex 32` (must produce 64 chars) | header `x-cron-secret` on every `/api/cron/*` POST |

> ⚠️ The value pasted in the launch questionnaire was 53 chars (truncated).
> **Regenerate** with the command above and update all three layers.

### Google Analytics

| Var | Where to get | Status |
|---|---|---|
| `NEXT_PUBLIC_GA_ID` | [analytics.google.com](https://analytics.google.com) → Admin → Data Streams → web stream → "Measurement ID" (`G-XXXXXXXXXX`) | ✅ `G-XE49GLEP34` |

### Search Console

> Not an env var — verification works via the file at
> `web/public/googleb5b0b1b9be89eed8.html`. After deploy, the URL
> `https://paragu-ai.com/googleb5b0b1b9be89eed8.html` resolves and Google
> verifies.

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
