/**
 * Evolution API client — WhatsApp Business API integration.
 *
 * Evolution runs on the VPS at evolution.sunstein.cloud.
 * Manages WhatsApp instances, sends messages, syncs catalogs.
 */

const EVOLUTION_URL = process.env.EVOLUTION_URL || 'https://evolution.sunstein.cloud'
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || 'a53c00ff3726d2ced6bbfeba8d1a1e90'

interface EvolutionResponse<T = unknown> {
  status: number
  data?: T
  error?: string
}

async function api<T = unknown>(
  method: string,
  path: string,
  body?: Record<string, unknown>,
): Promise<EvolutionResponse<T>> {
  try {
    const res = await fetch(`${EVOLUTION_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'apiKey': EVOLUTION_API_KEY,
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    const data = await res.json()
    return { status: res.status, data }
  } catch (e) {
    return { status: 0, error: String(e) }
  }
}

/**
 * Create a new WhatsApp instance for a business.
 * Returns the QR code that the business owner needs to scan.
 */
export async function createInstance(instanceName: string): Promise<EvolutionResponse<{ qrcode: string; instance: string }>> {
  return api('POST', '/instance/create', {
    instanceName,
    qrcode: true,
    integration: 'WHATSAPP-BAI',
    reject_call: false,
    msg_call: false,
    groups_ignore: true,
    always_online: false,
    read_messages: true,
    read_status: true,
    sync_full_history: false,
  })
}

/**
 * Get the current QR code for an instance (for reconnection).
 */
export async function getQRCode(instanceName: string): Promise<EvolutionResponse<{ qrcode: string }>> {
  return api('GET', `/instance/connect/${instanceName}`)
}

/**
 * Check instance connection state.
 */
export async function getInstanceState(instanceName: string): Promise<EvolutionResponse<{ state: string }>> {
  return api('GET', `/instance/connectionState/${instanceName}`)
}

/**
 * Send a text message via WhatsApp.
 */
export async function sendText(
  instanceName: string,
  to: string,
  text: string,
): Promise<EvolutionResponse<unknown>> {
  return api('POST', `/message/sendText/${instanceName}`, {
    number: to.replace(/\D/g, ''),
    text,
    delay: 1200,
  })
}

/**
 * Send a template message (for booking confirmations, reminders).
 */
export async function sendBookingConfirmation(
  instanceName: string,
  to: string,
  customerName: string,
  serviceName: string,
  date: string,
  time: string,
): Promise<EvolutionResponse<unknown>> {
  const text = `🆕 *Nueva reserva confirmada* 🎉

👤 Cliente: ${customerName}
💇 Servicio: ${serviceName}
📅 Fecha: ${date}
⏰ Hora: ${time}

Gracias por elegirnos! Te esperamos.`

  return sendText(instanceName, to, text)
}

/**
 * Send booking reminder (24h before).
 */
export async function sendBookingReminder(
  instanceName: string,
  to: string,
  customerName: string,
  date: string,
  time: string,
): Promise<EvolutionResponse<unknown>> {
  const text = `⏰ *Recordatorio de cita*

Hola ${customerName}! Te recordamos que tenes una cita mañana:

📅 ${date}
⏰ ${time}

Si necesitas cancelar o reprogramar, avisanos con anticipacion.

Gracias!`

  return sendText(instanceName, to, text)
}

/**
 * Notify business owner of new booking.
 */
export async function notifyNewBooking(
  instanceName: string,
  ownerPhone: string,
  booking: { customerName: string; customerPhone: string; service: string; date: string; time: string },
): Promise<EvolutionResponse<unknown>> {
  const text = `🆕 *Nueva reserva* en tu negocio!

👤 Cliente: ${booking.customerName}
📞 Tel: ${booking.customerPhone}
💇 Servicio: ${booking.service}
📅 Fecha: ${booking.date}
⏰ Hora: ${booking.time}

Gestiona desde: https://paragu-ai.com/admin/bookings`

  return sendText(instanceName, ownerPhone.replace(/\D/g, ''), text)
}

/**
 * Sync business services as a WhatsApp catalog.
 * Creates product messages that appear as catalog entries.
 */
export async function syncCatalog(
  instanceName: string,
  services: Array<{ name: string; description: string; price: string; imageUrl?: string }>,
): Promise<EvolutionResponse<unknown>> {
  const products = services.map(s => ({
    name: s.name,
    description: s.description,
    price: s.price,
    imageUrl: s.imageUrl || '',
  }))

  return api('POST', `/catalog/create/${instanceName}`, {
    products,
    currency: 'PYG',
  })
}

/**
 * Delete an instance (when a client unsubscribes).
 */
export async function deleteInstance(instanceName: string): Promise<EvolutionResponse<unknown>> {
  return api('DELETE', `/instance/delete/${instanceName}`)
}

/**
 * Set up webhook for incoming messages.
 */
export async function setWebhook(
  instanceName: string,
  webhookUrl: string,
): Promise<EvolutionResponse<unknown>> {
  return api('POST', `/instance/setWebhook/${instanceName}`, {
    webhook: {
      url: webhookUrl,
      events: ['MESSAGE', 'SEND_MESSAGE'],
    },
  })
}
