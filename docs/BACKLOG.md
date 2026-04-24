# Repository Backlog — consolidated (2026-04-24)

Living backlog of everything surfaced by the 2026-04-24 deep audit:
incomplete features, outdated / missing docs, hardcoded values, refactor
candidates, and the documentation information-architecture plan.

**How to use this doc:**

- Work batches **top-down**. Earlier batches are safer, cheaper, and unblock
  later ones.
- Each batch is self-contained and mergeable as a single PR (or a small
  series of PRs) without depending on later batches.
- Effort is wall-clock hours for one engineer, not story points.
- When an item lands, mark it `[x]`. When a batch fully lands, add a
  date header and move it to `docs/archive/` per the consolidation
  convention.
- **Do not re-prioritize inside a batch** without reading its preamble —
  ordering inside each batch is load-bearing (e.g. "write replacement
  before deleting").

**Source material**

- Deep analysis → see conversation transcript 2026-04-24.
- Memory entries: `admin-client-ssr-footgun`, `saas-billing-current`,
  `payments-architecture`, `tenant-url-pattern`.
- ADRs in `docs/decisions/0001–0006`.

**Guiding principles**

- Rewrite before delete. Never drop a doc/file without a verified replacement.
- Centralize duplications, don't refactor generated code.
- Auto-generate drift-prone docs (sections, routes, env, schema).
- Every silent TODO is a production bug until proven otherwise.

---

## Table of batches

| # | Name | Effort | Blocking? |
|---|---|---|---|
| A | Safe deletions & doc moves | ≈1 h | No |
| B | Centralize hardcoded values | ≈4 h | No |
| C | Rewrite stale docs (MP → Pagopar, etc.) | ≈3 h | Unblocks D |
| D | Regenerate truth-dependent docs + drift guards | ≈4 h | Unblocks H |
| E | Close silent production gaps | ≈6 h | Standalone |
| F | Semantic tokens + color mass-replace | ≈6 h | Standalone |
| G | Response + admin-auth wrappers | ≈4 h | Unblocks later admin work |
| H | Write missing subsystem docs | ≈12 h | Depends on D |
| I | Documentation information architecture | ≈4 h | Guides H |
| J | Finish incomplete features | ≈20 h | Depends on D for dLocal removal |
| K | Split god files | ≈10 h | Standalone |
| L | Consolidation polish | ≈6 h | Low priority |
| M | Decision records (ADRs) | ≈3 h | Standalone |
| N | Tutorials & onboarding sweep | ≈4 h | Depends on H |
| O | Tooling & CI drift prevention | ≈4 h | Pairs with D |

**Total:** ≈95 h. Batches A→D (≈12 h) are the one-week high-leverage
block that kills 80 % of the pain for new contributors.

---

## BATCH A — Safe deletions & doc moves

No behavior change. No risk. Do first.

- [ ] A1. Delete `api/bancard.js` (30-line Express stub, hardcoded
      `superspuma.paraguai.com`, undefined `BANCARD_KEY` env). **Replaced
      by:** `web/lib/payments/bancard/{adapter,client,transactions,webhooks,refund}.ts`
      + `web/app/api/webhooks/bancard/route.ts`.
- [ ] A2. Delete now-empty `api/` directory at repo root.
- [ ] A3. `git mv` 8 tenant-specific docs to `sites/granja-cabral/docs/`:
      - `docs/GRANJA_CABRAL_B2B_PAGE.md`
      - `docs/GRANJA_CABRAL_COMPLETE_ANALYSIS.md`
      - `docs/GRANJA_CABRAL_IMPLEMENTATION_STATUS.md`
      - `docs/GRANJA_CABRAL_PACKAGE_SUMMARY.md`
      - `docs/GRANJA_CABRAL_PHOTOGRAPHY_SHOT_LIST.md`
      - `docs/GRANJA_CABRAL_QUICK_CHECKLIST.md`
      - `docs/GRANJA_CABRAL_RECIPES.md`
      - `docs/GRANJA_CABRAL_UPGRADE_PLAN.md`
- [ ] A4. `git mv` 4 completion reports to `docs/archive/2026-04/`:
      - `ALL_BATCHES_COMPLETE.md`, `BATCH_1_COMPLETE.md`,
        `IMPLEMENTATION_COMPLETE_SUMMARY.md`, `100_EASY_WINS.md`.
- [ ] A5. Fix broken link `docs/TENANTS.md` → `docs/reference/TENANTS.md`
      in `CLAUDE.md:41`, `CLAUDE.md:256`, `AGENTS.md:364`.
- [ ] A6. Add `**Status:** executed 2026-04-XX` header to
      `docs/DOCS_CONSOLIDATION_PLAN.md` so it stops reading forward-looking.
- [ ] A7. `CLAUDE.md` corrections:
      - `[business]` route — clarify it's a **redirect surface** to
        `/s/<locale>/<slug>`, not the canonical render.
      - "Currently Supported (12 types)" → "34 live / 1,908 planned; see
        `docs/REGISTRY_LIVE_VS_PLANNED.md`".
      - "21 reusable section types" → "see
        `docs/reference/SECTIONS.md` (source of truth)".
      - Add Cloudflare Workers / OpenNext to the technology stack.

---

## BATCH B — Centralize hardcoded values (high leverage)

Replace duplicated literals with one helper each. All mechanical.

- [ ] B1. **`getAppUrl()` + `APP_URL` constant** in `web/lib/env.ts`.
      Replace **19** inline occurrences of
      `process.env.NEXT_PUBLIC_APP_URL ?? 'https://paragu-ai.com'`
      (with varying fallbacks: `''`, `'http://localhost:3000'`,
      `'https://paragu-ai.com'`). Files:
      - `web/lib/commerce/back-in-stock.ts`
      - `web/app/[business]/page.tsx` + `[business]/[page]/page.tsx`
      - `web/app/api/storefront/[site]/checkout/route.ts`
      - `web/app/api/admin/billing/[businessId]/generate-link/route.ts`
      - `web/app/api/admin/commerce/[businessId]/orders/bulk-confirm-paid/route.ts`
      - `web/app/api/admin/commerce/[businessId]/orders/[id]/transition/route.ts`
      - `web/app/api/admin/leads/test-notification/route.ts`
      - `web/app/api/cron/commerce-abandoned-cart/route.ts`
      - `web/app/api/cron/commerce-review-requests-v2/route.ts`
      - `web/app/api/cron/commerce-merchant-digest/route.ts`
      - `web/app/api/cron/commerce-low-stock-alert/route.ts`
      - `web/app/api/leads/route.ts`
      - `web/app/s/[locale]/[site]/robots.txt/route.ts`
      - `web/app/s/[locale]/[site]/sitemap.xml/route.ts`
      - `web/app/s/[locale]/[site]/_shared/render-static-tenant-page.tsx`
      - `web/app/s/[locale]/[site]/[[...page]]/page.tsx`
      - `web/app/s/[locale]/[site]/prensa/page.tsx`
      - `web/app/demo/[rubro]/page.tsx`

- [ ] B2. **`buildWhatsappUrl()`** canonical helper at
      `web/lib/integrations/whatsapp.ts`. Signature:
      `(phone: string, message?: string) => string`. Normalize phone
      (strip non-digits), handle missing message. Replace **22** inline
      `https://wa.me/${phone}?text=${encodeURIComponent(msg)}` strings
      across sections, app pages, and email templates. Delete/re-export
      `waLink` from `web/lib/landing/marketing-data.ts` and point
      `web/lib/commerce/whatsapp-cart-link.ts` at the new helper.

- [ ] B3. **WhatsApp tokens** — add `--whatsapp` (`#25D366`) and
      `--whatsapp-hover` (`#128C7E`) to `src/tokens/base.tokens.json`.
      Replace **20+** literal occurrences in 14 files, including:
      - `web/components/sections/smart-whatsapp-section.tsx` (×2)
      - `web/components/sections/whatsapp-float.tsx`
      - `web/components/sections/contact-strip-section.tsx`
      - `web/components/sections/contact-section.tsx`
      - `web/components/sections/footer-section.tsx`
      - `web/components/sections/booking-embed-section.tsx`
      - `web/components/sections/referral-section.tsx`
      - `web/components/landing/chrome.tsx`
      - `web/components/ui/social-share.tsx`
      - `web/components/universal/whatsapp-button.tsx`
      - `web/components/commerce/cart-drawer.tsx`
      - `web/components/commerce/product-share.tsx`
      - `web/components/commerce/cart-page-client.tsx`
      - `web/lib/commerce/email-templates.ts`

- [ ] B4. **`<WhatsappButton>` primitive** in
      `web/components/ui/whatsapp-button.tsx` with variants (`float`,
      `inline`, `icon-only`). Replace 10+ hand-rolled `<a>` elements in
      sections listed in B3.

- [ ] B5. **Dedupe Bancard base URLs**.
      `web/lib/payments/bancard/client.ts:27-28` and
      `web/lib/payments/bancard/transactions.ts:189-190` both declare the
      same production/staging URLs. Keep in `client.ts`, import into
      `transactions.ts`.

- [ ] B6. **Purge Ivan's personal phone from 8 demo tenants** in
      `web/lib/engine/demo-data.ts:28,66,720` and anywhere else
      `+595981324569` appears outside `web/lib/billing/paragu-ai-bank.ts`.
      Replace with tenant-specific numbers or a clearly-fake
      `+595971000000` per demo.

- [ ] B7. **Make Supabase timeouts env-configurable**. Move the hardcoded
      `REQUEST_CONFIG = { timeout: 10000, maxRetries: 3, retryDelay: 1000 }`
      in `web/lib/supabase/server.ts:32-34` to env-backed defaults.

---

## BATCH C — Rewrite stale docs, then delete originals

MP-era docs are outright misleading. Rewrite first, then drop.

- [ ] C1. Create `docs/runbooks/COMMERCE_GO_LIVE.md` — Pagopar-first,
      covers: credential provisioning, env-var placement, webhook URL
      registration at Pagopar, test-webhook probe, Resend key, VPS env
      redeploy. Bancard as secondary. Manual-transfer flow as fallback.
- [ ] C2. Delete `docs/commerce-go-live.md`.
- [ ] C3. Edit `docs/payments-latam-plan.md` — remove the "already
      shipped" block that names `web/lib/payments/mercado-pago/`. Keep
      the LATAM country matrix. Add a pointer to the new
      `docs/reference/PAYMENTS.md` (created in Batch H).
- [ ] C4. Rename DB columns `mercadopago_payment_id` /
      `mercadopago_payer_id` / `mercadopago_order_id` on `subscriptions`
      table to `provider_payment_id` / `provider_payer_id` /
      `provider_order_id`. Ship migration + code update
      (`web/lib/billing/paragu-ai-saas.ts:125-126`,
      `web/app/admin/billing/[businessId]/subscription/page.tsx:28`)
      in the same PR.
- [ ] C5. Full-repo grep for `mercado[Pp]ago|mercado-pago` after C1–C4.
      Remove stragglers or annotate any intentional historical references.

---

## BATCH D — Regenerate truth-dependent docs + drift guards

Docs that chronically drift. Rebuild from code and gate with CI.

- [ ] D1. Regenerate `docs/reference/SECTIONS.md` from
      `web/components/sections/*.tsx` cross-referenced with
      `web/lib/engine/section-registry.ts`.
      Current state: doc claims 83 sections; actual files 107;
      registered ~61. Remove the 30+ ghost entries
      (`booking-form`, `booking-wizard`, `compare-plans-matrix`,
      `date-time-picker`, `huevo-del-dia`, `nutritional-info`,
      `preorder`, `special-order`, `service-selector`,
      `staff-selector`, `full-menu`, `featured-menu`, `pricing`,
      `recipes`, etc.). Add the 21+ missing ones
      (`age-gate`, all `calc-*` IRP/IRE/IVA/IPS, `commerce-catalog`,
      `contact-strip`, `enhanced-faq`, `featured-products`,
      `intake-wizard`, `mattress-quiz`, `our-story`, `pricing-table`,
      `promo-banner`, `resources-list`, `tax-deadline-banner`,
      `tax-savings-calculator`, `trust-badges`).

- [ ] D2. Regenerate `docs/reference/API.md` from
      `web/app/api/**/route.ts`. Current: 21 documented, 83 actual.
      Missing surfaces: all `/admin/commerce/*` (22 routes),
      `/admin/billing/*`, `/admin/content/*`, `/admin/tenants/*/notes`,
      every `/cron/*`, most `/storefront/*`, `/api/activity`,
      `/api/analytics/track`, `/api/diagnostics`, `/api/health`.

- [ ] D3. Write generator scripts:
      - `scripts/generate-sections-reference.ts`
      - `scripts/generate-api-reference.ts`
      Both CI-gated: run in `npm run validate:all`; fail build on diff.

- [ ] D4. Audit `docs/reference/ENV_VARS.md` against every
      `process.env.*` read in `web/lib/env.ts` + `web/lib/**/*.ts`.
      Close drift. Also reconcile with `docs/runbooks/ENV_VARS.md` —
      currently two env-var docs of unclear separation.

- [ ] D5. Update `README.md` counts once D1–D2 land.

---

## BATCH E — Close silent production gaps

Silent prod bugs. Users get nothing without errors.

- [ ] E1. `web/app/api/data-request/route.ts:45` — send compliance
      officer email via Resend on every GDPR data-request. Remove
      the TODO.
- [ ] E2. `web/app/api/booking/create/route.ts:80` — send WhatsApp +
      email confirmation on booking create. Pick existing adapter in
      `web/lib/integrations/` or add one.
- [ ] E3. `web/app/api/mailchimp-journey-import/route.ts:57` — call
      Mailchimp Customer Journeys API when env configured; return 503
      `adapter_not_configured` when `MC_LIST_ID` / `MC_API_KEY` unset.
      Stop the silent no-op.
- [ ] E4. Implement `resend.sendTransactional` — the leads-digest cron
      at `web/app/api/cron/leads-digest/route.ts:178` logs
      `adapter_missing_send` every night. Either implement or replace
      with direct Resend SDK call.
- [ ] E5. `web/lib/commerce/notifications.ts:49` — throw
      `UnknownTemplateError` on unknown template instead of
      `logger.warn` + silent drop. Enumerate valid templates in a
      TS union.
- [ ] E6. Verify `/s/[locale]/[site]/checkout/transfer/` page exists
      (the manual adapter redirects there). Build it if missing —
      shows bank alias + WhatsApp deep link for comprobante upload.
- [ ] E7. `web/lib/engine/demo-data.ts:463-464` — replace
      `+595XXXXXXXXX` Laura egg-farm placeholders with real number
      or gate the demo behind `DEMO_INCLUDE_LAURA` flag so
      placeholders can't ship.

---

## BATCH F — Semantic tokens + color mass-replace

Violates explicit CLAUDE.md rule: "Use `var(--primary)`, NEVER
`bg-blue-500`". 95 Tailwind-palette occurrences across 27 section files.

- [ ] F1. Add semantic status tokens to `src/tokens/base.tokens.json`:
      `--status-success`, `--status-warning`, `--status-error`,
      `--status-info`, `--status-low`, `--status-medium`,
      `--status-high`, `--status-success-bg`, `--status-warning-bg`, etc.
- [ ] F2. Mass-replace in batches, one PR per section-group:
      - F2a. Calculators: `calc-iva`, `calc-ips`, `calc-ire`, `calc-irp`,
        `calc-aguinaldo`, `calc-finiquito`, `calc-costo-empleado`,
        `bulk-calculator`, `savings-calculator`, `delivery-calculator`,
        `tax-savings-calculator`.
      - F2b. Status/schedulers: `tax-deadline-banner`, `weekly-schedule`,
        `stock-indicator`, `open-hours-status`, `class-schedule`.
      - F2c. Commerce: `b2b-wholesale`, `price-list`, `pricing-range`,
        `packages`.
      - F2d. Misc: `recipe`, `programs-comparison`, `tiered-service-ladder`.
- [ ] F3. Lint rule `scripts/ci/check-hardcoded-colors.ts` — greps for
      `bg-(red|blue|green|yellow|indigo|purple|pink|orange|amber|cyan|teal|lime|emerald|rose|sky|violet)-\d+`
      and `#[0-9a-fA-F]{3,6}` in `web/components/sections/**`. Fails CI
      on match unless file has `// allow-hardcoded-color: reason` pragma.

---

## BATCH G — Response + admin-auth wrappers

Standardize the 83-route API surface.

- [ ] G1. Build `web/lib/api/response.ts`:
      - `apiError(code: string, status: number, detail?: unknown)`
      - `apiSuccess<T>(data: T, status?: number)`
      - Consistent error envelope `{ error: string, detail?: unknown }`.
- [ ] G2. Build `web/lib/auth/with-admin.ts` → `withAdminAuth(handler)`
      wrapper (mirrors existing `withRequestLog`). Replaces ~40 copies
      of inline `checkAdmin()` boilerplate.
- [ ] G3. Migrate admin routes progressively — one PR per surface:
      - G3a. `/api/admin/commerce/*` (22 routes)
      - G3b. `/api/admin/billing/*`, `/api/admin/content/*`,
        `/api/admin/tenants/*`
      - G3c. `/api/admin/leads/*`, `/api/admin/daily-metrics`
- [ ] G4. Add meta-test `tests/integration/api-error-envelope.test.ts`
      — every route returning 4xx/5xx returns the standard envelope
      shape.

---

## BATCH H — Write missing subsystem docs

No canonical doc for these subsystems. One file each, ≤1 page target.
Depends on D so counts/examples are accurate.

- [ ] H1. `docs/reference/COMMERCE.md` — order state machine (from
      `web/lib/commerce/state-machine.ts`, with a diagram), commission
      split math, credential crypto, CSV import format, seed-catalog
      semantics, admin flows.
- [ ] H2. `docs/reference/PAYMENTS.md` — `PaymentProviderAdapter`
      interface, registry, router, failover ladder, "gateway error"
      definition, refund path, per-country provider-selection rules.
- [ ] H3. `docs/runbooks/SAAS_BILLING.md` — captures the memory
      `saas-billing-current`: manual bank transfer to
      `weissvanderpol.ivan@gmail.com`, comprobante via WhatsApp
      `+595981324569`, admin confirmation flow.
- [ ] H4. `docs/how-to/outreach-pipeline.md` — HubSpot sync,
      Mailchimp Customer Journeys import, WhatsApp webhook flow,
      cron cadence (cross-link to `CRON_STRATEGY.md`).
- [ ] H5. `docs/reference/LEADS.md` — lead schema, `import:leads` vs
      `import:leads:extended` CSV formats, status transitions,
      `/api/admin/leads/*` surface.
- [ ] H6. `docs/reference/DATABASE.md` — auto-generated schema
      reference. Start with 10 most-queried tables: `businesses`,
      `leads`, `orders`, `products`, `transactions`, `subscriptions`,
      `webhook_events`, `payment_credentials`, `outbox`, `reminders`.
      Include RLS policy summary.
- [ ] H7. `docs/explanation/tenant-routing.md` — the
      `/s/[locale]/[site]/…` contract, the redirect path from
      `/[business]/…`, memory rule
      `paragu-ai.com/s/es/<slug>` ≠ `site.json.baseUrl`.
- [ ] H8. `docs/reference/GENERATED_DATA.md` — 1-page README next to
      `web/lib/engine/generated/tenant-data.ts` (46k LOC) explaining
      the prebuild step, inputs, `npm run generate:tenant-data`, why
      it's large.
- [ ] H9. `docs/explanation/commerce-state-machine.md` — state diagram,
      transition rules, reconcile behaviour.
- [ ] H10. `docs/how-to/add-payment-provider.md` — runnable guide for
      adding a new `PaymentProviderAdapter` (would apply directly to
      dLocal Phase 2).
- [ ] H11. `docs/how-to/write-a-section.md` — conventions for a new
      section component (file layout, kebab-case id, theme-var rule,
      server vs client, variants, registry entry).

---

## BATCH I — Documentation information architecture

Defines the folder/file layout that Batches C, H, M, N fill in.
Ship this **before or alongside** H so contributors see the shape.

- [ ] I1. Add `docs/reference/README.md` (index) listing every
      reference file + 1-line description. Make `docs/reference/`
      self-describing.
- [ ] I2. Add `docs/runbooks/README.md` (already exists — verify it
      lists all runbooks including the ones added by Batches C, H).
- [ ] I3. Add `docs/how-to/README.md` (index) listing all how-tos.
- [ ] I4. Add `docs/explanation/README.md` (already exists — verify
      index is current after H adds files).
- [ ] I5. Rename `docs/DOCS_CONSOLIDATION_PLAN.md` → move to
      `docs/archive/2026-04/` after A6 stamps it as executed.
- [ ] I6. Decide per-file for the ~30 legacy files still in `docs/`
      root (`EPIC_PLAN.md`, `REFACTORING_PLAN.md`,
      `TENANT_ENHANCEMENT_BATCHES.md`, `STRATEGY_NEXT_STEPS.md`,
      6× `PRICING_*`, 2× `LEADS_REPO_*`, `PREMIUM_QUALITY_GUIDE.md`,
      `UNIVERSAL_COMPONENTS.md`, `VETE_PATTERNS_ANALYSIS.md`,
      `CUSTOMER_PLAYBOOK.md`, `SALES_PLAYBOOK.md`,
      `REAL_CLIENTS_ROADMAP.md`, `AI_*`, `DEMO_*`, etc). Default
      action per file:
      - Pricing / sales / outreach → `docs/explanation/business/` (new).
      - Completed plans / status reports → `docs/archive/2026-04/`.
      - Active reference → keep at root of relevant Diataxis folder.
- [ ] I7. Create `docs/explanation/business/` folder for the
      non-engineering docs that currently pollute `docs/` root.
- [ ] I8. Delete numbered `01_BUSINESS_MODEL/` / `*_*.md` sequence
      files that are superseded by the moved versions (once I6 lands).
- [ ] I9. Canonical doc tree target state (source of truth):

      ```
      /                          root — stable canonical set only
        README.md
        ARCHITECTURE.md
        CONTRIBUTING.md
        CLAUDE.md
        AGENTS.md
        CHANGELOG.md
        SECURITY.md
        CODE_OF_CONDUCT.md

      docs/
        README.md                        hub index
        BACKLOG.md                       this file

        reference/                       living catalogs
          README.md
          SECTIONS.md                    auto-gen (D1)
          API.md                         auto-gen (D2)
          ENV_VARS.md                    auto-audit (D4)
          BUSINESS_TYPES.md
          TENANTS.md
          TOKENS.md
          COMMERCE.md                    new (H1)
          PAYMENTS.md                    new (H2)
          LEADS.md                       new (H5)
          DATABASE.md                    new (H6)
          GENERATED_DATA.md              new (H8)
          cli-commands.md
          animations.md
          image-prompts.md
          clients-tenants.md
          testing-patterns.md

        runbooks/                        ops procedures
          README.md
          ADD_NEW_TENANT.md
          ADD_NEW_VERTICAL.md
          COMMERCE_GO_LIVE.md            new (C1)
          CRON_STRATEGY.md
          ENV_VARS.md                    (ops-side, vs reference/)
          INCIDENT_RESPONSE.md           new (optional)
          ROLLBACK.md
          ROTATE_CREDENTIALS.md          new
          SAAS_BILLING.md                new (H3)
          SUPERSPUMA_LAUNCH.md

        how-to/                          task-oriented
          README.md
          add-business-type.md
          add-payment-provider.md        new (H10)
          admin-guide.md
          debug.md
          deploy.md
          deployment-checklist.md
          generate-apis.md
          generate-images.md
          outreach-pipeline.md           new (H4)
          set-up-github-projects.md
          testing.md
          troubleshoot.md
          write-a-section.md             new (H11)

        explanation/                     why / concepts
          README.md
          business/                      new (I7)
            pricing.md
            customer-playbook.md
            sales-playbook.md
          commerce-state-machine.md      new (H9)
          composition-pipeline.md
          multi-tenancy.md
          payments-architecture.md       new
          tenant-routing.md              new (H7)
          theming.md

        decisions/                       ADRs
          README.md
          0001-tailwind-3-not-4.md
          0002-hostinger-cron.md
          0003-env-allowlist-admin.md
          0004-payments-pagopar-first.md
          0005-defer-next-image.md
          0006-supabase-client-cache.md
          0007-remove-mercado-pago.md    new (M1)
          0008-cloudflare-open-next.md   new (M2)
          0009-tenant-config-over-code.md new (M3)
          0010-auto-generated-reference.md new (M4)

        observability/
          README.md
          logging.md
          tracing.md
          metrics.md

        onboarding/                      (existing — audit)
          README.md
          00-quick-start.md
          01-master-questionnaire.md
          …

        tutorials/
          README.md                      new (N1)
          first-tenant-site.md
          first-commerce-site.md         new (N2)
          first-payment-end-to-end.md    new (N3)

        audit/                           point-in-time audits
          visual-critique-2026-04-24.md

        archive/
          2026-04/                       (expanding)
      ```

---

## BATCH J — Finish incomplete features

Real product work. Sequenced from cheapest to most expensive.

- [ ] J1. **Remove dLocal from admin UI + schema** until Phase 2.
      - Edit `web/app/admin/commerce/[businessId]/payments/page.tsx:19`
        — remove "o dLocal" from the copy.
      - Remove `'dlocal'` from `PaymentProviderSchema` enum in
        `web/lib/schemas/commerce/transaction.ts:3`.
      - Remove `capabilities.ts` dLocal entry (or gate behind
        `PHASE_2_DLOCAL=true` env).
      - Keep `// dlocal: ship in Phase 2` comment in
        `web/lib/payments/registry.ts:11`.
- [ ] J2. Add missing JSON schemas for live business types under
      `src/schemas/`. 15 files needed:
      `cerrajero`, `egg_farm`, `electricista`, `fotografia_bodas`,
      `inversiones`, `kaiten_zushi`, `panaderia`, `pilates`, `plomero`,
      `restaurant`, `salon_eventos`, `sushi_bar`, `taller_mecanico`,
      `veterinaria`, `yoga`. Copy closest sibling schema.
- [ ] J3. **Audit 45 unregistered section files.** First build the
      actual-use list:
      ```
      grep -oE '"id"\s*:\s*"[a-z-]+"' sites/*/pages/*.json \
        | sed -E 's/.*"([a-z-]+)".*/\1/' | sort -u > /tmp/referenced.txt
      ```
      Then decision tree per file:
      - Referenced in ≥1 tenant: register it in
        `web/lib/engine/section-registry.ts`, document in
        `docs/reference/SECTIONS.md` (via D1 generator).
      - Not referenced anywhere, no clear intent: **delete**.
      - Not referenced, but named like a planned feature: keep,
        add `// intentionally-unregistered: <reason>` comment.
      Suspect files: `b2b-wholesale-section.tsx`,
      `maturity-assessment-section.tsx`,
      `calc-resimple-qualifier-section.tsx`, `success-stories.tsx`,
      `conveyor-belt-strip.tsx`, `referral-section.tsx`,
      `testimonial-video-section.tsx`.
- [ ] J4. Action P0 findings from
      `docs/audit/visual-critique-2026-04-24.md`:
      - J4a. Fix empty section wrappers eating 400–1000 px on
        ss-home, ss-combos, ss-envios, ss-garantia, ss-nosotros,
        ss-cambio, d-servicios, d-portafolio, d-privacidad.
      - J4b. Fix Dayah cookie-consent: docked-left floating panel →
        bottom banner.
      - J4c. Fix ss-home `ProductCatalogSection` rendering 6 grey
        skeletons instead of 23 products in `content/es.json`.
- [ ] J5. Placeholder-asset inventory per tenant. Script that hits the
      existing `/admin/tenants/[slug]/assets` logic for each active
      tenant and dumps a report at
      `docs/audit/placeholder-inventory-YYYY-MM-DD.md`. Prioritize
      swaps by tenant importance.
- [ ] J6. **dLocal Phase 2 implementation** (when a non-PY tenant is
      actually signed). Follow `docs/how-to/add-payment-provider.md`
      (written in H10). Mark as blocked until there's a customer.

---

## BATCH K — Split god files

Per CLAUDE.md code-quality rule (500 LOC max).

- [ ] K1. `web/app/page.tsx` (1023 LOC) → extract:
      - `web/components/landing/organization-schema.tsx` (JSON-LD)
      - `web/components/landing/pricing-tiers.tsx`
      - `web/components/landing/faq-block.tsx`
      - Keep `page.tsx` as composition only.
- [ ] K2. `web/app/admin/leads/leads-dashboard-client.tsx` (1440 LOC)
      → 4 subcomponents:
      - `leads-filters.tsx`
      - `leads-bulk-actions.tsx`
      - `lead-notes-panel.tsx`
      - `leads-table.tsx`
- [ ] K3. Split 5 sections > 400 LOC:
      - `b2b-wholesale-section.tsx` (552)
      - `our-story-section.tsx` (542)
      - `reviews-section.tsx` (487)
      - `subscription-section.tsx` (465)
      - `product-catalog-section.tsx` (427)
- [ ] K4. Add CI check (`scripts/ci/check-file-sizes.ts`) enforcing
      500 LOC on non-generated files — exclude `web/lib/engine/generated/**`
      and `web/lib/engine/data/**`.

---

## BATCH L — Consolidation polish

Smaller refactors. Low priority but satisfying.

- [ ] L1. `web/lib/security/hmac.ts` — centralize
      `crypto.createHmac` + `timingSafeEqual` logic currently
      reimplemented in `verifyBancardWebhook`, `verifyPagoparWebhook`,
      and the Resend/Svix verifier.
- [ ] L2. `web/lib/seo/jsonld-builders.ts` — extract 250+ LOC of
      inline JSON-LD templates from `app/page.tsx` + `app/layout.tsx`.
- [ ] L3. Consolidate `content-defaults.ts` + `resolve-copy.ts` +
      `demo-data.ts` — three layers of copy-resolution with overlapping
      work. Document resolution order; pick one canonical layer,
      thin-wrap the others.
- [ ] L4. Move gateway URLs to per-provider `constants.ts` files
      (`pagopar/constants.ts`, `bancard/constants.ts`).
- [ ] L5. `web/lib/integrations/constants.ts` — collect HubSpot,
      Notion, Pipedrive, Mailchimp base URLs into one grep target.
- [ ] L6. Promote `resolveBusinessBySlug` from commerce to shared.
      Move `web/lib/commerce/resolve-business.ts` →
      `web/lib/engine/resolve-business.ts`, migrate storefront /
      admin / tenant routes to use it.

---

## BATCH M — Architecture decision records (ADRs)

Capture decisions that were made but aren't recorded.

- [ ] M1. `docs/decisions/0007-remove-mercado-pago.md` — why MP was
      removed: merchant-of-record complexity, poor PY coverage vs
      Pagopar, facilitator-lite legal model. Reference memory
      `payments-architecture`.
- [ ] M2. `docs/decisions/0008-cloudflare-workers-open-next.md` —
      why Cloudflare Workers + OpenNext over Vercel. Cost, latency,
      tenant-scale.
- [ ] M3. `docs/decisions/0009-tenant-config-over-code.md` — why no
      per-tenant code; tenants are pure configuration. Enforced by
      architecture (see `ARCHITECTURE.md §2`).
- [ ] M4. `docs/decisions/0010-auto-generated-reference-docs.md` —
      why SECTIONS.md / API.md are auto-generated (keeps drift at zero).
- [ ] M5. Review ADR 0001 (Tailwind 3) for freshness (≈year old) —
      add a "last-reviewed" line.

---

## BATCH N — Tutorials & onboarding sweep

End-to-end guided walk-throughs for new contributors.

- [ ] N1. `docs/tutorials/README.md` index.
- [ ] N2. `docs/tutorials/first-commerce-site.md` — from `git clone`
      to a live storefront with one product and Pagopar sandbox
      checkout. Builds on H1, H2, H10.
- [ ] N3. `docs/tutorials/first-payment-end-to-end.md` — walk a real
      Pagopar sandbox transaction through webhook, reconcile, and
      admin confirmation.
- [ ] N4. Audit `docs/onboarding/*` for freshness — memory mentions
      quick-start + questionnaires; verify they still match current
      routes / CLAUDE.md after Batch A7 lands.

---

## BATCH O — Tooling & CI drift prevention

Make drift mechanically impossible.

- [ ] O1. `scripts/ci/check-doc-link-integrity.ts` — parse every
      `[text](path)` in markdown files; fail if target doesn't exist.
      Catches the `docs/TENANTS.md` class of bug at PR time.
- [ ] O2. `scripts/ci/check-env-var-parity.ts` — walks `web/lib/env.ts`
      schema + greps `process.env.*` in code; diffs against
      `docs/reference/ENV_VARS.md`. Warn on drift. (Companion to D4.)
- [ ] O3. `scripts/ci/check-section-registry-coverage.ts` — every
      file matching `web/components/sections/*-section.tsx` must be
      registered in `section-registry.ts` OR have
      `// unregistered-by-design: <reason>` comment. (Companion to J3.)
- [ ] O4. `scripts/ci/check-hardcoded-colors.ts` — ships with F3.
- [ ] O5. Pre-commit hook that forbids CLAUDE.md numerical claims
      ("12 types", "21 sections", "83 routes") without a
      source-of-truth link. Plain regex.
- [ ] O6. Pre-commit hook that forbids `console.log` in `web/lib/**`
      and `web/app/**` — must use `logger` (aligns with CLAUDE.md
      error-handling rule).

---

## Suggested execution schedule

| Week | Batches | Effort | Ships |
|---|---|---|---|
| 1 | A, B, C | ≈8 h | Clean repo + canonical URL/WhatsApp helpers + Pagopar runbook |
| 2 | D, I, O (drift guards) | ≈12 h | Auto-generated reference docs + doc IA + CI gates |
| 3 | E, G | ≈10 h | Silent prod gaps closed + response/auth wrappers |
| 4 | F, M | ≈9 h | Status tokens mass-replaced + ADRs captured |
| 5 | H | ≈12 h | Missing subsystem docs |
| 6 | N, K | ≈14 h | Tutorials + god-file splits |
| 7 | J, L | ≈26 h | Feature completion + consolidation polish |

Total: ≈91 h — ~7 part-time weeks or ~2 full-time weeks.

---

## Exit criteria per batch

A batch is "done" when:

1. Every checkbox is ticked.
2. `npm run validate:all` passes.
3. No new drift detected by Batch O CI scripts.
4. A one-line entry lands in `CHANGELOG.md` under the current date.
5. If the batch retired docs: they're in `docs/archive/`, not deleted.

## Out of scope for this backlog

- New business-domain features (new verticals, new revenue products).
- Client-specific work (Granja Cabral / Laura — lives in `sites/`).
- Infrastructure migrations (VPS → Cloudflare is already done).
- AI / copy-generation tooling (separate workstream).

---

_Owner: repo maintainers. Revised whenever a batch ships._
