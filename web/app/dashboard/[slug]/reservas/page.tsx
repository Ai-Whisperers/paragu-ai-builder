'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Booking {
  id: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  booking_date: string
  booking_time: string
  duration_minutes: number
  status: string
  source: string
  created_at: string
  service: { name: string } | null
  staff: { name: string } | null
}

const STATUS_OPTIONS = ['pending', 'confirmed', 'completed', 'cancelled', 'no_show']
const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente', confirmed: 'Confirmada', completed: 'Completada',
  cancelled: 'Cancelada', no_show: 'No asistio',
}
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800', confirmed: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800', cancelled: 'bg-gray-100 text-gray-700',
  no_show: 'bg-red-100 text-red-800',
}

export default function BookingsPage({ params }: { params: Promise<{ slug: string }> }) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [slug, setSlug] = useState('')

  useEffect(() => { params.then(p => setSlug(p.slug)) }, [params])

  useEffect(() => {
    if (!slug) return
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.email) return
      const { data: tenant } = await supabase.from('tenant_users').select('business_id').eq('email', user.email).single()
      if (!tenant) return
      let query = supabase.from('bookings').select('*, service:service_id(name), staff:staff_member_id(name)').eq('business_id', tenant.business_id).order('booking_date', { ascending: false })
      if (filter) query = query.eq('status', filter)
      const { data } = await query.limit(50)
      setBookings(data || [])
      setLoading(false)
    }
    load()
  }, [slug, filter])

  const updateStatus = async (id: string, status: string) => {
    const supabase = createClient()
    const updates: Record<string, string | null> = { status }
    if (status === 'confirmed') updates.confirmed_at = new Date().toISOString()
    if (status === 'cancelled') updates.cancelled_at = new Date().toISOString()
    await supabase.from('bookings').update(updates).eq('id', id)
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Reservas</h1>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
          <option value="">Todas las reservas</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      {loading ? <p className="text-gray-500">Cargando...</p> : bookings.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No hay reservas</div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Contacto</th>
                <th className="px-4 py-3 font-medium">Servicio</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Hora</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{b.customer_name}</td>
                  <td className="px-4 py-3">
                    <p className="text-xs">{b.customer_phone}</p>
                    {b.customer_email && <p className="text-xs text-gray-400">{b.customer_email}</p>}
                  </td>
                  <td className="px-4 py-3">{b.service?.name || '-'}</td>
                  <td className="px-4 py-3">{new Date(b.booking_date + 'T12:00:00').toLocaleDateString('es-PY')}</td>
                  <td className="px-4 py-3 font-mono text-xs">{b.booking_time?.slice(0,5)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${STATUS_COLORS[b.status]}`}>{STATUS_LABELS[b.status]}</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusActions status={b.status} onUpdate={s => updateStatus(b.id, s)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function StatusActions({ status, onUpdate }: { status: string; onUpdate: (s: string) => void }) {
  const actions: { status: string; label: string; color: string }[] = []
  if (status === 'pending') actions.push({ status: 'confirmed', label: '✓ Confirmar', color: 'text-green-600' }, { status: 'cancelled', label: '✗ Cancelar', color: 'text-red-600' })
  if (status === 'confirmed') actions.push({ status: 'completed', label: '✓ Completar', color: 'text-blue-600' }, { status: 'no_show', label: '✗ No asistio', color: 'text-red-600' })
  return (
    <div className="flex gap-2 text-xs">
      {actions.map(a => (
        <button key={a.status} onClick={() => onUpdate(a.status)} className={`underline ${a.color} hover:opacity-70`}>{a.label}</button>
      ))}
    </div>
  )
}
