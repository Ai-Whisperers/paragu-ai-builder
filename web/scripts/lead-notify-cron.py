#!/usr/bin/env python3
"""
lead-notify-cron.py
Called by cron after lead-scout batch. Reads latest CSV, finds high-priority
leads (score 70+, phone, no website), and sends a WhatsApp summary.
Uses Hermes messaging API via send_message tool.

Outputs a message payload that can be sent via the messaging system.
"""

import os
import csv
import json
from datetime import datetime, date

CSV_PATH = os.path.expanduser("~/lead_scout_results/leads_tracker.csv")

def read_csv():
    if not os.path.exists(CSV_PATH):
        return []
    
    leads = []
    with open(CSV_PATH, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            leads.append(row)
    return leads

def get_today_high_priority(leads, min_score=65):
    today = date.today().isoformat()
    result = []
    for l in leads:
        try:
            score = int(l.get('Score', '0'))
        except ValueError:
            score = 0
        has_website = l.get('HasWebsite', '').lower() == 'true'
        phone = l.get('Phone', '').strip()
        
        if l.get('Date', '') == today and score >= min_score and len(phone) > 5 and not has_website:
            result.append(l)
    return result

def format_for_whatsapp(leads):
    """Format leads as WhatsApp-friendly text (no markdown)."""
    if not leads:
        return None
    
    lines = []
    lines.append("Nuevos leads encontrados hoy:")
    lines.append("")
    
    # Group by city
    by_city = {}
    for l in leads:
        city = l.get('City', 'Desconocida')
        if city not in by_city:
            by_city[city] = []
        by_city[city].append(l)
    
    total = len(leads)
    for city, city_leads in sorted(by_city.items()):
        lines.append(f"{city}:")
        for l in city_leads[:3]:
            name = l.get('Name', '').split('|')[0].strip()
            phone = l.get('Phone', '').strip()
            score = l.get('Score', '0')
            lines.append(f"  [{score}] {name} — {phone}")
        if len(city_leads) > 3:
            lines.append(f"  ... y {len(city_leads)-3} mas")
        lines.append("")
    
    lines.append(f"Total: {total} leads prioritarios")
    lines.append("Usa scout:enrich para enriquecerlos con AgentCash")
    
    return "\n".join(lines)

def main():
    import sys
    args = sys.argv[1:]
    
    if '--check' in args:
        # Just check if there are leads to notify
        leads = read_csv()
        high = get_today_high_priority(leads)
        print(f"HIGH_PRIORITY={len(high)}")
        return
    
    leads = read_csv()
    high = get_today_high_priority(leads)
    
    msg = format_for_whatsapp(high)
    if msg:
        print(msg)
    else:
        print("NO_LEADS")

if __name__ == "__main__":
    main()
