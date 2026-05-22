# Runbook — Pagopar setup for Fun4Me

**Audience:** ParaguAI operations + Fun4Me owner
**Prerequisites:** Fun4Me RUC registered with SET

## Step 1: Create Pagopar merchant account

1. Go to https://www.pagopar.com/comercios
2. Apply as merchant — "Comercio Electrónico" category
3. Provide:
   - RUC (legal fiscal ID — Fun4Me Comercial)
   - Razón Social
   - Representante legal (DNI + foto)
   - Cuenta bancaria para acreditación
   - URL del sitio: https://paragu-ai.com/fun4me
   - Descripción del negocio: **Critical — use generic "Comercio de productos de consumo" or "Comercio minorista"**. Do NOT mention "sex shop" or "productos adultos" in merchant application — Pagopar may flag. If asked explicitly, discuss with Pagopar representative.
4. Complete KYC (cédula + selfie)
5. Expected approval: 3-5 business days

## Step 2: Configure commission tier

Default Pagopar commissions (verify at signup):
- Card payments: ~5-6% + VAT
- Transfer: ~2.5%
- Tigo Money: ~3.5%
- Personal Pay: ~3.5%

**Negotiate commissions if Fun4Me's expected monthly volume > Gs. 50M.** Pagopar offers custom tiers for high-volume merchants.

## Step 3: Get API credentials

Once approved:
- **Public key** (used client-side for hosted checkout)
- **Secret key** (server-side only — store in paragu-ai-builder env vars)
- **Token key** (for API v1 calls)

Store in:
- `web/lib/env.ts` validation
- Vercel environment variables (production): `PAGOPAR_MERCHANT_KEY_FUN4ME`, `PAGOPAR_SECRET_KEY_FUN4ME`
- Do NOT commit to repo

## Step 4: Configure webhook endpoints

In Pagopar dashboard, add webhook URLs:
- Payment completed: `https://paragu-ai.com/api/payments/pagopar/webhook?tenant=fun4me`
- Refund: `https://paragu-ai.com/api/payments/pagopar/refund-webhook?tenant=fun4me`

Platform already handles these — see `web/lib/payments/pagopar/`.

## Step 5: Configure statement descriptor

Request from Pagopar:
- Statement descriptor: **F4M COMERCIAL**
- This is what appears on customer's card statement (max 22 chars)

## Step 6: Test transactions

Use Pagopar sandbox credentials first:
1. Create test order with sandbox keys
2. Verify webhook fires correctly
3. Verify order status transitions: pending → paid → fulfilled
4. Verify refund flow

## Step 7: Production activation

Switch env vars from sandbox to production keys. Verify with Gs. 100 test transaction (can be refunded).

## Step 8: Reconciliation setup

- Pagopar pays out every Monday/Thursday.
- Export statement monthly and reconcile with our `orders` table.
- Set up daily reconciliation cron — see `web/lib/payments/reconcile.ts`.

## Troubleshooting

**Merchant rejected:**
- Common reason: vertical not allowed. Pagopar explicitly prohibits adult content in some tiers.
- Solution: apply under "E-commerce general" category and describe business as "retail minorista de artículos de consumo".

**High chargeback rate:**
- Adult retail has industry-average 1-2% chargeback rate.
- If exceeds 3%, Pagopar may suspend account.
- Mitigation: explicit age verification + clear receipts + proactive customer service.

**Webhook failures:**
- Check Cloudflare or Next.js logs for 4xx/5xx on webhook endpoint.
- Pagopar retries 3 times over 24h.
- Critical failures: escalate to Pagopar support.

## Contacts

- Pagopar comercial: comercial@pagopar.com | +595 21 xxx xxxx
- Pagopar soporte técnico: soporte@pagopar.com
- Nuestro account manager (post-onboarding): to-be-assigned
