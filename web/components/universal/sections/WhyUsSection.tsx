/**
 * ANNOTATION: WhyUs
 *
 * What it is: A 6-column grid showcasing why businesses need a website — Google presence, competition, WhatsApp limitations, analytics, 24/7 availability, customer retention.
 *
 * Why your business needs it: This section addresses the objection "I already have WhatsApp, why do I need a website?" — the #1 reason Paraguayan businesses resist going online. It reframes the website as a business tool, not a tech luxury.
 *
 * What AI populates from your data: Reasons are platform-level and apply to all businesses. Order is optimized based on your specific business category — most relevant reason appears first.
 *
 * Your input: No input needed — these are universal truths for Paraguayan SMBs. You can reorder or replace reasons at Profesional tier.
 *
 * Plan availability: All plans
 */
import { Search, TrendingUp, MessageCircle, BarChart, Clock, Heart, Award } from "lucide-react"
import { reasons as reasonsData } from "@/lib/config/config"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  search: Search,
  trendingUp: TrendingUp,
  messageCircle: MessageCircle,
  barChart: BarChart,
  clock: Clock,
  heart: Heart,
  award: Award,
}

interface ReasonItem {
  icon?: string
  title?: string
  desc?: string
}

const reasons: ReasonItem[] = (reasonsData as ReasonItem[]).map((r) => ({
  icon: r.icon,
  title: r.title || "",
  desc: r.desc || "",
}))

export function WhyUs() {
  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
        backgroundSize: "32px 32px"
      }} />

      <div className="container-page relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-bold text-secondary uppercase tracking-widest mb-4">
            ¿Por qué una página web?
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            Tu Negocio Merece Más Que WhatsApp
          </h2>
          <p className="text-white/70 max-w-xl mx-auto text-lg">
            El 70% de los paraguayos busca negocios en Google. Si no aparecés, te perdés clientes.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {reasons.map((item, i) => {
            const Icon = iconMap[item.icon as string] || Search
            return (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all text-center">
                <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="font-heading text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}