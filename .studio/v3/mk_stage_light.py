"""Bright stage backgrounds for the v9 commercial (light theme).

Why a rewrite: the emerald stage was elegant but the brief asked for a bright,
cheerful palette that suits the product colours (polished steel + lilac/cream
flask). Dark green also forced every label to be ivory on near-black, which is
what made the cards feel heavy.

New stage: a soft cool-white-to-powder-blue silk with a warm sunlit halo, a
faint horizon, and a polished light floor. Text sits DARK on light glass —
much higher contrast than ivory-on-emerald, so the captions get legible
without making the type bigger.

Two variants:
  cool — daylight silk, blue + champagne (kettle / combo / hook)
  warm — same stage pulled toward peach/gold (flask, family beat)
"""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

import adkit as A

W, H = A.W, A.H
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "art_ad")


def _grad(stops):
    """Vertical gradient from a list of (position, (r,g,b))."""
    yy = np.linspace(0, 1, H, dtype=np.float32)[:, None]
    arr = np.zeros((H, W, 3), dtype=np.float32)
    pos = [s[0] for s in stops]
    for c in range(3):
        vals = [s[1][c] for s in stops]
        arr[:, :, c] = np.interp(yy, pos, vals)[:, :, None] if False else np.repeat(
            np.interp(yy, pos, vals), W, axis=1)
    return arr


def bokeh(arr, n=22, seed=5, colour=(255, 236, 196), strength=0.55):
    rng = np.random.default_rng(seed)
    lay = Image.new("L", (W // 4, H // 4), 0)
    d = ImageDraw.Draw(lay)
    for _ in range(n):
        cx = rng.uniform(0, W / 4)
        cy = rng.uniform(0, H / 4 * 0.95)
        r = rng.uniform(W / 4 * 0.035, W / 4 * 0.125)
        a = int(255 * rng.uniform(0.25, 0.75))
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=a)
    lay = lay.filter(ImageFilter.GaussianBlur(W / 4 * 0.040))
    lay = lay.resize((W, H), Image.BICUBIC)
    m = (np.asarray(lay, np.float32) / 255.0 * strength)[..., None]
    col = np.array(colour, np.float32)
    return arr * (1 - m * 0.35) + col * (m * 0.35)


def build(kind="cool"):
    if kind == "cool":
        stops = [(0.00, (232, 243, 250)),   # pale sky
                 (0.28, (246, 250, 252)),   # near white
                 (0.52, (250, 247, 241)),   # warm white centre
                 (0.74, (232, 236, 238)),   # floor edge
                 (1.00, (204, 214, 220))]   # floor
        halo, bokeh_c = (255, 236, 198), (255, 248, 226)
        blue_c = (206, 226, 242)
    else:
        stops = [(0.00, (247, 240, 231)),
                 (0.26, (252, 247, 239)),
                 (0.52, (253, 246, 234)),
                 (0.74, (240, 230, 219)),
                 (1.00, (214, 203, 193))]
        halo, bokeh_c = (255, 224, 176), (255, 240, 214)
        blue_c = (244, 232, 222)
    arr = _grad(stops)

    # cool daylight wash from the top, warm light from the centre
    yy = np.linspace(0, 1, H, dtype=np.float32)[:, None]
    top_k = np.clip((0.42 - yy) / 0.42, 0, 1) ** 1.5
    arr = arr * (1 - 0.35 * top_k[..., None]) + np.array(blue_c, np.float32) * (0.35 * top_k[..., None])

    # sun halo behind the product
    yy2, xx2 = np.mgrid[0:H, 0:W].astype(np.float32)
    nx, ny = xx2 / W, yy2 / H
    d = np.sqrt(((nx - 0.5) * 0.92) ** 2 + ((ny - 0.42) * 0.86) ** 2)
    halo_m = np.clip(1 - d / 0.52, 0, 1) ** 2.0
    arr = arr * (1 - 0.55 * halo_m[..., None]) + np.array(halo, np.float32) * (0.55 * halo_m[..., None])

    arr = bokeh(arr, 20, 5 if kind == "cool" else 11, bokeh_c, 0.55)

    # polished floor: bright band at the horizon, slightly cooler below
    hz = 0.745
    band = np.exp(-((yy - hz) / 0.020) ** 2)
    arr = arr * (1 - 0.10 * np.clip((yy - hz) / 0.25, 0, 1)[..., None])
    arr = arr + band[..., None] * np.array((255, 252, 244), np.float32) * 0.10

    # gentle vignette (much lighter than v8 — brightness is the point)
    vd = np.sqrt(((nx - 0.5) * 1.02) ** 2 + ((ny - 0.5) * 0.98) ** 2)
    arr = arr * (1 - 0.16 * np.clip((vd - 0.42) / 0.55, 0, 1))[..., None]
    img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")
    os.makedirs(OUT, exist_ok=True)
    p = os.path.join(OUT, f"stage_light_{kind}.png")
    img.save(p)
    print(p, img.size)
    return img


if __name__ == "__main__":
    build("cool")
    build("warm")
