/**
 * ANNOTATION: BottomNav
 *
 * What it is: Fixed bottom navigation bar for mobile visitors with 5 icon tabs: Home, Services, Booking, Account, WhatsApp.
 * Hidden on admin routes. Shows active state for current route.
 *
 * Why your business needs it: Mobile visitors need quick access to key actions — especially WhatsApp contact and booking.
 * This persistent nav keeps those actions always one tap away on mobile.
 *
 * What AI populates from your data:
 *   - WhatsApp link from business.whatsapp in content/es/site.json
 *   - Labels bilingual based on lang param
 *
 * Your input: Nothing — works automatically.
 *
 * Plan availability: All plans
 */

/**
 * @component BottomNav
 * @description Fixed bottom mobile navigation bar with icon tabs for Home, Services, Booking, Account, and WhatsApp. Hidden on /admin routes.
 * @featureFlags core
 * @requires business.whatsapp from @/lib/config, Next.js usePathname
 * @implementation CSS fixed positioning, external link detection for WhatsApp URL, active route highlighting
 */

"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { business } from "@/lib/config/config"

export function BottomNav({ lang = "es" }: { lang?: "es" | "en" }) {
  const pathname = usePathname()
  if (pathname?.startsWith("/admin")) return null

  const labels = lang === "en"
    ? { home: "Home", services: "Services", booking: "Book", account: "Account", whatsapp: "WhatsApp" }
    : { home: "Inicio", services: "Servicios", booking: "Reservar", account: "Mi Cuenta", whatsapp: "WhatsApp" }

  const items = [
    { label: labels.home, href: `/${lang}`, icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1m-6 0h6" },
    { label: labels.services, href: `/${lang}/servicios`, icon: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" },
    { label: labels.booking, href: `/${lang}/booking`, icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" },
    { label: labels.account, href: `/${lang}/mi-cuenta`, icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" },
    { label: labels.whatsapp, href: `https://wa.me/${business.whatsapp}?text=${encodeURIComponent("Hola! Quiero información sobre servicios")}`, icon: "M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white md:hidden safe-area-bottom">
      <div className="flex items-center justify-around py-1">
        {items.map((item) => {
          const isActive = item.href === `/${lang}`
            ? pathname === `/${lang}`
            : pathname?.startsWith(item.href) ?? false
          const isExternal = item.href.startsWith("http")
          const El = isExternal ? "a" : Link
          return (
            <El
              key={item.label}
              href={item.href}
              {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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
