import type { DescriptionTemplate } from './index'

export const tiendaMascotasTemplate: DescriptionTemplate = ({ name, category, attributes = {} }) => {
  const especie = attributes.especie ?? 'perros y gatos'
  const cat = category ?? 'accesorios'
  return [
    `${name}.`,
    `Producto pensado para ${especie}.`,
    `Parte de nuestra línea de ${cat} para mascotas.`,
    'Calidad garantizada. Consultanos por WhatsApp y coordinamos el envío.',
  ].join(' ')
}
