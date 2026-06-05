/**
 * ANNOTATION: LoyaltySection
 *
 * What it is: A tiered rewards program section showing steps (first visit → 50 pts → 100 pts) with a CTA to join via WhatsApp.
 *
 * Why your business needs it: Repeat clients cost 5x less to serve than new ones. A loyalty program makes clients feel "invested" in coming back — they return 2x more often and spend 15% more per visit on average.
 *
 * What AI populates from your data: ParaguAI recommends reward thresholds (point values and discount tiers) based on your average return client rate and service price points pulled from your content data.
 *
 * Your input: Share your average service price and how often clients typically return (or let AI estimate from industry benchmarks).
 *
 * Plan availability: Crecimiento, Profesional
 */

/**
 * ANNOTATION: LoyaltySection
 *
 * What it is: A section explaining your repeat-client rewards program —
 * points or stamps earned per visit, reward tiers, and how to redeem.
 *
 * Why your business needs it: Repeat clients cost ~5x less to service than
 * acquiring new ones. A loyalty program creates habitual return behavior.
 * Even a simple "1 stamp per visit, 10th free" increases visit frequency by
 * up to 40% in service businesses.
 *
 * What AI populates from your data: AI analyzes your typical client return
 * rate and average ticket to recommend a reward threshold that's generous
 * enough to motivate but profitable for you, then writes the explainer copy.
 *
 * Your input: Tell us your average service price and how often clients return.
 *
 * Plan availability: Crecimiento and Profesional.
 */
"use client"
import { loyaltyTiers, loyaltyIndex, waLink, getSiteName } from "@/lib/config/config"
import { ScrollReveal } from "@/components/shared/scroll-reveal"
import { Gift, Star, Award, Crown } from "lucide-react"

const DEFAULT_STEPS = [
  { after: "Primera visita", reward: "Sumás 10 puntos" },
  { after: "50 puntos", reward: "10% descuento" },
  { after: "100 puntos", reward: "Servicio gratis" },
]

export function LoyaltySection() {
  const loyalty = { ...(loyaltyIndex as Record<string, unknown>), tiers: loyaltyTiers }
  const steps = (loyalty as Record<string, unknown>).steps as typeof DEFAULT_STEPS | undefined
  const displaySteps = steps ?? DEFAULT_STEPS
  const title = (loyalty as Record<string, unknown>).title as string ?? "Programa de Lealtad"
  const description = ((loyalty as Record<string, unknown>).subtitle ?? (loyalty as Record<string, unknown>).description) as string ?? ""

  return (
    <section className="py-20 bg-primary text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <ScrollReveal direction="up">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-secondary uppercase tracking-widest mb-3">
              <Crown className="w-4 h-4" /> Rewards
            </span>
            <h2 className="font-heading text-4xl font-bold mb-3">{title}</h2>
            {description && <p className="text-white/70 max-w-lg mx-auto">{description}</p>}
          </div>
        </ScrollReveal>

        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-4">
          {displaySteps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center relative">
              <div className="w-14 h-14 rounded-full bg-secondary/10 text-secondary flex items-center justify-center border-2 border-secondary z-10 mb-4">
                {(() => { const Icon = [Gift, Star, Award, Crown][i]; return <Icon className="w-6 h-6" /> })()}
              </div>
              <h4 className="font-semibold text-sm text-primary mb-1">{step.after}</h4>
              <p className="text-xs text-foreground-light max-w-[140px]">{step.reward}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <a
            href={waLink(`Hola! Quiero enterarme más sobre el Programa ${getSiteName()} Rewards`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-secondary text-white font-bold px-10 py-4 rounded-2xl hover:bg-secondary-dark transition-all text-lg"
          >
            <Star className="w-5 h-5" /> Empezar a Acumular
          </a>
          <p className="text-white/50 text-sm mt-3">Sin tarjetas. Solo vení y te mimás.</p>
        </div>
      </div>
    </section>
  )
}
