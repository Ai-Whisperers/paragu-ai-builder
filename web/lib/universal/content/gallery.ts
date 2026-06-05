export async function getGallery(lang: "es" | "en") {
  if (lang === "en") return (await import("@/content/en/gallery.json")).default
  return (await import("@/content/es/gallery.json")).default
}