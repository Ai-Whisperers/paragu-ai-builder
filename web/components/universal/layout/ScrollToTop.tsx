/**
 * ANNOTATION: ScrollToTop
 * 
 * What it is: A utility component that automatically scrolls the page to the top whenever the route (pathname) changes. Uses Next.js usePathname to detect navigation.
 * 
 * Why your business needs it: Ensures visitors land at the top of each new page after navigation, preventing the disorienting experience of starting mid-page.
 * 
 * What AI populates from your data: ParaguAI includes this in the root layout — no configuration needed.
 * 
 * Your input: Nothing — works automatically with route changes.
 * 
 * Plan availability: All plans
 */
"use client"
import { useEffect } from "react"
import { usePathname } from "next/navigation"

/**
 * Forces scroll to top on every route change.
 * Next.js App Router sometimes restores scroll position from bfcache
 * or sessionStorage, landing the user mid-page instead of at the top.
 *
 * Two layers of defense:
 * 1. Disable browser's native scroll restoration
 * 2. Explicit scrollTo on route change + pageshow (bfcache restore)
 */
export function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // Kill browser's auto-restore so it doesn't fight React
    if (typeof window !== "undefined" && window.history.scrollRestoration !== "manual") {
      window.history.scrollRestoration = "manual"
    }

    // Scroll on mount and route change
    window.scrollTo(0, 0)
  }, [pathname])

  // Also catch bfcache restores (back/forward without a network request)
  useEffect(() => {
    const onPageShow = () => window.scrollTo(0, 0)
    window.addEventListener("pageshow", onPageShow)
    return () => window.removeEventListener("pageshow", onPageShow)
  }, [])

  return null
}
