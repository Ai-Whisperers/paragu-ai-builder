# Demo content — Nexa Paraguay

**Status:** DEMO MODE. `is_demo: true` and `demoMode.aiPlaceholdersAllowed: true`
in `site.json`. Testimonials are ON. AI-generated portraits and AI-written
copy are intentionally shown to prospects.

## Why demo mode

This site is a pre-handoff prototype shown to prospective Nexa Paraguay
clients to illustrate what their site *will* look like. Real team photos,
real testimonial portraits, real client quotes, and final legal copy
haven't been gathered yet — the placeholders are load-bearing for the
"what you get" conversation.

## What's acceptable in demo mode

- AI-generated team portraits on `/sobre`.
- AI-generated testimonial portraits + AI-written testimonial quotes.
- AI-generated office / Paraguay imagery.
- AI-written blog posts, service copy, FAQ answers, landing copy.
- Placeholder Calendly URLs, placeholder WhatsApp numbers.

None of the above is blocked by validator gates while the tenant is in
demo mode.

## What stops being acceptable at launch

When the client signs off and we're about to run paid traffic:

1. Collect **GDPR-compliant signed consent forms** from everyone whose
   photo or testimonial will appear publicly (name, role, city,
   photograph, duration, revocation rights).
2. Replace each AI portrait at the same file path so content references
   keep working:
   - `sites/nexa-paraguay/images/team/*.png`
   - `sites/nexa-paraguay/images/testimonials/testimonial-client-*.png`
3. Replace AI testimonial quotes in `sites/nexa-paraguay/testimonials.json`
   with real ones the consenters approved.
4. Review AI-written copy across `content/*.json` and `blog/*.mdx` with
   the client's legal/compliance lead.
5. Set `isLiveProduction: true` and remove / flip `is_demo: false` and
   `demoMode.aiPlaceholdersAllowed: false` in `site.json`.
6. Run `cd web && npm run validate:tenant-images -- nexa-paraguay`.
   The validator's placeholder-SHA-256 gate will fire if any AI portrait
   is still present — that's the built-in safety net for the
   real-content swap. It must exit zero.

## Why this shape (demo flag vs. removing the gate)

The gate isn't removed — it's just opt-in. `is_demo: true` tells the
validator "shut up, we know." When the flag flips for launch, the gate
re-activates automatically. Future tenants inherit the same shape:
demo → live is a one-field change.

## Cross-refs

- `web/scripts/validate-tenant-images.ts` — the gate implementation.
- `docs/PLACEHOLDER_HASHES.json` — SHA-256 of the current AI placeholders.
- `docs/IMAGE_GENERATION_PROMPTS.md` §Ethics — original rationale for
  treating AI faces as placeholders only in production.
- `docs/TESTIMONIALS_GATING.md` — superseded by this doc.
