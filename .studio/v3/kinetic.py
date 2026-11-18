"""Kinetic typography + motion-graphics primitives (Pillow + HarfBuzz).

Everything here takes an animation progress `e` in 0..1 (already eased by the
caller) and draws one frame, so text never simply "appears": it moves, wipes,
counts up, draws itself or staggers in word by word.
"""
from __future__ import annotations

import math

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

import rbtext as T

W, H = 1080, 1920


# -------------------------------------------------------------------- easing --
def eo(x):
    x = min(max(x, 0.0), 1.0)
    return 1 - (1 - x) ** 3


def ei(x):
    x = min(max(x, 0.0), 1.0)
    return x * x * x


def eio(x):
    x = min(max(x, 0.0), 1.0)
    return x * x * (3 - 2 * x)


def ss(a, b, x):
    x = min(max((x - a) / (b - a + 1e-9), 0.0), 1.0)
    return x * x * (3 - 2 * x)


def back(x, k=1.7):
    x = min(max(x, 0.0), 1.0)
    return 1 + (k + 1) * (x - 1) ** 3 + k * (x - 1) ** 2


# ------------------------------------------------------------- text drawing --
def text(canvas, txt, key, px, xy, fill, e=1.0, enter="rise", dx=0, dy=26,
         shadow=(4, 5, (0, 0, 0), 0.6), glow=None, wipe=False, track=0.0,
         center=None, anchor="ink"):
    """Draw one line with an entry animation.

    enter: 'rise' (up+fade) | 'slide' (horizontal) | 'pop' (back-ease scale-ish)
           | 'none'
    wipe:  reveal the glyphs bottom-to-top like a mask wipe
    """
    if e <= 0.005:
        return canvas
    layer = T.flow(txt, key, px)
    if layer.width <= 1:
        return canvas
    mask = layer.image
    x, y = float(xy[0]), float(xy[1])
    if center is None:
        center = (xy[0] == 0)          # x==0 means "centre this line"
    if center:
        x = (canvas.width - mask.width) / 2
    if anchor == "baseline":
        # `y` is the text baseline: shift by this line's own ink offset so that
        # every line/card sits on a common baseline instead of a common ink-top.
        y -= T.baseline_offset(layer)
    a = e
    if enter == "rise":
        y += dy * (1 - e)
    elif enter == "slide":
        x += dx * (1 - eo(e))
    elif enter == "pop":
        a = min(1.0, e * 1.4)
        y += dy * 0.4 * (1 - back(e))
    if wipe:
        k = max(1, int(mask.height * e))
        cut = mask.crop((0, mask.height - k, mask.width, mask.height))
        canvas.paste(Image.new("RGB", cut.size, tuple(fill)[:3]),
                     (int(x), int(y + mask.height - k)), cut)
        return canvas
    if track:  # letter-spaced feel is emulated by a soft glow
        glow = glow or (2.0, 0.16)
    T.paint(canvas, mask, (int(x), int(y)), fill, a, shadow=shadow, glow=glow)
    return canvas


def word_line(canvas, txt, key, px, xy, fill, t, stagger=0.13, dur=0.34,
              rise=30, shadow=(4, 5, (0, 0, 0), 0.6), center_x=True,
              suffix=None, x0=None):
    """Word-by-word kinetic reveal. Returns the drawn width."""
    sh = T.shaper(key, px)
    words = txt.split(" ")
    widths = [sh.advance(w) for w in words]
    space = sh.advance(" ")
    total = sum(widths) + space * (len(words) - 1)
    left = (W - total) / 2 if center_x else (x0 if x0 is not None else xy[0])
    # `xy[1]` is the BASELINE. Each word is cropped to its own ink, so its
    # distance-to-baseline differs (matras above vs descenders below). Painting
    # every word at the same ink-top was what made one line look like it was
    # bouncing up and down — so each word is offset by its own baseline delta.
    y_base = xy[1]
    ref = T.flow("ই", key, px)  # reference for consistent look, unused numerically
    x = left
    for i, (wd, ww) in enumerate(zip(words, widths)):
        e = ss(0, 1, (t - i * stagger) / dur)
        if e > 0.004:
            lay = T.flow(wd, key, px)
            yy = y_base - T.baseline_offset(lay)
            T.paint(canvas, lay.image, (int(x), int(yy + rise * (1 - e))), fill, e,
                    shadow=shadow)
        x += ww + space
    return total, left


def words_together(canvas, txt, key, px, xy, fill, e, wipe=True, shadow=(4, 5, (0, 0, 0), 0.6)):
    """Whole phrase revealed with a bottom-up mask wipe (used for titles)."""
    return text(canvas, txt, key, px, xy, fill, e, enter="rise", dy=18, wipe=wipe, shadow=shadow)


# ------------------------------------------------------------------- accents --
def underline_centered(canvas, y, width_px, e, colour=(255, 214, 122)):
    return underline(canvas, (canvas.width - width_px) / 2, y, width_px, e, colour)


def line_width(txt, key, px):
    return T.shaper(key, px).advance(txt)


def underline(canvas, x, y, w, e, colour=(255, 214, 122)):
    d = ImageDraw.Draw(canvas, "RGBA")
    if e <= 0.01:
        return canvas
    seg = w * eo(e)
    d.rounded_rectangle([x, y, x + seg, y + 5], radius=3, fill=colour + (235,))
    d.rounded_rectangle([x, y + 9, x + seg * 0.45, y + 12], radius=2, fill=colour + (150,))
    return canvas


def rule_draw(canvas, x, y, h, e, colour=(255, 235, 200), width=4):
    """Vertical accent rule that draws downward."""
    if e <= 0.01:
        return canvas
    d = ImageDraw.Draw(canvas, "RGBA")
    hh = h * eo(e)
    d.rounded_rectangle([x, y, x + width, y + hh], radius=width // 2, fill=colour + (220,))
    return canvas


def chip(canvas, txt, xy, e, key="sans-semi", px=34, colour=(170, 245, 205),
         bg=(6, 22, 20, 205), border=None, slide=34, icon=None):
    """Rounded chip that slides in from the left (used for facts/labels)."""
    if e <= 0.005:
        return canvas
    lay = T.flow(txt, key, px)
    padx, pady = 30, 16
    w, h = int(lay.width + padx * 2 + (44 if icon else 0)), int(lay.image.height + pady * 2)
    x = int(xy[0] + (1 - eo(e)) * slide)
    y = int(xy[1])
    box = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(box)
    d.rounded_rectangle([0, 0, w - 1, h - 1], radius=h // 2, fill=bg,
                        outline=(border or colour) + (150,), width=2)
    canvas.paste(box, (x, y), box)
    tx = x + padx + (44 if icon else 0)
    T.paint(canvas, lay.image, (tx, y + pady), colour, e * 0.98,
            shadow=(1, 2, (0, 0, 0), 0.4))
    if icon:
        dd = ImageDraw.Draw(canvas, "RGBA")
        cx, cy = x + 26, y + h // 2
        col = colour + (int(230 * e),)
        if icon == "dot":
            dd.ellipse([cx - 7, cy - 7, cx + 7, cy + 7], fill=col)
        elif icon == "warn":
            dd.polygon([(cx, cy - 12), (cx + 12, cy + 9), (cx - 12, cy + 9)], outline=col, width=3)
            dd.line([cx, cy - 3, cx, cy + 3], fill=col, width=3)
            dd.ellipse([cx - 1, cy + 6, cx + 3, cy + 9], fill=col)
    return canvas


def badge_stamp(canvas, xy, e, big="বিপন্ন", small="IUCN · Endangered",
                colour=(255, 126, 96)):
    """Rotated stamp that lands with a scale-down (threat call-out)."""
    if e <= 0.005:
        return canvas
    k = 1.45 - 0.45 * back(e)
    a = min(1.0, e * 1.6)
    lay1 = T.flow(small, "sans-bold", 26)
    lay2 = T.flow(big, "serif-bold", 62)
    w = int(max(lay1.width, lay2.width) + 56)
    h = int(lay1.image.height + lay2.image.height + 46)
    box = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(box)
    d.rounded_rectangle([0, 0, w - 1, h - 1], radius=14, fill=(12, 8, 8, int(190 * a)),
                        outline=colour + (int(220 * a),), width=3)
    inner = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    di = ImageDraw.Draw(inner)
    di.rounded_rectangle([7, 7, w - 8, h - 8], radius=10, outline=colour + (int(90 * a),), width=1)
    box = Image.alpha_composite(box, inner)
    canvas.paste(box, (int(xy[0]), int(xy[1])), box)
    T.paint(canvas, lay1.image, (int(xy[0]) + 28, int(xy[1]) + 16), colour, a)
    T.paint(canvas, lay2.image, (int(xy[0]) + 28, int(xy[1]) + 46), (255, 240, 232), a,
            shadow=(2, 3, (0, 0, 0), 0.5))
    if k != 1.0:
        pass  # scale is baked into the layout for crispness; landing feel comes from `back()`
    return canvas


def number_counter(canvas, xy, value, e, key="serif-bold", px=150,
                   colour=(255, 214, 122), suffix="", prefix="",
                   shadow=(4, 6, (0, 0, 0), 0.6)):
    """Counts up to `value`; renders Bangla numerals."""
    if e <= 0.005:
        return canvas
    v = int(round(value * eo(e)))
    txt = f"{prefix}{bn(v)}{suffix}"
    lay = T.flow(txt, key, px)
    T.paint(canvas, lay.image, (int(xy[0]), int(xy[1])), colour, min(1.0, e * 1.5),
            shadow=shadow)
    return canvas


BN = str.maketrans("0123456789", "০১২৩৪৫৬৭৮৯")


def bn(n):
    return str(n).translate(BN)


def ring_pulse(canvas, center, e, count=3, colour=(255, 226, 170), radius=150, spread=430):
    """Expanding rings (water ripple / heartbeat accent)."""
    if e <= 0.01:
        return canvas
    d = ImageDraw.Draw(canvas, "RGBA")
    cx, cy = center
    for i in range(count):
        ph = (e * 1.15 + i / count) % 1.0
        r = radius + ph * spread
        a = int(150 * (1 - ph) * min(1, e * 3))
        if a > 3:
            d.ellipse([cx - r, cy - r * 0.62, cx + r, cy + r * 0.62],
                      outline=colour + (a,), width=3)
    return canvas


def route(canvas, pts, e, colour=(190, 250, 230), dot=6, marker=True):
    """Dotted path that draws itself, with a glowing marker at the tip."""
    if e <= 0.01:
        return canvas
    d = ImageDraw.Draw(canvas, "RGBA")
    total = 0.0
    segs = []
    for i in range(len(pts) - 1):
        x0, y0 = pts[i]
        x1, y1 = pts[i + 1]
        L = math.hypot(x1 - x0, y1 - y0)
        segs.append((x0, y0, x1, y1, L))
        total += L
    budget = total * eo(e)
    tip = pts[0]
    for (x0, y0, x1, y1, L) in segs:
        if budget <= 0:
            break
        f = min(1.0, budget / L)
        n = max(2, int(L * f / 22))
        for k in range(n + 1):
            u = f * k / n
            x, y = x0 + (x1 - x0) * u, y0 + (y1 - y0) * u
            a = int(210 * min(1, e * 2))
            d.ellipse([x - dot, y - dot, x + dot, y + dot], fill=colour + (a,))
        tip = (x0 + (x1 - x0) * f, y0 + (y1 - y0) * f)
        budget -= L
    if marker:
        for r, a in ((28, 40), (18, 90), (9, 235)):
            d.ellipse([tip[0] - r, tip[1] - r, tip[0] + r, tip[1] + r],
                      fill=(255, 240, 190, a))
    return canvas


def step_nodes(canvas, items, xy, e, key="sans-semi", px=34,
               colour=(255, 231, 180), accent=(255, 176, 130)):
    """Numbered process nodes that pop in one by one (hunting sequence)."""
    x, y = xy
    for i, label in enumerate(items):
        ee = ss(i * 0.26, i * 0.26 + 0.34, e)
        if ee <= 0.005:
            continue
        lay = T.flow(label, key, px)
        r = 26
        dy = int(y + i * 96 + (1 - eo(ee)) * 22)
        d = ImageDraw.Draw(canvas, "RGBA")
        cx, cy = int(x + r), dy + r
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(10, 24, 22, int(215 * ee)),
                  outline=accent + (int(230 * ee),), width=2)
        num = T.flow(bn(i + 1), "sans-bold", 30)
        T.paint(canvas, num.image, (cx - num.width / 2, cy - num.image.height / 2 - 2),
                accent, ee)
        T.paint(canvas, lay.image, (x + r * 2 + 20, dy + r - lay.image.height / 2),
                colour, ee, shadow=(2, 2, (0, 0, 0), 0.5))
        if i < len(items) - 1:
            ln = ss(i * 0.26 + 0.2, i * 0.26 + 0.55, e)
            if ln > 0.01:
                d.line([cx, cy + r + 4, cx, cy + r + 16 + 70 * ln],
                       fill=accent + (int(150 * ln),), width=2)
    return canvas


def chain(canvas, levels, xy, e, key="sans-semi", px=32):
    """Food-chain ladder: bottom -> top, arrows animate upward."""
    x, y = xy
    for i, (label, sub) in enumerate(reversed(list(levels))):
        ee = ss(i * 0.24, i * 0.24 + 0.34, e)
        if ee <= 0.005:
            continue
        lay = T.flow(label, key, px)
        dy = int(y + i * 120 + (1 - eo(ee)) * 26)
        a = int(215 * ee)
        box = Image.new("RGBA", (int(lay.width + 56), 78), (0, 0, 0, 0))
        db = ImageDraw.Draw(box)
        top = (i == len(levels) - 1)
        col = (255, 214, 122) if top else (170, 245, 205)
        db.rounded_rectangle([0, 0, box.width - 1, 77], radius=18, fill=(6, 20, 18, a),
                             outline=col + (int(170 * ee),), width=2)
        canvas.paste(box, (int(x + (1 - eo(ee)) * 28), dy), box)
        T.paint(canvas, lay.image, (x + 28 + (1 - eo(ee)) * 28, dy + 12), col, ee,
                shadow=(2, 2, (0, 0, 0), 0.45))
        if sub:
            s2 = T.flow(sub, "sans", 24)
            T.paint(canvas, s2.image, (x + 28 + lay.width + 30 + (1 - eo(ee)) * 28, dy + 24),
                    (200, 232, 222), ee * 0.9)
        if i < len(levels) - 1:
            ln = ss(i * 0.24 + 0.18, i * 0.24 + 0.5, e)
            if ln > 0.01:
                d = ImageDraw.Draw(canvas, "RGBA")
                cx = int(x + 40)
                y0 = dy + 82
                y1 = y0 + 26 * ln
                d.line([cx, y0, cx, y1], fill=(255, 226, 170, int(180 * ln)), width=3)
                d.polygon([(cx - 7, y1), (cx + 7, y1), (cx, y1 + 10)],
                          fill=(255, 226, 170, int(200 * ln)))
    return canvas


def timeline_bar(canvas, xy, w, segments, e, key="sans-semi", px=30,
                 colour=(255, 214, 122)):
    """Horizontal timeline that fills left-to-right with labels above."""
    x, y = xy
    d = ImageDraw.Draw(canvas, "RGBA")
    d.rounded_rectangle([x, y, x + w, y + 8], radius=4, fill=(240, 240, 235, 45))
    fillw = w * eo(e)
    d.rounded_rectangle([x, y, x + fillw, y + 8], radius=4, fill=colour + (215,))
    for i, lab in enumerate(segments):
        ee = ss(0.15 + i * 0.18, 0.45 + i * 0.18, e)
        lay = T.flow(lab, key, px)
        cx = x + (w / (len(segments) + 1)) * (i + 1)
        if cx <= x + fillw + 20:
            T.paint(canvas, lay.image, (cx - lay.width / 2, y - 52), (255, 245, 228),
                    max(ee, 0.0), shadow=(2, 2, (0, 0, 0), 0.5))
            d.ellipse([cx - 6, y + 1, cx + 6, y + 13], fill=colour + (int(230 * max(ee, .3)),))
    return canvas


def stat_line(canvas, xy, label, value, e, w=520, key="sans-semi", px=30,
              accent=(255, 214, 122)):
    """Compact stat row: label left, big value right, with a sliding panel."""
    if e <= 0.01:
        return canvas
    x, y = xy
    panel = Image.new("RGBA", (int(w), 104), (0, 0, 0, 0))
    d = ImageDraw.Draw(panel)
    d.rounded_rectangle([0, 0, w - 1, 103], radius=22, fill=(6, 18, 20, int(200 * e)),
                        outline=accent + (int(160 * e),), width=2)
    canvas.paste(panel, (int(x + (1 - eo(e)) * 40), int(y)), panel)
    lay = T.flow(label, key, px)
    T.paint(canvas, lay.image, (x + 26 + (1 - eo(e)) * 40, y + 34), (188, 232, 216), e)
    val = T.flow(value, "serif-bold", 52)
    T.paint(canvas, val.image, (x + w - val.width - 28, y + 22), accent, e,
            shadow=(2, 3, (0, 0, 0), 0.5))
    return canvas


def glass(canvas, box, e=1.0, radius=26, alpha=0.55, pad=22, blur=8):
    """Soft darkened glass panel behind a lower-third block (keeps text readable)."""
    if e <= 0.01:
        return canvas
    x0, y0, x1, y1 = box
    x0, y0 = int(x0 - pad), int(y0 - pad)
    x1, y1 = int(x1 + pad), int(y1 + pad)
    w, h = max(2, x1 - x0), max(2, y1 - y0)
    region = canvas.crop((x0, y0, x1, y1)).filter(ImageFilter.GaussianBlur(blur))
    dark = Image.new("RGB", (w, h), (3, 10, 12))
    region = Image.blend(region, dark, min(0.85, alpha + 0.25))
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, w - 1, h - 1], radius=radius,
                                           fill=int(255 * min(1.0, e)))
    canvas.paste(region, (x0, y0), mask)
    # barely-there accent edge
    d = ImageDraw.Draw(canvas, "RGBA")
    d.rounded_rectangle([x0, y0, x1, y1], radius=radius,
                        outline=(255, 240, 210, int(38 * e)), width=2)
    return canvas


# --------------------------------------------------------------- brand / logo --
LOGO = "assets/logo-mark.png"


def _load_logo(size):
    from PIL import Image
    im = Image.open(LOGO).convert("RGBA")
    im = im.resize((size, size), Image.LANCZOS)
    # knock out the near-white background into transparency (soft matte)
    arr = np.asarray(im).astype(np.float32)
    rgb = arr[:, :, :3]
    mn = rgb.min(axis=2)
    # smooth matte: anything near-white becomes transparent, edges stay soft
    t = np.clip((mn - 196.0) / 54.0, 0, 1)
    white = t * t * (3 - 2 * t)
    arr[:, :, 3] = arr[:, :, 3] * (1 - white)
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGBA")


_LOGO_CACHE = {}


def logo(size=120):
    if size not in _LOGO_CACHE:
        _LOGO_CACHE[size] = _load_logo(size)
    return _LOGO_CACHE[size]


def brand_lockup(canvas, xy, e, size=96, name="রূপসী বাংলা", tag="প্রকৃতি · জীববৈচিত্র্য",
                 align="left", name_px=40, show_name=True, ring=True):
    """Logo + wordmark lockup used as a corner brand mark on every scene."""
    if e <= 0.005:
        return canvas
    a = min(1.0, e)
    x, y = float(xy[0]), float(xy[1])
    pop = back(min(1.0, e * 1.15)) if e < 1 else 1.0
    sz = int(size * (0.72 + 0.28 * pop))
    lg = logo(sz)
    if ring:
        d = ImageDraw.Draw(canvas, "RGBA")
        cx, cy = x + sz / 2, y + sz / 2
        ph = (e * 1.0) % 1.0
        r = sz * (0.62 + 0.30 * ph)
        d.ellipse([cx - r, cy - r, cx + r, cy + r],
                  outline=(255, 226, 170, int(120 * (1 - ph) * min(1, e * 1.5))), width=2)
    mask = lg.split()[3]
    if a < 0.999:
        mask = mask.point(lambda v: int(v * a))
    canvas.paste(lg, (int(x + (size - sz) / 2), int(y + (size - sz) / 2)), mask)
    if show_name:
        nx = x + size + 20
        t1 = T.flow(name, "serif-bold", name_px)
        tw = t1.width
        tx = nx if align == "left" else nx - tw
        T.paint(canvas, t1.image, (int(tx), int(y + 16)), (255, 244, 224), a,
                shadow=(2, 3, (0, 0, 0), 0.65))
        if tag:
            t2 = T.flow(tag, "sans", int(name_px * 0.56))
            T.paint(canvas, t2.image, (int(tx), int(y + 16 + t1.image.height + 6)),
                    (176, 226, 206), a * 0.95, shadow=(2, 2, (0, 0, 0), 0.5))
    return canvas


def logo_burst(canvas, center, e, size=260, payoff="রূপসী বাংলা",
               sub="প্রকৃতি · জীববৈচিত্র্য · বাংলাদেশ"):
    """Premium logo reveal: rings expand, rays sweep, mark settles with a shine."""
    if e <= 0.004:
        return canvas
    cx, cy = center
    d = ImageDraw.Draw(canvas, "RGBA")
    # 1. expanding rings
    for i in range(3):
        ph = (e * 1.25 + i * 0.28) % 1.0
        r = size * (0.5 + 0.85 * ph)
        a = int(120 * (1 - ph) * min(1, e * 3))
        if a > 2:
            d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(255, 228, 170, a), width=3)
    # 2. light rays
    ray = min(1.0, max(0.0, (e - 0.12) / 0.5))
    if ray > 0:
        for k in range(16):
            ang = (k / 16) * 2 * math.pi + e * 0.5
            r0, r1 = size * 0.72, size * (0.9 + 0.55 * ray)
            a = int(52 * ray * (0.5 + 0.5 * math.sin(k * 1.7)))
            d.line([cx + math.cos(ang) * r0, cy + math.sin(ang) * r0,
                    cx + math.cos(ang) * r1, cy + math.sin(ang) * r1],
                   fill=(255, 236, 190, a), width=2)
    # 3. the mark itself (settles with a small overshoot, then breathes)
    pop = back(min(1.0, max(0.0, (e - 0.06) / 0.55)), 2.1)
    sz = int(size * (0.6 + 0.4 * pop))
    if sz > 4:
        lg = logo(sz)
        m = lg.split()[3]
        m = m.point(lambda v: int(v * min(1.0, e * 2.2)))
        canvas.paste(lg, (int(cx - sz / 2), int(cy - sz / 2)), m)
    # 4. sweeping shine across the mark
    sh = max(0.0, (e - 0.5) / 0.6)
    if 0 < sh < 1:
        band = Image.new("L", (canvas.width, canvas.height), 0)
        db = ImageDraw.Draw(band)
        bx = -300 + sh * (canvas.width + 600)
        db.polygon([(bx, 0), (bx + 160, 0), (bx + 460, canvas.height), (bx + 300, canvas.height)],
                   fill=90)
        band = band.filter(ImageFilter.GaussianBlur(18))
        # only inside the mark
        zone = Image.new("L", (canvas.width, canvas.height), 0)
        ImageDraw.Draw(zone).ellipse([cx - sz / 2, cy - sz / 2, cx + sz / 2, cy + sz / 2],
                                     fill=255)
        band = Image.composite(band, Image.new("L", band.size, 0), zone)
        canvas.paste(Image.new("RGB", canvas.size, (255, 246, 220)), (0, 0), band)
    # 5. wordmark
    we = min(1.0, max(0.0, (e - 0.45) / 0.45))
    if we > 0:
        t1 = T.flow(payoff, "serif-bold", 76)
        T.paint(canvas, t1.image, (cx - t1.width / 2, cy + size * 0.62 + 26), (255, 240, 210),
                we, shadow=(3, 4, (0, 0, 0), 0.6))
        if sub:
            t2 = T.flow(sub, "sans-semi", 30)
            T.paint(canvas, t2.image, (cx - t2.width / 2, cy + size * 0.62 + 120),
                    (176, 226, 206), we * 0.95, shadow=(2, 2, (0, 0, 0), 0.5))
    return canvas


def cta_card(canvas, xy, e, title="বাংলাদেশের প্রাণী ও উদ্ভিদ সম্পর্কে জানতে",
             url="ruposhibangla.vercel.app", key="sans-semi", e_url=None):
    """Lower-third CTA: text slides up, then the URL chip draws its border."""
    if e_url is None:
        e_url = e
    if e <= 0.004 and e_url <= 0.004:
        return canvas
    x, y = xy
    e1 = min(1.0, e * 2.2)
    K1 = T.flow(title, key, 42)
    K2 = T.flow("ভিজিট করুন", key, 42)
    w = max(K1.width, K2.width, T.flow(url, "sans-bold", 44).width) + 96
    h = 300
    glass(canvas, (x, y, x + w, y + h), min(1.0, e * 3), alpha=0.62, pad=0, radius=30, blur=10)
    a1 = min(1.0, max(0.0, (e - 0.05) / 0.4))
    T.paint(canvas, K1.image, (x + 48, y + 44 + 16 * (1 - a1)), (255, 244, 222), a1,
            shadow=(2, 3, (0, 0, 0), 0.6))
    T.paint(canvas, K2.image, (x + 48, y + 104 + 16 * (1 - a1)), (255, 214, 122), a1,
            shadow=(2, 3, (0, 0, 0), 0.6))
    # url pill with drawing border (own timing, bound to its own syllable)
    pe = e_url
    if pe > 0:
        u = T.flow(url, "sans-bold", 44)
        pw, ph = u.width + 76, 84
        px, py = x + 48, y + 180
        d = ImageDraw.Draw(canvas, "RGBA")
        d.rounded_rectangle([px, py, px + pw, py + ph], radius=ph // 2,
                            fill=(8, 22, 20, int(200 * pe)),
                            outline=(255, 214, 122, int(230 * pe)), width=3)
        T.paint(canvas, u.image, (px + 38, py + 18), (255, 246, 226), pe,
                shadow=(2, 2, (0, 0, 0), 0.5))
        # little arrow
        ax = px + pw + 18
        d.line([ax, py + ph / 2, ax + 26, py + ph / 2],
               fill=(255, 214, 122, int(220 * pe)), width=4)
        d.polygon([(ax + 26, py + ph / 2), (ax + 14, py + ph / 2 - 9),
                   (ax + 14, py + ph / 2 + 9)], fill=(255, 214, 122, int(220 * pe)))
    return canvas
