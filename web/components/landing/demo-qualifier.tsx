'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, MessageCircle } from 'lucide-react'
import { Heading } from '@/components/ui/heading'
import { LIVE_TEMPLATES, TEMPLATES, waLink } from '@/lib/landing/marketing-data'
import { trackButtonClick, trackLeadCreated } from '@/lib/analytics/events'

const SIZES = [
  { id: 'solo', label: 'Solo yo' },
  { id: 'small', label: '2-5 personas' },
  { id: 'medium', label: '6-15 personas' },
  { id: 'large', label: '15+ personas' },
] as const

const PRESENCE = [
  { id: 'none', label: 'Solo Instagram / WhatsApp' },
  { id: 'facebook', label: 'Tengo Facebook' },
  { id: 'old-site', label: 'Tengo un sitio viejo' },
  { id: 'new-site', label: 'Quiero rediseñar mi sitio' },
] as const

type Step = 0 | 1 | 2 | 3

export function DemoQualifier() {
  const [step, setStep] = useState<Step>(0)
  const [rubro, setRubro] = useState<string>('')
  const [size, setSize] = useState<string>('')
  const [presence, setPresence] = useState<string>('')

  // BUG_HUNT_500 #379: pre-fill rubro from ?v=<id> query param. Visitors
  // who came from a /p/[rubro] CTA arrive with their vertical preselected.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const v = params.get('v')
    if (v && TEMPLATES.some((t) => t.id === v || t.seoSlug === v)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRubro(TEMPLATES.find((t) => t.id === v || t.seoSlug === v)?.id ?? '')
    }
  }, [])

  const liveSlugs = useMemo(() => new Set(LIVE_TEMPLATES.map((t) => t.id)), [])
  const orderedTemplates = useMemo(
    () => [...TEMPLATES].sort((a, b) => Number(liveSlugs.has(b.id)) - Number(liveSlugs.has(a.id))),
    [liveSlugs],
  )

  // Stable per-session lead id, only assigned when the qualifier completes.
  const leadIdRef = useRef<string | null>(null)

  function next() {
    setStep((s) => {
      const target = Math.min(3, s + 1) as Step
      const stepName = ['rubro', 'size', 'presence', 'send'][target] ?? 'unknown'
      // Fire-and-forget — analytics failures must never block the form.
      void trackButtonClick(`demo_step_${target}`, `demo_step_${stepName}`, {
        from: s,
        to: target,
        rubro: rubro || null,
        size: size || null,
        presence: presence || null,
      })

      // When the user reaches step 3 (review screen), the qualifier is
      // effectively complete — capture as a lead now so we have the data
      // even if they never click "Enviar por WhatsApp".
      if (target === 3 && leadIdRef.current === null) {
        const id =
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `lead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
        leadIdRef.current = id
        void trackLeadCreated(id, 'demo_qualifier', {
          rubro,
          size,
          presence,
          stage: 'qualifier_complete',
        })
      }
      return target
    })
  }
  function back() {
    setStep((s) => Math.max(0, s - 1) as Step)
  }

  const summary = useMemo(() => {
    const t = TEMPLATES.find((x) => x.id === rubro)
    const sz = SIZES.find((s) => s.id === size)
    const pr = PRESENCE.find((p) => p.id === presence)
    return {
      rubroLabel: t?.name ?? '',
      sizeLabel: sz?.label ?? '',
      presenceLabel: pr?.label ?? '',
    }
  }, [rubro, size, presence])

  const waMessage = `Hola, quiero una demo gratis de ParaguAI.
- Rubro: ${summary.rubroLabel}
- Equipo: ${summary.sizeLabel}
- Presencia actual: ${summary.presenceLabel}`

  const canNext = (step === 0 && rubro) || (step === 1 && size) || (step === 2 && presence)

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress: numeric label + bar (BUG_HUNT_500 #375) */}
      <div className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Paso {Math.min(step + 1, 4)} de 4
      </div>
      <div className="mb-8 flex items-center justify-center gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              step >= i ? 'bg-primary' : 'bg-border'
            }`}
          />
        ))}
      </div>

      <div className="rounded-3xl border border-border bg-surface p-6 md:p-10">
        {step === 0 && (
          <div>
            <Heading level={2} className="mb-2 text-2xl">¿Cuál es tu rubro?</Heading>
            <p className="mb-6 text-sm text-muted-foreground">
              Esto nos ayuda a armar la demo más cercana a lo que necesitás.
            </p>
            <div className="grid max-h-96 gap-2 overflow-y-auto pr-2 sm:grid-cols-2">
              {orderedTemplates.map((t) => {
                const isLive = liveSlugs.has(t.id)
                const selected = rubro === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setRubro(t.id)}
                    className={`flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all ${
                      selected
                        ? 'border-[var(--primary)] bg-primary/5 text-foreground'
                        : 'border-border text-muted-foreground hover:border-[var(--primary)]/50'
                    }`}
                  >
                    <span>{t.name}</span>
                    {isLive ? (
                      <span className="text-xs text-[var(--success)]">Demo lista</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Próx.</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <Heading level={2} className="mb-2 text-2xl">¿Cuántos son en tu equipo?</Heading>
            <p className="mb-6 text-sm text-muted-foreground">
              Para sugerirte el plan más realista — no para ofrecerte el más caro.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {SIZES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSize(s.id)}
                  className={`rounded-xl border-2 px-4 py-4 text-left font-medium transition-all ${
                    size === s.id
                      ? 'border-[var(--primary)] bg-primary/5 text-foreground'
                      : 'border-border text-muted-foreground hover:border-[var(--primary)]/50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <Heading level={2} className="mb-2 text-2xl">¿Qué presencia digital tenés hoy?</Heading>
            <p className="mb-6 text-sm text-muted-foreground">
              Si ya tenés Wix o WordPress, te ayudamos a migrar sin perder dominio ni SEO.
            </p>
            <div className="grid gap-3">
              {PRESENCE.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPresence(p.id)}
                  className={`rounded-xl border-2 px-4 py-4 text-left font-medium transition-all ${
                    presence === p.id
                      ? 'border-[var(--primary)] bg-primary/5 text-foreground'
                      : 'border-border text-muted-foreground hover:border-[var(--primary)]/50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-[var(--success)]">
              <Check size={28} />
            </div>
            <Heading level={2} className="mb-3 text-2xl">Listo. Mandanos el WhatsApp.</Heading>
            {/* BUG_HUNT_500 #372: visitors who picked a vertical without a
                live demo get a friendlier framing — we still want them. */}
            {rubro && !liveSlugs.has(rubro) ? (
              <p className="mb-6 text-muted-foreground">
                Tu rubro es uno donde todavía no tenemos plantilla productizada,
                pero <strong className="text-foreground">vos podés ser nuestro primer caso</strong>.
                Mandanos el WhatsApp y armamos algo a medida.
              </p>
            ) : (
              <p className="mb-6 text-muted-foreground">
                Ya armamos el mensaje con la info que nos diste. Hacé clic abajo, revisalo si querés
                y mandalo. Te respondemos en horario hábil.
              </p>
            )}
            <pre className="mb-6 whitespace-pre-wrap rounded-xl bg-surface-light p-4 text-left text-sm text-foreground">
              {waMessage}
            </pre>
            <a
              href={waLink(waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                void trackButtonClick('demo_qualifier_send', 'demo_qualifier_whatsapp_send', {
                  rubro,
                  size,
                  presence,
                  leadId: leadIdRef.current,
                })
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-8 py-4 font-bold text-[var(--primary-foreground)] shadow-lg transition-all hover:-translate-y-1"
            >
              <MessageCircle size={20} />
              Enviar por WhatsApp
            </a>
            <div className="mt-6">
              <Link
                href={`/p/${rubro.replace(/_/g, '-')}`}
                className="text-sm font-semibold text-primary"
              >
                Mientras tanto, mirá la plantilla de tu rubro →
              </Link>
            </div>
          </div>
        )}

        {step !== 3 && (
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={back}
              disabled={step === 0}
              className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground disabled:opacity-40"
            >
              <ArrowLeft size={14} />
              Atrás
            </button>
            <button
              type="button"
              onClick={next}
              disabled={!canNext}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-[var(--primary-foreground)] transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Siguiente
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
