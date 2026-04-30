'use client'
import { Section } from '@/components/ui/section'

import { Heading } from '@/components/ui/heading'

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
  stepLabel?: string
  __locale?: string
}

const STEP_LABELS: Record<string, string> = {
  en: 'Step',
  es: 'Paso',
  de: 'Schritt',
  pt: 'Passo',
  nl: 'Stap',
}

const TITLE_DEFAULTS: Record<string, string> = {
  en: 'Our Process',
  es: 'Nuestro Proceso',
  de: 'Unser Prozess',
  pt: 'Nosso Processo',
  nl: 'Ons Proces',
}

const CTA_DEFAULTS: Record<string, string> = {
  en: 'Start my process',
  es: 'Iniciar mi proceso',
  de: 'Prozess starten',
  pt: 'Iniciar meu processo',
  nl: 'Start mijn proces',
}

export function ProcessSection({
  title,
  subtitle,
  steps = [],
  ctaText,
  ctaLink = '#contact',
  __locale = 'es',
  stepLabel: stepLabelProp,
}: ProcessSectionProps) {
  const stepLabel = stepLabelProp ?? STEP_LABELS[__locale] ?? 'Paso'
  const resolvedTitle = title ?? TITLE_DEFAULTS[__locale] ?? TITLE_DEFAULTS.es
  const resolvedCtaText = ctaText ?? CTA_DEFAULTS[__locale] ?? CTA_DEFAULTS.es
  const [activeStep, setActiveStep] = useState<number | null>(null)

  if (!steps.length) {
    return null
  }

  return (
    <Section spacing="lg">
      <div className="mx-auto  px-4">
        {resolvedTitle && (
          <Heading level={2} className="mb-4 text-xl sm:text-3xl font-bold md:text-2xl sm:text-4xl" style={{ color: 'var(--primary)' }}>
            {resolvedTitle}
          </Heading>
        )}
        {subtitle && (
          <p className="mb-12 max-w-2xl text-lg" style={{ color: 'var(--text-light)' }}>
            {subtitle}
          </p>
        )}

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-1 md:left-1/2" style={{ background: 'linear-gradient(to bottom, var(--primary), var(--secondary))' }} />

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
                <div className={`flex-1 max-w-lg ${index % 2 === 0 ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16'}`}>
                  <div
                    className={`ml-16 md:m-0 p-6 rounded-lg transition-all duration-300 ${
                      activeStep === step.number ? 'scale-105' : ''
                    }`}
                    style={{
                      backgroundColor: activeStep === step.number ? 'var(--card)' : 'var(--surface)',
                      border: `1px solid var(--border)`,
                    }}
                  >
                    <span
                      className="mb-2 inline-block rounded-full px-3 py-1 text-sm font-semibold font-heading tracking-wider"
                      style={{
                        backgroundColor: 'var(--primary)',
                        color: 'var(--primary-foreground)',
                      }}
                    >
                      {stepLabel} {step.number}
                    </span>
                    <Heading level={3}
                      className="mb-2 text-xl font-bold tracking-tight"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {step.title}
                    </Heading>
                    <p className="text-sm" style={{ color: 'var(--text-light)' }}>
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

        {resolvedCtaText && (
          <div className="mt-12 text-center">
            <a
              href={ctaLink}
              className="inline-block rounded-lg px-8 py-4 font-semibold transition-all duration-200 hover:scale-[1.02]"
              style={{
                backgroundColor: 'var(--secondary)',
                color: 'var(--secondary-foreground)',
              }}
            >
              {resolvedCtaText}
            </a>
          </div>
        )}
      </div>
    </Section>
  )
}

export default ProcessSection