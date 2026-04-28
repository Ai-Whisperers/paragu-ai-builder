import { cn } from '@/lib/utils'
import type { SectionStyling, SectionVisibility } from '@/lib/engine/site-types'

interface SectionWrapperProps {
  children: React.ReactNode
  styling?: SectionStyling
  visibility?: SectionVisibility
  id?: string
  className?: string
}

const PAD_MAP: Record<string, string> = {
  none: 'py-0',
  sm: 'py-4 sm:py-6',
  md: 'py-6 sm:py-8',
  lg: 'py-8 sm:py-10',
  xl: 'py-10 sm:py-12',
}

const BG_MAP: Record<string, string> = {
  default: 'bg-background',
  alt: 'bg-surface',
  accent: 'bg-primary',
  dark: 'bg-neutral-900',
  image: '',
  gradient: 'bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]',
  transparent: 'bg-transparent',
}

const WIDTH_MAP: Record<string, string> = {
  narrow: 'max-w-3xl',
  default: 'max-w-6xl',
  wide: 'max-w-7xl',
  full: 'max-w-full',
}

const ALIGN_MAP: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

const COLOR_MAP: Record<string, string> = {
  default: '',
  light: 'text-white',
  dark: 'text-neutral-900',
  accent: 'text-primary',
}

export function SectionWrapper({
  children,
  styling = {},
  id,
  className,
}: SectionWrapperProps) {
  const {
    padding = 'md',
    background = 'default',
    backgroundImage,
    textAlign,
    textColor,
    divider,
  } = styling

  const inlineStyle: Record<string, string> = {}
  if (backgroundImage) {
    inlineStyle.backgroundImage = `url(${backgroundImage})`
    inlineStyle.backgroundSize = 'cover'
    inlineStyle.backgroundPosition = 'center'
  }

  const classes = cn(
    PAD_MAP[padding] || 'py-12 sm:py-16',
    BG_MAP[background] || '',
    ALIGN_MAP[textAlign || ''] || '',
    COLOR_MAP[textColor || ''] || '',
    divider && divider !== 'none' ? 'border-t border-border' : '',
    className,
  )

  return (
    <section
      id={id}
      className={classes}
      style={Object.keys(inlineStyle).length > 0 ? inlineStyle : undefined}
    >
      <div className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', WIDTH_MAP[styling.maxWidth || 'default'])}>
        {children}
      </div>
    </section>
  )
}
