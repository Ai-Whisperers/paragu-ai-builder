/**
 * ANNOTATION: MobileCta
 * 
 * What it is: A fixed bottom-of-screen CTA bar visible on mobile devices that shows a prominent WhatsApp link, encouraging visitors to message your business directly.
 * 
 * Why your business needs it: Keeps your WhatsApp contact accessible without scrolling — mobile visitors can message you from any page with one tap, removing barriers to conversion.
 * 
 * What AI populates from your data: ParaguAI fills your WhatsApp number automatically from business configuration.
 * 
 * Your input: WhatsApp business phone number.
 * 
 * Plan availability: All plans
 */
"use client"

import { waLink } from "@/lib/config/config"
import { isFeatureEnabled } from "@/lib/features"

interface MobileCtaProps {
  lang?: "es" | "en"
  serviceName?: string
  minPrice?: number
}

export function MobileCta({ lang = "es", serviceName, minPrice }: MobileCtaProps) {
  const defaultMsg = lang === "es"
    ? "Hola! Quiero informarme sobre sus servicios."
    : "Hi! I want to learn about your services."
  const serviceMsg = serviceName
    ? (lang === "es"
      ? `Hola! Me interesa el servicio: ${serviceName}`
      : `Hi! I'm interested in the service: ${serviceName}`)
    : defaultMsg

  const href = waLink(serviceMsg)

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white p-3 shadow-lg md:hidden">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-lg bg-[#0F1624] px-6 py-3 font-semibold text-white transition-all hover:bg-[#3A4A5D] active:scale-[0.98]"
        >
          {minPrice && minPrice > 0 && (
            <span className="text-xs opacity-80">Desde Gs. {minPrice.toLocaleString("es-PY")}</span>
          )}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z"/><path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z"/><path d="M9.5 13.5c.5 1 1.5 1.5 2.5 1.5s2-.5 2.5-1.5"/></svg>
          {serviceName
            ? (lang === "es" ? "Reservar por WhatsApp" : "Book via WhatsApp")
            : (lang === "es" ? "Consultar por WhatsApp" : "Message on WhatsApp")}
        </a>
      </div>

      {isFeatureEnabled("mobileCtaDesktop", lang) && (
        <div className="hidden md:flex fixed bottom-6 right-6 z-40">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-full bg-[#0F1624] px-5 py-3 shadow-xl font-semibold text-white transition-all hover:bg-[#3A4A5D] active:scale-[0.98]"
          >
            {minPrice && minPrice > 0 && (
              <span className="text-xs opacity-80">Desde Gs. {minPrice.toLocaleString("es-PY")}</span>
            )}
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            {serviceName
              ? (lang === "es" ? "Reservar" : "Book")
              : (lang === "es" ? "Escribir" : "Message")}
          </a>
        </div>
      )}
    </>
  )
}
