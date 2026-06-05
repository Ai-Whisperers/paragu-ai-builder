export async function getLoyalty(lang: "es" | "en") {
  if (lang === "en") return (await import("@/content/en/loyalty/index.json")).default
  return (await import("@/content/es/loyalty/index.json")).default
}

export async function getLoyaltyTiers(lang: "es" | "en") {
  if (lang === "en") return (await import("@/content/en/loyalty/tiers.json")).default
  return (await import("@/content/es/loyalty/tiers.json")).default
}