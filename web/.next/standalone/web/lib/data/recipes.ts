/**
 * Default Paraguayan recipe catalog for egg-farm / food-focused tenants.
 * Generic — no brand name baked in. Tenants can override via the
 * `recipes` prop on RecipeSection.
 */

export interface Recipe {
  id: string
  title: string
  description: string
  category: 'desayuno' | 'almuerzo' | 'cena' | 'postre' | 'tradicional'
  difficulty: 'Fácil' | 'Media' | 'Difícil'
  prepTime: number
  cookTime: number
  servings: number
  ingredients: string[]
  instructions: string[]
  tips: string[]
  tags: string[]
  featured: boolean
  image?: string
}

export const RECIPES: Recipe[] = [
  {
    id: 'tortilla-paraguaya',
    title: 'Tortilla Paraguaya Clásica',
    description: 'La tortilla perfecta, jugosa por dentro y dorada por fuera. Ideal para cualquier momento del día.',
    category: 'tradicional',
    difficulty: 'Fácil',
    prepTime: 5,
    cookTime: 15,
    servings: 4,
    ingredients: [
      '6 huevos frescos',
      '2 cebollas grandes (picadas fino)',
      '200g de queso Paraguay rallado',
      '2 cucharadas de aceite',
      'Sal y pimienta al gusto',
      'Opcional: perejil picado'
    ],
    instructions: [
      'En un bowl grande, batir los 6 huevos con sal y pimienta hasta que estén bien mezclados.',
      'En una sartén, calentar el aceite a fuego medio. Agregar las cebollas picadas y cocinar hasta doradas (5-7 minutos).',
      'Incorporar las cebollas cocidas a los huevos batidos. Agregar el queso rallado y mezclar bien.',
      'Calentar una sartén antiadherente con un poco de aceite. Verter la mezcla de huevo.',
      'Cocinar a fuego medio-bajo hasta que los bordes estén dorados (8-10 minutos).',
      'Con la ayuda de un plato, dar vuelta la tortilla y cocinar 5 minutos más.',
      'Servir caliente, cortada en triángulos.'
    ],
    tips: [
      'Usá huevos a temperatura ambiente para mejor textura',
      'No revuelvas la tortilla mientras cocina - dejala formar costra dorada',
      'Si te gusta más dorada, dejala 1-2 minutos más'
    ],
    tags: ['tradicional', 'rápido', 'desayuno', 'almuerzo'],
    featured: true
  },
  {
    id: 'sopa-paraguaya',
    title: 'Sopa Paraguaya Tradicional',
    description: 'La sopa paraguaya no es sopa líquida, sino un pan húmedo y esponjoso hecho con harina de maíz y huevos.',
    category: 'tradicional',
    difficulty: 'Media',
    prepTime: 15,
    cookTime: 45,
    servings: 6,
    ingredients: [
      '6 huevos frescos',
      '2 tazas de harina de maíz',
      '1 taza de leche tibia',
      '200g de queso Paraguay rallado',
      '100g de manteca derretida',
      '1 cebolla grande picada',
      '1 cucharadita de sal',
      '1 cucharadita de polvo de hornear'
    ],
    instructions: [
      'Precalentar el horno a 180°C. Enmantecar un molde rectangular.',
      'Saltear la cebolla en manteca hasta dorarla.',
      'Batir los huevos hasta que estén esponjosos (3 minutos).',
      'Agregar leche tibia, manteca y cebollas al huevo. Mezclar.',
      'Incorporar harina de maíz, polvo de hornear y sal. Mezclar sin grumos.',
      'Agregar queso rallado y mezclar suavemente.',
      'Verter en molde y hornear 35-40 minutos hasta dorar.',
      'Dejar enfriar 10 minutos antes de cortar en cuadrados.'
    ],
    tips: [
      'La sopa debe quedar húmeda, no seca. No la sobre-cocines.',
      'Si querés más crocante, agregá 10 minutos más de horneado.',
      'Se conserva bien 2-3 días tapada.'
    ],
    tags: ['tradicional', 'esponjoso', 'horno', 'maíz'],
    featured: true
  },
  {
    id: 'chipa-guazu',
    title: 'Chipa Guazú Cremoso',
    description: 'El chipa guazú es una versión cremosa y húmeda del chipa tradicional. Hecho con almidón de mandioca y muchos huevos.',
    category: 'tradicional',
    difficulty: 'Media',
    prepTime: 15,
    cookTime: 40,
    servings: 8,
    ingredients: [
      '8 huevos frescos',
      '500g de almidón de mandioca',
      '400g de queso Paraguay fresco en cubitos',
      '200g de queso Paraguay rallado',
      '2 tazas de leche tibia',
      '100g de manteca derretida',
      '2 cucharaditas de sal'
    ],
    instructions: [
      'Precalentar horno a 180°C. Enmantecar un molde grande.',
      'Mezclar almidón de mandioca con la sal.',
      'Batir los huevos hasta mezclar bien.',
      'Agregar leche tibia, manteca y huevos al almidón. Mezclar.',
      'Incorporar queso en cubitos y rallado. Mezclar suavemente.',
      'Verter en molde. La mezcla debe quedar líquida como crema espesa.',
      'Hornear 35-40 minutos hasta dorar pero húmeda al centro.',
      'Cortar en cuadrados y servir caliente.'
    ],
    tips: [
      'El secreto está en la cantidad de huevos - no escatimes.',
      'Debe quedar cremoso, no seco como chipa común.',
      'Serví caliente con mate o café.'
    ],
    tags: ['tradicional', 'cremoso', 'mandioca', 'queso'],
    featured: true
  },
  {
    id: 'mbaipy',
    title: 'Mbaipy (Puré de Mandioca con Huevo)',
    description: 'El mbaipy es un plato tradicional guaraní hecho con mandioca, queso y huevos. Sustancioso y reconfortante.',
    category: 'tradicional',
    difficulty: 'Fácil',
    prepTime: 10,
    cookTime: 25,
    servings: 4,
    ingredients: [
      '4 huevos frescos',
      '1kg de mandioca cocida y hecha puré',
      '200g de queso Paraguay rallado',
      '100g de manteca',
      '1 cebolla picada fino',
      '1 taza de leche',
      'Sal y pimienta al gusto'
    ],
    instructions: [
      'Cocinar la mandioca en agua con sal hasta tierna (20-25 min).',
      'Hacer puré con manteca y leche caliente. Debe quedar suave.',
      'Saltear la cebolla hasta dorarla.',
      'Agregar cebollas salteadas al puré. Mezclar bien.',
      'Incorporar queso rallado hasta que se derrita.',
      'Freír los 4 huevos estrellados en sartén aparte.',
      'Servir el puré coronado con los huevos fritos.'
    ],
    tips: [
      'La mandioca debe quedar muy suave para un buen puré.',
      'Serví inmediatamente mientras está caliente.',
      'Ideal para almuerzo de invierno.'
    ],
    tags: ['tradicional', 'sustancioso', 'invierno', 'mandioca'],
    featured: true
  },
  {
    id: 'flan-casero',
    title: 'Flan de Huevo Casero',
    description: 'Un flan cremoso y suave, hecho solo con huevos de granja, leche y azúcar. La textura depende de la calidad de los huevos.',
    category: 'postre',
    difficulty: 'Media',
    prepTime: 15,
    cookTime: 60,
    servings: 8,
    ingredients: [
      '6 huevos frescos',
      '1 litro de leche tibia',
      '1 taza de azúcar (más 1 taza para caramelo)',
      '1 cucharadita de esencia de vainilla',
      '1 pizca de sal'
    ],
    instructions: [
      'Precalentar horno a 180°C.',
      'Hacer caramelo: derretir 1 taza de azúcar a fuego medio-bajo sin revolver hasta ámbar.',
      'Verter caramelo caliente en fondo de molde para flan.',
      'Batir huevos con azúcar hasta disolver bien.',
      'Agregar leche tibia, vainilla y sal. Mezclar suavemente.',
      'Verter mezcla sobre caramelo.',
      'Hornear a baño María 50-60 minutos hasta que palillo salga limpio.',
      'Enfriar a temperatura ambiente, luego refrigerar mínimo 4 horas.',
      'Para desmoldar, pasar cuchillo por bordes y voltear sobre plato.'
    ],
    tips: [
      'El baño María es ESSENTIAL - evita que se cuarte.',
      'No lo hornees de más o quedará aguado.',
      'Mientras más tiempo reposa, mejor sabor tiene.'
    ],
    tags: ['postre', 'clásico', 'cremoso', 'horno'],
    featured: true
  },
  {
    id: 'huevos-rancheros',
    title: 'Huevos Rancheros Paraguayos',
    description: 'Desayuno energético con huevos estrellados sobre tortilla y salsa criolla.',
    category: 'desayuno',
    difficulty: 'Media',
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    ingredients: [
      '4 huevos frescos',
      '2 tortillas de maíz',
      '1 taza de salsa criolla (tomate, cebolla, ají)',
      '1/2 taza de frijoles cocidos',
      '1 aguacate maduro',
      'Queso fresco desmoronado',
      'Cilantro fresco'
    ],
    instructions: [
      'Calentar tortillas en sartén seco hasta flexibles.',
      'Freír huevos estrellados en aceite caliente.',
      'En plato, colocar tortillas calientes.',
      'Agregar frijoles sobre tortillas.',
      'Colocar huevos fritos encima.',
      'Cubrir con salsa criolla caliente.',
      'Decorar con aguacate, queso y cilantro.'
    ],
    tips: ['Perfecto desayuno de fin de semana.', 'Servir inmediatamente.'],
    tags: ['desayuno', 'mexicano', 'sustancioso', 'frito'],
    featured: false
  },
  {
    id: 'revuelto-verduras',
    title: 'Revuelto de Huevo con Verduras',
    description: 'Desayuno saludable en 10 minutos con espinaca y tomate.',
    category: 'desayuno',
    difficulty: 'Fácil',
    prepTime: 5,
    cookTime: 5,
    servings: 2,
    ingredients: [
      '4 huevos frescos',
      '1 taza de espinaca fresca',
      '1 tomate picado',
      '1/4 cebolla picada',
      '2 cucharadas de aceite de oliva',
      'Sal y pimienta',
      'Opcional: queso rallado'
    ],
    instructions: [
      'Batir huevos con sal y pimienta.',
      'Saltear cebolla y tomate 3 minutos.',
      'Agregar espinaca, cocinar 1 minuto.',
      'Verter huevos sobre verduras.',
      'Revolver suavemente hasta cocidos pero húmedos.',
      'Servir con queso rallado encima.'
    ],
    tips: ['Desayuno saludable en 10 minutos.', 'Usá verduras de estación.'],
    tags: ['desayuno', 'saludable', 'rápido', 'verduras'],
    featured: false
  },
  {
    id: 'panqueques-dulces',
    title: 'Panqueques Dulces',
    description: 'Panqueques esponjosos perfectos para el desayuno o merienda.',
    category: 'desayuno',
    difficulty: 'Fácil',
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    ingredients: [
      '2 huevos frescos',
      '1 taza de harina de trigo',
      '1 taza de leche',
      '2 cucharadas de azúcar',
      '1 cucharada de aceite',
      '1 cucharadita de polvo de hornear',
      '1 pizca de sal'
    ],
    instructions: [
      'Mezclar ingredientes secos (harina, azúcar, polvo, sal).',
      'Agregar huevos, leche y aceite. Batir hasta mezcla suave.',
      'Calentar sartén antiadherente con manteca.',
      'Verter 1/4 taza por panqueque.',
      'Cocinar hasta burbujas en superficie, luego dar vuelta.',
      'Dorar 1-2 minutos más.',
      'Servir con miel, mermelada o dulce de leche.'
    ],
    tips: ['Para más esponjosos, dejá reposar la mezcla 10 minutos.'],
    tags: ['desayuno', 'dulce', 'esponjoso', 'merienda'],
    featured: false
  },
  {
    id: 'pasta-carbonara',
    title: 'Pasta Carbonara Paraguaya',
    description: 'Carbonara auténtica usando queso Paraguay en lugar de Parmesano.',
    category: 'almuerzo',
    difficulty: 'Media',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    ingredients: [
      '3 huevos frescos (yemas solo)',
      '400g de fideos',
      '150g de queso Paraguay rallado',
      '150g de panceta picada',
      '2 dientes de ajo picados',
      'Pimienta negra molida'
    ],
    instructions: [
      'Cocinar fideos en agua con sal hasta al dente. Reservar 1 taza de agua.',
      'Dorar panceta hasta crocante. Agregar ajo al final.',
      'Mezclar yemas con queso rallado y mucha pimienta.',
      'Agregar fideos calientes a sartén con panceta (fuego apagado).',
      'Verter rápidamente mezcla de huevo y queso, revolviendo constante.',
      'Agregar agua de cocción si queda espeso.',
      'La salsa debe quedar cremosa, no con huevo cocido.',
      'Servir con más queso y pimienta.'
    ],
    tips: ['El agua de cocción con almidón es clave - no la tires!', 'Revolvé rápido para que el huevo no se cueza.'],
    tags: ['almuerzo', 'pasta', 'italiano', 'cremoso'],
    featured: false
  },
  {
    id: 'tarta-huevo',
    title: 'Tarta de Huevo y Jamón',
    description: 'Tarta salada perfecta para almuerzo o cena.',
    category: 'almuerzo',
    difficulty: 'Media',
    prepTime: 15,
    cookTime: 45,
    servings: 6,
    ingredients: [
      '5 huevos frescos',
      '1 masa para tarta',
      '200g de jamón picado',
      '150g de queso rallado',
      '1 taza de crema de leche',
      '1 cebolla picada',
      'Sal, pimienta, nuez moscada'
    ],
    instructions: [
      'Precalentar horno a 180°C.',
      'Estirar masa en molde, pinchar fondo.',
      'Saltear cebolla, agregar jamón 2 minutos.',
      'Distribuir jamón y cebolla sobre masa.',
      'Batir huevos con crema, queso, sal, pimienta y nuez moscada.',
      'Verter sobre jamón.',
      'Hornear 35-40 minutos hasta dorar y cuajar.',
      'Enfriar 10 minutos antes de cortar.'
    ],
    tips: ['Ideal para usar sobras de jamón.', 'Se puede comer caliente o fría.'],
    tags: ['almuerzo', 'cena', 'tarta', 'horno'],
    featured: false
  },
  {
    id: 'blt-huevo',
    title: 'BLT con Aguacate y Huevo Frito',
    description: 'El sándwich perfecto con huevo frito y yema líquida como salsa.',
    category: 'almuerzo',
    difficulty: 'Fácil',
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    ingredients: [
      '2 huevos frescos',
      '4 rebanadas de pan',
      '4 tiras de panceta',
      'Lechuga fresca',
      '1 tomate en rodajas',
      '1 aguacate maduro',
      'Mayonesa casera'
    ],
    instructions: [
      'Dorar panceta hasta crocante.',
      'Freír huevos en misma sartén.',
      'Tostar pan ligeramente.',
      'Untar mayonesa en pan.',
      'Armar: pan, lechuga, tomate, aguacate, panceta, huevo.',
      'Cubrir con otra rebanada.',
      'Cortar por mitad y servir.'
    ],
    tips: ['El sándwich perfecto.', 'La yema líquida actúa como salsa adicional.'],
    tags: ['almuerzo', 'sándwich', 'rápido', 'clásico'],
    featured: false
  },
  {
    id: 'budin-pan',
    title: 'Budín de Pan con Huevo',
    description: 'Aprovechá el pan duro con este budín húmedo y esponjoso.',
    category: 'postre',
    difficulty: 'Fácil',
    prepTime: 15,
    cookTime: 40,
    servings: 6,
    ingredients: [
      '4 huevos frescos',
      '4 tazas de pan duro en trozos',
      '2 tazas de leche tibia',
      '1/2 taza de azúcar',
      '1 cucharadita de canela',
      '1 cucharadita de esencia de vainilla',
      '1/4 taza de pasas de uva (opcional)'
    ],
    instructions: [
      'Remojar pan en leche tibia 15 minutos.',
      'Machacar pan remojado hasta puré.',
      'Agregar huevos batidos, azúcar, canela, vainilla y pasas.',
      'Mezclar bien hasta homogéneo.',
      'Verter en molde enmantecado.',
      'Hornear a 180°C 35-40 minutos.',
      'Servir tibio o frío.'
    ],
    tips: ['Se puede acompañar con dulce de leche o crema.'],
    tags: ['postre', 'económico', 'pan duro', 'horno'],
    featured: false
  },
  {
    id: 'mini-quiches',
    title: 'Mini Quiches',
    description: 'Perfectos para merienda o desayuno. Se congelan bien.',
    category: 'desayuno',
    difficulty: 'Media',
    prepTime: 15,
    cookTime: 25,
    servings: 12,
    ingredients: [
      '3 huevos frescos',
      '1 masa brisa',
      '1/2 taza de leche',
      '1/2 taza de queso rallado',
      'Jamón picado',
      'Espinaca',
      'Sal y pimienta'
    ],
    instructions: [
      'Precalentar horno a 180°C.',
      'Cortar círculos de masa, colocar en molde de muffins.',
      'Mezclar huevos, leche, queso, sal y pimienta.',
      'Agregar jamón y espinaca picada.',
      'Verter en masas (3/4 lleno).',
      'Hornear 20-25 minutos hasta dorar.'
    ],
    tips: ['Perfectos para merienda o desayuno.', 'Se congelan bien.'],
    tags: ['desayuno', 'merienda', 'horno', 'congelable'],
    featured: false
  },
  {
    id: 'mayonesa-casera',
    title: 'Mayonesa Casera Perfecta',
    description: 'Mayonesa casera hecha con huevos frescos de nuestra granja. Sin conservantes.',
    category: 'almuerzo',
    difficulty: 'Fácil',
    prepTime: 5,
    cookTime: 5,
    servings: 16,
    ingredients: [
      '1 huevo fresco (a temperatura ambiente)',
      '1 taza de aceite vegetal',
      '1 cucharada de jugo de limón',
      '1/2 cucharadita de mostaza',
      'Sal al gusto'
    ],
    instructions: [
      'Colocar huevo, jugo de limón, mostaza y sal en licuadora.',
      'Licuar a velocidad media.',
      'MUY LENTAMENTE, agregar aceite en hilo fino mientras licuadora sigue.',
      'La mezcla empezará a espesarse y emulsionar.',
      'Continuar hasta usar todo el aceite.',
      'Probar y ajustar sal.',
      'Guardar en heladera hasta 1 semana.'
    ],
    tips: ['Agregar el aceite MUY lento al principio.', 'Si se corta, agregar otro huevo y licuar.'],
    tags: ['salsa', 'casera', 'rápido', 'sin conservantes'],
    featured: false
  },
  {
    id: 'salsa-holandesa',
    title: 'Salsa Holandesa',
    description: 'Salsa clásica para huevos Benedictinos o pescado.',
    category: 'almuerzo',
    difficulty: 'Difícil',
    prepTime: 5,
    cookTime: 10,
    servings: 8,
    ingredients: [
      '3 yemas de huevo fresco',
      '100g de mantequilla derretida caliente',
      '1 cucharada de jugo de limón',
      '1 pizca de sal',
      'Pimienta cayena (opcional)'
    ],
    instructions: [
      'En bowl que no toque agua (baño María), colocar yemas.',
      'Agregar jugo de limón.',
      'Batir constantemente hasta espesar y calentar (no hervir).',
      'Retirar del fuego.',
      'Muy lentamente, agregar mantequilla caliente en hilos finos, batiendo siempre.',
      'La salsa debe quedar cremosa y brillante.',
      'Sazonar con sal y cayena.',
      'Servir inmediatamente.'
    ],
    tips: ['Si se corta, agregar 1 cucharada de agua caliente y batir.', 'Servir inmediatamente, no se guarda.'],
    tags: ['salsa', 'clásica', 'difícil', 'holandesa'],
    featured: false
  }
]

export const RECIPE_CATEGORIES = [
  { id: 'all', label: 'Todas', icon: 'UtensilsCrossed' },
  { id: 'desayuno', label: 'Desayunos', icon: 'Sun' },
  { id: 'almuerzo', label: 'Almuerzo', icon: 'Utensils' },
  { id: 'cena', label: 'Cena', icon: 'Moon' },
  { id: 'postre', label: 'Postres', icon: 'Cake' },
  { id: 'tradicional', label: 'Tradicional Paraguayo', icon: 'Flag' }
] as const
