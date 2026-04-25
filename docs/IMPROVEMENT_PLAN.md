# Complete Improvement Plan

*Everything that needs to be built, fixed, or redesigned — prioritized by business impact.*

---

## Phase 0: Stop the Bleeding (Week 1)

These are bugs that actively damage our credibility. Fix them before any new feature work.

### P0-1: Fix Gym Preview Crashes

**Problem:** 28 gym previews stripped to hero-only because a component crashes with `.map()` on undefined. The section builder returns data, the section component renders empty data, and crashes.

**Root Cause:** Some section component doesn't guard against empty/null/undefined arrays before calling `.map()`. Likely the `class-schedule`, `membership-plans`, or `features` section.

**Fix:**
```typescript
// In each section component, guard against undefined:
{array?.length > 0 ? array.map(...) : null}
// Instead of:
{array.map(...)}  // CRASHES if array is undefined
```

**Files to check:**
- `web/components/sections/class-schedule-section.tsx`
- `web/components/sections/membership-plans-section.tsx`
- `web/components/sections/features-section.tsx`

**Test:** All 28 gym previews should render full pages, not hero-only.

### P0-2: Fix Booking Notification (Real WhatsApp Send)

**Problem:** Customer books via wizard → "Reserva Confirmada" → business owner never knows. The booking exists in the DB but nobody reads it.

**Fix — Option A (immediate, free):** Use WhatsApp Business Cloud API with the phone number from the lead's `site.json`. Send a real WhatsApp message when a booking is created.

**Fix — Option B (simpler):** Send an email via Resend to the business owner. The `RESEND_API_KEY` is set (to CHANGE_ME but the env is there). Configure a real Resend account and send:

```
Nueva reserva: {customer_name} - {service} - {date} - {time}
Ver: /admin/bookings/{businessId}
```

**Priority:** CRITICAL. Without this, booking is useless.

### P0-3: Fix Google Photos CSP on Cloudflare Pages

**Problem:** Cloudflare Pages build doesn't include `lh3.googleusercontent.com` in CSP. Photos blocked.

**Fix:** The `next.config.mjs` changes are committed. Cloudflare auto-deploys from git. Verify by checking the CSP header on the Cloudflare URL:
```
curl -I https://paragu-ai-builder.pages.dev/s/es/preview-tajos-barberos-central
```
If `img-src` doesn't include `lh3.googleusercontent.com`, the Cloudflare Pages build needs a manual trigger.

### P0-4: Hide Empty Sections When No Data

**Problem:** FAQ shows empty questions ("Buscar preguntas…" with no text). Testimonials show heading "Lo que dicen en Google" with no reviews.

**Fix:** Component should check if items exist BEFORE rendering the section heading:
```typescript
if (!items?.length) return null
```
Currently, the section builder returns content with `items: []` (empty array), which passes the truthiness check `if (items)` but renders nothing.

### P0-5: Remove Exposed API Key from Frontend

**Problem:** Google Places API key visible in every preview's HTML source via photo URLs.

**Fix — Option A:** Create a `/api/place-photo` route that proxies Google's photo endpoint:
```typescript
// /api/place-photo?ref=ABC123
export async function GET(request) {
  const ref = request.nextUrl.searchParams.get('ref')
  const res = await fetch(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${ref}&key=${process.env.GOOGLE_PLACES_API_KEY}`)
  return new Response(res.body, res)
}
```
Then reference photos as `/api/place-photo?ref=ABC123` instead of the direct Google URL.

**Fix — Option B (better):** Download photos to Supabase storage on first access (caching proxy).

---

## Phase 1: Core Experience (Week 2)

Make the preview sites actually sellable.

### P1-1: Add Content to Remaining 102 Previews

**Problem:** Only 99 of 201 previews have Google data. The other 102 are running on pure demo template content with fake everything.

**Fix:** Run `fetch-all-google-data.py` against ALL 201 previews, not just the premium-outreach.json list. The script currently reads from `premium-outreach.json` (99 leads). Update it to read from the actual `sites/preview-*/` directories.

**Implementation:**
```python
# In fetch-all-google-data.py, replace the lead loading with:
preview_dirs = [d for d in os.listdir(SITES_DIR) if d.startswith('preview-')]
```

### P1-2: Fix All Field Name Mismatches at the Component Level

**Problem:** Three separate bugs where content field names don't match component expectations. This pattern will keep recurring.

**Fix:** Instead of patching individual components, add fallback handling to the section BUILDERS:

```typescript
// In section-builders.ts, for each builder:
const buildFAQ: SectionBuilder = ({ content }) => {
  const faq = content?.home?.faq
  if (!faq?.items?.length) return null
  return {
    items: faq.items.map(item => ({
      q: item.q || item.question || '',
      a: item.a || item.answer || '',
    }))
  }
}
```

This way, the builder normalizes field names regardless of what the content file has.

### P1-3: Add Real WhatsApp Notification for Bookings

**Problem:** Booking notification logs to console but doesn't send.

**Fix:** Use Evolution API (running on the VPS at `evolution_evolution_api`) to send WhatsApp messages. The VPS already has Evolution API running:

```typescript
const INSTANCES = 'evolution_evolution_api'
// POST /message/sendText/{instance}
// Body: { number: "595982473078", text: "Nueva reserva..." }
```

**Implementation in `web/app/api/booking/create/route.ts`:**
```typescript
// After creating booking, send WhatsApp to business owner
const evolutionUrl = `http://evolution:8080/message/sendText/${process.env.EVOLUTION_INSTANCE}`
await fetch(evolutionUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'apiKey': process.env.EVOLUTION_API_KEY },
  body: JSON.stringify({
    number: ownerPhone,  // +595982473078
    text: `🆕 Nueva reserva en ${business.name}\n\nCliente: ${customer_name}\nTel: ${customer_phone}\nFecha: ${booking_date}\nHora: ${booking_time}`
  })
})
```

Check Evolution API docs at `http://72.61.44.159:8080/docs` or the Evolution API container logs.

### P1-4: Fix Cloudflare Pages Deployment

**Problem:** Two deployment targets with inconsistent behavior.

**Fix:** Pick ONE deployment target.

**Recommendation:** Use Cloudflare Pages as primary (auto-deploys from git). Keep VPS Docker as staging/fallback for testing.

**Steps:**
1. Cloudflare auto-deploys from `Main` branch
2. Remove `web/.next/`, `web/.vercel/`, `web/.open-next/` from git (add to .gitignore)
3. Configure Cloudflare Pages env vars (SUPABASE_URL, etc.) in Cloudflare dashboard
4. Point `paragu-ai.com` DNS to Cloudflare Pages
5. Shut down VPS Docker after migration

### P1-5: Add Pricing Page

**Problem:** No public pricing for preview recipients.

**Fix:** Create `/precios` page with:
- Plan Básico ₲290.000/mes — features list
- Plan Profesional ₲590.000/mes — features list  
- Plan Premium ₲990.000/mes — features list
- FAQ about setup, domain, content, cancellation
- CTA: "Quiero este plan" → WhatsApp link

Wire the pricing template in the outreach messages to link to this page.

---

## Phase 2: Client-Ready (Week 3)

Make the platform something clients can actually use.

### P2-1: Tenant Onboarding Flow

**Problem:** No path from "lead accepts" to "site is live".

**Build:**
1. Lead says "yes" via WhatsApp
2. Send them an onboarding link: `/onboarding/{token}`
3. Form collects: business name, logo upload, photos (6-10), services with prices, team photos, brand colors, social links
4. Form saves to `onboarding_tokens` table
5. Admin reviews and promotes from preview → production

**Database:** `onboarding_tokens` table already exists with: `id, lead_id, token, used, collected_data`

**Files to create:**
- `web/app/onboarding/[token]/page.tsx` — onboarding form
- `web/app/api/onboarding/submit/route.ts` — save collected data
- `web/scripts/promote-preview-to-live.ts` — script to build production site from onboarded data

### P2-2: Business Owner Dashboard

**Problem:** Business owners have no access to see/manage their site.

**Build:**
- `/dashboard` route (exists but needs content)
- Show: booking calendar, visitor count, reviews, profile editor
- Auth via Supabase + `tenant_users` table (already exists)

**Implementation:**
```typescript
// /app/dashboard/[slug]/page.tsx
export default async function DashboardPage({ slug }) {
  const bookings = await getBookings(slug)
  const stats = await getStats(slug)  // page views, bookings this month
  return <Dashboard bookings={bookings} stats={stats} />
}
```

### P2-3: Content Editor for Clients

**Problem:** Changing a phone number requires a developer.

**Build a simple editor:**
```typescript
// /app/dashboard/[slug]/edit/page.tsx
// Loads the site's content JSON
// Client edits fields in a form
// Saves to Supabase (overrides file-based content at runtime)
```

**Data flow:** Content loader checks Supabase first → if override exists, use it → fall back to file JSON.

**Database:** `tenant_content_overrides` table:
```sql
CREATE TABLE tenant_content_overrides (
  site_slug TEXT PRIMARY KEY,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ
);
```

### P2-4: Fix Cron Jobs (Env Issue)

**Problem:** All cron routes 500 with `Missing required: NEXT_PUBLIC_SUPABASE_URL`.

**Root Cause:** `NEXT_PUBLIC_*` vars are inlined by Next.js at BUILD time, but the Docker build context doesn't have them. At RUN time, they're read from `process.env` but the standalone server doesn't inherit them properly.

**Fix:** Add `ENV NEXT_PUBLIC_SUPABASE_URL=...` to the Dockerfile (same as SUPABASE_SERVICE_ROLE_KEY).

**In `web/Dockerfile`, add:**
```dockerfile
ENV NEXT_PUBLIC_SUPABASE_URL=https://qyvokpribmbrosafntqa.supabase.co
```

This ensures the var is available both at build time (for inlining) and at runtime.

---

## Phase 3: Premium Features (Week 4)

Features that differentiate us from "just a template."

### P3-1: Instagram Feed Integration

**Problem:** 60%+ of our leads have active Instagram accounts. We should show their feed on their site.

**Build:** `instagram-feed-section.tsx` component that:
- Accepts Instagram handle from site.json
- Fetches recent posts (via Instagram Basic Display API or scraping)
- Renders grid of recent posts
- Links to Instagram profile

### P3-2: Before/After Gallery (Critical for Depilación)

**Problem:** For laser hair removal clinics, before/after photos are the #1 conversion driver. We don't have them.

**Build:** Slider component showing before → after on hover/swipe.

### P3-3: SMS/WhatsApp Booking Reminders

**Problem:** 30% of booked appointments are no-shows. An automated reminder 24h before would cut this dramatically.

**Build:** Route that checks upcoming bookings → sends WhatsApp reminder via Evolution API.

### P3-4: Product E-commerce for All Types

**Problem:** Product catalog exists but only Superspuma uses it. Barberias could sell pomade, Spas could sell skincare products, etc.

**Fix:** Add `productCatalog` section to all preview pages with sample products.

### P3-5: Google Business Profile Sync

**Problem:** We fetch Google reviews once. They go stale.

**Build:** Daily cron that re-fetches reviews from Places API and updates the content.

---

## Phase 4: Scale (Month 2)

### P4-1: Content Database Migration

Move all tenant content from JSON files to Supabase tables.

### P4-2: Automated Outreach Pipeline

- Daily cron: pick 10 leads, send initial WhatsApp via Evolution API
- Track opens/clicks/replies
- Auto-follow-up after 3 days, 7 days
- Flag interested leads for human follow-up

### P4-3: Custom Domain Automation

- Client buys domain → they point NS to us
- We auto-configure Cloudflare DNS + SSL
- Site goes live at their domain

---

## Quick Wins (Do Today)

| # | Task | Time | Impact |
|---|------|------|--------|
| 1 | Fix `.map()` guards in 3 components | 30 min | 28 gym previews fixed |
| 2 | Add null check to FAQ/testimonials section builders | 15 min | Empty sections hidden |
| 3 | Run `fetch-all-google-data.py` against all 201 dirs | 10 min | All previews get real content |
| 4 | Create photo proxy API route | 1 hr | API key hidden from frontend |
| 5 | Configure Evolution API for booking notifications | 2 hr | Booking actually works |
| 6 | Add `NEXT_PUBLIC_SUPABASE_URL` to Dockerfile | 5 min | Cron jobs fixed |

---

## Summary by Priority

| Priority | Count | Key Items |
|----------|-------|-----------|
| 🔴 Critical (P0) | 5 | Gym crashes, booking notifications, CSP, empty sections, exposed API key |
| 🟡 High (P1) | 5 | 102 remaining previews, field name normalization, real WhatsApp send, deployment target, pricing page |
| 🟢 Medium (P2) | 4 | Onboarding flow, business dashboard, content editor, cron env fix |
| 🔵 Premium (P3) | 5 | Instagram feed, before/after gallery, booking reminders, product ecommerce, Google sync |
| ⚪ Scale (P4) | 3 | Content DB, automated outreach, custom domains |

**Total: 22 items. Estimated: 4-6 weeks for a single developer.**
