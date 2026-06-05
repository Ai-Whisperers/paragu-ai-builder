/**
 * ANNOTATION: ContactSection
 *
 * What it is: Contact page section with a form (WhatsApp or direct API), three info cards (address, hours, WhatsApp), and a map/address section.
 *
 * Why your business needs it: This is how visitors become leads. Contact forms reduce friction vs. calling — visitors can ask questions or request bookings at their convenience, even outside business hours.
 *
 * What AI populates from your data: Business contact info from content/es/site.json.
 * ParaguAI generates form validation messages and WhatsApp pre-filled messages.
 *
 * Your input: Your business address, hours, and WhatsApp number via the onboarding WhatsApp message.
 *
 * Plan availability: All plans
 */

/**
 * @component ContactSection
 * @description Contact form with WhatsApp and direct API submission options, plus three info cards showing address, business hours, and WhatsApp link.
 * @featureFlags core
 * @requires business from @/lib/config, /api/contact endpoint, Paraguayan phone validation
 * @implementation Dual submission path (WhatsApp wa.me or POST /api/contact), PY_PHONE_REGEX validation
 */


"use client"

import { useState, useCallback } from "react"
import { MessageCircle, MapPin, Clock, Phone, Send, AlertCircle } from "lucide-react"
import { business, formatHours } from "@/lib/config/config"

const PY_PHONE_REGEX = /^(\+?595)?[9][0-9]{8}$/

function validatePhone(phone: string): string | null {
  const cleaned = phone.replace(/\s/g, "")
  if (!cleaned) return "El teléfono es requerido"
  if (!PY_PHONE_REGEX.test(cleaned)) return "Formato inválido: use 09XX XXX XXX o +595 9XX XXX XXX"
  return null
}

export function ContactSection({ lang = "es" }: { lang?: "es" | "en" }) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [apiSuccess, setApiSuccess] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const labels = lang === "es"
    ? {
        title: "¿Querés Charlar?",
        subtitle: "Escribinos y te respondemos en menos de 5 minutos",
        nameLabel: "Tu nombre",
        namePlaceholder: "María García",
        whatsappLabel: "Tu WhatsApp",
        whatsappPlaceholder: "0981 123 456",
        messageLabel: "Mensaje (opcional)",
        messagePlaceholder: "Quiero saber más sobre...",
        sendWa: "Enviar por WhatsApp",
        sendApi: "Enviar consulta",
        info: "Info",
        successTitle: "¡Enviado!",
        successBody: lang === "es"
          ? "Recibimos tu mensaje. Te responderemos pronto."
          : "We received your message. We'll reply shortly.",
        apiSuccessTitle: lang === "es" ? "¡Consulta enviada!" : "Message sent!",
        apiSuccessBody: lang === "es"
          ? "Tu consulta fue enviada. Te contactaremos pronto."
          : "Your inquiry was sent. We'll be in touch soon.",
      }
    : {
        title: "Want to Chat?",
        subtitle: "Write to us and we'll reply in under 5 minutes",
        nameLabel: "Your name",
        namePlaceholder: "María García",
        whatsappLabel: "Your WhatsApp",
        whatsappPlaceholder: "+595 981 123 456",
        messageLabel: "Message (optional)",
        messagePlaceholder: "I want to know more about...",
        sendWa: "Send via WhatsApp",
        sendApi: "Send inquiry",
        info: "Info",
        successTitle: "Almost there!",
        successBody: "Your WhatsApp chat opened. Complete and send the message.",
        apiSuccessTitle: "Message sent!",
        apiSuccessBody: "Your inquiry was sent. We'll be in touch soon.",
      }

  const silentPostToApi = useCallback(async () => {
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: `${name.toLowerCase().replace(/\s/g, ".")}@whatsapp-form.local`, name, phone, message, source: "contact-whatsapp-form" }),
      })
    } catch (e) {
      console.error("Contact API error:", e);
    }
  }, [name, phone, message])

  function handleWhatsApp(e: React.FormEvent) {
    e.preventDefault()
    const err = validatePhone(phone)
    if (err) { setPhoneError(err); return }
    setPhoneError(null)

    const msg = encodeURIComponent(
      `¡Hola! Me gustaría contactarlos.\n\n👤 Nombre: ${name}\n📞 WhatsApp: ${phone}${message ? `\n💬 Mensaje: ${message}` : ""}`
    )
    window.open(`https://wa.me/${business.whatsapp}?text=${msg}`, "_blank")
    setSent(true)
    silentPostToApi()
  }

  async function handleApiSubmit(e: React.FormEvent) {
    e.preventDefault()
    const err = validatePhone(phone)
    if (err) { setPhoneError(err); return }
    setPhoneError(null)
    setLoading(true)
    setApiError(null)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: `${name.toLowerCase().replace(/\s/g, ".")}@contact-form.local`, name, phone, message, source: "contact-direct-form" }),
      })

      if (!res.ok) {
        const data = await res.json()
        setApiError(data.error || "Error al enviar")
        return
      }

      setApiSuccess(true)
      setSent(true)
    } catch {
      setApiError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  if (sent && !apiSuccess) {
    return (
      <section className="py-20 bg-white">
        <div className="container-page">
          <div className="max-w-2xl mx-auto text-center py-12 bg-secondary/5 rounded-2xl border-2 border-secondary/20">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-primary mb-2">{labels.successTitle}</h3>
            <p className="text-foreground-light">{labels.successBody}</p>
          </div>
        </div>
      </section>
    )
  }

  if (apiSuccess) {
    return (
      <section className="py-20 bg-white">
        <div className="container-page">
          <div className="max-w-2xl mx-auto text-center py-12 bg-green-50 rounded-2xl border-2 border-green-200">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-green-700 mb-2">{labels.apiSuccessTitle}</h3>
            <p className="text-green-600">{labels.apiSuccessBody}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white">
      <div className="container-page">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-heading text-4xl font-bold text-primary mb-3">{labels.title}</h2>
            <p className="text-foreground-light text-lg">{labels.subtitle}</p>
          </div>

          <form onSubmit={handleWhatsApp} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{labels.nameLabel}</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={labels.namePlaceholder} required
                maxLength={100}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-secondary outline-none transition-all bg-white text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{labels.whatsappLabel}</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setPhoneError(null) }}
                placeholder={labels.whatsappPlaceholder}
                required
                maxLength={20}
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all bg-white text-foreground ${
                  phoneError ? "border-red-400 focus:border-red-500" : "border-gray-100 focus:border-secondary"
                }`}
              />
              {phoneError && (
                <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                  <AlertCircle className="w-3 h-3" />{phoneError}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{labels.messageLabel}</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={labels.messagePlaceholder} rows={3}
                maxLength={500}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-secondary outline-none transition-all bg-white text-foreground resize-none" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button type="submit"
                className="flex-1 flex items-center justify-center gap-3 bg-[#25D366] text-white font-bold py-4 rounded-xl hover:bg-[#20BD5A] transition-all text-lg">
                <MessageCircle className="w-5 h-5" />
                {labels.sendWa}
              </button>
              <button type="button" onClick={handleApiSubmit} disabled={loading}
                className="flex-1 flex items-center justify-center gap-3 bg-zinc-600 text-white font-bold py-4 rounded-xl hover:bg-zinc-700 transition-all text-lg disabled:opacity-50">
                {loading ? (
                  <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                {labels.sendApi}
              </button>
            </div>

            {apiError && (
              <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl p-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {apiError}
              </div>
            )}
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-xs font-bold text-secondary uppercase tracking-wide">{labels.info}</p>
                <p className="text-sm text-foreground mt-0.5">{business.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-xs font-bold text-secondary uppercase tracking-wide">{labels.info}</p>
                <p className="text-sm text-foreground mt-0.5">{formatHours(business.hours ?? {})}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-xs font-bold text-secondary uppercase tracking-wide">WhatsApp</p>
                <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-secondary font-medium hover:underline mt-0.5 block">
                  {business.phoneFormatted}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}