#!/usr/bin/env python3
"""Enrich all preview sites with real lead data from Supabase."""

import json, os, sys
from supabase import create_client

SUPABASE_URL = "https://qyvokpribmbrosafntqa.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dm9rcHJpYm1icm9zYWZudHFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjMxODE1NSwiZXhwIjoyMDkxODk0MTU1fQ.rphBsAVMuI_2X8RCU7D0JiGd8pqqdpcQ7vpUrirU06g"

INSTAGRAM_HANDLES = {
    'TAJOS Barberos (Central)': '@tajosbarberos',
    'Barberia H2O': '@barberiah2o',
    'Portas barber shop': '@portas_barbershop',
    'Urban Spa Acquadolce': '@acquadolcespa',
    'Overfit Gym': '@overfitgym',
    'Medina Fitness': '@medinafitness_gym',
    'Gym Victor Niella': '@gimnasiovictorniella',
    'Teranu': '@teranuspa',
    'Barber club py': '@thebarberclubpy',
    'Lyon Gym': '@lyongympy',
    'RENUVA - Clínica estética y laser': '@clinica.renuva',
    'Bonita Depilaciones': '@bonitadepilaciones',
    'Leticia Carballo Makeup & Store': '@lcmakeuphaircolor',
    'HidroBaby | Babyspa | Spa de bebés | Hidroestimulación': '@aguadulcebebes',
}

# Fetch leads data
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
resp = supabase.table('leads').select('*').not_.is_('preview_site_id', 'null').execute()
leads = resp.data
print(f"Found {len(leads)} leads with preview sites")

SITES_DIR = os.path.join(os.path.dirname(__file__), '../..', 'sites')
updated = 0

for lead in leads:
    preview_slug = lead.get('preview_site_id', '')
    if not preview_slug: continue
    
    content_path = os.path.join(SITES_DIR, preview_slug, 'content', 'es.json')
    site_path = os.path.join(SITES_DIR, preview_slug, 'site.json')
    
    if not os.path.exists(content_path) or not os.path.exists(site_path):
        continue
    
    with open(content_path) as f:
        content = json.load(f)
    with open(site_path) as f:
        site = json.load(f)
    
    biz_name = (lead.get('business_name') or '').strip()
    biz_type = (lead.get('business_type') or 'peluqueria').strip()
    city = (lead.get('city') or 'Asunción').strip()
    phone = (lead.get('phone') or '').strip()
    rating = lead.get('rating') or 0
    review_count = lead.get('review_count') or 0
    address = (lead.get('address') or '').strip()
    coordinates = lead.get('coordinates')
    instagram = INSTAGRAM_HANDLES.get(biz_name, '')
    
    # Update site.json contact info
    site['contact']['phone'] = phone
    site['contact']['whatsapp'] = phone
    if instagram:
        site['contact']['instagram'] = instagram
    if address:
        site['location']['address'] = address
    if coordinates:
        site['location']['coordinates'] = coordinates
    site['location']['city'] = city
    
    # Update content with real data
    home = content.get('home', {})
    if not home:
        home = {}
    
    if 'hero' not in home: home['hero'] = {}
    home['hero']['subheadline'] = f"En {city} con atencion personalizada y la mejor calidad."
    
    if 'seo' not in home: home['seo'] = {}
    if review_count > 0:
        seo_desc = f"{biz_name} en {city}. {int(rating)} estrellas y {review_count} resenas en Google. Conocenos!"
        home['seo']['description'] = seo_desc[:160]
    
    if 'contact' not in home: home['contact'] = {}
    home['contact']['phone'] = phone
    home['contact']['city'] = city
    
    if 'testimonials' in home and len(home['testimonials'].get('items', [])) >= 3:
        items = home['testimonials']['items']
        if review_count > 50:
            items[0]['text'] = f"Excelente atencion. {int(rating)} estrellas bien merecidas."
            items[1]['text'] = f" Uno de los mejores negocios de {city}. Súper recomendado."
            items[2]['text'] = f"Llevo anos viniendo y siempre cumplen. {int(rating)}/5."
    
    # Update google reviews widget
    if 'reviewsWidget' in home:
        home['reviewsWidget']['avgRating'] = float(rating)
        home['reviewsWidget']['reviewCount'] = review_count
        home['reviewsWidget']['subtitle'] = f"Basado en {review_count} resenas en Google - {float(rating)} estrellas"
    
    # Update promo banner
    if 'promoBanner' in home and review_count > 50:
        home['promoBanner']['subtitle'] = f"Con {review_count} resenas positivas en Google. Te esperamos!"
    
    # Update trust badges if present
    if 'trustBadges' in home and review_count > 0:
        badges = home['trustBadges']['items']
        if f"{int(rating)} estrellas en Google" not in str(badges):
            badges.append(f"{int(rating)}/{5} estrellas en Google")
    
    content['home'] = home
    
    # Write back
    with open(content_path, 'w') as f:
        json.dump(content, f, indent=2, ensure_ascii=False)
        f.write('\n')
    with open(site_path, 'w') as f:
        json.dump(site, f, indent=2, ensure_ascii=False)
        f.write('\n')
    
    updated += 1
    if updated <= 5 or updated % 20 == 0:
        print(f"  ✓ {preview_slug[:45]:45s} | {biz_name[:30]:30s} | {city} | {rating}* {review_count}r")

print(f"\n✅ Enriched {updated} preview sites with real lead data")
