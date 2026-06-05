export async function getTestimonials(lang: "es" | "en") {
  if (lang === "en") return (await import("@/content/en/testimonials.json")).default
  return (await import("@/content/es/testimonials.json")).default
}