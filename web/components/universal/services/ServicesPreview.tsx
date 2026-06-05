/**
 * ANNOTATION: ServicesPreview
 * 
 * What it is: A grid of service cards displaying icons, descriptions, and a "Ver más" (See more) link to your full services page. Uses ScrollReveal for entrance animations.
 * 
 * Why your business needs it: Shows visitors a quick overview of what you offer on the homepage, helping them understand your value proposition immediately and click through for details.
 * 
 * What AI populates from your data: ParaguAI reads your service list with icons, names, and descriptions from content data and renders each as a card.
 * 
 * Your input: Service names, descriptions, and icon selections provided during onboarding.
 * 
 * Plan availability: All plans
 */
"use client"
import Link from "next/link"
import { Scissors, Palette, Sparkles, Sparkle, ArrowRight } from "lucide-react"
import { services } from "@/lib/config/config"
import type { Lang } from "@/lib/config/config"
import { ScrollReveal } from "@/components/shared/scroll-reveal"

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  scissors: Scissors,
  palette: Palette,
  sparkles: Sparkles,
  sparkle: Sparkle,
}

interface ServicesPreviewProps {
  lang: Lang
}

export function ServicesPreview({ lang }: ServicesPreviewProps) {
  const previewCategories = services.slice(0, 4)
  const labels = {
    es: { header: "Servicios", sub: "Profesionales con productos de alta gama. Conocé todos nuestros servicios.", verTodos: "Ver todos los servicios" },
    en: { header: "Services", sub: "Professional services with premium products. Check out all our services.", verTodos: "View all services" },
  }
  const l = labels[lang] ?? labels.es

  if (!previewCategories.length) return null

  return (
    <section className="py-20 bg-background" id="servicios">
      <div className="container-page">
        <ScrollReveal direction="up">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-secondary uppercase tracking-widest mb-4">
              <Sparkles className="w-4 h-4" /> {l.header}
            </span>
            <h2 className="font-heading text-4xl font-bold text-primary mb-3">Nuestros Servicios</h2>
            <p className="text-foreground-light max-w-xl mx-auto">{l.sub}</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {previewCategories.map((cat, i) => {
            const Icon = ICON_MAP[String(cat.icon)] ?? Sparkles
            const colorNames = ["rose", "violet", "amber", "sky"] as const
            const color = colorNames[i % colorNames.length]
            const gradients = {
              rose: "from-rose-500 to-rose-600",
              violet: "from-violet-500 to-violet-600",
              amber: "from-amber-500 to-amber-600",
              sky: "from-sky-500 to-sky-600",
            }
            const lightBgs = {
              rose: "bg-rose-50",
              violet: "bg-violet-50",
              amber: "bg-amber-50",
              sky: "bg-sky-50",
            }
            const counts = {
              rose: "text-rose-600",
              violet: "text-violet-600",
              amber: "text-amber-600",
              sky: "text-sky-600",
            }
            return (
                <ScrollReveal key={cat.title} delay={i * 100} direction="up">
                <Link
                  href={`/${lang}/servicios`}
                  className="block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all p-6 group"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradients[color]} flex items-center justify-center mb-4 shadow-sm`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-primary mb-2">{cat.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`text-xs font-medium ${counts[color]} bg-${lightBgs[color]} px-2 py-0.5 rounded-full`}>
                      {cat.items.length} {lang === "en" ? "services" : "servicios"}
                    </span>
                  </div>
                  <p className="text-sm text-foreground-light mb-4 line-clamp-2">
                    {cat.items.slice(0, 3).map((s: {name?: string}) => s.name).join(" · ")}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary group-hover:gap-2.5 transition-all">
                    {lang === "en" ? "View all" : "Ver más"} <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </ScrollReveal>
            )
          })}
        </div>

        <ScrollReveal direction="up">
          <div className="text-center">
            <Link
              href={`/${lang}/servicios`}
              className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-secondary-dark transition-all shadow-sm"
            >
              {l.verTodos} <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
