# 0002 · Hostinger VPS crontab over external cron services

**Status:** Accepted · 2026-04-21
**Deciders:** Ivan

## Context

Five recurring jobs need scheduling: leads-digest (daily), sitemap-ping (weekly),
commerce-email-flush (every 5 min), commerce-abandoned-cart (every 4 h),
commerce-reconcile-pending (hourly). The launch questionnaire asked: "i think
all should be in hostinger what do yopu suggest analyze and choose the best
option".

## Options considered

- **Hostinger crontab on the VPS** — same box that runs the app. Curl to
  `localhost`. No extra infra. Pros: zero coupling cost, zero auth round-trip
  to a third-party. Cons: single point of failure (but if the VPS is down, the
  app is down too — wash).
- **GitHub Actions scheduled workflows** — already managing deploys. Free.
  Cons: 5-minute minimum interval (overkill for daily/weekly), repo-visibility
  caveats if the repo goes private, auth from rotating GitHub IPs.
- **Vercel Cron** — best DX but we don't host on Vercel.
- **Cloudflare Cron Triggers** — cheap, global. Cons: Workers code path was
  removed in a pre-merge cleanup, would need to ship app to CF first.
- **External services (cron-job.org etc.)** — easy GUI, yet another vendor,
  CRON_SECRET leaves our perimeter.

## Decision

Hostinger crontab on the VPS. Curl-to-localhost. CRON_SECRET in env. Logs to
`/var/log/paragu-ai-crons.log` with logrotate.

## Consequences

- All schedules live in one place (VPS crontab) and one doc
  (`docs/runbooks/CRON_STRATEGY.md`).
- CRON_SECRET stays inside our perimeter — never sent to third parties.
- VPS reboots break the schedule until re-applied via `crontab -e`. Mitigated
  by storing the canonical schedule in CRON_STRATEGY.md.
- No retry-on-fail at the cron layer (cron just logs the curl exit code).
  See ADR or follow-up for #445 cron retry policy.

## Revisit if

- We migrate the app off the VPS (e.g. to Vercel or Cloudflare Pages), at
  which point the platform's native scheduler is the obvious choice.
- Reliability needs cross-region redundancy.
