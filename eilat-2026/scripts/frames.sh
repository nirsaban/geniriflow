#!/usr/bin/env bash
# Render preview stills: scripts/frames.sh <composition> <frame> [<frame>...]
comp=$1; shift
mkdir -p output/previews
for fr in "$@"; do
  npx remotion still src/index.ts "$comp" "output/previews/${comp}-${fr}.png" --frame="$fr" --scale=0.5 --log=error >/dev/null 2>&1 || echo "failed $fr"
done
