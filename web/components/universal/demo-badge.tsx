/**
 * Floating "DEMO" ribbon shown on tenant pages where `site.is_demo` is true.
 * Clear visual + text signal so prospects don't mistake demo content for a
 * real client. Click takes them to /demo (the qualifier flow) so the
 * recognition is also a conversion path.
 *
 * Renders nothing when `isDemo` is false — zero JS payload for real tenants.
 *
 * Sized + positioned to sit clear of the floating WhatsApp button (bottom-right)
 * by anchoring top-right.
 */
import Link from 'next/link'

export type DemoBadgeProps = {
  isDemo?: boolean
  /**
   * Optional rubro slug to pre-fill on the demo qualifier
   * (e.g. "peluqueria" → /demo?v=peluqueria).
   */
  vertical?: string
}

export function DemoBadge({ isDemo = false, vertical }: DemoBadgeProps) {
  if (!isDemo) return null
  const href = vertical ? `/demo?v=${encodeURIComponent(vertical)}` : '/demo'
  return (
    <Link
      href={href}
      aria-label="Este es un sitio de demostración. Pedí el tuyo en 48 horas."
      className="fixed right-4 top-4 z-50 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50/95 px-4 py-2 text-xs font-bold uppercase tracking-wider text-amber-800 shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-amber-100 sm:right-6 sm:top-6 sm:px-5 sm:py-2.5 sm:text-sm"
    >
      <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-500" aria-hidden />
      Demo · pedí el tuyo
    </Link>
  )
}
