/**
 * Template Composition Engine
 *
 * Takes a business type + business data and produces a fully composed page
 * by reading from the registry, content templates, and token files.
 *
 * Pipeline:
 *   registry/[type].type.json  → which sections, in what order
 *   content/[type].content.json → Spanish copy with {{placeholders}}
 *   tokens/[type].tokens.json  → visual theme
 *   + business data            → fills in placeholders
 *   = ComposedPage             → ready for rendering
 */

import { loadContent } from '@/lib/content/loader'
import {
  contentTemplateSchema,
  registryTypeSchema,
  type RegistryType,
} from '@/lib/content/schemas'
import { fillTemplate } from '@/lib/utils'
import { resolveTokens } from '@/lib/tokens/resolver'
import {
  SECTION_DEFINITIONS,
  resolveSectionKey,
  type ComposedSection,
  type NavItem,
  type SectionBuildContext,
  type SectionType,
} from './sections'
import type { BusinessData } from './business'

// Re-export for back-compat with existing imports.
export type { BusinessData } from './business'
export type { ComposedSection, SectionType } from './sections'

export interface ComposedPage {
  business: BusinessData
  sections: ComposedSection[]
  meta: {
    title: string
    description: string
  }
  theme: {
    cssString: string
    googleFontsUrl: string
    isDark: boolean
  }
}

function buildNavItems(registry: RegistryType): NavItem[] {
  return registry.nav.items.map((label) => ({
    label,
    href: `#${label
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')}`,
  }))
}

/**
 * Compose a full page for a business from its type registry and data.
 */
export async function composePage(business: BusinessData): Promise<ComposedPage> {
  const registry = loadContent(
    'registry',
    `${business.type}.type.json`,
    registryTypeSchema
  )
  const content = loadContent(
    'content',
    `${business.type}.content.json`,
    contentTemplateSchema
  )

  const templateData: Record<string, string | number> = {
    businessName: business.name,
    city: business.city,
    neighborhood: business.neighborhood ?? '',
    year: new Date().getFullYear(),
  }

  const ctx: SectionBuildContext = {
    business,
    content,
    registry,
    templateData,
    navItems: buildNavItems(registry),
  }

  const sections: ComposedSection[] = []
  const seen = new Set<SectionType>()
  let order = 0

  for (const rawKey of registry.pages.homepage.sections) {
    const type = resolveSectionKey(rawKey)
    if (!type) {
      console.warn(`[compose] Unknown section key "${rawKey}" for ${business.type}`)
      continue
    }
    if (seen.has(type)) continue
    const definition = SECTION_DEFINITIONS[type]
    const data = definition.build(ctx)
    if (data === null) continue
    sections.push({ type, order: order++, data })
    seen.add(type)
  }

  // WhatsApp float is appended explicitly — it's a fixed overlay, not a
  // flow section, so it shouldn't depend on registry ordering.
  const whatsappEnabled = Boolean(registry.features?.whatsappFloat?.enabled)
  if (business.whatsapp && whatsappEnabled && !seen.has('whatsappFloat')) {
    const msg = content.whatsapp?.defaultMessage ?? 'Hola! Quisiera mas informacion'
    sections.push({
      type: 'whatsappFloat',
      order: order++,
      data: {
        phone: business.whatsapp,
        message: fillTemplate(msg, templateData),
      },
    })
  }

  const title = fillTemplate(registry.seo.titleTemplate, templateData)
  const description = fillTemplate(registry.seo.descriptionTemplate, templateData)

  const tokens = resolveTokens(business.type)

  return {
    business,
    sections,
    meta: { title, description },
    theme: {
      cssString: tokens.cssString,
      googleFontsUrl: tokens.googleFontsUrl,
      isDark: tokens.theme === 'dark',
    },
  }
}
