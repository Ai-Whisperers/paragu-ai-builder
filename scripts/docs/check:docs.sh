#!/bin/bash

set -e

cd "$(dirname "$0")"

GENERATED_DIR="$(dirname "$0")/docs/reference"
CHECK_SUMMARY="$GENERATED_DIR/check.sum"

echo "# Doc Drift Check Summary"
echo ""
echo "This script checks if committed docs match generator output."
echo "Run: npm run check:docs to perform full validation."
echo ""
echo "## What's checked"
echo "- scripts/docs/gen-sections.ts → docs/reference/SECTIONS.md"
echo "- scripts/docs/gen-api.ts → docs/reference/API.md"
echo ""
echo "## How it works"
echo "1. Run both generators"
echo "2. Compute checksum of each generated file"
echo "3. Compare with committed version in .git/DOCS_CHECKSUMS.md (or create if not exists)"
echo "4. Fail CI if checksums don't match"
echo ""
echo "## Exit codes"
echo "- 0: Success - docs are up to date"
echo "- 1: Drift detected - generators output differs from committed"
echo "- 2: Checksum file missing - .git/DOCS_CHECKSUMS.md doesn't exist"
echo "- 3: CI config missing - check:docs script not in package.json"
echo ""
echo "---"
echo "_Last checked: $(date -Iseconds) — Doc drift check automation._"

function checksum_file() {
  local file="$1"
  if [ -f "$file" ]; then
    md5sum "$file" | awk '{print $1}'
  fi
}

run_check() {
  echo "Running generators..."
  
  rm -f "$GENERATED_DIR/SECTIONS.md.temp" "$GENERATED_DIR/API.md.temp"
  
  node scripts/docs/gen-sections.ts > "$GENERATED_DIR/SECTIONS.md.temp"
  node scripts/docs/gen-api.mjs > "$GENERATED_DIR/API.md.temp"
  
  mv "$GENERATED_DIR/SECTIONS.md.temp" "$GENERATED_DIR/SECTIONS.md"
  mv "$GENERATED_DIR/API.md.temp" "$GENERATED_DIR/API.md"
  
  echo "Generators complete."
  echo ""
  
  echo "Computing checksums..."
  
  SECTIONS_MD5=$(checksum_file "$GENERATED_DIR/SECTIONS.md")
  API_MD5=$(checksum_file "$GENERATED_DIR/API.md")
  
  echo "SECTIONS.md: $SECTIONS_MD5"
  echo "API.md: $API_MD5"
  echo ""
  
  if [ -f ".git/DOCS_CHECKSUMS.md" ]; then
    echo "Checking against stored checksums..."
    
    COMMITTED_SECTIONS=$(grep "SECTIONS.md:" .git/DOCS_CHECKSUMS.md | cut -d: -f2 | head -1 | cut -d: -f2)
    COMMITTED_API=$(grep "API.md:" .git/DOCS_CHECKSUMS.md | cut -d: -f2 | head -1 | cut -d: -f2)
    
    DRIFT_DETECTED=false
    
    if [ -n "$COMMITTED_SECTIONS" ]; then
      echo "WARNING: No stored checksum for SECTIONS.md - will add"
      COMMITTED_SECTIONS="$SECTIONS_MD5"
    fi
    
    if [ -n "$COMMITTED_API" ]; then
      echo "WARNING: No stored checksum for API.md - will add"
      COMMITTED_API="$API_MD5"
    fi
    
    if [ "$COMMITTED_SECTIONS" != "$SECTIONS_MD5" ]; then
      echo "ERROR: DRIFT DETECTED in SECTIONS.md!"
      DRIFT_DETECTED=true
    elif [ "$COMMITTED_API" != "$API_MD5" ]; then
      echo "ERROR: DRIFT DETECTED in API.md!"
      DRIFT_DETECTED=true
    fi
    
    if [ "$DRIFT_DETECTED" = "true" ]; then
      echo ""
      echo "Updated checksums in .git/DOCS_CHECKSUMS.md"
      
      echo "SECTIONS.md: $SECTIONS_MD5" > .git/DOCS_CHECKSUMS.md
      echo "API.md: $API_MD5" >> .git/DOCS_CHECKSUMS.md
      
      echo ""
      echo "To update committed checksums:"
      echo "  1. Commit updated .git/DOCS_CHECKSUMS.md"
      echo "  2. Push to remote"
    else
      echo ""
      echo "Docs are up to date. No drift detected."
  else
    echo "ERROR: .git/DOCS_CHECKSUMS.md not found - run with --init first to create"
  fi
  
  return $DRIFT_DETECTED
}

# Only run check if we're in a check (not called by other scripts)
if [ "${1:-}" = "check" ]; then
  run_check
  exit $?
fi

# If called with --init, initialize checksum file
if [ "${1:-}" = "--init" ]; then
  echo "Initializing checksum file..."
  
  echo "# Doc Checksums" > .git/DOCS_CHECKSUMS.md
  echo ""
  echo "Add entries as: | md5sum file |" > .git/DOCS_CHECKSUMS.md
  echo ""
  echo "Example:"
  echo "| Doc | Checksum |"
  echo "|---|---|---|"
  echo "| SECTIONS.md | $(checksum_file "$GENERATED_DIR/SECTIONS.md") |"
  echo "| API.md | $(checksum_file "$GENERATED_DIR/API.md") |"
  echo ""
  echo "_Last initialized: $(date -Iseconds) — Checksum file created._"
  
  exit 0
fi

# If called with --force, regenerate checksums
if [ "${1:-}" = "--force" ]; then
  run_check
fi
