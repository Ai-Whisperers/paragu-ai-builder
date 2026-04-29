#!/bin/sh
set -e

# Next.js 16 generates static locale directories (s/en/, s/es/, s/nl/) at
# build time that shadow the [locale] dynamic segment. Remove them before
# the server starts so Express routes to the correct catch-all handler.
CLEAN_DIR="/app/.next/server/app/s"
if [ -d "$CLEAN_DIR" ]; then
  for d in "$CLEAN_DIR"/*/; do
    base=$(basename "$d")
    if [ "$base" != "[locale]" ]; then
      rm -rf "$d"
    fi
  done
fi

exec node server.js
