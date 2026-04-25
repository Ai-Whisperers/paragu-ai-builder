'use client'

import { cn } from '@/lib/utils'

interface DecorativeBlobProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'muted'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  /** Enable morphing animation */
  animated?: boolean
  /** Position as absolute (for background use) */
  position?: 'static' | 'absolute' | 'fixed'
  /** Placement when absolute - combination of top/right/bottom/left */
  placement?: {
    top?: string
    right?: string
    bottom?: string
    left?: string
  }
  /** Blur amount for glow effect */
  blur?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  /** Opacity of the blob */
  opacity?: number
}

/**
 * Decorative blob shape with morphing animation.
 * Perfect for section backgrounds or accents.
 *
 * @example
 * // Animated blob as section background
 * <section className="relative overflow-hidden">
 *   <DecorativeBlob
 *     variant="primary"
 *     size="lg"
 *     animated
 *     position="absolute"
 *     placement={{ top: '-10%', right: '-10%' }}
 *     blur="xl"
 *     opacity={0.3}
 *   />
 *   <YourContent />
 * </section>
 *
 * @example
 * // Static accent blob
 * <DecorativeBlob variant="accent" size="sm" opacity={0.8} />
 */
export function DecorativeBlob({
  variant = 'primary',
  size = 'md',
  className,
  animated = false,
  position = 'static',
  placement,
  blur = 'lg',
  opacity = 0.5,
}: DecorativeBlobProps) {
  const colorClasses = {
    primary: 'bg-[var(--primary)]',
    secondary: 'bg-[var(--secondary)]',
    accent: 'bg-[var(--accent)]',
    muted: 'bg-[var(--muted)]',
  }

  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-64 h-64',
    lg: 'w-96 h-96',
    xl: 'w-[500px] h-[500px]',
  }

  const blurClasses = {
    none: '',
    sm: 'blur-sm',
    md: 'blur-md',
    lg: 'blur-lg',
    xl: 'blur-xl',
  }

  const placementStyles = placement ? {
    top: placement.top,
    right: placement.right,
    bottom: placement.bottom,
    left: placement.left,
  } : {}

  return (
    <div
      className={cn(
        colorClasses[variant],
        sizeClasses[size],
        blurClasses[blur],
        'rounded-full',
        animated && 'animate-blob',
        position === 'absolute' && 'absolute',
        position === 'fixed' && 'fixed',
        className
      )}
      style={{
        ...placementStyles,
        opacity,
      }}
    />
  )
}

interface DecorativeCircleProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline'
  size?: number
  className?: string
  /** Border width for outline variant */
  borderWidth?: number
  /** Enable pulse animation */
  pulse?: boolean
  /** Enable float animation */
  float?: boolean
}

/**
 * Decorative circle - solid, outline, or gradient.
 *
 * @example
 * // Pulsing notification indicator
 * <DecorativeCircle variant="accent" size={12} pulse />
 *
 * @example
 * // Floating decorative circle
 * <DecorativeCircle variant="outline" size={100} borderWidth={2} float />
 */
export function DecorativeCircle({
  variant = 'primary',
  size = 64,
  className,
  borderWidth = 2,
  pulse = false,
  float = false,
}: DecorativeCircleProps) {
  const variantStyles = {
    primary: { backgroundColor: 'var(--primary)' },
    secondary: { backgroundColor: 'var(--secondary)' },
    accent: { backgroundColor: 'var(--accent)' },
    outline: {
      backgroundColor: 'transparent',
      border: `${borderWidth}px solid var(--primary)`,
    },
  }

  return (
    <div
      className={cn(
        'rounded-full',
        pulse && 'animate-pulse-gentle',
        float && 'animate-float',
        className
      )}
      style={{
        width: size,
        height: size,
        ...variantStyles[variant],
      }}
    />
  )
}

interface DecorativeRingProps {
  variant?: 'primary' | 'secondary' | 'accent'
  size?: number
  className?: string
  /** Number of rings */
  count?: number
  /** Gap between rings */
  gap?: number
  /** Border width */
  borderWidth?: number
  /** Enable ripple animation */
  ripple?: boolean
}

/**
 * Decorative concentric rings.
 *
 * @example
 * // Ripple effect rings
 * <DecorativeRing variant="primary" size={200} count={3} ripple />
 */
export function DecorativeRing({
  variant = 'primary',
  size = 200,
  className,
  count = 3,
  gap = 20,
  borderWidth = 1,
  ripple = false,
}: DecorativeRingProps) {
  const color = {
    primary: 'var(--primary)',
    secondary: 'var(--secondary)',
    accent: 'var(--accent)',
  }[variant]

  return (
    <div
      className={cn('relative', className)}
      style={{ width: size, height: size }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'absolute rounded-full',
            ripple && 'animate-ping',
          )}
          style={{
            width: size - i * gap,
            height: size - i * gap,
            border: `${borderWidth}px solid ${color}`,
            opacity: 0.3 - i * 0.1,
            top: (i * gap) / 2,
            left: (i * gap) / 2,
            animationDelay: ripple ? `${i * 0.5}s` : undefined,
          }}
        />
      ))}
    </div>
  )
}

interface DecorativeDotsProps {
  className?: string
  /** Number of rows */
  rows?: number
  /** Number of columns */
  cols?: number
  /** Gap between dots */
  gap?: number
  /** Dot size */
  size?: number
  /** Dot color variant */
  variant?: 'primary' | 'secondary' | 'accent' | 'muted'
}

/**
 * Grid of decorative dots.
 *
 * @example
 * <DecorativeDots rows={5} cols={5} gap={16} size={4} variant="muted" />
 */
export function DecorativeDots({
  className,
  rows = 4,
  cols = 4,
  gap = 16,
  size = 4,
  variant = 'muted',
}: DecorativeDotsProps) {
  const color = {
    primary: 'var(--primary)',
    secondary: 'var(--secondary)',
    accent: 'var(--accent)',
    muted: 'var(--text-muted)',
  }[variant]

  return (
    <div
      className={cn('grid', className)}
      style={{
        gridTemplateColumns: `repeat(${cols}, ${size}px)`,
        gridTemplateRows: `repeat(${rows}, ${size}px)`,
        gap: `${gap}px`,
      }}
    >
      {Array.from({ length: rows * cols }).map((_, i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            opacity: 0.3,
          }}
        />
      ))}
    </div>
  )
}

interface DecorativeLineProps {
  className?: string
  variant?: 'horizontal' | 'vertical'
  length?: number | string
  thickness?: number
  color?: 'primary' | 'secondary' | 'accent' | 'muted'
  /** Enable gradient */
  gradient?: boolean
  /** Enable shimmer animation */
  shimmer?: boolean
}

/**
 * Decorative line - horizontal or vertical.
 *
 * @example
 * // Gradient divider line
 * <DecorativeLine
 *   variant="horizontal"
 *   length="100%"
 *   thickness={2}
 *   gradient
 * />
 */
export function DecorativeLine({
  className,
  variant = 'horizontal',
  length = '100%',
  thickness = 1,
  color = 'muted',
  gradient = false,
  shimmer = false,
}: DecorativeLineProps) {
  const isHorizontal = variant === 'horizontal'

  return (
    <div
      className={cn(
        isHorizontal ? 'w-full' : 'h-full',
        gradient && 'bg-gradient-primary-secondary',
        shimmer && 'animate-shimmer overflow-hidden',
        className
      )}
      style={{
        width: isHorizontal ? length : thickness,
        height: isHorizontal ? thickness : length,
        backgroundColor: gradient ? undefined : `var(--${color === 'muted' ? 'text-muted' : color})`,
        opacity: 0.3,
      }}
    />
  )
}
