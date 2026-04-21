/**
 * Press / "as seen in" mentions. Add new entries as we get coverage.
 * The PressStrip component returns null when this array is empty so no
 * placeholder ever shows — we only display real proof.
 */

export type PressMention = {
  /** Outlet name (e.g. "Última Hora"). */
  outlet: string
  /** Optional link to the article. */
  url?: string
  /** Date in YYYY-MM-DD. */
  date: string
  /** Short label of what was covered, e.g. "Coverage del lanzamiento". */
  context?: string
}

export const PRESS_MENTIONS: readonly PressMention[] = [
  // Add entries as coverage lands. Keeping empty until then so PressStrip
  // stays hidden — placeholder logos hurt credibility more than they help.
] as const
