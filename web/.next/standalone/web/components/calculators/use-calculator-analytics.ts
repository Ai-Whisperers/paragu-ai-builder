'use client'

import { useCallback, useEffect } from 'react'

type CalculatorEvent = 
  | 'calculator_started'
  | 'calculator_interacted'
  | 'calculator_completed'
  | 'calculator_cta_clicked'
  | 'calculator_lead_captured'
  | 'calculatorPDF_downloaded'

interface AnalyticsProperties {
  calculator_name?: string
  calculator_source?: string
  locale?: string
  value?: number
  country_code?: string
  income_eur?: number
  savings_eur?: number
  budget_usd?: number
  score?: number
  program?: string
  page_path?: string
  referrer?: string
}

async function trackEvent(event: CalculatorEvent, properties: AnalyticsProperties = {}): Promise<void> {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: `calculator_${event}`,
        properties: {
          ...properties,
          timestamp: new Date().toISOString(),
          source: `calculator_${properties.calculator_name || 'unknown'}`,
        },
      }),
    })
  } catch (err) {
    console.error('Analytics tracking failed:', err)
  }
}

export function useCalculatorAnalytics(calculatorName: string, locale = 'en') {
  useEffect(() => {
    trackEvent('calculator_started', { calculator_name: calculatorName, locale, page_path: window.location.pathname })
  }, [calculatorName, locale])

  const trackInteraction = useCallback(async (action: string, data: Record<string, unknown> = {}) => {
    await trackEvent('calculator_interacted', {
      calculator_name: calculatorName,
      locale,
      ...data,
    })
  }, [calculatorName, locale])

  const trackCompleted = useCallback(async (results: Record<string, unknown>) => {
    await trackEvent('calculator_completed', {
      calculator_name: calculatorName,
      locale,
      ...(results as unknown as AnalyticsProperties),
    })
  }, [calculatorName, locale])

  const trackCTAClick = useCallback(async (ctaType: string) => {
    await trackEvent('calculator_cta_clicked', {
      calculator_name: calculatorName,
      calculator_source: ctaType,
      locale,
    })
  }, [calculatorName, locale])

  const trackLeadCaptured = useCallback(async (email: string, results?: Record<string, unknown>) => {
    await trackEvent('calculator_lead_captured', {
      calculator_name: calculatorName,
      locale,
      ...(results as unknown as AnalyticsProperties),
    })
  }, [calculatorName, locale])

  const trackPDFDownload = useCallback(async () => {
    await trackEvent('calculatorPDF_downloaded', {
      calculator_name: calculatorName,
      locale,
    })
  }, [calculatorName, locale])

  return {
    trackInteraction,
    trackCompleted,
    trackCTAClick,
    trackLeadCaptured,
    trackPDFDownload,
  }
}

export { trackEvent }
export type { CalculatorEvent, AnalyticsProperties }