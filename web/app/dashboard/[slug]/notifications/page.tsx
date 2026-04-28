'use client'

import { useEffect, useState } from 'react'
import { Bell, CheckCheck, Calendar, ShoppingCart, CreditCard, Info } from 'lucide-react'

interface Notification {
  id: string
  type: 'booking' | 'order' | 'billing' | 'system'
  title: string
  body: string
  action_url: string | null
  read: boolean
  created_at: string
}

const TYPE_CONFIG: Record<string, { icon: typeof Bell; color: string }> = {
  booking: { icon: Calendar, color: 'text-blue-600' },
  order: { icon: ShoppingCart, color: 'text-purple-600' },
  billing: { icon: CreditCard, color: 'text-amber-600' },
  system: { icon: Info, color: 'text-gray-600' },
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const mins = Math.round(ms / 60000)
  if (mins < 60) return `hace ${mins} min`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `hace ${hrs}h`
  const days = Math.round(hrs / 24)
  if (days === 1) return 'ayer'
  return `hace ${days} días`
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    fetch('/api/portal/notifications')
      .then((r) => r.json())
      .then((d) => {
        setNotifications(d.notifications ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(load, [])

  const markAllRead = async () => {
    await fetch('/api/portal/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAll: true }),
    })
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
          <p className="mt-1 text-sm text-gray-500">
            {unreadCount > 0 ? `${unreadCount} sin leer` : 'No hay notificaciones nuevas'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <CheckCheck className="h-4 w-4" />
            Marcar todas leídas
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          <Bell className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500">No hay notificaciones</p>
          <p className="mt-2 text-sm text-gray-400">Las notificaciones aparecerán aquí cuando tengas actividad nueva.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.system
            const Icon = cfg.icon
            return (
              <div
                key={n.id}
                className={`rounded-xl border p-4 transition-colors ${
                  n.read ? 'bg-white' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 rounded-lg bg-white p-2 shadow-sm ${n.read ? '' : 'bg-blue-100'}`}>
                    <Icon className={`h-4 w-4 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm ${n.read ? 'text-gray-900' : 'font-semibold text-gray-900'}`}>
                        {n.title}
                      </p>
                      <span className="flex-shrink-0 text-xs text-gray-400">{timeAgo(n.created_at)}</span>
                    </div>
                    {n.body && <p className="mt-1 text-sm text-gray-600">{n.body}</p>}
                    {n.action_url && (
                      <a
                        href={n.action_url}
                        className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
                      >
                        Ver detalles
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
