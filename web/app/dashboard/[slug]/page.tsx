'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  Users,
  Calendar,
  ShoppingCart,
  Eye,
  ArrowRight,
  TrendingUp,
  FileText,
  Settings,
} from 'lucide-react'

interface DashboardStats {
  business: { slug: string; name: string; type: string; status: string }
  stats: {
    totalSiteLeads: number
    totalBookings: number
    totalOrders: number
    visitsLast30Days: number
    recentLeads: number
    pendingBookings: number
    pendingOrders: number
  }
}

const STAT_CARDS = [
  { key: 'visitsLast30Days', label: 'Visitas (30 días)', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
  { key: 'totalSiteLeads', label: 'Consultas recibidas', icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
  { key: 'pendingBookings', label: 'Reservas pendientes', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
  { key: 'pendingOrders', label: 'Pedidos pendientes', icon: ShoppingCart, color: 'text-purple-600', bg: 'bg-purple-50' },
]

const QUICK_ACTIONS = [
  { href: '/content', label: 'Editar contenido', desc: 'Modificá textos, horarios y precios de tu sitio', icon: FileText },
  { href: '/bookings', label: 'Ver reservas', desc: 'Gestioná las citas y reservas de tus clientes', icon: Calendar },
  { href: '/analytics', label: 'Ver analíticas', desc: 'Consultá visitas, consultas y conversiones', icon: TrendingUp },
  { href: '/settings', label: 'Configuración', desc: 'Actualizá tus datos de contacto y ubicación', icon: Settings },
]

export default function DashboardOverview() {
  const params = useParams()
  const slug = params.slug as string
  const [data, setData] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/portal/stats')
      .then((r) => r.json())
      .then((d) => {
        setData(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const base = `/dashboard/${slug}`

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="rounded-lg border bg-white p-12 text-center text-gray-500">
        No se pudieron cargar las estadísticas.
      </div>
    )
  }

  const { stats } = data

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido, {data.business.name}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Panel de gestión de tu sitio web
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map(({ key, label, icon: Icon, color, bg }) => (
          <div key={key} className="rounded-xl border bg-white p-5 transition-shadow hover:shadow-sm">
            <div className="flex items-center justify-between">
              <div className={`rounded-lg ${bg} p-2.5`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {stats[key as keyof typeof stats]}
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-600">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones rápidas</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map(({ href, label, desc, icon: Icon }) => (
            <Link
              key={href}
              href={`${base}${href}`}
              className="group rounded-xl border bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-sm"
            >
              <div className="mb-3 rounded-lg bg-blue-50 p-2.5 w-fit">
                <Icon className="h-5 w-5 text-blue-600" />
              </div>
              <p className="font-semibold text-gray-900 group-hover:text-blue-700">{label}</p>
              <p className="mt-1 text-sm text-gray-500">{desc}</p>
              <div className="mt-3 flex items-center gap-1 text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Ir <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* View site link */}
      <div className="rounded-xl border bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Visitá tu sitio web</h3>
            <p className="mt-1 text-sm text-gray-600">
              Tu sitio está publicado y funcionando. Hacé clic para verlo.
            </p>
          </div>
          <a
            href={`/s/es/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Ver sitio <Eye className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
