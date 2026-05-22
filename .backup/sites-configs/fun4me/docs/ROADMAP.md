# Fun4Me — Complete Implementation Roadmap

**Owner:** equipo ParaguAI
**Client:** Fun4Me (Asunción)
**Status:** Tenant migrated 2026-04-21. Full rollout plan executing.
**Target launch (full stack):** 2026-07-31 (90 days from migration)

---

## Phase 0 — Already shipped (2026-04-21)

| Item | State | Files |
|---|---|---|
| Tenant scaffolding | ✅ | `sites/fun4me/site.json`, `tokens.json` |
| Home page layout | ✅ | `sites/fun4me/pages/home.json` |
| Base content (hero, features, categories, testimonials, FAQ) | ✅ | `sites/fun4me/content/es.json` |
| `sex_shop` business type | ✅ | `src/registry/sex_shop.type.json` |
| Owner onboarding questionnaire | ✅ | `sites/fun4me/docs/onboarding-questionnaire.md` |
| Path routing `paragu-ai.com/fun4me` | ✅ | site.json path field |

---

## Phase 1 — Revenue foundation (Month 1: 2026-04-21 → 2026-05-21)

### 1.1 Pagopar checkout integration
- **State:** Platform-level Pagopar support exists in `web/lib/payments/pagopar/`. Fun4Me's site.json needs `integrations.payment` block.
- **In-repo:** site.json config, bundle/product definitions, currency
- **External:** Pagopar merchant account credentials — see `docs/runbooks/pagopar-setup.md`
- **Files:** `sites/fun4me/content/checkout.json`, `docs/runbooks/pagopar-setup.md`

### 1.2 Stock / availability flags
- **State:** Platform has `web/lib/commerce/inventory.ts` with stock tracking
- **In-repo:** product-level `stock` field schema in products catalog
- **Files:** `sites/fun4me/content/store/products-schema.md`

### 1.3 Wishlist + anonymous cart persistence
- **State:** Platform has `web/lib/commerce/cart.ts`; wishlist needs new table
- **In-repo:** feature flag in site.json (`features.wishlist`), account page template
- **External:** Supabase table `wishlists` — DDL provided in `docs/runbooks/wishlist-schema.md`

### 1.4 Gift flow + gift cards
- **In-repo:** `sites/fun4me/content/gift-cards.json`, `pages/gift-cards.json`, gift toggle copy in checkout.json
- **External:** None — gift cards stored as products with special SKU prefix `GC-`

### 1.5 SEO blog (10 foundational posts)
- **In-repo:** 10 drafts in `sites/fun4me/content/blog/*.md`, `pages/blog.json`, blog index section
- **External:** none at publish; future posts are ongoing content effort

### 1.6 Placeholder resolution (blocking launch)
- Google Maps Place ID for Herrera 875 — `docs/runbooks/google-maps-place-id.md`
- Partner logos (Satisfyer, LELO, We-Vibe) — collect from brand press kits
- Team section decision — `docs/onboarding-questionnaire.md` Parte B.4

---

## Phase 2 — Trust & conversion (Month 2: 2026-05-22 → 2026-06-21)

### 2.1 Age verification (hardened)
- **State:** Current is self-declare modal only
- **In-repo:** DOB-gate variant in age-gate modal; high-value-order ID upload flag
- **External:** Yoti or Veriff integration (deferred to Phase 3)

### 2.2 Discreet account names
- **In-repo:** `content/account.json` schema (`displayName` vs `legalName` split)
- **External:** Platform-level schema update to `profiles` table

### 2.3 Product reviews (pseudonym)
- **In-repo:** review content schema, `pages/reviews.json` template, moderation policy
- **External:** Supabase `product_reviews` table + RLS — DDL in runbook

### 2.4 Size/fit guides for lingerie
- **In-repo:** `content/size-guides.json` with brand-specific data
- **External:** none

### 2.5 Beginner bundle ("Para la primera vez")
- **In-repo:** `content/bundles.json` (beginner, couples, advanced variants)
- **External:** none — bundle SKUs added to product catalog

---

## Phase 3 — Growth & retention (Month 3: 2026-06-22 → 2026-07-22)

### 3.1 Subscription boxes ("Caja Sorpresa")
- **In-repo:** `content/subscriptions.json` defining 3 tiers (Discovery, Premium, VIP)
- **External:** Stripe Subscriptions or custom billing job — see `docs/runbooks/subscriptions.md`

### 3.2 Referral program
- **In-repo:** `content/referral.json` config, invite page template
- **External:** Platform-level referral tracking — extending `web/lib/commerce/discounts.ts`

### 3.3 Loyalty tiers (Plata / Oro / Platino)
- **In-repo:** `content/loyalty.json` with tier thresholds + benefits
- **External:** Points ledger in Supabase

### 3.4 WhatsApp Business API (upgrade from click-to-chat)
- **In-repo:** config block in site.json (template IDs, message specs)
- **External:** Facebook Business verification + WA Business API provider (360dialog, Twilio) — `docs/runbooks/whatsapp-business-api.md`

### 3.5 Live in-browser chat (discreet)
- **In-repo:** section placeholder
- **External:** Crisp / Intercom / self-hosted — runbook deferred

---

## Phase 4 — Physical integration & compliance (Month 3-4)

### 4.1 Reserva en tienda
- **In-repo:** `pages/reserva-en-tienda.json`, flow copy
- **External:** none — reuses existing checkout with `shipping: pickup`

### 4.2 Workshops / events calendar
- **In-repo:** `content/events.json`, `pages/events.json`
- **External:** CMS-able events seeded in Supabase

### 4.3 RUC / Timbrado e-invoice
- **In-repo:** placeholder invoice template
- **External:** SET integration — `docs/runbooks/timbrado-ruc.md`

### 4.4 Discreet billing name config
- **In-repo:** customer-side toggle in checkout
- **External:** legal review of "razón social alternativa" practice

### 4.5 Legal doc pack (terms, privacy, returns, age compliance)
- **In-repo:** `legal/*.md` pack (4 docs)
- **External:** optional legal review

---

## Phase 5 — Deferred / evaluate later

Not blocking launch; evaluate after 90 days of operation.

- Multi-branch store locator (only relevant if they expand)
- Telemedicine / professional consultations — scope-creep risk
- Mobile app — PWA is enough
- Crypto payment — no demand signal
- AR try-on — tech immature
- Multi-language — PY market doesn't need it

---

## Dependency map

```
Phase 1.1 Pagopar ──► Phase 2.5 bundles (needs checkout)
                ──► Phase 3.1 subscriptions (needs recurring billing)
Phase 1.3 wishlist ──► Phase 2.2 account names (same schema)
Phase 2.3 reviews ──► Phase 3.3 loyalty (reviews earn points)
Phase 3.4 WA API ──► Phase 4.1 reserva (status notifications)
Phase 1.5 blog ──► Phase 3.2 referral (content drives referrals)
```

---

## Pricing tier implications

Based on roadmap scope, Fun4Me's monthly platform fee should be set at the top tier once Phase 3 lands:

- Phase 0 only (today): Gs. 250-350k/mo
- Phase 1 complete: Gs. 500-700k/mo
- Phase 2-3 complete: Gs. 1.2-1.8M/mo

Adult retail margins (50-70% on toys) justify this. Document pricing in client proposal separately.

---

## Execution status

See `docs/ROADMAP-PROGRESS.md` for per-phase completion tracking.
