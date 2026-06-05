/**
 * ANNOTATION: FeaturesProvider
 *
 * What it is: React context provider that reads feature flags from the site configuration
 * and exposes them to all child components via FeatureContext.
 *
 * Why your business needs it: Feature flags control what sections and functionality appear on your site.
 * This lets us enable/disable components like gift cards, promotions, bookings, etc. without code changes.
 *
 * What AI populates from your data:
 *   - Feature flags from content/es/site.json and content/en/site.json → features object
 *   - Feature names and enabled/disabled states
 *
 * Your input: Tell ParaguAI which features you want enabled via WhatsApp during onboarding.
 *
 * Plan availability: All plans — features vary by tier
 */

/**
 * @component FeaturesProvider
 * @description Feature flag context provider wrapping the app.
 * @featureFlags core
 * @requires getFeatures, FeatureContext
 * @implementation Reads lang from URL params, loads features, provides React context
 */

'use client'

import { useParams } from 'next/navigation'
import { FeatureContext } from '@/lib/hooks/use-feature'
import { getFeatures } from '@/lib/features'

export function FeaturesProvider({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const lang = (params?.lang as string) || 'es'
  const features = getFeatures(lang as 'es' | 'en')

  return (
    <FeatureContext.Provider value={{ features }}>
      {children}
    </FeatureContext.Provider>
  )
}