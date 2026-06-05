/**
 * ANNOTATION: ScrollReveal
 * 
 * What it is: An IntersectionObserver-based scroll animation wrapper that fades child elements in when they become visible in the viewport, creating smooth entrance animations.
 * 
 * Why your business needs it: Adds professional, polished scroll-triggered animations that make your site feel dynamic and engaging without slowing down performance.
 * 
 * What AI populates from your data: ParaguAI wraps content sections with this component — no data configuration needed.
 * 
 * Your input: Nothing — works automatically; configurable delay and direction props available.
 * 
 * Plan availability: All plans
 */
"use client"
import { useEffect, useRef, useState } from "react"

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: "up" | "left" | "right" | "down" | "none"
}

export function ScrollReveal({ children, className = "", delay = 0, direction = "up" }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el) } },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const transforms: Record<string, string> = {
    up: "translate-y-8",
    down: "-translate-y-8",
    left: "-translate-x-8",
    right: "translate-x-8",
    none: "",
  }

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${visible ? "opacity-100" : "opacity-0"} ${visible ? `translate-0` : transforms[direction]}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  )
}
