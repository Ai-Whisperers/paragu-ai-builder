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
import { TrustBadgesSection } from '@/components/sections/trust-badges-section'
import { GallerySection } from '@/components/sections/gallery-section'
import { IllustrationSection } from '@/components/sections/illustration-section'
import { ContactStripSection } from '@/components/sections/contact-strip-section'
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
import { TaxSavingsCalculatorSection } from '@/components/sections/tax-savings-calculator-section'
// Contador / accounting firm sections
import { TaxDeadlineBannerSection } from '@/components/sections/tax-deadline-banner-section'
import { CalcIrpSection } from '@/components/sections/calc-irp-section'
import { CalcAguinaldoSection } from '@/components/sections/calc-aguinaldo-section'
import { CalcFiniquitoSection } from '@/components/sections/calc-finiquito-section'
import { CalcIvaSection } from '@/components/sections/calc-iva-section'
import { CalcIreSection } from '@/components/sections/calc-ire-section'
import { CalcIpsSection } from '@/components/sections/calc-ips-section'
import { CalcCostoEmpleadoSection } from '@/components/sections/calc-costo-empleado-section'
import { IntakeWizardSection } from '@/components/sections/intake-wizard-section'
import { MattressQuizSection } from '@/components/sections/mattress-quiz-section'
import { FeaturesSection } from '@/components/sections/features-section'
import { ResourcesListSection } from '@/components/sections/resources-list-section'
import { IntakeQuestionnaireSection } from '@/components/sections/intake-questionnaire-section'
import { ProcessSection } from '@/components/sections/process-section'
import { MenuCategorizedPricedSection } from '@/components/sections/menu-categorized-priced-section'
import { ComplianceDisclaimerFooterSection } from '@/components/sections/compliance-disclaimer-footer-section'
import { PromoBannerSection } from '@/components/sections/promo-banner-section'
import { NewsletterSignupSection } from '@/components/sections/newsletter-signup-section'
import { OpenHoursStatusSection } from '@/components/sections/open-hours-status-section'
import { PricingRangeSection } from '@/components/sections/pricing-range-section'
import { PricingTableSection } from '@/components/sections/pricing-table-section'
import { FaqCategorizedSection } from '@/components/sections/faq-categorized-section'
import { GoogleReviewsWidgetSection } from '@/components/sections/google-reviews-widget-section'
import { PackagesSection } from '@/components/sections/packages-section'
import { BranchesSection } from '@/components/sections/branches-section'
import { InstagramFeedSection } from '@/components/sections/instagram-feed-section'

// Exported so tests (and any future tooling) can assert that every
// registered section in section-registry has a matching render binding.
// See tests/unit/engine/renderer-wiring.test.ts — silent-skip bugs of
// the class "component exists, registry knows it, page config references
// it, but the COMPONENTS map has no entry → renderPage warns and moves
// on" hit us four separate times before this guard landed (PRs #245,
// #247, #248). The test makes the whole class impossible.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const COMPONENTS: Record<string, React.ComponentType<any>> = {
  header: HeaderSection,
  hero: HeroSection,
  services: ServicesSection,
  'product-catalog': ProductCatalogSection,
  'featured-products': FeaturedProductsSection,
  'commerce-catalog': CommerceCatalogSection,
  'age-gate': AgeGateSection,
  'trust-badges': TrustBadgesSection,
  gallery: GallerySection,
  illustration: IllustrationSection,
  'contact-strip': ContactStripSection,
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
  'compliance-disclaimer-footer': ComplianceDisclaimerFooterSection,
  'promo-banner': PromoBannerSection,
  'newsletter-signup': NewsletterSignupSection,
  'open-hours-status': OpenHoursStatusSection,
  'pricing-range': PricingRangeSection,
  'pricing-table': PricingTableSection,
  'faq-categorized': FaqCategorizedSection,
  'tax-savings-calculator': TaxSavingsCalculatorSection,
  // Contador / accounting firm sections
  'tax-deadline-banner': TaxDeadlineBannerSection,
  'calc-irp': CalcIrpSection,
  'calc-aguinaldo': CalcAguinaldoSection,
  'calc-finiquito': CalcFiniquitoSection,
  'calc-iva': CalcIvaSection,
  'calc-ire': CalcIreSection,
  'calc-ips': CalcIpsSection,
  'calc-costo-empleado': CalcCostoEmpleadoSection,
  'intake-wizard': IntakeWizardSection,
  'mattress-quiz': MattressQuizSection,
  features: FeaturesSection,
  'resources-list': ResourcesListSection,
  'intake-questionnaire': IntakeQuestionnaireSection,
  process: ProcessSection,
  'menu-categorized-priced': MenuCategorizedPricedSection,
  'google-reviews': GoogleReviewsWidgetSection,
  'packages-giftcards': PackagesSection,
  'instagram-feed': InstagramFeedSection,
  branches: BranchesSection,
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
    //
    // `s.variant` is also threaded through as `variant` — without this,
    // sections that support multiple variants (e.g. programs-comparison
    // with `tiered` / `matrix`) always fell back to their default and
    // ignored what the tenant page config asked for.
    const props = {
      ...s.props,
      variant: s.variant,
      locale: page.locale,
    } as Record<string, unknown>
    return <C key={`${s.id}-${i}`} {...props} />
  })
}
