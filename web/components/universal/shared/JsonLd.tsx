/**
 * ANNOTATION: JsonLd
 *
 * What it is: A generic JSON-LD structured data component that renders a schema.org JSON script tag in the page head. Accepts any structured data object.
 *
 * Why your business needs it: Helps search engines understand your business information (name, address, phone, reviews, etc.) which can improve search result display with rich snippets.
 *
 * What AI populates from your data: ParaguAI generates the appropriate schema.org JSON-LD from your business data and passes it to this component.
 *
 * Your input: Business name, address, phone, description, social profiles, and other standard business information.
 *
 * Plan availability: All plans
 */
interface JsonLdProps {
  schema: Record<string, unknown>
}

export function JsonLd({ schema }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

import { getSiteName } from "@/lib/config/config"

export function LocalBusinessJsonLd({
  name = getSiteName(),
  description = "Professional consulting and services for Paraguayan entrepreneurs.",
  phone = "+595981000000",
  address = "Ciudad, Paraguay",
  lat = -25.2637,
  lng = -57.5759,
  url = "https://tu-emprendimiento.com",
} = {}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    description,
    url,
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: address.split(",")[0] || "Ciudad",
      addressRegion: "Central",
      addressCountry: "PY",
      streetAddress: address,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: lat,
      longitude: lng,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "19:00",
    },
    priceRange: "$$",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "200",
    },
  }

  return <JsonLd schema={schema} />
}