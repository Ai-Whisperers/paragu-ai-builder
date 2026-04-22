/**
 * Section Renderer
 *
 * Maps composed section definitions to actual React components.
 * This is the bridge between the composition engine output and the UI layer.
 */

import type { ComposedSection } from './compose'
import { logger } from '@/lib/logger'
import { resolveSectionAlias } from './section-registry'
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
import { FeaturesSection } from '@/components/sections/features-section'
import { PricingTableSection } from '@/components/sections/pricing-table-section'
import { ProcessSection } from '@/components/sections/process-section'
import { SavingsCalculatorSection } from '@/components/sections/savings-calculator-section'
import { TrustSignalsSection } from '@/components/sections/trust-signals-section'
import { ProgramsComparisonSection } from '@/components/sections/programs-comparison-section'
import { WhyDestinationSection } from '@/components/sections/why-destination-section'
import { ProcessTimelineSection } from '@/components/sections/process-timeline-section'
import { OmakaseSection } from '@/components/sections/omakase-section'
import { SakeMenuSection } from '@/components/sections/sake-menu-section'
import { ConveyorBeltSection } from '@/components/sections/conveyor-belt-section'
import {
  ColorCodedMenuSection,
  SpecialOrderSection,
} from '@/components/sections/color-coded-menu-section'
import {
  FeaturedMenuSection,
  FullMenuSection,
} from '@/components/sections/sushi-menu-sections'
import { MenuCategorizedPricedSection } from '@/components/sections/menu-categorized-priced-section'
import { PropertyListingsSection } from '@/components/sections/property-listings-section'
import { IntakeQuestionnaireSection } from '@/components/sections/intake-questionnaire-section'
import { TieredServiceLadderSection } from '@/components/sections/tiered-service-ladder-section'
import { RegulatoryStatusBadgeSection } from '@/components/sections/regulatory-status-badge-section'
import { ComplianceDisclaimerFooterSection } from '@/components/sections/compliance-disclaimer-footer-section'
import { MortgageCalculatorSection } from '@/components/sections/mortgage-calculator-section'
import { WeeklyCadenceCalendarSection } from '@/components/sections/weekly-cadence-calendar-section'
import { SampleWeekPreviewSection } from '@/components/sections/sample-week-preview-section'
import { DeliverySlotPickerSection } from '@/components/sections/delivery-slot-picker-section'
// Egg farm sections
import { StockIndicator } from '@/components/sections/stock-indicator-section'
import { DeliveryCalculator } from '@/components/sections/delivery-calculator-section'
import { RecipeSection } from '@/components/sections/recipe-section'
import { ReviewsSection } from '@/components/sections/reviews-section'
import { SubscriptionSection } from '@/components/sections/subscription-section'
import { ReferralSection } from '@/components/sections/referral-section'
import { PriceListSection } from '@/components/sections/price-list-section'
import { PreOrderSection } from '@/components/sections/preorder-calendar-section'

/**
 * Section components keyed by kebab-case id — the canonical form used
 * across the registry, section-registry, and starter kits. For backwards
 * compatibility with callers that still pass camelCase ("trustSignals",
 * "conveyorBelt", etc.), `renderSection` normalizes the incoming id via
 * `toKebab()` before looking up the component.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SECTION_COMPONENTS: Record<string, React.ComponentType<any>> = {
  header: HeaderSection,
  hero: HeroSection,
  services: ServicesSection,
  booking: BookingSection,
  portfolio: PortfolioSection,
  'before-after': BeforeAfterSection,
  'class-schedule': ClassScheduleSection,
  'membership-plans': MembershipPlansSection,
  'room-booking': RoomBookingSection,
  'event-venues': EventVenuesSection,
  'quote-form': QuoteFormSection,
  'emergency-indicator': EmergencyIndicatorSection,
  'product-catalog': ProductCatalogSection,
  gallery: GallerySection,
  team: TeamSection,
  testimonials: TestimonialsSection,
  contact: ContactSection,
  faq: FAQSection,
  'cta-banner': CTABannerSection,
  footer: FooterSection,
  'whatsapp-float': WhatsAppFloat,
  // Service / consulting
  features: FeaturesSection,
  pricing: PricingTableSection,
  process: ProcessSection,
  'savings-calculator': SavingsCalculatorSection,
  // Relocation / B2B
  'trust-signals': TrustSignalsSection,
  'programs-comparison': ProgramsComparisonSection,
  'why-destination': WhyDestinationSection,
  'process-timeline': ProcessTimelineSection,
  // Restaurant / Sushi
  omakase: OmakaseSection,
  'sake-menu': SakeMenuSection,
  'conveyor-belt': ConveyorBeltSection,
  'featured-menu': FeaturedMenuSection,
  'full-menu': FullMenuSection,
  'color-coded-menu': ColorCodedMenuSection,
  'special-order': SpecialOrderSection,
  // Catalog / menu (categorized + priced)
  'menu-categorized-priced': MenuCategorizedPricedSection,
  // Real estate
  'property-listings': PropertyListingsSection,
  // Egg farm sections
  'stock-indicator': StockIndicator,
  'delivery-calculator': DeliveryCalculator,
  'recipes': RecipeSection,
  'reviews': ReviewsSection,
  'subscription': SubscriptionSection,
  'referral': ReferralSection,
  'price-list': PriceListSection,
  'preorder': PreOrderSection,
  // Lead capture (service businesses, creators, relocation)
  'intake-questionnaire': IntakeQuestionnaireSection,
  // Subscription / tiered-service progression
  'tiered-service-ladder': TieredServiceLadderSection,
  // Compliance / licenses / certifications
  'regulatory-status-badge': RegulatoryStatusBadgeSection,
  'compliance-disclaimer-footer': ComplianceDisclaimerFooterSection,
  // Real estate calculators
  'mortgage-calculator': MortgageCalculatorSection,
  // Relocation calculators (Nexa Paraguay)
  'cost-of-living': () => import('@/components/calculators/cost-of-living-estimator').then(m => m.CostOfLivingEstimator),
  'timeline': () => import('@/components/calculators/timeline-estimator').then(m => m.TimelineEstimator),
  'qualifier': () => import('@/components/calculators/residency-qualifier').then(m => m.ResidencyQualifier),
  'document-checklist': () => import('@/components/calculators/document-checklist').then(m => m.DocumentChecklist),
  'roi': () => import('@/components/calculators/roi-calculator').then(m => m.ROICalculator),
  'comparison': () => import('@/components/calculators/comparison-tool').then(m => m.ComparisonTool),
  // Subscription / retention (meal-prep, weekly delivery)
  'weekly-cadence-calendar': WeeklyCadenceCalendarSection,
  'sample-week-preview': SampleWeekPreviewSection,
  'delivery-slot-picker': DeliverySlotPickerSection,
}

export function renderSection(section: ComposedSection): React.ReactNode {
  const kebab = resolveSectionAlias(section.type)
  const Component = SECTION_COMPONENTS[kebab]
  if (!Component) {
    logger.warn('Unknown section type — skipping render', {
      action: 'renderSection',
      sectionType: section.type,
      normalized: kebab,
      order: section.order,
    })
    return null
  }

  return <Component key={`${kebab}-${section.order}`} {...section.data} />
}

export function renderSections(sections: ComposedSection[]): React.ReactNode[] {
  return sections
    .sort((a, b) => a.order - b.order)
    .map(renderSection)
    .filter(Boolean) as React.ReactNode[]
}
