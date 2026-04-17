'use client'

import { useState } from 'react'

interface ProcessStep {
  number: number
  title: string
  description: string
}

interface ProcessSectionProps {
  title?: string
  subtitle?: string
  steps: ProcessStep[]
  ctaText?: string
  ctaLink?: string
}

export function ProcessSection({
  title = 'Nuestro Proceso',
  subtitle,
  steps = [],
  ctaText = 'Iniciar mi proceso',
  ctaLink = '#contact',
}: ProcessSectionProps) {
  const [activeStep, setActiveStep] = useState<number | null>(null)

  if (!steps.length) {
    return null
  }

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        {title && (
          <h2 className="mb-4 text-3xl font-bold md:text-4xl" style={{ color: 'var(--primary)' }}>
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="mb-12 max-w-2xl text-lg" style={{ color: 'var(--secondary)' }}>
            {subtitle}
          </p>
        )}

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 md:left-1/2" style={{ backgroundColor: 'var(--border)' }} />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
                onMouseEnter={() => setActiveStep(step.number)}
                onMouseLeave={() => setActiveStep(null)}
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16'}`}>
                  <div
                    className={`ml-16 md:m-0 p-6 rounded-lg transition-all duration-300 ${
                      activeStep === step.number ? 'scale-105' : ''
                    }`}
                    style={{
                      backgroundColor: activeStep === step.number ? 'var(--card)' : 'var(--background)',
                      border: `1px solid var(--border)`,
                    }}
                  >
                    <span
                      className="mb-2 inline-block rounded-full px-3 py-1 text-sm font-semibold"
                      style={{
                        backgroundColor: 'var(--primary)',
                        color: 'var(--primary-foreground)',
                      }}
                    >
                      Paso {step.number}
                    </span>
                    <h3
                      className="mb-2 text-xl font-bold"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--secondary)' }}>
                      {step.description}
                    </p>
                  </div>
                </div>

                <div
                  className="absolute left-8 flex h-10 w-10 items-center justify-center rounded-full border-4 md:left-1/2 md:-ml-5 z-10"
                  style={{
                    backgroundColor: 'var(--primary)',
                    borderColor: 'var(--background)',
                  }}
                >
                  <span
                    className="text-sm font-bold"
                    style={{ color: 'var(--primary-foreground)' }}
                  >
                    {step.number}
                  </span>
                </div>

                <div className="hidden flex-1 md:block" />
              </div>
            ))}
          </div>
        </div>

        {ctaText && (
          <div className="mt-12 text-center">
            <a
              href={ctaLink}
              className="inline-block rounded-lg px-8 py-4 font-semibold transition-colors"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
              }}
            >
              {ctaText}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProcessSection