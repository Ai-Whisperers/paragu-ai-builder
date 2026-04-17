'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BUSINESS_TYPES } from '@/lib/types'

interface BusinessFormProps {
  business?: {
    id: string
    name: string
    type: string
    tagline?: string
    phone?: string
    whatsapp?: string
    email?: string
    instagram?: string
    facebook?: string
    city: string
    neighborhood?: string
    address?: string
  } | null
  onClose: () => void
  onSave: () => void
}

interface BusinessFormData {
  name: string
  type: typeof BUSINESS_TYPES[number]
  tagline: string
  phone: string
  whatsapp: string
  email: string
  instagram: string
  facebook: string
  city: string
  neighborhood: string
  address: string
}

const initialFormData: BusinessFormData = {
  name: '',
  type: 'peluqueria',
  tagline: '',
  phone: '',
  whatsapp: '',
  email: '',
  instagram: '',
  facebook: '',
  city: 'Asuncion',
  neighborhood: '',
  address: '',
}

const TYPE_LABELS: Record<string, string> = {
  peluqueria: 'Peluqueria',
  salon_belleza: 'Salon de Belleza',
  gimnasio: 'Gimnasio',
  spa: 'Spa',
  unas: 'Uñas',
  tatuajes: 'Tatuajes',
  barberia: 'Barberia',
  estetica: 'Estetica',
  maquiagem: 'Maquillaje',
  depilacion: 'Depilacion',
  pestanas: 'Pestanas y Cejas',
  diseno_grafico: 'Diseño Grafico',
}

export default function BusinessForm({
  business,
  onClose,
  onSave,
}: BusinessFormProps) {
  const businessType = (business?.type as typeof BUSINESS_TYPES[number]) || 'peluqueria'
  const [formData, setFormData] = useState<BusinessFormData>(
    business
      ? {
          name: business.name,
          type: businessType,
          tagline: business.tagline || '',
          phone: business.phone || '',
          whatsapp: business.whatsapp || '',
          email: business.email || '',
          instagram: business.instagram || '',
          facebook: business.facebook || '',
          city: business.city,
          neighborhood: business.neighborhood || '',
          address: business.address || '',
        }
      : initialFormData
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    const slug = formData.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .substring(0, 50)

    const businessData = {
      name: formData.name,
      slug: `${slug}-${Date.now()}`,
      type: formData.type,
      tagline: formData.tagline || null,
      contact: {
        phone: formData.phone || null,
        whatsapp: formData.whatsapp || null,
        email: formData.email || null,
        instagram: formData.instagram || null,
        facebook: formData.facebook || null,
      },
      location: {
        city: formData.city,
        neighborhood: formData.neighborhood || null,
        address: formData.address || null,
      },
    }

    if (business?.id) {
      const { error: updateError } = await supabase
        .from('businesses')
        .update(businessData)
        .eq('id', business.id)

      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }
    } else {
      const { error: insertError } = await supabase
        .from('businesses')
        .insert(businessData)

      if (insertError) {
        setError(insertError.message)
        setLoading(false)
        return
      }
    }

    setLoading(false)
    onSave()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {business ? 'Editar Negocio' : 'Nuevo Negocio'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre del Negocio
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de Negocio
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as typeof BUSINESS_TYPES[number],
                })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              {BUSINESS_TYPES.map((type) => (
                <option key={type} value={type}>
                  {TYPE_LABELS[type] || type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tagline
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) =>
                setFormData({ ...formData, tagline: e.target.value })
              }
              placeholder="Tu eslogan o descripcion corta"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Telefono
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                WhatsApp
              </label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) =>
                  setFormData({ ...formData, whatsapp: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ciudad
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Direccion
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Instagram
              </label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) =>
                  setFormData({ ...formData, instagram: e.target.value })
                }
                placeholder="@usuario"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Facebook
              </label>
              <input
                type="text"
                value={formData.facebook}
                onChange={(e) =>
                  setFormData({ ...formData, facebook: e.target.value })
                }
                placeholder="facebook.com/usuario"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}