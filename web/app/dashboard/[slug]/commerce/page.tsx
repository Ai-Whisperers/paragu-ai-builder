'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ShoppingCart, Plus, Trash2, Check, ArrowRight } from 'lucide-react'

interface ProductEntry {
  name: string
  price: string
  currency: string
  description: string
  category: string
}

export default function CommerceActivatePage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [products, setProducts] = useState<ProductEntry[]>([
    { name: '', price: '', currency: 'PYG', description: '', category: '' },
  ])
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  const update = (i: number, field: keyof ProductEntry, value: string) => {
    setProducts((prev) => prev.map((p, j) => (j === i ? { ...p, [field]: value } : p)))
  }

  const add = () => setProducts((prev) => [...prev, { name: '', price: '', currency: 'PYG', description: '', category: '' }])

  const remove = (i: number) => {
    if (products.length <= 1) return
    setProducts((prev) => prev.filter((_, j) => j !== i))
  }

  const handleActivate = async () => {
    setSaving(true)
    try {
      await fetch('/api/portal/commerce-activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: products.filter((p) => p.name.trim()) }),
      })
      setDone(true)
      setTimeout(() => router.push(`/dashboard/${slug}/orders`), 2000)
    } finally {
      setSaving(false)
    }
  }

  if (done) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">¡Tienda activada!</h2>
          <p className="mt-2 text-gray-500">Redirigiendo al panel de pedidos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-purple-600" />
          Activar tienda online
        </h1>
        <p className="mt-1 text-sm text-gray-500">Agregá tus productos para activar la tienda en tu sitio</p>
      </div>

      <div className="rounded-xl border bg-gradient-to-r from-purple-50 to-blue-50 p-6">
        <p className="text-sm text-gray-700">
          Una vez activada, tus productos aparecerán en tu sitio web con botón de pedido por WhatsApp.
          Tus clientes pueden navegar el catálogo y hacer pedidos directos.
        </p>
      </div>

      <div className="space-y-4">
        {products.map((p, i) => (
          <div key={i} className="rounded-xl border bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase">Producto {i + 1}</span>
              {products.length > 1 && (
                <button onClick={() => remove(i)} className="text-red-500 hover:bg-red-50 rounded p-1">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <input type="text" value={p.name} onChange={(e) => update(i, 'name', e.target.value)} placeholder="Nombre del producto"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div>
                <input type="text" value={p.price} onChange={(e) => update(i, 'price', e.target.value)} placeholder="Precio"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <select value={p.currency} onChange={(e) => update(i, 'currency', e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none">
                <option value="PYG">Gs (Guaraníes)</option>
                <option value="USD">$ (Dólares)</option>
              </select>
              <div className="sm:col-span-2">
                <input type="text" value={p.description} onChange={(e) => update(i, 'description', e.target.value)} placeholder="Descripción (opcional)"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div>
                <input type="text" value={p.category} onChange={(e) => update(i, 'category', e.target.value)} placeholder="Categoría (opcional)"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={add} className="w-full rounded-xl border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-600 hover:border-purple-400 hover:text-purple-600 transition-colors">
        <Plus className="h-4 w-4 inline mr-1" /> Agregar otro producto
      </button>

      <button
        onClick={handleActivate}
        disabled={saving || products.filter((p) => p.name.trim()).length === 0}
        className="w-full rounded-xl bg-purple-600 py-3 text-sm font-bold text-white hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
      >
        {saving ? 'Activando...' : 'Activar tienda'}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}
