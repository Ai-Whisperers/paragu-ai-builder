#!/usr/bin/env node
/**
 * Hair Vertical Outreach Script
 * 
 * Reads outreach-messages.json, sends messages via Evolution API,
 * and logs results to outbound_log table in Supabase.
 * 
 * Usage: node outreach-run.mjs [--dry-run] [--limit 10]
 * 
 * This script is designed to be run as a cron job.
 */

const EVOLUTION_URL = 'https://evolution.sunstein.cloud';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || 'a53c007a1b2e4f3d8c9a0b1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1';
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE || 'paraguai-hair';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qyvokpribmbrosafntqa.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const DRY_RUN = process.argv.includes('--dry-run');
const LIMIT_INDEX = process.argv.indexOf('--limit');
const LIMIT = LIMIT_INDEX >= 0 ? parseInt(process.argv[LIMIT_INDEX + 1]) : 5;

async function main() {
  console.log(`🧴 Hair Vertical Outreach — ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  console.log(`   Limit: ${LIMIT} messages`);

  // 1. Load outreach messages
  const { promises: fs } = await import('fs');
  const raw = await fs.readFile('/root/paragu-ai-builder/sites/outreach-messages.json', 'utf-8');
  const data = JSON.parse(raw);
  
  // Filter to hair vertical only (peluqueria, barberia, salon_belleza, spa)
  const hairTypes = new Set(['peluqueria', 'barberia', 'salon_belleza', 'spa', 'depilacion', 'maquillaje', 'unas']);
  const hairLeads = data.leads.filter(l => hairTypes.has(l.business_type));
  
  // Sort by priority (highest first)
  hairLeads.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  
  console.log(`\n📊 Loaded ${data.total} total leads, ${hairLeads.length} hair vertical leads`);
  console.log(`   Top priorities ready to send: ${hairLeads.slice(0, LIMIT).map(l => `${l.business_name} (${l.priority})`).join(', ')}`);

  if (DRY_RUN) {
    console.log('\n🔍 DRY RUN — would send:');
    for (const lead of hairLeads.slice(0, LIMIT)) {
      console.log(`   → ${lead.business_name} | ${lead.phone} | priority ${lead.priority}`);
      console.log(`     Message: ${lead.outreach_message.slice(0, 80)}...`);
    }
    console.log('\n✅ Dry run complete. No messages sent.');
    return;
  }

  // 2. Check Evolution API connectivity
  try {
    const statusRes = await fetch(`${EVOLUTION_URL}/instance/connectionState/${EVOLUTION_INSTANCE}`, {
      headers: { 'apiKey': EVOLUTION_API_KEY }
    });
    if (!statusRes.ok) {
      console.error(`\n❌ Evolution API not reachable: ${statusRes.status} ${statusRes.statusText}`);
      console.error(`   Check: https://${EVOLUTION_URL.split('/')[2]}`);
      process.exit(1);
    }
    const statusData = await statusRes.json();
    console.log(`\n📱 Evolution instance "${EVOLUTION_INSTANCE}" state:`, statusData.state || 'unknown');
  } catch (e) {
    console.error(`\n❌ Cannot reach Evolution API: ${e.message}`);
    process.exit(1);
  }

  // 3. Send messages
  let sent = 0;
  let failed = 0;
  
  for (const lead of hairLeads.slice(0, LIMIT)) {
    try {
      // Send via Evolution API
      const phoneClean = lead.phone.replace(/[^0-9]/g, '');
      // Add 595 country code if missing
      const phoneFull = phoneClean.startsWith('595') ? phoneClean : `595${phoneClean}`;
      
      const sendRes = await fetch(`${EVOLUTION_URL}/message/sendText/${EVOLUTION_INSTANCE}`, {
        method: 'POST',
        headers: { 
          'apiKey': EVOLUTION_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          number: phoneFull,
          text: lead.outreach_message,
          delay: 2000,
        })
      });
      
      if (!sendRes.ok) {
        const errText = await sendRes.text();
        console.error(`   ❌ ${lead.business_name}: ${errText.slice(0, 100)}`);
        failed++;
        await logToSupabase(lead, 'failed', errText);
      } else {
        const sendData = await sendRes.json();
        console.log(`   ✅ ${lead.business_name}: sent (key: ${sendData.key?.id || 'ok'})`);
        sent++;
        await logToSupabase(lead, 'sent', null, sendData);
      }
      
      // Wait 3-5 seconds between messages to avoid rate limits
      if (sent + failed < LIMIT) {
        const wait = 3000 + Math.random() * 2000;
        await new Promise(r => setTimeout(r, wait));
      }
    } catch (e) {
      console.error(`   ❌ ${lead.business_name}: ${e.message}`);
      failed++;
      await logToSupabase(lead, 'failed', e.message);
    }
  }

  console.log(`\n📬 Summary: ${sent} sent, ${failed} failed out of ${LIMIT}`);
}

async function logToSupabase(lead, status, error, response) {
  if (!SUPABASE_KEY) return;
  
  try {
    const body = {
      lead_id: lead.id || null,
      business_name: lead.business_name,
      business_type: lead.business_type,
      phone: lead.phone,
      channel: 'whatsapp',
      message_type: 'outreach',
      message_text: lead.outreach_message,
      status: status,
      sent_at: status === 'sent' ? new Date().toISOString() : null,
      error_message: error || null,
      evolution_instance: EVOLUTION_INSTANCE,
      evolution_message_id: response?.key?.id || null,
      response_data: response || {},
      conversation_step: 1
    };
    
    await fetch(`${SUPABASE_URL}/rest/v1/outbound_log`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(body)
    });
  } catch (e) {
    console.error(`     ⚠️ Failed to log to Supabase: ${e.message}`);
  }
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
