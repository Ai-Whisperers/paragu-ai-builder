'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore, cartSubtotalCents } from '@/lib/stores/cart-store'
import { formatCents } from '@/lib/commerce/compute-totals'

interface Props {
  siteSlug: string
}

export function CheckoutForm({ siteSlug }: Props) {
  const router = useRouter()
  const cart = useCartStore((s) => s.cart)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!cart || cart.items.length === 0) {
    return (
      <div className="rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-6 text-center">
        <p className="text-[color:var(--text-muted,#6b7280)]">Tu carrito está vacío.</p>
      </div>
    )
  }

  const subtotal = cartSubtotalCents(cart)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!cart) return
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
      router.push(`/s/es/${siteSlug}/orden/${data.orderId}`)
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
          {cart.items.map((it) => (
            <li key={it.id} className="flex justify-between">
              <span className="text-[color:var(--text-muted,#6b7280)]">{it.quantity} × producto</span>
              <span>{formatCents(it.unitPriceCents * it.quantity, cart.currency)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-[color:var(--border,#e5e7eb)] pt-3 text-base font-semibold">
          <span>Total</span>
          <span>{formatCents(subtotal, cart.currency)}</span>
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
          {submitting ? 'Procesando…' : 'Pagar con Mercado Pago'}
        </button>
        <p className="mt-3 text-center text-xs text-[color:var(--text-muted,#6b7280)]">
          Pago seguro · Mercado Pago · Visa · Mastercard · Tigo Money
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
  return (
    <label className={`block ${className ?? ''}`}>
      <span className="mb-1 block text-xs font-medium text-[color:var(--text-muted,#6b7280)]">
        {label} {required ? <span className="text-red-600">*</span> : null}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="block w-full rounded-md border border-[color:var(--border,#e5e7eb)] px-3 py-2 text-sm focus:border-[color:var(--primary,#111)] focus:outline-none"
      />
    </label>
  )
}
