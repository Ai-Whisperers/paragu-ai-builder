#!/usr/bin/env python3
"""Generate detailed AI image prompts for each lead's preview site."""

import json, os

SITES_DIR = os.path.join(os.path.dirname(__file__), '../..', 'sites')
OUTPUT_DIR = os.path.join(SITES_DIR, 'image-prompts')

HERO_PROMPTS = {
    'barberia': lambda biz, city, notes: f"""Barbería moderna "{biz}" en {city}, Paraguay. {notes} Sillones de barbería vintage, pisos a cuadros blanco y negro, barberos profesionales trabajando, luz cálida, ambiente masculino elegante, fotografía realista de alta calidad --ar 21:9""",
    'gimnasio': lambda biz, city, notes: f"""Gimnasio "{biz}" en {city}, Paraguay. {notes} Equipamiento profesional, pesas, mancuernas, ambiente energético, luz natural, personas entrenando, motivación, fotografía realista --ar 21:9""",
    'spa': lambda biz, city, notes: f"""Spa "{biz}" en {city}, Paraguay. {notes} Ambiente de relax, velas, toallas blancas, luz tenue, decoración zen, lujo y bienestar, fotografía profesional --ar 21:9""",
    'peluqueria': lambda biz, city, notes: f"""Salón de belleza "{biz}" en {city}, Paraguay. {notes} Estaciones con espejos iluminados, sillas profesionales, decoración moderna, luz natural, ambiente acogedor --ar 21:9""",
    'depilacion': lambda biz, city, notes: f"""Clínica de depilación "{biz}" en {city}, Paraguay. {notes} Equipo láser moderno, camilla profesional, ambiente clínico limpio, profesional con uniforme, tecnología visible --ar 21:9""",
    'maquillaje': lambda biz, city, notes: f"""Estudio de maquillaje "{biz}" en {city}, Paraguay. {notes} Tocador con espejo iluminado, pinceles, paletas de maquillaje, luz de anillo, ambiente elegante --ar 21:9""",
    'estetica': lambda biz, city, notes: f"""Centro de estética "{biz}" en {city}, Paraguay. {notes} Equipo de última generación, ambiente clínico-lujoso, tratamientos faciales, luz blanca limpia --ar 21:9""",
}

GALLERY_PROMPTS = {
    'barberia': [
        lambda b,c: f"Primer plano de fade degradado en {b}, {c}. Barbero concentrado, máquina profesional, detalle del trabajo, iluminación focal --ar 4:3",
        lambda b,c: f"Estación de barbero en {b}, {c}. Navajas, tijeras, peines, productos importados, organización profesional --ar 4:3",
        lambda b,c: f"Afeitado con toalla caliente en {b}, {c}. Vapor, navaja recta, cliente relajado, ambiente tradicional --ar 4:3",
        lambda b,c: f"Interior de {b} en {c}. Múltiples estaciones, clientes atendidos, decoración, amplitud del local --ar 4:3",
        lambda b,c: f"Perfilado de barba terminado en {b}, {c}. Resultado profesional, cliente satisfecho mirándose al espejo --ar 4:3",
        lambda b,c: f"Productos de barbería en {b}, {c}. Pomadas, ceras, aceites, vitrina de exhibición profesional --ar 4:3",
    ],
    'gimnasio': [
        lambda b,c: f"Área de pesas libres en {b}, {c}. Mancuernas ordenadas, barra olímpica, ambiente de entrenamiento --ar 4:3",
        lambda b,c: f"Persona entrenando en {b}, {c}. Músculos en acción, esfuerzo, determinación, iluminación dramática --ar 4:3",
        lambda b,c: f"Sala de clases grupales en {b}, {c}. Colchonetas, pelotas, bandas elásticas, preparado para funcional --ar 4:3",
        lambda b,c: f"Bicicletas de spinning en {b}, {c}. Sala con luces de colores, ambiente motivacional --ar 4:3",
        lambda b,c: f"Antes y después de transformación física en {b}, {c}. Progreso visible, resultados reales --ar 4:3",
        lambda b,c: f"Rincón de estiramiento en {b}, {c}. Colchonetas, yoga, ambiente tranquilo dentro del gimnasio --ar 4:3",
    ],
    'spa': [
        lambda b,c: f"Camilla de masajes en {b}, {c}. Toallas blancas, velas, aceites esenciales, luz cálida, ambiente zen --ar 4:3",
        lambda b,c: f"Tratamiento facial en {b}, {c}. Esteticista aplicando mascarilla, cliente relajado, luz suave --ar 4:3",
        lambda b,c: f"Sala de espera de {b}, {c}. Sillones cómodos, té, revista, decoración tranquila, plantas --ar 4:3",
        lambda b,c: f"Hidroterapia en {b}, {c}. Agua cristalina, azulejos claros, ambiente de relax --ar 4:3",
        lambda b,c: f"Productos de spa en {b}, {c}. Cremas, aceites, sales, envases elegantes, exhibición boutique --ar 4:3",
        lambda b,c: f"Cabina de tratamiento en {b}, {c}. Decoración armoniosa, detalles cuidados, paz y tranquilidad --ar 4:3",
    ],
    'peluqueria': [
        lambda b,c: f"Corte y coloración en {b}, {c}. Estilista trabajando, mechas, tintura profesional, luz natural --ar 4:3",
        lambda b,c: f"Lavacabezas en {b}, {c}. Cliente cómodo, shampoo profesional, ambiente relajante --ar 4:3",
        lambda b,c: f"Resultado de peinado en {b}, {c}. Cliente feliz, look terminado, estilo moderno --ar 4:3",
        lambda b,c: f"Interior del salón {b}, {c}. Estaciones de trabajo, espejos, ambiente completo --ar 4:3",
        lambda b,c: f"Productos capilares en {b}, {c}. Shampoos, acondicionadores, tratamientos en exhibición --ar 4:3",
    ],
    'depilacion': [
        lambda b,c: f"Equipo láser en {b}, {c}. Tecnología de última generación, pantalla digital, cabezal de tratamiento --ar 4:3",
        lambda b,c: f"Aplicación de gel en {b}, {c}. Preparación para láser, profesional con guantes, cuidado --ar 4:3",
        lambda b,c: f"Sala de espera de {b}, {c}. Ambiente acogedor, revistas, recepción --ar 4:3",
        lambda b,c: f"Resultado de depilación en {b}, {c}. Piel suave, sin vello, antes y después --ar 4:3",
        lambda b,c: f"Productos post-tratamiento en {b}, {c}. Cremas hidratantes, calmantes, exhibición --ar 4:3",
    ],
    'maquillaje': [
        lambda b,c: f"Maquillaje de novia en {b}, {c}. Look terminado, primer plano, ojos y labios perfectos --ar 4:3",
        lambda b,c: f"Paletas y brochas en {b}, {c}. Pinceles organizados, maquillaje de alta gama, mesa de trabajo --ar 4:3",
        lambda b,c: f"Maquillaje social en {b}, {c}. Look natural y moderno, cliente satisfecha --ar 4:3",
        lambda b,c: f"Espacio de trabajo en {b}, {c}. Tocador, espejo iluminado, silla profesional --ar 4:3",
    ],
}

def get_notes(biz_name):
    """Return known notes about a business from our research."""
    notes_map = {
        'TAJOS Barberos (Central)': '3 sucursales. Marca premium. Público joven y moderno.',
        'Barberia H2O': 'Frente a la UNA. Clientes universitarios. Estilo clásico-moderno.',
        'Portas barber shop': 'Se mudaron a nuevo local. Cortes + barba + cejas + facial.',
        'Lyon Gym': 'Piso 7 de edificio corporativo en Trinidad. Zona premium de Asunción.',
        'Urban Spa Acquadolce': 'Solo mujeres. 58K seguidores en Facebook. Precios desde Gs 80.000.',
        'Teranu': 'Solo hombres. 15 años en el mercado. Spa masculino premium.',
        'RENUVA - Clínica estética y laser': 'Clínica médica estética. Tecnología no invasiva.',
        'Overfit Gym': 'Capiatá. Zona en crecimiento. Público familiar.',
        'Medina Fitness': 'Dos sucursales. 6.700 seguidores en Facebook.',
        'Gym Victor Niella': '27 años de trayectoria. Dueño es presidente de la Federación de Fisicoculturismo.',
        'HidroBaby | Babyspa | Spa de bebés | Hidroestimulación': 'Babyspa. 736 reseñas 5 estrellas.',
        'Bonita Depilaciones': 'Depilación con cera y láser. Atención personalizada.',
    }
    return notes_map.get(biz_name, '')

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Load leads with preview slugs
    with open(os.path.join(SITES_DIR, 'premium-outreach.json')) as f:
        raw = json.load(f)['leads']
    
    seen = set()
    leads = []
    for l in raw:
        url = l.get('preview_url', '') or ''
        slug = url.rstrip('/').split('/')[-1] if url else ''
        if slug and slug not in seen:
            seen.add(slug)
            leads.append((slug, l['business_name'], l['business_type'], l['city']))
    
    # Process each lead
    for i, (slug, biz_name, biz_type, city) in enumerate(leads):
        lead_dir = os.path.join(OUTPUT_DIR, f"{i+1:02d}-{slug.replace('preview-','')}")
        os.makedirs(lead_dir, exist_ok=True)
        
        biz_name_clean = biz_name.replace('"', '').replace('"', '')[:40]
        notes = get_notes(biz_name)
        
        # Hero prompt
        hero_fn = HERO_PROMPTS.get(biz_type, HERO_PROMPTS['peluqueria'])
        hero_prompt = hero_fn(biz_name_clean, city, notes)
        
        # Gallery prompts
        gallery_fns = GALLERY_PROMPTS.get(biz_type, GALLERY_PROMPTS['peluqueria'])
        gallery_prompts = [fn(biz_name_clean, city) for fn in gallery_fns]
        
        # Write prompts file
        with open(os.path.join(lead_dir, 'prompts.md'), 'w') as f:
            f.write(f"# {biz_name}\n\n")
            f.write(f"**Tipo:** {biz_type} | **Ciudad:** {city}\n\n")
            if notes:
                f.write(f"**Notas:** {notes}\n\n")
            f.write(f"---\n\n")
            f.write(f"## Hero Image (1920x1080)\n\n")
            f.write(f"```\n{hero_prompt}\n```\n\n")
            f.write(f"---\n\n")
            f.write(f"## Gallery Images (800x600)\n\n")
            for j, gp in enumerate(gallery_prompts, 1):
                f.write(f"### Foto {j}\n")
                f.write(f"```\n{gp}\n```\n\n")
        
        # Also write as JSON for machine processing
        with open(os.path.join(lead_dir, 'prompts.json'), 'w') as f:
            json.dump({
                'slug': slug,
                'business_name': biz_name,
                'business_type': biz_type,
                'city': city,
                'notes': notes,
                'hero_prompt': hero_prompt,
                'gallery_prompts': gallery_prompts,
            }, f, indent=2, ensure_ascii=False)
        
        print(f"  ✓ {biz_name[:40]:40s} | {biz_type} en {city}")
    
    # Generate index
    index = []
    for root, dirs, files in os.walk(OUTPUT_DIR):
        if 'prompts.json' in files:
            with open(os.path.join(root, 'prompts.json')) as f:
                index.append(json.load(f))
    
    with open(os.path.join(OUTPUT_DIR, '_index.json'), 'w') as f:
        json.dump(index, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Generated image prompts for {len(leads)} leads")
    print(f"📁 Output: {OUTPUT_DIR}")

if __name__ == '__main__':
    main()
