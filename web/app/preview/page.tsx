import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

export const metadata = {
  title: 'Section Preview Gallery — ParaguAI Builder',
  description: 'Browse all available section components and their variants.',
}

interface SectionInfo {
  id: string
  defaultVariant: string
  variants: string[]
  aliases: string[]
  category: string
}

function buildSectionCatalog(): SectionInfo[] {
  // Auto-generated from section-registry.ts
  const sections: SectionInfo[] = [
    // Navigation
    { id: 'header', defaultVariant: 'standard', variants: ['standard', 'sticky', 'transparent'], aliases: [], category: 'Navigation' },
    { id: 'footer', defaultVariant: 'standard', variants: ['standard', 'minimal'], aliases: [], category: 'Navigation' },
    { id: 'whatsapp-float', defaultVariant: 'standard', variants: ['standard'], aliases: ['whatsappFloat'], category: 'Navigation' },
    { id: 'contact-strip', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Navigation' },
    { id: 'floating-cta', defaultVariant: 'default', variants: ['default', 'minimal'], aliases: [], category: 'Navigation' },
    { id: 'smart-whatsapp', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Navigation' },
    { id: 'compliance-disclaimer-footer', defaultVariant: 'standard', variants: ['standard'], aliases: ['legalDisclaimer'], category: 'Navigation' },
    { id: 'language-selector', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Navigation' },
    { id: 'currency-toggle', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Navigation' },

    // Hero
    { id: 'hero', defaultVariant: 'image', variants: ['image', 'split', 'minimal'], aliases: [], category: 'Hero' },
    { id: 'hero-video', defaultVariant: 'video', variants: ['video', 'parallax'], aliases: [], category: 'Hero' },
    { id: 'age-gate', defaultVariant: 'modal', variants: ['modal'], aliases: [], category: 'Hero' },
    { id: 'trust-badges', defaultVariant: 'strip', variants: ['strip'], aliases: ['trustBadges'], category: 'Hero' },
    { id: 'trust-signals', defaultVariant: 'credentials', variants: ['credentials', 'logos-row'], aliases: ['trustSignals'], category: 'Hero' },
    { id: 'trust-signals-logos', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Hero' },
    { id: 'stats-counter', defaultVariant: 'inline', variants: ['inline', 'cards', 'minimal'], aliases: [], category: 'Hero' },
    { id: 'cta-banner', defaultVariant: 'gradient', variants: ['gradient', 'solid'], aliases: ['ctaBanner', 'deliveryLinks'], category: 'Hero' },
    { id: 'promo-banner', defaultVariant: 'countdown', variants: ['countdown', 'simple', 'carousel'], aliases: [], category: 'Hero' },

    // Content
    { id: 'services', defaultVariant: 'cards', variants: ['cards', 'list'], aliases: ['servicesPreview', 'serviceMenu'], category: 'Content' },
    { id: 'features', defaultVariant: 'three-col', variants: ['three-col', 'grid'], aliases: ['about', 'programs', 'caseStudies'], category: 'Content' },
    { id: 'process-timeline', defaultVariant: 'horizontal', variants: ['horizontal', 'vertical', 'stepped'], aliases: ['processTimeline'], category: 'Content' },
    { id: 'process', defaultVariant: 'steps', variants: ['steps', 'horizontal'], aliases: ['howItWorks'], category: 'Content' },
    { id: 'content-grid', defaultVariant: 'cards', variants: ['cards', 'grid', 'masonry', 'list', 'detailed', 'carousel', 'icon-cards'], aliases: [], category: 'Content' },
    { id: 'illustration', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Content' },
    { id: 'video-embed', defaultVariant: 'aspect-16-9', variants: ['aspect-16-9', 'aspect-4-3', 'square', 'full-width'], aliases: [], category: 'Content' },
    { id: 'logo-strip', defaultVariant: 'grid', variants: ['grid', 'carousel', 'single-row'], aliases: [], category: 'Content' },
    { id: 'open-hours-status', defaultVariant: 'standard', variants: ['standard'], aliases: ['businessHours'], category: 'Content' },
    { id: 'regulatory-status-badge', defaultVariant: 'badge', variants: ['badge', 'inline'], aliases: [], category: 'Content' },

    // Social Proof
    { id: 'testimonials', defaultVariant: 'carousel', variants: ['carousel', 'grid'], aliases: ['testimonial', 'successStories'], category: 'Social Proof' },
    { id: 'team', defaultVariant: 'cards', variants: ['cards', 'list', 'grid-photos'], aliases: ['teamProfiles'], category: 'Social Proof' },
    { id: 'faq', defaultVariant: 'accordion', variants: ['accordion'], aliases: ['faqCategorized'], category: 'Social Proof' },
    { id: 'enhanced-faq', defaultVariant: 'searchable', variants: ['searchable'], aliases: [], category: 'Social Proof' },
    { id: 'faq-categorized', defaultVariant: 'accordion', variants: ['accordion'], aliases: [], category: 'Social Proof' },
    { id: 'faq-chatbot', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Social Proof' },
    { id: 'google-reviews', defaultVariant: 'carousel', variants: ['carousel', 'grid'], aliases: [], category: 'Social Proof' },
    { id: 'google-reviews-widget', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Social Proof' },
    { id: 'reviews', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Social Proof' },
    { id: 'instagram-feed', defaultVariant: 'grid', variants: ['grid'], aliases: ['instagramFeed'], category: 'Social Proof' },

    // Media
    { id: 'gallery', defaultVariant: 'grid', variants: ['grid', 'masonry'], aliases: ['galleryPreview', 'photoGallery'], category: 'Media' },
    { id: 'portfolio', defaultVariant: 'grid', variants: ['grid'], aliases: ['portfolioGallery'], category: 'Media' },
    { id: 'before-after', defaultVariant: 'slider', variants: ['slider'], aliases: ['beforeAfter'], category: 'Media' },
    { id: 'before-after-split', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Media' },
    { id: 'photo-gallery', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Media' },
    { id: 'blog-index', defaultVariant: 'grid', variants: ['grid', 'list'], aliases: [], category: 'Media' },
    { id: 'blog-post', defaultVariant: 'article', variants: ['article'], aliases: [], category: 'Media' },
    { id: 'blog', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Media' },
    { id: 'blog-social-share', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Media' },
    { id: 'related-posts', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Media' },
    { id: 'timeline-history', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Media' },

    // Commerce
    { id: 'product-catalog', defaultVariant: 'grid', variants: ['grid', 'cards'], aliases: ['productCatalog', 'productGrid'], category: 'Commerce' },
    { id: 'featured-products', defaultVariant: 'grid', variants: ['grid'], aliases: [], category: 'Commerce' },
    { id: 'commerce-catalog', defaultVariant: 'grid', variants: ['grid'], aliases: [], category: 'Commerce' },
    { id: 'pricing-table', defaultVariant: 'default', variants: ['default'], aliases: ['pricingTable', 'membershipPlans'], category: 'Commerce' },
    { id: 'pricing-range', defaultVariant: 'tiers', variants: ['tiers'], aliases: [], category: 'Commerce' },
    { id: 'pricing', defaultVariant: 'tiered', variants: ['tiered'], aliases: [], category: 'Commerce' },
    { id: 'membership-plans', defaultVariant: 'cards', variants: ['cards'], aliases: [], category: 'Commerce' },
    { id: 'packages-giftcards', defaultVariant: 'tabs', variants: ['tabs'], aliases: [], category: 'Commerce' },
    { id: 'preorder-calendar', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Commerce' },
    { id: 'price-list', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Commerce' },
    { id: 'stock-indicator', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Commerce' },
    { id: 'subscription', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Commerce' },
    { id: 'referral', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Commerce' },
    { id: 'countdown-timer', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Commerce' },

    // Forms
    { id: 'contact', defaultVariant: 'split', variants: ['split', 'form-only'], aliases: ['contactSplit', 'locationBlock'], category: 'Forms' },
    { id: 'lead-form', defaultVariant: 'standard', variants: ['standard', 'compact'], aliases: ['leadForm'], category: 'Forms' },
    { id: 'quote-form', defaultVariant: 'standard', variants: ['standard'], aliases: ['quoteForm'], category: 'Forms' },
    { id: 'booking', defaultVariant: 'wizard', variants: ['wizard'], aliases: ['reservations'], category: 'Forms' },
    { id: 'booking-embed', defaultVariant: 'iframe', variants: ['iframe', 'link'], aliases: [], category: 'Forms' },
    { id: 'booking-wizard', defaultVariant: 'default', variants: ['default'], aliases: ['bookingWizard'], category: 'Forms' },
    { id: 'room-booking', defaultVariant: 'cards', variants: ['cards'], aliases: ['roomBooking'], category: 'Forms' },
    { id: 'newsletter-signup', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Forms' },
    { id: 'multi-step-form', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Forms' },
    { id: 'intake-wizard', defaultVariant: 'default', variants: ['default'], aliases: [], category: 'Forms' },
    { id: 'intake-questionnaire', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Forms' },
    { id: 'delivery-slot-picker', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Forms' },

    // Specialty
    { id: 'our-story', defaultVariant: 'narrative', variants: ['narrative'], aliases: [], category: 'Specialty' },
    { id: 'b2b-wholesale', defaultVariant: 'tiered', variants: ['tiered'], aliases: [], category: 'Specialty' },
    { id: 'why-destination', defaultVariant: 'three-col', variants: ['three-col', 'alternating'], aliases: ['whyDestination'], category: 'Specialty' },
    { id: 'programs-comparison', defaultVariant: 'tiered', variants: ['tiered', 'matrix'], aliases: ['programsComparison'], category: 'Specialty' },
    { id: 'tiered-service-ladder', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Specialty' },
    { id: 'google-maps', defaultVariant: 'default', variants: ['default'], aliases: ['googleMaps'], category: 'Specialty' },
    { id: 'branches', defaultVariant: 'cards', variants: ['cards', 'list', 'map'], aliases: ['sucursales'], category: 'Specialty' },
    { id: 'event-venues', defaultVariant: 'cards', variants: ['cards'], aliases: ['eventsCalendar'], category: 'Specialty' },
    { id: 'class-schedule', defaultVariant: 'grid', variants: ['grid'], aliases: ['classSchedule'], category: 'Specialty' },
    { id: 'emergency-indicator', defaultVariant: 'banner', variants: ['banner'], aliases: ['emergencyIndicator'], category: 'Specialty' },
    { id: 'property-listings', defaultVariant: 'cards', variants: ['cards', 'listings-from-api'], aliases: ['properties'], category: 'Specialty' },
    { id: 'resources-list', defaultVariant: 'three-col', variants: ['three-col', 'grid'], aliases: ['resourceList'], category: 'Specialty' },
    { id: 'service-area-map-zones', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Specialty' },
    { id: 'maturity-assessment', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Specialty' },
    { id: 'mattress-quiz', defaultVariant: 'default', variants: ['default'], aliases: [], category: 'Specialty' },
    { id: 'recipes', defaultVariant: 'grid', variants: ['grid'], aliases: [], category: 'Specialty' },
    { id: 'conveyor-belt', defaultVariant: 'animated', variants: ['animated'], aliases: [], category: 'Specialty' },
    { id: 'conveyor-belt-strip', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Specialty' },
    { id: 'omakase', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Specialty' },
    { id: 'sake-menu', defaultVariant: 'grouped', variants: ['grouped'], aliases: ['sakeMenu'], category: 'Specialty' },
    { id: 'menu-categorized-priced', defaultVariant: 'categorized', variants: ['categorized'], aliases: ['featuredMenu'], category: 'Specialty' },
    { id: 'color-coded-menu', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Specialty' },
    { id: 'sample-week-preview', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Specialty' },
    { id: 'weekly-cadence-calendar', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Specialty' },
    { id: 'weekly-schedule', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Specialty' },
    { id: 'delivery-calculator', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Specialty' },
    { id: 'success-stories', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Specialty' },

    // Calculators
    { id: 'tax-savings-calculator', defaultVariant: 'default', variants: ['default'], aliases: [], category: 'Calculators' },
    { id: 'tax-deadline-banner', defaultVariant: 'default', variants: ['default'], aliases: [], category: 'Calculators' },
    { id: 'savings-calculator', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Calculators' },
    { id: 'mortgage-calculator', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Calculators' },
    { id: 'bulk-calculator', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Calculators' },
    { id: 'calc-irp', defaultVariant: 'default', variants: ['default'], aliases: [], category: 'Calculators' },
    { id: 'calc-aguinaldo', defaultVariant: 'default', variants: ['default'], aliases: [], category: 'Calculators' },
    { id: 'calc-finiquito', defaultVariant: 'default', variants: ['default'], aliases: [], category: 'Calculators' },
    { id: 'calc-iva', defaultVariant: 'default', variants: ['default'], aliases: [], category: 'Calculators' },
    { id: 'calc-ire', defaultVariant: 'default', variants: ['default'], aliases: [], category: 'Calculators' },
    { id: 'calc-ips', defaultVariant: 'default', variants: ['default'], aliases: [], category: 'Calculators' },
    { id: 'calc-costo-empleado', defaultVariant: 'default', variants: ['default'], aliases: [], category: 'Calculators' },
    { id: 'calc-resimple-qualifier', defaultVariant: 'standard', variants: ['standard'], aliases: [], category: 'Calculators' },
  ]

  return sections
}

const CATEGORY_ORDER = ['Navigation', 'Hero', 'Content', 'Social Proof', 'Media', 'Commerce', 'Forms', 'Specialty', 'Calculators']

export default function PreviewGalleryPage() {
  const sections = buildSectionCatalog()

  const grouped: Record<string, SectionInfo[]> = {}
  for (const s of sections) {
    if (!grouped[s.category]) grouped[s.category] = []
    grouped[s.category].push(s)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-wider text-primary">
            {sections.length} section components
          </p>
          <Heading level={1}>Section Preview Gallery</Heading>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Browse all available section components. Click any section to view all its variants with sample content.
          </p>
        </div>

        {CATEGORY_ORDER.map((cat) => {
          const items = grouped[cat]
          if (!items) return null
          return (
            <section key={cat} id={cat.toLowerCase()} className="mb-12 scroll-mt-8">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                {cat}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  {items.length} components
                </span>
              </h2>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((s) => (
                  <a
                    key={s.id}
                    href={`/preview/${s.id}`}
                    className="group block rounded-lg border border-border bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-[var(--primary)]/30 hover:shadow-md"
                  >
                    <p className="truncate text-sm font-semibold text-foreground">{s.id}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      default: <code className="rounded bg-surface-light px-1 py-0.5 font-mono text-xs">{s.defaultVariant}</code>
                      {' · '}
                      variants: <code className="rounded bg-surface-light px-1 py-0.5 font-mono text-xs">{s.variants.length}</code>
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {s.variants.map((v) => (
                        <span key={v} className="rounded-full bg-surface-light px-2 py-0.5 text-[10px] text-muted-foreground">
                          {v}
                        </span>
                      ))}
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )
        })}

        <div className="mt-16 border-t border-border pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Built from {sections.length} registered sections · Add new sections to <code>section-registry.ts</code>
          </p>
        </div>
      </div>
    </main>
  )
}
