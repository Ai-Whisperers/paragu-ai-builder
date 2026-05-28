/**
 * Centralized error handling for the commerce system.
 * Provides typed errors, user-facing messages, and structured logging.
 */

export class CommerceError extends Error {
  constructor(
    message: string,
    public code: CommerceErrorCode,
    public context?: Record<string, unknown>,
  ) {
    super(message)
    this.name = 'CommerceError'
  }
}

export type CommerceErrorCode =
  | 'business_not_found'
  | 'product_not_found'
  | 'product_out_of_stock'
  | 'insufficient_inventory'
  | 'cart_not_found'
  | 'checkout_failed'
  | 'payment_failed'
  | 'invalid_coupon'
  | 'shipping_unavailable'
  | 'rate_limit'
  | 'internal_error'

const USER_MESSAGES: Record<CommerceErrorCode, string> = {
  business_not_found: 'Tienda no encontrada.',
  product_not_found: 'Producto no encontrado.',
  product_out_of_stock: 'Producto agotado.',
  insufficient_inventory: 'Stock insuficiente.',
  cart_not_found: 'Carrito no encontrado.',
  checkout_failed: 'Error al procesar la compra. Intenta de nuevo.',
  payment_failed: 'Error en el pago. Verifica tus datos.',
  invalid_coupon: 'Cupon invalido o expirado.',
  shipping_unavailable: 'Envio no disponible para tu direccion.',
  rate_limit: 'Demasiadas solicitudes. Intenta de nuevo en unos segundos.',
  internal_error: 'Error interno. Intenta de nuevo.',
}

export function getUserMessage(code: CommerceErrorCode): string {
  return USER_MESSAGES[code]
}

export function handleCommerceError(
  error: unknown,
  defaultCode: CommerceErrorCode = 'internal_error',
  context?: Record<string, unknown>,
): { code: CommerceErrorCode; message: string } {
  if (error instanceof CommerceError) {
    const message = getUserMessage(error.code)
    return { code: error.code, message }
  }

  const message = error instanceof Error ? error.message : 'Unknown error'
  const logger = getLogger()
  logger.error(`[Commerce] ${defaultCode}: ${message}`, { error, ...context })

  if (process.env.NODE_ENV === 'production' && typeof captureException === 'function') {
    captureException(error instanceof Error ? error : new Error(String(error)))
  }

  return { code: defaultCode, message: getUserMessage(defaultCode) }
}

function getLogger() {
  try {
     
    return require('@/lib/logger')
  } catch {
    return { error: console.error, warn: console.warn, info: console.log }
  }
}

function captureException(_error: Error) {
  // Stub — integrates with Sentry via lib/obs/sentry
}
