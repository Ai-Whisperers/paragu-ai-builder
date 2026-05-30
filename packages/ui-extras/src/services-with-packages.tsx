"use client"
import { useState } from "react"
import { Scissors, Palette, Sparkles, Clock, ChevronDown, CheckCircle } from "lucide-react"

export interface ServiceItem {
  name: string
  desc: string
  price: string
  duration: string
  popular?: boolean
}

export interface ServiceCategory {
  name: string
  icon: "scissors" | "palette" | "sparkles" | "sparkle"
  color: string
  items: ServiceItem[]
}

export interface ServicesWithPackagesProps {
  /**
   * Service categories
   */
  services: ServiceCategory[]
  /**
   * Packages to display (optional)
   */
  packages?: {
    name: string
    originalPrice: string
    packagePrice: string
    badge: string
    color: string
    services: string[]
  }[]
  /**
   * WhatsApp number for booking
   */
  whatsapp: string
  /**
   * Language (default: "es")
   */
  lang?: "es" | "en"
  /**
   * WhatsApp message template for services
   */
  serviceMessageTemplate?: (serviceName: string) => string
  /**
   * WhatsApp message template for packages
   */
  packageMessageTemplate?: (packageName: string) => string
}

export function ServicesWithPackages({
  services,
  packages,
  whatsapp,
  lang = "es",
  serviceMessageTemplate = (serviceName: string) => `Hola! Quiero información sobre ${serviceName}`,
  packageMessageTemplate = (packageName: string) => `Hola! Quiero el pack: ${packageName}`,
}: ServicesWithPackagesProps) {
  const [openCat, setOpenCat] = useState<string | null>(null)

  const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    scissors: Scissors,
    palette: Palette,
    sparkles: Sparkles,
    sparkle: Sparkles,
  }

  const getColorMap = (color: string) => {
    const maps: Record<string, { bg: string; text: string; light: string }> = {
      rose: { bg: "bg-rose-500", text: "text-rose-600", light: "from-rose-50" },
      violet: { bg: "bg-violet-500", text: "text-violet-600", light: "from-violet-50" },
      amber: { bg: "bg-amber-500", text: "text-amber-600", light: "from-amber-50" },
      green: { bg: "bg-green-500", text: "text-green-600", light: "from-green-50" },
      blue: { bg: "bg-blue-500", text: "text-blue-600", light: "from-blue-50" },
    }
    return maps[color] ?? maps.rose
  }

  const labels = {
    es: { header: "Servicios", sub: "Servicios profesionales con productos de alta gama. Cada tratamiento incluye diagnóstico personalizado.", book: "Reservar", packagesTitle: "Combos Especiales", packagesSub: "Servicios combinados con descuento. Ahorrá en tu tratamiento completo.", consultPack: "Consultar pack", morePopular: "Más popular" },
    en: { header: "Services", sub: "Professional services with premium products. Every treatment includes a personalized diagnosis.", book: "Book", packagesTitle: "Special Combos", packagesSub: "Combined services with discount. Save on your complete treatment.", consultPack: "Consult pack", morePopular: "Most popular" },
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
            const Icon = ICON_MAP[cat.icon] ?? Sparkles
            return (
              <button
                key={cat.name}
                onClick={() => setOpenCat(openCat === cat.name ? null : cat.name)}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all ${
                  openCat === cat.name || openCat === null
                    ? "bg-primary text-white shadow"
                    : "bg-white text-foreground border border-gray-200 hover:border-primary/30"
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.name}
                {cat.items.some(i => i.popular) && (
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                )}
              </button>
            )
          })}
        </div>

        {/* Service list */}
        <div className="space-y-4">
          {services.filter(c => openCat === null || c.name === openCat).map(cat => {
            const Icon = ICON_MAP[cat.icon] ?? Sparkles
            const colors = getColorMap(cat.color)
            return (
              <div key={cat.name} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className={`flex items-center gap-3 px-6 py-4 bg-gradient-to-r ${colors.light} to-white border-b border-gray-100`}>
                  <div className={`w-10 h-10 rounded-xl ${colors.bg}/10 flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-primary flex-1">{cat.name}</h3>
                  <button onClick={() => setOpenCat(openCat === cat.name ? null : cat.name)}
                    className="text-foreground-muted hover:text-foreground transition-colors p-1">
                    <ChevronDown className={`w-5 h-5 transition-transform ${openCat === cat.name ? "rotate-180" : ""}`} />
                  </button>
                </div>

                <div className="divide-y divide-gray-50">
                  {cat.items.map((svc, si) => (
                    <div key={si} className="px-6 py-5 hover:bg-gray-50/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-foreground">{svc.name}</h4>
                            {svc.popular && (
                              <span className="bg-secondary/10 text-secondary text-xs font-bold px-2 py-0.5 rounded-full">{l.morePopular}</span>
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
                          <span className="font-bold text-primary text-lg whitespace-nowrap">{svc.price}</span>
                          <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(serviceMessageTemplate(svc.name))}`} target="_blank" rel="noopener noreferrer"
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

        {/* Packages Section */}
        {packages && packages.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-secondary uppercase tracking-widest mb-3">
                💎 Packs
              </span>
              <h2 className="font-heading text-3xl font-bold text-primary">{l.packagesTitle}</h2>
              <p className="text-foreground-light text-sm mt-2 max-w-lg mx-auto">{l.packagesSub}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
              {packages.map((pkg, idx) => {
                const colors = getColorMap(pkg.color)
                return (
                  <div key={idx} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow relative flex flex-col">
                    {/* Badge */}
                    <div className={`absolute top-3 right-3 ${colors.bg} text-white text-[10px] font-bold px-2.5 py-1 rounded-full`}>
                      {pkg.badge}
                    </div>
                    {/* Header */}
                    <div className={`px-6 pt-6 pb-4 bg-gradient-to-br ${colors.light} to-white`}>
                      <div className={`w-12 h-12 rounded-xl ${colors.bg}/10 flex items-center justify-center mb-3`}>
                        <span className={`text-2xl ${colors.text}`}>🎁</span>
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
                        href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(packageMessageTemplate(pkg.name))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center bg-secondary text-white font-semibold text-sm px-4 py-3 rounded-xl hover:bg-secondary-dark transition-colors"
                      >
                        {l.consultPack}
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}