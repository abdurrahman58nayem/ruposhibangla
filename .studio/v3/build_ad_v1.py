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
    dict(id="s1", dur=4.20, stage="cool", vo=[("v1b", 0.55)],
         chip="শীতের কম্বো অফার",
         head=["শীতে পরিবারের", "প্রয়োজনীয় দুটি পণ্য"]),
    dict(id="s2", dur=9.20, stage="cool", vo=[("v2", 0.70)],
         chip="Hawkins ইলেকট্রিক কেটল",
         head=["পানি গরম,", "কয়েক মিনিটেই"],
         cards=["২ লিটার ধারণক্ষমতা", "স্টেইনলেস স্টিল বডি", "পানি ফুটলেই অটো বন্ধ"],
         detail="kettle_detail.png", detail_at=3.50),
    dict(id="s3", dur=8.60, stage="warm", vo=[("v3", 0.70)],
         chip="Elima ভ্যাকুয়াম ফ্লাস্ক",
         head=["চায়ের উষ্ণতা", "থাকুক অনেকক্ষণ"],
         cards=["১ লিটার ধারণক্ষমতা", "প্রিমিয়াম ডিজাইন", "গন্ধহীন ভেতর"],
         detail="flask_detail.png", detail_at=3.30),
    dict(id="s4", dur=4.20, stage="cool", vo=[("v4", 0.70)],
         chip="কম্বো অফার",
         head=["দুটোই একসঙ্গে"]),
    dict(id="s5", dur=8.00, stage="cool", vo=[("v5", 0.85), ("v6", 5.30)],
         chip="কম্বো প্রাইস",
         head=["মাত্র"],
         price=1550),
]

STAGE, SPRITES, PLATES = {}, {}, {}


def init():
    if STAGE:
        return
    STAGE["cool"] = A.Plate(os.path.join(ART, "stage_cool.png"), scale=1.10)
    STAGE["warm"] = A.Plate(os.path.join(ART, "stage_warm.png"), scale=1.10)
    SPRITES["kettle"] = A.Sprite(Image.open(os.path.join(SPR, "kettle.png")))
    SPRITES["flask"] = A.Sprite(Image.open(os.path.join(SPR, "flask.png")))
    for n in ("kettle_detail.png", "flask_detail.png", "price_combo.png"):
        PLATES[n] = A.Plate(os.path.join(PLATE, n), scale=1.06)


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
    canvas.paste(Image.new("RGB", canvas.size, (255, 250, 240)), (0, 0), lay)


# ---------------------------------------------------------------------- type ---
def chip(canvas, txt, y, e, colour=GOLD_L):
    if e <= 0.004:
        return
    lay = T.flow(txt, "sans-semi", int(36 * SCALE))
    pw = lay.width + 2 * 30 * SCALE
    ph = lay.image.height + 2 * 14 * SCALE
    x = int((W - pw) / 2)
    yy = int(y * H)
    d = ImageDraw.Draw(canvas, "RGBA")
    d.rounded_rectangle([x, yy, x + pw, yy + ph], radius=ph // 2,
                        fill=(8, 20, 18, int(120 * e)),
                        outline=colour + (int(150 * e),), width=max(1, int(2 * SCALE)))
    T.paint(canvas, lay.image, (int(x + 30 * SCALE), int(yy + 14 * SCALE)),
            IVORY, e, shadow=(2, 3, (0, 0, 0), 0.5))


def feature_cards(canvas, rows, y0, e_all, at=0.0, gap=0.052):
    """Stacked one-line feature rows: gold tick, ivory text, on a light glass."""
    if e_all <= 0.004:
        return
    for i, txt in enumerate(rows):
        e = K.ss(at + i * 0.55, at + i * 0.55 + 0.55, e_all * 6.0)
        e = min(1.0, e)
        if e <= 0.004:
            continue
        yy = y0 + i * gap
        lay = T.flow(txt, "sans-semi", int(44 * SCALE))
        tw = lay.width
        x0 = int((W - tw) / 2 - 54 * SCALE)
        # tick
        d = ImageDraw.Draw(canvas, "RGBA")
        ty = int(yy * H + lay.image.height * 0.42)
        d.line([x0, ty, x0 - 14 * SCALE, ty + 14 * SCALE], fill=GOLD_L + (int(230 * e),),
               width=max(1, int(3 * SCALE)))
        d.line([x0 - 14 * SCALE, ty + 14 * SCALE, x0 - 34 * SCALE, ty - 8 * SCALE],
               fill=GOLD_L + (int(230 * e),), width=max(1, int(3 * SCALE)))
        T.paint(canvas, lay.image, (int((W - tw) / 2 + 12 * SCALE),
                                    int(yy * H + 22 * (1 - e) * SCALE)),
                IVORY, e, shadow=(3, 4, (0, 0, 0), 0.55))


# --------------------------------------------------------------------- scenes --
def scene_backdrop(s, p):
    st = STAGE[s["stage"]]
    if s["id"] == "s1":
        img = st.frame(zoom=1.02 + 0.06 * K.eo(p), pan=(0, 0.004 - 0.012 * p))
    elif s["id"] == "s5":
        img = st.frame(zoom=1.06 + 0.05 * p, pan=(0, -0.006))
    else:
        img = st.frame(zoom=1.03 + 0.07 * K.eio(p), pan=(0.012 - 0.024 * p, 0.008))
    img = A.mist(img, strength=0.10, speed=p * 0.06, y0=0.66)
    if s["id"] in ("s2", "s3"):
        img = _deepen_lower(img, 0.64)
    if s["id"] == "s5":
        img = _deepen_lower(img, 0.60)
    return img


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
    e = K.ss(0.05, 0.85, p * s["dur"])
    rise = 0.10 * (1 - K.back(min(1.0, p * 2.4)))
    product(img, "kettle", 0.335, 0.675 + rise, h=0.305,
            alpha=K.ss(0.0, 0.30, p * s["dur"]), lift=-0.004 * np.sin(p * 5))
    product(img, "flask", 0.665, 0.675 + rise, h=0.330,
            alpha=K.ss(0.06, 0.36, p * s["dur"]), lift=-0.004 * np.sin(p * 5 + 1))
    steam(img, 0.335, 0.545, p, count=4, strength=0.35 * e)
    chip(img, s["chip"], 0.092, K.ss(0.30, 0.75, p * s["dur"]))
    e1 = K.ss(0.55, 1.15, p * s["dur"])
    e2 = K.ss(0.95, 1.55, p * s["dur"])
    A.centred(img, s["head"][0], "big", 0.150, GOLD_L, e1, dy=30)
    A.centred(img, s["head"][1], "title", 0.222, IVORY, e2, dy=26)


def draw_product_scene(img, s, p, t, key, cx, h, base=0.575):
    dur = s["dur"]
    e_in = K.ss(0.0, 0.55, p * dur)
    lift = -0.006 * np.sin(p * 4.2)
    product(img, key, cx, base, h=h, alpha=e_in, lift=lift)
    steam(img, cx + 0.105, base - h * 0.86, p, count=5,
          strength=(0.55 if key == "kettle" else 0.35) * e_in)
    chip(img, s["chip"], 0.058, K.ss(0.25, 0.80, p * dur))
    A.centred(img, s["head"][0], "title", 0.100, GOLD_L, K.ss(0.55, 1.10, p * dur), dy=26)
    A.centred(img, s["head"][1], "sub", 0.154, IVORY, K.ss(0.85, 1.40, p * dur), dy=22)
    # ONE glass card holds all three features: the type must never sit on the
    # bare floor, and the card must never read as a black slab — light frost.
    ec = K.ss(0.9, 1.4, p * dur)
    if ec > 0.004:
        A.glass_card(img, (W * 0.085, H * 0.622, W * 0.915, H * 0.818), ec,
                     radius=30 * SCALE, alpha=104, border_a=95)
    feature_cards(img, s["cards"], 0.648, p, gap=0.049)


def draw_s4(img, s, p, t):
    dur = s["dur"]
    e1 = K.ss(0.05, 0.75, p * dur)
    e2 = K.ss(0.20, 0.90, p * dur)
    dx1 = 0.16 * (1 - K.eo(min(1.0, p * 1.7)))
    dx2 = -0.16 * (1 - K.eo(min(1.0, p * 1.7)))
    product(img, "kettle", 0.335 + dx1, 0.735, h=0.360, alpha=e1)
    product(img, "flask", 0.665 + dx2, 0.735, h=0.390, alpha=e2)
    img_ = A.light_sweep(img, K.ss(0.30, 0.95, p), y0=0.18, y1=0.80,
                         width=0.16, strength=0.26)
    chip(img, s["chip"], 0.082, K.ss(0.25, 0.80, p * dur))
    A.centred(img, "HAWKINS KETTLE", "list", 0.140, IVORY, K.ss(0.55, 1.05, p * dur),
              maxw=0.86)
    A.centred(img, "+", "sub", 0.185, GOLD_L, K.ss(0.70, 1.10, p * dur))
    A.centred(img, "ELIMA FLASK", "list", 0.215, IVORY, K.ss(0.80, 1.25, p * dur),
              maxw=0.86)
    A.centred(img, "দুটোই একসঙ্গে, এক কম্বো অফারে", "sub", 0.885, GOLD_L,
              K.ss(1.35, 1.95, p * dur), dy=24)


def draw_s5(img, s, p, t):
    """Offer frame: the two products hold still, the price does the talking.

    Composed from the stage + the two sprites (not from a generated still) so
    the offer frame is guaranteed clean below the products — the price card
    needs a quiet, empty band or it reads as a smudge over the kettle.
    """
    dur = s["dur"]
    base = 0.665
    e_in = K.ss(0.0, 0.55, p * dur)
    lift = -0.005 * np.sin(p * 4.0)
    product(img, "kettle", 0.330, base, h=0.300, alpha=e_in, lift=lift)
    product(img, "flask", 0.670, base, h=0.325, alpha=e_in, lift=lift)
    steam(img, 0.435, base - 0.300 * 0.86, p, count=4, strength=0.30 * e_in)
    img2 = A.light_sweep(img, K.ss(0.20, 0.70, p), y0=0.10, y1=0.66,
                         width=0.15, strength=0.22)
    img.paste(img2, (0, 0))

    chip(img, s["chip"], 0.066, K.ss(0.15, 0.60, p * dur))
    A.centred(img, "COMBO OFFER", "label", 0.113, GOLD_L, K.ss(0.35, 0.80, p * dur))
    A.centred(img, "Hawkins কেটল + Elima ফ্লাস্ক", "list", 0.152, IVORY,
              K.ss(0.55, 1.00, p * dur))

    ep = K.ss(0.75, 1.45, p * dur)
    if ep > 0.004:
        A.glass_card(img, (W * 0.105, H * 0.686, W * 0.895, H * 0.800),
                     min(1.0, ep * 1.4), radius=34 * SCALE, alpha=92, border_a=105)
        A.rule(img, 0.694, ep, w=0.18, colour=GOLD_L, alpha=0.7)
        A.count_price(img, 1550, 0.706, ep)
    ecta = K.ss(5.05, 5.60, p * dur)
    if ecta > 0.004:
        A.glass_card(img, (W * 0.115, H * 0.836, W * 0.885, H * 0.916), ecta,
                     radius=40 * SCALE, alpha=120, border_a=150)
        A.centred(img, "অর্ডার করতে এখনই মেসেজ করুন", "cta", 0.856, IVORY, ecta, dy=20)
        pulse = 0.5 + 0.5 * np.sin(t * 3.4)
        A.glass_card(img, (W * 0.115, H * 0.836, W * 0.885, H * 0.916),
                     ecta * (0.25 + 0.35 * pulse), radius=40 * SCALE, alpha=0,
                     border_a=120)
    efoot = K.ss(5.70, 6.30, p * dur)
    A.centred(img, "Hawkins ২ লিটার · Elima ১ লিটার · মোট ৳১,৫৫০", "list2", 0.930,
              WINTER, efoot, dy=16)


def macro_cut(s, img, t):
    """A real match cut to the macro plate — the 'detail shot' beat.

    A small inset screenshot in the corner reads as a sticker; a full-frame
    cut to a close-up of the same product reads as an edit. Three beats:
    cut in (0.30 s), hold with a slow push, cut back.
    """
    if s["id"] not in ("s2", "s3"):
        return img
    d_at = s["detail_at"]
    local = t - d_at          # t is scene-local seconds
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
    # label rides on the cut
    lab = "স্টেইনলেস স্টিল বডি" if s["id"] == "s2" else "প্রিমিয়াম লিড ও বডি"
    le = K.ss(0.12, 0.42, local) * (1 - K.ss(1.30, 1.55, local))
    if le > 0.004:
        A.glass_card(macro, (W * 0.13, H * 0.842, W * 0.87, H * 0.906), le,
                     radius=30 * SCALE, alpha=104, border_a=110)
        A.centred(macro, lab, "list", 0.858, A.GOLD_LT, le)
    # full cut, not a ghost: even 6% of the outgoing frame showed the titles
    # through the macro plate and read as a double exposure
    return macro if e >= 0.995 else Image.blend(img, macro, float(min(1.0, e)))


def draw_scene(s, p, t):
    img = scene_backdrop(s, p)
    if s["id"] == "s1":
        draw_s1(img, s, p, t)
    elif s["id"] == "s2":
        draw_product_scene(img, s, p, t, "kettle", 0.50, 0.362)
    elif s["id"] == "s3":
        draw_product_scene(img, s, p, t, "flask", 0.50, 0.372)
    elif s["id"] == "s4":
        draw_s4(img, s, p, t)
    else:
        draw_s5(img, s, p, t)
    img = macro_cut(s, img, p * s["dur"])
    img = A.light_sweep(img, K.ss(0.02, 0.55, p) if s["id"] in ("s1",) else -1,
                        y0=0.10, y1=0.86, width=0.18, strength=0.22)
    img = A.dust(img, p, count=34, strength=0.42)
    img = A.grade(img, vignette=0.22, grain=0.009)
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
            sfx = AU.place(sfx, AU.whoosh(0.7), pos + 0.15, 0.18)
            sfx = AU.place(sfx, AU.whoosh(0.7, "down"), pos + 0.30, 0.16)
            sfx = AU.place(sfx, _click(), pos + 0.86, 0.30)
            sfx = AU.place(sfx, AU.pad_chord([1174.7, 1568.0], 1.4, 0.05, 0.02, 1.2),
                           pos + 0.9, 0.16)
        else:
            sfx = AU.place(sfx, _riser(2.0), pos + 0.10, 0.22)
            sfx = AU.place(sfx, AU.sub_boom(1.6), pos + 0.80, 0.50)
            sfx = AU.place(sfx, _shine(0.6), pos + 0.86, 0.22)
            sfx = AU.place(sfx, AU.sub_boom(1.0), pos + 5.10, 0.26)
            sfx = AU.place(sfx, _click(), pos + 5.15, 0.18)
        # narration
        for f, off in s["vo"]:
            v = _read(os.path.join(VO, f + ".wav"))
            a0 = int((pos + off) * AU.SR)
            seg = v[: max(0, min(len(v), len(voice) - a0))]
            voice[a0:a0 + len(seg)] += seg
        pos += d

    env = np.convolve(np.abs(voice), np.ones(4800) / 4800, mode="same")
    duck = 1.0 - 0.55 * np.clip(env / (np.max(env) + 1e-6) * 3.2, 0, 1)
    mix = (music * 0.62 + sfx * 0.9) * duck * 0.82
    final = np.clip(voice * 1.0 + mix, -1, 1)
    peak = float(np.max(np.abs(final))) or 1.0
    os.makedirs(OUT, exist_ok=True)
    AU.write_wav(os.path.join(OUT, "mix_raw.wav"), (final / peak * 0.94).astype(np.float32))
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
