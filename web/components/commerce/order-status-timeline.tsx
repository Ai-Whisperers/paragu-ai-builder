import type { OrderStatus } from '@/lib/schemas/commerce/order'

interface Props {
  status: OrderStatus
}

const STEPS: Array<{ key: OrderStatus; label: string }> = [
  { key: 'paid', label: 'Pago confirmado' },
  { key: 'fulfilled', label: 'Preparando' },
  { key: 'shipped', label: 'Enviado' },
  { key: 'delivered', label: 'Entregado' },
]

const INDEX_BY_STATUS: Record<OrderStatus, number> = {
  pending: -1,
  awaiting_payment: -1,
  failed: -1,
  cancelled: -1,
  refunded: -1,
  paid: 0,
  fulfilled: 1,
  shipped: 2,
  delivered: 3,
}

/**
 * Horizontal progress indicator for the happy-path order lifecycle.
 * Renders nothing for orders that never made it to paid (pending,
 * failed, cancelled) — those get different messaging at the page
 * level. Refunded shows the full timeline but dimmed to grey.
 */
export function OrderStatusTimeline({ status }: Props) {
  const currentIndex = INDEX_BY_STATUS[status] ?? -1
  if (currentIndex < 0) return null
  const refunded = status === 'refunded'

  return (
    <ol
      aria-label="Estado del pedido"
      className={`my-6 flex items-center gap-2 print:hidden ${refunded ? 'opacity-60' : ''}`}
    >
      {STEPS.map((step, i) => {
        const done = i <= currentIndex
        const active = i === currentIndex && !refunded
        return (
          <li key={step.key} className="flex-1 text-center">
            <div className="flex items-center">
              <span
                aria-hidden="true"
                className={`flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-semibold ${
                  done
                    ? 'bg-[color:var(--secondary,#b8860b)] text-white'
                    : 'bg-surface-light text-[color:var(--text-muted,#6b7280)]'
                } ${active ? 'ring-2 ring-offset-2 ring-[color:var(--secondary,#b8860b)]' : ''}`}
              >
                {done ? '✓' : i + 1}
              </span>
              {i < STEPS.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={`h-0.5 flex-1 ${
                    i < currentIndex
                      ? 'bg-[color:var(--secondary,#b8860b)]'
                      : 'bg-[color:var(--border,#e5e7eb)]'
                  }`}
                />
              ) : null}
            </div>
            <span
              className={`mt-2 block text-xs ${
                done
                  ? 'font-medium text-[color:var(--text,#111)]'
                  : 'text-[color:var(--text-muted,#6b7280)]'
              }`}
            >
              {step.label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
