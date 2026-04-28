/**
 * UNIFIED per-tenant commerce configuration.
 *
 * EVERY commerce component that needs site-specific behavior MUST read
 * from this module. This is the SINGLE source of truth for:
 *   - Feature flags (discreet mode, currency toggle, quiz)
 *   - Commerce rules (free shipping threshold, installments)
 *   - Filter configuration (tag groups)
 *   - Trust signals (trust items)
 *
 * To add a new tenant: add an entry to CONFIGS below.
 * To add a new option: add field to TenantCommerceConfig + set default in DEFAULTS.
 */

// ─── Shared types ───────────────────────────────────────────

export interface InstallmentConfig {
  maxCuotas: number
  minAmountCents: number
}

export interface TrustItem {
  icon: string
  title: string
  description: string
}

export interface TagGroup {
  id: string
  label: string
  tags: string[]
}

export interface InstallmentDisplay {
  count: number
  perCuotaCents: number
  freeOfInterest: boolean
}

// ─── Config interface ───────────────────────────────────────

export interface TenantCommerceConfig {
  /** Feature flags */
  hideDiscreetMode: boolean
  hideCurrencyToggle: boolean
  showQuizFab: boolean

  /** Trust signals — shown above the product grid */
  trustItems?: TrustItem[]

  /** Commerce rules */
  freeShippingThresholdCents: number
  installments?: InstallmentConfig

  /** Filter configuration — empty array hides tag filters */
  tagGroups: TagGroup[]
}

// ─── Defaults ──────────────────────────────────────────────

const DEFAULTS: TenantCommerceConfig = {
  hideDiscreetMode: true,
  hideCurrencyToggle: true,
  showQuizFab: false,
  freeShippingThresholdCents: 0,
  tagGroups: [],
}

// ─── Per-tenant overrides ──────────────────────────────────

const CONFIGS: Record<string, Partial<TenantCommerceConfig>> = {
  fun4me: {
    hideDiscreetMode: false,
    hideCurrencyToggle: false,
    showQuizFab: true,
    freeShippingThresholdCents: 20_000_000, // Gs. 200.000
    installments: { maxCuotas: 6, minAmountCents: 5_000_000 },
    tagGroups: [
      { id: 'material', label: 'Material', tags: ['silicona', 'base-agua', 'base-silicona', 'tela', 'apto-latex', 'apto-piel', 'encaje'] },
      { id: 'caracteristicas', label: 'Caracteristicas', tags: ['silencioso', 'recargable', 'impermeable', 'larga-duracion', 'progresivo', 'sensible', 'estimulador'] },
      { id: 'experiencia', label: 'Nivel de experiencia', tags: ['principiantes', 'clasico', 'sensorial', 'realista'] },
      { id: 'contexto', label: 'Pensado para', tags: ['parejas', 'regalo', 'roleplay', 'corporal', 'kit'] },
      { id: 'estilo', label: 'Estilo', tags: ['elegante'] },
    ],
  },
  'viajero-comercio': {
    freeShippingThresholdCents: 30_000_000, // Gs. 300.000
    installments: { maxCuotas: 3, minAmountCents: 10_000_000 }, // 3 cuotas desde Gs. 100.000
  },
}

// ─── Public API ────────────────────────────────────────────

export function getConfig(siteSlug: string): TenantCommerceConfig {
  const override = CONFIGS[siteSlug] ?? {}
  return { ...DEFAULTS, ...override }
}

/** @deprecated Use getConfig(siteSlug).freeShippingThresholdCents instead */
export function getFreeShippingThresholdCents(siteSlug: string): number {
  return getConfig(siteSlug).freeShippingThresholdCents
}

/**
 * Compute installment display for a product. Returns null when the tenant
 * has no installment config, the currency isn't PYG, or price is below floor.
 */
export function computeInstallmentDisplay(
  siteSlug: string,
  priceCents: number,
  currency: string,
): InstallmentDisplay | null {
  if (currency !== 'PYG') return null
  const cfg = getConfig(siteSlug).installments
  if (!cfg) return null
  if (priceCents < cfg.minAmountCents) return null
  if (cfg.maxCuotas < 2) return null

  const raw = priceCents / cfg.maxCuotas
  const perCuotaCents = Math.round(raw / 100_000) * 100_000
  return { count: cfg.maxCuotas, perCuotaCents, freeOfInterest: true }
}
