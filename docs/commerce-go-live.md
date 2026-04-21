# Commerce Go-Live Checklist

**Status as of 2026-04-20:** code shipped, DB migrated, env + systemd wired. 4 secrets still missing + 1 Supabase admin user + tenant selection.

---

## 1. Mercado Pago prod credentials (15 min)

### 1a. Create / log into the MP dev panel

1. Go to <https://www.mercadopago.com.py/developers/panel>
2. Log in with the business account that will receive payouts.
3. Top-right: switch workspace from **"Test"** to **"Production"** (⚠️ test-mode tokens only work with sandbox cards and can't accept real money).

### 1b. Create an application

1. Left sidebar → **Your applications** → **Create application**
2. Name: `Paragu-AI Storefront`
3. Integration model: **Checkout Pro** (hosted redirect flow — matches what we built)
4. Platform: **Web**
5. Save.

### 1c. Collect the 3 values

From the application's **Credentials** tab, **Production** section:

| MP panel label | `/etc/paragu-ai/env` key |
|---|---|
| `Access token` | `MP_ACCESS_TOKEN` |
| `Public key` | `NEXT_PUBLIC_MP_PUBLIC_KEY` |
| `Webhooks` → **Secret key** (click "Configure" first) | `MP_WEBHOOK_SECRET` |

### 1d. Register the webhook URL

1. In the application, **Webhooks** → **Configure notifications**
2. Mode: **Production**
3. URL: `https://paragu-ai.com/api/webhooks/mercado-pago`
4. Events: check `payment.created` and `payment.updated`
5. Save → MP reveals the **Secret key** once — this is `MP_WEBHOOK_SECRET`
6. Click **Test** — MP sends a probe. You should see `200 OK` or `401 invalid_signature` (both mean the route is live; 401 is expected until the secret is in the env file).

---

## 2. Resend API key (5 min)

1. <https://resend.com> → sign up / log in.
2. Add domain `paragu-ai.com` → follow DKIM/SPF DNS steps. Verify domain.
3. **API Keys** → **Create API Key** → permission **Sending access**, scope **paragu-ai.com only**.
4. Copy the key once (starts with `re_…`). This is `RESEND_API_KEY`.

Also: set `COMMERCE_EMAIL_FROM=no-reply@paragu-ai.com` (or `tienda@paragu-ai.com`) — already defaults to the no-reply address in the env file.

---

## 3. Put the secrets on the VPS (2 min)

**Do not paste secrets into chat — SSH in and edit the file directly.**

```bash
ssh root@72.61.44.159
vi /etc/paragu-ai/env
# Replace each CHANGE_ME with the real value.
# Keys are:  MP_ACCESS_TOKEN  MP_WEBHOOK_SECRET  NEXT_PUBLIC_MP_PUBLIC_KEY  RESEND_API_KEY
```

Redeploy the service so the new env vars take effect:

```bash
cd /opt/stacks/paragu-ai-builder
docker stack deploy -c stack-prod.yml paragu-ai --with-registry-auth
```

(Zero-downtime: `update_config.order: start-first` spins the new task up before stopping the old.)

**Verify env is loaded** (no values printed, just keys):

```bash
docker service inspect paragu-ai_web \
  --format '{{json .Spec.TaskTemplate.ContainerSpec.Env}}' \
  | python3 -c "import sys,json; [print(e.split('=')[0]) for e in sorted(json.loads(sys.stdin.read()))]"
# Expect 18 keys incl. MP_ACCESS_TOKEN, RESEND_API_KEY, CRON_SECRET, etc.
```

---

## 4. Smoke test (5 min)

From your laptop:

```bash
# Health
curl -s -o /dev/null -w "%{http_code}\n" https://paragu-ai.com/api/health

# Webhook route (no body → 400 expected, proves route is live)
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://paragu-ai.com/api/webhooks/mercado-pago

# Cron routes with wrong secret → 403
curl -s -o /dev/null -w "%{http_code}\n" -X POST -H 'x-cron-secret: wrong' https://paragu-ai.com/api/cron/commerce-email-flush
```

Then in MP dashboard → webhook config → **Test**: MP sends a probe to `/api/webhooks/mercado-pago`. Should return 200 (or 401 if `MP_WEBHOOK_SECRET` doesn't match).

On the VPS, watch the systemd cron jobs:

```bash
ssh root@72.61.44.159
journalctl -u 'commerce-cron@*' --since '5 min ago' --no-pager | tail -20
# Each 2 min you should see a clean email-flush run
```

---

## 5. Supabase admin user (1 min — I do this, but I need:)

You tell me:

- **Email** for the admin user (e.g. `admin@paragu-ai.com` or your personal email)
- Whether you want a **temporary password** (I generate it and paste once in chat) OR a **magic link** (you click to set your own password — recommended)

Then I run the Supabase MCP `create user` and you're in at <https://paragu-ai.com/admin>.

---

## 6. Pick the first tenant to enable commerce

Options today:

| Slug | Type | Notes |
|---|---|---|
| `dayah-litworks` | — | Real client, already deployed |
| `de-abasto-a-casa` | `meal_prep` | Real client, `meal_prep` is not a retail_base descendant — would need a one-line registry edit |
| Any `tienda_ropa` / `tienda_mascotas` / `tienda_bebes` tenant | retail_base | Commerce is already enabled by default on these types |
| **New `tienda-demo` tenant** | `tienda_ropa` | Clean slate for the first real purchase — recommended |

Tell me which and I'll:

1. Create the business row (if new)
2. Seed the starter catalog (5 products, stock-photo watermark)
3. You visit `https://paragu-ai.com/s/es/<slug>/tienda` to verify the store renders
4. We run a sandbox purchase with an MP test card
5. Switch to prod MP and you run a real Gs 5.000 transaction + refund

---

## 7. Known gaps (non-blocking for MVP — Phase 2/3 polish)

| Gap | Impact | When to fix |
|---|---|---|
| No image upload UI in admin | Owner must paste image URLs | Before non-tech merchant onboards |
| No discount code field in checkout | Discounts table works but shopper can't enter a code | Next sprint |
| Abandoned-cart cron writes touch rows but no email | Recovery emails not sent yet | Phase 3 |
| No refund button in admin | Refunds must be done from MP dashboard | When first refund request lands |
| No shipping zone UI | Shipping cost is hardcoded 0 in checkout | Before charging real shipping |

---

## Reference

- **Commerce plan:** see conversation transcript (5 phases, ~40 files changed)
- **Migrations applied:** `commerce_core`, `commerce_phase2`, `commerce_phase3`, `commerce_inventory_rpc`, `commerce_harden_search_path_and_mv`
- **New env vars source-of-truth:** `/etc/paragu-ai/env` on VPS
- **Backup of env file:** `/etc/paragu-ai/env.backup.YYYYMMDD-HHMMSS` (root-only)
- **MP webhook URL:** `https://paragu-ai.com/api/webhooks/mercado-pago`
- **Supabase project:** `paragu-ai` (ref `qyvokpribmbrosafntqa`, region us-west-2)
- **VPS:** root@72.61.44.159 (Hostinger, Docker Swarm, `agent-net`)
- **systemd timer units:** `/etc/systemd/system/commerce-cron@*.{service,timer}`
- **Disable a timer:** `systemctl disable --now commerce-cron@email-flush.timer`
