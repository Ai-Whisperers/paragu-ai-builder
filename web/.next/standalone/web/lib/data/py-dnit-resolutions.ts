/**
 * Key DNIT (ex-SET) resolutions 2020-2026 quick-reference.
 *
 * Surfaces the most-cited resolutions for the contador template's
 * "novedades DNIT" section. Not exhaustive — curated to what SMB-facing
 * contadores reference weekly. Updated quarterly.
 */

export type ResolutionCategory =
  | 'general'
  | 'iva'
  | 'ire'
  | 'irp'
  | 'idu'
  | 'laboral'
  | 'facturacion-electronica'
  | 'agro'
  | 'maquila'
  | 'crypto'
  | 'precios-transferencia'
  | 'resimple'

export interface DnitResolution {
  number: string
  year: number
  title: string
  summary: string
  category: ResolutionCategory
  impact: 'high' | 'medium' | 'low'
  /** Who is affected */
  affects: string[]
  /** Optional permalink (DNIT site structure varies). */
  link?: string
}

/**
 * Curated DNIT resolutions — key ones an SMB contador should know cold.
 * Ordered by most recent first.
 */
export const DNIT_RESOLUTIONS: DnitResolution[] = [
  {
    number: 'RG 001/2026',
    year: 2026,
    title: 'Actualizacion calendario perpetuo de vencimientos IVA/IRP/IRE',
    summary: 'Reajuste de fechas segun ultimo digito del RUC para vencimientos mensuales y anuales. Sin cambios estructurales vs 2025.',
    category: 'general',
    impact: 'high',
    affects: ['Todos los contribuyentes', 'Contadores'],
  },
  {
    number: 'RG 047/2025',
    year: 2025,
    title: 'REOP-MTESS integracion obligatoria',
    summary: 'Comunicacion electronica de liquidaciones salariales al MTESS-REOP es obligatoria desde 2025. Multa por empleado por mes en caso de omision.',
    category: 'laboral',
    impact: 'high',
    affects: ['Empleadores con personal en relacion de dependencia'],
  },
  {
    number: 'RG 015/2024',
    year: 2024,
    title: 'Renombramiento SET a DNIT',
    summary: 'La Subsecretaria de Estado de Tributacion (SET) pasa a denominarse Direccion Nacional de Ingresos Tributarios (DNIT). Marangatu, e-Kuatia y formularios se mantienen vigentes.',
    category: 'general',
    impact: 'medium',
    affects: ['Todos'],
  },
  {
    number: 'Nota DNIT 2024',
    year: 2024,
    title: 'Posicion sobre tributacion de criptoactivos',
    summary: 'Las ganancias habituales por compraventa de criptoactivos se consideran renta gravada y tributan IRE 10%. Comisiones de intermediacion estan sujetas a IVA 10%.',
    category: 'crypto',
    impact: 'high',
    affects: ['Traders crypto', 'Exchanges', 'Remesadoras cripto'],
  },
  {
    number: 'RG 82/2023',
    year: 2023,
    title: 'Obligados a facturacion electronica e-Kuatia',
    summary: 'Expansion del universo obligado a emitir facturas electronicas via e-Kuatia. Grandes contribuyentes + exportadores + sectores regulados. Cronograma por segmentos.',
    category: 'facturacion-electronica',
    impact: 'high',
    affects: ['Grandes contribuyentes', 'Exportadores', 'Sectores regulados'],
  },
  {
    number: 'RG 57/2023',
    year: 2023,
    title: 'Procedimientos facturacion electronica e-Kuatia\'i',
    summary: 'Alternativa mas simple para pequenos contribuyentes — emision de comprobantes electronicos via e-Kuatia\'i.',
    category: 'facturacion-electronica',
    impact: 'medium',
    affects: ['Pequenos contribuyentes', 'Profesionales independientes'],
  },
  {
    number: 'Decreto 3182/2019',
    year: 2019,
    title: 'Reglamentacion de precios de transferencia (ETPT)',
    summary: 'Establece obligaciones para operaciones con partes relacionadas del exterior. Metodos OCDE aceptados. Documentacion anual.',
    category: 'precios-transferencia',
    impact: 'high',
    affects: ['Grupos multinacionales', 'Empresas con matriz o subsidiaria exterior'],
  },
  {
    number: 'Ley 6380/2019',
    year: 2019,
    title: 'Reforma tributaria — Ley de Modernizacion',
    summary: 'Reforma estructural del sistema tributario paraguayo. Crea IRE, IRP, IDU. Define RESIMPLE, IRE Simple, IRE General. Deroga IRACIS, IRPC, IRAGRO, IRP anterior.',
    category: 'general',
    impact: 'high',
    affects: ['Todos los contribuyentes'],
  },
  {
    number: 'Decreto 3110/2019',
    year: 2019,
    title: 'Reglamentacion del IRP (art. 68 — deducciones)',
    summary: 'Detalla las deducciones permitidas del IRP: gastos medicos, educacion, vivienda, vehiculo, insumos profesionales, capacitacion.',
    category: 'irp',
    impact: 'high',
    affects: ['Profesionales independientes', 'Empleados con IRP'],
  },
  {
    number: 'RG 55/2020',
    year: 2020,
    title: 'Calendario perpetuo IVA, IRP, IRE',
    summary: 'Establece el calendario perpetuo escalonado por ultimo digito del RUC para vencimientos mensuales y anuales.',
    category: 'general',
    impact: 'high',
    affects: ['Todos los contribuyentes'],
  },
  {
    number: 'RG 39/2020',
    year: 2020,
    title: 'Distribucion de dividendos y utilidades (IDU)',
    summary: 'Reglamenta la retencion del IDU (8% para residentes, 15% para no residentes) al momento de distribucion. Vencimiento 30 dias post-pago.',
    category: 'idu',
    impact: 'high',
    affects: ['Empresas con accionistas', 'SRL con distribucion de utilidades'],
  },
  {
    number: 'Res. SEPRELAD 8/2020',
    year: 2020,
    title: 'Sujeto obligado crypto',
    summary: 'Empresas crypto con ciertos volumenes son sujetos obligados SEPRELAD. Registro, oficial de cumplimiento, ROS mensuales.',
    category: 'crypto',
    impact: 'high',
    affects: ['Exchanges crypto', 'Remesadoras', 'OTC desks'],
  },
  {
    number: 'Ley 6480/2020',
    year: 2020,
    title: 'EAS — Empresa por Acciones Simplificadas',
    summary: 'Crea la figura EAS. Constitucion online via MIC en 72 horas. Capital minimo cero. Socio unico valido. Responsabilidad limitada.',
    category: 'general',
    impact: 'high',
    affects: ['Nuevos emprendimientos', 'Nomadas digitales', 'Inversores extranjeros'],
  },
  {
    number: 'Ley 1064/1997',
    year: 1997,
    title: 'Industria Maquiladora de Exportacion',
    summary: 'Regimen de maquila: tributo unico 1% sobre facturacion, importacion temporal sin aranceles, obligacion de exportar 100%. Aprobacion via CNIME.',
    category: 'maquila',
    impact: 'high',
    affects: ['Maquiladoras', 'Empresas en Ciudad del Este', 'Zona Franca'],
  },
  {
    number: 'Res. INCOOP 4109/2009',
    year: 2009,
    title: 'Balance Social Cooperativo',
    summary: 'Documento anual obligatorio para cooperativas. Mide cumplimiento de los 7 principios cooperativos, indicadores de educacion e integracion.',
    category: 'general',
    impact: 'medium',
    affects: ['Cooperativas'],
  },
  {
    number: 'Ley 5115/2013',
    year: 2013,
    title: 'Trabajador rural',
    summary: 'Establece regimen laboral especifico para trabajadores rurales: zafreros, peones de campo, trabajadores agropecuarios.',
    category: 'laboral',
    impact: 'medium',
    affects: ['Empleadores rurales', 'Productores agropecuarios'],
  },
  {
    number: 'Res. CGR 106/2024',
    year: 2024,
    title: 'Rendicion ONGs a Contraloria',
    summary: 'Establece procedimiento de rendicion anual online al CGR para ONGs y fundaciones.',
    category: 'general',
    impact: 'medium',
    affects: ['ONGs', 'Fundaciones'],
  },
]

/**
 * Get most recent high-impact resolutions (for homepage "novedades" widget).
 */
export function getRecentHighImpact(limit = 5): DnitResolution[] {
  return DNIT_RESOLUTIONS.filter((r) => r.impact === 'high')
    .sort((a, b) => b.year - a.year)
    .slice(0, limit)
}

/**
 * Get resolutions by category (for category-filtered news feed).
 */
export function getResolutionsByCategory(category: ResolutionCategory): DnitResolution[] {
  return DNIT_RESOLUTIONS.filter((r) => r.category === category)
}

/**
 * Get resolutions relevant to a sub-type (for tailored "novedades" per tenant).
 */
export function getResolutionsForSubtype(subtype: string): DnitResolution[] {
  const subtypeCategories: Record<string, ResolutionCategory[]> = {
    contador: ['general', 'iva', 'ire', 'irp', 'idu', 'resimple', 'laboral', 'facturacion-electronica'],
    contador_inversores: ['general', 'ire', 'idu', 'precios-transferencia', 'facturacion-electronica'],
    contador_agro: ['general', 'ire', 'agro', 'laboral'],
    contador_cooperativa: ['general', 'ire', 'laboral'],
    contador_crypto: ['crypto', 'ire', 'idu'],
    contador_maquila: ['maquila', 'general', 'facturacion-electronica'],
    contador_medico: ['irp', 'general', 'facturacion-electronica'],
    contador_tecnologia: ['ire', 'general', 'idu', 'precios-transferencia'],
    contador_ong: ['general', 'laboral', 'irp'],
  }
  const cats = subtypeCategories[subtype] || subtypeCategories.contador
  return DNIT_RESOLUTIONS.filter((r) => cats.includes(r.category))
    .sort((a, b) => b.year - a.year)
}
