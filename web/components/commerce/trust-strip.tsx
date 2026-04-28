/**
 * Reusable trust strip. Reinforces "discreet shipping / secure payment /
 * returns" across every commerce surface — storefront grid, PDP, cart
 * drawer, checkout. Props accept 3-4 items so a tenant can tune copy per
 * surface without shipping another component.
 *
 * Server-rendered — no JS, no state, no client boundary.
 */

export interface TrustItem {
  icon: string // emoji; keep dependency-free
  title: string
  description: string
}

export interface TrustStripProps {
  items?: TrustItem[]
  /** Visual variant — tight for in-page, prominent for above-grid or PDP. */
  variant?: 'compact' | 'prominent'
  className?: string
  /** Optional eyebrow line shown above the items. */
  eyebrow?: string
}

export const DEFAULT_TRUST_ITEMS: TrustItem[] = [
  {
    icon: '📦',
    title: 'Envío 100% discreto',
    description: 'Caja neutra sin logos ni referencias al contenido.',
  },
  {
    icon: '🔒',
    title: 'Pago seguro',
    description: 'Procesado por Pagopar. Facturación discreta.',
  },
  {
    icon: '⚡',
    title: 'Entrega rápida',
    description: 'Asunción y GBA en 24-48 horas.',
  },
  {
    icon: '↩️',
    title: 'Cambios y devoluciones',
    description: 'Sin abrir, 7 días. Cambio por talle o defecto.',
  },
]

export function TrustStrip({
  items = DEFAULT_TRUST_ITEMS,
  variant = 'compact',
  className,
  eyebrow,
}: TrustStripProps) {
  const prominent = variant === 'prominent'
  const base =
    'grid grid-cols-2 gap-3 rounded-lg border border-[color:var(--border,#e5e7eb)] bg-surface p-4 text-sm sm:grid-cols-4'
  const spacing = prominent ? 'my-6 sm:p-5' : 'mb-4'
  return (
    <aside
      aria-label="Nuestras promesas"
      className={[base, spacing, className].filter(Boolean).join(' ')}
    >
      {eyebrow ? (
        <p className="col-span-2 -mb-1 text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted,#6b7280)] sm:col-span-4">
          {eyebrow}
        </p>
      ) : null}
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <span aria-hidden="true" className={prominent ? 'text-2xl' : 'text-lg'}>
            {item.icon}
          </span>
          <div>
            <p className="font-semibold text-[color:var(--text,#111)]">
              {item.title}
            </p>
            <p className="text-xs text-[color:var(--text-muted,#6b7280)]">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </aside>
  )
}
