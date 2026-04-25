import type { DescriptionTemplate } from './index'

export const genericRetailTemplate: DescriptionTemplate = ({ name, category }) => {
  const parts: string[] = []
  parts.push(`${name} — disponible en nuestra tienda.`)
  if (category) parts.push(`Parte de nuestra colección de ${category}.`)
  parts.push('Calidad garantizada. Consultanos por WhatsApp para más detalles.')
  return parts.join(' ')
}
