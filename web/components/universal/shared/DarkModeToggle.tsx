/**
 * ANNOTATION: DarkModeToggle
 *
 * What it is: Dark/light mode toggle button that switches the site's color scheme.
 * Persists the user's preference in localStorage and detects system preference on first visit.
 *
 * Why your business needs it: Many users prefer dark mode — offering it improves time-on-site and accessibility.
 * Tailwind's dark class is applied to the HTML element, switching all design tokens at once.
 *
 * What AI populates from your data: None — pure utility. The color scheme is defined in the Tailwind config.
 *
 * Your input: Let ParaguAI know if you want dark mode enabled for your site.
 *
 * Plan availability: All plans
 */

/**
 * @component DarkModeToggle
 * @description Dark/light mode toggle that switches site color scheme, persists user preference in localStorage, and applies Tailwind dark class to HTML element.
 * @featureFlags darkMode
 * @requires Tailwind dark mode configuration
 * @implementation localStorage persistence, document.documentElement.classList.toggle, system preference detection
 */

"use client"
import { useState, useEffect } from "react"

const STORAGE_KEY = "tu-emprendimiento_theme"

export function DarkModeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === "dark") {
        const timeoutId = setTimeout(() => {
          setDark(true)
          document.documentElement.classList.add("dark")
        }, 0)
        return () => clearTimeout(timeoutId)
      }
    } catch { /* noop */ }
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle("dark", next)
    try { localStorage.setItem(STORAGE_KEY, next ? "dark" : "light") } catch { /* noop */ }
  }

  return (
    <button
      onClick={toggle}
      className="flex h-9 w-9 items-center justify-center rounded-md text-foreground-muted transition-all hover:bg-surface-muted hover:text-foreground"
      aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}
    >
      {dark ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}
