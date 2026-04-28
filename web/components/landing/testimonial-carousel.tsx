'use client'

import { useEffect, useState } from 'react'
import { Quote, Star } from 'lucide-react'

export interface Testimonial {
  quote: string
  name: string
  business: string
  location: string
  rating: number
}

/**
 * Auto-rotating testimonial carousel (5s interval) with dot navigation.
 * Extracted from app/page.tsx. Accepts testimonials as a prop so it's
 * reusable beyond the landing page.
 */
export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (testimonials.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  if (testimonials.length === 0) return null

  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="overflow-hidden rounded-3xl border border-border bg-surface p-8 md:p-12">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="transition-all duration-500"
            style={{
              display: i === current ? 'block' : 'none',
              opacity: i === current ? 1 : 0,
              transform: i === current ? 'translateX(0)' : 'translateX(20px)',
            }}
          >
            <Quote size={48} className="mb-6 text-primary/20" />
            <p className="mb-8 text-2xl font-medium italic text-foreground md:text-3xl">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-lg font-bold text-[var(--primary-foreground)]">
                {t.name[0]}
              </div>
              <div>
                <p className="font-bold text-foreground">{t.name}</p>
                <p className="text-sm text-muted-foreground">
                  {t.business} • {t.location}
                </p>
              </div>
              <div className="ml-auto flex gap-1">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    size={16}
                    className={j < t.rating ? 'fill-amber-400 text-amber-400' : 'text-[var(--border)]'}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Ir al testimonio ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === current ? 'w-8 bg-primary' : 'w-2 bg-border'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
