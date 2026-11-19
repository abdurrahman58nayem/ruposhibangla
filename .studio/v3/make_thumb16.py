"""Thumbnails + 16:9 card for episode 010 — অগ্নিগলা (4K, natural colour)."""
import os
import sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
os.chdir(HERE)
import numpy as np
from PIL import Image
import kinetic as K
import rbtext as T
import rbvisual as V
import build_grass as B

W, H = B.W, B.H
S = B.SCALE
GOLD = (250, 206, 132)
CREAM = (255, 252, 245)
SOFT = (238, 246, 240)
MINT = (200, 240, 214)
FLAME = (255, 168, 130)
OUT = "../deliver16"


def base(path, zoom=1.0, y_shift=0.0):
    im = Image.open(path).convert("RGB")
    s = max(W / im.width, H / im.height) * zoom
    im = im.resize((int(im.width * s + 1), int(im.height * s + 1)), Image.LANCZOS)
    x = (im.width - W) // 2
    y = int((im.height - H) * (0.5 + y_shift))
    im = im.crop((x, y, x + W, y + H))
    im = B.soft_shade(im, top=0.20, bottom=0.24, head=0.10, head_h=0.26)
    im = B.natural_finish(im, vignette=0.18, grain=0.006)
    return im


def bottom_scrim(img, start=0.50, strength=0.46):
    a = np.asarray(img, dtype=np.float32)
    yy = np.linspace(0, 1, a.shape[0], dtype=np.float32)
    m = strength * V.smoothstep(start, 1.0, yy) ** 1.15
    a *= (1 - m)[:, None, None]
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGB")


def line(img, txt, key, px, y, fill, a=1.0, center=True, x=0):
    lay = T.flow(txt, key, px)
    xx = int((W - lay.width) // 2) if center else int(x)
    ink, kind = B.pick_ink(img, (xx, y - 8, xx + lay.width, y + lay.image.height + 12),
                           hint=fill)
    T.paint(img, lay.image, (xx, int(y)), ink, a,
            shadow=(0, 5 * S, (0, 0, 0), 0.46))
    return lay


def centred(img, txt, key, px, y, fill, a=1.0, shadow=(0, 5 * S, (0, 0, 0), 0.46)):
    lay = T.flow(txt, key, px)
    xx = int((W - lay.width) // 2)
    T.paint(img, lay.image, (xx, int(y)), fill, a, shadow=shadow)
    return lay


def build(src, chip, t1, t2, sub, out, zoom=1.0, y_shift=0.0, px=150, px2=None,
          top=None, sub_y=None, sub_top=False, label=None):
    """Reference layout: centred chip, centred cream/gold title stack, small caption."""
    img = base(src, zoom=zoom, y_shift=y_shift)
    # text sits in the empty lower part of the frame, never on the bird
    img = bottom_scrim(img, start=0.52, strength=0.42)
    px = int(px * S)
    px2 = px if px2 is None else int(px2 * S)
    top = int(1000 * S) if top is None else int(top * S)

    # small bordered pill chip, centred, above the title
    cl = T.flow(chip, "sans-semibold" if False else "sans-semi", 30 * S)
    K.chip(img, chip, (int((W - cl.width - 60) / 2), top - 150 * S), 1.0,
           px=30 * S, colour=FLAME, slide=0)

    h1 = centred(img, t1, "serif-bold", px, top, CREAM).image.height
    centred(img, t2, "serif-bold", px2, top + h1 + 8 * S, GOLD)

    sub_lay = T.flow(sub, "sans-semi", 34 * S)
    sy = int(sub_y * S) if sub_y else int(top + h1 + 8 * S + px2 * 1.14 + 46 * S)
    T.paint(img, sub_lay.image, (int((W - sub_lay.width) / 2), sy), SOFT, 1.0,
            shadow=(0, 4 * S, (0, 0, 0), 0.44))

    K.brand_lockup(img, (W - 250 * S, 54 * S), 1.0, size=50 * S, name_px=24 * S)
    img.save(os.path.join(OUT, out), quality=94)
    print("wrote", out)


build("../art_grass/g02_portrait.png", "প্রায়-বিপন্ন · NT",
      "আঁশঠুঁটি", "ঘাসপাখি",
      "Schoenicola striatus · Bristled Grassbird",
      "06b-thumbnail-grass.jpg", zoom=1.02, y_shift=0.10, px=118,
      px2=104, top=1220)

build("../art_grass/g04_size.png", "শীতে দুর্লভ অতিথি",
      "অর্ধেকটাই", "লেজ",
      "দৈর্ঘ্য ১৮–২০ সেন্টিমিটার",
      "06c-thumbnail-size.jpg", zoom=1.05, y_shift=-0.04, px=120, px2=118,
      top=1180)

build("../art_grass/g03_detail.png", "শনাক্তকরণ",
      "ঘাড়ে আঁশের", "টানা পালক",
      "লম্বা-মোটা, সরু ঠোঁট",
      "06d-thumbnail-detail.jpg", zoom=1.06, y_shift=0.04, px=112, px2=106,
      top=1200)

# 16:9 for the site / article header
im = Image.open("../art_grass/g10_outro.png").convert("RGB")
im = im.resize((2560, 1440), Image.LANCZOS)
a = np.asarray(im, dtype=np.float32)
yy = np.linspace(0, 1, 1440, dtype=np.float32)
m = np.clip(0.20 * (1 - V.smoothstep(0.0, 0.30, yy)) + 0.16 * V.smoothstep(0.78, 1.0, yy), 0, 0.5)
a *= (1 - m)[:, None, None]
im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGB")
K.chip(im, "প্রায়-বিপন্ন · NT", (110, 100), 1.0, px=44, colour=FLAME, slide=0)
lay = T.flow("আঁশঠুঁটি ঘাসপাখি", "serif-bold", 168)
ink, _k = B.pick_ink(im, (110, 214, 110 + lay.width, 214 + lay.image.height), hint=CREAM)
T.paint(im, lay.image, (110, 214), ink, 1.0, shadow=(3, 6, (0, 0, 0), 0.55))
lay2 = T.flow("Bristled Grassbird · Schoenicola striatus", "sans-semi", 54)
T.paint(im, lay2.image, (112, 430), (250, 226, 196), 1.0,
        shadow=(3, 5, (0, 0, 0), 0.72))
K.brand_lockup(im, (2560 - 420, 70), 1.0, size=86, name_px=40)
im.save(os.path.join(OUT, "06e-thumbnail-16x9.jpg"), quality=94)
print("wrote 16x9")
