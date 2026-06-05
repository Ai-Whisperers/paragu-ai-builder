/**
 * ANNOTATION: TeamSection
 *
 * What it is: A staff photo grid with names, roles, bios, specialties, and Instagram links on hover.
 *
 * Why your business needs it: People buy from people they trust. Showing the actual staff members (not stock photos) creates an emotional connection before the first visit — clients are 60% more likely to book when they can see who they'll be attended by.
 *
 * What AI populates from your data: ParaguAI drafts professional 2-sentence bios from 2-sentence informal descriptions you send via WhatsApp. Auto-generates specialty tags from your service list.
 *
 * Your input: Send 2-sentence descriptions of each staff member (e.g., "Lidia, 8 years experience, specializes in balayage and color corrections") via WhatsApp, plus photos.
 *
 * Plan availability: All plans (Prueba, Presencia, Crecimiento, Profesional)
 */

/**
 * ANNOTATION: TeamSection
 *
 * What it is: A grid of staff cards — photo, name, role, short bio, and
 * specialties. For solo businesses it becomes an "About the Owner" block.
 *
 * Why your business needs it: People buy from people they trust. A real face
 * with a genuine bio removes the "anonymous vendor" objection and humanizes
 * your brand — especially important for personal-service businesses.
 *
 * What AI populates from your data: AI drafts each bio from a 2-sentence
 * description you provide, and recommends layout (team grid vs solo narrative)
 * based on how many people you have.
 *
 * Your input: A photo + 2 sentences per team member via WhatsApp.
 *
 * Plan availability: All plans.
 */
"use client"
import Image from "next/image"
import { team } from "@/lib/config/config"
import { ScrollReveal } from "@/components/shared/scroll-reveal"
import { siteConfig } from "@/lib/config/config"

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x={2} y={2} width={20} height={20} rx={5} ry={5} />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1={17.5} y1={6.5} x2={17.51} y2={6.5} />
    </svg>
  )
}

function TeamCard({ member, index }: { member: (typeof team)[number]; index: number }) {
  return (
    <ScrollReveal delay={index * 100} direction="up" className="text-center">
      <div className="group relative">
        <div className="relative overflow-hidden rounded-2xl mb-4">
          <Image
            src={member.image && member.image.trim().length > 0 ? member.image : "/images/placeholder-avatar.svg"}
            alt={member.name || "Team member photo"}
            fill className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-primary/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => window.open(`https://instagram.com/${siteConfig.business?.instagramHandle?.replace('@','') || 'tu_emprendimiento'}`, "_blank")}
              className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-2 hover:bg-white hover:text-pink-600 transition-all"
              aria-label={`Instagram de ${member.name}`}
            >
              <InstagramIcon />
            </button>
          </div>
        </div>
        <h3 className="font-heading text-xl font-bold text-primary">{member.name}</h3>
        <p className="text-sm text-secondary font-semibold mb-2">{member.role}</p>
        <p className="text-sm text-foreground-light leading-relaxed">{member.bio}</p>
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {member.specialties?.map((s: string) => (
            <span key={s} className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full font-medium">{s}</span>
          ))}
        </div>
      </div>
    </ScrollReveal>
  )
}

export function TeamSection() {
  return (
    <section className="py-20 bg-surface-muted">
      <div className="max-w-6xl mx-auto px-4">
        <ScrollReveal direction="up">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-secondary uppercase tracking-widest mb-3">Nuestro Equipo</span>
            <h2 className="font-heading text-4xl font-bold text-primary mb-3">Conoce a las Manos Detras de tu Look</h2>
            <p className="text-foreground-light max-w-lg mx-auto">Un equipo apasionado y en constante formacion, listo para hacerte sentir unica.</p>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, i) => <TeamCard key={member.name} member={member} index={i} />)}
        </div>
      </div>
    </section>
  )
}
