import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'

/**
 * Weekly cadence calendar — visualises a recurring weekly flow.
 * Originally for De Abasto ("Lun: lista → Mar: compras → Mie-Jue: prep → Vie-Sab: entrega")
 * but generic: any weekly-recurring service (CSA, laundry, cleaning sub).
 */

const DAYS = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']

export interface WeeklyCadenceProps {
  title?: string
  subtitle?: string
  /** Phases in order. Each phase maps to one or more days. */
  phases: Array<{
    id: string
    label: string
    days: number[] // 1=Lun … 7=Dom
    description?: string
    color?: string
  }>
  footnote?: string
}

export function WeeklyCadenceCalendarSection({
  title = 'Tu semana con nosotros',
  subtitle,
  phases,
  footnote,
}: WeeklyCadenceProps) {
  // Map day index → phase
  const dayToPhase = new Array<number | undefined>(8)
  phases.forEach((p, i) => {
    for (const d of p.days) dayToPhase[d] = i
  })

  return (
    <section className="py-14 bg-background">
      <Container>
        <div className="text-center mb-8">
          <Heading level={2}>{title}</Heading>
          {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
        </div>

        <div className="grid grid-cols-7 gap-2 max-w-3xl mx-auto">
          {DAYS.map((label, i) => {
            const phaseIdx = dayToPhase[i + 1]
            const phase = phaseIdx !== undefined ? phases[phaseIdx] : undefined
            return (
              <div
                key={label}
                className="rounded-lg p-3 text-center text-sm min-h-[90px] flex flex-col items-center justify-center"
                style={{
                  backgroundColor: phase?.color || 'var(--surface-light)',
                  color: phase ? 'white' : 'var(--text-muted)',
                }}
              >
                <div className="text-xs font-semibold uppercase tracking-wide">{label}</div>
                {phase && <div className="mt-1 text-xs">{phase.label}</div>}
              </div>
            )
          })}
        </div>

        {phases.some((p) => p.description) && (
          <div className="mt-6 max-w-3xl mx-auto grid gap-2 sm:grid-cols-2">
            {phases.map((p) => (
              <div key={p.id} className="flex gap-3 items-start">
                <span
                  className="inline-block w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                  style={{ backgroundColor: p.color || 'var(--primary)' }}
                />
                <div className="text-sm">
                  <div className="font-semibold text-foreground">{p.label}</div>
                  {p.description && <div className="text-muted-foreground">{p.description}</div>}
                </div>
              </div>
            ))}
          </div>
        )}

        {footnote && (
          <p className="mt-4 text-center text-xs text-muted-foreground italic">{footnote}</p>
        )}
      </Container>
    </section>
  )
}
