/**
 * Section Renderer
 *
 * Maps composed section definitions to their React components via the
 * unified `SECTION_DEFINITIONS` registry — keeping composition and
 * rendering in lock-step by construction.
 */

import type { ComponentType, ReactNode } from 'react'
import { SECTION_DEFINITIONS, type ComposedSection } from './sections'

export function renderSection(section: ComposedSection): ReactNode {
  const definition = SECTION_DEFINITIONS[section.type]
  if (!definition) {
    console.warn(`[Renderer] Unknown section type: ${section.type}`)
    return null
  }
  // The registry guarantees data shape matches component Props for each type.
  const Component = definition.component as ComponentType<Record<string, unknown>>
  return (
    <Component
      key={`${section.type}-${section.order}`}
      {...(section.data as Record<string, unknown>)}
    />
  )
}

export function renderSections(sections: ComposedSection[]): ReactNode[] {
  return sections
    .slice()
    .sort((a, b) => a.order - b.order)
    .map(renderSection)
    .filter((node): node is ReactNode => node !== null && node !== undefined)
}
