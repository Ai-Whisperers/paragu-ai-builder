#!/usr/bin/env python3
"""Fetch ALL available Google Places data: reviews, photos, hours, website, etc."""

import json, os, time, urllib.request, urllib.parse, re

API_KEY = "AIzaSyAViHdhtabiRXZYvf6DbGDou7N2OvJ60GI"
SITES_DIR = os.path.join(os.path.dirname(__file__), '../..', 'sites')

# Spanish text detection
SPANISH_CHARS = re.compile(r'[ñáéíóúü¿¡]', re.IGNORECASE)
ENGLISH_WORDS = {'the','and','for','was','are','had','has','not','but','this','that','with','from','they','have','been','were','would','could','should','their','there','which','when','what','after','before','great','service','place','very','good','nice','love','best','ever','get','got','first','time','back','here','them','some','just','also','than','then','only','way','been','said','its','over','such','year','into','all','can','did','get','had','has','him','his','how','its','may','new','now','old','one','our','out','own','see','she','two','use','who','all','any','day','few','her','him','his','its','let','man','say','she','too','try','way','all','any','day','few','her','let','man','say','she','too','try','hair','cut','every','most','need','think','want','each','more','some','than','your','about','could','down','life','like','made','make','many','much','only','over','part','same','take','help','here','high','home','keep','know','last','less','long','look','love','make','more','move','much','must','name','need','new','next','now','only','open','over','own','part','past','pick','plan','play','pull','push','put','quit','read','real','rent','rest','rich','ride','ring','rise','risk','role','roll','room','rule','safe','said','same','save','seem','self','send','shop','show','shut','side','sign','size','slow','some','sort','star','stay','step','stop','such','sure','take','talk','tall','tell','them','then','they','thin','this','thus','till','time','tiny','told','toll','tone','took','tool','tops','total','tour','town','track','trade','trail','train','treat','tree','trial','tried','trip','true','trust','truth','turn','twin','type','ugly','unit','upon','used','uses','valid','value','visit','voice','wait','walk','wall','want','warm','warn','wash','waste','watch','water','wave','ways','weak','wear','week','weigh','welcome','well','went','were','west','what','wheel','when','where','which','while','white','whole','whom','wide','wife','will','win','wind','wine','wing','wire','wise','wish','with','within','without','woman','wonder','word','work','world','worry','worse','worst','worth','would','write','wrong','wrote'}

def is_spanish(text):
    if not text: return False
    if SPANISH_CHARS.search(text): return True
    words = set(re.findall(r'\b[a-záéíóúüñ]+\b', text.lower()))
    english_count = sum(1 for w in words if w in ENGLISH_WORDS)
    total = len(words)
    if total == 0: return False
    return english_count / total < 0.2

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
    
    # 0. FIX FAQ FIELDS — content uses q/a, not question/answer
    faq_items = home.get('faq', {}).get('items', [])
    for faq in faq_items:
        if 'question' in faq and 'q' not in faq:
            faq['q'] = faq.pop('question')
        if 'answer' in faq and 'a' not in faq:
            faq['a'] = faq.pop('answer')
    
    # 1. REAL REVIEWS — FILTER TO SPANISH ONLY, SKIP IF NONE
    all_reviews = details.get('reviews', [])
    spanish_reviews = [r for r in all_reviews if is_spanish(r.get('text', ''))]
    if not spanish_reviews:
        home['testimonials'] = {'title': 'Reseñas', 'subtitle': f"Basado en {details.get('user_ratings_total',0)} reseñas en Google", 'items': []}
        changed = True
    real_reviews = spanish_reviews[:5]
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
