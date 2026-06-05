export async function getServices(lang: "es" | "en") {
  if (lang === "en") return (await import("@/content/en/services/index.json")).default
  return (await import("@/content/es/services/index.json")).default
}

export async function getServiceCategories(lang: "es" | "en") {
  if (lang === "en") {
    return [
      (await import("@/content/en/services/categories/asesoria.json")).default,
      (await import("@/content/en/services/categories/cursos.json")).default,
      (await import("@/content/en/services/categories/productos.json")).default,
    ]
  }
  return [
    (await import("@/content/es/services/categories/asesoria.json")).default,
    (await import("@/content/es/services/categories/cursos.json")).default,
    (await import("@/content/es/services/categories/productos.json")).default,
  ]
}
