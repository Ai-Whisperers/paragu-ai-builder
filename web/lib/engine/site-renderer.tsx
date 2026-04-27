/**
 * Site section renderer.
 *
 * Maps catalog section ids to React components. The COMPONENTS map
 * is auto-generated from the section registry — add new sections by
 * registering them in section-registry.ts and creating the component.
 * Re-run `npm run generate:renderer` to update the map.
 */
import type { ResolvedPage, SectionStyling } from './site-types'
import { logger } from '@/lib/logger'
import { cn } from '@/lib/utils'
import { GENERATED_MAP } from './generated/renderer-map'

// Exported so tests (and any future tooling) can assert that every
// registered section in section-registry has a matching render binding.
// See tests/unit/engine/renderer-wiring.test.ts — silent-skip bugs hit
// us four times before this guard landed (PRs #245, #247, #248).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const COMPONENTS: Record<string, React.ComponentType<any>> = GENERATED_MAP

/**
 * Convert a SectionStyling config to CSS class names and inline styles.
 */
function stylingToClasses(styling?: SectionStyling): { className: string; style: Record<string, string> } {
  if (!styling) return { className: '', style: {} }

  const classes: string[] = []
  const style: Record<string, string> = {}

  // Padding
  if (styling.padding) {
    const padMap: Record<string, string> = {
      none: 'py-0',
      sm: 'py-8 sm:py-12',
      md: 'py-12 sm:py-16',
      lg: 'py-16 sm:py-20',
      xl: 'py-20 sm:py-28',
    }
    classes.push(padMap[styling.padding] || 'py-16 sm:py-20')
  }

  // Background
  if (styling.background) {
    const bgMap: Record<string, string> = {
      default: 'bg-[var(--background)]',
      alt: 'bg-[var(--surface)]',
      accent: 'bg-[var(--primary)] text-white',
      dark: 'bg-neutral-900 text-white',
      transparent: 'bg-transparent',
    }
    if (bgMap[styling.background]) {
      classes.push(bgMap[styling.background])
    }
  }

  // Background image
  if (styling.backgroundImage) {
    style.backgroundImage = `url(${styling.backgroundImage})`
    style.backgroundSize = 'cover'
    style.backgroundPosition = 'center'
  }

  // Max width
  if (styling.maxWidth) {
    const widthMap: Record<string, string> = {
      narrow: 'max-w-3xl',
      default: 'max-w-6xl',
      wide: 'max-w-7xl',
      full: 'max-w-full',
    }
    if (widthMap[styling.maxWidth]) {
      classes.push(widthMap[styling.maxWidth])
    }
  }

  // Text alignment
  if (styling.textAlign) {
    const alignMap: Record<string, string> = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    }
    if (alignMap[styling.textAlign]) {
      classes.push(alignMap[styling.textAlign])
    }
  }

  // Text color
  if (styling.textColor) {
    const colorMap: Record<string, string> = {
      light: 'text-white',
      dark: 'text-neutral-900',
      accent: 'text-[var(--primary)]',
    }
    if (colorMap[styling.textColor]) {
      classes.push(colorMap[styling.textColor])
    }
  }

  // Divider
  if (styling.divider && styling.divider !== 'none') {
    classes.push('border-t border-[var(--border)]')
  }

  return { className: cn(...classes), style }
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

    // Apply section styling wrapper if styling config exists
    const { className: stylingClass, style: stylingStyle } = stylingToClasses(s.styling)

    const props = {
      ...s.props,
      variant: s.variant,
      locale: page.locale,
    } as Record<string, unknown>

    const section = <C key={`${s.id}-${i}`} {...props} />

    // Only wrap if styling is needed
    if (stylingClass || Object.keys(stylingStyle).length > 0) {
      return (
        <div key={`${s.id}-${i}`} className={stylingClass || undefined} style={Object.keys(stylingStyle).length > 0 ? stylingStyle : undefined}>
          {section}
        </div>
      )
    }

    return section
  })
}
