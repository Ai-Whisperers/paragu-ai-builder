import type { ResolvedPage } from './site-types'
import { logger } from '@/lib/logger'
import { GENERATED_MAP as _RAW_MAP } from './generated/renderer-map'

const GENERATED_MAP = _RAW_MAP as Record<string, React.ComponentType<any>>
import { SectionWrapper } from '@/components/ui/section-wrapper'
import { WhatsAppFloat } from '@/components/sections/navigation/whatsapp-float'
import { ProductCatalogSection } from '@/components/sections/commerce/product-catalog-section'
import { SectionErrorBoundary } from '@/components/ui/section-error-boundary'

// GENERATED_MAP is auto-generated but may miss some edge-case components
// (e.g. files named without -section suffix where export name differs).
// These hardcoded overrides paper over gaps until the generator is fixed.
const OVERRIDES: Record<string, React.ComponentType<any>> = {
  'whatsapp-float': WhatsAppFloat,
  // Generated file maps product-catalog to buildWhatsAppUrl (a utility fn),
  // not the actual React component. Override until generator is fixed.
  'product-catalog': ProductCatalogSection,
}

const { 'product-catalog': _pc, ...CLEAN_MAP } = GENERATED_MAP as Record<string, React.ComponentType<any>>

export const COMPONENTS: Record<string, React.ComponentType<any>> = {
  ...CLEAN_MAP,
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

    // Auto-alternate backgrounds for consecutive default sections
    // to create visual depth: every section after the first gets
    // 'alt' background unless it explicitly set one.
    const styling = s.styling
      ? { ...s.styling, background: (s.styling.background || (i % 2 === 1 ? 'alt' as const : 'default' as const)) }
      : { background: (i % 2 === 1 ? 'alt' as const : 'default' as const) as 'default' | 'alt' }

    return (
      <SectionErrorBoundary key={`seb-${s.id}-${i}`} sectionId={s.id} index={i}>
        <SectionWrapper key={`wrap-${s.id}-${i}`} styling={styling} id={s.id}>
          <C {...props} />
        </SectionWrapper>
      </SectionErrorBoundary>
    )
  })
}
