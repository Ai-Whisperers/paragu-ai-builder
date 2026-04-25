/**
 * Paraguayan contador service packages by buyer archetype.
 *
 * Research shows SMB buyers think in terms of LIFE EVENTS (abro empresa,
 * paso a IRP, heredé un negocio) rather than service LINES (contabilidad,
 * impuestos). This catalog maps the 10 most common buyer situations to
 * named packages.
 *
 * Drops into `packages-section` as structured data, or feeds an intake
 * wizard that asks the buyer their scenario and surfaces the fit.
 */

export type PackageTier = 'low' | 'med' | 'high' | 'custom'

export interface ServicePackage {
  id: string
  nameEs: string
  nameEn?: string
  /** One-sentence buyer archetype — "Yo soy ___, y ___". */
  archetype: string
  /** Pain point the buyer is feeling. */
  painPoint: string
  /** What's included in the package. */
  deliverables: string[]
  /** Typical delivery timeline. */
  timeline: string
  priceFrom: string
  /** USD reference for foreign-investor packages. */
  priceFromUSD?: string
  tier: PackageTier
  /** Which contador sub-type is the best fit to sell this package. */
  bestFitSubtype: string
  /** Featured on default template. */
  featured?: boolean
}

export const PY_SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: 'abro-mi-empresa-py',
    nameEs: 'Abro mi empresa en Paraguay',
    nameEn: 'Open my Paraguay company',
    archetype: 'Soy extranjero o nomada digital y quiero operar legalmente desde PY',
    painPoint: 'No se como empezar — no tengo cedula, no hablo guarani, no conozco a nadie',
    deliverables: [
      'Apertura EAS en 72 horas via MIC',
      'Inscripcion RUC en DNIT',
      'Habilitacion municipal',
      'Primer Timbrado + e-Kuatia configurado',
      'Apertura de cuenta bancaria (intro con Itau / Sudameris / Atlas)',
      'Primera liquidacion mensual incluida',
    ],
    timeline: '5-7 dias habiles total',
    priceFrom: '10.500.000 Gs one-time',
    priceFromUSD: 'USD 1.500',
    tier: 'high',
    bestFitSubtype: 'contador_inversores',
    featured: true,
  },
  {
    id: 'pase-a-irp',
    nameEs: 'Pase a IRP este ano',
    nameEn: 'I crossed the IRP threshold',
    archetype: 'Soy profesional independiente y mis ingresos superaron Gs. 80M/ano',
    painPoint: 'Me inscribo ahora o espero? Cuanto voy a pagar? Que puedo deducir?',
    deliverables: [
      'Inscripcion IRP en DNIT',
      'Revision retroactiva (si aplica) y regularizacion',
      'Setup de Timbrado e-Kuatia para facturacion profesional',
      'Planilla de gastos deducibles (art. 68 Ley 6380/19)',
      'Primera liquidacion mensual',
      'Proyeccion anual IRP con deducciones al maximo',
    ],
    timeline: '2-4 semanas',
    priceFrom: '3.500.000 Gs setup + 450.000 Gs/mes',
    tier: 'med',
    bestFitSubtype: 'contador',
  },
  {
    id: 'tengo-peluqueria-3-empleados',
    nameEs: 'Tengo salon de belleza con 3 empleados',
    nameEn: 'I own a beauty salon with 3 employees',
    archetype: 'Soy dueno de microempresa con carga laboral intensa',
    painPoint: 'El IPS y aguinaldo me complican, las multas me asustan, no entiendo REOP',
    deliverables: [
      'Contabilidad mensual simplificada',
      'IRE Simple + IVA',
      'Liquidacion completa de sueldos + IPS + aguinaldo',
      'MTESS-REOP mensual al dia',
      'Pago puntual de obligaciones via domiciliacion bancaria',
      'Asesoramiento laboral continuo por WhatsApp',
    ],
    timeline: 'Mensual recurring',
    priceFrom: '950.000 Gs/mes',
    tier: 'med',
    bestFitSubtype: 'contador',
    featured: true,
  },
  {
    id: 'soy-agricultor-ganadero',
    nameEs: 'Soy agricultor o ganadero',
    nameEn: 'I am a farmer / cattle rancher',
    archetype: 'Tengo un establecimiento con soja, ganado o agricultura familiar',
    painPoint: 'SENACSA, IMAGRO, constancia no retencion — me piden papeles que no se cuales son',
    deliverables: [
      'IRE Agropecuario anual',
      'Constancia de No Retencion (trimestral)',
      'SENACSA: marcas, senales, SIGOR',
      'Certificados de origen para exportacion',
      'Coordinacion con BNF / Fondo Ganadero',
      'Visita al establecimiento 2x ano',
    ],
    timeline: 'Mensual + visitas',
    priceFrom: '1.200.000 Gs/mes',
    tier: 'med',
    bestFitSubtype: 'contador_agro',
  },
  {
    id: 'soy-empleado-supero-80m',
    nameEs: 'Soy empleado que superé Gs. 80M/año',
    nameEn: 'I am an employee earning above the IRP threshold',
    archetype: 'Sos empleado en relacion de dependencia con ingreso alto',
    painPoint: 'Me retienen IRP pero no se si lo aplican bien, y no aprovecho deducciones',
    deliverables: [
      'Analisis de retenciones del empleador',
      'Planilla de deducciones a declarar anualmente',
      'Gastos medicos, educacion, vivienda, seguros',
      'Declaracion jurada anual (F. 104)',
      'Optimizacion legal vs situacion empleador',
    ],
    timeline: 'Anual + 2 reuniones',
    priceFrom: '1.500.000 Gs/ano',
    tier: 'low',
    bestFitSubtype: 'contador',
  },
  {
    id: 'abro-cooperativa',
    nameEs: 'Abro una cooperativa',
    nameEn: 'I am opening a cooperative',
    archetype: 'Formamos grupo para cooperativa de produccion, consumo o ahorro',
    painPoint: 'INCOOP, Balance Social, asamblea — es todo nuevo para nosotros',
    deliverables: [
      'Constitucion de cooperativa ante INCOOP',
      'Estatutos redactados conforme Ley 438/94',
      'Primera asamblea constitutiva',
      'Inscripcion RUC + municipal',
      'Set-up de reporting INCOOP',
      'Primer Balance Social (al fin del ejercicio)',
    ],
    timeline: '60-90 dias',
    priceFrom: '8.500.000 Gs setup + 2.500.000 Gs/mes',
    tier: 'high',
    bestFitSubtype: 'contador_cooperativa',
  },
  {
    id: 'soy-nomada-digital',
    nameEs: 'Soy nomada digital',
    nameEn: 'I am a digital nomad',
    archetype: 'Trabajo remoto con clientes del exterior, quiero residir en PY',
    painPoint: 'Territorial tax 0% sobre ingresos del exterior — como hago eso bien?',
    deliverables: [
      'Asesoramiento en residencia migratoria',
      'Apertura de RUC personal / EAS',
      'Tax residency certification',
      'Reporting mensual bilingue ES/EN',
      'Certificado de residencia fiscal para CDI treaties',
    ],
    timeline: '60-90 dias setup + mensual',
    priceFrom: '4.900.000 Gs setup + 700.000 Gs/mes',
    priceFromUSD: 'USD 700 setup + USD 99/month',
    tier: 'med',
    bestFitSubtype: 'contador_inversores',
    featured: true,
  },
  {
    id: 'mi-contador-me-dejo',
    nameEs: 'Mi contador me dejo',
    nameEn: 'My accountant dropped me',
    archetype: 'Sos PYME cuyo contador cerro, se mudo, o dejo de responder',
    painPoint: 'No tengo acceso a Marangatu, no se donde esta mi Timbrado, se acerca vencimiento',
    deliverables: [
      'Recuperacion de acceso Marangatu',
      'Traspaso de papeles de trabajo',
      'Regularizacion de pendientes DNIT / IPS',
      'Reconstruccion de ultimos 3-6 meses si es necesario',
      'Plan de continuidad a partir del mes siguiente',
    ],
    timeline: '30-60 dias urgente',
    priceFrom: '2.500.000 Gs regularizacion + plan mensual estandar',
    tier: 'high',
    bestFitSubtype: 'contador',
  },
  {
    id: 'compre-vendi-empresa',
    nameEs: 'Vendi o compre una empresa',
    nameEn: 'I sold or bought a business',
    archetype: 'Transaccion M&A de PYME paraguaya',
    painPoint: 'Que pasivos asumo? Cuanto pago de IRE? Hay algo escondido?',
    deliverables: [
      'Due diligence contable y tributario',
      'Evaluacion de pasivos IPS, MTESS, DNIT',
      'Quality of earnings report',
      'Planificacion fiscal de la transaccion',
      'Coordinacion con abogado y escribano',
      'Cierre contable pre-transferencia',
    ],
    timeline: '30-60 dias',
    priceFrom: '15.000.000 Gs proyecto',
    priceFromUSD: 'USD 2.000-5.000',
    tier: 'custom',
    bestFitSubtype: 'contador',
  },
  {
    id: 'tengo-crypto',
    nameEs: 'Tengo operaciones crypto',
    nameEn: 'I trade / hold crypto',
    archetype: 'Trader o inversor crypto con wallets y exchanges internacionales',
    painPoint: 'Que reporto a DNIT? Soy SEPRELAD? Voy a pagar IRE sobre ganancias crypto?',
    deliverables: [
      'Assessment de SEPRELAD obligations',
      'Setup de reporting bilingue ES/EN',
      'Clasificacion de trades para IRE',
      'FIFO/LIFO cost basis methodology',
      'Blockchain forensics para compliance',
      'Coordinacion con advisor de tu pais de origen',
    ],
    timeline: 'Mensual recurring',
    priceFrom: '1.750.000 Gs/mes',
    priceFromUSD: 'USD 250/month',
    tier: 'med',
    bestFitSubtype: 'contador_crypto',
  },
]

/**
 * Filter packages applicable to a given sub-type.
 * A sub-type "inherits" the generic packages (contador) + its own.
 */
export function getPackagesForSubtype(subtype: string): ServicePackage[] {
  const subtypeMap: Record<string, string[]> = {
    contador: ['contador'],
    contador_inversores: ['contador', 'contador_inversores'],
    contador_agro: ['contador', 'contador_agro'],
    contador_cooperativa: ['contador', 'contador_cooperativa'],
    contador_crypto: ['contador', 'contador_crypto'],
    contador_maquila: ['contador'],
    contador_medico: ['contador'],
    contador_ong: ['contador'],
    contador_chaco: ['contador', 'contador_agro', 'contador_cooperativa'],
    contador_cde: ['contador', 'contador_inversores'],
  }
  const applicable = subtypeMap[subtype] || ['contador']
  return PY_SERVICE_PACKAGES.filter((p) => applicable.includes(p.bestFitSubtype))
}

/**
 * Featured packages for homepage (limit 3).
 */
export function getFeaturedPackages(subtype = 'contador'): ServicePackage[] {
  return getPackagesForSubtype(subtype)
    .filter((p) => p.featured)
    .slice(0, 3)
}
