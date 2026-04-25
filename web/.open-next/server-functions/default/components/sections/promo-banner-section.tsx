'use client'

import { useState, useEffect } from 'react'
import { X, Clock, Tag, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Promotion {
  id: string
  title: string
  description: string
  code?: string
  expiresAt?: string
  bgColor: string
  textColor: string
  link?: string
}

interface PromoBannerSectionProps {
  promotions: Promotion[]
  autoRotate?: boolean
  rotateInterval?: number
  dismissible?: boolean
  position?: 'top' | 'bottom'
  variant?: 'countdown' | 'simple' | 'carousel'
}

export function PromoBannerSection({
  promotions,
  autoRotate = true,
  rotateInterval = 5000,
  dismissible = true,
  position = 'top',
  variant = 'countdown'
}: PromoBannerSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDismissed, setIsDismissed] = useState(false)
  const [timeLeft, setTimeLeft] = useState<Record<string, number>>({})
  const [progress, setProgress] = useState(0)

  const currentPromo = promotions[currentIndex]

  // Auto-rotate promotions
  useEffect(() => {
    if (!autoRotate || promotions.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promotions.length)
      setProgress(0)
    }, rotateInterval)

    return () => clearInterval(interval)
  }, [autoRotate, rotateInterval, promotions.length])

  // Progress bar animation
  useEffect(() => {
    if (!autoRotate || promotions.length <= 1) return

    // Reset progress when currentIndex changes — intentional cascading
    // render: the new promo starts with an empty progress bar before the
    // interval below begins incrementing it.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(0)
    const step = 100 / (rotateInterval / 100)
    
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0
        return prev + step
      })
    }, 100)

    return () => clearInterval(progressInterval)
  }, [currentIndex, autoRotate, rotateInterval, promotions.length])

  // Countdown timer
  useEffect(() => {
    if (variant !== 'countdown') return

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const newTimeLeft: Record<string, number> = {}

      promotions.forEach((promo) => {
        if (promo.expiresAt) {
          const expiry = new Date(promo.expiresAt).getTime()
          newTimeLeft[promo.id] = Math.max(0, expiry - now)
        }
      })

      setTimeLeft(newTimeLeft)
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [promotions, variant])

  const formatTime = (ms: number) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24))
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((ms % (1000 * 60)) / 1000)

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m ${seconds}s`
  }

  if (isDismissed || promotions.length === 0) return null

  if (variant === 'carousel') {
    return (
      <section className={cn(
        "relative overflow-hidden transition-all duration-300",
        position === 'top' ? "order-first" : "order-last",
        currentPromo.bgColor
      )}>
        <div
          key={currentPromo.id}
          className={cn(
            "py-3 px-4 animate-in slide-in-from-right-4 duration-300",
            currentPromo.textColor
          )}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span className="font-bold">{currentPromo.title}</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">{currentPromo.description}</span>
            </div>
            
            {currentPromo.code && (
              <code className="px-2 py-1 bg-white/20 rounded text-sm font-mono">
                {currentPromo.code}
              </code>
            )}

            <button className="flex items-center gap-1 text-sm underline hover:no-underline">
              Aprovechar <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dismiss */}
        {dismissible && (
          <button
            onClick={() => setIsDismissed(true)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Pagination dots */}
        {promotions.length > 1 && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
            {promotions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all",
                  idx === currentIndex ? "bg-white w-4" : "bg-white/40"
                )}
              />
            ))}
          </div>
        )}
      </section>
    )
  }

  // Countdown variant
  return (
    <section className={cn(
      "relative overflow-hidden",
      position === 'top' ? "order-first" : "order-last",
      currentPromo.bgColor
    )}>
      <div className={cn(
        "py-3 px-4",
        currentPromo.textColor
      )}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {/* Icon + Title */}
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 animate-pulse" />
              <span className="font-bold text-lg">{currentPromo.title}</span>
            </div>

            {/* Description */}
            <span className="hidden md:inline opacity-90">
              {currentPromo.description}
            </span>

            {/* Countdown */}
            {variant === 'countdown' && currentPromo.expiresAt && (
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
                <Clock className="w-4 h-4" />
                <span className="font-mono font-bold">
                  {formatTime(timeLeft[currentPromo.id] || 0)}
                </span>
              </div>
            )}

            {/* Promo Code */}
            {currentPromo.code && (
              <code className="px-3 py-1.5 bg-white/90 text-gray-900 rounded-lg text-sm font-bold">
                Código: {currentPromo.code}
              </code>
            )}

            {/* CTA */}
            <button className="px-4 py-1.5 bg-white text-gray-900 rounded-full text-sm font-bold hover:bg-white/90 transition-colors">
              Reservar Ahora
            </button>
          </div>

          {/* Mobile description */}
          <p className="md:hidden text-center mt-2 text-sm opacity-90">
            {currentPromo.description}
          </p>
        </div>
      </div>

      {/* Dismiss */}
      {dismissible && (
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Progress bar */}
      {autoRotate && promotions.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </section>
  )
}
