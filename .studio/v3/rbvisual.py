"""Scene visuals for the Royal Bengal Tiger reel (1080x1920).

Design notes
------------
* No scene is a static photo with a zoom: each scene has its own camera path
  (push-in / pull-out / tracking pan / handheld drift), plus authored motion
  graphics drawn per frame in numpy: animated film grain, drifting mist,
  timed light sweep, parallax vignette, Ken-Burns-free foreground darkening.
* Text-safe area respected: keep title/subtitle within y 250..1650, x 80..1000.
"""
from __future__ import annotations

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter

import rbtext as T

W, H = 1080, 1920
SAFE_TOP, SAFE_BOTTOM = 260, 1640

# ------------------------------------------------------------------ palette ---
GOLD = (255, 214, 122)
CREAM = (255, 246, 228)
MINT = (170, 245, 205)
TEAL = (120, 220, 235)
RED = (255, 126, 96)
INK = (6, 14, 16)


def ease_out(x):
    return 1 - (1 - np.clip(x, 0, 1)) ** 3


def ease_in_out(x):
    x = np.clip(x, 0, 1)
    return x * x * (3 - 2 * x)


def smoothstep(a, b, x):
    x = np.clip((x - a) / (b - a + 1e-9), 0, 1)
    return x * x * (3 - 2 * x)


# -------------------------------------------------------------------- camera --
class Cam:
    """Crops a source image with a per-frame virtual camera."""

    def __init__(self, path, scale=1.06):
        src = Image.open(path).convert("RGB")
        # upscale a little so push-ins stay sharp at 1080p vertical
        f = max(W / src.width, H / src.height) * scale
        self.img = src.resize((int(src.width * f), int(src.height * f)), Image.LANCZOS)
        self.iw, self.ih = self.img.size
        self.cx, self.cy = self.iw / 2, self.ih / 2

    def frame(self, zoom=1.0, pan=(0.0, 0.0), rot=0.0, shake=(0.0, 0.0)):
        z = max(1.0, zoom)
        cw, ch = W / z, H / z
        cx = min(max(self.cx + pan[0] * self.iw, cw / 2 + 1), self.iw - cw / 2 - 1)
        cy = min(max(self.cy + pan[1] * self.ih, ch / 2 + 1), self.ih - ch / 2 - 1)
        box = (cx - cw / 2 + shake[0], cy - ch / 2 + shake[1],
               cx + cw / 2 + shake[0], cy + ch / 2 + shake[1])
        out = self.img.resize((W, H), Image.LANCZOS, box=box)
        if rot:
            out = out.rotate(rot, resample=Image.BILINEAR, center=(W / 2, H / 2))
        return out


# ------------------------------------------------------------------ overlays --
_YY, _XX = np.mgrid[0:H, 0:W].astype(np.float32)
_NX, _NY = _XX / W, _YY / H


def _vignette_strength(t):
    return 0.55


_VIG_CACHE = {}


def _vignette_mask(strength):
    key = round(strength, 4)
    if key not in _VIG_CACHE:
        d = np.sqrt(((_NX - 0.5) * 1.15) ** 2 + ((_NY - 0.5) * 0.95) ** 2)
        v = 1 - strength * smoothstep(0.28, 0.78, d)
        _VIG_CACHE[key] = v.astype(np.float32)[:, :, None]
    return _VIG_CACHE[key]


def apply_grade(img, warm=0.0, cool=0.0, contrast=1.06, lift=0.0, vignette=0.0,
                grain=0.0, t=0.0, sat=1.0, gamma=1.0):
    """Warm filmic grade.

    Everything that only depends on a pixel value is precomputed as a
    256-entry table per channel, so a frame costs two numpy passes instead of
    seven. The look is unchanged: warm/cool -> gamma -> saturation -> contrast
    -> vignette -> grain, same order as before.
    """
    u8 = np.arange(256, dtype=np.float32) / 255.0

    # per-channel value curve: warm/cool tint, gamma, contrast, lift
    m = np.stack([
        np.clip(u8 * (1 + 0.10 * warm) * (1 - 0.05 * cool), 0, 1),
        np.clip(u8 * (1 + 0.03 * warm), 0, 1),
        np.clip(u8 * (1 - 0.08 * warm) * (1 + 0.12 * cool), 0, 1),
    ])
    if gamma != 1.0:
        m = np.power(m, gamma)
    m = (m - 0.5) * contrast + 0.5 + lift
    lut = np.ascontiguousarray(np.clip(m, 0, 1).T) * 255.0   # (256, 3)
    lut = lut.astype(np.uint8)

    arr = np.asarray(img)
    a = np.empty(arr.shape, dtype=np.uint8)
    for c in range(3):                        # per-channel table lookup
        a[..., c] = lut[:, c][arr[..., c]]
    if sat != 1.0:
        f = a.astype(np.float32)
        g = f @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
        f = g[:, :, None] + (f - g[:, :, None]) * sat
        a = np.clip(f, 0, 255).astype(np.uint8)

    if vignette or grain:
        f = a.astype(np.float32)
        if vignette:
            f *= _vignette_mask(vignette)
        if grain:
            rng = np.random.default_rng(int(t * 1000) + 7)
            n = rng.standard_normal((H // 2, W // 2)).astype(np.float32)
            n = np.repeat(np.repeat(n, 2, axis=0), 2, axis=1)[:H, :W]
            f += (n * grain * 255.0)[:, :, None]
        a = np.clip(f, 0, 255).astype(np.uint8)

    return Image.fromarray(a, "RGB")


def mist_layer(t, density=0.35, speed=0.03, height=0.45):
    """Soft drifting haze band (used for the mangrove/low-light scenes)."""
    y = np.linspace(0, 1, H, dtype=np.float32)[:, None]
    phase = t * speed
    band = np.exp(-((y - (0.62 + 0.05 * np.sin(t * 0.4))) ** 2) / (2 * 0.18 ** 2))
    x = np.linspace(0, 1, W, dtype=np.float32)[None, :]
    wisp = 0.5 + 0.5 * np.sin(2 * np.pi * (x * 2.4 - phase)) * np.cos(2 * np.pi * (y * 1.6 + phase * 0.6))
    a = band * (0.55 + 0.45 * wisp) * density
    return a


def blend_mist(img, t, density=0.35, colour=(198, 220, 210)):
    a = mist_layer(t, density)
    arr = np.asarray(img, dtype=np.float32)
    c = np.array(colour, dtype=np.float32)
    arr = arr * (1 - a[:, :, None]) + c * a[:, :, None]
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")


def light_sweep(img, t, angle=0.35, speed=1.0):
    """Animated god-ray style sweep across the frame.

    The band is built at 1/6 resolution and upscaled - a smooth gradient costs
    nothing visually at that size, and it turns a full-frame float add into a
    small array plus one C-level image add.
    """
    pos = (t * speed) % 1.6 - 0.3
    h, w = H // 6, W // 6
    nx = (np.arange(w, dtype=np.float32) + 0.5) / w
    ny = (np.arange(h, dtype=np.float32) + 0.5) / h
    proj = nx[None, :] * np.cos(angle) + ny[:, None] * np.sin(angle)
    band = np.exp(-((proj - pos) ** 2) / (2 * 0.10 ** 2)) * 255.0
    band = np.ascontiguousarray(np.clip(band, 0, 255)).astype(np.uint8)
    small = Image.fromarray(band, "L").resize((W, H), Image.BILINEAR)
    add = Image.merge("RGB", (
        small.point(lambda v: int(v * 28 / 255)),
        small.point(lambda v: int(v * 24 / 255)),
        small.point(lambda v: int(v * 12 / 255)),
    ))
    return ImageChops.add(img, add)


def head_scrim(img, strength=0.3, height=0.42):
    """Extra darkening behind the top title block (keeps 6px text crisp)."""
    arr = np.asarray(img, dtype=np.float32)
    y = np.linspace(0, 1, H, dtype=np.float32)
    f = strength * (1 - smoothstep(0.0, height, y))
    arr *= (1 - f[:, None, None])
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")


def scrim(img, top=0.45, bottom=0.6, y0=0.0, y1=1.0):
    """Cinematic gradient scrim so text always reads."""
    arr = np.asarray(img, dtype=np.float32)
    grad = np.zeros((H, 1, 1), dtype=np.float32)
    y = np.linspace(0, 1, H, dtype=np.float32)
    grad[:, 0, 0] = np.clip(top * (1 - smoothstep(0.0, 0.45, y)) +
                            bottom * smoothstep(0.55, 1.0, y), 0, 1)
    arr *= (1 - grad)
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")


# --------------------------------------------------------------- title cards --
def centred_paint(canvas, mask, y, fill, alpha=1.0, shadow=True, glow=None):
    if hasattr(mask, "image"):  # accept a TextLayer directly
        mask = mask.image
    if mask.width <= 1 or alpha <= 0.01:
        return canvas
    x = (W - mask.width) // 2
    T.paint(canvas, mask, (x, int(y)), fill, alpha,
            shadow=(4, 5, (0, 0, 0), 0.62) if shadow else None, glow=glow)
    return canvas


def kicker(canvas, text, y, colour=MINT, alpha=1.0, px=30):
    m = T.flow(text.upper(), "sans-bold", px)
    # letter-spaced feel: draw a small rule either side
    x = (W - m.width) // 2
    T.paint(canvas, m.image, (x, int(y)), colour, alpha, shadow=(2, 2, (0, 0, 0), 0.5))
    d = ImageDraw.Draw(canvas, "RGBA")
    a = int(150 * alpha)
    d.line([x - 90, int(y) + m.image.height // 2, x - 24, int(y) + m.image.height // 2],
           fill=colour + (a,), width=2)
    d.line([x + m.width + 24, int(y) + m.image.height // 2, x + m.width + 90,
            int(y) + m.image.height // 2], fill=colour + (a,), width=2)
    return canvas


def stat_card(canvas, x, y, w, h, alpha=1.0, accent=GOLD, label=None, value=None,
              sub=None, value_px=104):
    """Frosted data card: small label on top, big number below, unit beside it."""
    if alpha <= 0.02:
        return canvas
    layer = Image.new("RGBA", (int(w), int(h)), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.rounded_rectangle([0, 0, int(w) - 1, int(h) - 1], radius=26,
                        fill=(4, 14, 16, int(min(255, 206 * alpha))),
                        outline=accent + (int(190 * alpha),), width=3)
    d.rounded_rectangle([18, 0, int(w) - 18, 3], radius=2,
                        fill=accent + (int(220 * alpha),))
    canvas.paste(layer, (int(x), int(y)), layer)
    if label:
        m = T.flow(label, "sans-semi", 30)
        T.paint(canvas, m.image, (x + 30, y + 22), (176, 226, 208), alpha,
                shadow=(2, 2, (0, 0, 0), 0.45))
    if value:
        pad = 0
        if value.startswith("~") or value.startswith("≈"):
            pad = 0
        mv = T.flow(value, "serif-bold", value_px)
        T.paint(canvas, mv.image, (x + 30, y + h - mv.image.height - 26), accent,
                alpha, shadow=(3, 4, (0, 0, 0), 0.55))
        if sub:
            ms = T.flow(sub, "sans-semi", 32)
            T.paint(canvas, ms.image,
                    (x + 40 + mv.image.width, y + h - ms.image.height - 42),
                    CREAM, alpha * 0.95, shadow=(2, 2, (0, 0, 0), 0.5))
    return canvas


def bar_chart(canvas, x, y, w, h, values, labels, progress=1.0, accent=GOLD,
              alpha=1.0, title=None, subtitle=None, unit=""):
    """Animated bar chart on a frosted panel: growing bars, value + axis labels."""
    if alpha <= 0.02:
        return canvas
    panel = Image.new("RGBA", (int(w), int(h)), (0, 0, 0, 0))
    dp = ImageDraw.Draw(panel)
    dp.rounded_rectangle([0, 0, int(w) - 1, int(h) - 1], radius=30,
                         fill=(4, 14, 16, int(min(255, 214 * alpha))),
                         outline=(150, 240, 210, int(90 * alpha)), width=2)
    canvas.paste(panel, (int(x), int(y)), panel)

    top = y + (118 if title else 54)
    base = y + h - 96
    n = len(values)
    gap = 34
    bw = (w - 120 - gap * (n - 1)) / n
    mx = max(values) * 1.12
    if title:
        m = T.flow(title, "sans-semi", 36)
        T.paint(canvas, m.image, (x + 34, y + 26), CREAM, alpha,
                shadow=(2, 2, (0, 0, 0), 0.5))
    if subtitle:
        m = T.flow(subtitle, "sans", 26)
        T.paint(canvas, m.image, (x + 34, y + 74), (150, 205, 195), alpha * 0.95,
                shadow=(2, 2, (0, 0, 0), 0.4))
    d = ImageDraw.Draw(canvas, "RGBA")
    for i, (v, lab) in enumerate(zip(values, labels)):
        grow = ease_out(np.clip(progress * 1.3 - i * 0.14, 0, 1))
        bh = (v / mx) * (base - top) * grow
        bx = x + 60 + i * (bw + gap)
        last = (i == n - 1)
        col = (255, 128, 98) if last else (96, 196, 182)
        # bar as stacked translucent slices -> soft vertical gradient
        steps = 120
        for k in range(steps):
            f0 = k / steps
            yy0 = base - bh * (1 - f0)
            yy1 = base - bh * (1 - (k + 1) / steps)
            if yy1 <= yy0:
                continue
            a = int((60 + 150 * (1 - f0)) * alpha)
            d.rectangle([bx, yy0, bx + bw, yy1 + 0.6], fill=col + (a,))
        d.line([bx, base - bh, bx + bw, base - bh], fill=col + (int(230 * alpha),), width=3)
        mv = T.flow(str(v), "sans-bold", 40)
        T.paint(canvas, mv.image, (bx + (bw - mv.width) / 2, base - bh - 58),
                CREAM, alpha * grow, shadow=(2, 2, (0, 0, 0), 0.6))
        ml = T.flow(lab, "sans-semi", 30)
        T.paint(canvas, ml.image, (bx + (bw - ml.width) / 2, base + 16),
                (186, 226, 216), alpha, shadow=(2, 2, (0, 0, 0), 0.5))
    d.line([x + 40, base + 3, x + w - 40, base + 3],
           fill=(225, 240, 235, int(80 * alpha)), width=2)
    if unit:
        mu = T.flow(unit, "sans", 24)
        T.paint(canvas, mu.image, (x + w - mu.width - 34, y + 30), (150, 200, 190), alpha * 0.9)
    return canvas


def swim_path(canvas, progress=1.0, alpha=1.0):
    """Dotted travel path with a moving marker (maps the creek crossing)."""
    d = ImageDraw.Draw(canvas, "RGBA")
    pts = [(180, 1180), (330, 1080), (470, 1120), (610, 1000), (770, 1040), (900, 940)]
    n = len(pts) - 1
    segs = max(1, int(n * 24 * progress))
    k = 0
    for i in range(n):
        x0, y0 = pts[i]
        x1, y1 = pts[i + 1]
        for s in range(24):
            if k > segs:
                break
            f = s / 24
            x = x0 + (x1 - x0) * f
            y = y0 + (y1 - y0) * f
            r = 5
            d.ellipse([x - r, y - r, x + r, y + r], fill=(180, 245, 225, int(200 * alpha)))
            k += 1
    # moving marker
    if progress > 0.02:
        idx = min(len(sum([[ (pts[i][0]+(pts[i+1][0]-pts[i][0])*s/24,
                            pts[i][1]+(pts[i+1][1]-pts[i][1])*s/24) for s in range(24)]
                           for i in range(n)], [])),
                  int(len(sum([[ (pts[i][0]+(pts[i+1][0]-pts[i][0])*s/24,
                                 pts[i][1]+(pts[i+1][1]-pts[i][1])*s/24) for s in range(24)]
                                for i in range(n)], [])) * progress))
        path = sum([[ (pts[i][0]+(pts[i+1][0]-pts[i][0])*s/24,
                      pts[i][1]+(pts[i+1][1]-pts[i][1])*s/24) for s in range(24)]
                    for i in range(n)], [])
        px, py = path[max(0, min(idx - 1, len(path) - 1))]
        for rr, aa in ((26, 40), (17, 90), (9, 220)):
            d.ellipse([px - rr, py - rr, px + rr, py + rr], fill=(255, 240, 190, int(aa * alpha)))
        return px, py
    return pts[0]


def spotlight(canvas, cx, cy, radius, strength=0.55):
    """Darken everything except a soft ellipse (macro focus moments)."""
    a = np.asarray(canvas, dtype=np.float32)
    d = np.sqrt(((_XX - cx) / radius) ** 2 + ((_YY - cy) / (radius * 1.15)) ** 2)
    m = 1 - strength * (1 - np.exp(-(d ** 2)))
    a *= m[:, :, None]
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGB")


def zoom_rings(canvas, cx, cy, t, alpha=0.5, count=3):
    d = ImageDraw.Draw(canvas, "RGBA")
    for i in range(count):
        phase = (t * 0.55 + i / count) % 1
        r = 120 + phase * 420
        a = int(alpha * 160 * (1 - phase))
        d.ellipse([cx - r, cy - r * 1.1, cx + r, cy + r * 1.1],
                  outline=(255, 222, 150, a), width=3)
    return canvas


def match_exposure(img, target=108.0, max_gamma=2.6, iters=3):
    """Pull every frame onto the reference reels' average brightness.

    Gamma on the mean is not the mean after gamma, so the correction is
    applied iteratively until the measured frame actually lands on target.
    """
    a = np.asarray(img, dtype=np.float32) / 255.0
    w = np.array([0.299, 0.587, 0.114], dtype=np.float32)
    for _ in range(iters):
        cur = float((a @ w).mean()) * 255.0
        if abs(cur - target) < 1.5:
            break
        g = np.log(max(target, 1.0) / 255.0) / np.log(max(min(cur / 255.0, 0.999), 0.002))
        a = np.power(np.clip(a, 0, 1), float(np.clip(g, 1.0 / max_gamma, max_gamma)))
    return Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8), "RGB")


def vibrance(img, amount=0.18):
    """Lift weak colours without pushing the already-saturated petals."""
    a = np.asarray(img, dtype=np.float32) / 255.0
    mx = a.max(axis=2)
    mn = a.min(axis=2)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0.0)[:, :, None]
    boost = 1.0 + amount * (1.0 - sat) ** 2
    g = a @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    out = g[:, :, None] + (a - g[:, :, None]) * boost
    return Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8), "RGB")


def text_backing(img, mask, xy, strength=0.62, blur=16, offset=(4, 7), spread=34):
    """Text-shaped soft shade behind type - never a rectangular plate.

    Two passes: a tight pass that holds the glyph edges, and a wide, very soft
    pass that calms the busy photo under the line. Both follow the glyph
    silhouette, so it reads as depth of field rather than a pasted box.
    """
    x, y = int(xy[0] + offset[0]), int(xy[1] + offset[1])
    tight = mask.filter(ImageFilter.GaussianBlur(blur))
    m1 = Image.new("L", tight.size, 0)
    m1.paste(Image.new("L", tight.size, int(255 * strength)), (0, 0), tight)
    img = shade_patch(img, m1, (x, y))
    wide = mask.filter(ImageFilter.MaxFilter(5)).filter(
        ImageFilter.GaussianBlur(blur * 2.4))
    m2 = Image.new("L", wide.size, 0)
    m2.paste(Image.new("L", wide.size, int(255 * strength * 0.55)), (0, 0), wide)
    return shade_patch(img, m2, (x - spread // 3, y - spread // 3))


def shade_patch(img, mask, xy):
    """Multiply a mask-shaped darkening onto the frame at xy."""
    x, y = int(xy[0]), int(xy[1])
    w, h = mask.size
    x0, y0 = max(0, x), max(0, y)
    x1, y1 = min(img.width, x + w), min(img.height, y + h)
    if x1 <= x0 or y1 <= y0:
        return img
    sub = mask.crop((x0 - x, y0 - y, x1 - x, y1 - y))
    a = np.asarray(img.crop((x0, y0, x1, y1)), dtype=np.float32)
    k = np.asarray(sub, dtype=np.float32)[:, :, None] / 255.0
    a *= (1.0 - k)
    out = img.copy()
    out.paste(Image.fromarray(a.astype(np.uint8), "RGB"), (x0, y0))
    return out


def sharpen(img, amount=0.42, radius=2.0):
    """Unsharp mask - the reference reels look crisp, ours looked soft."""
    a = np.asarray(img, dtype=np.float32)
    b = np.asarray(img.filter(ImageFilter.GaussianBlur(radius)), dtype=np.float32)
    return Image.fromarray(np.clip(a + (a - b) * amount, 0, 255).astype(np.uint8), "RGB")


def sat_boost(img, k=1.30):
    a = np.asarray(img, dtype=np.float32) / 255.0
    g = a @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    return Image.fromarray(
        (np.clip(g[:, :, None] + (a - g[:, :, None]) * k, 0, 1) * 255).astype(np.uint8), "RGB")


def lift_shadows(img, amount=0.14, pivot=0.42):
    """Open the bottom end so nothing reads as a black hole."""
    a = np.asarray(img, dtype=np.float32) / 255.0
    k = 1.0 - amount
    a = a * k + amount * (a ** 0.72)
    a = np.clip(a * (1.0 - 0.0), 0, 1)
    return Image.fromarray((a * 255).astype(np.uint8), "RGB")


def finish(img, target=108.0, sat=1.30, sharp=0.42):
    """Final look: open shadows, saturate, sharpen, land on reference exposure."""
    img = lift_shadows(img, 0.13)
    img = sat_boost(img, sat)
    img = img.filter(ImageFilter.GaussianBlur(0))  # no-op keeps PIL API happy
    img = sharpen(img, sharp, 2.0)
    img = match_exposure(img, target)
    return img


# ------------------------------------------------------------ fast pipeline --
_LUT = np.arange(256, dtype=np.float32) / 255.0


def _box_blur(a, r=2):
    """Separable box blur on a float32 HxWx3 array.

    Built from cumulative sums; the padding is done with edge-clamped index
    arrays instead of np.pad, which was the slowest line in this pass.
    """
    k = 2 * r + 1
    h, w = a.shape[:2]
    iy = np.concatenate([np.zeros(r, int), np.arange(h), np.full(r, h - 1)])
    c = np.cumsum(a[iy], axis=0, dtype=np.float32)
    c = np.concatenate([np.zeros((1, w, 3), np.float32), c], axis=0)
    a = (c[k:] - c[:-k]) * (1.0 / k)
    ix = np.concatenate([np.zeros(r, int), np.arange(w), np.full(r, w - 1)])
    c = np.cumsum(a[:, ix], axis=1, dtype=np.float32)
    c = np.concatenate([np.zeros((h, 1, 3), np.float32), c], axis=1)
    return (c[:, k:] - c[:, :-k]) * (1.0 / k)


def finish_fast(img, target=108.0, sat=1.28, sharp=0.9):
    """The `finish()` look in three vectorised passes.

    Shadow lift and exposure compose into a single 256-entry table, so the
    frame is touched once; saturation and unsharp then share one float pass.
    """
    arr = np.asarray(img)
    u8 = np.arange(256, dtype=np.float32)
    w = np.array([0.299, 0.587, 0.114], dtype=np.float32)

    lift = 0.13
    v = np.clip(u8 / 255.0 * (1 - lift) + lift * np.power(u8 / 255.0, 0.72), 0, 1)
    tbl = v * 255.0                                  # values 0..255, float

    for _ in range(3):
        # measure on a 1/8 sampling of the frame through the current table
        cur = float(tbl[arr[::8, ::8]].astype(np.float32).mean()) / 255.0
        if abs(cur * 255.0 - target) < 1.2:
            break
        g = np.log(max(target, 1.0) / 255.0) / np.log(max(min(cur, 0.999), 0.002))
        g = float(np.clip(g, 1.0 / 2.6, 2.6))
        tbl = np.power(tbl / 255.0, g) * 255.0

    lut = np.clip(tbl, 0, 255).astype(np.uint8)
    out = np.empty(arr.shape, dtype=np.uint8)
    out[..., 0] = lut[arr[..., 0]]
    out[..., 1] = lut[arr[..., 1]]
    out[..., 2] = lut[arr[..., 2]]

    f = out.astype(np.float32)
    if sat != 1.0:
        g = f @ w
        f = g[:, :, None] + (f - g[:, :, None]) * sat
    if sharp:
        f = f + (f - _box_blur(f, 2)) * sharp
    return Image.fromarray(np.clip(f, 0, 255).astype(np.uint8), "RGB")
