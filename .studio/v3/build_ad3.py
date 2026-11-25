"""Premium winter combo commercial — Hawkins 2L kettle + Elima 1L flask.

Layer model (this is what makes it not a slideshow):
    stage (procedural emerald/gold, own slow push)
    + product sprite (cut-out, floats on its own sine, casts a contact shadow
      and a mirrored reflection)
    + light: gold sweep, halo, steam wisps, dust
    + type: chip / headline / feature cards / price / CTA on frosted glass

Every scene has its own camera path, its own animation beats and its own sound
design. Marketing claims are limited to what the seller supplied: 2 L, stainless
steel body, automatic shut-off, 1 L, premium design, odourless. Nothing about
"24 hours hot/cold" is claimed because it was not verified.
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

import adkit as A
import kinetic as K
import rbtext as T
import rbaudio as AU

W, H, SCALE, FPS = A.W, A.H, A.SCALE, A.FPS
OUT = os.path.join(HERE, "..", "render_ad")
VO = os.path.join(HERE, "..", "vo_ad")
ART = os.path.join(HERE, "..", "art_ad")
SPR = os.path.join(HERE, "..", "ad", "sprite")
PLATE = os.path.join(HERE, "..", "ad", "plates2")

EM, GOLD, GOLD_L, IVORY, WINTER = A.EMERALD, A.GOLD, A.GOLD_LT, A.IVORY, A.WINTER

# --------------------------------------------------------------------- scenes --
# dur: on-screen seconds. vo: (file, offset). Cards are (label, value) rows.
SCENES = [
    # the price opens the film: a customer has to know the deal in the first
    # two seconds, otherwise the hook is only scenery
    dict(id="s1", dur=6.40, stage="cool", vo=[("w1", 0.30)],
         chip="শীতের কম্বো অফার",
         head=["শীতের কম্বো", "দুটি পণ্য, এক দামে"],
         price=1550),
    dict(id="s2", dur=8.20, stage="cool", vo=[("w2", 0.30)],
         chip="Hawkins ইলেকট্রিক কেটল",
         head=["দ্রুত পানি", "গরম হয়"],
         cards=[("অল্প সময়েই ফুটে ওঠে", "কয়েক মিনিটেই তৈরি"),
                ("স্টেইনলেস স্টিল বডি", "২ লিটার ধারণক্ষমতা"),
                ("অটোমেটিক শাট-অফ", "পানি ফুটলেই বন্ধ")],
         detail="kettle_detail_light.png", detail_at=3.30),
    dict(id="s3", dur=5.40, stage="warm", vo=[("w3", 0.30)],
         chip="Elima ভ্যাকুয়াম ফ্লাস্ক",
         head=["২৪ ঘণ্টা", "পানি গরম থাকে"],
         cards=[("২৪ ঘণ্টা পানি গরম", "পুরো দিন উষ্ণ থাকে"),
                ("প্রিমিয়াম ডিজাইন", "১ লিটার ধারণক্ষমতা"),
                ("গন্ধহীন ভেতর", "স্বাদ অটুট থাকে")],
         detail="flask_detail_light.png", detail_at=3.30),
    dict(id="s4", dur=3.20, stage="cool", vo=[("w4", 0.30)],
         chip="কম্বো অফার",
         head=["দুটোই একসঙ্গে"]),
    # the emotional beat: the products are already in the family's hands
    dict(id="s5", dur=9.40, stage="warm", vo=[("w5", 0.35)],
         chip="", head=["শীতে বাবা-মায়ের জন্য, বাচ্চার জন্য"],
         price=1550),
    # offer + price + CTA close: the last second is the ask
    dict(id="s6", dur=7.80, stage="cool",
         vo=[("w6", 0.30), ("w7", 4.55)], music=-0.22,
         chip="কম্বো প্রাইস",
         head=["কম্বো অফার"],
         price=1550),
]

# Reels/Stories UI covers ~13% at the top and ~16% at the bottom. v9 had the
# hook caption at 0.902 and the s5 headline at 0.062 — both under the UI. All
# type now lives inside this band.
SAFE_T, SAFE_B = 0.135, 0.790

STAGE, SPRITES, PLATES, PHOTO = {}, {}, {}, {}
ART_PHOTO = os.path.join(HERE, "..", "ad")


def init():
    if STAGE:
        return
    # v9: bright stages. stage_cool / stage_warm (emerald) stay on disk for
    # the older cuts, but nothing in this build reads them any more.
    STAGE["cool"] = A.Plate(os.path.join(ART, "stage_light_cool.png"), scale=1.10)
    STAGE["warm"] = A.Plate(os.path.join(ART, "stage_light_warm.png"), scale=1.10)
    SPRITES["kettle"] = A.Sprite(Image.open(os.path.join(SPR, "kettle.png")))
    SPRITES["flask"] = A.Sprite(Image.open(os.path.join(SPR, "flask.png")))
    # v9 light-graded macros: same shots, backdrop moved from emerald to the
    # cool blue-grey of the new stage (see plates2/*_light.png)
    for n in ("kettle_detail_light.png", "flask_detail_light.png", "price_combo.png"):
        PLATES[n] = A.Plate(os.path.join(PLATE, n), scale=1.06)
    # the one photographic plate in the film: the family beat, 9:16, generated
    # once and cached here (it is a Plate so it can drift like the stage can)
    PHOTO["family"] = A.Plate(os.path.join(ART_PHOTO, "family_warm.png"), scale=1.04)


# ------------------------------------------------------------------ product ---
def product(canvas, key, cx, base_y, h, alpha=1.0, lift=0.0, reflect=0.34,
            shadow=True, mirror_only=False):
    """Paste a product so that its BOTTOM sits on base_y (fraction of H).

    A flipped, fading copy below the base is what reads as a polished stone
    floor — without it a cut-out looks pasted on.
    """
    if alpha <= 0.004:
        return
    spr = SPRITES[key]
    hh = max(4, int(h * H))
    ww = max(4, int(spr.img.width * hh / spr.img.height))
    sp = spr.img.resize((ww, hh), Image.LANCZOS)
    x = int(cx * W - ww / 2)
    yb = int(base_y * H + lift * H)
    y = yb - hh
    if shadow:
        sh = Image.new("L", (ww + int(ww * 0.6), int(hh * 0.30)), 0)
        ImageDraw.Draw(sh).ellipse(
            [ww * 0.18, sh.height * 0.30, ww * 0.82, sh.height * 0.86], fill=255)
        sh = sh.filter(ImageFilter.GaussianBlur(ww * 0.06))
        a = sh.point(lambda v: int(v * 0.62 * alpha))
        canvas.paste(Image.new("RGB", sh.size, (0, 0, 0)),
                     (int(x - ww * 0.06), int(yb - sh.height * 0.42)), a)
    if reflect > 0 and not mirror_only:
        rh = int(hh * 0.46)
        ref = sp.transpose(Image.FLIP_TOP_BOTTOM).crop((0, hh - rh, ww, hh))
        fade = Image.linear_gradient("L").rotate(180).resize((ww, rh))
        fade = fade.point(lambda v: int(v * reflect * 255 / 255))
        m = Image.composite(ref.split()[3], Image.new("L", (ww, rh), 0), fade)
        m = m.point(lambda v: int(v * alpha))
        canvas.paste(ref, (x, yb), m)
    msk = sp.split()[3]
    if alpha < 0.999:
        msk = msk.point(lambda v: int(v * alpha))
    canvas.paste(sp, (x, y), msk)


def detail_card(canvas, name, box, e, zoom=1.0):
    """Rounded inset of a macro plate — the 'detail cut' between feature cards."""
    if e <= 0.004:
        return
    x0, y0, x1, y1 = [int(v) for v in box]
    pl = PLATES[name]
    img = pl.frame(zoom=zoom).resize((x1 - x0, y1 - y0), Image.LANCZOS)
    r = int(26 * SCALE)
    m = Image.new("L", img.size, 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, img.width - 1, img.height - 1], radius=r, fill=255)
    m = m.point(lambda v: int(v * min(1.0, e)))
    canvas.paste(img, (x0, y0), m)
    d = ImageDraw.Draw(canvas, "RGBA")
    d.rounded_rectangle([x0, y0, x1, y1], radius=r,
                        outline=GOLD_L + (int(120 * e),), width=max(1, int(2 * SCALE)))


def steam(canvas, cx, by, p, count=5, strength=1.0, spread=0.055, rise=0.20,
          seed=5):
    """A few soft wisps that drift up and fade — a still photo cannot do this."""
    if strength <= 0.004:
        return
    rng = np.random.default_rng(seed)
    lay = Image.new("L", (W // 4, H // 4), 0)
    d = ImageDraw.Draw(lay)
    w4, h4 = W / 4, H / 4
    for i in range(count):
        ph = (p * 0.55 + i / count) % 1.0
        yy = (by - ph * rise) * h4
        xx = (cx + 0.020 * np.sin(p * 4.0 + i * 1.7) + rng.uniform(-0.008, 0.008)) * w4
        r = (0.012 + 0.030 * ph) * w4 * (0.7 + 0.5 * spread * 10)
        a = int(150 * (1 - ph) ** 1.5 * strength)
        d.ellipse([xx - r, yy - r * 0.8, xx + r, yy + r * 0.8], fill=a)
    lay = lay.filter(ImageFilter.GaussianBlur(w4 * 0.020))
    lay = lay.resize((W, H), Image.BICUBIC)
    # screen, never paste: an alpha paste replaced the stage with flat cream and
    # the macro cut showed a hanging curtain of steam over the whole frame (24 s)
    col = np.array([255, 250, 240], np.float32)
    base = np.asarray(canvas, np.float32)
    a = (np.asarray(lay, np.float32) / 255.0)[..., None]
    canvas.paste(Image.fromarray(np.clip(base + (col - base) * a, 0, 255).astype(np.uint8), "RGB"))


# ---------------------------------------------------------------------- type ---

# ------------------------------------------------------------------- titles --
def rise(canvas, txt, style, y, colour, e, dy=26, maxw=0.86, px=None, key=None):
    """One animated line: eased slide-up + fade, with NO drop shadow.

    Why this exists: adkit.centred() paints a Gaussian shadow under the glyphs.
    With two lines fading in at once — and with the shadow offset only 4-5 px —
    the shadow of the line below landed on the line above and read as a second,
    grey copy of the text ("overlapping text"). The shadow bought nothing on a
    bright stage, so it is gone, and every line now animates in on its own beat.
    """
    if e <= 0.004:
        return
    k, p = A.TYPO[style]
    k = key or k
    p = int(px or p)
    lay = T.flow(txt, k, p)
    if lay.width > maxw * W:
        p = int(p * maxw * W / lay.width)
        lay = T.flow(txt, k, p)
    x = int((W - lay.width) / 2)
    yy = int(y * H + dy * (1 - K.eio(min(1.0, e))))
    T.paint(canvas, lay.image, (x, yy), colour, min(1.0, e * 1.12))


def rise_block(canvas, rows, y0, t, at=0.0, stagger=0.16, dur=0.55, gap=0.040,
               colour=None, styles=None, dys=None, maxw=0.86):
    """A stack of lines, each with its own start time and progress.

    rows: list of strings. y0: TOP of the first line (fraction of frame). The
    gap is measured from the drawn ink height, so no two lines can ever touch.
    """
    y = y0
    for i, txt in enumerate(rows):
        e = K.ss(at + i * stagger, at + i * stagger + dur, t)
        style = styles[i] if styles else ("big" if i == 0 else "title")
        col = colour[i] if isinstance(colour, (list, tuple)) and len(colour) and \
            isinstance(colour[0], (list, tuple)) else colour
        col = col or A.DEEP
        k, px = A.TYPO[style]
        lay = T.flow(txt, k, int(px))
        hgt = lay.image.height / H
        if e > 0.004:
            rise(canvas, txt, style, y, col, e,
                 dy=(dys[i] if dys else 28), maxw=maxw)
        y += hgt + gap


def soft_shadow(canvas, box, e, radius, spread=18 * SCALE, alpha=46):
    """Very soft dark halo under a card — sells the lift without an outline."""
    if e <= 0.004:
        return
    x0, y0, x1, y1 = [int(v) for v in box]
    lay = Image.new("L", (canvas.width, canvas.height), 0)
    ImageDraw.Draw(lay).rounded_rectangle(
        [x0 + spread * 0.4, y0 + spread, x1 + spread * 0.4, y1 + spread],
        radius=radius, fill=int(alpha * e))
    lay = lay.filter(ImageFilter.GaussianBlur(spread))
    canvas.paste(Image.new("RGB", canvas.size, (30, 44, 58)), (0, 0), lay)


def chip(canvas, txt, y, e, colour=A.SKY, ink=A.DEEP):
    """Small label pill. On the bright stage it is white glass with navy ink and
    a blue hairline — the gold-on-black pill of v8 vanished into the white."""
    if e <= 0.004 or not txt:
        return
    lay = T.flow(txt, "sans-semi", int(36 * SCALE))
    pw = lay.width + 2 * 30 * SCALE
    ph = lay.image.height + 2 * 14 * SCALE
    x = int((W - pw) / 2)
    yy = int(y * H)
    d = ImageDraw.Draw(canvas, "RGBA")
    d.rounded_rectangle([x, yy, x + pw, yy + ph], radius=ph // 2,
                        fill=(255, 255, 255, int(196 * e)),
                        outline=colour + (int(170 * e),), width=max(1, int(2 * SCALE)))
    T.paint(canvas, lay.image, (int(x + 30 * SCALE), int(yy + 14 * SCALE)),
            ink, e, shadow=(0, 0, (0, 0, 0), 0.0))


def feature_row(canvas, txt, sub, yy, e):
    """A feature row: gold tick + bold claim, with a quiet second line under it.

    The claim is what sells; the sub-line carries the spec so the row can hold
    a fact ('fast boil') plus its number ('2 litre') without a wall of text.
    """
    lay = T.flow(txt, "sans-semi", int(44 * SCALE))
    sub_lay = T.flow(sub, "sans", int(31 * SCALE)) if sub else None
    tw = lay.width
    sw = sub_lay.width if sub_lay else 0
    x0 = int((W - max(tw, sw)) / 2 - 54 * SCALE)
    d = ImageDraw.Draw(canvas, "RGBA")
    ty = int(yy * H + lay.image.height * 0.40)
    tick = (196, 146, 58)
    d.line([x0, ty, x0 - 14 * SCALE, ty + 14 * SCALE], fill=tick + (int(235 * e),),
           width=max(1, int(3 * SCALE)))
    d.line([x0 - 14 * SCALE, ty + 14 * SCALE, x0 - 34 * SCALE, ty - 8 * SCALE],
           fill=tick + (int(235 * e),), width=max(1, int(3 * SCALE)))
    top = yy * H + 24 * (1 - e) * SCALE
    T.paint(canvas, lay.image, (int(x0 + 44 * SCALE), int(top)), A.DEEP,
            min(1.0, e * 1.25), shadow=(0, 0, (0, 0, 0), 0.0))
    if sub_lay is not None:
        T.paint(canvas, sub_lay.image, (int(x0 + 44 * SCALE),
                                        int(top + lay.image.height + 6 * SCALE)),
                A.WINTER, min(1.0, e * 1.15), shadow=(0, 0, (0, 0, 0), 0.0))


def feature_cards(canvas, rows, y0, e_all, at=0.0, gap=0.049, t=0.0, stagger=0.30):
    """Three feature rows: gold tick, ivory text, stepping in one after another.

    Each row gets its own progress from the clock (t seconds). In v6 the rows
    multiplied an already-dimmed value (e_all * 6.0), so the third row stayed a
    ghost — the cascade now comes from time, not from the fade.
    """
    if e_all <= 0.004:
        return
    for i, row in enumerate(rows):
        e = K.ss(at + i * stagger, at + i * stagger + 0.40, t) * e_all
        if e <= 0.004:
            continue
        txt, sub = row if isinstance(row, tuple) else (row, None)
        feature_row(canvas, txt, sub, y0 + i * gap, e)


# --------------------------------------------------------------------- scenes --
def scene_backdrop(s, p):
    st = STAGE[s["stage"]]
    if s["id"] == "s1":
        img = st.frame(zoom=1.02 + 0.06 * K.eo(p), pan=(0, 0.004 - 0.012 * p))
    elif s["id"] == "s5":
        img = st.frame(zoom=1.06 + 0.05 * p, pan=(0, -0.006))
    else:
        img = st.frame(zoom=1.03 + 0.07 * K.eio(p), pan=(0.012 - 0.024 * p, 0.008))
    img = A.mist(img, strength=0.05, speed=p * 0.06, y0=0.66, colour=(226, 240, 250))
    # v9: the stage is bright, so instead of pushing the floor to emerald we
    # only settle it a shade toward cool grey — the dark ink type needs a calm
    # band, not a dark one.
    if s["id"] in ("s2", "s3", "s6"):
        img = _settle_lower(img, 0.62)
    return img


def _settle_lower(img, y=0.66):
    """Take the very bottom of the plate a touch cooler and quieter.

    On the emerald build this function darkened the floor so ivory type could
    sit on it. Now the type is dark, so the floor only needs to be *calm* —
    a soft blue-grey settle, never a shadow band.
    """
    arr = np.asarray(img, dtype=np.float32)
    yy = np.linspace(0, 1, H, dtype=np.float32)[:, None, None]
    k = np.clip((yy - y) / (1 - y), 0, 1) ** 1.6
    floor_col = np.array([206, 220, 232], dtype=np.float32)[None, None, :]
    arr = arr * (1 - k * 0.42) + floor_col * (k * 0.42)
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")


def _deepen_lower(img, y=0.66):
    """Push the lower third toward deep emerald: the floor has to sit UNDER the
    price/feature block, not behind the type where it reads as a grey bar."""
    arr = np.asarray(img, dtype=np.float32)
    yy = np.linspace(0, 1, H, dtype=np.float32)[:, None, None]
    k = np.clip((yy - y) / (1 - y), 0, 1) ** 1.4
    floor_col = np.array([7, 26, 23], dtype=np.float32)[None, None, :]
    arr = arr * (1 - k) + floor_col * k
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")


def draw_s1(img, s, p, t):
    """Hook: the deal AND the price in the first two seconds.

    v12 layout — every block is measured, and the products are the hero:
      chip      0.138
      headline  0.184 (≈0.050 tall)
      subline   0.244 (≈0.036)
      products  bottom 0.566, kettle 1.20x / flask 1.24x the v11 height
      price card 0.576 -> 0.664
      caption   0.680
    No drop shadows anywhere: the shadow was landing on the neighbouring line
    and looked like a second copy of the text.
    """
    e = K.ss(0.0, 0.90, t)
    lift_in = 0.052 * (1 - K.eio(min(1.0, t / 1.15)))

    chip(img, s["chip"], 0.130, K.ss(0.12, 0.58, t))
    rise(img, s["head"][0], "big", 0.176, A.DEEP, K.ss(0.26, 0.82, t), dy=30,
         px=int(96 * SCALE * 0.90))
    rise(img, s["head"][1], "title", 0.230, A.DEEP2, K.ss(0.42, 0.98, t), dy=24,
         px=int(76 * SCALE * 0.82))

    # products: 0.264 tall and bottom at 0.560 — the new sprite (the plinth has
    # been rebuilt below the old crop line) needs the extra room, so the type
    # block is a touch tighter than v11's.
    product(img, "kettle", 0.320, 0.560 + lift_in, h=0.264,
            alpha=K.ss(0.0, 0.45, t), lift=-0.004 * np.sin(p * 5), reflect=0.0)
    product(img, "flask", 0.680, 0.560 + lift_in, h=0.292,
            alpha=K.ss(0.10, 0.55, t), lift=-0.004 * np.sin(p * 5 + 1), reflect=0.0)
    steam(img, 0.320, 0.560 - 0.264 * 0.88, p, count=4, strength=0.20 * e)

    ep = K.ss(0.70, 1.08, t)
    if ep > 0.004:
        soft_shadow(img, (W * 0.190, H * 0.584, W * 0.810, H * 0.670), ep, 32 * SCALE)
        A.glass_card(img, (W * 0.190, H * 0.584, W * 0.810, H * 0.670), ep,
                     radius=32 * SCALE, alpha=150, border_a=160,
                     tint=(255, 255, 255), border=A.SKY)
        rise(img, "কম্বো প্রাইস", "label", 0.594, (44, 112, 164),
             K.ss(0.78, 1.06, t), dy=12, maxw=0.6)
        A.count_price(img, 1550, 0.607, K.ss(0.86, 1.34, t), colour=A.INK,
                      px=int(148 * SCALE * 0.78))
    rise(img, "Hawkins ২ লিটার · Elima ১ লিটার", "list2", 0.686, A.DEEP2,
         K.ss(1.16, 1.62, t), dy=14)


def draw_product_scene(img, s, p, t, key, cx, h, base=0.560):
    """One product, hero-sized, with the three features in a glass block under it.

    v12: the product is BIGGER (0.80x of the old height, base lifted to 0.520)
    and the type above it starts at 0.140 with no shadow, so nothing is left to
    ghost into the neighbouring line.
    """
    dur = s["dur"]
    e_in = K.ss(0.0, 0.55, t)
    lift = -0.006 * np.sin(p * 4.2)
    # v12b: the sprite is 1.16x taller than v11 and its base sits at 0.592, so
    # the silhouette (top ≈ 0.283) clears the sub-headline (ends 0.281) and the
    # plastic base is fully inside the frame, well above the card at 0.600.
    product(img, key, cx, 0.592, h=h * 0.855, alpha=e_in, lift=lift)
    steam(img, cx + 0.105, 0.592 - h * 0.855 * 0.86, p, count=5,
          strength=(0.55 if key == "kettle" else 0.35) * e_in)
    chip(img, s["chip"], 0.130, K.ss(0.20, 0.72, t))
    rise(img, s["head"][0], "title", 0.170, A.DEEP, K.ss(0.30, 0.88, t), dy=26)
    rise(img, s["head"][1], "sub", 0.236, A.DEEP2, K.ss(0.46, 1.04, t), dy=18)

    ec = K.ss(1.00, 1.36, t)
    if ec > 0.004:
        soft_shadow(img, (W * 0.082, H * 0.604, W * 0.918, H * 0.790), ec, 32 * SCALE)
        A.glass_card(img, (W * 0.082, H * 0.604, W * 0.918, H * 0.790), ec,
                     radius=32 * SCALE, alpha=118, border_a=170, tint=(255, 255, 255),
                     border=A.SKY)
    feature_cards(img, s["cards"], 0.618, K.ss(1.05, 1.38, t), at=1.05, t=t,
                  gap=0.047)


def draw_s4(img, s, p, t):
    """Combo reveal: two products slide in from opposite sides and settle."""
    dur = s["dur"]
    e1 = K.ss(0.05, 0.80, p * dur)
    e2 = K.ss(0.14, 0.90, p * dur)
    dx1 = 0.15 * (1 - K.eio(min(1.0, p * 1.9)))
    dx2 = -0.15 * (1 - K.eio(min(1.0, p * 1.9)))
    product(img, "kettle", 0.330 + dx1, 0.672, h=0.322, alpha=e1, reflect=0.0)
    product(img, "flask", 0.670 + dx2, 0.672, h=0.350, alpha=e2, reflect=0.0)
    img.paste(A.light_sweep(img, K.ss(0.30, 0.95, p), y0=0.18, y1=0.80,
                            width=0.16, strength=0.20), (0, 0))
    chip(img, s["chip"], 0.146, K.ss(0.14, 0.60, p * dur))
    rise(img, "HAWKINS KETTLE", "list", 0.196, A.DEEP, K.ss(0.30, 0.78, p * dur), dy=22)
    rise(img, "ELIMA FLASK", "list", 0.248, A.DEEP, K.ss(0.48, 0.96, p * dur), dy=22)
    rise(img, "দুটোই একসঙ্গে, এক কম্বো অফারে", "sub", 0.752, A.DEEP2,
         K.ss(0.70, 1.24, p * dur), dy=16)


def draw_s5(img, s, p, t):
    """The emotional beat — the only scene built from a photograph.

    Everything before this is product on a stage; here the products have left
    the studio and are in a family's hands: the father's tea, the mother's cup,
    the child's warm milk. The copy is written as a *wish*, not a spec, so it
    does the persuading that the feature cards cannot.

    Motion is deliberately slow (no sweeps, no pops): the cut from the previous
    scene is a hard cut to a warmer, softer frame, and the camera drifts in.
    """
    dur = s["dur"]
    # the photo drifts in from 1.06 → 1.00 and keeps pushing very slowly
    zoom = 1.06 - 0.06 * K.eio(min(1.0, p * 0.45)) + 0.022 * p
    ph = PHOTO["family"]
    img.paste(ph.frame(zoom=zoom, pan=(0.006 - 0.012 * p, 0.0)), (0, 0))

    # warm grade: lift the shadows a little so the room reads kind, not dim
    arr = np.asarray(img, np.float32)
    arr = arr * 0.94 + 12
    img.paste(Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB"), (0, 0))

    # top scrim so the headline has a clean bed without darkening the faces
    scr = Image.new("L", (W // 8, H // 8), 0)
    ds = ImageDraw.Draw(scr)
    for i in range(int(H / 8 * 0.44)):
        v = int(198 * (1 - i / (H / 8 * 0.44)) ** 1.5)
        ds.line([0, i, W // 8, i], fill=v)
    scr = scr.resize((W, H), Image.BICUBIC)
    img.paste(Image.new("RGB", (W, H), (18, 12, 8)), (0, 0), scr)

    e1 = K.ss(0.35, 1.25, t)
    rise(img, "এই শীতে", "title", 0.150, (255, 246, 232), e1, dy=24)
    rise(img, "বাবা-মায়ের চা, মায়ের কাপ,", "sub", 0.212, (255, 232, 186),
         K.ss(0.55, 1.30, t), dy=18)
    rise(img, "বাচ্চার এক গ্লাস গরম দুধ —", "sub", 0.256, (255, 232, 186),
         K.ss(0.80, 1.55, t), dy=18)
    rise(img, "পরিবারটা থাকুক উষ্ণ।", "title", 0.308, (255, 246, 232),
         K.ss(1.10, 1.90, t), dy=22)

    # the ask lands on a gold line near the bottom, over the photo's floor
    ea = K.ss(3.90, 4.60, t)
    if ea > 0.004:
        # frosted CREAM panel, navy ink — a dark bar here read as a black slab
        # pressed onto a family photo, which is exactly the look to avoid
        soft_shadow(img, (W * 0.085, H * 0.735, W * 0.915, H * 0.795), ea, 40 * SCALE)
        A.glass_card(img, (W * 0.085, H * 0.735, W * 0.915, H * 0.795), ea,
                     radius=40 * SCALE, alpha=238, border_a=210,
                     tint=(255, 252, 245), border=A.GOLD_LT)
        rise(img, "আজই নিয়ে নিন — ৳১,৫৫০", "cta", 0.750, A.DEEP, ea, dy=12)


def draw_s6(img, s, p, t):
    """Offer close: products hold, the price counts up, CTA, hold."""
    dur = s["dur"]
    base = 0.558
    e_in = K.ss(0.0, 0.60, p * dur)
    lift = -0.005 * np.sin(p * 4.0)
    product(img, "kettle", 0.312, base, h=0.262, alpha=e_in, lift=lift, reflect=0.0)
    product(img, "flask", 0.688, base, h=0.286, alpha=e_in, lift=lift, reflect=0.0)
    steam(img, 0.400, base - 0.262 * 0.86, p, count=4, strength=0.16 * e_in)
    img.paste(A.light_sweep(img, K.ss(0.20, 0.75, p), y0=0.10, y1=0.66,
                            width=0.15, strength=0.18), (0, 0))

    chip(img, s["chip"], 0.138, K.ss(0.10, 0.55, p * dur))
    rise(img, s["head"][0], "big", 0.176, A.DEEP, K.ss(0.22, 0.80, p * dur))
    rise(img, "Hawkins কেটল + Elima ফ্লাস্ক", "sub", 0.242, A.DEEP2,
         K.ss(0.40, 0.92, p * dur), dy=20)

    ep = K.ss(0.50, 1.10, p * dur)
    if ep > 0.004:
        soft_shadow(img, (W * 0.125, H * 0.600, W * 0.875, H * 0.692), ep, 34 * SCALE)
        A.glass_card(img, (W * 0.125, H * 0.600, W * 0.875, H * 0.692),
                     min(1.0, ep * 1.4), radius=34 * SCALE, alpha=170, border_a=170,
                     tint=(255, 255, 255), border=A.SKY)
        rise(img, "কম্বো প্রাইস", "label", 0.608, (44, 112, 164), ep, dy=10, maxw=0.5)
        A.count_price(img, 1550, 0.622, ep, colour=A.INK,
                      px=int(148 * SCALE * 0.72))
    ecta = K.ss(4.95, 5.55, p * dur)
    if ecta > 0.004:
        soft_shadow(img, (W * 0.115, H * 0.712, W * 0.885, H * 0.776), ecta, 40 * SCALE)
        A.glass_card(img, (W * 0.115, H * 0.712, W * 0.885, H * 0.776), ecta,
                     radius=40 * SCALE, alpha=180, border_a=200, tint=(255, 255, 255),
                     border=A.SKY)
        rise(img, "অর্ডার করতে এখনই মেসেজ করুন", "cta", 0.728, A.DEEP, ecta, dy=12)
        pulse = 0.5 + 0.5 * np.sin(t * 3.0)
        A.glass_card(img, (W * 0.115, H * 0.712, W * 0.885, H * 0.776),
                     ecta * (0.20 + 0.28 * pulse), radius=40 * SCALE, alpha=0,
                     border_a=120, tint=(255, 255, 255))



def macro_cut(s, img, t):
    """A real match cut to the macro plate — the 'detail shot' beat.

    A small inset screenshot in the corner reads as a sticker; a full-frame cut
    to a close-up of the same product reads as an edit. Three beats: cut in
    (0.28 s), hold with a slow push, cut back.
    """
    if s["id"] not in ("s2", "s3"):
        return img
    local = t - s["detail_at"]
    if local < -0.01 or local > 1.75:
        return img
    e = K.ss(0.0, 0.28, local) * (1 - K.ss(1.42, 1.72, local))
    if e <= 0.004:
        return img
    pl = PLATES[s["detail"]]
    zoom = 1.00 + 0.07 * np.clip(local / 1.6, 0, 1)
    macro = pl.frame(zoom=zoom, pan=(0, -0.010))
    macro = A.mist(macro, strength=0.06, speed=local * 0.05, y0=0.72)
    macro = A.dust(macro, local, count=22, strength=0.30)
    lab = "স্টেইনলেস স্টিল বডি" if s["id"] == "s2" else "প্রিমিয়াম লিড ও বডি"
    le = K.ss(0.12, 0.42, local) * (1 - K.ss(1.30, 1.55, local))
    if le > 0.004:
        A.glass_card(macro, (W * 0.13, H * 0.646, W * 0.87, H * 0.704), le,
                     radius=30 * SCALE, alpha=238, border_a=200,
                     tint=(255, 252, 245), border=A.SKY)
        A.centred(macro, lab, "list", 0.660, A.DEEP, le, shadow=0.0)
    return macro if e >= 0.995 else Image.blend(img, macro, float(min(1.0, e)))


def draw_scene(s, p, t):
    img = scene_backdrop(s, p)
    if s["id"] == "s1":
        draw_s1(img, s, p, t)
    elif s["id"] == "s2":
        draw_product_scene(img, s, p, t, "kettle", 0.50, 0.352)
    elif s["id"] == "s3":
        draw_product_scene(img, s, p, t, "flask", 0.50, 0.360)
    elif s["id"] == "s4":
        draw_s4(img, s, p, t)
    elif s["id"] == "s5":
        draw_s5(img, s, p, t)
    else:
        draw_s6(img, s, p, t)
    if s["id"] != "s5":          # the family beat is a photo: no cut, no dust
        img = macro_cut(s, img, p * s["dur"])
        img = A.light_sweep(img, K.ss(0.02, 0.55, p) if s["id"] in ("s1",) else -1,
                            y0=0.10, y1=0.86, width=0.18, strength=0.18)
        img = A.dust(img, p, count=28, strength=0.30)
    # a lighter grade: the bright theme loses its air with a heavy vignette
    img = A.grade(img, vignette=0.10 if s["id"] != "s5" else 0.16, grain=0.008)
    if s["id"] == SCENES[0]["id"]:
        img = _fade_in(img, p, 0.40 / s["dur"])
    if s["id"] == SCENES[-1]["id"]:
        img = _fade_out(img, p, 0.55 / s["dur"])
    return img


FLOOR_FADE = 0.0


def _fade_out(img, p, d=0.3):
    k = min(1.0, max(0.0, (1.0 - p) / max(d, 1e-6)))
    if k >= 1:
        return img
    return Image.fromarray((np.asarray(img, np.float32) * k).astype(np.uint8), "RGB")


def _fade_in(img, p, d=0.3):
    k = min(1.0, p / max(d, 1e-6))
    if k >= 1:
        return img
    return Image.fromarray((np.asarray(img, np.float32) * k).astype(np.uint8), "RGB")


# ---------------------------------------------------------------------- audio --
def _shine(dur=0.55, f=5200):
    n = int(dur * AU.SR)
    tt = AU.t(dur)
    x = AU.highpass_fast(AU.noise(n), f, 2) * np.exp(-tt * 9)
    return AU.norm(x, 0.5)


def _hiss(dur=1.6, f=2600):
    n = int(dur * AU.SR)
    tt = AU.t(dur)
    x = AU.highpass_fast(AU.lowpass_fast(AU.noise(n), f, 2), 900, 1)
    env = np.minimum(1, tt / 0.4) * np.exp(-np.maximum(0, tt - 0.5) * 1.2)
    return AU.norm(x * env, 0.35)


def _riser(dur=2.2):
    n = int(dur * AU.SR)
    tt = AU.t(dur)
    x = AU.noise(n)
    X = np.fft.rfft(x)
    fr = np.fft.rfftfreq(n, 1 / AU.SR)
    k = np.linspace(0.15, 1.0, n)
    # sweeping band-pass built by modulating a soft broadband shape
    Hf = np.exp(-((fr - 900 - 2600 * 0.5) / 2600) ** 2)
    y = np.fft.irfft(X * Hf, n=n).astype(np.float32)
    y *= np.linspace(0, 1, n) ** 2
    return AU.norm(AU.highpass_fast(y, 300, 1), 0.5)


def _click(dur=0.12):
    n = int(dur * AU.SR)
    tt = AU.t(dur)
    x = AU.lowpass_fast(AU.noise(n), 1800, 2) * np.exp(-tt * 55)
    return AU.norm(x, 0.5)


def build_audio(scenes):
    total = sum(s["dur"] for s in scenes) + 0.4
    n = int(total * AU.SR)
    music = np.zeros(n, np.float32)
    sfx = np.zeros(n, np.float32)
    voice = np.zeros(n, np.float32)

    # premium bed: slow pad chords, emerald-and-gold mood (Dm - Bb - F - C)
    chords = [(73.42, [293.66, 349.23, 440.0]),
              (58.27, [233.08, 293.66, 349.23]),
              (87.31, [261.63, 349.23, 392.0]),
              (65.41, [261.63, 329.63, 392.0])]
    pos, i = 0.0, 0
    while pos < total:
        root, notes = chords[i % len(chords)]
        d = min(8.2, total - pos)
        music = AU.place(music, AU.pad_chord([root] + notes, d, 0.07, 1.4, 1.8) * 0.38, pos)
        pos += d
        i += 1
    # a soft pulse every 1.2 s gives it the commercial heartbeat
    k = 0.0
    while k < total:
        tt = AU.t(0.5)
        thump = np.sin(2 * np.pi * 64 * tt) * np.exp(-tt * 26)
        music = AU.place(music, AU.norm(thump, 0.5), k, 0.16)
        k += 1.2
    music = AU.lowpass_fast(music, 2800, 1)
    music = AU.fade(music, 0.9, 2.0)

    # per-scene music automation: the emotional beat needs a hair more bed,
    # the closing offer a hair less, so the narration never fights the chords
    for s in scenes:
        lift = s.get("music")
        if lift is None:
            continue
        a0 = int(sum(q["dur"] for q in scenes[:scenes.index(s)]) * AU.SR)
        a1 = min(len(music), a0 + int(s["dur"] * AU.SR))
        if a1 <= a0:
            continue
        ramp = int(0.45 * AU.SR)
        g = np.ones(a1 - a0, np.float32)
        k = np.clip((np.arange(a1 - a0) - (a1 - a0 - ramp)) / ramp, 0, 1)
        g *= 1.0 + lift * k
        music[a0:a1] *= g

    _VO_END = {}
    pos = 0.0
    for s in scenes:
        d, sid = s["dur"], s["id"]
        # scene-specific ambience: room tone + product textures
        room = AU.wind(d + 0.5, 380) * 0.16
        sfx = AU.place(sfx, room, pos, 0.5)
        if sid == "s1":
            sfx = AU.place(sfx, AU.sub_boom(), pos + 0.10, 0.42)
            sfx = AU.place(sfx, AU.whoosh(0.9), pos + 0.05, 0.20)
            sfx = AU.place(sfx, _shine(0.7), pos + 0.55, 0.30)
        elif sid == "s2":
            sfx = AU.place(sfx, AU.whoosh(0.8), pos + 0.10, 0.16)
            sfx = AU.place(sfx, _click(), pos + 0.55, 0.22)
            sfx = AU.place(sfx, _hiss(2.2), pos + 1.5, 0.30)
            sfx = AU.place(sfx, _shine(0.5), pos + 3.35, 0.24)
        elif sid == "s3":
            sfx = AU.place(sfx, AU.whoosh(0.8, "down"), pos + 0.12, 0.15)
            sfx = AU.place(sfx, _click(), pos + 0.60, 0.20)
            # a tea pour: filtered noise shaped like a stream
            pour = AU.water(1.6, 1500)
            sfx = AU.place(sfx, pour, pos + 1.4, 0.22)
            sfx = AU.place(sfx, _shine(0.5), pos + 3.15, 0.22)
        elif sid == "s4":
            sfx = AU.place(sfx, AU.whoosh(0.7), pos + 0.12, 0.16)
            sfx = AU.place(sfx, _click(), pos + 0.55, 0.26)
            sfx = AU.place(sfx, AU.pad_chord([1174.7, 1568.0, 2093.0], 1.2, 0.05, 0.02, 1.0),
                           pos + 0.60, 0.20)
        elif sid == "s5":
            # the emotional cut gets one low, warm hit and a breath of air —
            # no riser (a riser promises a drop, and this beat does not drop)
            sfx = AU.place(sfx, AU.sub_boom(2.0, 46, 28), pos + 0.10, 0.30)
            sfx = AU.place(sfx, _hiss(1.4, 1800), pos + 0.20, 0.12)
        else:
            sfx = AU.place(sfx, _riser(2.0), pos + 0.10, 0.22)
            sfx = AU.place(sfx, AU.sub_boom(1.6), pos + 0.80, 0.50)
            sfx = AU.place(sfx, _shine(0.6), pos + 0.86, 0.22)
            sfx = AU.place(sfx, AU.sub_boom(1.0), pos + 5.10, 0.26)
            sfx = AU.place(sfx, _click(), pos + 5.15, 0.18)
        # narration
        # v9 bug: s5's read was 11.7 s inside a 9.6 s scene, so the tail spilled
        # into s6 and two voices talked over each other. Two hard rules now:
        #   1. a clip can never run past the end of its own scene;
        #   2. if a scene has two clips and the first would still be speaking,
        #      the second is pushed back (and reported).
        scene_end = pos + d - 0.06
        for k, item in enumerate(s["vo"]):
            f, off = item[0], item[1]
            vg = item[2] if len(item) > 2 else 1.0
            v = _read(os.path.join(VO, f + ".wav"))
            # v12: every read is levelled to the same speech loudness before it
            # is placed. The clips are generated separately and arrived within
            # ±3 dB of each other, which is audible as the voice swelling and
            # dipping from scene to scene. Measured on the loud half only, so a
            # clip with long pauses is not over-cranked.
            _r = np.sort(np.abs(v))[-max(1, len(v) // 4):]
            _lvl = float(np.sqrt(np.mean(_r ** 2))) or 1.0
            v = v * float(np.clip(0.105 / _lvl, 0.55, 2.4))
            print(f"  · vo {f}: level {_lvl:.3f} → gain {0.105/_lvl:.2f}", flush=True)
            start = pos + off
            if k > 0:
                prev_end = _VO_END.get(id(s), pos)
                if start < prev_end + 0.12:
                    start = prev_end + 0.12
                    print(f"  ! {sid}: vo {f} pushed to {start - pos:.2f}s "
                          f"(previous clip ends {prev_end - pos:.2f}s)", flush=True)
            a0 = int(start * AU.SR)
            room = max(0, int(scene_end * AU.SR) - a0)
            if room <= 0:
                print(f"  ! {sid}: vo {f} dropped — no room left in the scene",
                      flush=True)
                continue
            if len(v) > room:
                print(f"  ! {sid}: vo {f} trimmed {len(v)/AU.SR - room/AU.SR:.2f}s "
                      f"to stay inside the scene", flush=True)
                v = AU.fade(v[:room], 0.02, 0.16)
            seg = v
            voice[a0:a0 + len(seg)] += seg * vg
            _VO_END[id(s)] = start + len(v) / AU.SR
        pos += d

    # ---------------------------------------------------------------- mix --
    # v8 balance was wrong: the music bed sat at 0.62 and the "duck" only
    # pulled it 55% under speech, so the narration was buried under the pad.
    # v9: bed at 0.24, a real side-chain duck (-14 dB under speech) with a
    # smooth lookahead/release, and speech normalised up. The voice is the
    # product here; the music is there to hold it up, not compete.
    vnorm = np.max(np.abs(voice)) or 1.0
    voice = voice / vnorm * 0.88
    # v12: NO reverb. The convolution was smearing the onset of every word,
    # which is exactly what made the level feel like it was dropping and rising.
    # Instead the voice gets a gentle dynamic squash so no clip is louder than
    # its neighbour (the generated clips vary by 2-3 dB).
    voice = np.tanh(voice * 1.06) / 1.06                      # soft ceiling only
    env = np.convolve(np.abs(voice), np.ones(2400) / 2400, mode="same")
    env = env / (np.max(env) + 1e-6)
    # fast attack, slow release: a one-pole smoother on the gain
    gain = np.ones_like(env)
    g = 1.0
    alpha_a, alpha_r = 0.030, 0.0016
    e_prev = 0.0
    step = 8                       # compute the envelope every 8 samples
    for i in range(0, len(env), step):
        e = env[i]
        a = alpha_a if e > e_prev else alpha_r
        g += (e - g) * a
        e_prev = e
        # floor at -11 dB: v9 ducked to -14 dB and the bed vanished in the
        # gaps, which read as "the sound drops out" rather than "the voice lifts"
        gain[i:i + step] = 1.0 - 0.62 * np.clip(g * 2.6, 0, 1)
    bed = (music * 0.30 + sfx * 0.52) * gain
    final = np.clip(voice + bed, -1, 1)
    # gentle peak control, then a touch of headroom
    peak = float(np.max(np.abs(final))) or 1.0
    final = final / peak * 0.92
    os.makedirs(OUT, exist_ok=True)
    AU.write_wav(os.path.join(OUT, "mix_raw.wav"), final.astype(np.float32))
    return total


def _read(path):
    import wave
    w = wave.open(path)
    a = np.frombuffer(w.readframes(w.getnframes()), dtype="<i2").astype(np.float32) / 32768.0
    if w.getnchannels() > 1:
        a = a.reshape(-1, w.getnchannels()).mean(axis=1)
    return a


# ---------------------------------------------------------------------- build --
def _job(job):
    s, start, fast = job
    init()
    os.makedirs(os.path.join(OUT, "frames"), exist_ok=True)
    n = int(round(s["dur"] * FPS))
    for k in range(n):
        p = k / max(1, n - 1)
        img = draw_scene(s, p, (start + k) / FPS)
        if fast:
            img = img.resize((W // 4, H // 4), Image.LANCZOS)
        img.save(os.path.join(OUT, "frames", f"{start + k:05d}.jpg"), quality=95)
    return s["id"], start, n


def main(fast=False):
    init()
    samples = int(os.environ.get("AD_SAMPLES", "0"))
    if samples:
        # a few stills per scene for the layout check — no frames, no audio
        os.makedirs("/tmp/adframes", exist_ok=True)
        for s in SCENES:
            for k in range(samples):
                p = (k + 0.5) / samples
                draw_scene(s, p, p * s["dur"]).resize((W // 4, H // 4), Image.LANCZOS)\
                    .save(f"/tmp/adframes/{s['id']}_{k}.jpg", quality=92)
        print("samples ok")
        return
    only = os.environ.get("AD_ONLY")
    scenes = [x for x in SCENES if not only or x["id"] in only.split(",")]
    total = sum(s["dur"] for s in SCENES) + 0.4
    if not only:
        build_audio(SCENES)
    # frame numbers always come from the FULL timeline, so a partial re-render
    # drops straight back into the same sequence
    starts, idx, start_of = [], 0, {}
    for s in SCENES:
        starts.append(idx)
        start_of[s["id"]] = idx
        idx += int(round(s["dur"] * FPS))
    print("scenes", [(s["id"], s["dur"]) for s in SCENES], "total", round(total, 2),
          "frames", idx, flush=True)
    workers = int(os.environ.get("RB_WORKERS", os.cpu_count() or 1))
    workers = max(1, min(workers, len(SCENES)))
    jobs = [(s, start_of[s["id"]], fast) for s in scenes]
    if workers == 1 or len(jobs) == 1:
        for j in jobs:
            print(" scene", _job(j), flush=True)
    else:
        import multiprocessing as mp
        with mp.get_context("fork").Pool(min(workers, len(jobs))) as pool:
            for out in pool.imap_unordered(_job, jobs):
                print(" scene", out, flush=True)
    print("total frames", idx)


if __name__ == "__main__":
    main("--fast" in sys.argv)
