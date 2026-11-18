"""Episode 009 — সাদা বক (Little Egret) — 4K vertical reel.

Two rules from the brief that shape this file:

* **Natural colour.** No warm grade, no saturation push, no colour cast. The
  photo goes to the screen with its own colours intact; only a gentle exposure
  match, a light vignette and grain are allowed. Whites stay white.
* **4K.** Canvas is 2160x3840. Geometry is expressed in fractions of W/H so the
  same layout works at any size.
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

import kinetic as K
import rbtext as T
import rbvisual as V

OUT = "../render13"
VO = "../vo_bok"
ART = "../art_bok"
FPS = 30
SCALE = 2                      # 2 => 2160x3840 (4K UHD vertical)
W, H = 1080 * SCALE, 1920 * SCALE

# natural palette: everything sits inside the photo's own range
C_CREAM = (255, 252, 245)
C_WHITE = (255, 255, 255)
C_GOLD = (247, 214, 140)
C_MINT = (186, 236, 206)
C_SKY = (176, 220, 240)
C_CORAL = (244, 168, 148)
C_SAND = (240, 214, 176)


# ------------------------------------------------------------------ geometry --
class Cam4K:
    """Camera over a source still, rendering straight to the 4K canvas."""

    def __init__(self, path, scale=1.08):
        src = Image.open(path).convert("RGB")
        f = max(W / src.width, H / src.height) * scale
        self.img = src.resize((int(src.width * f), int(src.height * f)), Image.LANCZOS)
        self.iw, self.ih = self.img.size
        self.cx, self.cy = self.iw / 2, self.ih / 2

    def frame(self, zoom=1.0, pan=(0.0, 0.0), shake=(0.0, 0.0)):
        z = max(1.0, zoom)
        cw, ch = W / z, H / z
        cx = min(max(self.cx + pan[0] * self.iw, cw / 2 + 1), self.iw - cw / 2 - 1)
        cy = min(max(self.cy + pan[1] * self.ih, ch / 2 + 1), self.ih - ch / 2 - 1)
        box = (cx - cw / 2 + shake[0], cy - ch / 2 + shake[1],
               cx + cw / 2 + shake[0], cy + ch / 2 + shake[1])
        return self.img.resize((W, H), Image.LANCZOS, box=box)


# -------------------------------------------------------------- natural look --
_YY, _XX = np.mgrid[0:H, 0:W].astype(np.float32)
_NX, _NY = _XX / W, _YY / H
_VIG = None


def _vignette(strength):
    global _VIG
    if _VIG is None:
        d = np.sqrt(((_NX - 0.5) * 1.10) ** 2 + ((_NY - 0.5) * 0.92) ** 2)
        _VIG = {}
    key = round(strength, 3)
    if key not in _VIG:
        _VIG[key] = (1 - strength * V.smoothstep(0.34, 0.86, d)).astype(np.float32)[:, :, None]
    return _VIG[key]


def soft_shade(img, top=0.0, bottom=0.0, head=0.0, head_h=0.30):
    """Feathered darkening that only *touches* the edges, never tints them.

    The old scrim multiplied a warm image down to near-black at the top and
    bottom, which read as a dark frame. Here the mask tops out at a low value
    and fades across a long ramp, so the photo keeps its value range.
    """
    arr = np.asarray(img, dtype=np.float32)
    y = np.linspace(0, 1, H, dtype=np.float32)
    m = np.zeros(H, dtype=np.float32)
    if top:
        m += top * (1 - V.smoothstep(0.0, 0.26, y))
    if head:
        m += head * (1 - V.smoothstep(0.0, head_h, y))
    if bottom:
        m += bottom * V.smoothstep(0.74, 1.0, y)
    m = np.clip(m, 0, 0.62)
    arr *= (1 - m)[:, None, None]
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")


def natural_finish(img, vignette=0.16, grain=0.006, lift=0.045):
    """Exposure-match + very light shadow lift + vignette + grain.

    Deliberately no saturation, no contrast stretch, no white-balance shift:
    the brief is that the photograph keeps the colour it was shot with.
    """
    import numpy as _np
    arr = np.asarray(img)
    u8 = _np.arange(256, dtype=_np.float32) / 255.0
    # pure exposure match on the mid-tone: no per-channel curve at all
    tbl = u8.copy()
    for _ in range(4):
        cur = float(tbl[arr[::16, ::16]].mean())
        if abs(cur - 0.455) < 0.006:
            break
        g = float(_np.clip(_np.log(0.455) / _np.log(max(min(cur, 0.98), 0.02)),
                           1 / 2.2, 2.2))
        tbl = _np.power(tbl, g)
    if lift:
        tbl = tbl * (1 - lift) + lift * _np.power(tbl, 0.85)
    lut = _np.clip(tbl * 255.0, 0, 255).astype(_np.uint8)
    out = _np.empty(arr.shape, dtype=_np.uint8)
    for c in range(3):
        out[..., c] = lut[arr[..., c]]
    f = out.astype(_np.float32)
    if vignette:
        f *= _vignette(vignette)
    if grain:
        rng = _np.random.default_rng(int(vignette * 1e5) + 11)
        n = rng.standard_normal((H // 4, W // 4)).astype(_np.float32)
        n = _np.repeat(_np.repeat(n, 4, axis=0), 4, axis=1)[:H, :W]
        f += (n * grain * 255.0)[:, :, None]
    return Image.fromarray(_np.clip(f, 0, 255).astype(_np.uint8), "RGB")


# --------------------------------------------------------------- type helpers --
STYLE = {
    "chip":  ("sans-semi", 34 * SCALE, "chip"),
    "title": ("serif-bold", 78 * SCALE, "word"),
    "num":   ("serif-bold", 84 * SCALE, "word"),
    "sub":   ("sans-semi", 44 * SCALE, "rise"),
    "attr":  ("sans-semi", 32 * SCALE, "rise"),
    "quote": ("serif-bold", 54 * SCALE, "word"),
}


def _lum(rgb):
    return 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]


def pick_ink(img, box, hint=None):
    """Readable ink over this patch, staying inside the photo's own colours.

    White type on the dark parts of a photo, and a deep shade of the patch
    itself on the bright parts — never pure black. That is what keeps a white
    bird looking white while the caption stays legible on snow-white plumage.
    """
    lum, sat, rgb = V.region_stats(img, *box)
    light = hint if (hint and _lum(hint) > 210) else C_CREAM
    light_c = _lum(light) - lum
    m = np.array(rgb, dtype=np.float32)
    base = float(_lum(m))
    scale = float(np.clip(lum * 0.30, 12.0, 54.0)) / max(base, 1e-3)
    deep = tuple(int(v) for v in np.clip(m * scale, 0, 255))
    deep_c = lum - _lum(deep)
    if light_c >= 96 and light_c >= deep_c:
        return light, "light"
    if deep_c >= 96:
        return deep, "deep"
    if light_c >= deep_c:
        return light, "light"
    return (18, 20, 22), "flat"


def draw_line(img, style, txt, colour, y, align, e, x0=None):
    if e <= 0.004:
        return
    key, px, anim = STYLE[style]
    center = align == "mid"
    lay = T.flow(txt, key, px)
    x0 = int(W * 0.075) if x0 is None else x0
    xx = (W - lay.width) / 2 if center else x0
    if style == "chip":
        K.chip(img, txt, (x0, y), e, px=30 * SCALE, colour=colour, icon="dot",
               slide=40 * SCALE)
        return

    ink, kind = pick_ink(img, (xx - 8, y - 8, xx + lay.width + 8,
                               y + lay.image.height + 12), hint=colour)
    if kind == "light":
        # white type on a busy photo: a *dark* feather behind the glyphs, made
        # from the photo's own average tone, kept well clear of the letters
        busy = V._edge_energy(img, (xx, y, xx + lay.width, y + lay.image.height))
        a = int(min(150 if style in ("num", "title") else 120,
                    62 + (110 if style in ("num", "title") else 96) * busy))
        soft = lay.image.filter(ImageFilter.GaussianBlur(max(16, px // 5)))
        halo = Image.new("RGBA", img.size, (0, 0, 0, 0))
        halo.paste(Image.new("RGBA", lay.image.size, (12, 16, 18, a)),
                   (int(xx), int(y)), soft)
        base = img.convert("RGBA")
        img.paste(Image.alpha_composite(base, halo).convert("RGB"), (0, 0))
        shadow = (0, 4 * SCALE, (0, 0, 0), 0.34)
        glow = None
    else:
        # dark type on bright plumage: a pale feather behind the glyphs
        busy = V._edge_energy(img, (xx, y, xx + lay.width, y + lay.image.height))
        a = int(min(190, 96 + 150 * busy))
        soft = lay.image.filter(ImageFilter.GaussianBlur(max(10, px // 8)))
        halo = Image.new("RGBA", img.size, (0, 0, 0, 0))
        halo.paste(Image.new("RGBA", lay.image.size, (255, 253, 248, a)),
                   (int(xx), int(y)), soft)
        base = img.convert("RGBA")
        img.paste(Image.alpha_composite(base, halo).convert("RGB"), (0, 0))
        shadow = (0, 3 * SCALE, (255, 255, 255), 0.22)
        glow = None

    if center:
        # centred lines are laid out with kinetic.W (a 1080-wide constant), so
        # they must be drawn on a 1080 canvas and pasted back at 2x — otherwise
        # they all hug the left edge on the 4K canvas.
        small = img.resize((W // SCALE, H // SCALE), Image.LANCZOS)
        y_s = y // SCALE
        ink_s, _kind = pick_ink(small, (xx // SCALE - 8, y_s - 8,
                                        (xx + lay.width) // SCALE + 8,
                                        (y + lay.image.height) // SCALE + 12), hint=colour)
        if anim == "word":
            base_y = y_s + T.baseline_offset(lay)
            K.word_line(small, txt, key, px // SCALE, (0, base_y), ink_s,
                        min(1.0, e * 1.4), stagger=0.15, dur=0.34,
                        rise=30, center_x=True, x0=0, shadow=shadow)
        else:
            yy = y_s + 18 * (1 - K.eo(e))
            if kind == "light":
                soft = lay.image.filter(ImageFilter.GaussianBlur(max(8, (px // SCALE) // 8)))
                halo = Image.new("RGBA", small.size, (0, 0, 0, 0))
                halo.paste(Image.new("RGBA", lay.image.size, (16, 18, 20, 110)),
                           (int(xx // SCALE), int(y_s)), soft)
                small.paste(Image.alpha_composite(small.convert("RGBA"), halo).convert("RGB"), (0, 0))
            T.paint(small, lay.image, (int(xx // SCALE), int(yy)), ink_s,
                    min(1.0, e * 1.5), shadow=shadow, glow=None)
        img.paste(small.resize((W, H), Image.LANCZOS), (0, 0))
        return

    if anim == "word":
        base_y = y + T.baseline_offset(lay)
        K.word_line(img, txt, key, px, (x0, base_y), ink, min(1.0, e * 1.4),
                    stagger=0.15, dur=0.34, rise=30 * SCALE, center_x=center,
                    x0=x0, shadow=shadow)
    else:
        yy = y + 18 * SCALE * (1 - K.eo(e))
        T.paint(img, lay.image, (int(xx), int(yy)), ink, min(1.0, e * 1.5),
                shadow=shadow, glow=glow)


# --------------------------------------------------------------------- scenes --
SCENES = [
    dict(id="s01", art="b01_hook.png", amb="water", pre=0.55, post=0.85, kind="hook",
         lowfloor=1180, fx=[("boom", 0.18, 0.55), ("wing", 0.62, 0.35)],
         cues={"perch": 0.0, "name": 0.60}),
    dict(id="s02", art="b02_portrait.png", amb="still", pre=0.45, post=0.75, kind="portrait",
         fx=[("whoosh", 0.05, 0.32), ("chime", 0.35, 0.26)],
         cues={"name": 0.0, "en": 0.12, "alias": 0.28}),
    dict(id="s03", art="b03_feet.png", amb="water", pre=0.45, post=0.75, kind="detail",
         fx=[("drip", 0.15, 0.35), ("chime", 0.55, 0.26)],
         cues={"feet": 0.0, "bill": 0.48}),
    dict(id="s04", art="b04_flight.png", amb="wind", pre=0.45, post=0.80, kind="nation",
         fx=[("whoosh", 0.10, 0.45), ("boom", 0.45, 0.35)],
         cues={"neck": 0.0, "fly": 0.45}),
    dict(id="s05", art="b05_floodpaddy.png", amb="water", pre=0.45, post=0.75, kind="home",
         lowceil=1340, fx=[("tick", 0.12, 0.30), ("boom", 0.55, 0.30)],
         cues={"paddy": 0.0, "mix": 0.50}),
    dict(id="s06", art="b06_hunt.png", amb="water", pre=0.45, post=0.75, kind="cycle",
         lowfloor=1330, fx=[("whoosh_down", 0.20, 0.35), ("drip", 0.60, 0.30)],
         cues={"catch": 0.0, "stir": 0.48}),
    dict(id="s07", art="b07_colony.png", amb="forest", pre=0.45, post=0.80, kind="role",
         lowfloor=1180, fx=[("chime", 0.12, 0.26), ("drip", 0.45, 0.26)],
         cues={"nest": 0.0, "eggs": 0.40, "both": 0.72}),
    dict(id="s08", art="b08_threat.png", amb="wind", pre=0.45, post=0.80, kind="threats",
         lowfloor=1300, fx=[("tension", 0.10, 0.35), ("boom", 0.45, 0.32)],
         cues={"fill": 0.0, "pest": 0.34, "iucn": 0.64}),
    dict(id="s09", art="b09_evening.png", amb="wind", pre=0.45, post=0.75, kind="use",
         lowfloor=1150, fx=[("chime", 0.15, 0.26), ("whoosh", 0.60, 0.28)],
         cues={"everywhere": 0.0, "roost": 0.50}),
    dict(id="s10", art="b10_poem.png", amb="still", pre=0.55, post=2.40, kind="outro",
         lowceil=1180, fx=[("chime", 0.20, 0.28), ("boom", 0.55, 0.30), ("whoosh", 0.85, 0.26)],
         cues={"last": 0.0, "keep": 0.42, "logo": 0.62, "cta": 0.76, "url": 0.86}),
]

CAMS = {}


def init_cams():
    if CAMS:
        return
    for s in SCENES:
        CAMS[s["art"]] = Cam4K(os.path.join(ART, s["art"]))


# --------------------------------------------------------------------- camera --
def scene_frame(s, p, t):
    cam = CAMS[s["art"]]
    kind = s["kind"]
    if kind == "hook":
        z = 1.05 + 0.10 * K.eo(p * 1.15)
        img = cam.frame(zoom=z, pan=(0, 0.012 - 0.020 * p),
                        shake=(0.6 * np.sin(p * 7), 0.5 * np.cos(p * 6)))
    elif kind == "portrait":
        z = 1.12 - 0.05 * K.eio(p)
        img = cam.frame(zoom=z, pan=(-0.03 - 0.02 * K.eio(p), -0.020))
    elif kind == "detail":
        z = 1.24 - 0.12 * K.eio(p)
        img = cam.frame(zoom=z, pan=(0.0, 0.015 - 0.025 * p))
    elif kind == "nation":
        z = 1.10 + 0.08 * p
        img = cam.frame(zoom=z, pan=(-0.02 + 0.04 * p, 0.01))
    elif kind == "home":
        z = 1.18 - 0.13 * K.eio(p)
        img = cam.frame(zoom=z, pan=(-0.03 + 0.05 * p, 0.02))
    elif kind == "cycle":
        z = 1.20 - 0.11 * K.eio(p)
        img = cam.frame(zoom=z, pan=(0.012 - 0.024 * p, -0.008))
    elif kind == "role":
        z = 1.16 - 0.09 * p
        img = cam.frame(zoom=z, pan=(0.018 - 0.036 * p, 0.01))
    elif kind == "use":
        z = 1.12 + 0.07 * p
        img = cam.frame(zoom=z, pan=(0.018 - 0.028 * p, 0.008))
    elif kind == "threats":
        z = 1.18 - 0.10 * p
        img = cam.frame(zoom=z, pan=(-0.02 + 0.04 * p, 0.018),
                        shake=(1.2 * np.sin(p * 18), 1.0 * np.cos(p * 15)))
    elif kind == "outro":
        z = 1.12 - 0.05 * K.eio(p)
        img = cam.frame(zoom=z, pan=(0, -0.012))
    else:
        z = 1.06 + 0.10 * K.eo(p)
        img = cam.frame(zoom=z, pan=(0, 0.01))
    return img


def render_frame(s, p, t_global):
    img = scene_frame(s, p, t_global)
    # feather-light edge shade only — no warm wash, no colour shift
    img = soft_shade(img, top=0.20, bottom=0.24, head=0.10, head_h=0.26)
    img = natural_finish(img, vignette=0.16, grain=0.006)
    img = overlay(s, p, img)
    # Fade only at the very edges of the reel. Between scenes a hard cut is
    # clean; fading every cut to black produced a 4-frame black blink.
    if s.get("id") == "s01":
        img = dissolve_in(img, p, 0.42 / s["dur"])
    if s.get("id") == SCENES[-1]["id"]:
        img = dissolve_out(img, p, 0.52 / s["dur"])
    return img


FLOOR = 0.20      # never fade fully to black: a 4-frame black blink at every
                  # cut reads as a flicker, a dark dip reads as a transition


def dissolve_out(img, p, dur=0.30):
    k = FLOOR + (1.0 - FLOOR) * min(1.0, max(0.0, (1.0 - p) / max(dur, 1e-6)))
    if k >= 1:
        return img
    return Image.fromarray((np.asarray(img, dtype=np.float32) * k).astype(np.uint8), "RGB")


def dissolve_in(img, p, dur=0.28):
    k = FLOOR + (1.0 - FLOOR) * (min(1.0, p / max(dur, 1e-6)) if dur > 0 else 1.0)
    if k >= 1:
        return img
    return Image.fromarray((np.asarray(img, dtype=np.float32) * k).astype(np.uint8), "RGB")


# --------------------------------------------------------------------- voice ---
def _regroup(segs, k):
    """Fold the sentence windows of a scene into exactly k contiguous blocks."""
    if k <= 0 or not segs:
        return segs
    if k >= len(segs):
        return segs
    out, n = [], len(segs)
    for i in range(k):
        a = int(round(i * n / k))
        b = int(round((i + 1) * n / k))
        b = max(b, a + 1)
        out.append((segs[a][0], segs[min(b, n) - 1][1]))
    return out


def _nearest_onset(onsets, target):
    if not onsets:
        return target
    return min(onsets, key=lambda o: abs(o - target))


def resolve_cues():
    import timing2 as TM
    for s in SCENES:
        wav = os.path.join(VO, s["id"] + ".wav")
        dur, onsets = TM.speech_beats(wav)
        s["vo"] = wav
        s["vodur"] = dur
        t0, t1 = (onsets[0] if onsets else 0.25), max(0.30, dur - 0.35)
        segs = TM.sentences(wav) or [(t0, t1)]
        _rows = layout_beats(s["id"])
        k = max((r[0] for r in _rows), default=0) + 1 if _rows else 1
        s["cue"] = {k2: _nearest_onset(onsets, t0 + (t1 - t0) * float(f))
                    for k2, f in s["cues"].items()}
        s["segs"] = _regroup(segs, k) if segs else [(t0, t1)]
        s["dur"] = round(s["pre"] + dur + s["post"], 3)
    return SCENES


# --------------------------------------------------------------------- beats ---
BEATS = {
    "s01": [
        (0, "chip", "জলাশয়ের ধারে", C_SKY, 268, "left"),
        (0, "title", "সাদা বক", C_CREAM, 340, "left"),
        (1, "title", "দাঁড়িয়ে থাকে অচল", C_CREAM, 1180, "left"),
        (2, "sub", "ঠোঁট নামে এক ঝটকায়", C_GOLD, 1300, "left"),
    ],
    "s02": [
        (0, "chip", "পরিচয়", C_MINT, 268, "left"),
        (0, "title", "সাদা বক", C_CREAM, 340, "left"),
        (1, "attr", "ইংরেজিতে Little Egret", C_MINT, 1180, "left"),
        (2, "attr", "Egretta garzetta", C_MINT, 1288, "left"),
    ],
    "s03": [
        (0, "chip", "শনাক্তকরণ", C_SAND, 268, "left"),
        (0, "title", "কালো পা, হলুদ পাতা", C_CREAM, 340, "left"),
        (1, "title", "ঠোঁটও কালো", C_GOLD, 1180, "left"),
        (2, "sub", "প্রজননে মাথার পেছনে লম্বা পালক", C_CREAM, 1300, "left"),
    ],
    "s04": [
        (0, "chip", "উড়ান", C_SKY, 268, "left"),
        (0, "title", "গলা ভাঁজ করে উড়ে", C_CREAM, 340, "left"),
        (1, "title", "পা টেনে রাখে পেছনে", C_GOLD, 1180, "left"),
        (1, "sub", "ডানার ঝাপটা ধীর, শান্ত", C_CREAM, 1300, "left"),
    ],
    "s05": [
        (0, "chip", "বাংলাদেশে", C_MINT, 268, "left"),
        (0, "title", "বর্ষার ধানখেত", C_CREAM, 340, "left"),
        (1, "title", "বিল, হাওর, পুকুর", C_GOLD, 1180, "left"),
        (1, "sub", "অন্য বকদের সাথে মিশে থাকে", C_CREAM, 1300, "left"),
    ],
    "s06": [
        (0, "chip", "খাদ্য", C_SAND, 268, "left"),
        (0, "title", "মাছ, ব্যাঙ, জলজ পোকা", C_CREAM, 340, "left"),
        (1, "title", "পা নেড়ে শিকার তাড়ায়", C_GOLD, 1000, "left"),
        (2, "sub", "জলাশয়ের ছোট প্রাণী নিয়ন্ত্রণে রাখে", C_CREAM, 1120, "left"),
    ],
    "s07": [
        (0, "chip", "বাসা", C_MINT, 268, "left"),
        (0, "title", "মিশ্র কলোনি", C_CREAM, 340, "left"),
        (1, "num", "৩–৫টি ডিম", C_GOLD, 1180, "left"),
        (2, "title", "২১–২৫ দিনে ফোটে", C_CREAM, 1310, "left"),
    ],
    "s08": [
        (0, "chip", "হুমকি", C_CORAL, 268, "left"),
        (0, "title", "জলাভূমি ভরাট, দূষণ", C_CORAL, 340, "left"),
        (1, "title", "কীটনাশকে খাদ্যসংকট", C_CORAL, 1000, "left"),
        (2, "attr", "IUCN: LC · কম ঝুঁকিতে", C_SAND, 1120, "left"),
    ],
    "s09": [
        (0, "chip", "সারা দেশে", C_SAND, 300, "mid"),
        (0, "title", "হাকালুকি, টাঙ্গুয়ার হাওর", C_CREAM, 380, "mid"),
        (1, "title", "সুন্দরবনের খাল", C_GOLD, 1000, "left"),
        (1, "sub", "সন্ধ্যায় বিশ্রামের গাছে ফেরে", C_CREAM, 1120, "left"),
    ],
    "s10": [
        (0, "chip", "শেষ কথা", C_GOLD, 268, "left"),
        (0, "attr", "LC মানে ঝুঁকি নেই না", C_MINT, 350, "left"),
        (0, "quote", "জলাশয় বাঁচলে বক বাঁচবে", C_CREAM, 440, "left"),
        (1, "title", "জলাভূমি ভরাট বন্ধ করুন", C_CREAM, 980, "left"),
        (2, "title", "কীটনাশক কমান", C_GOLD, 1096, "left"),
    ],
}

_INK_PAD = {"chip": 60, "title": 110, "num": 120, "sub": 66, "attr": 54, "quote": 84}


def layout_beats(sid):
    out, prev_bottom = [], 0
    for idx, style, txt, colour, y, align in BEATS.get(sid, []):
        if y < 0:
            y = prev_bottom + 26
        key, px, _a = STYLE.get(style, ("sans-semi", 40, "rise"))
        lay = T.flow(txt, key, px)
        prev_bottom = y + lay.image.height
        out.append((idx, style, txt, colour, int(y), align))
    return out


_PLACE, _PLACED = {}, {}


def _plate(s):
    if s["id"] in _PLACE:
        return _PLACE[s["id"]]
    plates = []
    for p in (0.03, 0.97):
        img = scene_frame(s, p, p * s["dur"])
        img = soft_shade(img, top=0.20, bottom=0.24, head=0.10)
        img = natural_finish(img, vignette=0.16, grain=0.0)
        plates.append(img.resize((W // 4, H // 4), Image.LANCZOS))
    _PLACE[s["id"]] = plates
    return plates


def subject_density(img, box, sat_min=0.22):
    """Fraction of bright, low-saturation pixels (a white egret) in the box."""
    x0, y0, x1, y1 = [int(v / 4) for v in box]
    a = np.asarray(img.crop((x0, y0, x1, y1)), dtype=np.float32) / 255.0
    mx, mn = a.max(axis=2), a.min(axis=2)
    sat = (mx - mn) / np.maximum(mx, 1e-6)
    return float(((sat < sat_min) & (mx > 0.74)).mean())


def clean_score(img, box):
    lum, sat, rgb = V.region_stats(img, *(int(v / 4) for v in box))
    busy = V._edge_energy(img, tuple(int(v / 4) for v in box))
    return lum - 900 * busy


def best_band_both(plates, x0, w, h, lo, hi, step=24, max_density=0.05):
    """Best readable strip that is clear of the bird in *every* plate."""
    best, best_sc = None, -1e9
    x0, w, lo, hi = int(x0 / 4), int(w / 4), int(lo / 4), int(hi / 4)
    h = max(8, int(h / 4))
    step = max(2, step // 4)
    for y in range(int(lo), int(max(lo, hi)) + 1, step):
        dens = max(subject_density(p, (x0, y, x0 + w, y + h)) for p in plates)
        sc = min(clean_score(p, (x0, y, x0 + w, y + h)) for p in plates)
        sc -= 1400 * dens
        if dens > max_density:
            sc -= 700
        if sc > best_sc:
            best, best_sc = y, sc
    return (best or lo) * 4, best_sc


def placed_beats(s):
    hit = _PLACED.get(s["id"])
    if hit is not None:
        return hit
    rows_ = layout_beats(s["id"])
    plates = _plate(s)
    top_rows, low_rows = [], []
    for r in rows_:
        (top_rows if r[0] == 0 else low_rows).append(r)
    if not low_rows:
        _PLACED[s["id"]] = rows_
        return rows_
    rows2 = sorted(low_rows, key=lambda r: (r[0], r[4]))
    wid, hgt = 0, 0
    for _i, style, txt, _c, _y, _al in rows2:
        key, px, _a = STYLE.get(style, ("sans-semi", 40, "rise"))
        lay = T.flow(txt, key, px)
        wid = max(wid, lay.width)
        hgt += lay.image.height + 26 * SCALE
    mid = rows2[0][5] == "mid"
    x0 = (W - wid) / 2 if mid else W * 0.075
    floor = max(980 * SCALE, int(s.get("lowfloor", 0)) * SCALE)
    if top_rows:
        last = max(top_rows, key=lambda r: r[4])
        key0, px0, _ = STYLE.get(last[1], ("sans-semi", 40, "rise"))
        floor = max(floor, last[4] + T.flow(last[2], key0, px0).image.height + 90 * SCALE)
    ceil = int(s.get("lowceil", 1650)) * SCALE
    hi = max(floor, ceil - hgt)
    top, _sc = best_band_both(plates, int(x0), wid, hgt, int(floor), int(hi), step=24)

    out = list(top_rows)
    yy = top
    for i, style, txt, c, _y, al in rows2:
        key, px, _a = STYLE.get(style, ("sans-semi", 40, "rise"))
        lay = T.flow(txt, key, px)
        out.append((i, style, txt, c, int(yy), al))
        yy += lay.image.height + 26 * SCALE
    _PLACED[s["id"]] = out
    return out


def overlay(s, p, img):
    t = p * s["dur"]
    v = t - s["pre"]
    fade_all = 1.0 - K.ss(s["dur"] - 0.34, s["dur"] - 0.02, t)
    segs = s.get("segs") or []
    kind = s["kind"]

    for idx, style, txt, colour, y, align in placed_beats(s):
        if idx >= len(segs):
            continue
        a0, b0 = segs[idx]
        e_in = K.ss(a0 - 0.08, a0 + 0.34, v)
        e_out = 1.0 if idx + 1 >= len(segs) or style in ("chip", "attr") \
            else 1.0 - K.ss(b0 + 0.04, b0 + 0.40, v)
        draw_line(img, style, txt, colour, y, align, e_in * e_out * fade_all)

    if kind == "outro":
        cue = s["cue"]
        e0 = K.ss(max(cue.get("logo", 1.0) + 0.2, 1.4), max(cue.get("logo", 1.0) + 0.2, 1.4) + 1.3, v)
        if e0 > 0:
            K.logo_burst(img, (W * 0.5, 700 * SCALE), min(1.0, e0), size=232 * SCALE,
                         payoff="রূপসী বাংলা",
                         sub="প্রকৃতি · জীববৈচিত্র্য · বাংলাদেশ")
        ec = K.ss(cue.get("cta", 2.0) + 0.4, cue.get("cta", 2.0) + 1.0, v)
        eu = K.ss(cue.get("url", 2.4) + 0.6, cue.get("url", 2.4) + 1.2, v)
        if ec > 0 or eu > 0:
            K.cta_card(img, (70 * SCALE, 1300 * SCALE), ec * fade_all,
                       title="বাংলাদেশের প্রাণী ও উদ্ভিদ সম্পর্কে জানতে",
                       url="ruposhibangla.vercel.app", e_url=eu * fade_all)

    if kind != "outro":
        be = K.ss(0.55, 1.25, t) * fade_all
        if be > 0:
            K.brand_lockup(img, (W - 250 * SCALE, 62 * SCALE), be,
                           size=54 * SCALE, name_px=26 * SCALE)
    return img


# ---------------------------------------------------------------------- audio --
def build_audio(scenes):
    import rbaudio as A
    from timing2 import read as _read
    total = sum(s["dur"] for s in scenes) + 0.6
    n = int(total * A.SR)
    music = np.zeros(n, dtype=np.float32)
    amb = np.zeros(n, dtype=np.float32)
    sfx = np.zeros(n, dtype=np.float32)
    voice = np.zeros(n, dtype=np.float32)

    # a lighter, more open bed than the nilkantha reel: this bird is calm
    chords = [(87.31, [261.63, 329.63, 392.0]), (65.41, [196.0, 261.63, 329.63]),
              (98.0, [246.94, 293.66, 349.23]), (110.0, [220.0, 277.18, 329.63])]
    pos, i = 0.0, 0
    while pos < total:
        root, notes = chords[i % len(chords)]
        d = min(7.0, total - pos)
        music = A.place(music, A.pad_chord([root] + notes, d, 0.09, 1.5, 1.9) * 0.40, pos)
        pos += d
        i += 1
    music = A.lowpass_fast(music, 2600, 1)
    music = A.fade(music, 1.0, 2.4)

    pos = 0.0
    for s in scenes:
        d = s["dur"] + 0.8
        if s["amb"] == "water":
            base = A.water(d) * 0.72
            base = A.place(base, A.creek_drips(d, 12), 0.2, 0.8)
        elif s["amb"] == "forest":
            base = A.forest(d) * 0.58
            base = A.place(base, A.birdsong(d, 7, 2500, 1200), 0.35, 0.9)
        elif s["amb"] == "wind":
            base = A.wind(d, 560) * 0.70
        else:
            base = A.wind(d, 320) * 0.30
        amb = A.place(amb, A.norm(base, 0.5), pos, gain=0.45)
        for fx in s.get("fx", []):
            kind, at_, gain = fx
            t0 = pos + s["pre"] + at_
            if kind == "boom":
                sfx = A.place(sfx, A.sub_boom(), t0, gain)
            elif kind == "whoosh":
                sfx = A.place(sfx, A.whoosh(0.9), t0, gain)
            elif kind == "whoosh_down":
                sfx = A.place(sfx, A.whoosh(1.0, "down"), t0, gain)
            elif kind == "tension":
                sfx = A.place(sfx, A.tension_bed(min(8.5, s["dur"])), t0, gain)
            elif kind == "drip":
                sfx = A.place(sfx, A.creek_drips(1.4, 5), t0, gain)
            elif kind == "chime":
                sfx = A.place(sfx, A.pad_chord([1046.5, 1318.5, 1568.0], 1.6, 0.05, 0.02, 1.4),
                              t0, gain * 0.5)
            elif kind == "tick":
                sfx = A.place(sfx, A.whoosh(0.25), t0, gain * 0.6)
            elif kind == "wing":
                sfx = A.place(sfx, A.whoosh(0.7, "down"), t0, gain)
        v = _read(s["vo"])
        a0 = int((pos + s["pre"]) * A.SR)
        seg = v[: max(0, min(len(v), len(voice) - a0))]
        voice[a0:a0 + len(seg)] += seg
        pos += s["dur"]

    env = np.convolve(np.abs(voice), np.ones(4800) / 4800, mode="same")
    duck = 1.0 - 0.58 * np.clip(env / (np.max(env) + 1e-6) * 3.4, 0, 1)
    mix = (music * 0.55 + amb * 0.75 + sfx * 0.9) * duck * 0.85
    final = np.clip(voice * 1.0 + mix, -1, 1)
    peak = float(np.max(np.abs(final))) or 1.0
    os.makedirs(OUT, exist_ok=True)
    A.write_wav(os.path.join(OUT, "mix_raw.wav"), (final / peak * 0.94).astype(np.float32))
    return total


# ---------------------------------------------------------------------- build --
def _scene_job(job):
    scene, start, fast = job
    init_cams()
    frames = os.path.join(OUT, "frames")
    os.makedirs(frames, exist_ok=True)
    n = int(round(scene["dur"] * FPS))
    for k in range(n):
        p = k / max(1, n - 1)
        img = render_frame(scene, p, (start + k) / FPS)
        if fast:
            img = img.resize((W // 4, H // 4), Image.LANCZOS)
        img.save(os.path.join(frames, f"{start + k:05d}.jpg"), quality=94)
    return scene["id"], start, n


def main(fast=False, workers=None):
    scenes = resolve_cues()
    only = os.environ.get("RB_ONLY")
    if only:
        keep = set(only.split(","))
        scenes = [s for s in scenes if s["id"] in keep]
    init_cams()
    total = build_audio(scenes)
    frames = os.path.join(OUT, "frames")
    os.makedirs(frames, exist_ok=True)
    print("scenes", [(s["id"], round(s["dur"], 2)) for s in scenes],
          "total", round(total, 2), "canvas", W, H, flush=True)

    starts, idx = [], 0
    for s in scenes:
        starts.append(idx)
        idx += int(round(s["dur"] * FPS))
    total_frames = idx

    if workers is None:
        workers = int(os.environ.get("RB_WORKERS", os.cpu_count() or 1))
    workers = max(1, min(workers, len(scenes)))

    if workers == 1:
        for s, st in zip(scenes, starts):
            _scene_job((s, st, fast))
            print(" scene", s["id"], "done", flush=True)
    else:
        import multiprocessing as mp
        with mp.get_context("fork").Pool(workers) as pool:
            for sid, st, n in pool.imap_unordered(
                    _scene_job, [(s, st, fast) for s, st in zip(scenes, starts)]):
                print(" scene", sid, "done", n, "frames from", st, flush=True)
    print("total frames", total_frames)


if __name__ == "__main__":
    main("--fast" in sys.argv)
