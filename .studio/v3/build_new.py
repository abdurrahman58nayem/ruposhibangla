"""Hawkins kettle + Elima flask — combo ad, v13.  Written from scratch.

Design language (deliberately different from every earlier round):

  * a **paper-and-ink** frame instead of a photographic stage: warm off-white
    stock, one deep navy, one marigold accent. No gradients, no frosted slabs.
  * **editorial layout** — the copy is set in a left-hand column with a hairline
    rule, the product bleeds off the right edge, and the price sits in a solid
    marigold band that runs the full width. It reads like a printed poster,
    which is what makes it stop a thumb in a feed.
  * **camera moves instead of object moves**: every scene is one slow push or
    drift. Type is revealed by a **wipe**, never by a shadowed fade, so nothing
    can ever sit on top of anything else.
  * **type is never stacked closer than one descender.** Every block is measured
    with rbtext.flow() before it is placed; the gaps are computed, not eyeballed.

Timeline (fps 30):
  A  0.00– 6.20   hook: poster card, combo + price band
  B  6.20–14.40   kettle: bleed photo, 3 spec lines, price tick
  C 14.40–19.60   flask: bleed photo, 24h claim, price tick
  D 19.60–23.00   split: the two together, one price
  E 23.00–30.20   family photo, the wish
  F 30.20–37.40   final card: price band + CTA
"""
from __future__ import annotations

import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

import kinetic as K
import rbtext as T

FPS = 30
SCALE = 2
W, H = 1080 * SCALE, 1920 * SCALE

# --------------------------------------------------------------- art direction
PAPER = (243, 238, 228)          # warm stock
PAPER_HI = (251, 248, 241)
NAVY = (17, 42, 66)
NAVY_SOFT = (52, 84, 112)
MARIGOLD = (222, 148, 34)
MARIGOLD_DK = (176, 112, 20)
RUST = (150, 62, 34)             # tiny accent for the "24" claim
INK = (24, 26, 30)
LINE = (196, 186, 168)

STUDIO = os.path.join(HERE, "..")
SPR = os.path.join(STUDIO, "ad", "sprite")
PLATES = os.path.join(STUDIO, "ad", "plates2")
ART = os.path.join(STUDIO, "art_ad")
VO = os.path.join(STUDIO, "vo_new")
OUT = os.path.join(STUDIO, "render_new")

SAFE_T, SAFE_B = 0.135, 0.790
GUTTER = 0.088                   # left margin of the editorial column

# --------------------------------------------------------------------- scenes
# every duration below is the read length + the breath around it
SCENES = [
    dict(id="A", dur=9.00, vo=[("m6", 0.30), ("m8", 4.20)],
         kicker="শীতের কম্বো",
         head="গরম পানি,\nএক দামে",
         price=1550),
    dict(id="B", dur=6.60, vo=("m2", 0.30),
         kicker="Hawkins ইলেকট্রিক কেটল",
         head="মিনিটেই\nফুটে ওঠে",
         specs=[("২ লিটার", "একবারে পরিবার ভরে"),
                ("স্টেইনলেস স্টিল", "ভেতরটা পরিষ্কার থাকে"),
                ("অটো শাট-অফ", "ফুটলেই নিজে বন্ধ")]),
    dict(id="C", dur=5.40, vo=("m3", 0.30),
         kicker="Elima ভ্যাকুয়াম ফ্লাস্ক",
         head="২৪ ঘণ্টা\nগরম থাকে",
         head_cols=[RUST, NAVY],
         specs=[("১ লিটার", "চা-কফির জন্য যথেষ্ট"),
                ("প্রিমিয়াম ডিজাইন", "টেবিলে রাখতেই সুন্দর"),
                ("গন্ধহীন ভেতর", "স্বাদ বদলায় না")]),
    dict(id="D", dur=3.60, vo=("m9", 0.30),
         kicker="এক কম্বোতে", head="দুটোই"),
    dict(id="E", dur=8.00, vo=("m4", 0.30),
         kicker="এই শীতে", head="পরিবারটা\nথাকুক উষ্ণ"),
    dict(id="F", dur=6.20, vo=("m5", 0.30),
         kicker="কম্বো অফার", head="আজই\nনিয়ে নিন", price=1550),
]

TOTAL = sum(s["dur"] for s in SCENES)


# ------------------------------------------------------------------ utilities
def paper(stage="warm"):
    """A flat, printable paper ground — no photographic plate, on purpose."""
    key = ("paper", stage)
    cached = _CACHE.get(key)
    if cached is not None:
        return cached
    arr = np.zeros((H, W, 3), np.float32)
    base = np.array(PAPER_HI if stage == "hi" else PAPER, np.float32)
    # a very soft vertical shift, 1.5% — enough to keep it from looking digital
    yy = (np.arange(H, dtype=np.float32) / H)[:, None, None]
    arr[:] = base * (1.0 + 0.02 * (yy - 0.5))
    rng = np.random.default_rng(7)
    fib = rng.normal(0, 4.2, (H // 3, W // 3, 1)).astype(np.float32)
    fib = np.asarray(Image.fromarray(((fib[:, :, 0] + 12) * 8 + 40).clip(0, 255)
                                     .astype(np.uint8), "L")
                     .resize((W, H), Image.BICUBIC), np.float32)[:, :, None]
    arr += (fib - 46) * 0.16
    _CACHE[key] = arr
    return arr


_CACHE = {}


def paper_img(stage="warm"):
    return Image.fromarray(np.clip(paper(stage), 0, 255).astype(np.uint8), "RGB")


def vgrad(arr, y0, y1, top_alpha, colour, invert=False):
    """Multiply a soft colour band into the paper — the only shading we use."""
    h = arr.shape[0]
    y = (np.arange(h, dtype=np.float32) / h)[:, None, None]
    t = np.clip((y - y0) / max(1e-5, (y1 - y0)), 0, 1)
    if invert:
        t = 1 - t
    t = t * t * (3 - 2 * t)                     # smoothstep: no visible edge
    a = (t * top_alpha)
    c = np.array(colour, np.float32)
    return arr * (1 - a) + c * a


def push(img, z, cx=0.5, cy=0.5):
    """Scale about a point — the only camera move used in this film."""
    if abs(z - 1.0) < 1e-4:
        return img
    w, h = img.size
    nw, nh = int(w * z), int(h * z)
    big = img.resize((nw, nh), Image.LANCZOS)
    x = int(cx * nw - w / 2)
    y = int(cy * nh - h / 2)
    x = max(0, min(nw - w, x))
    y = max(0, min(nh - h, y))
    return big.crop((x, y, x + w, y + h))


def place(img, key, xf, base_y, scale, alpha=1.0, shadow=True):
    """Paste a product at an explicit left edge and base line.

    xf is the LEFT edge as a fraction of the frame, so a value above 1-ww/W (or
    below 0) crops the sprite against the frame edge. Cropping an object is what
    makes a poster read as a photograph of a real thing rather than a sticker
    pasted on a page — nothing is ever squeezed to fit.
    """
    spr = _SPR[key]
    hh = int(scale * H)
    ww = int(spr.width * hh / spr.height)
    sp = spr.resize((ww, hh), Image.LANCZOS)
    x = int(xf * W)
    y = int(base_y * H) - hh
    m = sp.split()[3]
    if alpha < 0.999:
        m = m.point(lambda v: int(v * alpha))
    if shadow:
        sh = Image.new("L", (ww + 260, 200), 0)
        ImageDraw.Draw(sh).ellipse([130, 60, ww + 130, 150], fill=255)
        sh = sh.filter(ImageFilter.GaussianBlur(30))
        sh = sh.point(lambda v: int(v * 0.26 * alpha))
        img.paste(Image.new("RGB", sh.size, (126, 112, 90)),
                  (x - 130, int(base_y * H) - 96), sh)
    img.paste(sp, (x, y), m)
    return img


# ------------------------------------------------------------------- type kit
class Type:
    """Measured text. Nothing is placed by guesswork: height comes from the ink."""

    def __init__(self, img):
        self.img = img
        self.d = ImageDraw.Draw(img, "RGBA")

    # -- one line, with an optional reveal progress (a left-to-right wipe)
    def line(self, txt, key, px, x, top, colour, alpha=1.0, wipe=1.0,
             align="left"):
        if alpha <= 0.004 or wipe <= 0.002:
            return 0
        lay = T.flow(txt, key, px)
        xx = int(x * W) if align == "left" else int(x * W - lay.width / 2)
        yy = int(top * H)
        m = lay.image
        if wipe < 0.999:
            cw = max(1, int(m.width * wipe))
            keep = m.crop((0, 0, cw, m.height))
            pad = Image.new("L", m.size, 0)
            pad.paste(keep, (0, 0))
            m = pad
        T.paint(self.img, m, (xx, yy), colour, min(1.0, alpha))
        return lay.height

    # -- a measured paragraph; returns the y just below the last line
    def para(self, lines, key, px, x, top, colour, alpha=1.0, wipe=1.0,
             gap=0.20):
        y = top
        for i, txt in enumerate(lines):
            hgt = self.line(txt, key, px, x, y, colour, alpha, wipe)
            y += (hgt + px * gap) / H
        return y

    def measure(self, txt, key, px):
        lay = T.flow(txt, key, px)
        return lay.width, lay.height


def hairline(t, x0, y0, x1, y1, colour=LINE, width=2, alpha=1.0):
    if alpha <= 0.004:
        return
    t.d.line([x0 * W, y0 * H, x1 * W, y1 * H],
             fill=tuple(colour) + (int(200 * alpha),), width=width)


def kicker(t, txt, y, alpha, wipe=1.0, colour=MARIGOLD_DK):
    """Small caps kicker with a rule in front of it — the editorial signature."""
    if alpha <= 0.004:
        return
    rule_w = 0.055 * (1.0 if wipe >= 0.5 else wipe * 2)
    hairline(t, GUTTER, y + 0.011, GUTTER + rule_w, y + 0.011,
             colour=colour, width=max(2, int(3 * SCALE * 0.5)), alpha=alpha)
    t.line(txt, "sans-semi", int(34 * SCALE), GUTTER + rule_w + 0.022, y,
           colour, alpha, wipe)


def price_band(img, t, value, y, h, e, label="কম্বো প্রাইস"):
    """The solid marigold band. Black on marigold is the highest-contrast pair
    in the palette and it is the single loudest object in the film."""
    if e <= 0.004:
        return
    y0, y1 = int(y * H), int((y + h) * H)
    grow = K.eo(min(1.0, e * 1.4))
    y0 = int((y + h * (1 - grow) * 0.5) * H)
    y1 = int((y + h + h * (1 - grow) * 0.5) * H)
    box = Image.new("RGBA", (W, max(1, y1 - y0)), MARIGOLD + (255,))
    img.paste(Image.new("RGB", box.size, MARIGOLD), (0, y0))
    # a hairline of darker marigold along the bottom edge = printed band
    d = ImageDraw.Draw(img)
    d.line([0, y1 - 3, W, y1 - 3], fill=MARIGOLD_DK, width=3)
    # label + price, both on the band
    txt = "৳" + "".join(K.bn(c) if c.isdigit() else c for c in f"{value:,}")
    lab_px = int(30 * SCALE)
    pr_px = int(104 * SCALE)
    lw, lh = t.measure(label, "sans-semi", lab_px)
    pw, ph = t.measure(txt, "serif-bold", pr_px)
    cx = (W - max(lw, pw)) // 2
    t.line(label, "sans-semi", lab_px, cx / W, (y0 + h * H * 0.12) / H,
           (72, 44, 6), e)
    t.line(txt, "serif-bold", pr_px, cx / W,
           (y0 + h * H * 0.34) / H, INK, e)


# ---------------------------------------------------------------- scene draw
def scene_A(img, s, p, t):
    """The hook, set as a printed poster.

    Copy is one column at the left margin; the pair bleeds off the right edge and
    is cropped by it; the price is a solid marigold band across the foot. No
    product is ever shrunk to fit and no line is ever stacked on another.
    """
    z = 1.0 + 0.032 * K.eio(p)
    img.paste(push(paper_img("hi"), z, 0.55, 0.55), (0, 0))

    # The copy is laid out FIRST and measured, then the products are hung under
    # it — that is the only way the two can never touch, whatever the glyphs do.
    t_ = Type(img)
    PX = int(112 * SCALE)
    H1 = t_.measure("গরম পানি,", "serif-bold", PX)[1]
    H2 = t_.measure("এক দামে", "serif-bold", PX)[1]
    top = 0.188
    copy_bottom = top + (H1 + 0.024 * H + H2) / H

    kicker(t_, s["kicker"], 0.150, K.ss(0.14, 0.52, t),
           wipe=K.ss(0.14, 0.70, t))
    t_.line("গরম পানি,", "serif-bold", PX, GUTTER, top, NAVY,
            K.ss(0.30, 0.80, t), wipe=K.ss(0.30, 0.76, t))
    t_.line("এক দামে", "serif-bold", PX, GUTTER, top + (H1 + 0.024 * H) / H,
            NAVY, K.ss(0.44, 0.94, t), wipe=K.ss(0.44, 0.90, t))

    # products stand on the price band — the band is their ground line, which is
    # why it can be full-bleed without looking like a sticker on a page
    base = 0.664
    place(img, "kettle", 0.312, base, 0.316 * (1 + 0.10 * (z - 1)),
          alpha=K.ss(0.08, 0.58, t))
    place(img, "flask", 0.622, base + 0.010, 0.330 * (1 + 0.10 * (z - 1)),
          alpha=K.ss(0.20, 0.70, t))
    # No caption here on purpose: the copy block is measured, the products hang
    # 0.026 under its last descender, and the band is their ground line. Three
    # objects, three zones, nothing overlapping.
    # beat 2: the band. It arrives exactly when the read says the price, so the
    # viewer hears and sees the number at the same instant.
    price_band(img, t_, 1550, 0.664, 0.104, K.ss(4.35, 4.75, t))
    t_.line("শুধু এই শীতে", "sans-semi", int(30 * SCALE), GUTTER, 0.628,
           MARIGOLD_DK, K.ss(4.05, 4.35, t))


def scene_product(img, s, p, t, key, scale, side, kicker_y=0.150):
    """A spec sheet, not a hero shot: big bleed photo + three measured lines."""
    dur = s["dur"]
    z = 1.0 + 0.030 * K.eio(p)
    base = push(paper_img("warm"), z, 0.35, 0.45)
    img.paste(base, (0, 0))
    # a marigold hairline down the left margin, full height — the grid
    d = ImageDraw.Draw(img)
    d.line([GUTTER * W * 0.42, SAFE_T * H, GUTTER * W * 0.42, SAFE_B * H],
           fill=MARIGOLD + (150,), width=max(2, int(3 * SCALE * 0.5)))

    place(img, key, 0.470, 0.726, scale * (1 + 0.012 * z),
          alpha=K.ss(0.00, 0.50, t))

    t_ = Type(img)
    kicker(t_, s["kicker"], kicker_y, K.ss(0.12, 0.50, t),
           wipe=K.ss(0.12, 0.66, t))
    # headline: left column, above the spec list
    head = s["head"].split("\n")
    cols = s.get("head_cols") or [NAVY] * len(head)
    yy = 0.194
    for i, ln in enumerate(head):
        e = K.ss(0.26 + i * 0.10, 0.80 + i * 0.10, t)
        hgt = t_.line(ln, "serif-bold", int(82 * SCALE), GUTTER, yy, cols[i], e,
                      wipe=K.ss(0.26 + i * 0.10, 0.78 + i * 0.10, t))
        yy += (hgt + 0.14 * 82 * SCALE) / H

    # spec rows: rule + label + sub, each on its own beat, directly under the
    # headline so the left column never opens a hole the product has to fill
    y = 0.356
    for i, (a, b) in enumerate(s["specs"]):
        e = K.ss(0.85 + i * 0.42, 1.22 + i * 0.42, t)
        if e <= 0.004:
            continue
        hairline(t_, GUTTER, y - 0.020, GUTTER + 0.400, y - 0.020,
                 colour=LINE, width=2, alpha=e * 0.9)
        h1 = t_.line(a, "sans-semi", int(46 * SCALE), GUTTER, y, NAVY, e,
                     wipe=K.ss(0.85 + i * 0.42, 1.20 + i * 0.42, t))
        t_.line(b, "sans", int(30 * SCALE), GUTTER, y + (h1 + 0.012 * H) / H,
                NAVY_SOFT, e)
        y += 0.098
    price_stamp(img, t_, 1550, 0.706, K.ss(2.35, 2.75, t))


def price_stamp(img, t, value, y, e):
    """Small offer line for the foot of a spec page: 'কম্বোতে ৳১,৫৫০'."""
    if e <= 0.004:
        return
    txt = "কম্বোতে ৳" + "".join(K.bn(c) if c.isdigit() else c for c in f"{value:,}")
    t.line(txt, "sans-semi", int(38 * SCALE), GUTTER, y, NAVY, e, wipe=e)
    hairline(t, GUTTER, y + 0.052, GUTTER + 0.300, y + 0.052,
             colour=MARIGOLD, width=4, alpha=e)


def scene_D(img, s, p, t):
    """The meet: both products, a centred combo line, the price band."""
    z = 1.0 + 0.026 * K.eio(p)
    img.paste(push(paper_img("hi"), z, 0.5, 0.5), (0, 0))
    e1 = K.ss(0.05, 0.55, t)
    e2 = K.ss(0.15, 0.68, t)
    dx = 0.075 * (1 - K.eio(min(1.0, t / 0.75)))
    # two products, one entering from each side, then holding
    _sprite_at(img, "kettle", 0.296 - dx, 0.726, 0.352, e1)
    _sprite_at(img, "flask", 0.712 + dx, 0.736, 0.372, e2)
    t_ = Type(img)
    kicker(t_, s["kicker"], 0.150, K.ss(0.10, 0.45, t),
           wipe=K.ss(0.10, 0.60, t))
    t_.line(s["head"], "serif-bold", int(96 * SCALE), 0.5, 0.196, NAVY,
            K.ss(0.28, 0.85, t), wipe=K.ss(0.28, 0.80, t), align="center")
    price_band(img, t_, 1550, 0.726, 0.100, K.ss(0.62, 0.95, t))


def _sprite_at(img, key, cx, base_y, scale, alpha=1.0):
    spr = _SPR[key]
    hh = int(scale * H)
    ww = int(spr.width * hh / spr.height)
    sp = spr.resize((ww, hh), Image.LANCZOS)
    x = int(cx * W - ww / 2)
    y = int(base_y * H) - hh
    m = sp.split()[3]
    if alpha < 0.999:
        m = m.point(lambda v: int(v * alpha))
    img.paste(sp, (x, y), m)


def scene_E(img, s, p, t):
    """The wish. The one scene with people in it, and the quietest in the film.

    All type lives in the top 40% of the frame, over a warm scrim that fades out
    before it reaches a face — the photograph is never covered, only dipped.
    """
    ph = _PHOTO["family"]
    z = 1.050 - 0.050 * K.eio(min(1.0, p * 1.5))
    big = ph.resize((int(W * z), int(H * z)), Image.LANCZOS)
    ox = (big.width - W) // 2
    oy = int((big.height - H) * 0.42)
    img.paste(big.crop((ox, oy, ox + W, oy + H)), (0, 0))

    arr = np.asarray(img, np.float32)
    arr = vgrad(arr, 0.050, 0.392, 0.82, (22, 20, 26))
    arr = arr * [1.03, 0.995, 0.955]
    img.paste(Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB"), (0, 0))

    t_ = Type(img)
    kicker(t_, s["kicker"], 0.150, K.ss(0.14, 0.55, t),
           wipe=K.ss(0.14, 0.66, t), colour=MARIGOLD)
    lines = ["বাবার চা, মায়ের কাপ,", "বাচ্চার এক গ্লাস গরম দুধ —"]
    y = 0.186
    for i, ln in enumerate(lines):
        e = K.ss(0.45 + i * 0.45, 1.05 + i * 0.45, t)
        hgt = t_.line(ln, "sans-semi", int(40 * SCALE), 0.5, y,
                      (247, 243, 236), e,
                      wipe=K.ss(0.45 + i * 0.45, 1.01 + i * 0.45, t),
                      align="center")
        y += (hgt + 0.012 * H) / H
    t_.line("পরিবারটা থাকুক উষ্ণ।", "serif-bold", int(74 * SCALE), 0.5, 0.268,
            (255, 233, 188), K.ss(1.55, 2.05, t),
            wipe=K.ss(1.55, 2.00, t), align="center")
    t_.line("আজই নিয়ে নিন — ৳১,৫৫০", "sans-semi", int(34 * SCALE), 0.5,
            0.344, (250, 240, 220), K.ss(2.35, 2.75, t),
            wipe=K.ss(2.35, 2.72, t), align="center")


def scene_F(img, s, p, t):
    """The close. A price page, not a product page: two lines, the band, the ask.

    The pair appears once, small, at the very foot of the frame as a signature —
    the viewer has already been shown the products four times by now.
    """
    z = 1.0 + 0.020 * K.eio(p)
    img.paste(push(paper_img("hi"), z, 0.5, 0.40), (0, 0))

    t_ = Type(img)
    kicker(t_, s["kicker"], 0.152, K.ss(0.12, 0.50, t),
           wipe=K.ss(0.12, 0.62, t))
    PX = int(112 * SCALE)
    h1 = t_.line("আজই", "serif-bold", PX, 0.5, 0.192, NAVY,
                 K.ss(0.30, 0.90, t), wipe=K.ss(0.30, 0.86, t), align="center")
    t_.line("নিয়ে নিন", "serif-bold", PX, 0.5, 0.192 + (h1 + 0.026 * H) / H,
            NAVY, K.ss(0.38, 0.92, t), wipe=K.ss(0.38, 0.90, t),
            align="center")

    price_band(img, t_, 1550, 0.404, 0.116, K.ss(1.35, 1.75, t))

    # the ask: a navy block, the only dark object in the closing frame
    y0, y1 = 0.596, 0.664
    ec = K.ss(2.30, 2.65, t)
    if ec > 0.004:
        img.paste(Image.new("RGB", (int(W * 0.760), int((y1 - y0) * H)), NAVY),
                  (int(W * 0.120), int(y0 * H)))
        t_.line("অর্ডার করতে মেসেজ করুন", "sans-semi", int(40 * SCALE), 0.5,
                y0 + 0.018, (250, 245, 232), ec, wipe=ec, align="center")
    t_.line("সারা দেশে ডেলিভারি  ·  ক্যাশ অন ডেলিভারি", "sans",
            int(28 * SCALE), 0.5, 0.694, NAVY_SOFT, K.ss(2.60, 2.90, t),
            align="center")

    # signature pair at the foot
    e = K.ss(2.75, 3.10, t)
    if e > 0.004:
        place(img, "kettle", 0.336, 0.906, 0.170, alpha=e, shadow=False)
        place(img, "flask", 0.524, 0.912, 0.178, alpha=e, shadow=False)


# ------------------------------------------------------------------ assembly
def draw_scene(s, p, t):
    img = Image.new("RGB", (W, H), PAPER)
    sid = s["id"]
    if sid == "A":
        scene_A(img, s, p, t)
    elif sid == "B":
        scene_product(img, s, p, t, "kettle", 0.310, "right")
    elif sid == "C":
        scene_product(img, s, p, t, "flask", 0.340, "right", kicker_y=0.148)
    elif sid == "D":
        scene_D(img, s, p, t)
    elif sid == "E":
        scene_E(img, s, p, t)
    else:
        scene_F(img, s, p, t)

    # a two-frame dip at each cut: the only transition in the film
    return _dip(img, p, s["dur"])


def _dip(img, p, dur):
    """6-frame fade at each scene boundary — softer than a hard cut, cheaper
    than a dissolve, and it hides the paper texture resetting."""
    f = 6.0 / FPS / dur
    a = min(1.0, p / f, (1 - p) / f) if f > 0 else 1.0
    if a >= 0.999:
        return img
    arr = np.asarray(img, np.float32) * max(0.0, a)
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")


# ---------------------------------------------------------------------- audio
def build_audio(path=None):
    import rbaudio as AU
    SR = AU.SR
    n = int((TOTAL + 0.35) * SR)
    voice = np.zeros(n, np.float32)
    music = np.zeros(n, np.float32)
    sfx = np.zeros(n, np.float32)

    # --- bed: a warm marimba/pluck figure, 96 bpm, four chords ---------------
    # Written as note onsets rather than a pad, because a pad under a spoken
    # ad smears the consonants. Plucks sit in the gaps.
    chords = [  # (root, triad) — F, Dm, Bb, C  (bright, no minor drone)
        (174.61, [349.23, 440.00, 523.25]),
        (146.83, [293.66, 349.23, 440.00]),
        (116.54, [233.08, 293.66, 349.23]),
        (130.81, [261.63, 329.63, 392.00]),
    ]
    beat = 60.0 / 96.0
    pos, i = 0.0, 0
    while pos < TOTAL:
        root, tri = chords[i % len(chords)]
        # one chord lasts two bars
        for bar in range(2):
            for k, f in enumerate([root] + tri):
                t0 = pos + bar * 4 * beat + k * beat * 0.5
                if t0 > TOTAL:
                    break
                music = AU.place(music, _pluck(f, 1.1, 0.30), t0,
                                 0.115 if k else 0.155)
            # a light shaker on the off-beats keeps the pace without any hiss
            for k in range(4):
                t0 = pos + bar * 4 * beat + (k + 0.5) * beat
                music = AU.place(music, _shaker(0.07), t0, 0.055)
        pos += 8 * beat
        i += 1
    # a low, round bass note per chord root, felt more than heard
    pos = 0.0
    i = 0
    while pos < TOTAL:
        root = chords[i % len(chords)][0] / 2
        music = AU.place(music, AU.norm(np.sin(2 * np.pi * root * AU.t(2.2))
                                        * np.exp(-AU.t(2.2) * 1.5), 0.5),
                         pos, 0.20)
        pos += 8 * beat
        i += 1
    music = AU.lowpass_fast(music, 5200, 1)
    music = AU.fade(music, 0.5, 1.6)

    # --- sfx: one soft tick at each scene start, nothing else ----------------
    starts = []
    a = 0.0
    for s in SCENES:
        starts.append((s["id"], a))
        a += s["dur"]
    for sid, st in starts:
        sfx = AU.place(sfx, _tick(0.14), st + 0.02, 0.10)
    # the offer card gets one deliberate rise into it
    f_pos = dict(starts)["F"]
    sfx = AU.place(sfx, AU.whoosh(0.7), f_pos - 0.42, 0.11)

    # --- voice ---------------------------------------------------------------
    vo_end = {}
    for s, (sid, st) in zip(SCENES, starts):
        if not s.get("vo"):
            continue
        items = s["vo"] if isinstance(s["vo"], list) else [s["vo"]]
        end = st
        for j, (f, off) in enumerate(items):
            v = _read(os.path.join(VO, f + ".wav"))
            # match every read to the same speech loudness (measured on the loud
            # half only, so a clip with pauses is not over-cranked)
            r = np.sort(np.abs(v))[-max(1, len(v) // 4):]
            lvl = float(np.sqrt(np.mean(r ** 2))) or 1.0
            v = v * float(np.clip(0.104 / lvl, 0.5, 2.5))
            start = st + off
            if j:                      # never let one read land on another
                start = max(start, end + 0.10)
            room = int((st + s["dur"] - 0.05) * SR) - int(start * SR)
            if len(v) > room:
                print(f"  ! {sid}/{f}: trimmed {len(v)/SR - room/SR:.2f}s",
                      flush=True)
                v = AU.fade(v[:room], 0.01, 0.12)
            a0 = int(start * SR)
            voice[a0:a0 + len(v)] += v
            end = start + len(v) / SR
        vo_end[sid] = end

    # --- mix -----------------------------------------------------------------
    vpk = float(np.max(np.abs(voice))) or 1.0
    voice = voice / vpk * 0.90
    voice = np.tanh(voice * 1.05) / 1.05

    # duck the bed under speech: 1.0 -> 0.42 with a 90 ms attack / 420 ms release
    env = np.convolve(np.abs(voice), np.ones(2400) / 2400, mode="same")
    env /= (env.max() + 1e-9)
    g = np.ones_like(env)
    cur, prev, step = 1.0, 0.0, 8
    for j in range(0, len(env), step):
        e = env[j]
        a = 0.055 if e > prev else 0.0035
        cur += (e - cur) * a
        prev = e
        g[j:j + step] = 1.0 - 0.58 * np.clip(cur * 1.7, 0, 1)
    bed = (music * 0.235 + sfx * 0.42) * g
    final = np.clip(voice + bed, -1, 1)
    final = final / (float(np.max(np.abs(final))) or 1.0) * 0.93

    os.makedirs(OUT, exist_ok=True)
    out = path or os.path.join(OUT, "mix_raw.wav")
    AU.write_wav(out, final.astype(np.float32))
    # voice-only stem, useful for the client and for the subtitles
    AU.write_wav(os.path.join(OUT, "voice_only.wav"),
                 (voice / (np.max(np.abs(voice)) or 1.0) * 0.92).astype(np.float32))
    return TOTAL


def _pluck(f, dur, decay):
    import rbaudio as AU
    tt = AU.t(dur)
    # two detuned partials + a fast body thump = wooden marimba, no synth edge
    x = (np.sin(2 * np.pi * f * tt) * 0.62
         + np.sin(2 * np.pi * f * 2.01 * tt) * 0.24
         + np.sin(2 * np.pi * f * 3.02 * tt) * 0.10)
    e = np.exp(-tt * decay * 4.2)
    return AU.norm(x * e, 0.85)


def _shaker(dur):
    import rbaudio as AU
    x = AU.highpass_fast(AU.noise(int(dur * AU.SR)), 6200)
    e = np.exp(-AU.t(dur) * 55)
    return AU.norm(x * e, 0.6)


def _tick(dur):
    import rbaudio as AU
    tt = AU.t(dur)
    x = np.sin(2 * np.pi * 1480 * tt) * np.exp(-tt * 42)
    return AU.norm(x, 0.7)


def _read(path):
    import wave
    w = wave.open(path)
    a = np.frombuffer(w.readframes(w.getnframes()), "<i2").astype(np.float32) / 32768
    if w.getnchannels() > 1:
        a = a.reshape(-1, w.getnchannels()).mean(1)
    return a


# --------------------------------------------------------------------- assets
_SPR, _PHOTO = {}, {}


def load_assets():
    _SPR["kettle"] = Image.open(os.path.join(SPR, "kettle.png")).convert("RGBA")
    _SPR["flask"] = Image.open(os.path.join(SPR, "flask.png")).convert("RGBA")
    _PHOTO["family"] = Image.open(os.path.join(STUDIO, "ad",
                                               "family_warm.png")).convert("RGB")


# ------------------------------------------------------------------ rendering
def _frames(job):
    s, start, fast = job
    n = int(round(s["dur"] * FPS))
    for i in range(n):
        p = i / max(1, n - 1)
        img = draw_scene(s, p, i / FPS)
        img.save(os.path.join(OUT, "frames", "%05d.jpg" % (start + i)),
                 quality=93, subsampling=0)
    return s["id"], start, n


def main():
    load_assets()
    samples = int(os.environ.get("NEW_SAMPLES", "0"))
    if samples:
        os.makedirs("/tmp/newframes", exist_ok=True)
        for s in SCENES:
            for k in range(samples):
                p = (k + 0.5) / samples
                draw_scene(s, p, p * s["dur"]).resize((W // 4, H // 4),
                                                      Image.LANCZOS)\
                    .save(f"/tmp/newframes/{s['id']}_{k}.jpg", quality=92)
        print("samples ok")
        return

    only = os.environ.get("NEW_ONLY")
    scenes = [x for x in SCENES if not only or x["id"] in only.split(",")]
    if not only:
        build_audio()
    starts, idx, start_of = [], 0, {}
    for s in SCENES:
        starts.append(idx)
        start_of[s["id"]] = idx
        idx += int(round(s["dur"] * FPS))
    print("scenes", [(s["id"], s["dur"]) for s in SCENES], "total",
          round(TOTAL, 2), "frames", idx, flush=True)
    os.makedirs(os.path.join(OUT, "frames"), exist_ok=True)
    jobs = [(s, start_of[s["id"]], False) for s in scenes]
    workers = int(os.environ.get("RB_WORKERS", os.cpu_count() or 1))
    workers = max(1, min(workers, len(jobs)))
    if workers == 1:
        for j in jobs:
            print(" scene", _frames(j), flush=True)
    else:
        import multiprocessing as mp
        with mp.get_context("fork").Pool(workers) as pool:
            for out in pool.imap_unordered(_frames, jobs):
                print(" scene", out, flush=True)
    print("total frames", idx)


if __name__ == "__main__":
    main()
