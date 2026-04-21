#!/usr/bin/env node
/**
 * One-shot script: add `altByLocale` to every on-site image in
 * Nexa Paraguay's images.json. Off-site buckets (ads, email, social,
 * press) stay English-only since they're never rendered on-site.
 *
 * The seed translations below are hand-written and cover the 63
 * on-site assets currently shipped. Re-running the script is safe —
 * it preserves existing altByLocale objects and only fills missing
 * locales.
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const MANIFEST_PATH = path.resolve(
  __dirname,
  '../../sites/nexa-paraguay/images.json',
)

type Locale = 'nl' | 'en' | 'de' | 'es'

/**
 * altByLocale overrides per bucket.assetName. Each entry must have all
 * 4 locales Nexa ships. The default English `alt` in images.json stays
 * as the fallback.
 */
const LOCALIZED_ALTS: Record<string, Record<Locale, string>> = {
  // Hero bucket — on home + landing pages
  'hero.home': {
    en: 'Asunción Paraguay skyline at golden hour',
    es: 'Silueta de Asunción, Paraguay, al atardecer',
    nl: 'Skyline van Asunción, Paraguay, bij gouden uur',
    de: 'Skyline von Asunción, Paraguay, zur goldenen Stunde',
  },
  'hero.homeMobile': {
    en: 'Asunción Paraguay skyline (mobile portrait)',
    es: 'Silueta de Asunción, Paraguay (vertical, móvil)',
    nl: 'Skyline van Asunción, Paraguay (mobiel portret)',
    de: 'Skyline von Asunción, Paraguay (mobil, Hochformat)',
  },
  'hero.localizedNl': {
    en: 'Bridge between Amsterdam and Asunción for the Dutch market',
    es: 'Puente entre Ámsterdam y Asunción para el mercado neerlandés',
    nl: 'Brug tussen Amsterdam en Asunción voor de Nederlandse markt',
    de: 'Brücke zwischen Amsterdam und Asunción für den niederländischen Markt',
  },
  'hero.localizedEn': {
    en: 'Asunción business tower and professional silhouette for the English market',
    es: 'Torre empresarial de Asunción y silueta profesional para el mercado inglés',
    nl: 'Zakentoren van Asunción en professionele silhouet voor de Engelstalige markt',
    de: 'Geschäftsturm von Asunción und professionelle Silhouette für den englischsprachigen Markt',
  },
  'hero.localizedDe': {
    en: 'Business district of Asunción for the German market',
    es: 'Distrito de negocios de Asunción para el mercado alemán',
    nl: 'Zakendistrict van Asunción voor de Duitse markt',
    de: 'Geschäftsviertel von Asunción für den deutschsprachigen Markt',
  },
  'hero.localizedEs': {
    en: 'Asunción cultural landmark for the Spanish market',
    es: 'Patrimonio cultural de Asunción para el mercado hispanohablante',
    nl: 'Cultureel oriëntatiepunt van Asunción voor de Spaanstalige markt',
    de: 'Kulturelles Wahrzeichen von Asunción für den spanischsprachigen Markt',
  },

  // whyParaguay bucket — 9 tiles
  'whyParaguay.economic': {
    en: 'Modern Asunción business district representing economic growth',
    es: 'Distrito empresarial moderno de Asunción que representa el crecimiento económico',
    nl: 'Modern zakendistrict van Asunción dat economische groei voorstelt',
    de: 'Modernes Geschäftsviertel von Asunción als Symbol für Wirtschaftswachstum',
  },
  'whyParaguay.investment': {
    en: 'Investment opportunities in Paraguay: construction cranes and new towers',
    es: 'Oportunidades de inversión en Paraguay: grúas y torres en construcción',
    nl: 'Investeringskansen in Paraguay: bouwkranen en nieuwe torens',
    de: 'Investitionsmöglichkeiten in Paraguay: Baukräne und neue Türme',
  },
  'whyParaguay.lifestyle': {
    en: 'Relaxed Paraguayan lifestyle: family on a terrace, tereré and green plants',
    es: 'Estilo de vida paraguayo: familia en terraza, tereré y plantas verdes',
    nl: 'Ontspannen Paraguayaanse levensstijl: familie op terras, tereré en groene planten',
    de: 'Entspannter paraguayischer Lebensstil: Familie auf der Terrasse, Tereré und grüne Pflanzen',
  },
  'whyParaguay.tax': {
    en: 'Paraguay tax stability: official documents and a clean desk',
    es: 'Estabilidad fiscal de Paraguay: documentos oficiales y un escritorio ordenado',
    nl: 'Fiscale stabiliteit van Paraguay: officiële documenten en een opgeruimd bureau',
    de: 'Steuerliche Stabilität in Paraguay: offizielle Dokumente und ein aufgeräumter Schreibtisch',
  },
  'whyParaguay.growth': {
    en: 'Paraguay growth trajectory: rising skyline and professional at a rooftop',
    es: 'Trayectoria de crecimiento de Paraguay: silueta urbana en ascenso y profesional en terraza',
    nl: 'Groeitraject van Paraguay: stijgende skyline en professional op een dakterras',
    de: 'Wachstumskurs Paraguays: aufstrebende Skyline und Professioneller auf einer Dachterrasse',
  },
  'whyParaguay.agribusiness': {
    en: 'Paraguayan agribusiness: soy fields and cattle ranch',
    es: 'Agronegocios paraguayos: campos de soja y hacienda ganadera',
    nl: 'Paraguayaanse agribusiness: sojavelden en veehouderij',
    de: 'Paraguayische Agrarwirtschaft: Sojafelder und Rinderfarm',
  },
  'whyParaguay.community': {
    en: 'International community in Paraguay: expats meeting in a café',
    es: 'Comunidad internacional en Paraguay: expatriados reunidos en un café',
    nl: 'Internationale gemeenschap in Paraguay: expats die samenkomen in een café',
    de: 'Internationale Gemeinschaft in Paraguay: Expats treffen sich in einem Café',
  },
  'whyParaguay.nature': {
    en: 'Paraguayan nature: accessible green parks and lapacho trees in bloom',
    es: 'Naturaleza paraguaya: parques verdes accesibles y lapachos en flor',
    nl: 'Paraguayaanse natuur: toegankelijke groene parken en bloeiende lapacho-bomen',
    de: 'Natur in Paraguay: zugängliche grüne Parks und blühende Lapacho-Bäume',
  },
  'whyParaguay.culture': {
    en: 'Paraguayan culture and daily life: chipa, tereré and traditional crafts',
    es: 'Cultura y vida cotidiana paraguaya: chipa, tereré y artesanía tradicional',
    nl: 'Paraguayaanse cultuur en dagelijks leven: chipa, tereré en traditioneel handwerk',
    de: 'Paraguayische Kultur und Alltag: Chipa, Tereré und traditionelles Handwerk',
  },

  // process bucket
  'process.consultation': {
    en: 'Initial consultation: video call between client and Nexa advisor',
    es: 'Consulta inicial: videollamada entre cliente y asesor de Nexa',
    nl: 'Eerste consult: videogesprek tussen klant en Nexa-adviseur',
    de: 'Erstberatung: Videoanruf zwischen Klient und Nexa-Berater',
  },
  'process.documents': {
    en: 'Document validation: stack of apostilled documents being reviewed',
    es: 'Validación de documentos: pila de documentos apostillados en revisión',
    nl: 'Documentvalidatie: stapel geapostilleerde documenten onder review',
    de: 'Dokumentenvalidierung: Stapel apostillierter Dokumente in Prüfung',
  },
  'process.arrival': {
    en: 'Operational day: client arriving at Asunción with team',
    es: 'Día operativo: cliente llegando a Asunción con el equipo',
    nl: 'Operationele dag: klant komt aan in Asunción met het team',
    de: 'Operativer Tag: Klient trifft mit dem Team in Asunción ein',
  },
  'process.banking': {
    en: 'Company and banking step: opening a corporate bank account',
    es: 'Paso de empresa y banca: apertura de cuenta corporativa',
    nl: 'Bedrijfs- en bankstap: zakelijke rekening openen',
    de: 'Unternehmens- und Bankschritt: Eröffnung eines Geschäftskontos',
  },
  'process.completion': {
    en: 'Delivery and follow-up: signed folder with final residency documents',
    es: 'Entrega y seguimiento: carpeta firmada con documentos finales de residencia',
    nl: 'Oplevering en nazorg: getekende map met definitieve verblijfsdocumenten',
    de: 'Abschluss und Nachbetreuung: unterzeichneter Ordner mit finalen Aufenthaltsdokumenten',
  },
  'process.operationalDay': {
    en: 'Operational day: single coordinated day of in-person processing',
    es: 'Día operativo: una jornada coordinada de trámites presenciales',
    nl: 'Operationele dag: één gecoördineerde dag fysieke afhandeling',
    de: 'Operativer Tag: ein koordinierter Tag persönlicher Abwicklung',
  },
  'process.apostilleStack': {
    en: 'Apostilled documents stacked and ready for the operational day',
    es: 'Documentos apostillados listos para el día operativo',
    nl: 'Geapostilleerde documenten klaar voor de operationele dag',
    de: 'Apostillierte Dokumente bereit für den operativen Tag',
  },
  'process.familyResidency': {
    en: 'Family residency: parents and child at the migration office',
    es: 'Residencia familiar: padres y niño en la oficina de migraciones',
    nl: 'Gezinsresidentie: ouders en kind bij het migratiekantoor',
    de: 'Familien-Aufenthalt: Eltern und Kind im Migrationsamt',
  },
  'process.bankCustomerSide': {
    en: 'Bank appointment seen from the client side: signing and welcome pack',
    es: 'Cita bancaria desde el lado del cliente: firma y paquete de bienvenida',
    nl: 'Bankafspraak gezien vanaf de klantzijde: ondertekening en welkomstpakket',
    de: 'Banktermin aus Kundensicht: Unterzeichnung und Willkommenspaket',
  },

  // programs bucket
  'programs.tierBase': {
    en: 'Base program: ID card, passport and lapacho flower on a desk',
    es: 'Programa Base: cédula, pasaporte y flor de lapacho sobre un escritorio',
    nl: 'Basisprogramma: ID-kaart, paspoort en lapacho-bloem op een bureau',
    de: 'Basisprogramm: Personalausweis, Reisepass und Lapacho-Blüte auf einem Schreibtisch',
  },
  'programs.tierBusiness': {
    en: 'Business program: ID, passport, folder and corporate bank card',
    es: 'Programa Business: cédula, pasaporte, carpeta y tarjeta corporativa',
    nl: 'Business-programma: ID, paspoort, map en zakelijke bankkaart',
    de: 'Business-Programm: Personalausweis, Reisepass, Mappe und Firmen-Bankkarte',
  },
  'programs.tierInvestor': {
    en: 'Investor program: documents, real-estate brochure and keys',
    es: 'Programa Inversor: documentos, folleto inmobiliario y llaves',
    nl: 'Investeerdersprogramma: documenten, vastgoedbrochure en sleutels',
    de: 'Investorenprogramm: Dokumente, Immobilienbroschüre und Schlüssel',
  },
  'programs.tierTierras': {
    en: 'Land program: rural Paraguayan farmland with blue sky',
    es: 'Programa Tierras: campo rural paraguayo con cielo azul',
    nl: 'Grondprogramma: ruraal Paraguayaans boerenland met blauwe lucht',
    de: 'Grundstücksprogramm: ländliches paraguayisches Farmland mit blauem Himmel',
  },

  // team bucket (placeholders — real photos pending)
  'team.operationsDirector': {
    en: 'Placeholder portrait: Operations Director (Paraguay)',
    es: 'Retrato marcador: Director de Operaciones (Paraguay)',
    nl: 'Plaatsaanduiding portret: Operationeel Directeur (Paraguay)',
    de: 'Platzhalter-Porträt: Operativer Direktor (Paraguay)',
  },
  'team.commercialDirector': {
    en: 'Placeholder portrait: Commercial Director (Europe)',
    es: 'Retrato marcador: Director Comercial (Europa)',
    nl: 'Plaatsaanduiding portret: Commercieel Directeur (Europa)',
    de: 'Platzhalter-Porträt: Kaufmännischer Direktor (Europa)',
  },
  'team.legalLead': {
    en: 'Placeholder portrait: Legal team lead',
    es: 'Retrato marcador: Responsable del equipo legal',
    nl: 'Plaatsaanduiding portret: Juridische teamleider',
    de: 'Platzhalter-Porträt: Leitung Rechtsteam',
  },
  'team.accountingLead': {
    en: 'Placeholder portrait: Accounting team lead',
    es: 'Retrato marcador: Responsable del equipo contable',
    nl: 'Plaatsaanduiding portret: Leider van het boekhoudteam',
    de: 'Platzhalter-Porträt: Leitung Buchhaltung',
  },
  'team.clientSuccess': {
    en: 'Placeholder portrait: Client Success lead',
    es: 'Retrato marcador: Responsable de Client Success',
    nl: 'Plaatsaanduiding portret: Client Success-leider',
    de: 'Platzhalter-Porträt: Leitung Client Success',
  },
  'team.group': {
    en: 'Placeholder group photo: Nexa Paraguay team (pending real photo)',
    es: 'Foto grupal marcador: equipo Nexa Paraguay (pendiente foto real)',
    nl: 'Plaatsaanduiding groepsfoto: Nexa Paraguay-team (echte foto volgt)',
    de: 'Platzhalter-Gruppenfoto: Nexa Paraguay Team (echtes Foto ausstehend)',
  },

  // office bucket (placeholders)
  'office.exterior': {
    en: 'Nexa Paraguay office exterior in Asunción (AI placeholder)',
    es: 'Exterior de la oficina de Nexa Paraguay en Asunción (marcador IA)',
    nl: 'Buitenkant van Nexa Paraguay kantoor in Asunción (AI-plaatsaanduiding)',
    de: 'Außenansicht des Nexa Paraguay Büros in Asunción (KI-Platzhalter)',
  },
  'office.reception': {
    en: 'Office reception: where clients arrive for the operational day',
    es: 'Recepción de la oficina: punto de llegada en el día operativo',
    nl: 'Receptie van het kantoor: aankomstpunt op de operationele dag',
    de: 'Büroempfang: Ankunftspunkt am operativen Tag',
  },
  'office.meetingRoom': {
    en: 'Meeting room where consultation and signing take place',
    es: 'Sala de reuniones donde ocurren la consulta y las firmas',
    nl: 'Vergaderzaal waar consult en ondertekening plaatsvinden',
    de: 'Besprechungsraum für Beratung und Unterzeichnung',
  },
  'office.signing': {
    en: 'Notarial signing desk inside the Nexa Paraguay office',
    es: 'Mesa notarial de firma en la oficina de Nexa Paraguay',
    nl: 'Notariële ondertekentafel in het Nexa Paraguay-kantoor',
    de: 'Notarieller Unterzeichnungstisch im Nexa Paraguay Büro',
  },
  'office.teamHuddle': {
    en: 'Team huddle: lawyers, accountants and coordinators aligning on a case',
    es: 'Reunión del equipo: abogados, contadores y coordinadores alineando un caso',
    nl: 'Teamoverleg: advocaten, accountants en coördinatoren stemmen een dossier af',
    de: 'Teambesprechung: Anwälte, Steuerberater und Koordinatoren richten einen Fall aus',
  },

  // trust bucket
  'trust.migraciones': {
    en: 'Migraciones Paraguay sign — institutional trust proof point',
    es: 'Cartel de Migraciones Paraguay — prueba de confianza institucional',
    nl: 'Bord van Migraciones Paraguay — bewijs van institutioneel vertrouwen',
    de: 'Schild der Migraciones Paraguay — Beleg für institutionelles Vertrauen',
  },
  'trust.cedula': {
    en: 'Paraguayan cédula (ID card) held in hand — delivered to the client',
    es: 'Cédula paraguaya en mano — entregada al cliente',
    nl: 'Paraguayaanse cédula (ID-kaart) in de hand — overhandigd aan de klant',
    de: 'Paraguayische Cédula (Personalausweis) in der Hand — an den Klienten übergeben',
  },
  'trust.certificate': {
    en: 'Company certificate after incorporation — proof of completion',
    es: 'Certificado de constitución de empresa — prueba de cierre',
    nl: 'Bedrijfscertificaat na oprichting — bewijs van voltooiing',
    de: 'Unternehmenszertifikat nach Gründung — Abschlussnachweis',
  },
  'trust.registry': {
    en: 'Paraguayan registry building exterior — institutional partner',
    es: 'Exterior del edificio del Registro paraguayo — socio institucional',
    nl: 'Buitenkant van het Paraguayaanse registergebouw — institutionele partner',
    de: 'Außenansicht des paraguayischen Registergebäudes — institutioneller Partner',
  },

  // blog bucket
  'blog.residencia2024': {
    en: 'Blog cover: residency requirements 2024',
    es: 'Portada de blog: requisitos de residencia 2024',
    nl: 'Blogomslag: vereisten voor residentie 2024',
    de: 'Blog-Titelbild: Aufenthaltsanforderungen 2024',
  },
  'blog.comparativaFiscal': {
    en: 'Blog cover: Paraguay tax comparison vs neighbouring countries',
    es: 'Portada de blog: comparativa fiscal Paraguay vs países vecinos',
    nl: 'Blogomslag: fiscale vergelijking Paraguay vs buurlanden',
    de: 'Blog-Titelbild: Steuervergleich Paraguay vs. Nachbarländer',
  },
  'blog.propiedades': {
    en: 'Blog cover: buying property in Paraguay',
    es: 'Portada de blog: comprar propiedades en Paraguay',
    nl: 'Blogomslag: vastgoed kopen in Paraguay',
    de: 'Blog-Titelbild: Immobilien kaufen in Paraguay',
  },
  'blog.banca': {
    en: 'Blog cover: Paraguayan banking for foreigners',
    es: 'Portada de blog: banca paraguaya para extranjeros',
    nl: 'Blogomslag: Paraguayaans bankieren voor buitenlanders',
    de: 'Blog-Titelbild: Paraguayisches Bankwesen für Ausländer',
  },
  'blog.emprender': {
    en: 'Blog cover: starting a business in Paraguay',
    es: 'Portada de blog: emprender en Paraguay',
    nl: 'Blogomslag: ondernemen in Paraguay',
    de: 'Blog-Titelbild: Unternehmen gründen in Paraguay',
  },
  'blog.costOfLiving': {
    en: 'Blog cover: cost of living in Paraguay',
    es: 'Portada de blog: costo de vida en Paraguay',
    nl: 'Blogomslag: kosten van levensonderhoud in Paraguay',
    de: 'Blog-Titelbild: Lebenshaltungskosten in Paraguay',
  },
  'blog.healthcare': {
    en: 'Blog cover: healthcare options in Paraguay',
    es: 'Portada de blog: opciones de salud en Paraguay',
    nl: 'Blogomslag: zorgopties in Paraguay',
    de: 'Blog-Titelbild: Gesundheitsversorgung in Paraguay',
  },
  'blog.schools': {
    en: 'Blog cover: international schools in Paraguay',
    es: 'Portada de blog: colegios internacionales en Paraguay',
    nl: 'Blogomslag: internationale scholen in Paraguay',
    de: 'Blog-Titelbild: internationale Schulen in Paraguay',
  },
  'blog.neighborhoods': {
    en: 'Blog cover: neighbourhoods in Asunción',
    es: 'Portada de blog: barrios en Asunción',
    nl: 'Blogomslag: wijken in Asunción',
    de: 'Blog-Titelbild: Stadtviertel in Asunción',
  },
  'blog.paraguayUruguayPanama': {
    en: 'Blog cover: Paraguay vs Uruguay vs Panama comparison',
    es: 'Portada de blog: comparativa Paraguay vs Uruguay vs Panamá',
    nl: 'Blogomslag: vergelijking Paraguay vs Uruguay vs Panama',
    de: 'Blog-Titelbild: Vergleich Paraguay vs. Uruguay vs. Panama',
  },

  // testimonials bucket (gated; keep alts aligned with placeholders)
  'testimonials.client1': {
    en: 'Placeholder testimonial portrait 1 (AI-generated, not consented)',
    es: 'Retrato testimonial marcador 1 (IA, sin consentimiento)',
    nl: 'Plaatsaanduiding testimoniumportret 1 (AI, niet ingestemd)',
    de: 'Platzhalter-Testimonial-Porträt 1 (KI, nicht eingewilligt)',
  },
  'testimonials.client2': {
    en: 'Placeholder testimonial portrait 2 (AI-generated, not consented)',
    es: 'Retrato testimonial marcador 2 (IA, sin consentimiento)',
    nl: 'Plaatsaanduiding testimoniumportret 2 (AI, niet ingestemd)',
    de: 'Platzhalter-Testimonial-Porträt 2 (KI, nicht eingewilligt)',
  },
  'testimonials.client3': {
    en: 'Placeholder testimonial portrait 3 (AI-generated, not consented)',
    es: 'Retrato testimonial marcador 3 (IA, sin consentimiento)',
    nl: 'Plaatsaanduiding testimoniumportret 3 (AI, niet ingestemd)',
    de: 'Platzhalter-Testimonial-Porträt 3 (KI, nicht eingewilligt)',
  },
  'testimonials.client4': {
    en: 'Placeholder testimonial portrait 4 (AI-generated, not consented)',
    es: 'Retrato testimonial marcador 4 (IA, sin consentimiento)',
    nl: 'Plaatsaanduiding testimoniumportret 4 (AI, niet ingestemd)',
    de: 'Platzhalter-Testimonial-Porträt 4 (KI, nicht eingewilligt)',
  },
  'testimonials.client5': {
    en: 'Placeholder testimonial portrait 5 (AI-generated, not consented)',
    es: 'Retrato testimonial marcador 5 (IA, sin consentimiento)',
    nl: 'Plaatsaanduiding testimoniumportret 5 (AI, niet ingestemd)',
    de: 'Platzhalter-Testimonial-Porträt 5 (KI, nicht eingewilligt)',
  },
  'testimonials.poster1': {
    en: 'Video testimonial poster frame 1 (placeholder until real video)',
    es: 'Fotograma de video testimonial 1 (marcador hasta video real)',
    nl: 'Video-testimoniumposter 1 (plaatsaanduiding tot echte video)',
    de: 'Video-Testimonial-Posterbild 1 (Platzhalter bis echtes Video)',
  },
  'testimonials.poster2': {
    en: 'Video testimonial poster frame 2 (placeholder until real video)',
    es: 'Fotograma de video testimonial 2 (marcador hasta video real)',
    nl: 'Video-testimoniumposter 2 (plaatsaanduiding tot echte video)',
    de: 'Video-Testimonial-Posterbild 2 (Platzhalter bis echtes Video)',
  },
  'testimonials.poster3': {
    en: 'Video testimonial poster frame 3 (placeholder until real video)',
    es: 'Fotograma de video testimonial 3 (marcador hasta video real)',
    nl: 'Video-testimoniumposter 3 (plaatsaanduiding tot echte video)',
    de: 'Video-Testimonial-Posterbild 3 (Platzhalter bis echtes Video)',
  },
  'testimonials.poster4': {
    en: 'Video testimonial poster frame 4 (placeholder until real video)',
    es: 'Fotograma de video testimonial 4 (marcador hasta video real)',
    nl: 'Video-testimoniumposter 4 (plaatsaanduiding tot echte video)',
    de: 'Video-Testimonial-Posterbild 4 (Platzhalter bis echtes Video)',
  },
  'testimonials.poster5': {
    en: 'Video testimonial poster frame 5 (placeholder until real video)',
    es: 'Fotograma de video testimonial 5 (marcador hasta video real)',
    nl: 'Video-testimoniumposter 5 (plaatsaanduiding tot echte video)',
    de: 'Video-Testimonial-Posterbild 5 (Platzhalter bis echtes Video)',
  },
}

interface AssetShape {
  src: string
  alt: string
  fallbackSrc?: string
  altByLocale?: Record<string, string>
}

function run(): void {
  const json = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8')) as {
    images: Record<string, Record<string, AssetShape>>
  }

  let updated = 0
  let skipped = 0

  for (const [key, alts] of Object.entries(LOCALIZED_ALTS)) {
    const [bucket, name] = key.split('.')
    const asset = json.images[bucket]?.[name]
    if (!asset) {
      console.warn(`  MISS  ${key} — asset not in manifest`)
      continue
    }
    const existing = asset.altByLocale ?? {}
    const merged: Record<string, string> = { ...existing }
    let changed = false
    for (const [locale, text] of Object.entries(alts)) {
      if (merged[locale] !== text) {
        merged[locale] = text
        changed = true
      }
    }
    if (changed) {
      asset.altByLocale = merged
      updated++
    } else {
      skipped++
    }
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(json, null, 2) + '\n')
  console.log(`updated ${updated} assets, skipped ${skipped} (already current)`)
}

run()
