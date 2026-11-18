"""Thumbnails + 16:9 card for episode 009 — সাদা বক (4K, natural colour)."""
import os
import sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
os.chdir(HERE)
from PIL import Image
import kinetic as K
import rbtext as T
import rbvisual as V
import build_bok as B

W, H = B.W, B.H          # 2160 x 3840
S = B.SCALE
GOLD = (247, 214, 140)
CREAM = (255, 252, 245)
SOFT = (236, 244, 240)
MINT = (200, 240, 214)
OUT = "../deliver13"


def base(path, zoom=1.0, y_shift=0.0):
    im = Image.open(path).convert("RGB")
    s = max(W / im.width, H / im.height) * zoom
    im = im.resize((int(im.width * s + 1), int(im.height * s + 1)), Image.LANCZOS)
    x = (im.width - W) // 2
    y = int((im.height - H) * (0.5 + y_shift))
    im = im.crop((x, y, x + W, y + H))
    # exactly the reel's look: no warm wash, no saturation push
    im = B.soft_shade(im, top=0.20, bottom=0.24, head=0.10, head_h=0.26)
    im = B.natural_finish(im, vignette=0.16, grain=0.006)
    return im


def bottom_scrim(img, start=0.52, strength=0.44):
    """Soft bottom gradient so white type reads without a box behind it."""
    import numpy as np
    a = np.asarray(img, dtype=np.float32)
    yy = np.linspace(0, 1, a.shape[0], dtype=np.float32)
    m = strength * V.smoothstep(start, 1.0, yy) ** 1.15
    a *= (1 - m)[:, None, None]
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGB")


def line(img, txt, key, px, y, fill, a=1.0, center=True, x=0, halo=True):
    lay = T.flow(txt, key, px)
    xx = int((W - lay.width) // 2) if center else int(x)
    ink, kind = B.pick_ink(img, (xx, y - 8, xx + lay.width, y + lay.image.height + 12),
                           hint=fill)
    if kind == "light" and not halo:
        shadow = (0, 5 * S, (0, 0, 0), 0.42)
        T.paint(img, lay.image, (int(xx), int(y)), fill, a, shadow=shadow)
        return lay
    if kind == "light":
        from PIL import ImageFilter
        busy = V._edge_energy(img, (xx, y, xx + lay.width, y + lay.image.height))
        alpha = int(min(150, 62 + 110 * busy))
        soft = lay.image.filter(ImageFilter.GaussianBlur(max(16, px // 5)))
        halo = Image.new("RGBA", img.size, (0, 0, 0, 0))
        halo.paste(Image.new("RGBA", lay.image.size, (16, 18, 20, alpha)), (int(xx), int(y)), soft)
        img.paste(Image.alpha_composite(img.convert("RGBA"), halo).convert("RGB"), (0, 0))
        shadow = (0, 4 * S, (0, 0, 0), 0.34)
    else:
        shadow = (0, 3 * S, (255, 255, 255), 0.22)
    T.paint(img, lay.image, (int(xx), int(y)), ink, a, shadow=shadow)
    return lay


def build(src, chip, t1, t2, sub, out, zoom=1.0, y_shift=0.0, px=180, top=None,
          sub_y=None, rule=True, sub_top=False, px2=None):
    img = base(src, zoom=zoom, y_shift=y_shift)
    img = bottom_scrim(img, start=0.50, strength=0.46)
    K.chip(img, chip, (int(W * 0.075), 230 * S), 1.0, px=30 * S, colour=MINT, slide=0)
    px = int(px * S)
    px2 = px if px2 is None else int(px2 * S)
    top = int(1180 * S) if top is None else int(top * S)
    sub_y = int(1560 * S) if sub_y is None else int(sub_y)
    line(img, t1, "serif-bold", px, top, CREAM, halo=False)
    line(img, t2, "serif-bold", px2, top + int(px * 1.16), GOLD, halo=False)
    if rule:
        K.underline(img, W / 2 - 320, top + int(px * 2.42), 640, 1.0, GOLD)
    if sub_top:
        line(img, sub, "sans-semi", 36 * S, 300 * S, SOFT, center=False,
             x=int(W * 0.075), halo=False)
    else:
        line(img, sub, "sans-semi", 40 * S, sub_y, SOFT, halo=False)
    K.brand_lockup(img, (W - 250 * S, 54 * S), 1.0, size=50 * S, name_px=24 * S)
    img.save(os.path.join(OUT, out), quality=94)
    print("wrote", out)


build("../art_bok/b02_portrait.png", "দুই রঙের নয়, সাদাই",
      "সাদা বক", "কালো পা, হলুদ পাতা",
      "Egretta garzetta · Little Egret",
      "06b-thumbnail-bok.jpg", zoom=1.02, y_shift=0.10, px=152, top=1160,
      sub_y=1600, rule=False, sub_top=True, px2=104)

build("../art_bok/b04_flight.png", "উড়ান",
      "গলা ভাঁজ", "পা পেছনে",
      "নীলকণ্ঠ নয় · সাদা বক",
      "06c-thumbnail-flight.jpg", zoom=1.0, y_shift=-0.02, px=170, top=1220,
      sub_y=1620, rule=False)

build("../art_bok/b07_colony.png", "মিশ্র কলোনি",
      "গাছের মাথায়", "তিনটি নীল ডিম",
      "হাকালুকি হাওর · বক কলোনি",
      "06d-thumbnail-colony.jpg", zoom=1.06, y_shift=-0.05, px=160, top=1180,
      sub_y=1560, rule=False)

# 16:9 for the site / article header
im = Image.open("../art_bok/b10_poem.png").convert("RGB")
im = im.resize((2560, 1440), Image.LANCZOS)
# 16:9 canvas: the reel's masks are H-tall, so apply them on a copy first
im = im.crop((0, 0, 2560, 1440))
import numpy as np
a = np.asarray(im, dtype=np.float32)
yy = np.linspace(0, 1, 1440, dtype=np.float32)
m = np.clip(0.16 * (1 - V.smoothstep(0.0, 0.26, yy)) +
            0.18 * V.smoothstep(0.74, 1.0, yy), 0, 0.5)
a *= (1 - m)[:, None, None]
im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGB")
K.chip(im, "জলাশয় বাঁচলে বক বাঁচবে", (110, 100), 1.0, px=44, colour=GOLD, slide=0)
lay = T.flow("সাদা বক", "serif-bold", 210)
ink, _k = B.pick_ink(im, (110, 214, 110 + lay.width, 214 + lay.image.height), hint=CREAM)
T.paint(im, lay.image, (110, 214), ink, 1.0, shadow=(3, 6, (0, 0, 0), 0.55))
lay2 = T.flow("Egretta garzetta · Little Egret", "sans-semi", 58)
T.paint(im, lay2.image, (112, 470), (250, 232, 190), 1.0,
        shadow=(3, 5, (0, 0, 0), 0.72))
K.brand_lockup(im, (2560 - 420, 70), 1.0, size=86, name_px=40)
im.save(os.path.join(OUT, "06e-thumbnail-16x9.jpg"), quality=94)
print("wrote 16x9")
