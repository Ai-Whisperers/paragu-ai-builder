'use client'

import { formatGs } from '@/lib/format'
import type { BaseCalculatorSectionProps } from '@/types/sections'
import { CalculatorShell, type CalculatorResultRow } from './calculator-shell'

export interface CalcAguinaldoSectionProps extends BaseCalculatorSectionProps {
  labels?: Record<string, {
    eyebrow: string
    title: string
    subtitle: string
    monthlySalaryLabel: string
    monthsWorkedLabel: string
    extrasLabel: string
    aguinaldoLabel: string
    ipsLabel: string
    netLabel: string
    employerCostLabel: string
    disclaimer: string
    cta: string
    whatsappCta: string
  }>
}

const LABELS = {
  es: {
    eyebrow: 'Calculadora Aguinaldo',
    title: 'Calcula tu aguinaldo 2026',
    subtitle: 'Art. 243 del Codigo del Trabajo: 1/12 del total anual de remuneraciones. Se paga antes del 31 de diciembre.',
    monthlySalaryLabel: 'Sueldo mensual bruto (Gs)',
    monthsWorkedLabel: 'Meses trabajados en el ano (1-12)',
    extrasLabel: 'Comisiones + horas extra + bonificaciones anuales (Gs)',
    aguinaldoLabel: 'Aguinaldo bruto',
    ipsLabel: 'Descuento IPS obrero (9%)',
    netLabel: 'Aguinaldo neto a cobrar',
    employerCostLabel: 'Costo total para el empleador',
    disclaimer: 'Calculo referencial segun CT art. 243. Casos especiales requieren revision por contador.',
    cta: 'Cotizar liquidacion de sueldos',
    whatsappCta: 'Consultar por WhatsApp',
  },
  en: {
    eyebrow: 'Aguinaldo Calculator',
    title: 'Calculate your Paraguay 13th-salary',
    subtitle: 'Labor Code Art. 243: 1/12 of the annual total salary. Due before December 31st.',
    monthlySalaryLabel: 'Gross monthly salary (PYG)',
    monthsWorkedLabel: 'Months worked in the year (1-12)',
    extrasLabel: 'Commissions + overtime + bonuses (annual, PYG)',
    aguinaldoLabel: 'Gross aguinaldo',
    ipsLabel: 'IPS worker deduction (9%)',
    netLabel: 'Net aguinaldo',
    employerCostLabel: 'Total employer cost',
    disclaimer: 'Reference calculation per CT art. 243. Special cases require accountant review.',
    cta: 'Quote payroll services',
    whatsappCta: 'Chat on WhatsApp',
  },
  pt: {
    eyebrow: 'Calculadora Aguinaldo',
    title: 'Calcule seu 13o salario paraguaio',
    subtitle: 'Art. 243 Codigo do Trabalho: 1/12 do total anual de remuneracoes.',
    monthlySalaryLabel: 'Salario mensal bruto (PYG)',
    monthsWorkedLabel: 'Meses trabalhados no ano (1-12)',
    extrasLabel: 'Comissoes + horas extras + bonus (anual, PYG)',
    aguinaldoLabel: 'Aguinaldo bruto',
    ipsLabel: 'Desconto IPS trabalhador (9%)',
    netLabel: 'Aguinaldo liquido',
    employerCostLabel: 'Custo total empregador',
    disclaimer: 'Calculo referencial. Casos especiais requerem revisao por contador.',
    cta: 'Cotizar folha de pagamento',
    whatsappCta: 'Falar no WhatsApp',
  },
}

export function CalcAguinaldoSection({
  eyebrow, title, subtitle, disclaimer, ctaLabel, ctaHref, whatsapp, __locale, labels: labelsProp,
}: CalcAguinaldoSectionProps) {
  const resolvedLabels = labelsProp ?? LABELS
  const locale = (__locale && __locale in resolvedLabels ? __locale : 'es') as keyof typeof resolvedLabels
  const L = resolvedLabels[locale]
  const whatsappMsg = 'Hola, necesito ayuda con la liquidacion de aguinaldo y sueldos de mi empresa.'

  return (
    <CalculatorShell
      eyebrow={eyebrow || L.eyebrow}
      title={title || L.title}
      subtitle={subtitle || L.subtitle}
      disclaimer={disclaimer || L.disclaimer}
      ctaLabel={ctaLabel || L.cta}
      ctaHref={ctaHref}
      whatsapp={whatsapp}
      whatsappMessage={whatsappMsg}
      resultHeading={L.netLabel}
      fields={[
        { key: 'monthlySalary', label: L.monthlySalaryLabel, type: 'number', defaultValue: 3_500_000, min: 0, step: 100_000 },
        { key: 'monthsWorked', label: L.monthsWorkedLabel, type: 'number', defaultValue: 12, min: 1, max: 12, step: 1 },
        { key: 'extras', label: L.extrasLabel, type: 'number', defaultValue: 0, min: 0, step: 100_000 },
      ]}
      compute={(values) => {
        const salary = (values.monthlySalary as number) || 0
        const months = (values.monthsWorked as number) || 1
        const extras = (values.extras as number) || 0
        const totalAnnual = salary * months + extras
        const aguinaldo = totalAnnual / 12
        const ipsDeduction = aguinaldo * 0.09
        const netAguinaldo = aguinaldo - ipsDeduction
        const employerCost = aguinaldo + aguinaldo * 0.165

        return [
          { label: L.aguinaldoLabel, value: formatGs(Math.round(aguinaldo)) },
          { label: L.ipsLabel, value: `- ${formatGs(Math.round(ipsDeduction))}` },
          { label: L.netLabel, value: formatGs(Math.round(netAguinaldo)), highlighted: true },
          { label: L.employerCostLabel, value: formatGs(Math.round(employerCost)), muted: true },
        ] as CalculatorResultRow[]
      }}
    />
  )
}
