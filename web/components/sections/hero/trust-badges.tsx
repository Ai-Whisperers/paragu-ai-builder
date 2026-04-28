'use client'
import { Section } from '@/components/ui/section'

import { useState } from 'react'
import { Check, Award, Users, Clock, Shield, Star } from 'lucide-react'

interface TrustBadge {
  id: string
  value: string
  label: string
}

interface Certification {
  name: string
  description: string
}

interface TrustBadgesProps {
  title?: { es: string; en: string }
  badges?: TrustBadge[]
  certifications?: Certification[]
}

const DEFAULT_BADGES: TrustBadge[] = [
  { id: 'years', value: '8+', label: 'Years experience' },
  { id: 'clients', value: '500+', label: 'Satisfied clients' },
  { id: 'success', value: '100%', label: 'Success rate' },
  { id: 'response', value: '24h', label: 'Response time' },
]

const DEFAULT_CERTIFICATIONS: Certification[] = [
  { name: 'ISO 9001', description: 'Quality Management System' },
  { name: 'Member of AIPY', description: 'Paraguayan Investors Association' },
]

const BADGE_ICONS: Record<string, typeof Users> = {
  years: Clock,
  clients: Users,
  success: Award,
  response: Clock,
}

export function TrustBadges({
  title,
  badges = DEFAULT_BADGES,
  certifications = DEFAULT_CERTIFICATIONS,
}: TrustBadgesProps) {
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null)

  return (
    <Section fullWidth spacing="md" className="bg-gradient-to-b from-surface to-surface-light">
      <div className="mx-auto max-w-6xl px-6">
        {title && (
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-foreground">{title.es}</h2>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((badge) => {
            const Icon = BADGE_ICONS[badge.id] || Star
            return (
              <div
                key={badge.id}
                className="group relative rounded-2xl border border-border bg-surface p-6 text-center transition-colors hover:border-[var(--primary)]/30 hover:shadow-lg"
                onMouseEnter={() => setHoveredBadge(badge.id)}
                onMouseLeave={() => setHoveredBadge(null)}
              >
                <div className="mb-3 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    <Icon size={28} />
                  </div>
                </div>
                <p className="text-2xl sm:text-4xl font-bold text-primary">{badge.value}</p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">{badge.label}</p>
              </div>
            )
          })}
        </div>

        {certifications && certifications.length > 0 && (
          <div className="mt-12 border-t border-border pt-8">
            <div className="flex flex-wrap items-center justify-center gap-8">
              {certifications.map((cert, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                    <Shield size={20} className="text-[var(--success)]" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{cert.name}</p>
                    <p className="text-xs text-muted-foreground">{cert.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  )
}

export function TrustBadgeMinimal() {
  const badges = [
    { icon: Award, value: '8+', label: 'Years' },
    { icon: Users, value: '500+', label: 'Clients' },
    { icon: Check, value: '100%', label: 'Success' },
  ]

  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      {badges.map((badge) => (
        <div key={badge.label} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <badge.icon size={16} className="text-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground">
            {badge.value} {badge.label}
          </span>
        </div>
      ))}
    </div>
  )
}
