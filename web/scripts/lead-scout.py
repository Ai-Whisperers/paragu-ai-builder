#!/usr/bin/env python3
"""
Lead Scout v3 — Autonomous Business Lead Finder for Paraguay
=============================================================
Fast version. Searches DuckDuckGo for PY business directory listings
with phone numbers. No direct directory scraping.

Usage:
  python3 lead-scout.py --city "Coronel Oviedo" --type "peluqueria"
  python3 lead-scout.py --batch
"""

import os
import sys
import csv
import re
import time
import random
import argparse
from datetime import datetime
from urllib.parse import quote, unquote
import urllib.request
import urllib.error
import ssl

RESULTS_DIR = os.path.expanduser("~/lead_scout_results")
CSV_PATH = os.path.expanduser("~/lead_scout_results/leads_tracker.csv")
HEADERS = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', 'Accept-Language': 'es-PY,es;q=0.9'}
PY_PHONE = re.compile(r'(?:\+595|0\d{2,3})[\s-]*\d{3}[\s-]*\d{3,4}')

CITIES = [
    "Asuncion", "Ciudad del Este", "San Lorenzo", "Luque", "Capiatá",
    "Lambaré", "Fernando de la Mora", "Limpio", "Ñemby", "Encarnación",
    "Mariano Roque Alonso", "Pedro Juan Caballero", "Itauguá",
    "Villa Elisa", "Coronel Oviedo", "Caaguazú", "Concepción",
    "Villarrica", "Pilar", "Caacupé",
]

TYPES = {
    "peluqueria": "peluqueria OR salon de belleza",
    "barberia": "barberia OR barberia masculina",
    "taller_mecanico": "taller mecanico OR mecanico automotriz",
    "odontologia": "odontologo OR dentista OR clinica dental",
    "estetica": "centro de estetica OR masajes OR spa facial",
    "contador": "contador OR estudio contable",
    "abogado": "abogado OR estudio juridico",
    "gimnasio": "gimnasio OR crossfit",
    "veterinaria": "veterinaria OR clinica veterinaria",
    "farmacia": "farmacia",
    "restaurant": "restaurante OR parrilla OR comida tipica",
    "panaderia": "panaderia OR pasteleria",
}
BATCH_TYPES = list(TYPES.keys())


def fetch(url, retries=1):
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    for i in range(1, retries+1):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
                return r.read().decode('utf-8', errors='replace')
        except:
            if i < retries:
                time.sleep(2**i)
    return None


def search_ddg(query):
    """DuckDuckGo HTML search. Returns list of {name, url, phone if found}"""
    html = fetch(f"https://html.duckduckgo.com/html/?q={quote(query)}")
    if not html:
        return []
    
    results = []
    # Extract name + url blocks
    for m in re.finditer(r'class="result__a"[^>]*href="([^"]+)"[^>]*>(.*?)</a>', html, re.DOTALL):
        url_raw = m.group(1)
        title = re.sub(r'<[^>]+>', '', m.group(2)).strip()
        ru = unquote(url_raw)
        u = re.search(r'uddg=(https?[^&]+)', ru)
        real_url = unquote(u.group(1)) if u else ru
        
        # Try to find phone in title
        phones = PY_PHONE.findall(title)
        
        results.append({
            'name': title[:120],
            'url': real_url,
            'phone': phones[0].strip() if phones else '',
            'score': 0,
        })
    
    # Also check snippets for phones
    snippets = re.findall(r'class="result__snippet"[^>]*>(.*?)</(?:a|div|span)', html, re.DOTALL)
    for s in snippets:
        phones = PY_PHONE.findall(re.sub(r'<[^>]+>', '', s))
        if phones:
            # Try to associate phone with a result
            for p in phones:
                if not any(p.strip() == r['phone'] for r in results):
                    results.append({
                        'name': '(from directory)',
                        'url': '',
                        'phone': p.strip(),
                        'score': 0,
                    })
    
    return results


def search(query, city):
    """Combined search"""
    all_results = []
    seen = set()
    
    # Search 1: direct
    q1 = f"{query} {city} telefono Paraguay"
    for r in search_ddg(q1):
        key = (r['phone'], r['name'][:20])
        if key not in seen:
            seen.add(key)
            all_results.append(r)
    
    time.sleep(random.uniform(0.5, 1.0))
    
    # Search 2: directory-specific
    q2 = f"{query} {city} site:todosnegocios.com OR site:cybo.com OR site:findglocal.com OR site:buscoinfo.com.py"
    for r in search_ddg(q2):
        key = (r['phone'], r['name'][:20])
        if key not in seen:
            seen.add(key)
            all_results.append(r)
    
    # Calculate scores
    city_lower = city.lower()
    for r in all_results:
        s = 0
        if r['phone']:
            s += 30
        if city_lower in r['name'].lower():
            s += 20
        if any(d in r.get('url','') for d in ['todosnegocios', 'cybo', 'findglocal', 'buscoinfo']):
            s += 10  # directory listing = no own website
        if 'facebook.com' in r.get('url',''):
            s += 5
        
        # Website detection: check if URL is a real business domain (not directory/social)
        has_own_website = False
        url = r.get('url', '').lower()
        if url:
            parsed = re.match(r'https?://([^/]+)', url)
            if parsed:
                domain = parsed.group(1)
                # Remove www.
                domain = re.sub(r'^www\.', '', domain)
                # Known directory/social domains = no own website
                dir_domains = [
                    'todosnegocios', 'cybo.com', 'findglocal', 'buscoinfo',
                    'facebook.com', 'instagram.com', 'reddit.com', 'twitter.com',
                    'youtube.com', 'linkedin.com', 'tiktok.com', 'pinterest',
                    'booksy', 'tiendanimal', 'petsalud', 'kiwoko',
                    'miciudadquerida', 'guia.com.py', 'paginasamarillas',
                    'directorio.com.py', 'py.archivo.biz', 'google.com/maps',
                ]
                is_directory = any(d in domain for d in dir_domains)
                has_own_website = not is_directory and '.' in domain
        
        if has_own_website:
            s -= 10  # Less priority if they already have a website
        else:
            s += 10  # Higher priority if no website
        
        r['score'] = min(max(s, 0), 100)
        r['has_website'] = has_own_website
    
    # Sort by score, keep only quality leads
    all_results.sort(key=lambda x: -x['score'])
    return all_results


def save_results(leads, today_dir, query, city):
    file_exists = os.path.exists(CSV_PATH)
    with open(CSV_PATH, 'a', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        if not file_exists:
            w.writerow(['Date', 'Name', 'City', 'Category', 'Phone', 'URL', 'Score', 'HasWebsite', 'Status'])
        for l in leads:
            w.writerow([l.get('_date', datetime.now().strftime('%Y-%m-%d')),
                       l['name'], city, query, l.get('phone',''), l.get('url',''),
                       l['score'], l.get('has_website', False), 'new'])
    
    report = os.path.join(today_dir, f"{query}_{city}.md")
    with open(report, 'w', encoding='utf-8') as f:
        f.write(f"# {query} en {city}\n\n")
        f.write(f"Total: {len(leads)} | With phone: {len([l for l in leads if l.get('phone')])}\n\n")
        for l in leads[:30]:
            phone = f" 📞{l['phone']}" if l.get('phone') else ""
            f.write(f"- [{l['score']}] {l['name']}{phone}\n")
            if l.get('url'):
                f.write(f"  {l['url']}\n")
    
    return CSV_PATH, report


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--city')
    p.add_argument('--type')
    p.add_argument('--batch', action='store_true')
    args = p.parse_args()
    
    today = datetime.now().strftime("%Y-%m-%d")
    today_dir = os.path.join(RESULTS_DIR, today)
    os.makedirs(today_dir, exist_ok=True)
    
    all_leads = []
    
    if args.batch:
        total = len(CITIES) * len(BATCH_TYPES)
        done = 0
        for city in CITIES:
            for bt in BATCH_TYPES:
                results = search(TYPES[bt], city)
                for r in results:
                    r['_date'] = today
                save_results(results, today_dir, bt, city)
                all_leads.extend(results)
                done += 1
                sys.stdout.write(f"\r  {done}/{total} — {city} {bt}: {len(results)}")
                sys.stdout.flush()
                time.sleep(random.uniform(0.5, 1.5))
        print()
    elif args.city and args.type:
        for bt in args.type.split(','):
            bt = bt.strip()
            results = search(bt, args.city)
            for r in results:
                r['_date'] = today
            save_results(results, today_dir, bt, args.city)
            all_leads.extend(results)
            print(f"  {bt} in {args.city}: {len(results)} leads")
    else:
        p.print_help()
        return
    
    # Dedup phone numbers
    seen_phones = set()
    unique = []
    for l in all_leads:
        p = l.get('phone', '')
        if p and p not in seen_phones:
            seen_phones.add(p)
            unique.append(l)
        elif not p:
            unique.append(l)
    
    unique.sort(key=lambda x: -x['score'])
    print(f"\nTotal unique: {len(unique)}")
    print(f"With phone: {len([l for l in unique if l.get('phone')])}")
    if unique:
        print("\nTop 10:")
        for l in unique[:10]:
            print(f"  [{l['score']}] {l['name']} — {l.get('phone','')}")


if __name__ == "__main__":
    main()
