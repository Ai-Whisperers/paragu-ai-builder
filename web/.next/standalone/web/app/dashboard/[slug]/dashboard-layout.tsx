'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface TenantSession {
  tenantId: string
  businessId: string
  email: string
  name: string
  role: 'owner' | 'manager'
}

const navItems = [
  { label: 'Inicio', href: '' },
  { label: 'Contenido', href: '/contenido' },
  { label: 'Pedidos', href: '/pedidos' },
  { label: 'Productos', href: '/productos' },
  { label: 'Descuentos', href: '/descuentos' },
  { label: 'Configuración', href: '/configuracion' },
]

export function DashboardLayout({
  slug,
  tenant,
  children,
}: {
  slug: string
  tenant: TenantSession
  children: React.ReactNode
}) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/tenant-login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <nav className="w-56 bg-white border-r shrink-0 flex flex-col">
        <div className="p-4 border-b">
          <div className="text-sm font-semibold text-gray-900 truncate">{slug}</div>
          <div className="text-xs text-gray-400 capitalize">{tenant.role}</div>
        </div>

        <div className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={`/dashboard/${slug}${item.href}`}
              className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="p-3 border-t">
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
