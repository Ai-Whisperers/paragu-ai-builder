'use client'

import { useEffect, useState } from 'react'
import { ChevronDown, Truck, Check, X, Eye } from 'lucide-react'

interface Order {
  id: string
  order_number: string
  status: string
  total_cents: number
  currency: string
  customer_name: string
  customer_email: string
  created_at: string
  tracking_number: string | null
  tracking_carrier: string | null
  tracking_url: string | null
  notes: string | null
}

interface OrderDetail extends Order {
  shipping_address: Record<string, string> | null
  items?: Array<{ name: string; quantity: number; unit_price_cents: number }>
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  awaiting_payment: 'Esperando pago',
  paid: 'Pagado',
  processing: 'En proceso',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
  refunded: 'Reintegrado',
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700',
  awaiting_payment: 'bg-yellow-50 text-yellow-700',
  paid: 'bg-blue-50 text-blue-700',
  processing: 'bg-indigo-50 text-indigo-700',
  shipped: 'bg-purple-50 text-purple-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
}

const ACTIONS: Record<string, Array<{ status: string; label: string; icon: typeof Check }>> = {
  pending: [{ status: 'cancelled', label: 'Cancelar', icon: X }],
  awaiting_payment: [{ status: 'paid', label: 'Marcar pagado', icon: Check }, { status: 'cancelled', label: 'Cancelar', icon: X }],
  paid: [{ status: 'processing', label: 'Procesar', icon: Check }],
  processing: [{ status: 'shipped', label: 'Enviar', icon: Truck }],
  shipped: [{ status: 'delivered', label: 'Entregar', icon: Check }],
}

function formatPrice(cents: number, currency: string): string {
  const amount = currency === 'PYG' ? cents : cents / 100
  if (currency === 'PYG') return `Gs ${amount.toLocaleString('es-PY')}`
  return `$${(amount).toFixed(2)}`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-PY', { year: 'numeric', month: 'short', day: '2-digit' })
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null)
  const [trackingInput, setTrackingInput] = useState('')

  const load = () => {
    fetch('/api/portal/orders')
      .then((r) => r.json())
      .then((d) => {
        setOrders(d.orders ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }
  useEffect(load, [])

  const updateStatus = async (id: string, status: string) => {
    const body: Record<string, string> = { status }
    if (status === 'shipped' && trackingInput) {
      body.tracking_number = trackingInput
    }
    await fetch(`/api/portal/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    setTrackingInput('')
    load()
  }

  const openDetail = async (o: Order) => {
    const res = await fetch('/api/portal/orders')
    const d = await res.json()
    const detail = (d.orders ?? []).find((x: Order) => x.id === o.id) as OrderDetail
    setSelectedOrder(detail || (o as OrderDetail))
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-gray-900">Pedidos</h1><p className="mt-1 text-sm text-gray-500">Aún no hay pedidos registrados.</p></div>
        <div className="rounded-xl border bg-white p-12 text-center text-gray-500">Los pedidos aparecerán aquí cuando tus clientes realicen compras.</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
        <p className="mt-1 text-sm text-gray-500">{orders.length} pedido{orders.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3">N° Pedido</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acción</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-gray-700">{o.order_number}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{o.customer_name}</div>
                  <div className="text-xs text-gray-500">{o.customer_email}</div>
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{formatPrice(o.total_cents, o.currency)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-700'}`}>
                    {STATUS_LABELS[o.status] || o.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {ACTIONS[o.status] ? (
                    <div className="flex gap-1">
                      {ACTIONS[o.status].map((a) => (
                        <button
                          key={a.status}
                          onClick={() => updateStatus(o.id, a.status)}
                          className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 border"
                        >
                          <a.icon className="h-3 w-3" />
                          {a.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => openDetail(o)} className="text-blue-600 hover:underline text-xs">
                    <Eye className="h-3.5 w-3.5 inline" /> Detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="rounded-xl border bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pedido {selectedOrder.order_number}</h2>
            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 mb-4">
            <div><p className="text-xs text-gray-500 uppercase">Cliente</p><p className="font-medium">{selectedOrder.customer_name}</p></div>
            <div><p className="text-xs text-gray-500 uppercase">Total</p><p className="font-medium">{formatPrice(selectedOrder.total_cents, selectedOrder.currency)}</p></div>
            <div><p className="text-xs text-gray-500 uppercase">Fecha</p><p className="font-medium">{formatDate(selectedOrder.created_at)}</p></div>
          </div>
          {selectedOrder.notes && (
            <div className="rounded-lg bg-gray-50 p-3 mb-4">
              <p className="text-xs text-gray-500 uppercase mb-1">Notas</p>
              <p className="text-sm">{selectedOrder.notes}</p>
            </div>
          )}
          {(selectedOrder.status === 'processing' || selectedOrder.status === 'paid') && (
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">N° de seguimiento</label>
                <input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="Ingresar número..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <button
                onClick={() => updateStatus(selectedOrder.id, 'shipped')}
                disabled={!trackingInput}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <Truck className="h-4 w-4 inline mr-1" />Enviar
              </button>
            </div>
          )}
          {selectedOrder.tracking_number && (
            <div className="rounded-lg bg-blue-50 p-3 mt-4">
              <p className="text-xs text-gray-500 uppercase mb-1">Seguimiento</p>
              <p className="text-sm font-medium">{selectedOrder.tracking_number}</p>
              {selectedOrder.tracking_url && (
                <a href={selectedOrder.tracking_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                  Ver tracking
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
