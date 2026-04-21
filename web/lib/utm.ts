/**
 * Build a URL with UTM tags appended. Preserves existing query params on
 * the base URL; does not clobber existing utm_* params (passed values
 * win when both are present — that's intentional since callers are
 * usually overriding defaults).
 *
 * Usage:
 *   appendUtm(site.bookingUrl, {
 *     source: 'linkedin',
 *     medium: 'paid',
 *     campaign: 'investor',
 *     content: 'linkedin-investor-en',
 *   })
 *   → "https://calendly.com/nexaparaguay/consulta?utm_source=linkedin&utm_medium=paid&..."
 */

export interface UtmParams {
  source?: string
  medium?: string
  campaign?: string
  content?: string
  term?: string
}

export function appendUtm(url: string, utm: UtmParams): string {
  if (!url) return url
  // Handle protocol-relative, absolute, and site-relative URLs uniformly
  // by running the URL constructor against a stable base. We re-serialize
  // through URL so that `?a=1` + extra params get merged cleanly without
  // a trailing "?&" or double "?".
  const isAbsolute = /^[a-z]+:\/\//i.test(url)
  const base = isAbsolute ? url : `https://placeholder.invalid${url.startsWith('/') ? url : `/${url}`}`

  let parsed: URL
  try {
    parsed = new URL(base)
  } catch {
    // Malformed input — return as-is. Better than throwing inside a
    // server-rendered page.
    return url
  }

  const pairs: Array<[string, string]> = [
    ['utm_source', utm.source ?? ''],
    ['utm_medium', utm.medium ?? ''],
    ['utm_campaign', utm.campaign ?? ''],
    ['utm_content', utm.content ?? ''],
    ['utm_term', utm.term ?? ''],
  ]
  for (const [key, value] of pairs) {
    if (!value) continue
    parsed.searchParams.set(key, value)
  }

  if (isAbsolute) return parsed.toString()
  // Strip the placeholder origin we injected to normalize relative URLs.
  return parsed.pathname + parsed.search + parsed.hash
}
