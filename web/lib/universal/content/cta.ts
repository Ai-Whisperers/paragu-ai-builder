export async function getCta(lang: "es" | "en") {
  if (lang === "en") return (await import("@/content/en/cta.json")).default
  return (await import("@/content/es/cta.json")).default
}