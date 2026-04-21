import Image from 'next/image'
import * as Icons from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent } from '@/components/ui/card'

export interface TeamMember {
  name: string
  role?: string
  bio?: string
  imageUrl?: string
  icon?: string
  instagram?: string
}

export interface TeamSectionProps {
  title: string
  subtitle?: string
  members: TeamMember[]
}

function IconByName({ name, size = 40 }: { name?: string; size?: number }) {
  const fallback = 'Users'
  const key = name || fallback
  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[key]
  if (!Icon) return null
  return <Icon size={size} className="text-[var(--secondary)]" />
}

function gridColsClass(n: number): string {
  if (n <= 2) return 'sm:grid-cols-2'
  if (n === 3) return 'sm:grid-cols-2 lg:grid-cols-3'
  if (n === 4) return 'sm:grid-cols-2 lg:grid-cols-4'
  return 'sm:grid-cols-2 lg:grid-cols-3'
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

        <div className={`grid gap-8 items-stretch ${gridColsClass(members.length)}`}>
          {members.map((member, index) => {
            const hasImage = !!member.imageUrl
            const hasDetails = !!member.role || !!member.bio
            return (
              <Card key={index} className="text-center group h-full">
                <CardContent className="flex h-full flex-col pt-8">
                  {/* Avatar: real photo, or icon (no letter-only fallback) */}
                  {hasImage ? (
                    <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full bg-[var(--surface-light)]">
                      <Image
                        src={member.imageUrl!}
                        alt={member.name}
                        width={128}
                        height={128}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--secondary)]/10">
                      <IconByName name={member.icon} />
                    </div>
                  )}

                  <Heading level={3} className="text-lg font-semibold text-[var(--text)]">{member.name}</Heading>

                  {hasDetails && (
                    <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 ease-out group-hover:grid-rows-[1fr] group-hover:opacity-100 focus-within:grid-rows-[1fr] focus-within:opacity-100 motion-reduce:grid-rows-[1fr] motion-reduce:opacity-100">
                      <div className="overflow-hidden">
                        {member.role && (
                          <p className="mt-2 text-sm font-medium text-[var(--secondary)]">{member.role}</p>
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
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
