'use client'

import { useState } from 'react'
import { Wand2, Mail, Lock, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Las contrasenas no coinciden.')
      return
    }

    if (password.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres.')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        console.error('[Signup] Auth error:', authError)
        setError(authError.message)
        setLoading(false)
        return
      }

      setSuccess(true)
    } catch (err) {
      console.error('[Signup] Unexpected error:', err)
      setError('Ocurrio un error inesperado. Intenta de nuevo.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] -translate-y-1/3 translate-x-1/4 rounded-full bg-[var(--primary)]/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] translate-y-1/3 -translate-x-1/4 rounded-full bg-[var(--accent)]/5 blur-3xl" />
      </div>

      <Container size="sm">
        <div className="mx-auto w-full max-w-md">
          {/* Card */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-card">
            {/* Logo & header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)]">
                <Wand2 size={24} />
              </div>
              <h1 className="text-2xl font-bold text-[var(--text)]">
                Crear Cuenta
              </h1>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Registrate en Paragu<span className="text-[var(--primary)]">AI</span> Builder
              </p>
            </div>

            {/* Success message */}
            {success ? (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--success)]/10">
                  <CheckCircle2 size={28} className="text-[var(--success)]" />
                </div>
                <h2 className="mb-2 text-lg font-semibold text-[var(--text)]">
                  Revisa tu email
                </h2>
                <p className="mb-6 text-sm text-[var(--text-muted)]">
                  Te enviamos un enlace de confirmacion a{' '}
                  <span className="font-medium text-[var(--text)]">{email}</span>.
                  Revisa tu bandeja de entrada para activar tu cuenta.
                </p>
                <a
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl border-2 border-[var(--border)] px-6 py-2.5 text-sm font-semibold text-[var(--text)] transition-all duration-normal hover:border-[var(--primary)] hover:text-[var(--primary)]"
                >
                  Volver a Iniciar Sesion
                </a>
              </div>
            ) : (
              <>
                {/* Error message */}
                {error && (
                  <div className="mb-6 flex items-start gap-3 rounded-lg border border-[var(--destructive)]/20 bg-[var(--destructive)]/5 p-4">
                    <AlertCircle size={18} className="mt-0.5 shrink-0 text-[var(--destructive)]" />
                    <p className="text-sm text-[var(--destructive)]">{error}</p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-sm font-medium text-[var(--text)]"
                    >
                      Correo electronico
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Mail size={16} className="text-[var(--text-muted)]" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] py-2.5 pl-10 pr-4 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] transition-all duration-normal focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                      />
                    </div>
                  </div>

                  {/* Password field */}
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-1.5 block text-sm font-medium text-[var(--text)]"
                    >
                      Contrasena
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Lock size={16} className="text-[var(--text-muted)]" />
                      </div>
                      <input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimo 6 caracteres"
                        className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] py-2.5 pl-10 pr-4 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] transition-all duration-normal focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                      />
                    </div>
                  </div>

                  {/* Confirm password field */}
                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="mb-1.5 block text-sm font-medium text-[var(--text)]"
                    >
                      Confirmar contrasena
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Lock size={16} className="text-[var(--text-muted)]" />
                      </div>
                      <input
                        id="confirm-password"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeti tu contrasena"
                        className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] py-2.5 pl-10 pr-4 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] transition-all duration-normal focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                      />
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-base font-semibold text-[var(--primary-foreground)] shadow-button transition-all duration-normal hover:-translate-y-0.5 hover:shadow-card-hover disabled:pointer-events-none disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Creando cuenta...
                      </>
                    ) : (
                      'Crear Cuenta'
                    )}
                  </button>
                </form>

                {/* Login link */}
                <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
                  Ya tenes cuenta?{' '}
                  <a
                    href="/login"
                    className="font-medium text-[var(--primary)] transition-colors hover:underline"
                  >
                    Iniciar sesion
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}
