# Paragu — Executive Plan: Research Improvements, Business Search, and Next Steps

> Cross-repo strategy doc. Mirrored in `ai-whisperers/paragu-ai-leads` at `docs/05_strategy/NEXT_STEPS_PLAN.md`. Update both when this changes.

## Context

Two repos exist that together form the Paragu product:

- **`ai-whisperers/paragu-ai-builder`** — Next.js 16 / Supabase / Cloudflare Pages site-generation engine. 12 business verticals with demo sites, multi-tenant + multi-locale work in flight (PR #23 ships **Nexa Paraguay** as proof of cross-vertical reuse).
- **`ai-whisperers/paragu-ai-leads`** — Python data + research repo. 7,463 Paraguay businesses analyzed, 3,960 "Priority A" leads (no website + phone + reviews + target category). Strong strategy docs: business plan, financial model, pricing, outreach playbook.

**Why this plan now**: We have great research artifacts and demo-quality builder output, but **the two repos are not connected by an automated pipeline, Supabase isn't provisioned, no leads are imported, and no payments/outreach exist**. We have shipped capability but no revenue path. Meanwhile, research is single-source (Google Maps only), neighborhood data covers only Asunción (208 cities = "Unknown"), and lead data has no enrichment beyond Google Places.

**Strategic decisions**:
1. **Continue platform expansion** — keep multi-tenant/multi-locale and multi-vertical work moving (PR #23 Nexa, Dayah Lit Works, additional verticals).
2. **Targeted research upgrades only** — 2-week time-boxed sprint: IG/FB enrichment, phone validation, top-5-city neighborhood expansion, 10 customer interviews.
3. **Address all bottlenecks sequenced** — data foundation → pipeline → outreach → conversion → payments.

**Outcome target (8 weeks)**: A multi-tenant platform with the leads → builder → outreach → onboarding → payment loop closed end-to-end, validated against ≥50 Priority A beauty/wellness businesses, with at least 2 verticals (beauty + relocation) and 2 locales live in production.

---

## Workstream Map

Three workstreams run in parallel. Workstream A (platform) and Workstream B (research) are continuous; Workstream C (bottleneck sequence) is the critical path to revenue.

### Workstream A — Platform Expansion (continuous, primary)

Keep the existing in-flight work moving. **No re-prioritization** of these PRs.

- **PR #23** (multi-locale Nexa Paraguay/Uruguay) — land per its 8-week roadmap
- **PR #20** (unified section registry + content loader) — land first; unblocks new verticals
- **PR #19** (relocation type + ProgramComparison + ProcessTimeline) — land after #20
- **PR #22** (homepage copy rewrite) — land independently
- **PR #21** (favicon + Google Fonts) — land independently
- **New verticals** queue: continue Dayah Lit Works (book cover designer) as next proof, then evaluate the next vertical using the leads-repo `BUILDER_EXTRACTION_MAP.md`

### Workstream B — Research Upgrades (2-week sprint, targeted)

Time-boxed; do NOT scope-creep into deep research overhaul.

| Upgrade | Repo | Deliverable |
|---|---|---|
| Instagram/Facebook handle enrichment for top 500 Priority A | `paragu-ai-leads` | New `src/enrichment/social_handles.py`; output column `instagram_handle`, `facebook_url`, `social_followers_estimate` in `data/processed/paraguay_priority_a.csv` |
| Phone number validation | `paragu-ai-leads` | New `src/enrichment/phone_validator.py` (Twilio Lookup or libphonenumber); flag invalid/landline/mobile; column `phone_status` |
| Neighborhood expansion: Ciudad del Este, Encarnación, San Lorenzo, Luque, Capiatá | `paragu-ai-leads` | Extend `src/locations/` with neighborhood polygons/centroids for these 5 cities; reduces "Unknown" rows by ~60% |
| 10 customer discovery interviews | `paragu-ai-leads` (docs) | `docs/01_market_research/CUSTOMER_INTERVIEWS.md` — willingness-to-pay validation, objections, must-have features per vertical |
| Lead-scoring v2 (recalibrate using social signals) | `paragu-ai-leads` | Update `src/scoring/` to weight IG follower count + IG activity recency; regenerate `paraguay_priority_a.csv` |

Reuse: `src/scrapers/google_maps.py` patterns; `BUSINESS_TYPES_ANALYSIS.md` taxonomy; existing 100-pt scoring scaffolding.

### Workstream C — Bottleneck Sequence (critical path)

**Phase 0 — Unblock (Week 1)**

- Provision Supabase project (production + preview); set env vars in Cloudflare Pages
- Run existing migrations; create `leads`, `generated_sites`, `generation_logs`, `outreach_events`, `subscriptions` tables (schema already designed in `LEADS_REPO_ANALYSIS.md`)
- Fix P0 blockers in builder: missing npm scripts (`validate:schemas`, `validate:tokens`, `generate:site`, `generate:preview`), missing `/login` route, test coverage for `salon_belleza` + `pestanas`
- Land PRs #19/#20/#21/#22 (cleanup)

**Phase 1 — Data foundation (Weeks 2–3, overlaps Workstream B)**

- Run `scripts/import-leads.ts` to load 3,960 Priority A leads into Supabase
- Add enrichment fields from Workstream B as they land
- Build `src/app/admin/leads/` UI: filterable table (city, vertical, score, contacted status), row drawer with full lead detail + generated-site preview button
- Reuse: existing `src/lib/supabase/` SSR client patterns from `vete` port (`VETE_PATTERNS_ANALYSIS.md`)

**Phase 2 — Leads → Builder pipeline (Weeks 3–4)**

- New endpoint `POST /api/leads/[id]/generate-preview` — composes a tenant-scoped preview site from lead row using existing section registry (after PR #20 lands)
- Admin UI "Generate preview" button → hits endpoint → renders preview at `/preview/[lead_id]` → admin approves → moves lead to `status=demo_ready`
- Tag every `generated_sites` row with `lead_id` for funnel tracking
- Critical files: `src/app/api/leads/[id]/generate-preview/route.ts` (NEW), `src/lib/generation/from-lead.ts` (NEW, reuses content loader from PR #20), `src/app/preview/[lead_id]/page.tsx` (NEW)

**Phase 3 — Outreach + CRM-lite (Weeks 5–6)**

- Lead status pipeline state machine: `new → enriched → demo_ready → contacted → responded → onboarding → paying → churned/dead`
- WhatsApp outreach: start with click-to-send `wa.me` deep links from admin UI using templates from `LEAD_MANAGEMENT.md`; log send event to `outreach_events`
- Onboarding form at `/onboarding/[lead_token]` — business confirms info, picks palette, requests text changes; submission updates lead → triggers regeneration
- Trackable demo URLs: UTM params + page-view beacon → `outreach_events` row
- Critical files: `src/app/admin/outreach/page.tsx` (NEW), `src/lib/outreach/whatsapp.ts` (NEW), `src/app/onboarding/[token]/page.tsx` (NEW), `src/lib/outreach/templates.ts` (NEW, ports content from leads-repo `LEAD_MANAGEMENT.md`)

**Phase 4 — Conversion + Payments (Weeks 7–8)**

- **MercadoPago** integration (the payment processor for Paraguay) — checkout for the 4 tiers already defined in `PAYMENT_DEALS.md` (FREE / $29 / $59 / $99)
- Subscription state in Supabase; webhook handler for payment events
- Self-service editing surface for paying customers (text + image swap; palette change)
- Funnel dashboard at `/admin/funnel`: contacted → responded → demo_viewed → onboarded → paying, with cohort by vertical/city
- Critical files: `src/lib/payments/mercadopago.ts` (NEW), `src/app/api/webhooks/mercadopago/route.ts` (NEW), `src/app/admin/funnel/page.tsx` (NEW), `supabase/migrations/00X_subscriptions.sql` (NEW)

---

## Critical Files Reference

**`paragu-ai-builder`**
- `supabase/migrations/` — extend with leads, outreach_events, subscriptions tables
- `src/app/admin/leads/` — NEW lead browser/CRM
- `src/app/admin/outreach/` — NEW outreach console
- `src/app/admin/funnel/` — NEW funnel dashboard
- `src/app/api/leads/[id]/generate-preview/route.ts` — NEW pipeline endpoint
- `src/app/onboarding/[token]/page.tsx` — NEW customer onboarding
- `src/lib/outreach/whatsapp.ts` + `templates.ts` — NEW (port from leads-repo docs)
- `src/lib/payments/mercadopago.ts` + webhook route — NEW
- `scripts/import-leads.ts` — existing, must be run after Supabase setup
- `src/lib/generation/from-lead.ts` — NEW, reuses content loader from PR #20
- `docs/LEADS_REPO_ANALYSIS.md`, `docs/FEATURE_GAP_ANALYSIS.md`, `docs/VETE_PATTERNS_ANALYSIS.md` — keep as source of truth; update as decisions land

**`paragu-ai-leads`**
- `src/enrichment/social_handles.py` — NEW (IG/FB)
- `src/enrichment/phone_validator.py` — NEW
- `src/locations/neighborhoods_extended.py` — extend beyond Asunción
- `src/scoring/` — recalibrate with social signals
- `data/processed/paraguay_priority_a.csv` — regenerate after enrichment
- `docs/01_market_research/CUSTOMER_INTERVIEWS.md` — NEW
- `docs/06_builder_integration/PIPELINE.md` — UPDATE: document the now-automated handoff

---

## Reused Assets (do NOT rebuild)

- **Lead taxonomy + scoring** — `paragu-ai-leads/src/analyzer/`, `BUSINESS_TYPES_ANALYSIS.md` (102-type mapping)
- **Section registry + content loader** — landing in builder PR #20; reuse for `generate-preview`
- **Supabase SSR patterns** — `VETE_PATTERNS_ANALYSIS.md` (already ported to builder)
- **Outreach copy + scripts** — `LEAD_MANAGEMENT.md`, `OPERATIONS_PLAYBOOK.md` in leads repo
- **Pricing + offers** — `PAYMENT_DEALS.md`, `PRICING_STRATEGY.md` in leads repo
- **i18n engine** — landing in PR #23; reuse for onboarding form locales

---

## Verification

End-to-end smoke test (run after Phase 4):

1. Pick a Priority A lead from Supabase admin UI → click "Generate preview" → preview renders at `/preview/[id]`
2. Click "Send WhatsApp" → opens `wa.me` link with templated message including demo URL
3. Open demo URL → page-view event lands in `outreach_events`
4. Submit onboarding form at `/onboarding/[token]` → lead status flips to `onboarding`, site regenerates
5. Complete MercadoPago checkout (sandbox) → webhook flips status to `paying`, subscription row created
6. Lead appears in `/admin/funnel` cohort with full chain of events

**Pilot KPI gates** (measured against 50 Priority A leads in Phase 3):
- Contact rate (delivered WhatsApp) > 80%
- Response rate > 15%
- Onboarding form completion > 5% of contacted
- Paying conversion > 2% of contacted

If pilot KPIs miss by >50%, **pause Phase 4 payments rollout** and run a 1-week diagnostic sprint (interview non-responders, refine targeting, A/B test outreach copy) before resuming.

**Per-workstream verification**:
- **Workstream A**: existing PR test suites + Playwright E2E for new verticals
- **Workstream B**: regenerated CSV row count + spot-check 20 enriched rows against live IG/FB
- **Workstream C Phase 0**: `npm run build` passes on Cloudflare Pages; Supabase migrations apply cleanly to a fresh project

---

## Risks + Mitigations

| Risk | Mitigation |
|---|---|
| Platform expansion (Workstream A) starves bottleneck work (C) of attention | Hard split: PR #23 stays Claude-driven; Workstream C gets dedicated focus |
| MercadoPago integration drags (Paraguay-specific quirks) | Land Phase 3 outreach + manual invoicing first; payments can lag by 1–2 weeks without blocking pilot |
| IG/FB scraping breaks ToS / gets rate-limited | Use official Graph API where possible; fall back to manual enrichment for top 100; document policy in `CUSTOMER_INTERVIEWS.md` companion doc |
| Lead data ages out during 8-week build | Add a `last_verified_at` column now; run a refresh pass on Priority A in Phase 1 |
| Customer interviews surface a thesis-breaking objection | Treat as a gate before Phase 4 — adjust pricing or product before payment infra |
