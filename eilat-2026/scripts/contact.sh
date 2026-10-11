#!/usr/bin/env bash
# Contact sheet of preview stills: scripts/contact.sh <comp> f1 f2 ...
comp=$1; shift
files=(); for fr in "$@"; do files+=("output/previews/${comp}-${fr}.png"); done
montage "${files[@]}" -tile 3x -geometry 640x360+4+4 -background '#222' "output/previews/${comp}-contact.png"
echo "output/previews/${comp}-contact.png"
