/**
 * Site section renderer.
 *
 * Maps catalog section ids to React components. This is the
 * counterpart to `renderer.tsx` but operates on the tenant-site
 * composition (ResolvedPage) rather than the beauty-vertical
 * ComposedSection.
 */
import type { ResolvedPage } from './site-types'
import { logger } from '@/lib/logger'
import { HeaderSection } from '@/components/sections/header-section'
import { HeroSection } from '@/components/sections/hero-section'
import { ServicesSection } from '@/components/sections/services-section'
import { ProductCatalogSection } from '@/components/sections/product-catalog-section'
import { FeaturedProductsSection } from '@/components/sections/featured-products-section'
import { CommerceCatalogSection } from '@/components/sections/commerce-catalog-section'
import { AgeGateSection } from '@/components/sections/age-gate-section'
import { GallerySection } from '@/components/sections/gallery-section'
import { TeamSection } from '@/components/sections/team-section'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { ContactSection } from '@/components/sections/contact-section'
import { FAQSection } from '@/components/sections/faq-section'
import { CTABannerSection } from '@/components/sections/cta-banner-section'
import { FooterSection } from '@/components/sections/footer-section'
import { WhatsAppFloat } from '@/components/sections/whatsapp-float'
import { ProgramsComparisonSection } from '@/components/sections/programs-comparison-section'
import { ProcessTimelineSection } from '@/components/sections/process-timeline-section'
import { WhyDestinationSection } from '@/components/sections/why-destination-section'
import { TrustSignalsSection } from '@/components/sections/trust-signals-section'
import { BookingEmbedSection } from '@/components/sections/booking-embed-section'
import { BlogIndexSection } from '@/components/sections/blog-index-section'
import { BlogPostSection } from '@/components/sections/blog-post-section'
import { LeadFormSection } from '@/components/sections/lead-form-section'
import { BeforeAfterSection } from '@/components/sections/before-after-section'
import { BookingSection } from '@/components/sections/booking-section'
import { ClassScheduleSection } from '@/components/sections/class-schedule-section'
import { EmergencyIndicatorSection } from '@/components/sections/emergency-indicator-section'
import { EventVenuesSection } from '@/components/sections/event-venues-section'
import { MembershipPlansSection } from '@/components/sections/membership-plans-section'
import { PortfolioSection } from '@/components/sections/portfolio-section'
import { QuoteFormSection } from '@/components/sections/quote-form-section'
import { RoomBookingSection } from '@/components/sections/room-booking-section'
// Egg-farm / granja-cabral sections (PR #108)
import { EnhancedFAQSection } from '@/components/sections/enhanced-faq-section'
import { OurStorySection } from '@/components/sections/our-story-section'
import { B2BWholesaleSection } from '@/components/sections/b2b-wholesale-section'
import { RecipeSection } from '@/components/sections/recipe-section'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COMPONENTS: Record<string, React.ComponentType<any>> = {
  header: HeaderSection,
  hero: HeroSection,
  services: ServicesSection,
  'product-catalog': ProductCatalogSection,
  'featured-products': FeaturedProductsSection,
  'commerce-catalog': CommerceCatalogSection,
  'age-gate': AgeGateSection,
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
  // Egg-farm / granja-cabral sections (PR #108)
  'enhanced-faq': EnhancedFAQSection,
  'our-story': OurStorySection,
  'b2b-wholesale': B2BWholesaleSection,
  recipes: RecipeSection,
}

export function renderPage(page: ResolvedPage): React.ReactNode {
  return page.sections.map((s, i) => {
    const C = COMPONENTS[s.id]
    if (!C) {
      logger.warn('No component bound for section — skipping render', {
        action: 'renderPage',
        sectionId: s.id,
        index: i,
      })
      return null
    }

    // Thread the page's locale into every section as an optional prop.
    // Sections that need it (e.g. featured-products, any future section
    // generating URLs with the locale prefix) pick it up; the rest
    // ignore the extra key harmlessly.
    const props = { ...s.props, locale: page.locale } as Record<string, unknown>
    return <C key={`${s.id}-${i}`} {...props} />
  })
}
