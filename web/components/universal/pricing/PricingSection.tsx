"use client"

import { useState } from "react"
import pricingData from "@/content/_shared/pricing.json"
import { Check } from "lucide-react"

interface PricingTier {
  name: string
  monthlyPrice: number
  annualPrice: number
  highlight: boolean
  ctaLabel: string
  description: string
}

interface PricingData {
  tiers: PricingTier[]
  moneyBackDays: number
  billingToggle: {
    monthly: string
    annual: string
    annualSave: string
  }
}

function formatGs(amount: number): string {
  return new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace("PYG", "Gs.")
}

export function PricingSection({ lang = "es" }: { lang?: "es" | "en" }) {
  const [isAnnual, setIsAnnual] = useState(false)
  const data = pricingData as PricingData
  const { tiers, moneyBackDays, billingToggle } = data

  return (
    <section className="py-20 bg-surface" id="pricing">
      <div className="container-page">
        <div className="text-center mb-12">
          <span className="inline-block text-sm font-bold text-secondary uppercase tracking-widest mb-4">
            {lang === "es" ? "Planes y Precios" : "Plans & Pricing"}
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
            {lang === "es" ? "Elegí tu Plan" : "Choose Your Plan"}
          </h2>
          <p className="text-foreground-light max-w-xl mx-auto text-lg">
            {lang === "es" ? "Sin contratos. Cancela cuando quieras. Garantía de devolución." : "No contracts. Cancel anytime. Money-back guarantee."}
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm font-medium ${!isAnnual ? "text-primary" : "text-muted-foreground"}`}>{billingToggle.monthly}</span>
          <button onClick={() => setIsAnnual(!isAnnual)} className={`relative w-14 h-7 rounded-full transition-colors ${isAnnual ? "bg-primary" : "bg-gray-300"}`} aria-label="Toggle billing">
            <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${isAnnual ? "translate-x-8" : "translate-x-1"}`} />
          </button>
          <span className={`text-sm font-medium ${isAnnual ? "text-primary" : "text-muted-foreground"}`}>{billingToggle.annual}</span>
          {isAnnual && <span className="text-xs font-semibold text-white bg-secondary px-2 py-1 rounded-full">{billingToggle.annualSave}</span>}
        </div>

        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 text-sm text-foreground-light">
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            {lang === "es" ? `Garantía de devolución de ${moneyBackDays} días` : `${moneyBackDays}-day money-back guarantee`}
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div key={tier.name} className={`relative rounded-2xl p-8 transition-all ${tier.highlight ? "bg-white border-2 border-primary shadow-xl scale-105" : "bg-white border border-gray-200 shadow-md hover:shadow-lg"}`}>
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full">{lang === "es" ? "Mas Popular" : "Most Popular"}</span>
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="font-heading text-xl font-bold text-primary mb-2">{tier.name}</h3>
                <p className="text-sm text-foreground-light">{tier.description}</p>
              </div>
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-primary">{formatGs(isAnnual ? tier.annualPrice / 12 : tier.monthlyPrice)}</span>
                  <span className="text-sm text-foreground-light">{lang === "es" ? "/mes" : "/month"}</span>
                </div>
                {isAnnual && <p className="text-xs text-foreground-light mt-1">{formatGs(tier.annualPrice)} {lang === "es" ? "por año" : "per year"}</p>}
              </div>
              <a href="#" className={`block text-center font-semibold py-3 px-6 rounded-xl transition-all ${tier.highlight ? "bg-primary text-white hover:bg-primary/90" : "bg-secondary text-white hover:bg-secondary/90"}`}>{tier.ctaLabel}</a>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-foreground-light"><Check className="w-4 h-4 text-green-500 flex-shrink-0" /><span>{lang === "es" ? "Pagina web profesional" : "Professional website"}</span></li>
                  <li className="flex items-center gap-2 text-sm text-foreground-light"><Check className="w-4 h-4 text-green-500 flex-shrink-0" /><span>WhatsApp Business</span></li>
                  <li className="flex items-center gap-2 text-sm text-foreground-light"><Check className="w-4 h-4 text-green-500 flex-shrink-0" /><span>SEO {lang === "es" ? "basico" : "basic"}</span></li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}