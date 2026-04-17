/**
 * Section Renderer
 *
 * Maps composed section definitions to actual React components.
 * This is the bridge between the composition engine output and the UI layer.
 */

import type { ComposedSection } from './compose'
import { HeaderSection } from '@/components/sections/header-section'
import { HeroSection } from '@/components/sections/hero-section'
import { ServicesSection } from '@/components/sections/services-section'
import { BookingSection } from '@/components/sections/booking-section'
import { PortfolioSection } from '@/components/sections/portfolio-section'
import { BeforeAfterSection } from '@/components/sections/before-after-section'
import { ClassScheduleSection } from '@/components/sections/class-schedule-section'
import { MembershipPlansSection } from '@/components/sections/membership-plans-section'
import { RoomBookingSection } from '@/components/sections/room-booking-section'
import { EventVenuesSection } from '@/components/sections/event-venues-section'
import { QuoteFormSection } from '@/components/sections/quote-form-section'
import { EmergencyIndicatorSection } from '@/components/sections/emergency-indicator-section'
import { ProductCatalogSection } from '@/components/sections/product-catalog-section'
import { GallerySection } from '@/components/sections/gallery-section'
import { TeamSection } from '@/components/sections/team-section'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { ContactSection } from '@/components/sections/contact-section'
import { FAQSection } from '@/components/sections/faq-section'
import { CTABannerSection } from '@/components/sections/cta-banner-section'
import { FooterSection } from '@/components/sections/footer-section'
import { WhatsAppFloat } from '@/components/sections/whatsapp-float'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SECTION_COMPONENTS: Record<string, React.ComponentType<any>> = {
  header: HeaderSection,
  hero: HeroSection,
  services: ServicesSection,
  booking: BookingSection,
  portfolio: PortfolioSection,
  beforeAfter: BeforeAfterSection,
  classSchedule: ClassScheduleSection,
  membershipPlans: MembershipPlansSection,
  roomBooking: RoomBookingSection,
  eventVenues: EventVenuesSection,
  quoteForm: QuoteFormSection,
  emergencyIndicator: EmergencyIndicatorSection,
  productCatalog: ProductCatalogSection,
  gallery: GallerySection,
  team: TeamSection,
  testimonials: TestimonialsSection,
  contact: ContactSection,
  faq: FAQSection,
  ctaBanner: CTABannerSection,
  footer: FooterSection,
  whatsappFloat: WhatsAppFloat,
}

export function renderSection(section: ComposedSection): React.ReactNode {
  const Component = SECTION_COMPONENTS[section.type]
  if (!Component) {
    console.warn(`[Renderer] Unknown section type: ${section.type}`)
    return null
  }

  return <Component key={`${section.type}-${section.order}`} {...section.data} />
}

export function renderSections(sections: ComposedSection[]): React.ReactNode[] {
  return sections
    .sort((a, b) => a.order - b.order)
    .map(renderSection)
    .filter(Boolean) as React.ReactNode[]
}
