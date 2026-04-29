#!/bin/sh
set -e

# Next.js 16 generates static locale directories (s/en/, s/es/, s/nl/) at
# build time that shadow the [locale] dynamic segment. We need to keep
# AT LEAST one realized route so Next.js registers the route handler.
# Remove all but the first locale directory to prevent shadowing while
# keeping the dynamic router active.
CLEAN_DIR="/app/.next/server/app/s"
LOCALE_DIR="$CLEAN_DIR/[locale]"
FIRST=""
FIRST_PATH=""

if [ -d "$CLEAN_DIR" ]; then
  for d in "$CLEAN_DIR"/*/; do
    base=$(basename "$d")
    [ "$base" = "[locale]" ] && continue
    if [ -z "$FIRST" ]; then
      FIRST="$base"
      FIRST_PATH="$d"
    else
      rm -rf "$d"
    fi
  done
fi

exec node server.js
