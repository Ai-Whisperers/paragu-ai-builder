'use client'

import { useEffect, useState } from 'react'

interface Booking {
  id: string
  customer_name: string
  customer_email: string | null
  customer_phone: string | null
  booking_date: string
  booking_time: string
  duration_minutes: number
  status: string
  created_at: string
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
  no_show: 'No se presentó',
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700',
  confirmed: 'bg-blue-50 text-blue-700',
  completed: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
  no_show: 'bg-gray-100 text-gray-700',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-PY', {
    year: 'numeric', month: 'short', day: '2-digit',
  })
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/portal/bookings')
      .then((r) => r.json())
      .then((d) => {
        setBookings(d.bookings ?? [])
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
        <h1 className="text-2xl font-bold text-gray-900">Reservas</h1>
        <p className="mt-1 text-sm text-gray-500">
          {bookings.length} reserva{bookings.length !== 1 ? 's' : ''} en total
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center text-gray-500">
          Aún no hay reservas registradas.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Hora</th>
                <th className="px-4 py-3">Duración</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Registrada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{b.customer_name}</div>
                    {b.customer_email && (
                      <div className="text-xs text-gray-500">{b.customer_email}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{formatDate(b.booking_date)}</td>
                  <td className="px-4 py-3 text-gray-700">{b.booking_time?.slice(0, 5)}</td>
                  <td className="px-4 py-3 text-gray-700">{b.duration_minutes} min</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[b.status] || 'bg-gray-100 text-gray-700'}`}>
                      {STATUS_LABELS[b.status] || b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{formatDate(b.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
