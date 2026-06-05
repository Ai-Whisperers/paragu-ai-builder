/**
 * ANNOTATION: NewsletterSection
 *
 * What it is: An email subscription form with name/email inputs, loading state, and a success confirmation. Integrated with the /api/subscribe endpoint.
 *
 * Why your business needs it: Social media and WhatsApp are rented audiences — algorithms can cut your reach overnight. An email list is owned media you control. A Paraguayan small business with 200 engaged email subscribers generates Gs. 30M+ in repeat revenue over 2 years with minimal extra effort.
 *
 * What AI populates from your data: N/A — this is a pure form capture component. ParaguAI does not populate content here; it enables you to collect the audience for future AI-driven campaigns.
 *
 * Your input: Tell ParaguAI what kind of content you want to send (e.g., "monthly promotions, business tips and news, early access to new services") and AI will help draft the first 3 newsletter templates.
 *
 * Plan availability: Crecimiento, Profesional
 */

"use client"

import { useState, FormEvent } from "react"
import { Mail, Send, CheckCircle2, Loader2 } from "lucide-react"

const labels: Record<string, { title: string; subtitle: string; namePlaceholder: string; emailPlaceholder: string; button: string; success: string; error: string }> = {
  es: {
    title: "Recibí Tips y Novedades",
    subtitle: "Suscribite a nuestro newsletter y recibí news, tips and exclusive offers.",
    namePlaceholder: "Tu nombre",
    emailPlaceholder: "tu@email.com",
    button: "Suscribirme",
    success: "¡Gracias por suscribirte! Te llegará nuestro próximo newsletter.",
    error: "Algo salió mal. Intentalo de nuevo.",
  },
  en: {
    title: "Get Tips & News",
    subtitle: "Subscribe to our newsletter and receive business tips, trends, and exclusive offers.",
    namePlaceholder: "Your name",
    emailPlaceholder: "your@email.com",
    button: "Subscribe",
    success: "Thanks for subscribing! You'll hear from us soon.",
    error: "Something went wrong. Please try again.",
  },
}

export function NewsletterSection({ lang = "es" }: { lang?: "es" | "en" }) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const t = labels[lang] ?? labels.es

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus("loading")
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || undefined, lang }),
      })
      if (!res.ok) throw new Error()
      setStatus("success")
    } catch {
      setStatus("error")
      setTimeout(() => setStatus("idle"), 4000)
    }
  }

  if (status === "success") {
    return (
      <section className="py-20 bg-primary">
        <div className="max-w-lg mx-auto text-center px-4">
          <CheckCircle2 className="w-12 h-12 text-secondary mx-auto mb-4" />
          <h2 className="text-2xl font-heading font-bold text-white mb-2">{t.title}</h2>
          <p className="text-white/70">{t.success}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-primary">
      <div className="max-w-lg mx-auto text-center px-4">
        <Mail className="w-10 h-10 text-secondary mx-auto mb-4" />
        <h2 className="text-2xl font-heading font-bold text-white mb-2">{t.title}</h2>
        <p className="text-white/70 text-sm mb-8">{t.subtitle}</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder={t.namePlaceholder}
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-5 py-3.5 bg-white/10 border border-white/20 text-white placeholder:text-white/50 rounded-xl text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
          />
          <div className="flex gap-2">
            <input
              type="email"
              required
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 px-5 py-3.5 bg-white/10 border border-white/20 text-white placeholder:text-white/50 rounded-xl text-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3.5 bg-secondary text-white rounded-xl font-semibold text-sm hover:bg-secondary/90 transition-all disabled:opacity-50 shrink-0"
            >
              {status === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
          {status === "error" && (
            <p className="text-red-300 text-xs mt-2">{t.error}</p>
          )}
        </form>
      </div>
    </section>
  )
}
