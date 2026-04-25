import type { DescriptionTemplate } from './index'

export const tiendaBebesTemplate: DescriptionTemplate = ({ name, category, attributes = {} }) => {
  const edad = attributes.edad ?? '0 a 24 meses'
  const cat = category ?? 'accesorios para bebé'
  return [
    `${name}.`,
    `Recomendado para bebés de ${edad}.`,
    `Encontralo en nuestra sección de ${cat}.`,
    'Materiales seguros y testeados. Te atendemos por WhatsApp.',
  ].join(' ')
}
