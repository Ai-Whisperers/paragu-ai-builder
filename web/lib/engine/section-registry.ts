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
    variants: ['standard', 'sticky', 'transparent'],
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
  'contact-strip': {
    id: 'contact-strip',
    defaultVariant: 'standard',
    variants: ['standard'],
  },
  team: {
    id: 'team',
    defaultVariant: 'cards',
    variants: ['cards', 'list', 'grid-photos'],
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
  'booking-wizard': {
    id: 'booking-wizard',
    defaultVariant: 'default',
    variants: ['default'],
  },
  'google-maps': {
    id: 'google-maps',
    defaultVariant: 'default',
    variants: ['default'],
  },
  'floating-cta': {
    id: 'floating-cta',
    defaultVariant: 'default',
    variants: ['default', 'minimal'],
  },
  'hero-video': {
    id: 'hero-video',
    defaultVariant: 'video',
    variants: ['video', 'parallax'],
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
    variants: ['grid', 'cards'],
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
  'google-reviews': {
    id: 'google-reviews',
    defaultVariant: 'carousel',
    variants: ['carousel', 'grid'],
    requiredContentFields: ['reviews'],
  },
  'packages-giftcards': {
    id: 'packages-giftcards',
    defaultVariant: 'tabs',
    variants: ['tabs'],
    requiredContentFields: ['packages'],
  },
  'instagram-feed': {
    id: 'instagram-feed',
    defaultVariant: 'grid',
    variants: ['grid'],
    requiredContentFields: ['posts'],
  },
  branches: {
    id: 'branches',
    defaultVariant: 'cards',
    variants: ['cards', 'list', 'map'],
    requiredContentFields: ['branches'],
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
  // ── Unified grid (replaces gallery, portfolio, features, services, team, etc.)
  'content-grid': {
    id: 'content-grid',
    defaultVariant: 'cards',
    variants: ['cards', 'grid', 'masonry', 'list', 'detailed', 'carousel', 'icon-cards'],
  },
  // ── Core sections (added 2026-04-26) ───────────────────────────
  'stats-counter': {
    id: 'stats-counter',
    defaultVariant: 'inline',
    variants: ['inline', 'cards', 'minimal'],
  },
  'logo-strip': {
    id: 'logo-strip',
    defaultVariant: 'grid',
    variants: ['grid', 'carousel', 'single-row'],
  },
  'video-embed': {
    id: 'video-embed',
    defaultVariant: 'aspect-16-9',
    variants: ['aspect-16-9', 'aspect-4-3', 'square', 'full-width'],
  },
  // ── Unregistered sections (BATCH 4.27 audit) ──────────────────
  'before-after-split': { id: 'before-after-split', defaultVariant: 'split', variants: ['split'] },
  'blog': { id: 'blog', defaultVariant: 'grid', variants: ['grid'] },
  'blog-social-share': { id: 'blog-social-share', defaultVariant: 'horizontal', variants: ['horizontal'] },
  'bulk-calculator': { id: 'bulk-calculator', defaultVariant: 'standard', variants: ['standard'] },
  'calc-resimple-qualifier': { id: 'calc-resimple-qualifier', defaultVariant: 'standard', variants: ['standard'] },
  'color-coded-menu': { id: 'color-coded-menu', defaultVariant: 'grouped', variants: ['grouped'] },
  'conveyor-belt-strip': { id: 'conveyor-belt-strip', defaultVariant: 'scrolling', variants: ['scrolling'] },
  'countdown-timer': { id: 'countdown-timer', defaultVariant: 'standard', variants: ['standard'] },
  'currency-toggle': { id: 'currency-toggle', defaultVariant: 'switch', variants: ['switch'] },
  'delivery-calculator': { id: 'delivery-calculator', defaultVariant: 'standard', variants: ['standard'] },
  'faq-chatbot': { id: 'faq-chatbot', defaultVariant: 'chat', variants: ['chat'] },
  'google-reviews-widget': { id: 'google-reviews-widget', defaultVariant: 'carousel', variants: ['carousel'] },
  'language-selector': { id: 'language-selector', defaultVariant: 'dropdown', variants: ['dropdown'] },
  'maturity-assessment': { id: 'maturity-assessment', defaultVariant: 'quiz', variants: ['quiz'] },
  'multi-step-form': { id: 'multi-step-form', defaultVariant: 'wizard', variants: ['wizard'] },
  'photo-gallery': { id: 'photo-gallery', defaultVariant: 'grid', variants: ['grid'] },
  'preorder-calendar': { id: 'preorder-calendar', defaultVariant: 'calendar', variants: ['calendar'] },
  'price-list': { id: 'price-list', defaultVariant: 'list', variants: ['list'] },
  'recipe': { id: 'recipe', defaultVariant: 'card', variants: ['card'] },
  'referral': { id: 'referral', defaultVariant: 'standard', variants: ['standard'] },
  'related-posts': { id: 'related-posts', defaultVariant: 'grid', variants: ['grid'] },
  'reviews': { id: 'reviews', defaultVariant: 'carousel', variants: ['carousel', 'list'] },
  'service-area-map-zones': { id: 'service-area-map-zones', defaultVariant: 'map', variants: ['map'] },
  'smart-whatsapp': { id: 'smart-whatsapp', defaultVariant: 'button', variants: ['button'] },
  'stock-indicator': { id: 'stock-indicator', defaultVariant: 'badge', variants: ['badge'] },
  'subscription': { id: 'subscription', defaultVariant: 'plans', variants: ['plans'] },
  'success-stories': { id: 'success-stories', defaultVariant: 'carousel', variants: ['carousel'] },
  'sushi-menu-sections': { id: 'sushi-menu-sections', defaultVariant: 'grid', variants: ['grid'] },
  'testimonial-video': { id: 'testimonial-video', defaultVariant: 'video', variants: ['video'] },
  'timeline-history': { id: 'timeline-history', defaultVariant: 'vertical', variants: ['vertical'] },
  'trust-signals-logos': { id: 'trust-signals-logos', defaultVariant: 'logo-row', variants: ['logo-row'] },
  'weekly-schedule': { id: 'weekly-schedule', defaultVariant: 'grid', variants: ['grid'] },
}

/**
 * Legacy section aliases — hand-curated types (peluqueria, gimnasio, etc.)
 * reference sections by non-canonical names that predate kebab-case
 * standardization. `resolveSectionAlias()` converts any of these to their
 * canonical kebab-case id so the renderer, hasSection, and contract tests
 * stay consistent.
 */

  // === Phase 1: Paraguay-Local Essentials ===
  'payment-methods': {
    id: 'payment-methods',
    defaultVariant: 'strip',
    variants: ['strip', 'grid', 'compact'],
  },
  'currency-display': {
    id: 'currency-display',
    defaultVariant: 'toggle',
    variants: ['toggle', 'inline', 'dropdown'],
  },
  'delivery-zones': {
    id: 'delivery-zones',
    defaultVariant: 'list',
    variants: ['list', 'cards'],
  },
  'shipping-calculator': {
    id: 'shipping-calculator',
    defaultVariant: 'form',
    variants: ['form', 'simple'],
  },
  'ruc-timbrado-display': {
    id: 'ruc-timbrado-display',
    defaultVariant: 'footer',
    variants: ['footer', 'inline', 'badge'],
  },
  'horarios-atencion': {
    id: 'horarios-atencion',
    defaultVariant: 'table',
    variants: ['table', 'list', 'badge', 'inline'],
  },
  'whatsapp-order-form': {
    id: 'whatsapp-order-form',
    defaultVariant: 'inline',
    variants: ['inline', 'modal'],
  },
  // === Phase 2: Business Operations ===
  'appointment-list': {
    id: 'appointment-list',
    defaultVariant: 'cards',
    variants: ['cards', 'list'],
  },
  'invoice-display': {
    id: 'invoice-display',
    defaultVariant: 'table',
    variants: ['table', 'card'],
  },
  'service-packages': {
    id: 'service-packages',
    defaultVariant: 'cards',
    variants: ['cards', 'tiered'],
  },
  'membership-card': {
    id: 'membership-card',
    defaultVariant: 'card',
    variants: ['card', 'inline', 'badge'],
  },
  'appointment-reminder': {
    id: 'appointment-reminder',
    defaultVariant: 'banner',
    variants: ['banner', 'card', 'inline'],
  },
  'order-tracking': {
    id: 'order-tracking',
    defaultVariant: 'timeline',
    variants: ['timeline', 'steps', 'card'],
  },
  'warranty-info': {
    id: 'warranty-info',
    defaultVariant: 'accordion',
    variants: ['accordion', 'cards'],
  },
  'loyalty-progress': {
    id: 'loyalty-progress',
    defaultVariant: 'bar',
    variants: ['bar', 'card', 'tier'],
  },
  // === Phase 3: Healthcare ===
  'doctor-profile': {
    id: 'doctor-profile',
    defaultVariant: 'card',
    variants: ['card', 'list', 'detailed'],
  },
  'insurance-accepted': {
    id: 'insurance-accepted',
    defaultVariant: 'grid',
    variants: ['grid', 'list'],
  },
  'symptom-checker': {
    id: 'symptom-checker',
    defaultVariant: 'wizard',
    variants: ['wizard'],
  },
  'health-tips-carousel': {
    id: 'health-tips-carousel',
    defaultVariant: 'carousel',
    variants: ['carousel', 'grid'],
  },
  'telemedicine-banner': {
    id: 'telemedicine-banner',
    defaultVariant: 'banner',
    variants: ['banner', 'card', 'float'],
  },
  // === Phase 4: Food & Beverage ===
  'daily-menu': {
    id: 'daily-menu',
    defaultVariant: 'grid',
    variants: ['grid', 'list'],
  },
  'online-ordering': {
    id: 'online-ordering',
    defaultVariant: 'inline',
    variants: ['inline'],
  },
  'delivery-status': {
    id: 'delivery-status',
    defaultVariant: 'timeline',
    variants: ['timeline', 'card'],
  },
  'nutrition-info': {
    id: 'nutrition-info',
    defaultVariant: 'table',
    variants: ['table', 'cards'],
  },
  'reservation-form': {
    id: 'reservation-form',
    defaultVariant: 'standard',
    variants: ['standard', 'compact'],
  },
  // === Phase 5: Education ===
  'course-catalog': {
    id: 'course-catalog',
    defaultVariant: 'grid',
    variants: ['grid', 'cards'],
  },
  'class-enrollment': {
    id: 'class-enrollment',
    defaultVariant: 'form',
    variants: ['form', 'compact'],
  },
  'instructor-profile': {
    id: 'instructor-profile',
    defaultVariant: 'card',
    variants: ['card', 'list'],
  },
  'course-progress': {
    id: 'course-progress',
    defaultVariant: 'bar',
    variants: ['bar', 'steps'],
  },
  // === Phase 6: Real Estate ===
  'property-detail': {
    id: 'property-detail',
    defaultVariant: 'gallery',
    variants: ['gallery', 'split'],
  },
  'property-search': {
    id: 'property-search',
    defaultVariant: 'full',
    variants: ['full', 'compact'],
  },
  'agent-profile': {
    id: 'agent-profile',
    defaultVariant: 'card',
    variants: ['card', 'list'],
  },
  // === Phase 7: Automotive ===
  'vehicle-listing': {
    id: 'vehicle-listing',
    defaultVariant: 'grid',
    variants: ['grid', 'list'],
  },
  'service-scheduler': {
    id: 'service-scheduler',
    defaultVariant: 'form',
    variants: ['form', 'compact'],
  },
  'part-finder': {
    id: 'part-finder',
    defaultVariant: 'form',
    variants: ['form'],
  },
  'test-drive-form': {
    id: 'test-drive-form',
    defaultVariant: 'form',
    variants: ['form', 'compact'],
  },
  // === Phase 8: Events ===
  'event-calendar': {
    id: 'event-calendar',
    defaultVariant: 'grid',
    variants: ['grid', 'list'],
  },
  'ticket-purchase': {
    id: 'ticket-purchase',
    defaultVariant: 'form',
    variants: ['form'],
  },
  'event-detail': {
    id: 'event-detail',
    defaultVariant: 'hero',
    variants: ['hero', 'split'],
  },
  'venue-map': {
    id: 'venue-map',
    defaultVariant: 'static',
    variants: ['interactive', 'static'],
  },
  // === Phase 9: Agriculture ===
  'seasonal-calendar': {
    id: 'seasonal-calendar',
    defaultVariant: 'grid',
    variants: ['grid', 'list'],
  },
  'wholesale-inquiry': {
    id: 'wholesale-inquiry',
    defaultVariant: 'form',
    variants: ['form', 'compact'],
  },
  'farm-gallery': {
    id: 'farm-gallery',
    defaultVariant: 'grid',
    variants: ['grid'],
  },
  // === Phase 10: Pets ===
  'pet-profile': {
    id: 'pet-profile',
    defaultVariant: 'card',
    variants: ['card', 'list'],
  },
  'adoption-form': {
    id: 'adoption-form',
    defaultVariant: 'form',
    variants: ['multi-step', 'form'],
  },
  'vet-services': {
    id: 'vet-services',
    defaultVariant: 'cards',
    variants: ['cards', 'list'],
  },
  // === Phase 11: Admin ===
  'analytics-dashboard': {
    id: 'analytics-dashboard',
    defaultVariant: 'grid',
    variants: ['grid'],
  },
  'tenant-settings': {
    id: 'tenant-settings',
    defaultVariant: 'form',
    variants: ['form'],
  },
  'content-editor': {
    id: 'content-editor',
    defaultVariant: 'inline',
    variants: ['inline'],
  },

const SECTION_ALIASES: Record<string, string> = {
  blogSocialShare: 'blog-post',
  conveyorBeltStrip: 'features',
  successStories: 'testimonials',
  sushiMenuSections: 'menu-categorized-priced',
  testimonialVideo: 'testimonials',

  bookingWizard: 'booking-wizard',
  businessHours: 'open-hours-status',
  caseStudies: 'features',
  deliveryLinks: 'cta-banner',
  eventsCalendar: 'event-venues',
  googleMaps: 'google-maps',
  insuranceList: 'features',
  legalDisclaimer: 'compliance-disclaimer-footer',
  productGrid: 'product-catalog',
  resourceList: 'resources-list',
  reviewsWidget: 'reviews',
  serviceAreaMap: 'why-destination',
  serviceMenu: 'services',
  staffSelector: 'features',

  // camelCase/snake_case singular → canonical kebab
  servicesPreview: 'services',
  services_preview: 'services',
  servicemenu: 'services',
  'service-menu': 'services',
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
  'google-maps': 'contact',
  'business-hours': 'contact',
  ctaBanner: 'cta-banner',
  whatsappFloat: 'whatsapp-float',
  pricingTable: 'pricing-table',
  pricingRange: 'pricing-table',
  faqCategorized: 'faq',
  // Creative-commission-process has no dedicated component — route to
  // process-timeline (same UX: numbered steps timeline).
  creativeCommissionProcess: 'process-timeline',
  'creative-commission-process': 'process-timeline',
  emergencyIndicator: 'emergency-indicator',
  classSchedule: 'class-schedule',
  membershipPlans: 'pricing-table',
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
  packages: 'pricing-table',
  packageBuilder: 'pricing-table',
  giftCards: 'pricing-table',
  giftcards: 'pricing-table',
  instagramFeed: 'instagram-feed',
  sucursales: 'branches',
  properties: 'property-listings',
  'case-studies': 'features',
  'events-calendar': 'event-venues',
  'insurance-list': 'features',
  sakeMenu: 'sake-menu',
  conveyorBelt: 'conveyor-belt',
  menuCategorizedPriced: 'menu-categorized-priced',
  propertyListings: 'property-listings',
  'delivery-links': 'cta-banner',
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
  'staff-selector': 'features',
  ctaBanners: 'cta-banner',

  // === New aliases ===
  paymentMethods: 'payment-methods',
  currencyToggle: 'currency-display',
  deliveryZones: 'delivery-zones',
  shippingCalculator: 'shipping-calculator',
  rucInfo: 'ruc-timbrado-display',
  businessHours: 'horarios-atencion',
  whatsappOrder: 'whatsapp-order-form',
  appointments: 'appointment-list',
  invoices: 'invoice-display',
  servicePackages: 'service-packages',
  membershipCard: 'membership-card',
  orderTracking: 'order-tracking',
  warrantyInfo: 'warranty-info',
  loyaltyProgress: 'loyalty-progress',
  doctors: 'doctor-profile',
  insuranceAccepted: 'insurance-accepted',
  dailyMenu: 'daily-menu',
  onlineOrdering: 'online-ordering',
  deliveryStatus: 'delivery-status',
  nutritionInfo: 'nutrition-info',
  courseCatalog: 'course-catalog',
  classEnrollment: 'class-enrollment',
  instructorProfile: 'instructor-profile',
  courseProgress: 'course-progress',
  propertyDetail: 'property-detail',
  propertySearch: 'property-search',
  agentProfile: 'agent-profile',
  vehicleListing: 'vehicle-listing',
  serviceScheduler: 'service-scheduler',
  partFinder: 'part-finder',
  testDriveForm: 'test-drive-form',
  eventCalendar: 'event-calendar',
  ticketPurchase: 'ticket-purchase',
  eventDetail: 'event-detail',
  seasonalCalendar: 'seasonal-calendar',
  wholesaleInquiry: 'wholesale-inquiry',
  farmGallery: 'farm-gallery',
  petProfile: 'pet-profile',
  adoptionForm: 'adoption-form',
  vetServices: 'vet-services',
  analyticsDashboard: 'analytics-dashboard',
  tenantSettings: 'tenant-settings',
  contentEditor: 'content-editor',
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
