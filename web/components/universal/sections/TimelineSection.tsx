"use client"

import { useEffect, useRef, useState } from "react"
import timelineData from "@/content/_shared/timeline.json"

interface Milestone {
  year: string
  title: string
  description: string
}

export function TimelineSection() {
  const milestones: Milestone[] = (timelineData as { milestones: Milestone[] }).milestones || []
  const [visibleIndex, setVisibleIndex] = useState(-1)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = itemRefs.current.indexOf(entry.target as HTMLDivElement)
            if (idx !== -1 && idx > visibleIndex) {
              setTimeout(() => setVisibleIndex(idx), idx * 150)
            }
          }
        })
      },
      { threshold: 0.3 }
    )

    itemRefs.current.forEach((el) => {
      if (el) observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [visibleIndex])

  if (milestones.length === 0) return null

  return (
    <section className="py-20 bg-surface">
      <div className="container-page">
        <div className="text-center mb-16">
          <span className="text-sm font-bold text-secondary uppercase tracking-widest mb-2 block">
            Nuestra Trayectoria
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary">
            Hitos que Nos Definieron
          </h2>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-secondary/20 transform md:-translate-x-1/2" />

          {milestones.map((milestone, i) => (
            <div
              key={i}
              ref={(el) => { itemRefs.current[i] = el }}
              className={`relative pl-12 md:pl-0 mb-12 last:mb-0 transition-all duration-700 ${
                visibleIndex >= i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="absolute left-0 md:left-1/2 top-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center transform md:-translate-x-1/2 -translate-y-1/2">
                <div className="w-3 h-3 rounded-full bg-white" />
              </div>

              <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                <div className={"mb-4 md:mb-0 " + (i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:col-start-2 md:text-left md:pl-12')}>
                  <span className="text-3xl font-bold text-secondary">{milestone.year}</span>
                </div>

                <div className={"bg-white rounded-2xl p-6 shadow-md border border-gray-100 " + (i % 2 === 0 ? 'md:col-start-2' : '')}>
                  <h3 className="font-heading text-xl font-bold text-primary mb-2">{milestone.title}</h3>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
