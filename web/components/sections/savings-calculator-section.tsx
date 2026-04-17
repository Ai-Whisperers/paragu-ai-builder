'use client'

import { useMemo, useState } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'

export interface SavingsCalculatorTierOption {
  key: string
  label: string
  monthlyGs: number
}

export interface SavingsCalculatorSectionProps {
  title?: string
  subtitle?: string
  whatsappPhone?: string
  whatsappMessageTemplate?: string
  disclaimer?: string
  tierOptions?: SavingsCalculatorTierOption[]
  inputLabels?: {
    groceriesLabel?: string
    deliveryLabel?: string
    wasteLabel?: string
    utilitiesLabel?: string
    householdLabel?: string
    hourlyValueLabel?: string
    hoursPerMonthLabel?: string
    tierLabel?: string
  }
  outputLabels?: {
    cashTotalLabel?: string
    timeValueLabel?: string
    totalTodayLabel?: string
    ourServiceLabel?: string
    savingsLabel?: string
    hoursRecoveredLabel?: string
    negativeCopy?: string
    positiveCopy?: string
    ctaText?: string
  }
}

const DEFAULT_TIERS: SavingsCalculatorTierOption[] = [
  { key: 'nivel2_individual', label: 'Nivel 2 Individual (1.600.000 Gs/mes)', monthlyGs: 1_600_000 },
  { key: 'nivel2_pareja', label: 'Nivel 2 Pareja (2.600.000 Gs/mes)', monthlyGs: 2_600_000 },
  { key: 'nivel2_familia', label: 'Nivel 2 Familia (3.600.000 Gs/mes)', monthlyGs: 3_600_000 },
]

function formatGs(value: number): string {
  const rounded = Math.round(value)
  return new Intl.NumberFormat('es-PY').format(rounded)
}

export function SavingsCalculatorSection({
  title = 'Calcula tu ahorro real',
  subtitle = 'Numeros honestos. Si no te conviene, te lo decimos.',
  whatsappPhone,
  whatsappMessageTemplate,
  disclaimer = 'Estimacion referencial. Precios finales se ajustan segun tu hogar y nivel de servicio.',
  tierOptions = DEFAULT_TIERS,
  inputLabels = {},
  outputLabels = {},
}: SavingsCalculatorSectionProps) {
  const [groceries, setGroceries] = useState(4_000_000)
  const [delivery, setDelivery] = useState(1_500_000)
  const [waste, setWaste] = useState(500_000)
  const [utilities, setUtilities] = useState(200_000)
  const [household, setHousehold] = useState(3)
  const [hourlyValue, setHourlyValue] = useState(25_000)
  const [hoursPerMonth, setHoursPerMonth] = useState(60)
  const [tierKey, setTierKey] = useState(tierOptions[0]?.key ?? '')

  const tier = tierOptions.find((t) => t.key === tierKey) ?? tierOptions[0]

  const cashTotal = groceries + delivery + waste + utilities
  const timeValue = hourlyValue * hoursPerMonth
  const totalToday = cashTotal + timeValue
  const ourService = tier?.monthlyGs ?? 0
  const savings = totalToday - ourService
  const hoursRecovered = Math.max(0, hoursPerMonth - 8)

  const whatsappHref = useMemo(() => {
    if (!whatsappPhone) return undefined
    const lines = [
      'Hola! Hice el calculador en el sitio y quiero seguir:',
      `- Personas en el hogar: ${household}`,
      `- Plata real hoy: Gs. ${formatGs(cashTotal)}`,
      `- Valor de tiempo: Gs. ${formatGs(timeValue)} (${hoursPerMonth} hrs x ${formatGs(hourlyValue)})`,
      `- Costo TOTAL hoy: Gs. ${formatGs(totalToday)}`,
      `- Plan elegido: ${tier?.label ?? ''}`,
      `- Ahorro estimado: Gs. ${formatGs(savings)}`,
    ]
    const base = (whatsappMessageTemplate || lines.join('\n')).trim()
    const text = whatsappMessageTemplate
      ? base
      : lines.join('\n')
    const cleanPhone = whatsappPhone.replace(/[^0-9]/g, '')
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
  }, [whatsappPhone, whatsappMessageTemplate, household, cashTotal, timeValue, hoursPerMonth, hourlyValue, totalToday, tier, savings])

  const positive = savings > 0

  const l = {
    groceriesLabel: inputLabels.groceriesLabel ?? 'Super + carniceria + feria (mes)',
    deliveryLabel: inputLabels.deliveryLabel ?? 'Delivery + comer afuera (mes)',
    wasteLabel: inputLabels.wasteLabel ?? 'Comida tirada + impulsivas (mes)',
    utilitiesLabel: inputLabels.utilitiesLabel ?? 'Gas/luz extra cocinando (mes)',
    householdLabel: inputLabels.householdLabel ?? 'Personas en el hogar',
    hourlyValueLabel: inputLabels.hourlyValueLabel ?? 'Valor de tu hora (Gs.)',
    hoursPerMonthLabel: inputLabels.hoursPerMonthLabel ?? 'Horas/mes cocinando + comprando',
    tierLabel: inputLabels.tierLabel ?? 'Nivel a comparar',
  }

  const o = {
    cashTotalLabel: outputLabels.cashTotalLabel ?? 'Plata real hoy',
    timeValueLabel: outputLabels.timeValueLabel ?? 'Valor de tu tiempo hoy',
    totalTodayLabel: outputLabels.totalTodayLabel ?? 'Costo TOTAL hoy',
    ourServiceLabel: outputLabels.ourServiceLabel ?? 'Nuestro servicio (mes)',
    savingsLabel: outputLabels.savingsLabel ?? 'Ahorro mensual estimado',
    hoursRecoveredLabel: outputLabels.hoursRecoveredLabel ?? 'Horas recuperadas por mes',
    negativeCopy: outputLabels.negativeCopy ?? 'Hoy ya sos muy eficiente. Probablemente no te conviene - pero si queres probar 1 mes sin compromiso, escribinos igual.',
    positiveCopy: outputLabels.positiveCopy ?? 'Si tu ahorro es grande, tiene sentido probar 1 mes sin compromiso.',
    ctaText: outputLabels.ctaText ?? 'Seguir por WhatsApp con mis numeros',
  }

  return (
    <section id="calculadora" className="scroll-mt-24 bg-[var(--background)] py-16 sm:py-20">
      <Container size="md">
        <AnimatedSectionHeader>
          <Heading level={2}>{title}</Heading>
          {subtitle && (
            <p className="mt-3 text-center text-[var(--text-light)]">{subtitle}</p>
          )}
        </AnimatedSectionHeader>

        <div className="mx-auto mt-10 grid max-w-5xl gap-8 rounded-2xl border border-[var(--surface-light)] bg-[var(--surface)] p-6 shadow-card md:grid-cols-2 md:p-8">
          {/* Inputs */}
          <div className="space-y-5">
            <NumberField
              label={l.groceriesLabel}
              value={groceries}
              onChange={setGroceries}
              step={50_000}
              suffix="Gs."
            />
            <NumberField
              label={l.deliveryLabel}
              value={delivery}
              onChange={setDelivery}
              step={50_000}
              suffix="Gs."
            />
            <NumberField
              label={l.wasteLabel}
              value={waste}
              onChange={setWaste}
              step={25_000}
              suffix="Gs."
            />
            <NumberField
              label={l.utilitiesLabel}
              value={utilities}
              onChange={setUtilities}
              step={25_000}
              suffix="Gs."
            />
            <NumberField
              label={l.householdLabel}
              value={household}
              onChange={setHousehold}
              step={1}
              min={1}
              max={12}
            />
            <NumberField
              label={l.hourlyValueLabel}
              value={hourlyValue}
              onChange={setHourlyValue}
              step={5_000}
              suffix="Gs./hr"
            />
            <NumberField
              label={l.hoursPerMonthLabel}
              value={hoursPerMonth}
              onChange={setHoursPerMonth}
              step={5}
              suffix="hrs"
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text)]">
                {l.tierLabel}
              </label>
              <select
                value={tierKey}
                onChange={(e) => setTierKey(e.target.value)}
                className="w-full rounded-lg border border-[var(--surface-light)] bg-[var(--background)] px-4 py-3 text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
              >
                {tierOptions.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Outputs */}
          <div className="flex flex-col justify-between gap-6 rounded-xl bg-[var(--background)] p-6">
            <div className="space-y-3 text-sm">
              <ResultRow label={o.cashTotalLabel} value={`Gs. ${formatGs(cashTotal)}`} />
              <ResultRow label={o.timeValueLabel} value={`Gs. ${formatGs(timeValue)}`} />
              <div className="border-t border-[var(--surface-light)] pt-3">
                <ResultRow label={o.totalTodayLabel} value={`Gs. ${formatGs(totalToday)}`} bold />
              </div>
              <ResultRow label={o.ourServiceLabel} value={`Gs. ${formatGs(ourService)}`} />
            </div>

            <div className="rounded-lg bg-[var(--surface)] p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-[var(--text-light)]">
                {o.savingsLabel}
              </p>
              <p
                className="mt-1 text-3xl font-bold"
                style={{ color: positive ? 'var(--primary)' : 'var(--text-light)' }}
              >
                {positive ? '+' : ''}Gs. {formatGs(savings)}
              </p>
              <p className="mt-3 text-sm text-[var(--text-light)]">
                {o.hoursRecoveredLabel}:{' '}
                <span className="font-semibold text-[var(--text)]">~{hoursRecovered} hrs</span>
              </p>
            </div>

            <p className="text-sm italic leading-relaxed text-[var(--text-light)]">
              {positive ? o.positiveCopy : o.negativeCopy}
            </p>

            {whatsappHref && (
              <Button
                variant="primary"
                size="lg"
                href={whatsappHref}
              >
                {o.ctaText}
              </Button>
            )}
          </div>
        </div>

        {disclaimer && (
          <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-[var(--text-light)]">
            {disclaimer}
          </p>
        )}
      </Container>
    </section>
  )
}

function NumberField({
  label,
  value,
  onChange,
  step = 1,
  min = 0,
  max,
  suffix,
}: {
  label: string
  value: number
  onChange: (n: number) => void
  step?: number
  min?: number
  max?: number
  suffix?: string
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[var(--text)]">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          step={step}
          min={min}
          max={max}
          onChange={(e) => {
            const n = Number(e.target.value)
            if (!Number.isFinite(n)) return
            onChange(n)
          }}
          className="w-full rounded-lg border border-[var(--surface-light)] bg-[var(--background)] px-4 py-3 text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
        />
        {suffix && (
          <span className="shrink-0 text-sm text-[var(--text-light)]">{suffix}</span>
        )}
      </div>
    </div>
  )
}

function ResultRow({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[var(--text-light)]">{label}</span>
      <span
        className="text-[var(--text)]"
        style={{ fontWeight: bold ? 700 : 500 }}
      >
        {value}
      </span>
    </div>
  )
}
