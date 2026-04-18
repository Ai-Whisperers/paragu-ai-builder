/**
 * Section Renderer - OPTIMIZED with Lazy Loading
 *
 * Maps composed section definitions to actual React components.
 * Uses React.lazy() for code splitting to reduce bundle size.
 */

import { lazy, Suspense } from 'react'
import type { ComposedSection } from './compose'

// Core sections - always loaded (small, commonly used)
import { HeaderSection } from '@/components/sections/header-section'
import { FooterSection } from '@/components/sections/footer-section'
import { WhatsAppFloat } from '@/components/sections/whatsapp-float'

// Lazy load all other sections - only loaded when needed
const HeroSection = lazy(() => import('@/components/sections/hero-section'))
const ServicesSection = lazy(() => import('@/components/sections/services-section'))
const BookingSection = lazy(() => import('@/components/sections/booking-section'))
const PortfolioSection = lazy(() => import('@/components/sections/portfolio-section'))
const BeforeAfterSection = lazy(() => import('@/components/sections/before-after-section'))
const ClassScheduleSection = lazy(() => import('@/components/sections/class-schedule-section'))
const MembershipPlansSection = lazy(() => import('@/components/sections/membership-plans-section'))
const RoomBookingSection = lazy(() => import('@/components/sections/room-booking-section'))
const EventVenuesSection = lazy(() => import('@/components/sections/event-venues-section'))
const QuoteFormSection = lazy(() => import('@/components/sections/quote-form-section'))
const EmergencyIndicatorSection = lazy(() => import('@/components/sections/emergency-indicator-section'))
const ProductCatalogSection = lazy(() => import('@/components/sections/product-catalog-section'))
const GallerySection = lazy(() => import('@/components/sections/gallery-section'))
const TeamSection = lazy(() => import('@/components/sections/team-section'))
const TestimonialsSection = lazy(() => import('@/components/sections/testimonials-section'))
const ContactSection = lazy(() => import('@/components/sections/contact-section'))
const FAQSection = lazy(() => import('@/components/sections/faq-section'))
const CTABannerSection = lazy(() => import('@/components/sections/cta-banner-section'))
const FeaturesSection = lazy(() => import('@/components/sections/features-section'))
const PricingTableSection = lazy(() => import('@/components/sections/pricing-table-section'))
const ProcessSection = lazy(() => import('@/components/sections/process-section'))
const SavingsCalculatorSection = lazy(() => import('@/components/sections/savings-calculator-section'))
const TrustSignalsSection = lazy(() => import('@/components/sections/trust-signals-section'))
const ProgramsComparisonSection = lazy(() => import('@/components/sections/programs-comparison-section'))
const WhyDestinationSection = lazy(() => import('@/components/sections/why-destination-section'))
const ProcessTimelineSection = lazy(() => import('@/components/sections/process-timeline-section'))

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
  features: FeaturesSection,
  pricing: PricingTableSection,
  process: ProcessSection,
  savingsCalculator: SavingsCalculatorSection,
  trustSignals: TrustSignalsSection,
  programsComparison: ProgramsComparisonSection,
  whyDestination: WhyDestinationSection,
  processTimeline: ProcessTimelineSection,
  'trust-signals': TrustSignalsSection,
  'programs-comparison': ProgramsComparisonSection,
  'why-destination': WhyDestinationSection,
  'process-timeline': ProcessTimelineSection,
  'cta-banner': CTABannerSection,
  'whatsapp-float': WhatsAppFloat,
}

// Simple loading placeholder
function SectionLoader() {
  return (
    <div className="py-16 flex items-center justify-center">
      <div className="animate-pulse bg-gray-200 rounded-lg w-full max-w-4xl h-64" />
    </div>
  )
}

export function renderSection(section: ComposedSection): React.ReactNode {
  const Component = SECTION_COMPONENTS[section.type]
  if (!Component) {
    console.warn(`[Renderer] Unknown section type: ${section.type}`)
    return null
  }

  // Core sections render immediately
  if (section.type === 'header' || section.type === 'footer' || section.type === 'whatsappFloat') {
    return <Component key={`${section.type}-${section.order}`} {...section.data} />
  }

  // Lazy-loaded sections wrapped in Suspense
  return (
    <Suspense key={`${section.type}-${section.order}`} fallback={<SectionLoader />}>
      <Component {...section.data} />
    </Suspense>
  )
}

export function renderSections(sections: ComposedSection[]): React.ReactNode[] {
  return sections
    .sort((a, b) => a.order - b.order)
    .map(renderSection)
    .filter(Boolean) as React.ReactNode[]
}
