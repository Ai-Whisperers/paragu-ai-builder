'use client'

import { useContext, createContext } from 'react'

interface FeatureContextValue {
  features: Record<string, boolean>
}

export const FeatureContext = createContext<FeatureContextValue>({ features: {} })

export function useFeature(key: string): boolean {
  const { features } = useContext(FeatureContext)
  return features[key] ?? false
}