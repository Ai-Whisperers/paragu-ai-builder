'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface GlowCardProps {
  children: React.ReactNode
  className?: string
  /** Card border radius */
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  /** Glow color - uses CSS variable */
  glowColor?: 'primary' | 'secondary' | 'accent'
  /** Glow intensity */
  glowIntensity?: 'subtle' | 'medium' | 'strong'
  /** Enable hover glow effect */
  hover?: boolean
  /** Enable persistent glow */
  persistent?: boolean
}

/**
 * Card with dynamic glow effect that follows mouse position.
 *
 * @example
 * <GlowCard glowColor="primary" glowIntensity="medium" hover>
 *   <CardContent />
 * </GlowCard>
 *
 * @example
 * <GlowCard persistent glowColor="accent" glowIntensity="strong">
 *   <FeaturedContent />
 * </GlowCard>
 */
export function GlowCard({
  children,
  className,
  rounded = 'lg',
  glowColor = 'primary',
  glowIntensity = 'medium',
  hover = true,
  persistent = false,
}: GlowCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
  }

  const colorVars = {
    primary: 'var(--primary)',
    secondary: 'var(--secondary)',
    accent: 'var(--accent)',
  }

  const intensitySizes = {
    subtle: 200,
    medium: 300,
    strong: 400,
  }

  const size = intensitySizes[glowIntensity]

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        'bg-[var(--surface)]',
        roundedClasses[rounded],
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        boxShadow: persistent
          ? `0 0 40px -10px ${colorVars[glowColor]}40`
          : undefined,
      }}
    >
      {/* Glow effect layer */}
      <div
        className={cn(
          'pointer-events-none absolute rounded-full blur-xl transition-opacity duration-300',
          (isHovering || persistent) ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          width: size,
          height: size,
          backgroundColor: colorVars[glowColor],
          left: mousePosition.x - size / 2,
          top: mousePosition.y - size / 2,
          opacity: persistent ? 0.15 : isHovering ? 0.2 : 0,
        }}
      />
      
      {/* Card content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

interface SpotlightCardProps {
  children: React.ReactNode
  className?: string
  /** Border radius */
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  /** Spotlight size */
  spotlightSize?: number
  /** Spotlight opacity */
  spotlightOpacity?: number
  /** Border glow on hover */
  borderGlow?: boolean
}

/**
 * Card with spotlight effect that reveals on hover.
 *
 * @example
 * <SpotlightCard borderGlow rounded="xl">
 *   <CardContent />
 * </SpotlightCard>
 */
export function SpotlightCard({
  children,
  className,
  rounded = 'lg',
  spotlightSize = 200,
  spotlightOpacity = 0.15,
  borderGlow = true,
}: SpotlightCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        'bg-[var(--surface)]',
        'transition-shadow duration-300',
        borderGlow && isHovering && 'shadow-[0_0_30px_rgba(var(--primary-rgb),0.15)]',
        roundedClasses[rounded],
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Spotlight gradient */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 transition-opacity duration-300',
          isHovering ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          background: `radial-gradient(${spotlightSize}px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(var(--primary-rgb), ${spotlightOpacity}), transparent 100%)`,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  /** Maximum tilt angle in degrees */
  maxTilt?: number
  /** Scale on hover */
  scale?: number
  /** Enable glare effect */
  glare?: boolean
  /** Glare opacity */
  glareOpacity?: number
}

/**
 * 3D tilt card that responds to mouse movement.
 *
 * @example
 * <TiltCard maxTilt={10} scale={1.02} glare>
 *   <CardContent />
 * </TiltCard>
 */
export function TiltCard({
  children,
  className,
  maxTilt = 10,
  scale = 1,
  glare = true,
  glareOpacity = 0.2,
}: TiltCardProps) {
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 })
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    setTransform({
      rotateX: (y - 0.5) * -maxTilt,
      rotateY: (x - 0.5) * maxTilt,
    })

    setGlarePosition({
      x: x * 100,
      y: y * 100,
    })
  }

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0 })
    setIsHovering(false)
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg',
        'transition-transform duration-200 ease-out',
        'preserve-3d',
        className
      )}
      style={{
        transform: `
          perspective(1000px)
          rotateX(${transform.rotateX}deg)
          rotateY(${transform.rotateY}deg)
          scale(${isHovering ? scale : 1})
        `,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glare effect */}
      {glare && (
        <div
          className={cn(
            'pointer-events-none absolute inset-0 transition-opacity duration-200',
            isHovering ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,${glareOpacity}), transparent 50%)`,
          }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  /** Magnetic pull strength */
  strength?: number
  /** Button size */
  size?: 'sm' | 'md' | 'lg'
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  /** Click handler */
  onClick?: () => void
  /** Link href */
  href?: string
}

/**
 * Button that magnetically attracts to cursor on hover.
 *
 * @example
 * <MagneticButton strength={0.3} size="lg" variant="primary">
 *   Click Me
 * </MagneticButton>
 */
export function MagneticButton({
  children,
  className,
  strength = 0.3,
  size = 'md',
  variant = 'primary',
  onClick,
  href,
}: MagneticButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    setPosition({
      x: x * strength,
      y: y * strength,
    })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const variantClasses = {
    primary: 'bg-[var(--secondary)] text-white shadow-button',
    secondary: 'border-2 border-[var(--secondary)] text-[var(--secondary)] bg-transparent hover:bg-[var(--secondary)] hover:text-white',
    outline: 'border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-light)]',
    ghost: 'text-[var(--text)] hover:bg-[var(--surface-light)]',
  }

  const Component = href ? 'a' : 'button'

  return (
    <div
      className="inline-block"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Component
        href={href}
        onClick={onClick}
        className={cn(
          'inline-flex items-center justify-center',
          'rounded-lg font-medium',
          'transition-all duration-200 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-[var(--primary)]',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        {children}
      </Component>
    </div>
  )
}

interface MorphingCardProps {
  children: React.ReactNode
  className?: string
  /** Border radius that morphs */
  morphRadius?: boolean
  /** Enable border animation */
  animatedBorder?: boolean
  /** Border color */
  borderColor?: 'primary' | 'secondary' | 'accent'
}

/**
 * Card with morphing border radius and animated border.
 *
 * @example
 * <MorphingCard morphRadius animatedBorder borderColor="primary">
 *   <CardContent />
 * </MorphingCard>
 */
export function MorphingCard({
  children,
  className,
  morphRadius = true,
  animatedBorder = true,
  borderColor = 'primary',
}: MorphingCardProps) {
  const colorVars = {
    primary: 'var(--primary)',
    secondary: 'var(--secondary)',
    accent: 'var(--accent)',
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-[var(--surface)]',
        morphRadius && 'animate-blob',
        className
      )}
      style={{
        border: animatedBorder ? `2px solid ${colorVars[borderColor]}` : undefined,
      }}
    >
      {/* Animated border glow */}
      {animatedBorder && (
        <div
          className="absolute inset-0 animate-pulse-gentle opacity-30"
          style={{
            background: `linear-gradient(135deg, ${colorVars[borderColor]}40, transparent 50%)`,
          }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10 p-6">{children}</div>
    </div>
  )
}
