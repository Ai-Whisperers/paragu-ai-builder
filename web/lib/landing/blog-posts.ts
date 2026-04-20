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
    slug: 'salon-uñas-instagram-vs-sitio-web',
    title: 'Tu salón de uñas en Instagram: vidriera linda, agenda incompleta',
    excerpt:
      'Instagram muestra tus diseños — eso lo hace bien. Pero la conversión de "me encantó" a "reserva confirmada" se pierde en cada DM que llega un sábado a la noche.',
    date: '2026-04-26',
    author: 'Equipo ParaguAI',
    readingTime: '4 min',
    tag: 'vertical:unas',
    body: [
      'En Paraguay hay 488 salones de uñas mapeados, y el 75% no tiene sitio web propio. Toda la operación pasa por DMs de Instagram, donde la atención humana es un cuello de botella.',
      'El problema no es Instagram — es que **toda la conversión depende de que vos contestes en tiempo real**. Si una clienta nueva manda un DM un sábado a las 11 de la noche queriendo reservar para el lunes, y vos respondés el domingo a la tarde, la mitad de las veces ya reservó en otro lado.',
      '**Tres cosas que un sitio web bien armado para salón de uñas resuelve sin que muevas un dedo:**',
      '1) **Catálogo de diseños navegable.** En Instagram tus mejores trabajos están perdidos en un grid de 6 meses. Una galería filtrable por estilo (acrílico, gel, decorado) deja a la clienta encontrar exactamente lo que quiere en 30 segundos.',
      '2) **Precios y duración por tipo.** Las preguntas más comunes son "¿cuánto sale?" y "¿cuánto tarda?". Si están en una imagen perdida en historias, las clientas escriben para preguntar — y no todas esperan respuesta. Visibles en el sitio: filtro automático.',
      '3) **Reserva con seña por Mercado Pago.** El "no show" en uñas es brutal: una clienta que no aparece son 90 minutos perdidos. Una reserva con seña reduce no-shows a casi cero y filtra a las clientas serias.',
      'Instagram sigue siendo tu vidriera. El sitio es el mostrador atendido 24/7.',
      'En ParaguAI armamos sitios para salones de uñas con galería sincronizada, precios claros y reservas con seña. Demo gratis antes de pagar.',
    ],
  },
  {
    slug: 'estudio-tatuajes-portfolio-web-paraguay',
    title: 'Tu estudio de tatuajes vende confianza, no solo arte',
    excerpt:
      'Un tatuaje es una decisión de por vida. Quien te elige no busca solo buen arte — busca confianza. Tu sitio web es lo primero que valida (o destruye) esa confianza.',
    date: '2026-04-27',
    author: 'Equipo ParaguAI',
    readingTime: '5 min',
    tag: 'vertical:tatuajes',
    body: [
      'En el rubro tatuajes, la decisión de cliente nuevo casi nunca es impulsiva. La persona busca, compara, lee reseñas, ve portfolios — y termina eligiendo al estudio que le transmite más profesionalismo y confianza.',
      'Si el único lugar donde te puede investigar es Instagram, tenés un problema: **Instagram muestra el arte pero no el estudio**. No muestra cómo trabajás, qué materiales usás, qué cuidado pre y post tenés, ni quiénes son tus artistas.',
      '**Lo que un sitio bien armado de estudio de tatuajes comunica que Instagram no puede:**',
      '1) **Portfolio por artista.** Cada tatuador tiene su estilo. Una página por artista con sus mejores trabajos, su especialidad y su Instagram personal le permite a la clienta elegir con quién quiere trabajar antes de escribir.',
      '2) **Proceso de trabajo.** "Cómo trabajamos": consulta gratuita → diseño personalizado → fecha → sesión → cuidados post. Esto baja la ansiedad de quien nunca se tatuó y diferencia de los estudios improvisados.',
      '3) **Higiene y materiales.** Mostrar autoclave, agujas selladas, productos profesionales — esto es lo que las personas con experiencia buscan y muchos estudios no comunican. Un sitio te deja explicar.',
      '4) **Agendamiento de consulta gratuita.** Ningún tatuaje serio se cierra por DM. La consulta presencial es el primer paso real. Un botón "agendar consulta" con calendario o WhatsApp baja la fricción de ese primer contacto.',
      'En ParaguAI armamos sitios para estudios de tatuajes con portfolio por artista, proceso de trabajo claro y agendamiento de consulta. Si querés ver cómo se vería el tuyo, mandanos un mensaje.',
    ],
  },
  {
    slug: 'centro-estetica-conversion-web',
    title: 'Por qué tu centro de estética convierte poco aunque hacés excelente trabajo',
    excerpt:
      'Hacés tratamientos de calidad y tus clientas vuelven. Pero atraer clientas nuevas cuesta cada vez más. La razón no es tu trabajo — es cómo te encuentran.',
    date: '2026-04-28',
    author: 'Equipo ParaguAI',
    readingTime: '5 min',
    tag: 'vertical:estetica',
    body: [
      'En estética facial el negocio funciona por recurrencia: una vez que confían en vos, las clientas vuelven cada 3-4 semanas. El problema es que cada año perdés un porcentaje de clientas (mudanzas, cambio de hábitos), y reemplazarlas requiere conseguir clientas nuevas.',
      'Y conseguir clientas nuevas en estética hoy es 100% digital: alguien busca "limpieza facial profunda Asunción" en Google, mira las primeras 3-5 opciones, lee reseñas, decide.',
      '**Si tu centro no aparece en esa búsqueda, no existís para esas clientas. Punto.**',
      'Lo que pasa en muchos centros de estética paraguayos:',
      '- El sitio web no existe (137 centros mapeados, 77% sin web).',
      '- El Google Business Profile está sin foto y sin reseñas.',
      '- Los precios son un secreto guardado hasta que la clienta escribe (y muchas no escriben).',
      '**Lo que un sitio bien hecho cambia:**',
      '1) **Aparecés en las búsquedas locales.** Sitio + GBP optimizado + Schema.org te pone en el mapa, literalmente.',
      '2) **Cada tratamiento explicado.** Una clienta que entiende qué le vas a hacer, cuánto dura, qué resultado esperar y cuánto cuesta llega más lista a la primera sesión.',
      '3) **Antes y después en grilla, no en stories perdidas.** El "antes y después" es la prueba social más fuerte en estética. Un sitio te deja organizarlo por tratamiento.',
      '4) **Reservas online sin llamar.** Las menores de 35 ya casi no llaman para reservar. Si no le ofreces WhatsApp directo o booking, eligen al competidor que sí.',
      'En ParaguAI armamos sitios para centros de estética con tratamientos explicados, antes/después por servicio y reservas por WhatsApp. Demo gratis antes de pagar.',
    ],
  },
  {
    slug: 'salon-belleza-multiservicio-web',
    title: 'Salón de belleza multiservicio: por qué un sitio web te ordena el caos',
    excerpt:
      'Cortes, coloración, manicura, depilación, tratamientos faciales — ofrecés tantos servicios que tus clientas no saben todo lo que hacés. Un sitio bien armado deja claro qué hacés y para quién.',
    date: '2026-04-29',
    author: 'Equipo ParaguAI',
    readingTime: '5 min',
    tag: 'vertical:salon_belleza',
    body: [
      'Los salones de belleza multiservicio tienen un problema que un sitio web resuelve sin pelea: **la mayoría de las clientas conocen solo una fracción de lo que ofrecés**.',
      'Una clienta viene hace 3 años a hacerse las uñas. No tiene idea de que también hacés alisado capilar, depilación con cera, o tratamientos faciales. Le mostraste todo en cartelitos del salón pero ya los aprendió a no mirar.',
      'Resultado: estás dejando ingreso recurrente sobre la mesa con clientas que ya confían en vos.',
      '**Tres formas en que un sitio bien armado captura ese ingreso:**',
      '1) **Servicios organizados por categoría.** Cabello / uñas / depilación / facial — una clienta que vino solo por uñas descubre en 30 segundos que también hacés depilación, y reserva ahí mismo.',
      '2) **Paquetes combinados.** "Día completo: corte + manicura + depilación piernas Gs X" convierte mucho mejor que mostrar 25 servicios sueltos. Y aumenta el ticket promedio.',
      '3) **Equipo y especialidades.** Si tenés a alguien que es especialista en color o en pestañas, mostrarlo con su nombre y sus trabajos genera demanda específica por esa persona.',
      'Hay 1.210 salones de belleza mapeados en Paraguay y el 75% no tiene web. La mayoría de los DMs que reciben son "¿hacen X?" — preguntas que un sitio responde solo.',
      'En ParaguAI armamos sitios para salones de belleza con servicios organizados, paquetes destacados y equipo presentado. Demo gratis antes de pagar.',
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
