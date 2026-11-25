"""Background key for the generated product plates.

The plates come on a uniform cream backdrop, so the background is the region
connected to the frame border within a colour tolerance. Flood fill (not a global
threshold) keeps bright silver highlights inside the product opaque.
"""
import os, glob
import numpy as np
from PIL import Image, ImageFilter
from collections import deque

HERE = os.path.dirname(os.path.abspath(__file__))
GEN = os.path.join(HERE, "gen")
CUT = os.path.join(HERE, "cut")
os.makedirs(CUT, exist_ok=True)


def key(path, tol=26.0, tol2=90.0, feather=1.4):
    im = Image.open(path).convert("RGB")
    a = np.asarray(im, np.float32)
    h, w = a.shape[:2]
    # background colour = median of the four border strips
    border = np.concatenate([a[:6].reshape(-1, 3), a[-6:].reshape(-1, 3),
                             a[:, :6].reshape(-1, 3), a[:, -6:].reshape(-1, 3)])
    bg = np.median(border, axis=0)
    d = np.sqrt(((a - bg) ** 2).sum(axis=2))
    near = d < tol
    # flood from borders over `near`
    vis = np.zeros((h, w), bool)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if near[y, x] and not vis[y, x]:
                vis[y, x] = True; q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if near[y, x] and not vis[y, x]:
                vis[y, x] = True; q.append((y, x))
    while q:
        y, x = q.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and near[ny, nx] and not vis[ny, nx]:
                vis[ny, nx] = True; q.append((ny, nx))
    # second pass: swallow the soft studio shadow that the strict key leaves behind.
    # only reachable from the background, and only pixels that are background-hued
    # yet darker than the plate — metal is brighter or a different hue.
    lum = a.mean(axis=2)
    bg_lum = float(bg.mean())
    shadowish = (d < tol2) & (lum < bg_lum - 1.5) & (lum > bg_lum * 0.60)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if shadowish[y, x] and not vis[y, x]:
                vis[y, x] = True; q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if shadowish[y, x] and not vis[y, x]:
                vis[y, x] = True; q.append((y, x))
    while q:
        y, x = q.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and shadowish[ny, nx] and not vis[ny, nx]:
                vis[ny, nx] = True; q.append((ny, nx))
    alpha = (~vis).astype(np.float32)
    # soft edge: blur the hard mask a touch, then re-clip so the body stays solid
    am = Image.fromarray((alpha * 255).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(feather))
    alpha = np.asarray(am, np.float32) / 255.0
    alpha = np.clip((alpha - 0.18) / 0.64, 0, 1)
    out = np.dstack([a, alpha * 255]).astype(np.uint8)
    img = Image.fromarray(out, "RGBA")
    bbox = img.split()[3].getbbox()
    if bbox:
        img = img.crop(bbox)
    return img, tuple(int(v) for v in bg)


if __name__ == "__main__":
    for p in sorted(glob.glob(os.path.join(GEN, "p_*.jpg"))):
        img, bg = key(p)
        name = os.path.splitext(os.path.basename(p))[0] + ".png"
        img.save(os.path.join(CUT, name))
        cov = (np.asarray(img)[..., 3] > 128).mean()
        print(f"{name:26s} {img.size}  bg={bg}  cover={cov:.2f}")
