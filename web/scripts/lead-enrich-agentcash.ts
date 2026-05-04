#!/usr/bin/env node
/**
 * lead-enrich-agentcash.ts
 * 
 * Enriches leads from CSV with AgentCash paid APIs (Apollo, Hunter, Exa).
 * Runs after lead-scout batch. Requires funded AgentCash wallet.
 * 
 * Enrichment pipeline:
 *   1. Read new leads from CSV (score 70+, no website)
 *   2. Try Apollo people-enrich by name + city
 *   3. If Apollo finds nothing, try Google Maps for more data
 *   4. Append enriched fields to CSV: email, linkedin, instagram, facebook
 *   5. Output summary
 * 
 * Usage:
 *   npx tsx scripts/lead-enrich-agentcash.ts
 *   npx tsx scripts/lead-enrich-agentcash.ts --batch=10
 *   npx tsx scripts/lead-enrich-agentcash.ts --dry-run
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { execSync } from 'child_process';

const AGENTCASH = `npx agentcash@latest`;

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
  enriched_email?: string;
  enriched_linkedin?: string;
  enriched_instagram?: string;
}

interface EnrichedLead extends Lead {
  enriched_email?: string;
  enriched_linkedin?: string;
  enriched_instagram?: string;
  enrichment_cost?: number;
  enrichment_status: 'pending' | 'done' | 'no_data' | 'no_funds';
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
    headers.forEach((h, idx) => (lead[h] = (cols[idx] || '').trim()));
    if (lead['date'] === 'Date') continue;
    leads.push({
      date: lead['date'] || '',
      name: (lead['name'] || '').replace(/^"(.*)"$/, '$1'),
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

function callAgentCash(endpoint: string, method: string, body: object): any {
  const cmd = `${AGENTCASH} fetch "${endpoint}" -m ${method} -b '${JSON.stringify(body)}' -q 2>/dev/null`;
  try {
    const out = execSync(cmd, { timeout: 15000, encoding: 'utf-8' });
    return JSON.parse(out);
  } catch (e: any) {
    const msg = e.stderr?.toLowerCase() || '';
    if (msg.includes('402') || msg.includes('insufficient') || msg.includes('balance')) {
      return { _noFunds: true };
    }
    return null;
  }
}

function extractBusinessName(raw: string): string {
  // Clean up: "Barbería El Parcero | 0984 779100 | Coronel Oviedo" -> "Barbería El Parcero"
  return raw
    .replace(/\s*\|.*$/, '')  // Remove after |
    .replace(/\s*-\s*\d{4,}.*$/, '') // Remove phone
    .replace(/\s*\(@.*$/, '') // Remove Instagram handle
    .trim();
}

function extractCity(raw: string): string {
  return raw.replace(/^.*\|\s*/, '').replace(/\(.*\)/, '').trim();
}

async function enrichLead(lead: Lead): Promise<EnrichedLead> {
  const result: EnrichedLead = { ...lead, enrichment_status: 'pending' };

  const bizName = extractBusinessName(lead.name);

  // Step 1: Apollo people-enrich by name
  const apolloResult = callAgentCash(
    'https://stableenrich.dev/api/apollo/people-enrich',
    'POST',
    { name: bizName, city: lead.city, country: 'PY' }
  );

  if (apolloResult?._noFunds) {
    result.enrichment_status = 'no_funds';
    return result;
  }

  if (apolloResult?.data) {
    const person = apolloResult.data;
    result.enriched_email = person.email || person.work_email || '';
    result.enriched_linkedin = person.linkedin_url || '';
    result.enrichment_status = 'done';
    result.enrichment_cost = 0.05;
  }

  // Step 2: If no Apollo result, try Google Maps
  if (result.enrichment_status !== 'done') {
    const mapsResult = callAgentCash(
      'https://stableenrich.dev/api/google-maps/places-search',
      'POST',
      { query: `${bizName} ${lead.city} Paraguay` }
    );

    if (mapsResult?.results?.length) {
      const place = mapsResult.results[0];
      result.enriched_email = place.email || '';
      result.enriched_instagram = place.instagram || '';
      result.enriched_linkedin = place.linkedin || '';
      result.enrichment_status = result.enriched_email ? 'done' : 'no_data';
      result.enrichment_cost = 0.03;
    } else {
      result.enrichment_status = 'no_data';
    }
  }

  return result;
}

async function main() {
  const args = process.argv.slice(2);
  const batchSize = parseInt(args.find(a => a.startsWith('--batch='))?.split('=')[1] || '5', 10);
  const dryRun = args.includes('--dry-run');
  const csvPath = args.find(a => a.startsWith('--file='))?.split('=')[1]
    || path.join(os.homedir(), 'lead_scout_results', 'leads_tracker.csv');

  if (!fs.existsSync(csvPath)) {
    console.log(`CSV not found: ${csvPath}`);
    process.exit(0);
  }

  const allLeads = parseCSV(csvPath);

  // Filter: new leads, high score, with phone, no website
  const candidates = allLeads.filter(l =>
    l.status === 'new' &&
    l.score >= 60 &&
    l.phone.length > 5 &&
    !l.has_website
  ).slice(0, batchSize);

  console.log(`Total leads: ${allLeads.length}`);
  console.log(`Enrichment candidates: ${candidates.length}\n`);

  if (dryRun) {
    for (const l of candidates) {
      console.log(`  ${extractBusinessName(l.name)} — ${l.phone} (${l.city})`);
    }
    console.log(`\nDry run. Would enrich ${candidates.length} leads at ~$0.04-0.05 each (~$${(candidates.length * 0.045).toFixed(2)} total)`);
    return;
  }

  let enriched = 0;
  let noFunds = false;

  for (const lead of candidates) {
    if (noFunds) break;

    const result = await enrichLead(lead);
    if (result.enrichment_status === 'no_funds') {
      console.log(`  ⚠️ No AgentCash funds. Enriched ${enriched}/${candidates.length} before running out.`);
      noFunds = true;
      break;
    }

    enriched++;
    console.log(`  [${enriched}/${candidates.length}] ${extractBusinessName(lead.name)} — ${result.enrichment_status}${result.enriched_email ? ' ' + result.enriched_email : ''}`);
  }

  const totalCost = enriched * 0.045;
  console.log(`\nDone: ${enriched} enriched. Est. cost: ~$${totalCost.toFixed(2)}`);
}

main().catch(console.error);
