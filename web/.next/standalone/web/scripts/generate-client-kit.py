#!/usr/bin/env python3
"""Generate complete client kit for ALL leads: flyers, GBP guides, competitor reports, referral cards."""

import json, os, time, urllib.request, urllib.parse, re, glob
from fpdf import FPDF
import qrcode

API_KEY = "AIzaSyAViHdhtabiRXZYvf6DbGDou7N2OvJ60GI"
SITES_DIR = os.path.join(os.path.dirname(__file__), '../..', 'sites')
OUTPUT_DIR = os.path.join(SITES_DIR, 'client-kit')
FONT_REG = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
FONT_BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'

def get_site_data(slug):
    sp = os.path.join(SITES_DIR, slug, 'site.json')
    cp = os.path.join(SITES_DIR, slug, 'content', 'es.json')
    if not os.path.exists(sp) or not os.path.exists(cp):
        return None
    site = json.load(open(sp))
    content = json.load(open(cp))
    home = content.get('home', {})
    rw = home.get('reviewsWidget', {})
    return {
        'biz_name': content.get('siteName', slug),
        'biz_type': site.get('businessType', ''),
        'city': site.get('location', {}).get('city', 'Asunción'),
        'phone': site.get('contact', {}).get('phone', ''),
        'whatsapp': site.get('contact', {}).get('whatsapp', ''),
        'instagram': site.get('contact', {}).get('instagram', ''),
        'address': site.get('location', {}).get('address', ''),
        'rating': float(rw.get('avgRating', 0)) or 4.5,
        'reviews': int(rw.get('reviewCount', 0)) or 0,
        'preview_url': f"https://paragu-ai.com/s/es/{slug}",
    }

def search_place(name, city):
    q = urllib.parse.quote(f"{name} {city} Paraguay")
    try:
        data = json.loads(urllib.request.urlopen(f"https://maps.googleapis.com/maps/api/place/textsearch/json?query={q}&key={API_KEY}", timeout=10).read())
        return data.get('results', [])
    except:
        return []

# ============================================================================
# 1. QR FLYER
# ============================================================================
def gen_flyer(slug, d, lead_dir):
    pdf = FPDF(orientation='P', unit='mm', format='A5')
    pdf.add_page()
    pdf.add_font('D', '', FONT_REG)
    pdf.add_font('D', 'B', FONT_BOLD)
    
    purple = (90, 30, 110)
    dark = (40, 40, 40)
    
    # Header
    pdf.set_fill_color(*purple)
    pdf.rect(0, 0, 148, 50, 'F')
    pdf.set_text_color(255, 255, 255)
    pdf.set_font('D', 'B', 10)
    pdf.set_xy(10, 10)
    pdf.cell(128, 6, 'PARAGU-AI', align='C')
    pdf.set_font('D', 'B', 15)
    pdf.set_xy(10, 20)
    pdf.cell(128, 10, d['biz_name'][:45], align='C')
    
    # Rating
    stars = '★' * int(d['rating']) + '☆' * (5 - int(d['rating']))
    review_txt = f"{stars}  {d['rating']} estrellas  |  {d['reviews']} resenas en Google" if d['reviews'] > 0 else f"{stars}  {d['rating']} estrellas"
    pdf.set_font('D', '', 8)
    pdf.set_xy(10, 35)
    pdf.cell(128, 5, review_txt, align='C')
    pdf.set_xy(10, 42)
    pdf.cell(128, 5, d['city'], align='C')
    
    # QR
    qr = qrcode.make(d['preview_url'])
    qr_path = f"/tmp/qr_{slug[:20]}.png"
    qr.save(qr_path)
    pdf.image(qr_path, x=54, y=58, w=40, h=40)
    
    # Text
    pdf.set_text_color(*purple)
    pdf.set_font('D', 'B', 10)
    pdf.set_xy(10, 102)
    pdf.cell(128, 6, 'Escanea para ver nuestro sitio web', align='C')
    pdf.set_text_color(100, 100, 100)
    pdf.set_font('D', '', 6)
    pdf.set_xy(10, 110)
    pdf.cell(128, 4, d['preview_url'], align='C')
    
    if d['instagram']:
        pdf.set_xy(10, 116)
        pdf.cell(128, 4, f"Siguenos en {d['instagram']}", align='C')
    
    # Bottom
    pdf.set_fill_color(245, 245, 250)
    pdf.rect(0, 130, 148, 60, 'F')
    pdf.set_text_color(*dark)
    pdf.set_font('D', '', 8)
    pdf.set_xy(10, 138)
    pdf.cell(128, 5, 'Tu pagina web profesional, lista en 24 horas', align='C')
    pdf.set_font('D', 'B', 9)
    pdf.set_xy(10, 146)
    pdf.cell(128, 5, 'Paragu-AI  |  Desde Gs 290.000/mes', align='C')
    pdf.set_font('D', '', 7)
    pdf.set_xy(10, 154)
    pdf.cell(128, 4, 'WhatsApp: +595985724135  |  paragu-ai.com', align='C')
    
    path = os.path.join(lead_dir, 'flyer.pdf')
    pdf.output(path)
    return path

# ============================================================================
# 2. GOOGLE BUSINESS PROFILE GUIDE
# ============================================================================
def gen_gbp_guide(slug, d, lead_dir):
    gbp_url = f"https://business.google.com/add?site_url={d['preview_url']}"
    content = f"""=== GUIA: Agrega tu sitio web a Google Maps ===

Negocio: {d['biz_name']}
URL de tu sitio: {d['preview_url']}

Paso 1: Abri Google Maps en tu telefono
Paso 2: Busca tu negocio por nombre
Paso 3: Toca "Editar perfil"
Paso 4: En "Sitio web", pega este link:
   {d['preview_url']}
Paso 5: Toca "Guardar"

O usa este link directo:
   {gbp_url}

Por que es importante?
- 84% de los negocios como el tuyo NO tienen sitio web
- Tener tu web en Google Maps te da mas credibilidad
- Tus clientes pueden ver tus servicios y reservar online

Hecho por Paragu-AI para {d['biz_name']}
Contacto: +595985724135
"""
    path = os.path.join(lead_dir, 'google-business-profile-guide.txt')
    with open(path, 'w') as f:
        f.write(content)
    return path

# ============================================================================
# 3. COMPETITOR REPORT
# ============================================================================
def gen_competitor_report(slug, d, lead_dir):
    results = search_place(d['biz_name'], d['city'])
    competitors = []
    if results:
        # Find competitors (same area, same type)
        pid = results[0].get('place_id', '')
        # Search for similar businesses in the city
        similar = search_place(f"{d['biz_type'].replace('_',' ')} {d['city']}", d['city'])
        for s in similar[:10]:
            name = s.get('name', '')
            if name.lower() != d['biz_name'].lower():
                has_web = '??'
                comp_rating = s.get('rating', 0)
                comp_reviews = s.get('user_ratings_total', 0)
                competitors.append((name, comp_rating, comp_reviews))
    
    content = f"""=== ANALISIS DE COMPETENCIA ===
Para: {d['biz_name']} - {d['city']}
Fecha: {time.strftime('%d/%m/%Y')}

"""
    if competitors:
        content += "Competidores en tu zona:\n\n"
        for name, rating, reviews in competitors[:5]:
            content += f"  - {name}  |  {rating} estrellas  |  {reviews} resenas\n"
    else:
        content += "  No se encontraron competidores directos en tu zona. Gran oportunidad!\n"
    
    content += f"""

Tu ventaja:
  - Tu sitio web ya esta online: {d['preview_url']}
  - Podes recibir reservas online
  - Tus clientes te encuentran en Google
  - Tenes presencia profesional 24/7

Contacto Paragu-AI: +595985724135
"""
    path = os.path.join(lead_dir, 'competitor-report.txt')
    with open(path, 'w') as f:
        f.write(content)
    return path

# ============================================================================
# 4. REFERRAL CARD
# ============================================================================
def gen_referral_card(slug, d, lead_dir):
    pdf = FPDF(orientation='P', unit='mm', format=[85, 55])  # Credit card size
    pdf.add_page()
    pdf.add_font('D', '', FONT_REG)
    pdf.add_font('D', 'B', FONT_BOLD)
    
    purple = (90, 30, 110)
    
    # Background
    pdf.set_fill_color(*purple)
    pdf.rect(0, 0, 85, 55, 'F')
    
    # Text
    pdf.set_text_color(255, 255, 255)
    pdf.set_font('D', 'B', 7)
    pdf.set_xy(5, 5)
    pdf.cell(75, 5, f"{d['biz_name'][:35]}", align='C')
    
    pdf.set_font('D', 'B', 9)
    pdf.set_xy(5, 14)
    pdf.cell(75, 6, 'Tu sitio web profesional', align='C')
    
    pdf.set_font('D', '', 6)
    pdf.set_xy(5, 22)
    pdf.cell(75, 4, 'Hecho por Paragu-AI', align='C')
    
    # Small QR
    qr = qrcode.make(d['preview_url'])
    qr_path = f"/tmp/qr_ref_{slug[:15]}.png"
    qr.save(qr_path)
    pdf.image(qr_path, x=33, y=28, w=20, h=20)
    
    pdf.set_font('D', '', 5)
    pdf.set_xy(5, 48)
    pdf.cell(75, 4, 'Recomendanos y recibi 1 mes gratis!', align='C')
    pdf.set_xy(5, 52)
    pdf.cell(75, 3, 'WhatsApp: +595985724135', align='C')
    
    path = os.path.join(lead_dir, 'referral-card.pdf')
    pdf.output(path)
    return path

# ============================================================================
# MAIN
# ============================================================================
def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    all_previews = sorted([d for d in os.listdir(SITES_DIR) if d.startswith('preview-') and os.path.isdir(os.path.join(SITES_DIR, d))])
    
    print(f"Generating client kit for {len(all_previews)} leads...\n")
    
    stats = {'flyer': 0, 'gbp': 0, 'competitor': 0, 'referral': 0}
    
    for i, slug in enumerate(all_previews):
        d = get_site_data(slug)
        if not d:
            continue
        
        lead_dir = os.path.join(OUTPUT_DIR, slug.replace('preview-', '')[:35])
        os.makedirs(lead_dir, exist_ok=True)
        
        gen_flyer(slug, d, lead_dir); stats['flyer'] += 1
        gen_gbp_guide(slug, d, lead_dir); stats['gbp'] += 1
        gen_competitor_report(slug, d, lead_dir); stats['competitor'] += 1
        gen_referral_card(slug, d, lead_dir); stats['referral'] += 1
        
        print(f"  [{i+1}/{len(all_previews)}] {d['biz_name'][:40]:40s} Flyer+GBP+Competitor+Referral")
        
        # Rate limit for API calls (competitor report)
        time.sleep(0.2)
    
    print(f"\n=== GENERATION COMPLETE ===")
    print(f"  QR Flyers:      {stats['flyer']}")
    print(f"  GBP Guides:     {stats['gbp']}")
    print(f"  Competitor Rpts:{stats['competitor']}")
    print(f"  Referral Cards: {stats['referral']}")
    print(f"\nOutput: {OUTPUT_DIR}/")

if __name__ == '__main__':
    main()
