export async function getPromotions(lang: "es" | "en") {
  if (lang === "en") return (await import("@/content/en/promotions/index.json")).default
  return (await import("@/content/es/promotions/index.json")).default
}

export async function getPromotionList(lang: "es" | "en") {
  if (lang === "en") {
    return [
      (await import("@/content/en/promotions/promo-1.json")).default,
      (await import("@/content/en/promotions/promo-2.json")).default,
      (await import("@/content/en/promotions/promo-3.json")).default,
    ]
  }
  return [
    (await import("@/content/es/promotions/promo-1.json")).default,
    (await import("@/content/es/promotions/promo-2.json")).default,
    (await import("@/content/es/promotions/promo-3.json")).default,
  ]
}