# Runbook — WhatsApp Business API for Fun4Me

**Audience:** ParaguAI operations
**Goal:** Move from click-to-chat link → WhatsApp Business API with automations.

## Why upgrade

Current state: `https://wa.me/595976569739` link — consumer WhatsApp. No automation, no delivery receipts, no templates, no broadcasts.

With WA Business API we get:
- Order confirmations auto-sent
- Shipment tracking messages
- Abandoned cart recovery (huge lift for privacy-sensitive buyers)
- Broadcast lists (promos opt-in)
- Template messages with buttons
- Response analytics
- Integration with platform commerce layer

## Decision: which provider

Official Meta WA Business API requires provider. Options:

| Provider | Cost/mo | Pros | Cons |
|---|---|---|---|
| 360dialog | Low (~$10-30) | Direct Meta, cheap | DIY setup |
| Twilio | Higher ($$) | Full-stack, great docs | Expensive at scale |
| Gupshup | Medium | Good dashboard | LatAm focus but not PY-first |
| MessageBird | Medium | European | Time zone mismatch |

**Recommendation:** **360dialog**. Lowest cost, direct Meta partner, used by other LatAm commerce.

## Step 1: Facebook Business verification

Prerequisite — Fun4Me needs verified Facebook Business Manager account:
1. Create / verify Business Manager at business.facebook.com
2. Provide:
   - Business legal name (Fun4Me Comercial)
   - Business registration docs (RUC)
   - Business address
   - Authorized rep's ID
3. Meta verifies 1-3 business days
4. **Potential risk:** Meta may flag adult retail. Apply with neutral description ("comercio minorista de artículos de consumo"). If flagged: appeal with legal documentation showing compliant business.

## Step 2: Register phone number

- Migrate +595976569739 from consumer WA to Business API.
- **Critical:** once migrated, cannot use as consumer WA again. Do this outside business hours to avoid service gap.
- Alternative: get new number for Business API, keep consumer WA for owner personal use.

**Recommendation:** use new dedicated number (e.g., +595 976 xxx xxx) for Business API. Keep 976569739 for owner direct contact.

## Step 3: 360dialog signup

1. Go to 360dialog.com
2. Sign up as business (link Meta Business Manager)
3. Request API access for Fun4Me
4. Approval: 1-3 business days
5. Receive API key

## Step 4: Platform integration

Platform (paragu-ai-builder) needs WA Business adapter. Estimated effort: 1-2 days engineering.

Files to create/extend:
- `web/lib/messaging/whatsapp-business.ts` — WA Business API client
- `web/lib/messaging/templates/` — approved message templates
- `web/app/api/webhooks/whatsapp-business/route.ts` — inbound webhook
- Extend `web/lib/commerce/notifications.ts` to route via WA Business

## Step 5: Template messages to create

All templates need Meta approval (24-48hs). Draft these first:

### T1: Order Confirmation
```
Hola {{1}}, recibimos tu pedido #{{2}} por Gs. {{3}}. 
Te avisamos cuando se despache. 
Seguí tu pedido: {{link}}
```

### T2: Order Shipped
```
Hola {{1}}, tu pedido #{{2}} fue despachado. 
Llega en {{3}} días hábiles. 
Seguimiento: {{link}}
```

### T3: Abandoned Cart
```
Hola {{1}}, dejaste unos productos en tu carrito. 
Los guardamos para vos. 
Seguí tu compra acá (con 10% off si volvés hoy): {{link}}
```

### T4: Back in Stock
```
Hola {{1}}, el producto {{2}} que tenías en wishlist volvió a estar disponible. 
Vencelo antes de que se agote: {{link}}
```

### T5: Subscription Reminder
```
Tu próxima caja {{1}} se despacha el {{2}}. 
Personalizá antes en tu cuenta: {{link}}
Si querés pausar, respondé PAUSAR.
```

### T6: Birthday
```
Feliz cumpleaños, {{1}}! 
Te regalamos un descuento de 20% válido 48hs.
Código: BDAY{{2}}
```

## Step 6: Opt-in management

- **Transactional messages** (order confirmations, shipping): don't need opt-in (contractual relationship).
- **Marketing broadcasts** (promos, product launches): REQUIRE explicit opt-in per Meta policy.
- Add opt-in checkbox at checkout: "Quiero recibir promos por WhatsApp (opcional)".

## Step 7: Inbound handling

Customers can reply to business messages. Routing:
- Keywords "CANCELAR", "BAJA" → auto-unsubscribe from marketing
- Keywords "PAUSAR" → subscription pause flow
- Keywords "DEVOLUCION", "CAMBIO" → route to returns team
- Anything else → route to customer service queue

## Step 8: Analytics

Track:
- Open rate of transactional messages (>95% is typical)
- Response rate of marketing broadcasts
- Conversion rate from abandoned cart messages
- Opt-out rate

If opt-out rate > 5%, reduce broadcast frequency.

## Cost estimation

360dialog pricing (as of 2026):
- Setup: one-time $30-50 USD
- Monthly: $15-30 USD depending on volume
- Per message: €0.005-0.02 depending on category (utility vs marketing)

Fun4Me estimated: $50-100/mo at 500-1000 messages/month. ROI via abandoned cart recovery alone usually pays for it.

## Risks

- Meta may reject adult retail at verification. Mitigation: neutral business description, appeal with legal docs.
- Template rejection for explicit content. Mitigation: keep all templates neutral ("pedido", "producto", "compra" — never category names).
- Chargebacks on marketing spam could lead to suspension. Mitigation: strict opt-in, easy opt-out.

## Timeline

- Facebook Business verification: 1-3 days
- 360dialog activation: 1-3 days
- Platform integration (engineering): 1-2 days
- Template approval (Meta): 2-3 days per template
- End-to-end: **2-3 weeks realistic**.

## Priority

**Phase 3 (month 3 of rollout).** Not blocking launch. Adds significant revenue lift once live.
