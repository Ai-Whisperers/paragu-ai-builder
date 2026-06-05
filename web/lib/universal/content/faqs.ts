export async function getFaqs(lang: "es" | "en") {
  if (lang === "en") return (await import("@/content/en/faqs.json")).default
  return (await import("@/content/es/faqs.json")).default
}