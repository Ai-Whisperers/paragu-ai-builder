'use client'

import { useState } from 'react'
import { Clock, Users, ChefHat, Printer, Share2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { SmartWhatsAppButton } from './smart-whatsapp-section'

export type Difficulty = 'Facil' | 'Medio' | 'Dificil'

export interface Recipe {
  id: string
  title: string
  description: string
  prepTime: number
  cookTime: number
  servings: number
  difficulty: Difficulty
  ingredients: string[]
  instructions: string[]
  tips?: string[]
  image?: string
  tags: string[]
  featured?: boolean
}

export const SAMPLE_RECIPES: Recipe[] = [
  {
    id: 'tortilla-clasica',
    title: 'Tortilla de Huevos Clasica',
    description: 'La tortilla perfecta, jugosa por dentro y dorada por fuera. Ideal para cualquier momento del dia.',
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    difficulty: 'Facil',
    ingredients: [
      '4 huevos frescos Granja Cabral',
      'Sal y pimienta al gusto',
      '2 cucharadas de aceite de oliva',
      'Opcional: cebolla, pimiento, jamon, queso'
    ],
    instructions: [
      'Batir los huevos en un bowl con sal y pimienta',
      'Calentar el aceite en sarten a fuego medio',
      'Verter los huevos y dejar cocinar sin revolver',
      'Cuando los bordes esten listos, doblar por la mitad',
      'Cocinar 1-2 minutos mas y servir caliente'
    ],
    tips: [
      'Usar huevos a temperatura ambiente para mejor resultado',
      'No batir en exceso para mantener la textura esponjosa'
    ],
    tags: ['desayuno', 'rapido', 'clasico', 'gluten-free'],
    featured: true
  },
  {
    id: 'huevos-rancheros',
    title: 'Huevos Rancheros',
    description: 'Desayuno energetico con huevos estrellados sobre tortilla y salsa.',
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    difficulty: 'Medio',
    ingredients: [
      '4 huevos frescos Granja Cabral',
      '2 tortillas de maiz',
      '1 taza de salsa de tomate',
      'Frijoles refritos',
      'Aguacate',
      'Queso fresco'
    ],
    instructions: [
      'Freir ligeramente las tortillas',
      'Calentar la salsa de tomate',
      'Freir los huevos estrellados',
      'Montar: tortilla, frijoles, huevo, salsa',
      'Decorar con aguacate y queso'
    ],
    tags: ['desayuno', 'mexicano', 'sustancioso'],
    featured: true
  },
  {
    id: 'flan-casero',
    title: 'Flan de Huevo Casero',
    description: 'Postre clasico, cremoso y delicioso. Solo 4 ingredientes.',
    prepTime: 15,
    cookTime: 45,
    servings: 6,
    difficulty: 'Medio',
    ingredients: [
      '6 huevos frescos Granja Cabral',
      '1 litro de leche',
      '1 taza de azucar',
      '1 cucharadita de esencia de vainilla',
      'Caramelo para el molde'
    ],
    instructions: [
      'Precalentar horno a 180C',
      'Preparar caramelo y cubrir el fondo del molde',
      'Batir huevos con azucar y vainilla',
      'Agregar leche tibia y mezclar',
      'Verter en molde y hornear a bano Maria por 45 min',
      'Dejar enfriar y desmoldar'
    ],
    tips: [
      'El bano Maria evita que se cuarte',
      'Dejar reposar toda la noche para mejor sabor'
    ],
    tags: ['postre', 'clasico', 'horno'],
    featured: false
  },
  {
    id: 'huevos-revueltos',
    title: 'Huevos Revueltos Perfectos',
    description: 'Suaves, cremosos y esponjosos. El desayuno ideal en 5 minutos.',
    prepTime: 2,
    cookTime: 5,
    servings: 2,
    difficulty: 'Facil',
    ingredients: [
      '4 huevos frescos Granja Cabral',
      '2 cucharadas de leche',
      '1 cucharada de mantequilla',
      'Sal y pimienta al gusto'
    ],
    instructions: [
      'Batir los huevos con la leche y sal',
      'Derretir la mantequilla a fuego bajo',
      'Verter los huevos y revolver suavemente',
      'Retirar del fuego cuando esten casi listos',
      'Servir inmediatamente'
    ],
    tips: [
      'Cocinar a fuego bajo para evitar que se sequen',
      'Retirar antes de que esten completamente cocidos'
    ],
    tags: ['desayuno', 'rapido', 'facil'],
    featured: false
  },
  {
    id: 'torta-huevos',
    title: 'Torta de Huevos y Espinaca',
    description: 'Nutritiva y deliciosa. Perfecta para almuerzo o cena ligera.',
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    difficulty: 'Medio',
    ingredients: [
      '6 huevos frescos Granja Cabral',
      '2 tazas de espinaca',
      '1/2 taza de queso rallado',
      '1/4 taza de leche',
      'Sal, pimienta y nuez moscada'
    ],
    instructions: [
      'Precalentar horno a 180C',
      'Saltear la espinaca y escurrir',
      'Batir huevos con leche y condimentos',
      'Agregar espinaca y queso',
      'Verter en molde engrasado y hornear 30 min'
    ],
    tags: ['almuerzo', 'cena', 'vegetariano', 'saludable'],
    featured: true
  }
]

export interface RecipeCardProps {
  recipe: Recipe
  className?: string
  phone?: string
}

export function RecipeCard({ recipe, className, phone }: RecipeCardProps) {
  const [showFullRecipe, setShowFullRecipe] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: recipe.title,
        text: recipe.description,
        url: window.location.href
      })
    }
  }

  return (
    <Card className={cn('overflow-hidden transition-all duration-300 hover:shadow-lg', className)}>
      {/* Image Placeholder */}
      <div className="aspect-video bg-gradient-to-br from-[var(--surface)] to-[var(--surfaceAlt)] flex items-center justify-center relative overflow-hidden">
        <ChefHat className="w-16 h-16 text-[var(--text-muted)] opacity-30" />
        {recipe.featured && (
          <Badge className="absolute top-3 right-3 bg-[var(--primary)]">
            Destacada
          </Badge>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center gap-3 text-white text-sm">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {recipe.prepTime + recipe.cookTime} min
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {recipe.servings} porciones
            </span>
          </div>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg leading-tight">{recipe.title}</CardTitle>
            <p className="text-sm text-[var(--text-muted)] mt-1">{recipe.description}</p>
          </div>
          <Badge variant={recipe.difficulty === 'Facil' ? 'default' : 'secondary'}>
            {recipe.difficulty}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {recipe.tags.map((tag) => (
            <span 
              key={tag}
              className="text-xs px-2 py-0.5 bg-[var(--surface)] rounded-full text-[var(--text-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-3 gap-2 text-sm mb-4">
          <div className="text-center p-2 bg-[var(--surface)] rounded-lg">
            <Clock className="w-4 h-4 mx-auto mb-1 text-[var(--primary)]" />
            <span className="text-[var(--text-muted)]">Prep</span>
            <p className="font-medium">{recipe.prepTime}m</p>
          </div>
          <div className="text-center p-2 bg-[var(--surface)] rounded-lg">
            <ChefHat className="w-4 h-4 mx-auto mb-1 text-[var(--primary)]" />
            <span className="text-[var(--text-muted)]">Coccion</span>
            <p className="font-medium">{recipe.cookTime}m</p>
          </div>
          <div className="text-center p-2 bg-[var(--surface)] rounded-lg">
            <Users className="w-4 h-4 mx-auto mb-1 text-[var(--primary)]" />
            <span className="text-[var(--text-muted)]">Porciones</span>
            <p className="font-medium">{recipe.servings}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Dialog open={showFullRecipe} onOpenChange={setShowFullRecipe}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                Ver Receta
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">{recipe.title}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 pt-4">
                {/* Meta */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{recipe.difficulty}</Badge>
                  <Badge variant="outline">{recipe.prepTime + recipe.cookTime} min total</Badge>
                  <Badge variant="outline">{recipe.servings} porciones</Badge>
                </div>

                {/* Ingredients */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-sm">
                      1
                    </span>
                    Ingredientes
                  </h4>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0" />
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-sm">
                      2
                    </span>
                    Instrucciones
                  </h4>
                  <ol className="space-y-3">
                    {recipe.instructions.map((step, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--surface)] text-[var(--text)] flex items-center justify-center text-sm font-medium">
                          {idx + 1}
                        </span>
                        <span className="text-[var(--text)]">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Tips */}
                {recipe.tips && recipe.tips.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="font-semibold text-amber-900 mb-2">Consejos del Chef</h4>
                    <ul className="space-y-1">
                      {recipe.tips.map((tip, idx) => (
                        <li key={idx} className="text-sm text-amber-800 flex items-start gap-2">
                          <span className="text-amber-600">💡</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA */}
                {phone && (
                  <div className="bg-[var(--surface)] rounded-lg p-4 text-center">
                    <p className="text-sm text-[var(--text-muted)] mb-3">
                      Necesitas huevos frescos para esta receta?
                    </p>
                    <SmartWhatsAppButton 
                      phone={phone}
                      context="product"
                      productName="Huevos Frescos"
                      price="800 Gs/unidad"
                      size="sm"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-[var(--border)]">
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="w-4 h-4 mr-1" />
                    Imprimir
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-1" />
                    Compartir
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {phone && (
            <SmartWhatsAppButton
              phone={phone}
              context="product"
              productName="Huevos Frescos"
              price="800 Gs"
              size="default"
              variant="outline"
            >
              Comprar
            </SmartWhatsAppButton>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export interface RecipeSectionProps {
  recipes?: Recipe[]
  phone?: string
  className?: string
  title?: string
  subtitle?: string
}

export function RecipeSection({
  recipes = SAMPLE_RECIPES,
  phone,
  className,
  title = 'Recetas con Huevos Frescos',
  subtitle = 'Deliciosas recetas usando nuestros huevos de granja'
}: RecipeSectionProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const allTags = Array.from(new Set(recipes.flatMap(r => r.tags)))
  
  const filteredRecipes = selectedTag
    ? recipes.filter(r => r.tags.includes(selectedTag))
    : recipes

  const featuredRecipes = filteredRecipes.filter(r => r.featured)
  const regularRecipes = filteredRecipes.filter(r => !r.featured)

  return (
    <section className={cn('py-16', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--text)] mb-4">{title}</h2>
          <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Tag Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button
            variant={selectedTag === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTag(null)}
          >
            Todas
          </Button>
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>

        {/* Featured Recipes */}
        {featuredRecipes.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Badge className="bg-[var(--primary)]">Destacadas</Badge>
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} phone={phone} />
              ))}
            </div>
          </div>
        )}

        {/* Regular Recipes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} phone={phone} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-[var(--text-muted)] mb-4">
            Todas nuestras recetas usan huevos frescos de Granja Cabral
          </p>
          {phone && (
            <SmartWhatsAppButton
              phone={phone}
              size="lg"
            >
              Pedir Huevos para tus Recetas
            </SmartWhatsAppButton>
          )}
        </div>
      </div>
    </section>
  )
}

export default RecipeSection
