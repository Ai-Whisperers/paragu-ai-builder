'use client'

import { useEffect, useState } from 'react'
import { Eye, Users, TrendingUp, Calendar } from 'lucide-react'

interface AnalyticsData {
  events: Array<{ event_type: string; count: number }>
  totalEvents: number
  lastUpdated: string
}

const EVENT_ICONS: Record<string, { icon: typeof Eye; color: string; label: string }> = {
  page_view: { icon: Eye, color: 'text-blue-600', label: 'Vistas de página' },
  lead_created: { icon: Users, color: 'text-green-600', label: 'Nuevos leads' },
  whatsapp_click: { icon: TrendingUp, color: 'text-amber-600', label: 'Clics WhatsApp' },
  booking_created: { icon: Calendar, color: 'text-purple-600', label: 'Reservas' },
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/portal/analytics')
      .then((r) => r.json())
      .then((d) => {
        setData(d)
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

  const events = data?.events ?? []
  const totalEvents = data?.totalEvents ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analíticas</h1>
        <p className="mt-1 text-sm text-gray-500">
          Actividad de los últimos 30 días · {totalEvents} evento{totalEvents !== 1 ? 's' : ''} registrados
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {events.length > 0 ? events.map((ev) => {
          const meta = EVENT_ICONS[ev.event_type] || {
            icon: TrendingUp,
            color: 'text-gray-600',
            label: ev.event_type,
          }
          const Icon = meta.icon
          return (
            <div key={ev.event_type} className="rounded-xl border bg-white p-5">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-gray-50 p-2.5">
                  <Icon className={`h-5 w-5 ${meta.color}`} />
                </div>
                <span className="text-2xl font-bold text-gray-900">{ev.count}</span>
              </div>
              <p className="mt-3 text-sm text-gray-600">{meta.label}</p>
            </div>
          )
        }) : (
          <div className="col-span-full rounded-xl border bg-white p-12 text-center text-gray-500">
            No hay datos de analítica disponibles para este período.
          </div>
        )}
      </div>

      <div className="rounded-xl border bg-white p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Desglose por evento</h3>
        {events.length === 0 ? (
          <p className="text-sm text-gray-500">Sin datos</p>
        ) : (
          <div className="space-y-3">
            {events.map((ev) => {
              const pct = totalEvents > 0 ? Math.round((ev.count / totalEvents) * 100) : 0
              return (
                <div key={ev.event_type}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700">{ev.event_type}</span>
                    <span className="text-gray-500">{ev.count} ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-blue-600 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {data?.lastUpdated && (
        <p className="text-xs text-gray-400 text-right">
          Última actualización: {new Date(data.lastUpdated).toLocaleString('es-PY')}
        </p>
      )}
    </div>
  )
}
