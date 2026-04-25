-- =============================================================================
-- Seed demo business data
-- Matches the demo data in web/lib/engine/demo-data.ts
-- =============================================================================

INSERT INTO businesses (slug, name, type, phone, email, whatsapp, instagram, facebook, address, neighborhood, city, tagline, hours, data_json)
VALUES
  (
    'salon-maria',
    'Salon Maria',
    'peluqueria',
    '+595981234567',
    'info@salonmaria.com.py',
    '+595981234567',
    '@salonmaria.py',
    'salonmaria.py',
    'Av. Mcal. Lopez 3245',
    'Villa Morra',
    'Asuncion',
    'Tu mejor look comienza aqui',
    '{"Lunes - Viernes": "08:00 - 19:00", "Sabado": "09:00 - 17:00", "Domingo": "Cerrado"}'::jsonb,
    '{
      "services": [
        {"name": "Corte Dama", "price": "80.000 Gs", "duration": 45, "description": "Corte y style profesional", "category": "Cortes"},
        {"name": "Corte Caballero", "price": "50.000 Gs", "duration": 30, "description": "Corte moderno y clasico", "category": "Cortes"},
        {"name": "Coloracion Completa", "priceFrom": "150.000 Gs", "duration": 90, "description": "Color base completo", "category": "Color"},
        {"name": "Mechas/Highlighting", "priceFrom": "200.000 Gs", "duration": 120, "description": "Para brillo natural", "category": "Color"},
        {"name": "Balayage", "priceFrom": "250.000 Gs", "duration": 150, "description": "Tecnica francesa de mano alzada", "category": "Color"},
        {"name": "Keratina Intensiva", "price": "300.000 Gs", "duration": 120, "description": "Alisa y repara", "category": "Tratamientos"}
      ],
      "team": [
        {"name": "Maria Gonzalez", "role": "Directora & Estilista Senior", "bio": "Con 15 anos de experiencia en coloracion y cortes de tendencia."},
        {"name": "Ana Benitez", "role": "Colorista", "bio": "Especialista en balayage y mechas naturales."},
        {"name": "Carlos Ruiz", "role": "Estilista", "bio": "Experto en cortes modernos para dama y caballero."}
      ],
      "testimonials": [
        {"quote": "El mejor salon de Asuncion! Maria siempre sabe exactamente lo que quiero.", "author": "Laura P.", "rating": 5},
        {"quote": "Mi balayage quedo increible. Totalmente recomendado.", "author": "Patricia M.", "rating": 5},
        {"quote": "Atencion de primera. Siempre salgo feliz del salon.", "author": "Sofia R.", "rating": 4}
      ]
    }'::jsonb
  ),
  (
    'gymfit-py',
    'GymFit Paraguay',
    'gimnasio',
    '+595987654321',
    NULL,
    '+595987654321',
    '@gymfit.py',
    NULL,
    'Av. Espana 1234',
    'Centro',
    'Asuncion',
    'Transforma tu cuerpo, transforma tu vida',
    '{"Lunes - Viernes": "06:00 - 22:00", "Sabado": "07:00 - 18:00", "Domingo": "08:00 - 14:00"}'::jsonb,
    '{
      "services": [
        {"name": "Musculacion", "price": "150.000 Gs/mes", "description": "Acceso completo a la sala de pesas"},
        {"name": "Crossfit", "price": "200.000 Gs/mes", "description": "Clases de alta intensidad"},
        {"name": "Yoga", "price": "120.000 Gs/mes", "description": "Clases de yoga y meditacion"},
        {"name": "Personal Trainer", "priceFrom": "300.000 Gs/mes", "description": "Entrenamiento personalizado"},
        {"name": "Plan Full", "price": "250.000 Gs/mes", "description": "Acceso a todas las actividades"}
      ],
      "team": [
        {"name": "Carlos Benitez", "role": "Entrenador Principal", "bio": "Certificado NSCA con 10 anos de experiencia."},
        {"name": "Lucia Fernandez", "role": "Instructora de Yoga", "bio": "Formada en India, 8 anos ensenando."}
      ],
      "testimonials": [
        {"quote": "Baje 15 kilos en 6 meses. El equipo de GymFit es increible.", "author": "Roberto G.", "rating": 5},
        {"quote": "Las clases de crossfit son brutales pero los resultados hablan.", "author": "Marcos V.", "rating": 5}
      ]
    }'::jsonb
  ),
  (
    'spa-serenidad',
    'Spa Serenidad',
    'spa',
    '+595976543210',
    'reservas@spaserenidad.com.py',
    '+595976543210',
    '@spa.serenidad',
    NULL,
    'Calle Primera 567',
    'Carmelitas',
    'Asuncion',
    'Tu oasis de paz en la ciudad',
    NULL,
    '{
      "services": [
        {"name": "Masaje Relajante", "price": "180.000 Gs", "duration": 60, "description": "Masaje de cuerpo completo"},
        {"name": "Facial Anti-Edad", "price": "200.000 Gs", "duration": 75, "description": "Tratamiento rejuvenecedor"},
        {"name": "Circuito Spa", "price": "250.000 Gs", "duration": 120, "description": "Sauna + piscina + masaje"},
        {"name": "Aromaterapia", "price": "150.000 Gs", "duration": 60, "description": "Masaje con aceites esenciales"}
      ],
      "testimonials": [
        {"quote": "Un lugar magico. Sali flotando despues del circuito spa.", "author": "Carmen L.", "rating": 5},
        {"quote": "El mejor spa de Asuncion sin duda. Servicio impecable.", "author": "Diana R.", "rating": 5}
      ]
    }'::jsonb
  );
