"""Thumbnails + 16:9 card for episode 008 — নীলকণ্ঠ."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE); os.chdir(HERE)
from PIL import Image
import kinetic as K
import rbtext as T
import rbvisual as V
from rbvisual import W, H

GOLD = (255, 206, 106); LIME = (198, 240, 150); CREAM = (255, 250, 238)
SOFT = (226, 242, 218)
OUT = "../deliver12"


def _scrim_h(img, y0, y1, strength):
    """Horizontal-band scrim that works on any canvas size (V.scrim is 1080x1920 only)."""
    import numpy as np
    a = np.asarray(img, dtype=np.float32)
    h = a.shape[0]
    y = np.arange(h, dtype=np.float32)[:, None]
    m = np.clip((y1 - y) / max(1.0, (y1 - y0)), 0, 1)
    a = a * (1 - strength * m)[:, :, None]
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGB")


def base(path, zoom=1.0, warm=0.34, sat=1.22, y_shift=0.0):
    im = Image.open(path).convert("RGB")
    s = max(W / im.width, H / im.height) * zoom
    im = im.resize((int(im.width * s + 1), int(im.height * s + 1)), Image.LANCZOS)
    x = (im.width - W) // 2
    y = int((im.height - H) * (0.5 + y_shift))
    im = im.crop((x, y, x + W, y + H))
    im = V.apply_grade(im, warm=warm, contrast=1.06, vignette=0.20, grain=0.010,
                       gamma=0.94, sat=sat, t=0)
    # same finishing pass as the reel, so thumb and video look like one set
    im = V.finish(im, target=112.0, sat=1.06, sharp=0.40)
    return im


def line(img, txt, key, px, y, fill, a=1.0, center=True, x=0, shadow=0.9):
    lay = T.flow(txt, key, px)
    if a < 0.999:
        img_ = lay.image.point(lambda v: int(v * a))
    else:
        img_ = lay.image
    V.text_backing(img, lay.image, ((W - lay.width) // 2 if center else x, y),
                   strength=0.55 * a, blur=18, offset=(3, 6))
    T.paint(img, img_, ((W - lay.width) // 2 if center else x, y), fill, a,
            shadow=(4, 6, (0, 0, 0), shadow), glow=(8.0, 0.20))
    return lay


def build(src, name, chip, t1, t2, sub, out, zoom=1.0, y_shift=0.0, px=98,
          top=420, rule=True, sub_y=1560):
    img = base(src, zoom=zoom, y_shift=y_shift)
    K.chip(img, chip, (90, 250), 1.0, px=31, colour=LIME, slide=0)
    line(img, t1, "serif-bold", px, top, CREAM)
    line(img, t2, "serif-bold", px, top + int(px * 1.19), GOLD)
    if rule:
        K.underline(img, W / 2 - 160, top + int(px * 2.42), 320, 1.0, GOLD)
    line(img, sub, "sans-semi", 40, sub_y, SOFT)
    K.brand_lockup(img, (W - 250, 54), 1.0, size=50, name_px=24)
    img.save(os.path.join(OUT, out), quality=93)
    print("wrote", out)


build("../../.studio/art_nil/n02_portrait.png", "portrait", "দুই রঙের এক পাখি",
      "বসে থাকলে বাদামি", "উড়লে নীল", "Indian Roller · Coracias benghalensis",
      "06b-thumbnail-roller.jpg", zoom=1.02, y_shift=0.10, px=92,
      top=1130, rule=False)
build("../../.studio/art_nil/n03_flight.png", "flight", "ডানা খুললেই",
      "আকাশি", "ফিরোজা", "নীলকণ্ঠ · Indian Roller",
      "06c-thumbnail-flight.jpg", zoom=1.0, y_shift=-0.02, px=104, top=1250, rule=False)
build("../../.studio/art_nil/n06_hunt.png", "hunt", "কৃষকের বন্ধু",
      "ক্ষেতের পোকা", "খেয়ে বাঁচায়", "ঘাসফড়িং, গুবরে পোকা, ফড়িং",
      "06d-thumbnail-hunt.jpg", zoom=1.05, y_shift=-0.04, px=92, top=1300, rule=False, sub_y=1620)

# 16:9 for the site / article header
im = Image.open("../../.studio/art_nil/n02_portrait.png").convert("RGB")
im = im.resize((1280, 720), Image.LANCZOS)
im = V.apply_grade(im, warm=0.30, contrast=1.05, vignette=0.0, grain=0.0, gamma=0.95,
                   sat=1.16, t=0)
im = V.finish(im, target=112.0, sat=1.06, sharp=0.38)
im = _scrim_h(im, 0, 340, 0.26)
K.chip(im, "রূপসী বাংলার পাখি", (58, 60), 1.0, px=26, colour=GOLD, slide=0)
# cream title: gold type on a gold sunset has no contrast
lay = T.flow("নীলকণ্ঠ", "serif-bold", 118)
V.text_backing(im, lay.image, (60, 118), strength=0.30, blur=26, offset=(2, 5))
T.paint(im, lay.image, (60, 118), CREAM, 1.0,
        shadow=(3, 5, (0, 0, 0), 0.72), glow=(9.0, 0.16))
lay2 = T.flow("Indian Roller · Coracias benghalensis", "sans-semi", 34)
T.paint(im, lay2.image, (62, 306), (255, 224, 160), 1.0,
        shadow=(3, 4, (0, 0, 0), 0.80), glow=(6.0, 0.12))
K.brand_lockup(im, (1280 - 250, 38), 1.0, size=46, name_px=22)
im.save(os.path.join(OUT, "06e-thumbnail-16x9.jpg"), quality=93)
print("wrote 16x9")
