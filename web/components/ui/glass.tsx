'use client'

import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  /** Inline styles for one-off overrides (e.g. custom background-color / backdrop-filter) */
  style?: React.CSSProperties
  /** Glass variant - affects background opacity */
  variant?: 'light' | 'dark' | 'strong'
  /** Border radius */
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  /** Enable hover glow effect */
  glow?: boolean
  /** Enable hover lift effect */
  hover?: boolean
  /** Add gradient border effect */
  gradientBorder?: boolean
}

/**
 * Glassmorphism card component with backdrop blur.
 * Perfect for overlays, modals, floating cards, and modern UI.
 *
 * @example
 * // Basic glass card
 * <GlassCard>
 *   <h3>Your Content</h3>
 *   <p>Glassmorphism is beautiful</p>
 * </GlassCard>
 *
 * @example
 * // Dark glass with glow on hover
 * <GlassCard variant="dark" glow hover>
 *   <YourContent />
 * </GlassCard>
 *
 * @example
 * // Glass card with gradient border
 * <GlassCard gradientBorder rounded="xl">
 *   <YourContent />
 * </GlassCard>
 */
export function GlassCard({
  children,
  className,
  style,
  variant = 'light',
  rounded = 'lg',
  glow = false,
  hover = false,
  gradientBorder = false,
}: GlassCardProps) {
  const variantClasses = {
    light: 'glass',
    dark: 'glass-dark',
    strong: 'glass-strong',
  }

  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  }

  if (gradientBorder) {
    return (
      <div
        className={cn(
          'relative p-[1px]',
          'bg-gradient-primary-secondary',
          roundedClasses[rounded],
          hover && 'hover-lift',
          className
        )}
        style={style}
      >
        <div
          className={cn(
            'h-full w-full',
            variantClasses[variant],
            roundedClasses[rounded],
            glow && 'glow-hover'
          )}
        >
          {children}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        variantClasses[variant],
        roundedClasses[rounded],
        glow && 'glow-hover',
        hover && 'hover-lift',
        className
      )}
      style={style}
    >
      {children}
    </div>
  )
}

interface GlassPanelProps {
  children: React.ReactNode
  className?: string
  /** Position for floating panels */
  position?: 'static' | 'absolute' | 'fixed' | 'sticky'
  /** Placement for absolute/fixed positioning */
  placement?: {
    top?: string | number
    right?: string | number
    bottom?: string | number
    left?: string | number
  }
  /** Full width/height to container */
  fullSize?: boolean
  /** Backdrop blur strength */
  blur?: 'sm' | 'md' | 'lg' | 'xl'
  /** Background opacity */
  opacity?: number
}

/**
 * Full glass panel - ideal for overlays, modals, and floating UI.
 *
 * @example
 * // Glass overlay panel
 * <GlassPanel
 *   position="fixed"
 *   placement={{ inset: 0 }}
 *   fullSize
 *   blur="xl"
 * >
 *   <ModalContent />
 * </GlassPanel>
 *
 * @example
 * // Floating glass panel
 * <GlassPanel
 *   position="absolute"
 *   placement={{ top: 20, right: 20 }}
 *   className="w-80 p-6"
 * >
 *   <NotificationCard />
 * </GlassPanel>
 */
export function GlassPanel({
  children,
  className,
  position = 'static',
  placement,
  fullSize = false,
  blur = 'lg',
  opacity = 0.8,
}: GlassPanelProps) {
  const blurValues = {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  }

  const placementStyles = placement ? Object.entries(placement).reduce((acc, [key, value]) => {
    acc[key] = typeof value === 'number' ? `${value}px` : value
    return acc
  }, {} as Record<string, string>) : {}

  return (
    <div
      className={cn(
        'z-50',
        position === 'absolute' && 'absolute',
        position === 'fixed' && 'fixed',
        position === 'sticky' && 'sticky',
        fullSize && 'inset-0',
        className
      )}
      style={{
        ...placementStyles,
        backgroundColor: `rgba(255, 255, 255, ${opacity * 0.1})`,
        backdropFilter: `blur(${blurValues[blur]})`,
        WebkitBackdropFilter: `blur(${blurValues[blur]})`,
        border: `1px solid rgba(255, 255, 255, ${opacity * 0.2})`,
      }}
    >
      {children}
    </div>
  )
}

interface GlassButtonProps {
  children: React.ReactNode
  className?: string
  /** Button size */
  size?: 'sm' | 'md' | 'lg'
  /** Variant affects background color */
  variant?: 'default' | 'primary' | 'secondary'
  /** Enable glow on hover */
  glow?: boolean
  /** Click handler */
  onClick?: () => void
  /** Link href */
  href?: string
}

/**
 * Glassmorphism button - frosted glass effect with hover glow.
 *
 * @example
 * <GlassButton variant="primary" size="lg" glow>
 *   Get Started
 * </GlassButton>
 */
export function GlassButton({
  children,
  className,
  size = 'md',
  variant = 'default',
  glow = true,
  onClick,
  href,
}: GlassButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const variantStyles = {
    default: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: 'var(--text)',
    },
    primary: {
      backgroundColor: 'rgba(var(--primary-rgb), 0.2)',
      color: 'var(--primary)',
    },
    secondary: {
      backgroundColor: 'rgba(var(--secondary-rgb), 0.2)',
      color: 'var(--secondary)',
    },
  }

  const Component = href ? 'a' : 'button'

  return (
    <Component
      href={href}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center',
        'rounded-lg font-medium',
        'backdrop-blur-md',
        'border border-white/20',
        'transition-all duration-300',
        glow && 'hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.4)]',
        'hover:-translate-y-0.5',
        'focus:outline-none focus:ring-2 focus:ring-[var(--primary)]',
        sizeClasses[size],
        className
      )}
      style={variantStyles[variant]}
    >
      {children}
    </Component>
  )
}

interface FrostedImageProps {
  src: string
  alt: string
  className?: string
  /** Overlay opacity */
  overlayOpacity?: number
  /** Enable parallax effect */
  parallax?: boolean
  /** Border radius */
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

/**
 * Image with frosted glass overlay - great for hero sections.
 *
 * @example
 * <FrostedImage
 *   src="/hero.jpg"
 *   alt="Hero"
 *   overlayOpacity={0.3}
 *   rounded="xl"
 * />
 */
export function FrostedImage({
  src,
  alt,
  className,
  overlayOpacity = 0.3,
  parallax = false,
  rounded = 'lg',
}: FrostedImageProps) {
  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  }

  return (
    <div className={cn('relative overflow-hidden', roundedClasses[rounded], className)}>
      <img
        src={src}
        alt={alt}
        className={cn(
          'h-full w-full object-cover',
          parallax && 'animate-float'
        )}
      />
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{
          backgroundColor: `rgba(255, 255, 255, ${overlayOpacity})`,
        }}
      />
    </div>
  )
}
