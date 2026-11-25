"""adkit — primitives for the product commercial (not for the nature episodes).

Difference from the episode renderer:
  * A scene is drawn from LAYERS, not one still: background plate, product
    sprite (cut-out / generated plate), light, mist, dust, type. Each layer
    moves at its own speed — that is the 2.5D parallax.
  * Brand palette (emerald / champagne gold / ivory) instead of the natural
    palette used by the episodes.
  * Type uses the same verified shaper (rbtext/HarfBuzz) and the same sizes,
    with brand accents: gold on frosted glass, never a black slab.
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
SCALE = 2                      # 2160x3840
W, H = 1080 * SCALE, 1920 * SCALE

# ------------------------------------------------------------------ palette ---
EMERALD = (10, 55, 46)          # kept for the older episode scripts
EMERALD_DK = (5, 26, 22)
# v9 bright palette: daylight silk, brand blue, deep ink for type
DEEP = (14, 48, 74)             # brand navy — headings on light glass
DEEP2 = (22, 70, 104)           # slightly lighter navy — sub-lines
INK = (26, 34, 42)              # near-black for the heaviest numeral
GOLD = (176, 132, 52)           # champagne, darkened so it reads on white
GOLD_LT = (200, 152, 66)
SKY = (78, 150, 200)            # accent blue (winter, fresh)
MINT = (32, 128, 118)           # secondary accent (steel / tea leaf)
CREAM = (255, 250, 242)         # light stage base
IVORY = (243, 235, 221)
BLACK = (17, 19, 21)
WINTER = (96, 138, 168)         # muted blue for small print on light glass
WHITE = (255, 255, 255)

# типорозміри — ті самі, що в епізодах (STYLE з build_falcon.py), помножені на SCALE
TYPO = {
    "chip":  ("sans-semi", 38 * SCALE),
    "title": ("serif-bold", 76 * SCALE),
    "big":   ("serif-bold", 96 * SCALE),
    "sub":   ("sans-semi", 44 * SCALE),
    "list":  ("sans-semi", 48 * SCALE),
    "list2": ("sans-semi", 36 * SCALE),
    "label": ("sans-semi", 38 * SCALE),
    "value": ("serif-bold", 108 * SCALE),
    "price": ("serif-bold", 148 * SCALE),
    "cta":   ("sans-semi", 46 * SCALE),
}


# ------------------------------------------------------------------- easing ---
def ss(a, b, x):
    return K.ss(a, b, x)


def eo(x):
    return K.eo(x)


def eio(x):
    return K.eio(x)


# -------------------------------------------------------------------- layer ---
class Plate:
    """Фон-стіл: 9:16 зображення, камера поверх нього (зум + панорама)."""

    def __init__(self, path, scale=1.06):
        src = Image.open(path).convert("RGB")
        f = max(W / src.width, H / src.height) * scale
        self.img = src.resize((int(src.width * f) + 4, int(src.height * f) + 4), Image.LANCZOS)
        self.cx, self.cy = self.img.width / 2, self.img.height / 2

    def frame(self, zoom=1.0, pan=(0.0, 0.0)):
        z = max(1.0, zoom)
        cw, ch = W / z, H / z
        cx = min(max(self.cx + pan[0] * self.img.width, cw / 2), self.img.width - cw / 2)
        cy = min(max(self.cy + pan[1] * self.img.height, ch / 2), self.img.height - ch / 2)
        return self.img.resize((W, H), Image.LANCZOS,
                               box=(cx - cw / 2, cy - ch / 2, cx + cw / 2, cy + ch / 2))


class Sprite:
    """Об'єкт у кадрі. Малюється поверх фона, рухається незалежно (паралакс)."""

    def __init__(self, img):
        self.img = img.convert("RGBA")

    def draw(self, canvas, cx, cy, h, x=0.0, y=0.0, alpha=1.0, shadow=True,
             shadow_gain=1.0, shadow_h=0.045):
        """cx/cy — центр у частках кадру, h — висота у частках кадру."""
        if alpha <= 0.004:
            return
        hh = max(2, int(h * H))
        ww = max(2, int(self.img.width * hh / self.img.height))
        sp = self.img if (ww == self.img.width and hh == self.img.height) \
            else self.img.resize((ww, hh), Image.LANCZOS)
        x0 = int(cx * W + x * W - ww / 2)
        y0 = int(cy * H + y * H - hh / 2)
        if shadow:
            sh = Image.new("L", (ww + 240, hh + 240), 0)
            ImageDraw.Draw(sh).ellipse(
                [120 + ww * 0.10, 120 + hh * 0.90, 120 + ww * 0.90, 120 + hh * 1.02], fill=255)
            sh = sh.filter(ImageFilter.GaussianBlur(hh * shadow_h))
            mask = sh.point(lambda v: int(v * 0.55 * alpha * shadow_gain))
            canvas.paste(Image.new("RGB", sh.size, (0, 0, 0)), (x0 - 120, y0 - 120), mask)
        m = sp.split()[3]
        if alpha < 0.999:
            m = m.point(lambda v: int(v * alpha))
        canvas.paste(sp, (x0, y0), m)


# ----------------------------------------------------------------- ground/glow --
def radial_glow(img, cx, cy, r, colour=GOLD, strength=0.32):
    """М'яке золоте світло — «кільце» за товаром, без неону."""
    if strength <= 0.004:
        return img
    w, h = img.size
    yy, xx = np.mgrid[0:h:4, 0:w:4].astype(np.float32)
    d = np.sqrt(((xx - cx * w) / (r * w)) ** 2 + ((yy - cy * h) / (r * h)) ** 2)
    a = np.clip(1.0 - d, 0, 1) ** 2.2
    small = (a * strength * 255).astype(np.uint8)
    mask = Image.fromarray(small, "L").resize((w, h), Image.BICUBIC)
    mask = mask.filter(ImageFilter.GaussianBlur(6 * SCALE))
    img.paste(Image.new("RGB", img.size, colour), (0, 0), mask)
    return img


def light_sweep(img, p, y0=0.25, y1=0.75, width=0.22, strength=0.30, colour=(255, 246, 226)):
    """Діагональна золота смуга, що проходить по кадру один раз."""
    if p <= 0.0 or p >= 1.0:
        return img
    w, h = img.size
    yy, xx = np.mgrid[0:h:8, 0:w:8].astype(np.float32)
    xx = xx / w
    yy = yy / h
    band_c = -0.35 + 1.7 * p
    d = (xx - 0.45 * yy) - band_c
    a = np.exp(-(d / width) ** 2) * np.clip((yy - y0) / 0.1, 0, 1) * np.clip((y1 - yy) / 0.1, 0, 1)
    small = (np.clip(a, 0, 1) * strength * 255).astype(np.uint8)
    mask = Image.fromarray(small, "L").resize((w, h), Image.BICUBIC)
    mask = mask.filter(ImageFilter.GaussianBlur(10 * SCALE))
    img.paste(Image.new("RGB", img.size, colour), (0, 0), mask)
    return img


def mist(img, strength=0.16, speed=0.02, y0=0.62, colour=WINTER):
    """Зимовий серпанок — дуже тихий, лише щоб кадр дихав."""
    if strength <= 0.004:
        return img
    w, h = img.size
    yy, xx = np.mgrid[0:h:8, 0:w:8].astype(np.float32)
    n = ((xx / w) * 2.1 + (yy / h) * 1.3 + speed)
    a = (0.5 + 0.5 * np.sin(n * 3.1)) * (0.5 + 0.5 * np.sin(n * 1.7 + 1.9))
    a *= np.clip((yy / h - y0) / 0.22, 0, 1) * (1 - np.clip((yy / h - y0 - 0.30) / 0.30, 0, 1))
    small = (np.clip(a, 0, 1) * strength * 255).astype(np.uint8)
    mask = Image.fromarray(small, "L").resize((w, h), Image.BICUBIC)
    mask = mask.filter(ImageFilter.GaussianBlur(18 * SCALE))
    img.paste(Image.new("RGB", img.size, colour), (0, 0), mask)
    return img


def dust(img, p, count=40, strength=0.5, seed=7):
    """Пил у світлі — кілька яскравих цяток, що повільно пливуть угору."""
    if strength <= 0.004:
        return img
    rng = np.random.default_rng(seed)
    lay = Image.new("L", img.size, 0)
    d = ImageDraw.Draw(lay)
    for i in range(count):
        bx = rng.uniform(0, 1)
        by = rng.uniform(0, 1)
        sp = rng.uniform(0.012, 0.040)
        r = rng.uniform(0.0012, 0.0034)
        y = (by - p * sp) % 1.0
        x = (bx + 0.010 * math.sin(p * 6 + i)) % 1.0
        a = int(255 * rng.uniform(0.35, 0.9) * strength)
        d.ellipse([x * W - r * W, y * H - r * W, x * W + r * W, y * H + r * W], fill=a)
    lay = lay.filter(ImageFilter.GaussianBlur(1.2 * SCALE))
    img.paste(Image.new("RGB", img.size, (255, 246, 220)), (0, 0), lay)
    return img


_VIG = {}


def grade(img, vignette=0.22, grain=0.010):
    """Commercial grade: light vignette + fine grain, no colour shift.

    Grain and vignette are built at half resolution and resampled — at 4K the
    per-pixel normal() was most of the frame cost, and grain has no detail to
    lose above its own scale.
    """
    arr = np.asarray(img, dtype=np.float32)
    h, w = arr.shape[:2]
    key = (h, w, round(vignette, 3))
    if vignette and key not in _VIG:
        hh, ww = h // 2, w // 2
        yy, xx = np.mgrid[0:hh, 0:ww].astype(np.float32)
        nx, ny = xx / ww, yy / hh
        d = np.sqrt(((nx - 0.5) * 1.06) ** 2 + ((ny - 0.5) * 0.94) ** 2)
        v = (1 - vignette * np.clip((d - 0.34) / 0.52, 0, 1)).astype(np.float32)
        _VIG[key] = np.asarray(Image.fromarray((v * 255).astype(np.uint8), "L")
                               .resize((w, h), Image.BILINEAR), dtype=np.float32) / 255.0
    if grain:
        rng = np.random.default_rng(11)
        g = rng.normal(0, grain * 255, (h // 2, w // 2)).astype(np.float32)
        g = np.asarray(Image.fromarray(np.clip(g + 128, 0, 255).astype(np.uint8), "L")
                       .resize((w, h), Image.BILINEAR), dtype=np.float32) - 128.0
        arr += g[:, :, None]
    if vignette:
        arr *= _VIG[key][:, :, None]
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")


# ----------------------------------------------------------------------- type --
def _text_px(key, txt, px, maxw):
    """Зменшує кегль, поки рядок не влізе в maxw (тип не має виходити за поля)."""
    k = 1.0
    while k > 0.55:
        if T.shaper(key, int(px * k)).advance(txt) <= maxw:
            return int(px * k)
        k -= 0.05
    return int(px * 0.55)


def centred(canvas, txt, style, y, colour, e, dy=26, shadow=0.55, alpha=1.0,
            maxw=0.86, key=None, px=None):
    """Один рядок по центру; y — верх рядка у частках висоти."""
    if e <= 0.004:
        return
    k, p = TYPO[style]
    k = key or k
    p = int(px or p)
    p = _text_px(k, txt, p, maxw * W)
    lay = T.flow(txt, k, p)
    x = int((W - lay.width) / 2)
    yy = int(y * H + dy * (1 - e))
    sh = (int(4 * SCALE), int(5 * SCALE), (0, 0, 0), shadow)
    T.paint(canvas, lay.image, (x, yy), colour, e * alpha, shadow=sh)


def lefted(canvas, txt, style, x, y, colour, e, dy=22, shadow=0.5, alpha=1.0,
           maxw=0.80):
    if e <= 0.004:
        return
    k, p = TYPO[style]
    p = _text_px(k, txt, p, maxw * W)
    lay = T.flow(txt, k, p)
    sh = (int(4 * SCALE), int(5 * SCALE), (0, 0, 0), shadow)
    T.paint(canvas, lay.image, (int(x * W), int(y * H + dy * (1 - e))), colour,
            e * alpha, shadow=sh)


def glass_card(canvas, box, e, radius=30 * SCALE, tint=(12, 30, 26), alpha=96,
               border=GOLD_LT, border_a=110, lift=1.16, adaptive=True):
    """Матове скло: блюр того, що під ним + легкий тонувальний шар."""
    if e <= 0.004:
        return
    x0, y0, x1, y1 = [int(v) for v in box]
    x0, y0 = max(0, x0), max(0, y0)
    x1, y1 = min(canvas.width, x1), min(canvas.height, y1)
    if x1 - x0 < 6 or y1 - y0 < 6:
        return
    under = canvas.crop((x0, y0, x1, y1)).filter(ImageFilter.GaussianBlur(18 * SCALE))
    # a touch of light so the glass lifts off the background instead of going black
    under = Image.eval(under, lambda v: min(255, int(v * lift + 10)))
    if adaptive:
        # On a bright stage a light tint alone disappears; on a dark stage a dark
        # tint alone goes to mud. So read the plate under the card and pick the
        # effective card alpha + a subtle veil in the opposite direction. One
        # value per card, not per frame — cheap and it never flickers.
        try:
            mean = np.asarray(under.resize((1, 1), Image.LANCZOS))[0, 0].mean()
        except Exception:
            mean = 128.0
        k = float(np.clip((mean - 95.0) / 95.0, 0.0, 1.0))   # 0 dark .. 1 light
        alpha = int(alpha * (0.42 + 0.30 * k))
        if k > 0.5:
            # bright plate: veil it toward white so dark ink has something to sit on
            veil = int(150 * (k - 0.5) * 2 * e)
            _v = Image.new("RGBA", (x1 - x0, y1 - y0), (255, 255, 255, veil))
            under = Image.alpha_composite(under.convert("RGBA"), _v).convert("RGB")
    layer = Image.new("RGBA", (x1 - x0, y1 - y0), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.rounded_rectangle([0, 0, layer.width - 1, layer.height - 1], radius=radius,
                        fill=tuple(tint) + (int(alpha * e),),
                        outline=tuple(border) + (int(border_a * e),), width=max(1, int(2 * SCALE)))
    hl = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    ImageDraw.Draw(hl).rounded_rectangle(
        [2, 2, layer.width - 3, int(layer.height * 0.42)], radius=radius,
        fill=(255, 255, 255, int(26 * e)))
    hl = hl.filter(ImageFilter.GaussianBlur(22 * SCALE))
    layer = Image.alpha_composite(layer, hl)
    plate = Image.alpha_composite(under.convert("RGBA"), layer)
    mask = Image.new("L", plate.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, plate.width - 1, plate.height - 1],
                                           radius=radius, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(1.2 * SCALE))
    mask = Image.eval(mask, lambda v: int(v * min(1.0, e)))
    canvas.paste(plate.convert("RGB"), (x0, y0), mask)


def rule(canvas, y, e, w=0.30, colour=GOLD_LT, alpha=0.85, thick=3):
    """Тонка золота лінія, що малюється від центру — роздільник блоків."""
    if e <= 0.004:
        return
    ww = int(w * W * e)
    if ww < 3:
        return
    d = ImageDraw.Draw(canvas, "RGBA")
    x0 = int(W / 2 - ww / 2)
    y0 = int(y * H)
    a = int(255 * alpha * min(1.0, e * 1.6))
    d.rounded_rectangle([x0, y0, x0 + ww, y0 + thick * SCALE], radius=thick * SCALE,
                        fill=tuple(colour) + (a,))


def pill(canvas, txt, cx, y, e, colour=GOLD_LT, ink=IVORY, pad_x=34, pad_y=16):
    """Овальна «капсула» з тонкою рамкою (як у епізодах, але в брендовій палітрі)."""
    if e <= 0.004:
        return
    lay = T.flow(txt, "sans-semi", int(38 * SCALE))
    pw, ph = lay.width + 2 * pad_x * SCALE, lay.image.height + 2 * pad_y * SCALE
    x0 = int(cx * W - pw / 2)
    y0 = int(y * H)
    d = ImageDraw.Draw(canvas, "RGBA")
    d.rounded_rectangle([x0, y0, x0 + pw, y0 + ph], radius=ph // 2,
                        fill=(8, 22, 20, int(150 * e)),
                        outline=tuple(colour) + (int(190 * e),), width=max(1, int(2 * SCALE)))
    T.paint(canvas, lay.image, (int(x0 + pad_x * SCALE),
                                int(y0 + pad_y * SCALE - lay.image.getbbox()[1] * 0)),
            ink, e, shadow=(2, 3, (0, 0, 0), 0.45))
    return ph / H


def count_price(canvas, value, y, e, colour=GOLD_LT, prefix="৳", px=None):
    """Ціна, що «набігає» — рахується вгору, як у рекламі, але без стрибків."""
    if e <= 0.004:
        return
    raw = f"{int(round(value)):,}"
    txt = prefix + "".join(K.bn(int(ch)) if ch.isdigit() else ch for ch in raw)
    # ease-out instead of back-ease: the spring made the number bounce, which
    # reads as a glitch on a price
    scale = 0.92 + 0.08 * K.eo(min(1.0, e * 1.15))
    k, p = TYPO["price"]
    p = int((px or p) * scale)
    lay = T.flow(txt, k, p)
    x = int((W - lay.width) / 2)
    glow = lay.image.filter(ImageFilter.GaussianBlur(14 * SCALE))
    T.paint(canvas, glow, (x, int(y * H)), colour, 0.45 * min(1.0, e * 2),
            shadow=(0, 0, (0, 0, 0), 0.0))
    T.paint(canvas, lay.image, (x, int(y * H)), colour, min(1.0, e * 1.5),
            shadow=(6, 8, (0, 0, 0), 0.55))


def brand_mark(canvas, e, x=0.055, y=0.030, size=62 * SCALE, name="Hawkins + Elima",
               tag="শীতের কম্বো"):
    """Малий бренд-локап у куті — стримано, без «водяних знаків»."""
    if e <= 0.004:
        return
    d = ImageDraw.Draw(canvas, "RGBA")
    cx, cy = int(x * W), int(y * H)
    a = int(230 * e)
    d.ellipse([cx, cy, cx + size, cy + size], outline=tuple(GOLD_LT) + (a,),
              width=max(1, int(2 * SCALE)))
    t1 = T.flow("H", "serif-bold", int(size * 0.52))
    T.paint(canvas, t1.image, (cx + size / 2 - t1.width / 2,
                               cy + size / 2 - t1.image.height / 2), GOLD_LT, e)
    tx = cx + size + 18 * SCALE
    t2 = T.flow(name, "sans-semi", int(26 * SCALE))
    T.paint(canvas, t2.image, (tx, cy + int(size * 0.10)), IVORY, e,
            shadow=(2, 3, (0, 0, 0), 0.45))
    t3 = T.flow(tag, "sans", int(20 * SCALE))
    T.paint(canvas, t3.image, (tx, cy + int(size * 0.56)), GOLD_LT, e * 0.9,
            shadow=(2, 2, (0, 0, 0), 0.4))
