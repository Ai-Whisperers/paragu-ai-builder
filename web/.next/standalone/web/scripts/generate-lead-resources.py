#!/usr/bin/env python3
"""Generate personalized resources for each lead: PDF brochure, QR code, SEO data."""

import json
import os
import sys
from io import BytesIO
from fpdf import FPDF
import qrcode

BASE_URL = "https://paragu-ai.com"
SITES_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'sites')
OUTPUT_DIR = os.path.join(SITES_DIR, 'lead-resources')
PREMIUM_JSON = os.path.join(SITES_DIR, 'premium-outreach.json')

# Industry-specific keywords by type
SEO_KEYWORDS = {
    'barberia': [
        'barberia {city}', 'barbero profesional {city}', 'corte de cabello {city}',
        'barberia moderna {city}', 'corte degradado {city}', 'barber shop {city}',
        'afeitado tradicional {city}', 'cortes masculinos {city}', 'mejor barberia {city}',
        'barberia cerca de mi {city}', 'barberia Paraguay', 'corte de pelo hombre {city}'
    ],
    'gimnasio': [
        'gimnasio {city}', 'entrenamiento personal {city}', 'gimnasio cerca de mi {city}',
        'membresia gimnasio {city}', 'clases de spinning {city}', 'entrenador personal {city}',
        'mejor gimnasio {city}', 'gym {city}', 'rutina de ejercicios {city}',
        'funcional training {city}', 'gimnasio Paraguay', 'clases de crossfit {city}'
    ],
    'spa': [
        'spa {city}', 'masajes {city}', 'tratamiento facial {city}', 'spa cerca de mi {city}',
        'dia de spa {city}', 'masaje relajante {city}', 'mejor spa {city}',
        'centro de bienestar {city}', 'spa Paraguay', 'tratamientos corporales {city}',
        'masaje terapeutico {city}', 'bienestar y salud {city}'
    ],
    'peluqueria': [
        'peluqueria {city}', 'peluqueria cerca de mi {city}', 'corte de pelo {city}',
        'coloracion {city}', 'peinados {city}', 'mejor peluqueria {city}',
        'tratamiento capilar {city}', 'balayage {city}', 'manicura y pedicura {city}',
        'peluqueria Paraguay', 'corte dama {city}', 'extensiones {city}'
    ],
    'depilacion': [
        'depilacion laser {city}', 'depilacion definitiva {city}', 'depilacion cera {city}',
        'laser {city}', 'centro de depilacion {city}', 'depilacion facial {city}',
        'mejor depilacion laser {city}', 'depilacion Paraguay', 'depilacion mujer {city}',
        'eliminacion de vello {city}'
    ],
    'maquillaje': [
        'maquillaje profesional {city}', 'maquillaje novias {city}', 'maquilladora {city}',
        'maquillaje social {city}', 'curso de maquillaje {city}', 'maquillaje artistico {city}',
        'maquillaje Paraguay', 'maquillaje a domicilio {city}', 'maquillaje quinceañeras {city}'
    ],
    'estetica': [
        'estetica {city}', 'centro estetico {city}', 'tratamientos esteticos {city}',
        'belleza {city}', 'clinica estetica {city}', 'estetica corporal {city}'
    ],
}

# Social media post templates for the lead's new website
SOCIAL_TEMPLATES = {
    'barberia': [
        "🔥 Ahora tenemos página web! Visitanos en {url} para agendar tu cita online. Cortes modernos, barba, afeitado clásico — todo en un solo lugar. {city} 📍",
        "💈 Dejamos de solo estar en Instagram! Ya tenemos nuestra web oficial: {url} Ahí pueden ver todos nuestros servicios y precios. {city}",
    ],
    'gimnasio': [
        "🏋️ Ya tenemos página web! Membresías, horarios y clases en {url} Vení a entrenar con nosotros en {city} 💪",
        "💪 Nueva web! En {url} encontrás toda la info sobre nuestro gym: horarios, precios, promos y más. {city}",
    ],
    'spa': [
        "🧖 Bienestar a un click! Ya tenemos web: {url} Masajes, tratamientos faciales y mucho más en {city} Reservá online ✨",
        "✨ Descubrí nuestros tratamientos en {url} Tu momento de relax está a un click. {city}",
    ],
    'peluqueria': [
        "✂️ Nueva web! Turnos online, precios y galería en {url} Te esperamos en {city} 💇‍♀️",
        "💇‍♀️ Ahora con web propia! Agendá tu turno en {url} Cortes, color, peinados y más en {city}",
    ],
    'depilacion': [
        "✨ Depilación definitiva con tecnología láser. Turnos online en {url} {city}",
        "❄️ Adiós vello! Agenda tu sesión gratis en {url} Depilación láser en {city}",
    ],
    'maquillaje': [
        "💄 Maquillaje profesional para toda ocasión. Portafolio y reservas en {url} {city}",
        "✨ Look perfecto garantizado. Agendá tu sesión en {url} Maquillaje social, novias y más. {city}",
    ],
    'estetica': [
        "💅 Tratamientos estéticos de última generación. Info y turnos en {url} {city}",
    ],
}

# Business type display names
TYPE_NAMES = {
    'barberia': 'Barbería', 'gimnasio': 'Gimnasio', 'spa': 'Spa',
    'peluqueria': 'Peluquería', 'depilacion': 'Depilación Láser',
    'maquillaje': 'Maquillaje Profesional', 'estetica': 'Estética',
}

def generate_qr(url: str, output_path: str):
    """Generate QR code image for a URL."""
    qr = qrcode.make(url)
    qr.save(output_path)

FONT_PATH = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
FONT_BOLD_PATH = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'

def strip_emoji(text: str) -> str:
    """Remove emoji characters that fpdf can't render."""
    import re
    emoji_pattern = re.compile("["
        "\U0001F600-\U0001F64F"  # emoticons
        "\U0001F300-\U0001F5FF"  # symbols & pictographs
        "\U0001F680-\U0001F6FF"  # transport & map symbols
        "\U0001F1E0-\U0001F1FF"  # flags (iOS)
        "\U00002702-\U000027B0"  # dingbats
        "\U000024C2-\U0001F251"  # enclosed
        "\U0001F900-\U0001F9FF"  # Supplemental Symbols
        "\U0001FA00-\U0001FA6F"  # Chess Symbols
        "\U0001FA70-\U0001FAFF"  # Symbols Extended-A
        "\U00002600-\U000026FF"  # Misc symbols
        "\U0000FE00-\U0000FE0F"  # variation selectors
        "\U0000200D"             # zero width joiner
        "]+", flags=re.UNICODE)
    return emoji_pattern.sub('', text).strip()

def create_pdf(name: str, biz_type: str, city: str, rating: float,
               reviews: int, phone: str, url: str, qr_path: str,
               social_post: str, keywords: list[str], notes: list[str],
               output_path: str):
    """Generate a personalized A5 flyer PDF."""
    pdf = FPDF(orientation='P', unit='mm', format='A5')
    pdf.add_page()
    pdf.add_font('DejaVu', '', FONT_PATH, uni=True)
    pdf.add_font('DejaVu', 'B', FONT_BOLD_PATH, uni=True)

    # Colors
    purple = (120, 40, 140)
    gold = (200, 160, 60)
    dark = (30, 30, 30)
    gray = (100, 100, 100)

    # Background band
    pdf.set_fill_color(*purple)
    pdf.rect(0, 0, 148, 55, 'F')

    type_name = strip_emoji(TYPE_NAMES.get(biz_type, 'Negocio'))
    display_name = strip_emoji(name)[:55]
    clean_url = url
    clean_social = strip_emoji(social_post)

    # Title
    pdf.set_text_color(255, 255, 255)
    pdf.set_font('DejaVu', 'B', 13)
    pdf.set_xy(10, 10)
    pdf.cell(128, 10, f"Paragu-AI | {type_name}", align='C')

    # Business name
    pdf.set_font('DejaVu', 'B', 11)
    pdf.set_xy(10, 24)
    pdf.cell(128, 8, display_name, align='C')

    # Subtitle with city
    pdf.set_font('DejaVu', '', 9)
    pdf.set_xy(10, 34)
    pdf.cell(128, 6, f"{city} | {rating} estrellas | {reviews} resenas", align='C')

    # Preview URL
    pdf.set_font('DejaVu', '', 7)
    pdf.set_text_color(220, 220, 255)
    pdf.set_xy(10, 44)
    pdf.cell(128, 6, clean_url, align='C')

    # Stats section
    pdf.set_text_color(*dark)
    pdf.set_font('DejaVu', 'B', 9)
    pdf.set_xy(10, 62)
    pdf.cell(128, 6, "Resumen para su sitio web")

    stats = [
        f"Tipo: {type_name}",
        f"Ubicacion: {city}",
        f"Google: {rating} estrellas ({reviews} resenas)",
        f"Contacto: {phone}",
    ]
    if notes:
        for n in notes[:2]:
            clean_n = strip_emoji(n)[:60]
            if clean_n:
                stats.append(clean_n)

    pdf.set_font('DejaVu', '', 7)
    y = 72
    for s in stats:
        pdf.set_xy(12, y)
        pdf.cell(126, 5, f"- {s}")
        y += 5

    # QR code
    if os.path.exists(qr_path):
        pdf.image(qr_path, x=108, y=62, w=28, h=28)

    # Keywords section
    kw_y = y + 5
    pdf.set_font('DejaVu', 'B', 8)
    pdf.set_xy(10, kw_y)
    pdf.set_text_color(*purple)
    pdf.cell(128, 6, "Palabras clave para Google (SEO)")

    pdf.set_text_color(*gray)
    pdf.set_font('DejaVu', '', 6)
    line_y = kw_y + 6
    for i, kw in enumerate(keywords[:15]):
        pdf.set_xy(12, line_y)
        pdf.cell(128, 3.5, kw)
        line_y += 3.5

    # Social media post
    post_y = max(line_y + 2, 170)
    if post_y < 190:
        pdf.set_font('DejaVu', 'B', 7)
        pdf.set_xy(10, post_y)
        pdf.set_text_color(*purple)
        pdf.cell(128, 5, "Post sugerido para Instagram/Facebook:")

        pdf.set_text_color(*dark)
        pdf.set_font('DejaVu', '', 6)
        pdf.set_xy(12, post_y + 5)
        pdf.multi_cell(126, 3.5, clean_social)

    # Footer
    pdf.set_text_color(*gray)
    pdf.set_font('DejaVu', '', 6)
    pdf.set_xy(10, 195)
    pdf.cell(128, 4, f"Generado por Paragu-AI | {clean_url}", align='C')

    pdf.output(output_path)


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    with open(PREMIUM_JSON) as f:
        data = json.load(f)

    leads = data['leads']
    print(f"Generating resources for {len(leads)} leads...\n")

    for i, lead in enumerate(leads):
        biz_name = lead['business_name'][:50]
        biz_type = lead['business_type']
        city = lead['city']
        rating = lead['rating']
        reviews = lead['review_count']
        phone = lead['phone']
        url = lead['preview_url']
        notes = lead.get('notes', [])
        if isinstance(notes, str):
            notes = [notes] if notes else []

        # Clean biz name for filename
        safe_name = ''.join(c for c in biz_name if c.isalnum() or c in ' _-')[:30]

        lead_dir = os.path.join(OUTPUT_DIR, f"{i+1:02d}-{safe_name}")
        os.makedirs(lead_dir, exist_ok=True)

        try:
            # 1. Generate QR code
            qr_path = os.path.join(lead_dir, 'qr-code.png')
            generate_qr(url, qr_path)

            # 2. Generate PDF brochure
            keywords_raw = SEO_KEYWORDS.get(biz_type, SEO_KEYWORDS['peluqueria'])
            keywords = [kw.format(city=city) for kw in keywords_raw]

            social_templates = SOCIAL_TEMPLATES.get(biz_type, SOCIAL_TEMPLATES['peluqueria'])
            social_post = social_templates[0].format(url=url, city=city)

            pdf_path = os.path.join(lead_dir, 'brochure.pdf')
            create_pdf(
                name=biz_name, biz_type=biz_type, city=city,
                rating=rating, reviews=reviews, phone=phone,
                url=url, qr_path=qr_path, social_post=social_post,
                keywords=keywords, notes=notes, output_path=pdf_path,
            )

            # 3. Write keywords file
            with open(os.path.join(lead_dir, 'seo-keywords.txt'), 'w') as f:
                f.write(f"SEO Keywords para {biz_name} en {city}\n")
                f.write("=" * 50 + "\n\n")
                for kw in keywords:
                    f.write(f"  {kw}\n")
                f.write(f"\n\nRecomendacion de titulo SEO:\n")
                f.write(f"  {TYPE_NAMES.get(biz_type, '')} en {city} | {biz_name}\n")
                f.write(f"\nRecomendacion de descripcion SEO:\n")
                f.write(f"  {biz_name} - {TYPE_NAMES.get(biz_type, '')} profesional en {city}. ")
                if reviews > 0:
                    f.write(f"Con {reviews} resenas y {rating} estrellas en Google. ")
                f.write("Reserva online a traves de nuestra pagina web.")

            # 4. Write social media posts
            with open(os.path.join(lead_dir, 'social-posts.txt'), 'w') as f:
                f.write(f"Posts sugeridos para {biz_name}\n")
                f.write("=" * 50 + "\n\n")
                for j, tmpl in enumerate(social_templates, 1):
                    f.write(f"Post {j}:\n{tmpl.format(url=url, city=city)}\n\n")

            # 5. Write competitor analysis
            same_type_city = [l for l in leads if l['business_type'] == biz_type and l['city'] == city and l['business_name'] != lead['business_name']]
            same_type_all = [l for l in leads if l['business_type'] == biz_type and l['business_name'] != lead['business_name']]

            with open(os.path.join(lead_dir, 'competitor-analysis.txt'), 'w') as f:
                f.write(f"Analisis de competencia para {biz_name}\n")
                f.write("=" * 50 + "\n\n")
                if same_type_city:
                    f.write(f"Competidores directos en {city}:\n")
                    for c in same_type_city[:5]:
                        f.write(f"  - {c['business_name']} ({c['rating']}*, {c['review_count']} resenas)\n")
                else:
                    f.write(f"No se encontraron competidores directos en {city}. Gran oportunidad! 🎯\n")

                f.write(f"\nOtros negocios similares en Paraguay:\n")
                for c in same_type_all[:5]:
                    f.write(f"  - {c['business_name']} en {c['city']} ({c['rating']}*, {c['review_count']} resenas)\n")

                f.write(f"\n\nVentaja de tener pagina web:\n")
                f.write(f"  - La mayoria de sus competidores tampoco tienen web\n")
                f.write(f"  - Primera impresion profesional ante clientes potenciales\n")
                f.write(f"  - Disponible 24/7 para responder preguntas frecuentes\n")
                f.write(f"  - Posicionamiento en Google para busquedas locales\n")

        except Exception as e:
            print(f"  ✗ {biz_name}: {e}")
            continue

        emoji = {'barberia':'💈','gimnasio':'🏋️','spa':'🧖','peluqueria':'✂️','depilacion':'✨','maquillaje':'💄','estetica':'💅'}.get(biz_type, '')
        print(f"  ✓ {lead['business_name'][:40]:40s} {emoji} PDF+QR+SEO+Social+Competitors")

    print(f"\n✅ All resources generated in {OUTPUT_DIR}/")
    print(f"   Structure: 01-Nombre/ brochure.pdf, qr-code.png, seo-keywords.txt, social-posts.txt, competitor-analysis.txt")

if __name__ == '__main__':
    main()
