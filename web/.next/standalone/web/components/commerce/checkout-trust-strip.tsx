/**
 * Trust strip that renders above the checkout form. Reinforces the same
 * three promises the hero + product cards make (discretion / secure
 * payment / returns), right at the moment the shopper is filling in
 * their address. Pure server-component presentation — no client JS.
 *
 * Copy is generic enough to apply to any commerce tenant, not just
 * adult-retail. The specific icons are intentionally emoji so we don't
 * ship another lucide import for three items.
 */
export function CheckoutTrustStrip() {
  return (
    <aside
      aria-label="Por qué comprar acá"
      className="mb-6 grid grid-cols-1 gap-3 rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-4 text-sm sm:grid-cols-3"
    >
      <div className="flex items-center gap-2">
        <span aria-hidden="true">📦</span>
        <div>
          <p className="font-semibold text-[color:var(--text,#111)]">Envío discreto</p>
          <p className="text-xs text-[color:var(--text-muted,#6b7280)]">Caja neutra sin marcas.</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span aria-hidden="true">🔒</span>
        <div>
          <p className="font-semibold text-[color:var(--text,#111)]">Pago seguro</p>
          <p className="text-xs text-[color:var(--text-muted,#6b7280)]">Datos cifrados, factura discreta.</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span aria-hidden="true">↩️</span>
        <div>
          <p className="font-semibold text-[color:var(--text,#111)]">Cambios y devoluciones</p>
          <p className="text-xs text-[color:var(--text-muted,#6b7280)]">Productos sin abrir, 7 días.</p>
        </div>
      </div>
    </aside>
  )
}
