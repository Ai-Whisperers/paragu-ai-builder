'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TenantLoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSent(false)

    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    })

    if (err) {
      setError(err.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Acceso para clientes</h1>
          <p className="text-gray-500 mb-6">
            Ingresá tu correo electrónico para recibir un enlace mágico
          </p>

          {sent ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700">
              Enlace enviado a <strong>{email}</strong>. Revisá tu bandeja de entrada.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">{error}</div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Enviar enlace
              </button>
            </form>
          )}

          <p className="mt-6 text-xs text-gray-400 text-center">
            ¿No tenés cuenta? Contactá a tu administrador
          </p>
        </div>
      </div>
    </div>
  )
}
