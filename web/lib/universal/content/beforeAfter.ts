export async function getBeforeAfter(lang: "es" | "en") {
  if (lang === "en") return (await import("@/content/en/before-after.json")).default
  return (await import("@/content/es/before-after.json")).default
}