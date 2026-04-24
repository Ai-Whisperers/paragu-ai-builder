/**
 * Paragu-AI — Create Prospect Intake Google Form
 *
 * HOW TO USE:
 *   1. Go to https://script.google.com → New project
 *   2. Replace all code with this file's contents
 *   3. Click Run (select function: createProspectForm)
 *   4. Authorize when prompted (first time only)
 *   5. Check execution log for the Form URL — open it and publish
 *
 * Response collection:
 *   - Responses arrive in the Form's "Responses" tab
 *   - Optionally link a Google Sheet (one click in the Forms UI)
 *   - Email notifications: enable in Forms UI → Responses → ⋮ → "Get email notifications"
 */

function createProspectForm() {
  const form = FormApp.create('Cuestionario para prospectos — Paragu-AI');

  form.setDescription(
    'Completalo en 15–25 minutos y te enviamos una propuesta con precio y timeline en 48 horas.\n\n' +
    'La mayoría de preguntas son marcar con ☐ — no hace falta escribir mucho. Si no sabés algo, dejá vacío o escribí "??".\n\n' +
    '¿Cómo funciona? Tenemos más de 110 plantillas listas por rubro. Si tu negocio encaja, el sitio sale en días. Si no encaja, lo construimos desde cero.\n\n' +
    'Cualquier duda: WhatsApp +595 981 324 569'
  );

  form.setCollectEmail(true);
  form.setShowLinkToRespondAgain(false);
  form.setProgressBar(true);
  form.setAllowResponseEdits(true);

  // ═══════════════════════════════════════════════════════
  // SECCIÓN 1 — Datos de contacto
  // ═══════════════════════════════════════════════════════
  form.addPageBreakItem()
    .setTitle('1. Datos de contacto')
    .setHelpText('Sobre quien está completando el formulario.');

  form.addTextItem().setTitle('Nombre completo').setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Tu rol en el negocio')
    .setChoiceValues(['Dueño/a', 'Socio/a', 'Gerente', 'Marketing', 'Otro'])
    .showOtherOption(true)
    .setRequired(true);

  form.addTextItem().setTitle('WhatsApp / celular (con +595)').setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('¿Quién firma / aprueba el gasto?')
    .setChoiceValues(['Yo mismo', 'Socio o pareja', 'Junta / comité', 'Otro'])
    .showOtherOption(true)
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('Mejor horario para llamarte (podés marcar varios)')
    .setChoiceValues(['Mañana (9–12)', 'Tarde (12–18)', 'Noche (18–21)', 'Fines de semana']);

  // ═══════════════════════════════════════════════════════
  // SECCIÓN 2 — Tu negocio
  // ═══════════════════════════════════════════════════════
  form.addPageBreakItem().setTitle('2. Tu negocio');

  form.addTextItem().setTitle('Nombre comercial (como te conocen)').setRequired(true);
  form.addTextItem().setTitle('Razón social (si difiere del nombre comercial)');

  form.addMultipleChoiceItem()
    .setTitle('Ciudad principal')
    .setChoiceValues(['Asunción', 'Ciudad del Este', 'Encarnación', 'Luque', 'San Lorenzo', 'Lambaré', 'Fernando de la Mora', 'Capiatá', 'Otra'])
    .showOtherOption(true)
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('¿Operan en otras ciudades?')
    .setHelpText('Dejar vacío si no. Sino listar: "Asunción, Ciudad del Este".');

  form.addTextItem().setTitle('Año de fundación');

  form.addMultipleChoiceItem()
    .setTitle('Cantidad de personas que trabajan ahí')
    .setChoiceValues(['Solo yo', '2–5', '6–15', '16–50', 'Más de 50'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Etapa del negocio')
    .setChoiceValues(['Idea / pre-apertura', 'Recién abrimos (menos de 1 año)', 'Operando (1–5 años)', 'Consolidado (más de 5 años)'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Rango de facturación mensual aproximado')
    .setChoiceValues(['Menos de Gs 10M', 'Gs 10–30M', 'Gs 30–100M', 'Gs 100–500M', 'Más de Gs 500M', 'Prefiero no decir'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('¿Ya tienen sitio web?')
    .setChoiceValues(['No, nunca tuvimos', 'Sí pero está viejo', 'Sí y funciona pero quiero otro', 'Solo Instagram / Facebook'])
    .setRequired(true);

  form.addTextItem().setTitle('URL del sitio actual (si hay)');

  form.addParagraphTextItem()
    .setTitle('¿Qué te gusta y qué no te gusta del sitio actual? (opcional)');

  // ═══════════════════════════════════════════════════════
  // SECCIÓN 3 — Rubro (matching contra nuestras 110 plantillas)
  // ═══════════════════════════════════════════════════════
  form.addPageBreakItem()
    .setTitle('3. Tu rubro')
    .setHelpText(
      'Buscá tu rubro y marcalo. Si no lo ves en ninguna categoría, saltá hasta el final y describilo en "Mi rubro no está en la lista".\n\n' +
      'Marcá solo UNO (el que más se acerca).'
    );

  form.addMultipleChoiceItem()
    .setTitle('Belleza, bienestar y fitness')
    .setChoiceValues([
      'Peluquería', 'Barbería', 'Manicuría / uñas', 'Estética facial', 'Depilación',
      'Depilación brasileña', 'Tatuajes', 'Piercings', 'Spa general', 'Spa facial',
      'Aromaterapia', 'Gimnasio', 'CrossFit', 'Entrenamiento funcional', 'Boxeo',
      'Yoga', 'Baile fitness', 'Artes marciales',
      'No, mi rubro no está acá'
    ])
    .setRequired(false);

  form.addMultipleChoiceItem()
    .setTitle('Oficios y servicios técnicos')
    .setChoiceValues([
      'Electricista', 'Plomero', 'Cerrajero', 'Carpintero', 'Albañil', 'Herrería',
      'Aire acondicionado', 'Handyman / servicios varios', 'Fumigación', 'Limpieza de hogar',
      'No, mi rubro no está acá'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Automotriz')
    .setChoiceValues([
      'Taller mecánico', 'Chapa y pintura', 'Detailing', 'Gomería', 'Audio para autos',
      'Frenos', 'Colisiones', 'Parabrisas', 'Cerrajería automotriz', 'Grúa / remolque',
      'No, mi rubro no está acá'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Portafolio / creativos')
    .setChoiceValues([
      'Diseño gráfico', 'Diseño web', 'Diseño de interiores', 'Branding',
      'Fotografía de bodas', 'Fotografía de eventos', 'Fotografía de producto',
      'Fotografía con drones', 'Ilustrador', 'Locutor', 'Traductor público',
      'No, mi rubro no está acá'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Profesionales')
    .setChoiceValues([
      'Abogado corporativo', 'Abogado de familia', 'Abogado penalista', 'Abogado migratorio',
      'Contador', 'Estudio contable', 'Auditoría', 'Despachante de aduana',
      'Agencia aduanera', 'Tasador', 'Asesor financiero', 'Corredor de seguros',
      'Consultora RRHH', 'Consultora TI', 'Consultora agro',
      'No, mi rubro no está acá'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Eventos')
    .setChoiceValues([
      'Catering', 'Catering empresarial', 'Salón de fiestas', 'Estancia para eventos',
      'Castillos inflables', 'Animación infantil', 'Payaso animador', 'Alquiler de trajes', 'DJ',
      'No, mi rubro no está acá'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Educación')
    .setChoiceValues([
      'Apoyo escolar', 'Academia de inglés', 'Academia de idiomas', 'Academia de cocina',
      'Escuela de música', 'Autoescuela', 'Coding bootcamp', 'Marketing digital', 'Clases de guitarra',
      'No, mi rubro no está acá'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Salud')
    .setChoiceValues([
      'Odontología', 'Dermatología', 'Ginecología', 'Geriatría', 'Quiropraxia',
      'Otorrinolaringología', 'Medicina familiar', 'Acupuntura', 'Fonoaudiología', 'Farmacia',
      'No, mi rubro no está acá'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Mascotas')
    .setChoiceValues([
      'Veterinaria', 'Peluquería canina', 'Adiestramiento canino', 'Paseador de perros', 'Pensionado canino',
      'No, mi rubro no está acá'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Gastronomía')
    .setChoiceValues([
      'Café / bistró', 'Hamburguesería', 'Heladería', 'Panadería artesanal', 'Food truck',
      'No, mi rubro no está acá'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Inmobiliario y hospedaje')
    .setChoiceValues([
      'Inmobiliaria', 'Corredor inmobiliario', 'Desarrollador inmobiliario', 'Alquiler temporario',
      'Hotel', 'Hotel boutique', 'Hostal', 'Agencia de viajes',
      'No, mi rubro no está acá'
    ]);

  form.addParagraphTextItem()
    .setTitle('Mi rubro no está en la lista — describilo')
    .setHelpText('Completar SOLO si ninguna categoría anterior aplica. Ej: "Venta de insumos veterinarios al por mayor". Si ya marcaste tu rubro arriba, saltá esta pregunta.');

  // ═══════════════════════════════════════════════════════
  // SECCIÓN 3.2 — Modelo de negocio
  // ═══════════════════════════════════════════════════════
  form.addSectionHeaderItem().setTitle('Cómo funciona tu negocio');

  form.addMultipleChoiceItem()
    .setTitle('¿Cómo cobrás principalmente?')
    .setChoiceValues(['Por servicio prestado', 'Por paquete / suscripción', 'Venta de productos', 'Mixto', 'Otro'])
    .showOtherOption(true)
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Ticket promedio por cliente')
    .setChoiceValues(['Menos de Gs 100k', 'Gs 100k–500k', 'Gs 500k–2M', 'Gs 2M–10M', 'Más de Gs 10M'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('¿Atendés presencial o a distancia?')
    .setChoiceValues(['Solo presencial', 'Solo remoto', 'Ambos', 'Presencial + delivery'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('¿Cuántos clientes atendés por mes (aprox)?')
    .setChoiceValues(['Menos de 10', '10–50', '50–200', '200–1000', 'Más de 1000']);

  form.addMultipleChoiceItem()
    .setTitle('¿B2B, B2C o los dos?')
    .setChoiceValues(['B2C (personas)', 'B2B (empresas)', 'Ambos']);

  // ═══════════════════════════════════════════════════════
  // SECCIÓN 4 — Objetivo del sitio
  // ═══════════════════════════════════════════════════════
  form.addPageBreakItem()
    .setTitle('4. Objetivo del sitio')
    .setHelpText('Este es el corazón del brief: determina cómo lo diseñamos.');

  form.addMultipleChoiceItem()
    .setTitle('Objetivo #1 del sitio — elegí SOLO uno (el más importante)')
    .setChoiceValues([
      'Recibir consultas — que me contacten por WhatsApp/formulario',
      'Agendar turnos — que los clientes reserven online',
      'Vender productos online — con pago y envío',
      'Mostrar catálogo — sin pago online, solo para que vean',
      'Proyectar autoridad / prestigio — sitio de marca',
      'Captar leads para proceso de ventas (consultoría, inmobiliario, relocación)',
      'Portafolio de trabajos — mostrar obras/diseños/casos',
      'Información y horarios — sitio simple de "estamos acá"',
      'Blog / contenido — posicionamiento SEO'
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('Objetivos secundarios (marcá los que apliquen)')
    .setChoiceValues([
      'Aparecer primero en Google para mi ciudad',
      'Tener una dirección digital profesional para compartir',
      'Reemplazar mensajes repetidos de WhatsApp con info del sitio',
      'Vender en otra ciudad / país',
      'Dar confianza a clientes nuevos antes de la primera compra',
      'Capturar emails para newsletter',
      'Medir cuántas personas se interesan y de dónde vienen',
      'Tener una tienda online sencilla'
    ])
    .showOtherOption(true);

  // ═══════════════════════════════════════════════════════
  // SECCIÓN 5 — Secciones y páginas
  // ═══════════════════════════════════════════════════════
  form.addPageBreakItem()
    .setTitle('5. Qué secciones y páginas querés')
    .setHelpText('Marcá TODAS las que apliquen.');

  form.addCheckboxItem()
    .setTitle('Básicas')
    .setChoiceValues([
      'Portada (Hero)',
      'Sobre nosotros / Quiénes somos',
      'Contacto',
      'WhatsApp botón flotante'
    ]);

  form.addCheckboxItem()
    .setTitle('Mostrar qué hacés')
    .setChoiceValues([
      'Servicios (listado)',
      'Catálogo de productos',
      'Paquetes / planes',
      'Precios visibles (si no, los escondemos detrás de "Consultar")',
      'Galería de fotos',
      'Portafolio / proyectos anteriores',
      'Antes/Después (comparativa)',
      'Menú (restaurantes/cafés)',
      'Ubicación + Google Maps',
      'Horarios de atención'
    ]);

  form.addCheckboxItem()
    .setTitle('Confianza')
    .setChoiceValues([
      'Testimonios de clientes',
      'Equipo / profesionales',
      'Certificaciones / premios',
      'Logos de clientes (B2B)',
      'Preguntas frecuentes (FAQ)',
      'Proceso / "cómo trabajamos"'
    ]);

  form.addCheckboxItem()
    .setTitle('Acción / conversión')
    .setChoiceValues([
      'Formulario de contacto',
      'Reserva online de turnos',
      'Cotizador / solicitud de presupuesto',
      'Botón "Agendar en Calendly"',
      'Carrito de compras',
      'Newsletter (suscribirse)'
    ]);

  form.addCheckboxItem()
    .setTitle('Contenido')
    .setChoiceValues([
      'Blog / noticias',
      'Casos de éxito',
      'Recursos descargables (PDF, guías)'
    ]);

  form.addCheckboxItem()
    .setTitle('Legal')
    .setChoiceValues([
      'Política de privacidad',
      'Términos y condiciones',
      'Política de devoluciones (si venden)'
    ]);

  form.addParagraphTextItem()
    .setTitle('Otras secciones / páginas que querés (libre)');

  // ═══════════════════════════════════════════════════════
  // SECCIÓN 6 — Funcionalidades
  // ═══════════════════════════════════════════════════════
  form.addPageBreakItem().setTitle('6. Funcionalidades');

  form.addMultipleChoiceItem()
    .setTitle('Reservas online')
    .setChoiceValues([
      'No necesito',
      'Sí — con Calendly (ya tengo cuenta)',
      'Sí — con calendario propio en el sitio (costo extra)',
      'Sí — solo botón "Reservar por WhatsApp" (lo más simple)'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('E-commerce / venta online')
    .setChoiceValues([
      'No vendo online',
      'Catálogo con botón "Pedir por WhatsApp" (sin carrito)',
      'Carrito + pago online (Pagopar / transferencia)',
      'Suscripción recurrente (cobro mensual)'
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('WhatsApp')
    .setChoiceValues([
      'Botón flotante con mi número',
      'Mensaje pre-escrito cuando hacen click',
      'WhatsApp Business Catalog ya configurado',
      'No quiero botón de WhatsApp'
    ]);

  form.addTextItem()
    .setTitle('Si marcaste "mensaje pre-escrito" — ¿cuál?')
    .setHelpText('Ej: "Hola, vi su sitio y quería consultar sobre…"');

  form.addCheckboxItem()
    .setTitle('Campos del formulario de contacto')
    .setChoiceValues([
      'Nombre', 'Email', 'Teléfono / WhatsApp', 'Ciudad',
      'Servicio de interés (lista desplegable)', 'Mensaje libre',
      'Presupuesto', '¿Cómo nos conociste?', 'Checkbox de consentimiento legal'
    ])
    .showOtherOption(true);

  form.addMultipleChoiceItem()
    .setTitle('Búsqueda de propiedades / productos con filtros')
    .setChoiceValues([
      'No aplica',
      'Sí — filtros por precio',
      'Sí — filtros por ubicación',
      'Sí — filtros por categoría',
      'Sí — filtros múltiples (lo describo abajo)'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Multi-idioma')
    .setChoiceValues([
      'Solo español',
      'Español + inglés',
      'Español + portugués',
      'Español + inglés + portugués',
      'Otro (describir abajo)'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Blog / contenido editorial')
    .setChoiceValues([
      'No quiero blog',
      'Sí, pero lo llenaremos después (solo dejen la sección armada)',
      'Sí, tengo artículos ya escritos',
      'Sí, necesito que ustedes los redacten (costo extra)'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Newsletter')
    .setChoiceValues([
      'No',
      'Sí — con Mailchimp (ya tengo cuenta)',
      'Sí — necesito que lo armen'
    ]);

  form.addParagraphTextItem()
    .setTitle('Otras funcionalidades específicas')
    .setHelpText('Ej: calculadora de hipotecas, cotizador automático, área de socios, selector de profesionales, comparador, etc.');

  // ═══════════════════════════════════════════════════════
  // SECCIÓN 7 — Contenido disponible
  // ═══════════════════════════════════════════════════════
  form.addPageBreakItem()
    .setTitle('7. Qué contenido ya tenés')
    .setHelpText('Sinceridad total — esto nos permite darte un presupuesto realista.');

  form.addMultipleChoiceItem()
    .setTitle('Logo')
    .setChoiceValues([
      'Sí, tengo archivo SVG',
      'Sí, tengo PNG de buena calidad',
      'Solo tengo una foto / captura del logo',
      'No tengo logo'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Paleta de colores')
    .setChoiceValues([
      'Sí, tengo los códigos hex',
      'Sé cuáles son pero no los códigos',
      'No tengo — elijan ustedes'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Manual de marca / brand guidelines')
    .setChoiceValues(['Sí — lo adjunto', 'No']);

  form.addMultipleChoiceItem()
    .setTitle('Fotos profesionales del lugar / trabajo')
    .setChoiceValues([
      'Más de 20 fotos listas',
      '10–20 fotos',
      'Menos de 10 fotos',
      'Solo fotos de celular',
      'Nada'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Fotos del equipo')
    .setChoiceValues(['Sí, una por persona', 'Solo algunas', 'Nada', 'No mostraremos equipo']);

  form.addMultipleChoiceItem()
    .setTitle('Textos y descripciones de servicios')
    .setChoiceValues([
      'Todos redactados',
      'Notas sueltas',
      'Nada — necesito que redacten'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Testimonios reales de clientes')
    .setChoiceValues(['Tengo 5 o más', 'Tengo 2–4', 'Tengo 1', 'Ninguno']);

  form.addMultipleChoiceItem()
    .setTitle('Video institucional / de presentación')
    .setChoiceValues(['Sí (link abajo)', 'No']);

  form.addTextItem().setTitle('Link al video (si aplica)');

  form.addMultipleChoiceItem()
    .setTitle('Precios listos para publicar')
    .setChoiceValues([
      'Sí',
      'Parcial',
      'No quiero mostrarlos',
      'No los tengo definidos aún'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('FAQ — Preguntas frecuentes con respuestas')
    .setChoiceValues(['Sí, tengo 10 o más', 'Tengo algunas', 'Nada']);

  form.addSectionHeaderItem().setTitle('Si te falta contenido, ¿qué preferís?');

  form.addMultipleChoiceItem()
    .setTitle('Si no tenés fotos suficientes')
    .setChoiceValues([
      'Contrato sesión fotográfica profesional (recomendado — Gs 800k–2M)',
      'Usan imágenes de IA / bancos de imágenes (económico)',
      'Empiezo sin fotos y las agrego después',
      'No sé — sugieran ustedes'
    ]);

  form.addMultipleChoiceItem()
    .setTitle('Si no tenés textos redactados')
    .setChoiceValues([
      'Los redactan ustedes (costo extra — Gs 30k–80k por página)',
      'Me dan cuestionario, yo respondo y ustedes lo puliráis',
      'Uso los textos de la plantilla y ajusto después',
      'Genero textos con IA y ustedes pulen'
    ]);

  // ═══════════════════════════════════════════════════════
  // SECCIÓN 8 — Herramientas y plataformas
  // ═══════════════════════════════════════════════════════
  form.addPageBreakItem().setTitle('8. Herramientas y plataformas actuales');

  form.addSectionHeaderItem().setTitle('Presencia en redes');

  form.addTextItem().setTitle('Instagram (usuario o URL) — dejar vacío si no tenés');
  form.addTextItem().setTitle('Facebook (usuario o URL)');
  form.addTextItem().setTitle('TikTok');
  form.addTextItem().setTitle('LinkedIn empresa');
  form.addTextItem().setTitle('YouTube');

  form.addMultipleChoiceItem()
    .setTitle('WhatsApp Business con catálogo')
    .setChoiceValues(['No', 'Sí']);

  form.addMultipleChoiceItem()
    .setTitle('Google Business Profile (mapa de Google)')
    .setChoiceValues(['No tengo', 'Sí, configurado', 'Sí pero incompleto']);

  form.addSectionHeaderItem().setTitle('Herramientas que usás');

  form.addMultipleChoiceItem()
    .setTitle('CRM (gestión de clientes)')
    .setChoiceValues(['No uso', 'HubSpot', 'Pipedrive', 'Zoho', 'Notion', 'Planilla de Excel', 'Otro'])
    .showOtherOption(true);

  form.addMultipleChoiceItem()
    .setTitle('Email marketing')
    .setChoiceValues(['No uso', 'Mailchimp', 'Resend', 'Sendinblue', 'Otro'])
    .showOtherOption(true);

  form.addMultipleChoiceItem()
    .setTitle('Reservas / agenda')
    .setChoiceValues(['No uso', 'Calendly', 'Google Calendar', 'Agenda en papel', 'Otro'])
    .showOtherOption(true);

  form.addCheckboxItem()
    .setTitle('Métodos de cobro que usás hoy')
    .setChoiceValues([
      'No cobro online',
      'Pagopar',
      'Bancard (POS físico)',
      'Tigo Money',
      'PayPal',
      'Transferencia bancaria',
      'Efectivo',
      'Stripe'
    ])
    .showOtherOption(true);

  form.addCheckboxItem()
    .setTitle('Analytics')
    .setChoiceValues(['No tengo', 'Google Analytics', 'Meta Pixel', 'Otro']);

  form.addMultipleChoiceItem()
    .setTitle('Facturación electrónica')
    .setChoiceValues([
      'No emito factura',
      'SET-SIFEN directo',
      'Sistema propio / integrador',
      'Otro'
    ])
    .showOtherOption(true);

  // ═══════════════════════════════════════════════════════
  // SECCIÓN 9 — Dominio y correo
  // ═══════════════════════════════════════════════════════
  form.addPageBreakItem().setTitle('9. Dominio y correo');

  form.addMultipleChoiceItem()
    .setTitle('¿Tenés dominio registrado?')
    .setChoiceValues([
      'Sí — lo pongo abajo',
      'No, pero quiero uno nuevo (lo pongo abajo)',
      'No, déjenme usar paragu-ai.com/minegocio'
    ])
    .setRequired(true);

  form.addTextItem().setTitle('Si tenés o querés un dominio: ¿cuál?');

  form.addMultipleChoiceItem()
    .setTitle('Si tenés dominio — ¿dónde lo compraste?')
    .setChoiceValues(['NIC.py', 'GoDaddy', 'Namecheap', 'Hostinger', 'No me acuerdo', 'Otro', 'No aplica'])
    .showOtherOption(true);

  form.addMultipleChoiceItem()
    .setTitle('¿Querés que manejemos el DNS por vos?')
    .setChoiceValues(['Sí (recomendado — lo movemos a Cloudflare)', 'No, yo lo manejo']);

  form.addMultipleChoiceItem()
    .setTitle('¿Tenés email profesional con tu dominio?')
    .setChoiceValues([
      'Sí (ej: contacto@minegocio.com.py)',
      'No, uso Gmail/Hotmail personal',
      'Quiero que lo configuren'
    ]);

  // ═══════════════════════════════════════════════════════
  // SECCIÓN 10 — Pagos online
  // ═══════════════════════════════════════════════════════
  form.addPageBreakItem()
    .setTitle('10. Pagos online (saltar si no vendés online)')
    .setHelpText('Solo completar si en sección 6 marcaste "Vendo online".');

  form.addMultipleChoiceItem()
    .setTitle('¿Tenés cuenta Pagopar?')
    .setChoiceValues(['Sí', 'No', '¿Qué es Pagopar?', 'No aplica, no vendo online']);

  form.addMultipleChoiceItem()
    .setTitle('¿Tenés Bancard / POS?')
    .setChoiceValues(['Sí', 'No', 'No aplica']);

  form.addMultipleChoiceItem()
    .setTitle('¿Tenés Stripe (para cobros USD)?')
    .setChoiceValues(['Sí', 'No', 'No vendo al exterior', 'No aplica']);

  form.addMultipleChoiceItem()
    .setTitle('¿Aceptás cuotas sin interés?')
    .setChoiceValues(['No', 'Sí, hasta 3 cuotas', 'Sí, hasta 6 cuotas', 'Sí, hasta 12 cuotas', 'No aplica']);

  form.addMultipleChoiceItem()
    .setTitle('¿Aceptás transferencia bancaria?')
    .setChoiceValues(['Sí', 'No', 'No aplica']);

  form.addMultipleChoiceItem()
    .setTitle('Política de devolución')
    .setChoiceValues(['No devolvemos', 'Hasta 7 días', 'Hasta 15 días', 'Hasta 30 días', 'Caso por caso', 'No aplica']);

  // ═══════════════════════════════════════════════════════
  // SECCIÓN 11 — Legal y fiscal
  // ═══════════════════════════════════════════════════════
  form.addPageBreakItem().setTitle('11. Legal y fiscal');

  form.addMultipleChoiceItem()
    .setTitle('Tipo de persona / sociedad')
    .setChoiceValues([
      'Persona física (unipersonal)',
      'E.I.R.L.',
      'S.A.',
      'S.R.L.',
      'Sin formalizar todavía',
      'Otra'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addTextItem().setTitle('RUC (si lo tenés)');
  form.addTextItem().setTitle('Nombre legal (como aparece en facturas)');

  form.addMultipleChoiceItem()
    .setTitle('¿Tenés Timbrado vigente?')
    .setChoiceValues(['Sí', 'No', '¿Qué es eso?', 'No aplica']);

  form.addMultipleChoiceItem()
    .setTitle('¿Tenés política de privacidad?')
    .setChoiceValues(['Sí', 'No, usen plantilla', '¿Qué es?']);

  form.addMultipleChoiceItem()
    .setTitle('¿Tenés Términos y Condiciones propios?')
    .setChoiceValues(['Sí', 'No, usen plantilla']);

  form.addMultipleChoiceItem()
    .setTitle('¿Tenés clientes en la Unión Europea?')
    .setChoiceValues(['No', 'Sí (activamos cookies GDPR)']);

  form.addCheckboxItem()
    .setTitle('Rubros con regulación específica — marcá si APLICA a tu negocio')
    .setChoiceValues([
      'Vendo comida/bebida (requiere disclaimer, opcionalmente INAN)',
      'Soy profesional de salud (disclaimer "no reemplaza consulta médica")',
      'Atiendo menores de edad (consentimiento parental)',
      'Manejo datos sensibles (salud, biometría, orientación)',
      'Ofrezco servicios financieros / inversión (SEPRELAD/AML)',
      'Soy abogado (código de ética restringe publicidad)',
      'Vendo contenido / servicios +18 (age gate)',
      'Ninguno de los anteriores aplica'
    ]);

  // ═══════════════════════════════════════════════════════
  // SECCIÓN 12 — Timeline y presupuesto
  // ═══════════════════════════════════════════════════════
  form.addPageBreakItem().setTitle('12. Timeline y presupuesto');

  form.addMultipleChoiceItem()
    .setTitle('¿Cuándo querés lanzar?')
    .setChoiceValues([
      'Lo antes posible — ya tengo todo listo',
      'En 2–3 semanas — estoy juntando contenido',
      'Este mes — sin apuro pero sin mucho tiempo',
      'En 1–3 meses — planificando',
      'Flexible — cuando esté perfecto'
    ])
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('¿Hay una fecha límite dura?')
    .setHelpText('Evento, campaña, apertura, etc. Dejar vacío si no aplica.');

  form.addMultipleChoiceItem()
    .setTitle('Presupuesto (rangos orientativos)')
    .setChoiceValues([
      'Menos de Gs 500k — básico, subdominio, plantilla como está',
      'Gs 650k — Starter — plantilla + contenido personalizado + subdominio',
      'Gs 1.200k — Pro — dominio propio + personalización mediana + integración básica',
      'Gs 2M+ — Premium — alta personalización + funcionalidades extra + soporte',
      'Gs 5M+ — Custom — construcción desde cero',
      'A definir — que me propongan según lo que necesito'
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('Modalidad de pago preferida')
    .setChoiceValues([
      'Pago único (todo junto)',
      '50% al comenzar + 50% al entregar',
      'Cuotas',
      'Mantenimiento mensual luego del lanzamiento'
    ]);

  form.addCheckboxItem()
    .setTitle('Post-lanzamiento')
    .setChoiceValues([
      'Solo quiero lanzar, después veo',
      'Quiero mantenimiento mensual (actualizaciones, backups, soporte)',
      'Quiero panel admin para cargar contenido yo mismo',
      'Quiero que ustedes actualicen el sitio periódicamente'
    ]);

  // ═══════════════════════════════════════════════════════
  // SECCIÓN 13 — Observaciones libres
  // ═══════════════════════════════════════════════════════
  form.addPageBreakItem().setTitle('13. Observaciones finales');

  form.addParagraphTextItem()
    .setTitle('Sitios que te gustan — listá 2–3 URLs y qué te gusta de cada uno')
    .setHelpText('No importa el rubro. Nos sirve para entender la estética que buscás.');

  form.addParagraphTextItem()
    .setTitle('Sitios que NO te gustan (opcional)');

  form.addParagraphTextItem()
    .setTitle('Preocupaciones / miedos sobre este proyecto')
    .setHelpText('Demora, costo, complejidad técnica, que se rompa, que no te guste el resultado, etc. Cualquier cosa que te inquiete.');

  form.addParagraphTextItem()
    .setTitle('¿Algo más que no te preguntamos y querés contarnos?');

  // ═══════════════════════════════════════════════════════
  // SECCIÓN 14 — Cierre
  // ═══════════════════════════════════════════════════════
  form.addPageBreakItem()
    .setTitle('¡Listo! Gracias por completar el cuestionario.')
    .setHelpText(
      'Próximos pasos:\n\n' +
      '1. Recibimos tu respuesta\n' +
      '2. En 48 horas hábiles te enviamos propuesta con plantilla recomendada (o "custom"), alcance, precio fijo y timeline\n' +
      '3. Si te gusta, firmamos y arrancamos\n' +
      '4. Si no, te devolvemos feedback gratis y listo\n\n' +
      'Cualquier duda: WhatsApp +595 981 324 569 · weissvanderpol.ivan@gmail.com'
    );

  // ═══════════════════════════════════════════════════════
  // Log URLs
  // ═══════════════════════════════════════════════════════
  const formUrl = form.getPublishedUrl();
  const editUrl = form.getEditUrl();

  Logger.log('═══════════════════════════════════════════════════════');
  Logger.log('✅ FORM CREATED');
  Logger.log('═══════════════════════════════════════════════════════');
  Logger.log('Public link (share with clients): ' + formUrl);
  Logger.log('Edit link (your admin view):       ' + editUrl);
  Logger.log('═══════════════════════════════════════════════════════');
  Logger.log('TIP: In Forms UI → Responses tab → click Sheets icon to link a Google Sheet for easier processing.');

  return { formUrl, editUrl };
}
