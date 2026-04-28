import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Section } from '@/components/ui/section'
import { renderPage } from '@/lib/engine/site-renderer'
import type { ResolvedPage } from '@/lib/engine/site-types'
import type { ReactNode } from 'react'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ section: string }>
  searchParams: Promise<{ variant?: string }>
}

// Section metadata — single source matching the gallery
interface SectionMeta {
  id: string
  variants: string[]
  defaultVariant: string
  category: string
}

const SECTION_CATALOG: Record<string, SectionMeta> = {
  header: { id: 'header', variants: ['standard', 'sticky', 'transparent'], defaultVariant: 'standard', category: 'Navigation' },
  footer: { id: 'footer', variants: ['standard', 'minimal'], defaultVariant: 'standard', category: 'Navigation' },
  'whatsapp-float': { id: 'whatsapp-float', variants: ['standard'], defaultVariant: 'standard', category: 'Navigation' },
  'contact-strip': { id: 'contact-strip', variants: ['standard'], defaultVariant: 'standard', category: 'Navigation' },
  'floating-cta': { id: 'floating-cta', variants: ['default', 'minimal'], defaultVariant: 'default', category: 'Navigation' },
  'compliance-disclaimer-footer': { id: 'compliance-disclaimer-footer', variants: ['standard'], defaultVariant: 'standard', category: 'Navigation' }, { key: 'description', label: 'Descripción', type: 'textarea', value: 'Texto de ejemplo' }] },
  'language-selector': { id: 'language-selector', variants: ['standard'], defaultVariant: 'standard', category: 'Navigation' },
  'currency-toggle': { id: 'currency-toggle', variants: ['standard'], defaultVariant: 'standard', category: 'Navigation' },
  hero: { id: 'hero', variants: ['image', 'split', 'minimal'], defaultVariant: 'image', category: 'Hero' },
  'hero-video': { id: 'hero-video', variants: ['video', 'parallax'], defaultVariant: 'video', category: 'Hero' },
  'age-gate': { id: 'age-gate', variants: ['modal'], defaultVariant: 'modal', category: 'Hero' },
  'trust-badges': { id: 'trust-badges', variants: ['strip'], defaultVariant: 'strip', category: 'Hero' },
  'trust-signals': { id: 'trust-signals', variants: ['credentials', 'logos-row'], defaultVariant: 'credentials', category: 'Hero' },
  'trust-signals-logos': { id: 'trust-signals-logos', variants: ['standard'], defaultVariant: 'standard', category: 'Hero' },
  'stats-counter': { id: 'stats-counter', variants: ['inline', 'cards', 'minimal'], defaultVariant: 'inline', category: 'Hero' },
  'cta-banner': { id: 'cta-banner', variants: ['gradient', 'solid'], defaultVariant: 'gradient', category: 'Hero' },
  'promo-banner': { id: 'promo-banner', variants: ['countdown', 'simple', 'carousel'], defaultVariant: 'countdown', category: 'Hero' },
  services: { id: 'services', variants: ['cards', 'list'], defaultVariant: 'cards', category: 'Content' },
  features: { id: 'features', variants: ['three-col', 'grid'], defaultVariant: 'three-col', category: 'Content' },
  'process-timeline': { id: 'process-timeline', variants: ['horizontal', 'vertical', 'stepped'], defaultVariant: 'horizontal', category: 'Content' },
  process: { id: 'process', variants: ['steps', 'horizontal'], defaultVariant: 'steps', category: 'Content' },
  'content-grid': { id: 'content-grid', variants: ['cards', 'grid', 'masonry', 'list', 'detailed', 'carousel', 'icon-cards'], defaultVariant: 'cards', category: 'Content' },
  illustration: { id: 'illustration', variants: ['standard'], defaultVariant: 'standard', category: 'Content' },
  'video-embed': { id: 'video-embed', variants: ['aspect-16-9', 'aspect-4-3', 'square', 'full-width'], defaultVariant: 'aspect-16-9', category: 'Content' },
  'logo-strip': { id: 'logo-strip', variants: ['grid', 'carousel', 'single-row'], defaultVariant: 'grid', category: 'Content' },
  'open-hours-status': { id: 'open-hours-status', variants: ['standard'], defaultVariant: 'standard', category: 'Content' },
  'regulatory-status-badge': { id: 'regulatory-status-badge', variants: ['badge', 'inline'], defaultVariant: 'badge', category: 'Content' },
  testimonials: { id: 'testimonials', variants: ['carousel', 'grid'], defaultVariant: 'carousel', category: 'Social Proof' },
  team: { id: 'team', variants: ['cards', 'list', 'grid-photos'], defaultVariant: 'cards', category: 'Social Proof' },
  faq: { id: 'faq', variants: ['accordion'], defaultVariant: 'accordion', category: 'Social Proof' },
  'enhanced-faq': { id: 'enhanced-faq', variants: ['searchable'], defaultVariant: 'searchable', category: 'Social Proof' },
  'faq-categorized': { id: 'faq-categorized', variants: ['accordion'], defaultVariant: 'accordion', category: 'Social Proof' },
  'faq-chatbot': { id: 'faq-chatbot', variants: ['standard'], defaultVariant: 'standard', category: 'Social Proof' },
  'google-reviews': { id: 'google-reviews', variants: ['carousel', 'grid'], defaultVariant: 'carousel', category: 'Social Proof' },
  'google-reviews-widget': { id: 'google-reviews-widget', variants: ['standard'], defaultVariant: 'standard', category: 'Social Proof' },
  reviews: { id: 'reviews', variants: ['standard'], defaultVariant: 'standard', category: 'Social Proof' },
  'instagram-feed': { id: 'instagram-feed', variants: ['grid'], defaultVariant: 'grid', category: 'Social Proof' },
  gallery: { id: 'gallery', variants: ['grid', 'masonry'], defaultVariant: 'grid', category: 'Media' },
  portfolio: { id: 'portfolio', variants: ['grid'], defaultVariant: 'grid', category: 'Media' },
  'before-after': { id: 'before-after', variants: ['slider'], defaultVariant: 'slider', category: 'Media' },
  'before-after-split': { id: 'before-after-split', variants: ['standard'], defaultVariant: 'standard', category: 'Media' },
  'photo-gallery': { id: 'photo-gallery', variants: ['standard'], defaultVariant: 'standard', category: 'Media' },
  'blog-index': { id: 'blog-index', variants: ['grid', 'list'], defaultVariant: 'grid', category: 'Media' },
  'blog-post': { id: 'blog-post', variants: ['article'], defaultVariant: 'article', category: 'Media' },
  blog: { id: 'blog', variants: ['standard'], defaultVariant: 'standard', category: 'Media' },
  'blog-social-share': { id: 'blog-social-share', variants: ['standard'], defaultVariant: 'standard', category: 'Media' },
  'related-posts': { id: 'related-posts', variants: ['standard'], defaultVariant: 'standard', category: 'Media' },
  'timeline-history': { id: 'timeline-history', variants: ['standard'], defaultVariant: 'standard', category: 'Media' },
  'product-catalog': { id: 'product-catalog', variants: ['grid', 'cards'], defaultVariant: 'grid', category: 'Commerce' },
  'featured-products': { id: 'featured-products', variants: ['grid'], defaultVariant: 'grid', category: 'Commerce' },
  'commerce-catalog': { id: 'commerce-catalog', variants: ['grid'], defaultVariant: 'grid', category: 'Commerce' },
  'pricing-table': { id: 'pricing-table', variants: ['default'], defaultVariant: 'default', category: 'Commerce' },
  'pricing-range': { id: 'pricing-range', variants: ['tiers'], defaultVariant: 'tiers', category: 'Commerce' },
  pricing: { id: 'pricing', variants: ['tiered'], defaultVariant: 'tiered', category: 'Commerce' },
  'membership-plans': { id: 'membership-plans', variants: ['cards'], defaultVariant: 'cards', category: 'Commerce' },
  'packages-giftcards': { id: 'packages-giftcards', variants: ['tabs'], defaultVariant: 'tabs', category: 'Commerce' },
  'preorder-calendar': { id: 'preorder-calendar', variants: ['standard'], defaultVariant: 'standard', category: 'Commerce' },
  'price-list': { id: 'price-list', variants: ['standard'], defaultVariant: 'standard', category: 'Commerce' },
  'stock-indicator': { id: 'stock-indicator', variants: ['standard'], defaultVariant: 'standard', category: 'Commerce' },
  subscription: { id: 'subscription', variants: ['standard'], defaultVariant: 'standard', category: 'Commerce' },
  referral: { id: 'referral', variants: ['standard'], defaultVariant: 'standard', category: 'Commerce' },
  'countdown-timer': { id: 'countdown-timer', variants: ['standard'], defaultVariant: 'standard', category: 'Commerce' },
  contact: { id: 'contact', variants: ['split', 'form-only'], defaultVariant: 'split', category: 'Forms' },
  'lead-form': { id: 'lead-form', variants: ['standard', 'compact'], defaultVariant: 'standard', category: 'Forms' },
  'quote-form': { id: 'quote-form', variants: ['standard'], defaultVariant: 'standard', category: 'Forms' },
  booking: { id: 'booking', variants: ['wizard'], defaultVariant: 'wizard', category: 'Forms' },
  'booking-embed': { id: 'booking-embed', variants: ['iframe', 'link'], defaultVariant: 'iframe', category: 'Forms' },
  'booking-wizard': { id: 'booking-wizard', variants: ['default'], defaultVariant: 'default', category: 'Forms' },
  'room-booking': { id: 'room-booking', variants: ['cards'], defaultVariant: 'cards', category: 'Forms' },
  'newsletter-signup': { id: 'newsletter-signup', variants: ['standard'], defaultVariant: 'standard', category: 'Forms' },
  'multi-step-form': { id: 'multi-step-form', variants: ['standard'], defaultVariant: 'standard', category: 'Forms' },
  'intake-wizard': { id: 'intake-wizard', variants: ['default'], defaultVariant: 'default', category: 'Forms' },
  'intake-questionnaire': { id: 'intake-questionnaire', variants: ['standard'], defaultVariant: 'standard', category: 'Forms' },
  'delivery-slot-picker': { id: 'delivery-slot-picker', variants: ['standard'], defaultVariant: 'standard', category: 'Forms' },
  'our-story': { id: 'our-story', variants: ['narrative'], defaultVariant: 'narrative', category: 'Specialty' },
  'b2b-wholesale': { id: 'b2b-wholesale', variants: ['tiered'], defaultVariant: 'tiered', category: 'Specialty' },
  'why-destination': { id: 'why-destination', variants: ['three-col', 'alternating'], defaultVariant: 'three-col', category: 'Specialty' },
  'programs-comparison': { id: 'programs-comparison', variants: ['tiered', 'matrix'], defaultVariant: 'tiered', category: 'Specialty' },
  'tiered-service-ladder': { id: 'tiered-service-ladder', variants: ['standard'], defaultVariant: 'standard', category: 'Specialty' },
  'google-maps': { id: 'google-maps', variants: ['default'], defaultVariant: 'default', category: 'Specialty' },
  branches: { id: 'branches', variants: ['cards', 'list', 'map'], defaultVariant: 'cards', category: 'Specialty' },
  'event-venues': { id: 'event-venues', variants: ['cards'], defaultVariant: 'cards', category: 'Specialty' },
  'class-schedule': { id: 'class-schedule', variants: ['grid'], defaultVariant: 'grid', category: 'Specialty' },
  'emergency-indicator': { id: 'emergency-indicator', variants: ['banner'], defaultVariant: 'banner', category: 'Specialty' },
  'property-listings': { id: 'property-listings', variants: ['cards', 'listings-from-api'], defaultVariant: 'cards', category: 'Specialty' },
  'resources-list': { id: 'resources-list', variants: ['three-col', 'grid'], defaultVariant: 'three-col', category: 'Specialty' },
  'service-area-map-zones': { id: 'service-area-map-zones', variants: ['standard'], defaultVariant: 'standard', category: 'Specialty' },
  'maturity-assessment': { id: 'maturity-assessment', variants: ['standard'], defaultVariant: 'standard', category: 'Specialty' },
  'mattress-quiz': { id: 'mattress-quiz', variants: ['default'], defaultVariant: 'default', category: 'Specialty' },
  recipes: { id: 'recipes', variants: ['grid'], defaultVariant: 'grid', category: 'Specialty' },
  'conveyor-belt': { id: 'conveyor-belt', variants: ['animated'], defaultVariant: 'animated', category: 'Specialty' },
  'conveyor-belt-strip': { id: 'conveyor-belt-strip', variants: ['standard'], defaultVariant: 'standard', category: 'Specialty' },
  omakase: { id: 'omakase', variants: ['standard'], defaultVariant: 'standard', category: 'Specialty' },
  'sake-menu': { id: 'sake-menu', variants: ['grouped'], defaultVariant: 'grouped', category: 'Specialty' },
  'menu-categorized-priced': { id: 'menu-categorized-priced', variants: ['categorized'], defaultVariant: 'categorized', category: 'Specialty' },
  'color-coded-menu': { id: 'color-coded-menu', variants: ['standard'], defaultVariant: 'standard', category: 'Specialty' },
  'sample-week-preview': { id: 'sample-week-preview', variants: ['standard'], defaultVariant: 'standard', category: 'Specialty' },
  'weekly-cadence-calendar': { id: 'weekly-cadence-calendar', variants: ['standard'], defaultVariant: 'standard', category: 'Specialty' },
  'weekly-schedule': { id: 'weekly-schedule', variants: ['standard'], defaultVariant: 'standard', category: 'Specialty' },
  'delivery-calculator': { id: 'delivery-calculator', variants: ['standard'], defaultVariant: 'standard', category: 'Specialty' },
  'success-stories': { id: 'success-stories', variants: ['standard'], defaultVariant: 'standard', category: 'Specialty' },
  'tax-savings-calculator': { id: 'tax-savings-calculator', variants: ['default'], defaultVariant: 'default', category: 'Calculators' },
  'tax-deadline-banner': { id: 'tax-deadline-banner', variants: ['default'], defaultVariant: 'default', category: 'Calculators' },
  'savings-calculator': { id: 'savings-calculator', variants: ['standard'], defaultVariant: 'standard', category: 'Calculators' },
  'mortgage-calculator': { id: 'mortgage-calculator', variants: ['standard'], defaultVariant: 'standard', category: 'Calculators' },
  'bulk-calculator': { id: 'bulk-calculator', variants: ['standard'], defaultVariant: 'standard', category: 'Calculators' },
  'calc-irp': { id: 'calc-irp', variants: ['default'], defaultVariant: 'default', category: 'Calculators' },
  'calc-aguinaldo': { id: 'calc-aguinaldo', variants: ['default'], defaultVariant: 'default', category: 'Calculators' },
  'calc-finiquito': { id: 'calc-finiquito', variants: ['default'], defaultVariant: 'default', category: 'Calculators' },
  'calc-iva': { id: 'calc-iva', variants: ['default'], defaultVariant: 'default', category: 'Calculators' },
  'calc-ire': { id: 'calc-ire', variants: ['default'], defaultVariant: 'default', category: 'Calculators' },
  'calc-ips': { id: 'calc-ips', variants: ['default'], defaultVariant: 'default', category: 'Calculators' },
  'calc-costo-empleado': { id: 'calc-costo-empleado', variants: ['default'], defaultVariant: 'default', category: 'Calculators' },
  'calc-resimple-qualifier': { id: 'calc-resimple-qualifier', variants: ['standard'], defaultVariant: 'standard', category: 'Calculators' },

  'payment-methods': { id: 'payment-methods', variants: ['strip', 'grid', 'compact'], defaultVariant: 'strip', category: 'Commerce' },
  'currency-display': { id: 'currency-display', variants: ['toggle', 'inline', 'dropdown'], defaultVariant: 'toggle', category: 'Commerce' },
  'delivery-zones': { id: 'delivery-zones', variants: ['list', 'cards'], defaultVariant: 'list', category: 'Commerce' },
  'shipping-calculator': { id: 'shipping-calculator', variants: ['form', 'simple'], defaultVariant: 'form', category: 'Commerce' },
  'ruc-timbrado-display': { id: 'ruc-timbrado-display', variants: ['footer', 'inline', 'badge'], defaultVariant: 'footer', category: 'Content' },
  'horarios-atencion': { id: 'horarios-atencion', variants: ['table', 'list', 'badge', 'inline'], defaultVariant: 'table', category: 'Content' },
  'whatsapp-order-form': { id: 'whatsapp-order-form', variants: ['inline', 'modal'], defaultVariant: 'inline', category: 'Commerce' },
  'appointment-list': { id: 'appointment-list', variants: ['cards', 'list'], defaultVariant: 'cards', category: 'Forms' },
  'invoice-display': { id: 'invoice-display', variants: ['table', 'card'], defaultVariant: 'table', category: 'Commerce' },
  'service-packages': { id: 'service-packages', variants: ['cards', 'tiered'], defaultVariant: 'cards', category: 'Commerce' },
  'membership-card': { id: 'membership-card', variants: ['card', 'inline', 'badge'], defaultVariant: 'card', category: 'Commerce' },
  'appointment-reminder': { id: 'appointment-reminder', variants: ['banner', 'card', 'inline'], defaultVariant: 'banner', category: 'Forms' },
  'order-tracking': { id: 'order-tracking', variants: ['timeline', 'steps', 'card'], defaultVariant: 'timeline', category: 'Commerce' },
  'warranty-info': { id: 'warranty-info', variants: ['accordion', 'cards'], defaultVariant: 'accordion', category: 'Commerce' },
  'loyalty-progress': { id: 'loyalty-progress', variants: ['bar', 'card', 'tier'], defaultVariant: 'bar', category: 'Commerce' },
  'doctor-profile': { id: 'doctor-profile', variants: ['card', 'list', 'detailed'], defaultVariant: 'card', category: 'Specialty' },
  'insurance-accepted': { id: 'insurance-accepted', variants: ['grid', 'list'], defaultVariant: 'grid', category: 'Specialty' },
  'symptom-checker': { id: 'symptom-checker', variants: ['wizard'], defaultVariant: 'wizard', category: 'Forms' },
  'health-tips-carousel': { id: 'health-tips-carousel', variants: ['carousel', 'grid'], defaultVariant: 'carousel', category: 'Social Proof' },
  'telemedicine-banner': { id: 'telemedicine-banner', variants: ['banner', 'card', 'float'], defaultVariant: 'banner', category: 'Hero' },
  'daily-menu': { id: 'daily-menu', variants: ['grid', 'list'], defaultVariant: 'grid', category: 'Specialty' },
  'online-ordering': { id: 'online-ordering', variants: ['inline'], defaultVariant: 'inline', category: 'Commerce' },
  'delivery-status': { id: 'delivery-status', variants: ['timeline', 'card'], defaultVariant: 'timeline', category: 'Commerce' },
  'nutrition-info': { id: 'nutrition-info', variants: ['table', 'cards'], defaultVariant: 'table', category: 'Specialty' },
  'reservation-form': { id: 'reservation-form', variants: ['standard', 'compact'], defaultVariant: 'standard', category: 'Forms' },
  'course-catalog': { id: 'course-catalog', variants: ['grid', 'cards'], defaultVariant: 'grid', category: 'Specialty' },
  'class-enrollment': { id: 'class-enrollment', variants: ['form', 'compact'], defaultVariant: 'form', category: 'Forms' },
  'instructor-profile': { id: 'instructor-profile', variants: ['card', 'list'], defaultVariant: 'card', category: 'Specialty' },
  'course-progress': { id: 'course-progress', variants: ['bar', 'steps'], defaultVariant: 'bar', category: 'Specialty' },
  'property-detail': { id: 'property-detail', variants: ['gallery', 'split'], defaultVariant: 'gallery', category: 'Specialty' },
  'property-search': { id: 'property-search', variants: ['full', 'compact'], defaultVariant: 'full', category: 'Forms' },
  'agent-profile': { id: 'agent-profile', variants: ['card', 'list'], defaultVariant: 'card', category: 'Specialty' },
  'vehicle-listing': { id: 'vehicle-listing', variants: ['grid', 'list'], defaultVariant: 'grid', category: 'Specialty' },
  'service-scheduler': { id: 'service-scheduler', variants: ['form', 'compact'], defaultVariant: 'form', category: 'Forms' },
  'part-finder': { id: 'part-finder', variants: ['form'], defaultVariant: 'form', category: 'Forms' },
  'test-drive-form': { id: 'test-drive-form', variants: ['form', 'compact'], defaultVariant: 'form', category: 'Forms' },
  'event-calendar': { id: 'event-calendar', variants: ['grid', 'list'], defaultVariant: 'grid', category: 'Specialty' },
  'ticket-purchase': { id: 'ticket-purchase', variants: ['form'], defaultVariant: 'form', category: 'Commerce' },
  'event-detail': { id: 'event-detail', variants: ['hero', 'split'], defaultVariant: 'hero', category: 'Specialty' },
  'venue-map': { id: 'venue-map', variants: ['interactive', 'static'], defaultVariant: 'static', category: 'Specialty' },
  'seasonal-calendar': { id: 'seasonal-calendar', variants: ['grid', 'list'], defaultVariant: 'grid', category: 'Specialty' },
  'wholesale-inquiry': { id: 'wholesale-inquiry', variants: ['form', 'compact'], defaultVariant: 'form', category: 'Forms' },
  'farm-gallery': { id: 'farm-gallery', variants: ['grid'], defaultVariant: 'grid', category: 'Media' },
  'pet-profile': { id: 'pet-profile', variants: ['card', 'list'], defaultVariant: 'card', category: 'Specialty' },
  'adoption-form': { id: 'adoption-form', variants: ['multi-step', 'form'], defaultVariant: 'form', category: 'Forms' },
  'vet-services': { id: 'vet-services', variants: ['cards', 'list'], defaultVariant: 'cards', category: 'Specialty' },
  'analytics-dashboard': { id: 'analytics-dashboard', variants: ['grid'], defaultVariant: 'grid', category: 'Content' },
  'tenant-settings': { id: 'tenant-settings', variants: ['form'], defaultVariant: 'form', category: 'Forms' },
  'content-editor': { id: 'content-editor', variants: ['inline'], defaultVariant: 'inline', category: 'Forms' },

}

// Sample props for sections that need specific content
function buildSampleProps(sectionId: string): Record<string, unknown> {
  const common = {
    __siteSlug: 'demo',
    __locale: 'es',
    __country: 'Paraguay',
  }

  const samples: Record<string, Record<string, unknown>> = {
    header: { ...common, businessName: 'Mi Negocio', navItems: [{ label: 'Inicio', href: '/' }, { label: 'Servicios', href: '/servicios' }, { label: 'Contacto', href: '/contacto' }], ctaText: 'WhatsApp', ctaHref: 'https://wa.me/595000000000' },
    footer: { ...common, businessName: 'Mi Negocio', address: 'Av. Principal 123', city: 'Asunción', phone: '+595 981 000 000', email: 'info@minegocio.com.py', navLinks: [{ label: 'Inicio', href: '/' }, { label: 'Servicios', href: '/servicios' }] },
    'whatsapp-float': { ...common, phone: '595000000000', message: 'Hola! Quisiera información' },
    'contact-strip': { ...common, title: 'Contacto', subtitle: 'Escribinos', phone: '+595 981 000 000', email: 'info@minegocio.com.py', whatsapp: '595000000000' },
    'floating-cta': { ...common, text: 'Consultar Ahora', href: 'https://wa.me/595000000000' },
    'trust-badges': { ...common, items: [{ icon: 'Truck', text: 'Envío gratis', description: 'Desde Gs. 300.000' }, { icon: 'ShieldCheck', text: 'Pago seguro', description: 'Bancard y Pagopar' }, { icon: 'RotateCcw', text: 'Cambios', description: 'Hasta 7 días' }, { icon: 'MessageCircle', text: 'WhatsApp', description: 'Respuesta rápida' }] },
    'trust-signals': { ...common, eyebrow: 'Por qué elegirnos', title: 'Nuestras Ventajas', subtitle: 'Calidad y confianza', items: [{ icon: 'Award', title: 'Experiencia', description: '+10 años en el mercado' }, { icon: 'Users', title: 'Equipo', description: 'Profesionales capacitados' }, { icon: 'Shield', title: 'Garantía', description: '100% asegurado' }] },
    'stats-counter': { ...common, items: [{ value: '+500', label: 'Clientes' }, { value: '+10', label: 'Años' }, { value: '98%', label: 'Satisfacción' }, { value: '24/7', label: 'Soporte' }] },
    'cta-banner': { ...common, title: 'Listo para empezar?', buttonText: 'Contactanos', buttonHref: 'https://wa.me/595000000000', description: 'Primera consulta gratis' },
    'promo-banner': { ...common, promotions: [{ title: 'Oferta Especial', description: '20% de descuento', badge: '-20%', ctaText: 'Comprar', ctaHref: '#', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80' }, { title: 'Envío Gratis', description: 'En compras mayores a Gs. 300.000', badge: 'GRATIS', ctaText: 'Ver más', ctaHref: '#' }] },
    services: { ...common, title: 'Nuestros Servicios', services: [{ name: 'Servicio 1', description: 'Descripción del servicio', price: 'Gs. 50.000', duration: 60 }, { name: 'Servicio 2', description: 'Descripción del servicio', price: 'Gs. 80.000', duration: 90 }, { name: 'Servicio 3', description: 'Descripción del servicio', price: 'Gs. 120.000', duration: 120 }] },
    features: { ...common, title: 'Por qué elegirnos', items: [{ icon: 'Target', title: 'Calidad', description: 'Productos de primera calidad' }, { icon: 'Zap', title: 'Rapidez', description: 'Entrega en 24 horas' }, { icon: 'Shield', title: 'Confianza', description: 'Soporte garantizado' }] },
    'process-timeline': { ...common, title: 'Cómo funciona', subtitle: 'Pasos simples', steps: [{ step: 1, title: 'Consultá', description: 'Primer paso sin cargo' }, { step: 2, title: 'Elegí', description: 'Seleccioná la mejor opción' }, { step: 3, title: 'Disfrutá', description: 'Recibí tu pedido' }] },
    process: { ...common, title: 'Nuestro proceso', steps: [{ step: 1, title: 'Paso 1', description: 'Descripción' }, { step: 2, title: 'Paso 2', description: 'Descripción' }, { step: 3, title: 'Paso 3', description: 'Descripción' }] },
    'content-grid': { ...common, title: 'Nuestros Productos', subtitle: 'Conoce nuestra variedad', items: [{ title: 'Producto 1', description: 'Descripción', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80' }, { title: 'Producto 2', description: 'Descripción', image: 'https://images.unsplash.com/photo-1506976785307-8732e54ad72d?w=400&q=80' }, { title: 'Producto 3', description: 'Descripción', image: 'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=400&q=80' }] },
    'video-embed': { ...common, url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', title: 'Video Demo' },
    'logo-strip': { ...common, title: 'Trabajamos con', logos: [{ name: 'Logo 1', image: 'https://placehold.co/200x80/e2e8f0/64748b?text=LOGO' }, { name: 'Logo 2', image: 'https://placehold.co/200x80/e2e8f0/64748b?text=LOGO' }, { name: 'Logo 3', image: 'https://placehold.co/200x80/e2e8f0/64748b?text=LOGO' }] },
    testimonials: { ...common, title: 'Lo que dicen nuestros clientes', items: [{ author: 'Cliente 1', quote: 'Excelente servicio, muy recomendado', rating: 5, role: 'CEO' }, { author: 'Cliente 2', quote: 'Profesionales y confiables', rating: 5, role: 'Emprendedor' }, { author: 'Cliente 3', quote: 'La mejor experiencia', rating: 4 }] },
    team: { ...common, title: 'Nuestro Equipo', members: [{ name: 'Juan Pérez', role: 'Director', bio: '+10 años de experiencia', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' }, { name: 'María López', role: 'Gerente', bio: 'Especialista en atención', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' }] },
    faq: { ...common, title: 'Preguntas Frecuentes', items: [{ q: '¿Cómo puedo contactarlos?', a: 'Por WhatsApp o teléfono' }, { q: '¿Cuánto tarda la entrega?', a: 'Entre 24 y 48 horas hábiles' }, { q: '¿Aceptan tarjetas?', a: 'Sí, todas las tarjetas' }] },
    'enhanced-faq': { ...common, title: 'Preguntas Frecuentes', items: [{ q: '¿Cómo funciona?', a: 'Es muy simple' }, { q: '¿Tiene garantía?', a: 'Sí, 1 año' }] },
    gallery: { ...common, title: 'Galería', images: [{ src: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80', alt: 'Imagen 1' }, { src: 'https://images.unsplash.com/photo-1506976785307-8732e54ad72d?w=600&q=80', alt: 'Imagen 2' }] },
    portfolio: { ...common, title: 'Portafolio', items: [{ title: 'Proyecto 1', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80', category: 'Categoría' }, { title: 'Proyecto 2', image: 'https://images.unsplash.com/photo-1506976785307-8732e54ad72d?w=600&q=80', category: 'Categoría' }] },
    'blog-index': { ...common, title: 'Blog', subtitle: 'Últimos artículos', posts: [{ title: 'Artículo 1', slug: 'articulo-1', excerpt: 'Resumen del artículo', date: '2026-01-01', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80' }, { title: 'Artículo 2', slug: 'articulo-2', excerpt: 'Resumen del artículo', date: '2026-01-15', image: 'https://images.unsplash.com/photo-1506976785307-8732e54ad72d?w=600&q=80' }] },
    'product-catalog': { ...common, title: 'Productos', products: [{ name: 'Producto 1', price: 'Gs. 50.000', description: 'Descripción', imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80', category: 'General' }, { name: 'Producto 2', price: 'Gs. 80.000', description: 'Descripción', imageUrl: 'https://images.unsplash.com/photo-1506976785307-8732e54ad72d?w=400&q=80', category: 'General' }], whatsappPhone: '595000000000', orderButtonText: 'Consultar' },
    'commerce-catalog': { ...common, siteSlug: 'demo', businessName: 'Demo Store' },
    'pricing-table': { ...common, title: 'Planes', items: [{ name: 'Básico', price: 'Gs. 50.000', period: '/mes', features: ['Feature 1', 'Feature 2'], cta: 'Elegir' }, { name: 'Premium', price: 'Gs. 100.000', period: '/mes', features: ['Feature 1', 'Feature 2', 'Feature 3'], popular: true, cta: 'Elegir' }] },
    contact: { ...common, title: 'Contacto', address: 'Av. Principal 123', phone: '+595 981 000 000', email: 'info@demo.com', whatsapp: '595000000000', hours: 'Lun-Vie 08:00-18:00' },
    'lead-form': { ...common, title: 'Contactanos', subtitle: 'Te respondemos rápido', fields: [{ name: 'name', label: 'Nombre', type: 'text', required: true }, { name: 'phone', label: 'Teléfono', type: 'tel', required: true }, { name: 'message', label: 'Mensaje', type: 'textarea' }], submitLabel: 'Enviar' },
    'quote-form': { ...common, title: 'Pedí tu presupuesto', subtitle: 'Sin compromiso' },
    'newsletter-signup': { ...common, title: 'Suscribite', description: 'Recibí nuestras novedades', placeholder: 'tu@email.com', buttonText: 'Suscribirme' },
    'google-maps': { ...common, address: 'Av. Principal 123, Asunción', title: 'Ubicación' },
    branches: { ...common, title: 'Sucursales', items: [{ name: 'Sucursal Centro', address: 'Av. Principal 123', phone: '+595 981 000 000', hours: 'Lun-Vie 08:00-18:00' }, { name: 'Sucursal Sur', address: 'Av. Secundaria 456', phone: '+595 981 000 001', hours: 'Lun-Sáb 09:00-20:00' }] },
    'property-listings': { ...common, title: 'Propiedades', items: [{ title: 'Casa 3 dormitorios', price: 'USD 150.000', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80', location: 'Asunción' }, { title: 'Departamento 2 dorm.', price: 'USD 80.000', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80', location: 'Asunción' }] },
    'compliance-disclaimer-footer': { ...common, paragraphs: ['Este es un sitio demo. La información es ilustrativa.'] },

    'payment-methods': { ...common, title: 'Medios de pago', methods: ['bancard', 'pagopar', 'mercadopago', 'visa', 'mastercard', 'efectivo'] },
    'currency-display': { ...common, currencies: [{ code: 'PYG', symbol: 'Gs.', label: 'Guaraníes' }, { code: 'USD', symbol: '$', label: 'Dólares' }] },
    'delivery-zones': { ...common, title: 'Zonas de entrega', zones: [{ name: 'Asunción', fee: 'Gratis', freeThreshold: 'Gs. 300.000', estimatedDays: '24hs' }, { name: 'San Lorenzo', fee: 'Gs. 15.000', freeThreshold: 'Gs. 500.000', estimatedDays: '48hs' }] },
    'shipping-calculator': { ...common, title: 'Calculá tu envío', zones: [{ id: 'asu', name: 'Asunción', baseFee: 0, freeThreshold: 300000, estimatedDays: '24hs' }] },
    'ruc-timbrado-display': { ...common, ruc: '80012345-6', businessName: 'Mi Negocio S.A.', timbrado: '123-456-789' },
    'horarios-atencion': { ...common, title: 'Horarios', hours: { 'Lunes a Viernes': '08:00 - 19:00', 'Sábado': '08:00 - 17:00', 'Domingo': 'Cerrado' } },
    'whatsapp-order-form': { ...common, title: 'Pedido por WhatsApp', products: [{ name: 'Producto 1', price: 'Gs. 50.000' }, { name: 'Producto 2', price: 'Gs. 80.000' }], phone: '595000000000' },
    'appointment-list': { ...common, title: 'Mis turnos', appointments: [{ date: '2026-05-15', time: '10:00', service: 'Consulta general', status: 'confirmed' }, { date: '2026-05-20', time: '14:30', service: 'Seguimiento', status: 'pending' }] },
    'invoice-display': { ...common, title: 'Facturas', invoices: [{ number: 'FAC-001', date: '2026-04-01', amount: 'Gs. 150.000', status: 'paid' }, { number: 'FAC-002', date: '2026-04-15', amount: 'Gs. 250.000', status: 'pending' }] },
    'service-packages': { ...common, title: 'Paquetes', packages: [{ name: 'Básico', price: 'Gs. 50.000', services: ['Servicio 1', 'Servicio 2'] }, { name: 'Premium', price: 'Gs. 100.000', services: ['Servicio 1', 'Servicio 2', 'Servicio 3'], popular: true }] },
    'membership-card': { ...common, tier: 'Oro', points: 2500, benefits: ['Descuento 10%', 'Envío gratis'], memberName: 'Juan Pérez' },
    'appointment-reminder': { ...common, appointment: { date: '2026-05-15', time: '10:00', service: 'Consulta' } },
    'order-tracking': { ...common, title: 'Estado del pedido', orderId: 'ORD-123', steps: [{ label: 'Confirmado', completed: true }, { label: 'En preparación', completed: true }, { label: 'En camino', completed: false }, { label: 'Entregado', completed: false }] },
    'warranty-info': { ...common, title: 'Garantía', products: [{ name: 'Producto A', warrantyPeriod: '1 año', terms: 'Cubre defectos de fábrica' }, { name: 'Producto B', warrantyPeriod: '6 meses', terms: 'Cubre partes eléctricas' }] },
    'loyalty-progress': { ...common, title: 'Tus puntos', currentPoints: 1200, nextTier: 'Oro', pointsToNext: 800, tiers: [{ name: 'Bronce', minPoints: 0, benefits: ['Bienvenida'] }, { name: 'Plata', minPoints: 1000, benefits: ['Descuento 5%'] }, { name: 'Oro', minPoints: 2000, benefits: ['Descuento 10%', 'Envío gratis'] }] },
    'doctor-profile': { ...common, title: 'Médicos', doctors: [{ name: 'Dr. Pérez', specialty: 'Cardiología', credentials: ['CAP', 'FACC'], schedule: 'Lun-Vie 09-17' }, { name: 'Dra. López', specialty: 'Pediatría', credentials: ['CAP'], schedule: 'Lun-Sáb 08-14' }] },
    'insurance-accepted': { ...common, title: 'Obras sociales', insurances: ['IPS', 'San Cristóbal', 'BSA', 'Migraciones'] },
    'symptom-checker': { ...common, title: '¿Qué te pasa?', symptoms: [{ symptom: 'Dolor de cabeza', specialty: 'Neurología' }, { symptom: 'Dolor abdominal', specialty: 'Gastroenterología' }] },
    'health-tips-carousel': { ...common, title: 'Tips de salud', tips: [{ title: 'Vacunación', description: 'Mantené tus vacunas al día' }, { title: 'Ejercicio', description: '30 minutos diarios' }] },
    'telemedicine-banner': { ...common, title: 'Consultá online', ctaText: 'Agendar', ctaHref: '#' },
    'daily-menu': { ...common, title: 'Menú del día', categories: [{ name: 'Platos principales', items: [{ name: 'Milanesa', price: 'Gs. 35.000' }, { name: 'Pollo al horno', price: 'Gs. 40.000' }] }] },
    'online-ordering': { ...common, title: 'Pedí online', products: [{ name: 'Hamburguesa', price: 'Gs. 25.000', category: 'Comidas' }, { name: 'Pizza', price: 'Gs. 45.000', category: 'Comidas' }], phone: '595000000000' },
    'delivery-status': { ...common, orderId: 'ORD-456', estimatedArrival: 'Hoy 18-20hs' },
    'nutrition-info': { ...common, title: 'Información nutricional', items: [{ name: 'Milanesa', calories: 450, protein: '25g', carbs: '30g', fat: '15g' }, { name: 'Ensalada', calories: 120, protein: '5g', carbs: '10g', fat: '8g' }] },
    'reservation-form': { ...common, title: 'Reservá tu mesa', phone: '595000000000' },
    'course-catalog': { ...common, title: 'Cursos', courses: [{ name: 'Introducción', description: 'Curso básico', duration: '4 semanas', price: 'Gs. 200.000' }, { name: 'Avanzado', description: 'Curso completo', duration: '8 semanas', price: 'Gs. 350.000' }] },
    'class-enrollment': { ...common, title: 'Inscripción', courses: [{ id: 'c1', name: 'Curso 1' }, { id: 'c2', name: 'Curso 2' }], phone: '595000000000' },
    'instructor-profile': { ...common, title: 'Instructores', instructors: [{ name: 'Juan', title: 'Instructor Senior', specialties: ['Yoga', 'Meditación'] }, { name: 'María', title: 'Instructora', specialties: ['Pilates'] }] },
    'course-progress': { ...common, courseName: 'Curso de Yoga', completed: 5, total: 10, nextLesson: 'Posturas avanzadas', nextDate: '2026-05-20' },
    'property-detail': { ...common, property: { title: 'Casa en Asunción', price: 'USD 150.000', beds: 3, baths: 2, area: '250m²', description: 'Hermosa casa en barrio cerrado', images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80'], location: 'Asunción', features: ['Pileta', 'Garage', 'Parque'] } },
    'property-search': { ...common, title: 'Buscá tu propiedad' },
    'agent-profile': { ...common, title: 'Agentes', agents: [{ name: 'Carlos López', title: 'Agente Senior', phone: '+595 981 000 000', listings: 25 }, { name: 'Ana Martínez', title: 'Agente', phone: '+595 981 000 001', listings: 18 }] },
    'vehicle-listing': { ...common, title: 'Vehículos', vehicles: [{ name: 'Toyota Hilux', year: 2022, price: 'USD 45.000', mileage: '30.000 km', fuelType: 'Diésel', transmission: 'Automático', condition: 'Usado' }, { name: 'Chevrolet Onix', year: 2024, price: 'USD 22.000', fuelType: 'Nafta', transmission: 'Manual', condition: 'Nuevo' }] },
    'service-scheduler': { ...common, title: 'Agendá tu servicio', services: [{ name: 'Cambio de aceite', price: 'Gs. 80.000' }, { name: 'Alineación', price: 'Gs. 50.000' }], phone: '595000000000' },
    'part-finder': { ...common, title: 'Buscá tu repuesto', phone: '595000000000' },
    'test-drive-form': { ...common, title: 'Prueba de manejo', vehicles: [{ id: 'v1', name: 'Toyota Hilux' }, { id: 'v2', name: 'Chevrolet Onix' }], phone: '595000000000' },
    'event-calendar': { ...common, title: 'Eventos', events: [{ name: 'Concierto', date: '2026-06-15', time: '21:00', venue: 'Teatro Municipal', price: 'Gs. 100.000' }, { name: 'Feria', date: '2026-06-20', time: '10:00', venue: 'Centro de Convenciones' }] },
    'ticket-purchase': { ...common, title: 'Entradas', eventName: 'Concierto', ticketTypes: [{ name: 'General', price: 'Gs. 100.000', available: 50 }, { name: 'VIP', price: 'Gs. 200.000', available: 20 }], phone: '595000000000' },
    'event-detail': { ...common, event: { name: 'Gran Concierto', date: '2026-06-15', time: '21:00', venue: 'Teatro Municipal', description: 'El mejor concierto del año', lineup: ['Banda 1', 'Banda 2'], image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80' } },
    'venue-map': { ...common, venueName: 'Teatro Municipal', address: 'Asunción', capacity: 500 },
    'seasonal-calendar': { ...common, title: 'Temporada', seasons: [{ month: 'Enero', products: [{ name: 'Sandía', available: true }, { name: 'Mango', available: true }] }] },
    'wholesale-inquiry': { ...common, title: 'Consulta mayorista', products: [{ name: 'Huevos', unit: 'unidad', pricePerUnit: 'Gs. 500' }], phone: '595000000000' },
    'farm-gallery': { ...common, title: 'Nuestra granja', categories: [{ name: 'Instalaciones', images: [{ src: 'https://images.unsplash.com/photo-1593113598336-86d3a9cb3f79?w=600&q=80', alt: 'Campo' }] }] },
    'pet-profile': { ...common, title: 'En adopción', pets: [{ name: 'Luna', type: 'Perro', breed: 'Mestizo', age: '2 años', status: 'en adopción', description: 'Juguetona y cariñosa', image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&q=80' }] },
    'adoption-form': { ...common, title: 'Formulario de adopción', pets: [{ name: 'Luna', id: 'p1' }], phone: '595000000000' },
    'vet-services': { ...common, title: 'Servicios', services: [{ name: 'Consulta general', price: 'Gs. 80.000', duration: '30 min' }, { name: 'Vacunación', price: 'Gs. 50.000', duration: '15 min' }] },
    'analytics-dashboard': { ...common, title: 'Dashboard', stats: [{ label: 'Visitas', value: '1.234', change: '+12%' }, { label: 'Ventas', value: 'Gs. 5.6M', change: '+8%' }] },
    'tenant-settings': { ...common, title: 'Configuración', fields: [{ id: 'name', label: 'Nombre', type: 'text', value: 'Mi Negocio' }, { id: 'phone', label: 'Teléfono', type: 'tel', value: '+595 981 000 000' }] },
    'content-editor': { ...common, title: 'Editor', fields: [{ key: 'headline', label: 'Título', type: 'text', value: 'Bienvenidos' },
  }

  return samples[sectionId] || common
}

export default async function SectionPreviewPage({ params, searchParams }: Props) {
  const { section: sectionId } = await params
  const { variant: variantParam } = await searchParams

  const meta = SECTION_CATALOG[sectionId]
  if (!meta) notFound()

  const activeVariant = variantParam && meta.variants.includes(variantParam) ? variantParam : meta.defaultVariant

  return (
    <main className="min-h-screen bg-background">
      {/* Nav bar */}
      <div className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/preview" className="text-sm font-medium text-primary hover:underline">
              ← Gallery
            </Link>
            <span className="text-sm text-muted-foreground">/</span>
            <code className="rounded bg-surface-light px-2 py-0.5 text-sm font-semibold text-foreground">
              {sectionId}
            </code>
            <span className="rounded-full bg-surface-light px-2 py-0.5 text-[11px] text-muted-foreground">
              {meta.category}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/preview/${sectionId}?variant=${activeVariant}`}>
              <span className="rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-medium text-white">
                {activeVariant}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Variant selector */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Variants:</span>
          {meta.variants.map((v) => (
            <Link
              key={v}
              href={`/preview/${sectionId}?variant=${v}`}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all hover:border-[var(--primary)]/30 hover:bg-surface-light ${
                v === activeVariant ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-primary' : 'border-border'
              }`}
            >
              {v}
            </Link>
          ))}
        </div>

        {/* Section preview area */}
        <div className="rounded-xl border border-border bg-white">
          <div className="border-b border-border px-4 py-2">
            <p className="text-xs text-muted-foreground">
              Preview — <code className="font-mono">{sectionId}</code> with{' '}
              <code className="font-mono">{activeVariant}</code> variant
            </p>
          </div>
          <div className="min-h-[200px]">
            <SectionRenderer sectionId={sectionId} variant={activeVariant} sampleProps={buildSampleProps(sectionId)} />
          </div>
        </div>

        {/* Raw props for debugging */}
        <details className="mt-6">
          <summary className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground">
            Sample props (JSON)
          </summary>
          <pre className="mt-2 overflow-auto rounded-lg bg-surface-light p-4 text-xs text-muted-foreground">
            {JSON.stringify(buildSampleProps(sectionId), null, 2)}
          </pre>
        </details>
      </div>
    </main>
  )
}

function SectionRenderer({ sectionId, variant, sampleProps }: { sectionId: string; variant: string; sampleProps: Record<string, unknown> }) {
  const resolvedSection = { id: sectionId, variant, props: sampleProps }

  const page: ResolvedPage = {
    site: { slug: 'demo', vertical: 'retail-local', country: 'Paraguay', defaultLocale: 'es', locales: ['es'] } as any,
    locale: 'es' as any,
    page: { slug: '', sections: [resolvedSection] } as any,
    sections: [resolvedSection],
    meta: { title: `${sectionId} Preview`, description: '', path: '/preview' },
    theme: { cssString: ':root { --primary: #1B5E20; --secondary: #37474F; --accent: #E65100; --background: #FFFFFF; --surface: #FAFAFA; --surface-light: #F0F7F0; --text: #1B2A1B; --text-muted: #6B7B6B; }', googleFontsUrl: '', isDark: false },
  }

  try {
    return <>{renderPage(page)}</>
  } catch {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed border-red-300 bg-red-50 p-8">
        <div className="text-center">
          <p className="text-sm font-semibold text-red-600">Section rendered with errors</p>
          <p className="mt-1 text-xs text-red-400">
            <code>{sectionId}</code> requires specific props or context not available in preview mode.
          </p>
        </div>
      </div>
    )
  }
}
