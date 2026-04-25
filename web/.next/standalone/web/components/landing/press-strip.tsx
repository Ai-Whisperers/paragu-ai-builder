import { PRESS_MENTIONS } from '@/lib/landing/press'

/**
 * "As seen in" strip. Renders nothing when there are no real mentions —
 * a placeholder press strip hurts trust more than helps.
 *
 * To populate: add entries to web/lib/landing/press.ts.
 */
export function PressStrip({ label = 'Mencionados en:' }: { label?: string }) {
  if (PRESS_MENTIONS.length === 0) return null

  return (
    <div className="mx-auto mt-12 flex max-w-4xl flex-col items-center gap-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
        {label}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {PRESS_MENTIONS.map((m) =>
          m.url ? (
            <a
              key={`${m.outlet}-${m.date}`}
              href={m.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-bold tracking-tight text-[var(--text-light)] transition-colors hover:text-[var(--text)]"
              title={m.context}
            >
              {m.outlet}
            </a>
          ) : (
            <span
              key={`${m.outlet}-${m.date}`}
              className="text-base font-bold tracking-tight text-[var(--text-light)]"
              title={m.context}
            >
              {m.outlet}
            </span>
          ),
        )}
      </div>
    </div>
  )
}
