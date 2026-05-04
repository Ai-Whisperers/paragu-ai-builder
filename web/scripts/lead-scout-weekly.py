#!/usr/bin/env python3
"""
lead-scout-weekly.py
Wrapper that runs lead-scout batch, then triggers import to Supabase.
Outputs a WhatsApp-friendly message at the end for cron delivery.

Called by cron once per week (Mon 8am).
"""

import os
import sys
import subprocess
from datetime import datetime

SCRIPTS_DIR = os.path.expanduser("~/paragu-ai-builder/web/scripts")

def log(msg):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{ts}] {msg}", file=sys.stderr)
    sys.stderr.flush()

def run(cmd, timeout=3600):
    log(f"Running: {cmd}")
    try:
        r = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=timeout)
        if r.returncode != 0:
            log(f"STDERR: {r.stderr[:500]}")
        log(f"STDOUT: {r.stdout[:300]}")
        return r.returncode == 0, r.stdout, r.stderr
    except subprocess.TimeoutExpired:
        log(f"TIMEOUT after {timeout}s")
        return False, "", ""
    except Exception as e:
        log(f"ERROR: {e}")
        return False, "", ""

def main():
    log("=== Lead Scout Weekly Batch ===")
    
    # Step 1: run batch scan
    ok, stdout, _ = run(f"cd {SCRIPTS_DIR} && python3 lead-scout.py --batch")
    if not ok:
        log("FAILED: batch scan")
        sys.exit(1)
    
    # Step 2: import to Supabase (optional, needs .env.local)
    supabase_ok, _, _ = run(
        f"cd {SCRIPTS_DIR}/.. && "
        f"npx tsx scripts/lead-scout-import.ts --file ~/lead_scout_results/leads_tracker.csv 2>&1"
    )
    if supabase_ok:
        log("Supabase import complete")
    else:
        log("Supabase import skipped (no .env.local)")
    
    # Step 3: check for high-priority leads
    ok, notify_output, _ = run(
        f"cd {SCRIPTS_DIR} && python3 lead-notify-cron.py"
    )
    
    if ok and notify_output.strip() and notify_output.strip() != "NO_LEADS":
        # This stdout gets delivered as the cron message
        print("=== LEADS FOUND ===")
        print(notify_output.strip())
        print("---")
        print("Para enriquecer: npm run scout:enrich --batch=10")
    else:
        print("=== NO NEW LEADS TODAY ===")
        print("No se encontraron leads prioritarios nuevos.")

if __name__ == "__main__":
    main()
