"""Chroma-key a product shot off a solid blue plate -> clean RGBA sprite (v2).

Lessons baked in (each one cost a render):
  * v1 applied the plate test to the whole frame, so every bluish *reflection
    inside* the mirror-polished steel was keyed out — the kettle came back with
    holes in its belly. Now only enclosed-by-border logic decides, and the
    handle aperture is explicitly re-keyed after fill_holes.
  * the plate has a soft cast shadow under the base that fuses with the black
    base as two "feet". The base bottom is one smooth arc, so the fix is
    geometric: find the last row where the silhouette is a single wide run and
    cut everything below it.
  * `border_value=1` on open/close, or a 1-px frame survives as "product".
  * the faint alpha tail must be trimmed (0.10 -> 1.0) or a blue rim shows.

Usage:  python key_blue2.py [kettle|flask] ...
"""
import os
import sys

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

HERE = os.path.dirname(os.path.abspath(__file__))
CUT = os.path.join(HERE, "..", "ad", "cut2")
SPR = os.path.join(HERE, "..", "ad", "sprite")


def corner_colour(a):
    return np.median(np.concatenate([
        a[:6, :6].reshape(-1, 3), a[:6, -6:].reshape(-1, 3),
        a[-6:, :6].reshape(-1, 3), a[-6:, -6:].reshape(-1, 3)]), axis=0)


def key(path, out, tol=74.0, feather=0.8, despill=0.9, report=True):
    im = Image.open(path).convert("RGB")
    a = np.asarray(im).astype(np.float32)
    h, w, _ = a.shape
    bg = corner_colour(a)
    dist = np.abs(a - bg[None, None, :]).sum(-1)

    plate = ndi.binary_closing(dist < tol, np.ones((5, 5), bool), border_value=1)
    solid = ndi.binary_fill_holes(ndi.binary_closing(~plate, np.ones((3, 3), bool)))

    # enclosed plate (handle aperture, gap beside the spout) is still plate
    tight = ndi.binary_opening(dist < 40, np.ones((5, 5), bool))
    solid &= ~tight

    opened = ndi.binary_opening(solid, np.ones((15, 15), bool))
    lab, n = ndi.label(opened)
    if n == 0:
        raise SystemExit(f"nothing left after keying {path}")
    sizes = ndi.sum(opened, lab, range(1, n + 1))
    solid = ndi.binary_propagation(lab == 1 + int(np.argmax(sizes)), mask=solid)

    # cut the cast-shadow "feet" under the base
    bottom = None
    for y in range(h - 1, -1, -1):
        xs = np.where(solid[y])[0]
        if len(xs) < 0.25 * w:
            continue
        if 1 + int(np.sum(np.diff(xs) > 3)) == 1:
            bottom = y
            break
    if bottom is not None:
        solid[bottom + 1:, :] = False

    al = np.clip(ndi.distance_transform_edt(solid).astype(np.float32) / 1.4, 0, 1)
    al = np.asarray(Image.fromarray((al * 255).astype(np.uint8), "L")
                    .filter(ImageFilter.GaussianBlur(feather))).astype(np.float32) / 255.0
    al = np.maximum(al, ndi.binary_erosion(solid, iterations=1).astype(np.float32))
    al = np.clip((al - 0.10) / 0.90, 0, 1)

    # rim despill: pull the edge back to the product's own interior colour
    r, g, b = a[:, :, 0], a[:, :, 1], a[:, :, 2]
    rim = (al > 0.02) & (al < 0.99)
    inner = ndi.binary_erosion(al > 0.85, iterations=2)
    idx = ndi.distance_transform_edt(~inner, return_distances=False, return_indices=True)
    rgb = np.dstack([r, g, b])
    rgb = np.where(rim[..., None], rgb * (1 - despill) + rgb[tuple(idx)] * despill, rgb)
    lim = np.maximum(rgb[:, :, 0], rgb[:, :, 1]) + 14.0
    rgb[:, :, 2] = np.where(rim, np.minimum(rgb[:, :, 2], lim), rgb[:, :, 2])

    # any residual blue cast inside the product (bounce in the handle aperture,
    # the base rim) is neutralised toward its own luma — the product has no
    # blue of its own except the flask's flowers, which are far bluer than this
    bias = rgb[:, :, 2] - np.maximum(rgb[:, :, 0], rgb[:, :, 1])
    m = (bias > 12) & (al > 0.06)
    lum = 0.299 * rgb[:, :, 0] + 0.587 * rgb[:, :, 1] + 0.114 * rgb[:, :, 2]
    for i, wgt in enumerate((1.03, 1.0, 0.97)):
        rgb[:, :, i] = np.where(m, lum * wgt, rgb[:, :, i])

    rgba = Image.fromarray(np.dstack([rgb.clip(0, 255), al * 255]).astype(np.uint8), "RGBA")
    bb = rgba.split()[3].point(lambda v: 255 if v > 12 else 0).getbbox()
    if bb:
        rgba = rgba.crop(bb)
    rgba.save(out)
    if report:
        print(out, rgba.size, "coverage", round(float((al > 0.5).mean()), 3))


if __name__ == "__main__":
    for name in (sys.argv[1:] or ["kettle", "flask"]):
        key(os.path.join(CUT, f"{name}_blue.png"), os.path.join(SPR, f"{name}.png"))
