import type { Order } from '@/lib/schemas/commerce/order'
import { formatCents } from './compute-totals'

interface Context {
  order: Order
  businessName: string
  storeUrl: string
}

export function orderConfirmationEmail({ order, businessName, storeUrl }: Context) {
  const itemsHtml = (order.items ?? [])
    .map(
      (it) =>
        `<tr><td style="padding:8px 0;">${escape(it.productSnapshot.name)} × ${it.quantity}</td><td style="padding:8px 0;text-align:right;">${formatCents(it.lineTotalCents, order.currency)}</td></tr>`,
    )
    .join('')

  return {
    subject: `Recibimos tu pedido ${order.orderNumber} — ${businessName}`,
    html: `
<!doctype html><html><body style="font-family:system-ui,-apple-system,sans-serif;color:#111;max-width:600px;margin:0 auto;padding:24px;">
  <h1 style="font-size:20px;">Gracias por tu pedido</h1>
  <p>Hola ${escape(order.customerName)},</p>
  <p>Recibimos tu pedido <strong>${order.orderNumber}</strong>. Estamos esperando la confirmación del pago.</p>
  <table style="width:100%;border-collapse:collapse;margin:16px 0;">
    ${itemsHtml}
    <tr><td style="padding:8px 0;border-top:1px solid #eee;font-weight:600;">Total</td><td style="padding:8px 0;border-top:1px solid #eee;text-align:right;font-weight:600;">${formatCents(order.totalCents, order.currency)}</td></tr>
  </table>
  <p><a href="${storeUrl}" style="color:#111;">Ver mi orden</a></p>
  <p style="color:#666;font-size:12px;margin-top:24px;">${escape(businessName)} · enviado desde Paragu-AI</p>
</body></html>`.trim(),
  }
}

export function orderPaidEmail({ order, businessName, storeUrl }: Context) {
  return {
    subject: `¡Pago confirmado! Orden ${order.orderNumber} — ${businessName}`,
    html: `
<!doctype html><html><body style="font-family:system-ui,-apple-system,sans-serif;color:#111;max-width:600px;margin:0 auto;padding:24px;">
  <h1 style="font-size:20px;">Tu pago fue aprobado</h1>
  <p>Hola ${escape(order.customerName)},</p>
  <p>Confirmamos el pago de tu orden <strong>${order.orderNumber}</strong>. Ya estamos preparando el envío.</p>
  <p>Total pagado: <strong>${formatCents(order.totalCents, order.currency)}</strong></p>
  <p><a href="${storeUrl}" style="color:#111;">Ver mi orden</a></p>
  <p style="color:#666;font-size:12px;margin-top:24px;">${escape(businessName)} · enviado desde Paragu-AI</p>
</body></html>`.trim(),
  }
}

export function orderShippedEmail({ order, businessName, storeUrl }: Context) {
  return {
    subject: `Tu pedido ${order.orderNumber} fue enviado — ${businessName}`,
    html: `
<!doctype html><html><body style="font-family:system-ui,-apple-system,sans-serif;color:#111;max-width:600px;margin:0 auto;padding:24px;">
  <h1 style="font-size:20px;">¡Tu pedido salió!</h1>
  <p>Hola ${escape(order.customerName)},</p>
  <p>Despachamos tu orden <strong>${order.orderNumber}</strong>. Te avisamos cuando esté entregada.</p>
  <p><a href="${storeUrl}" style="color:#111;">Ver mi orden</a></p>
</body></html>`.trim(),
  }
}

interface CartRecoveryContext {
  customerName: string
  businessName: string
  recoveryUrl: string
  /** 1 = 24 h touch ("still thinking?"), 2 = 72 h, 3 = 7 d ("last chance"). */
  step: 1 | 2 | 3
}

export function cartRecoveryEmail(ctx: CartRecoveryContext) {
  const subjects: Record<1 | 2 | 3, string> = {
    1: `¿Seguís pensándolo? — ${ctx.businessName}`,
    2: `Tu carrito sigue esperando en ${ctx.businessName}`,
    3: `Última oportunidad — tu carrito en ${ctx.businessName}`,
  }
  const bodies: Record<1 | 2 | 3, string> = {
    1: 'Vimos que dejaste algunos productos en tu carrito. ¿Querés volver a revisarlos?',
    2: 'Tus productos siguen guardados. Si necesitás ayuda para decidir, escribinos por WhatsApp.',
    3: 'Tu carrito se va a vaciar pronto. Si te interesa algún producto, te conviene volver ahora.',
  }
  return {
    subject: subjects[ctx.step],
    html: `
<!doctype html><html><body style="font-family:system-ui,-apple-system,sans-serif;color:#111;max-width:600px;margin:0 auto;padding:24px;">
  <h1 style="font-size:20px;">Hola ${escape(ctx.customerName)},</h1>
  <p>${escape(bodies[ctx.step])}</p>
  <p style="margin:24px 0;"><a href="${ctx.recoveryUrl}" style="display:inline-block;background:#111;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">Volver a mi carrito</a></p>
  <p style="color:#666;font-size:12px;margin-top:24px;">Si ya compraste o no te interesa más, ignorá este mensaje. El link solo funciona por 7 días.</p>
  <p style="color:#666;font-size:12px;">${escape(ctx.businessName)} · enviado desde Paragu-AI</p>
</body></html>`.trim(),
  }
}

function escape(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}
