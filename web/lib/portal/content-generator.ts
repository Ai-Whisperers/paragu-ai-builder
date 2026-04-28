const SERVICE_DESCRIPTIONS: Record<string, string[]> = {
  peluqueria: [
    'Corte Dama — Corte y style profesional con productos de primera calidad.',
    'Corte Caballero — Estilo moderno y clásico para todo tipo de cabello.',
    'Coloración — Tinte completo con marcas profesionales.',
    'Mechas — Reflejos naturales para dar luminosidad.',
    'Balayage — Técnica francesa de mano alzada para un look natural.',
    'Keratina — Alisado y reparación intensiva.',
    'Peinados — Peinados para bodas, eventos y ocasiones especiales.',
  ],
  barberia: [
    'Corte Clásico — Corte tradicional con navaja y tijera.',
    'Corte Moderno — Estilos contemporáneos degradados.',
    'Afeitado Clásico — Con navaja, toalla caliente y bálsamo.',
    'Arreglo de Barba — Perfilado y recorte profesional.',
    'Corte Infantil — Cortes para niños en ambiente amigable.',
    'Tratamiento Capilar — Cuidado y revitalización.',
  ],
  restaurant: [
    'Plato del Día — Menú ejecutivo de lunes a viernes.',
    'Carta Completa — Entradas, platos principales y postres.',
    'Menú Infantil — Opciones pensadas para los más pequeños.',
    'Bebidas — Gaseosas, jugos naturales y aguas.',
    'Postres Caseros — Dulces tradicionales paraguayos.',
    'Menú Ejecutivo — Almuerzo completo a precio especial.',
  ],
  gimnasio: [
    'Musculación — Acceso completo a la sala de pesas.',
    'CrossFit — Entrenamiento funcional de alta intensidad.',
    'Yoga — Clases de yoga y meditación guiada.',
    'Spinning — Clases de ciclismo indoor con música.',
    'Funcional — Entrenamiento con peso corporal.',
    'Personal Trainer — Plan personalizado con instructor.',
  ],
  taller_mecanico: [
    'Cambio de Aceite — Cambio de aceite y filtro.',
    'Alineación y Balanceo — Alineación de dirección y balanceo de ruedas.',
    'Frenos — Revisión y cambio de pastillas y discos.',
    'Suspensión — Diagnóstico y reparación de suspensión.',
    'Motor — Diagnóstico computarizado y reparación.',
    'Aire Acondicionado — Carga y reparación de A/A.',
  ],
}

const EXCERPTS: Record<string, string[]> = {
  peluqueria: [
    'Conocé las últimas tendencias en cortes y coloración para esta temporada.',
    'Tips para mantener tu cabello sano y brillante entre visitas al salón.',
    'Transformá tu look con nuestros servicios de coloración profesional.',
  ],
  restaurant: [
    'Descubrí los platos más pedidos de nuestra carta esta temporada.',
    'Consejos para maridar tus comidas favoritas con los mejores vinos.',
    'Conocé la historia detrás de nuestros platos tradicionales.',
  ],
  gimnasio: [
    'Rutinas de entrenamiento para maximizar tus resultados en el gimnasio.',
    'Consejos de nutrición para complementar tu entrenamiento.',
    'Los beneficios del entrenamiento funcional para tu salud.',
  ],
}

const POST_TITLES: Record<string, string[]> = {
  peluqueria: [
    'Tendencias de coloración para esta temporada',
    'Cómo cuidar tu cabello en verano',
    'Los cortes que serán tendencia este año',
    'Tips para mantener tu color por más tiempo',
    'La importancia de los tratamientos capilares',
  ],
  restaurant: [
    'Novedades en nuestro menú esta temporada',
    'La historia detrás de nuestros platos tradicionales',
    'Consejos para una alimentación equilibrada',
    'Conocé a nuestro equipo de cocina',
    'Eventos especiales y promociones del mes',
  ],
  gimnasio: [
    'Beneficios del entrenamiento regular',
    'Rutina de ejercicios para principiantes',
    'La importancia de la recuperación muscular',
    'Nutrición deportiva: lo que necesitás saber',
    'Superá tus límites con entrenamiento funcional',
  ],
}

export function generateServices(businessType: string, count = 4): Array<{ name: string; price: string; description: string }> {
  const pool = SERVICE_DESCRIPTIONS[businessType] || SERVICE_DESCRIPTIONS.peluqueria
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map((desc) => {
    const [name, ...rest] = desc.split(' — ')
    return {
      name: name || desc,
      price: `Gs ${(Math.floor(Math.random() * 150) + 30)}.000`,
      description: rest.join(' — ') || desc,
    }
  })
}

export function generateExcerpt(businessType: string): string {
  const pool = EXCERPTS[businessType]
  if (!pool || pool.length === 0) return 'Descubrí todo lo que tenemos para ofrecerte.'
  return pool[Math.floor(Math.random() * pool.length)]
}

export function generatePostTitle(businessType: string, index = 0): string {
  const pool = POST_TITLES[businessType]
  if (!pool || pool.length === 0) return 'Novedades'
  return pool[index % pool.length]
}

export function generatePostContent(title: string, businessName: string, businessType: string): string {
  const city = 'Asunción'
  const excerpt = generateExcerpt(businessType)

  return `## ${title}

En ${businessName}, estamos comprometidos con ofrecerte la mejor experiencia en ${businessType.replace(/_/g, ' ')} en ${city}.

### ¿Por qué elegirnos?

Somos un equipo de profesionales apasionados por lo que hacemos. Cada servicio está pensado para superar tus expectativas.

### Nuestros servicios

${generateServices(businessType).map((s) => `- **${s.name}**: ${s.description}`).join('\n')}

### Visitanos

Estamos ubicados en ${city}. Contactanos por WhatsApp o visitá nuestro sitio web para más información.

---

*${excerpt}*`
}

export async function autoGenerateBlogPost(businessId: string, businessName: string, businessType: string): Promise<{ title: string; slug: string } | null> {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient('service_role')
  const title = generatePostTitle(businessType, 0)
  const content = generatePostContent(title, businessName, businessType)
  const excerpt = generateExcerpt(businessType)
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)

  const { data: post, error } = await supabase.from('blog_posts').insert({
    business_id: businessId,
    slug,
    title,
    content,
    excerpt,
    category: 'General',
    status: 'draft',
  }).select('id, title, slug').single()

  if (error) return null
  return { title: post.title, slug: post.slug }
}
