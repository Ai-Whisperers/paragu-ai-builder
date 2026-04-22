'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore, cartSubtotalCents } from '@/lib/stores/cart-store'
import { formatCents } from '@/lib/commerce/compute-totals'

interface Props {
  siteSlug: string
  locale?: string
}

export function CheckoutForm({ siteSlug, locale = 'es' }: Props) {
  const router = useRouter()
  const cart = useCartStore((s) => s.cart)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [discountCode, setDiscountCode] = useState('')
  const [discountInput, setDiscountInput] = useState('')
  const [discountStatus, setDiscountStatus] = useState<
    | { kind: 'idle' }
    | { kind: 'checking' }
    | { kind: 'applied'; amountCents: number; code: string; freeShipping: boolean }
    | { kind: 'rejected'; reason: string }
  >({ kind: 'idle' })

  if (!cart || cart.items.length === 0) {
    return (
      <div className="rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-6 text-center">
        <p className="text-[color:var(--text-muted,#6b7280)]">Tu carrito está vacío.</p>
      </div>
    )
  }

  const subtotal = cartSubtotalCents(cart)
  const discountAmount = discountStatus.kind === 'applied' ? discountStatus.amountCents : 0
  const total = Math.max(0, subtotal - discountAmount)

  async function applyDiscountCode() {
    const code = discountInput.trim()
    if (!code) return
    setDiscountStatus({ kind: 'checking' })
    try {
      const res = await fetch(`/api/storefront/${siteSlug}/discount`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotalCents: subtotal }),
      })
      const data = await res.json()
      if (data.valid) {
        setDiscountStatus({
          kind: 'applied',
          amountCents: data.discountCents,
          code: data.code,
          freeShipping: Boolean(data.freeShipping),
        })
        setDiscountCode(data.code)
      } else {
        setDiscountStatus({ kind: 'rejected', reason: data.reason ?? 'invalid' })
        setDiscountCode('')
      }
    } catch {
      setDiscountStatus({ kind: 'rejected', reason: 'network_error' })
    }
  }

  function removeDiscount() {
    setDiscountCode('')
    setDiscountInput('')
    setDiscountStatus({ kind: 'idle' })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!cart || submitting) return
    setSubmitting(true)
    setError(null)

    const form = new FormData(event.currentTarget)
    const payload = {
      cartId: cart.id,
      customer: {
        name: String(form.get('name') ?? ''),
        email: String(form.get('email') ?? ''),
        phone: String(form.get('phone') ?? ''),
      },
      shipping: {
        address: {
          line1: String(form.get('line1') ?? ''),
          line2: String(form.get('line2') ?? '') || undefined,
          city: String(form.get('city') ?? ''),
          department: String(form.get('department') ?? '') || undefined,
          postalCode: String(form.get('postalCode') ?? '') || undefined,
          country: 'PY',
          references: String(form.get('references') ?? '') || undefined,
        },
      },
      notes: String(form.get('notes') ?? '') || undefined,
      discountCode: discountCode || undefined,
    }

    try {
      const res = await fetch(`/api/storefront/${siteSlug}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': `checkout-${cart.id}-${Date.now()}`,
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'checkout_failed')
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl
        return
      }
      router.push(`/s/${locale}/${siteSlug}/orden/${data.orderId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pedido')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <section aria-labelledby="contacto-heading" className="rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-6">
          <h2 id="contacto-heading" className="mb-4 text-lg font-semibold">Contacto</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre completo" name="name" required autoComplete="name" />
            <Field label="Email" name="email" type="email" required autoComplete="email" />
            <Field label="Teléfono (WhatsApp)" name="phone" type="tel" required autoComplete="tel" placeholder="+595 9XX XXX XXX" />
          </div>
        </section>

        <section aria-labelledby="envio-heading" className="rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-6">
          <h2 id="envio-heading" className="mb-4 text-lg font-semibold">Envío</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field className="sm:col-span-2" label="Dirección" name="line1" required autoComplete="shipping address-line1" />
            <Field className="sm:col-span-2" label="Piso / depto (opcional)" name="line2" autoComplete="shipping address-line2" />
            <Field label="Ciudad" name="city" required autoComplete="shipping address-level2" />
            <Field label="Departamento" name="department" autoComplete="shipping address-level1" />
            <Field label="Código postal" name="postalCode" autoComplete="shipping postal-code" />
            <Field className="sm:col-span-2" label="Referencias (opcional)" name="references" placeholder="Casa color crema, frente a la plaza" />
          </div>
        </section>

        <section aria-labelledby="notas-heading" className="rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-6">
          <h2 id="notas-heading" className="mb-4 text-lg font-semibold">Notas del pedido</h2>
          <textarea
            name="notes"
            rows={3}
            placeholder="Algún detalle adicional"
            className="w-full rounded-md border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm focus:border-[color:var(--primary,#111)] focus:outline-none"
          />
        </section>
      </div>

      <aside className="h-fit rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-6 lg:sticky lg:top-4">
        <h2 className="mb-4 text-lg font-semibold">Resumen</h2>
        <ul className="mb-4 space-y-2 text-sm">
          {cart.items.map((it) => {
            // Fall back to "Producto" only when the join row didn't resolve
            // a name — real products always have one. The pre-fix copy
            // literally read "producto" for every line.
            const name = it.productName ?? 'Producto'
            return (
              <li key={it.id} className="flex justify-between gap-2">
                <span className="flex-1 truncate text-[color:var(--text-muted,#6b7280)]">
                  {it.quantity} × {name}
                </span>
                <span className="whitespace-nowrap">
                  {formatCents(it.unitPriceCents * it.quantity, cart.currency)}
                </span>
              </li>
            )
          })}
        </ul>

        {/* Discount code */}
        <div className="mb-3 border-t border-[color:var(--border,#e5e7eb)] pt-3">
          {discountStatus.kind !== 'applied' ? (
            <div className="flex items-center gap-2">
              <input
                value={discountInput}
                onChange={(e) => setDiscountInput(e.target.value.toUpperCase())}
                placeholder="Código de descuento"
                maxLength={80}
                className="flex-1 rounded-md border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm uppercase focus:border-[color:var(--primary,#111)] focus:outline-none"
              />
              <button
                type="button"
                onClick={applyDiscountCode}
                disabled={discountStatus.kind === 'checking' || !discountInput.trim()}
                className="rounded-md border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-xs font-medium hover:bg-[color:var(--surface-muted,#f3f4f6)] disabled:opacity-50"
              >
                {discountStatus.kind === 'checking' ? '…' : 'Aplicar'}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2 rounded bg-green-50 px-3 py-2 text-xs text-green-800">
              <span>
                ✓ <strong>{discountStatus.code}</strong>
                {discountStatus.amountCents > 0 ? ` —${formatCents(discountStatus.amountCents, cart.currency)}` : ''}
                {discountStatus.freeShipping ? ' · envío gratis' : ''}
              </span>
              <button type="button" onClick={removeDiscount} className="text-green-900 underline">
                Quitar
              </button>
            </div>
          )}
          {discountStatus.kind === 'rejected' ? (
            <p role="alert" className="mt-1 flex items-start gap-1 text-xs text-red-700">
              <span aria-hidden="true">⚠️</span>
              <span>
                {discountStatus.reason === 'not_found'
                  ? 'Ese código no existe.'
                  : discountStatus.reason === 'expired'
                  ? 'Ese código venció.'
                  : discountStatus.reason === 'min_subtotal'
                  ? 'No alcanzás el subtotal mínimo para este código.'
                  : discountStatus.reason === 'usage_exceeded'
                  ? 'Ese código ya se usó el máximo de veces.'
                  : 'Código inválido.'}
              </span>
            </p>
          ) : null}
        </div>

        <div className="space-y-1 border-t border-[color:var(--border,#e5e7eb)] pt-3 text-sm">
          <div className="flex justify-between text-[color:var(--text-muted,#6b7280)]">
            <span>Subtotal</span>
            <span>{formatCents(subtotal, cart.currency)}</span>
          </div>
          {discountAmount > 0 ? (
            <div className="flex justify-between text-green-700">
              <span>Descuento</span>
              <span>−{formatCents(discountAmount, cart.currency)}</span>
            </div>
          ) : null}
          <div className="flex justify-between text-[color:var(--text-muted,#6b7280)]">
            <span>Envío</span>
            <span>
              {discountStatus.kind === 'applied' && discountStatus.freeShipping
                ? 'Gratis'
                : 'Se calcula al confirmar'}
            </span>
          </div>
          <div className="flex justify-between pt-1 text-base font-semibold text-[color:var(--text,#111)]">
            <span>Total</span>
            <span>{formatCents(total, cart.currency)}</span>
          </div>
        </div>

        {error ? (
          <p role="alert" className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="mt-4 w-full rounded-lg bg-[color:var(--primary,#111)] px-4 py-3 font-semibold text-[color:var(--primary-foreground,#fff)] hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? 'Procesando…' : 'Confirmar pedido'}
        </button>
        <p className="mt-3 text-center text-xs text-[color:var(--text-muted,#6b7280)]">
          Te llevamos a la siguiente pantalla para completar el pago.
        </p>
      </aside>
    </form>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required,
  autoComplete,
  placeholder,
  className,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  autoComplete?: string
  placeholder?: string
  className?: string
}) {
  // Explicit htmlFor + id so screen readers anchor reliably (the wrapping
  // <label> alone is technically valid but some AT versions stumble). The
  // red asterisk gets a sr-only "obligatorio" so the required-ness isn't
  // color-only — non-visual users get the same signal.
  const inputId = `checkout-field-${name}`
  return (
    <div className={`block ${className ?? ''}`}>
      <label htmlFor={inputId} className="mb-1 block text-xs font-medium text-[color:var(--text-muted,#6b7280)]">
        {label}
        {required ? (
          <>
            {' '}
            <span aria-hidden="true" className="text-red-600">*</span>
            <span className="sr-only">(obligatorio)</span>
          </>
        ) : null}
      </label>
      <input
        id={inputId}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="block w-full rounded-md border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm focus:border-[color:var(--primary,#111)] focus:outline-none"
      />
    </div>
  )
}
