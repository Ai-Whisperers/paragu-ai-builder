'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Star, MessageCircle } from 'lucide-react'

const LABELS = [
  '', '', '', '', '',
  '', '', '', '', '',
]

const EMOJIS = ['😡', '😞', '😞', '😞', '😐', '😐', '😊', '😊', '😊', '🔥', '🔥']

export default function NpsPage() {
  const router = useRouter()
  const [score, setScore] = useState<number | null>(null)
  const [feedback, setFeedback] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async () => {
    if (score == null) return
    setSaving(true)
    await fetch('/api/portal/nps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, feedback }),
    })
    setDone(true)
    setSaving(false)
  }

  if (done) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
            🙌
          </div>
          <h2 className="text-xl font-bold text-gray-900">¡Gracias por tu opinión!</h2>
          <p className="mt-2 text-gray-500">Tu feedback nos ayuda a mejorar ParaguAI.</p>
          <button onClick={() => router.push('/dashboard')}
            className="mt-6 rounded-xl bg-gray-100 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
            Volver al panel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-lg">
        <div className="rounded-xl border bg-white p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <MessageCircle className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">¿Cómo estamos?</h1>
          <p className="text-sm text-gray-500 mb-6">
            Del 0 al 10, ¿qué tan probable es que recomiendes ParaguAI a otros negocios?
          </p>

          <div className="flex justify-center gap-1 mb-6">
            {Array.from({ length: 11 }, (_, i) => (
              <button
                key={i}
                onClick={() => setScore(i)}
                className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold transition-all ${
                  score === i
                    ? 'bg-blue-600 text-white scale-110 shadow-md'
                    : score !== null
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                {i}
              </button>
            ))}
          </div>

          <div className="flex justify-between text-xs text-gray-400 px-2 mb-6">
            <span>Nada probable</span>
            <span>Muy probable</span>
          </div>

          {score != null && (
            <>
              <div className="text-4xl mb-4">{EMOJIS[score]}</div>
              <textarea
                placeholder="Contanos qué podemos mejorar (opcional)"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none mb-4"
              />
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Enviando...' : 'Enviar respuesta'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
