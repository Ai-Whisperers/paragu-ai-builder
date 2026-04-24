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
  const trackingBlock =
    order.trackingCarrier || order.trackingNumber || order.trackingUrl
      ? `
  <div style="margin:16px 0;padding:12px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;">
    <p style="margin:0 0 4px 0;font-size:12px;font-weight:600;text-transform:uppercase;color:#6b7280;">Seguimiento</p>
    ${order.trackingCarrier ? `<p style="margin:0;">${escape(order.trackingCarrier)}</p>` : ''}
    ${order.trackingNumber ? `<p style="margin:0;font-family:monospace;">${escape(order.trackingNumber)}</p>` : ''}
    ${order.trackingUrl ? `<p style="margin:4px 0 0 0;"><a href="${escape(order.trackingUrl)}" style="color:#111;font-size:13px;">Ver en el transportista →</a></p>` : ''}
  </div>`
      : ''
  return {
    subject: `Tu pedido ${order.orderNumber} fue enviado — ${businessName}`,
    html: `
<!doctype html><html><body style="font-family:system-ui,-apple-system,sans-serif;color:#111;max-width:600px;margin:0 auto;padding:24px;">
  <h1 style="font-size:20px;">¡Tu pedido salió!</h1>
  <p>Hola ${escape(order.customerName)},</p>
  <p>Despachamos tu orden <strong>${order.orderNumber}</strong>. Te avisamos cuando esté entregada.</p>
  ${trackingBlock}
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

export interface BackInStockContext {
  productName: string
  productUrl: string
  businessName: string
}

export function backInStockEmail(ctx: BackInStockContext) {
  return {
    subject: `¡${ctx.productName} volvió al stock!`,
    html: `
<!doctype html><html><body style="font-family:system-ui,-apple-system,sans-serif;color:#111;max-width:600px;margin:0 auto;padding:24px;">
  <h1 style="font-size:20px;">Tu producto volvió</h1>
  <p><strong>${escape(ctx.productName)}</strong> está otra vez disponible en ${escape(ctx.businessName)}.</p>
  <p style="margin:24px 0;"><a href="${ctx.productUrl}" style="display:inline-block;background:#111;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">Comprar ahora</a></p>
  <p style="color:#666;font-size:12px;margin-top:24px;">Este es el único aviso que vas a recibir por este producto. Si ya no te interesa, ignorá este mensaje.</p>
  <p style="color:#666;font-size:12px;">${escape(ctx.businessName)} · enviado desde Paragu-AI</p>
</body></html>`.trim(),
  }
}

export interface ReviewRequestContext {
  customerName: string
  businessName: string
  orderNumber: string
  /** Products to ask the customer to review. Deep-links directly to the
   * review-form anchor on each PDP so they don't have to hunt for it. */
  products: Array<{ name: string; reviewUrl: string }>
}

export function reviewRequestEmail(ctx: ReviewRequestContext) {
  const itemsHtml = ctx.products
    .map(
      (p) => `
    <li style="margin:8px 0;">
      <a href="${p.reviewUrl}" style="color:#111;text-decoration:underline;">${escape(p.name)}</a>
    </li>`,
    )
    .join('')
  return {
    subject: `¿Cómo te fue con tu pedido ${ctx.orderNumber}? — ${ctx.businessName}`,
    html: `
<!doctype html><html><body style="font-family:system-ui,-apple-system,sans-serif;color:#111;max-width:600px;margin:0 auto;padding:24px;">
  <h1 style="font-size:20px;">¡Gracias por tu compra!</h1>
  <p>Hola ${escape(ctx.customerName)},</p>
  <p>Esperamos que hayas recibido tu pedido <strong>${escape(ctx.orderNumber)}</strong> y que te esté gustando lo que elegiste.</p>
  <p>Nos ayuda muchísimo que otras personas que están decidiendo vean tu experiencia. ¿Te animás a dejar una reseña?</p>
  <ul style="padding-left:20px;">${itemsHtml}</ul>
  <p style="color:#666;font-size:12px;margin-top:24px;">Tu reseña pasa por moderación antes de publicarse. Podés escribir con nombre propio o un alias.</p>
  <p style="color:#666;font-size:12px;">${escape(ctx.businessName)} · enviado desde Paragu-AI</p>
</body></html>`.trim(),
  }
}

export interface AdminNewOrderContext {
  order: Order
  businessName: string
  adminDashboardUrl: string
}

/**
 * Notifies the merchant that a new order was placed. Fast scannable
 * format with all decision-relevant info so the merchant can act
 * without logging in (reply to WhatsApp, prep the package, etc.).
 */
export function adminNewOrderEmail({ order, businessName, adminDashboardUrl }: AdminNewOrderContext) {
  const itemsHtml = (order.items ?? [])
    .map(
      (it) =>
        `<tr><td style="padding:6px 0;">${escape(it.productSnapshot.name)} × ${it.quantity}</td><td style="padding:6px 0;text-align:right;">${formatCents(it.lineTotalCents, order.currency)}</td></tr>`,
    )
    .join('')

  const addr = order.shippingAddress
  const addrLine = addr
    ? `${escape(addr.line1)}${addr.line2 ? ', ' + escape(addr.line2) : ''}, ${escape(addr.city)}${addr.department ? ' (' + escape(addr.department) + ')' : ''}`
    : '—'

  const phoneDigits = order.customerPhone ? order.customerPhone.replace(/\D/g, '') : ''
  const whatsappUrl = phoneDigits
    ? `https://wa.me/${phoneDigits}?text=${encodeURIComponent(`Hola ${order.customerName}, recibimos tu pedido ${order.orderNumber}.`)}`
    : null

  return {
    subject: `🛒 Nueva orden ${order.orderNumber} — ${formatCents(order.totalCents, order.currency)} (${businessName})`,
    html: `
<!doctype html><html><body style="font-family:system-ui,-apple-system,sans-serif;color:#111;max-width:600px;margin:0 auto;padding:24px;">
  <h1 style="font-size:20px;margin:0 0 8px 0;">Nuevo pedido</h1>
  <p style="color:#6b7280;margin:0 0 16px 0;font-size:13px;">Orden <strong style="color:#111;">${order.orderNumber}</strong> · ${new Date(order.createdAt).toLocaleString('es-PY')}</p>
  <div style="display:inline-block;background:#fef3c7;color:#92400e;padding:4px 10px;border-radius:4px;font-size:12px;font-weight:600;margin-bottom:16px;">Esperando pago</div>
  <table style="width:100%;border-collapse:collapse;margin:0 0 16px 0;font-size:14px;">
    ${itemsHtml}
    <tr><td style="padding:8px 0;border-top:1px solid #e5e7eb;font-weight:600;">Total</td><td style="padding:8px 0;border-top:1px solid #e5e7eb;text-align:right;font-weight:600;">${formatCents(order.totalCents, order.currency)}</td></tr>
  </table>
  <div style="background:#f9fafb;border-radius:8px;padding:12px;margin:0 0 16px 0;font-size:14px;">
    <p style="margin:0 0 4px 0;font-weight:600;">${escape(order.customerName)}</p>
    <p style="margin:0 0 4px 0;color:#6b7280;">${escape(order.customerEmail)}</p>
    ${order.customerPhone ? `<p style="margin:0 0 4px 0;color:#6b7280;">${escape(order.customerPhone)}</p>` : ''}
    <p style="margin:8px 0 0 0;color:#6b7280;font-size:12px;">Envío: ${addrLine}</p>
  </div>
  <div style="margin:0 0 8px 0;">
    <a href="${adminDashboardUrl}" style="display:inline-block;background:#111;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">Ver en el admin →</a>
    ${whatsappUrl ? `<a href="${whatsappUrl}" style="display:inline-block;background:#25D366;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;margin-left:8px;">WhatsApp cliente</a>` : ''}
  </div>
  <p style="color:#9ca3af;font-size:11px;margin-top:24px;">${escape(businessName)} · notificación automática de Paragu-AI</p>
</body></html>`.trim(),
  }
}

function escape(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}

export interface DataRequestContext {
  siteSlug: string
  email: string
  kind: 'access' | 'rectification' | 'deletion' | 'portability' | 'objection'
  description?: string | null
  dueAt: string
}

export function dataRequestEmail({ siteSlug, email, kind, description, dueAt }: DataRequestContext) {
  const kindLabels: Record<string, string> = {
    access: 'Acceso',
    rectification: 'Rectificación',
    deletion: 'Supresión',
    portability: 'Portabilidad',
    objection: 'Oposición',
  }
  const kindLabel = kindLabels[kind] || kind

  return {
    subject: `🔒 Solicitud de datos (Ley 1.682/01) — ${kindLabel}`,
    html: `
<!doctype html><html><body style="font-family:system-ui,-apple-system,sans-serif;color:#111;max-width:600px;margin:0 auto;padding:24px;">
  <h1 style="font-size:20px;margin:0 0 16px 0;">Solicitud de Datos de Usuario</h1>
  <div style="background:#fef3c7;color:#92400e;padding:8px 12px;border-radius:6px;margin:0 0 16px 0;font-size:13px;font-weight:600;">
    Ley 1.682/01 — Paraguay
  </div>
  <table style="width:100%;border-collapse:collapse;margin:0 0 16px 0;font-size:14px;">
    <tr><td style="padding:8px 0;color:#6b7280;">Sitio</td><td style="padding:8px 0;text-align:right;"><strong>${escape(siteSlug)}</strong></td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">Email</td><td style="padding:8px 0;text-align:right;">${escape(email)}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">Tipo</td><td style="padding:8px 0;text-align:right;"><strong>${escape(kindLabel)}</strong></td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">Fecha límite</td><td style="padding:8px 0;text-align:right;">${new Date(dueAt).toLocaleDateString('es-PY', { day: 'numeric', month: 'short', year: 'numeric' })}</td></tr>
  </table>
  ${description ? `<div style="background:#f9fafb;border-radius:8px;padding:12px;margin:0 0 16px 0;"><p style="margin:0 0 8px 0;font-weight:600;">Descripción</p><p style="margin:0 0 0 0;font-size:13px;">${escape(description)}</p></div>` : ''}
  <p style="color:#6b7280;font-size:13px;margin:24px 0 0 0;">Esta solicitud debe ser atendida dentro del plazo máximo de 30 días hábiles según la Ley 1.682/01 de Protección de Datos Personales.</p>
  <p style="color:#9ca3af;font-size:11px;margin-top:24px;">Notificación automática de Paragu-AI · Ley 1.682/01</p>
</body></html>`.trim(),
  }
}

export interface BookingConfirmationContext {
  customerName: string
  customerEmail: string
  businessName: string
  serviceName: string
  bookingDate: string
  bookingTime: string
  bookingId: string
}

export function bookingConfirmationEmail({
  customerName,
  customerEmail,
  businessName,
  serviceName,
  bookingDate,
  bookingTime,
  bookingId,
}: BookingConfirmationContext) {
  const formattedDate = new Date(bookingDate).toLocaleDateString('es-PY', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const formattedTime = new Date(`2000-01-01T${bookingTime}`).toLocaleTimeString('es-PY', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return {
    subject: `✅ Tu reserva está confirmada — ${businessName}`,
    html: `
<!doctype html><html><body style="font-family:system-ui,-apple-system,sans-serif;color:#111;max-width:600px;margin:0 auto;padding:24px;">
  <h1 style="font-size:20px;margin:0 0 16px 0;">¡Reserva Confirmada!</h1>
  <p>Hola ${escape(customerName)},</p>
  <p>Tu reserva ha sido registrada exitosamente. Estos son los detalles:</p>
  <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:0 0 16px 0;">
    <p style="margin:0 0 8px 0;"><strong>Empresa:</strong> ${escape(businessName)}</p>
    <p style="margin:0 0 8px 0;"><strong>Servicio:</strong> ${escape(serviceName)}</p>
    <p style="margin:0 0 8px 0;"><strong>Fecha:</strong> ${formattedDate}</p>
    <p style="margin:0 0 8px 0;"><strong>Horario:</strong> ${formattedTime} horas</p>
    <p style="margin:0 0 0 0;color:#6b7280;font-size:13px;">Referencia: #${escape(bookingId)}</p>
  </div>
  <p style="color:#6b7280;font-size:13px;margin:24px 0 0 0;">Por favor, llega 5 minutos antes de tu horario reservado. Si necesitás cambiar o cancelar tu reserva, contactanos lo antes posible.</p>
  <p style="color:#9ca3af;font-size:11px;margin-top:24px;">${escape(businessName)} · enviado desde Paragu-AI</p>
</body></html>`.trim(),
  }
}

function escape(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}
}

export function dataRequestEmail({ siteSlug, email, kind, description, dueAt }: DataRequestContext) {
  const kindLabels: Record<string, string> = {
    access: 'Acceso',
    rectification: 'Rectificación',
    deletion: 'Supresión',
    portability: 'Portabilidad',
    objection: 'Oposición',
  }
  const kindLabel = kindLabels[kind] || kind

  return {
    subject: `🔒 Solicitud de datos (Ley 1.682/01) — ${kindLabel}`,
    html: `
<!doctype html><html><body style="font-family:system-ui,-apple-system,sans-serif;color:#111;max-width:600px;margin:0 auto;padding:24px;">
  <h1 style="font-size:20px;margin:0 0 16px 0;">Solicitud de Datos de Usuario</h1>
  <div style="background:#fef3c7;color:#92400e;padding:8px 12px;border-radius:6px;margin:0 0 16px 0;font-size:13px;font-weight:600;">
    Ley 1.682/01 — Paraguay
  </div>
  <table style="width:100%;border-collapse:collapse;margin:0 0 16px 0;font-size:14px;">
    <tr><td style="padding:8px 0;color:#6b7280;">Sitio</td><td style="padding:8px 0;text-align:right;"><strong>${escape(siteSlug)}</strong></td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">Email</td><td style="padding:8px 0;text-align:right;">${escape(email)}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">Tipo</td><td style="padding:8px 0;text-align:right;"><strong>${escape(kindLabel)}</strong></td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">Fecha límite</td><td style="padding:8px 0;text-align:right;">${new Date(dueAt).toLocaleDateString('es-PY', { day: 'numeric', month: 'short', year: 'numeric' })}</td></tr>
  </table>
  ${description ? `<div style="background:#f9fafb;border-radius:8px;padding:12px;margin:0 0 16px 0;"><p style="margin:0 0 8px 0;font-weight:600;">Descripción</p><p style="margin:0 0 0 0;font-size:13px;">${escape(description)}</p></div>` : ''}
  <p style="color:#6b7280;font-size:13px;margin:24px 0 0 0;">Esta solicitud debe ser atendida dentro del plazo máximo de 30 días hábiles según la Ley 1.682/01 de Protección de Datos Personales.</p>
  <p style="color:#9ca3af;font-size:11px;margin-top:24px;">Notificación automática de Paragu-AI · Ley 1.682/01</p>
</body></html>`.trim(),
  }
}
