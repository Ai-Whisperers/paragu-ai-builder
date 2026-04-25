/**
 * Paraguay entity-type comparison data for the `compare-plans-matrix`
 * section. Used by the contador template to help prospects decide
 * between Unipersonal / EAS / SRL / SA.
 *
 * Updated April 2026 based on Ley 6380/19 (tax reform), Ley 6480/20 (EAS),
 * and Codigo Civil + Ley 1034/83 (commercial).
 */

export interface EntityFeature {
  label: string
  unipersonal: string | boolean
  eas: string | boolean
  srl: string | boolean
  sa: string | boolean
  note?: string
}

export interface EntityRegime {
  id: string
  name: string
  tagline: string
  bestFor: string
  color: string
}

export const PY_ENTITY_REGIMES: EntityRegime[] = [
  {
    id: 'unipersonal',
    name: 'Unipersonal',
    tagline: 'RUC a tu nombre',
    bestFor: 'Profesional, microempresa, tester de idea',
    color: 'slate',
  },
  {
    id: 'eas',
    name: 'EAS',
    tagline: 'Empresa por Acciones Simplificadas',
    bestFor: 'Startups, nomadas, extranjeros, freelancers',
    color: 'emerald',
  },
  {
    id: 'srl',
    name: 'SRL',
    tagline: 'Sociedad de Responsabilidad Limitada',
    bestFor: '2+ socios, PYME establecida, licitaciones',
    color: 'indigo',
  },
  {
    id: 'sa',
    name: 'SA',
    tagline: 'Sociedad Anonima',
    bestFor: 'Empresa grande, cotizante, capital abierto',
    color: 'amber',
  },
]

export const PY_ENTITY_FEATURES: EntityFeature[] = [
  {
    label: 'Tiempo de apertura',
    unipersonal: '2-3 dias',
    eas: '72 horas',
    srl: '15-30 dias',
    sa: '30-60 dias',
  },
  {
    label: 'Costo total aproximado',
    unipersonal: 'Gs. 500k-1.6M',
    eas: 'Gs. 1.6M-2.6M',
    srl: 'Gs. 4.8M-6.8M',
    sa: 'Gs. 8M-15M',
  },
  {
    label: 'Capital minimo',
    unipersonal: 'No aplica',
    eas: 'Gs. 0',
    srl: 'Gs. 1M (simbolico)',
    sa: 'Gs. 1M (practica: mas alto)',
  },
  {
    label: 'Cantidad de socios',
    unipersonal: 'Solo 1',
    eas: '1 o mas',
    srl: '2 a 25',
    sa: '2 o mas (sin tope)',
  },
  {
    label: 'Responsabilidad',
    unipersonal: 'Ilimitada',
    eas: 'Limitada al aporte',
    srl: 'Limitada al aporte',
    sa: 'Limitada al aporte',
  },
  {
    label: 'Constitucion',
    unipersonal: 'RUC en DNIT',
    eas: 'Online (MIC plataforma)',
    srl: 'Escritura publica',
    sa: 'Escritura publica',
  },
  {
    label: 'Tributacion principal',
    unipersonal: 'IRP + IVA',
    eas: 'IRE 10% + IVA + IDU',
    srl: 'IRE 10% + IVA + IDU',
    sa: 'IRE 10% + IVA + IDU',
  },
  {
    label: 'RESIMPLE disponible',
    unipersonal: true,
    eas: false,
    srl: false,
    sa: false,
    note: 'RESIMPLE solo para facturacion anual < Gs. 600M',
  },
  {
    label: 'Contabilidad requerida',
    unipersonal: 'Simplificada',
    eas: 'Completa',
    srl: 'Completa',
    sa: 'Completa + auditoria',
  },
  {
    label: 'Cesion del negocio',
    unipersonal: 'No es posible (liquidar)',
    eas: 'Facil (transferencia de acciones)',
    srl: 'Aprobacion de socios',
    sa: 'Libre (salvo restriccion estatutaria)',
  },
  {
    label: 'Admite inversores extranjeros',
    unipersonal: false,
    eas: true,
    srl: true,
    sa: true,
  },
  {
    label: 'Ideal para atraer capital',
    unipersonal: false,
    eas: true,
    srl: false,
    sa: true,
  },
  {
    label: 'Auditoria externa obligatoria',
    unipersonal: false,
    eas: false,
    srl: false,
    sa: true,
  },
  {
    label: 'Reconocimiento por bancos',
    unipersonal: 'Bajo',
    eas: 'Medio (creciente)',
    srl: 'Alto',
    sa: 'Muy alto',
  },
  {
    label: 'Acepta para licitaciones DNCP',
    unipersonal: true,
    eas: true,
    srl: true,
    sa: true,
  },
  {
    label: 'Puede operar con maquila (Ley 1064/97)',
    unipersonal: false,
    eas: true,
    srl: true,
    sa: true,
  },
]

/**
 * Decision rules — answer key questions to get a recommendation.
 * Used by the intake wizard to help prospects pick an entity.
 */
export interface EntityRecommendation {
  entity: 'unipersonal' | 'eas' | 'srl' | 'sa'
  reason: string
}

export function recommendEntity(opts: {
  annualRevenueGs: number
  foreignInvestor: boolean
  coFounders: number
  seekingOutsideCapital: boolean
  regulatedSector: boolean
}): EntityRecommendation {
  const { annualRevenueGs, foreignInvestor, coFounders, seekingOutsideCapital, regulatedSector } = opts

  if (regulatedSector) {
    return {
      entity: 'sa',
      reason: 'Sector regulado (banca, seguros, cotizante) — SA es el vehiculo estandar',
    }
  }
  if (seekingOutsideCapital) {
    return {
      entity: 'eas',
      reason: 'Estructura flexible para rondas de inversion, acciones de distintas clases',
    }
  }
  if (foreignInvestor) {
    return {
      entity: 'eas',
      reason: 'Apertura remota en 72h, capital cero, reconocida para tax residency',
    }
  }
  if (coFounders >= 2) {
    return {
      entity: 'srl',
      reason: 'Gobernanza tradicional con multiples socios y alta credibilidad bancaria',
    }
  }
  if (annualRevenueGs < 500_000_000) {
    return {
      entity: 'unipersonal',
      reason: 'Facturacion baja, costo minimo; podes RESIMPLE si menos de Gs. 600M',
    }
  }
  return {
    entity: 'eas',
    reason: 'Facturacion media-alta sin socios — EAS da responsabilidad limitada sin burocracia de SRL',
  }
}
