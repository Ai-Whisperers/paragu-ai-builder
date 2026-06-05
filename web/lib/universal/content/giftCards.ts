export async function getGiftCards(lang: "es" | "en") {
  if (lang === "en") return (await import("@/content/en/gift-cards/index.json")).default
  return (await import("@/content/es/gift-cards/index.json")).default
}

export async function getGiftCardList(lang: "es" | "en") {
  if (lang === "en") return (await import("@/content/en/gift-cards/cards.json")).default
  return (await import("@/content/es/gift-cards/cards.json")).default
}