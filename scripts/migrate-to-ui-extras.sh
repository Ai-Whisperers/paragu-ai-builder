#!/bin/bash
#
# migrate-to-ui-extras.sh
#
# Migrates client sites to use @ai-whisperers/ui-extras
# Replaces local component imports with package imports
#
# Usage: ./migrate-to-ui-extras.sh [--dry-run] [--site SITE_NAME] [--all]
#
# Options:
#   --dry-run     Show changes without modifying files
#   --site NAME   Run for specific site only
#   --all         Run for all client sites in /root
#

set -e

DRY_RUN=false
SPECIFIC_SITE=""
RUN_ALL=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --site)
      SPECIFIC_SITE="$2"
      shift 2
      ;;
    --all)
      RUN_ALL=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# List of components to migrate
COMPONENTS=(
  "loading-bar"
  "share-whatsapp"
  "empty-state"
  "dark-mode-toggle"
  "bottom-nav"
  "promo-carousel"
)

# Sites to migrate (if --all is specified)
CLIENT_SITES=(
  "Arnos-Barber-Shop"
  "Avani-Belleza"
  "Barbye-Nails"
  "Clau-Bellino"
  "Cronos-Academy"
  "Estudio-Medieval"
  "HidroBaby-Spa"
  "Lele-Ferreira"
  "Leticia-Carballo"
  "Nutrifit-Spa"
  "Peluqueria-Barbershop"
  "Scott-Tatuajes"
  "Viviesteticpy"
  "Woman-Cosmeticos"
  "nde-barba"
  "portas-barber"
  "shine-nails"
  "xxgym"
)

# Function to check if a site uses a component
site_uses_component() {
  local site_path="$1"
  local component="$2"

  # Check both components/ and src/components/ directories
  if [[ -f "$site_path/components/$component.tsx" ]] || \
     [[ -f "$site_path/src/components/$component.tsx" ]] || \
     [[ -f "$site_path/app/components/$component.tsx" ]]; then
    echo "true"
    return
  fi

  # Check if the component is imported in any file
  if grep -r "from.*['\"].*$component['\"]" "$site_path/app" "$site_path/components" "$site_path/src" 2>/dev/null | grep -v node_modules | head -1; then
    echo "true"
    return
  fi

  echo "false"
}

# Function to migrate a single site
migrate_site() {
  local site_path="$1"
  local site_name=$(basename "$site_path")

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  📦 Migrating: $site_name"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  if [[ ! -d "$site_path" ]]; then
    echo "  ⚠️  Site directory not found: $site_path"
    return 1
  fi

  cd "$site_path" || return 1

  # Check if package.json exists
  if [[ ! -f "package.json" ]]; then
    echo "  ⚠️  No package.json found, skipping"
    cd - >/dev/null
    return 1
  fi

  # Track if we made any changes
  local has_changes=false

  # Check each component
  for component in "${COMPONENTS[@]}"; do
    local uses_it=$(site_uses_component "$site_path" "$component")

    if [[ "$uses_it" == "true" ]]; then
      echo "  ✓  Found component: $component"
      has_changes=true
    else
      echo "  ⊘  No $component found"
    fi
  done

  if [[ "$has_changes" == "false" ]]; then
    echo "  ℹ️  No ui-extras components found, skipping"
    cd - >/dev/null
    return 0
  fi

  # Add dependency to package.json
  if ! grep -q "@ai-whisperers/ui-extras" package.json; then
    echo "  ➕ Adding @ai-whisperers/ui-extras to package.json..."
    if [[ "$DRY_RUN" == "false" ]]; then
      npm install @ai-whisperers/ui-extras@^1.0.0 --save --legacy-peer-deps
    else
      echo "     [DRY RUN] Would run: npm install @ai-whisperers/ui-extras@^1.0.0 --save --legacy-peer-deps"
    fi
  else
    echo "  ✓  @ai-whisperers/ui-extras already in package.json"
  fi

  # Replace imports in files
  echo "  🔄 Replacing imports..."

  local files_to_check=(
    "app"
    "components"
    "src/app"
    "src/components"
  )

  for dir in "${files_to_check[@]}"; do
    if [[ -d "$dir" ]]; then
      find "$dir" -name "*.tsx" -o -name "*.ts" | while read -r file; do
        # Skip node_modules
        if [[ "$file" == *node_modules* ]]; then
          continue
        fi

        local changed=false
        local content

        # Read file content
        if content=$(cat "$file" 2>/dev/null); then
          local new_content="$content"

          # Replace component imports
          for component in "${COMPONENTS[@]}"; do
            # Match patterns like:
            #   import { LoadingBar } from "@/components/loading-bar"
            #   import { LoadingBar } from "./loading-bar"
            #   import { LoadingBar } from "../components/loading-bar"
            # and replace with:
            #   import { LoadingBar } from "@ai-whisperers/ui-extras"

            # Pattern 1: import with named exports
            new_content=$(echo "$new_content" | sed -E "s|import\s*\{([^}]+)\}\s+from\s+['\"].*[/]?$component['\"]|import { \1 } from \"@ai-whisperers/ui-extras\"|g")

            # Pattern 2: default import (less common but possible)
            new_content=$(echo "$new_content" | sed -E "s|import\s+\w+\s+from\s+['\"].*[/]?$component['\"]|// Migration required for default import to $component|g")
          done

          # Check if file changed
          if [[ "$content" != "$new_content" ]]; then
            changed=true
            echo "     - Modified: $file"
            if [[ "$DRY_RUN" == "false" ]]; then
              echo "$new_content" > "$file"
            else
              echo "       [DRY RUN] Would replace imports in: $file"
            fi
          fi
        fi
      done
    fi
  done

  cd - >/dev/null

  echo "  ✅ Migration complete for $site_name"
}

# Main execution
if [[ "$RUN_ALL" == "true" ]]; then
  echo "Running migration for ALL client sites..."
  echo ""

  for site in "${CLIENT_SITES[@]}"; do
    migrate_site "/opt/sites/$site"
  done

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  ✅ All migrations complete!"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

elif [[ -n "$SPECIFIC_SITE" ]]; then
  migrate_site "/opt/sites/$SPECIFIC_SITE"
else
  echo "Usage: $0 [--dry-run] [--site SITE_NAME] [--all]"
  echo ""
  echo "Options:"
  echo "  --dry-run     Show changes without modifying files"
  echo "  --site NAME   Run for specific site only"
  echo "  --all         Run for all client sites"
  echo ""
  echo "Examples:"
  echo "  $0 --dry-run --all"
  echo "  $0 --site magnolia-peluqueria"
  echo "  $0 --all"
  exit 1
fi