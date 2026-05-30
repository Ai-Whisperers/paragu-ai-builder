"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

export interface PromoItem {
  /**
   * Optional badge text (e.g., "NUEVO", "-30%")
   */
  badge?: string
  /**
   * Main title
   */
  title: string
  /**
   * Optional subtitle
   */
  subtitle?: string
}

export interface PromoCarouselProps {
  /**
   * Array of promotions
   */
  promotions: PromoItem[]
  /**
   * Auto-rotation interval in ms (default: 5000)
   */
  interval?: number
  /**
   * Current locale (for routing)
   */
  lang?: string
  /**
   * URL for "View offers" link (default: `/${lang}/ofertas`)
   */
  offersHref?: string
  /**
   * Label for "View offers" button
   */
  viewOffersLabel?: string
  /**
   * Emoji icons to cycle through (default: ["🎉", "✨", "🔥", "💅", "🌟"])
   */
  icons?: string[]
}

export function PromoCarousel({
  promotions,
  interval = 5000,
  lang = "es",
  offersHref,
  viewOffersLabel,
  icons = ["🎉", "✨", "🔥", "💅", "🌟"],
}: PromoCarouselProps) {
  const [idx, setIdx] = useState(0)
  const len = promotions.length

  useEffect(() => {
    if (len < 2) return
    const timer = setInterval(() => setIdx((i) => (i + 1) % len), interval)
    return () => clearInterval(timer)
  }, [len, interval])

  if (len === 0) return null

  const promo = promotions[idx]
  const label = viewOffersLabel ?? (lang === "en" ? "View offers" : "Ver ofertas")
  const href = offersHref ?? `/${lang}/ofertas`

  return (
    <div className="bg-primary/5 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xl shrink-0">{icons[idx % icons.length]}</span>
          <div className="min-w-0">
            {promo.badge && (
              <span className="bg-secondary/10 text-secondary text-[10px] font-bold px-2 py-0.5 rounded-full mr-1.5 align-middle">
                {promo.badge}
              </span>
            )}
            <span className="text-sm font-medium text-foreground align-middle">{promo.title}</span>
            {promo.subtitle && (
              <span className="hidden sm:inline text-xs text-foreground-muted ml-2 align-middle">
                {promo.subtitle}
              </span>
            )}
          </div>
        </div>
        <Link
          href={href}
          className="text-xs font-semibold text-secondary hover:underline shrink-0 whitespace-nowrap"
        >
          {label} →
        </Link>
      </div>
      {len > 1 && (
        <div className="flex justify-center gap-1 pb-1">
          {promotions.map((_: unknown, i: number) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? "w-4 bg-secondary" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}