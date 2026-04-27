'use client'

import { useMemo, useState } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'
import { formatGs, cleanPhone } from '@/lib/format'
import type { BaseCalculatorSectionProps } from '@/types/sections'

/**
 * Paraguay IVA calculator — 10% general / 5% canasta basica.
 *
 * Ley 6380/19: IVA a pagar = debito fiscal (ventas gravadas × tasa) -
 * credito fiscal (compras gravadas × tasa con comprobante). Se presenta
 * mensualmente en Marangatu (Formulario 120).
 */

export interface CalcIvaSectionProps extends BaseCalculatorSectionProps {}

export function CalcIvaSection({
  eyebrow = 'Calculadora IVA',
  title = 'Calcula tu IVA mensual',
  subtitle = 'Debito fiscal menos credito fiscal — presentacion mensual via Marangatu (F. 120).',
  disclaimer,
  ctaLabel = 'Cotizar liquidacion de IVA',
  ctaHref = '#contacto',
  whatsapp,
}: CalcIvaSectionProps) {
  const [sales10, setSales10] = useState<number>(150_000_000)
  const [sales5, setSales5] = useState<number>(0)
  const [purchases10, setPurchases10] = useState<number>(50_000_000)
  const [purchases5, setPurchases5] = useState<number>(0)

  const r = useMemo(() => {
    const debito = sales10 / 11 + sales5 / 21 // tasas incluidas: IVA neto en ventas
    const credito = purchases10 / 11 + purchases5 / 21
    const toPay = Math.max(0, debito - credito)
    const creditToCarry = Math.max(0, credito - debito)
    return { debito, credito, toPay, creditToCarry }
  }, [sales10, sales5, purchases10, purchases5])

  const whatsappHref = whatsapp
    ? `https://wa.me/${cleanPhone(whatsapp)}?text=${encodeURIComponent('Hola, necesito ayuda con la liquidacion mensual de IVA.')}`
    : null

  return (
    <section className="py-16 bg-[var(--surface,#ffffff)] sm:py-24">
      <Container>
        <AnimatedSectionHeader>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--secondary)]">{eyebrow}</p>
          <Heading level={2}>{title}</Heading>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--text-light,#475569)]">{subtitle}</p>
        </AnimatedSectionHeader>

        <div className="mx-auto mt-12 max-w-4xl rounded-2xl border border-[var(--border,#e2e8f0)] bg-[var(--surface,#ffffff)] p-6 shadow-sm sm:p-10">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted,#64748b)]">Ventas gravadas del mes (montos CON IVA)</h3>
              <Field label="Ventas IVA 10%" value={sales10} onChange={setSales10} />
              <Field label="Ventas IVA 5% (canasta basica)" value={sales5} onChange={setSales5} />

              <h3 className="pt-4 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted,#64748b)]">Compras gravadas del mes (montos CON IVA)</h3>
              <Field label="Compras IVA 10% con comprobante" value={purchases10} onChange={setPurchases10} />
              <Field label="Compras IVA 5% con comprobante" value={purchases5} onChange={setPurchases5} />
            </div>

            <div className="flex flex-col justify-center rounded-xl bg-[var(--surface-light,#f8fafc)] p-6">
              <dl className="space-y-4 text-sm">
                <Row label="Debito fiscal (IVA en ventas)" value={formatGs(r.debito)} />
                <Row label="Credito fiscal (IVA en compras)" value={`- ${formatGs(r.credito)}`} negative />
                <div className="border-t border-[var(--border,#e2e8f0)] pt-4">
                  {r.toPay > 0 ? (
                    <>
                      <dt className="text-xs uppercase tracking-wider text-[var(--secondary)]">IVA a pagar</dt>
                      <dd className="text-3xl font-bold" style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                        {formatGs(r.toPay)}
                      </dd>
                    </>
                  ) : (
                    <>
                      <dt className="text-xs uppercase tracking-wider text-emerald-700">Credito a favor (periodo siguiente)</dt>
                      <dd className="text-3xl font-bold text-emerald-700" style={{ fontFamily: 'var(--font-heading)' }}>
                        {formatGs(r.creditToCarry)}
                      </dd>
                    </>
                  )}
                </div>
              </dl>
            </div>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-[var(--text-muted,#64748b)]">
            {disclaimer ||
              'Calculo referencial. El IVA real depende de retenciones de IVA (Res. DNIT), exportaciones (tasa 0%), operaciones exentas (art. 100) y comprobantes con credito fiscal valido. Consulta con un contador antes de presentar.'}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {whatsappHref && (
              <Button href={whatsappHref} variant="secondary" size="lg" style={{ backgroundColor: '#25d366', color: '#ffffff', borderColor: '#25d366' }}>
                Consultar por WhatsApp
              </Button>
            )}
            <Button variant="primary" size="lg" href={ctaHref}>{ctaLabel}</Button>
          </div>
        </div>
      </Container>
    </section>
  )
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[var(--text,#0f172a)]">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        step={100_000}
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        className="w-full rounded-md border border-[var(--border,#e2e8f0)] bg-[var(--surface,#ffffff)] px-3 py-2.5 text-base text-[var(--text,#0f172a)] focus:border-[var(--secondary)] focus:outline-none"
      />
      <span className="mt-1 block text-xs text-[var(--text-muted,#64748b)]">{formatGs(value)}</span>
    </label>
  )
}

function Row({ label, value, negative }: { label: string; value: string; negative?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-[var(--text-light,#475569)]">{label}</dt>
      <dd className={`font-semibold ${negative ? 'text-rose-700' : 'text-[var(--text,#0f172a)]'}`}>{value}</dd>
    </div>
  )
}
