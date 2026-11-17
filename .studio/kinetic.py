"""Motion-graphic primitives: one card at a time, baseline-anchored type."""
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

import rbtext as T
from rbvisual import W, H

LOGO_COLOUR = os.environ.get("RB_LOGO",
    "/home/user/ruposhibangla/.studio/assets/logo-mark.png")
_LOGO_IMG = None
_LOGO_KNOCK = None


# ------------------------------------------------------------------ easing ---
def ss(a, b, x):
    if b <= a:
        return 1.0 if x >= b else 0.0
    t = min(1.0, max(0.0, (x - a) / (b - a)))
    return t * t * (3 - 2 * t)


def eio(x):
    x = min(1.0, max(0.0, x))
    return 0.5 - 0.5 * np.cos(np.pi * x)


def eo(x):
    x = min(1.0, max(0.0, x))
    return 1 - (1 - x) ** 3


def ei(x):
    x = min(1.0, max(0.0, x))
    return x ** 3


def pop(x):
    x = min(1.0, max(0.0, x))
    return eo(x) + np.sin(x * np.pi) * 0.07 * (1 - x)


# ------------------------------------------------------------------- brand ---
def _rgba_logo():
    """Colour logo with a soft alpha (white background knocked out)."""
    global _LOGO_IMG
    if _LOGO_IMG is None:
        path = LOGO_COLOUR
        src = Image.open(path).convert("RGB")
        a = np.asarray(src, dtype=np.float32) / 255.0
        lum = a @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
        alpha = np.clip((0.99 - lum) / (0.99 - 0.86), 0, 1) ** 0.85
        alpha = np.minimum(1.0, alpha * 1.06)
        yy, xx = np.mgrid[0:a.shape[0], 0:a.shape[1]].astype(np.float32)
        c = a.shape[0] / 2
        r = np.sqrt((xx - c) ** 2 + (yy - c) ** 2) / (a.shape[0] * 0.507)
        alpha *= np.clip((1.06 - r) / 0.10, 0, 1)
        im = Image.fromarray(np.dstack([a * 255, alpha * 255]).astype(np.uint8), "RGBA")
        bb = im.split()[-1].point(lambda v: 255 if v > 8 else 0).getbbox()
        im = im.crop(bb)
        side = max(im.size) + 8
        pad = Image.new("RGBA", (side, side), (255, 255, 255, 0))
        pad.paste(im, ((side - im.width) // 2, (side - im.height) // 2))
        _LOGO_IMG = pad
    return _LOGO_IMG


def logo_mark(size=120, knockout=False):
    """knockout=True -> flat cream monochrome (reads on any photo)."""
    src = _rgba_logo()
    im = src.resize((int(size), int(size)), Image.LANCZOS)
    if knockout:
        a = np.asarray(im, dtype=np.float32)
        al = a[:, :, 3:] / 255.0
        col = np.array([255, 248, 236], dtype=np.float32)
        a[:, :, :3] = col
        return Image.fromarray(np.dstack([a[:, :, :3], al * 255]).astype(np.uint8), "RGBA")
    return im


def brand_lockup(img, xy, alpha, size=50, name_px=24, name="রূপসী বাংলা"):
    """Small persistent mark + wordmark, top-right."""
    if alpha <= 0.01:
        return
    x, y = int(xy[0]), int(xy[1])
    ov = Image.new("RGBA", img.size, (0, 0, 0, 0))
    mark = logo_mark(size)
    # ivory disc + soft shadow so the lockup reads on any photograph
    lay_m = T.flow(name, "serif-bold", name_px)
    sp = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ds = ImageDraw.Draw(sp)
    pad = int(size * 0.16)
    ds.rounded_rectangle([x - pad, y - pad, x + size + 20 + lay_m.width, y + size + pad],
                         radius=int(size * 0.5), fill=(6, 8, 6, int(110 * alpha)))
    ov.alpha_composite(sp.filter(ImageFilter.GaussianBlur(14)))
    disc = Image.new("RGBA", img.size, (0, 0, 0, 0))
    dd = ImageDraw.Draw(disc)
    r = size * 0.60
    cxx, cyy = x + size / 2, y + size / 2
    dd.ellipse([cxx - r, cyy - r, cxx + r, cyy + r],
               fill=(250, 246, 238, int(238 * alpha)))
    ov.alpha_composite(disc)
    lay = T.flow(name, "serif-bold", name_px)
    if alpha < 0.99:
        mark = mark.copy()
        mark.putalpha(mark.split()[-1].point(lambda v: int(v * alpha)))
        lay_img = lay.image.point(lambda v: int(v * alpha))
    else:
        lay_img = lay.image
    ov.alpha_composite(mark, (x, y))
    col = Image.new("RGBA", lay_img.size, (255, 248, 236, 255))
    col.putalpha(lay_img)
    ov.alpha_composite(col, (x + size + 10, int(y + size / 2 - lay.baseline + 1)))
    base = Image.alpha_composite(img.convert("RGBA"), ov)
    img.paste(base.convert("RGB"), (0, 0))


def logo_burst(img, centre, e, size=232, payoff="রূপসী বাংলা", sub=None):
    cx, cy = centre
    ov = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    for i in range(3):
        q = min(1.0, max(0.0, (e - i * 0.10) / 0.62))
        if q <= 0:
            continue
        r = size * (0.5 + 1.35 * eo(q))
        d.ellipse([cx - r, cy - r, cx + r, cy + r],
                  outline=(255, 214, 140, int(95 * (1 - q) ** 1.5)),
                  width=max(1, int(4 * (1 - q)) + 1))
    q = ss(0.0, 0.55, e)
    if q > 0:
        r = size * 0.55
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(250, 246, 238, int(240 * q)))
    out = Image.alpha_composite(img.convert("RGBA"), ov)

    s = size * (0.70 + 0.30 * eo(min(1.0, e / 0.5)) + 0.03 * np.sin(min(1.0, e / 0.5) * np.pi))
    if e > 0:
        m = logo_mark(int(s))
        a = np.asarray(m.split()[-1], dtype=np.float32) / 255.0 * min(1.0, e / 0.30)
        m.putalpha(Image.fromarray((a * 255).astype(np.uint8), "L"))
        out.alpha_composite(m, (int(cx - s / 2), int(cy - s / 2)))

    if e > 0.28:
        p = min(1.0, (e - 0.28) / 0.52)
        lay = T.flow(payoff, "serif-bold", 78)
        lay_s = T.flow(sub, "sans", 28) if sub else None
        ty = int(cy + size * 0.55 + 26)
        band_w = max(lay.image.width, lay_s.image.width if lay_s else 0) + 116
        band_h = lay.image.height + 26 + (lay_s.image.height + 34 if lay_s else 0)
        rise = 24
        # same language as the body cards: soft dark scrim, cream type, gold rule
        pl = Image.new("RGBA", out.size, (0, 0, 0, 0))
        dp = ImageDraw.Draw(pl)
        dp.rounded_rectangle([cx - band_w / 2, ty - 18 + rise,
                              cx + band_w / 2, ty + band_h + rise],
                             radius=44, fill=(12, 14, 10, 150))
        scrim = pl.filter(ImageFilter.GaussianBlur(34))
        scrim.putalpha(scrim.split()[-1].point(lambda v: int(v * eo(min(1.0, p * 1.6)))))
        out.alpha_composite(scrim)

        q1 = ss(0.08, 0.60, p)
        if q1 > 0.002:
            rev = max(1, int(lay.image.width * eo(q1)))
            col = Image.new("RGBA", (rev, lay.image.height), (255, 250, 240, 255))
            col.putalpha(lay.image.crop((0, 0, rev, lay.image.height)))
            out.alpha_composite(col, (int(cx - lay.image.width / 2),
                                      int(ty + (1 - eo(q1)) * rise)))
            if q1 > 0.5:
                rw = int(band_w * 0.46 * ss(0.5, 1.0, q1))
                d2 = ImageDraw.Draw(out)
                yy = ty + lay.baseline + 14
                d2.rounded_rectangle([cx - rw / 2, yy, cx + rw / 2, yy + 3], radius=2,
                                     fill=(255, 206, 106, int(210 * q1)))
        if lay_s and p > 0.40:
            q2 = ss(0.40, 0.94, p)
            cs = Image.new("RGBA", lay_s.image.size, (208, 228, 176, 255))
            cs.putalpha(lay_s.image.point(lambda v: int(v * q2)))
            out.alpha_composite(cs, (int(cx - lay_s.image.width / 2),
                                     int(ty + lay.image.height + 22 + (1 - eo(q2)) * 12)))
    img.paste(out.convert("RGB"), (0, 0))


# ============================================================ motion primitives
# Ported from the মাছরাঙা / মেছো বিড়াল renderer so every reel shares one
# animation language: chips slide in, panels are dark glass, lines rise, titles
# wipe up from the baseline, verse reveals word by word.


def glass(img, box, e=1.0, radius=26, alpha=0.55, pad=22, blur=8):
    """Soft darkened glass panel (reads as depth, never as a black box)."""
    if e <= 0.01:
        return img
    x0, y0, x1, y1 = box
    x0, y0 = int(x0 - pad), int(y0 - pad)
    x1, y1 = int(x1 + pad), int(y1 + pad)
    w, h = max(2, x1 - x0), max(2, y1 - y0)
    region = img.crop((x0, y0, x1, y1)).filter(ImageFilter.GaussianBlur(blur))
    dark = Image.new("RGB", (w, h), (4, 11, 12))
    region = Image.blend(region, dark, min(0.9, alpha + 0.22))
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, w - 1, h - 1], radius=radius,
                                           fill=int(255 * min(1.0, e)))
    img.paste(region, (x0, y0), mask)
    d = ImageDraw.Draw(img, "RGBA")
    d.rounded_rectangle([x0, y0, x1, y1], radius=radius,
                        outline=(255, 240, 210, int(42 * e)), width=2)
    return img


def text(img, txt, key, px, xy, fill, e=1.0, enter="rise", dx=0, dy=26,
         shadow=(4, 5, (0, 3), 0.6), glow=None, wipe=False, center=None,
         baseline=False):
    """One line with an entry: rise | slide | pop | wipe | none."""
    if e <= 0.005:
        return img
    lay = T.flow(txt, key, px)
    if lay.width <= 1:
        return img
    x, y = float(xy[0]), float(xy[1])
    if center is None:
        center = (xy[0] == 0)
    if center:
        x = (W - lay.width) / 2
    if baseline:
        y -= lay.baseline
    a = min(1.0, e)
    if enter == "rise":
        y += dy * (1 - eo(e))
    elif enter == "slide":
        x += dx * (1 - eo(e))
    elif enter == "pop":
        y += dy * 0.4 * (1 - pop(e))
    if wipe:
        kk = max(1, int(lay.height * eo(e)))
        cut = lay.image.crop((0, lay.height - kk, lay.width, lay.height))
        img.paste(Image.new("RGB", cut.size, tuple(fill)[:3]),
                  (int(x), int(y + lay.height - kk)), cut)
        return img
    T.paint(img, lay, (x, y), fill, a, glow=glow,
            shadow=None if shadow is None else (shadow[0], shadow[3], shadow[2]))
    return img


def word_line(img, txt, key, px, base_y, fill, t, stagger=0.095, dur=0.30,
              rise=26, shadow=(4, 5, (0, 3), 0.6), center_x=True, x0=None):
    """Word-by-word kinetic reveal on a shared baseline. `t` is seconds."""
    sh = T.Shaper(key, px)
    words = txt.split(" ")
    widths = [sh.advance(w) for w in words]
    space = sh.advance(" ")
    total = sum(widths) + space * max(0, len(words) - 1)
    left = (W - total) / 2 if center_x else (x0 or 0)
    x = left
    for i, (wd, ww) in enumerate(zip(words, widths)):
        ee = ss(0, 1, (t - i * stagger) / dur)
        if ee > 0.004:
            lay = T.flow(wd, key, px)
            yy = base_y - lay.baseline
            T.paint(img, lay, (int(x), int(yy + rise * (1 - eo(ee)))), fill, ee,
                    shadow=(shadow[0], shadow[3], shadow[2]))
        x += ww + space
    return total, left


def underline(img, x, y, w, e, colour=(255, 214, 122)):
    if e <= 0.01:
        return img
    d = ImageDraw.Draw(img, "RGBA")
    seg = w * eo(e)
    d.rounded_rectangle([x, y, x + seg, y + 5], radius=3, fill=colour + (235,))
    d.rounded_rectangle([x, y + 9, x + seg * 0.45, y + 12], radius=2,
                        fill=colour + (150,))
    return img


def chip(img, txt, xy, e, key="sans-semi", px=30, colour=(170, 245, 205),
         bg=(6, 22, 20, 205), slide=34, icon="dot"):
    """Label pill that slides in from the left with a dot/warn glyph."""
    if e <= 0.005:
        return img
    lay = T.flow(txt, key, px)
    padx, pady = 26, 13
    w = int(lay.width + padx * 2 + (30 if icon else 0))
    h = int(lay.image.height + pady * 2)
    x = int(xy[0] + (1 - eo(e)) * slide)
    y = int(xy[1])
    ov = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    d.rounded_rectangle([x, y, x + w, y + h], radius=h // 2,
                        fill=(bg[0], bg[1], bg[2], int(bg[3] * min(1.0, e * 1.3))),
                        outline=(colour[0], colour[1], colour[2], int(110 * e)), width=2)
    if icon:
        cx, cy = x + padx + 6, y + h / 2
        if icon == "warn":
            d.polygon([(cx, cy - 9), (cx + 10, cy + 8), (cx - 10, cy + 8)],
                      outline=colour + (int(230 * e),), width=2)
        else:
            d.ellipse([cx - 5, cy - 5, cx + 5, cy + 5], fill=colour + (int(240 * e),))
    col = Image.new("RGBA", lay.image.size, (colour[0], colour[1], colour[2], 255))
    col.putalpha(lay.image.point(lambda v: int(v * min(1.0, e * 1.4))))
    ov.alpha_composite(col, (int(x + padx + (30 if icon else 0)), int(y + pady)))
    base = Image.alpha_composite(img.convert("RGBA"), ov)
    img.paste(base.convert("RGB"), (0, 0))
    return img


# --------------------------------------------------------------- text card ---
def _plate(img, box, e, alpha=0.62, radius=24):
    """Soft feathered scrim: grows from the centre, never shows a hard edge."""
    if e <= 0.004:
        return
    x0, y0, x1, y1 = box
    p = eo(min(1.0, e * 1.25))
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    sx = (x1 - x0) / 2 * (0.62 + 0.38 * p)
    sy = (y1 - y0) / 2 * (0.62 + 0.38 * p)
    ov = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    d.rounded_rectangle([cx - sx, cy - sy, cx + sx, cy + sy],
                        radius=min(radius, sy * 0.8),
                        fill=(12, 13, 10, int(255 * min(1.0, alpha * 1.28) * p)))
    fe = int(min(26, max(9, min(sx, sy) * 0.26)))
    bl = ov.filter(ImageFilter.GaussianBlur(fe))
    base = Image.alpha_composite(img.convert("RGBA"), bl)
    img.paste(base.convert("RGB"), (0, 0))


def _fit(txt, key, px, max_w):
    """Shrink the type until the line fits, so Bengali never clips at the edge."""
    p = px
    lay = T.flow(txt, key, p)
    while lay.width > max_w and p > 18:
        p -= 2
        lay = T.flow(txt, key, p)
    return lay, p


def card(img, spec, e, out=1.0):
    """Draw ONE text card.

    spec: {items: [(kind, (font, px, text[, colour]))], cy, align, x, plate}
    e   : entry progress 0..1 for the card; out -> 0 while the card leaves.
    """
    a = min(1.0, e * 1.5) * out
    if a <= 0.006:
        return
    items = spec["items"]
    cy = spec.get("cy", 0.52)
    if cy <= 1.0:
        cy = cy * H
    align = spec.get("align", "center")
    x_left = spec.get("x", 96)
    margin = spec.get("margin", 84)
    max_w = (W - 2 * margin) if align == "center" else (W - x_left - margin)

    lays = []
    for kind, payload in items:
        key, px, txt = payload[0], payload[1], payload[2]
        colour = payload[3] if len(payload) > 3 else (255, 250, 242)
        lay, used = _fit(txt, key, px, max_w)
        gap = {"title": used * 0.22, "sub": used * 0.30, "num": used * 0.12,
               "quote": used * 0.14, "row": used * 0.24, "eyebrow": used * 0.10,
               "attr": used * 0.30, "chip": used * 0.18}[kind]
        lays.append((kind, lay, colour, gap, used))

    total = sum(l.height + g for _, l, _, g, _ in lays)
    y = cy - total / 2
    if spec.get("plate", True):
        pad_y, pad_x = 44, 40
        if align == "center":
            wmax = max(l.width for _, l, _, _, _ in lays)
            box = (W / 2 - wmax / 2 - pad_x, y - pad_y,
                   W / 2 + wmax / 2 + pad_x, y + total + pad_y)
        else:
            wmax = max(l.width for _, l, _, _, _ in lays)
            box = (x_left - pad_x, y - pad_y, x_left + wmax + pad_x, y + total + pad_y)
        # the scrim follows the photograph: cream type needs more shade over a
        # bright petal than over a dark pond, so measure the patch underneath.
        x0, y0, x1, y1 = [int(v) for v in box]
        x0, y0 = max(0, x0), max(0, y0)
        x1, y1 = min(W, x1), min(H, y1)
        auto = spec.get("plate_alpha", 0.50)
        if x1 > x0 + 4 and y1 > y0 + 4:
            patch = np.asarray(img.crop((x0, y0, x1, y1)).convert("L"),
                               dtype=np.float32) / 255.0
            lum = float(patch.mean())
            auto = max(auto, 0.24 + 0.62 * max(0.0, lum - 0.35))
        cap = spec.get("plate_cap", 0.66)
        _plate(img, box, e * out if out < 1 else e, alpha=min(cap, auto))

    ax = W / 2 if align == "center" else x_left
    step = 0.10 if spec.get("fast") else 0.12
    for i, (kind, lay, colour, gap, used) in enumerate(lays):
        y += gap
        ee = ss(step * i, step * i + 0.40, e) * out
        if ee <= 0.002:
            y += lay.height
            continue
        rise = {"title": 22, "sub": 16, "quote": 20, "row": 14, "num": 18}.get(kind, 10)
        dy = (1 - eo(ee)) * rise
        T.paint(img, lay, (ax, y + dy), colour, min(1.0, ee * 1.8),
                glow=(10.0, 0.22) if kind in ("title", "num") else
                     ((8.0, 0.20) if kind == "quote" else None),
                shadow=(7, 0.68, (0, 5)) if kind in ("title", "quote") else (4, 0.58, (0, 3)),
                baseline=True, anchor="center" if align == "center" else "left")
        y += lay.height

    rr = spec.get("rule")
    if rr is not None and e > 0.5:
        w = int(rr * ss(0.5, 0.95, e) * out)
        if w > 2:
            ty = spec.get("rule_y", cy + total / 2 + 10)
            d = ImageDraw.Draw(img, "RGBA")
            d.rounded_rectangle([W / 2 - w / 2, ty, W / 2 + w / 2, ty + 3], radius=2,
                                fill=(255, 206, 106, int(180 * out)))


def cta_card(img, xy, alpha, title, url, e_url=1.0, width=940):
    """Closing CTA: panel rises in, line one fades up, the URL wipes in after it."""
    if alpha <= 0.01:
        return
    x, y = xy
    ov = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    t1 = T.flow(title, "sans-semi", 32)
    t2 = T.flow(url, "sans-bold", 42)
    h = 160
    eo_a = eo(alpha)
    dy = (1 - eo_a) * 26
    # soft drop shadow, then the panel itself
    sh = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ds = ImageDraw.Draw(sh)
    ds.rounded_rectangle([x + 2, y + dy + 10, x + width + 2, y + dy + h + 10], radius=26,
                         fill=(0, 0, 0, int(120 * alpha)))
    ov.alpha_composite(sh.filter(ImageFilter.GaussianBlur(22)))
    d.rounded_rectangle([x, y + dy, x + width, y + dy + h], radius=26,
                        fill=(10, 13, 10, int(198 * alpha)),
                        outline=(255, 206, 106, int(110 * alpha)), width=2)
    if alpha > 0.15:
        p1 = ss(0.15, 0.75, alpha)
        c1 = Image.new("RGBA", t1.image.size, (238, 242, 232, 255))
        c1.putalpha(t1.image.point(lambda v: int(v * p1)))
        ov.alpha_composite(c1, (int(x + 32), int(y + dy + 24 + (1 - eo(p1)) * 12)))
        if e_url > 0.01:
            rev = max(1, int(t2.image.width * eo(e_url)))
            c2 = Image.new("RGBA", (rev, t2.image.height), (255, 206, 106, 255))
            c2.putalpha(t2.image.crop((0, 0, rev, t2.image.height)))
            ov.alpha_composite(c2, (int(x + 32), int(y + dy + 82 + (1 - eo(e_url)) * 12)))
            d2 = ImageDraw.Draw(ov)
            rw = int(96 * eo(e_url))
            d2.rounded_rectangle([x + 32, y + dy + 146, x + 32 + rw, y + dy + 149],
                                 radius=2, fill=(255, 206, 106, int(200 * e_url)))
    base = Image.alpha_composite(img.convert("RGBA"), ov)
    img.paste(base.convert("RGB"), (0, 0))
