# Cron strategy

> **Question from launch questionnaire (§9):** "i think all should be in
> hostinger what do yopu suggest analyze and choose the best option"
>
> **Status (2026-04-21):** ✅ **Installed.** `paragu-cron` wrapper at
> `/usr/local/bin/paragu-cron` on `72.61.44.159`. Crontab live with all 5
> entries. Logs at `/var/log/paragu-ai-crons.log` (logrotate configured).
> First leads-digest scheduled to fire at next 12:00 UTC (9am Asunción).

## TL;DR

**Use Hostinger crontab on the VPS.** Reasons below.

## Options considered

| Option | Pros | Cons |
|---|---|---|
| **Hostinger crontab** ✅ | Same box as the app · zero extra infra · `curl` to localhost · already where commerce crons live | Single point of failure (if VPS is down, no crons; but if VPS is down, neither is the app, so it's a wash) |
| GitHub Actions scheduled workflows | Free · already manage deploys | 5-min minimum interval; overkill for daily/weekly; leaks if repo goes private; auth via header is round-trip from GitHub IPs |
| Vercel Cron | Best DX | Not on Vercel · would need to ship the app there too |
| Cloudflare Cron Triggers | Cheap · global | Workers code path was deleted (PR pre-merged) |
| External (e.g. cron-job.org) | Easy GUI | Yet another service · auth secret leaves your perimeter |

**Hostinger wins on coupling: same machine that runs the app runs the crons.
No extra moving parts.**

## The crons we have

| Path | Schedule | Required env | Purpose |
|---|---|---|---|
| `POST /api/cron/leads-digest` | `0 12 * * *` (9am Asunción = 12 UTC) | `CRON_SECRET`, `RESEND_API_KEY`, `LEADS_DIGEST_FROM`, `LEADS_DIGEST_TO` | Daily inbound-lead email digest |
| `POST /api/cron/sitemap-ping` | `0 11 * * 1` (Mon 8am Asunción = 11 UTC) | `CRON_SECRET` | Re-ping search engines |
| `POST /api/cron/commerce-email-flush` | `*/5 * * * *` | `CRON_SECRET`, `RESEND_API_KEY`, `COMMERCE_EMAIL_FROM` | Send queued commerce emails |
| `POST /api/cron/commerce-abandoned-cart` | `0 */4 * * *` | `CRON_SECRET` | Abandoned cart recovery |
| `POST /api/cron/commerce-reconcile-pending` | `0 * * * *` | `CRON_SECRET` | Reconcile MP pending payments |
| `POST /api/cron/commerce-merchant-digest` | `0 11 * * *` (08:00 Asunción) | `CRON_SECRET`, `RESEND_API_KEY`, `COMMERCE_EMAIL_FROM` | Daily merchant digest: yesterday's orders + revenue + actionable pending list |
| `POST /api/cron/commerce-prune-search-events` | `17 3 * * *` (03:17 UTC daily) | `CRON_SECRET` | Prune `search_events` rows older than 90 days so the table stays bounded |
| `POST /api/cron/health` | `0 * * * *` (UTC, hourly) | `CRON_SECRET` | Returns `{ ok, crons[] }` per-cron env-readiness. 503 if any required env is missing. Wire to your monitor of choice. |

> Asunción is UTC-3 / UTC-4 (DST). Most ops choose to schedule in UTC and
> ignore DST. The above uses UTC offsets matching standard time (UTC-3).

## Setup

### 1. SSH to the VPS

```bash
ssh root@72.61.44.159
```

### 2. Verify the secret is in env

```bash
docker exec $(docker ps --filter name=paragu-ai_web -q | head -1) printenv CRON_SECRET
# Should print the value, not blank.
```

### 3. Add to crontab

```bash
crontab -e
```

Paste (one line per cron):

```cron
# ParaguAI — auto-managed crons. Edit at docs/runbooks/CRON_STRATEGY.md.
0 12 * * *  curl -fsS -X POST https://paragu-ai.com/api/cron/leads-digest -H "x-cron-secret: $CRON_SECRET" >> /var/log/paragu-ai-crons.log 2>&1
0 11 * * 1  curl -fsS -X POST https://paragu-ai.com/api/cron/sitemap-ping -H "x-cron-secret: $CRON_SECRET" >> /var/log/paragu-ai-crons.log 2>&1
*/5 * * * * curl -fsS -X POST https://paragu-ai.com/api/cron/commerce-email-flush -H "x-cron-secret: $CRON_SECRET" >> /var/log/paragu-ai-crons.log 2>&1
0 11 * * *  curl -fsS -X POST https://paragu-ai.com/api/cron/commerce-merchant-digest -H "x-cron-secret: $CRON_SECRET" >> /var/log/paragu-ai-crons.log 2>&1
0 */4 * * * curl -fsS -X POST https://paragu-ai.com/api/cron/commerce-abandoned-cart -H "x-cron-secret: $CRON_SECRET" >> /var/log/paragu-ai-crons.log 2>&1
0 * * * *   curl -fsS -X POST https://paragu-ai.com/api/cron/commerce-reconcile-pending -H "x-cron-secret: $CRON_SECRET" >> /var/log/paragu-ai-crons.log 2>&1
17 3 * * *  curl -fsS -X POST https://paragu-ai.com/api/cron/commerce-prune-search-events -H "x-cron-secret: $CRON_SECRET" >> /var/log/paragu-ai-crons.log 2>&1
```

⚠️ **`$CRON_SECRET` does not interpolate inside crontab by default.** Either:
- Put the literal value in the crontab (less safe, but simpler), or
- Wrap each cron in a tiny script that sources `/srv/paragu-ai/.env` first.

Recommended: tiny wrapper. Save once at `/usr/local/bin/paragu-cron`:

```bash
#!/usr/bin/env bash
# /usr/local/bin/paragu-cron <path>
set -euo pipefail
source /srv/paragu-ai/.env
curl -fsS -X POST "https://paragu-ai.com$1" -H "x-cron-secret: $CRON_SECRET"
```

```bash
sudo chmod +x /usr/local/bin/paragu-cron
```

Then crontab becomes:

```cron
0 12 * * *  /usr/local/bin/paragu-cron /api/cron/leads-digest >> /var/log/paragu-ai-crons.log 2>&1
0 11 * * 1  /usr/local/bin/paragu-cron /api/cron/sitemap-ping >> /var/log/paragu-ai-crons.log 2>&1
*/5 * * * * /usr/local/bin/paragu-cron /api/cron/commerce-email-flush >> /var/log/paragu-ai-crons.log 2>&1
0 11 * * *  /usr/local/bin/paragu-cron /api/cron/commerce-merchant-digest >> /var/log/paragu-ai-crons.log 2>&1
0 */4 * * * /usr/local/bin/paragu-cron /api/cron/commerce-abandoned-cart >> /var/log/paragu-ai-crons.log 2>&1
0 * * * *   /usr/local/bin/paragu-cron /api/cron/commerce-reconcile-pending >> /var/log/paragu-ai-crons.log 2>&1
17 3 * * *  /usr/local/bin/paragu-cron /api/cron/commerce-prune-search-events >> /var/log/paragu-ai-crons.log 2>&1
```

### 4. Smoke test

```bash
/usr/local/bin/paragu-cron /api/cron/sitemap-ping
# Expected: {"ok":true,"sitemap":"https://paragu-ai.com/sitemap.xml","results":[...]}
```

### 5. Rotate logs

`/var/log/paragu-ai-crons.log` will grow. Add to logrotate:

```bash
sudo tee /etc/logrotate.d/paragu-ai-crons > /dev/null <<'EOF'
/var/log/paragu-ai-crons.log {
  daily
  rotate 14
  compress
  missingok
  notifempty
  copytruncate
}
EOF
```

## What to do when a cron fails

1. Check the log: `tail -200 /var/log/paragu-ai-crons.log`
2. If it's "skipped: true" — env var missing. Check `docs/runbooks/ENV_VARS.md`.
3. If it's a 4xx/5xx — check Sentry / app logs.
4. Re-run manually: `/usr/local/bin/paragu-cron /api/cron/<endpoint>`.

## Future: when to migrate off Hostinger crontab

- If you move to a managed runtime (Vercel, Cloudflare, Fly.io)
- If you need cron observability beyond `tail -f`
- If you want web-based scheduling (e.g. for non-engineers to add jobs)

Until any of those: stay where you are.
