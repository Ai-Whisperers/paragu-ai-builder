"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export interface BottomNavItem {
  label: string
  href: string
  /**
   * SVG path string for the icon
   */
  icon: string
  /**
   * Whether this is an external link (opens in new tab)
   */
  isExternal?: boolean
}

export interface BottomNavProps {
  /**
   * Current locale (for routing)
   */
  lang?: string
  /**
   * Navigation items
   */
  items: BottomNavItem[]
  /**
   * Routes to hide the bottom nav on (e.g., "/admin")
   */
  hiddenRoutes?: string[]
}

export function BottomNav({
  lang = "es",
  items,
  hiddenRoutes = ["/admin"],
}: BottomNavProps) {
  const pathname = usePathname()

  if (hiddenRoutes.some(route => pathname?.startsWith(route))) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white md:hidden safe-area-bottom">
      <div className="flex items-center justify-around py-1">
        {items.map((item) => {
          const isActive = item.href === `/${lang}`
            ? pathname === `/${lang}`
            : pathname?.startsWith(item.href) ?? false
          const El = item.isExternal ? "a" : Link
          return (
            <El
              key={item.label}
              href={item.href}
              {...(item.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                isActive ? "text-secondary" : "text-foreground-muted"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
              </svg>
              <span className="text-[10px] font-medium">{item.label}</span>
            </El>
          )
        })}
      </div>
    </nav>
  )
}