/**
 * Email templates for order confirmations, booking reminders, etc.
 *
 * Extracted from lib/commerce/email-templates.ts to be shared across
 * commerce and booking routes without coupling to commerce types.
 * The old file re-exports from here for backward compatibility.
 */

export interface OrderEmailContext {
  order: {
    id: string
    items: Array<{ name: string; quantity: number; price: number }>
    totalCents: number
    currency: string
    customerEmail?: string
    customerPhone?: string
    shippingAddress?: string
  }
  businessName: string
  storeUrl: string
}

export function orderConfirmationEmail({ order, businessName, storeUrl }: OrderEmailContext): { subject: string; html: string } {
  const itemsHtml = order.items
    .map((i) => `<tr><td>${i.name}</td><td>${i.quantity}</td><td>${formatPrice(i.price, order.currency)}</td></tr>`)
    .join('')

  return {
    subject: `Pedido confirmado - ${businessName}`,
    html: `
      <h2>Gracias por tu pedido</h2>
      <p>Hola! Tu pedido en <strong>${businessName}</strong> ha sido confirmado.</p>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%">
        <thead><tr><th>Producto</th><th>Cant.</th><th>Precio</th></tr></thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <p><strong>Total: ${formatPrice(order.totalCents, order.currency)}</strong></p>
      ${order.shippingAddress ? `<p>Dirección de envío: ${order.shippingAddress}</p>` : ''}
      <p><a href="${storeUrl}/s/es/orden/${order.id}">Ver detalle del pedido</a></p>
    `,
  }
}

export interface BookingConfirmationContext {
  booking: { id: string; service_name: string; booking_date: string; booking_time: string }
  businessName: string
}

export function bookingConfirmationEmail({ booking, businessName }: BookingConfirmationContext): { subject: string; html: string } {
  return {
    subject: `Reserva confirmada - ${businessName}`,
    html: `
      <h2>Reserva confirmada</h2>
      <p>Tu reserva en <strong>${businessName}</strong> ha sido confirmada.</p>
      <p><strong>Servicio:</strong> ${booking.service_name}</p>
      <p><strong>Fecha:</strong> ${new Date(booking.booking_date).toLocaleDateString('es-PY')}</p>
      <p><strong>Hora:</strong> ${booking.booking_time}</p>
    `,
  }
}

function formatPrice(cents: number, currency: string): string {
  if (currency === 'PYG') return `Gs ${Math.round(cents).toLocaleString('es-PY')}`
  return `$${(cents / 100).toFixed(2)}`
}
