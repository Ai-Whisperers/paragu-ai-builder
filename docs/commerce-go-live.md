# Commerce Go-Live Checklist (Pagopar primary)

**Status:** code shipped via PRs #73-#77, DB migrated, env wired, systemd timers running. 4 secrets still missing (Pagopar × 2 + Resend) + 1 Supabase admin user + tenant selection.

**Provider:** Pagopar (Paraguay-native — covers Bancard cards, Tigo Money, Aquí Pago / Pago Express cash kiosks, bank transfers, PIX). Mercado Pago was removed; full rationale in `docs/payments-latam-plan.md`.

---

## 1. Pagopar account + credentials (15 min)

### 1a. Sign up

1. <https://pagopar.com> → click **Planes** → choose **Básico** (Gs 49.000/mo, 1 comercio, transactions ilimitadas).
2. Provide RUC + Bancard merchant agreement (or sign up for Bancard at the same time — Pagopar onboards both).
3. If you want cash-kiosk acceptance (Aquí Pago / Pago Express / Wally), enable that add-on (+5.5% + IVA per transaction). Recommended for PY because ~40% of shoppers don't have cards.

### 1b. Collect tokens

In the Pagopar dashboard → **Comercios** → your comercio → **Tokens API**:

| Pagopar label | `/etc/paragu-ai/env` key |
|---|---|
| `Public Token` | `PAGOPAR_PUBLIC_TOKEN` |
| `Private Token` | `PAGOPAR_PRIVATE_TOKEN` |

### 1c. Register the webhook

Pagopar Dashboard → **Configuración** → **URL post confirmación**: `https://paragu-ai.com/api/webhooks/pagopar`

Pagopar will POST to this URL after every payment state change. Webhook auth uses SHA1 of `(private_token + hash_pedido)` — the adapter verifies this automatically. No additional secret to register.

### 1d. Sandbox vs production

Pagopar uses the same API base for both — only the tokens differ:
- Sandbox tokens for testing — set `PAGOPAR_ENVIRONMENT=sandbox`
- Production tokens for real money — set `PAGOPAR_ENVIRONMENT=production`

You can request sandbox tokens from Pagopar support. Test card numbers are listed in their docs.

---

## 2. Resend API key (5 min)

1. <https://resend.com> → sign up / log in.
2. Add domain `paragu-ai.com` → follow DKIM/SPF DNS steps. Verify domain.
3. **API Keys** → **Create API Key** → permission **Sending access**, scope **paragu-ai.com only**.
4. Copy the key (starts with `re_…`). This is `RESEND_API_KEY`.

`COMMERCE_EMAIL_FROM` already defaults to `no-reply@paragu-ai.com` in the env file.

---

## 3. Put the secrets on the VPS (2 min)

**Do not paste secrets into chat — SSH in and edit the file directly.**

```bash
ssh root@72.61.44.159
vi /etc/paragu-ai/env
# Replace each CHANGE_ME with the real value:
#   PAGOPAR_PUBLIC_TOKEN
#   PAGOPAR_PRIVATE_TOKEN
#   RESEND_API_KEY
# Optionally flip PAGOPAR_ENVIRONMENT=sandbox → production when ready.
# (CRON_SECRET, COMMERCE_SESSION_SECRET, COMMERCE_CREDENTIALS_KEY are auto-generated.)
```

Redeploy the service so the new env vars take effect:

```bash
cd /opt/stacks/paragu-ai-builder
docker stack deploy -c stack-prod.yml paragu-ai --with-registry-auth
```

(Zero-downtime: `update_config.order: start-first` spins the new task up before stopping the old.)

**Verify env is loaded:**

```bash
docker service inspect paragu-ai_web \
  --format '{{json .Spec.TaskTemplate.ContainerSpec.Env}}' \
  | python3 -c "import sys,json; [print(e.split('=')[0]) for e in sorted(json.loads(sys.stdin.read()))]"
# Expect 19+ keys including PAGOPAR_PUBLIC_TOKEN, PAGOPAR_PRIVATE_TOKEN,
# COMMERCE_CREDENTIALS_KEY. MP_* should be gone after PR 1 deploys.
```

---

## 4. Apply remaining migrations (1 min — I do this)

After PRs #73-#77 merge, run these via Supabase MCP:
- `20260422000000_commerce_pagopar.sql` (PR #73 → drops MP from CHECK, adds pagopar/dlocal)
- `20260422000100_business_payment_credentials.sql` (PR #77 → encrypted credentials table)

I'll handle this automatically via the Supabase MCP at merge time. No manual action needed unless you want to apply early.

---

## 5. Supabase admin user (1 min — I do this, but I need:)

Tell me:

- **Email** for the admin user (e.g. `admin@paragu-ai.com` or your personal email)
- Whether you want a **temporary password** OR a **magic link** (recommended — you click to set your own password)

Then I run the Supabase MCP `create user` and you're in at <https://paragu-ai.com/admin>.

---

## 6. Configure first merchant (5 min — after admin login)

1. Pick a tenant (existing or new). Recommend `tienda-demo` for first real test.
2. Visit `/admin/commerce/<businessId>/payments`
3. Click **+ Pagopar (Paraguay)**
4. Paste the merchant's **Public Token** + **Private Token**, set environment
5. Save → tokens are AES-256-GCM encrypted before DB insert

You can repeat for Bancard or dLocal once those adapters are added (Phase 2/3).

---

## 7. Smoke test (5 min)

From your laptop:

```bash
# Health
curl -s -o /dev/null -w "%{http_code}\n" https://paragu-ai.com/api/health

# Webhook route (no body → 400 expected, route is live)
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://paragu-ai.com/api/webhooks/pagopar

# Cron without secret → 403
curl -s -o /dev/null -w "%{http_code}\n" -X POST -H 'x-cron-secret: wrong' https://paragu-ai.com/api/cron/commerce-email-flush
```

Then in Pagopar dashboard → webhook config → **Probar** (if available): Pagopar sends a probe to `/api/webhooks/pagopar`. Should return 200 (or 401 if private token doesn't match).

On the VPS, watch the systemd cron jobs:

```bash
ssh root@72.61.44.159
journalctl -u 'commerce-cron@*' --since '5 min ago' --no-pager | tail -20
# Each 2 min you should see a clean email-flush run
```

---

## 8. Full sandbox purchase (15 min)

1. Visit `https://paragu-ai.com/s/es/<tenant>/tienda` — confirm catalog renders
2. Add a product to cart → checkout
3. Pagopar redirects to its hosted checkout
4. Use Pagopar's sandbox card (request from Pagopar support) → complete payment
5. You land back at `/orden/<id>` with status "Estamos procesando tu pago"
6. Within 30s the webhook fires and status flips to "¡Pago confirmado!"
7. Resend sends the order-confirmation email (check inbox)
8. Visit `/admin/commerce/<id>/orders/<id>` to see the timeline

If steps 4-7 work end-to-end, flip `PAGOPAR_ENVIRONMENT=production` and the merchant tokens to production.

---

## 9. Real Gs 5.000 transaction + refund

After production tokens are in:
1. Buy something for Gs 5.000 from your own phone (different MP/Pagopar account)
2. Verify funds arrive in merchant's Bancard account next business day (Tue/Fri settlement)
3. From admin, click **Refund** (Phase 3 — for now do refund from Pagopar dashboard)
4. Verify refund webhook fires + order state flips to `refunded`

If all green: commerce is live for that merchant.

---

## 10. Known gaps (Phase 2/3 polish — non-blocking)

| Gap | Impact | When to fix |
|---|---|---|
| No image upload UI in admin | Owner pastes URLs only | Before non-tech merchant onboards |
| No discount code field in checkout | discounts table works but no shopper input | Next sprint |
| Abandoned-cart cron writes touches but no email | Recovery emails not sent | Phase 3 |
| No refund button in admin | Refund via Pagopar dashboard for now | When first refund request lands |
| No shipping zone UI | Hardcoded shipping cost = 0 | Before charging real shipping |
| Bancard / dLocal adapters not implemented | Only Pagopar works today | Phase 2/3 |

---

## Reference

- **Plan:** `docs/payments-latam-plan.md` — full LATAM strategy, PCI posture, banking flow
- **PR chain:** #73 (MP rip) → #74 (Pagopar adapter) → #75 (router) → #77 (admin credentials) → this PR (env + docs)
- **Migrations:** `commerce_core`, `commerce_phase2`, `commerce_phase3`, `commerce_inventory_rpc`, `commerce_harden_search_path_and_mv`, `commerce_pagopar`, `business_payment_credentials`
- **Env file:** `/etc/paragu-ai/env` on VPS (root-only, chmod 600)
- **Backups:** `/etc/paragu-ai/env.backup.YYYYMMDD-HHMMSS`
- **Webhook URL:** `https://paragu-ai.com/api/webhooks/pagopar`
- **Supabase project:** `paragu-ai` (ref `qyvokpribmbrosafntqa`)
- **systemd timers:** `/etc/systemd/system/commerce-cron@*.{service,timer}` — `systemctl list-timers 'commerce-cron@*'`
- **Disable a timer:** `systemctl disable --now commerce-cron@email-flush.timer`
