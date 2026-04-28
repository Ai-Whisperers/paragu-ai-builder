'use client'
import { Section } from '@/components/ui/section'

import { useState } from 'react'
import { Camera, MapPin, Users, Heart, Award } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Heading } from '@/components/ui/heading'

export interface PhotoGalleryProps {
  className?: string
}

const GALLERY_ITEMS = [
  {
    id: '1',
    emoji: '🐔',
    title: 'Nuestras Gallinas',
    description: 'Criadas en ambiente natural con acceso a pasto',
    category: 'Gallinas'
  },
  {
    id: '2',
    emoji: '🥚',
    title: 'Huevos Frescos',
    description: 'Recolección diaria garantiza máxima frescura',
    category: 'Productos'
  },
  {
    id: '3',
    emoji: '🏠',
    title: 'Instalaciones',
    description: 'Granja familiar ubicada en Ruta 2, Km 125-140',
    category: 'Instalaciones'
  },
  {
    id: '4',
    emoji: '👩‍🌾',
    title: 'Laura Cabral',
    description: 'Fundadora y alma de Granja Cabral',
    category: 'Equipo'
  },
  {
    id: '5',
    emoji: '🌾',
    title: 'Alimentación Natural',
    description: 'Maíz de cultivo local y suplemento vitamínico',
    category: 'Proceso'
  },
  {
    id: '6',
    emoji: '📦',
    title: 'Preparación de Pedidos',
    description: 'Cuidado y atención en cada pedido',
    category: 'Proceso'
  },
  {
    id: '7',
    emoji: '🚚',
    title: 'Delivery',
    description: 'Llevamos frescura hasta tu puerta',
    category: 'Servicio'
  },
  {
    id: '8',
    emoji: '👨‍👩‍👧‍👦',
    title: 'Clientes Felices',
    description: 'Familias y negocios que confían en nosotros',
    category: 'Clientes'
  }
]

const STATS = [
  { icon: Heart, value: '500+', label: 'Gallinas felices', color: 'text-pink-500' },
  { icon: MapPin, value: '100%', label: 'Producción local', color: 'text-[var(--success)]' },
  { icon: Users, value: '200+', label: 'Clientes activos', color: 'text-primary' },
  { icon: Award, value: '5+', label: 'Años de experiencia', color: 'text-amber-500' }
]

export function PhotoGallery({ className }: PhotoGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState('Todas')

  const categories = ['Todas', ...Array.from(new Set(GALLERY_ITEMS.map(item => item.category)))]
  
  const filteredItems = selectedCategory === 'Todas' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === selectedCategory)

  return (
    <Section fullWidth spacing="md" className={className}>
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-primary">
            <Camera className="w-4 h-4 mr-1" />
            Galería
          </Badge>
          <Heading level={2} className="text-xl sm:text-3xl font-bold text-foreground mb-4">
            Conocé nuestra granja
          </Heading>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transparencia total: te mostramos dónde y cómo producimos tus huevos
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {STATS.map((stat, idx) => (
            <Card key={idx} className="text-center hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <stat.icon className={cn('w-8 h-8 mx-auto mb-2', stat.color)} />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-surface text-foreground hover:bg-border'
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square bg-gradient-to-br from-[var(--surface)] to-[var(--surfaceAlt)] rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <span className="text-xl sm:text-3xl sm:text-5xl mb-3 group-hover:scale-110 transition-transform">
                  {item.emoji}
                </span>
                <Heading level={3} className="font-semibold text-foreground text-sm mb-1">
                  {item.title}
                </Heading>
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center p-4">
                <div className="text-center text-white">
                  <span className="text-xl sm:text-3xl mb-2 block">{item.emoji}</span>
                  <p className="font-semibold mb-1">{item.title}</p>
                  <p className="text-sm opacity-90">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <p className="text-muted-foreground mb-4">
            ¿Querés ver más o visitar la granja personalmente?
          </p>
          <p className="text-sm text-muted-foreground">
            Estamos en Ruta 2, Km 125-140, Coronel Oviedo
          </p>
        </div>
      </div>
    </Section>
  )
}

export default PhotoGallery
