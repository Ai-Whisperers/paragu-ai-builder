# Plan: Extract CalculatorShell Component From 13 Duplicated Calculators

## Current State

There are 13 calculator sections in `web/components/sections/calculators/` and `web/components/sections/specialty/`:

| File | Lines | Type |
|---|---|---|
| `calc-aguinaldo-section.tsx` | 232 | Paraguay labor (13th salary) |
| `calc-irp-section.tsx` | 294 | Paraguay income tax |
| `calc-ips-section.tsx` | ~200 | Paraguay social security |
| `calc-ire-section.tsx` | ~200 | Paraguay business tax |
| `calc-iva-section.tsx` | ~200 | Paraguay VAT |
| `calc-finiquito-section.tsx` | 275 | Paraguay severance |
| `calc-costo-empleado-section.tsx` | ~200 | Paraguay employer cost |
| `calc-resimple-qualifier-section.tsx` | ~200 | Paraguay simplified tax |
| `tax-savings-calculator-section.tsx` | 306 | Relocation tax comparison |
| `savings-calculator-section.tsx` | ~200 | Generic savings |
| `mortgage-calculator-section.tsx` | ~200 | Mortgage calculator |
| `bulk-calculator-section.tsx` | ~200 | Bulk pricing |
| `delivery-calculator-section.tsx` | 279 | Egg farm delivery zones |

### Duplicated Patterns (in EVERY calculator)

- `useState` for each input field
- `useMemo` for computing results
- Container with `bg-[var(--surface)]` + `py-16 sm:py-20`
- `Container` + `Heading` + `AnimatedSectionHeader` wrapper
- Grid layout for inputs (2 columns on desktop)
- Results section with formatted numbers
- WhatsApp CTA button
- Disclaimer text block
- `formatGs()` calls for PYG display
- `BaseCalculatorSectionProps` extension

## Proposed Solution

Extract a `CalculatorShell` component that provides the layout, input grid, results display, and CTA — calculators only supply the compute function and label config.

### New Component: `web/components/sections/calculators/calculator-shell.tsx`

```typescript
export interface CalculatorField {
  key: string
  label: string
  type?: 'number' | 'select' | 'text'
  defaultValue?: number | string
  min?: number
  max?: number
  options?: Array<{ value: string; label: string }>
}

export interface CalculatorResultRow {
  label: string
  value: string
  highlighted?: boolean
}

export interface CalculatorShellProps {
  eyebrow?: string
  title: string
  subtitle?: string
  fields: CalculatorField[]
  compute: (values: Record<string, number | string>) => CalculatorResultRow[]
  disclaimer?: string
  ctaLabel?: string
  ctaHref?: string
  whatsapp?: string
  whatsappMessage?: string
  resultHeading?: string
}
```

### Example Usage: `calc-aguinaldo-section.tsx` after refactor

```typescript
export function CalcAguinaldoSection(props: CalcAguinaldoSectionProps) {
  const L = LABELS[__locale ?? 'es']

  return (
    <CalculatorShell
      eyebrow={L.eyebrow}
      title={L.title}
      subtitle={L.subtitle}
      disclaimer={L.disclaimer}
      ctaLabel={L.cta}
      whatsapp={whatsapp}
      fields={[
        { key: 'monthlySalary', label: L.monthlySalaryLabel, type: 'number', defaultValue: 3_500_000, min: 0 },
        { key: 'monthsWorked', label: L.monthsWorkedLabel, type: 'number', defaultValue: 12, min: 1, max: 12 },
        { key: 'extras', label: L.extrasLabel, type: 'number', defaultValue: 0, min: 0 },
      ]}
      compute={(values) => {
        const salary = values.monthlySalary as number
        const months = values.monthsWorked as number
        const extras = values.extras as number
        const total = salary * months + extras
        const aguinaldo = total / 12
        const ips = aguinaldo * 0.09
        return [
          { label: L.aguinaldoLabel, value: formatGs(aguinaldo), highlighted: true },
          { label: L.ipsLabel, value: `-${formatGs(ips)}` },
          { label: L.netLabel, value: formatGs(aguinaldo - ips) },
        ]
      }}
    />
  )
}
```

### CalculatorShell Implementation

```typescript
'use client'

import { useState, useMemo } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'

export function CalculatorShell({
  eyebrow, title, subtitle, fields, compute,
  disclaimer, ctaLabel, ctaHref = '#contacto', whatsapp,
  whatsappMessage, resultHeading,
}: CalculatorShellProps) {
  const initial = Object.fromEntries(fields.map(f => [f.key, f.defaultValue ?? 0]))
  const [values, setValues] = useState<Record<string, number | string>>(initial)

  const results = useMemo(() => compute(values), [values, compute])

  return (
    <section className="bg-[var(--surface)] py-16 sm:py-20">
      <Container>
        <AnimatedSectionHeader>
          {eyebrow && <p className="text-sm font-semibold uppercase tracking-wider text-[var(--secondary)] mb-2">{eyebrow}</p>}
          <Heading level={2}>{title}</Heading>
          {subtitle && <p className="mx-auto mt-4 max-w-2xl text-[var(--text-muted)]">{subtitle}</p>}
        </AnimatedSectionHeader>

        <div className="mx-auto mt-10 max-w-3xl">
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">{f.label}</label>
                <input
                  type={f.type || 'number'}
                  value={values[f.key]}
                  onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
                  min={f.min}
                  max={f.max}
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                />
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-2 rounded-lg bg-[var(--surface-light)] p-6">
            {resultHeading && <p className="text-sm font-semibold text-[var(--text-muted)] mb-3">{resultHeading}</p>}
            {results.map((r, i) => (
              <div key={i} className={`flex justify-between text-sm ${r.highlighted ? 'text-lg font-bold text-[var(--primary)]' : ''}`}>
                <span>{r.label}</span>
                <span>{r.value}</span>
              </div>
            ))}
          </div>

          {disclaimer && <p className="mt-4 text-xs text-[var(--text-muted)] italic">{disclaimer}</p>}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {ctaLabel && (
              <Button as="a" href={ctaHref} size="lg">{ctaLabel}</Button>
            )}
            {whatsapp && (
              <Button as="a" href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage || '')}`} variant="outline" size="lg">
                Consultar por WhatsApp
              </Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
```

## Migration Strategy

1. Create `calculator-shell.tsx`
2. Migrate one calculator at a time (start with `calc-aguinaldo` as proof of concept)
3. After each migration, verify it renders identically
4. Once all migrated, remove duplicated layout/CTA code

## Files to Touch

| File | Change |
|---|---|
| `web/components/sections/calculators/calculator-shell.tsx` | NEW |
| `web/components/sections/calculators/calc-aguinaldo-section.tsx` | Refactor to use shell |
| `web/components/sections/calculators/calc-irp-section.tsx` | Refactor to use shell |
| `web/components/sections/calculators/calc-ips-section.tsx` | Refactor to use shell |
| `web/components/sections/calculators/calc-ire-section.tsx` | Refactor to use shell |
| `web/components/sections/calculators/calc-iva-section.tsx` | Refactor to use shell |
| `web/components/sections/calculators/calc-finiquito-section.tsx` | Refactor to use shell |
| `web/components/sections/calculators/calc-costo-empleado-section.tsx` | Refactor to use shell |
| `web/components/sections/calculators/calc-resimple-qualifier-section.tsx` | Refactor to use shell |
| `web/components/sections/calculators/tax-savings-calculator-section.tsx` | Refactor to use shell |
| `web/components/sections/calculators/savings-calculator-section.tsx` | Refactor to use shell |
| `web/components/sections/calculators/mortgage-calculator-section.tsx` | Refactor to use shell |
| `web/components/sections/calculators/bulk-calculator-section.tsx` | Refactor to use shell |
| `web/components/sections/specialty/delivery-calculator-section.tsx` | Refactor to use shell |

## Estimated Effort

- Shell component: 1 hour
- Per-calculator migration: ~15-20 min each (13 calculators = ~3-4 hours)
- Total: ~5 hours

## Success Criteria

- [ ] All 13 calculators render identically to current version
- [ ] No duplicated layout/input/CTA code across calculators
- [ ] Adding a new calculator requires only: define fields + compute function
- [ ] Build passes, typecheck clean
