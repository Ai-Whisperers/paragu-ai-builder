'use client'

/**
 * Product Finder Quiz — 3-question guided discovery. Solves the "don't
 * know the vocabulary, don't want to browse 80 products" problem on
 * adult-content storefronts by walking the shopper through budget /
 * experience / goal and mapping the answers to filter params on
 * /tienda?category=<x>&brand=<y>&max_price=<z>.
 *
 * Deliberately low-tech: 3 steps, radio groups, no personality-test
 * vibes. Builds a query string and redirects. No state persistence
 * beyond the URL.
 */

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  siteSlug: string
  locale: string
}

type Audience = 'para_ella' | 'para_el' | 'parejas' | 'curioso'
type Budget = 'low' | 'mid' | 'high'
type Experience = 'primera' | 'algo' | 'experto'

interface Answers {
  audience?: Audience
  budget?: Budget
  experience?: Experience
}

const AUDIENCE_OPTS: Array<{ value: Audience; label: string; hint: string }> = [
  { value: 'para_ella', label: 'Para ella', hint: 'Productos enfocados en placer femenino.' },
  { value: 'para_el', label: 'Para él', hint: 'Productos enfocados en placer masculino.' },
  { value: 'parejas', label: 'Para parejas', hint: 'Juguetes compartidos y experiencias en pareja.' },
  { value: 'curioso', label: 'Curiosidad / explorar', hint: 'Quiero ver recomendaciones generales.' },
]

const BUDGET_OPTS: Array<{ value: Budget; label: string; max_price: number }> = [
  { value: 'low', label: 'Bajo 100.000 Gs', max_price: 100000 },
  { value: 'mid', label: '100.000 - 300.000 Gs', max_price: 300000 },
  { value: 'high', label: 'Sin límite', max_price: 0 },
]

const EXPERIENCE_OPTS: Array<{ value: Experience; label: string; tag: string }> = [
  { value: 'primera', label: 'Es mi primera vez', tag: 'principiantes' },
  { value: 'algo', label: 'Ya probé algunos', tag: 'intermedio' },
  { value: 'experto', label: 'Tengo experiencia', tag: 'avanzado' },
]

const AUDIENCE_TO_CATEGORY: Record<Audience, string> = {
  para_ella: 'para-ella',
  para_el: 'para-el',
  parejas: 'parejas',
  curioso: '',
}

export function ProductFinderQuiz({ siteSlug, locale }: Props) {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [answers, setAnswers] = useState<Answers>({})

  function advance() {
    if (step < 3) setStep((s) => (s + 1) as 1 | 2 | 3)
    else submit()
  }

  function submit() {
    const params = new URLSearchParams()
    const cat = answers.audience ? AUDIENCE_TO_CATEGORY[answers.audience] : ''
    if (cat) params.set('category', cat)
    const budget = BUDGET_OPTS.find((b) => b.value === answers.budget)
    if (budget?.max_price) params.set('max_price', String(budget.max_price))
    const exp = EXPERIENCE_OPTS.find((e) => e.value === answers.experience)
    if (exp) params.set('tag', exp.tag)
    router.push(`/s/${locale}/${siteSlug}/tienda?${params.toString()}`)
  }

  return (
    <div className="mx-auto max-w-lg rounded-lg border border-[color:var(--border,#e5e7eb)] bg-[color:var(--surface,#fff)] p-6">
      <div className="mb-4 flex items-center justify-between text-xs text-[color:var(--text-muted,#6b7280)]">
        <span>Paso {step} de 3</span>
        <div className="flex gap-1">
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className={`h-1.5 w-6 rounded-full ${
                n <= step ? 'bg-[color:var(--primary,#111)]' : 'bg-[color:var(--border,#e5e7eb)]'
              }`}
            />
          ))}
        </div>
      </div>

      {step === 1 ? (
        <>
          <h2 className="mb-1 text-xl font-bold text-[color:var(--text,#111)]">¿Para quién buscás?</h2>
          <p className="mb-5 text-sm text-[color:var(--text-muted,#6b7280)]">
            Sin juicios — elegí lo que más se ajuste, podés cambiarlo después.
          </p>
          <div className="grid gap-2">
            {AUDIENCE_OPTS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  setAnswers({ ...answers, audience: o.value })
                  setStep(2)
                }}
                className={`rounded-md border p-3 text-left transition-colors ${
                  answers.audience === o.value
                    ? 'border-[color:var(--primary,#111)] bg-[color:var(--surface-light,#f9fafb)]'
                    : 'border-[color:var(--border,#e5e7eb)] hover:border-[color:var(--primary,#111)]'
                }`}
              >
                <p className="font-semibold text-[color:var(--text,#111)]">{o.label}</p>
                <p className="text-xs text-[color:var(--text-muted,#6b7280)]">{o.hint}</p>
              </button>
            ))}
          </div>
        </>
      ) : null}

      {step === 2 ? (
        <>
          <h2 className="mb-1 text-xl font-bold text-[color:var(--text,#111)]">¿Cuánto querés gastar?</h2>
          <p className="mb-5 text-sm text-[color:var(--text-muted,#6b7280)]">
            Todos los productos se cotizan individualmente según zona y pago.
          </p>
          <div className="grid gap-2">
            {BUDGET_OPTS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  setAnswers({ ...answers, budget: o.value })
                  setStep(3)
                }}
                className={`rounded-md border p-3 text-left font-semibold transition-colors ${
                  answers.budget === o.value
                    ? 'border-[color:var(--primary,#111)] bg-[color:var(--surface-light,#f9fafb)]'
                    : 'border-[color:var(--border,#e5e7eb)] hover:border-[color:var(--primary,#111)]'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </>
      ) : null}

      {step === 3 ? (
        <>
          <h2 className="mb-1 text-xl font-bold text-[color:var(--text,#111)]">¿Qué tanta experiencia tenés?</h2>
          <p className="mb-5 text-sm text-[color:var(--text-muted,#6b7280)]">
            Sin importar la respuesta, te vamos a mostrar opciones aptas.
          </p>
          <div className="grid gap-2">
            {EXPERIENCE_OPTS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  setAnswers({ ...answers, experience: o.value })
                  setTimeout(submit, 0) // microtask: allow state to apply
                }}
                className={`rounded-md border p-3 text-left font-semibold transition-colors ${
                  answers.experience === o.value
                    ? 'border-[color:var(--primary,#111)] bg-[color:var(--surface-light,#f9fafb)]'
                    : 'border-[color:var(--border,#e5e7eb)] hover:border-[color:var(--primary,#111)]'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </>
      ) : null}

      <div className="mt-4 flex items-center justify-between text-xs text-[color:var(--text-muted,#6b7280)]">
        <button
          type="button"
          onClick={() => step > 1 && setStep((s) => (s - 1) as 1 | 2 | 3)}
          disabled={step === 1}
          className="underline disabled:opacity-40"
        >
          ← Atrás
        </button>
        <button
          type="button"
          onClick={advance}
          className="underline"
        >
          Saltar al catálogo
        </button>
      </div>
    </div>
  )
}
