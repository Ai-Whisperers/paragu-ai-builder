/**
 * Legacy section renderer — kept for backwards compatibility with
 * demo/[business]/ routes. Delegates to the auto-generated section map.
 * New tenants should use site-renderer.tsx instead.
 */
import { COMPONENTS } from './site-renderer'
import { logger } from '@/lib/logger'
import { resolveSectionAlias } from './section-registry'
import type { ComposedSection } from './compose'

export function renderSection(section: ComposedSection): React.ReactNode {
  const kebab = resolveSectionAlias(section.type)
  const Component = COMPONENTS[kebab]
  if (!Component) {
    logger.warn('Unknown section type — skipping render', {
      action: 'renderSection',
      sectionType: section.type,
      normalized: kebab,
      order: section.order,
    })
    return null
  }
  return <Component key={`${kebab}-${section.order}`} {...section.data} variant={section.data.variant as string | undefined} />
}

export function renderSections(sections: ComposedSection[]): React.ReactNode[] {
  return sections.sort((a, b) => a.order - b.order).map(renderSection).filter(Boolean) as React.ReactNode[]
}
