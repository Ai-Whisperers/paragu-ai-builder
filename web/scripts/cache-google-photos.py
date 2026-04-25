#!/usr/bin/env python3
"""Download Google Places photos and upload to Supabase storage."""

import json, os, time, urllib.request, hashlib, sys
from supabase import create_client

API_KEY = "AIzaSyAViHdhtabiRXZYvf6DbGDou7N2OvJ60GI"
SUPABASE_URL = "https://qyvokpribmbrosafntqa.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dm9rcHJpYm1icm9zYWZudHFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjMxODE1NSwiZXhwIjoyMDkxODk0MTU1fQ.rphBsAVMuI_2X8RCU7D0JiGd8pqqdpcQ7vpUrirU06g"

SITES_DIR = os.path.join(os.path.dirname(__file__), '../..', 'sites')
CACHE_DIR = os.path.join(SITES_DIR, '_photo-cache')
BUCKET = 'commerce-products'

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def download_photo(photo_ref, idx):
    url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference={photo_ref}&key={API_KEY}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'paragu-ai/3.0'})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            ext = 'jpg'
            content_type = resp.headers.get('Content-Type', '')
            if 'png' in content_type: ext = 'png'
            if 'webp' in content_type: ext = 'webp'
            return data, ext
    except Exception as e:
        return None, str(e)

def upload_to_supabase(slug, idx, data, ext):
    path = f"preview-photos/{slug}/{idx}.{ext}"
    try:
        resp = supabase.storage.from_(BUCKET).upload(path, data, {'content-type': f'image/{ext}', 'upsert': 'true'})
        # Get public URL
        pub = supabase.storage.from_(BUCKET).get_public_url(path)
        return pub
    except Exception as e:
        # If already exists, get URL
        try:
            pub = supabase.storage.from_(BUCKET).get_public_url(path)
            return pub
        except:
            return None

def main():
    os.makedirs(CACHE_DIR, exist_ok=True)
    
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
            leads.append((slug, l['business_name'], l['city']))
    
    total_photos = 0
    cached = 0
    errors = 0
    
    for i, (slug, name, city) in enumerate(leads):
        # Search for place
        q = urllib.parse.quote(f"{name} {city} Paraguay")
        sdata = json.loads(urllib.request.urlopen(
            f"https://maps.googleapis.com/maps/api/place/textsearch/json?query={q}&key={API_KEY}",
            timeout=10).read())
        
        if not sdata.get('results'):
            errors += 1
            continue
        
        place_id = sdata['results'][0]['place_id']
        
        # Get photos
        ddata = json.loads(urllib.request.urlopen(
            f"https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&fields=photos&key={API_KEY}",
            timeout=10).read())
        
        photos = ddata.get('result', {}).get('photos', [])
        
        # Update preview content with cached URLs
        cp = os.path.join(SITES_DIR, slug, 'content', 'es.json')
        content_updated = False
        
        if os.path.exists(cp):
            with open(cp) as f:
                content = json.load(f)
            
            gallery = content.get('home', {}).get('gallery', {})
            images = gallery.get('images', [])
            
            if images and len(images) <= 6:
                # Check if these are Google photo URLs or cached
                first_src = images[0].get('src', '')
                if 'photoreference' in first_src:
                    # Replace with cached versions
                    for j, img in enumerate(images):
                        if j < len(photos):
                            ref = photos[j].get('photo_reference', '')
                            if not ref: continue
                            
                            data, ext = download_photo(ref, j)
                            if data and ext not in ('png','jpg','webp'):
                                continue
                            if data:
                                pub_url = upload_to_supabase(slug, j, data, ext)
                                if pub_url:
                                    images[j]['src'] = pub_url
                                    cached += 1
                                    total_photos += 1
                    
                    gallery['images'] = images
                    content['home']['gallery'] = gallery
                    content_updated = True
            
            if content_updated:
                with open(cp, 'w') as f:
                    json.dump(content, f, indent=2, ensure_ascii=False)
                    f.write('\n')
        
        time.sleep(0.3)
        print(f"  [{i+1}/{len(leads)}] {name[:35]:35s} {len(photos)} photos → {cached} cached")
    
    print(f"\n✅ {cached} photos cached to Supabase storage")
    print(f"❌ {errors} errors")

if __name__ == '__main__':
    main()
