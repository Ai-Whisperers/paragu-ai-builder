/**
 * ANNOTATION: ServicesSection
 * 
 * What it is: A categorized service listing with expandable accordion cards —
 * service name, description, duration, price, and a WhatsApp booking button.
 * Also includes "Combos" (bundled service packages with discount pricing).
 * 
 * Why your business needs it: Visitors who reach your services page are already
 * interested. They need to see what you offer, how much it costs, and how long
 * it takes — WITHOUT having to call you. Each service card is a micro-conversion
 * point. The "Combos" section anchors perceived value ("Gs. 70,000 off!")
 * 
 * What AI populates from your data (via WhatsApp at onboarding):
 *   - Service names, descriptions, prices: Send us your service list.
 *     AI writes professional descriptions from 1-line inputs.
 *   - Duration estimates: AI sets realistic durations based on service type.
 *   - Popular badge: AI detects your most-requested service.
 *   - Combo packages: AI generates "Xs + Y for Z% off" bundles from your list.
 * 
 * Your input: A WhatsApp message with "here's what we offer" — even rough
 * bullet points. AI drafts the polished version for your review.
 * 
 * Plan availability: All plans. Displayed as a grid (Prueba/Presencia) or
 * full accordion (Crecimiento/Profesional).
 */
"use client"
import { useState } from "react"
import { Scissors, Palette, Sparkles, Sparkle, Clock, ChevronDown, CheckCircle, Gift, Percent } from "lucide-react"
import { services, waLinkForService, getColorMap, ColorName, waLink, formatGs } from "@/lib/config/config"
import type { Lang } from "@/lib/config/config"

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  scissors: Scissors,
  palette: Palette,
  sparkles: Sparkles,
  sparkle: Sparkle,
}

const PACKAGES = [
  {
    name: "Pack Color + Protección",
    originalPrice: "Gs. 490.000",
    packagePrice: "Gs. 420.000",
    badge: "Ahorrás Gs. 70.000",
    icon: Palette,
    color: "rose",
    services: ["Coloración completa", "Corte de cabello", "Tratamiento capilar hidratante"],
  },
  {
    name: "Pack Novia Completo",
    originalPrice: "Gs. 650.000",
    packagePrice: "Gs. 550.000",
    badge: "Pack especial",
    icon: Gift,
    color: "violet",
    services: ["Balayage o coloración", "Corte personalizado", "Peinado para evento", "Maquillaje social"],
  },
  {
    name: "Pack Keratina + Corte",
    originalPrice: "Gs. 450.000",
    packagePrice: "Gs. 380.000",
    badge: "Más popular",
    icon: Percent,
    color: "amber",
    services: ["Tratamiento de keratina", "Corte dama", "Blow-dry profesional"],
  },
]

interface ServicesProps {
  lang: Lang
}

export function Services({ lang }: ServicesProps) {
  const [openCat, setOpenCat] = useState<string | null>(null)

  const labels = {
    es: { header: "Servicios", sub: "Servicios profesionales con productos de alta gama. Cada tratamiento incluye diagnóstico personalizado.", book: "Reservar" },
    en: { header: "Services", sub: "Professional services with premium products. Every treatment includes a personalized diagnosis.", book: "Book" },
  }
  const l = labels[lang] ?? labels.es

  return (
    <section className="py-20 bg-background" id="servicios">
      <div className="container-page">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-secondary uppercase tracking-widest mb-4">
            <Sparkles className="w-4 h-4" /> {l.header}
          </span>
          <h2 className="font-heading text-4xl font-bold text-primary mb-4">Nuestros Servicios</h2>
          <p className="text-foreground-light max-w-xl mx-auto">{l.sub}</p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {services.map(cat => {
            const Icon = ICON_MAP[String(cat.icon)] ?? Sparkles
            return (
              <button
                key={cat.title}
                onClick={() => setOpenCat(openCat === cat.title ? null : cat.title)}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all ${
                  openCat === cat.title || openCat === null
                    ? "bg-primary text-white shadow"
                    : "bg-white text-foreground border border-gray-200 hover:border-primary/30"
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.title}
                {cat.items?.some(i => i.popular) && (
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                )}
              </button>
            )
          })}
        </div>

        {/* Service list */}
        <div className="space-y-4">
          {services.filter(c => openCat === null || c.title === openCat).map(cat => {
            const Icon = ICON_MAP[String(cat.icon)] ?? Sparkles
            const colors = getColorMap(String(cat.color) as ColorName)
            return (
              <div key={cat.title} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className={`flex items-center gap-3 px-6 py-4 bg-gradient-to-r ${colors.light} to-white border-b border-gray-100`}>
                  <div className={`w-10 h-10 rounded-xl ${colors.bg}/10 flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-primary flex-1">{cat.title}</h3>
                  <button onClick={() => setOpenCat(openCat === cat.title ? null : cat.title)}
                    className="text-foreground-muted hover:text-foreground transition-colors p-1">
                    <ChevronDown className={`w-5 h-5 transition-transform ${openCat === cat.title ? "rotate-180" : ""}`} />
                  </button>
                </div>

                <div className="divide-y divide-gray-50">
                  {cat.items.map((svc: {name?: string; desc?: string; duration?: string | number; popular?: boolean; price?: number}, si: number) => (
                    <div key={si} className="px-6 py-5 hover:bg-gray-50/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-foreground">{svc.name}</h4>
                            {svc.popular && (
                              <span className="bg-secondary/10 text-secondary text-xs font-bold px-2 py-0.5 rounded-full">Más popular</span>
                            )}
                          </div>
                          <p className="text-sm text-foreground-light leading-relaxed">{svc.desc}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-foreground-muted">
                            <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                              <Clock className="w-3 h-3" /> {svc.duration}
                            </span>
                          </div>
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end gap-3">
                          <span className="font-bold text-primary text-lg whitespace-nowrap">{formatGs(svc.price)}</span>
                          <a href={waLinkForService(svc.name ?? "", "Hola! Quiero reservar")} target="_blank" rel="noopener noreferrer"
                            className="text-xs bg-secondary text-white px-4 py-2 rounded-full font-semibold hover:bg-secondary-dark transition-colors whitespace-nowrap">
                            {l.book}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── PACKS / COMBOS ──────────────────────────────── */}
      <div className="mt-16 mb-8">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-secondary uppercase tracking-widest mb-3">
            <Gift className="w-4 h-4" /> Packs
          </span>
          <h2 className="font-heading text-3xl font-bold text-primary">Combos Especiales</h2>
          <p className="text-foreground-light text-sm mt-2 max-w-lg mx-auto">
            Servicios combinados con descuento. Ahorrá en tu tratamiento completo.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {PACKAGES.map((pkg, idx) => {
            const Icon = pkg.icon
            const colors = getColorMap(pkg.color as ColorName)
            return (
              <div key={idx} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow relative flex flex-col">
                {/* Badge */}
                <div className={`absolute top-3 right-3 ${colors.bg} text-white text-[10px] font-bold px-2.5 py-1 rounded-full`}>
                  {pkg.badge}
                </div>
                {/* Header */}
                <div className={`px-6 pt-6 pb-4 bg-gradient-to-br ${colors.light} to-white`}>
                  <div className={`w-12 h-12 rounded-xl ${colors.bg}/10 flex items-center justify-center mb-3`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-primary">{pkg.name}</h3>
                </div>
                {/* Body */}
                <div className="px-6 py-4 flex-1">
                  <ul className="space-y-2.5">
                    {pkg.services.map((s, si) => (
                      <li key={si} className="flex items-start gap-2 text-sm text-foreground-light">
                        <CheckCircle className={`w-4 h-4 ${colors.text} shrink-0 mt-0.5`} />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Footer */}
                <div className="px-6 pb-6 pt-2">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-foreground-muted line-through">{pkg.originalPrice}</span>
                    <span className="text-xl font-bold text-primary">{pkg.packagePrice}</span>
                  </div>
                  <a
                    href={waLink(`Hola! Quiero el pack: ${pkg.name}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-secondary text-white font-semibold text-sm px-4 py-3 rounded-xl hover:bg-secondary-dark transition-colors"
                  >
                    Consultar pack
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}