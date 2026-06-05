/**
 * ANNOTATION: Breadcrumb
 *
 * What it is: Navigation trail showing current page position — Home > Section > Page.
 * Auto-generated from the URL pathname, with bilingual labels (Spanish/English).
 *
 * Why your business needs it: Helps visitors orient themselves and navigate back to parent sections.
 * Also improves SEO by reinforcing site structure.
 *
 * What AI populates from your data: Route labels — bilingual static map for known routes.
 * New routes added by AI get appropriate labels automatically.
 *
 * Your input: Nothing — works automatically based on URL structure.
 *
 * Plan availability: All plans
 */

/**
 * @component Breadcrumb
 * @description Dynamic breadcrumb navigation trail generated from URL pathname segments with Home icon and clickable links for each parent section.
 * @featureFlags core
 * @requires Next.js usePathname
 * @implementation Segment parsing from pathname, static label map for known route segments (es/en bilingual)
 */

"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

export function Breadcrumb({ lang = "es" }: { lang?: "es" | "en" }) {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length < 2) return null

  const labels: Record<string, Record<string, string>> = {
    es: {
      servicios: "Servicios",
      nosotros: "Nosotros",
      booking: "Reservar",
      faq: "Preguntas Frecuentes",
      contacto: "Contacto",
      terminos: "Términos y Condiciones",
      privacidad: "Política de Privacidad",
    },
    en: {
      servicios: "Services",
      nosotros: "About Us",
      booking: "Book Now",
      faq: "FAQ",
      contacto: "Contact",
      terminos: "Terms of Service",
      privacidad: "Privacy Policy",
    },
  }

  const langLabels = labels[lang] ?? labels.es

  const crumbs = [
    { label: lang === "es" ? "Inicio" : "Home", href: `/${lang}` },
    ...segments.slice(1).map((seg, i) => ({
      label: langLabels[seg] ?? seg,
      href: `/${segments.slice(0, i + 2).join("/")}`,
    })),
  ]

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-foreground-muted py-4 container-page">
      <Link href={`/${lang}`} className="hover:text-secondary transition-colors">
        <Home className="w-4 h-4" />
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          <ChevronRight className="w-3 h-3" />
          {i === crumbs.length - 1 ? (
            <span className="text-foreground font-medium">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-secondary transition-colors">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}