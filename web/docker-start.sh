#!/bin/sh
set -e

SDIR="/app/.next/server/app/s"

if [ -d "$SDIR" ]; then
  for d in "$SDIR"/*/; do
    [ -d "$d" ] || continue
    base=$(basename "$d")
    [ "$base" = "[locale]" ] && continue
    rm -rf "$d"
  done
fi

exec node server.js
