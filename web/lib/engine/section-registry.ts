/**
 * Runtime registry of available sections. Tenants reference sections by
 * `id` + optional `variant` in their pages/*.json files. The engine
 * refuses to render unknown section ids. Adding a section here is the
 * only code change needed to expose a new building block to every tenant.
 */

export interface SectionManifest {
  id: string
  defaultVariant: string
  variants: string[]
  requiredContentFields?: string[]
}

export const SECTION_CATALOG: Record<string, SectionManifest> = {
  header: {
    id: 'header',
    defaultVariant: 'standard',
    variants: ['standard'],
    requiredContentFields: ['businessName', 'navItems'],
  },
  hero: {
    id: 'hero',
    defaultVariant: 'image',
    variants: ['image', 'split', 'minimal'],
    requiredContentFields: ['headline'],
  },
  services: {
    id: 'services',
    defaultVariant: 'cards',
    variants: ['cards', 'list'],
  },
  'programs-comparison': {
    id: 'programs-comparison',
    defaultVariant: 'tiered',
    variants: ['tiered', 'matrix'],
    requiredContentFields: ['tiers'],
  },
  'process-timeline': {
    id: 'process-timeline',
    defaultVariant: 'horizontal',
    variants: ['horizontal', 'vertical', 'stepped'],
    requiredContentFields: ['steps'],
  },
  'why-destination': {
    id: 'why-destination',
    defaultVariant: 'three-col',
    variants: ['three-col', 'alternating'],
    requiredContentFields: ['pillars'],
  },
  'trust-signals': {
    id: 'trust-signals',
    defaultVariant: 'credentials',
    variants: ['credentials', 'logos-row'],
    requiredContentFields: ['items'],
  },
  'tax-savings-calculator': {
    id: 'tax-savings-calculator',
    defaultVariant: 'default',
    variants: ['default'],
    requiredContentFields: [],
  },
  'tax-deadline-banner': {
    id: 'tax-deadline-banner',
    defaultVariant: 'default',
    variants: ['default'],
    requiredContentFields: [],
  },
  'calc-irp': {
    id: 'calc-irp',
    defaultVariant: 'default',
    variants: ['default'],
    requiredContentFields: [],
  },
  'calc-aguinaldo': {
    id: 'calc-aguinaldo',
    defaultVariant: 'default',
    variants: ['default'],
    requiredContentFields: [],
  },
  'calc-finiquito': {
    id: 'calc-finiquito',
    defaultVariant: 'default',
    variants: ['default'],
    requiredContentFields: [],
  },
  'calc-iva': {
    id: 'calc-iva',
    defaultVariant: 'default',
    variants: ['default'],
    requiredContentFields: [],
  },
  'calc-ire': {
    id: 'calc-ire',
    defaultVariant: 'default',
    variants: ['default'],
    requiredContentFields: [],
  },
  'calc-ips': {
    id: 'calc-ips',
    defaultVariant: 'default',
    variants: ['default'],
    requiredContentFields: [],
  },
  'calc-costo-empleado': {
    id: 'calc-costo-empleado',
    defaultVariant: 'default',
    variants: ['default'],
    requiredContentFields: [],
  },
  'intake-wizard': {
    id: 'intake-wizard',
    defaultVariant: 'default',
    variants: ['default'],
    requiredContentFields: [],
  },
  'mattress-quiz': {
    id: 'mattress-quiz',
    defaultVariant: 'default',
    variants: ['default'],
    requiredContentFields: ['steps', 'products'],
  },
  gallery: {
    id: 'gallery',
    defaultVariant: 'grid',
    variants: ['grid', 'masonry'],
  },
  illustration: {
    id: 'illustration',
    defaultVariant: 'standard',
    variants: ['standard'],
    requiredContentFields: ['src'],
  },
  team: {
    id: 'team',
    defaultVariant: 'cards',
    variants: ['cards', 'list'],
  },
  testimonials: {
    id: 'testimonials',
    defaultVariant: 'carousel',
    variants: ['carousel', 'grid'],
  },
  contact: {
    id: 'contact',
    defaultVariant: 'split',
    variants: ['split', 'form-only'],
  },
  faq: {
    id: 'faq',
    defaultVariant: 'accordion',
    variants: ['accordion'],
    requiredContentFields: ['items'],
  },
  'cta-banner': {
    id: 'cta-banner',
    defaultVariant: 'gradient',
    variants: ['gradient', 'solid'],
    requiredContentFields: ['title', 'buttonText'],
  },
  'booking-embed': {
    id: 'booking-embed',
    defaultVariant: 'iframe',
    variants: ['iframe', 'link'],
  },
  'blog-index': {
    id: 'blog-index',
    defaultVariant: 'grid',
    variants: ['grid', 'list'],
  },
  'blog-post': {
    id: 'blog-post',
    defaultVariant: 'article',
    variants: ['article'],
  },
  'product-catalog': {
    id: 'product-catalog',
    defaultVariant: 'grid',
    variants: ['grid'],
  },
  'featured-products': {
    // Live homepage preview of the first N products from the tenant's
    // commerce DB. Unlike `product-catalog` (static JSON), this queries
    // the `products` table at render time and links to the real PDP.
    id: 'featured-products',
    defaultVariant: 'grid',
    variants: ['grid'],
  },
  'commerce-catalog': {
    // Full DB-backed product grid for embedding the tienda experience
    // on a marketing page (e.g. fun4me's /fun4me/store). Differs from
    // `product-catalog` (static JSON, WhatsApp-to-order) and from
    // `featured-products` (small homepage rail). Returns null when the
    // business has no active products.
    id: 'commerce-catalog',
    defaultVariant: 'grid',
    variants: ['grid'],
  },
  'age-gate': {
    // Self-declared 18+ modal for adult-content tenants. Registry flags
    // `features.ageGate.enabled: true, minAge: N` on sex_shop,
    // cigar_lounge_shop, onlyfans_creator_studio, etc. Returns null
    // when the visitor has already confirmed (localStorage flag).
    id: 'age-gate',
    defaultVariant: 'modal',
    variants: ['modal'],
  },
  'trust-badges': {
    // Horizontal strip of short trust signals (envío discreto / pago
    // seguro / etc.) driven by content.home.trustBadges or similar
    // content ref. Simpler than `trust-signals` which is a
    // credentials/logos-row section; this one is a pure badge strip.
    id: 'trust-badges',
    defaultVariant: 'strip',
    variants: ['strip'],
  },
  footer: {
    id: 'footer',
    defaultVariant: 'standard',
    variants: ['standard', 'minimal'],
  },
  'whatsapp-float': {
    id: 'whatsapp-float',
    defaultVariant: 'standard',
    variants: ['standard'],
  },
  'before-after': {
    id: 'before-after',
    defaultVariant: 'slider',
    variants: ['slider'],
    requiredContentFields: ['items'],
  },
  booking: {
    id: 'booking',
    defaultVariant: 'wizard',
    variants: ['wizard'],
    requiredContentFields: ['services'],
  },
  'class-schedule': {
    id: 'class-schedule',
    defaultVariant: 'grid',
    variants: ['grid'],
    requiredContentFields: ['classes'],
  },
  'emergency-indicator': {
    id: 'emergency-indicator',
    defaultVariant: 'banner',
    variants: ['banner'],
  },
  'event-venues': {
    id: 'event-venues',
    defaultVariant: 'cards',
    variants: ['cards'],
    requiredContentFields: ['venues'],
  },
  'membership-plans': {
    id: 'membership-plans',
    defaultVariant: 'cards',
    variants: ['cards'],
    requiredContentFields: ['plans'],
  },
  portfolio: {
    id: 'portfolio',
    defaultVariant: 'grid',
    variants: ['grid'],
    requiredContentFields: ['items'],
  },
  'quote-form': {
    id: 'quote-form',
    defaultVariant: 'standard',
    variants: ['standard'],
  },
  'room-booking': {
    id: 'room-booking',
    defaultVariant: 'cards',
    variants: ['cards'],
    requiredContentFields: ['rooms'],
  },
  'lead-form': {
    id: 'lead-form',
    defaultVariant: 'standard',
    variants: ['standard', 'compact'],
    requiredContentFields: ['title'],
  },
  'menu-categorized-priced': {
    id: 'menu-categorized-priced',
    defaultVariant: 'categorized',
    variants: ['categorized'],
    requiredContentFields: ['items'],
  },
  'pricing-range': {
    id: 'pricing-range',
    defaultVariant: 'tiers',
    variants: ['tiers'],
  },
  'pricing-table': {
    id: 'pricing-table',
    defaultVariant: 'default',
    variants: ['default'],
  },
  'faq-categorized': {
    id: 'faq-categorized',
    defaultVariant: 'accordion',
    variants: ['accordion'],
  },
  'property-listings': {
    id: 'property-listings',
    defaultVariant: 'cards',
    variants: ['cards', 'listings-from-api'],
  },
  features: {
    id: 'features',
    defaultVariant: 'three-col',
    variants: ['three-col', 'grid'],
  },
  'resources-list': {
    id: 'resources-list',
    defaultVariant: 'three-col',
    variants: ['three-col', 'grid'],
  },
  pricing: {
    id: 'pricing',
    defaultVariant: 'tiered',
    variants: ['tiered', 'table'],
  },
  process: {
    id: 'process',
    defaultVariant: 'steps',
    variants: ['steps', 'horizontal'],
  },
  'savings-calculator': {
    id: 'savings-calculator',
    defaultVariant: 'standard',
    variants: ['standard'],
  },
  omakase: {
    id: 'omakase',
    defaultVariant: 'standard',
    variants: ['standard'],
  },
  'sake-menu': {
    id: 'sake-menu',
    defaultVariant: 'grouped',
    variants: ['grouped'],
  },
  'conveyor-belt': {
    id: 'conveyor-belt',
    defaultVariant: 'animated',
    variants: ['animated'],
  },
  'intake-questionnaire': {
    id: 'intake-questionnaire',
    defaultVariant: 'standard',
    variants: ['standard'],
    requiredContentFields: ['title', 'questions'],
  },
  'tiered-service-ladder': {
    id: 'tiered-service-ladder',
    defaultVariant: 'standard',
    variants: ['standard'],
    requiredContentFields: ['tiers'],
  },
  'regulatory-status-badge': {
    id: 'regulatory-status-badge',
    defaultVariant: 'badge',
    variants: ['badge', 'inline'],
    requiredContentFields: ['items'],
  },
  'compliance-disclaimer-footer': {
    id: 'compliance-disclaimer-footer',
    defaultVariant: 'standard',
    variants: ['standard'],
    requiredContentFields: ['paragraphs'],
  },
  'mortgage-calculator': {
    id: 'mortgage-calculator',
    defaultVariant: 'standard',
    variants: ['standard'],
    requiredContentFields: ['defaultPrincipal', 'currency', 'termYearsOptions', 'ratePresets'],
  },
  'weekly-cadence-calendar': {
    id: 'weekly-cadence-calendar',
    defaultVariant: 'standard',
    variants: ['standard'],
    requiredContentFields: ['phases'],
  },
  'sample-week-preview': {
    id: 'sample-week-preview',
    defaultVariant: 'standard',
    variants: ['standard'],
    requiredContentFields: ['items'],
  },
  'delivery-slot-picker': {
    id: 'delivery-slot-picker',
    defaultVariant: 'standard',
    variants: ['standard'],
    requiredContentFields: ['slots'],
  },
  // Egg-farm / granja-cabral sections (PR #108)
  'enhanced-faq': {
    id: 'enhanced-faq',
    defaultVariant: 'searchable',
    variants: ['searchable'],
    requiredContentFields: ['business'],
  },
  'our-story': {
    id: 'our-story',
    defaultVariant: 'narrative',
    variants: ['narrative'],
    requiredContentFields: ['business'],
  },
  'b2b-wholesale': {
    id: 'b2b-wholesale',
    defaultVariant: 'tiered',
    variants: ['tiered'],
    requiredContentFields: ['business'],
  },
  recipes: {
    id: 'recipes',
    defaultVariant: 'grid',
    variants: ['grid'],
    requiredContentFields: ['business'],
  },
  'promo-banner': {
    id: 'promo-banner',
    defaultVariant: 'countdown',
    variants: ['countdown', 'simple', 'carousel'],
    requiredContentFields: ['promotions'],
  },
  'newsletter-signup': {
    id: 'newsletter-signup',
    defaultVariant: 'standard',
    variants: ['standard'],
  },
  'open-hours-status': {
    id: 'open-hours-status',
    defaultVariant: 'standard',
    variants: ['standard'],
    requiredContentFields: ['hours'],
  },
}

/**
 * Legacy section aliases — hand-curated types (peluqueria, gimnasio, etc.)
 * reference sections by non-canonical names that predate kebab-case
 * standardization. `resolveSectionAlias()` converts any of these to their
 * canonical kebab-case id so the renderer, hasSection, and contract tests
 * stay consistent.
 */
const SECTION_ALIASES: Record<string, string> = {
  // camelCase/snake_case singular → canonical kebab
  servicesPreview: 'services',
  services_preview: 'services',
  servicemenu: 'services',
  'service-menu': 'services',
  serviceMenu: 'services',
  portfolioGallery: 'portfolio',
  portfolio_gallery: 'portfolio',
  photoGallery: 'gallery',
  photo_gallery: 'gallery',
  testimonial: 'testimonials',
  teamProfiles: 'team',
  team_profiles: 'team',
  contactSplit: 'contact',
  contactInfo: 'contact',
  contact_split: 'contact',
  locationBlock: 'contact',
  location: 'contact',
  googleMaps: 'contact',
  'google-maps': 'contact',
  businessHours: 'contact',
  'business-hours': 'contact',
  ctaBanner: 'cta-banner',
  whatsappFloat: 'whatsapp-float',
  pricingTable: 'pricing-table',
  pricingRange: 'pricing-range',
  faqCategorized: 'faq-categorized',
  // Creative-commission-process has no dedicated component — route to
  // process-timeline (same UX: numbered steps timeline).
  creativeCommissionProcess: 'process-timeline',
  'creative-commission-process': 'process-timeline',
  emergencyIndicator: 'emergency-indicator',
  classSchedule: 'class-schedule',
  membershipPlans: 'membership-plans',
  roomBooking: 'room-booking',
  eventVenues: 'event-venues',
  quoteForm: 'quote-form',
  leadForm: 'lead-form',
  productCatalog: 'product-catalog',
  beforeAfter: 'before-after',
  trustSignals: 'trust-signals',
  trustBadges: 'trust-badges',
  programsComparison: 'programs-comparison',
  whyDestination: 'why-destination',
  processTimeline: 'process-timeline',
  featuredMenu: 'menu-categorized-priced',
  fullMenu: 'menu-categorized-priced',
  colorCodedMenu: 'menu-categorized-priced',
  reservations: 'booking',
  reservationForm: 'booking',
  availabilityCalendar: 'booking',
  packages: 'pricing',
  packageBuilder: 'pricing',
  properties: 'property-listings',
  caseStudies: 'features',
  'case-studies': 'features',
  eventsCalendar: 'event-venues',
  'events-calendar': 'event-venues',
  insuranceList: 'features',
  'insurance-list': 'features',
  sakeMenu: 'sake-menu',
  conveyorBelt: 'conveyor-belt',
  menuCategorizedPriced: 'menu-categorized-priced',
  propertyListings: 'property-listings',
  deliveryLinks: 'cta-banner',
  'delivery-links': 'cta-banner',
  serviceAreaMap: 'why-destination',
  'service-area-map': 'why-destination',
  howItWorks: 'process',
  'how-it-works': 'process',
  featured_menu: 'menu-categorized-priced',
  'featured-menu': 'menu-categorized-priced',
  galleryPreview: 'gallery',
  'gallery-preview': 'gallery',
  'location-block': 'contact',
  location_block: 'contact',
  sakePairing: 'sake-menu',
  'sake-pairing': 'sake-menu',
  'services-preview': 'services',
  // Sections without direct component — route to "features" as a card grid.
  about: 'features',
  programs: 'features',
  staffSelector: 'features',
  'staff-selector': 'features',
  ctaBanners: 'cta-banner',
}

export function resolveSectionAlias(id: string): string {
  // Fast path — already canonical.
  if (id in SECTION_CATALOG) return id
  if (id in SECTION_ALIASES) return SECTION_ALIASES[id]
  // camelCase → kebab fallback
  const kebab = id.replace(/_/g, '-').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  if (kebab in SECTION_CATALOG) return kebab
  if (kebab in SECTION_ALIASES) return SECTION_ALIASES[kebab]
  return id
}

export function hasSection(id: string): boolean {
  const resolved = resolveSectionAlias(id)
  return Object.prototype.hasOwnProperty.call(SECTION_CATALOG, resolved)
}

export function hasVariant(id: string, variant: string): boolean {
  const resolved = resolveSectionAlias(id)
  const manifest = SECTION_CATALOG[resolved]
  return !!manifest && manifest.variants.includes(variant)
}

export function defaultVariant(id: string): string {
  const resolved = resolveSectionAlias(id)
  const manifest = SECTION_CATALOG[resolved]
  if (!manifest) throw new Error(`[section-registry] Unknown section: ${id}`)
  return manifest.defaultVariant
}

export function allSectionIds(): string[] {
  return Object.keys(SECTION_CATALOG)
}
