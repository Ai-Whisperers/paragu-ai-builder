/**
 * @component GiftCardsSection
 * @description Gift card purchase grid with Stripe online payment and WhatsApp checkout fallback. Shows 4 preset denomination cards and custom value CTA.
 * @featureFlags giftCards
 * @requires giftCards, waLink, siteConfig from @/lib/config, Stripe API
 * @implementation POST to /api/gift-card, wa.me fallback, Stripe Checkout session redirect
 */


"use client"
import { useState } from "react"
import { giftCards, waLink, getSiteName } from "@/lib/config/config"
import { ScrollReveal } from "@/components/shared/scroll-reveal"
import { Sparkle, Star, Crown, Heart, Gift, Loader2, CreditCard } from "lucide-react"

const ICON_NAMES = ["sparkle", "star", "crown", "heart"]
const COLORS = [
  "from-rose-400 to-rose-600",
  "from-violet-400 to-violet-600",
  "from-amber-400 to-amber-600",
  "from-sky-400 to-sky-600",
]

function GiftCard({ card, index }: { card: (typeof giftCards)[number]; index: number }) {
  const [loading, setLoading] = useState(false)
  const gradient = COLORS[index % COLORS.length]
  const iconName = ICON_NAMES[index % ICON_NAMES.length]
  const icons: Record<string, React.ReactNode> = {
    sparkle: <Sparkle className="w-7 h-7" />,
    star: <Star className="w-7 h-7" />,
    crown: <Crown className="w-7 h-7" />,
    heart: <Heart className="w-7 h-7" />,
  }

  async function handleStripe() {
    setLoading(true)
    try {
      const res = await fetch("/api/gift-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: card.price, card_name: card.title }),
      })
      const data = await res.json()
      if (data.waFallback) {
        window.open(data.url, "_blank")
      } else if (data.url) {
        window.location.href = data.url
      } else {
        window.open(waLink(`Hola! Quiero comprar una Tarjeta de Regalo: ${card.title} - ${card.price}`), "_blank")
      }
    } catch {
      window.open(waLink(`Hola! Quiero comprar una Tarjeta de Regalo: ${card.title}`), "_blank")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollReveal delay={index * 80} direction="down">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group flex flex-col">
        <div className={`h-2 bg-gradient-to-r ${gradient}`} />
        <div className="p-6 flex flex-col flex-1">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mx-auto mb-4 text-white`}>
            {icons[iconName]}
          </div>
          <h3 className="font-heading text-lg font-bold text-primary text-center mb-1">{card.title}</h3>
          <p className="text-sm text-foreground-light text-center mb-1 flex-1">{card.description}</p>
          <div className="flex items-center justify-center mb-4">
            <span className="font-heading text-3xl font-bold text-primary">{card.price}</span>
          </div>
          <button
            onClick={handleStripe}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-all text-sm disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
            {loading ? "Redirigiendo..." : "Pagar con Tarjeta"}
          </button>
          <a
            href={waLink(`Hola! Quiero comprar una Tarjeta de Regalo: ${card.title} - ${card.price}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 w-full inline-flex items-center justify-center gap-2 bg-surface-muted text-foreground-muted font-semibold py-2.5 rounded-xl hover:bg-gray-200 transition-all text-sm"
          >
            <Gift className="w-4 h-4" />
            Pagar por WhatsApp
          </a>
        </div>
      </div>
    </ScrollReveal>
  )
}

export function GiftCardsSection() {
  return (
    <section className="py-20 bg-surface-muted">
      <div className="max-w-6xl mx-auto px-4">
        <ScrollReveal direction="up">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-secondary uppercase tracking-widest mb-3">
              <Gift className="w-4 h-4" /> Tarjetas de Regalo
            </span>
            <h2 className="font-heading text-4xl font-bold text-primary mb-3">Regala un Momento {getSiteName()}</h2>
            <p className="text-foreground-light max-w-lg mx-auto">Tarjetas de regalo perfectas para cumpleaños, Navidad o simplemente para mimar a alguien especial.</p>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {giftCards.map((card, i) => <GiftCard key={i} card={card} index={i} />)}
        </div>
        <div className="text-center mt-10">
          <p className="text-sm text-foreground-light">
            ¿Necesitas un valor personalizado?{" "}
            <a
              href={waLink("Hola! Quiero una tarjeta de regalo con un valor personalizado")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary font-semibold hover:underline"
            >
              Escríbenos por WhatsApp
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
