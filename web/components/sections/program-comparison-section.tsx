'use client'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AnimateOnScroll, AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'

export interface ProgramItem {
  id: string
  name: string
  price: string
  description: string
  duration?: string
  highlighted?: boolean
  badge?: string
  ctaText?: string
  inclusions?: string[]
}

export interface ComparisonFeature {
  feature: string
  [programId: string]: string | boolean | undefined
}

export interface ProgramComparisonSectionProps {
  title: string
  subtitle?: string
  programs: ProgramItem[]
  features: ComparisonFeature[]
  paymentNote?: string
  whatsappPhone?: string
  emailAddress?: string
  calendarUrl?: string
}

export function ProgramComparisonSection({
  title,
  subtitle,
  programs,
  features,
  paymentNote,
  whatsappPhone,
  emailAddress,
  calendarUrl,
}: ProgramComparisonSectionProps) {
  const handleCTA = (program: ProgramItem) => {
    if (calendarUrl) {
      window.open(calendarUrl, '_blank')
    } else if (whatsappPhone) {
      const message = encodeURIComponent(
        `Hola! Me interesa el programa ${program.name} (${program.price}). Quisiera agendar una consulta.`
      )
      window.open(`https://wa.me/${whatsappPhone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank')
    } else if (emailAddress) {
      const subject = encodeURIComponent(`Consulta: ${program.name}`)
      const body = encodeURIComponent(
        `Hola,\n\nMe interesa el programa ${program.name} (${program.price}). Me gustaria recibir mas informacion.\n\nGracias.`
      )
      window.open(`mailto:${emailAddress}?subject=${subject}&body=${body}`, '_blank')
    }
  }

  return (
    <section id="programas" className="py-20" style={{ backgroundColor: 'var(--surface-light)' }}>
      <Container>
        <AnimatedSectionHeader>
          <Heading level={2} className="mb-3 text-center" style={{ color: 'var(--primary)' }}>
            {title}
          </Heading>
          {subtitle && (
            <p className="mx-auto mb-12 max-w-2xl text-center text-lg" style={{ color: 'var(--text-muted)' }}>
              {subtitle}
            </p>
          )}
        </AnimatedSectionHeader>

        {/* Program Cards */}
        <div className="mx-auto mb-16 grid max-w-5xl gap-8 md:grid-cols-2">
          {programs.map((program, idx) => (
            <AnimateOnScroll key={program.id} delay={idx * 0.15}>
              <div
                className="relative flex h-full flex-col rounded-xl p-8 transition-shadow duration-300"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: program.highlighted
                    ? '2px solid var(--secondary)'
                    : '1px solid var(--border)',
                  boxShadow: program.highlighted
                    ? '0 8px 30px rgba(201,169,110,0.15)'
                    : '0 4px 20px rgba(27,42,74,0.06)',
                }}
              >
                {program.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="secondary" className="px-4 py-1 text-sm font-semibold">
                      {program.badge}
                    </Badge>
                  </div>
                )}

                <div className="mb-6 text-center">
                  <h3 className="mb-2 text-2xl font-bold" style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                    {program.name}
                  </h3>
                  <div className="mb-3 text-4xl font-bold" style={{ color: 'var(--secondary)' }}>
                    {program.price}
                  </div>
                  {program.duration && (
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {program.duration}
                    </p>
                  )}
                </div>

                <p className="mb-6 flex-grow text-center" style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>
                  {program.description}
                </p>

                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => handleCTA(program)}
                  style={{
                    backgroundColor: program.highlighted ? 'var(--secondary)' : 'var(--primary)',
                    color: program.highlighted ? 'var(--primary)' : '#FFFFFF',
                  }}
                >
                  {program.ctaText || 'Consultar'}
                </Button>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Comparison Table */}
        <AnimateOnScroll>
          <div className="mx-auto max-w-4xl overflow-hidden rounded-xl" style={{ border: '1px solid var(--border)' }}>
            <div
              className="grid items-center gap-4 px-6 py-4"
              style={{
                gridTemplateColumns: '1fr repeat(' + programs.length + ', 140px)',
                backgroundColor: 'var(--primary)',
              }}
            >
              <div className="text-sm font-semibold text-white">Servicio</div>
              {programs.map((p) => (
                <div key={p.id} className="text-center text-sm font-semibold text-white">
                  {p.name.replace('Paraguay ', '')}
                </div>
              ))}
            </div>

            {features.map((feature, idx) => (
              <div
                key={idx}
                className="grid items-center gap-4 px-6 py-3"
                style={{
                  gridTemplateColumns: '1fr repeat(' + programs.length + ', 140px)',
                  backgroundColor: idx % 2 === 0 ? 'var(--surface)' : 'var(--surface-light)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <div className="text-sm" style={{ color: 'var(--text)' }}>
                  {feature.feature}
                </div>
                {programs.map((p) => {
                  const value = feature[p.id]
                  return (
                    <div key={p.id} className="text-center text-sm">
                      {value === true ? (
                        <span style={{ color: 'var(--secondary)', fontSize: '1.25rem' }}>✓</span>
                      ) : value === false ? (
                        <span style={{ color: 'var(--text-light)' }}>—</span>
                      ) : (
                        <span className="text-xs font-medium" style={{ color: 'var(--secondary)' }}>
                          {value}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </AnimateOnScroll>

        {paymentNote && (
          <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            {paymentNote}
          </p>
        )}
      </Container>
    </section>
  )
}
