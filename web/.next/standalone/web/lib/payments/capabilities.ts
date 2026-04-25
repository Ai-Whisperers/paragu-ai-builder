import type { PaymentCapability } from './types'

/**
 * Per-provider capability matrix. Source of truth for the router.
 *
 * Update this file when:
 *   - Adding a new provider adapter (also add to registry.ts)
 *   - A provider expands into a new country
 *   - A provider's fee tier changes meaningfully
 *
 * basePriority lowers = more preferred. Pagopar wins for PY because it
 * covers cash kiosks; dLocal wins for cross-border because it consolidates
 * 20+ countries; Bancard wins on fees only when explicitly chosen.
 */
export const CAPABILITIES: PaymentCapability[] = [
  {
    provider: 'pagopar',
    countries: ['PY'],
    currencies: ['PYG'],
    methods: ['credit_card', 'debit_card', 'wallet', 'cash_kiosk', 'bank_transfer', 'qr', 'pix'],
    feeTier: 'medium',
    basePriority: 1,
  },
  {
    // Offline bank transfer + WhatsApp comprobante. Countries/currencies
    // empty = works everywhere, but `requiresExplicitAvailable` stops it
    // from being offered unless the merchant explicitly installed manual
    // credentials via the admin payments page. That way the router's
    // default behavior for a fresh PY merchant is still "try Pagopar",
    // not "silently drop them into manual-transfer mode."
    provider: 'manual',
    countries: [],
    currencies: [],
    methods: ['bank_transfer'],
    feeTier: 'low',
    basePriority: 99,
    requiresExplicitAvailable: true,
  },
  {
    provider: 'bancard',
    countries: ['PY'],
    currencies: ['PYG'],
    methods: ['credit_card', 'debit_card'],
    feeTier: 'low',
    basePriority: 5, // direct VPOS — only when explicitly chosen
  },
  {
    provider: 'dlocal',
    countries: ['AR', 'BR', 'CL', 'CO', 'MX', 'PE', 'UY', 'EC', 'BO'],
    currencies: ['USD', 'ARS', 'BRL', 'CLP', 'COP', 'MXN', 'PEN', 'UYU'],
    methods: ['credit_card', 'debit_card', 'bank_transfer', 'pix', 'cash_kiosk', 'wallet'],
    feeTier: 'medium',
    basePriority: 2,
  },
]
