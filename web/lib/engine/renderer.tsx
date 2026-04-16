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
import { ServiceCategoriesSection } from '@/components/sections/service-categories-section'
import { ProductCatalogSection } from '@/components/sections/product-catalog-section'
import { ProgramComparisonSection } from '@/components/sections/program-comparison-section'
import { ProcessTimelineSection } from '@/components/sections/process-timeline-section'
import { WhySection } from '@/components/sections/why-section'
import { TrustSignalsSection } from '@/components/sections/trust-signals-section'
import { GallerySection } from '@/components/sections/gallery-section'
import { TeamSection } from '@/components/sections/team-section'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { ContactSection } from '@/components/sections/contact-section'
import { ContactFormSection } from '@/components/sections/contact-form-section'
import { FAQSection } from '@/components/sections/faq-section'
import { CTABannerSection } from '@/components/sections/cta-banner-section'
import { FooterSection } from '@/components/sections/footer-section'
import { WhatsAppFloat } from '@/components/sections/whatsapp-float'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SECTION_COMPONENTS: Record<string, React.ComponentType<any>> = {
  header: HeaderSection,
  hero: HeroSection,
  services: ServicesSection,
  serviceCategories: ServiceCategoriesSection,
  productCatalog: ProductCatalogSection,
  programComparison: ProgramComparisonSection,
  processTimeline: ProcessTimelineSection,
  whySection: WhySection,
  trustSignals: TrustSignalsSection,
  gallery: GallerySection,
  team: TeamSection,
  testimonials: TestimonialsSection,
  contact: ContactSection,
  contactForm: ContactFormSection,
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
