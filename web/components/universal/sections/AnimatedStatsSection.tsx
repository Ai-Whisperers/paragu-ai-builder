/**
 * @component AnimatedStats
 * @description Animated number counter that displays key business metrics (years in business, client count, services, Google rating) with count-up animation triggered on scroll intersection.
 * @featureFlags core
 * @requires statsData from @/lib/config
 * @implementation Uses IntersectionObserver for scroll-triggered activation, requestAnimationFrame for smooth count-up easing with ease-out-quad curve
 */


/**
 * ANNOTATION: AnimatedStats
 *
 * What it is: A row of headline numbers (years in business, clients served,
 * Google rating, services completed) that count up when scrolled into view.
 *
 * Why your business needs it: Numbers create instant credibility. "10+ years,
 * 3,500+ clients, 4.9★" communicates trust faster than any paragraph. The
 * count-up animation draws the eye and makes the stats feel alive.
 *
 * What AI populates from your data: AI pulls real numbers from your Google
 * Business Profile (rating, review count) and your input (years, clients),
 * and picks the most impressive metrics to feature.
 *
 * Your input: Years in business + approximate client count (Google data auto-pulled).
 *
 * Plan availability: All plans.
 */
"use client"
import { useEffect, useRef, useState } from "react"
import { statsData } from "@/lib/config/config"

interface StatItem {
  value: string
  label: string
  suffix?: string
}

function useCountUp(target: number, duration = 1500, isActive: boolean) {
  const [count, setCount] = useState(target) // SSR-safe: start at final value
  const frameRef = useRef(0)
  const startRef = useRef(0)

  useEffect(() => {
    if (!isActive) {
      const timeoutId = setTimeout(() => setCount(target), 0)
      return () => clearTimeout(timeoutId)
    }
    startRef.current = Date.now()
    const tick = () => {
      const elapsed = Date.now() - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress)
      setCount(Math.round(eased * target))
      if (progress < 1) frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [isActive, target, duration])

  return count
}

function AnimateOnce({ value, label, suffix = "" }: { value: string; label: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const numeric = parseInt(value.replace(/\D/g, ""), 10)
  const isAnimatable = !isNaN(numeric) && value.match(/^\d[\d,.]*$/)
  const displayNum = useCountUp(numeric, 1500, active)
  const isFloat = value.includes(".")

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.unobserve(el) } },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (!isAnimatable) {
    return (
      <div className="text-center">
        <div className="font-heading text-4xl md:text-5xl font-bold text-primary">{value}</div>
        <div className="text-sm font-medium text-foreground-light mt-1">{label}</div>
      </div>
    )
  }

  const prefix = value.match(/^\D+/)?.[0] ?? ""
  const suffix_match = suffix || (isFloat ? "" : "+")

  const finalValue = isFloat
    ? (displayNum / 10).toFixed(1)
    : displayNum.toLocaleString("es-PY")

  return (
    <div ref={ref} className="text-center">
      <div className="font-heading text-4xl md:text-5xl font-bold text-primary">
        {prefix}{finalValue}{suffix_match}
      </div>
      <div className="text-sm font-medium text-foreground-light mt-1">{label}</div>
    </div>
  )
}

interface AnimatedStatsProps {
  lang?: "es" | "en"
}

const STATS_LABELS: Record<string, Record<string, string>> = {
  es: { customers: "Clientas felices", years: "Años de experiencia", services: "Servicios", rating: "Calificación" },
  en: { customers: "Happy clients", years: "Years of experience", services: "Services", rating: "Rating" },
}

interface StatEntry { value: string; label: string }

export function AnimatedStats({ lang = "es" }: AnimatedStatsProps) {
  const rawStats = statsData(lang)
  const labels = STATS_LABELS[lang] ?? STATS_LABELS.es
  const rawEntries = Array.isArray(rawStats) ? rawStats : Object.entries(rawStats).map(([key, value]) => ({ value: String(value), label: labels[key] ?? key }))
  const entries = rawEntries as StatEntry[]
  const stats: StatItem[] = entries.map((s) => ({
    value: s.value,
    label: s.label,
    suffix: s.value.includes("★") ? "★" : s.value.match(/\d/) ? "+" : "",
  }))

  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <AnimateOnce key={i} value={s.value} label={s.label} suffix={s.suffix} />
          ))}
        </div>
      </div>
    </section>
  )
}
