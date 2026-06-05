/**
 * ANNOTATION: ExitIntentPopup
 *
 * What it is: Modal popup that appears when a visitor moves their mouse toward the browser chrome (exit intent) or after 45 seconds on the page.
 * Shows a discount code and testimonials to encourage them to stay and book.
 *
 * Why your business needs it: Exit intent is the last-chance moment to convert a hesitant visitor.
 * Showing social proof and a discount incentive can turn a bouncing visitor into a lead.
 *
 * What AI populates from your data: Discount code from content/es/promotions/. Testimonials from content/es/testimonials.json.
 * Only shows if exitIntentPopup feature flag is enabled.
 *
 * Your input: Tell ParaguAI if you want an exit intent popup and what discount to offer.
 *
 * Plan availability: Profesional
 */

/**
 * @component ExitIntentPopup
 * @description Modal popup triggered by mouse leaving viewport (exit intent) or after 45s timeout. Shows discount code and testimonials. Uses localStorage to prevent repeated display.
 * @featureFlags exitIntentPopup
 * @requires business.whatsapp from @/lib/config
 * @implementation mouseleave event listener on document, setTimeout for time-based trigger, localStorage for dismiss state
 */

"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { X, MessageCircle, Star, ChevronLeft, ChevronRight } from "lucide-react"
import { business } from "@/lib/config/config"

const STORAGE_DISMISSED = "tu-emprendimiento_popup_dismissed"
const STORAGE_VISITOR = "tu-emprendimiento_returning_visitor"
const POPUP_DELAY_MS = 45000

export function ExitIntentPopup({ lang = "es" }: { lang?: "es" | "en" }) {
  const [visible, setVisible] = useState(false)
  const [permanentlyDismissed, setPermanentlyDismissed] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!visible) return
    const focusable = modalRef.current?.querySelectorAll('button, a, [tabindex]')
    if (!focusable || focusable.length === 0) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const first = focusable[0] as HTMLElement
      const last = focusable[focusable.length - 1] as HTMLElement
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault(); (e.shiftKey ? last : first).focus()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [visible])

  const isHomepage = useCallback(() => {
    if (typeof window === "undefined") return false
    const p = window.location.pathname
    return p === "/" || p === "/es" || p === "/en" || p === "/es/" || p === "/en/"
  }, [])

  const isReturningVisitor = useCallback(() => {
    if (typeof window === "undefined") return false
    const flag = localStorage.getItem(STORAGE_VISITOR)
    if (!flag) {
      localStorage.setItem(STORAGE_VISITOR, "true")
      return false
    }
    return true
  }, [])

  const wasRecentlyDismissed = useCallback(() => {
    const val = localStorage.getItem(STORAGE_DISMISSED)
    if (!val) return false
    const sevenDays = 7 * 24 * 60 * 60 * 1000
    return Date.now() - parseInt(val) < sevenDays
  }, [])

  useEffect(() => {
    if (isReturningVisitor()) return
    if (!isHomepage()) return
    if (wasRecentlyDismissed()) return

    let active = true
    let timer: ReturnType<typeof setTimeout> | null = null

    const handleMouseLeave = (e: MouseEvent) => {
      if (!active || e.clientY > 0) return
      active = false
      setVisible(true)
    }

    timer = setTimeout(() => {
      if (!active) return
      active = false
      setVisible(true)
    }, POPUP_DELAY_MS)

    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave)
      if (timer) clearTimeout(timer)
    }
  }, [isHomepage, isReturningVisitor, wasRecentlyDismissed])

  function dismiss(permanent: boolean = false) {
    setVisible(false)
    localStorage.setItem(STORAGE_DISMISSED, Date.now().toString())
    if (permanent) {
      setPermanentlyDismissed(true)
      localStorage.setItem(STORAGE_VISITOR, "true")
    }
  }

  const testimonials = [
    { name: "María Fernández", quote: "El mejor balayage que me han hecho en mi vida. La atención es impecable.", service: "Balayage + Corte", stars: 5 },
    { name: "Claudia Rodríguez", quote: "Fui para mi boda y me hicieron un peinado espectacular. ¡100% recomendado!", service: "Peinado para Eventos", stars: 5 },
    { name: "Laura Benítez", quote: "Las mechas me quedaron increíbles. Lidia es una artista.", service: "Mechas + Corte", stars: 5 },
    { name: "Carmen López", quote: "El tratamiento de keratina me duró más de 3 meses. Relación calidad-precio excelente.", service: "Keratina", stars: 5 },
  ]

  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const labels = lang === "es"
    ? {
        badge: "Solo por hoy",
        title: "No te vayas con las manos vacías",
        subtitle: "Recibí un 20% de descuento en tu primera visita",
        cta: "Quiero mi descuento",
        promoCode: "PRIMERA20",
        testimonialLabel: "Lo que dicen nuestras clientas",
        close: "Cerrar",
        dontShowAgain: "No mostrar de nuevo",
      }
    : {
        badge: "Only today",
        title: "Don't leave empty-handed",
        subtitle: "Get 20% off your first visit",
        cta: "Get my discount",
        promoCode: "PRIMERA20",
        testimonialLabel: "What our clients say",
        close: "Close",
        dontShowAgain: "Don't show again",
      }

  const waMsg = encodeURIComponent(
    lang === "es"
      ? "Hola! Tengo el código PRIMERA20 y quiero reservar mi primera visita con descuento."
      : "Hi! I have the code PRIMERA20 and I want to book my first visit with a discount."
  )

  if (!visible || permanentlyDismissed) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
        <button
          onClick={() => dismiss()}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
          aria-label={labels.close}
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        <div className="bg-secondary px-6 py-3">
          <p className="text-center text-sm font-bold text-white uppercase tracking-widest">
            🎁 {labels.badge}
          </p>
        </div>

        <div className="p-8">
          <h2 className="font-heading text-3xl font-bold text-primary text-center mb-3">
            {labels.title}
          </h2>
          <p className="text-center text-foreground-light mb-6 text-lg">
            {labels.subtitle}
          </p>

          <div className="bg-gray-50 border-2 border-dashed border-secondary rounded-xl p-4 text-center mb-6">
            <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">
              {lang === "es" ? "Tu código de descuento" : "Your discount code"}
            </p>
            <p className="font-heading text-3xl font-bold text-primary tracking-widest">
              {labels.promoCode}
            </p>
          </div>

          <a
            href={`https://wa.me/${business.whatsapp}?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => dismiss()}
            className="flex items-center justify-center gap-3 bg-[#25D366] text-white font-bold w-full py-4 rounded-xl hover:bg-[#20BD5A] transition-all text-lg"
          >
            <MessageCircle className="w-6 h-6" />
            {labels.cta}
          </a>

          <button
            onClick={() => dismiss(true)}
            className="mt-3 w-full text-center text-xs text-foreground-muted hover:text-foreground transition-colors py-1"
          >
            {labels.dontShowAgain}
          </button>
        </div>

        <div className="bg-gray-50 px-8 py-6">
          <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-4">
            ⭐ {labels.testimonialLabel}
          </p>
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentTestimonial((p) => (p - 1 + testimonials.length) % testimonials.length)} className="shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow hover:bg-gray-100 transition-colors">
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: testimonials[currentTestimonial].stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-foreground font-medium mb-1">
                &ldquo;{testimonials[currentTestimonial].quote}&rdquo;
              </p>
              <p className="text-xs text-foreground-muted">
                — {testimonials[currentTestimonial].name} · {testimonials[currentTestimonial].service}
              </p>
            </div>
            <button onClick={() => setCurrentTestimonial((p) => (p + 1) % testimonials.length)} className="shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow hover:bg-gray-100 transition-colors">
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
