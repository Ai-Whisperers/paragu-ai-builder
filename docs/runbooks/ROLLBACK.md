# Rollback procedure · prod

> When a deploy breaks prod, you have ~3 minutes to either fix-forward or
> roll back. This runbook is the rollback path. Use the fix-forward path
> when you understand the breakage; rollback when you don't.
>
> Closes BUG_HUNT_500 #449.

## TL;DR

```bash
ssh root@72.61.44.159
docker service update --rollback paragu-ai_web
# Verify:
curl -fsS https://paragu-ai.com/api/health
```

That's it. The Docker swarm service `paragu-ai_web` keeps the previous task
revision live and `--rollback` re-points the service at it. ~30 seconds.

## When to roll back vs fix forward

| Situation | Action |
|---|---|
| 5xx from prod, you know the cause, fix is 1-line | fix forward |
| 5xx from prod, cause unknown, deploy was <30 min ago | **roll back** |
| Wrong content shipped (pricing, phone, etc.) — site loads fine | fix forward |
| Build broke, no prod traffic touched yet | re-run the deploy workflow with the previous SHA |
| Multiple PRs merged in the last hour, can't tell which broke | **roll back** |

If the issue is in Cloudflare (cache, transform rules, workers), rollback
on the VPS won't help — that's a Cloudflare-side rollback (Audit Log →
revert).

## Step-by-step

### 1. Confirm prod is broken

```bash
curl -fsS -w "Status: %{http_code} · Time: %{time_total}s\n" -o /dev/null \
  https://paragu-ai.com/
curl -fsS https://paragu-ai.com/api/health
```

Both should return 200. If either fails, proceed.

### 2. SSH to the VPS

```bash
ssh root@72.61.44.159
```

### 3. Inspect current task state

```bash
docker service ps paragu-ai_web --no-trunc | head -10
```

The first row is the running task; the second row is the previous task
(state `Shutdown`, with reason `New task`). Note both image SHAs.

### 4. Roll back

```bash
docker service update --rollback paragu-ai_web
```

Wait ~30s. Re-run step 1 to confirm prod responds.

If prod is still broken after rollback, the issue is upstream of the app —
DB, Supabase, Cloudflare, env vars, or external API. Check logs:

```bash
docker service logs paragu-ai_web --tail 100 2>&1 | tail -30
```

### 5. Roll back staging too if it's affected

Same command, different service name:

```bash
docker service update --rollback paragu-ai-staging_web
```

### 6. Disable auto-deploys until you understand the cause

Edit `.github/workflows/deploy.yml` to add `if: false` to the deploy job,
or temporarily protect Main with a required manual approval. Re-enable
after fixing.

### 7. Communicate

If real customers were affected:
- Post in your sales WhatsApp groups (per pricing v2 §C tooling)
- Note in `/admin/tenants/<slug>/notes` for any impacted tenant
- Update `LIGHTHOUSE_BASELINE.md` or open an incident note

## What rollback does NOT undo

- **Database migrations** — if a deploy ran a migration, rollback to the
  previous container will hit the new schema. Either:
  - The migration was backwards-compatible (most are, by convention) → fine
  - Or you need to manually revert the migration via Supabase before rollback
- **Cron-side state** — emails sent, leads created, analytics events written
  during the bad deploy stay written
- **Cloudflare config changes** — rollback in the Cloudflare dashboard
  separately
- **Supabase RLS policy changes** — manual revert via Supabase dashboard
- **Env var changes** (`docker service update --env-add`) — rollback only
  reverts the IMAGE, not env. Check `docker service inspect` for current env

## What rollback DOES undo

- App code (server.js, .next/server/*, components, etc.)
- Static assets bundled with the app
- next.config.mjs changes
- Anything baked into the Docker image at build time

## Pre-rollback checklist

Before pulling the trigger, confirm:

- [ ] `git log --oneline -5` so you know what code is currently live
- [ ] No migration in the latest deploy (check `supabase/migrations/` last commit)
- [ ] You can re-run forward later (deploy workflow can re-fire)
- [ ] You've taken a screenshot of the broken page for postmortem

## Post-rollback

- Open a GitHub issue: "Rollback 2026-MM-DD · <commit> · <symptom>"
- Add a regression test if possible
- Re-deploy the fix forward when ready: push to Main, GitHub Actions takes
  over

## Known landmines

- **Docker image tag is mutable** (`paragu-ai:prod`). Two deploys close
  together may overwrite each other. Mitigation in BUG_HUNT_500 #450:
  pin to immutable SHAs. Until done, rollback only works for ~24h after
  the prior task was running.
- **Cloudflare cache TTL** = 1 year (`s-maxage=31536000`). After rollback
  you may still see the broken response from edge cache. Purge from the
  Cloudflare dashboard (Caching → Configuration → Purge Everything).
- **Background crons** continue to run during a rollback. If a cron is
  the cause of breakage, disable it on the VPS (`crontab -e`) before
  rolling back.

## Practice the rollback

You should have rolled back at least once in a non-prod scenario:

```bash
# On staging:
docker service update --image=ghcr.io/something:bad paragu-ai-staging_web
# Verify staging breaks
curl -fsS https://staging.paragu-ai.com/  # should 5xx
# Roll back
docker service update --rollback paragu-ai-staging_web
# Verify recovered
curl -fsS https://staging.paragu-ai.com/
```

Doing this once means you're not learning the procedure during an outage.
