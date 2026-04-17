'use client'

import { useState } from 'react'

interface ContactFormProps {
  businessEmail?: string
  topics?: string[]
  showPhone?: boolean
  showSubject?: boolean
  successMessage?: string
}

export default function ContactForm({
  businessEmail,
  topics = [],
  showPhone = true,
  showSubject = true,
  successMessage = '¡Mensaje enviado! Te contactaremos pronto.'
}: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStatus('success')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err) {
      setStatus('error')
      setErrorMessage('Hubo un error. Por favor intenta de nuevo.')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <p className="text-green-800 font-medium">{successMessage}</p>
        <button 
          onClick={() => setStatus('idle')}
          className="mt-4 text-sm text-green-600 hover:underline"
        >
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-[var(--primary)]">Envíanos un mensaje</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            placeholder="Tu nombre"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              placeholder="tu@email.com"
            />
          </div>
          
          {showPhone && (
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                placeholder="+595 9xx xxx xxx"
              />
            </div>
          )}
        </div>

        {showSubject && topics.length > 0 && (
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Asunto
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            >
              <option value="">Selecciona un asunto</option>
              {topics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Mensaje *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none"
            placeholder="¿En qué podemos ayudarte?"
          />
        </div>

        {status === 'error' && (
          <div className="text-red-600 text-sm">{errorMessage}</div>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full bg-[var(--primary)] text-white font-medium py-3 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {status === 'submitting' ? 'Enviando...' : 'Enviar mensaje'}
        </button>
      </div>
    </form>
  )
}