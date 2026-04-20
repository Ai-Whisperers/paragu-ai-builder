/**
 * Default content synthesizer.
 *
 * When a type has no `src/content/<id>.content.json` file, compose() falls back
 * to this generator. It produces the same shape the old auto-seeded content
 * files had — hero / about / services / testimonials / faq / footer — using
 * just the registry entry (nameEs, nameEn, verticalId, extends, hero).
 *
 * This removes the need to store ~1,700 near-identical content files on disk.
 * Curated content files stay and win via the `getContent()` lookup in
 * compose.ts. Only missing content falls through to this synthesizer.
 */

import type { ContentTemplate } from './compose'
import { getRegistry } from './static-config'

export function defaultContentFor(typeId: string): ContentTemplate | null {
  const registry = getRegistry(typeId) as
    | {
        id?: string
        nameEs?: string
        nameEn?: string
        subVertical?: string
        serviceCategories?: string[]
        hero?: { headlineTemplate?: string; subheadlineTemplate?: string }
      }
    | null
  if (!registry?.nameEs) return null

  const name = registry.nameEs
  const lowerName = name.toLowerCase()

  return {
    id: typeId,
    locale: 'es-PY',
    hero: {
      headline: registry.hero?.headlineTemplate || `{{businessName}} - ${name}`,
      subheadline:
        registry.hero?.subheadlineTemplate ||
        `${name} profesional en {{city}} con atencion personalizada.`,
      ctaPrimary: 'Consultar por WhatsApp',
      ctaSecondary: 'Ver Servicios',
    },
    about: {
      title: 'Sobre {{businessName}}',
      content: `En {{businessName}} brindamos ${lowerName} en {{city}}. Combinamos experiencia, herramientas modernas y atencion personalizada para cada cliente.`,
    },
    services: {
      title: 'Nuestros Servicios',
      categories: (registry.serviceCategories || ['principal']).map((sc) => ({
        id: sc,
        name: sc === 'principal' ? name : sc.replace(/_/g, ' '),
        description: `Servicios profesionales de ${lowerName}.`,
      })),
    },
    testimonials: [
      { quote: 'Excelente servicio y trato profesional. Muy recomendable.', author: 'Cliente Satisfecho', rating: 5 },
      { quote: 'Cumplieron con todo lo prometido y mas. Los volveria a elegir.', author: 'Cliente Habitual', rating: 5 },
    ],
    faq: [
      { q: '¿Como puedo contactarlos?', a: 'Escribinos por WhatsApp o llamanos. Respondemos en el dia.' },
      { q: '¿Atienden en mi zona?', a: 'Si, trabajamos en {{city}} y alrededores.' },
      { q: '¿Dan presupuesto sin cargo?', a: 'Si, todos nuestros presupuestos son sin compromiso.' },
    ],
    footer: {
      tagline: `{{businessName}} - ${name} en {{city}}`,
      copyright: '© {{year}} {{businessName}}',
    },
  } as ContentTemplate
}
