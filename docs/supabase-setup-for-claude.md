# Supabase + tenant setup — what I need from you

Short checklist of the info I need from you to finish the commerce go-live for **nexaparaguay**. I can do every step via the Supabase MCP — you just paste decisions here or reply in chat.

---

## 1. Admin auth user (Supabase Auth)

Needed so you can log in at `https://paragu-ai.com/admin/*` once the chain is deployed.

**Tell me:**

- **Email to register:** `________________________`
  (recommend your personal + deliverable inbox — not a role account yet)

- **Onboarding method:** pick one
  - [ ] **Magic link** — I create the user with an unlisted password, then send a one-time login link to your email. You click it, set your own password. ← **recommended**
  - [ ] **Temporary password** — I create + set a password. I tell you once in chat (you rotate it on first login).

Once you reply with those two, I run the Supabase MCP call immediately. 1 minute.

---

## 2. Enable commerce on `nexaparaguay`

### ⚠️ First — confirm this is what you want

`nexaparaguay` is type `relocation` (CLAUDE.md says "PENDING"). The commerce stack is built for **product catalogs with stock** (tienda-style). For relocation, it only makes sense if you want to:

- Sell **relocation packages as products** ("Mudanza Express", "Mudanza Completa", etc. — one line item per package, fixed price)
- Take a **booking deposit** via the storefront checkout
- Skip the stock/inventory aspect (relocation services aren't inventoried)

**If yes, I'll proceed.** If you'd rather pilot commerce on an actual retail tenant first (`dayah-litworks`, or a new `tienda-demo`), tell me which.

### What I'll do if you confirm

```sql
-- Inject commerce config into nexaparaguay's data_json so the resolver
-- picks it up without touching the relocation registry entry.
UPDATE businesses
SET data_json = jsonb_set(
  COALESCE(data_json, '{}'::jsonb),
  '{commerce}',
  '{"enabled": true, "provider": "pagopar", "currency": "PYG", "launchPhase": "pilot"}'::jsonb
)
WHERE slug = 'nexaparaguay';
```

Then I'll seed 3-5 starter "packages" (you review + edit):

- Mudanza Local — Gs 2.500.000
- Mudanza Completa con embalaje — Gs 4.500.000
- Mudanza Express (hasta 50km) — Gs 3.500.000
- Gestión de documentos para relocación — Gs 800.000
- Seguimiento personalizado 30 días — Gs 1.200.000

These are placeholders based on typical PY relocation pricing. **Tell me what's real** and I'll overwrite.

### Commission config for nexaparaguay

Nexa is in the 3-month free-premium window per launch-source-of-truth. I'll set `commission_exempt_until = 2026-07-20` (3 months from today) so no commission is charged during the pilot. After that, defaults to 5%.

---

## 3. Pagopar credentials — three separate decisions

### 3a. For the tenant (nexaparaguay) — needed to actually charge shoppers

**Does nexaparaguay already have a Pagopar merchant account?**

- [ ] **Yes** — tell me in chat that you have tokens. I'll walk you through `/admin/commerce/<nexaparaguay-business-id>/payments` to paste them (they're encrypted before DB insert).
- [ ] **No — I want to help them open one** — tell me and I'll generate a pre-filled message in Spanish walking them through the Pagopar signup + token collection flow (Básico plan, Gs 49k/mo).
- [ ] **No — for now just WhatsApp checkout** — tell me this and I'll keep commerce disabled on nexaparaguay's storefront, or enable commerce but route purchases to the existing "Pedir por WhatsApp" path without Pagopar.

### 3b. For Paragu-AI (our own) — needed ONLY for commission splitting

If you skip this, commerce on nexaparaguay still works — we just don't automatically skim commission from each sale. Since nexa is commission-exempt during the 3-month window anyway, **you can skip this entirely for now.**

Set up later when you have a tenant outside the free window AND you want automatic commission.

### 3c. For SaaS billing — NOT NEEDED

Already swapped to bank-transfer + WhatsApp (PR #87). Your alias is wired in. Done.

---

## 4. Grant me additional Supabase access? (optional)

I already have Supabase MCP access to the `paragu-ai` project (ref `qyvokpribmbrosafntqa`). I can:

- ✅ Apply migrations (already doing this post-merge)
- ✅ Run SELECTs to read tenant rows
- ✅ Create Auth users (once you give me email for step 1)
- ✅ Update rows to enable commerce
- ✅ See security advisors

**Nothing extra needed** — the MCP connection covers everything above.

If you ever want to scope it down, you can revoke the MCP grant anytime from <https://claude.ai/integrations> → Supabase → disconnect. I'd lose the ability to do the above but your data stays intact.

---

## 5. After you reply — what happens

1. I create the admin user (step 1)
2. I enable commerce on nexaparaguay + seed 5 packages (step 2) — if you confirmed
3. I report: login URL, admin user created, tenant's storefront URL
4. You log in, walk through `/admin/commerce/<id>/products` + `/admin/commerce/<id>/orders` — see the UI for real
5. Based on step 3a choice, either you bring Pagopar tokens or we defer

---

## Copy-paste reply template

Fill in and paste back:

```
Admin email: ______________________
Method: magic-link | temp-password
Commerce on nexaparaguay: yes | no (switch to: __________)
Pagopar for nexa: has-tokens | help-them-open | WhatsApp-only-for-now
```

That's it. Everything else I'll do.
