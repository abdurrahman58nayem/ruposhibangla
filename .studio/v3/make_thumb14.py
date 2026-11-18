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
import build_agni as B

W, H = B.W, B.H
S = B.SCALE
GOLD = (250, 206, 132)
CREAM = (255, 252, 245)
SOFT = (238, 246, 240)
MINT = (200, 240, 214)
FLAME = (255, 168, 130)
OUT = "../deliver14"


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


def build(src, chip, t1, t2, sub, out, zoom=1.0, y_shift=0.0, px=180, px2=None,
          top=None, sub_y=None, sub_top=False):
    img = base(src, zoom=zoom, y_shift=y_shift)
    img = bottom_scrim(img, start=0.50, strength=0.46)
    K.chip(img, chip, (int(W * 0.075), 230 * S), 1.0, px=30 * S, colour=FLAME, slide=0)
    px = int(px * S)
    px2 = px if px2 is None else int(px2 * S)
    top = int(1180 * S) if top is None else int(top * S)
    sub_y = int(1560 * S) if sub_y is None else int(sub_y)
    line(img, t1, "serif-bold", px, top, CREAM)
    line(img, t2, "serif-bold", px2, top + int(px * 1.16), GOLD)
    if sub_top:
        line(img, sub, "sans-semi", 36 * S, 300 * S, SOFT, center=False,
             x=int(W * 0.075))
    else:
        line(img, sub, "sans-semi", 40 * S, sub_y, SOFT)
    K.brand_lockup(img, (W - 250 * S, 54 * S), 1.0, size=50 * S, name_px=24 * S)
    img.save(os.path.join(OUT, out), quality=94)
    print("wrote", out)


build("../art_agni/g02_portrait.png", "গলায় আগুন",
      "অগ্নিগলা", "Firethroat",
      "Calliope pectardens · প্রায়-বিপন্ন (NT)",
      "06b-thumbnail-agnigola.jpg", zoom=1.02, y_shift=0.08, px=168,
      px2=104, top=1130, sub_top=True)

build("../art_agni/g04_size.png", "মাত্র ১৩–১৪ সেমি",
      "চড়াইয়ের চেয়েও", "ছোট",
      "অগ্নিগলা · হাতের তালুতে ধরে ফেলা যায়",
      "06c-thumbnail-size.jpg", zoom=1.05, y_shift=-0.06, px=170, px2=130,
      top=1200)

build("../art_agni/g03_female.png", "স্ত্রী পাখি",
      "গলায় আগুন নেই", "বাদামি ছদ্মবেশ",
      "পুরুষের গলা লাল, স্ত্রীর সাদামাটা",
      "06d-thumbnail-female.jpg", zoom=1.10, y_shift=0.02, px=150, px2=112,
      top=1180)

# 16:9 for the site / article header
im = Image.open("../art_agni/g09_forest.png").convert("RGB")
im = im.resize((2560, 1440), Image.LANCZOS)
a = np.asarray(im, dtype=np.float32)
yy = np.linspace(0, 1, 1440, dtype=np.float32)
m = np.clip(0.20 * (1 - V.smoothstep(0.0, 0.30, yy)) + 0.16 * V.smoothstep(0.78, 1.0, yy), 0, 0.5)
a *= (1 - m)[:, None, None]
im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGB")
K.chip(im, "প্রায়-বিপন্ন · NT", (110, 100), 1.0, px=44, colour=FLAME, slide=0)
lay = T.flow("অগ্নিগলা", "serif-bold", 210)
ink, _k = B.pick_ink(im, (110, 214, 110 + lay.width, 214 + lay.image.height), hint=CREAM)
T.paint(im, lay.image, (110, 214), ink, 1.0, shadow=(3, 6, (0, 0, 0), 0.55))
lay2 = T.flow("Firethroat · Calliope pectardens", "sans-semi", 58)
T.paint(im, lay2.image, (112, 470), (250, 226, 196), 1.0,
        shadow=(3, 5, (0, 0, 0), 0.72))
K.brand_lockup(im, (2560 - 420, 70), 1.0, size=86, name_px=40)
im.save(os.path.join(OUT, "06e-thumbnail-16x9.jpg"), quality=94)
print("wrote 16x9")
