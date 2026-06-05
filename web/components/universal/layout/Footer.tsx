/**
 * ANNOTATION: Footer
 *
 * What it is: Site-wide footer with business contact info, hours, social links, and navigation links.
 * Bilingual Spanish/English based on the lang param.
 *
 * Why your business needs it: Footer is where visitors go when they're lost or want to verify business legitimacy.
 * It should have your address, phone, hours, and links to key pages.
 *
 * What AI populates from your data: Business info from content/es/site.json and content/en/site.json.
 *
 * Your input: Send ParaguAI your business address, phone, hours, and social media handles via WhatsApp.
 *
 * Plan availability: All plans
 */

/**
 * @component Footer
 * @description Site-wide footer with contact info (address, phone, hours), social links, navigation links, and copyright notice. Supports bilingual es/en.
 * @featureFlags core
 * @requires siteConfig, getSiteConfig, formatHours from @/lib/config
 * @implementation Grid layout with four columns, waLink for WhatsApp contact, dynamic year for copyright
 */

import Link from "next/link"
import { MapPin, Phone, Clock } from "lucide-react"
import { getSiteConfig, formatHours, getSiteName } from "@/lib/config/config"

interface FooterProps {
  lang?: "es" | "en"
}

export function Footer({ lang = "es" }: FooterProps) {
  const site = getSiteConfig(lang)
  const b = site.business
  const waMsg = encodeURIComponent(b?.whatsappMessage || "Hola! Quiero más información")
  const waLink = b?.whatsapp ? `https://wa.me/${b.whatsapp}?text=${waMsg}` : "#"
  const hours = site.openingHours ? formatHours(site.openingHours) : "Lun-Sáb: 9:00 - 20:00"

  return (
    <footer className="bg-primary py-12 text-white">
      <div className="container-page">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mb-3 text-lg font-bold">{site.site?.name || getSiteName()}</h3>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/60">Enlaces</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link href={`/${lang}`} className="text-white/80 hover:text-white transition-colors">Inicio</Link>
              <Link href={`/${lang}/servicios`} className="text-white/80 hover:text-white transition-colors">Servicios</Link>
              <Link href={`/${lang}/nosotros`} className="text-white/80 hover:text-white transition-colors">Nosotros</Link>
              <Link href={`/${lang}/faq`} className="text-white/80 hover:text-white transition-colors">FAQ</Link>
              <Link href={`/${lang}/blog`} className="text-white/80 hover:text-white transition-colors">Blog</Link>
              <Link href={`/${lang}/contacto`} className="text-white/80 hover:text-white transition-colors">Contacto</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/60">Legales</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link href={`/${lang}/privacidad`} className="text-white/80 hover:text-white transition-colors">Privacidad</Link>
              <Link href={`/${lang}/terminos`} className="text-white/80 hover:text-white transition-colors">Términos</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/60">Contacto</h4>
            <div className="text-sm text-white/80 space-y-2">
              {b?.address && <p className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0" />{b.address}</p>}
              {b?.phone && <p className="flex items-center gap-2"><Phone className="w-4 h-4 shrink-0" />{b.phone}</p>}
              <p className="flex items-center gap-2"><Clock className="w-4 h-4 shrink-0" />{hours}</p>
              {b?.whatsapp && (
                <a href={waLink} target="_blank" rel="noopener noreferrer"
                  className="inline-block mt-2 text-secondary hover:text-secondary-dark transition-colors font-medium">
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/20 pt-6 text-center text-xs text-white/50">
          © {new Date().getFullYear()} {site.site?.name || getSiteName()}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
