/**
 * Paraguay tax calendar — DNIT (ex-SET), IPS, MTESS monthly deadlines.
 *
 * Source: DNIT "Calendario Perpetuo" (2024+). Day-of-month varies by last
 * digit of RUC for IVA/IRP/IRE; we use the median day (7th-21st working
 * day) here. Real tenant sites should surface the per-RUC schedule.
 * Updated annually when DNIT publishes the new calendar.
 */

export type PyTaxDeadlineKind = 'iva' | 'ire' | 'irp' | 'idu' | 'ips' | 'mtess' | 'timbrado' | 'patente'

export interface PyTaxDeadline {
  /** 1-12 */
  month: number
  /** Day of month (DNIT: varies by RUC last digit, 7th-21st). */
  dayRange: [number, number]
  kind: PyTaxDeadlineKind
  label: string
  description: string
  appliesTo: string
}

/**
 * 2026 Paraguay tax calendar. All deadlines fall in the month following
 * the obligation period (e.g. IVA for January is due in February).
 */
export const PY_TAX_CALENDAR_2026: PyTaxDeadline[] = [
  // Monthly recurring — IVA (every month, for previous month)
  ...Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    dayRange: [7, 21] as [number, number],
    kind: 'iva' as const,
    label: 'IVA mensual',
    description: `Declaracion jurada IVA (F. 120) — periodo ${monthNameEs(i === 0 ? 12 : i)}`,
    appliesTo: 'Contribuyentes IVA general y retenciones',
  })),
  // Monthly — IPS (aporte del mes anterior, vence 10 del mes siguiente)
  ...Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    dayRange: [10, 10] as [number, number],
    kind: 'ips' as const,
    label: 'IPS — aportes patronales',
    description: `Aportes IPS (9% obrero + 16.5% patronal) — periodo ${monthNameEs(i === 0 ? 12 : i)}`,
    appliesTo: 'Empleadores con personal en relacion de dependencia',
  })),
  // Monthly — MTESS REOP (obligatorio desde 2025)
  ...Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    dayRange: [15, 15] as [number, number],
    kind: 'mtess' as const,
    label: 'REOP — liquidaciones salariales',
    description: `Comunicacion REOP al MTESS — periodo ${monthNameEs(i === 0 ? 12 : i)}`,
    appliesTo: 'Empleadores (obligatorio desde 2025)',
  })),
  // Annual — IRE (cierre 31-dic, vence abril)
  {
    month: 4,
    dayRange: [7, 21],
    kind: 'ire',
    label: 'IRE anual',
    description: 'Declaracion jurada anual IRE General / Simple / RESIMPLE (F. 501/502/503) — ejercicio anterior',
    appliesTo: 'Personas juridicas y unipersonales obligadas',
  },
  // Annual — IRP (vence marzo)
  {
    month: 3,
    dayRange: [7, 21],
    kind: 'irp',
    label: 'IRP anual',
    description: 'Declaracion jurada anual IRP RSP + RGC (F. 104) — ejercicio anterior',
    appliesTo: 'Personas fisicas con ingresos sobre umbral (Gs. 80M/ano)',
  },
  // Patente comercial municipal (varies by municipio; Asuncion: marzo-abril)
  {
    month: 4,
    dayRange: [1, 30],
    kind: 'patente',
    label: 'Patente comercial municipal',
    description: 'Pago anual de patente comercial — consultar municipio',
    appliesTo: 'Todas las empresas con habilitacion municipal',
  },
  // Aguinaldo — obligatorio hasta 31-dic
  {
    month: 12,
    dayRange: [1, 31],
    kind: 'mtess',
    label: 'Aguinaldo (13er sueldo)',
    description: 'Pago obligatorio del aguinaldo antes del 31 de diciembre',
    appliesTo: 'Empleadores con personal en relacion de dependencia',
  },
]

function monthNameEs(m: number): string {
  const names = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre']
  return names[(m - 1 + 12) % 12]
}

/**
 * Return the next N upcoming deadlines relative to a reference date.
 * Pure function — no Date side effects beyond the passed-in reference.
 */
export function getUpcomingDeadlines(now: Date, limit = 3): Array<PyTaxDeadline & { date: Date; daysAway: number }> {
  const enriched: Array<PyTaxDeadline & { date: Date; daysAway: number }> = []
  const currentYear = now.getFullYear()

  // Look across current + next year so December always has upcoming items
  for (const year of [currentYear, currentYear + 1]) {
    for (const d of PY_TAX_CALENDAR_2026) {
      const date = new Date(year, d.month - 1, d.dayRange[1])
      const daysAway = Math.floor((date.getTime() - now.getTime()) / 86400000)
      if (daysAway >= 0 && daysAway <= 400) {
        enriched.push({ ...d, date, daysAway })
      }
    }
  }

  enriched.sort((a, b) => a.daysAway - b.daysAway)
  return enriched.slice(0, limit)
}

/**
 * Return all deadlines that fall in a given month (for calendar-grid views).
 */
export function getDeadlinesForMonth(month: number): PyTaxDeadline[] {
  return PY_TAX_CALENDAR_2026.filter((d) => d.month === month)
}
