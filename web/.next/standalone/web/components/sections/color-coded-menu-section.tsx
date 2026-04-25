import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AnimateOnScroll, AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'
import { SushiPlate, SeigaihaPattern } from '@/components/icons/sushi'

export interface ColorCodedPlate {
  key: string
  title: string
  price: string
  items: string[]
  color: string
  description?: string
}

export interface ColorCodedMenuSectionProps {
  title: string
  subtitle?: string
  description?: string
  plates: ColorCodedPlate[]
  legendTitle?: string
}

const VARIANTS: Array<'nigiri' | 'maki' | 'sashimi'> = ['nigiri', 'maki', 'sashimi']

export function ColorCodedMenuSection({
  title,
  subtitle,
  description,
  plates,
  legendTitle = 'Cada color = un precio',
}: ColorCodedMenuSectionProps) {
  return (
    <section
      id="menu"
      className="relative overflow-hidden bg-[var(--background)] py-16 sm:py-20"
    >
      <div className="pointer-events-none absolute inset-0">
        <SeigaihaPattern id="color-menu-seigaiha" color="var(--primary)" opacity={0.04} />
      </div>

      <Container className="relative">
        <AnimatedSectionHeader className="mb-8 text-center">
          <Heading as="h2" level={2} className="mb-4">
            {title}
          </Heading>
          {subtitle && (
            <p className="mx-auto max-w-2xl text-lg text-[var(--secondary)]">{subtitle}</p>
          )}
          {description && (
            <p className="mx-auto mt-4 max-w-2xl text-sm text-[var(--text-muted)]">
              {description}
            </p>
          )}
        </AnimatedSectionHeader>

        <div className="mx-auto mb-10 flex max-w-3xl flex-wrap items-center justify-center gap-3 rounded-full bg-[var(--surface-light)] p-3 shadow-sm">
          <span className="px-2 text-sm font-semibold text-[var(--text-muted)]">
            {legendTitle}:
          </span>
          {plates.map((plate) => (
            <div
              key={plate.key}
              className="flex items-center gap-2 rounded-full bg-[var(--background)] px-3 py-1.5"
            >
              <span
                className="inline-block h-4 w-4 rounded-full ring-2 ring-white"
                style={{ backgroundColor: plate.color }}
              />
              <span className="text-sm font-medium text-[var(--text)]">{plate.price}</span>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plates.map((plate, index) => (
            <AnimateOnScroll key={plate.key} stagger={index}>
              <Card className="group relative h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: plate.color }}
                />
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="h-14 w-14 shrink-0 transition-transform duration-300 group-hover:scale-110">
                      <SushiPlate
                        plateColor={plate.color}
                        toppingVariant={VARIANTS[index % VARIANTS.length]}
                        width="56"
                        height="56"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{plate.title}</CardTitle>
                      <p
                        className="text-2xl font-bold"
                        style={{ color: plate.color }}
                      >
                        {plate.price}
                      </p>
                    </div>
                  </div>
                  {plate.description && (
                    <p className="mb-3 text-sm text-[var(--text-muted)]">
                      {plate.description}
                    </p>
                  )}
                  <ul className="space-y-2">
                    {plate.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-[var(--text-light)]"
                      >
                        <span
                          className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: plate.color }}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </AnimateOnScroll>
          ))}
        </div>
      </Container>
    </section>
  )
}

export interface SpecialOrderItem {
  name: string
  description?: string
  price?: string
}

export interface SpecialOrderSectionProps {
  title: string
  description?: string
  items: Array<SpecialOrderItem | string>
  tabletLabel?: string
}

export function SpecialOrderSection({
  title,
  description,
  items,
  tabletLabel = 'Pide desde la tableta',
}: SpecialOrderSectionProps) {
  const normalized = items.map((item) =>
    typeof item === 'string' ? { name: item } : item
  )

  return (
    <section id="special-order" className="bg-[var(--surface)] py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-[var(--primary)]/10 bg-[var(--background)] shadow-lg">
          <div className="grid gap-0 md:grid-cols-[1fr_1.5fr]">
            <div className="relative flex items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] p-10 text-[var(--primary-foreground)]">
              <div className="relative z-10 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-sm">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect
                      x="6"
                      y="4"
                      width="28"
                      height="32"
                      rx="3"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    />
                    <rect
                      x="10"
                      y="8"
                      width="20"
                      height="22"
                      rx="1"
                      fill="currentColor"
                      opacity="0.3"
                    />
                    <circle cx="20" cy="33" r="1.5" fill="currentColor" />
                  </svg>
                </div>
                <p className="text-sm uppercase tracking-wider opacity-80">
                  {tabletLabel}
                </p>
              </div>
              <div
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 30% 30%, white 0%, transparent 60%)',
                }}
              />
            </div>

            <div className="p-8 md:p-10">
              <Heading as="h2" level={2} className="mb-3">
                {title}
              </Heading>
              {description && (
                <p className="mb-6 text-[var(--text-muted)]">{description}</p>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                {normalized.map((item, i) => (
                  <AnimateOnScroll key={i} stagger={i}>
                    <div className="flex items-start gap-3 rounded-lg border border-[var(--surface-light)] p-3 transition-colors hover:border-[var(--primary)]/30 hover:bg-[var(--surface-light)]">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/10 text-xs font-bold text-[var(--primary)]">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[var(--text)]">{item.name}</p>
                        {item.description && (
                          <p className="text-xs text-[var(--text-muted)]">
                            {item.description}
                          </p>
                        )}
                      </div>
                      {item.price && (
                        <Badge variant="outline">{item.price}</Badge>
                      )}
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
