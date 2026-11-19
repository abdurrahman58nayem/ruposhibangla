"""Episode 010 — অগ্নিগলা (Firethroat) — 4K vertical reel.

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

OUT = "../render16"
VO = "../vo_grass"
ART = "../art_grass"
FPS = 30
SCALE = 2                      # 2 => 2160x3840 (4K UHD vertical)
W, H = 1080 * SCALE, 1920 * SCALE

# natural palette: everything sits inside the photo's own range
C_CREAM = (255, 252, 245)
C_WHITE = (255, 255, 255)
C_GOLD = (250, 206, 132)
C_MINT = (196, 232, 208)
C_SKY = (186, 214, 232)
C_CORAL = (255, 156, 120)        # flame — the bird's own throat colour
C_SAND = (238, 214, 186)


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


_VIG_D = None


def _vignette(strength):
    global _VIG, _VIG_D
    if _VIG is None:
        _VIG_D = np.sqrt(((_NX - 0.5) * 1.10) ** 2 + ((_NY - 0.5) * 0.92) ** 2)
        _VIG = {}
    key = round(strength, 3)
    if key not in _VIG:
        _VIG[key] = (1 - strength * V.smoothstep(0.34, 0.86, _VIG_D)).astype(np.float32)[:, :, None]
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


def natural_finish(img, vignette=0.16, grain=0.006, lift=0.012, sharp=0.55):
    """Flat exposure match + a *shadows-only* lift + vignette + fine grain.

    The old version matched the frame mean with a gamma curve. Gamma lifts the
    midtones far more than the highlights, so every scene came out milky and
    flat — the "glow" that made the photographs look low quality. A plain gain
    keeps the contrast ratio of the shot: darks stay dark, the whites stay white.

    No saturation, no contrast stretch, no white-balance shift, and the lift is
    confined to the bottom of the curve so it can never grey the whole frame.
    """
    import numpy as _np
    arr = np.asarray(img)
    u8 = _np.arange(256, dtype=_np.float32) / 255.0

    mean = float(arr[::16, ::16].mean()) / 255.0
    gain = float(_np.clip(0.415 / max(mean, 0.02), 0.94, 1.10))
    tbl = _np.clip(u8 * gain, 0, 1)
    if lift:
        sh = _np.clip((0.25 - tbl) / 0.25, 0, 1) ** 2      # fades out by 25% grey
        tbl = _np.clip(tbl + lift * sh, 0, 1)
    lut = [int(round(v)) for v in _np.clip(tbl * 255.0, 0, 255).tolist()]
    # the curve is applied per channel by PIL (C speed) rather than a numpy LUT
    f = _np.asarray(Image.merge("RGB", [ch.point(lut) for ch in img.split()]),
                    dtype=_np.float32)
    if sharp:
        # luma-only unsharp: the art is 768px wide, the reel is 4K, so the edges
        # need their definition back. The blur runs in PIL so it stays fast, and
        # the colour channels are left untouched.
        lum = f @ _np.array([0.299, 0.587, 0.114], dtype=_np.float32)
        blur = _np.asarray(Image.fromarray(_np.clip(lum, 0, 255).astype(_np.uint8), "L")
                           .filter(ImageFilter.GaussianBlur(1.6)), dtype=_np.float32)
        f = _np.clip(f + _np.clip((lum - blur) * sharp, -42, 42)[:, :, None], 0, 255)
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
    "list":  ("sans-semi", 40 * SCALE, "rise"),   # bullet row inside a panel
    "list2": ("sans-semi", 30 * SCALE, "rise"),   # its grey-green sub-line
    "stack": ("serif-bold", 74 * SCALE, "word"),  # "line1|line2" centred, 2 rows
    "label": ("sans-semi", 38 * SCALE, "rise"),   # small caption above a value
    "value": ("serif-bold", 92 * SCALE, "word"),  # the gold number / name
    "pill":  ("sans-semi", 34 * SCALE, "rise"),   # bordered capsule
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
    # a tinted ink (gold / sand) on a *colourful* patch blends into it; only use
    # the colour hint on calm, low-saturation ground, otherwise go cream
    # the tint is only a preference: it must still clear the contrast bar on
    # its own, otherwise cream wins (gold on bright fern was disappearing)
    light, light_c = C_CREAM, _lum(C_CREAM) - lum
    if hint and _lum(hint) > 200:
        hc = _lum(hint) - lum
        if hc >= 96 and hc >= light_c - 14:
            light, light_c = hint, hc
    m = np.array(rgb, dtype=np.float32)
    base = float(_lum(m))
    scale = float(np.clip(lum * 0.30, 12.0, 54.0)) / max(base, 1e-3)
    deep = tuple(int(v) for v in np.clip(m * scale, 0, 255))
    deep_c = lum - _lum(deep)
    if light_c >= 86 and light_c >= deep_c:
        return light, "light"
    if deep_c >= 96:
        return deep, "deep"
    if light_c >= deep_c:
        return light, "light"
    return (18, 20, 22), "flat"


PANEL_RGBA = (9, 13, 15)        # near-black, carries no colour cast
PANEL_A = 176
PANEL_RADIUS = 34 * SCALE
PANEL_PAD = (52 * SCALE, 40 * SCALE)


def glyph_box(lay, x, y):
    """True ink box of a text layer (T.flow pads the mask heavily)."""
    bb = lay.image.getbbox()
    if not bb:
        return None
    return (x + bb[0], y + bb[1], x + bb[2], y + bb[3])


def panel(img, box, e, radius=None, alpha=None, fill=None):
    """A rounded, softly feathered dark plate that hugs the type block.

    This is the reference style: the caption sits on its own small plate so the
    photograph keeps its quality everywhere else in the frame — no full-frame
    scrim, no glow, no gradient wash.
    """
    if e <= 0.004:
        return
    x0, y0, x1, y1 = [int(v) for v in box]
    r = PANEL_RADIUS if radius is None else radius
    a = int((PANEL_A if alpha is None else alpha) * e)
    fill = PANEL_RGBA if fill is None else fill
    # a 26px feather keeps the plate from reading as a hard "box"
    pad = 26 * SCALE
    w, h = (x1 - x0) + pad * 2, (y1 - y0) + pad * 2
    plate = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(plate)
    d.rounded_rectangle([pad // 2, pad // 2, w - pad // 2 - 1, h - pad // 2 - 1],
                        radius=r, fill=fill + (a,))
    plate = plate.filter(ImageFilter.GaussianBlur(14 * SCALE))
    # paste the small plate at its own position — the canvas is far larger
    base = img.convert("RGBA")
    base.alpha_composite(plate, (x0 - pad, y0 - pad))
    img.paste(base.convert("RGB"), (0, 0))


def bullet_row(img, txt, sub, x, y, e, colour, bar=C_GOLD):
    """Reference list row: colour bar, cream title, grey-green sub-line."""
    if e <= 0.004:
        return
    lay = T.flow(txt, "sans-semi", 40 * SCALE)
    sub_lay = T.flow(sub, "sans-semi", 30 * SCALE) if sub else None
    # centred rows are painted on the 1080 canvas and pasted back at 2x, so every
    # measurement here has to be made in 1x space (this was drawing list rows at
    # half size and pushing their plates off-frame)
    if img.width != W:
        x, y = x / SCALE, y / SCALE
        lay = T.flow(txt, "sans-semi", 40)
        sub_lay = T.flow(sub, "sans-semi", 30) if sub else None
    bb = lay.image.getbbox() or (0, 0, lay.width, lay.image.height)
    bh = int(bb[3] - bb[1])
    sc = 1 if img.width == W else 1 / SCALE
    bar_w = int(10 * SCALE * (1 if img.width == W else 1 / SCALE))
    d = ImageDraw.Draw(img, "RGBA")
    d.rounded_rectangle([x, y + bb[1] + 6 * sc, x + bar_w, y + bb[3] - 6 * sc],
                        radius=bar_w // 2, fill=bar + (int(235 * e),))
    T.paint(img, lay.image, (int(x + 34 * sc), int(y)), C_CREAM, e,
            shadow=(0, 3 * SCALE, (0, 0, 0), 0.30))
    if sub_lay is not None:
        T.paint(img, sub_lay.image, (int(x + 34 * sc), int(y + bh + 34 * sc)),
                (176, 206, 190), e, shadow=(0, 2 * SCALE, (0, 0, 0), 0.24))


def draw_twotone(img, head, tail, accent, y, align, e):
    """Reference display line: cream first half, accent second half, one row."""
    if e <= 0.004:
        return
    key, px, _a = STYLE["title"]
    head_lay = T.flow(head + " ", key, px)
    full_lay = T.flow(head + " " + tail, key, px)
    xx = int((W - full_lay.width) / 2) if align == "mid" else int(W * 0.075)
    ink = (255, 252, 245)
    shadow = (0, 3 * SCALE, (0, 0, 0), 0.34)
    T.paint(img, head_lay.image, (xx, y), ink, e, shadow=shadow)
    tail_mask = full_lay.image.crop((head_lay.width, 0, full_lay.image.width,
                                     full_lay.image.height))
    T.paint(img, tail_mask, (xx + head_lay.width, y), accent, e, shadow=shadow)


def _mid_x(lay):
    return int((W - lay.width) / 2)


def stack_box(txt, y):
    """Geometry for a two-row display line: (l1, l2, x, y, h)."""
    key, px, _a = STYLE["stack"]
    l1_txt, _, l2_txt = txt.partition("|")
    l1 = T.flow(l1_txt, key, px)
    l2 = T.flow(l2_txt, key, px) if l2_txt else None
    h1 = l1.image.getbbox()[3] - l1.image.getbbox()[1]
    gap = int(px * 0.06)
    h = h1 + (gap + (l2.image.getbbox()[3] - l2.image.getbbox()[1]) if l2 else 0)
    return l1, l2, _mid_x(l1), y, h


def draw_stack(img, txt, accent, y, e, e1=None, e2=None):
    """Animated two-row hero line.

    Row one reveals word by word; row two follows. To animate at the right size
    the reveal runs on the 1080 canvas (kinetic's own width) and the result is
    pasted back at 2x — drawing it directly on 4K made it twice too big and the
    right half fell off the frame.
    """
    if e <= 0.004:
        return
    e1 = e if e1 is None else min(e, e1)
    e2 = e if e2 is None else min(e, e2)
    key, px, _a = STYLE["stack"]
    l1_txt, _, l2_txt = txt.partition("|")
    small = img.resize((W // SCALE, H // SCALE), Image.LANCZOS)
    shadow = (0, 2, (0, 0, 0), 0.42)
    y1 = y // SCALE
    K.word_line(small, l1_txt, key, px // SCALE, (0, y1 + T.baseline_offset(T.flow(l1_txt, key, px)) // SCALE),
                C_CREAM, e1, stagger=0.12, dur=0.30, rise=22, center_x=True, x0=0,
                shadow=shadow)
    if l2_txt:
        gap = px // 6
        dy = (T.flow(l1_txt, key, px).image.getbbox()[3]
              - T.flow(l1_txt, key, px).image.getbbox()[1]) // SCALE + gap // SCALE
        K.word_line(small, l2_txt, key, px // SCALE, (0, y1 + dy + T.baseline_offset(T.flow(l2_txt, key, px)) // SCALE),
                    accent, e2, stagger=0.12, dur=0.30, rise=22, center_x=True, x0=0,
                    shadow=shadow)
    img.paste(small.resize((W, H), Image.LANCZOS), (0, 0))


def draw_stack_static(img, txt, accent, y, e):
    """Reference hero type: first row cream, second row accent, both centred."""
    if e <= 0.004:
        return
    l1, l2, x1, _y, h = stack_box(txt, y)
    shadow = (0, 4 * SCALE, (0, 0, 0), 0.42)
    bb1 = l1.image.getbbox()
    T.paint(img, l1.image, (x1, y), C_CREAM, e, shadow=shadow)
    if l2 is not None:
        h1 = bb1[3] - bb1[1]
        T.paint(img, l2.image, (_mid_x(l2), y + h1 + int(STYLE["stack"][1] * 0.06)),
                accent, e, shadow=shadow)


def draw_label_value(img, label, value, accent, y, e):
    """Small cream caption above a big accent value — both centred."""
    if e <= 0.004:
        return
    k_l, px_l, _ = STYLE["label"]
    k_v, px_v, _ = STYLE["value"]
    ll = T.flow(label, k_l, px_l)
    vl = T.flow(value, k_v, px_v)
    T.paint(img, ll.image, (_mid_x(ll), y), C_CREAM, e,
            shadow=(0, 3 * SCALE, (0, 0, 0), 0.34))
    hb = ll.image.getbbox()
    T.paint(img, vl.image, (_mid_x(vl), y + hb[3] - hb[1] + 12 * SCALE), accent, e,
            shadow=(0, 4 * SCALE, (0, 0, 0), 0.42))


PILLS = [C_GOLD, C_MINT, C_SKY, C_CORAL]


def draw_pills(img, txt, y, e, x_left=None):
    """A centred row of bordered capsules, e.g. পুকুর · নদীর চর · খাল · বিল."""
    if e <= 0.004:
        return
    items = [t.strip() for t in txt.split("|") if t.strip()]
    key, px, _a = STYLE["pill"]
    lays = [T.flow(t, key, px) for t in items]
    padx, gap_y = 30 * SCALE, 22 * SCALE
    wid = [lay.width + padx for lay in lays]
    total = sum(wid) + gap_y * (len(lays) - 1)
    x = int((W - total) / 2) if x_left is None else x_left
    for i, (lay, wi) in enumerate(zip(lays, wid)):
        h = lay.image.getbbox()[3] - lay.image.getbbox()[1] + 26 * SCALE
        col = PILLS[i % len(PILLS)]
        box = Image.new("RGBA", (int(wi), int(h)), (0, 0, 0, 0))
        d = ImageDraw.Draw(box)
        d.rounded_rectangle([0, 0, wi - 1, h - 1], radius=int(h // 2),
                            fill=(8, 14, 14, int(150 * e)),
                            outline=col + (int(210 * e),), width=3 * SCALE)
        base = img.crop((int(x), int(y), int(x + wi), int(y + h))).convert("RGBA")
        if base.size == box.size:
            box = Image.alpha_composite(base, box)
        img.paste(box.convert("RGB"), (int(x), int(y)))
        T.paint(img, lay.image, (int(x + padx / 2), int(y + 13 * SCALE)), col, e)
        x += wi + gap_y


def _group_rows(rows):
    out = []
    for r in rows:
        if out and out[-1][0][0] == r[0]:
            out[-1].append(r)
        else:
            out.append([r])
    return out


def _animated_row(small, style, txt, colour, y_s, e, shadow):
    """One centred line, revealed word-by-word, drawn on the 1080 canvas."""
    key, px, anim = STYLE[style]
    px_s = px // SCALE
    lay = T.flow(txt, key, px_s)
    x = int((W // SCALE - lay.width) / 2)
    if anim == "word":
        K.word_line(small, txt, key, px_s, (0, y_s + T.baseline_offset(lay)),
                    C_CREAM, min(1.0, e * 1.4), stagger=0.12, dur=0.30, rise=18,
                    center_x=True, x0=0, shadow=(0, 2, (0, 0, 0), 0.34))
    else:
        yy = y_s + 12 * (1 - K.eo(min(1.0, e * 1.5)))
        T.paint(small, lay.image, (x, int(yy)), C_CREAM, min(1.0, e * 1.5),
                shadow=(0, 2, (0, 0, 0), 0.34))
    return small


def draw_line(img, style, txt, colour, y, align, e, x0=None, plated=False):
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
    if style == "list":                       # txt may carry "head|sub"
        head, _, sub = txt.partition("|")
        bullet_row(img, head, sub, x0 + 8 * SCALE, y, e, colour)
        return

    ink, kind = pick_ink(img, (xx - 8, y - 8, xx + lay.width + 8,
                               y + lay.image.height + 12), hint=colour)
    if plated:
        ink, kind = ((255, 252, 245), "light")
    if kind == "light" and not plated:
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
    elif kind != "light":
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
    else:
        shadow = (0, 3 * SCALE, (0, 0, 0), 0.34)
        glow = None

    if center:
        # Centred rows animate on the 1080 canvas and are pasted back at 2x: that
        # keeps the type scale right AND keeps the word-by-word reveal (drawing
        # the same mask directly on 4K made it twice as wide as the frame).
        small = img.resize((W // SCALE, H // SCALE), Image.LANCZOS)
        y_s = y // SCALE
        if style != "chip":
            small = _animated_row(small, style, txt, colour, y_s, e, shadow)
            img.paste(small.resize((W, H), Image.LANCZOS), (0, 0))
            return
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
    dict(id="s01", art="g01_hook.png", amb="field", pre=0.55, post=0.85, kind="hook",
         lowfloor=1150, fx=[("wing", 0.18, 0.40), ("tick", 0.66, 0.30)],
         cues={"song": 0.0, "name": 0.52}),
    dict(id="s02", art="g02_portrait.png", amb="still", pre=0.45, post=0.75, kind="portrait",
         fx=[("whoosh", 0.05, 0.28), ("chime", 0.35, 0.24)],
         cues={"name": 0.0, "en": 0.30, "sci": 0.56}),
    dict(id="s03", art="g03_detail.png", amb="still", pre=0.45, post=0.75, kind="detail",
         lowfloor=1120, fx=[("tick", 0.15, 0.26), ("chime", 0.55, 0.24)],
         cues={"bill": 0.0, "call": 0.58}),
    dict(id="s04", art="g04_size.png", amb="field", pre=0.45, post=0.75, kind="nation",
         lowfloor=1150, fx=[("tick", 0.10, 0.30), ("boom", 0.45, 0.30)],
         cues={"size": 0.0}),
    dict(id="s05", art="g05_bangladesh.png", amb="field", pre=0.45, post=0.75, kind="home",
         lowceil=1320, fx=[("whoosh", 0.12, 0.28), ("boom", 0.55, 0.28)],
         cues={"winter": 0.0, "places": 0.48}),
    dict(id="s06", art="g06_behaviour.png", amb="field", pre=0.45, post=0.75, kind="cycle",
         lowfloor=1230, fx=[("whoosh_down", 0.20, 0.30), ("tick", 0.60, 0.24)],
         cues={"hide": 0.0, "sing": 0.42, "shy": 0.74}),
    dict(id="s07", art="g07_cycle.png", amb="wind", pre=0.45, post=0.80, kind="role",
         lowfloor=1180, fx=[("chime", 0.12, 0.24), ("whoosh", 0.50, 0.26)],
         cues={"breed": 0.0, "nest": 0.52}),
    dict(id="s08", art="g08_role.png", amb="field", pre=0.45, post=0.80, kind="use",
         lowfloor=1180, fx=[("chime", 0.12, 0.26), ("tick", 0.55, 0.24)],
         cues={"diet": 0.0, "guard": 0.58}),
    dict(id="s09", art="g09_threat.png", amb="wind", pre=0.45, post=0.80, kind="threats",
         lowfloor=1180, fx=[("tension", 0.10, 0.32), ("boom", 0.50, 0.30)],
         cues={"threat": 0.0, "iucn": 0.62}),
    dict(id="s10", art="g10_outro.png", amb="still", pre=0.55, post=2.40, kind="outro",
         lowceil=1180, fx=[("chime", 0.20, 0.26), ("boom", 0.55, 0.28), ("whoosh", 0.85, 0.24)],
         cues={"last": 0.0, "keep": 0.34, "logo": 0.56, "cta": 0.74, "url": 0.86}),
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
        (0, "chip", "ঘাসের ডগা", C_SKY, 430, "mid"),
        (0, "stack", "আঁশঠুঁটি|ঘাসপাখি", C_GOLD, 560, "mid"),
        (1, "stack", "ডাক শুনেই|খুঁজে পেতে হয়", C_GOLD, 2020, "mid"),
        (2, "sub", "কর্কশ ঘর্ঘর, তারপর নীরবতা", C_CREAM, -1, "mid"),
    ],
    "s02": [
        (0, "chip", "পরিচয়", C_MINT, 430, "mid"),
        (0, "stack", "আঁশঠুঁটি|ঘাসপাখি", C_GOLD, 560, "mid"),
        (1, "attr", "ইংরেজিতে Bristled Grassbird", C_MINT, 2000, "mid"),
        (2, "attr", "Schoenicola striatus", C_MINT, -1, "mid"),
    ],
    "s03": [
        (0, "chip", "শনাক্তকরণ", C_SAND, 250, "mid"),
        (0, "stack", "লম্বা-মোটা|ঠোঁট", C_GOLD, 330, "mid"),
        (1, "stack", "ঘাড়ে|টানা আঁশ-পালক", C_GOLD, 2000, "mid"),
        (2, "sub", "পিঠে বাদামি ডোরা", C_CREAM, -1, "mid"),
    ],
    "s04": [
        (0, "chip", "আকার", C_SKY, 400, "mid"),
        (0, "label", "দৈর্ঘ্য মাত্র", C_CREAM, 545, "mid"),
        (0, "value", "১৮–২০ সেন্টিমিটার", C_GOLD, -1, "mid"),
        (1, "list", "অর্ধেকটাই লেজ|লম্বা, ধাপে ধাপে", C_GOLD, 2020, "left"),
        (1, "list", "ঘাসেই লুকিয়ে|খাড়া ডগায় বসে", C_GOLD, -1, "left"),
    ],
    "s05": [
        (0, "chip", "বাংলাদেশে", C_MINT, 430, "mid"),
        (0, "stack", "শীতে|দুর্লভ অতিথি", C_GOLD, 560, "mid"),
        (1, "pills", "হাওর|চর|খাগড়ার ঝোপ", C_GOLD, 2020, "mid"),
        (2, "pills", "পদ্মা|যমুনা|মধুপুর", C_GOLD, 2300, "mid"),
    ],
    "s06": [
        (0, "chip", "আচরণ", C_SAND, 430, "mid"),
        (0, "stack", "ঘাসে লুকিয়ে|হাঁটে", C_GOLD, 560, "mid"),
        (1, "stack", "ডাকতে ডাকতে|ডগায় ওঠে", C_GOLD, 2020, "mid"),
        (2, "sub", "মানুষ দেখলে মিলিয়ে যায়", C_CREAM, -1, "mid"),
    ],
    "s07": [
        (0, "chip", "প্রজনন", C_MINT, 400, "mid"),
        (0, "label", "মৌসুম", C_CREAM, 545, "mid"),
        (0, "value", "মে–সেপ্টেম্বর", C_GOLD, -1, "mid"),
        (1, "list", "ঘাস বুনে বাসা|জীবন্ত ঘাসের ডগায়", C_GOLD, 2020, "left"),
        (2, "sub", "২–৩টি ডিম, বর্ষার ভেতর", C_CREAM, -1, "mid"),
    ],
    "s08": [
        (0, "chip", "প্রকৃতিতে ভূমিকা", C_MINT, 250, "mid"),
        (0, "stack", "পোকা আর|বীজ খায়", C_GOLD, 330, "mid"),
        (1, "list", "ঘাসফড়িং|ঠোঁটে ধরে", C_GOLD, 2020, "left"),
        (1, "list", "তৃণভূমির রক্ষী|ছোট পতঙ্গ নিয়ন্ত্রণে", C_GOLD, -1, "left"),
    ],
    "s09": [
        (0, "chip", "হুমকি", C_CORAL, 430, "mid"),
        (0, "stack", "তৃণভূমি|কমছে", C_CORAL, 560, "mid"),
        (1, "stack", "চরে চলছে|বালু উত্তোলন", C_CORAL, 2020, "mid"),
        (2, "attr", "IUCN: NT · প্রায়-বিপন্ন", C_SAND, -1, "mid"),
    ],
    "s10": [
        (0, "chip", "শেষ কথা", C_GOLD, 430, "mid"),
        (0, "stack", "ঘাস বাঁচলে|ঘাসপাখিও বাঁচবে", C_GOLD, 560, "mid"),
        (1, "stack", "তৃণভূমি|বাঁচান", C_GOLD, 1980, "mid"),
        (2, "stack", "বালু উত্তোলন|বন্ধ করুন", C_GOLD, -1, "mid"),
    ],
}

_INK_PAD = {"chip": 60, "title": 110, "num": 120, "sub": 66, "attr": 54, "quote": 84}


CHIP_PADY = 16          # K.chip's inner padding, in full-res px
GAP_TEXT = 26 * SCALE   # ordinary line spacing between two type rows
GAP_CHIP = 46 * SCALE   # a chip already carries its own padding box


def layout_beats(sid):
    """Lay the rows out so two pieces of type can never touch.

    The chip is drawn inside a rounded box that is taller than its glyphs, so a
    title starting a fixed 72px below the chip's *y* lands inside that box. Every
    row is therefore pushed below the true bottom of the previous one (box
    included) whenever it would otherwise come closer than the gap. Big jumps
    down the frame — the lower caption block — are left exactly where they were.
    """
    out, prev_bottom, prev_style = [], 0, None
    for idx, style, txt, colour, y, align in BEATS.get(sid, []):
        key, px, _a = STYLE.get(style, ("sans-semi", 40, "rise"))
        lay = T.flow(txt, key, px)
        box_h = lay.image.height + (2 * CHIP_PADY if prev_style == "chip" else 0)
        if style == "list" and "|" in txt:
            # a bullet row is head + sub-line; the next row must clear both,
            # otherwise the second row sits on the first one's caption
            sub_lay = T.flow(txt.split("|", 1)[1], "sans-semi", 30 * SCALE)
            box_h += sub_lay.image.height + 40 * SCALE
        gap = GAP_CHIP if prev_style == "chip" else GAP_TEXT
        if y < 0:
            y = prev_bottom + gap
        elif prev_style is not None and y - prev_bottom < gap and y > prev_bottom - 460:
            y = prev_bottom + gap
        prev_bottom = y + box_h
        prev_style = style
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
    # white type needs a DARK, calm patch. Bright bands used to score high here,
    # which put captions straight onto sunlit foliage where they vanished.
    return (255 - lum) * 1.35 - 520 * busy


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
        lay = T.flow(txt.replace("|", " "), key, px)
        wid = max(wid, lay.width)
        hgt += lay.image.height + 26 * SCALE
        if style == "list" and "|" in txt:
            hgt += T.flow(txt.split("|", 1)[1], "sans-semi", 30 * SCALE).image.height + 40 * SCALE
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
        lay = T.flow(txt.replace("|", " "), key, px)
        out.append((i, style, txt, c, int(yy), al))
        yy += lay.image.height + 26 * SCALE
        if style == "list" and "|" in txt:
            yy += T.flow(txt.split("|", 1)[1], "sans-semi", 30 * SCALE).image.height + 40 * SCALE
    _PLACED[s["id"]] = out
    return out

def _row_geom(style, txt, y, align):
    """Box and draw closure for one row — geometry measured on the real layout."""
    if style == "stack":
        l1, l2, x1, yy, h = stack_box(txt, y)
        bb1 = l1.image.getbbox()
        xa, xb = x1 + bb1[0], x1 + bb1[2]
        if l2 is not None:
            bb2 = l2.image.getbbox()
            x2 = _mid_x(l2)
            xa, xb = min(xa, x2 + bb2[0]), max(xb, x2 + bb2[2])
        box = (xa, yy + bb1[1], xb, yy + bb1[1] + h)
        # no plate behind hero type — the reference keeps it on the photograph
        return box, (lambda im, e: draw_stack(im, txt, C_GOLD, y, e)), False

    if style == "label":                              # "label|value", one unit
        lab, _, val = txt.partition("|")
        k_l, px_l, _ = STYLE["label"]
        k_v, px_v, _ = STYLE["value"]
        ll = T.flow(lab, k_l, px_l)
        vl = T.flow(val, k_v, px_v)
        hb = ll.image.getbbox()
        h1 = hb[3] - hb[1]
        box = (_mid_x(vl) + vl.image.getbbox()[0], y + hb[1],
               _mid_x(vl) + vl.image.getbbox()[2], y + h1 + 12 * SCALE + vl.image.height)

        def _draw(im, e, lab=lab, val=val, y=y):
            small = im.resize((W // SCALE, H // SCALE), Image.LANCZOS)
            l1 = T.flow(lab, k_l, px_l // SCALE)
            v1 = T.flow(val, k_v, px_v // SCALE)
            hh = l1.image.getbbox()[3] - l1.image.getbbox()[1]
            T.paint(small, l1.image, (_mid_x(l1) // SCALE, y // SCALE), C_CREAM, e,
                    shadow=(0, 2, (0, 0, 0), 0.34))
            T.paint(small, v1.image, (_mid_x(v1) // SCALE, (y + hh + 6 * SCALE) // SCALE),
                    C_GOLD, e, shadow=(0, 3, (0, 0, 0), 0.42))
            im.paste(small.resize((W, H), Image.LANCZOS), (0, 0))
        return box, _draw, True

    if style == "value":
        return None, None, False

    if style == "pills":
        key, px, _a = STYLE["pill"]
        items = [t.strip() for t in txt.split("|") if t.strip()]
        lays = [T.flow(t, key, px) for t in items]
        pad, gap = 30 * SCALE, 22 * SCALE
        wid = [lay.width + pad for lay in lays]
        total = sum(wid) + gap * (len(lays) - 1)
        x = int((W - total) / 2)
        h = max(lay.image.getbbox()[3] - lay.image.getbbox()[1] for lay in lays) + 26 * SCALE
        return (x, y, x + total, y + h), \
            (lambda im, e: draw_pills(im, txt, y, e)), False

    if style == "chip":
        return None, None, False                      # K.chip draws its own pill

    key, px, _a = STYLE.get(style, ("sans-semi", 40, "rise"))
    lay = T.flow(txt.replace("|", " "), key, px)
    bb = lay.image.getbbox()
    if not bb:
        return None, None, False
    if align == "mid":                                # centred: drawn at 2x on the 4K canvas
        x = int((W - lay.width) / 2)
        box = (x + bb[0], y + bb[1], x + bb[2], y + bb[3])
        return box, (lambda im, e: draw_line(im, style, txt, C_CREAM, y, align, e,
                                             plated=True)), True
    x = int(W * 0.075)
    return (x + bb[0], y + bb[1], x + bb[2], y + bb[3]), \
        (lambda im, e: draw_line(im, style, txt, C_CREAM, y, align, e, plated=True)), True


def overlay(s, p, img):
    t = p * s["dur"]
    v = t - s["pre"]
    fade_all = 1.0 - K.ss(s["dur"] - 0.34, s["dur"] - 0.02, t)
    segs = s.get("segs") or []
    kind = s["kind"]

    # Rows sharing a beat index form one group: one soft plate behind the group,
    # and the plate is measured from the *real* glyph boxes so it always wraps
    # the whole line — a shorter measure used to clip half a two-tone title.
    for grp in _group_rows(placed_beats(s)):
        idx0 = grp[0][0]
        if idx0 >= len(segs):
            idx0 = len(segs) - 1
        a0, b0 = segs[idx0]
        e_in = K.ss(a0 - 0.08, a0 + 0.34, v)
        e_out = 1.0 if idx0 + 1 >= len(segs) or any(
            r[1] in ("chip", "attr") for r in grp) \
            else 1.0 - K.ss(b0 + 0.04, b0 + 0.40, v)
        e = e_in * e_out * fade_all

        # a label row is always paired with the value row under it: merge them so
        # they share one plate and one reveal (the pair used to draw nothing at all)
        merged = []
        for r in grp:
            if r[1] == "label":
                val = next((x[2] for x in grp if x[1] == "value"), "")
                merged.append((r[0], "label", r[2] + "|" + val, r[3], r[4], r[5]))
            elif r[1] == "value":
                continue
            else:
                merged.append(r)
        grp = merged

        geom, plates = [], False
        for _i, style, txt, colour, y, align in grp:
            box, fn, wants_plate = _row_geom(style, txt, y, align)
            if box:
                geom.append(box)
            if fn:
                plates = plates or wants_plate
            grp_draw = getattr(overlay, "_pending", [])
            grp_draw.append((fn, style, txt, colour, y, align))
            overlay._pending = grp_draw
        draws = overlay._pending
        overlay._pending = []

        # a label + value pair is one unit: it gets the plate too
        if geom and (plates or any(g[1] == "label" for g in draws)):
            pbox = (min(b[0] for b in geom) - 62 * SCALE, min(b[1] for b in geom) - 34 * SCALE,
                    max(b[2] for b in geom) + 62 * SCALE, max(b[3] for b in geom) + 30 * SCALE)
            panel(img, pbox, e)

        for fn, style, txt, colour, y, align in draws:
            if fn:
                fn(img, e)

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
        elif s["amb"] == "field":
            base = A.wind(d, 780) * 0.52
            base = A.place(base, A.birdsong(d, 5, 3200, 2400), 0.4, 0.55)
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
