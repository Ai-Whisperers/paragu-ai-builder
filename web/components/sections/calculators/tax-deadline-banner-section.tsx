'use client'
import { Section } from '@/components/ui/section'
import { CalcCard } from '@/components/ui/calc-card'

import { useMemo } from 'react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { cleanPhone } from '@/lib/format'
import { getUpcomingDeadlines } from '@/lib/data/py-tax-calendar'

/**
 * Compact banner showing the 1-3 next Paraguay tax deadlines (IVA, IPS,
 * IRE, IRP). Surfaces DNIT/IPS/MTESS dates that every SMB owner stresses
 * about, and converts that anxiety into a "¿necesitas ayuda?" CTA.
 *
 * Most competitor sites in PY don't surface deadlines at all — this is a
 * differentiation hook for the contador template.
 */

export interface TaxDeadlineBannerProps {
  title?: string
  subtitle?: string
  limit?: number
  ctaText?: string
  ctaHref?: string
  whatsapp?: string
  /** Locale-keyed UI labels. Falls back to LABELS constant when omitted. */
  labels?: Record<string, {
    title: string
    subtitle: string
    cta: string
    whatsappCta: string
    inDays: (n: number) => string
  }>
  /** Active URL locale — defaults to ES. */
  __locale?: string
}

const LABELS = {
  es: {
    title: 'Proximos vencimientos',
    subtitle: 'Presentaciones ante DNIT, IPS y MTESS',
    cta: 'Agendar consulta',
    whatsappCta: 'Consultar por WhatsApp',
    inDays: (n: number) => (n === 0 ? 'hoy' : n === 1 ? 'en 1 dia' : `en ${n} dias`),
  },
  en: {
    title: 'Upcoming deadlines',
    subtitle: 'Paraguay tax & labor filings',
    cta: 'Book consultation',
    whatsappCta: 'Chat on WhatsApp',
    inDays: (n: number) => (n === 0 ? 'today' : n === 1 ? 'in 1 day' : `in ${n} days`),
  },
  pt: {
    title: 'Proximos vencimentos',
    subtitle: 'Apresentacoes ante DNIT, IPS e MTESS',
    cta: 'Agendar consulta',
    whatsappCta: 'Falar no WhatsApp',
    inDays: (n: number) => (n === 0 ? 'hoje' : n === 1 ? 'em 1 dia' : `em ${n} dias`),
  },
}

const KIND_COLORS: Record<string, string> = {
  iva: 'bg-blue-100 text-blue-900',
  ire: 'bg-purple-100 text-purple-900',
  irp: 'bg-indigo-100 text-indigo-900',
  idu: 'bg-violet-100 text-violet-900',
  ips: 'bg-emerald-100 text-emerald-900',
  mtess: 'bg-amber-100 text-amber-900',
  timbrado: 'bg-slate-100 text-slate-900',
  patente: 'bg-rose-100 text-rose-900',
}

export function TaxDeadlineBannerSection({
  title,
  subtitle,
  limit = 3,
  ctaText,
  ctaHref = '#contacto',
  whatsapp,
  __locale,
  labels: labelsProp,
}: TaxDeadlineBannerProps) {
  const resolvedLabels = labelsProp ?? LABELS
  const locale = (__locale && __locale in resolvedLabels ? __locale : 'es') as keyof typeof resolvedLabels
  const L = resolvedLabels[locale]

  const deadlines = useMemo(() => getUpcomingDeadlines(new Date(), limit), [limit])

  if (deadlines.length === 0) return null

  const whatsappHref = whatsapp
    ? `https://wa.me/${cleanPhone(whatsapp)}?text=${encodeURIComponent(
        locale === 'pt'
          ? 'Ola, quero ajuda com os proximos vencimentos fiscais'
          : locale === 'en'
            ? 'Hi, I need help with the upcoming Paraguay tax deadlines'
            : 'Hola, quisiera ayuda con los proximos vencimientos de la DNIT',
      )}`
    : null

  return (
    <Section fullWidth spacing="sm" background="surface-light" className="font-heading">
      <Container>
        <CalcCard>
          <div className="font-heading flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-heading text-xs font-semibold uppercase tracking-wider text-secondary">
                {subtitle || L.subtitle}
              </p>
              <h2
                className="font-heading mt-1 text-2xl font-bold text-foreground"
               
              >
                {title || L.title}
              </h2>
            </div>

            <div className="font-heading flex flex-wrap gap-2">
              {whatsappHref && (
                <Button
                  href={whatsappHref}
                  variant="whatsapp"
                  size="md"
                 
                >
                  {L.whatsappCta}
                </Button>
              )}
              <Button href={ctaHref} variant="primary" size="md">
                {ctaText || L.cta}
              </Button>
            </div>
          </div>

          <ul className="font-heading mt-6 space-y-3">
            {deadlines.map((d, i) => (
              <li
                key={`${d.kind}-${d.month}-${i}`}
                className="font-heading flex items-center gap-4 rounded-lg border border-border bg-surface p-4"
              >
                <span
                  className={`inline-flex min-w-[60px] justify-center rounded-md px-2.5 py-1 text-xs font-bold uppercase ${
                    KIND_COLORS[d.kind] || 'bg-slate-100 text-slate-900'
                  }`}
                >
                  {d.kind.toUpperCase()}
                </span>
                <div className="font-heading min-w-0 flex-1">
                  <p className="font-heading truncate font-semibold text-foreground">{d.label}</p>
                  <p className="font-heading truncate text-sm text-muted-foreground">{d.description}</p>
                </div>
                <div className="font-heading text-right">
                  <p className="font-heading text-sm font-semibold text-primary">
                    {d.date.toLocaleDateString(locale === 'pt' ? 'pt-BR' : locale === 'en' ? 'en-US' : 'es-PY', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </p>
                  <p className="font-heading text-xs text-muted-foreground">{L.inDays(d.daysAway)}</p>
                </div>
              </li>
            ))}
          </ul>
        </CalcCard>
      </Container>
    </Section>
  )
}
