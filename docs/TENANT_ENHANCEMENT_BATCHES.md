# Tenant Enhancement Batches: Peluquería & Gimnasio

Complete feature enhancement roadmap to maximize conversions for beauty and fitness tenants.

**Total Est. Duration:** 3 weeks  
**Total Features:** 9 major enhancements  
**Expected Impact:** 40-60% conversion improvement

---

## BATCH 1: Visual Impact (Quick Wins) - 1 day
**Focus:** Make demos more visually compelling

### 1.1 Before/After Gallery (Peluquería)
**Why:** #1 conversion driver for salons - clients want to see results
**Implementation:**
- New section: `before-after-slider`
- Swipeable photo comparisons
- Service type labels (Corte, Color, Keratina)
- Stylist attribution

**Files:**
```
web/components/sections/before-after-section.tsx (NEW)
sites/demo-peluqueria/content/home.transformations.json (NEW)
sites/demo-peluqueria/pages/home.json (UPDATE - add section)
```

### 1.2 Member Transformations (Gimnasio)
**Why:** Social proof for fitness - "if they can, I can"
**Implementation:**
- New section: `transformation-gallery`
- Progress timeline (3mo, 6mo, 12mo)
- Member quotes
- Before/after or progress photos

**Files:**
```
web/components/sections/transformation-section.tsx (NEW)
sites/demo-gimnasio/content/home.transformations.json (NEW)
sites/demo-gimnasio/pages/home.json (UPDATE - add section)
```

### 1.3 Promotional Banner
**Why:** Creates urgency, drives immediate action
**Implementation:**
- New section: `promo-banner`
- Countdown timer for limited offers
- Dismissible
- Rotating promotions

**Files:**
```
web/components/sections/promo-banner-section.tsx (NEW)
sites/demo-peluqueria/content/home.promo.json (NEW)
sites/demo-gimnasio/content/home.promo.json (NEW)
```

**Success Criteria:**
- [ ] Both demos have gallery sections
- [ ] Promotional banner visible on both sites
- [ ] Mobile responsive
- [ ] Smooth animations

---

## BATCH 2: Staff Enhancement - 2 days
**Focus:** Personal connection + specific booking

### 2.1 Individual Staff Pages
**Why:** Clients have favorites; want to book with specific people
**Implementation:**
- Dynamic routes: `/equipo/[member-slug]`
- Individual profile pages
- Services they offer
- Availability calendar (mini)
- Reviews specific to them

**Files:**
```
web/app/s/[locale]/[site]/equipo/[member]/page.tsx (NEW)
web/components/sections/team-detail-section.tsx (NEW)
```

### 2.2 "Book with [Name]" Buttons
**Why:** Direct path to booking preferred provider
**Implementation:**
- Add to team section cards
- Pre-selects staff in booking flow
- Deep link from Instagram bios

**Files:**
```
web/components/sections/team-section.tsx (UPDATE)
web/components/booking/staff-selector.tsx (UPDATE)
```

### 2.3 Staff Specialties & Certifications
**Why:** Builds trust and expertise credibility
**Implementation:**
- Tags for specialties (Color Expert, Yoga Certified)
- Certification badges
- Years of experience
- Portfolio links

**Files:**
```
web/components/ui/certification-badge.tsx (NEW)
sites/demo-peluqueria/content/team.profiles.json (UPDATE)
sites/demo-gimnasio/content/team.profiles.json (UPDATE)
```

**Success Criteria:**
- [ ] Clicking team member opens profile page
- [ ] Can book specific person
- [ ] Specialties visible on cards
- [ ] Mobile optimized

---

## BATCH 3: Real Booking System - 3 days
**Focus:** Replace WhatsApp-only booking with self-service

### 3.1 Service Selector
**Why:** Visual selection drives higher conversion than text lists
**Implementation:**
- Grid of service cards with images
- Duration and price visible
- Category filtering
- Popular/recommended badges

**Files:**
```
web/components/booking/service-grid.tsx (NEW)
web/components/booking/service-card.tsx (NEW)
```

### 3.2 Availability Calendar
**Why:** Shows real openings, reduces back-and-forth
**Implementation:**
- Week view calendar
- Time slot grid
- Real-time availability from database
- Staff selection affects availability

**Files:**
```
web/components/booking/availability-calendar.tsx (NEW)
web/lib/booking/availability.ts (NEW)
web/app/api/booking/availability/route.ts (NEW)
```

### 3.3 Booking Confirmation Flow
**Why:** Complete the transaction smoothly
**Implementation:**
- Booking summary
- Customer details form
- Confirmation modal
- WhatsApp notification to business
- Email confirmation to customer

**Files:**
```
web/components/booking/booking-wizard.tsx (UPDATE)
web/app/api/booking/create/route.ts (NEW)
supabase/migrations/2026XXXX_create_bookings_table.sql (NEW)
```

### 3.4 Booking Management (Admin)
**Why:** Business needs to manage appointments
**Implementation:**
- Day/week calendar view
- Accept/reschedule/cancel
- Block time slots
- Customer notes

**Files:**
```
web/app/admin/bookings/page.tsx (NEW)
web/components/admin/booking-calendar.tsx (NEW)
```

**Success Criteria:**
- [ ] Can book without WhatsApp
- [ ] Calendar shows real availability
- [ ] Business gets notified
- [ ] Customer gets confirmation
- [ ] Admin can manage bookings

---

## BATCH 4: Dynamic Class Schedule - 2 days
**Focus:** Gimnasio-specific enhancement

### 4.1 Weekly Schedule View
**Why:** Members check this multiple times per week
**Implementation:**
- Week grid (Mon-Sun)
- Time slots (6am-10pm)
- Class cards with instructor
- Filter by class type

**Files:**
```
web/components/sections/class-schedule-section.tsx (NEW - full version)
web/components/schedule/weekly-grid.tsx (NEW)
```

### 4.2 Class Booking Integration
**Why:** Reserve spot in popular classes
**Implementation:**
- "Reservar" button per class
- Capacity indicator (8/20 spots left)
- Waitlist option when full
- Check-in QR code

**Files:**
```
web/components/schedule/class-card.tsx (NEW)
web/app/api/classes/reserve/route.ts (NEW)
```

### 4.3 Class Details Modal
**Why:** Members want to know what to expect
**Implementation:**
- Description and intensity level
- Required equipment
- Instructor bio
- Related classes

**Files:**
```
web/components/schedule/class-detail-modal.tsx (NEW)
```

**Success Criteria:**
- [ ] Full weekly schedule visible
- [ ] Can reserve class spots
- [ ] Capacity tracking works
- [ ] Mobile-friendly grid

---

## BATCH 5: Packages & Gift Cards - 2 days
**Focus:** Increase average order value

### 5.1 Service Packages
**Why:** Bundles increase spend per customer
**Implementation:**
- Package cards (e.g., "Pack Novia")
- Savings calculation
- Buy button
- Usage tracking

**Files:**
```
web/components/sections/packages-section.tsx (NEW)
sites/demo-peluqueria/content/home.packages.json (NEW)
sites/demo-gimnasio/content/home.packages.json (NEW)
```

### 5.2 Gift Cards
**Why:** Perfect for birthdays/holidays; new customer acquisition
**Implementation:**
- Digital gift card purchase
- Customizable amount
- Email delivery
- Redemption tracking
- Expiration management

**Files:**
```
web/app/s/[locale]/[site]/gift-cards/page.tsx (NEW)
web/components/gift-cards/gift-card-form.tsx (NEW)
web/app/api/gift-cards/create/route.ts (NEW)
supabase/migrations/2026XXXX_create_gift_cards_table.sql (NEW)
```

**Success Criteria:**
- [ ] Packages visible and purchasable
- [ ] Gift cards can be bought online
- [ ] Gift card emails sent
- [ ] Redemption system works

---

## BATCH 6: Review Generation System - 2 days
**Focus:** Social proof automation

### 6.1 Post-Appointment Review Requests
**Why:** Automate review collection
**Implementation:**
- WhatsApp message 2 hours after appointment
- Direct link to review form
- One-tap star rating
- Photo upload option

**Files:**
```
web/app/api/reviews/request/route.ts (NEW)
web/lib/outreach/review-requests.ts (NEW)
```

### 6.2 Review Display Widget
**Why:** Show reviews with context
**Implementation:**
- Filter by service type
- Sort by recent/highest
- Photo reviews highlighted
- Business response capability

**Files:**
```
web/components/sections/reviews-section.tsx (UPDATE)
web/components/reviews/review-card.tsx (NEW)
```

### 6.3 Review Dashboard (Admin)
**Why:** Monitor and respond to feedback
**Implementation:**
- List all reviews
- Star rating analytics
- Response composer
- Flag inappropriate reviews

**Files:**
```
web/app/admin/reviews/page.tsx (NEW)
```

**Success Criteria:**
- [ ] Automatic review requests sent
- [ ] Reviews displayed on site
- [ ] Admin can respond
- [ ] Analytics visible

---

## BATCH 7: Membership Management - 3 days
**Focus:** Gimnasio recurring revenue

### 7.1 Online Membership Signup
**Why:** Self-service signup reduces friction
**Implementation:**
- Membership tier comparison
- Registration form
- Payment integration (Pagopar)
- Automatic member portal creation

**Files:**
```
web/app/s/[locale]/[site]/memberships/page.tsx (NEW)
web/components/memberships/signup-wizard.tsx (NEW)
```

### 7.2 Member Portal
**Why:** Members want self-service
**Implementation:**
- Login with phone/email
- View membership status
- Freeze/cancel membership
- Booking history
- Class reservations

**Files:**
```
web/app/s/[locale]/[site]/member/page.tsx (NEW)
web/components/member/member-dashboard.tsx (NEW)
```

### 7.3 Recurring Billing
**Why:** Gym revenue depends on subscriptions
**Implementation:**
- Monthly automatic billing
- Failed payment retry logic
- Cancellation flows
- Upgrade/downgrade tiers

**Files:**
```
web/lib/billing/subscriptions.ts (NEW)
web/app/api/billing/recurring/route.ts (NEW)
```

**Success Criteria:**
- [ ] Can sign up online
- [ ] Automatic monthly billing
- [ ] Member portal functional
- [ ] Payment failures handled

---

## BATCH 8: Products/Inventory - 2 days
**Focus:** Additional revenue stream

### 8.1 Product Catalog
**Why:** Cross-sell opportunity
**Implementation:**
- Product grid
- Categories (Shampoo, Supplements, Gear)
- Pricing and stock status
- "Add to cart" functionality

**Files:**
```
web/components/sections/product-catalog-section.tsx (NEW)
web/app/s/[locale]/[site]/tienda/page.tsx (NEW)
```

### 8.2 Simple Checkout
**Why:** Complete the purchase
**Implementation:**
- Cart functionality
- Delivery/pickup options
- Payment integration
- Order tracking

**Files:**
```
web/components/commerce/mini-cart.tsx (NEW)
web/app/api/orders/create/route.ts (NEW)
```

**Success Criteria:**
- [ ] Products browsable
- [ ] Cart functional
- [ ] Checkout works
- [ ] Orders trackable

---

## BATCH 9: Waitlist System - 2 days
**Focus:** Capture demand when fully booked

### 9.1 Class Waitlist
**Why:** Don't lose customers when class is full
**Implementation:**
- "Join Waitlist" button when full
- Automatic notification on cancellation
- 10-minute booking window
- Priority ordering

**Files:**
```
web/components/schedule/waitlist-button.tsx (NEW)
web/app/api/classes/waitlist/route.ts (NEW)
```

### 9.2 Appointment Waitlist
**Why:** Capture demand for popular times/staff
**Implementation:**
- "Notify me when available" for time slots
- Preferred staff selection
- Flexible date range
- SMS/WhatsApp notification

**Files:**
```
web/components/booking/waitlist-option.tsx (NEW)
web/app/api/booking/waitlist/route.ts (NEW)
```

**Success Criteria:**
- [ ] Can join waitlist when full
- [ ] Automatic notifications work
- [ ] Booking window enforced
- [ ] Priority system functional

---

## Implementation Notes

### Database Migrations Needed
```sql
-- Batch 3: Bookings
CREATE TABLE bookings (...);

-- Batch 5: Gift Cards  
CREATE TABLE gift_cards (...);

-- Batch 6: Reviews
CREATE TABLE reviews (...);

-- Batch 7: Memberships
CREATE TABLE memberships (...);

-- Batch 8: Products
CREATE TABLE products (...);
CREATE TABLE orders (...);

-- Batch 9: Waitlists
CREATE TABLE waitlists (...);
```

### API Endpoints to Create
```
POST /api/booking/create
GET  /api/booking/availability
POST /api/classes/reserve
POST /api/gift-cards/create
POST /api/reviews/submit
POST /api/billing/recurring
POST /api/orders/create
POST /api/waitlist/join
```

### Components to Build
```
BeforeAfterSlider
TransformationGallery
PromoBanner
StaffProfilePage
AvailabilityCalendar
BookingWizardV2
WeeklyScheduleGrid
ClassCard
PackageCard
GiftCardForm
ReviewRequestSystem
MemberPortal
ProductGrid
WaitlistButton
```

---

## Success Metrics

**Batch 1-3 (Core Booking):**
- Demo-to-paid conversion: 15% → 25%
- Booking abandonment: 40% → 20%
- Average time to book: 2 days → 2 minutes

**Batch 4-7 (Engagement):**
- Member retention: 60% → 75%
- Average order value: +30%
- Review collection: 5/month → 50/month

**Batch 8-9 (Advanced):**
- Additional revenue from products: +15%
- Waitlist conversion: 40%
- Class utilization: 75% → 90%

---

**Ready to start Batch 1?** Say "implement batch 1" and I'll begin immediately.
