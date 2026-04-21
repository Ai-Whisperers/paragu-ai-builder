# Runbooks

One file per pageable alert. A runbook tells the on-call engineer: *what fired, what it means, what to check, how to mitigate, how to escalate.*

## Convention

- **Filename = alert name.** Snake case, matches the alerting-rule name. E.g., `high-error-rate.md`, `supabase-connection-saturation.md`.
- **Short.** A runbook is read at 3 a.m.; every line earns its keep. Aim for under 200 lines.
- **Structure every runbook the same way** so muscle memory works:

```markdown
# <alert-name>

## What fired
<one-line description of the alert condition>

## What it means
<the user-visible symptom — what's broken for whom>

## Check
1. <first place to look — dashboard link + what "normal" looks like>
2. <second place>
3. <third place>

## Mitigate
- <fastest thing that buys time: feature flag, rollback, rate limit>
- <next-best thing>

## Fix
<if the mitigation isn't a fix, what's the root-cause playbook>

## Escalate
<who to page if the above doesn't work — role, rotation, handoff criteria>

## Links
- Related dashboard(s)
- Related code path(s)
- Related past incidents
```

## Where runbooks come from

- Alerting rules (Sentry / Cloudflare / Supabase / Axiom) should reference the runbook file by URL in the alert description. When an alert without a runbook fires and requires investigation, that investigation's writeup becomes the first runbook.
- If a runbook is needed but none exists, the on-call's first job is to add one once the incident settles. Even a 20-line stub is better than starting from scratch next time.

## Existing runbooks

### Operational (alert-driven)

- [`ROLLBACK.md`](./ROLLBACK.md) — Last deploy broke prod
- [`ENV_VARS.md`](./ENV_VARS.md) — Rotating secrets across envs
- [`CRON_STRATEGY.md`](./CRON_STRATEGY.md) — Cron schedule + failure modes

### Onboarding (lifecycle)

- [`ADD_NEW_TENANT.md`](./ADD_NEW_TENANT.md) — Promote a business onto ParaguAI
- [`ADD_NEW_VERTICAL.md`](./ADD_NEW_VERTICAL.md) — Add a new industry vertical

Observability primitives live in [../observability/](../observability/); this folder is for the response playbooks.
