/**
 * Generates pre-commerce static PDP pages for every Superspuma SKU.
 *
 * Reads:  src/content/superspuma/products.seed.json
 * Writes: sites/superspuma/pages/producto/<slug>.json   (page config)
 *         sites/superspuma/content/es.json              (producto.* content blocks)
 *
 * Pre-commerce because Superspuma's commerce.enabled is false. When
 * commerce flips on, the dynamic `/producto/[slug]` route (DB-backed)
 * takes over and these static files can be archived — but in the
 * interim they give us 24 indexable SEO landing pages and one
 * WhatsApp-first PDP per model.
 *
 * Run with: npx tsx scripts/generate-superspuma-pdps.ts
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..')

interface SizeVariant {
  label: string
  dimensions: string
  price: number
}

interface Product {
  id: string
  name: string
  line?: string
  category: string
  description?: string
  shortDescription?: string
  priceFrom?: number
  priceFromLabel?: string
  images?: string[]
  sizes?: SizeVariant[]
  specs?: Record<string, string | number>
  installments?: string
  badges?: string[]
}

const SEED_PATH = join(REPO_ROOT, 'src/content/superspuma/products.seed.json')
const CONTENT_PATH = join(REPO_ROOT, 'sites/superspuma/content/es.json')
const PAGES_DIR = join(REPO_ROOT, 'sites/superspuma/pages/producto')

function fmtPrice(gs: number): string {
  return `Gs. ${gs.toLocaleString('es-PY')}`
}

function whatsappLink(productName: string, size?: string): string {
  const msg = size
    ? `Hola! Quiero consultar por el colchón ${productName} en medida ${size}.`
    : `Hola! Quiero consultar por el colchón ${productName}.`
  return `https://wa.me/595974202025?text=${encodeURIComponent(msg)}`
}

function buildProductContent(p: Product): Record<string, unknown> {
  const hero = {
    headline: p.name,
    subheadline: p.shortDescription ?? p.description ?? `Modelo ${p.name} de Superspuma.`,
    ctaPrimaryText: 'Consultar por WhatsApp',
    ctaPrimaryHref: whatsappLink(p.name),
    ctaSecondaryText: 'Ver todo el catálogo',
    ctaSecondaryHref: '/s/es/superspuma#catalogo',
    trustBadges: [
      p.line ? `Línea ${p.line}` : 'Superspuma',
      p.specs?.warranty ? `${p.specs.warranty} garantía` : 'Garantía fábrica',
      'Envío nacional',
    ],
  }

  const trustBadges = {
    title: `¿Por qué elegir el ${p.name}?`,
    items: [
      { icon: 'factory', text: 'Fabricación paraguaya', description: 'Villeta, desde 1976' },
      ...(p.specs?.warranty
        ? [{ icon: 'shieldcheck', text: `${p.specs.warranty} de garantía`, description: 'Certificado incluido' }]
        : []),
      { icon: 'creditcard', text: 'Hasta 18 cuotas sin interés', description: 'Con todas las tarjetas' },
      { icon: 'truck', text: 'Envío a todo el país', description: 'Gratis desde Gs. 1.000.000' },
      { icon: 'recycle', text: 'Retiramos tu colchón viejo', description: 'Sin costo extra' },
    ],
  }

  const specsList = Object.entries(p.specs ?? {}).map(([k, v]) => {
    const niceKey = k
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (s) => s.toUpperCase())
      .replace(/Total Height/, 'Altura total')
      .replace(/Base Height/, 'Altura del sommier')
      .replace(/Weight Capacity/, 'Peso soportado')
      .replace(/Pillow Top/, 'Pillow Top')
      .replace(/Firmness/, 'Firmeza')
      .replace(/Cover/, 'Funda')
      .replace(/Technology/, 'Tecnología')
      .replace(/Colors/, 'Colores')
      .replace(/Warranty/, 'Garantía')
    return { icon: 'check', text: niceKey, description: Array.isArray(v) ? v.join(', ') : String(v) }
  })

  const specsSection = {
    title: 'Ficha técnica',
    items: specsList,
  }

  // Build comparison-tiered for size variants when available
  const sizesSection = p.sizes && p.sizes.length > 0
    ? {
        title: 'Medidas disponibles',
        subtitle: 'Confirmamos stock al momento de tu consulta por WhatsApp.',
        tiers: p.sizes.map((s, i) => ({
          id: `size-${i}`,
          name: s.label,
          description: s.dimensions,
          price: fmtPrice(s.price),
          priceNote: p.installments || 'Consultar cuotas',
          highlighted: i === 1,
          included: [
            `Dimensiones: ${s.dimensions}`,
            p.specs?.warranty ? `Garantía: ${p.specs.warranty}` : 'Garantía incluida',
            'Envío e instalación coordinada',
          ],
          ctaLabel: 'Consultar por WhatsApp',
          ctaHref: whatsappLink(p.name, s.label),
        })),
      }
    : null

  const contactRef = {
    title: `Consultá por el ${p.name}`,
    subtitle: 'Te confirmamos disponibilidad, cuotas, zona de entrega y medidas en el mismo día.',
    buttonText: 'Escribir por WhatsApp',
    buttonHref: whatsappLink(p.name),
  }

  return {
    seo: {
      title: `${p.name} — Colchón Superspuma${p.priceFromLabel ? ' — ' + p.priceFromLabel : ''}`,
      description: (p.description ?? p.shortDescription ?? '').slice(0, 160),
    },
    hero,
    trustBadges,
    ...(sizesSection ? { sizes: sizesSection } : {}),
    specs: specsSection,
    cta: contactRef,
  }
}

function buildPageConfig(p: Product): Record<string, unknown> {
  const hasSizes = p.sizes && p.sizes.length > 0
  return {
    slug: `producto/${p.id}`,
    titleKey: `producto.${p.id}.seo.title`,
    descriptionKey: `producto.${p.id}.seo.description`,
    sections: [
      { id: 'header', variant: 'standard', content: 'navigation' },
      { id: 'hero', variant: 'image', content: `producto.${p.id}.hero` },
      { id: 'trust-badges', variant: 'strip', content: `producto.${p.id}.trustBadges` },
      ...(hasSizes
        ? [{ id: 'programs-comparison', variant: 'tiered', content: `producto.${p.id}.sizes` }]
        : []),
      { id: 'trust-badges', variant: 'strip', content: `producto.${p.id}.specs` },
      { id: 'testimonials', variant: 'carousel', content: 'home.testimonials' },
      { id: 'enhanced-faq', variant: 'searchable', content: 'home.enhancedFaq' },
      { id: 'cta-banner', variant: 'gradient', content: `producto.${p.id}.cta` },
      { id: 'contact', variant: 'split', content: 'home.contact' },
      { id: 'whatsapp-float', variant: 'standard', content: 'whatsapp' },
      { id: 'footer', variant: 'standard', content: 'footer' },
    ],
  }
}

function main() {
  const products: Product[] = JSON.parse(readFileSync(SEED_PATH, 'utf8'))
  const content = JSON.parse(readFileSync(CONTENT_PATH, 'utf8')) as Record<string, unknown>

  // Ensure `producto` section exists at top-level of content
  const productoBlock: Record<string, unknown> = {}

  mkdirSync(PAGES_DIR, { recursive: true })

  const allPageSlugs: string[] = []

  for (const p of products) {
    productoBlock[p.id] = buildProductContent(p)
    const pageCfg = buildPageConfig(p)
    const outPath = join(PAGES_DIR, `${p.id}.json`)
    writeFileSync(outPath, JSON.stringify(pageCfg, null, 2) + '\n')
    allPageSlugs.push(`producto/${p.id}`)
    console.log(`  wrote ${outPath.replace(REPO_ROOT + '/', '')}`)
  }

  // Merge into content/es.json preserving all other keys.
  content.producto = productoBlock
  writeFileSync(CONTENT_PATH, JSON.stringify(content, null, 2) + '\n')
  console.log(`  updated ${CONTENT_PATH.replace(REPO_ROOT + '/', '')}`)

  console.log(`\nGenerated ${products.length} product pages:`)
  for (const s of allPageSlugs) console.log(`  /s/es/superspuma/${s}`)
}

main()
