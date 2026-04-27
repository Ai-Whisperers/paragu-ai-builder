import type { DescriptionTemplate } from './index'

export const tiendaRopaTemplate: DescriptionTemplate = ({ name, category, attributes = {} }) => {
  const talles = attributes.talles ?? 'S, M, L'
  const tela = attributes.tela ?? 'tela de calidad'
  const cat = category ?? 'moda'

  return [
    `${name}.`,
    `Diseñado en ${tela}, ideal para uso diario.`,
    `Disponible en talles ${talles}.`,
    `Encontralo en nuestra sección de ${cat}.`,
    'Consultá stock y coordiná envío por WhatsApp.',
  ].join(' ')
}
