"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ScrollToTopProps extends React.HTMLAttributes<HTMLButtonElement> {
  threshold?: number
  smooth?: boolean
}

export function ScrollToTop({
  className,
  threshold = 300,
  smooth = true,
  ...props
}: ScrollToTopProps) {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > threshold) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [threshold])

  const scrollToTop = () => {
    if (smooth) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    } else {
      window.scrollTo({
        top: 0,
      })
    }
  }

  if (!isVisible) return null

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-6 right-6 z-50 p-3 rounded-full bg-[var(--secondary)] text-white shadow-lg hover:bg-[var(--secondary)]/90 transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] focus:ring-offset-2",
        className
      )}
      aria-label="Scroll to top"
      {...props}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  )
}
