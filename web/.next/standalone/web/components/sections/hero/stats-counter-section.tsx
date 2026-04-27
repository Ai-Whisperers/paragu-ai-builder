import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { AnimatedSectionHeader, AnimateOnScroll } from '@/components/ui/animate-on-scroll'

export interface StatsCounterProps {
  items: Array<{ value: string; label: string; icon?: string }>
  columns?: 2 | 3 | 4
  variant?: 'inline' | 'cards' | 'minimal'
}

const ICON_MAP: Record<string, string> = {
  Users: '👥',
  Calendar: '📅',
  Globe: '🌐',
  Award: '🏆',
  Briefcase: '💼',
  Shield: '🛡️',
}

export function StatsCounterSection({
  items,
  columns = 4,
  variant = 'inline',
}: StatsCounterProps) {
  if (!items || items.length === 0) return null

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }

  return (
    <section className="bg-[var(--surface)] py-12 sm:py-16">
      <Container>
        <div className={`grid ${gridCols[columns] || 'grid-cols-4'} gap-6 sm:gap-8`}>
          {items.map((item, i) => (
            <AnimateOnScroll key={i} stagger={(i % columns) as 1 | 2 | 3 | 4}>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[var(--primary)]">
                  {item.value}
                </div>
                <div className="mt-2 text-sm text-[var(--text-muted)]">
                  {item.label}
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </Container>
    </section>
  )
}
