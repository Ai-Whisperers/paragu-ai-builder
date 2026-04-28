import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AnimateOnScroll, AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'
import { SushiCategoryIcon } from '@/components/icons/sushi-category'

export interface MenuItem {
  name: string
  nameJa?: string
  description?: string
  price?: string
  dietaryTags?: string[]
  imageUrl?: string
}

export interface MenuCategory {
  key: string
  title: string
  description?: string
  items?: MenuItem[]
}

export interface FeaturedMenuSectionProps {
  title: string
  subtitle?: string
  categories: MenuCategory[]
  ctaText?: string
  ctaHref?: string
  dietaryLabels?: Record<string, string>
}

function DietaryBadge({ tag, label }: { tag: string; label?: string }) {
  return (
    <Badge variant="outline" className="text-[10px] uppercase">
      {label ?? tag}
    </Badge>
  )
}

export function FeaturedMenuSection({
  title,
  subtitle,
  categories,
  ctaText,
  ctaHref,
  dietaryLabels,
}: FeaturedMenuSectionProps) {
  const filtered = categories.filter((c) => (c.items?.length ?? 0) > 0 || c.description)

  return (
    <section id="featured-menu" className="bg-background py-16 sm:py-20">
      <Container size="md">
        <AnimatedSectionHeader className="mb-12 text-center">
          <Heading as="h2" level={2} className="mb-4">
            {title}
          </Heading>
          {subtitle && (
            <p className="mx-auto max-w-2xl text-lg text-secondary">{subtitle}</p>
          )}
        </AnimatedSectionHeader>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((category, index) => (
            <AnimateOnScroll key={category.key} stagger={index}>
              <Card className="group h-full overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3 text-primary">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                      <SushiCategoryIcon
                        category={category.key}
                        width="32"
                        height="32"
                      />
                    </div>
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                  </div>

                  {category.description && (
                    <CardDescription className="mb-4">
                      {category.description}
                    </CardDescription>
                  )}

                  {category.items && category.items.length > 0 && (
                    <ul className="space-y-2">
                      {category.items.slice(0, 4).map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between gap-2 border-t border-surface-light pt-2 text-sm first:border-t-0 first:pt-0"
                        >
                          <div className="flex-1">
                            <span className="font-medium text-foreground">
                              {item.name}
                            </span>
                            {item.nameJa && (
                              <span className="ml-1 text-xs text-muted-foreground">
                                ({item.nameJa})
                              </span>
                            )}
                            {item.dietaryTags && item.dietaryTags.length > 0 && (
                              <span className="ml-2 inline-flex gap-1">
                                {item.dietaryTags.map((t) => (
                                  <DietaryBadge
                                    key={t}
                                    tag={t}
                                    label={dietaryLabels?.[t]}
                                  />
                                ))}
                              </span>
                            )}
                          </div>
                          {item.price && (
                            <span className="shrink-0 font-semibold text-primary">
                              {item.price}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </AnimateOnScroll>
          ))}
        </div>

        {ctaText && (
          <div className="mt-12 text-center">
            <a
              href={ctaHref ?? '#menu'}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-semibold text-[var(--primary-foreground)] shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-xl"
            >
              {ctaText}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M4 10h12m0 0l-4-4m4 4l-4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        )}
      </Container>
    </section>
  )
}

export interface FullMenuSectionProps {
  title: string
  subtitle?: string
  categories: MenuCategory[]
  dietaryLabels?: Record<string, string>
  japaneseTerms?: Record<string, string>
}

export function FullMenuSection({
  title,
  subtitle,
  categories,
  dietaryLabels,
  japaneseTerms,
}: FullMenuSectionProps) {
  return (
    <section id="full-menu" className="bg-background py-16 sm:py-20">
      <Container size="md">
        <AnimatedSectionHeader className="mb-12 text-center">
          <Heading as="h1" level={1} className="mb-4">
            {title}
          </Heading>
          {subtitle && (
            <p className="mx-auto max-w-2xl text-lg text-secondary">{subtitle}</p>
          )}
        </AnimatedSectionHeader>

        {dietaryLabels && Object.keys(dietaryLabels).length > 0 && (
          <div className="mx-auto mb-12 flex max-w-3xl flex-wrap items-center justify-center gap-3 rounded-2xl bg-surface-light p-4">
            <span className="text-sm font-semibold text-muted-foreground">
              Etiquetas:
            </span>
            {Object.entries(dietaryLabels).map(([tag, label]) => (
              <div key={tag} className="flex items-center gap-1.5">
                <Badge variant="outline" className="text-[10px] uppercase">
                  {tag}
                </Badge>
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mx-auto max-w-5xl space-y-12">
          {categories.map((category, index) => (
            <AnimateOnScroll key={category.key} stagger={Math.min(index, 5)}>
              <div>
                <div className="mb-6 flex items-center gap-4 border-b border-surface-light pb-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <SushiCategoryIcon category={category.key} width="28" height="28" />
                  </div>
                  <div>
                    <Heading as="h2" level={3} className="mb-0">
                      {category.title}
                    </Heading>
                    {category.description && (
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>

                {category.items && category.items.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {category.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start justify-between gap-3 rounded-lg p-3 transition-colors hover:bg-surface-light"
                      >
                        <div className="flex-1">
                          <div className="flex flex-wrap items-baseline gap-2">
                            <p className="font-semibold text-foreground">
                              {item.name}
                            </p>
                            {item.nameJa && (
                              <p className="text-xs text-muted-foreground">
                                {item.nameJa}
                                {japaneseTerms?.[item.nameJa.toLowerCase()] && (
                                  <span className="ml-1 italic">
                                    ({japaneseTerms[item.nameJa.toLowerCase()]})
                                  </span>
                                )}
                              </p>
                            )}
                          </div>
                          {item.description && (
                            <p className="mt-1 text-sm text-muted-foreground">
                              {item.description}
                            </p>
                          )}
                          {item.dietaryTags && item.dietaryTags.length > 0 && (
                            <div className="mt-2 flex gap-1">
                              {item.dietaryTags.map((t) => (
                                <Badge
                                  key={t}
                                  variant="outline"
                                  className="text-[10px] uppercase"
                                >
                                  {t}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        {item.price && (
                          <div className="shrink-0 text-right">
                            <p className="font-semibold text-primary">
                              {item.price}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  category.description === undefined && (
                    <p className="italic text-muted-foreground">
                      Consulta con nuestro equipo por la selección del día.
                    </p>
                  )
                )}
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </Container>
    </section>
  )
}
