'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedContainerProps {
  children: React.ReactNode
  className?: string
  /** Animation type */
  animation?: 'fade-up' | 'fade-in' | 'scale-in' | 'slide-left' | 'slide-right' | 'slide-bottom'
  /** Animation delay in milliseconds */
  delay?: number
  /** Animation duration in seconds */
  duration?: number
  /** Trigger animation on scroll into view */
  triggerOnScroll?: boolean
  /** Threshold for scroll trigger (0-1) */
  threshold?: number
  /** Root margin for intersection observer */
  rootMargin?: string
  /** Run animation only once */
  once?: boolean
}

/**
 * Animated container with configurable entrance animations.
 * Supports scroll-triggered animations and custom timing.
 *
 * @example
 * // Fade up on scroll
 * <AnimatedContainer animation="fade-up" triggerOnScroll delay={200}>
 *   <YourContent />
 * </AnimatedContainer>
 *
 * @example
 * // Slide in from left immediately
 * <AnimatedContainer animation="slide-left" duration={0.8}>
 *   <YourContent />
 * </AnimatedContainer>
 */
export function AnimatedContainer({
  children,
  className,
  animation = 'fade-up',
  delay = 0,
  duration = 0.6,
  triggerOnScroll = true,
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  once = true,
}: AnimatedContainerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(!triggerOnScroll)

  useEffect(() => {
    if (!triggerOnScroll) return

    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) {
            observer.unobserve(element)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [triggerOnScroll, threshold, rootMargin, once])

  const animationClasses = {
    'fade-up': 'animate-fade-up',
    'fade-in': 'animate-fade-in',
    'scale-in': 'animate-scale-in',
    'slide-left': 'animate-slide-in-left',
    'slide-right': 'animate-slide-in-right',
    'slide-bottom': 'animate-slide-in-bottom',
  }

  const delayClass = delay > 0 ? `delay-${Math.round(delay / 100) * 100}` : ''

  return (
    <div
      ref={ref}
      className={cn(
        isVisible && animationClasses[animation],
        delayClass,
        className
      )}
      style={{
        animationDuration: `${duration}s`,
        animationDelay: delay > 0 && !delayClass ? `${delay}ms` : undefined,
        opacity: triggerOnScroll && !isVisible ? 0 : undefined,
      }}
    >
      {children}
    </div>
  )
}

interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
  /** Base animation for all children */
  animation?: 'fade-up' | 'fade-in' | 'scale-in' | 'slide-left' | 'slide-right'
  /** Delay between each child in milliseconds */
  staggerDelay?: number
  /** Animation duration in seconds */
  duration?: number
  /** Trigger on scroll */
  triggerOnScroll?: boolean
  /** Threshold for scroll trigger */
  threshold?: number
}

/**
 * Container that staggers animations for its children.
 * Wrap each child in AnimatedContainer for individual control.
 *
 * @example
 * <StaggerContainer staggerDelay={100} animation="fade-up">
 *   {items.map((item, i) => (
 *     <AnimatedContainer key={i} staggerIndex={i}>
 *       <Card>{item}</Card>
 *     </AnimatedContainer>
 *   ))}
 * </StaggerContainer>
 */
export function StaggerContainer({
  children,
  className,
  animation = 'fade-up',
  staggerDelay = 100,
  duration = 0.6,
  triggerOnScroll = true,
  threshold = 0.1,
}: StaggerContainerProps) {
  return (
    <div className={className}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <AnimatedContainer
              key={index}
              animation={animation}
              delay={index * staggerDelay}
              duration={duration}
              triggerOnScroll={triggerOnScroll}
              threshold={threshold}
            >
              {child}
            </AnimatedContainer>
          ))
        : children}
    </div>
  )
}

interface FloatingElementProps {
  children: React.ReactNode
  className?: string
  /** Float amplitude in pixels */
  amplitude?: number
  /** Float duration in seconds */
  duration?: number
  /** Delay before starting */
  delay?: number
}

/**
 * Element that floats up and down continuously.
 *
 * @example
 * <FloatingElement amplitude={15} duration={4}>
 *   <DecorativeIcon />
 * </FloatingElement>
 */
export function FloatingElement({
  children,
  className,
  amplitude = 10,
  duration = 3,
  delay = 0,
}: FloatingElementProps) {
  return (
    <div
      className={cn('animate-float', className)}
      style={{
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        '--float-amplitude': `${amplitude}px`,
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

interface PulsingElementProps {
  children: React.ReactNode
  className?: string
  /** Pulse scale - how much it shrinks */
  scale?: number
  /** Pulse duration in seconds */
  duration?: number
  /** Minimum opacity during pulse */
  minOpacity?: number
}

/**
 * Element that pulses (scales and fades) continuously.
 *
 * @example
 * <PulsingElement scale={0.95} duration={2}>
 *   <NotificationBadge />
 * </PulsingElement>
 */
export function PulsingElement({
  children,
  className,
  scale = 0.98,
  duration = 2,
  minOpacity = 0.8,
}: PulsingElementProps) {
  return (
    <div
      className={cn(className)}
      style={{
        animation: `gentlePulse ${duration}s ease-in-out infinite`,
        ['--pulse-scale' as string]: scale,
        ['--pulse-opacity' as string]: minOpacity,
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

interface ParallaxLayerProps {
  children: React.ReactNode
  className?: string
  /** Parallax speed - positive moves slower, negative moves faster */
  speed?: number
  /** Initial offset */
  offset?: number
}

/**
 * Layer that moves at different speed during scroll (parallax effect).
 * Must be inside a relative container with overflow hidden.
 *
 * @example
 * <div className="relative h-[800px] overflow-hidden">
 *   <ParallaxLayer speed={0.5}>
 *     <BackgroundImage />
 *   </ParallaxLayer>
 *   <ParallaxLayer speed={1.2}>
 *     <ForegroundContent />
 *   </ParallaxLayer>
 * </div>
 */
export function ParallaxLayer({
  children,
  className,
  speed = 0.5,
  offset = 0,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [translateY, setTranslateY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const scrolled = window.innerHeight - rect.top
      setTranslateY(scrolled * (1 - speed) * 0.1 + offset)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial position

    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed, offset])

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        transform: `translateY(${translateY}px)`,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  )
}

interface RevealTextProps {
  text: string
  className?: string
  /** Reveal animation type */
  type?: 'character' | 'word' | 'line'
  /** Delay between each element */
  staggerDelay?: number
  /** Base animation duration */
  duration?: number
  /** Trigger on scroll */
  triggerOnScroll?: boolean
}

/**
 * Text that reveals character by character, word by word, or line by line.
 *
 * @example
 * <RevealText
 *   text="Hello World"
 *   type="character"
 *   staggerDelay={50}
 *   triggerOnScroll
 * />
 */
export function RevealText({
  text,
  className,
  type = 'character',
  staggerDelay = 50,
  duration = 0.5,
  triggerOnScroll = true,
}: RevealTextProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!triggerOnScroll) {
      setIsVisible(true)
      return
    }

    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [triggerOnScroll])

  const elements = type === 'word' 
    ? text.split(' ')
    : type === 'character'
    ? text.split('')
    : [text]

  return (
    <span ref={ref} className={className}>
      {elements.map((element, index) => (
        <span
          key={index}
          className={cn(
            'inline-block transition-all',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
          style={{
            transitionDuration: `${duration}s`,
            transitionDelay: `${index * staggerDelay}ms`,
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {element}
          {type === 'word' && index < elements.length - 1 && '\u00A0'}
        </span>
      ))}
    </span>
  )
}

interface CountUpProps {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
  /** Trigger on scroll */
  triggerOnScroll?: boolean
}

/**
 * Number that counts up from 0 to the target value.
 *
 * @example
 * <CountUp end={1000} duration={2} suffix="+" prefix="$" />
 */
export function CountUp({
  end,
  duration = 2,
  prefix = '',
  suffix = '',
  className,
  triggerOnScroll = true,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (!triggerOnScroll) {
      animate()
      return
    }

    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          animate()
          setHasAnimated(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [triggerOnScroll, hasAnimated])

  const animate = () => {
    const startTime = Date.now()
    const animateFrame = () => {
      const elapsed = (Date.now() - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(easeOut * end))

      if (progress < 1) {
        requestAnimationFrame(animateFrame)
      }
    }
    requestAnimationFrame(animateFrame)
  }

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}
