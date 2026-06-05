/**
 * ANNOTATION: Promotions
 *
 * What it is: A grid of promotional offer cards with urgency badges (expiry dates, limited spots), each linking to a pre-filled WhatsApp CTA. Also includes a loyalty program teaser and gift cards section.
 *
 * Why your business needs it: Urgency and scarcity are the two strongest triggers for immediate action. Promotions with time limits convert at 4x the rate of static pricing pages. The gift card and loyalty teasers cross-sell without interrupting the promotion flow.
 *
 * What AI populates from your data: ParaguAI generates promotional copy from your business goals (e.g., "fill slow days," "promote new service") and suggests realistic expiry logic based on your content and service frequency.
 *
 * Your input: Tell ParaguAI your business goal for this month (e.g., "promote keratin treatment in July") via WhatsApp. AI drafts the offer.
 *
 * Plan availability: Crecimiento, Profesional
 */

"use client"
import { useState, useEffect } from "react"
import { TrendingUp, Gift, Star, Clock } from "lucide-react"
import { promotions, loyalty, giftCards, waLink, getSiteName, formatGs } from "@/lib/config/config"
import type { Lang } from "@/lib/config/config"
import { ScrollReveal } from "@/components/shared/scroll-reveal"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>

const GIFT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  sparkle: Star,
  star: Star,
  crown: Star,
  heart: Star,
}
const GIFT_GRADIENTS = [
  "from-rose-400 to-rose-600",
  "from-violet-400 to-violet-600",
  "from-amber-400 to-amber-600",
  "from-sky-400 to-sky-600",
]

function getTimeRemaining(expiresAt: string): { days: number; hours: number; minutes: number; seconds: number; expired: boolean } {
  const total = new Date(expiresAt).getTime() - Date.now()
  if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  const seconds = Math.floor((total / 1000) % 60)
  const minutes = Math.floor((total / 1000 / 60) % 60)
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
  const days = Math.floor(total / (1000 * 60 * 60 * 24))
  return { days, hours, minutes, seconds, expired: false }
}

function CountdownTimer({ expiresAt }: { expiresAt: string }) {
  const [time, setTime] = useState(() => getTimeRemaining(expiresAt))

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeRemaining(expiresAt))
    }, 1000)
    return () => clearInterval(interval)
  }, [expiresAt])

  if (time.expired) {
    return <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">Expirada</span>
  }

  const parts = []
  if (time.days > 0) parts.push(`${time.days}d`)
  if (time.hours > 0 || time.days > 0) parts.push(`${time.hours}h`)
  if (time.minutes > 0 || time.hours > 0 || time.days > 0) parts.push(`${time.minutes}m`)
  parts.push(`${time.seconds}s`)

  return (
    <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full font-medium">
      <Clock className="w-3 h-3" />
      {parts.join(" ")}
    </span>
  )
}

interface PromotionsProps { lang: Lang }
export function Promotions({ lang }: PromotionsProps) {
  const l = {
    es: { header: "Promociones", sub: "Ofertas exclusivas para vos", cta: "Aprovechar oferta", expires: "Vence:", gift: "Tarjetas de Regalo", giftSub: "Regalá bienestar" },
    en: { header: "Promotions", sub: "Exclusive offers for you", cta: "Claim this offer", expires: "Expires:", gift: "Gift Cards", giftSub: "Give the gift of self-care" },
  }[lang] ?? { header: "Promociones", sub: "Ofertas exclusivas para vos", cta: "Aprovechar oferta", expires: "Vence:", gift: "Tarjetas de Regalo", giftSub: "Regalá bienestar" }

  if (!promotions?.length) return null

  return (
    <section className="py-20 bg-surface-muted">
      <div className="container-page">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-secondary uppercase tracking-widest mb-3">
            <TrendingUp className="w-4 h-4" /> {l.header}
          </span>
          <h2 className="font-heading text-4xl font-bold text-primary mb-3">{l.sub}</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promo, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                {promo.badge && (
                  <span className="inline-block bg-secondary/10 text-secondary text-xs font-bold px-3 py-1 rounded-full mb-3">{promo.badge}</span>
                )}
                <h3 className="font-heading text-xl font-bold text-primary mb-2">{promo.title}</h3>
                <p className="text-sm text-foreground-light mb-4">{promo.subtitle}</p>
                {promo.expires ? (
                  <div className="flex items-center justify-between">
                    <CountdownTimer expiresAt={promo.expires} />
                    <span className="text-xs text-foreground-muted">
                      {l.expires} {new Date(promo.expires).toLocaleDateString("es-PY")}
                    </span>
                  </div>
                ) : null}
                <div className="mt-4">
                  {getTimeRemaining(promo.expires || "").expired && promo.expires ? (
                    <span className="block text-center bg-gray-200 text-gray-500 px-6 py-3 rounded-full font-semibold cursor-not-allowed">
                      Expirada
                    </span>
                  ) : (
                    <a href={waLink(promo.waMessage || `Hola! Quiero saber más sobre ${promo.title}`)}
                      target="_blank" rel="noopener noreferrer"
                      className="block text-center bg-secondary text-white px-6 py-3 rounded-full font-semibold hover:bg-secondary-dark transition-colors">
                      {l.cta}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gift Cards teaser */}
        {giftCards?.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center">
              <Gift className="w-7 h-7 text-secondary" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-heading text-2xl font-bold text-primary mb-1">{l.gift}</h3>
              <p className="text-foreground-light">{l.giftSub}</p>
            </div>
            <a href={waLink(lang === "en" ? "Hi! I want to buy a gift card" : "Hola! Quiero comprar una tarjeta de regalo")}
              target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 bg-secondary text-white px-8 py-3 rounded-full font-semibold hover:bg-secondary-dark transition-colors">
              {lang === "en" ? "Buy Gift Card" : "Ver opciones"}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

interface LoyaltySectionProps { lang: Lang }
export function LoyaltySection({ lang }: LoyaltySectionProps) {
  const l = {
    es: { header: "Programa de Lealtad", sub: "Cada turno te acerca a recompensas", cta: "Empezar a Acumular" },
    en: { header: "Loyalty Program", sub: "Every visit gets you closer to rewards", cta: "Start Earning" },
  }[lang] ?? { header: "Programa de Lealtad", sub: "Cada turno te acerca a recompensas", cta: "Empezar a Acumular" }

  const loyaltySteps = (loyalty as Record<string, unknown>)?.steps as unknown[] | undefined
  if (!loyaltySteps?.length) return null

  return (
    <section className="py-20 bg-primary text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <ScrollReveal direction="up">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-secondary uppercase tracking-widest mb-3">
              <Star className="w-4 h-4" /> {l.header}
            </span>
            <h2 className="font-heading text-4xl font-bold mb-3">{(loyalty as Record<string, unknown>).title as string}</h2>
            <p className="text-white/70 max-w-lg mx-auto">{(loyalty as Record<string, unknown>).subtitle as string}</p>
          </div>
        </ScrollReveal>

        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-4">
          {((loyalty as Record<string, unknown>).steps as AnyRecord[] || []).map((step: AnyRecord, i: number) => (
            <div key={i} className="flex flex-col items-center text-center relative">
              <div className="w-14 h-14 rounded-full bg-secondary/10 text-secondary flex items-center justify-center border-2 border-secondary z-10 mb-4">
                {(() => { const Icon = [Gift, Star, Clock, TrendingUp][i % 4]; return Icon ? <Icon className="w-6 h-6" /> : null })()}
              </div>
              <h4 className="font-semibold text-sm text-primary mb-1">{step.after as string}</h4>
              <p className="text-xs text-foreground-light max-w-[140px]">{step.reward as string}</p>
              {!isLast(((loyalty as Record<string, unknown>).steps as AnyRecord[] || []).length, i) && (
                <div className="hidden md:block absolute top-7 left-[55%] right-0 h-0.5 bg-gradient-to-r from-secondary to-primary/30 -translate-y-full mb-14" />
              )}
              <div className="w-14 h-14 rounded-full bg-secondary/10 text-secondary flex items-center justify-center border-2 border-secondary z-10 mb-4">
                <Star className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-sm text-white mb-1">{step.after}</h4>
              <p className="text-xs text-white/60 max-w-[140px]">{step.reward}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <a href={waLink(lang === "en" ? "Hi! I want to join the rewards program" : `Hola! Quiero enterarme más sobre el Programa ${getSiteName()} Rewards`)}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-secondary text-white font-bold px-10 py-4 rounded-2xl hover:bg-secondary-dark transition-all text-lg">
            <Star className="w-5 h-5" /> {l.cta}
          </a>
          <p className="text-white/50 text-sm mt-3">
            {lang === "en" ? "No cards needed. Just come in and enjoy." : "Sin tarjetas. Solo vení y te mimés."}
          </p>
        </div>
      </div>
    </section>
  )
}

function isLast(len: number, i: number) { return i === len - 1 }

interface GiftCardsSectionProps { lang: Lang }
export function GiftCardsSection({ lang }: GiftCardsSectionProps) {
  const l = {
    es: { header: "Tarjetas de Regalo", sub: `Regala un Momento ${getSiteName()}`, cta: "Comprar" },
    en: { header: "Gift Cards", sub: "Give the gift of self-care", cta: "Buy" },
  }[lang] ?? { header: "Tarjetas de Regalo", sub: `Regala un Momento ${getSiteName()}`, cta: "Comprar" }

  if (!giftCards?.length) return null

  return (
    <section className="py-20 bg-surface-muted">
      <div className="max-w-6xl mx-auto px-4">
        <ScrollReveal direction="up">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-secondary uppercase tracking-widest mb-3">
              <Gift className="w-4 h-4" /> {l.header}
            </span>
            <h2 className="font-heading text-4xl font-bold text-primary mb-3">{l.sub}</h2>
            <p className="text-foreground-light max-w-lg mx-auto">
              {lang === "en"
                ? "Perfect for birthdays, Christmas, or just to pamper someone special."
                : "Tarjetas de regalo perfectas para cumpleaños, Navidad o simplemente para mimar a alguien especial."}
            </p>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {giftCards.map((card, i) => {
            const gradient = GIFT_GRADIENTS[i % GIFT_GRADIENTS.length]
            const Icon = card.icon && card.icon in GIFT_ICONS ? GIFT_ICONS[card.icon] : Star
            return (
              <ScrollReveal key={i} delay={i * 80} direction="down">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group flex flex-col">
                  <div className={`h-2 bg-gradient-to-r ${gradient}`} />
                  <div className="p-6 flex flex-col flex-1">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mx-auto mb-4 text-white`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-primary text-center mb-2">{card.name}</h3>
                    <p className="text-sm text-foreground-light text-center mb-4 flex-1">{card.desc}</p>
                    <div className="flex items-center justify-center mb-5">
                      <span className="font-heading text-3xl font-bold text-primary">{formatGs(card.price)}</span>
                    </div>
                    <a href={waLink(`Hola! Quiero comprar una Tarjeta de Regalo: ${card.name} - ${card.price}`)}
                      target="_blank" rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 font-bold py-3 rounded-xl text-sm transition-all bg-secondary text-white hover:bg-secondary-dark">
                      <Gift className="w-4 h-4" /> {l.cta}
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}