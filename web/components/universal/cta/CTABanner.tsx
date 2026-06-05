/**
 * ANNOTATION: CTABanner
 *
 * What it is: Full-width call-to-action banner section with a headline, subtext, and two CTA buttons — one for WhatsApp booking and one for Instagram.
 *
 * Why your business needs it: After visitors have read your content, this section pushes them to take the most important action — usually booking or contacting via WhatsApp.
 *
 * What AI populates from your data: Content from content/es/cta.json and content/en/cta.json.
 *
 * Your input: Let ParaguAI know your primary CTA goal during setup.
 *
 * Plan availability: All plans
 */

/**
 * @component CtaBanner
 * @description Full-width CTA section with dark gradient background, headline, subtext, and two CTA buttons for WhatsApp booking and Instagram link.
 * @featureFlags core
 * @requires siteConfig from @/lib/config, WhatsApp business number
 * @implementation Static section with hardcoded CTA text, WhatsApp pre-filled message template
 */

import { MessageCircle, ArrowRight } from "lucide-react"
import { siteConfig } from "@/lib/config/config"

interface CtaBannerProps {
  waPhone: string
  message: string
}

export function CtaBanner({ waPhone, message }: CtaBannerProps) {
  const waLink = `https://wa.me/${waPhone}?text=${message}`

  return (
    <section className="py-20 bg-gradient-to-r from-secondary via-secondary to-secondary-dark relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: "radial-gradient(circle at 3px 3px, white 1px, transparent 0)",
        backgroundSize: "28px 28px"
      }} />

      <div className="container-page relative z-10 text-center">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
          ¿Lista para tu próximo look?
        </h2>
        <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10">
          Reservá tu turno por WhatsApp en segundos. Te respondemos rápido y coordinamos el mejor horario para vos.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-secondary font-bold px-10 py-5 rounded-2xl text-lg hover:bg-white/95 hover:scale-105 transition-all shadow-2xl"
          >
            <MessageCircle className="w-6 h-6" />
            Reservar por WhatsApp
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href={`https://instagram.com/${siteConfig.business?.instagramHandle?.replace('@','') || 'tu_emprendimiento'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-2 border-white/40 text-white px-8 py-5 rounded-2xl font-semibold hover:bg-white/10 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Ver trabajos en Instagram
          </a>
        </div>
      </div>
    </section>
  )
}