"""Light-palette ad kit for the 3-watch combo (cream stage, navy type, caramel accent)."""
from __future__ import annotations
import os, sys, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "v3"))
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import rbtext as T

FPS = 30
SCALE = 2
W, H = 1080 * SCALE, 1920 * SCALE
SRC = os.path.join(HERE, "src")

# palette ---------------------------------------------------------------
NAVY = (22, 35, 58)
NAVY_SOFT = (58, 74, 100)
CARAMEL = (176, 128, 60)
CARAMEL_LT = (214, 172, 106)
CREAM = (247, 242, 232)
CREAM_HI = (253, 250, 244)
SAND = (233, 223, 203)
WHITE = (255, 255, 255)


def ss(a, b, x):
    if b <= a: return 1.0 if x >= b else 0.0
    t = min(1.0, max(0.0, (x - a) / (b - a)))
    return t * t * (3 - 2 * t)


# ---------------------------------------------------------------- sources --
def load(name):
    return Image.open(os.path.join(SRC, name)).convert("RGB")


def crop_frac(im, box):
    w, h = im.size
    x0, y0, x1, y1 = box
    return im.crop((int(x0 * w), int(y0 * h), int(x1 * w), int(y1 * h)))


def highkey(im, expo=1.24, sat=0.82, warm=0.012):
    """Bright, clean, slightly warm grade — reads as daylight studio, not phone."""
    a = np.asarray(im, np.float32) / 255.0
    a = np.clip(a * expo, 0, 1)
    a = 1 - (1 - a) ** 1.55
    g = a.mean(axis=2, keepdims=True)
    a = np.clip(g + (a - g) * sat, 0, 1)
    a[..., 0] = np.clip(a[..., 0] * (1 + warm), 0, 1)
    a[..., 2] = np.clip(a[..., 2] * (1 - warm), 0, 1)
    return Image.fromarray((a * 255).astype(np.uint8), "RGB")


def veil(im, box, pad=0.0):
    """Soft-focus a region (fractions) — used to de-emphasise a mark we don't want to show."""
    w, h = im.size
    x0, y0, x1, y1 = box
    bx0, by0 = int((x0 - pad) * w), int((y0 - pad) * h)
    bx1, by1 = int((x1 + pad) * w), int((y1 + pad) * h)
    reg = im.crop((bx0, by0, bx1, by1)).filter(
        ImageFilter.GaussianBlur(min(bx1 - bx0, by1 - by0) / 4.2))
    m = Image.new("L", reg.size, 0)
    d = ImageDraw.Draw(m)
    d.ellipse([0, 0, reg.size[0] - 1, reg.size[1] - 1], fill=255)
    m = m.filter(ImageFilter.GaussianBlur(min(reg.size) * 0.30))
    out = im.copy()
    out.paste(reg, (bx0, by0), m)
    return out


def glare(im, center, radii, angle=-26.0, strength=0.95, soft=0.05):
    """Elliptical specular glare (no rectangular edges): blurs and lifts a region toward white.

    Used where a mark on the dial should not be the focus — it reads as a normal
    reflection on the crystal rather than as a patch.
    """
    w, h = im.size
    cx, cy = center[0] * w, center[1] * h
    rx, ry = radii[0] * w, radii[1] * h
    bx0, by0 = int(cx - rx * 1.25), int(cy - ry * 1.25)
    bx1, by1 = int(cx + rx * 1.25), int(cy + ry * 1.25)
    bx0, by0 = max(0, bx0), max(0, by0)
    bx1, by1 = min(w, bx1), min(h, by1)
    bw, bh = bx1 - bx0, by1 - by0
    yy, xx = np.mgrid[0:bh, 0:bw].astype(np.float32)
    gx, gy = bx0 + xx - cx, by0 + yy - cy
    a = math.radians(angle)
    u = (gx * math.cos(a) + gy * math.sin(a)) / rx
    v = (-gx * math.sin(a) + gy * math.cos(a)) / ry
    d = np.sqrt(u * u + v * v)
    m = np.clip((1.0 - d) / 0.55, 0, 1) ** 1.5 * strength
    m = (np.clip(m, 0, 1) * 255).astype(np.uint8)
    mask = Image.fromarray(m, "L").filter(ImageFilter.GaussianBlur(min(bw, bh) * soft))
    reg = im.crop((bx0, by0, bx1, by1))
    soft_reg = reg.filter(ImageFilter.GaussianBlur(min(bw, bh) * 0.10))
    reg = Image.composite(soft_reg, reg, mask.point(lambda x: int(x * 0.9)))
    white = Image.new("RGB", (bw, bh), (255, 253, 247))
    reg = Image.composite(white, reg, mask.point(lambda x: int(x * 0.68)))
    out = im.copy()
    out.paste(reg, (bx0, by0))
    return out


def cover(im, w, h):
    f = max(w / im.width, h / im.height)
    im = im.resize((int(im.width * f) + 1, int(im.height * f) + 1), Image.LANCZOS)
    cx, cy = (im.width - w) // 2, (im.height - h) // 2
    return im.crop((cx, cy, cx + w, cy + h))


def stage(w=W, h=H, top=CREAM_HI, bot=SAND):
    yy = np.linspace(0, 1, h, dtype=np.float32)[:, None]
    a = np.zeros((h, w, 3), np.float32)
    for c in range(3):
        a[..., c] = top[c] * (1 - yy) + bot[c] * yy
    img = Image.fromarray(a.astype(np.uint8), "RGB")
    # soft key light from upper left
    yy2, xx2 = np.mgrid[0:h:8, 0:w:8].astype(np.float32)
    d = np.sqrt(((xx2 / w - 0.22) / 0.75) ** 2 + ((yy2 / h - 0.06) / 0.62) ** 2)
    m = (np.clip(1 - d, 0, 1) ** 2 * 150).astype(np.uint8)
    m = Image.fromarray(m, "L").resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(30 * SCALE))
    img.paste(Image.new("RGB", img.size, (255, 253, 246)), (0, 0), m)
    return img


def lift_shadow(bg, box, radius=26, strength=90, colour=(146, 122, 84), blur=None, rounded=None):
    sh = Image.new("L", bg.size, 0)
    d = ImageDraw.Draw(sh)
    x0, y0, x1, y1 = box
    if rounded:
        d.rounded_rectangle([x0, y0, x1, y1], radius=rounded, fill=strength)
    else:
        d.rectangle([x0, y0, x1, y1], fill=strength)
    sh = sh.filter(ImageFilter.GaussianBlur(blur if blur else radius))
    bg.paste(Image.new("RGB", bg.size, colour), (0, 0), sh)
    return bg


def panel(im, w, h, radius=0.055, expo=1.24, sat=0.82):
    """Rounded photo panel filled edge-to-edge (cover) with a light grade."""
    im = cover(im, w, h)
    im = highkey(im, expo=expo, sat=sat)
    r = int(min(w, h) * radius) if radius < 1 else int(radius)
    m = Image.new("L", (w * 2, h * 2), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, w * 2 - 1, h * 2 - 1], radius=r * 2, fill=255)
    m = m.resize((w, h), Image.LANCZOS)
    return im, m


def place_panel(bg, im, m, x, y, shadow=95, sblur=None):
    w, h = m.size
    lift_shadow(bg, (x + int(w * 0.02), y + int(h * 0.03), x + w - int(w * 0.02), y + h + int(h * 0.012)),
                 rounded=int(min(w, h) * 0.15), strength=shadow, blur=sblur or int(min(w, h) * 0.05))
    bg.paste(im, (x, y), m)
    return bg


def circle_photo(im, size, ring=True, ring_col=CARAMEL_LT, ring_w=3):
    im = cover(im, size, size)
    im = highkey(im)
    m = Image.new("L", (size * 2, size * 2), 0)
    ImageDraw.Draw(m).ellipse([0, 0, size * 2 - 1, size * 2 - 1], fill=255)
    m = m.resize((size, size), Image.LANCZOS)
    return im, m


def place_circle(bg, im, m, x, y, ring=True, shadow=90, ring_w=3, ring_col=None):
    s = m.size[0]
    lift_shadow(bg, (x + s * 0.04, y + s * 0.06, x + s * 0.96, y + s * 1.02),
                 rounded=s // 2, strength=shadow, blur=int(s * 0.06))
    bg.paste(im, (x, y), m)
    if ring:
        ov = Image.new("RGBA", (s + 12, s + 12), (0, 0, 0, 0))
        ImageDraw.Draw(ov).ellipse([3, 3, s + 8, s + 8], outline=(ring_col or CARAMEL_LT) + (200,), width=max(2, ring_w * SCALE))
        bg.paste(ov, (x - 6, y - 6), ov)
    return bg


# ------------------------------------------------------------------ type ---
def txt(canvas, s, key, px, xy, fill=NAVY, alpha=1.0, align="left", anchor_y="top"):
    mask, base = T.line(s, key, px)
    x, y = xy
    if align == "center":
        x = x - mask.width / 2
    elif align == "right":
        x = x - mask.width
    if anchor_y == "middle":
        y = y - mask.height / 2
    elif anchor_y == "baseline":
        y = y - base
    T.paint(canvas, mask, (x, y), fill, alpha=alpha)
    return mask, base


def measure(s, key, px):
    m, base = T.line(s, key, px)
    return m.width, m.height, base


def chip(canvas, s, key, px, xy, fill=CARAMEL, fg=WHITE, pad_x=26, pad_y=12, align="left", radius=None,
         bg_colour=None, alpha=1.0):
    m, base = T.line(s, key, px)
    mw, mh = m.width, m.height
    bw, bh = mw + pad_x * 2, mh + pad_y * 2
    x, y = xy
    if align == "center":
        x -= bw / 2
    elif align == "right":
        x -= bw
    r = radius if radius is not None else bh / 2
    lay = Image.new("RGBA", (int(bw) + 4, int(bh) + 4), (0, 0, 0, 0))
    ImageDraw.Draw(lay).rounded_rectangle([0, 0, bw, bh], radius=r, fill=(bg_colour or fill) + (int(255 * alpha),))
    canvas.paste(lay, (int(x), int(y)), lay)
    T.paint(canvas, m, (x + pad_x, y + pad_y), fg)
    return bw, bh


def hairline(canvas, x0, x1, y, colour=CARAMEL, w=2, alpha=255):
    lay = Image.new("RGBA", (int(x1 - x0) + 2, w + 2), (0, 0, 0, 0))
    ImageDraw.Draw(lay).rectangle([0, 0, x1 - x0, w], fill=colour + (alpha,))
    canvas.paste(lay, (int(x0), int(y)), lay)


def dot(canvas, x, y, r, colour=CARAMEL, alpha=255):
    lay = Image.new("RGBA", (r * 2 + 2, r * 2 + 2), (0, 0, 0, 0))
    ImageDraw.Draw(lay).ellipse([0, 0, r * 2, r * 2], fill=colour + (alpha,))
    canvas.paste(lay, (int(x - r), int(y - r)), lay)
