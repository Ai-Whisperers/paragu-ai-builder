import { Section } from '@/components/ui/section'
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

  const count = items.length
  const cols = Math.min(columns || count, count, 4)
  const gridClass = (
    cols === 1 ? 'grid-cols-1'
    : cols === 2 ? 'grid-cols-2'
    : cols === 3 ? 'grid-cols-3'
    : 'grid-cols-4 divide-x divide-border/50'
  )

  return (
    <Section spacing="sm" background="surface">
      <Container>
        <div className={`grid ${gridClass} gap-6 sm:gap-8`}>
          {items.map((item, i) => (
            <AnimateOnScroll key={i} stagger={(i % columns) as 1 | 2 | 3 | 4}>
              <div className="text-center relative">
                <div className="text-xl sm:text-3xl sm:text-4xl font-bold text-primary">
                  {item.value}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {item.label}
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </Container>
    </Section>
  )
}
