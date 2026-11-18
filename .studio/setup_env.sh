#!/usr/bin/env bash
# One-shot environment rebuild (sandbox resets wipe /home/user).
set -e
cd /home/user
[ -x venv/bin/python ] || python3 -m venv venv
./venv/bin/pip -q install pillow numpy uharfbuzz freetype-py imageio-ffmpeg fonttools brotli
echo "python deps ok"

if [ ! -f /home/user/fonts/HindSiliguri-SemiBold.ttf ]; then
  mkdir -p /home/user/fonts && cd /home/user/fonts
  # Hind Siliguri (the reference reels' UI face) + Noto Serif Bengali (display face)
  for p in hind-siliguri noto-serif-bengali noto-sans-bengali; do
    url=$(curl -s "https://registry.npmjs.org/@fontsource/$p" \
      | /home/user/venv/bin/python -c "import json,sys;d=json.load(sys.stdin);v=d['dist-tags']['latest'];print(d['versions'][v]['dist']['tarball'])")
    curl -sL -o "$p.tgz" "$url"
    mkdir -p "x_$p" && tar xzf "$p.tgz" -C "x_$p"
  done
  /home/user/venv/bin/python - <<'PY'
import glob, os
from fontTools.ttLib import TTFont
from fontTools.merge import Merger
want = {
    "HindSiliguri-Regular":    ("hind-siliguri", "400"),
    "HindSiliguri-SemiBold":   ("hind-siliguri", "600"),
    "HindSiliguri-Bold":       ("hind-siliguri", "700"),
    "NotoSerifBengali-Bold":   ("noto-serif-bengali", "700"),
    "NotoSerifBengali-SemiBold": ("noto-serif-bengali", "600"),
    "NotoSansBengali-Regular": ("noto-sans-bengali", "400"),
    "NotoSansBengali-SemiBold": ("noto-sans-bengali", "600"),
    "NotoSansBengali-Bold":    ("noto-sans-bengali", "700"),
    "NotoSerifBengali-Medium": ("noto-serif-bengali", "500"),
}
for out, (pkg, w) in want.items():
    base = glob.glob(f"x_{pkg}/package/files/{pkg}-bengali-{w}-normal.woff2")
    latin = glob.glob(f"x_{pkg}/package/files/{pkg}-latin-{w}-normal.woff2")
    if not base:
        print("MISSING", pkg, w); continue
    parts = []
    for src in base + latin:
        f = TTFont(src); f.flavor = None
        p = f"/tmp/_{out}_{len(parts)}.ttf"; f.save(p); parts.append(p)
    m = Merger().merge(parts) if len(parts) > 1 else TTFont(parts[0])
    m.save(f"{out}.ttf")
    print("built", out, os.path.getsize(f"{out}.ttf"))
PY
fi
echo "fonts ok"
