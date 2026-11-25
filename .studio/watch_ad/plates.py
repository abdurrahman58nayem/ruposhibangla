"""Product plates for the watch combo.

Two families of images, both built from the cut-out sprites in `cut3/`:

  singles/<key>.jpg    one watch on a cream plate (4:5, 1080x1350)
  combos/<id>.jpg      every legal 3-watch combination (4:5, 1080x1350)

A combo is: one OLEVS (A or B) + one leather watch (NICKIES or chrono)
+ the sports watch. 2 x 2 x 1 = 4 combinations, drawn in series.

    python plates.py            # both families
    python plates.py singles
    python plates.py combos
"""
from __future__ import annotations
import os, sys, itertools

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "v3"))
from PIL import Image, ImageDraw, ImageFilter
import numpy as np
import rbtext as T

spr = lambda k: Image.open(os.path.join(HERE, "cut3", k + ".png")).convert("RGBA")

W, H = 1080, 1350
CREAM_HI = (253, 250, 244)
CREAM = (247, 242, 232)
SAND = (233, 223, 203)
NAVY = (22, 35, 58)
NAVY_SOFT = (58, 74, 100)
CARAMEL = (176, 128, 60)

SINGLES = [
    ("olevs-a", "w_olevs_a", "OLEVS A", "সিলভার-গোল্ড"),
    ("olevs-b", "w_olevs_b", "OLEVS B", "অল-ব্ল্যাক"),
    ("nickies", "w_spider_big", "NICKIES", "স্পাইডার ডায়াল"),
    ("chrono", "w_t4g", "ক্রোনোগ্রাফ", "গানমেটার · চামড়া"),
    ("sport", "w_sport", "স্পোর্টস", "অষ্টভুজ · রাবার"),
]

COMBOS = [
    ("combo-1", ["w_olevs_a", "w_spider_big", "w_sport"],
     "OLEVS A + NICKIES + স্পোর্টস"),
    ("combo-2", ["w_olevs_a", "w_t4g", "w_sport"],
     "OLEVS A + ক্রোনোগ্রাফ + স্পোর্টস"),
    ("combo-3", ["w_olevs_b", "w_spider_big", "w_sport"],
     "OLEVS B + NICKIES + স্পোর্টস"),
    ("combo-4", ["w_olevs_b", "w_t4g", "w_sport"],
     "OLEVS B + ক্রোনোগ্রাফ + স্পোর্টস"),
]


def stage(w=W, h=H):
    yy = np.linspace(0, 1, h, dtype=np.float32)[:, None]
    a = np.zeros((h, w, 3), np.float32)
    for c in range(3):
        # only a whisper of warmth at the very bottom, otherwise flat cream
        t = 0.26 * yy ** 2.4
        a[..., c] = CREAM_HI[c] * (1 - t) + SAND[c] * t
    img = Image.fromarray(a.astype(np.uint8), "RGB")
    # soft key light from the top-left
    yy2, xx2 = np.mgrid[0:h:6, 0:w:6].astype(np.float32)
    d = np.sqrt(((xx2 / w - 0.24) / 0.8) ** 2 + ((yy2 / h - 0.05) / 0.66) ** 2)
    m = (np.clip(1 - d, 0, 1) ** 2 * 130).astype(np.uint8)
    m = Image.fromarray(m, "L").resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(60))
    img.paste(Image.new("RGB", img.size, (255, 253, 246)), (0, 0), m)
    return img


def place(bg, key, cx, cy, hgt, shadow=0.5):
    sp = spr(key)
    w = max(2, int(sp.width * hgt / sp.height))
    sp = sp.resize((w, int(hgt)), Image.LANCZOS)
    sh = Image.new("L", bg.size, 0)
    ImageDraw.Draw(sh).ellipse(
        [cx - w * 0.30, cy + hgt * 0.45, cx + w * 0.30, cy + hgt * 0.52],
        fill=int(150 * shadow))
    sh = sh.filter(ImageFilter.GaussianBlur(max(3, hgt * 0.045)))
    bg.paste(Image.new("RGB", bg.size, (146, 124, 92)), (0, 0), sh)
    bg.paste(sp, (int(cx - w / 2), int(cy - hgt / 2)), sp)
    return w, hgt


def label(bg, text, cx, y, px=44, col=NAVY, key="sans-semi"):
    """Shaped Bengali via HarfBuzz (Pillow alone can't join the conjuncts)."""
    mask, base = T.line(text, key, px)
    T.paint(bg, mask, (cx - mask.width / 2, y), col)
    return mask.width


def single(name, key, title, sub):
    bg = stage()
    place(bg, key, W // 2, 560, 900, shadow=0.45)
    latin = all(ord(ch) < 128 or ch == " " for ch in title)
    label(bg, title, W // 2, 1075, 62, NAVY, "sans-bold" if latin else "serif-bold")
    label(bg, sub, W // 2, 1148, 34, NAVY_SOFT)
    d = ImageDraw.Draw(bg)
    d.line([(330, 1226), (750, 1226)], fill=CARAMEL, width=2)
    label(bg, "৩টা ঘড়ির কম্বোতে মাত্র ৳১,০৯৯", W // 2, 1250, 32, CARAMEL)
    return bg


def combo(name, keys, caption):
    bg = stage()
    xs = [W * 0.19, W * 0.5, W * 0.81]
    for k, x in zip(keys, xs):
        place(bg, k, x, 570, 660, shadow=0.40)
    label(bg, "তিনটা ঘড়ি · ৳১,০৯৯", W // 2, 1020, 62, CARAMEL, "serif-bold")
    label(bg, caption, W // 2, 1124, 36, NAVY)
    d = ImageDraw.Draw(bg)
    d.line([(330, 1198), (750, 1198)], fill=CARAMEL, width=2)
    label(bg, "প্রতিটা স্লটে একটা · মোট ৩টা", W // 2, 1222, 30, NAVY_SOFT)
    return bg


def main():
    what = sys.argv[1] if len(sys.argv) > 1 else "both"
    if what in ("singles", "both"):
        out = os.path.join(HERE, "plates", "singles")
        os.makedirs(out, exist_ok=True)
        for name, key, title, sub in SINGLES:
            single(name, key, title, sub).save(os.path.join(out, name + ".jpg"),
                                               quality=92, optimize=True)
            print("single", name, flush=True)
    if what in ("combos", "both"):
        out = os.path.join(HERE, "plates", "combos")
        os.makedirs(out, exist_ok=True)
        for name, keys, cap in COMBOS:
            combo(name, keys, cap).save(os.path.join(out, name + ".jpg"),
                                        quality=92, optimize=True)
            print("combo", name, flush=True)


if __name__ == "__main__":
    main()
