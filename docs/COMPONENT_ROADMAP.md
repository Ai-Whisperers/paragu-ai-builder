# Component Implementation Roadmap — 50 New Sections

Current platform: 121 components, 68 registered sections, 23 verticals, 15 live tenants.
This roadmap adds 50 new sections organized by priority and implementation phase.

---

## Phase 0: Foundation Pattern (Add 1 helper)

### 0.1 Commerce Helpers

| # | File | What | Purpose |
|---|---|---|---|
| H1 | `web/lib/commerce/payment-icons.tsx` | SVG icons for Bancard, Pagopar, Mercado Pago, Tigo Money, Personal Pay, Visa, Mastercard, Efectivo | Reusable payment icon set used by multiple new sections |

---

## Phase 1: Paraguay-Local Essentials (P0 — 7 components)

These are needed by ALL existing tenants and are currently missing or hardcoded.

### 1.1 payment-methods

| Field | Value |
|---|---|
| **File** | `web/components/sections/commerce/payment-methods-section.tsx` |
| **Registry** | `payment-methods: { id: 'payment-methods', defaultVariant: 'strip', variants: ['strip', 'grid', 'compact'] }` |
| **Aliases** | `paymentMethods: 'payment-methods'`, `paymentIcons: 'payment-methods'` |
| **`use client`** | No (server component) |
| **Props** | `methods?: Array<{ id: string; name: string; icon: string }>` — default shows all supported PY methods |
| **Reference** | Similar to `trust-badges` — icon strip, different variants for layout |
| **Sample** | Bancard, Pagopar, Mercado Pago, Tigo Money, Personal Pay, Efectivo, Transferencia |
| **DB/API** | None — static list from config or defaults |

### 1.2 currency-display

| Field | Value |
|---|---|
| **File** | `web/components/sections/commerce/currency-display-section.tsx` |
| **Registry** | `currency-display: { id: 'currency-display', defaultVariant: 'toggle', variants: ['toggle', 'inline', 'dropdown'] }` |
| **Aliases** | `currencyToggle: 'currency-display'` |
| **`use client`** | Yes (toggle/dropdown interaction) |
| **Props** | `currencies?: Array<{ code: string; symbol: string; label: string }>`, `defaultCurrency?: string` |
| **Reference** | Similar to `language-selector-section` |
| **Sample** | Gs. / USD toggle |
| **DB/API** | Reads exchange rates from existing `exchange_rates` table |

### 1.3 delivery-zones

| Field | Value |
|---|---|
| **File** | `web/components/sections/commerce/delivery-zones-section.tsx` |
| **Registry** | `delivery-zones: { id: 'delivery-zones', defaultVariant: 'list', variants: ['list', 'cards', 'map'] }` |
| **Aliases** | `deliveryZones: 'delivery-zones'`, `cobertura: 'delivery-zones'` |
| **`use client`** | No |
| **Props** | `zones?: Array<{ name: string; fee: string; freeThreshold?: string; estimatedDays: string }>` |
| **Reference** | Similar to `branches-section` |
| **Sample** | Asunción (gratis +300k), San Lorenzo (Gs. 15.000), Luque (Gs. 20.000) |
| **DB/API** | Reads from `shipping_zones` table if available |

### 1.4 shipping-calculator

| Field | Value |
|---|---|
| **File** | `web/components/sections/commerce/shipping-calculator-section.tsx` |
| **Registry** | `shipping-calculator: { id: 'shipping-calculator', defaultVariant: 'form', variants: ['form', 'simple'] }` |
| **Aliases** | `shippingCalculator: 'shipping-calculator'`, `calcular-envio: 'shipping-calculator'` |
| **`use client`** | Yes (form inputs, calculation) |
| **Props** | `zones?: Array<{ id: string; name: string; fee: number; freeThreshold: number }>`, `productWeight?: number` |
| **Reference** | Similar to `delivery-calculator-section` (granja-cabral) |
| **Sample** | Select zone → show cost + ETA |
| **DB/API** | Reads from `shipping_zones` table |

### 1.5 ruc-timbrado-display

| Field | Value |
|---|---|
| **File** | `web/components/sections/compliance/ruc-timbrado-display-section.tsx` |
| **Registry** | `ruc-timbrado-display: { id: 'ruc-timbrado-display', defaultVariant: 'footer', variants: ['footer', 'inline', 'badge'] }` |
| **Aliases** | `rucInfo: 'ruc-timbrado-display'`, `timbrado: 'ruc-timbrado-display'` |
| **`use client`** | No |
| **Props** | `ruc?: string`, `businessName?: string`, `timbrado?: string`, `regime?: string` |
| **Reference** | Similar to `compliance-disclaimer-footer-section` |
| **Sample** | "RUC 80012345-6 · Bufete Méndez & Asociados · Timbrado 123-456-789" |
| **DB/API** | From business data or tenant content |

### 1.6 horarios-atencion (enhanced)

| Field | Value |
|---|---|
| **File** | `web/components/sections/specialty/horarios-atencion-section.tsx` |
| **Registry** | `horarios-atencion: { id: 'horarios-atencion', defaultVariant: 'table', variants: ['table', 'list', 'badge', 'inline'] }` |
| **Aliases** | `businessHours: 'horarios-atencion'`, `hours: 'horarios-atencion'` |
| **`use client`** | Yes (open-now indicator) |
| **Props** | `hours?: Record<string, string>`, `showStatus?: boolean` |
| **Reference** | Extends `open-hours-status-section` with more variants |
| **Sample** | "Abierto ahora — Lun-Vie 08:00-19:00" |
| **DB/API** | None |

### 1.7 whatsapp-order-form

| Field | Value |
|---|---|
| **File** | `web/components/sections/commerce/whatsapp-order-form-section.tsx` |
| **Registry** | `whatsapp-order-form: { id: 'whatsapp-order-form', defaultVariant: 'modal', variants: ['modal', 'inline', 'sidebar'] }` |
| **Aliases** | `whatsappOrder: 'whatsapp-order-form'`, `pedidoWhatsApp: 'whatsapp-order-form'` |
| **`use client`** | Yes (form interactions, product select) |
| **Props** | `products?: Array<{ name: string; price: string }>`, `whatsapp: string`, `messageTemplate?: string` |
| **Reference** | Extends `whatsapp-float` with full product form |
| **Sample** | Select product → add quantity → write message → "Enviar por WhatsApp" |
| **DB/API** | Uses existing storefront API for products |

---

## Phase 2: Business Operations (P1 — 8 components)

### 2.1 appointment-list

| Field | Value |
|---|---|
| **File** | `web/components/sections/forms/appointment-list-section.tsx` |
| **Registry** | `appointment-list: { id: 'appointment-list', defaultVariant: 'cards', variants: ['cards', 'list', 'calendar'] }` |
| **`use client`** | Yes |
| **Props** | `appointments?: Array<{ date: string; time: string; service: string; status: string }>` |
| **Reference** | Similar to `booking-section` |
| **DB/API** | Reads from `bookings` table |

### 2.2 invoice-display

| Field | Value |
|---|---|
| **File** | `web/components/sections/commerce/invoice-display-section.tsx` |
| **Registry** | `invoice-display: { id: 'invoice-display', defaultVariant: 'table', variants: ['table', 'card', 'detail'] }` |
| **`use client`** | No |
| **Props** | `invoices?: Array<{ number: string; date: string; amount: string; status: string; pdfUrl?: string }>` |
| **Reference** | Similar to `order-confirmation` |
| **DB/API** | Reads from `orders` + `payments` tables |

### 2.3 service-packages

| Field | Value |
|---|---|
| **File** | `web/components/sections/commerce/service-packages-section.tsx` |
| **Registry** | `service-packages: { id: 'service-packages', defaultVariant: 'cards', variants: ['cards', 'tiered', 'comparison'] }` |
| **`use client`** | No |
| **Props** | `packages?: Array<{ name: string; price: string; services: string[]; savings: string; popular?: boolean }>` |
| **Reference** | Similar to `pricing-table-section` |
| **DB/API** | None — static content |

### 2.4 membership-card

| Field | Value |
|---|---|
| **File** | `web/components/sections/commerce/membership-card-section.tsx` |
| **Registry** | `membership-card: { id: 'membership-card', defaultVariant: 'card', variants: ['card', 'inline', 'badge'] }` |
| **`use client`** | No |
| **Props** | `tier?: string`, `points?: number`, `benefits?: string[]`, `expiryDate?: string` |
| **Reference** | Similar to `regulatory-status-badge-section` |
| **DB/API** | None — static content |

### 2.5 appointment-reminder

| Field | Value |
|---|---|
| **File** | `web/components/sections/forms/appointment-reminder-section.tsx` |
| **Registry** | `appointment-reminder: { id: 'appointment-reminder', defaultVariant: 'banner', variants: ['banner', 'card', 'inline'] }` |
| **`use client`** | Yes (countdown timer) |
| **Props** | `appointment?: { date: string; time: string; service: string }` |
| **Reference** | Similar to `countdown-timer-section` |
| **DB/API** | Reads from `bookings` table |

### 2.6 order-tracking

| Field | Value |
|---|---|
| **File** | `web/components/sections/commerce/order-tracking-section.tsx` |
| **Registry** | `order-tracking: { id: 'order-tracking', defaultVariant: 'timeline', variants: ['timeline', 'steps', 'card'] }` |
| **`use client`** | No |
| **Props** | `orderId?: string`, `status?: string`, `steps?: Array<{ label: string; date?: string; completed: boolean }>` |
| **Reference** | Similar to `process-timeline-section` |
| **DB/API** | Reads from `orders` table |

### 2.7 warranty-info

| Field | Value |
|---|---|
| **File** | `web/components/sections/commerce/warranty-info-section.tsx` |
| **Registry** | `warranty-info: { id: 'warranty-info', defaultVariant: 'accordion', variants: ['accordion', 'cards', 'inline'] }` |
| **`use client`** | No |
| **Props** | `products?: Array<{ name: string; warrantyPeriod: string; terms: string }>` |
| **Reference** | Similar to `pdp-care-guide` |
| **DB/API** | None — static content |

### 2.8 loyalty-progress

| Field | Value |
|---|---|
| **File** | `web/components/sections/commerce/loyalty-progress-section.tsx` |
| **Registry** | `loyalty-progress: { id: 'loyalty-progress', defaultVariant: 'bar', variants: ['bar', 'card', 'tier'] }` |
| **`use client`** | No |
| **Props** | `currentPoints?: number`, `nextTier?: string`, `pointsToNext?: number`, `tiers?: Array<{ name: string; minPoints: number; benefits: string[] }>` |
| **Reference** | Similar to `stats-counter-section` |
| **DB/API** | None — static content |

---

## Phase 3: Healthcare (P1 — 5 components)

### 3.1 doctor-profile

| Field | Value |
|---|---|
| **File** | `web/components/sections/specialty/doctor-profile-section.tsx` |
| **Registry** | `doctor-profile: { id: 'doctor-profile', defaultVariant: 'card', variants: ['card', 'list', 'detailed'] }` |
| **`use client`** | No |
| **Props** | `doctors?: Array<{ name: string; specialty: string; credentials: string[]; imageUrl?: string; bio?: string; schedule?: string; bookable?: boolean }>` |
| **Reference** | Similar to `team-section` |
| **DB/API** | Reads from `staff_members` table |

### 3.2 insurance-accepted

| Field | Value |
|---|---|
| **File** | `web/components/sections/specialty/insurance-accepted-section.tsx` |
| **Registry** | `insurance-accepted: { id: 'insurance-accepted', defaultVariant: 'grid', variants: ['grid', 'list', 'carousel'] }` |
| **`use client`** | No |
| **Props** | `insurances?: Array<{ name: string; logo?: string }>` |
| **Reference** | Similar to `logo-strip-section` |
| **DB/API** | None — static content |

### 3.3 symptom-checker

| Field | Value |
|---|---|
| **File** | `web/components/sections/forms/symptom-checker-section.tsx` |
| **Registry** | `symptom-checker: { id: 'symptom-checker', defaultVariant: 'wizard', variants: ['wizard', 'simple'] }` |
| **`use client`** | Yes (multi-step wizard) |
| **Props** | `symptoms?: Array<{ name: string; specialty: string }>`, `locale?: string` |
| **Reference** | Similar to `intake-wizard-section` |
| **DB/API** | None — static content |

### 3.4 health-tips-carousel

| Field | Value |
|---|---|
| **File** | `web/components/sections/social/health-tips-carousel-section.tsx` |
| **Registry** | `health-tips-carousel: { id: 'health-tips-carousel', defaultVariant: 'carousel', variants: ['carousel', 'grid'] }` |
| **`use client`** | Yes (carousel interaction) |
| **Props** | `tips?: Array<{ title: string; description: string; image?: string; link?: string }>` |
| **Reference** | Similar to `testimonials-section` (carousel variant) |
| **DB/API** | None — static content |

### 3.5 telemedicine-banner

| Field | Value |
|---|---|
| **File** | `web/components/sections/hero/telemedicine-banner-section.tsx` |
| **Registry** | `telemedicine-banner: { id: 'telemedicine-banner', defaultVariant: 'banner', variants: ['banner', 'card', 'float'] }` |
| **`use client`** | No |
| **Props** | `title?: string`, `description?: string`, `ctaText?: string`, `ctaHref?: string`, `platform?: string` |
| **Reference** | Similar to `cta-banner-section` |
| **DB/API** | None — static content |

---

## Phase 4: Food & Beverage (P2 — 5 components)

### 4.1 daily-menu

| Field | Value |
|---|---|
| **File** | `web/components/sections/specialty/daily-menu-section.tsx` |
| **Registry** | `daily-menu: { id: 'daily-menu', defaultVariant: 'grid', variants: ['grid', 'list', 'categorized'] }` |
| **`use client`** | No |
| **Props** | `date?: string`, `categories?: Array<{ name: string; items: Array<{ name: string; price: string; description?: string; image?: string }> }>` |
| **Reference** | Similar to `menu-categorized-priced-section` |
| **DB/API** | None — static content |

### 4.2 online-ordering

| Field | Value |
|---|---|
| **File** | `web/components/sections/commerce/online-ordering-section.tsx` |
| **Registry** | `online-ordering: { id: 'online-ordering', defaultVariant: 'modal', variants: ['modal', 'sidebar', 'page'] }` |
| **`use client`** | Yes (full cart + checkout interaction) |
| **Props** | `products?: Array<{ name: string; price: string; category: string; image?: string }>`, `whatsapp?: string` |
| **Reference** | Similar to `product-catalog-section` + `cart` |
| **DB/API** | Uses existing storefront API |

### 4.3 delivery-status

| Field | Value |
|---|---|
| **File** | `web/components/sections/commerce/delivery-status-section.tsx` |
| **Registry** | `delivery-status: { id: 'delivery-status', defaultVariant: 'timeline', variants: ['timeline', 'card', 'minimal'] }` |
| **`use client`** | No |
| **Props** | `orderId?: string`, `status?: string`, `steps?: Array<{ label: string; time?: string; completed: boolean }>`, `estimatedArrival?: string` |
| **Reference** | Similar to `order-tracking-section` |
| **DB/API** | Reads from `orders` table |

### 4.4 nutrition-info

| Field | Value |
|---|---|
| **File** | `web/components/sections/specialty/nutrition-info-section.tsx` |
| **Registry** | `nutrition-info: { id: 'nutrition-info', defaultVariant: 'table', variants: ['table', 'cards', 'icons'] }` |
| **`use client`** | No |
| **Props** | `items?: Array<{ name: string; calories?: number; protein?: string; carbs?: string; fat?: string; allergens?: string[] }>` |
| **Reference** | Similar to `pricing-table-section` |
| **DB/API** | None — static content |

### 4.5 reservation-form

| Field | Value |
|---|---|
| **File** | `web/components/sections/forms/reservation-form-section.tsx` |
| **Registry** | `reservation-form: { id: 'reservation-form', defaultVariant: 'standard', variants: ['standard', 'compact', 'full'] }` |
| **`use client`** | Yes (date/time picker) |
| **Props** | `restaurantName?: string`, `maxPartySize?: number`, `whatsapp?: string` |
| **Reference** | Similar to `booking-section` |
| **DB/API** | Reads from `bookings` + `availability_slots` tables |

---

## Phase 5: Education (P2 — 4 components)

### 5.1 course-catalog

| Field | Value |
|---|---|
| **File** | `web/components/sections/specialty/course-catalog-section.tsx` |
| **Registry** | `course-catalog: { id: 'course-catalog', defaultVariant: 'grid', variants: ['grid', 'list', 'cards'] }` |
| **Props** | `courses?: Array<{ name: string; description: string; duration: string; price: string; instructor?: string; startDate?: string; image?: string }>` |
| **Reference** | Similar to `product-catalog-section` |
| **DB/API** | None initially — static content |

### 5.2 class-enrollment

| Field | Value |
|---|---|
| **File** | `web/components/sections/forms/class-enrollment-section.tsx` |
| **Registry** | `class-enrollment: { id: 'class-enrollment', defaultVariant: 'form', variants: ['form', 'compact', 'multi-step'] }` |
| **`use client`** | Yes (form with validation) |
| **Props** | `courses?: Array<{ id: string; name: string }>`, `whatsapp?: string` |
| **Reference** | Similar to `lead-form-section` |
| **DB/API** | None — submits via WhatsApp |

### 5.3 instructor-profile

| Field | Value |
|---|---|
| **File** | `web/components/sections/specialty/instructor-profile-section.tsx` |
| **Registry** | `instructor-profile: { id: 'instructor-profile', defaultVariant: 'card', variants: ['card', 'list', 'detailed'] }` |
| **Props** | `instructors?: Array<{ name: string; title: string; bio?: string; imageUrl?: string; specialties?: string[]; social?: Record<string, string> }>` |
| **Reference** | Similar to `team-section` |
| **DB/API** | None — static content |

### 5.4 course-progress

| Field | Value |
|---|---|
| **File** | `web/components/sections/specialty/course-progress-section.tsx` |
| **Registry** | `course-progress: { id: 'course-progress', defaultVariant: 'bar', variants: ['bar', 'steps', 'card'] }` |
| **`use client`** | No |
| **Props** | `courseName?: string`, `completed?: number`, `total?: number`, `nextLesson?: string`, `nextDate?: string` |
| **Reference** | Similar to `stats-counter-section` |
| **DB/API** | None — static content |

---

## Phase 6: Real Estate (P2 — 3 components)

### 6.1 property-detail

| Field | Value |
|---|---|
| **File** | `web/components/sections/specialty/property-detail-section.tsx` |
| **Registry** | `property-detail: { id: 'property-detail', defaultVariant: 'gallery', variants: ['gallery', 'split', 'minimal'] }` |
| **`use client`** | Yes (image gallery interaction) |
| **Props** | `property?: { title: string; price: string; currency: string; beds: number; baths: number; area: string; description: string; images: string[]; location: string; features: string[] }` |
| **Reference** | Similar to existing `property-listings-section` but single item |
| **DB/API** | None — static content. Route at `/s/[locale]/[site]/propiedad/[slug]` |

### 6.2 property-search

| Field | Value |
|---|---|
| **File** | `web/components/sections/forms/property-search-section.tsx` |
| **Registry** | `property-search: { id: 'property-search', defaultVariant: 'full', variants: ['full', 'compact', 'inline'] }` |
| **`use client`** | Yes (search/filter interaction) |
| **Props** | `propertyTypes?: string[]`, `locations?: string[]`, `priceRange?: { min: number; max: number }`, `currency?: string` |
| **Reference** | Similar to `tienda-quick-filters` |
| **DB/API** | None — static search within provided data |

### 6.3 agent-profile

| Field | Value |
|---|---|
| **File** | `web/components/sections/specialty/agent-profile-section.tsx` |
| **Registry** | `agent-profile: { id: 'agent-profile', defaultVariant: 'card', variants: ['card', 'list', 'detailed'] }` |
| **Props** | `agents?: Array<{ name: string; title: string; phone: string; email: string; imageUrl?: string; listings?: number; bio?: string; social?: Record<string, string> }>` |
| **Reference** | Similar to `team-section` |
| **DB/API** | None — static content |

---

## Phase 7: Automotive (P2 — 4 components)

### 7.1 vehicle-listing

| Field | Value |
|---|---|
| **File** | `web/components/sections/specialty/vehicle-listing-section.tsx` |
| **Registry** | `vehicle-listing: { id: 'vehicle-listing', defaultVariant: 'grid', variants: ['grid', 'list', 'featured'] }` |
| **Props** | `vehicles?: Array<{ name: string; year: number; price: string; mileage?: string; fuelType?: string; transmission?: string; image?: string; condition?: string }>` |
| **Reference** | Similar to `product-catalog-section` |
| **DB/API** | None — static content |

### 7.2 service-scheduler

| Field | Value |
|---|---|
| **File** | `web/components/sections/forms/service-scheduler-section.tsx` |
| **Registry** | `service-scheduler: { id: 'service-scheduler', defaultVariant: 'form', variants: ['form', 'compact'] }` |
| **`use client`** | Yes (date picker, service selection) |
| **Props** | `services?: Array<{ name: string; price: string; duration: string }>`, `whatsapp?: string` |
| **Reference** | Similar to `booking-section` |
| **DB/API** | None — submits via WhatsApp |

### 7.3 part-finder

| Field | Value |
|---|---|
| **File** | `web/components/sections/forms/part-finder-section.tsx` |
| **Registry** | `part-finder: { id: 'part-finder', defaultVariant: 'form', variants: ['form', 'compact'] }` |
| **`use client`** | Yes (form inputs) |
| **Props** | `categories?: string[]`, `vehicleTypes?: string[]`, `whatsapp?: string` |
| **Reference** | Similar to `lead-form-section` |
| **DB/API** | None — submits via WhatsApp |

### 7.4 test-drive-form

| Field | Value |
|---|---|
| **File** | `web/components/sections/forms/test-drive-form-section.tsx` |
| **Registry** | `test-drive-form: { id: 'test-drive-form', defaultVariant: 'form', variants: ['form', 'compact', 'inline'] }` |
| **`use client`** | Yes (date picker) |
| **Props** | `vehicles?: Array<{ id: string; name: string }>`, `whatsapp?: string`, `locations?: string[]` |
| **Reference** | Similar to `booking-section` |
| **DB/API** | None — submits via WhatsApp |

---

## Phase 8: Events & Entertainment (P2 — 4 components)

### 8.1 event-calendar

| Field | Value |
|---|---|
| **File** | `web/components/sections/specialty/event-calendar-section.tsx` |
| **Registry** | `event-calendar: { id: 'event-calendar', defaultVariant: 'grid', variants: ['grid', 'list', 'calendar'] }` |
| **`use client`** | Yes (calendar navigation) |
| **Props** | `events?: Array<{ name: string; date: string; time: string; venue: string; price?: string; image?: string; url?: string }>` |
| **Reference** | Similar to `class-schedule-section` |
| **DB/API** | None — static content |

### 8.2 ticket-purchase

| Field | Value |
|---|---|
| **File** | `web/components/sections/commerce/ticket-purchase-section.tsx` |
| **Registry** | `ticket-purchase: { id: 'ticket-purchase', defaultVariant: 'form', variants: ['form', 'compact'] }` |
| **`use client`** | Yes (quantity selector, total calc) |
| **Props** | `event?: { name: string; date: string; venue: string }`, `ticketTypes?: Array<{ name: string; price: string; available: number }>`, `whatsapp?: string` |
| **Reference** | Similar to `cart` |
| **DB/API** | None — submits via WhatsApp |

### 8.3 event-detail

| Field | Value |
|---|---|
| **File** | `web/components/sections/specialty/event-detail-section.tsx` |
| **Registry** | `event-detail: { id: 'event-detail', defaultVariant: 'hero', variants: ['hero', 'split', 'minimal'] }` |
| **Props** | `event?: { name: string; date: string; time: string; venue: string; description: string; lineup?: string[]; image?: string; ticketUrl?: string; mapUrl?: string }` |
| **Reference** | Similar to `hero-section` |
| **DB/API** | None — static content |

### 8.4 venue-map

| Field | Value |
|---|---|
| **File** | `web/components/sections/specialty/venue-map-section.tsx` |
| **Registry** | `venue-map: { id: 'venue-map', defaultVariant: 'interactive', variants: ['interactive', 'static', 'seating'] }` |
| **`use client`** | Yes (seating chart interaction) |
| **Props** | `venue?: { name: string; address: string; capacity: number; sections?: Array<{ name: string; rows: number; seatsPerRow: number }> }`, `googleMapsUrl?: string` |
| **Reference** | Similar to `google-maps-section` |
| **DB/API** | None — static content |

---

## Phase 9: Agriculture (P3 — 3 components)

### 9.1 seasonal-calendar

| Field | Value |
|---|---|
| **File** | `web/components/sections/specialty/seasonal-calendar-section.tsx` |
| **Registry** | `seasonal-calendar: { id: 'seasonal-calendar', defaultVariant: 'grid', variants: ['grid', 'list', 'timeline'] }` |
| **`use client`** | No |
| **Props** | `seasons?: Array<{ month: string; products: Array<{ name: string; available: boolean; image?: string }> }>` |
| **Reference** | Similar to `content-grid-section` |
| **DB/API** | None — static content |

### 9.2 wholesale-inquiry

| Field | Value |
|---|---|
| **File** | `web/components/sections/forms/wholesale-inquiry-section.tsx` |
| **Registry** | `wholesale-inquiry: { id: 'wholesale-inquiry', defaultVariant: 'form', variants: ['form', 'compact'] }` |
| **`use client`** | Yes (form) |
| **Props** | `products?: Array<{ name: string; unit: string; pricePerUnit: string }>`, `whatsapp?: string`, `email?: string` |
| **Reference** | Similar to `b2b-wholesale-section` |
| **DB/API** | None — submits via WhatsApp/email |

### 9.3 farm-gallery

| Field | Value |
|---|---|
| **File** | `web/components/sections/media/farm-gallery-section.tsx` |
| **Registry** | `farm-gallery: { id: 'farm-gallery', defaultVariant: 'grid', variants: ['grid', 'masonry', 'tour'] }` |
| **`use client`** | No |
| **Props** | `categories?: Array<{ name: string; images: Array<{ src: string; alt: string; caption?: string }> }>` |
| **Reference** | Similar to `gallery-section` |
| **DB/API** | None — static content |

---

## Phase 10: Pets & Animals (P3 — 3 components)

### 10.1 pet-profile

| Field | Value |
|---|---|
| **File** | `web/components/sections/specialty/pet-profile-section.tsx` |
| **Registry** | `pet-profile: { id: 'pet-profile', defaultVariant: 'card', variants: ['card', 'list', 'detailed'] }` |
| **Props** | `pets?: Array<{ name: string; type: string; breed?: string; age?: string; size?: string; gender?: string; description: string; status: string; image: string; hashtag?: string }>` |
| **Reference** | Similar to `team-section`, used by Polki Squad (existing tenant) |
| **DB/API** | None — static content (current polki-squad has animals inline) |

### 10.2 adoption-form

| Field | Value |
|---|---|
| **File** | `web/components/sections/forms/adoption-form-section.tsx` |
| **Registry** | `adoption-form: { id: 'adoption-form', defaultVariant: 'multi-step', variants: ['multi-step', 'form', 'compact'] }` |
| **`use client`** | Yes (multi-step wizard) |
| **Props** | `pets?: Array<{ name: string; id: string }>`, `requirements?: string[]`, `whatsapp?: string` |
| **Reference** | Similar to `intake-wizard-section` |
| **DB/API** | None — submits via WhatsApp |

### 10.3 vet-services

| Field | Value |
|---|---|
| **File** | `web/components/sections/specialty/vet-services-section.tsx` |
| **Registry** | `vet-services: { id: 'vet-services', defaultVariant: 'cards', variants: ['cards', 'list', 'priced'] }` |
| **Props** | `services?: Array<{ name: string; description: string; price?: string; duration?: string; category?: string }>` |
| **Reference** | Similar to `services-section` |
| **DB/API** | None — static content |

---

## Phase 11: Admin / Dashboard (P3 — 3 components)

### 11.1 analytics-dashboard

| Field | Value |
|---|---|
| **File** | `web/components/sections/admin/analytics-dashboard-section.tsx` |
| **Registry** | `analytics-dashboard: { id: 'analytics-dashboard', defaultVariant: 'grid', variants: ['grid', 'list'] }` |
| **`use client`** | Yes (chart rendering) |
| **Props** | `stats?: Array<{ label: string; value: string; change?: string; icon?: string }>`, `period?: string` |
| **Reference** | Similar to `stats-counter-section` |
| **DB/API** | Reads from `analytics_events` table |

### 11.2 tenant-settings

| Field | Value |
|---|---|
| **File** | `web/components/sections/admin/tenant-settings-section.tsx` |
| **Registry** | `tenant-settings: { id: 'tenant-settings', defaultVariant: 'form', variants: ['form', 'compact'] }` |
| **`use client`** | Yes (form) |
| **Props** | `sections?: Array<{ id: string; label: string; enabled: boolean }>`, `contact?: Record<string, string>` |
| **Reference** | Similar to `dashboard` routes |
| **DB/API** | Writes to `businesses` table via admin API |

### 11.3 content-editor

| Field | Value |
|---|---|
| **File** | `web/components/sections/admin/content-editor-section.tsx` |
| **Registry** | `content-editor: { id: 'content-editor', defaultVariant: 'inline', variants: ['inline', 'modal', 'full'] }` |
| **`use client`** | Yes (text editing) |
| **Props** | `sectionId?: string`, `content?: Record<string, unknown>`, `fields?: Array<{ key: string; label: string; type: 'text' | 'textarea' | 'image' | 'list' }>` |
| **Reference** | Similar to existing admin routes at `web/app/dashboard/[slug]/contenido/` |
| **DB/API** | Writes to `businesses.data_json` via admin API |

---

## Summary: 50 Components

| Phase | Category | Count | Effort |
|---|---|---|---|
| 0 | Foundation (helpers) | 1 | 1h |
| 1 | Paraguay-Local (P0) | 7 | 14h |
| 2 | Business Operations (P1) | 8 | 16h |
| 3 | Healthcare (P1) | 5 | 10h |
| 4 | Food & Beverage (P2) | 5 | 10h |
| 5 | Education (P2) | 4 | 8h |
| 6 | Real Estate (P2) | 3 | 6h |
| 7 | Automotive (P2) | 4 | 8h |
| 8 | Events (P2) | 4 | 8h |
| 9 | Agriculture (P3) | 3 | 4h |
| 10 | Pets (P3) | 3 | 4h |
| 11 | Admin (P3) | 3 | 8h |
| **Total** | | **50** | **~97h** |

## Registration Checklist (for EACH component):

1. Create component file: `web/components/sections/{category}/{name}-section.tsx`
2. Register in `web/lib/engine/section-registry.ts`: Add to `SECTION_CATALOG`
3. Add aliases to `SECTION_ALIASES` in same file
4. Add sample props to `web/app/preview/all/page.tsx` (in `buildSampleProps`)
5. Add to `SECTION_CATALOG` in `web/app/preview/[section]/page.tsx`
6. Add to gallery list in `web/app/preview/page.tsx`
7. Regenerate renderer map: `npm run generate:renderer`
8. Typecheck: `npx tsc --noEmit`
