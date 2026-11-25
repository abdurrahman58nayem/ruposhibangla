import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_new as B
from PIL import Image, ImageDraw
FR = os.path.join(B.OUT, "frames")
FPS = B.FPS
KEYS = [("A hook", 1.2), ("A price", 5.0), ("B kettle", 10.4), ("B specs", 13.4),
        ("C flask", 17.0), ("C 24h", 19.6), ("D pair", 22.4), ("D price", 23.6),
        ("E wish", 27.0), ("E warm", 30.6), ("F price", 34.4), ("F cta", 37.6)]
tiles = []
for label, t in KEYS:
    f = min(len(sorted(os.listdir(FR))) - 1, int(round(t * FPS)))
    im = Image.open(os.path.join(FR, "%05d.jpg" % f)).convert("RGB").resize((360, 640), Image.LANCZOS)
    d = ImageDraw.Draw(im, "RGBA")
    d.rectangle([0, 0, 359, int(640 * B.SAFE_T)], fill=(255, 0, 0, 34))
    d.rectangle([0, int(640 * B.SAFE_B), 359, 640], fill=(255, 0, 0, 34))
    for y in (640 * B.SAFE_T, 640 * B.SAFE_B):
        d.line([0, y, 359, y], fill=(255, 60, 60, 210), width=2)
    tiles.append((label, im))
sheet = Image.new("RGB", (360 * 6, 660 * 2 + 8), (12, 14, 18))
d = ImageDraw.Draw(sheet)
for i, (label, im) in enumerate(tiles):
    x, y = (i % 6) * 360, (i // 6) * 668
    sheet.paste(im, (x, y + 26))
    d.text((x + 8, y + 6), label, fill=(232, 236, 240))
sheet.save(os.path.join(B.OUT, "..", "deliver_new", "06-qa-sheet.jpg"), quality=88)
print("qa ok", sheet.size)
