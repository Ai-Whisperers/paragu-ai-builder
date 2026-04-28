const TIER_FEATURES = {
  free: {
    sections: 5,
    customDomain: false,
    booking: false,
    commerce: false,
    analytics: false,
    multiUser: false,
    multiLocale: false,
    team: false,
    blog: false,
    gallery: false,
    exportCsv: false,
    draftMode: false,
  },
  starter: {
    sections: 20,
    customDomain: true,
    booking: true,
    commerce: false,
    analytics: true,
    multiUser: false,
    multiLocale: false,
    team: true,
    blog: true,
    gallery: true,
    exportCsv: true,
    draftMode: false,
  },
  professional: {
    sections: 50,
    customDomain: true,
    booking: true,
    commerce: true,
    analytics: true,
    multiUser: true,
    multiLocale: true,
    team: true,
    blog: true,
    gallery: true,
    exportCsv: true,
    draftMode: true,
  },
  enterprise: {
    sections: Infinity,
    customDomain: true,
    booking: true,
    commerce: true,
    analytics: true,
    multiUser: true,
    multiLocale: true,
    team: true,
    blog: true,
    gallery: true,
    exportCsv: true,
    draftMode: true,
  },
} as const

export type PlanTier = keyof typeof TIER_FEATURES

export interface FeatureSet {
  sections: number
  customDomain: boolean
  booking: boolean
  commerce: boolean
  analytics: boolean
  multiUser: boolean
  multiLocale: boolean
  team: boolean
  blog: boolean
  gallery: boolean
  exportCsv: boolean
  draftMode: boolean
}

export function getFeatures(tier: PlanTier): FeatureSet {
  return TIER_FEATURES[tier] ?? TIER_FEATURES.free
}

export function hasFeature(tier: PlanTier | null | undefined, feature: keyof FeatureSet): boolean {
  if (!tier) return false
  const features = getFeatures(tier)
  const val = features[feature]
  return typeof val === 'boolean' ? val : val > 0
}

const TIER_ORDER: PlanTier[] = ['free', 'starter', 'professional', 'enterprise']

export function tierIndex(tier: PlanTier): number {
  return TIER_ORDER.indexOf(tier)
}

export function meetsMinimum(current: PlanTier | null, minimum: PlanTier): boolean {
  if (!current) return false
  return tierIndex(current) >= tierIndex(minimum)
}

export function maxSections(tier: PlanTier | null): number {
  if (!tier) return 0
  return TIER_FEATURES[tier]?.sections ?? 0
}
