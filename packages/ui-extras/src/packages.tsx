"use client"
import { Scissors, Palette, Sparkles, CheckCircle, Gift } from "lucide-react"

export interface PackageItem {
  name: string
  originalPrice: string
  packagePrice: string
  badge: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  services: string[]
}

export interface PackagesProps {
  /**
   * Array of packages to display
   */
  packages: PackageItem[]
  /**
   * WhatsApp number for booking
   */
  whatsapp: string
  /**
   * Section title (default: "Combos Especiales")
   */
  title?: string
  /**
   * Section subtitle (default: "Servicios combinados con descuento. Ahorrá en tu tratamiento completo.")
   */
  subtitle?: string
  /**
   * Button text (default: "Consultar pack")
   */
  actionText?: string
  /**
   * Message template for WhatsApp (receives package name)
   */
  whatsappMessageTemplate?: (pkgName: string) => string
}

export function Packages({
  packages,
  whatsapp,
  title = "Combos Especiales",
  subtitle = "Servicios combinados con descuento. Ahorrá en tu tratamiento completo.",
  actionText = "Consultar pack",
  whatsappMessageTemplate = (pkgName: string) => `Hola! Quiero el pack: ${pkgName}`,
}: PackagesProps) {
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

  return (
    <div className="py-16 bg-background">
      <div className="container-page">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-secondary uppercase tracking-widest mb-3">
            <Gift className="w-4 h-4" /> Packs
          </span>
          <h2 className="font-heading text-3xl font-bold text-primary">{title}</h2>
          <p className="text-foreground-light text-sm mt-2 max-w-lg mx-auto">{subtitle}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {packages.map((pkg, idx) => {
            const Icon = pkg.icon
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
                    href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(whatsappMessageTemplate(pkg.name))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-secondary text-white font-semibold text-sm px-4 py-3 rounded-xl hover:bg-secondary-dark transition-colors"
                  >
                    {actionText}
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Example usage:
// import { Packages } from "@ai-whisperers/ui-extras"
//
// const PACKAGES = [
//   {
//     name: "Pack Color + Protección",
//     originalPrice: "Gs. 490.000",
//     packagePrice: "Gs. 420.000",
//     badge: "Ahorrás Gs. 70.000",
//     icon: Palette,
//     color: "rose",
//     services: ["Coloración completa", "Corte de cabello", "Tratamiento capilar hidratante"],
//   },
//   // ... more packages
// ]
//
// <Packages
//   packages={PACKAGES}
//   whatsapp="595972000000"
//   whatsappMessageTemplate={(pkgName) => `Hola! Quiero el pack: ${pkgName}`}
// />