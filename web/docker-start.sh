#!/bin/sh
set -e

# Next.js 16 needs at least one realized route under s/<locale> for the
# dynamic [locale] catch-all to register. Keep the first locale dir that
# has content; remove all others to prevent shadowing.
SDIR="/app/.next/server/app/s"
KEPT=""
if [ -d "$SDIR" ]; then
  for d in "$SDIR"/*/; do
    [ -d "$d" ] || continue
    base=$(basename "$d")
    [ "$base" = "[locale]" ] && continue
    if [ -z "$KEPT" ]; then
      KEPT="$base"
    else
      rm -rf "$d"
    fi
  done
fi

exec node server.js
