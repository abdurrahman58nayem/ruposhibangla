"""Procedural stage backgrounds for the product commercial.

A stage is emerald gradient + champagne halo + polished floor line + bokeh +
vignette. Two variants: COOL (steel / winter) and WARM (flask / tea).
Saved once to art_ad/stage_*.png, then the camera moves over them, which is
what gives the background its own parallax against the product sprites.
"""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

import adkit as A
W, H = A.W, A.H

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "art_ad")


def gradient(top, mid, bot, split=0.45):
    y = np.linspace(0, 1, H, dtype=np.float32)[:, None, None]
    t0 = np.clip(y / split, 0, 1)
    t1 = np.clip((y - split) / (1 - split), 0, 1)
    arr = np.zeros((H, W, 3), dtype=np.float32)
    for c in range(3):
        top_ = top[c] * (1 - t0) + mid[c] * t0
        bot_ = mid[c] * (1 - t1) + bot[c] * t1
        arr[:, :, c] = (top_ * (1 - (y > split)) + bot_ * (y > split))[:, :, 0]
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")


def bokeh(img, n=16, seed=3, colour=(255, 236, 196), strength=0.16):
    rng = np.random.default_rng(seed)
    lay = Image.new("L", (W // 4, H // 4), 0)
    d = ImageDraw.Draw(lay)
    for _ in range(n):
        cx = rng.uniform(0, W / 4)
        cy = rng.uniform(0, H / 4 * 0.92)
        r = rng.uniform(W / 4 * 0.03, W / 4 * 0.10)
        a = int(255 * rng.uniform(0.18, 0.5))
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=a)
    lay = lay.filter(ImageFilter.GaussianBlur(W / 4 * 0.035))
    lay = lay.resize((W, H), Image.BICUBIC)
    lay = lay.point(lambda v: int(v * strength))
    img.paste(Image.new("RGB", img.size, colour), (0, 0), lay)
    return img


def floor(img, y=0.735, colour=(188, 154, 85), line_a=0.55, dark=0.55):
    """Polished floor: a soft horizontal gold hairline and a darker below-deck."""
    arr = np.asarray(img, dtype=np.float32)
    yy = np.linspace(0, 1, H, dtype=np.float32)[:, None, None]
    below = np.clip((yy - y) / 0.20, 0, 1)
    arr *= (1 - dark * below)
    # gold hairline
    band = np.exp(-((yy - y) / 0.0016) ** 2) * line_a
    for c in range(3):
        arr[:, :, c] += band[:, :, 0] * (colour[c] - arr[:, :, c] * 0.0 - arr[:, :, c] * 0.0)
    arr = np.clip(arr, 0, 255)
    # add a hair of gold, not a white line
    arr = np.clip(arr + band * np.array(colour, dtype=np.float32) * 0.35, 0, 255)
    return Image.fromarray(arr.astype(np.uint8), "RGB")


def build(kind="cool"):
    if kind == "cool":
        img = gradient((6, 30, 26), (13, 62, 51), (4, 14, 12), 0.42)
        glow = A.GOLD_LT
        bokeh_c = (255, 232, 188)
    else:
        img = gradient((10, 34, 28), (34, 48, 40), (8, 12, 12), 0.40)
        glow = (236, 200, 132)
        bokeh_c = (255, 214, 168)
    img = A.radial_glow(img, 0.5, 0.40, 0.46, colour=glow, strength=0.30)
    img = A.radial_glow(img, 0.5, 0.16, 0.30, colour=(120, 170, 160), strength=0.10)
    img = bokeh(img, 18, 3 if kind == "cool" else 9, bokeh_c, 0.20)
    img = floor(img, 0.735, glow, 0.5, 0.42)
    arr = np.asarray(img, dtype=np.float32)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    nx, ny = xx / W, yy / H
    d = np.sqrt(((nx - 0.5) * 1.05) ** 2 + ((ny - 0.5) * 0.95) ** 2)
    arr *= (1 - 0.30 * np.clip((d - 0.30) / 0.55, 0, 1))[:, :, None]
    img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")
    os.makedirs(OUT, exist_ok=True)
    p = os.path.join(OUT, f"stage_{kind}.png")
    img.save(p)
    print(p, img.size)


if __name__ == "__main__":
    build("cool")
    build("warm")
