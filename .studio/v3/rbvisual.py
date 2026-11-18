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
from PIL import Image, ImageDraw, ImageFilter

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


def apply_grade(img, warm=0.0, cool=0.0, contrast=1.06, lift=0.0, vignette=0.0,
                grain=0.0, t=0.0):
    a = np.asarray(img, dtype=np.float32) / 255.0
    if warm:
        a[:, :, 0] *= 1 + 0.10 * warm
        a[:, :, 1] *= 1 + 0.03 * warm
        a[:, :, 2] *= 1 - 0.08 * warm
    if cool:
        a[:, :, 2] *= 1 + 0.12 * cool
        a[:, :, 0] *= 1 - 0.05 * cool
    a = (a - 0.5) * contrast + 0.5 + lift
    if vignette:
        d = np.sqrt(((_NX - 0.5) * 1.15) ** 2 + ((_NY - 0.5) * 0.95) ** 2)
        v = 1 - vignette * smoothstep(0.28, 0.78, d)
        a *= v[:, :, None]
    if grain:
        rng = np.random.default_rng(int(t * 1000) + 7)
        n = rng.standard_normal((H // 2, W // 2)).astype(np.float32)
        n = np.repeat(np.repeat(n, 2, axis=0), 2, axis=1)[:H, :W]
        a += (n * grain)[:, :, None]
    return Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8), "RGB")


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
    """Animated god-ray style sweep across the frame."""
    pos = (t * speed) % 1.6 - 0.3
    proj = _NX * np.cos(angle) + _NY * np.sin(angle)
    band = np.exp(-((proj - pos) ** 2) / (2 * 0.10 ** 2))
    arr = np.asarray(img, dtype=np.float32)
    arr += band[:, :, None] * np.array([28, 24, 12], dtype=np.float32)
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")


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
