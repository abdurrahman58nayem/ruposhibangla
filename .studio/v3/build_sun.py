"""Episode 014 — আগুনলেজ মৌটুসি (Fire-tailed Sunbird) — 4K vertical reel.

Rules: রূপসী.md → .studio/TEXT-STYLE.md. The type system is copied *unchanged*
from build_grass.py (the verified standard); only SCENES / BEATS / art change.

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

OUT = "../render19"
VO = "../vo_sun"
ART = "../art_sun"
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
SUB_INK = (150, 178, 168)        # list sub-lines in the reference


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
    "chip":  ("sans-semi", 38 * SCALE, "chip"),
    "title": ("serif-bold", 78 * SCALE, "word"),
    "num":   ("serif-bold", 84 * SCALE, "word"),
    "sub":   ("sans-semi", 44 * SCALE, "rise"),
    "attr":  ("sans-semi", 32 * SCALE, "rise"),
    "quote": ("serif-bold", 54 * SCALE, "word"),
    "list":  ("sans-semi", 46 * SCALE, "rise"),   # bullet row inside a panel
    "list2": ("sans-semi", 34 * SCALE, "rise"),   # its grey-green sub-line
    "stack": ("serif-bold", 88 * SCALE, "word"),  # "line1|line2" centred, 2 rows
    "label": ("sans-semi", 40 * SCALE, "rise"),   # small caption above a value
    "value": ("serif-bold", 112 * SCALE, "word"),  # the gold number / name
    "pill":  ("sans-semi", 40 * SCALE, "rise"),   # bordered capsule
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


# measured from ref-13/ref-14/ref-15: a dark neutral-green panel, not pure black
PANEL_FILL = (17, 23, 21)
PANEL_A = 224                    # 88% — the photo still breathes through it
PANEL_RADIUS = 26 * SCALE        # ~3.5% of the frame width
PANEL_PAD = (52 * SCALE, 40 * SCALE)


def glyph_box(lay, x, y):
    """True ink box of a text layer (T.flow pads the mask heavily)."""
    bb = lay.image.getbbox()
    if not bb:
        return None
    return (x + bb[0], y + bb[1], x + bb[2], y + bb[3])


GLASS_BLUR = 22 * SCALE     # how much the photo behind the type is softened
GLASS_TINT = (8, 14, 14)    # near-neutral, cool — never a black slab
GLASS_A = 132               # ~52%: a light frost — the photo stays clearly visible
GLASS_DIM = 1.04            # a hair brighter, so the glass reads as light not soot


def panel(img, box, e, radius=None, alpha=None, fill=None, tint=True):
    """FROSTED GLASS behind the type — the photo stays visible, never buried.

    The user's rule: a dark plate under the type hides the bird and the
    picture. So the plate is *glass*: the region under it is blurred (so the
    letters still read), then a translucent tint is laid over it. A crisp
    hairline edge and a soft inner highlight at the top sell it as glass
    rather than a shadow. Nothing is blacked out.
    """
    if e <= 0.004:
        return
    x0, y0, x1, y1 = [int(v) for v in box]
    r = int(PANEL_RADIUS) if radius is None else int(radius)
    w, h = max(4, x1 - x0), max(4, y1 - y0)
    x0c, y0c = max(0, x0), max(0, y0)
    x1c, y1c = min(img.width, x1), min(img.height, y1)
    if x1c - x0c < 4 or y1c - y0c < 4:
        return

    # 1. the glass itself: a blurred copy of exactly what is underneath
    under = img.crop((x0c, y0c, x1c, y1c)).filter(
        ImageFilter.GaussianBlur(GLASS_BLUR * max(0.35, min(1.0, e))))
    if GLASS_DIM < 1.0:
        under = Image.eval(under, lambda v: int(v * GLASS_DIM))

    layer = Image.new("RGBA", (x1c - x0c, y1c - y0c), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    a = int((GLASS_A if alpha is None else alpha) * e)
    colour = GLASS_TINT if fill is None else fill
    d.rounded_rectangle([0, 0, layer.width - 1, layer.height - 1],
                        radius=r, fill=colour + (a,))
    # a soft top highlight + hairline border: the two cues that read as "glass"
    if tint:
        hl = Image.new("RGBA", layer.size, (0, 0, 0, 0))
        dh = ImageDraw.Draw(hl)
        dh.rounded_rectangle([2, 2, layer.width - 3, int(layer.height * 0.42)],
                             radius=r, fill=(255, 255, 255, int(16 * e)))
        hl = hl.filter(ImageFilter.GaussianBlur(GLASS_BLUR))
        layer = Image.alpha_composite(layer, hl)
        d2 = ImageDraw.Draw(layer)
        d2.rounded_rectangle([0, 0, layer.width - 1, layer.height - 1],
                             radius=r, outline=(255, 255, 255, int(30 * e)),
                             width=max(1, SCALE))
    plate = Image.alpha_composite(under.convert("RGBA"), layer)
    # feather only the outermost 1.6px so the edge stays crisp
    mask = Image.new("L", plate.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, plate.width - 1, plate.height - 1],
                                           radius=r, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(1.6 * SCALE))
    mask = Image.eval(mask, lambda v: int(v * min(1.0, e)))
    img.paste(plate.convert("RGB"), (x0c, y0c), mask)


def ink_on_glass(colour):
    """Which ink sits on the glass. Kept for the colour-graded fallback."""
    return colour


SUB_GAP = 30 * SCALE        # head → sub-line gap in a bullet row


def bullet_row(img, txt, sub, x, y, e, colour, bar=None):
    """Reference list row: colour bar, cream title, grey-green sub-line."""
    if e <= 0.004:
        return
    lay = T.flow(txt, "sans-semi", fit_px("sans-semi", txt, 46 * SCALE, MAXW - 90 * SCALE))
    sub_lay = T.flow(sub, "sans-semi",
                     fit_px("sans-semi", sub, 34 * SCALE, MAXW - 90 * SCALE)) if sub else None
    # centred rows are painted on the 1080 canvas and pasted back at 2x, so every
    # measurement here has to be made in 1x space (this was drawing list rows at
    # half size and pushing their plates off-frame)
    if img.width != W:
        x, y = x / SCALE, y / SCALE
        lay = T.flow(txt, "sans-semi", fit_px("sans-semi", txt, 46, MAXW // SCALE - 45))
        sub_lay = T.flow(sub, "sans-semi",
                         fit_px("sans-semi", sub, 34, MAXW // SCALE - 45)) if sub else None
    bb = lay.image.getbbox() or (0, 0, lay.width, lay.image.height)
    bh = int(bb[3] - bb[1])
    sc = 1 if img.width == W else 1 / SCALE
    bar_w = int(10 * SCALE * (1 if img.width == W else 1 / SCALE))
    # the colour bar draws itself down first, then the head, then the sub-line
    bar = colour if bar is None else bar
    e_bar = min(1.0, e * 2.2)
    e_head = _stag(e, 1, 3, 0.40)
    e_sub = _stag(e, 2, 3, 0.40)
    d = ImageDraw.Draw(img, "RGBA")
    bar_top = y + bb[1] + 6 * sc
    bar_bot = bar_top + (bb[3] - bb[1] - 12 * sc) * K.eo(e_bar)
    if bar_bot > bar_top + 2:
        d.rounded_rectangle([x, bar_top, x + bar_w, bar_bot],
                            radius=bar_w // 2, fill=bar + (int(235 * e_bar),))
    if e_head > 0.004:
        # the head takes the row's own colour (white / mint / sky / gold), which
        # is what gives the reference its colour variation row to row
        T.paint(img, lay.image, (int(x + 34 * sc), int(y)), colour, e_head,
                shadow=(0, 3 * SCALE, (0, 0, 0), 0.30))
    if sub_lay is not None and e_sub > 0.004:
        # the sub sits under the head's REAL ink height; row_bottom() uses the
        # same expression so the panel can never clip it
        sub_y = y + bb[1] + bh + SUB_GAP * sc
        T.paint(img, sub_lay.image, (int(x + 34 * sc), int(sub_y)),
                SUB_INK, e_sub, shadow=(0, 2 * SCALE, (0, 0, 0), 0.24))


def draw_list_plated(img, head, sub, colour, y, e, x0, centre):
    """A list row on a crisp plate: colour bar, coloured head, grey-green sub.

    On a plate there is no photograph behind the letters, so the pale-halo path
    must not run — it burned the sub-line out to near-white. Geometry is the
    same as ``bullet_row`` so ``row_bottom`` still measures it exactly.
    """
    if e <= 0.004:
        return
    x = MINX if x0 is None else x0
    lay = T.flow(head, "sans-semi", fit_px("sans-semi", head, 46 * SCALE, MAXW - 90 * SCALE))
    sub_lay = (T.flow(sub, "sans-semi",
                      fit_px("sans-semi", sub, 34 * SCALE, MAXW - 90 * SCALE))
               if sub else None)
    bb = lay.image.getbbox() or (0, 0, lay.width, lay.image.height)
    bh = bb[3] - bb[1]
    bar_w = 10 * SCALE
    e_bar = min(1.0, e * 2.2)
    e_head = _stag(e, 1, 3, 0.40)
    e_sub = _stag(e, 2, 3, 0.40)
    d = ImageDraw.Draw(img, "RGBA")
    bar_top = y + bb[1] + 6 * SCALE
    bar_bot = bar_top + (bb[3] - bb[1] - 12 * SCALE) * K.eo(e_bar)
    if bar_bot > bar_top + 2:
        d.rounded_rectangle([x, bar_top, x + bar_w, bar_bot],
                            radius=bar_w // 2, fill=colour + (int(235 * e_bar),))
    if e_head > 0.004:
        T.paint(img, lay.image, (int(x + 34 * SCALE), int(y)), colour, e_head,
                shadow=(0, 3 * SCALE, (0, 0, 0), 0.30))
    if sub_lay is not None and e_sub > 0.004:
        sub_y = y + bb[1] + bh + SUB_GAP
        T.paint(img, sub_lay.image, (int(x + 34 * SCALE), int(sub_y)),
                SUB_INK, e_sub, shadow=(0, 2 * SCALE, (0, 0, 0), 0.24))


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


def _patch_bright(canvas, box, thr=150, busy_thr=0.11):
    """A panel is needed when the ground is bright OR busy behind the type.

    The reference does exactly this: paler type gets a panel on dry grass, on a
    mud bank, on pond water — all the mid-tone, high-detail grounds — and goes
    straight onto the picture only where the frame is genuinely dark and calm.
    """
    x0, y0, x1, y1 = [int(v) for v in box]
    x0, y0 = max(0, x0), max(0, y0)
    x1, y1 = min(canvas.width, x1), min(canvas.height, y1)
    if x1 - x0 < 8 or y1 - y0 < 8:
        return False
    a = np.asarray(canvas.crop((x0, y0, x1, y1)), dtype=np.float32)
    lum = a @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    if float(np.percentile(lum, 88)) >= thr:
        return True
    # edge energy over the same patch (a reed bed is "busy" even when it is dim)
    g = lum[1:, :] - lum[:-1, :]
    return float(np.abs(g).mean()) / 255.0 >= busy_thr


MAXW = int(W * 0.845)      # safe type width (ref-7's panel is 84% of the frame)
MINX = int(W * 0.075)      # safe left edge — same gutter the chips sit on


def fit_px(key, txt, px, maxw=None):
    """Shrink a type size until the line fits the frame.

    Bengali line widths are not predictable from a character count, so the size
    is measured and stepped down; this is what stops a long value like
    '১৮–২০ সেন্টিমিটার' from running off the right edge.
    """
    maxw = MAXW if maxw is None else maxw
    px = float(px)
    while px > 12:
        if T.flow(txt, key, int(px)).width <= maxw:
            break
        px *= 0.955
    return int(px)


def stack_px(txt):
    """One size for both title rows, set by the wider of the two."""
    key, px, _a = STYLE["stack"]
    l1, _sep, l2 = txt.partition("|")
    worst = max((l1, l2), key=lambda t: T.flow(t, key, px).width)
    return fit_px(key, worst, px)


def _stag(e, i, n, total=0.34):
    """Reveal progress for item i of n — the rows come in one after another.

    This is the machranga grammar: nothing appears as a finished card, each
    element lands on its own beat (chip, row 1, row 2 ...).
    """
    if n <= 1:
        return e
    step = total / (n - 1)
    q = (e - step * i) / (1.0 - step * (n - 1))
    return max(0.0, min(1.0, q))


def _mid_x(lay):
    return int((W - lay.width) / 2)


def stack_box(txt, y):
    """Geometry for a two-row display line: (l1, l2, x, y, h)."""
    key, _px0, _a = STYLE["stack"]
    px = stack_px(txt)
    l1_txt, _, l2_txt = txt.partition("|")
    l1 = T.flow(l1_txt, key, px)
    l2 = T.flow(l2_txt, key, px) if l2_txt else None
    h1 = l1.image.getbbox()[3] - l1.image.getbbox()[1]
    gap = int(px * 0.06)
    h = h1 + (gap + (l2.image.getbbox()[3] - l2.image.getbbox()[1]) if l2 else 0)
    return l1, l2, _mid_x(l1), y, h


PLATED_NOW = [False]     # set by overlay(): is this group sitting on glass?


def draw_stack(img, txt, accent, y, e, e1=None, e2=None, ink1=None):
    """Animated two-row hero line.

    Row one reveals word by word; row two follows. To animate at the right size
    the reveal runs on the 1080 canvas (kinetic's own width) and the result is
    pasted back at 2x — drawing it directly on 4K made it twice too big and the
    right half fell off the frame.
    """
    if e <= 0.004:
        return
    # row 2 waits for row 1 — the reference never drops a two-line title at once
    e1 = _stag(e, 0, 2, 0.30) if e1 is None else min(e, e1)
    e2 = _stag(e, 1, 2, 0.30) if e2 is None else min(e, e2)
    key, _px0, _a = STYLE["stack"]
    px = stack_px(txt)
    l1_txt, _, l2_txt = txt.partition("|")
    # ink follows the ground: cream/gold on a dark patch, a deep shade of the
    # photo's own colour on a bright one — the same switch the reference uses
    l1_ref = T.flow(l1_txt, key, px)
    if PLATED_NOW[0]:
        ink1, kind = C_CREAM, "light"          # type on glass is always cream
    else:
        ink1, kind = pick_ink(img, ((W - l1_ref.width) // 2, y - 8 * SCALE,
                                    (W + l1_ref.width) // 2, y + 2 * px))
    ink1 = C_CREAM if ink1 is None else ink1
    ink2 = accent
    shadow = (0, 2 * (SCALE - 1) + 2, (0, 0, 0), 0.42)
    small = img.resize((W // SCALE, H // SCALE), Image.LANCZOS)
    y1 = y // SCALE
    K.word_line(small, l1_txt, key, px // SCALE, (0, y1 + T.baseline_offset(T.flow(l1_txt, key, px)) // SCALE),
                ink1, e1, stagger=0.12, dur=0.30, rise=22, center_x=True, x0=0,
                shadow=shadow)
    if l2_txt:
        gap = px // 6
        dy = (T.flow(l1_txt, key, px).image.getbbox()[3]
              - T.flow(l1_txt, key, px).image.getbbox()[1]) // SCALE + gap // SCALE
        K.word_line(small, l2_txt, key, px // SCALE, (0, y1 + dy + T.baseline_offset(T.flow(l2_txt, key, px)) // SCALE),
                    ink2, e2, stagger=0.12, dur=0.30, rise=22, center_x=True, x0=0,
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


_BN_DIGITS = "০১২৩৪৫৬৭৮৯"


def count_up(value, q):
    """Digits tick up to their final number — the stat lands, it does not appear.

    Non-digit characters (dashes, units, letters) are left alone, so
    "১৮–২০ সেন্টিমিটার" counts the two numbers and keeps the text intact.
    """
    if q >= 0.999:
        return value
    out = []
    for ch in value:
        if ch in _BN_DIGITS:
            i = _BN_DIGITS.index(ch)
            # each digit keeps stepping up to its own value and never runs past
            # it — the old version could land on a HIGHER digit and print
            # "৭–৯" as "৭–৯|" at the moment the frame was checked
            step = i * max(0.0, 1.0 - q)
            out.append(_BN_DIGITS[max(0, i - int(round(step)))])
        else:
            out.append(ch)
    return "".join(out)


def draw_label_value(img, label, value, accent, y, e, align="mid"):
    """Small cream caption above a big accent value, revealed in two steps."""
    if e <= 0.004:
        return
    k_l, px_l, _ = STYLE["label"]
    k_v, px_v, _ = STYLE["value"]
    px_v = fit_px(k_v, value, px_v)
    e_lab = _stag(e, 0, 2, 0.30)
    e_val = _stag(e, 1, 2, 0.30)
    ll = T.flow(label, k_l, px_l)
    vl = T.flow(count_up(value, e_val), k_v, px_v)
    lx = _mid_x(ll) if align == "mid" else MINX
    vx = _mid_x(vl) if align == "mid" else MINX
    hb = ll.image.getbbox()
    hb3 = hb[3] - hb[1] + 12 * SCALE
    ink_l, ink_v = C_CREAM, accent
    sh_d = (0, 3 * SCALE, (0, 0, 0), 0.34)
    T.paint(img, ll.image, (lx, y), ink_l, e_lab, shadow=sh_d)
    # the value rises the last few pixels into place
    rise = int(16 * SCALE * (1 - K.eo(e_val)))
    T.paint(img, vl.image, (vx, y + hb3 + rise), ink_v, e_val, shadow=sh_d)


PILLS = [C_GOLD, C_MINT, C_SKY, C_WHITE]


def draw_pills(img, txt, y, e, x_left=None):
    """A centred row of bordered capsules, e.g. পুকুর · নদীর চর · খাল · বিল."""
    if e <= 0.004:
        return
    items = [t.strip() for t in (txt.split("|") if "|" in txt else txt.split(" · "))
             if t.strip()]
    key, _px0, _a = STYLE["pill"]
    px = _px0
    while px > 18 and sum(T.flow(t, key, px).width + 34 * SCALE
                          for t in items) + 22 * SCALE * (len(items) - 1) > MAXW:
        px = int(px * 0.94)
    lays = [T.flow(t, key, px) for t in items]
    padx, gap_y = 30 * SCALE, 22 * SCALE
    wid = [lay.width + padx for lay in lays]
    total = sum(wid) + gap_y * (len(lays) - 1)
    n = len(lays)
    x = int((W - total) / 2) if x_left is None else x_left
    for i, (lay, wi) in enumerate(zip(lays, wid)):
        # one capsule at a time, left to right — a row of pills never flashes in
        ep = _stag(e, i, n, 0.42)
        if ep <= 0.004:
            x += wi + gap_y
            continue
        h = lay.image.getbbox()[3] - lay.image.getbbox()[1] + 26 * SCALE
        col = PILLS[i % len(PILLS)]
        box = Image.new("RGBA", (int(wi), int(h)), (0, 0, 0, 0))
        d = ImageDraw.Draw(box)
        d.rounded_rectangle([0, 0, wi - 1, h - 1], radius=int(h // 2),
                            fill=(8, 14, 14, int(150 * ep)),
                            outline=col + (int(210 * ep),), width=3 * SCALE)
        dy = int(12 * SCALE * (1 - K.eo(ep)))
        base = img.crop((int(x), int(y + dy), int(x + wi), int(y + dy + h))).convert("RGBA")
        if base.size == box.size:
            box = Image.alpha_composite(base, box)
        img.paste(box.convert("RGB"), (int(x), int(y + dy)))
        T.paint(img, lay.image, (int(x + padx / 2), int(y + 13 * SCALE + dy)), col, ep)
        x += wi + gap_y


def _group_rows(rows):
    """Rows on one beat that may share a plate.

    A chip never shares a group with the line under it: the chip carries its
    own capsule and the reference keeps the hero title off any plate. When the
    two were merged the chip's rounded box inflated the plate and it ran over
    the title (shipped once on ep.013's first pass).
    """
    out = []
    for r in rows:
        if out and out[-1][0][0] == r[0] and not (
                r[1] == "chip" or any(x[1] == "chip" for x in out[-1])):
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
                    colour, min(1.0, e * 1.4), stagger=0.12, dur=0.30, rise=18,
                    center_x=True, x0=0, shadow=(0, 2, (0, 0, 0), 0.34))
    else:
        yy = y_s + 12 * (1 - K.eo(min(1.0, e * 1.5)))
        T.paint(small, lay.image, (x, int(yy)), colour, min(1.0, e * 1.5),
                shadow=(0, 2, (0, 0, 0), 0.34))
    return small


def draw_line(img, style, txt, colour, y, align, e, x0=None, plated=False):
    if e <= 0.004:
        return
    key, px, anim = STYLE[style]
    center = align == "mid"
    px = fit_px(key, txt.replace("|", " "), px, MAXW if center else W - 2 * MINX)
    lay = T.flow(txt, key, px)
    x0 = MINX if x0 is None else x0
    xx = (W - lay.width) / 2 if center else x0
    if style == "chip":
        # machranga chip: slides in from the left and settles, never centred
        ee = min(1.0, e * 1.25)
        dx = int(56 * SCALE * (1 - K.eo(ee)))
        K.chip(img, txt, (x0 + dx, y), ee, px=30 * SCALE, colour=colour, icon="dot",
               slide=0)
        return
    if style == "list":                       # txt may carry "head|sub"
        head, _, sub = txt.partition("|")
        bullet_row(img, head, sub, x0 + 8 * SCALE, y, e, colour)
        return

    if style == "list" and plated:
        # head + sub inside a crisp plate; the sub keeps the grey-green ink the
        # reference uses, so it must not be forced to cream
        head, _, sub = txt.partition("|")
        draw_list_plated(img, head, sub, colour, y, e, x0, center)
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

    ink = colour          # every row carries its own ink colour
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
    dict(id="s01", art="s01_hook.png", amb="forest", pre=0.55, post=0.85, kind="hook",
         lowfloor=1150, fx=[("wing", 0.20, 0.36), ("chime", 0.66, 0.28)],
         cues={"name": 0.0, "tail": 0.45}),
    dict(id="s02", art="s02_portrait.png", amb="still", pre=0.45, post=0.75, kind="portrait",
         plate=True, fx=[("whoosh", 0.05, 0.26), ("chime", 0.35, 0.24)],
         cues={"name": 0.0, "en": 0.26, "sci": 0.52}),
    dict(id="s03", art="s03_pair.png", amb="forest", pre=0.45, post=0.75, kind="detail",
         lowceil=1320, fx=[("tick", 0.15, 0.26), ("chime", 0.55, 0.24)],
         cues={"male": 0.0, "female": 0.52}),
    dict(id="s04", art="s04_tail.png", amb="forest", pre=0.45, post=0.75, kind="nation",
         lowfloor=1150, fx=[("tick", 0.10, 0.28), ("boom", 0.48, 0.28)],
         cues={"size": 0.0, "tail": 0.44}),
    dict(id="s05", art="s05_habitat.png", amb="field", pre=0.45, post=0.75, kind="home",
         lowceil=1320, fx=[("whoosh", 0.12, 0.26), ("boom", 0.55, 0.26)],
         cues={"rare": 0.0, "places": 0.46}),
    dict(id="s06", art="s06_behaviour.png", amb="forest", pre=0.45, post=0.75, kind="cycle",
         lowfloor=1230, fx=[("whoosh_down", 0.20, 0.28), ("tick", 0.60, 0.22)],
         cues={"hover": 0.0, "bill": 0.46}),
    dict(id="s07", art="s07_diet.png", amb="forest", pre=0.45, post=0.75, kind="use",
         lowfloor=1150, fx=[("chime", 0.12, 0.24), ("tick", 0.55, 0.22)],
         cues={"diet": 0.0, "role": 0.46}),
    dict(id="s08", art="s08_nest.png", amb="wind", pre=0.45, post=0.80, kind="role",
         lowfloor=1180, fx=[("chime", 0.12, 0.22), ("whoosh", 0.52, 0.24)],
         cues={"breed": 0.0, "nest": 0.34, "eggs": 0.72}),
    dict(id="s09", art="s09_threat.png", amb="wind", pre=0.45, post=0.80, kind="threats",
         lowceil=1180, fx=[("tension", 0.10, 0.30), ("boom", 0.55, 0.28)],
         cues={"threat": 0.0, "iucn": 0.60}),
    dict(id="s10", art="s10_outro.png", amb="still", pre=0.55, post=2.40, kind="outro",
         lowceil=1180, fx=[("chime", 0.20, 0.26), ("boom", 0.55, 0.28), ("whoosh", 0.85, 0.24)],
         cues={"last": 0.0, "logo": 0.34, "cta": 0.52, "url": 0.72}),
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
        (0, "chip", "পাহাড়ি বনের আগুন", C_CORAL, 430, "mid"),
        (0, "stack", "আগুনলেজ|মৌটুসি", C_GOLD, 560, "mid"),
        (1, "label", "দশ সেন্টিমিটারের পাখি|লেজ প্রায় দ্বিগুণ", C_GOLD, 2020, "mid"),
        (2, "sub", "কে এই ছোট্ট পাখিটা?", C_MINT, -1, "mid"),
    ],
    "s02": [
        (0, "chip", "পরিচয়", C_MINT, 430, "mid"),
        (0, "stack", "আগুনলেজ|মৌটুসি", C_GOLD, 529, "mid"),
        (1, "pill", "ইংরেজিতে · Fire-tailed Sunbird", C_GOLD, 1958, "mid"),
        (1, "label", "বৈজ্ঞানিক নাম|Aethopyga ignicauda", C_MINT, -1, "mid"),
        (2, "sub", "গোত্র · Nectariniidae", C_CREAM, -1, "mid"),
    ],
    "s03": [
        (0, "chip", "শনাক্তকরণ", C_SKY, 400, "mid"),
        (0, "stack", "মাথা বেগুনি|পেট হলুদ", C_GOLD, 520, "mid"),
        (1, "list", "পুরুষ|ধাতব বেগুনি-নীল মাথা, লাল পিঠ", C_WHITE, 2010, "left"),
        (1, "list", "স্ত্রী|ধূসর মাথা, জলপাই পিঠ", C_MINT, -1, "left"),
        (1, "list", "দুজনেই|লম্বা বাঁকা ঠোঁট", C_SKY, -1, "left"),
    ],
    "s04": [
        (0, "chip", "আকার", C_GOLD, 400, "mid"),
        (0, "label", "দৈর্ঘ্য|১০–১২ সেন্টিমিটার", C_GOLD, 520, "mid"),
        (1, "label", "লেজসহ|১৭+ সেন্টিমিটার", C_MINT, 1960, "mid"),
        (0, "sub", "ওজন মাত্র ৭–৯ গ্রাম", C_CREAM, 2090, "mid"),
    ],
    "s05": [
        (0, "chip", "বাংলাদেশে", C_CORAL, 430, "mid"),
        (0, "stack", "দেখা মেলে|মাঝে মাঝে", C_GOLD, 560, "mid"),
        (1, "list", "দুর্লভ|সিলেট ও পার্বত্য চট্টগ্রাম", C_WHITE, 2080, "left"),
        (1, "pills", "পাহাড়ি বন · ফুলের ঝোপ · বনের প্রান্ত", C_MINT, -1, "mid"),
    ],
    "s06": [
        (0, "chip", "আচরণ", C_MINT, 400, "mid"),
        (0, "label", "উড়াল|ফুলের সামনে স্থির", C_GOLD, 520, "mid"),
        (1, "list", "হামিংবার্ডের মতো|ডানা ঝাপটে এক জায়গায়", C_WHITE, 2020, "left"),
        (1, "list", "লম্বা বাঁকা ঠোঁট|ফুলের ভেতর ঢুকে যায়", C_SKY, -1, "left"),
        (2, "sub", "চিকন ডাক — সি-সি-সি", C_MINT, -1, "mid"),
    ],
    "s07": [
        (0, "chip", "খাদ্য", C_SAND, 400, "mid"),
        (0, "stack", "মধু, পোকা|আর মাকড়সা", C_GOLD, 520, "mid"),
        (1, "pills", "ফুলের মধু · ছোট পোকা", C_GOLD, 1980, "mid"),
        (2, "pills", "মাকড়সা · বনের মালী", C_MINT, -1, "mid"),
    ],
    "s08": [
        (0, "chip", "বাসা ও ডিম", C_SAND, 400, "mid"),
        (0, "stack", "ঝুলন্ত|ডিম্বাকৃতি বাসা", C_GOLD, 520, "mid"),
        (1, "list", "এপ্রিল–জুন|শ্যাওলা, জাল, পাতার আঁশ", C_WHITE, 2010, "left"),
        (1, "list", "২–৩টি ডিম|ফুটো উপরে, ডাল থেকে ঝোলে", C_SKY, -1, "left"),
    ],
    "s09": [
        (0, "chip", "হুমকি", C_CORAL, 430, "mid"),
        (0, "stack", "ফুলের ঝোপ কমছে|বন উজাড় হচ্ছে", C_GOLD, 560, "mid"),
        (1, "list", "পুরোনো গাছ কাটা|বাসা বাঁধার জায়গা হারাচ্ছে", C_WHITE, 2060, "left"),
        (1, "list", "কীটনাশক|খাদ্যের পোকা কমছে", C_MINT, -1, "left"),
        (1, "list", "আইইউসিএন · এলসি|কম ঝুঁকি, তবু দেশে দুর্লভ", C_SKY, -1, "left"),
    ],
    "s10": [
        (0, "chip", "শেষ কথা", C_MINT, 430, "mid"),
        (0, "stack", "আগুন শুধু|সৌন্দর্য নয়", C_GOLD, 560, "mid"),
        (1, "sub", "ফুল বাঁচলে বাঁচবে এই পাখিও", C_CREAM, 2020, "mid"),
        (2, "pills", "১০ সেমি · ৮ গ্রাম · এক বনরক্ষী", C_GOLD, -1, "mid"),
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
        # measure the row the way it is drawn — a bullet row carries a sub-line
        # that a plain text-box height does not know about
        box_h = row_bottom(style, txt, 0, align)
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
        hgt += row_bottom(style, txt, 0) + 26 * SCALE
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
    prev_bottom = None
    for i, style, txt, c, _y, al in rows2:
        if _y > 0:
            y_row = int(_y)
            if prev_bottom is not None:            # never overlap the row above
                y_row = max(y_row, prev_bottom + 26 * SCALE)
        else:
            y_row = int(yy)
        out.append((i, style, txt, c, y_row, al))
        prev_bottom = row_bottom(style, txt, y_row)   # already absolute
        yy = prev_bottom + 26 * SCALE
    _PLACED[s["id"]] = out
    return out

def _pill_geom(txt, y, align):
    """A single bordered capsule — ref-6's 'ইংরেজিতে · Common Kingfisher'."""
    key, _px0, _a = STYLE["pill"]
    px = fit_px(key, txt, _px0, MAXW - 80 * SCALE)
    lay = T.flow(txt, key, px)
    pad_x, pad_y = 34 * SCALE, 20 * SCALE
    w = lay.width + pad_x * 2
    h = lay.image.height + pad_y * 2
    x = int((W - w) / 2) if align == "mid" else MINX

    def _draw(im, e, x=x, y=y, w=w, h=h, lay=lay, px=px):
        col = _pill_colour(txt)
        box = Image.new("RGBA", (int(w), int(h)), (0, 0, 0, 0))
        d = ImageDraw.Draw(box)
        d.rounded_rectangle([0, 0, w - 1, h - 1], radius=int(h // 2),
                            fill=PANEL_FILL + (int(PANEL_A * 0.86 * e),),
                            outline=col + (int(200 * e),), width=3 * SCALE)
        im.paste(box, (x, y), box)
        T.paint(im, lay.image, (int(x + 34 * SCALE), int(y + 20 * SCALE)),
                col, e, shadow=(0, 3 * SCALE, (0, 0, 0), 0.30))
    return (x, y, x + w, y + h), _draw, False


def _pill_colour(txt, seed=0):
    """Pill colours cycle in the reference: gold, mint, sky, cream."""
    return PILLS[(len(txt) + seed) % len(PILLS)]


def row_bottom(style, txt, y, align="left"):
    """True bottom edge of a row, measured the way it is actually painted.

    Every branch here mirrors a drawing branch in ``_row_geom``/``bullet_row`` —
    when these two disagree the panel is a few pixels short and a sub-line pokes
    out underneath it. That is exactly what happened once; keep them in step.
    """
    if style == "list":
        head, _, sub = txt.partition("|")
        lay = T.flow(head, "sans-semi",
                     fit_px("sans-semi", head, 46 * SCALE, MAXW - 90 * SCALE))
        bb = lay.image.getbbox() or (0, 0, lay.width, lay.image.height)
        h = bb[1] + (bb[3] - bb[1])
        if sub:
            sub_lay = T.flow(sub, "sans-semi",
                             fit_px("sans-semi", sub, 34 * SCALE, MAXW - 90 * SCALE))
            h += SUB_GAP + sub_lay.image.height
        return int(y + h)

    if style == "stack":
        _l1, _l2, _x, _yy, h = stack_box(txt, y)
        return int(y + h)

    if style in ("pill", "pills"):
        key, _px0, _a = STYLE["pill"]
        items = ([txt] if style == "pill"
                 else [t.strip() for t in (txt.split("|") if "|" in txt
                                           else txt.split(" · ")) if t.strip()])
        px = _px0
        while px > 18 and sum(T.flow(t, key, px).width + 34 * SCALE
                              for t in items) + 22 * SCALE * (len(items) - 1) > MAXW:
            px = int(px * 0.94)
        lay = T.flow(items[0] if items else txt, key, px)
        bb = lay.image.getbbox() or (0, 0, lay.width, lay.image.height)
        return int(y + bb[3] + 26 * SCALE)

    if style == "label":
        lab, _sep, val = txt.partition("|")
        k_l, px_l, _a = STYLE["label"]
        ll = T.flow(lab, k_l, fit_px(k_l, lab, px_l))
        bb = ll.image.getbbox() or (0, 0, ll.width, ll.image.height)
        h = bb[3]
        if val.strip():
            k_v, px_v, _b = STYLE["value"]
            h += 12 * SCALE + T.flow(val, k_v, fit_px(k_v, val, px_v)).image.height
        return int(y + h)

    if style in ("chip", "pill", "pills"):
        key, _px, _a = STYLE.get(style, ("sans-semi", 40 * SCALE, "rise"))
        if style == "chip":
            # K.chip draws its own box; its height is padding + glyphs
            return int(y + 30 * SCALE * 2 + 38 * SCALE * 1.15)
        lay = T.flow(txt.split("|")[0].strip(), key,
                     fit_px(key, txt.split("|")[0].strip(), _px, MAXW - 80 * SCALE))
        return int(y + lay.image.height + 20 * SCALE * 2)

    key, px, _a = STYLE.get(style, ("sans-semi", 40 * SCALE, "rise"))
    bare = txt.replace("|", " ")
    lay = T.flow(bare, key, fit_px(key, bare, px))
    return int(y + lay.image.height)


def _row_geom(style, txt, y, align, colour=C_GOLD):
    """Box and draw closure for one row — geometry measured on the real layout."""
    if style == "stack":
        l1, l2, x1, yy, h = stack_box(txt, y)
        bb1 = l1.image.getbbox()
        xa, xb = x1 + bb1[0], x1 + bb1[2]
        if l2 is not None:
            bb2 = l2.image.getbbox()
            x2 = _mid_x(l2)
            xa, xb = min(xa, x2 + bb2[0]), max(xb, x2 + bb2[2])
        box = (xa, yy + bb1[1], xb, yy + bb1[1] + h + 18 * SCALE)
        # hero type sits straight on the photograph unless the patch is bright
        return box, (lambda im, e: draw_stack(im, txt, colour, y, e)), False

    if style == "label":                              # "label|value", one unit
        lab, _, val = txt.partition("|")
        if not val.strip():
            # measured before the value row was merged in (layout pass) — the
            # label alone is enough to size the box
            k_l0, px_l0, _ = STYLE["label"]
            ll0 = T.flow(lab, k_l0, fit_px(k_l0, lab, px_l0))
            bb0 = ll0.image.getbbox()
            return (MINX + bb0[0], y + bb0[1], MINX + bb0[2], y + bb0[3]), None, False
        k_l, px_l, _ = STYLE["label"]
        k_v, _pxv, _ = STYLE["value"]
        px_l = fit_px(k_l, lab, px_l, MAXW if align == "mid" else W - 2 * MINX)
        px_v = fit_px(k_v, val, _pxv, MAXW if align == "mid" else W - 2 * MINX)
        ll = T.flow(lab, k_l, px_l)
        vl = T.flow(val, k_v, px_v)
        hb = ll.image.getbbox()
        h1 = hb[3] - hb[1]
        vx = _mid_x(vl) if align == "mid" else MINX
        lx = _mid_x(ll) if align == "mid" else MINX
        vbb = vl.image.getbbox() or (0, 0, vl.width, vl.image.height)
        box = (min(vx + vbb[0], lx + hb[0]), y + hb[1],
               max(vx + vbb[2], lx + ll.image.getbbox()[2]),
               y + h1 + 12 * SCALE + vbb[3])
        return box, (lambda im, e: draw_label_value(im, lab, val, C_GOLD, y, e, align)), True

    if style == "value":
        return None, None, False

    if style == "pill":
        return _pill_geom(txt, y, align)

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
        # K.chip draws its own pill; it is returned as a draw with no plate and
        # no geometry, otherwise the row was measured but never painted at all
        return None, (lambda im, e: draw_line(im, "chip", txt, colour, y, align, e)), False

    if style == "list":
        head, _, sub = txt.partition("|")
        bottom = row_bottom("list", txt, y)
        return (MINX, y, W - MINX, bottom), \
            (lambda im, e: draw_line(im, "list", txt, colour, y, align, e)), True

    key, px, _a = STYLE.get(style, ("sans-semi", 40, "rise"))
    lay = T.flow(txt.replace("|", " "), key, px)
    bb = lay.image.getbbox()
    if not bb:
        return None, None, False
    if align == "mid":                                # centred: drawn at 2x on the 4K canvas
        x = int((W - lay.width) / 2)
        box = (x + bb[0], y + bb[1], x + bb[2], y + bb[3])
        return box, (lambda im, e: draw_line(im, style, txt, colour, y, align, e,
                                             plated=True)), True
    x = int(W * 0.075)
    return (x + bb[0], y + bb[1], x + bb[2], y + bb[3]), \
        (lambda im, e: draw_line(im, style, txt, colour, y, align, e, plated=True)), True


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
        # The TOP block (chip + hero title) is a section label: it lands once
        # and holds until the scene ends. Anything inside the lower block must
        # clear away when its sentence is over, or it ends up sitting on top of
        # the lines that arrive after it.
        _top_block = max(r[4] for r in grp) < H * 0.30
        e_out = 1.0 if idx0 + 1 >= len(segs) or _top_block \
            else 1.0 - K.ss(b0 + 0.04, b0 + 0.40, v)
        e = e_in * e_out * fade_all

        # a label row is always paired with the value row under it: merge them so
        # they share one plate and one reveal (the pair used to draw nothing at all)
        merged = []
        for r in grp:
            if r[1] == "label":
                val = next((x[2] for x in grp if x[1] == "value"), "")
                # a label already written as "label|value" must not get a second
                # bar — that painted a stray "|" at the end of every value
                txt = r[2] if ("|" in r[2] or not val.strip()) else r[2] + "|" + val
                merged.append((r[0], "label", txt, r[3], r[4], r[5]))
            elif r[1] == "value":
                continue
            else:
                merged.append(r)
        grp = merged

        geom, gstyles, plates = [], [], False
        PLATED_NOW[0] = False
        grp_draw = []
        for _i, style, txt, colour, y, align in grp:
            box, fn, wants_plate = _row_geom(style, txt, y, align, colour)
            # pills and chips draw their own box — they never ask for a plate
            if style in ("chip", "pill", "pills"):
                wants_plate = False
            if box:
                geom.append(box)
                gstyles.append(style)
            if fn:
                plates = plates or wants_plate
            grp_draw.append((fn, style, txt, colour, y, align))
        draws = grp_draw

        # A hero stack is type straight on the photograph — that is what the
        # reference does, and a plate behind it is exactly what reads as a
        # black smear. It is still drawn; it just never asks for a plate and
        # never inflates the plate of a row that shares its beat.
        if s.get("plate"):
            plates = True
        if "stack" in gstyles:
            # decide per stack: on a calm dark ground it goes straight onto the
            # picture (that is the reference), on a pale or busy one — a washed
            # sky, dry grass — it earns a plate like any other row. Blanket
            # "no plate" left cream type invisible on the hook's sky.
            stack_geom = [b for b, st in zip(geom, gstyles) if st == "stack"]
            if not s.get("plate") and not any(_patch_bright(img, b) for b in stack_geom):
                plates = False
            geom = [b for b, st in zip(geom, gstyles) if st != "stack"] or stack_geom
            gstyles = [st for st in gstyles if st != "stack"] or ["stack"]

        # bright ground under a row earns it a real plate — the reference never
        # puts pale type straight onto dry grass or water
        if not plates and geom:
            for b in geom:
                if _patch_bright(img, b):
                    plates = True
                    break

        # ONE panel per group: every row it contains must sit inside it, with a
        # real padding — a panel that only covers one row leaves the next row's
        # type floating on bare photograph (this shipped once; never again)
        if geom and (plates or any(g[1] == "label" for g in draws)):
            pad_x, pad_y = 44 * SCALE, 40 * SCALE
            # a plate that runs past the bottom edge is worse than a small lift:
            # shift this group up until its panel fits (never more than 120px)
            bottom = max(b[3] for b in geom) + pad_y
            overshoot = int(bottom - (H - 54 * SCALE))
            if overshoot > 0:
                lift = min(overshoot, 120 * SCALE)
                geom = [(b[0], b[1] - lift, b[2], b[3] - lift) for b in geom]
                draws = [(fn, st, tx, co, yy - lift, al)
                         for fn, st, tx, co, yy, al in draws]
            # a chip/pill row in the same group must not be swallowed by the
            # plate — the plate starts below the last capsule instead, but only
            # when the capsule really is above the text it belongs to
            y_top = min(b[1] for b in geom) - pad_y
            for gstyle, gy in [(g[1], g[4]) for g in draws]:
                if gstyle == "chip":
                    chip_bot = int(gy + row_bottom("chip", "", gy)) + pad_y // 2
                    if chip_bot < min(b[1] for b in geom):
                        y_top = max(y_top, chip_bot)
            pbox = (max(pad_x, min(b[0] for b in geom) - pad_x),
                    max(pad_y, y_top),
                    min(W - pad_x, max(b[2] for b in geom) + pad_x),
                    min(H - pad_y, max(b[3] for b in geom) + pad_y))
            if pbox[3] - pbox[1] > 8:
                panel(img, pbox, e)
            PLATED_NOW[0] = True

        for fn, style, txt, colour, y, align in draws:
            if fn:
                fn(img, e)
        PLATED_NOW[0] = False

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
        # the logo is a stamp: it lands late, holds, and gets out of the way
        # (ref-5 carries no brand mark at all, so it must never sit on the type)
        be = K.ss(1.05, 1.75, t) * fade_all
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
