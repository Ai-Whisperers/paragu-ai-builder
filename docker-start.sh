#!/bin/sh
set -e

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