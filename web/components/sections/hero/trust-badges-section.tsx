import { Container } from '@/components/ui/container'

export interface TrustBadgeItem {
  /** lucide-react icon name. Unknown names fall back to a generic dot. */
  icon?: string
  /** Short label for the badge. */
  text?: string
  /** Some content files use `title` instead of `text` — both accepted. */
  title?: string
  /** Optional secondary description. */
  description?: string
}

export interface TrustBadgesSectionProps {
  /** Array form: content.home.trustBadges. */
  items?: TrustBadgeItem[]
  /** Object form: content.home.trustBadges.items for consistency with other sections. */
  badges?: TrustBadgeItem[]
  title?: string
  eyebrow?: string
}

/**
 * Horizontal strip of tenant trust signals (envío discreto / pago seguro
 * / atención, etc.). Renders above or below the hero as configured.
 * Accepts either `items`/`badges`/bare-array content shapes so tenants
 * whose content was authored in different eras still work.
 *
 * Icon rendering intentionally minimal — uses a small circle + emoji-ish
 * fallback so we don't need to import all of lucide. The text is the
 * payload; the glyph is decoration.
 */
const ICON_MAP: Record<string, string> = {
  truck: '🚚',
  shield: '🛡️',
  shieldcheck: '🛡️',
  package: '📦',
  packageopen: '📦',
  heart: '❤',
  lock: '🔒',
  bolt: '⚡',
  zap: '⚡',
  check: '✓',
  star: '★',
  leaf: '🌿',
  recycle: '♻',
  clock: '⏱',
  phone: '📞',
  chat: '💬',
  messagecircle: '💬',
  smile: '😊',
  refresh: '↻',
  refreshcw: '↻',
  // Common business/lucide names that tenants reach for
  factory: '🏭',
  store: '🏬',
  wrench: '🔧',
  award: '🏆',
  users: '👥',
  mappin: '📍',
  creditcard: '💳',
  banknote: '💵',
  percent: '%',
  plane: '✈',
  wind: '💨',
  layers: '▦',
  alerttriangle: '⚠',
  search: '🔍',
  calendar: '📅',
  checkcircle: '✓',
  moon: '🌙',
  baby: '👶',
  user: '👤',
}

function glyph(icon?: string): string {
  if (!icon) return '✓'
  return ICON_MAP[icon.toLowerCase()] ?? '✓'
}

export function TrustBadgesSection({ items, badges, title, eyebrow }: TrustBadgesSectionProps) {
  const list = (items ?? badges ?? []).filter((b) => b && (b.text || b.title))
  if (list.length === 0) return null

  return (
    <section className="py-8">
      <Container>
        {eyebrow || title ? (
          <div className="mb-4 text-center">
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted,#6b7280)]">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <p className="mt-1 text-lg font-semibold text-[color:var(--text,#111)]">{title}</p>
            ) : null}
          </div>
        ) : null}
        <ul className="grid grid-cols-2 gap-4 rounded-lg border border-[color:var(--border,#e5e7eb)] bg-surface p-4 sm:grid-cols-3 md:grid-cols-4">
          {list.map((b, i) => {
            const label = b.text ?? b.title ?? ''
            return (
              <li key={`${label}-${i}`} className="flex items-center gap-2 text-sm">
                <span aria-hidden="true" className="text-lg">
                  {glyph(b.icon)}
                </span>
                <div>
                  <p className="font-medium text-[color:var(--text,#111)]">{label}</p>
                  {b.description ? (
                    <p className="text-xs text-[color:var(--text-muted,#6b7280)]">{b.description}</p>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
