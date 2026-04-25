/**
 * Visual "Carrito → Datos → Pago → Listo" indicator rendered at the top
 * of commerce flow pages. Pure presentation — the caller picks `current`
 * based on which page is rendering it.
 *
 * Server-component only; no client JS. Keep the component small so any
 * page that wants to show the breadcrumb-like progression can drop it
 * in without thinking about hydration.
 */
type Step = 'cart' | 'checkout' | 'payment' | 'done'

const STEP_ORDER: Step[] = ['cart', 'checkout', 'payment', 'done']
const LABELS: Record<Step, string> = {
  cart: 'Carrito',
  checkout: 'Datos',
  payment: 'Pago',
  done: 'Listo',
}

export function CheckoutProgressIndicator({ current }: { current: Step }) {
  const currentIdx = STEP_ORDER.indexOf(current)
  return (
    <nav aria-label="Progreso del pedido" className="mb-6">
      <ol className="flex items-center gap-1 text-xs sm:gap-2 sm:text-sm">
        {STEP_ORDER.map((step, i) => {
          const isCurrent = i === currentIdx
          const isDone = i < currentIdx
          return (
            <li key={step} className="flex items-center gap-1 sm:gap-2">
              <span
                className={
                  isCurrent
                    ? 'inline-flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--primary,#111)] text-xs font-semibold text-[color:var(--primary-foreground,#fff)] sm:h-7 sm:w-7'
                    : isDone
                      ? 'inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-xs font-semibold text-white sm:h-7 sm:w-7'
                      : 'inline-flex h-6 w-6 items-center justify-center rounded-full border border-[color:var(--border,#e5e7eb)] bg-white text-xs font-semibold text-[color:var(--text-muted,#6b7280)] sm:h-7 sm:w-7'
                }
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isDone ? '✓' : i + 1}
              </span>
              <span
                className={
                  isCurrent
                    ? 'font-semibold text-[color:var(--text,#111)]'
                    : isDone
                      ? 'text-green-700'
                      : 'text-[color:var(--text-muted,#6b7280)]'
                }
              >
                {LABELS[step]}
              </span>
              {i < STEP_ORDER.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={`mx-0.5 h-px w-4 sm:w-8 ${isDone ? 'bg-green-600' : 'bg-[color:var(--border,#e5e7eb)]'}`}
                />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
