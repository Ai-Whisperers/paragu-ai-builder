# Pricing deals & offers · proposal

> **Question from launch questionnaire (§6.3 / §E):**
> "research what deals to implement and offers and all the stages we can offer
> them and what best to offer based on the state of the client etc"

This is the customer-state × offer matrix. Each offer is gated by where the
client is in their lifecycle. Status of each: **proposed** until you green-light.
Once approved, I'll wire each into copy, contracts, and admin tooling.

---

## Stage 0 · First-touch / browsing the site

Goal: get them into the qualifier and onto your WhatsApp.

| Offer | Hook | Why | Risk |
|---|---|---|---|
| **3 meses Profesional gratis · sin tarjeta** | Zero friction | Already approved (Plan Prueba) | Adverse selection — mitigated by the 3-month full-feature attention they get |
| **Demo personalizada en 24h** | Removes "what would mine look like" friction | Already on the site | Time cost on you per demo; capped by your throughput |
| **Auditoría gratuita del Instagram/sitio actual** | Optional add-on for businesses already online | High-value prospect identifier, signals expertise | Effort per audit (~20 min if templated) |

**Recommendation:** add the audit as a third path on `/demo`. Keep the qualifier minimal but offer "¿Ya tenés sitio o IG con tracción? Te hacemos una auditoría gratis" as a checkbox.

---

## Stage 1 · Lead in qualifier · still deciding

Goal: convert qualifier → paid signup with minimum friction.

| Offer | Hook | Why | Cost to you |
|---|---|---|---|
| **Setup gratis si pagás 6 meses por adelantado** (Presencia: Gs 600K saved) | Removes upfront cost barrier | Trades cash-now for cash-later, gets them locked in | None if grace would have been free anyway |
| **Setup -50% si decidís en 7 días** | Urgency + meaningful discount | Helps closes drag less | Gs 325K-1.1M depending on tier |
| **Match best price** if they show a quote from another agency | Removes "let me think about it" | PY agencies cite Gs 3-5M; you're already 80% cheaper, but proves it | Tiny — most won't actually shop |
| **First month free** add-on for the paid plan | Soft incentive | Less leverage than setup discount but easier to message | 1 monthly fee |

**Recommendation:** **6 meses prepay → setup gratis** is the strongest. It anchors the conversation on long-term commitment instead of monthly tinkering. Use the "decide in 7 days for -50% setup" as a fallback if they hesitate.

---

## Stage 2 · Onboarding (month 0-1) · paid customer just signed up

Goal: make month 1 feel premium so they don't churn before grace ends.

| Offer | Hook | Why | Cost to you |
|---|---|---|---|
| **Welcome WhatsApp group + 30-min Calendly call** | Personal touch, sets expectations | Already in your comms cadence (Q6.3-C) | Time only |
| **3 cambios de contenido extra el primer mes** | "Mientras te acostumbrás" | Defuses "I can't get it right" anxiety | Time, capped at 3 |
| **Foto/video session AI-generada** (1 hero + 3 product photos) | High perceived value | Already part of your AI assets pipeline (~$2 cost) | <Gs 30K marginal |
| **Prioridad de carga en `/c/<ciudad>`** for their vertical | Their listing first when prospects browse the city page | Costs you nothing, gives them visibility | None |

**Recommendation:** bundle the 3 extra content changes + the AI hero/product asset session into **"Onboarding Profesional"** — included in every paid signup, not advertised as a discount but as a baseline. Frame it as "así arrancamos" instead of an offer.

---

## Stage 3 · Mid-grace (month 3-5) · checking if they're using it

Goal: get usage data + identify upsell paths before grace ends.

| Offer | Hook | Why | Cost to you |
|---|---|---|---|
| **Mid-grace audit call** | "How's it going? Here's what we observed" | Already in your comms cadence | 15-min call |
| **Free reservas/booking activation** if they're a service vertical not using it | Inflates per-customer LTV before they downgrade | Booking is in Crecimiento+; gives a taste | Negligible if booking infra already built |
| **Free additional language** if they have international clients | Shows they need Profesional | Pushes upgrade conversation organically | Translation cost (~$40 per locale via DeepL) |

**Recommendation:** the audit call is the highest-leverage. Frame the upsell offers as "we noticed you'd use X — want us to enable it for the rest of grace?"

---

## Stage 4 · Grace expiring (month -1 before downgrade) · decision point

Goal: convert grace-Profesional usage into a paid Profesional upgrade or annual prepay.

| Offer | Hook | Why | Cost to you |
|---|---|---|---|
| **Pagar anual ahora = 2 meses gratis** | Standard SaaS annual discount (~17%) | Locks revenue, reduces churn risk | 2 months of monthly fee |
| **Upgrade a Profesional con descuento del 30% el primer año** | Specific to their grace-period habit data | Most valuable offer if they're heavy users | 30% × Gs 300K × 12 = Gs 1.08M |
| **Mantener Profesional con un setup adicional** (Gs 1.5M one-time → 6 más meses Profesional) | Lower commitment than annual upgrade | Bridges the "I'll decide later" customer | Gs 1.5M one-time vs Gs 1.8M revenue (6 × 300K) |
| **Refer-a-friend: 1 mes Profesional extra por cada referido que paga** | Loyalty + acquisition combined | Cheapest CAC channel | 1 month Profesional × N referrals |

**Recommendation:** Default offer is **annual prepay → 2 meses gratis**. Customer still expects to downgrade; you prove the value of staying premium with the discount.

---

## Stage 5 · Renewing or downgrading (month 8+) · post-grace

Goal: maximize retention; minimize downgrades.

| Offer | Hook | Why | Cost to you |
|---|---|---|---|
| **3 meses Profesional adicionales por Gs 200K** (vs Gs 900K full price) | "Una vuelta más antes de bajar" | Cheap retention buy | Gs 700K opportunity cost |
| **Upgrade gradient**: Presencia → Crecimiento por Gs 100K extra/mes (vs Gs 50K diff) | Anchors on the absolute, hides the diff | Slight margin bump | Negligible |
| **Loyalty perk: 6º mes gratis a quien lleva 6 meses pagando** | Retention reward | Returns 1 month per quarter retained | 1 month per loyal customer |
| **Año 2 con descuento del 10%** if they renew | Long-term loyalty | Reduces churn at the highest-risk moment | 10% × annual fee |

**Recommendation:** **3 meses extra Profesional por Gs 200K** is your churn-saver. Never advertise it; offer manually when they say "voy a bajar".

---

## Stage 6 · Churned customer · win-back

Goal: bring back at the lowest cost.

| Offer | Hook | Why | Cost to you |
|---|---|---|---|
| **30 días Profesional gratis para volver** | Re-engages without commitment | Already paid setup, infra exists | 1 month |
| **Setup zero on the new plan** if they switched providers | Lower switching cost back | Recovers infra investment | Gs 650K-2.2M depending on plan |
| **Annual at 50% off year 1** | Aggressive recovery | Worth it if you'd otherwise lose them forever | 50% of annual revenue |

**Recommendation:** start with the 30-day free Profesional. If they don't engage in 7 days, escalate to annual at 50% off.

---

## Stage 7 · Expansion · happy customer wants more

Goal: capture upsell revenue at zero acquisition cost.

| Offer | Hook | Why | Cost to you |
|---|---|---|---|
| **Sitio adicional para otra marca tuya con 50% descuento del setup** | Bundle play | Same client owns multiple businesses (common in PY) | 50% setup |
| **Multi-sucursal del mismo negocio: Gs 500K por sucursal extra** | Upsell to Profesional (5 sucursales already included) | Anchors on per-sucursal pricing | Capacity in plan |
| **Domain pack**: registramos 5 dominios extras a Gs 200K/año | Operational value-add | Marginal cost ~$10/domain/year | Domain registrar fee |
| **Dedicated dev hours** at Gs 250K/hora (Profesional includes 10h/month) | Custom integration revenue | Outside the pricing card; treats clients as deal candidates | Time only |

**Recommendation:** the **multi-brand discount** is the cleanest. Customers who already trust you with one site are 5× easier to upsell than acquiring new ones.

---

## Cross-cutting: referral program

| Mechanic | Suggested |
|---|---|
| Referrer gets | 1 mes Profesional gratis OR Gs 100K credit toward setup |
| Referee gets | 20% setup discount OR 1 extra month grace |
| Tracking | Manual at first (referrer name on intake form) → automated via short link in admin once volume justifies |
| Cap | Max 6 free months per referrer per year |

**Recommendation:** start manual. Code automation only after the 5th referral happens.

---

## Cross-cutting: annual prepay

| Plan | Monthly | Annual prepay (1 month off) | Annual prepay (2 months off — 16.7% discount) |
|---|---|---|---|
| Presencia | Gs 100K × 12 = 1.2M | Gs 1.1M (saves 100K) | **Gs 1.0M** (saves 200K) |
| Crecimiento | Gs 150K × 12 = 1.8M | Gs 1.65M (saves 150K) | **Gs 1.5M** (saves 300K) |
| Profesional | Gs 300K × 12 = 3.6M | Gs 3.3M (saves 300K) | **Gs 3.0M** (saves 600K) |

**Recommendation:** the **2-months-off** discount (16.7%) matches industry standard
SaaS annual discount and is meaningful enough to influence the prepay decision.
Don't go to 3 months off (25%) — too generous, hurts margins, and customers don't
need that much to commit.

---

## Implementation order (when you green-light)

| Order | Offer | Code work | Why first |
|---|---|---|---|
| 1 | Annual prepay 2 months off | Update `/precios` + add to `marketing-data.PLANS` + waMessage variants | Lowest effort, highest revenue impact |
| 2 | "6 meses prepay → setup gratis" qualifier offer | New variant in DemoQualifier last step | Closes hesitating prospects |
| 3 | Onboarding bundle (frame as baseline) | Update `/casos` and onboarding email | Sets expectation premium |
| 4 | Mid-grace audit call automation | Cron at month 4-5 of `graceEndsAt` | Needs the tenants table first |
| 5 | Refer-a-friend tracker | Admin field + intake-form question | Wait for 5+ referrals organically |
| 6 | Win-back 30-day free | Admin button per churned tenant | Needs churn detection |
| 7 | Multi-brand discount | Manual quote in WhatsApp; document the rate | No code needed |

---

## What NOT to offer (now)

- Lifetime deals · creates support obligation forever
- Free for nonprofits · gets gamed; offer 50% instead
- "Pay what you want" · destroys price anchoring
- Stackable discounts · pricing-page math becomes unreadable
- Crypto / NFT anything · zero relevance to PY SMB market

---

## Open decisions before I implement

1. **Annual prepay discount %** — 2 months free (16.7%) is my recommendation; confirm or change. ▶
2. **6-month-prepay-setup-gratis** — offer it openly on `/precios` or only as a "if you decide today" sales tool? ▶
3. **Referral reward** — 1 month Profesional vs Gs 100K credit? ▶
4. **Stage 5 retention offer (3 meses por Gs 200K)** — keep it as an undocumented save, or list it on `/precios`? ▶ I lean undocumented (max-leverage save tool)

Once you answer those four, I write the copy + admin scaffolding.
