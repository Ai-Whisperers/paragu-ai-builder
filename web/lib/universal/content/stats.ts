export async function getStats(lang: "es" | "en") {
  if (lang === "en") return (await import("@/content/en/stats.json")).default
  return (await import("@/content/es/stats.json")).default
}