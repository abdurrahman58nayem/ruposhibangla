"""QA contact sheet for the v12 ad: key frames from the rendered sequence with
the Reels safe lines drawn, so clipping/overlap is visible at a glance."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_ad3 as B
from PIL import Image, ImageDraw

FR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                  "render_ad", "frames")
FPS = B.FPS
# (label, absolute seconds)
KEYS = [("s1 hook", 1.4), ("s1 price", 4.6), ("s2 kettle", 8.2),
        ("s2 macro", 11.6), ("s3 flask", 17.4), ("s3 macro", 19.0),
        ("s4 combo", 21.8), ("s5 family", 26.0), ("s5 close", 31.4),
        ("s6 offer", 34.6), ("s6 cta", 38.4), ("s6 end", 40.0)]
tiles = []
for label, t in KEYS:
    f = min(len(sorted(os.listdir(FR))) - 1, int(round(t * FPS)))
    im = Image.open(os.path.join(FR, "%05d.jpg" % f)).convert("RGB")
    im = im.resize((360, 640), Image.LANCZOS)
    d = ImageDraw.Draw(im, "RGBA")
    d.rectangle([0, 0, 359, int(640 * B.SAFE_T)], fill=(255, 0, 0, 38))
    d.rectangle([0, int(640 * B.SAFE_B), 359, 640], fill=(255, 0, 0, 38))
    d.line([0, 640 * B.SAFE_T, 359, 640 * B.SAFE_T], fill=(255, 60, 60, 200), width=2)
    d.line([0, 640 * B.SAFE_B, 359, 640 * B.SAFE_B], fill=(255, 60, 60, 200), width=2)
    tiles.append((label, im))

sheet = Image.new("RGB", (360 * 6, 640 * 2 + 40), (12, 14, 18))
d = ImageDraw.Draw(sheet)
for i, (label, im) in enumerate(tiles):
    x, y = (i % 6) * 360, (i // 6) * 660
    sheet.paste(im, (x, y + 26))
    d.text((x + 8, y + 6), label, fill=(230, 235, 240))
out = os.path.join(os.path.dirname(FR), "..", "deliver23_ad", "06-qa-sheet.jpg")
sheet.save(out, quality=88)
print("qa ok", out, sheet.size)
