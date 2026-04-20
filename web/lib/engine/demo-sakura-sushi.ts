/**
 * DEPRECATED — single-tenant demo fixture. Kept because `data-loader.ts` still
 * imports it as a fallback for the `sakura-sushi` slug. Replace with the
 * synthetic factory pattern when the fallback path is refactored.
 *
 * Demo business: Sakura Sushi - Traditional sushi bar
 * Location: Asuncion, Paraguay
 */

export const SAKURA_SUSHI_DEMO = {
  name: 'Sakura Sushi',
  slug: 'sakura-sushi',
  type: 'sushi_bar',
  tagline: 'Auténtico sushi japonés en el corazón de Asunción',
  city: 'Asuncion',
  neighborhood: 'Villa Morra',
  address: 'Av. Mariscal López 3456, Paseo La Galería',
  phone: '+595981234567',
  email: 'info@sakurasushi.com.py',
  whatsapp: '+595981234567',
  instagram: '@sakurasushi.py',
  facebook: 'SakuraSushiPY',
  hours: {
    'Lunes - Jueves': '12:00 - 15:00, 19:00 - 23:00',
    'Viernes - Sábado': '12:00 - 15:00, 19:00 - 00:00',
    'Domingo': '18:00 - 22:00'
  },
  services: [
    { name: 'Sashimi Mixto', price: '85.000 Gs', duration: 0, description: '5 variedades de pescado fresco del día', category: 'Sashimi' },
    { name: 'Nigiri de Salmón', price: '35.000 Gs', duration: 0, description: '2 piezas de salmón noruego sobre arroz', category: 'Nigiri' },
    { name: 'Nigiri de Atún', price: '45.000 Gs', duration: 0, description: '2 piezas de atún rojo sobre arroz', category: 'Nigiri' },
    { name: 'California Roll', price: '38.000 Gs', duration: 0, description: '8 piezas con cangrejo, aguacate y pepino', category: 'Maki' },
    { name: 'Sakura Roll', price: '52.000 Gs', duration: 0, description: '8 piezas especialidad de la casa con langostino tempura', category: 'Especial' },
    { name: 'Dragon Roll', price: '58.000 Gs', duration: 0, description: '8 piezas con anguila, aguacate y salsa unagi', category: 'Especial' },
    { name: 'Temaki de Salmón', price: '25.000 Gs', duration: 0, description: 'Cono de alga nori con salmón fresco', category: 'Temaki' },
    { name: 'Edamame', price: '18.000 Gs', duration: 0, description: 'Porción de vainas de soja al vapor con sal', category: 'Entradas' },
    { name: 'Gyozas', price: '28.000 Gs', duration: 0, description: '5 empanadas japonesas rellenas de cerdo', category: 'Entradas' },
    { name: 'Miso Soup', price: '12.000 Gs', duration: 0, description: 'Sopa tradicional de miso con tofu y alga wakame', category: 'Entradas' },
    { name: 'Omakase Clásico', price: '250.000 Gs', duration: 60, description: '8 piezas seleccionadas por el chef', category: 'Omakase' },
    { name: 'Omakase Premium', price: '450.000 Gs', duration: 90, description: '12 piezas con sake pairing incluido', category: 'Omakase' }
  ],
  team: [
    { 
      name: 'Takeshi Yamamoto', 
      role: 'Chef Principal', 
      bio: 'Formado en Tokio durante 15 años. Especialista en sushi Edomae y omakase. Certificado por la Asociación de Sushi de Japón.' 
    },
    { 
      name: 'Carlos Sato', 
      role: 'Sous Chef', 
      bio: '10 años de experiencia en restaurantes japoneses. Experto en sashimi y presentación tradicional.' 
    },
    { 
      name: 'Ana Nakamura', 
      role: 'Hostess', 
      bio: 'Encargada de la experiencia del cliente. Te ayuda a elegir entre nuestro menú y explica cada platillo.' 
    }
  ],
  testimonials: [
    { 
      quote: 'El mejor sushi que he probado en Paraguay. El omakase es una experiencia inolvidable.', 
      author: 'María González', 
      rating: 5 
    },
    { 
      quote: 'Auténtico sabor japonés. Se nota la dedicación del chef en cada pieza.', 
      author: 'Roberto Martínez', 
      rating: 5 
    },
    { 
      quote: 'Ambiente elegante y servicio impecable. Perfecto para citas especiales.', 
      author: 'Lucía Benítez', 
      rating: 5 
    }
  ]
}