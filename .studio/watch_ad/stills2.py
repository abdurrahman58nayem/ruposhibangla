"""Layout stills v2 — all product plates are generated artwork (no user photos).

Structure per the user's brief:
  * hook shows ONE watch, not the trio
  * each product pitch shows ONE watch
  * the combo is explained as a series of combinations
  * the trio only appears at the end ("বেছে নিন আপনার কম্বো")
"""
import os, sys, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import adkit_w as K
from adkit_w import (W, H, SCALE, NAVY, NAVY_SOFT, CARAMEL, CARAMEL_LT, CREAM, CREAM_HI, SAND, WHITE,
                     stage, txt, chip, hairline, dot, measure)
import rbtext as T

OUT = os.path.join(HERE, "stills2")
os.makedirs(OUT, exist_ok=True)
CUT = os.path.join(HERE, "cut2")
w, h = 1080, 1920

SPR = {}
for k in ("w_olevs_a", "w_olevs_b", "w_spider", "w_t4g", "w_sport", "w_lock"):
    SPR[k] = Image.open(os.path.join(CUT, k + ".png")).convert("RGBA")


def sprite(canvas, key, cx, cy, hgt, shadow=0.55, alpha=1.0, tilt=0.0):
    """Place a cut-out on the stage with a soft contact shadow; hgt = height in px."""
    sp = SPR[key]
    hh = int(hgt)
    ww = max(2, int(sp.width * hh / sp.height))
    sp = sp.resize((ww, hh), Image.LANCZOS)
    if tilt:
        sp = sp.rotate(tilt, resample=Image.BICUBIC, expand=True)
    x0, y0 = int(cx - sp.width / 2), int(cy - sp.height / 2)
    # contact shadow
    sh = Image.new("L", canvas.size, 0)
    d = ImageDraw.Draw(sh)
    d.ellipse([cx - sp.width * 0.30, cy + hh * 0.46 - hh * 0.03,
               cx + sp.width * 0.30, cy + hh * 0.46 + hh * 0.045], fill=int(150 * shadow))
    sh = sh.filter(ImageFilter.GaussianBlur(hh * 0.045))
    canvas.paste(Image.new("RGB", canvas.size, (146, 124, 92)), (0, 0), sh)
    if alpha < 1.0:
        sp = sp.copy()
        a = sp.split()[3].point(lambda v: int(v * alpha))
        sp.putalpha(a)
    canvas.paste(sp, (x0, y0), sp)
    return (x0, y0, sp.width, sp.height)


# ------------------------------------------------------------------ 01 hook --
def s01():
    bg = stage(w, h)
    txt(bg, "স্পেশাল অফার", "sans-bold", 36, (w / 2, 150), CARAMEL, align="center")
    txt(bg, "৩টা ঘড়ি", "serif-bold", 132, (w / 2, 208), NAVY, align="center")
    txt(bg, "একসাথে মাত্র", "sans-semi", 48, (w / 2, 392), NAVY_SOFT, align="center")
    txt(bg, "৳১,০৯৯", "serif-bold", 200, (w / 2, 452), CARAMEL, align="center")
    sprite(bg, "w_olevs_a", w / 2, 1235, 900)
    hairline(bg, 150, w - 150, 1700, CARAMEL, 2, 120)
    txt(bg, "OLEVS · NICKIES · স্পোর্টস", "sans-bold", 32, (w / 2, 1745), NAVY_SOFT, align="center")
    return bg


# ----------------------------------------------------------------- 02 olews --
def s02():
    bg = stage(w, h)
    txt(bg, "প্রিমিয়াম", "sans-bold", 32, (76, 132), CARAMEL)
    txt(bg, "OLEVS", "serif-bold", 124, (70, 176), NAVY)
    txt(bg, "বাটারফ্লাই লক · ওয়াটারপ্রুফ", "sans-semi", 38, (76, 338), NAVY_SOFT)
    sprite(bg, "w_olevs_a", w / 2 + 230, 880, 780)
    # lock macro card (square cover-crop of the clasp head)
    lk = SPR["w_lock"]
    side = 320
    sc = max(side / lk.width, side / lk.height)
    lk2 = lk.resize((int(lk.width * sc) + 1, int(lk.height * sc) + 1), Image.LANCZOS)
    ox = int((lk2.width - side) * 0.42); oy = int((lk2.height - side) * 0.10)
    lk2 = lk2.crop((ox, oy, ox + side, oy + side))
    card = Image.new("RGB", (side, side), CREAM_HI)
    card.paste(lk2, (0, 0), lk2)
    m = Image.new("L", card.size, 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, side - 1, side - 1], radius=16, fill=255)
    cx, cy = 66, 1150
    sh = Image.new("L", bg.size, 0)
    ImageDraw.Draw(sh).rounded_rectangle([cx + 5, cy + 12, cx + side - 5, cy + side],
                                        radius=16, fill=105)
    sh = sh.filter(ImageFilter.GaussianBlur(14))
    bg.paste(Image.new("RGB", bg.size, (150, 128, 96)), (0, 0), sh)
    bg.paste(card, (cx, cy), m)
    txt(bg, "OLEVS", "sans-bold", 26, (cx + side / 2, cy + side + 30), CARAMEL, align="center")
    txt(bg, "বাটারফ্লাই লক", "sans-semi", 34, (cx + side / 2, cy + side + 72), NAVY, align="center")
    txt(bg, "ডাবল-লকিং ক্ল্যাস্প", "sans", 26, (cx + side / 2, cy + side + 116), NAVY_SOFT, align="center")
    # feature strip
    hairline(bg, 90, w - 90, 1620, CARAMEL, 2, 110)
    feats = ["ওয়াটারপ্রুফ", "কালার গ্যারান্টি", "প্রিমিয়াম ফিনিশ"]
    for i, f in enumerate(feats):
        cx2 = 200 + i * 340
        dot(bg, cx2 - 16, 1700, 5, CARAMEL, 200)
        txt(bg, f, "sans-semi", 30, (cx2, 1676), NAVY, align="center")
    return bg


# ------------------------------------------------------- 03 / 04 leather+alt --
def s03():
    bg = stage(w, h)
    txt(bg, "চামড়ার স্ট্র্যাপ", "serif-bold", 92, (w / 2, 140), NAVY, align="center")
    txt(bg, "স্পাইডার ডায়াল · সিলভার কেস", "sans-semi", 38, (w / 2, 278), NAVY_SOFT, align="center")
    sprite(bg, "w_spider", w / 2, 940, 880)
    txt(bg, "NICKIES", "sans-bold", 54, (w / 2, 1400), CARAMEL, align="center")
    txt(bg, "water-resistant চামড়ার স্ট্র্যাপ", "sans-semi", 32, (w / 2, 1478), NAVY, align="center")
    hairline(bg, 150, w - 150, 1570, CARAMEL, 2, 110)
    txt(bg, "অথবা ক্রোনোগ্রাফ মডেল", "sans-semi", 42, (w / 2, 1612), NAVY, align="center")
    chip(bg, "একই দামে", "sans-bold", 32, (w / 2, 1700), CARAMEL, WHITE, 34, 14, align="center")
    return bg


def s04():
    bg = stage(w, h)
    txt(bg, "স্পোর্টস ঘড়ি", "serif-bold", 92, (w / 2, 140), NAVY, align="center")
    txt(bg, "অষ্টভুজ কেস · রাবার স্ট্র্যাপ", "sans-semi", 38, (w / 2, 278), NAVY_SOFT, align="center")
    sprite(bg, "w_sport", w / 2, 930, 1060)
    txt(bg, "ম্যাট ব্ল্যাক ফিনিশ", "sans-semi", 34, (w / 2, 1560), NAVY, align="center")
    hairline(bg, 150, w - 150, 1640, CARAMEL, 2, 110)
    txt(bg, "রোজকার ব্যবহারের জন্য টেকসই", "sans-semi", 36, (w / 2, 1682), NAVY_SOFT, align="center")
    return bg


# ---------------------------------------------------------------- 05 combo ---
def s05():
    bg = stage(w, h)
    txt(bg, "কম্বো যেভাবে", "serif-bold", 80, (w / 2, 92), NAVY, align="center")
    txt(bg, "৩টা স্লট — প্রতিটা স্লটে পছন্দ", "sans-semi", 36, (w / 2, 200), NAVY_SOFT, align="center")
    rows = [
        ("OLEVS", "২ ডিজাইন থেকে ১টি", ["w_olevs_a", "w_olevs_b"]),
        ("চামড়ার স্ট্র্যাপ", "২ অপশন থেকে ১টি", ["w_spider", "w_t4g"]),
        ("স্পোর্টস ঘড়ি", "১টি", ["w_sport"]),
    ]
    y = 268
    for i, (name, sub, keys) in enumerate(rows):
        txt(bg, name, "sans-bold", 44, (64, y + 40), NAVY)
        txt(bg, sub, "sans", 30, (64, y + 96), NAVY_SOFT)
        n = len(keys)
        slot_w = 300
        x0 = w - 64 - (n * slot_w)
        for j, k in enumerate(keys):
            sprite(bg, k, x0 + slot_w // 2 + j * slot_w, y + 132, 248, shadow=0.35)
        if n > 1:
            chip(bg, "১টি বাছুন", "sans-semi", 24, (64, y + 152), CARAMEL_LT, WHITE, 26, 12, align="left")
        y += 300
        if i < 2:
            hairline(bg, 64, w - 64, y - 26, CARAMEL, 1, 60)
    # two worked examples, in series
    txt(bg, "যেমন", "sans-bold", 30, (64, 1180), CARAMEL)
    combos = [["w_olevs_a", "w_spider", "w_sport"],
              ["w_olevs_b", "w_t4g", "w_sport"]]
    cy = 1330
    for row in combos:
        for j, k in enumerate(row):
            sprite(bg, k, 200 + j * 300, cy, 168, shadow=0.30)
            if j < 2:
                txt(bg, "+", "sans-bold", 40, (200 + j * 300 + 150, cy - 6), CARAMEL, align="center")
        cy += 230
    hairline(bg, 64, w - 64, 1790, CARAMEL, 2, 100)
    txt(bg, "মোট ৩টা · ৳১,০৯৯", "serif-bold", 66, (w / 2, 1830), CARAMEL, align="center")
    return bg


# ---------------------------------------------------------------- 06 close ---
def s06():
    bg = stage(w, h)
    txt(bg, "বেছে নিন আপনার কম্বো", "serif-bold", 76, (w / 2, 128), NAVY, align="center")
    txt(bg, "নিচের তালিকা থেকে ৩টা", "sans-semi", 36, (w / 2, 244), NAVY_SOFT, align="center")
    for i, k in enumerate(["w_spider", "w_sport", "w_olevs_a"]):
        sprite(bg, k, 230 + i * 310, 640, 380, shadow=0.45)
    txt(bg, "মোট ৳১,০৯৯", "serif-bold", 120, (w / 2, 980), CARAMEL, align="center")
    rows = ["OLEVS — ২ ডিজাইনের যেকোনো ১টি",
            "NICKIES বা ক্রোনোগ্রাফ — যেকোনো ১টি",
            "স্পোর্টস ঘড়ি — ১টি"]
    for i, r in enumerate(rows):
        dot(bg, 122, 1210 + i * 92 + 26, 6, CARAMEL, 210)
        txt(bg, r, "sans-semi", 36, (156, 1210 + i * 92), NAVY)
    hairline(bg, 90, w - 90, 1540, CARAMEL, 2, 110)
    txt(bg, "স্পেশাল অফার · সীমিত স্টক", "sans-semi", 36, (w / 2, 1578), NAVY, align="center")
    chip(bg, "এখনই মেসেজ করুন", "sans-bold", 44, (w / 2, 1664), CARAMEL, WHITE, 48, 24, align="center")
    return bg


if __name__ == "__main__":
    for fn in (s01, s02, s03, s04, s05, s06):
        im = fn()
        p = os.path.join(OUT, fn.__name__ + ".jpg")
        im.save(p, quality=93)
    print("done")
