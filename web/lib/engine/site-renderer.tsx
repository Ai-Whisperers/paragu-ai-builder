import type { ResolvedPage } from './site-types'
import { logger } from '@/lib/logger'
import { GENERATED_MAP } from './generated/renderer-map'
import { SectionWrapper } from '@/components/ui/section-wrapper'
import { WhatsAppFloat } from '@/components/sections/whatsapp-float'

// GENERATED_MAP is auto-generated but may miss some edge-case components
// (e.g. files named without -section suffix where export name differs).
// These hardcoded overrides paper over gaps until the generator is fixed.
const OVERRIDES: Record<string, React.ComponentType<any>> = {
  'whatsapp-float': WhatsAppFloat,
}

export const COMPONENTS: Record<string, React.ComponentType<any>> = {
  ...GENERATED_MAP,
  ...OVERRIDES,
}

export function renderPage(page: ResolvedPage): React.ReactNode {
  return page.sections.map((s, i) => {
    const C = COMPONENTS[s.id]
    if (!C) {
      logger.warn('No component bound for section — skipping render', {
        action: 'renderPage',
        sectionId: s.id,
        index: i,
      })
      return null
    }

    const props = {
      ...s.props,
      variant: s.variant,
      locale: page.locale,
    } as Record<string, unknown>

    return (
      <SectionWrapper key={`wrap-${s.id}-${i}`} styling={s.styling} id={s.id}>
        <C {...props} />
      </SectionWrapper>
    )
  })
}
