export async function getHero(lang: "es" | "en") {
  if (lang === "en") return (await import("@/content/en/hero.json")).default
  return (await import("@/content/es/hero.json")).default
}