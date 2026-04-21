# Pricing iteration v2 · proposal

> **Question from launch questionnaire (§6.3):**
> "i want to work on the plans more still ideally i want to offer for the
> first 3 months full premium etc and poayed tiers get 4 and 6 months of
> full premium … detaild communication with clients easy so we can know what
> they want and need upgraded etc"

## Current state (v1, on the site today)

| Plan | Setup | Monthly | Free trial |
|---|---|---|---|
| Prueba | Gratis | — | 3 meses |
| Presencia | Gs 650.000 | Gs 100.000 | (paid plan, no separate trial) |
| Crecimiento | Gs 1.200.000 | Gs 150.000 | (paid plan) |
| Profesional | Gs 2.200.000 | Gs 300.000 | (paid plan) |

## Your stated goals

1. Everyone gets full premium for 3 months at first
2. Paid plans get **additional** 4 or 6 months of full premium (not just their plan tier)
3. Detailed two-way communication with clients during this period to learn what they need

## Proposed v2 model

### Core idea: the "Premium grace period"

Every customer — free or paid — starts with the **full Profesional tier
unlocked** for a window. When the window ends, they downgrade to whatever
plan they actually paid for.

| Plan | Setup | Monthly after grace | Premium grace period | Effective experience |
|---|---|---|---|---|
| **Prueba** | Gratis | Gs 0 (then ads or downgrade) | 3 months full Profesional | Try everything free for a quarter |
| **Presencia** | Gs 650K | Gs 100K | **+4 months extra** (7 total Profesional, then Presencia) | First 7 months feel premium |
| **Crecimiento** | Gs 1.2M | Gs 150K | **+5 months extra** (8 total) | First 8 months premium |
| **Profesional** | Gs 2.2M | Gs 300K | always full | n/a |

### Why this works

- Removes "what plan should I pick" friction — everyone gets the best
- Encourages paid signups by stretching the "premium" window much longer
- Gives you 7-8 months of intimate observation per paid customer to understand their real needs
- Anti-pattern protection: paid plans pay for the grace + the long-term plan

### Comms cadence during grace

| Month | Touchpoint | Channel |
|---|---|---|
| 0 (signup) | Welcome WhatsApp + scheduled 30-min onboarding call | WhatsApp + Calendly |
| 1 | "How's it going? Any features you wished worked differently?" | WhatsApp |
| 2 | Mid-grace check-in: 15-min call, share what we observed in their analytics | WhatsApp + Calendly |
| 3 (Prueba ends, paid grace continues) | Decision point email for free tier; status update for paid | Email + WhatsApp |
| 5-7 (paid grace ending soon) | "Here's what your tier will look like after grace, want to upgrade?" | WhatsApp |
| 8 (grace ends) | Welcome to your paid tier · usage report · feedback survey | Email |

## Open decisions for you

These need your input before I can update site copy:

### A. After the "Prueba" 3-month grace, what happens?
- (i) Site stays up with ParaguAI ads/branding (current model — gets them to upgrade)
- (ii) Site goes offline (forces a buy decision; risky for trust)
- (iii) Downgrade to "Hasta 1 página + branding" tier permanently (free forever)

▶ DECIDE:

### B. How is "premium grace" actually enforced?
- (i) Manual — you flip features on/off per-tenant in admin
- (ii) Date-based — a `graceEndsAt` field per tenant, features check it
- (iii) Honor system — give them everything, document the post-grace deal in their contract

▶ DECIDE:

### C. Communication tooling
You want "detailed communication with clients". Options:
- (i) WhatsApp-only with admin tagging in `/admin/tenants` page (need to build)
- (ii) WhatsApp + monthly Calendly check-ins (need Calendly link)
- (iii) Slack-style shared channel per client (Linear has free orgs that work as this)

▶ DECIDE:

### D. Pricing for grace extension after the 4-5-7 month windows expire
- "Hey, want another 3 months of premium for Gs X?"
- ▶ Suggested rate per month of grace extension:

### E. Annual prepay discount?
- Buy 12 months upfront → get 2 months free?
- ▶ Y/N + discount %:

## What I can build immediately if you green-light this v2

1. Update `/precios` page copy to reflect grace period model
2. Update `marketing-data.ts` PLANS to include `gracePeriodMonths`
3. Build a `/admin/tenants/[slug]` page with: contact log, current grace status,
   upgrade history, simple notes field
4. Wire WhatsApp Business API to file inbound messages by tenant
5. Send the comms cadence emails as a cron-driven sequence

## Risks of this model

- **Adverse selection:** customers may sign up just for the free grace and bounce.
  Mitigation: get their card on file at signup (charge Gs 0, validate card).
- **Operational load:** 7-8 month grace periods mean you're babysitting many
  tenants at once. Cap concurrent grace periods if needed.
- **Revenue delay:** all paid plans collect setup upfront but the monthly
  doesn't kick in for 7-8 months. Cash flow plan accordingly.

---

> Once you fill the ▶ DECIDE blocks, I'll write the v2 site copy and the
> admin scaffolding in one PR.
