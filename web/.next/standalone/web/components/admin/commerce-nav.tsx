import Link from 'next/link'

const COMMERCE_TABS = [
  { key: 'products', label: 'Productos', href: '' },
  { key: 'orders', label: 'Pedidos', href: '/orders' },
  { key: 'reviews', label: 'Reseñas', href: '/reviews' },
  { key: 'discounts', label: 'Descuentos', href: '/discounts' },
  { key: 'shipping', label: 'Envíos', href: '/shipping' },
  { key: 'search-analytics', label: 'Búsquedas', href: '/search-analytics' },
  { key: 'reconciliation', label: 'Conciliación', href: '/reconciliation' },
  { key: 'payments', label: 'Pagos', href: '/payments' },
] as const

interface CommerceNavProps {
  businessId: string
  activeTab: string
}

export function CommerceNav({ businessId, activeTab }: CommerceNavProps) {
  return (
    <nav className="mb-6 flex flex-wrap items-center gap-1 rounded-lg border bg-white p-2">
      {COMMERCE_TABS.map(({ key, label, href }) => {
        const fullPath = `/admin/commerce/${businessId}${href}`
        const isActive = activeTab === key
        return (
          <Link
            key={key}
            href={fullPath}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
              isActive
                ? 'bg-gray-900 font-medium text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
