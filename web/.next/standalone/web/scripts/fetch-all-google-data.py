#!/usr/bin/env python3
"""Fetch ALL available Google Places data: reviews, photos, hours, website, etc."""

import json, os, time, urllib.request, urllib.parse, re

API_KEY = "AIzaSyAViHdhtabiRXZYvf6DbGDou7N2OvJ60GI"
SITES_DIR = os.path.join(os.path.dirname(__file__), '../..', 'sites')

PHOTO_FIELDS = "name,rating,user_ratings_total,reviews,formatted_address,international_phone_number,opening_hours,website,price_level,url,vicinity,business_status,photos"

def api_get(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'paragu-ai/2.0'})
        with urllib.request.urlopen(req, timeout=10) as r:
            return json.loads(r.read())
    except Exception as e:
        return {}

def search_place(name, city):
    q = urllib.parse.quote(f"{name} {city} Paraguay")
    data = api_get(f"https://maps.googleapis.com/maps/api/place/textsearch/json?query={q}&key={API_KEY}")
    return data.get('results', [None])[0]

def fetch_all(place_id):
    data = api_get(f"https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&fields={PHOTO_FIELDS}&key={API_KEY}")
    return data.get('result')

def update_preview(slug, details):
    cp = os.path.join(SITES_DIR, slug, 'content', 'es.json')
    sp = os.path.join(SITES_DIR, slug, 'site.json')
    if not os.path.exists(cp): return False
    
    with open(cp) as f: content = json.load(f)
    with open(sp) as f: site = json.load(f)
    home = content.get('home', {})
    changed = False
    
    # 1. REAL REVIEWS
    real_reviews = details.get('reviews', [])[:5]
    if real_reviews:
        items = []
        for r in real_reviews:
            text = (r.get('text', '') or '').strip()
            if not text: continue
            items.append({
                'author': r.get('author_name', 'Google User'),
                'quote': text[:200],
                'rating': r.get('rating', 5),
            })
        if items:
            home['testimonials'] = {
                'title': 'Lo que dicen en Google',
                'subtitle': f"Basado en {details.get('user_ratings_total',0)} reseñas",
                'items': items,
            }
            changed = True
    
    # 2. REAL PHOTOS — update gallery with actual business photos
    photos = details.get('photos', [])
    if photos:
        gallery_items = []
        for i, p in enumerate(photos[:6]):
            ref = p.get('photo_reference', '')
            if ref:
                gallery_items.append({
                    'src': f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference={ref}&key={API_KEY}",
                    'alt': f"Foto {i+1}",
                    'caption': f"",
                })
        if gallery_items:
            home['gallery'] = {
                'title': 'Nuestro local',
                'subtitle': 'Fotos reales de nuestro espacio',
                'columns': 3,
                'images': gallery_items,
            }
            changed = True
    
    # 3. HOURS
    hours_data = details.get('opening_hours', {}).get('weekday_text', [])
    if hours_data:
        hm = {}
        for h in hours_data:
            parts = h.split(': ', 1)
            if len(parts) == 2:
                de = parts[0].strip()
                des = {'Monday':'Lunes','Tuesday':'Martes','Wednesday':'Miercoles',
                       'Thursday':'Jueves','Friday':'Viernes','Saturday':'Sabado',
                       'Sunday':'Domingo'}.get(de, de)
                hm[des] = parts[1].strip()
        if hm:
            home['hours'] = hm
            changed = True
    
    # 4. PHONE
    gphone = details.get('international_phone_number', '')
    if gphone and 'contact' in home:
        home['contact']['phone'] = gphone
        home['contact']['whatsapp'] = gphone
        changed = True
        site['contact']['phone'] = gphone
        site['contact']['whatsapp'] = gphone
    
    # 5. WEBSITE
    gwebsite = details.get('website', '')
    if gwebsite:
        site['website'] = gwebsite
        changed = True
    
    # 6. GOOGLE MAPS URL
    gurl = details.get('url', '')
    if gurl:
        site['google_maps_url'] = gurl
        changed = True
    
    # 7. ADDRESS
    gaddr = details.get('formatted_address', '')
    if gaddr:
        site['location']['address'] = gaddr
        changed = True
    
    # 8. PRICE LEVEL
    price = details.get('price_level')
    if price is not None:
        labels = ['Gratis', '$', '$$', '$$$', '$$$$']
        site['price_level'] = price
        if 'seo' not in site: site['seo'] = {}
        site['seo']['priceRange'] = labels[price] if price < len(labels) else '$$'
        changed = True
    
    # 9. BUSINESS STATUS
    status = details.get('business_status', '')
    if status:
        site['business_status'] = status
    
    # 10. Reviews widget updates
    rc = details.get('user_ratings_total', 0)
    rt = details.get('rating', 0)
    if 'reviewsWidget' in home:
        home['reviewsWidget']['avgRating'] = float(rt)
        home['reviewsWidget']['reviewCount'] = rc
        home['reviewsWidget']['subtitle'] = f"Basado en {rc} reseñas en Google - {float(rt)} estrellas"
        if real_reviews:
            home['reviewsWidget']['reviews'] = [
                {'author': r.get('author_name',''), 'rating': r.get('rating',5), 'text': (r.get('text','') or '')[:150]}
                for r in real_reviews if (r.get('text') or '').strip()
            ]
        changed = True
    
    if changed:
        content['home'] = home
        with open(cp, 'w') as f:
            json.dump(content, f, indent=2, ensure_ascii=False)
            f.write('\n')
        with open(sp, 'w') as f:
            json.dump(site, f, indent=2, ensure_ascii=False)
            f.write('\n')
    
    return changed, rc, rt, len(photos)

def main():
    # Load from premium-outreach, dedup by slug
    with open(os.path.join(SITES_DIR, 'premium-outreach.json')) as f:
        raw = json.load(f)['leads']
    
    seen = set()
    leads = []
    for l in raw:
        url = l.get('preview_url', '') or ''
        slug = url.rstrip('/').split('/')[-1] if url else ''
        if slug and slug not in seen:
            seen.add(slug)
            l['_slug'] = slug
            leads.append(l)
    
    print(f"Processing {len(leads)} leads...\n")
    
    ok = skip = 0
    total_photos = 0
    
    for i, l in enumerate(leads):
        slug = l['_slug']
        print(f"  [{i+1}/{len(leads)}] {l['business_name'][:40]:40s} ", end='', flush=True)
        time.sleep(0.35)
        
        place = search_place(l['business_name'], l['city'])
        if not place:
            print("⚠️  no results")
            skip += 1
            continue
        
        details = fetch_all(place['place_id'])
        if not details:
            print("⚠️  no details")
            skip += 1
            continue
        
        rc = details.get('user_ratings_total', 0)
        rt = details.get('rating', 0)
        
        updated, _, _, photos_count = update_preview(slug, details)
        total_photos += photos_count
        
        if updated:
            print(f"⭐{rt} ({rc}r) 📸{photos_count}")
            ok += 1
        else:
            print(f"⭐{rt} ({rc}r) (no changes)")
            ok += 1
    
    print(f"\n✅ {ok} enriched | ⏭️  {skip} skipped")
    print(f"📸 {total_photos} real business photos available")

if __name__ == '__main__':
    main()
