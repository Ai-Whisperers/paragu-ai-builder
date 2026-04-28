/**
 * Per-tenant commerce configuration. Every commerce component that needs
 * site-specific behavior should read from this module instead of
 * hardcoding values.
 *
 * When adding a new option, add the field to TenantCommerceConfig, set
 * defaults in getConfig(), and override per tenant below.
 */

export interface TenantCommerceConfig {
  /** Show/hide the discreet mode toggle (only relevant for adult retail). */
  hideDiscreetMode: boolean
  /** Show/hide the currency toggle. Hidden when tenant only operates in PYG. */
  hideCurrencyToggle: boolean
  /** Tag groups for the advanced filter toolbar. Empty array = hide tag filters. */
  tagGroups: Array<{ id: string; label: string; tags: string[] }>
  /** When true, the product finder quiz is shown. */
  showQuizFab: boolean
}

const DEFAULTS: TenantCommerceConfig = {
  hideDiscreetMode: true,
  hideCurrencyToggle: true,
  tagGroups: [],
  showQuizFab: false,
}

const CONFIGS: Record<string, Partial<TenantCommerceConfig>> = {
  fun4me: {
    hideDiscreetMode: false,
    hideCurrencyToggle: false,
    tagGroups: [
      {
        id: 'material',
        label: 'Material',
        tags: ['silicona', 'base-agua', 'base-silicona', 'tela', 'apto-latex', 'apto-piel', 'encaje'],
      },
      {
        id: 'caracteristicas',
        label: 'Caracteristicas',
        tags: ['silencioso', 'recargable', 'impermeable', 'larga-duracion', 'progresivo', 'sensible', 'estimulador'],
      },
      {
        id: 'experiencia',
        label: 'Nivel de experiencia',
        tags: ['principiantes', 'clasico', 'sensorial', 'realista'],
      },
      {
        id: 'contexto',
        label: 'Pensado para',
        tags: ['parejas', 'regalo', 'roleplay', 'corporal', 'kit'],
      },
      {
        id: 'estilo',
        label: 'Estilo',
        tags: ['elegante'],
      },
    ],
    showQuizFab: true,
  },
}

export function getConfig(siteSlug: string): TenantCommerceConfig {
  const override = CONFIGS[siteSlug] ?? {}
  return { ...DEFAULTS, ...override }
}
