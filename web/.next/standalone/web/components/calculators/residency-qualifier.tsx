'use client'

import { useState } from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { AnimatedSectionHeader } from '@/components/ui/animate-on-scroll'

interface ResidencyQualifierProps {
  eyebrow?: string
  title?: string
  subtitle?: string
  ctaHref?: string
  __locale?: string
}

const QUESTIONS = [
  {
    id: 'goal',
    question: { es: '¿Cuál es su objetivo principal?', en: 'What is your primary goal?' },
    options: [
      { label: { es: 'Reducir carga fiscal', en: 'Reduce tax burden' }, score: 25 },
      { label: { es: 'Mejor calidad de vida', en: 'Better quality of life' }, score: 20 },
      { label: { es: 'Iniciar negocio', en: 'Start a business' }, score: 20 },
      { label: { es: 'Invertir en bienes raíces', en: 'Invest in real estate' }, score: 20 },
      { label: { es: 'Jubilación', en: 'Retirement' }, score: 15 },
    ],
  },
  {
    id: 'budget',
    question: { es: '¿Cuál es su presupuesto?', en: 'What is your available budget?' },
    options: [
      { label: { es: 'Menos de $50,000', en: 'Under $50,000' }, score: 5 },
      { label: { es: '$50,000 - $150,000', en: '$50,000 - $150,000' }, score: 15 },
      { label: { es: '$150,000 - $500,000', en: '$150,000 - $500,000' }, score: 25 },
      { label: { es: 'Más de $500,000', en: 'Over $500,000' }, score: 25 },
    ],
  },
  {
    id: 'timeline',
    question: { es: '¿Cuándo desea mudarse?', en: 'When do you want to relocate?' },
    options: [
      { label: { es: 'Inmediatamente', en: 'Immediately' }, score: 20 },
      { label: { es: 'En 6 meses', en: 'Within 6 months' }, score: 20 },
      { label: { es: 'En 1 año', en: 'Within 1 year' }, score: 15 },
      { label: { es: 'Solo explorando', en: 'Just exploring' }, score: 5 },
    ],
  },
  {
    id: 'businessInterest',
    question: { es: '¿Opera un negocio en PY?', en: 'Want to operate in Paraguay?' },
    options: [
      { label: { es: 'Sí', en: 'Yes' }, score: 15 },
      { label: { es: 'Quizás', en: 'Maybe' }, score: 10 },
      { label: { es: 'No', en: 'No' }, score: 0 },
    ],
  },
  {
    id: 'dependents',
    question: { es: '¿Tiene dependientes?', en: 'Do you have dependents?' },
    options: [
      { label: { es: 'Sí, familia', en: 'Yes, family' }, score: 15 },
      { label: { es: 'Solo cónyuge', en: 'Spouse only' }, score: 10 },
      { label: { es: 'Solo / soltero', en: 'Single' }, score: 5 },
    ],
  },
]

const RECOMMENDATIONS = [
  { minScore: 80, program: 'business', message: { es: '¡Ideal para Paraguay Business!', en: 'Ideal for Paraguay Business!' } },
  { minScore: 60, program: 'base', message: { es: 'Buen candidato', en: 'Good candidate' } },
  { minScore: 40, program: 'consult', message: { es: 'Requiere evaluación', en: 'Requires evaluation' } },
  { minScore: 0, program: 'none', message: { es: 'Consulte alternativas', en: 'Explore alternatives' } },
]

const LABELS: Record<string, { eyebrow: string; title: string; subtitle: string; yourScore: string; cta: string }> = {
  en: { eyebrow: 'Am I a fit?', title: 'Is Paraguay right for you?', subtitle: 'Answer 5 quick questions to see your fit score.', yourScore: 'Your fit score', cta: 'Talk to us' },
  es: { eyebrow: '¿Califico?', title: '¿Es Paraguay para ti?', subtitle: 'Responde 5 preguntas para ver tu puntaje.', yourScore: 'Tu puntaje', cta: 'Hable con nosotros' },
  nl: { eyebrow: 'Geschikt?', title: 'Is Paraguay geschikt?', subtitle: 'Beantwoord 5 vragen om uw score te zien.', yourScore: 'Uw score', cta: 'Praat met ons' },
  de: { eyebrow: 'Geeignet?', title: 'Ist Paraguay richtig?', subtitle: 'Beantworten Sie 5 Fragen, um Ihre Punktzahl zu sehen.', yourScore: 'Ihre Punktzahl', cta: 'Sprechen Sie mit uns' },
}

export function ResidencyQualifier({ eyebrow, title, subtitle, ctaHref = '#contacto', __locale = 'en' }: ResidencyQualifierProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const L = LABELS[__locale as 'es' | 'en'] || LABELS.en

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0)

  const handleAnswer = (qIdx: number, score: number) => {
    setAnswers((prev) => ({ ...prev, [qIdx]: score }))
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setShowResult(true)
    }
  }

  const handleReset = () => {
    setAnswers({})
    setCurrentQuestion(0)
    setShowResult(false)
  }

  const recIdx = RECOMMENDATIONS.findIndex((r) => totalScore >= r.minScore)
  const recommendation = recIdx >= 0 ? RECOMMENDATIONS[recIdx] : RECOMMENDATIONS[RECOMMENDATIONS.length - 1]

  if (showResult) {
    return (
      <section className="bg-[var(--surface-light)] py-16 sm:py-24">
        <Container>
          <AnimatedSectionHeader>
            <Heading level={2}>{title || L.title}</Heading>
          </AnimatedSectionHeader>

          <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-card">
            <div className="mb-8">
              <p className="text-sm text-[var(--text-muted)]">{L.yourScore}</p>
              <p className="text-5xl font-bold text-[var(--primary)]">{totalScore}</p>
            </div>
            <div className="mb-8 rounded-xl bg-green-50 p-4">
              <p className="text-lg font-semibold text-green-800">{recommendation.message[__locale as 'es' | 'en'] || recommendation.message.en}</p>
            </div>
            <div className="space-y-4">
              <Button variant="primary" href={ctaHref} style={{ backgroundColor: 'var(--secondary)', color: '#ffffff' }} className="w-full">
                {L.cta}
              </Button>
              <button onClick={handleReset} className="w-full text-sm text-[var(--text-muted)] underline">
                {__locale === 'es' ? 'Comenzar de nuevo' : __locale === 'de' ? 'Neu starten' : __locale === 'nl' ? 'Opnieuw beginnen' : 'Start over'}
              </button>
            </div>
          </div>
        </Container>
      </section>
    )
  }

  const currentQ = QUESTIONS[currentQuestion]

  return (
    <section className="bg-[var(--surface-light)] py-16 sm:py-24">
      <Container>
        <AnimatedSectionHeader>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--secondary)]">{eyebrow || L.eyebrow}</p>
          <Heading level={2}>{title || L.title}</Heading>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--text-light)]">{subtitle || L.subtitle}</p>
        </AnimatedSectionHeader>

        <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-card">
          <p className="mb-4 text-sm text-[var(--text-muted)]">
            {__locale === 'es' ? 'Pregunta' : __locale === 'de' ? 'Frage' : __locale === 'nl' ? 'Vraag' : 'Question'} {currentQuestion + 1}/{QUESTIONS.length}
          </p>
          <h3 className="mb-6 text-xl font-semibold text-[var(--text)]">{currentQ.question[__locale as 'es' | 'en'] || currentQ.question.en}</h3>

          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => (
              <button key={idx} onClick={() => handleAnswer(currentQuestion, opt.score)} className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-light)] p-4 text-left transition-all hover:border-[var(--secondary)]">
                <span className="text-[var(--text)]">{opt.label[__locale as 'es' | 'en'] || opt.label.en}</span>
              </button>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}