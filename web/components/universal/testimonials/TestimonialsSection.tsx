/**
 * ANNOTATION: Testimonials
 *
 * What it is: A horizontal scrolling card carousel showing client reviews with star ratings, service badges, and Google rating pill.
 *
 * Why your business needs it: Social proof is the #1 conversion factor for service businesses. Seeing that others trust you reduces risk for new clients — they are 3x more likely to book after reading reviews.
 *
 * What AI populates from your data: ParaguAI drafts testimonials from Google review excerpts, WhatsApp thank-you messages, or photos of handwritten notes you share. Stars and sentiment are auto-detected.
 *
 * Your input: Forward Google review links or WhatsApp screenshots with customer praise during onboarding.
 *
 * Plan availability: All plans (Prueba, Presencia, Crecimiento, Profesional)
 */

/**
 * ANNOTATION: Testimonials
 *
 * What it is: A customer-review section with star ratings, quotes, client
 * names, and the service they used. Displayed as a carousel or grid.
 *
 * Why your business needs it: Social proof is the #1 conversion factor for
 * service businesses. A visitor who sees 5 real 5-star reviews is ~3x more
 * likely to contact you. Testimonials answer the "has anyone actually used
 * this?" objection that silently kills leads.
 *
 * What AI populates from your data: AI drafts testimonials from your Google
 * Business reviews, WhatsApp thank-you messages, or notes you send. It detects
 * the service mentioned and assigns the star rating. You approve each before
 * it goes live.
 *
 * Your input: Forward us screenshots of reviews/thank-yous, or paste your
 * Google Business Profile link.
 *
 * Plan availability: All plans.
 */
"use client"
import { useState, useRef } from "react"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { testimonials, siteConfig, getColorMap, type ColorName } from "@/lib/config/config"
import { ScrollReveal } from "@/components/shared/scroll-reveal"

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  )
}

function TestimonialCard({
  t,
  index,
}: {
  t: (typeof testimonials)[number]
  index: number
}) {
  const { bg, text, light } = getColorMap((t.color as ColorName) || undefined)
  const initials = t.initials || t.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "?"

  return (
    <div
      className="flex-shrink-0 w-[300px] md:w-[340px] bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6 flex flex-col gap-4"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Service badge + stars */}
      <div className="flex items-center justify-between">
        <span className={`text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${light} ${text}`}>
          {t.service}
        </span>
        <StarRating rating={t.stars ?? 5} />
      </div>

      {/* Quote */}
      <blockquote className="flex-1 relative">
        <Quote className="absolute -top-1 -left-1 w-4 h-4 text-secondary/20" />
        <p className="text-sm text-foreground leading-relaxed pl-4">{t.quote}</p>
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${bg} ${text} ${light}`}>
          {initials}
        </div>
        <div>
          <p className="font-semibold text-sm text-foreground">{t.name}</p>
          <p className="text-xs text-foreground-light">Clienta verificada</p>
        </div>
      </div>
    </div>
  )
}

export function Testimonials() {
  const [active, setActive] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const CARD_WIDTH = 340 + 20 // card width + gap

  const scrollToCard = (index: number) => {
    trackRef.current?.scrollTo({ left: index * CARD_WIDTH, behavior: 'smooth' })
  }

  const prev = () => {
    const newActive = (active - 1 + testimonials.length) % testimonials.length
    setActive(newActive)
    scrollToCard(newActive)
  }
  const next = () => {
    const newActive = (active + 1) % testimonials.length
    setActive(newActive)
    scrollToCard(newActive)
  }

  return (
    <section className="py-20 bg-surface-muted">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-secondary uppercase tracking-widest mb-3">
              <Star className="w-4 h-4 fill-secondary text-secondary" />
              Lo que dicen nuestras clientas
            </span>
            <h2 className="font-heading text-4xl font-bold text-primary mb-3">
              Testimonios Reales
            </h2>
            <p className="text-foreground-light max-w-xl mx-auto">
              Más de 100 clientas nos recomiendan. Estas son opiniones reales verificadas.
            </p>
          </div>
        </ScrollReveal>

        {/* Google rating pill */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100">
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-bold text-sm text-foreground">4.9</span>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(n => (
                <Star key={n} className={`w-3.5 h-3.5 ${n <= 4 ? "fill-yellow-400 text-yellow-400" : ""}`} />
              ))}
            </div>
            <span className="text-xs text-foreground-light">+100 opiniones en Google</span>
          </div>
        </div>

        {/* Carousel */}
        <div
          className="relative"
        >
          {/* Fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-surface-muted to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-surface-muted to-transparent z-10 pointer-events-none" />

          {/* Track */}
          <div
            ref={trackRef}
            className="flex gap-5 overflow-x-auto scroll-smooth scrollbar-hide pb-2 px-6"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`transition-all duration-300 ${i === active ? "scale-100 opacity-100" : "scale-95 opacity-60"}`}
              >
                <TestimonialCard t={t} index={i} />
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-secondary hover:text-white hover:border-secondary transition-all shadow-sm"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setActive(i); scrollToCard(i) }}
                  className={`rounded-full transition-all ${i === active ? "w-6 h-2 bg-secondary" : "w-2 h-2 bg-gray-300 hover:bg-secondary/50"}`}
                  aria-label={`Ir a testimonio ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-secondary hover:text-white hover:border-secondary transition-all shadow-sm"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CTA strip */}
        <div className="text-center mt-10">
          <p className="text-sm text-foreground-light mb-3">¿Ya nos visitaste? Dejá tu opinión en Google</p>
          <a
            href={`https://g.page/${siteConfig.site?.slug || 'tu-emprendimiento'}-asuncion/review`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:underline"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Dejar mi opinion en Google
          </a>
        </div>

        <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}</style>
      </div>
    </section>
  )
}
