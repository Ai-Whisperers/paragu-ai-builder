import { normalizeSearchTerm } from '@/lib/commerce/search-normalize'

interface Props {
  text: string
  term: string
}

/**
 * Highlight every occurrence of `term` inside `text` with a <mark> tag.
 * Accent- and case-insensitive via the same normalizer the DB uses for
 * search_haystack — so if "uñas" matched in the DB, the rendered
 * "Uñas" gets visually marked even though the user typed "unas".
 *
 * Works purely on string indexes; no regex escaping pitfalls, preserves
 * original casing and accents in the output.
 */
export function Highlight({ text, term }: Props) {
  if (!term || !text) return <>{text}</>
  const normText = normalizeSearchTerm(text)
  const normTerm = normalizeSearchTerm(term)
  if (!normTerm) return <>{text}</>

  const parts: React.ReactNode[] = []
  let cursor = 0
  let search = 0
  // Walk normText looking for all occurrences of normTerm. Because the
  // normalizer (NFD strip + lowercase) is length-preserving for plain
  // Latin + accented Latin input, we can use indices from normText to
  // slice the original `text`.
  while (search < normText.length) {
    const found = normText.indexOf(normTerm, search)
    if (found === -1) break
    if (found > cursor) parts.push(text.slice(cursor, found))
    parts.push(
      <mark key={`m-${found}`} className="bg-yellow-200 rounded px-0.5 text-[inherit]">
        {text.slice(found, found + normTerm.length)}
      </mark>,
    )
    cursor = found + normTerm.length
    search = cursor
  }
  if (cursor < text.length) parts.push(text.slice(cursor))
  if (parts.length === 0) return <>{text}</>
  return <>{parts}</>
}
