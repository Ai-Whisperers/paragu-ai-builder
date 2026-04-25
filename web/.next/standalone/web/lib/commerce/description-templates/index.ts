import { tiendaRopaTemplate } from './tienda-ropa'
import { tiendaMascotasTemplate } from './tienda-mascotas'
import { tiendaBebesTemplate } from './tienda-bebes'
import { genericRetailTemplate } from './generic'

export interface DescriptionContext {
  name: string
  category?: string
  attributes?: Record<string, string>
}

export type DescriptionTemplate = (ctx: DescriptionContext) => string

const TEMPLATES: Record<string, DescriptionTemplate> = {
  tienda_ropa: tiendaRopaTemplate,
  tienda_mascotas: tiendaMascotasTemplate,
  tienda_bebes: tiendaBebesTemplate,
}

export function generateDescription(businessType: string, ctx: DescriptionContext): string {
  const template = TEMPLATES[businessType] ?? genericRetailTemplate
  return template(ctx)
}
