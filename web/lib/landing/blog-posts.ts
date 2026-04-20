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
    slug: 'gimnasio-leads-sitio-web-paraguay',
    title: 'Tu gimnasio pierde leads cada noche que no tiene web',
    excerpt:
      'En Paraguay hay 1.087 gimnasios mapeados y el 72% no tiene sitio web. Quien sí tiene captura los leads que buscan a las 11pm — cuando ningún recepcionista contesta.',
    date: '2026-04-22',
    author: 'Equipo ParaguAI',
    readingTime: '5 min',
    tag: 'vertical:gimnasio',
    body: [
      'La decisión de empezar a entrenar casi nunca se toma a las 9 de la mañana. Se toma a las 10:30 de la noche, después de un día largo, cuando alguien busca "gimnasio cerca abierto mañana" en Google.',
      'A esa hora, tu recepción está cerrada. Tu Instagram tiene fotos lindas pero ningún botón claro de "probá una clase gratis". El competidor que sí tiene un sitio con horarios + plan de prueba + WhatsApp se lleva esa decisión.',
      '**Tres cosas que un sitio de gimnasio bien armado resuelve hoy mismo:**',
      '1) **Horarios visibles 24/7.** El 80% de las consultas que recibe tu mostrador son "¿hasta qué hora abren?" y "¿hay clases los sábados?". Esas respuestas no deberían depender de quién esté de turno. Una página de horarios responde por vos.',
      '2) **Plan de prueba con un clic.** "Reservá tu clase gratis" → formulario → mensaje a tu WhatsApp. Sin formularios largos, sin teléfono que nadie atiende. La fricción es el enemigo de la conversión.',
      '3) **Membresías claras.** Si tus precios viven en una imagen de Instagram, perdés a quien evalúa varios gimnasios al mismo tiempo. Una tabla de planes ahorra horas de mensajes "¿cuánto sale?" y filtra a quien no es tu cliente ideal.',
      'No estamos diciendo que abandones Instagram — al contrario. Pero Instagram es la vidriera; el sitio es donde se cierra la venta.',
      'En ParaguAI armamos sitios para gimnasios paraguayos en 48 horas, con horarios sincronizados, sistema de reservas y botón de WhatsApp Business. Si querés ver una demo de cómo se vería el tuyo, mandanos un mensaje.',
    ],
  },
  {
    slug: 'restaurante-menu-online-paraguay',
    title: 'Por qué tu restaurante necesita un menú online (no solo en Instagram)',
    excerpt:
      'Cuando alguien busca dónde cenar esta noche, mira menú y precios primero. Si los tuyos no están a un clic, ya perdiste la mesa. Acá el porqué y cómo armarlo bien.',
    date: '2026-04-23',
    author: 'Equipo ParaguAI',
    readingTime: '5 min',
    tag: 'vertical:restaurante',
    body: [
      'El comportamiento es el mismo en Asunción, San Lorenzo o Encarnación: alguien decide salir a comer, abre el celular y busca "restaurante italiano cerca" o "menú [nombre del lugar]". Mira fotos, mira precios, decide.',
      'Si tus precios están en una historia de Instagram que ya caducó, o en una foto pixelada de hace tres meses, el cliente cierra y va al siguiente.',
      '**Lo que un menú online bien hecho te da:**',
      '1) **Aparece en Google.** Las búsquedas locales de comida son enormes. Sin sitio, no apareces. Con sitio + Google Maps + reseñas, sí.',
      '2) **Reservas sin llamar.** El 60% de las personas menores de 35 prefiere reservar por WhatsApp o un formulario antes que llamar. Si no se lo ofreces, eligen al competidor que sí.',
      '3) **Menú actualizable sin Photoshop.** Cambiás un precio, agregás un plato del día, sacás algo que ya no servís — todo desde el celular en un minuto, no diseñando una imagen nueva cada vez.',
      '4) **Delivery por tu canal.** Si vendés todo solo por PedidosYa, perdés 25-30% de comisión. Un sitio con pedido por WhatsApp directo te deja toda la ganancia y la relación con el cliente.',
      'En ParaguAI armamos sitios para restaurantes con menú actualizable, galería del local, reservas por WhatsApp y botón de pedido para delivery propio. Demo gratis antes de pagar.',
    ],
  },
  {
    slug: 'spa-presencia-web-conversion',
    title: 'Tu spa vende experiencia — tu web tiene que transmitirla en 5 segundos',
    excerpt:
      'Un spa no se elige por precio: se elige por cómo te hace sentir antes de entrar. Si tu sitio no transmite calma y profesionalismo en los primeros segundos, la persona se va.',
    date: '2026-04-24',
    author: 'Equipo ParaguAI',
    readingTime: '4 min',
    tag: 'vertical:spa',
    body: [
      'En el rubro spa & wellness, lo que vendés es una promesa de experiencia. Y la primera experiencia con tu marca pasa cuando alguien aterriza en tu sitio.',
      'Si tu web tiene fotos pixeladas, textos que parecen de otra época y un menú confuso, la persona infiere que la experiencia presencial será igual. Decisión cerrada en 5 segundos.',
      '**Tres principios que transforman la conversión de un sitio de spa:**',
      '1) **Una imagen grande, una promesa clara.** Hero con foto del espacio o de un tratamiento, una frase que diga qué hacés (no "bienvenidos") y un solo botón principal: reservar tratamiento.',
      '2) **Paquetes claros y memorables.** Las personas no compran "servicios sueltos" en spa, compran experiencias. "Día de spa para dos · 3 horas · Gs X" convierte mejor que listar 18 tratamientos individuales.',
      '3) **Reserva por WhatsApp con anticipo.** El "no shows" es el dolor más caro de un spa. Una reserva con seña por Mercado Pago + confirmación por WhatsApp Business reduce no shows a casi cero.',
      'En ParaguAI armamos sitios para spas con diseño premium, paquetes destacados, galería del espacio y reservas con seña. Si querés ver cómo quedaría el tuyo, pedinos la demo.',
    ],
  },
  {
    slug: 'barberia-turnos-online-whatsapp',
    title: 'Por qué tu barbería pierde clientes nuevos cada semana (y cómo arreglarlo)',
    excerpt:
      'Las barberías son negocio de recurrencia. Pero el cliente nuevo es el que paga la inversión. Si no te encuentran fácil online, no te encuentran nunca.',
    date: '2026-04-25',
    author: 'Equipo ParaguAI',
    readingTime: '4 min',
    tag: 'vertical:barberia',
    body: [
      'Una barbería bien manejada funciona con 70% de clientes recurrentes. Pero el 30% nuevo es el que paga la renovación de equipos, el cartel, las inversiones del año.',
      'Y ese 30% se gana o se pierde online — específicamente, en los primeros 10 segundos después de que alguien busca "barbería [tu zona]" en Google.',
      '**Lo que define que el nuevo te elija a vos y no al de enfrente:**',
      '1) **Aparecer en el mapa.** Sitio + Google Business Profile + reseñas. Sin esto, no existís en la búsqueda local.',
      '2) **Mostrar tu trabajo.** Galería de cortes (no genéricas, los tuyos) en formato grande. Es lo primero que mira alguien que evalúa.',
      '3) **Turnos por WhatsApp con un clic.** "Pedir turno" → mensaje pre-armado a tu WhatsApp con los datos básicos. No formularios, no llamadas, no "¿a qué hora estás libre?" cinco veces.',
      '4) **Lista de precios visible.** Quien no ve precio, no escribe. Listar "corte clásico Gs X · barba Gs Y · combo Gs Z" filtra a quien no es tu cliente y le da seguridad al que sí.',
      'En ParaguAI armamos sitios para barberías paraguayas con galería sincronizada con Instagram, lista de precios por servicio y reservas por WhatsApp. Demo gratis antes de pagar.',
    ],
  },
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
