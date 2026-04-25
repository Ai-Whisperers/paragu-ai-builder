/**
 * Normalize a search term to the same shape as `products.search_haystack`:
 * lowercased, Unicode-decomposed, stripped of combining marks. Matches the
 * DB-side `lower(unaccent(...))` closely enough for Spanish (á/é/í/ó/ú/ñ
 * all fold to their base letter) without pulling in a full i18n library.
 *
 * Used in both listActiveProducts (filter side) and search-suggest (API)
 * so the user can type "uñas" and match products stored as "unas",
 * or vice versa. Shared to keep the normalization rule in one place.
 */
export function normalizeSearchTerm(raw: string): string {
  return raw
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip combining diacritics
    .toLowerCase()
    .trim()
}
