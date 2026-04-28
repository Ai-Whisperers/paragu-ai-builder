'use client'

import { useEffect, useState } from 'react'
import { Eye, Users, TrendingUp, Calendar, Download } from 'lucide-react'

interface AnalyticsData {
  events: Array<{ event_type: string; count: number }>
  totalEvents: number
  lastUpdated: string
}

interface TimeSeriesData {
  series: Array<{ event_type: string; data: Array<{ date: string; count: number }> }>
  totalDays: string[]
}

const EVENT_ICONS: Record<string, { icon: typeof Eye; color: string; label: string }> = {
  page_view: { icon: Eye, color: 'text-blue-600', label: 'Vistas de página' },
  lead_created: { icon: Users, color: 'text-green-600', label: 'Nuevos leads' },
  whatsapp_click: { icon: TrendingUp, color: 'text-amber-600', label: 'Clics WhatsApp' },
  booking_created: { icon: Calendar, color: 'text-purple-600', label: 'Reservas' },
}

function Sparkline({ data, color }: { data: Array<{ count: number }>; color: string }) {
  if (data.length === 0) return null
  const max = Math.max(...data.map((d) => d.count), 1)
  const w = 160
  const h = 32
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * w
    const y = h - (d.count / max) * h
    return `${x},${y}`
  }).join(' ')
  const area = data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * w
    const y = h - (d.count / max) * h
    return `${i === 0 ? 'M' : 'L'}${x},${y}`
  }).join(' ') + ` L${w},${h} L0,${h} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-8">
      <path d={area} fill={`${color}20`} />
      <path d={`M${points}`} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  )
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [timeseries, setTimeseries] = useState<TimeSeriesData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/portal/analytics').then((r) => r.json()),
      fetch('/api/portal/analytics/timeseries').then((r) => r.json()),
    ]).then(([d, ts]) => {
      setData(d)
      setTimeseries(ts)
      setLoading(false)
    }).catch(() => setLoading(false))
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analíticas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Actividad de los últimos 30 días · {totalEvents} evento{totalEvents !== 1 ? 's' : ''} registrados
          </p>
        </div>
        <a
          href="/api/portal/export?type=analytics"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Download className="h-4 w-4" />
          Exportar CSV
        </a>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {events.length > 0 ? events.map((ev) => {
          const meta = EVENT_ICONS[ev.event_type] || { icon: TrendingUp, color: 'text-gray-600', label: ev.event_type }
          const Icon = meta.icon
          const seriesData = timeseries?.series.find((s) => s.event_type === ev.event_type)
          const colorMap: Record<string, string> = {
            page_view: '#2563eb', lead_created: '#16a34a', whatsapp_click: '#d97706', booking_created: '#9333ea',
          }
          return (
            <div key={ev.event_type} className="rounded-xl border bg-white p-5">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-gray-50 p-2.5">
                  <Icon className={`h-5 w-5 ${meta.color}`} />
                </div>
                <span className="text-2xl font-bold text-gray-900">{ev.count}</span>
              </div>
              <p className="mt-3 text-sm text-gray-600">{meta.label}</p>
              {seriesData && seriesData.data.length > 1 && (
                <div className="mt-2">
                  <Sparkline data={seriesData.data} color={colorMap[ev.event_type] || '#6b7280'} />
                </div>
              )}
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
                    <div className="h-2 rounded-full bg-blue-600 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {timeseries && timeseries.series.length > 0 && (
        <div className="rounded-xl border bg-white p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Tendencia diaria</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-500">
                  <th className="text-left pr-4 pb-2">Fecha</th>
                  {timeseries.series.map((s) => (
                    <th key={s.event_type} className="text-right px-2 pb-2">{s.event_type}</th>
                  ))}
                  <th className="text-right pl-2 pb-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {timeseries.totalDays.slice(-14).map((date) => (
                  <tr key={date} className="border-t border-gray-100">
                    <td className="py-1.5 pr-4 text-gray-500">
                      {new Date(date).toLocaleDateString('es-PY', { weekday: 'short', day: '2-digit', month: 'short' })}
                    </td>
                    {timeseries.series.map((s) => {
                      const dayData = s.data.find((d) => d.date === date)
                      return <td key={s.event_type} className="text-right px-2 py-1.5">{dayData?.count ?? 0}</td>
                    })}
                    <td className="text-right pl-2 py-1.5 font-medium">
                      {timeseries.series.reduce((sum, s) => {
                        const d = s.data.find((x) => x.date === date)
                        return sum + (d?.count ?? 0)
                      }, 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data?.lastUpdated && (
        <p className="text-xs text-gray-400 text-right">
          Última actualización: {new Date(data.lastUpdated).toLocaleString('es-PY')}
        </p>
      )}
    </div>
  )
}
