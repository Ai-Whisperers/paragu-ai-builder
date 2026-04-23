# Superspuma — Launch readiness

Live URL: https://paragu-ai.com/s/es/superspuma

## Current state (April 2026)

- Tenant type inherits `mattress_store` → `retail_base`
- 24-product catalog with real pricing scraped from Artaza, Casa Interiores,
  Misionera, Sara Comercial, Bristol, Inverfin, Universo — all PYG
- 7 retail stores + 6 centros logísticos mapped with addresses and phones
- Content covers: hero, trust strip, full catalog (resorte + espuma + accesorios),
  4-way comparison, 4-step purchase process, trust signals, gallery,
  testimonials, 16-entry searchable FAQ, promo banner, contact, 5 pages
  (home, nosotros, tiendas, guias, garantia, promo-cartagena)
- **Commerce: OFF.** Orders currently flow through WhatsApp
  (+595 974 202 025) — no cart, no checkout, no Bancard live.

## Pre-commerce checklist

Before flipping commerce on, these need to be resolved.

### 1. Real product photography

Current state: gallery uses Unsplash placeholders; product-catalog products
have one Titanium image reference also via Unsplash.

- [ ] Get at least 3 photos per product line (studio + room scene + detail)
- [ ] Replace Unsplash URLs in `sites/superspuma/content/es.json#home.gallery.images`
- [ ] Replace Unsplash URL in `src/content/superspuma/products.seed.json`
      (Titanium) and add images for the other 23 SKUs
- [ ] Photos go under `web/public/sites/superspuma/images/`

### 2. Confirm pricing

16 of 24 SKUs have estimated prices (based on tier positioning vs the
8 confirmed ones). The owner/sales team should validate or correct
`src/content/superspuma/products.seed.json` before going live.

Confirmed prices (scraped from retailer listings):
- Imperial solo colchón: 2.23M–3.65M
- Pop Kids: 649k–1.30M
- Luna Soft: 500k–820k
- Golden: 696k–1.05M
- Harmony: 1.27M–2.25M
- Titanium (set): listed prices vary — we use 1.8M as starting
- Ortopédico: 6 años garantía, hasta 140 kg — price estimated
- Duo Confort (memory foam): price estimated

### 3. Bancard merchant credentials

Bancard vPOS 2.0 integration is in the codebase (`web/lib/payments/bancard/`).
To turn it on for Superspuma:

1. Get public/private keys from Bancard merchant onboarding
2. Add to environment:
   ```
   BANCARD_ENVIRONMENT=production
   BANCARD_PUBLIC_KEY_SUPERSPUMA=<from Bancard>
   BANCARD_PRIVATE_KEY_SUPERSPUMA=<from Bancard>
   ```
3. Create a row in `business_payment_credentials` table keyed to
   `businesses.slug = 'superspuma'` pointing at the env vars
4. In `sites/superspuma/site.json` flip:
   ```json
   "integrations": { "payments": { "enabled": true } }
   ```
5. In `src/registry/superspuma.type.json` flip:
   ```json
   "commerce": { "enabled": true, "launchPhase": "beta" }
   ```
6. Verify `gen_random_uuid()` is not namespaced to a forbidden extension
   schema — see `memory/checkout-runtime-config.md`
7. Place a real 1-guarani sandbox order end-to-end
8. Regenerate tenant data: `npm run generate:tenant-data`
9. Smoke-test all 6 pages + checkout on staging before pushing to Main

### 4. Product variant model

Current product seed has sizes declared inline per SKU. For real commerce
we want one product row per model with a `variants[]` array (size × price)
— the commerce-catalog component supports this. Requires:

- [ ] Load `products.seed.json` into Supabase via a seed script (not
      currently wired for superspuma — fun4me is the reference)
- [ ] Verify PDP at `/s/es/superspuma/producto/<slug>` renders correctly
- [ ] Verify `/s/es/superspuma/tienda` catalog page renders correctly
- [ ] Verify `/s/es/superspuma/carrito` and `/s/es/superspuma/checkout`

### 5. Shipping zones + fees

The site declares 5 delivery zones with a free-delivery threshold of
Gs. 1.000.000 but the checkout flow will need per-zone shipping costs.

- [ ] Define shipping cost per zone (Asunción, Central, Paraguarí,
      Cordillera, Interior)
- [ ] Handle interior delivery surcharge for mattress weight/volume
- [ ] Wire into the delivery-calculator-section content

### 6. Legal / compliance

- [ ] Update `/s/es/superspuma/terminos-y-condiciones` (currently 404s)
- [ ] Update privacy policy link
- [ ] Verify Schema.org LocalBusiness JSON-LD emits with real address
- [ ] Confirm RUC display if required for commerce operation

## What's live today

Everything below works without any further intervention:

- All 6 page routes compose cleanly (verified by vitest)
- Sitemap auto-includes the 6 pages
- LocalBusiness JSON-LD emits with real contact/phone/email
- WhatsApp click-to-chat works (links prefilled with product context)
- Catalog renders all 24 products grouped by category
- Comparison, FAQ, trust signals, testimonials, gallery all populated
- Promo Cartagena 2026 lead-capture form works

## Open questions for the owner

Things Ivan cannot answer — need Superspuma's team:

- Exact per-zone shipping fees
- Real product photography
- Warranty activation workflow (who validates, turnaround)
- Trade-in policy — do they actually retire old mattresses? Credit value?
- Accessory line pricing (almohadas, cubre colchones) — currently estimated
- Instagram @superspumapy handle — confirm this is the active account
  (LinkedIn and Facebook verified via public listing)

## Contact for payment integration

- Bancard merchant onboarding: https://comercios.bancard.com.py
- Documentación técnica vPOS 2.0: https://desarrolladores.bancard.com.py
- Tenant technical contact: info@superspuma.com.py

---

_Last updated: April 2026. Next revision trigger: when Bancard credentials
arrive or when Superspuma owner confirms pricing._
