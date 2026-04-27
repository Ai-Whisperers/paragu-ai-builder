import type { ResolvedPage } from './site-types'
import { logger } from '@/lib/logger'
import { GENERATED_MAP } from './generated/renderer-map'
import { SectionWrapper } from '@/components/ui/section-wrapper'

export const COMPONENTS: Record<string, React.ComponentType<any>> = GENERATED_MAP

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
