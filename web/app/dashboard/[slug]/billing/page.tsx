'use client'

import { useEffect, useState } from 'react'
import { CreditCard, CircleCheck, CircleX, Clock } from 'lucide-react'

interface Subscription {
  id: string
  plan_tier: string
  plan_name: string
  price_monthly: number
  status: string
  trial_ends_at: string | null
  current_period_end: string
  canceled_at: string | null
  created_at: string
}

interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  paid_at: string | null
  created_at: string
}

const PLAN_LABELS: Record<string, string> = {
  free: 'Gratuito',
  starter: 'Starter',
  professional: 'Professional',
  enterprise: 'Enterprise',
}

const STATUS_CONFIG: Record<string, { label: string; icon: typeof CircleCheck; color: string }> = {
  active: { label: 'Activo', icon: CircleCheck, color: 'text-green-600' },
  trialing: { label: 'Período de prueba', icon: Clock, color: 'text-blue-600' },
  past_due: { label: 'Vencido', icon: CircleX, color: 'text-red-600' },
  canceled: { label: 'Cancelado', icon: CircleX, color: 'text-gray-500' },
  paused: { label: 'Pausado', icon: Clock, color: 'text-amber-600' },
}

const PAYMENT_STATUS: Record<string, { label: string; color: string }> = {
  completed: { label: 'Pagado', color: 'text-green-600' },
  pending: { label: 'Pendiente', color: 'text-amber-600' },
  failed: { label: 'Fallido', color: 'text-red-600' },
  refunded: { label: 'Reintegrado', color: 'text-gray-500' },
}

function formatPrice(amount: number, currency: string): string {
  if (currency === 'PYG' || !currency) return `Gs ${amount.toLocaleString('es-PY')}`
  return `$${amount.toFixed(2)}`
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-PY', {
    year: 'numeric', month: 'long', day: '2-digit',
  })
}

export default function BillingPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/portal/subscription')
      .then((r) => r.json())
      .then((d) => {
        setSubscription(d.subscription)
        setPayments(d.payments ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Facturación</h1>
        <p className="mt-1 text-sm text-gray-500">
          Plan y pagos de tu suscripción
        </p>
      </div>

      {!subscription ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          <CreditCard className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500">No tenés un plan activo.</p>
          <p className="mt-2 text-sm text-gray-400">
            Contactá a tu administrador para configurar tu suscripción.
          </p>
        </div>
      ) : (
        <>
          {/* Current plan */}
          <div className="rounded-xl border bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Plan actual</h2>
                <p className="mt-1 text-sm text-gray-500">
                  {PLAN_LABELS[subscription.plan_tier] || subscription.plan_tier}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(subscription.price_monthly, 'PYG')}
                </p>
                <p className="text-xs text-gray-500">por mes</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Estado</p>
                <div className="mt-1 flex items-center gap-1.5">
                  {(() => {
                    const cfg = STATUS_CONFIG[subscription.status] || STATUS_CONFIG.active
                    const Icon = cfg.icon
                    return (
                      <>
                        <Icon className={`h-4 w-4 ${cfg.color}`} />
                        <span className={`text-sm font-medium ${cfg.color}`}>{cfg.label}</span>
                      </>
                    )
                  })()}
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Inicio</p>
                <p className="mt-1 text-sm font-medium text-gray-900">{formatDate(subscription.created_at)}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Próximo ciclo</p>
                <p className="mt-1 text-sm font-medium text-gray-900">{formatDate(subscription.current_period_end)}</p>
              </div>
            </div>
          </div>

          {/* Payment history */}
          <div className="rounded-xl border bg-white">
            <div className="border-b px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Historial de pagos</h2>
            </div>
            {payments.length === 0 ? (
              <div className="p-12 text-center text-sm text-gray-500">
                No hay pagos registrados.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="px-6 py-3">Monto</th>
                      <th className="px-6 py-3">Estado</th>
                      <th className="px-6 py-3">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {payments.map((p) => {
                      const ps = PAYMENT_STATUS[p.status] || { label: p.status, color: 'text-gray-500' }
                      return (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="px-6 py-3 font-medium text-gray-900">
                            {formatPrice(p.amount, p.currency)}
                          </td>
                          <td className="px-6 py-3">
                            <span className={`text-sm font-medium ${ps.color}`}>{ps.label}</span>
                          </td>
                          <td className="px-6 py-3 text-gray-500">
                            {formatDate(p.paid_at || p.created_at)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
