# Easy Wins: Components to Build for Future Clients

> Audit of 1,969 business types across 23 verticals. Gaps between what verticals allow and what the registry provides.
> Priority: Impact × Frequency × Implementation Effort

---

## 🔴 P0: Fix Broken Allowed Sections (14 sections referenced but non-functional)

These are listed in verticals' allowedSections but have no registry entry AND no alias. Using them in a page.json causes a 404.

| Section | Listed In Verticals | Fix Required |
|---------|-------------------|-------------|
| `booking-wizard` | 1 (relocacion) | Add alias → existing booking-embed |
| `business-hours` | 8 | Add alias → open-hours-status |
| `case-studies` | 3 | Add alias → features (already resolves via alias) |
| `delivery-links` | 1 | Add alias → cta-banner |
| `events-calendar` | 2 (arts, sports) | Add alias → event-venues |
| `google-maps` | 9 | Add alias → contact (location block resolves) |
| `insurance-list` | 1 | Add alias → features |
| `legal-disclaimer` | 1 | Add alias → compliance-disclaimer-footer |
| `product-grid` | 1 | Add alias → product-catalog |
| `resource-list` | 23 | Add alias → resources-list |
| `reviews-widget` | 6 | Add alias → google-reviews-widget or reviews |
| `service-area-map` | 2 | Add alias → why-destination |
| `service-menu` | 3 | Add alias → services |
| `staff-selector` | 1 | Add alias → features |

**Effort**: 30 minutes (add aliases to SECTION_ALIASES)
**Impact**: 14 broken sections fixed. Every vertical that lists these now works.

---

## 🟡 P1: High-Value New Components (Create from scratch)

### 1. `booking-wizard` — Multi-step Booking
**Why**: 23 verticals list `booking` as allowed. Currently resolves to `booking-embed` (iframe) or `booking-section` (service list). Neither is a true booking flow.
**What**: Multi-step: select service → select staff → select date/time → confirm → WhatsApp/email notification.
**Effort**: 4 hours
**Reuse**: Law firms, salons, spas, clinics, consulting — any service business.

### 2. `google-maps-section` — Map Embed
**Why**: 9 verticals list `google-maps`. Currently aliases to `contact` which has split/form-only variants. No actual map component.
**What**: Google Maps iframe embed with location pin, directions link, nearby landmarks.
**Effort**: 1 hour
**Reuse**: Every business type with a physical location (90%+ of our client base).

### 3. `hero-parallax` / `hero-video`
**Why**: 2026 trend. All 23 verticals use `hero`. Currently has 3 variants (image, split, minimal). No video or parallax.
**What**: Background video with overlay text. Scrolling parallax effect.
**Effort**: 2 hours
**Reuse**: Every site.

### 4. `floating-cta` — Smart Sticky CTA
**Why**: Current `whatsapp-float` is just a WhatsApp button. A smart CTA could show different actions based on scroll position.
**What**: Sticky bottom bar that shows: "Book now" → scrolls → "Call us" → scrolls → "WhatsApp". Configurable actions.
**Effort**: 1.5 hours
**Reuse**: Every site.

### 5. `cookie-consent` — GDPR-Compliant Banner
**Why**: Needed for EU clients. Currently hardcoded in compose-site. Should be a configurable section.
**What**: Cookie consent banner with configurable text, accept/decline buttons, privacy policy link.
**Effort**: 1 hour
**Reuse**: International-facing sites (relocation, legal, immigration).

---

## 🟢 P2: Component Enhancements (Add variants to existing)

### 1. `hero` — Add `search` variant
For: Law firm directories, large service marketplaces, real estate.
Props: `placeholder`, `suggestions: string[]`, `onSearch: (query) => void`
Effort: 1 hour

### 2. `header` — Add `transparent` and `sticky` variants
For: Premium/corporate sites.
- `transparent`: Transparent background until scroll
- `sticky`: Always fixed at top
Effort: 2 hours
Reuse: Every site (should be default behavior).

### 3. `team` — Add `grid-photos` variant
For: Law firms, agencies, clinics — large photo + name overlay like Irun Villamayor.
Effort: 1.5 hours

### 4. `footer` — Add `newsletter` variant
Currently: standard, minimal. Add: newsletter signup integrated into footer.
Effort: 1 hour

### 5. `testimonials` — Add `video-tile` variant
For: Premium sites, agencies. Grid of video testimonial thumbnails that play on click.
Effort: 2 hours

---

## 🔵 P3: Abstraction / Consolidation

### 1. Auto-add all missing alias entries
14 broken sections need aliases. This is a regex find-and-replace in section-registry.ts.
Effort: 30 min

### 2. Add content-grid to all verticals' allowedSections
Currently 0 verticals list `content-grid`. It needs to be added to all 23 verticals.
Effort: 5 min (sed one-liner)

### 3. Remove duplicate components
- `blog-social-share` → can be a prop on blog-post
- `conveyor-belt-strip` → alias to features
- `success-stories` → alias to testimonials
- `testimonial-video` → alias to testimonials
- `sushi-menu-sections` → alias to menu-categorized-priced
Effort: 15 min

---

## Quick Implementation Summary

| Priority | Task | Effort | Impact |
|----------|------|--------|--------|
| 🔴 | Add 14 aliases for broken allowed sections | 30 min | Fixes 14 broken features |
| 🔴 | Add content-grid to all 23 verticals | 5 min | Enables new unified grid system |
| 🟡 | booking-wizard section | 4h | Core feature for service businesses |
| 🟡 | google-maps section | 1h | Needed by 9 verticals |
| 🟡 | floating-cta section | 1.5h | Every site benefits |
| 🟡 | hero video/parallax variants | 2h | 2026 trend, every site |
| 🟢 | team grid-photos variant | 1.5h | Law firms, agencies |
| 🟢 | header sticky/transparent | 2h | Every site |
| 🔵 | Clean up 5 duplicate registry sections | 15 min | Less bloat |
| **Total** | **~12 hours** | | |
