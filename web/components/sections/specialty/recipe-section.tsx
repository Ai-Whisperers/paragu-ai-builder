'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, Users, ChefHat, ArrowLeft, Share2, MessageCircle, Search, Flame, Timer, ChefHat as ChefHatIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Heading } from '@/components/ui/heading'
import { RECIPES, RECIPE_CATEGORIES, type Recipe } from '@/lib/data/recipes'

interface RecipeCategory {
  id: string
  label: string
  icon?: string
}

interface RecipePageProps {
  business: {
    name: string
    whatsapp: string
  }
  recipes?: Recipe[]
  categories?: ReadonlyArray<RecipeCategory>
}

function RecipeCard({ recipe, business }: { recipe: Recipe; business: RecipePageProps['business'] }) {
  const whatsappMessage = `Hola! Vi la receta de ${recipe.title} en su web y me encantó. ¿Tienen todos los ingredientes disponibles?`
  const whatsappUrl = `https://wa.me/${business.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`

  const difficultyColor = {
    'Fácil': 'bg-green-100 text-green-800',
    'Media': 'bg-yellow-100 text-yellow-800',
    'Difícil': 'bg-red-100 text-[var(--primary)]'
  }[recipe.difficulty]

  return (
    <Card className="overflow-hidden border-[var(--border)] hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
        <div className="text-center p-4">
          <ChefHatIcon className="w-16 h-16 text-orange-400 mx-auto mb-2" />
          <span className="text-sm text-orange-700 font-medium">{recipe.category}</span>
        </div>
        {recipe.featured && (
          <Badge className="absolute top-3 right-3 bg-orange-500 text-white">
            <Flame className="w-3 h-3 mr-1" />
            Destacada
          </Badge>
        )}
      </div>
      
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className={difficultyColor}>
            {recipe.difficulty}
          </Badge>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {recipe.prepTime + recipe.cookTime} min
          </span>
        </div>
        
        <Heading level={3} className="text-lg font-bold text-[var(--text)] mb-2">{recipe.title}</Heading>
        <p className="text-sm text-[var(--text-muted)] mb-4 line-clamp-2">{recipe.description}</p>
        
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
          <Users className="w-4 h-4" />
          <span>{recipe.servings} porciones</span>
        </div>
        
        <div className="flex gap-2">
          <Link href={`/recetas/${recipe.id}`} className="flex-1">
            <Button variant="outline" className="w-full text-sm">
              Ver Receta
            </Button>
          </Link>
          <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button size="icon" className="bg-[var(--success)] hover:bg-green-700">
              <MessageCircle className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

function RecipeDetail({ recipe, business, onBack }: { recipe: Recipe; business: RecipePageProps['business']; onBack: () => void }) {
  const whatsappMessage = `Hola! Vi la receta de ${recipe.title} en su web y me encantó. Quiero hacerla y necesito los ingredientes. ¿Me podés ayudar?`
  const whatsappUrl = `https://wa.me/${business.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a recetas
      </Button>

      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={recipe.difficulty === 'Fácil' ? 'bg-green-100 text-green-800' : recipe.difficulty === 'Media' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-[var(--primary)]'}>
            {recipe.difficulty}
          </Badge>
          <Badge variant="outline">{recipe.category}</Badge>
          {recipe.featured && (
            <Badge className="bg-orange-500 text-white">
              <Flame className="w-3 h-3 mr-1" />
              Receta Destacada
            </Badge>
          )}
        </div>

        <Heading level={1} className="text-3xl md:text-4xl font-bold text-[var(--text)] mb-4">{recipe.title}</Heading>
        <p className="text-lg text-[var(--text-muted)] mb-6">{recipe.description}</p>

        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-orange-600" />
            <div>
              <p className="font-semibold text-[var(--text)]">Preparación</p>
              <p className="text-[var(--text-muted)]">{recipe.prepTime} minutos</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-600" />
            <div>
              <p className="font-semibold text-[var(--text)]">Cocción</p>
              <p className="text-[var(--text-muted)]">{recipe.cookTime} minutos</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <div>
              <p className="font-semibold text-[var(--text)]">Total</p>
              <p className="text-[var(--text-muted)]">{recipe.prepTime + recipe.cookTime} minutos</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-600" />
            <div>
              <p className="font-semibold text-[var(--text)]">Porciones</p>
              <p className="text-[var(--text-muted)]">{recipe.servings} personas</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-orange-600" />
              Ingredientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-[var(--text)]">{ingredient}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-600" />
              Preparación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="w-7 h-7 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-[var(--text)]">{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-amber-50 border-amber-200 mb-8">
        <CardHeader>
          <CardTitle className="text-amber-800">💡 Tips de {business.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recipe.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-amber-900">
                <span className="text-amber-600">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2 mb-8">
        {recipe.tags.map((tag, index) => (
          <Badge key={index} variant="secondary">
            #{tag}
          </Badge>
        ))}
      </div>

      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-6 text-white">
        <Heading level={3} className="text-xl font-bold mb-2">¿Te falta algún ingrediente?</Heading>
        <p className="mb-4 opacity-90">
          Tenemos huevos frescos de granja y muchos otros ingredientes de calidad. 
          ¡Escribinos por WhatsApp y te ayudamos!
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button className="bg-white text-orange-600 hover:bg-[var(--surface-light)]">
              <MessageCircle className="w-4 h-4 mr-2" />
              Pedir Ingredientes
            </Button>
          </Link>
          <Button variant="outline" className="border-white text-white hover:bg-white/10">
            <Share2 className="w-4 h-4 mr-2" />
            Compartir Receta
          </Button>
        </div>
      </div>
    </div>
  )
}

export function RecipeSection({
  business,
  recipes = RECIPES,
  categories = RECIPE_CATEGORIES,
}: RecipePageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

  const filteredRecipes = recipes.filter(recipe => {
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const featuredRecipes = recipes.filter(r => r.featured)

  if (selectedRecipe) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <RecipeDetail 
            recipe={selectedRecipe} 
            business={business}
            onBack={() => setSelectedRecipe(null)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <Heading level={2} className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-4">
            Recetas con <span className="text-orange-600">Huevos Frescos</span>
          </Heading>
          <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto">
            Deliciosas recetas paraguayas usando nuestros huevos de granja. 
            Desde clásicos tradicionales hasta platos modernos.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
            <Input
              type="text"
              placeholder="Buscar recetas o ingredientes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id ? 'bg-orange-600 hover:bg-orange-700' : ''}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Featured Recipes */}
        {selectedCategory === 'all' && !searchQuery && (
          <div className="mb-12">
            <Heading level={2} className="text-2xl font-bold text-[var(--text)] mb-6 flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" />
              Recetas Destacadas
            </Heading>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRecipes.map((recipe) => (
                <div key={recipe.id} onClick={() => setSelectedRecipe(recipe)} className="cursor-pointer">
                  <RecipeCard recipe={recipe} business={business} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Recipes */}
        <div>
          <Heading level={2} className="text-2xl font-bold text-[var(--text)] mb-6">
            {searchQuery ? `Resultados para "${searchQuery}"` :
             selectedCategory === 'all' ? 'Todas las Recetas' :
             categories.find(c => c.id === selectedCategory)?.label}
            <span className="text-lg font-normal text-gray-500 ml-2">
              ({filteredRecipes.length} recetas)
            </span>
          </Heading>
          
          {filteredRecipes.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <div key={recipe.id} onClick={() => setSelectedRecipe(recipe)} className="cursor-pointer">
                  <RecipeCard recipe={recipe} business={business} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ChefHatIcon className="w-16 h-16 text-[var(--text-light)] mx-auto mb-4" />
              <p className="text-gray-500">No encontramos recetas con esos criterios.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {setSearchQuery(''); setSelectedCategory('all')}}
              >
                Ver todas las recetas
              </Button>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 text-white text-center">
          <Heading level={3} className="text-2xl font-bold mb-3">¿Tenés una receta favorita?</Heading>
          <p className="mb-6 opacity-90">
            Compartila con nosotros y podemos publicarla en nuestra web.
            Las mejores recetas usando huevos frescos de {business.name}.
          </p>
          <Link
            href={`https://wa.me/${business.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola! Tengo una receta familiar que quiero compartir con ${business.name}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" className="bg-white text-orange-600 hover:bg-[var(--surface-light)]">
              <MessageCircle className="w-5 h-5 mr-2" />
              Enviar mi Receta
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
