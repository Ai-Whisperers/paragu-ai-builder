/**
 * Site section renderer - OPTIMIZED with Lazy Loading
 *
 * Maps catalog section ids to React components with code splitting.
 */
import { lazy, Suspense } from 'react'
import type { ResolvedPage } from './site-types'

// Core sections - always loaded
import { HeaderSection } from '@/components/sections/header-section'
import { FooterSection } from '@/components/sections/footer-section'
import { WhatsAppFloat } from '@/components/sections/whatsapp-float'

// Lazy load all other sections
const HeroSection = lazy(() => import('@/components/sections/hero-section'))
const ServicesSection = lazy(() => import('@/components/sections/services-section'))
const ProductCatalogSection = lazy(() => import('@/components/sections/product-catalog-section'))
const GallerySection = lazy(() => import('@/components/sections/gallery-section'))
const TeamSection = lazy(() => import('@/components/sections/team-section'))
const TestimonialsSection = lazy(() => import('@/components/sections/testimonials-section'))
const ContactSection = lazy(() => import('@/components/sections/contact-section'))
const FAQSection = lazy(() => import('@/components/sections/faq-section'))
const CTABannerSection = lazy(() => import('@/components/sections/cta-banner-section'))
const ProgramsComparisonSection = lazy(() => import('@/components/sections/programs-comparison-section'))
const ProcessTimelineSection = lazy(() => import('@/components/sections/process-timeline-section'))
const WhyDestinationSection = lazy(() => import('@/components/sections/why-destination-section'))
const TrustSignalsSection = lazy(() => import('@/components/sections/trust-signals-section'))
const BookingEmbedSection = lazy(() => import('@/components/sections/booking-embed-section'))
const BlogIndexSection = lazy(() => import('@/components/sections/blog-index-section'))
const BlogPostSection = lazy(() => import('@/components/sections/blog-post-section'))
const LeadFormSection = lazy(() => import('@/components/sections/lead-form-section'))
const BeforeAfterSection = lazy(() => import('@/components/sections/before-after-section'))
const BookingSection = lazy(() => import('@/components/sections/booking-section'))
const ClassScheduleSection = lazy(() => import('@/components/sections/class-schedule-section'))
const EmergencyIndicatorSection = lazy(() => import('@/components/sections/emergency-indicator-section'))
const EventVenuesSection = lazy(() => import('@/components/sections/event-venues-section'))
const MembershipPlansSection = lazy(() => import('@/components/sections/membership-plans-section'))
const PortfolioSection = lazy(() => import('@/components/sections/portfolio-section'))
const QuoteFormSection = lazy(() => import('@/components/sections/quote-form-section'))
const RoomBookingSection = lazy(() => import('@/components/sections/room-booking-section'))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COMPONENTS: Record<string, React.ComponentType<any>> = {
  header: HeaderSection,
  hero: HeroSection,
  services: ServicesSection,
  'product-catalog': ProductCatalogSection,
  gallery: GallerySection,
  team: TeamSection,
  testimonials: TestimonialsSection,
  contact: ContactSection,
  faq: FAQSection,
  'cta-banner': CTABannerSection,
  footer: FooterSection,
  'whatsapp-float': WhatsAppFloat,
  'programs-comparison': ProgramsComparisonSection,
  'process-timeline': ProcessTimelineSection,
  'why-destination': WhyDestinationSection,
  'trust-signals': TrustSignalsSection,
  'booking-embed': BookingEmbedSection,
  'blog-index': BlogIndexSection,
  'blog-post': BlogPostSection,
  'lead-form': LeadFormSection,
  'before-after': BeforeAfterSection,
  booking: BookingSection,
  'class-schedule': ClassScheduleSection,
  'emergency-indicator': EmergencyIndicatorSection,
  'event-venues': EventVenuesSection,
  'membership-plans': MembershipPlansSection,
  portfolio: PortfolioSection,
  'quote-form': QuoteFormSection,
  'room-booking': RoomBookingSection,
}

// Simple loading placeholder
function SectionLoader() {
  return (
    <div className="py-16 flex items-center justify-center">
      <div className="animate-pulse bg-gray-200 rounded-lg w-full max-w-4xl h-64" />
    </div>
  )
}

export function renderPage(page: ResolvedPage): React.ReactNode {
  return page.sections.map((s, i) => {
    const C = COMPONENTS[s.id]
    if (!C) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[site-renderer] No component bound for section "${s.id}"`)
      }
      return null
    }

    const props = s.props as Record<string, unknown>
    const key = `${s.id}-${i}`

    // Core sections render immediately
    if (s.id === 'header' || s.id === 'footer' || s.id === 'whatsapp-float') {
      return <C key={key} {...props} />
    }

    // Lazy-loaded sections wrapped in Suspense
    return (
      <Suspense key={key} fallback={<SectionLoader />}>
        <C {...props} />
      </Suspense>
    )
  })
}
