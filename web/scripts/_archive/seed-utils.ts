/**
 * Shared helpers for seed-types batches. Keeps batch scripts lightweight:
 * a batch file only declares its SEEDS[] and calls runSeeds().
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '../..')

export const REGISTRY_DIR = path.join(ROOT, 'src/registry')
export const TOKENS_DIR = path.join(ROOT, 'src/tokens')
export const CONTENT_DIR = path.join(ROOT, 'src/content')

export interface Seed {
  id: string
  nameEs: string
  nameEn: string
  verticalId: string
  extendsType: string
  schemaType: string
  headlineHook: string
  subheadline: string
  serviceCategories?: Array<{ id: string; name: string; description: string }>
  keywords?: string[]
  ctaPrimary?: { text: string; action: string }
  ctaSecondary?: { text: string; action: string }
  customTokens?: {
    paletteName: string
    colors: { primary: string; secondary: string; accent: string; background: string; surface: string; text: string }
    heading?: string
  }
}

export function generateRegistry(seed: Seed): object {
  const registry: Record<string, unknown> = {
    id: seed.id,
    nameEs: seed.nameEs,
    nameEn: seed.nameEn,
    verticalId: seed.verticalId,
    extends: seed.extendsType,
    tokens: seed.id,
    seo: {
      schemaType: seed.schemaType,
      titleTemplate: `{{businessName}} - ${seed.nameEs} en {{city}}`,
      descriptionTemplate: seed.subheadline,
      keywords: seed.keywords || [],
    },
    hero: {
      headlineTemplate: `{{businessName}} - ${seed.headlineHook}`,
      subheadlineTemplate: seed.subheadline,
    },
  }
  if (seed.serviceCategories) {
    registry.serviceCategories = seed.serviceCategories.map((c) => c.id)
  }
  if (seed.ctaPrimary) (registry.hero as Record<string, unknown>).ctaPrimary = seed.ctaPrimary
  if (seed.ctaSecondary) (registry.hero as Record<string, unknown>).ctaSecondary = seed.ctaSecondary
  return registry
}

export function generateTokens(seed: Seed): object {
  if (seed.customTokens) {
    return {
      name: seed.customTokens.paletteName,
      theme: 'light',
      palettes: {
        default: { name: seed.customTokens.paletteName, colors: seed.customTokens.colors },
      },
      defaultPalette: 'default',
      typography: {
        heading: seed.customTokens.heading || "'Inter', sans-serif",
        body: "'Inter', sans-serif",
        headingWeight: '600',
        bodyWeight: '400',
      },
      googleFonts: ['Inter:wght@400;500;600;700'],
    }
  }
  return {
    $comment: `Inherits ${seed.verticalId} vertical defaults`,
    extends: `vertical:${seed.verticalId}`,
  }
}

export function generateContent(seed: Seed): object {
  const services = seed.serviceCategories || [
    { id: 'general', name: 'Servicio Principal', description: 'Servicios profesionales a medida.' },
  ]
  return {
    id: seed.id,
    locale: 'es-PY',
    hero: {
      headline: `{{businessName}} - ${seed.headlineHook}`,
      subheadline: seed.subheadline,
      ctaPrimary: seed.ctaPrimary?.text || 'Consultar por WhatsApp',
      ctaSecondary: seed.ctaSecondary?.text || 'Ver Servicios',
    },
    about: {
      title: 'Sobre {{businessName}}',
      content: `En {{businessName}} brindamos ${seed.nameEs.toLowerCase()} en {{city}}. Combinamos experiencia, herramientas modernas y atencion personalizada para cada cliente.`,
    },
    services: {
      title: 'Nuestros Servicios',
      categories: services.map((s) => ({ id: s.id, name: s.name, description: s.description })),
    },
    testimonials: [
      { quote: 'Excelente servicio y trato profesional. Muy recomendable.', author: 'Cliente Satisfecho', rating: 5 },
      { quote: 'Cumplieron con todo lo prometido y mas. Los volveria a elegir.', author: 'Cliente Habitual', rating: 5 },
    ],
    faq: [
      { q: '¿Como puedo contactarlos?', a: 'Escribinos por WhatsApp o llamanos. Respondemos en el dia.' },
      { q: '¿Atienden en mi zona?', a: 'Si, trabajamos en {{city}} y alrededores. Consultanos por otras zonas.' },
      { q: '¿Dan presupuesto sin cargo?', a: 'Si, todos nuestros presupuestos son sin compromiso.' },
    ],
    footer: {
      tagline: `{{businessName}} - ${seed.nameEs} profesional en {{city}}`,
      copyright: '© {{year}} {{businessName}}',
    },
  }
}

function writeIfMissing(filePath: string, payload: object): boolean {
  if (fs.existsSync(filePath)) return false
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2) + '\n', 'utf-8')
  return true
}

export function runSeeds(seeds: Seed[], label = 'seeds'): void {
  let created = 0
  let skipped = 0
  for (const seed of seeds) {
    const registryPath = path.join(REGISTRY_DIR, `${seed.id}.type.json`)
    const tokensPath = path.join(TOKENS_DIR, `${seed.id}.tokens.json`)
    const contentPath = path.join(CONTENT_DIR, `${seed.id}.content.json`)

    const a = writeIfMissing(registryPath, generateRegistry(seed))
    const b = writeIfMissing(tokensPath, generateTokens(seed))
    const c = writeIfMissing(contentPath, generateContent(seed))

    if (a || b || c) {
      created++
      const parts: string[] = []
      if (a) parts.push('registry')
      if (b) parts.push('tokens')
      if (c) parts.push('content')
      console.log(`+ ${seed.id} (${seed.verticalId}) [${parts.join(', ')}]`)
    } else {
      skipped++
    }
  }
  console.log(`\nDone ${label}. ${created} seeded, ${skipped} already existed. Total: ${seeds.length}`)
}
