# Runbook — Google Maps Place ID

**Goal:** Replace placeholder `ChIJxxxxxxxxxx` in `site.json` with real Google Place ID for Fun4Me's physical store.

## Why it matters

- Maps embed on contact page shows real location
- SEO: Google My Business backs local search
- "Cómo llegar" button opens correct navigation
- Reviews on Google profile linked correctly

## Step 1: Verify / claim Google Business Profile

1. Go to https://www.google.com/business/
2. Sign in with Fun4Me's Google account (or create business one)
3. Search for "Fun4Me Herrera 875 Asunción"
4. If listing exists: claim it
5. If not: create new listing
6. Fill:
   - Nombre del negocio: **Fun4Me**
   - Categoría principal: "Tienda" or "Tienda por departamentos" — NOT "Sex shop" explicitly (Google may filter search visibility for that category in some queries; start neutral)
   - Dirección: Herrera 875, Asunción, Paraguay
   - Teléfono: +595 976 569 739
   - Sitio web: https://paragu-ai.com/fun4me
   - Horarios de atención

## Step 2: Verification

Google verifies via:
- **Postal card** (takes 5-14 days) — most common
- **Phone call** (if available for the business category)
- **Email** (rare)
- **Video recording** (for high-risk categories)

Adult retail may trigger video verification — requires filming the storefront with live timestamp.

## Step 3: Get Place ID

Once verified:

1. Go to https://developers.google.com/maps/documentation/places/web-service/place-id
2. Use Place ID Finder tool
3. Search "Fun4Me Herrera 875 Asunción"
4. Copy the Place ID (starts with `ChIJ...`)

Example format: `ChIJGZYT-6dgXgcRj8tGaY5nXoo`

## Step 4: Update `site.json`

Edit `sites/fun4me/site.json`:

```json
{
  "location": {
    "googleMapsId": "ChIJGZYT-6dgXgcRj8tGaY5nXoo",
    ...
  }
}
```

Remove from `placeholderFields`.

## Step 5: Verify embed

Contact page should auto-update to show real map. Verify:
- Correct pin on Herrera 875
- Street View loads
- "Cómo llegar" opens correct directions
- Mobile and desktop both render

## Step 6 (optional): Business Profile polish

Maximize local SEO:

- Upload 10-15 photos (logo, fachada, interior discreto si quieren, productos genéricos)
- Complete description (155 caracteres neutral)
- Respond to existing reviews (friendly, professional)
- Post updates weekly (promotions, new arrivals)
- Enable messaging in Google Business
- Add attributes: "Delivery disponible", "Retiro en tienda disponible"

## Step 7: Monitor

Install Google Search Console + Analytics 4 for the site. Track:
- Local search impressions
- Direction requests from maps
- Profile views
- Phone calls from profile

Target: reach top-3 Google Maps position for "sex shop asuncion" within 6 months.

## Category considerations

Google has restricted some adult categories. Safe primary categories:
- "Tienda" (general)
- "Tienda por departamentos"
- "Tienda de regalos"
- "Servicios de venta minorista"

Secondary categories (menos visible pero más preciso):
- "Adult entertainment store" (EN, may work)
- "Tienda erótica" (if available)

Test which gives best visibility — Google surfaces based on search intent.

## If listing gets removed

Adult retail occasionally gets listings suspended for "policy violation" (subjective). If this happens:

1. Appeal via Business Profile Help
2. Re-submit with more neutral descriptions
3. If rejected permanently: focus local SEO on website only (schema.org LocalBusiness markup, city-specific landing pages)

## Open actions

- [ ] Claim/create Google Business Profile for Fun4Me
- [ ] Complete verification
- [ ] Get real Place ID
- [ ] Update site.json
- [ ] Remove googleMapsId from placeholderFields
