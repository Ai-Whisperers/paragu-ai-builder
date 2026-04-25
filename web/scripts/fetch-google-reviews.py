#!/usr/bin/env python3
"""Fetch real Google reviews for all leads and update preview content."""

import json, os, sys, time, urllib.request, urllib.parse

API_KEY = "AIzaSyAViHdhtabiRXZYvf6DbGDou7N2OvJ60GI"
SITES_DIR = os.path.join(os.path.dirname(__file__), '../..', 'sites')

def api_get(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'paragu-ai/1.0'})
        with urllib.request.urlopen(req, timeout=10) as r:
            return json.loads(r.read())
    except Exception as e:
        return {'status': 'ERROR', 'message': str(e)}

def search_place(name, city):
    q = urllib.parse.quote(f"{name} {city} Paraguay")
    url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query={q}&key={API_KEY}"
    data = api_get(url)
    if data.get('results'):
        return data['results'][0]
    return None

def fetch_place_details(place_id):
    url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&fields=rating,user_ratings_total,reviews,formatted_address,international_phone_number,opening_hours&key={API_KEY}"
    data = api_get(url)
    if data.get('result'):
        return data['result']
    return None

def update_preview(slug, biz_name, details):
    cp = os.path.join(SITES_DIR, slug, 'content', 'es.json')
    sp = os.path.join(SITES_DIR, slug, 'site.json')
    if not os.path.exists(cp): return False
    
    with open(cp) as f: content = json.load(f)
    home = content.get('home', {})
    if not home: return False
    
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
    
    if 'reviewsWidget' in home:
        home['reviewsWidget']['avgRating'] = details.get('rating', 0)
        home['reviewsWidget']['reviewCount'] = details.get('user_ratings_total', 0)
        home['reviewsWidget']['reviews'] = [
            {'author': r.get('author_name',''), 'rating': r.get('rating',5), 'text': (r.get('text','') or '')[:150]}
            for r in real_reviews if (r.get('text') or '').strip()
        ]
    
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
        if hm: home['hours'] = hm
    
    content['home'] = home
    with open(cp, 'w') as f:
        json.dump(content, f, indent=2, ensure_ascii=False)
        f.write('\n')
    return True

def get_slug_from_url(url):
    return url.rstrip('/').split('/')[-1] if url else ''

def main():
    # Load leads and extract slugs from preview_url
    with open(os.path.join(SITES_DIR, 'premium-outreach.json')) as f:
        raw = json.load(f)['leads']
    
    # Deduplicate by slug
    seen = set()
    leads = []
    for l in raw:
        slug = get_slug_from_url(l.get('preview_url', ''))
        if slug and slug not in seen:
            seen.add(slug)
            l['_slug'] = slug
            leads.append(l)
    
    print(f"Processing {len(leads)} leads...\n")
    ok = skip = err = 0
    
    for i, l in enumerate(leads):
        slug = l.get('_slug', '')
        if not slug: continue
        
        print(f"  [{i+1}/{len(leads)}] {l['business_name'][:40]:40s} ", end='', flush=True)
        
        time.sleep(0.3)
        
        place = search_place(l['business_name'], l['city'])
        if not place:
            print("⚠️  no results")
            skip += 1
            continue
        
        details = fetch_place_details(place['place_id'])
        if not details:
            print("⚠️  no details")
            skip += 1
            continue
        
        rc = details.get('user_ratings_total', 0)
        rt = details.get('rating', 0)
        
        if not update_preview(slug, l['business_name'], details):
            print("⚠️  no preview file")
            skip += 1
            continue
        
        print(f"⭐ {rt} ({rc}r)")
        ok += 1
    
    print(f"\n✅ {ok} updated | ⏭️ {skip} skipped | ❌ {err} errors")

if __name__ == '__main__':
    main()
