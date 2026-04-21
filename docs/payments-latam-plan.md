# LATAM Payments — Complete Implementation Plan

**Scope:** replace single-provider (MP) with a provider-agnostic payment orchestrator that covers Paraguay today and scales across LATAM as Paragu-AI adds tenants in other countries. Based on research into current LATAM payment landscape, PCI DSS scope-reduction best practices, and payment orchestration patterns used by Stripe/Shopify/Shuttle-class platforms.

---

## TL;DR

1. **Pagopar** = primary for Paraguay. Hosted checkout, 14+ local methods including cash collection points. Ship this next.
2. **Mercado Pago** = keep as secondary. Already built. Only useful when a merchant sells cross-border (AR/BR/MX/CL/CO/PE/UY buyers).
3. **dLocal** or **EBANX** = add in Phase 2 when you have merchants outside Paraguay or ones that need multi-currency USD settlement. Not needed for PY-only merchants.
4. **Bancard VPOS 2.0** = Phase 3, only if a single merchant hits high volume and wants direct-to-bank fees under 2%.
5. **Architecture:** every provider must be a hosted-checkout redirect (we never see card numbers → PCI SAQ A, 22 controls). Pluggable `PaymentProviderAdapter` already in place; add a smart router + failover on top.
6. **Legal posture:** "payment facilitator lite" model — each merchant registers their own Pagopar/MP account, funds settle direct to *their* bank. Paragu-AI never holds money → no financial license needed, lowest regulatory burden.

---

## 1. LATAM payment landscape matrix

| Country | Primary provider | Secondary | Unique local methods |
|---|---|---|---|
| **Paraguay (PY)** | **Pagopar** | Bancard VPOS | Tigo Money, Personal, Zimple, Wally + cash at Aquí Pago / Pago Express / Practipago / Wepa |
| Argentina (AR) | **Mercado Pago** | dLocal | Rapipago, Pago Fácil, transferencia inmediata |
| Brazil (BR) | **EBANX** or **dLocal** | Mercado Pago | **PIX** (instant bank transfer — 40%+ of BR ecommerce), Boleto |
| Mexico (MX) | **Conekta** or **dLocal** | Mercado Pago | **OXXO** (cash-at-kiosk, 20%+ of MX ecommerce), SPEI |
| Chile (CL) | Mercado Pago | Kushki | Webpay (Transbank) |
| Colombia (CO) | **Payvalida** or Kushki | dLocal | PSE (bank transfer), Efecty |
| Peru (PE) | Kushki | Mercado Pago | PagoEfectivo |
| Uruguay (UY) | Mercado Pago | dLocal | Redpagos, Abitab |

**Pattern:** every LATAM country has a dominant local method (cash kiosk or instant-bank-transfer) that most cards-only providers miss. Local coverage beats global brand every time.

**Multi-country provider shortlist** (covers 20+ countries in one integration):
- **dLocal** — 20+ countries LATAM/APAC/EMEA, 2.7–7% fees, 1–2 business days settlement, 600+ payment methods
- **EBANX** — LATAM only, 2.7% + $0.30, 3 days settlement, 100+ methods, especially strong in BR
- **Kushki** — EC/CO/PE/CL/MX/BR, private pricing, monthly minimums
- **Rapyd** — global including LATAM, crypto + fiat rails

### Why both Pagopar AND a regional aggregator?

- **Pagopar** is the *best* for PY — deeper coverage of cash kiosks and local wallets, lower friction, local support, Spanish/Guaraní.
- **dLocal/EBANX** become necessary when a merchant expands to BR/MX/AR. You don't need them if the merchant sells PY-only.
- Having both means: when a merchant signs up in the admin, we ask "where do your customers live?" and pick the right provider.

---

## 2. Architecture — payment orchestration

### Current state (already shipped)

```
web/lib/payments/
├── types.ts                      PaymentProviderAdapter interface
├── registry.ts                   getAdapter(providerName) → adapter
├── reconcile.ts                  normalize + drive order state machine
├── mercado-pago/
│   ├── client.ts
│   ├── preferences.ts
│   ├── webhooks.ts
│   └── adapter.ts
└── bancard/adapter.ts            stub (NotImplementedError)
```

The interface is provider-agnostic — adding Pagopar is a matter of writing one new adapter and registering it.

### Target state (after Phase 2)

```
web/lib/payments/
├── types.ts                      + PaymentCapability (currencies, methods, countries)
├── registry.ts                   by-provider lookup
├── router.ts                     NEW — smart provider selection per order
├── failover.ts                   NEW — retry with alternate provider on 5xx
├── reconcile.ts                  unchanged
├── fraud.ts                      NEW — velocity checks, IP geolocation sanity
├── pagopar/                      NEW
│   ├── client.ts
│   ├── transactions.ts           POST /iniciar-transaccion
│   ├── webhooks.ts               SHA1 token verify
│   └── adapter.ts
├── mercado-pago/                 unchanged
├── dlocal/                       Phase 2
│   ├── client.ts
│   ├── payments.ts
│   ├── webhooks.ts
│   └── adapter.ts
└── bancard/                      Phase 3
    └── adapter.ts                XML VPOS 2.0
```

### Router logic (`router.ts`)

```
selectProvider(order) → provider
  1. If business.commerce.provider is explicitly set AND that provider supports order.currency + shipping country → use it
  2. Else look up country-of-shopper → providers-that-cover-that-country ranked by fee × success-rate
  3. Return the top match, OR throw no_provider_for_region
```

Provider selection stored on the order row for reconciliation + failover attribution.

### Failover pattern

On gateway 5xx or timeout during `createCheckoutSession`, retry once with the next best provider in the ranking. Never on 4xx (those are real declines, not infra issues). Record both attempts in `storefront_transactions` so revenue attribution is honest.

### Idempotency

Already implemented for checkout (SHA-256 body hash). Extend to each outbound provider call — use order id + provider name as the idempotency key so a retry of the same order doesn't double-create provider sessions.

---

## 3. PCI DSS compliance posture

### The 329 → 22 control reduction

- **SAQ D** (329 controls) — you handle card PANs server-side. Brutal audit, quarterly scans, annual penetration tests.
- **SAQ A-EP** (191 controls) — your server serves the page that contains a card iframe (Stripe Elements, MP Brick, etc.)
- **SAQ A** (22 controls) — shopper is fully redirected to the provider's hosted checkout. Your server never sees card data.

**Our posture: strict SAQ A.** Every provider we integrate uses hosted checkout. We redirect, we get a webhook, we never touch a PAN. This is the default for Pagopar, MP, dLocal, EBANX, Bancard VPOS. Do not add Stripe Elements or any embedded card iframe — it would escalate our scope 170×.

### Rules we enforce in code (already + to-add)

- [x] No route ever accepts `card_number`, `cvv`, `exp_month`, `exp_year` as input
- [x] Storefront never serves a form with a `type="text" name="cardnumber"` input
- [x] Webhook routes write raw payload → `webhook_events.payload` — but we never persist PAN (providers only send last 4 digits of card)
- [ ] Content Security Policy header disallows scripts from card-collection domains other than our providers
- [ ] Annual self-attestation (SAQ A) — 22 checklist items, takes ~2 hours once/year

### SaaS "service provider" question

Since we route payments *for* merchants (not our own sales), Paragu-AI is technically a PCI DSS "service provider" to them. As long as we stay SAQ A (never touch card data), our service-provider obligations are minimal and we don't need Level 1 certification. If we ever move to a marketplace model where Paragu-AI is the merchant of record, that changes.

---

## 4. Banking & settlement — how money reaches merchants

### Pagopar flow (Paraguay)

1. Merchant registers at pagopar.com (needs RUC + Bancard merchant agreement)
2. Pagopar issues `public_token` + `private_token`
3. Shoppers pay via Pagopar's checkout — funds sit in Pagopar's holding account briefly
4. Pagopar settles to merchant's Bancard account → merchant's bank (BCP / Itaú / Regional / Banco GNB / Continental) **next business day**
5. Fees: ~4–6% for cards, lower for cash kiosk methods. Pagopar publishes current sheet on sign-up.

### MP flow (cross-border)

1. Merchant creates MP account for their country (AR/BR/MX/CL/CO/PE/UY)
2. Funds land in MP wallet immediately
3. Merchant withdraws to local bank (T+1 to T+3)
4. Fees: 4.32–6.60% + VAT depending on country, card type, installments

### dLocal / EBANX flow (multi-country, advanced)

1. Merchant signs master services agreement with the aggregator (legal KYC)
2. All LATAM revenue consolidates in the aggregator's global account
3. Weekly or biweekly payout in USD (or local currency) to merchant's bank via SWIFT / ACH
4. Fees: 2.7–7% depending on country + method

### Paragu-AI's role in settlement

**Option A — "Facilitator Lite" (RECOMMENDED):** merchant owns their Pagopar/MP account. We just route the checkout. Funds flow direct to merchant. We never touch money → no financial license, no KYC, no AML obligations. This is what Shopify does via "Shopify Payments."

**Option B — "Marketplace of Record":** Paragu-AI holds merchant funds and pays them weekly. This is Mercado Libre's model. **Requires:**
- Registration as a payment institution with BCP (Paraguay's central bank)
- AML/KYC program
- Escrow account
- Legal counsel for payment services agreements
- 6–12 months regulatory runway

**Recommendation: stay on Option A until we have 50+ active merchants and a clear business case for marketplace.**

---

## 5. Phase-by-phase implementation plan

### Phase 1 — Pagopar adapter (this week, ~1 week effort)

**Goal:** Paraguayan merchants can accept Bancard cards, Tigo Money, cash at Pago Express/Aquí Pago, and bank transfers in a single hosted checkout redirect.

#### 1.1 DB (1 migration, reversible)

```sql
-- 20260422000000_commerce_pagopar.sql
ALTER TABLE storefront_transactions
  DROP CONSTRAINT storefront_transactions_provider_check,
  ADD CONSTRAINT storefront_transactions_provider_check
    CHECK (provider IN ('mercado_pago', 'bancard', 'pagopar', 'dlocal', 'ebanx', 'manual'));
```

#### 1.2 Code files

```
web/lib/payments/pagopar/
├── client.ts               fetch wrapper + SHA1 signer
├── transactions.ts         iniciar-transaccion call
├── webhooks.ts             verify SHA1 token
└── adapter.ts              implements PaymentProviderAdapter

web/app/api/webhooks/pagopar/route.ts   signature-verified webhook handler
```

Key function (pseudocode for the Pagopar signer):

```typescript
function signRequest(privateKey: string, orderId: string, amount: number): string {
  return crypto.createHash('sha1')
    .update(`${privateKey}${orderId}${amount}`)
    .digest('hex')
}
```

#### 1.3 Env vars

```bash
PAGOPAR_PUBLIC_TOKEN=CHANGE_ME
PAGOPAR_PRIVATE_TOKEN=CHANGE_ME
PAGOPAR_ENVIRONMENT=production   # or 'sandbox'
```

Same flow as before: placeholder on VPS, merchant provides real token, `docker stack deploy`.

#### 1.4 Registry flip

`src/registry/retail_base.type.json` → `commerce.provider: "pagopar"` (PY is the current target market)

#### 1.5 Tests

- Unit: signer function fixture tests
- Unit: adapter transforms Order → Pagopar payload correctly
- Unit: webhook verification against recorded payload
- Integration: checkout → mocked Pagopar response → order awaiting_payment → webhook → order paid

**Acceptance criteria:** sandbox purchase end-to-end using Pagopar's test credentials + test card from their docs.

---

### Phase 2 — Payment orchestration + LATAM expansion (3-4 weeks)

**Goal:** merchant signs up for any LATAM country, we auto-pick the best provider per shopper.

#### 2.1 Router (`web/lib/payments/router.ts`)

Inputs: order (has currency + shipping country) + business config (available providers).
Output: ranked list of provider candidates.

Data: per-provider capability matrix — which countries, which currencies, which methods, fee estimate.

```typescript
interface ProviderCapability {
  name: PaymentProvider
  supportedCountries: string[]   // ISO 3166-1 alpha-2
  supportedCurrencies: string[]  // ISO 4217
  methods: PaymentMethod[]
  feeTier: 'low' | 'medium' | 'high'
}
```

#### 2.2 Failover (`web/lib/payments/failover.ts`)

```typescript
async function createCheckoutWithFailover(order, providers) {
  for (const p of providers) {
    try {
      return await getAdapter(p).createCheckoutSession(order, opts)
    } catch (err) {
      if (isGatewayError(err)) continue // retry next provider
      throw err // 4xx / validation → bubble up
    }
  }
  throw new NoAvailableProviderError(order)
}
```

Log each attempt to `storefront_transactions` with `status='failed'` and `error_code='provider_unavailable'` — audit trail survives.

#### 2.3 Adapters

Add one or both:

- **dLocal** — best coverage, Unified Payments API
- **EBANX** — better for BR-heavy merchants (PIX is first-class)

Each adapter: ~200 LOC, identical shape to Pagopar/MP.

#### 2.4 Admin UX

- `/admin/commerce/[businessId]/payments` — merchant configures which providers they have credentials for, order of preference
- Country + currency hints surface which methods shoppers will actually see

#### 2.5 Checkout UX

- Show provider logo + accepted method icons per country ("Tu pagas con Bancard, Tigo Money, o en efectivo")
- Progressive disclosure — default to country-native method, show more on click

---

### Phase 3 — Scale operations (ongoing)

- **Bancard VPOS direct** — when a single merchant does > Gs 500M/mo in cards, direct integration cuts fee by 1–2pp
- **Reconciliation dashboard** — daily auto-match provider settlements vs internal order totals; flag discrepancies
- **Chargeback handling** — webhook events for disputes → admin notification → response workflow
- **Fraud signals** — velocity (same card, multiple orders), BIN mismatch, shipping-to-different-country flag. Start with rules, graduate to ML if volume justifies
- **Multi-currency display** — `exchange_rates` table already shipped, wire currency toggle on storefront
- **Provider health dashboard** — approval rate per provider × country × method; smart router feeds on this

---

## 6. Best practices baked into every adapter

### Idempotency
Every outbound provider call uses `order_id + provider_name` as idempotency key. Providers support this natively (MP: `X-Idempotency-Key`, Pagopar: via order hash dedup). Without it, network retries can double-charge.

### Webhook hardening
- Always verify signature BEFORE processing
- Always dedup via `(provider, provider_event_id)` UNIQUE constraint (already in `webhook_events`)
- Always re-fetch the payment resource from the provider — never trust the webhook body alone (webhooks are "hey something changed", not "here are the current values")
- Always return 200 on dedup hit so provider stops retrying
- Return 500 on transient failure so provider keeps retrying (with exponential backoff)

### Reconciliation
- Daily cron: pull each provider's settlement report, diff against `orders.status='paid'` totals
- Flag any orders paid > 24h ago still in `awaiting_payment` (already shipped as `commerce-reconcile-pending` timer)
- Merchant-visible reconciliation widget: "Last settlement: Gs 15.2M paid on Mon Apr 21 · all matched ✓"

### Money is integers
Already enforced — all amounts stored as `*_cents INTEGER`. PYG has no subunit, so `100000` means Gs 100.000. Never use `DECIMAL` or `FLOAT` for money.

### Separate B2C from B2B
Paragu-AI SaaS billing lives in `subscriptions` + `payments`. Storefront revenue lives in `orders` + `storefront_transactions`. Never merge these — the lifecycles, RLS shapes, and settlement flows all differ. Already enforced.

### Observability
- Log every `commerce.payment.*` event with `{businessId, orderId, provider, status, amountCents, traceId}`
- Metrics: approval rate per provider (7-day rolling), webhook success rate, average time-to-reconcile
- Alerts: >5% decline rate sustained 1h → page; webhook-signature-fail spike → security page

---

## 7. Merchant onboarding flow (end-state)

When a tenant signs up for commerce in the admin:

1. Pick country of operation (→ determines eligible providers)
2. Create provider accounts (Pagopar + optional Mercado Pago if cross-border)
3. Paste tokens into our admin → we store per-business in a new `business_payment_credentials` table (encrypted column, service-role-read-only)
4. Merchant's storefront routes checkout through their own tokens — not ours
5. Funds settle direct to their bank; we have zero custody

This is the key legal/ops distinction that keeps us regulatorily light. Different from Shopify Payments, same as early Shopify or Squarespace.

---

## 8. What to build THIS sprint vs LATER

### This sprint (1 week)
- [ ] Ship Phase 1 (Pagopar adapter + webhook + registry flip)
- [ ] Enable on tienda-demo tenant, run sandbox purchase end-to-end
- [ ] Fill real Pagopar credentials on VPS, run Gs 5.000 real purchase + refund
- [ ] Update `docs/commerce-go-live.md` — replace MP-centric sections with Pagopar

### Next sprint (2-3 weeks)
- [ ] Router + failover
- [ ] dLocal OR EBANX adapter (pick one)
- [ ] Admin payment-credentials CRUD page
- [ ] Checkout UX — per-country method icons

### Later (2-3 months)
- [ ] Bancard VPOS direct
- [ ] Reconciliation dashboard
- [ ] Fraud signals
- [ ] Provider health dashboard

### Revisit only if marketplace pivot
- Payment institution registration with BCP
- Escrow infrastructure
- AML/KYC program

---

## 9. Decisions to confirm

1. **Pagopar as Phase 1 primary?** Yes 
2. **MP stays as secondary?**No = rip MP out.
3. **LATAM regional aggregator for Phase 2 — dLocal or EBANX?** dLocal wider coverage
4. **"Facilitator Lite" model confirmed?** — merchant owns their Pagopar account
5. **Scope for this sprint** — include router + admin UI? 

---

## Sources

- [Pagopar API docs](https://soporte.pagopar.com/portal/es/kb/articles/api-integracion-medios-pagos)
- [NORBr — Payment methods in Paraguay](https://norbr.com/library/payworldtour/payment-methods-in-paraguay/)
- [dLocal LATAM coverage](https://www.dlocal.com/payment-processors-in-latin-america/?country=paraguay)
- [EBANX vs dLocal comparison (Zintego)](https://www.zintego.com/blog/choosing-the-right-payment-solution-for-latin-america-ebanx-vs-dlocal/)
- [40% of LATAM ecommerce = alternative payment methods (FinTech Magazine)](https://fintechmagazine.com/digital-payments/40-of-latam-ecommerce-payments-are-by-alternative-methods)
- [Payment orchestration architecture (Solidgate)](https://solidgate.com/blog/best-payment-orchestration-platforms/)
- [PCI DSS hosted checkout vs embedded (PCI DSS Guide)](https://pcidssguide.com/hosted-checkout-vs-embedded-payments-for-pci-scope/)
- [PCI SAQ scope reduction (QuickTrust)](https://quicktrustapp.com/blog/pci-dss-scope-reduction-guide)
- [Stripe PCI compliance overview](https://stripe.com/guides/pci-compliance)
- [Paraguay online payment setup guide (doinamerica)](https://doinamerica.com/paraguay-online-payment-system-setup/)
