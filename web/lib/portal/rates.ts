const PLAN_PRICING = {
  free: { monthlyCents: 0, setupCents: 0, features: 'basic' as const },
  starter: { monthlyCents: 150000, setupCents: 650000, features: 'starter' as const },
  professional: { monthlyCents: 350000, setupCents: 1200000, features: 'professional' as const },
  enterprise: { monthlyCents: 700000, setupCents: 2200000, features: 'enterprise' as const },
}

export type PlanTier = keyof typeof PLAN_PRICING

export function getPlanPrice(tier: PlanTier): { monthlyCents: number; setupCents: number; features: string } {
  return PLAN_PRICING[tier] ?? PLAN_PRICING.free
}

export function listUpgradeOptions(currentTier: PlanTier): PlanTier[] {
  const tiers: PlanTier[] = ['free', 'starter', 'professional', 'enterprise']
  const idx = tiers.indexOf(currentTier)
  return tiers.slice(idx + 1)
}

export function listDowngradeOptions(currentTier: PlanTier): PlanTier[] {
  const tiers: PlanTier[] = ['free', 'starter', 'professional', 'enterprise']
  const idx = tiers.indexOf(currentTier)
  return tiers.slice(0, idx)
}

export function calculateUpgradePrice(currentTier: PlanTier, targetTier: PlanTier): number {
  const current = PLAN_PRICING[currentTier]?.monthlyCents ?? 0
  const target = PLAN_PRICING[targetTier]?.monthlyCents ?? 0
  const diff = target - current
  if (diff <= 0) return 0
  return diff
}
