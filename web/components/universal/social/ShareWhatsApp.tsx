/**
 * ANNOTATION: ShareWhatsApp
 * 
 * What it is: A "Share via WhatsApp" button component that takes a title and URL as props, opening WhatsApp with a pre-filled message containing your page link.
 * 
 * Why your business needs it: Makes it effortless for visitors to share your business page or promotion with friends and family on WhatsApp, Paraguay's most popular messaging platform.
 * 
 * What AI populates from your data: ParaguAI supplies the current page title and URL automatically; no manual configuration needed.
 * 
 * Your input: Nothing — works automatically with any page it's placed on.
 * 
 * Plan availability: All plans
 */
"use client"
import { business, getSiteName } from "@/lib/config/config"

export function ShareWhatsApp({
  title,
  url,
}: {
  title: string
  url?: string
}) {
  const href = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(`Mirá esto de ${getSiteName()}: ${title}${url ? ` - ${url}` : ""}`)}`
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-foreground-light hover:text-primary hover:bg-primary/5 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      </svg>
      Compartir
    </a>
  )
}
