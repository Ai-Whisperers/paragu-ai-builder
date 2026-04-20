# Component Library

Catalog of all reusable section components in Paragu-AI Builder.

## Overview

The component library consists of 21+ reusable section components that can be composed to create business websites. Each component uses CSS variables for theming.

## Hero Section

**File:** `components/sections/hero-section.tsx`

**Props:**
```typescript
interface HeroSectionProps {
  headline: string
  subheadline?: string
  ctaPrimaryText?: string
  ctaPrimaryHref?: string
  ctaSecondaryText?: string
  ctaSecondaryHref?: string
  backgroundImage?: string
}
```

**Usage:**
```tsx
<HeroSection
  headline="Salon de Belleza Maria"
  subheadline="Tu belleza, nuestra pasión"
  ctaPrimaryText="Reservar Cita"
  ctaPrimaryHref="#contacto"
/>
```

## Services Section

**File:** `components/sections/services-section.tsx`

**Props:**
```typescript
interface ServicesSectionProps {
  title: string
  services: ServiceItem[]
  showPrices?: boolean
  showDuration?: boolean
}
```

**Usage:**
```tsx
<ServicesSection
  title="Nuestros Servicios"
  services={[
    { name: 'Corte de Cabello', price: '150.000 Gs', duration: 60 },
    { name: 'Manicure', price: '80.000 Gs', duration: 45 }
  ]}
/>
```

## Team Section

**File:** `components/sections/team-section.tsx`

**Props:**
```typescript
interface TeamSectionProps {
  title?: string
  members: TeamMember[]
}
```

## Testimonials Section

**File:** `components/sections/testimonials-section.tsx`

**Props:**
```typescript
interface TestimonialsSectionProps {
  title?: string
  testimonials: Testimonial[]
}
```

## Contact Section

**File:** `components/sections/contact-section.tsx`

**Props:**
```typescript
interface ContactSectionProps {
  title?: string
  address?: string
  phone?: string
  email?: string
  whatsapp?: string
  googleMapsUrl?: string
  hours?: Record<string, string>
}
```

## Gallery Section

**File:** `components/sections/gallery-section.tsx`

**Props:**
```typescript
interface GallerySectionProps {
  title?: string
  subtitle?: string
  images: GalleryImage[]
  columns?: 2 | 3 | 4
}
```

## FAQ Section

**File:** `components/sections/faq-section.tsx`

**Props:**
```typescript
interface FAQSectionProps {
  title?: string
  items: FAQItem[]
}
```

## Booking Section

**File:** `components/sections/booking-section.tsx`

**Props:**
```typescript
interface BookingSectionProps {
  title?: string
  subtitle?: string
  services: ServiceItem[]
  staff?: StaffMember[]
  workingHours: { start: string; end: string }
  whatsappPhone?: string
}
```

## Portfolio Section

**File:** `components/sections/portfolio-section.tsx`

**Props:**
```typescript
interface PortfolioSectionProps {
  title?: string
  subtitle?: string
  items: PortfolioItem[]
  categories?: string[]
}
```

## Before/After Section

**File:** `components/sections/before-after-section.tsx`

**Props:**
```typescript
interface BeforeAfterSectionProps {
  title?: string
  subtitle?: string
  items: BeforeAfterItem[]
}
```

## Pricing Section

**File:** `components/sections/pricing-section.tsx`

**Props:**
```typescript
interface PricingSectionProps {
  title?: string
  subtitle?: string
  plans: PricingPlan[]
  whatsappPhone?: string
}
```

## Product Catalog Section

**File:** `components/sections/product-catalog-section.tsx`

**Props:**
```typescript
interface ProductCatalogSectionProps {
  title?: string
  subtitle?: string
  products: Product[]
  categories?: string[]
  showPrices?: boolean
  whatsappPhone?: string
}
```

## Class Schedule Section

**File:** `components/sections/class-schedule-section.tsx`

**Props:**
```typescript
interface ClassScheduleSectionProps {
  title?: string
  subtitle?: string
  schedule: DaySchedule[]
}
```

## CTA Banner Section

**File:** `components/sections/cta-banner-section.tsx`

**Props:**
```typescript
interface CTABannerSectionProps {
  title: string
  buttonText: string
  buttonHref?: string
}
```

## Footer Section

**File:** `components/sections/footer-section.tsx`

**Props:**
```typescript
interface FooterSectionProps {
  businessName: string
  phone?: string
  email?: string
  address?: string
  city?: string
  instagram?: string
  facebook?: string
  whatsapp?: string
  navLinks?: NavItem[]
}
```

## Sushi-Specific Sections

### Omakase Section
**File:** `components/sections/omakase-section.tsx`

Displays omakase tier pricing and details.

### Sake Menu Section
**File:** `components/sections/sake-menu-section.tsx`

Displays sake and beverage offerings.

### Conveyor Belt Section
**File:** `components/sections/conveyor-belt-section.tsx`

Shows how the kaiten zushi system works.

## Universal Components

### Business Header
**File:** `components/universal/business-header.tsx`

Logo and navigation header for business sites.

### WhatsApp Button
**File:** `components/universal/whatsapp-button.tsx`

Floating WhatsApp contact button.

### Contact Form
**File:** `components/universal/contact-form.tsx`

Generic contact form with validation.

### Service Menu
**File:** `components/universal/service-menu.tsx`

Service listing with pricing and booking links.

### Google Maps
**File:** `components/universal/google-maps.tsx`

Embeddable map with directions link.

## UI Components

### Container
**File:** `components/ui/container.tsx`

Responsive container with max-width.

### Button
**File:** `components/ui/button.tsx`

CVA-based button component with variants.

### Card
**File:** `components/ui/card.tsx`

Card component with header, content, and footer.

### Heading
**File:** `components/ui/heading.tsx`

Semantic heading component with consistent styling.

## Theming

All components use CSS variables for theming:

```css
--primary
--primary-foreground
--secondary
--secondary-foreground
--background
--surface
--text
--text-light
--border
--success
--warning
--error
```

## Adding New Components

1. Create component file in appropriate directory
2. Define TypeScript interface for props
3. Use CSS variables for colors
4. Add to section registry
5. Export from `components/sections/index.ts`
6. Add documentation to this file
