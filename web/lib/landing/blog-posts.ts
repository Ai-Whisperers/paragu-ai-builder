/**
 * Blog post registry. Add new posts as objects in this array.
 * Body is plain Markdown-ish strings — rendered as paragraphs.
 *
 * NOT a CMS — intentionally keeps content close to code so the team can
 * publish via PR. When the volume justifies it, switch to MDX or a headless CMS.
 */

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  /** ISO date string (YYYY-MM-DD). */
  date: string
  /** Author display name. */
  author: string
  /** Reading-time estimate, e.g. "4 min". */
  readingTime: string
  /** Tag like "vertical:peluqueria" or "topic:seo". */
  tag: string
  /** Body as an array of paragraphs (kept simple — no MDX runtime). */
  body: readonly string[]
}

export const BLOG_POSTS: readonly BlogPost[] = [
  {
    slug: 'por-que-tu-peluqueria-necesita-web',
    title: 'Por qué tu peluquería necesita un sitio web (y no solo Instagram)',
    excerpt:
      'Instagram es genial para mostrar trabajos. Pero si tus clientes no pueden encontrarte en Google, ver tus precios o reservar sin escribirte, estás dejando dinero en la mesa.',
    date: '2026-04-20',
    author: 'Equipo ParaguAI',
    readingTime: '4 min',
    tag: 'vertical:peluqueria',
    body: [
      'En Paraguay hay 2.393 peluquerías mapeadas. El 81% no tiene sitio web propio. Eso significa que cuando alguien busca "peluquería cerca" en Google, casi nadie aparece — y los pocos que sí, se llevan toda la clientela nueva.',
      'Instagram es excelente para mostrar trabajos terminados. Pero tiene tres techos que no podés romper desde la app:',
      '1) **No salís en Google.** Las búsquedas locales ("peluquería en Asunción", "corte de pelo cerca") las gana quien tiene un sitio bien optimizado. Instagram no compite ahí.',
      '2) **Los precios viven en DMs.** Cada cliente nuevo te escribe "¿cuánto sale el corte?" y vos contestás lo mismo veinte veces al día. Un sitio con precios visibles 24/7 te ahorra horas y filtra a quien no es tu cliente.',
      '3) **No podés hacer reservas.** Las clientas tienen que coordinar por mensaje. Pierden interés a mitad de conversación. Un botón de "reservar turno por WhatsApp" con tu agenda lista cierra muchas más reservas que ir y volver.',
      'No tenés que elegir entre Instagram y un sitio. Lo ideal es que se potencien: Instagram trae el descubrimiento visual, el sitio web cierra la venta y aparece en Google.',
      'En ParaguAI armamos sitios para peluquerías paraguayas en 48 horas, con WhatsApp Business, Google Maps y galería sincronizada. Si querés ver cómo se vería, mandanos un WhatsApp y armamos tu demo gratis.',
    ],
  },
] as const

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}
