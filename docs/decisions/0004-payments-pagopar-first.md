# 0004 · Pagopar primary, Mercado Pago removed, dLocal Phase 2

**Status:** Accepted · 2026-04
**Deciders:** Ivan

## Context

Paraguay SMB checkout needs a payment provider that supports local methods
(Bancard cards, Tigo Money, transfers) without forcing the merchant onto a
foreign processor. We initially scaffolded both Mercado Pago and Pagopar
adapters before going to market.

## Options considered

- **Mercado Pago as primary** — strong brand recognition, mature SDK. Cons:
  weaker on local PY methods (no Tigo Money in default flow), MERCOSUR-wide
  fee structure that disadvantages PY merchants.
- **Pagopar as primary** — Paraguay-native. Supports Bancard, Tigo Money, all
  local rails. Direct merchant relationships. Webhook-based, well documented.
- **Stripe** — best DX, no PY local rails. Non-starter for the target customer.
- **Build everything custom against Bancard 3DS** — too much PCI scope for our
  size.

## Decision

- **Phase 1 (now):** Pagopar is the only integrated provider. Mercado Pago
  adapter code was removed from the codebase to stop misleading the engine
  and admin UI into thinking it's a viable choice.
- **Phase 2 (later):** dLocal as a secondary provider for international cards
  (relocation tenants need this). Reuses the same `payments` adapter
  interface — no engine refactor.
- **Facilitator Lite legal model:** ParaguAI takes payment on behalf of the
  merchant, settles minus our commission. Avoids per-merchant Pagopar onboarding
  friction at this scale.

## Consequences

- Only one provider in the production code path → smaller surface, easier ops.
- Webhook handling (`/api/webhooks/pagopar`) is the canonical pattern for
  payment events; future adapters (dLocal) will mirror its shape.
- No "select your provider" UX needed for merchants — we abstract it.
- Dropping MP means we can't claim "MP supported" in marketing copy.

## Revisit if

- A specific large customer demands MP for brand reasons.
- Pagopar fee structure or reliability degrades.
- Phase 2 (international cards) needs to ship — implement dLocal adapter then.
