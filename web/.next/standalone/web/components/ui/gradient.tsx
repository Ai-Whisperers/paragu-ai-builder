'use client'

import { cn } from '@/lib/utils'

interface GradientBackgroundProps {
  variant?: 'primary-secondary' | 'secondary-accent' | 'primary-accent' | 'mesh-1' | 'mesh-2' | 'animated'
  className?: string
  children?: React.ReactNode
  /** Enable animated gradient shift effect */
  animated?: boolean
  /** Add decorative pattern overlay */
  pattern?: 'dots' | 'lines' | 'grid' | 'diagonal' | 'none'
  /** Pattern opacity (0-1) */
  patternOpacity?: number
}

/**
 * Gradient background component with preset gradient combinations.
 * Uses CSS variables for theme-aware colors.
 *
 * @example
 * // Simple gradient background
 * <GradientBackground variant="primary-secondary">
 *   <YourContent />
 * </GradientBackground>
 *
 * @example
 * // Animated gradient with dot pattern
 * <GradientBackground
 *   variant="animated"
 *   animated
 *   pattern="dots"
 *   patternOpacity={0.1}
 * >
 *   <YourContent />
 * </GradientBackground>
 */
export function GradientBackground({
  variant = 'primary-secondary',
  className,
  children,
  animated = false,
  pattern = 'none',
  patternOpacity = 0.05,
}: GradientBackgroundProps) {
  const gradientClasses = {
    'primary-secondary': 'bg-gradient-primary-secondary',
    'secondary-accent': 'bg-gradient-secondary-accent',
    'primary-accent': 'bg-gradient-primary-accent',
    'mesh-1': 'bg-gradient-mesh-1',
    'mesh-2': 'bg-gradient-mesh-2',
    'animated': 'bg-gradient-animated bg-[length:400%_400%]',
  }

  const patternStyles = pattern !== 'none' ? {
    backgroundImage: `
      ${pattern === 'dots' ? 'radial-gradient(circle, currentColor 1px, transparent 1px)' : ''}
      ${pattern === 'lines' ? 'repeating-linear-gradient(90deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 20px)' : ''}
      ${pattern === 'grid' ? 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)' : ''}
      ${pattern === 'diagonal' ? 'repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 11px)' : ''}
    `,
    backgroundSize: pattern === 'dots' ? '20px 20px' : pattern === 'grid' ? '40px 40px' : 'auto',
    opacity: patternOpacity,
  } : {}

  return (
    <div
      className={cn(
        'relative',
        gradientClasses[variant],
        animated && 'animate-gradient',
        className
      )}
    >
      {pattern !== 'none' && (
        <div
          className="pointer-events-none absolute inset-0 text-[var(--text-muted)]"
          style={patternStyles}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

/**
 * Gradient text component with animated or static gradients
 */
interface GradientTextProps {
  children: React.ReactNode
  className?: string
  /** Enable animated gradient */
  animated?: boolean
}

export function GradientText({
  children,
  className,
  animated = false,
}: GradientTextProps) {
  return (
    <span
      className={cn(
        animated ? 'text-gradient-animated' : 'text-gradient',
        className
      )}
    >
      {children}
    </span>
  )
}

/**
 * Gradient border wrapper component
 */
interface GradientBorderProps {
  children: React.ReactNode
  className?: string
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export function GradientBorder({
  children,
  className,
  rounded = 'lg',
}: GradientBorderProps) {
  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  }

  return (
    <div
      className={cn(
        'relative p-[2px]',
        'bg-gradient-primary-secondary',
        roundedClasses[rounded],
        className
      )}
    >
      <div className={cn('h-full w-full bg-[var(--background)]', roundedClasses[rounded])}>
        {children}
      </div>
    </div>
  )
}
