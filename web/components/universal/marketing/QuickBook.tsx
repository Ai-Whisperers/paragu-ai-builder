/**
 * ANNOTATION: QuickBook
 * 
 * What it is: A floating quick-booking widget with a service selector dropdown that opens WhatsApp pre-filled with the selected service and a booking message. Lets customers book instantly without navigating away.
 * 
 * Why your business needs it: Reduces friction in the booking process — customers pick a service and message you on WhatsApp in two taps, directly increasing conversion rates.
 * 
 * What AI populates from your data: ParaguAI reads your service list from content data to populate the dropdown options automatically.
 * 
 * Your input: Your service/pricing list provided during onboarding.
 * 
 * Plan availability: All plans
 */
"use client"
import { useState, useEffect } from "react"
import { MessageCircle, X } from "lucide-react"
import { services, waLink, business, formatGs } from "@/lib/config/config"
import type { Lang } from "@/lib/config/config"

interface QuickBookProps {
  lang: Lang
}

export function QuickBook({ lang }: QuickBookProps) {
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      const heroH = window.innerHeight * 0.7
      setVisible(scrollY > heroH)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (!visible) return null

  const popularItems = services.flatMap(cat => cat.items).filter(s => s.popular).slice(0, 3)
  const label = lang === "en" ? "Book Now" : "Reservar Ya"
  const quickLabel = lang === "en" ? "Quick Book" : "Reserva Rápida"
  const orLabel = lang === "en" ? "or book directly" : "o reservá directo"

  return (
    <>
      {/* Floating trigger pill */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-24 right-4 z-30 flex items-center gap-2 bg-secondary text-white px-5 py-3 rounded-full font-bold shadow-lg hover:bg-secondary-dark hover:shadow-xl transition-all animate-slide-up"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm">{label}</span>
        </button>
      )}

      {/* Slide-up panel */}
      {open && (
        <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
          <div className="bg-card border-t border-border rounded-t-2xl shadow-2xl p-5 pb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg">{quickLabel}</h3>
              <button onClick={() => setOpen(false)} className="p-1 rounded-full hover:bg-foreground/5 transition-colors">
                <X className="w-5 h-5 text-foreground-muted" />
              </button>
            </div>

            {popularItems.length > 0 && (
              <div className="space-y-2 mb-4">
                {popularItems.map((s, i) => (
                  <a
                    key={i}
                    href={waLink(
                      `Hola! Quiero reservar ${s.name} (${s.price})`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-foreground/5 hover:bg-secondary/10 transition-colors"
                  >
                    <div>
                      <span className="font-medium text-sm">{s.name}</span>
                      <span className="text-xs text-foreground-muted ml-2">{s.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-secondary">{formatGs(s.price)}</span>
                      <MessageCircle className="w-4 h-4 text-secondary" />
                    </div>
                  </a>
                ))}
              </div>
            )}

            <a
              href={waLink(business.whatsappMessage || "")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-secondary text-white py-3.5 rounded-xl font-bold text-base hover:bg-secondary-dark transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              {orLabel}
            </a>
          </div>
        </div>
      )}
    </>
  )
}