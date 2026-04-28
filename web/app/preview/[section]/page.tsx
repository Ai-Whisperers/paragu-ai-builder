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
}

// Section metadata — single source matching the gallery
interface SectionMeta {
  id: string
  variants: string[]
  defaultVariant: string
  category: string
}

const SECTION_CATALOG: Record<string, SectionMeta> = {
  // Navigation
  header: { id: 'header', variants: ['standard', 'sticky', 'transparent'], defaultVariant: 'standard', category: 'Navigation' },
  footer: { id: 'footer', variants: ['standard', 'minimal'], defaultVariant: 'standard', category: 'Navigation' },
  'whatsapp-float': { id: 'whatsapp-float', variants: ['standard'], defaultVariant: 'standard', category: 'Navigation' },
  'contact-strip': { id: 'contact-strip', variants: ['standard'], defaultVariant: 'standard', category: 'Navigation' },
  'floating-cta': { id: 'floating-cta', variants: ['default', 'minimal'], defaultVariant: 'default', category: 'Navigation' },
  'compliance-disclaimer-footer': { id: 'compliance-disclaimer-footer', variants: ['standard'], defaultVariant: 'standard', category: 'Navigation' },
  'trust-badges': { id: 'trust-badges', variants: ['strip'], defaultVariant: 'strip', category: 'Hero' },
  'trust-signals': { id: 'trust-signals', variants: ['credentials', 'logos-row'], defaultVariant: 'credentials', category: 'Hero' },
  'stats-counter': { id: 'stats-counter', variants: ['inline', 'cards', 'minimal'], defaultVariant: 'inline', category: 'Hero' },
  'cta-banner': { id: 'cta-banner', variants: ['gradient', 'solid'], defaultVariant: 'gradient', category: 'Hero' },
  'promo-banner': { id: 'promo-banner', variants: ['countdown', 'simple', 'carousel'], defaultVariant: 'countdown', category: 'Hero' },
  services: { id: 'services', variants: ['cards', 'list'], defaultVariant: 'cards', category: 'Content' },
  features: { id: 'features', variants: ['three-col', 'grid'], defaultVariant: 'three-col', category: 'Content' },
  'process-timeline': { id: 'process-timeline', variants: ['horizontal', 'vertical', 'stepped'], defaultVariant: 'horizontal', category: 'Content' },
  process: { id: 'process', variants: ['steps', 'horizontal'], defaultVariant: 'steps', category: 'Content' },
  'content-grid': { id: 'content-grid', variants: ['cards', 'grid', 'masonry', 'list', 'detailed', 'carousel', 'icon-cards'], defaultVariant: 'cards', category: 'Content' },
  'video-embed': { id: 'video-embed', variants: ['aspect-16-9', 'aspect-4-3', 'square', 'full-width'], defaultVariant: 'aspect-16-9', category: 'Content' },
  'logo-strip': { id: 'logo-strip', variants: ['grid', 'carousel', 'single-row'], defaultVariant: 'grid', category: 'Content' },
  testimonials: { id: 'testimonials', variants: ['carousel', 'grid'], defaultVariant: 'carousel', category: 'Social Proof' },
  team: { id: 'team', variants: ['cards', 'list', 'grid-photos'], defaultVariant: 'cards', category: 'Social Proof' },
  faq: { id: 'faq', variants: ['accordion'], defaultVariant: 'accordion', category: 'Social Proof' },
  'enhanced-faq': { id: 'enhanced-faq', variants: ['searchable'], defaultVariant: 'searchable', category: 'Social Proof' },
  gallery: { id: 'gallery', variants: ['grid', 'masonry'], defaultVariant: 'grid', category: 'Media' },
  portfolio: { id: 'portfolio', variants: ['grid'], defaultVariant: 'grid', category: 'Media' },
  'blog-index': { id: 'blog-index', variants: ['grid', 'list'], defaultVariant: 'grid', category: 'Media' },
  'product-catalog': { id: 'product-catalog', variants: ['grid', 'cards'], defaultVariant: 'grid', category: 'Commerce' },
  'commerce-catalog': { id: 'commerce-catalog', variants: ['grid'], defaultVariant: 'grid', category: 'Commerce' },
  'pricing-table': { id: 'pricing-table', variants: ['default'], defaultVariant: 'default', category: 'Commerce' },
  contact: { id: 'contact', variants: ['split', 'form-only'], defaultVariant: 'split', category: 'Forms' },
  'lead-form': { id: 'lead-form', variants: ['standard', 'compact'], defaultVariant: 'standard', category: 'Forms' },
  'quote-form': { id: 'quote-form', variants: ['standard'], defaultVariant: 'standard', category: 'Forms' },
  'newsletter-signup': { id: 'newsletter-signup', variants: ['standard'], defaultVariant: 'standard', category: 'Forms' },
  'google-maps': { id: 'google-maps', variants: ['default'], defaultVariant: 'default', category: 'Specialty' },
  branches: { id: 'branches', variants: ['cards', 'list', 'map'], defaultVariant: 'cards', category: 'Specialty' },
  'property-listings': { id: 'property-listings', variants: ['cards', 'listings-from-api'], defaultVariant: 'cards', category: 'Specialty' },
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
  }

  return samples[sectionId] || common
}

export default async function SectionPreviewPage({ params }: Props) {
  const { section: sectionId } = await params

  const meta = SECTION_CATALOG[sectionId]
  if (!meta) notFound()

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
            <Link href={`/preview/${sectionId}?variant=${meta.defaultVariant}`}>
              <span className={`rounded-lg px-3 py-1.5 text-xs font-medium ${'bg-[var(--primary)] text-white'}`}>
                {meta.defaultVariant}
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
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-all hover:border-[var(--primary)]/30 hover:bg-surface-light"
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
              <code className="font-mono">{meta.defaultVariant}</code> variant
            </p>
          </div>
          <div className="min-h-[200px]">
            <SectionRenderer sectionId={sectionId} variant={meta.defaultVariant} sampleProps={buildSampleProps(sectionId)} />
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
  // Build a fake resolved page with just this section
  const resolvedSection = { id: sectionId, variant, props: sampleProps }

  const page: ResolvedPage = {
    site: { slug: 'demo', vertical: 'retail-local', country: 'Paraguay', defaultLocale: 'es', locales: ['es'] } as any,
    locale: 'es' as any,
    page: { slug: '', sections: [resolvedSection] } as any,
    sections: [resolvedSection],
    meta: { title: `${sectionId} Preview`, description: '', path: '/preview' },
    theme: { cssString: ':root { --primary: #1B5E20; --secondary: #37474F; --accent: #E65100; --background: #FFFFFF; --surface: #FAFAFA; --surface-light: #F0F7F0; --text: #1B2A1B; --text-muted: #6B7B6B; }', googleFontsUrl: '', isDark: false },
  }

  return <>{renderPage(page)}</>
}
