"""Four layout stills for the 3-watch combo (light palette) — for approval before render."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import adkit_w as K
from adkit_w import (glare, W, H, SCALE, CREAM, CREAM_HI, SAND, NAVY, NAVY_SOFT, CARAMEL, CARAMEL_LT, WHITE,
                     stage, panel, place_panel, circle_photo, place_circle, txt, chip, measure,
                     hairline, dot, highkey, crop_frac, load, lift_shadow, veil)

T4G_BADGE = (0.462, 0.442, 0.618, 0.558)   # WA0031 full-image coords


def load_t4g():
    return glare(load(T4G), (0.545, 0.500), (0.115, 0.075), angle=-24, strength=1.0)
from PIL import Image, ImageDraw, ImageFilter

OUT = os.path.join(HERE, "stills")
os.makedirs(OUT, exist_ok=True)
S = 1  # stills at 1080x1920 -> scale factor relative to 4K constants
w, h = 1080, 1920

OLEVS_A = "IMG20261125102340.jpg"
OLEVS_B = "IMG20261125102431.jpg"
LOCK    = "IMG20261125102444.jpg"
NICK    = "IMG20261125185442.jpg"
NICK2   = "IMG20261125185452.jpg"
T4G     = "IMG-20261125-WA0031(1).jpg"
T4G2    = "IMG-20261125-WA0032(1).jpg"
RUB     = "IMG20261125102505.jpg"

# square crops (fractions chosen so the crop is pixel-square -> no cover-crop)
BOX_OLEVS_A = (0.235, 0.300, 0.725, 0.677)
BOX_OLEVS_B = (0.175, 0.317, 0.635, 0.663)
BOX_RUBBER  = (0.130, 0.207, 0.860, 0.754)
BOX_NICK    = (0.090, 0.240, 0.870, 0.830)
BOX_T4G     = (0.140, 0.320, 0.820, 0.830)


def px(v):   # type sizes authored at 1080 width
    return int(v * 1)


# ---------------------------------------------------------------- 01 hook --
def s01():
    bg = stage(w, h)
    # top: eyebrows
    txt(bg, "স্পেশাল অফার", "sans-bold", 40, (w/2, 118), CARAMEL, align="center")
    txt(bg, "৩টা ঘড়ি", "serif-bold", 150, (w/2, 176), NAVY, align="center")
    txt(bg, "একসাথে মাত্র", "sans-semi", 52, (w/2, 376), NAVY_SOFT, align="center")
    txt(bg, "৳১,০৯৯", "serif-bold", 190, (w/2, 440), CARAMEL, align="center")

    # three panels
    pw, ph = 292, 552
    y = 726
    xs = [40, 394, 748]
    specs = [(OLEVS_A, BOX_OLEVS_A, 0), (NICK, BOX_NICK, -18), (RUB, BOX_RUBBER, 0)]
    for x, (name, box, dy) in zip(xs, specs):
        im = crop_frac(load(name), box)
        pim, pm = panel(im, pw, ph, radius=0.07)
        place_panel(bg, pim, pm, x, y + dy, shadow=90)

    # labels under panels
    labels = [(xs[0] + pw/2, "OLEVS"), (xs[1] + pw/2, "NICKIES"), (xs[2] + pw/2, "স্পোর্টস ঘড়ি")]
    for cx, lab in labels:
        txt(bg, lab, "sans-bold", 30, (cx, y + ph + 26), NAVY_SOFT, align="center")

    # bottom band
    band_y = 1452
    hairline(bg, 90, w - 90, band_y, CARAMEL, 2, 120)
    txt(bg, "যেকোনো ৩টা মিলিয়ে নিন", "sans-semi", 44, (w/2, band_y + 42), NAVY, align="center")
    chip(bg, "মেসেজ করুন", "sans-bold", 40, (w/2, band_y + 132), CARAMEL, WHITE, 40, 20, align="center")
    txt(bg, "OLEVS · NICKIES · T4G · স্পোর্টস ঘড়ি", "sans", 30, (w/2, band_y + 246), NAVY_SOFT, align="center")
    return bg


# ------------------------------------------------------------- 02 olews ---
def s02():
    bg = stage(w, h)
    txt(bg, "প্রিমিয়াম", "sans-bold", 34, (72, 108), CARAMEL)
    txt(bg, "OLEVS", "serif-bold", 116, (68, 152), NAVY)
    txt(bg, "বাটারফ্লাই লক · ওয়াটারপ্রুফ", "sans-semi", 40, (72, 300), NAVY_SOFT)

    # big circle: silver+gold dial
    size = 700
    im, m = circle_photo(crop_frac(load(OLEVS_A), BOX_OLEVS_A), size)
    place_circle(bg, im, m, (w - size)//2, 400, ring_w=4)

    # macro window bottom-left over nothing
    mw, mh = 268, 268
    mim = crop_frac(load(LOCK), (0.275, 0.365, 0.505, 0.595))
    pim, pm = panel(mim, mw, mh, radius=0.06, expo=1.06, sat=0.92)
    place_panel(bg, pim, pm, 74, 1106, shadow=100)
    txt(bg, "বাটারফ্লাই লক", "sans-semi", 30, (74, 1106 + mh + 10), CARAMEL)
    txt(bg, "ডাবল-লকিং ক্ল্যাস্প", "sans", 26, (74, 1106 + mh + 52), NAVY_SOFT)
    # colour options
    bx, by = 396, 1106
    txt(bg, "দুই ডিজাইন", "sans-semi", 30, (bx, by - 4), CARAMEL)
    for i, (nm, box) in enumerate([("A", BOX_OLEVS_A), ("B", BOX_OLEVS_B)]):
        s2 = 168
        oim, om = circle_photo(crop_frac(load(OLEVS_A if nm == "A" else OLEVS_B), box), s2)
        place_circle(bg, oim, om, bx + i * (s2 + 26), by + 52, ring_w=3, shadow=60)
        txt(bg, nm, "sans-bold", 24, (bx + i * (s2 + 26) + s2/2, by + 52 + s2 + 10), NAVY_SOFT, align="center")

    # feature rows
    fy = 1560
    hairline(bg, 90, w - 90, fy - 30, CARAMEL, 2, 110)
    feats = ["ওয়াটারপ্রুফ", "কালার গ্যারান্টি", "প্রিমিয়াম ফিনিশ"]
    for i, f in enumerate(feats):
        cx = 200 + i * 340
        dot(bg, cx - 12, fy + 30, 5, CARAMEL, 200)
        txt(bg, f, "sans-semi", 32, (cx, fy + 6), NAVY, align="center")
    # price strip
    strip = Image.new("RGBA", (w - 140, 170), (0, 0, 0, 0))
    ImageDraw.Draw(strip).rounded_rectangle([0, 0, w - 141, 169], radius=18, fill=CARAMEL + (235,))
    bg.paste(strip, (70, 1640), strip)
    txt(bg, "OLEVS সহ ৩টা ঘড়ি", "sans-semi", 34, (110, 1652), CREAM_HI)
    txt(bg, "৳১,০৯৯", "serif-bold", 86, (w - 110, 1636), WHITE, align="right")
    return bg


# ------------------------------------------------------------ 03 leather ---
def s03():
    bg = stage(w, h)
    txt(bg, "চামড়ার স্ট্র্যাপ", "serif-bold", 88, (w/2, 104), NAVY, align="center")
    txt(bg, "NICKIES  অথবা  T4G — আপনার পছন্দ", "sans-semi", 40, (w/2, 240), NAVY_SOFT, align="center")

    pw, ph = 470, 900
    left = crop_frac(load(NICK), (0.235, 0.085, 0.775, 0.895))
    pim, pm = panel(left, pw, ph, radius=0.055)
    place_panel(bg, pim, pm, 50, 340, shadow=100)
    right = crop_frac(load_t4g(), (0.075, 0.055, 0.885, 0.895))
    pim2, pm2 = panel(right, pw, ph, radius=0.055)
    place_panel(bg, pim2, pm2, 560, 340, shadow=100)

    txt(bg, "NICKIES", "sans-bold", 36, (50 + pw/2, 1268), NAVY, align="center")
    txt(bg, "স্পাইডার ডায়াল", "sans-semi", 28, (50 + pw/2, 1318), NAVY_SOFT, align="center")
    txt(bg, "T4G", "sans-bold", 36, (560 + pw/2, 1268), NAVY, align="center")
    txt(bg, "ক্রোনোগ্রাফ", "sans-semi", 28, (560 + pw/2, 1318), NAVY_SOFT, align="center")

    chip(bg, "T4G  ভিক্টর না ব্যাজ ক্রপ", "sans-semi", 0, (0,0), (0,0,0), WHITE, 0, 0, align="left") if False else None
    txt(bg, "দুটোই water-resistant · চামড়ার স্ট্র্যাপ", "sans-semi", 32, (w/2, 1440), NAVY_SOFT, align="center")

    hairline(bg, 90, w - 90, 1540, CARAMEL, 2, 110)
    txt(bg, "যে কোনো একটাই ৳১,০৯৯ কম্বোতে", "sans-semi", 40, (w/2, 1580), NAVY, align="center")
    chip(bg, "মেসেজ করুন", "sans-bold", 38, (w/2, 1680), CARAMEL, WHITE, 40, 20, align="center")
    return bg


# -------------------------------------------------------------- 04 price ---
def s04():
    bg = stage(w, h)
    # three tiny circles row
    size = 230
    items = [(NICK, BOX_NICK), (RUB, BOX_RUBBER), (OLEVS_A, BOX_OLEVS_A)]
    gap = 34
    total = size * 3 + gap * 2
    x0 = (w - total) // 2
    for i, (nm, box) in enumerate(items):
        im, m = circle_photo(crop_frac(load(nm), box), size)
        place_circle(bg, im, m, x0 + i * (size + gap), 150, ring_w=3, shadow=70)

    txt(bg, "আপনার কম্বো, আপনার পছন্দ", "serif-bold", 70, (w/2, 470), NAVY, align="center")
    txt(bg, "OLEVS A বা B  ·  Nickies বা T4G  ·  স্পোর্টস ঘড়ি", "sans-semi", 32, (w/2, 582), NAVY_SOFT, align="center")

    hairline(bg, 90, w - 90, 680, CARAMEL, 2, 120)

    # price block
    txt(bg, "মোট ৩টা", "sans-semi", 40, (w/2, 730), NAVY_SOFT, align="center")
    txt(bg, "৳১,০৯৯", "serif-bold", 210, (w/2, 790), CARAMEL, align="center")

    # what's in it
    rows = ["OLEVS — বাটারফ্লাই লক, ওয়াটারপ্রুফ", "NICKIES / T4G — চামড়ার স্ট্র্যাপ",
            "স্পোর্টস ঘড়ি — রাবার স্ট্র্যাপ, অষ্টভুজ কেস"]
    ry = 1100
    for i, r in enumerate(rows):
        dot(bg, 120, ry + i * 78 + 24, 6, CARAMEL, 210)
        txt(bg, r, "sans-semi", 34, (150, ry + i * 78), NAVY)

    hairline(bg, 90, w - 90, 1420, CARAMEL, 2, 110)
    txt(bg, "৩টা একসাথে · স্পেশাল অফার", "sans-semi", 38, (w/2, 1462), NAVY, align="center")
    chip(bg, "এখনই মেসেজ করুন", "sans-bold", 42, (w/2, 1560), CARAMEL, WHITE, 46, 24, align="center")
    txt(bg, "OLEVS · NICKIES · T4G — একসাথে ৳১,০৯৯", "sans", 30, (w/2, 1710), NAVY_SOFT, align="center")
    return bg


if __name__ == "__main__":
    for fn in (s01, s02, s03, s04):
        im = fn()
        p = os.path.join(OUT, fn.__name__ + ".jpg")
        im.save(p, quality=93)
        print(p)
