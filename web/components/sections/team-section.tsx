import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent } from '@/components/ui/card'

export interface TeamMember {
  name: string
  role?: string
  bio?: string
  imageUrl?: string
  instagram?: string
}

export interface TeamSectionProps {
  title: string
  subtitle?: string
  members: TeamMember[]
}

export function TeamSection({ title, subtitle, members }: TeamSectionProps) {
  return (
    <section id="equipo" className="bg-[var(--surface)] py-16 sm:py-20">
      <Container>
        <div className="mb-12 text-center">
          <Heading level={2}>{title}</Heading>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-[var(--text-muted)]">{subtitle}</p>
          )}
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-8">
                {/* Avatar */}
                <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full bg-[var(--surface-light)]">
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-[var(--text-muted)]">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-[var(--text)]">{member.name}</h3>
                {member.role && (
                  <p className="mt-1 text-sm font-medium text-[var(--secondary)]">{member.role}</p>
                )}
                {member.bio && (
                  <p className="mt-3 text-sm text-[var(--text-muted)]">{member.bio}</p>
                )}
                {member.instagram && (
                  <a
                    href={`https://instagram.com/${member.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm text-[var(--secondary)] hover:underline"
                  >
                    @{member.instagram.replace('@', '')}
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}
