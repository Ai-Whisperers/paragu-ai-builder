#!/usr/bin/env node
/**
 * lead-notify-whatsapp.ts
 * 
 * Reads the latest lead-scout results and sends WhatsApp alerts
 * for high-priority leads (score 70+ with phone).
 * 
 * Called as a post-processing step after scout batch.
 * 
 * Usage:
 *   npx tsx scripts/lead-notify-whatsapp.ts
 *   npx tsx scripts/lead-notify-whatsapp.ts --min-score=60
 *   npx tsx scripts/lead-notify-whatsapp.ts --file ~/leads_tracker.csv
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

interface Lead {
  date: string;
  name: string;
  city: string;
  category: string;
  phone: string;
  url: string;
  score: number;
  has_website: boolean;
  status: string;
}

function parseCSV(filePath: string): Lead[] {
  const raw = fs.readFileSync(filePath, 'utf-8').trim();
  if (!raw) return [];

  const lines = raw.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

  const leads: Lead[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    const lead: Record<string, string> = {};
    headers.forEach((h, idx) => {
      lead[h] = (cols[idx] || '').trim();
    });

    // Skip header row appearing as data
    if (lead['date'] === 'Date') continue;

    leads.push({
      date: lead['date'] || '',
      name: lead['name'] || '',
      city: lead['city'] || '',
      category: lead['category'] || '',
      phone: lead['phone'] || '',
      url: lead['url'] || '',
      score: parseInt(lead['score'] || '0', 10),
      has_website: (lead['haswebsite'] || '').toLowerCase() === 'true',
      status: lead['status'] || 'new',
    });
  }

  return leads;
}

function getRecentHighPriorityLeads(leads: Lead[], scoreThreshold: number, daysBack: number): Lead[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysBack);

  return leads.filter(l => {
    // Only today's leads
    const leadDate = new Date(l.date);
    const today = new Date();
    const isToday = leadDate.toDateString() === today.toDateString();

    return (
      l.score >= scoreThreshold &&
      l.phone.length > 5 &&
      !l.has_website &&
      isToday
    );
  });
}

function formatAlertMessage(leads: Lead[], city: string): string {
  const lines: string[] = [];
  
  const topLeads = leads.slice(0, 5);
  for (const l of topLeads) {
    const phoneClean = l.phone.replace(/[^0-9+]/g, '');
    lines.push(`*${l.name}* — ${phoneClean} (${l.score}pts)`);
    if (l.url) {
      lines.push(`  ${l.url}`);
    }
  }

  if (leads.length > 5) {
    lines.push(`  ... y ${leads.length - 5} mas`);
  }

  lines.push(``);
  lines.push(`Total leads hoy: ${leads.length}`);
  lines.push(`Con telefono: ${leads.filter(l => l.phone).length}`);

  return lines.join('\n');
}

function main() {
  const args = process.argv.slice(2);
  const fileArg = args.find(a => a.startsWith('--file='));
  const scoreArg = args.find(a => a.startsWith('--min-score='));

  const csvPath = fileArg ? fileArg.split('=')[1] : path.join(os.homedir(), 'lead_scout_results', 'leads_tracker.csv');
  const minScore = scoreArg ? parseInt(scoreArg.split('=')[1], 10) : 70;

  if (!fs.existsSync(csvPath)) {
    console.log('No leads CSV found at:', csvPath);
    process.exit(0);
  }

  const allLeads = parseCSV(csvPath);
  const highPriority = getRecentHighPriorityLeads(allLeads, minScore, 1);

  if (highPriority.length === 0) {
    console.log('No high-priority leads found today.');
    process.exit(0);
  }

  // Group by city
  const byCity = new Map<string, Lead[]>();
  for (const l of highPriority) {
    const city = l.city || 'Unknown';
    if (!byCity.has(city)) byCity.set(city, []);
    byCity.get(city)!.push(l);
  }

  console.log(`High-priority leads found: ${highPriority.length}`);
  for (const [city, leads] of byCity) {
    console.log(`\n--- ${city} ---`);
    console.log(formatAlertMessage(leads, city));
  }
}

main();
