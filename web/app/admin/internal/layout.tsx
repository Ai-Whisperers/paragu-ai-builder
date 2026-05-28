import { requireAdmin } from '@/lib/auth/admin'
import '@/app/admin/internal/internal.css'
import Link from 'next/link'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: '◉' },
  { href: '/admin/internal/clients', label: 'Clientes', icon: '◈' },
  { href: '/admin/internal/health', label: 'Salud', icon: '◈' },
  { href: '/admin/internal/costs', label: 'Costos AI', icon: '◈' },
  { href: '/admin/internal/pipeline', label: 'Pipeline', icon: '◈' },
]

export default async function InternalLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin()

  return (
    <div className="flex h-screen bg-[#0a0a0f] text-gray-100">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 border-r border-white/5 flex flex-col">
        <div className="px-4 py-5 border-b border-white/5">
          <div className="text-sm font-bold text-white">ParaguAI</div>
          <div className="text-xs text-gray-500 mt-0.5">Ops Console</div>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <span className="text-xs opacity-50">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-3 border-t border-white/5">
          <div className="text-xs text-gray-600">{user.email}</div>
        </div>
      </aside>
      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}