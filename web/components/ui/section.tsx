import { cn } from '@/lib/utils'
import { Container } from './container'

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
  background?: 'surface' | 'surface-light' | 'background' | 'primary' | 'none'
  /** When true, does not wrap children in <Container> */
  fullWidth?: boolean
  /** Animate entrance on scroll */
  animated?: boolean
}

const spacingClasses = {
  sm: 'py-8 sm:py-12',
  md: 'py-12 sm:py-16',
  lg: 'py-16 sm:py-20',
  xl: 'py-20 sm:py-24',
}

const backgroundClasses = {
  surface: 'bg-surface',
  'surface-light': 'bg-surface-light',
  background: 'bg-background',
  primary: 'bg-primary',
  none: '',
}

export function Section({
  spacing = 'md',
  background = 'background',
  fullWidth = false,
  animated = false,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        spacingClasses[spacing],
        backgroundClasses[background],
        animated && 'animate-on-scroll',
        className,
      )}
      {...props}
    >
      {fullWidth ? children : <Container>{children}</Container>}
    </section>
  )
}
