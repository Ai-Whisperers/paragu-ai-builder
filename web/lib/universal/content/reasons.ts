export async function getReasons(lang: "es" | "en") {
  if (lang === "en") return (await import("@/content/en/reasons.json")).default
  return (await import("@/content/es/reasons.json")).default
}