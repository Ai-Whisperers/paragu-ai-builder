import Link from 'next/link'
import { renderPage } from '@/lib/engine/site-renderer'
import type { ResolvedPage } from '@/lib/engine/site-types'

export const dynamic = 'force-dynamic'

const THEME = ':root { --primary: #1B5E20; --secondary: #37474F; --accent: #E65100; --background: #FFFFFF; --surface: #FAFAFA; --surface-light: #F0F7F0; --text: #1B2A1B; --text-muted: #6B7B6B; }'

interface SectionMeta { id: string; variants: string[]; defaultVariant: string; category: string }

const ALL_SECTIONS: SectionMeta[] = [
  { id: 'hero', variants: ['image', 'split', 'minimal'], defaultVariant: 'image', category: 'Hero' },
  { id: 'stats-counter', variants: ['inline', 'cards', 'minimal'], defaultVariant: 'inline', category: 'Hero' },
  { id: 'trust-badges', variants: ['strip'], defaultVariant: 'strip', category: 'Hero' },
  { id: 'trust-signals', variants: ['credentials', 'logos-row'], defaultVariant: 'credentials', category: 'Hero' },
  { id: 'cta-banner', variants: ['gradient', 'solid'], defaultVariant: 'gradient', category: 'Hero' },
  { id: 'promo-banner', variants: ['countdown', 'simple', 'carousel'], defaultVariant: 'countdown', category: 'Hero' },
  { id: 'features', variants: ['three-col', 'grid'], defaultVariant: 'three-col', category: 'Content' },
  { id: 'services', variants: ['cards', 'list'], defaultVariant: 'cards', category: 'Content' },
  { id: 'process-timeline', variants: ['horizontal', 'vertical', 'stepped'], defaultVariant: 'horizontal', category: 'Content' },
  { id: 'content-grid', variants: ['cards', 'grid', 'masonry', 'list', 'detailed', 'carousel', 'icon-cards'], defaultVariant: 'cards', category: 'Content' },
  { id: 'testimonials', variants: ['carousel', 'grid'], defaultVariant: 'carousel', category: 'Social Proof' },
  { id: 'team', variants: ['cards', 'list', 'grid-photos'], defaultVariant: 'cards', category: 'Social Proof' },
  { id: 'faq', variants: ['accordion'], defaultVariant: 'accordion', category: 'Social Proof' },
  { id: 'gallery', variants: ['grid', 'masonry'], defaultVariant: 'grid', category: 'Media' },
  { id: 'contact', variants: ['split', 'form-only'], defaultVariant: 'split', category: 'Forms' },
  { id: 'lead-form', variants: ['standard', 'compact'], defaultVariant: 'standard', category: 'Forms' },
  { id: 'newsletter-signup', variants: ['standard'], defaultVariant: 'standard', category: 'Forms' },
  { id: 'google-maps', variants: ['default'], defaultVariant: 'default', category: 'Specialty' },
  { id: 'pricing-table', variants: ['default'], defaultVariant: 'default', category: 'Commerce' },
  { id: 'logo-strip', variants: ['grid', 'carousel', 'single-row'], defaultVariant: 'grid', category: 'Content' },
  { id: 'video-embed', variants: ['aspect-16-9', 'aspect-4-3', 'square', 'full-width'], defaultVariant: 'aspect-16-9', category: 'Content' },
  { id: 'footer', variants: ['standard', 'minimal'], defaultVariant: 'standard', category: 'Navigation' },
]

function buildSampleProps(sectionId: string): Record<string, unknown> {
  const common = { __siteSlug: 'demo', __locale: 'es', __country: 'Paraguay' }
  const samples: Record<string, Record<string, unknown>> = {
    hero: { ...common, headline: 'Bienvenido a Nuestra Tienda', subheadline: 'Los mejores productos para tu aventura', ctaPrimaryText: 'Ver Catálogo', ctaSecondaryText: 'Contactar', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920&q=80' },
    'stats-counter': { ...common, items: [{ value: '+500', label: 'Productos' }, { value: '+10', label: 'Años' }, { value: '98%', label: 'Satisfacción' }, { value: '24/7', label: 'Soporte' }] },
    'trust-badges': { ...common, items: [{ icon: 'Truck', text: 'Envío gratis', description: 'Desde Gs. 300.000' }, { icon: 'ShieldCheck', text: 'Pago seguro' }, { icon: 'RotateCcw', text: 'Cambios', description: '7 días' }, { icon: 'MessageCircle', text: 'WhatsApp' }] },
    'trust-signals': { ...common, eyebrow: 'Por qué', title: 'Nuestras Ventajas', items: [{ icon: 'Award', title: 'Calidad', description: 'Productos seleccionados' }, { icon: 'Users', title: 'Equipo', description: 'Profesionales' }, { icon: 'Shield', title: 'Garantía', description: '100% segura' }] },
    'cta-banner': { ...common, title: 'Listo para empezar?', buttonText: 'Contactanos', buttonHref: '#', description: 'Primera consulta gratis' },
    'promo-banner': { ...common, promotions: [{ title: 'Oferta', description: '20% descuento', badge: '-20%', ctaText: 'Comprar', ctaHref: '#', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80' }] },
    features: { ...common, title: 'Por qué elegirnos', items: [{ icon: 'Target', title: 'Calidad', description: 'Los mejores productos' }, { icon: 'Zap', title: 'Rapidez', description: 'Entrega 24hs' }, { icon: 'Shield', title: 'Confianza', description: 'Soporte garantizado' }] },
    services: { ...common, title: 'Servicios', services: [{ name: 'Servicio 1', price: 'Gs. 50.000', duration: 60 }, { name: 'Servicio 2', price: 'Gs. 80.000', duration: 90 }] },
    'process-timeline': { ...common, title: 'Cómo funciona', steps: [{ step: 1, title: 'Consultá' }, { step: 2, title: 'Elegí' }, { step: 3, title: 'Disfrutá' }] },
    'content-grid': { ...common, title: 'Productos', items: [{ title: 'Producto 1', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80' }, { title: 'Producto 2', image: 'https://images.unsplash.com/photo-1506976785307-8732e54ad72d?w=400&q=80' }] },
    testimonials: { ...common, title: 'Opiniones', items: [{ author: 'Juan', quote: 'Excelente servicio', rating: 5 }, { author: 'María', quote: 'Muy recomendado', rating: 5 }] },
    team: { ...common, title: 'Equipo', members: [{ name: 'Juan Pérez', role: 'Director', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' }] },
    faq: { ...common, title: 'Preguntas', items: [{ q: '¿Cómo contacto?', a: 'Por WhatsApp' }, { q: '¿Envíos?', a: '24-48hs' }] },
    gallery: { ...common, title: 'Galería', images: [{ src: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80', alt: 'Img' }, { src: 'https://images.unsplash.com/photo-1506976785307-8732e54ad72d?w=600&q=80', alt: 'Img' }] },
    contact: { ...common, title: 'Contacto', phone: '+595 981 000 000', email: 'info@demo.com', whatsapp: '595000000000' },
    'lead-form': { ...common, title: 'Contactanos', fields: [{ name: 'name', label: 'Nombre', type: 'text', required: true }, { name: 'phone', label: 'Teléfono', type: 'tel' }], submitLabel: 'Enviar' },
    'newsletter-signup': { ...common, title: 'Newsletter', buttonText: 'Suscribirme' },
    'google-maps': { ...common, address: 'Asunción' },
    'pricing-table': { ...common, title: 'Planes', items: [{ name: 'Básico', price: 'Gs. 50.000', features: ['A', 'B'], cta: 'Elegir' }, { name: 'Premium', price: 'Gs. 100.000', features: ['A', 'B', 'C'], popular: true, cta: 'Elegir' }] },
    'logo-strip': { ...common, title: 'Marcas', logos: [{ name: 'Logo 1', image: 'https://placehold.co/200x80/e2e8f0/64748b?text=LOGO' }] },
    'video-embed': { ...common, url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    footer: { ...common, businessName: 'Demo Store', address: 'Av. Principal 123', city: 'Asunción', navLinks: [{ label: 'Inicio', href: '#' }] },
  }
  return samples[sectionId] || common
}

function renderSingle(sectionId: string, variant: string): React.ReactNode {
  const page: ResolvedPage = {
    site: { slug: 'demo', vertical: 'retail-local', country: 'Paraguay', defaultLocale: 'es', locales: ['es'] } as any,
    locale: 'es' as any,
    page: { slug: '', sections: [{ id: sectionId, variant, props: buildSampleProps(sectionId) }] } as any,
    sections: [{ id: sectionId, variant, props: buildSampleProps(sectionId) }],
    meta: { title: '', description: '', path: '/preview/all' },
    theme: { cssString: THEME, googleFontsUrl: '', isDark: false },
  }
  try { return renderPage(page) } catch { return null }
}

export default function AllPreviewsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/preview" className="text-sm font-medium text-primary hover:underline">← Gallery</Link>
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm font-semibold text-foreground">All Sections</span>
            <span className="rounded-full bg-surface-light px-2 py-0.5 text-[11px] text-muted-foreground">{ALL_SECTIONS.length} sections</span>
          </div>
          <a href="/preview" className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-surface-light">Gallery View</a>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        {ALL_SECTIONS.map((s) => (
          <div key={s.id} id={s.id} className="mb-8 scroll-mt-20">
            <div className="mb-2 flex items-center gap-3">
              <a href={`/preview/${s.id}`} className="text-sm font-semibold text-primary hover:underline">
                {s.id}
              </a>
              <span className="rounded-full bg-surface-light px-2 py-0.5 text-[10px] text-muted-foreground">{s.category}</span>
              <div className="flex gap-1">
                {s.variants.map((v) => (
                  <a
                    key={v}
                    href={`/preview/${s.id}?variant=${v}`}
                    className="rounded bg-surface-light px-1.5 py-0.5 text-[10px] text-muted-foreground hover:text-primary"
                  >
                    {v}
                  </a>
                ))}
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-border">
              {renderSingle(s.id, s.defaultVariant)}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
