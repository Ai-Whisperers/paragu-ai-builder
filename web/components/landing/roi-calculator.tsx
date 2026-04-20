'use client'

import { useState } from 'react'
import { Calculator, TrendingUp } from 'lucide-react'
import { Heading } from '@/components/ui/heading'
import { PLANS } from '@/lib/landing/marketing-data'

const PRESENCIA = PLANS.find((p) => p.id === 'presencia')!
const CRECIMIENTO = PLANS.find((p) => p.id === 'crecimiento')!

const PLAN_COSTS = {
  presencia: { setup: 650_000, monthly: 100_000, name: PRESENCIA.name },
  crecimiento: { setup: 1_200_000, monthly: 150_000, name: CRECIMIENTO.name },
} as const

/**
 * Interactive ROI calculator. Asks the visitor for their average ticket and
 * the number of new clients they expect from the website per month, then
 * shows how many months of incremental revenue cover the setup, and the
 * year-1 net.
 *
 * Defaults are deliberately conservative (avg ticket Gs 250.000, 4 new
 * clients/mo) so the math stays believable for a beauty/wellness SMB —
 * the persona target in docs/02_TARGET_CUSTOMER.md.
 */
export function ROICalculator() {
  const [ticket, setTicket] = useState(250_000)
  const [newClients, setNewClients] = useState(4)
  const [planKey, setPlanKey] = useState<'presencia' | 'crecimiento'>('presencia')

  const plan = PLAN_COSTS[planKey]
  const monthlyRevenue = ticket * newClients
  const monthlyNet = monthlyRevenue - plan.monthly
  const breakEvenMonths = monthlyNet > 0 ? Math.ceil(plan.setup / monthlyNet) : Infinity
  const year1Net = monthlyNet * 12 - plan.setup

  const fmt = (n: number) =>
    Number.isFinite(n)
      ? `Gs ${Math.round(n).toLocaleString('es-PY')}`
      : '— no recupera'

  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-[var(--primary-foreground)]">
          <Calculator size={22} />
        </div>
        <div>
          <Heading level={3} className="text-xl">¿Cuándo se paga sola?</Heading>
          <p className="text-sm text-[var(--text-muted)]">
            Estimá tu retorno con tus números reales.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[var(--text)]">
            Ticket promedio (Gs)
          </span>
          <input
            type="number"
            min={0}
            step={10_000}
            value={ticket}
            onChange={(e) => setTicket(Math.max(0, Number(e.target.value)))}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--text)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[var(--text)]">
            Clientes nuevos por mes (gracias al sitio)
          </span>
          <input
            type="number"
            min={0}
            value={newClients}
            onChange={(e) => setNewClients(Math.max(0, Number(e.target.value)))}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--text)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          />
        </label>

        <div className="md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-[var(--text)]">Plan</span>
          <div className="grid grid-cols-2 gap-3">
            {(['presencia', 'crecimiento'] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setPlanKey(key)}
                className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all ${
                  planKey === key
                    ? 'border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--text)]'
                    : 'border-[var(--border)] text-[var(--text-light)] hover:border-[var(--primary)]/50'
                }`}
              >
                {PLAN_COSTS[key].name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 rounded-2xl bg-[var(--surface-light)] p-6 sm:grid-cols-3">
        <Stat label="Ingreso extra mensual" value={fmt(monthlyRevenue)} />
        <Stat label="Neto mensual (después del plan)" value={fmt(monthlyNet)} highlight={monthlyNet > 0} />
        <Stat
          label="Se paga el setup en"
          value={Number.isFinite(breakEvenMonths) ? `${breakEvenMonths} mes${breakEvenMonths === 1 ? '' : 'es'}` : '—'}
        />
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[var(--text-muted)]">
        <TrendingUp size={16} className="text-[var(--success)]" />
        <span>
          Año 1 neto estimado:{' '}
          <strong className={year1Net > 0 ? 'text-[var(--success)]' : 'text-[var(--text)]'}>
            {fmt(year1Net)}
          </strong>
        </span>
      </div>

      <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
        Estimación referencial · no incluye impuestos ni gastos operativos del propio servicio.
      </p>
    </div>
  )
}

function Stat({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="text-center">
      <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">{label}</p>
      <p
        className={`mt-1 text-xl font-bold md:text-2xl ${
          highlight ? 'text-[var(--success)]' : 'text-[var(--text)]'
        }`}
      >
        {value}
      </p>
    </div>
  )
}
