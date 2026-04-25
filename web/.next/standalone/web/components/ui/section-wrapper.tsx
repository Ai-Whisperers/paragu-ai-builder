'use client'

import { cn } from '@/lib/utils'
import { Container } from './container'
import { AnimatedSectionHeader } from './animate-on-scroll'

interface SectionWrapperProps {
  children: React.ReactNode
  className?: string
  id?: string
  /** Background variant */
  background?: 'default' | 'primary' | 'secondary' | 'gradient' | 'muted' | 'pattern'
  /** Pattern type when background is 'pattern' */
  pattern?: 'dots' | 'lines' | 'grid' | 'diagonal'
  /** Pattern opacity (0-1) */
  patternOpacity?: number
  /** Gradient variant when background is 'gradient' */
  gradientVariant?: 'primary-secondary' | 'secondary-accent' | 'primary-accent' | 'mesh'
  /** Enable animated gradient */
  animatedGradient?: boolean
  /** Section padding */
  padding?: 'sm' | 'md' | 'lg' | 'xl' | 'none'
  /** Container size */
  container?: 'sm' | 'md' | 'lg' | 'full'
  /** Section header title */
  title?: string
  /** Section header subtitle */
  subtitle?: string
  /** Align section header */
  headerAlign?: 'left' | 'center' | 'right'
  /** Add decorative blobs */
  decorativeBlobs?: boolean
  /** Blob colors */
  blobColors?: ('primary' | 'secondary' | 'accent')[]
  /** Enable scroll reveal animation */
  animate?: boolean
  /** Full width section (no container) */
  fullWidth?: boolean
}

/**
 * Enhanced section wrapper with multiple background options,
 * decorative elements, and scroll animations.
 *
 * @example
 * // Basic section with header
 * <SectionWrapper
 *   id="services"
 *   title="Our Services"
 *   subtitle="What we offer"
 *   background="default"
 * >
 *   <ServicesGrid />
 * </SectionWrapper>
 *
 * @example
 * // Gradient background with blobs
 * <SectionWrapper
 *   background="gradient"
 *   gradientVariant="primary-secondary"
 *   decorativeBlobs
 *   blobColors={['primary', 'accent']}
 *   padding="xl"
 * >
 *   <CTAContent />
 * </SectionWrapper>
 *
 * @example
 * // Pattern background
 * <SectionWrapper
 *   background="pattern"
 *   pattern="dots"
 *   patternOpacity={0.05}
 *   padding="lg"
 * >
 *   <Content />
 * </SectionWrapper>
 */
export function SectionWrapper({
  children,
  className,
  id,
  background = 'default',
  pattern = 'dots',
  patternOpacity = 0.05,
  gradientVariant = 'primary-secondary',
  animatedGradient = false,
  padding = 'lg',
  container = 'lg',
  title,
  subtitle,
  headerAlign = 'center',
  decorativeBlobs = false,
  blobColors = ['primary', 'secondary'],
  animate = true,
  fullWidth = false,
}: SectionWrapperProps) {
  // Background styles
  const backgroundClasses = {
    default: 'bg-[var(--background)]',
    primary: 'bg-[var(--primary)]',
    secondary: 'bg-[var(--secondary)]',
    gradient: '', // Handled separately
    muted: 'bg-[var(--surface-light)]',
    pattern: 'bg-[var(--background)]',
  }

  // Gradient backgrounds
  const gradientClasses = {
    'primary-secondary': 'bg-gradient-primary-secondary',
    'secondary-accent': 'bg-gradient-secondary-accent',
    'primary-accent': 'bg-gradient-primary-accent',
    'mesh': 'bg-gradient-mesh-1',
  }

  // Padding classes
  const paddingClasses = {
    none: '',
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16 sm:py-20',
    xl: 'py-20 sm:py-28',
  }

  // Header alignment classes
  const headerAlignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  // Text colors for different backgrounds
  const textColorClasses = {
    default: 'text-[var(--text)]',
    primary: 'text-[var(--primary-foreground)]',
    secondary: 'text-[var(--secondary-foreground)]',
    gradient: 'text-[var(--primary-foreground)]',
    muted: 'text-[var(--text)]',
    pattern: 'text-[var(--text)]',
  }

  const isGradient = background === 'gradient'
  const isPattern = background === 'pattern'

  return (
    <section
      id={id}
      className={cn(
        'relative overflow-hidden',
        !isGradient && backgroundClasses[background],
        isGradient && gradientClasses[gradientVariant],
        animatedGradient && isGradient && 'animate-gradient bg-[length:400%_400%]',
        paddingClasses[padding],
        className
      )}
    >
      {/* Pattern overlay */}
      {isPattern && (
        <div
          className="pointer-events-none absolute inset-0 text-[var(--text-muted)]"
          style={{
            backgroundImage: {
              dots: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
              lines: 'repeating-linear-gradient(90deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 20px)',
              grid: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
              diagonal: 'repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 11px)',
            }[pattern],
            backgroundSize: pattern === 'dots' ? '20px 20px' : pattern === 'grid' ? '40px 40px' : 'auto',
            opacity: patternOpacity,
          }}
        />
      )}

      {/* Decorative blobs */}
      {decorativeBlobs && (
        <>
          {blobColors.map((color, index) => (
            <div
              key={index}
              className={cn(
                'pointer-events-none absolute rounded-full blur-3xl animate-blob',
                index % 2 === 0 ? '-top-1/4 -right-1/4' : '-bottom-1/4 -left-1/4'
              )}
              style={{
                width: '50%',
                height: '50%',
                backgroundColor: `var(--${color})`,
                opacity: 0.15,
                animationDelay: `${index * 2}s`,
              }}
            />
          ))}
        </>
      )}

      {/* Content */}
      {fullWidth ? (
        <div className={cn('relative z-10', textColorClasses[background])}>
          {/* Section header */}
          {title && (
            <div className={cn('mb-12', headerAlignClasses[headerAlign])}>
              {animate ? (
                <AnimatedSectionHeader>
                  <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
                  {subtitle && (
                    <p className="mx-auto mt-4 max-w-2xl opacity-80">{subtitle}</p>
                  )}
                </AnimatedSectionHeader>
              ) : (
                <>
                  <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
                  {subtitle && (
                    <p className="mx-auto mt-4 max-w-2xl opacity-80">{subtitle}</p>
                  )}
                </>
              )}
            </div>
          )}
          {children}
        </div>
      ) : (
        <Container size={container}>
          <div className={cn('relative z-10', textColorClasses[background])}>
            {/* Section header */}
            {title && (
              <div className={cn('mb-12', headerAlignClasses[headerAlign])}>
                {animate ? (
                  <AnimatedSectionHeader>
                    <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
                    {subtitle && (
                      <p className="mx-auto mt-4 max-w-2xl opacity-80">{subtitle}</p>
                    )}
                  </AnimatedSectionHeader>
                ) : (
                  <>
                    <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
                    {subtitle && (
                      <p className="mx-auto mt-4 max-w-2xl opacity-80">{subtitle}</p>
                    )}
                  </>
                )}
              </div>
            )}
            {children}
          </div>
        </Container>
      )}
    </section>
  )
}

interface SplitSectionProps {
  /** Left side content */
  left: React.ReactNode
  /** Right side content */
  right: React.ReactNode
  className?: string
  id?: string
  /** Content order on mobile */
  mobileOrder?: 'left-first' | 'right-first'
  /** Gap between columns */
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  /** Vertical alignment */
  align?: 'start' | 'center' | 'end' | 'stretch'
  /** Left column width */
  leftWidth?: '1/3' | '1/2' | '2/3' | 'auto'
  /** Background */
  background?: SectionWrapperProps['background']
  /** Padding */
  padding?: SectionWrapperProps['padding']
}

/**
 * Two-column split section with responsive behavior.
 *
 * @example
 * <SplitSection
 *   left={<TextContent />}
 *   right={<ImageContent />}
 *   leftWidth="1/2"
 *   gap="xl"
 * />
 */
export function SplitSection({
  left,
  right,
  className,
  id,
  mobileOrder = 'left-first',
  gap = 'lg',
  align = 'center',
  leftWidth = '1/2',
  background = 'default',
  padding = 'lg',
}: SplitSectionProps) {
  const gapClasses = {
    sm: 'gap-8',
    md: 'gap-12',
    lg: 'gap-16',
    xl: 'gap-20',
  }

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  }

  const widthClasses = {
    '1/3': 'lg:w-1/3',
    '1/2': 'lg:w-1/2',
    '2/3': 'lg:w-2/3',
    'auto': 'lg:flex-1',
  }

  return (
    <SectionWrapper
      id={id}
      background={background}
      padding={padding}
      className={className}
    >
      <div
        className={cn(
          'flex flex-col lg:flex-row',
          gapClasses[gap],
          alignClasses[align],
          mobileOrder === 'right-first' && 'flex-col-reverse'
        )}
      >
        <div className={cn('w-full', widthClasses[leftWidth])}>{left}</div>
        <div className="w-full lg:flex-1">{right}</div>
      </div>
    </SectionWrapper>
  )
}

interface FeatureGridProps {
  features: Array<{
    icon?: React.ReactNode
    title: string
    description: string
  }>
  className?: string
  /** Number of columns */
  columns?: 2 | 3 | 4
  /** Card style */
  cardStyle?: 'default' | 'glass' | 'gradient' | 'outline'
  /** Enable hover effects */
  hoverEffect?: boolean
}

/**
 * Grid of feature cards with icons.
 *
 * @example
 * <FeatureGrid
 *   features={[
 *     { icon: <Icon />, title: 'Feature 1', description: 'Description' },
 *   ]}
 *   columns={3}
 *   cardStyle="glass"
 *   hoverEffect
 * />
 */
export function FeatureGrid({
  features,
  className,
  columns = 3,
  cardStyle = 'default',
  hoverEffect = true,
}: FeatureGridProps) {
  const gridClasses = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }

  const cardClasses = {
    default: 'bg-[var(--surface)] rounded-lg p-6',
    glass: 'glass rounded-lg p-6',
    gradient: 'bg-gradient-primary-secondary rounded-lg p-6 text-white',
    outline: 'border border-[var(--border)] rounded-lg p-6',
  }

  return (
    <div className={cn('grid gap-6', gridClasses[columns], className)}>
      {features.map((feature, index) => (
        <div
          key={index}
          className={cn(
            cardClasses[cardStyle],
            hoverEffect && 'transition-all duration-300',
            hoverEffect && cardStyle !== 'gradient' && 'hover:-translate-y-2 hover:shadow-card-hover'
          )}
        >
          {feature.icon && (
            <div className="mb-4 text-[var(--primary)]">{feature.icon}</div>
          )}
          <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
          <p className="text-sm text-[var(--text-muted)]">{feature.description}</p>
        </div>
      ))}
    </div>
  )
}
