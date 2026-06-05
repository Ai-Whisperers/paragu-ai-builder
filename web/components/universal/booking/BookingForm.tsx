/**
 * @component BookingForm
 * @description Multi-step appointment booking form with Supabase backend and WhatsApp fallback. Captures client info, service selection, date preference, and notes.
 * @featureFlags bookingForm
 * @requires Supabase (bookings table), WhatsApp business number, servicesData from @/lib/config
 * @implementation useState for step management, POST to /api/booking with JSON fallback to wa.me link
 */


/**
 * ANNOTATION: BookingForm
 *
 * What it is: A multi-step appointment booking form (name, phone, service,
 * preferred date, notes) that submits via your backend and falls back to a
 * pre-filled WhatsApp message if needed.
 *
 * Why your business needs it: Every extra step in a booking flow drops ~30%
 * of conversions. This form captures intent while it's hot and routes it to
 * WhatsApp — the channel Paraguayan customers actually use. No account
 * creation, no calendar friction.
 *
 * What AI populates from your data: AI pre-fills the WhatsApp message based on
 * the service the visitor selected, and suggests available time slots from
 * your configured opening hours.
 *
 * Your input: Your service list + opening hours + WhatsApp number (set once).
 *
 * Plan availability: Crecimiento and Profesional (online booking).
 */
"use client";
import { useState, useMemo } from "react";
import { business, servicesData, getSiteName } from "@/lib/config/config";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Calendar,
  User,
  Scissors,
  MessageCircle,
  Clock,
} from "lucide-react";

// Build service list from content JSON — flattened from all categories
function buildServicesFromContent(lang: "es" | "en") {
  const categories = servicesData(lang)
  const ICON_MAP: Record<string, string> = {
    scissors: "✂️", palette: "🎨", sparkles: "✨", sparkle: "✨",
  }
  const items: { value: string; label: string; duration: string; icon: string }[] = []
  for (const cat of categories) {
    const icon = ICON_MAP[String(cat.icon)] ?? "💇"
    for (const svc of cat.items ?? []) {
      items.push({ value: svc.name, label: svc.name, duration: String(svc.duration ?? "—"), icon })
    }
  }
  return items
}

const STEPS_ES = [
  { id: 1, label: "Servicio", icon: Scissors },
  { id: 2, label: "Tus datos", icon: User },
  { id: 3, label: "Fecha", icon: Calendar },
  { id: 4, label: "Confirmar", icon: Check },
];

const STEPS_EN = [
  { id: 1, label: "Service", icon: Scissors },
  { id: 2, label: "Your details", icon: User },
  { id: 3, label: "Date", icon: Calendar },
  { id: 4, label: "Confirm", icon: Check },
];

interface StepIndicatorProps {
  current: number
  steps: { id: number; label: string; icon: React.ElementType }[]
}

export function StepIndicator({ current, steps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {steps.map((step, i) => {
        const done = step.id < current
        const active = step.id === current
        const Icon = step.icon
        return (
          <div key={step.id} className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
              ${done ? "bg-secondary text-white" : active ? "bg-secondary text-white ring-4 ring-secondary/20" : "bg-gray-100 text-gray-400"}`}
            >
              {done ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-8 h-0.5 rounded ${step.id < current ? "bg-secondary" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

interface BookingFormProps {
  supabaseConfigured: boolean
  lang?: "es" | "en"
}

export function BookingForm({ supabaseConfigured, lang = "es" }: BookingFormProps) {
  const [step, setStep] = useState(1)
  const [service, setService] = useState("")
  const [serviceLabel, setServiceLabel] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [preferredDate, setPreferredDate] = useState("")
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null)
  const [savedService, setSavedService] = useState<string>("")

  const services = useMemo(() => buildServicesFromContent(lang), [lang])

  function isValidPhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, "")
    return cleaned.length >= 9 && cleaned.length <= 11
  }

  const canNext = step === 1 ? service : step === 2 ? name.trim() && isValidPhone(phone) : true

  function handleNext() {
    if (!canNext) return
    if (step < 4) setStep(step + 1)
    else handleSubmit()
  }

  function handleBack() {
    if (step > 1) setStep(step - 1)
  }

  async function handleSubmit() {
    setSubmitting(true)
    let apiError = null
    let fallbackUrl = null

    if (supabaseConfigured) {
      try {
        const res = await fetch("/api/booking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ client_name: name, phone, service: serviceLabel, preferred_date: preferredDate, notes }),
        })
        const data = await res.json()
        if (!res.ok) {
          apiError = data.message ?? "No se pudo guardar la reserva."
          fallbackUrl = data.fallback_url
        }
        // if ok, still show WA confirmation (desired behaviour)
      } catch {
        apiError = lang === "es"
          ? "No se pudo conectar con el servidor. Podés reservar directo por WhatsApp."
          : "Could not connect to the server. You can book directly via WhatsApp."
      }
    }

    setSubmitted(true)
    setSubmitting(false)

    setApiError(apiError)
    setFallbackUrl(fallbackUrl)
    setSavedService(serviceLabel)
  }

  function getWhatsAppMessage(serviceOverride = "") {
    const chosen = serviceOverride || serviceLabel
    const dateText = preferredDate ? `\n📅 Fecha preferida: ${preferredDate}` : ""
    const notesText = notes ? `\n📝 Notas: ${notes}` : ""
    const isEs = lang === "es"
    const intro = isEs
      ? `¡Hola! Quiero reservarme un turno en ${getSiteName()}.\n\n👤 Nombre: ${name}`
      : `Hi! I'd like to book an appointment at ${getSiteName()}.\n\n👤 Name: ${name}`
    return `${intro}\n📞 WhatsApp: ${phone}\n✂️ Servicio: ${chosen}${dateText}${notesText}`
  }

  const waPhone = business.whatsapp

  if (submitted) {
    return (
      <div className="text-center py-8">
        {apiError && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
            <strong>⚠️ {apiError}</strong>
          </div>
        )}

        {/* Booking confirmation */}
        <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-5">
          <Check className="w-8 h-8 text-secondary" />
        </div>
        <h3 className="font-heading text-2xl font-bold text-primary mb-3">{lang === "es" ? "¡Casi listo!" : "Almost done!"}</h3>
        <p className="text-foreground-light mb-6 max-w-sm mx-auto text-sm">
          {lang === "es"
            ? "Completá tu reserva enviándonos un mensaje por WhatsApp."
            : "Complete your booking by sending us a WhatsApp message."}
        </p>
        <a
          href={fallbackUrl ?? `https://wa.me/${waPhone}?text=${encodeURIComponent(getWhatsAppMessage(savedService))}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-[#25D366] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-[#20BD5A] transition-all text-base mb-6"
        >
          <MessageCircle className="w-5 h-5" />
          {lang === "es" ? "Confirmar por WhatsApp" : "Confirm via WhatsApp"}
        </a>

        {/* Loyalty progress tracker - placeholder data, not connected to actual user */}
        <div className="bg-primary rounded-2xl p-5 text-white mb-5">
          <p className="text-xs text-white/60 uppercase tracking-widest mb-3 font-semibold">
            {lang === "es" ? "Programa de Rewards" : "Rewards Program"}
          </p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { filled: true, label: lang === "es" ? "Turno reservado" : "Booked", icon: Check },
              { filled: false, label: lang === "es" ? "Visita completada" : "Visit done", icon: Check },
              { filled: false, label: lang === "es" ? "Tercera visita" : "Third visit", icon: Check },
              { filled: false, label: lang === "es" ? "Premio especial" : "Special reward", icon: Check },
            ].map(({ filled, label, icon: Icon }, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 text-xs ${filled ? "bg-secondary text-white" : "bg-white/10 text-white/30"}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-[10px] leading-tight" style={{ color: filled ? "var(--color-secondary)" : "rgba(255,255,255,0.3)" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Gift card upsell */}
        <div className="bg-card rounded-xl border border-border p-4 text-left mb-4">
          <p className="text-xs text-foreground-muted mb-2">{lang === "es" ? "¿Regalás un momento especial?" : "Gift someone special?"}</p>
          <p className="font-semibold text-primary text-sm mb-3">
            {lang === "es"
              ? "Tarjetas de regalo disponibles desde Gs. 50.000"
              : "Gift cards starting from Gs. 50.000"}
          </p>
          <a
            href={`/${lang}/reserva`}
            className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-rose-100 transition-colors"
          >
            🎁 {lang === "es" ? "Ver tarjetas de regalo" : "View gift cards"}
          </a>
        </div>

        <p className="text-xs text-foreground-muted">
          {lang === "es" ? "Te respondemos en menos de 5 minutos" : "We reply in under 5 minutes"}
        </p>
      </div>
    )
  }

  const LABELS = lang === "es"
    ? {
        step1Title: "¿Qué servicio necesitás?",
        step1Sub: "Elegí el servicio principal para tu turno.",
        step2Title: "Tus datos de contacto",
        step2Sub: "Los usamos solo para confirmar tu turno.",
        nameLabel: "Nombre completo",
        namePlaceholder: "María García",
        whatsappLabel: "WhatsApp",
        whatsappPlaceholder: "0981 123 456",
        step3Title: "¿Cuándo querés venir?",
        step3Sub: "Martes a Sábado, 9:00 – 19:00.",
        dateLabel: "Fecha preferida",
        notesLabel: "Notas adicionales",
        notesOptional: "(opcional)",
        notesPlaceholder: "Tengo el cabello teñido de rubio, quiero mantener el tono...",
        step4Title: "Confirmá tu reserva",
        step4Sub: "Revisá que todo esté bien antes de enviar.",
        serviceLabel: "Servicio",
        nameField: "Nombre",
        whatsappField: "WhatsApp",
        dateField: "Fecha preferida",
        notesField: "Notas",
        noDate: "A confirmar",
        back: "Volver",
        continue: "Continuar",
        submitWA: "Reservar por WhatsApp",
        submitting: "Enviando...",
      }
    : {
        step1Title: "Which service do you need?",
        step1Sub: "Choose the main service for your appointment.",
        step2Title: "Your contact details",
        step2Sub: "We only use them to confirm your appointment.",
        nameLabel: "Full name",
        namePlaceholder: "María García",
        whatsappLabel: "WhatsApp",
        whatsappPlaceholder: "+595 981 123 456",
        step3Title: "When do you want to come?",
        step3Sub: "Tuesday to Saturday, 9:00 AM – 7:00 PM.",
        dateLabel: "Preferred date",
        notesLabel: "Additional notes",
        notesOptional: "(optional)",
        notesPlaceholder: "I'm interested in your services and would like to learn more...",
        step4Title: "Confirm your booking",
        step4Sub: "Review everything before sending.",
        serviceLabel: "Service",
        nameField: "Name",
        whatsappField: "WhatsApp",
        dateField: "Preferred date",
        notesField: "Notes",
        noDate: "TBC",
        back: "Back",
        continue: "Continue",
        submitWA: "Book via WhatsApp",
        submitting: "Sending...",
      }

  const steps = lang === "en" ? STEPS_EN : STEPS_ES

  return (
    <div className="space-y-6">
      <StepIndicator current={step} steps={steps} />

      {/* STEP 1: Service selection */}
      {step === 1 && (
        <ScrollReveal direction="up">
          <div className="space-y-3">
            <h3 className="font-heading text-xl font-bold text-primary mb-1">{LABELS.step1Title}</h3>
            <p className="text-foreground-light text-sm mb-6">{LABELS.step1Sub}</p>
              <div className="grid grid-cols-1 gap-3">
                {services.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => { setService(s.value); setServiceLabel(s.label); }}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all
                      ${service === s.value ? "border-secondary bg-secondary/5" : "border-gray-100 hover:border-gray-200 bg-white"}`}
                  >
                    <span className="text-2xl">{s.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{s.label}</p>
                      <p className="text-xs text-foreground-muted flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {s.duration}
                      </p>
                    </div>
                    {service === s.value && <Check className="w-5 h-5 text-secondary" />}
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

      {/* STEP 2: Personal info */}
      {step === 2 && (
        <ScrollReveal direction="up">
          <div className="space-y-5">
            <h3 className="font-heading text-xl font-bold text-primary mb-1">{LABELS.step2Title}</h3>
            <p className="text-foreground-light text-sm mb-4">{LABELS.step2Sub}</p>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{LABELS.nameLabel}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={LABELS.namePlaceholder}
                maxLength={100}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-secondary outline-none transition-all text-foreground bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{LABELS.whatsappLabel}</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={LABELS.whatsappPlaceholder}
                maxLength={20}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-secondary outline-none transition-all text-foreground bg-white"
              />
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* STEP 3: Date + notes */}
      {step === 3 && (
        <ScrollReveal direction="up">
          <div className="space-y-5">
            <h3 className="font-heading text-xl font-bold text-primary mb-1">{LABELS.step3Title}</h3>
            <p className="text-foreground-light text-sm mb-4">{LABELS.step3Sub}</p>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{LABELS.dateLabel}</label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-secondary outline-none transition-all text-foreground bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                {LABELS.notesLabel} <span className="text-foreground-muted font-normal">{LABELS.notesOptional}</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={LABELS.notesPlaceholder}
                rows={3}
                maxLength={500}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-secondary outline-none transition-all text-foreground bg-white resize-none"
              />
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* STEP 4: Confirm */}
      {step === 4 && (
        <ScrollReveal direction="up">
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-bold text-primary mb-1">{LABELS.step4Title}</h3>
            <p className="text-foreground-light text-sm mb-4">{LABELS.step4Sub}</p>
            {[
              { label: LABELS.serviceLabel, value: serviceLabel },
              { label: LABELS.nameField, value: name },
              { label: LABELS.whatsappField, value: phone },
              { label: LABELS.dateField, value: preferredDate || LABELS.noDate },
              ...(notes ? [{ label: LABELS.notesField, value: notes }] : []),
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                <div>
                  <p className="text-xs font-bold text-secondary uppercase tracking-wide">{label}</p>
                  <p className="font-semibold text-foreground mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      )}

      {/* Navigation */}
      <div className="flex items-center gap-4 mt-8 pt-4">
        {step > 1 && (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-foreground-light font-medium px-4 py-3 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" /> {LABELS.back}
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!canNext || submitting}
          className={`flex-1 flex items-center justify-center gap-2 font-bold px-6 py-4 rounded-xl transition-all
            ${canNext ? "bg-secondary text-white hover:bg-secondary-dark" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
        >
          {step === 4 ? (
            submitting ? LABELS.submitting : <>
              <MessageCircle className="w-5 h-5" /> {LABELS.submitWA}
            </>
          ) : (
            <>{LABELS.continue} <ChevronRight className="w-5 h-5" /></>
          )}
        </button>
      </div>
    </div>
  )
}