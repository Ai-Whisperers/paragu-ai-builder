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
  gallery: {
    id: 'gallery',
    defaultVariant: 'grid',
    variants: ['grid', 'masonry'],
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
}

export function hasSection(id: string): boolean {
  return Object.prototype.hasOwnProperty.call(SECTION_CATALOG, id)
}

export function hasVariant(id: string, variant: string): boolean {
  const manifest = SECTION_CATALOG[id]
  return !!manifest && manifest.variants.includes(variant)
}

export function defaultVariant(id: string): string {
  const manifest = SECTION_CATALOG[id]
  if (!manifest) throw new Error(`[section-registry] Unknown section: ${id}`)
  return manifest.defaultVariant
}

export function allSectionIds(): string[] {
  return Object.keys(SECTION_CATALOG)
}
