"use client"

import featuresData from "@/content/_shared/pricing-features.json"
import pricingData from "@/content/_shared/pricing.json"
import { Check, X } from "lucide-react"

type FeatureValue = boolean | number | string

interface Feature {
  name: string
  values: [FeatureValue, FeatureValue, FeatureValue]
}

interface PricingData {
  tiers: { name: string }[]
}

export function PricingComparisonMatrix({ lang = "es" }: { lang?: "es" | "en" }) {
  const features = featuresData.features as Feature[]
  const tiers = (pricingData as PricingData).tiers

  const renderValue = (value: FeatureValue) => {
    if (value === true) return <Check className="w-5 h-5 text-green-500 mx-auto" />
    if (value === false) return <X className="w-5 h-5 text-gray-300 mx-auto" />
    if (value === "unlimited") return <span className="text-primary font-semibold text-sm">{lang === "es" ? "Ilimitado" : "Unlimited"}</span>
    return <span className="text-primary font-semibold">{value}</span>
  }

  return (
    <section className="py-16 bg-white" id="comparison">
      <div className="container-page">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl font-bold text-primary mb-2">
            {lang === "es" ? "Comparar Planes" : "Compare Plans"}
          </h2>
          <p className="text-foreground-light text-sm">{lang === "es" ? "Todos los planes incluyen" : "All plans include"}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-primary sticky left-0 bg-white z-10 w-1/2">
                  {lang === "es" ? "Caracteristica" : "Feature"}
                </th>
                {tiers.map((tier) => (
                  <th key={tier.name} className="text-center py-4 px-4 font-semibold text-primary w-1/6">
                    {tier.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, i) => (
                <tr key={feature.name} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-gray-50/50" : ""}`}>
                  <td className="py-4 px-4 text-sm text-foreground-light sticky left-0 bg-white z-10">{feature.name}</td>
                  {feature.values.map((value, vi) => (
                    <td key={vi} className="py-4 px-4 text-center">
                      {renderValue(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}